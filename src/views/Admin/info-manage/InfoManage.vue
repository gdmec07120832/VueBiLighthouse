<template>
  <div style="padding: 10px 20px">
    <h2 style="color: #46BCA0; font-weight: bold">消息管理</h2>
    <div class="flex flex-between mb10">
      <div class="flex">
        <a-input @keyup.enter.native="search" v-model="query.keyword" placeholder="输入关键字搜索"/>
        <a-button class="ml10" @click="search">搜索</a-button>
      </div>
      <a-space>
        <a-button @click="search">刷新</a-button>
        <a-button @click="addNew" type="primary">新增</a-button>
      </a-space>
    </div>
    <div>
      <a-table :data-source="table.data" :columns="table.columns" :pagination="table.pagination"
               @change="onTableChange"
               :loading="table.loading"
               row-key="id"
               :scroll="{y: 'calc(100vh - 260px)'}"></a-table>
    </div>
  </div>
</template>

<script>
import { createDialog } from '@/utils/helper'
import AddNew from '@/views/Admin/info-manage/AddNew'
import PreviewMsg from '@/views/Admin/info-manage/PreviewMsg'

const AddNewService = createDialog(AddNew)
const PreviewMsgService = createDialog(PreviewMsg)

export default {
  name: 'InfoManage',
  data () {
    return {
      query: {
        keyword: ''
      },
      table: {
        data: [],
        loading: false,
        pagination: {
          current: 1,
          pageSize: 10,
          total: 0,
          showTotal: (total) => `共${total}条记录`,
        },
        columns: [
          {
            title: '消息类型', dataIndex: 'noticeType', customRender: (val) => {
              return <span>{{ 1: '首页通知', 2: '实时消息' }[val]}</span>
            }, width: 120
          },
          {
            title: '开始日期', dataIndex: 'startDate', customRender: (val) => {
              return <span>{val ? val : '-'}</span>
            }, width: 120
          },
          {
            title: '结束日期', dataIndex: 'endDate', customRender: (val) => {
              return <span>{val ? val : '-'}</span>
            }, width: 120
          },
          { title: '标题', dataIndex: 'title', ellipsis: true, width: 200 },
          {
            title: '状态', dataIndex: 'status', customRender: (val, row) => {
              const { startDate, endDate } = row
              return <span>{(!startDate && !endDate) ? '-' : val === 0 ? '禁用' : '启用'}</span>
            }, width: 100
          },
          { title: '内容', dataIndex: 'content', ellipsis: true },
          {
            title: '操作', dataIndex: 'action', customRender: (val, row) => {
              const { status, noticeType } = row
              return <div>
                {<a-button size="small" type="link" onClick={this.previewRow.bind(this, row)}>预览</a-button>}
                {noticeType === 2 ? <a-button size="small" type="link"
                                              onClick={this.sendRow.bind(this, row)}>发送</a-button> : null}
                {noticeType === 1 && status === 1 ? <a-button size="small" type="link"
                                                              onClick={this.toggleStatus.bind(this, 0, row)}>禁用</a-button> : null}
                {noticeType === 1 && status === 0 ? <a-button size="small" type="link"
                                                              onClick={this.toggleStatus.bind(this, 1, row)}>启用</a-button> : null}
                <a-button onClick={this.updateRow.bind(this, row)} size="small" type="link">修改</a-button>
                <a-button onClick={this.deleteRow.bind(this, row)} size="small" type="link" style="color: red">删除
                </a-button>
              </div>
            }, width: 250
          }
        ]
      }
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      const { pageSize, current: page } = this.table.pagination
      this.table.loading = true
      this.$axios.get('/api/notice/list', {
        params: {
          keyword: this.query.keyword,
          page,
          pageSize
        }
      }).then(({ data: { list, totalRows } }) => {
        this.table.data = list
        this.table.pagination.total = totalRows
      }).finally(() => {
        this.table.loading = false
      })
    },
    search () {
      this.table.pagination.current = 1
      this.getData()
    },
    onTableChange (pagination) {
      Object.assign(this.table.pagination, pagination)
      this.getData()
    },
    addNew () {
      AddNewService.create.call(this, {
        destroy: true,
        _parentListeners: {
          'submit-success': () => {
            this.search()
          }
        }
      })
    },
    updateRow (row) {
      AddNewService.create.call(this, {
        destroy: true,
        propsData: {
          id: row.id,
          rowData: row
        },
        _parentListeners: {
          'submit-success': () => {
            this.search()
          }
        }
      })
    },
    deleteRow ({ id }) {
      this.$confirm({
        title: '提示',
        content: '确定删除吗？',
        onOk: () => {
          this.$axios.get('/api/notice/delete', {
            params: { id }
          }).then(() => {
            this.$message.success('删除成功')
            this.search()
          })
        }
      })
    },
    toggleStatus (status, { id }) {
      this.$axios.get('/api/notice/updateStatus', {
        params: {
          id,
          status
        }
      }).then(() => {
        this.$message.success('操作成功')
        this.search()
      })
    },
    previewRow (row) {
      const {noticeType} = row
      const _this = this
      const preview = () => {
        PreviewMsgService.create.call(_this, {
          propsData: {
            rowData: row
          }
        })
      }
      if(noticeType === 1) {
        // 首页通知
        this.$notification.open({
          duration: 6,
          class: 'custom-info-notification',
          message: row.title,
          // eslint-disable-next-line no-unused-vars
          description: function (h) {
            return <div style={{cursor: 'pointer', lineHeight: '22px'}} onClick={preview}>
              {row.content}
            </div>
          },
          placement: 'bottomRight'
        })
      } else {
        // 实时通知
        preview()
      }
    },
    sendRow ({ id }) {
      this.$confirm({
        title: '提示',
        content: '确定发送吗？',
        onOk: () => {
          this.$axios.get('/api/notice/sendRealTimeMessage', {
            params: { id }
          }).then(() => {
            this.$message.success('发送成功')
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">

</style>
