<template>
  <PageWrapper>
    <div class="w1366">
      <div style="position: sticky; top: 0; padding: 20px 0; background: #f0f2f5; width: 100%; z-index: 99">
        <a-breadcrumb>
          <a-breadcrumb-item>发版管理</a-breadcrumb-item>
          <a-breadcrumb-item>发版列表</a-breadcrumb-item>
        </a-breadcrumb>
      </div>
      <div class="page-section">
        <a-row :gutter="48">
          <a-col :span="8">
            <FieldItem label="版本名称:" label-width="100px">
              <a-input v-model="query.versionName" allow-clear/>
            </FieldItem>
          </a-col>
          <a-col :span="8">
            <FieldItem label="版本号:" label-width="100px">
              <a-input v-model="query.versionNum" allow-clear/>
            </FieldItem>
          </a-col>
          <a-col :span="8">
            <FieldItem label="发版状态:" label-width="100px">
              <a-select v-model="query.status" style="flex: 1" allow-clear>
                <a-select-option value="0">待发版</a-select-option>
                <a-select-option value="1">已发版</a-select-option>
              </a-select>
            </FieldItem>
          </a-col>
        </a-row>
        <a-row :gutter="48" class="mt20">
          <a-col :span="8">
            <FieldItem label="计划发版日期:" label-width="100px">
              <a-range-picker style="flex: 1" v-model="query.planDate" separator="-"/>
            </FieldItem>
          </a-col>
          <a-col :span="8">
            <FieldItem label="实际发版日期:" label-width="100px">
              <a-range-picker style="flex: 1" v-model="query.factDate" separator="-"/>
            </FieldItem>
          </a-col>
          <a-col :span="8">
            <div class="flex-end">
              <a-button class="mr15" @click="resetQuery">重置</a-button>
              <a-button type="primary" @click="handleQuery">查询</a-button>
            </div>
          </a-col>
        </a-row>
      </div>
      <div class="mt20 page-section">
        <div class="flex-end">
          <a-button type="primary" @click="saveOrUpdateRelease({})">新增发版</a-button>
        </div>

        <div class="mt20">
          <a-table v-bind="table" @change="handleTableChange"></a-table>
        </div>
      </div>
    </div>
  </PageWrapper>
</template>

<script>
import saveOrUpdate from '@/views/Admin/release-version-mgmt/saveOrUpdate'
import FieldItem from '@/views/Admin/components/FieldItem'
import PageWrapper from '@/views/Admin/release-version-mgmt/pageWrapper'
import releaseModal from '@/views/Admin/release-version-mgmt/components/releaseModal'
import {createDialog} from '@/utils/helper'
import moment from 'moment'

const services = createDialog(saveOrUpdate)

export default {
  name: 'release-version-mgmt',
  components: {PageWrapper, FieldItem},
  data() {
    const customHeaderCell = () => {
      return {
        style: {
          color: '#000!important',
          fontWeight: 'bold'
        }
      }
    }
    return {
      users: [],
      query: {
        versionName: '',
        versionNum: '',
        status: '',
        planDate: [],
        factDate: []
      },
      table: {
        loading: false,
        rowKey: 'id',
        pagination: {
          current: 1,
          pageSize: 10,
          total: 0,
          size: 'default',
        },
        dataSource: [],
        columns: [
          {dataIndex: 'versionNum', title: '版本号', customHeaderCell},
          {dataIndex: 'versionName', title: '版本名称', customHeaderCell},
          {
            dataIndex: 'pmNo', title: '发版人', customRender: (text) => {
              return (this.users.find(_ => _.value === text) || {})['key'] || text
            }, customHeaderCell
          },
          {dataIndex: 'planReleaseDate', title: '计划发版日期', customHeaderCell},
          {dataIndex: 'factReleaseDate', title: '实际发版日期', customHeaderCell},
          {
            dataIndex: 'status', customRender: (text) => {
              return <a-tag color={text === 1 ? 'blue' : 'orange'}>{({0: '待发版', 1: '已发版'})[text]}</a-tag>
            }, title: '发版状态', customHeaderCell
          },
          {
            dataIndex: 'actions', title: '操作', width: 250, customHeaderCell, customRender: (_, row) => {
              return <div style="margin-left: -6px">
                {
                  row.status === 0 && [
                    this.userInfo.username === row.pmNo &&
                    <a-popconfirm key="1" title="确定发布吗？" onConfirm={this.releaseRow.bind(this, row)}>
                      <a-button type="link" size="small">发布</a-button>
                    </a-popconfirm>
                    ,
                    <a-button key="2" type="link" size="small" onClick={this.configRow.bind(this, row)}>编辑</a-button>,
                    <a-button key="3" type="link" size="small" onClick={this.editRow.bind(this, row)}>配置</a-button>,
                    <a-button key="4" type="link" size="small" onClick={this.previewRow.bind(this, row)}>预览</a-button>,
                    <a-popconfirm key="99" title="确定删除吗？" onConfirm={this.deleteRow.bind(this, row)}>
                      <a-button type="link" size="small">删除</a-button>
                    </a-popconfirm>
                  ]
                }
                {
                  row.status === 1 && [
                    <a-button key="4" type="link" size="small" onClick={this.previewRow.bind(this, row)}>预览</a-button>,
                    <a-button key="100" type="link" size="small"
                              onClick={this.editRow.bind(this, row)}>详情</a-button>
                  ]
                }
              </div>
            }
          },
        ]
      }
    }
  },
  computed: {
    userInfo() {
      return this.$store.state?.user?.userInfo
    }
  },
  async created() {
    let cachedQuery = window.localStorage.getItem('release-version-mgmt-query')
    if (cachedQuery) {
      cachedQuery = JSON.parse(cachedQuery)
      const {
        status,
        versionName,
        versionNum,
        planReleaseStartDate,
        planReleaseEndDate,
        factReleaseStartDate,
        factReleaseEndDate,
        pageSize,
        page: current
      } = cachedQuery

      this.query.versionNum = versionNum
      this.query.versionName = versionName
      this.query.status = status
      this.table.pagination.current = current
      this.table.pagination.pageSize = pageSize

      this.query.planDate = (planReleaseEndDate && planReleaseStartDate)
          ? [moment(planReleaseStartDate), moment(planReleaseEndDate)] : []

      this.query.factDate = (factReleaseStartDate && factReleaseEndDate)
          ? [moment(factReleaseStartDate), moment(factReleaseEndDate)] : []
    }
    this.users = await this.getUsers()
  },
  mounted() {
    this.getTableData()
  },
  methods: {
    getUsers() {
      return this.$axios.get('/selectAllAdminUser').then(({data}) => {
        return data
      })
    },
    resetQuery() {
      Object.keys(this.query).forEach(key => {
        this.query[key] = ''
      })
      this.query.planDate = []
      this.query.factDate = []
      this.table.pagination.current = 1
      this.getTableData()
    },
    handleQuery() {
      this.table.pagination.current = 1
      this.getTableData()
    },
    handleTableChange(pagination) {
      this.table.pagination = pagination
      this.getTableData()
    },
    getTableData() {
      const {current, pageSize} = this.table.pagination
      const {status, versionName, versionNum} = this.query
      const [planStart, planEnd] = this.query.planDate || []
      const planReleaseStartDate = planStart ? moment(planStart).format('YYYY-MM-DD') : null
      const planReleaseEndDate = planStart ? moment(planEnd).format('YYYY-MM-DD') : null

      const [factStart, factEnd] = this.query.factDate || []
      const factReleaseStartDate = factStart ? moment(factStart).format('YYYY-MM-DD') : null
      const factReleaseEndDate = factEnd ? moment(factEnd).format('YYYY-MM-DD') : null

      const params = {
        status,
        versionName,
        versionNum,
        planReleaseStartDate,
        planReleaseEndDate,
        factReleaseStartDate,
        factReleaseEndDate,
        pageSize,
        page: current
      }

      window.localStorage.setItem('release-version-mgmt-query', JSON.stringify(params))

      this.table.loading = true
      this.$axios.get('/api/admin/version/list', {
        params
      }).then(({data: {list, totalRows}}) => {
        this.table.dataSource = list
        this.table.pagination.total = totalRows
      }).finally(() => {
        this.table.loading = false
      })
    },
    saveOrUpdateRelease(row) {
      services.create({
        destroy: true,
        propsData: {row},
        _parentListeners: {
          'submit-success': () => {
            this.table.pagination.current = 1
            this.getTableData()
          }
        }
      })
    },
    configRow(row) {
      this.saveOrUpdateRelease(row)
    },
    deleteRow(row) {
      this.$axios.get('/api/admin/version/delete', {
        params: {id: row.id}
      }).then(() => {
        this.$message.success('删除成功')
        this.getTableData()
      })
    },
    editRow(row) {
      this.$router.push(`/frame/release-version-mgmt/edit/${row.id}`)
    },
    releaseRow(row) {
      this.$axios.get('/api/admin/version/releaseVersion', {
        params: {id: row.id}
      }).then(() => {
        this.$message.success('发布成功')
        this.getTableData()
      })
    },
    getPageByType(id, type) {
      // 0 首页 1 内容页 2 尾页
      return this.$axios.get('/api/admin/versionDetail/list', {
        params: {page: 1, pageSize: 100, detailType: type, versionId: id}
      }).then(({data: {list}}) => {
        return list
      })
    },
    async previewRow(row) {
      const id = row.id
      const p1 = this.getPageByType(id, 0)
      const p2 = this.getPageByType(id, 1)
      const p3 = this.getPageByType(id, 2)

      this.$store.commit('app/SET_FULL_LOADING', true)

      const [indexPage] = await p1
      const contentPages = await p2
      const [lastPage] = await p3

      this.$store.commit('app/SET_FULL_LOADING', false)

      if (!indexPage) {
        this.$message.error('请先进行配置后再预览')
        return
      }
      if (!contentPages.length) {
        this.$message.error('请至少添加一条内容页后再预览')
        return
      }

      if (lastPage) {
        contentPages.push({
          ...lastPage,
          imgUrl: lastPage.imgUrl.startsWith('/img') ? require('@/assets/images/release-notice/last-bg.png')
              : lastPage.imgUrl,
          itemName: '结束页',
        })
      }

      this.$modal.show(releaseModal, {
        closeBtn: true,
        pushConfig: {
          coverId: indexPage.id,
          coverTitle: indexPage.itemName,
          descText: indexPage.description,
          versionName: row.versionName
        },
        contentPages: contentPages.map(item => {
          return {
            ...item,
            reportName: item.itemName,
            descText: item.description
          }
        })
      }, {clickToClose: false, width: 1200, height: 'auto', classes: ['release-modal']})
    }
  }
}
</script>

<style lang="scss">

</style>

