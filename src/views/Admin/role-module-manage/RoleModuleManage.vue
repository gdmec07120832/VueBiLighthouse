<template>
  <div style="padding: 10px 20px">
    <div class="flex flex-between mb10">
      <div class="flex">
        <a-input v-model="query.keyword" @keyup.enter.native="search" placeholder="请输入关键字搜索"/>
        <a-button class="ml10" @click="search">搜索</a-button>
      </div>

      <a-space>
        <a-button @click="refresh">刷新</a-button>
      </a-space>
    </div>
    <div>
      <a-table size="middle" :bordered="false"
               :data-source="table.data" :columns="table.columns" :pagination="table.pagination"
               :loading="table.loading" @change="onTableChange" row-key="roleName"
               :scroll="{y: 'calc(100vh - 220px)'}"></a-table>
    </div>
  </div>
</template>

<script>
import {createDialog} from '@/utils/helper';
import EditRow from '@/views/Admin/role-module-manage/EditRow';

const EditRowService = createDialog(EditRow)


export default {
  name: "RoleModuleManage",
  data() {
    return {
      query: {
        keyword: ''
      },
      table: {
        data: [],
        loading: false,
        pagination: {
          size: 'default',
          current: 1,
          pageSize: 10,
          total: 0,
          showTotal: (total) => `共${total}条记录`,
        },
        columns: [
          {title: '角色名称', dataIndex: 'roleName', align: 'center'},
          {
            title: '所属模块', dataIndex: 'modeName', align: 'center', customRender: (val) => {
              return <span>{val ? val : '-'}</span>
            }
          },
          {
            title: '操作', dataIndex: 'action', align: 'center', customRender: (val ,row) => {
              return <a-button onClick={this.editRow.bind(this, row)} type="link" size="small">编辑</a-button>
            }
          },
        ],

      }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      const {pageSize, current: page} = this.table.pagination
      this.table.loading = true
      this.$axios.get('/api/roleAndMode/getAllRoleAndMode', {
        params: {
          keyword: this.query.keyword,
          page,
          pageSize
        }
      }).then(({data: {list, totalRows}}) => {
        this.table.data = list
        this.table.pagination.total = totalRows
      }).finally(() => {
        this.table.loading = false
      })
    },
    search() {
      this.table.pagination.current = 1
      this.getData()
    },
    refresh() {
      this.search()
    },
    onTableChange(pagination) {
      Object.assign(this.table.pagination, pagination)
      this.getData()
    },
    editRow(row) {
      EditRowService.create.call(this, {
        destroy: true,
        propsData: {
          rowData: row
        },
        _parentListeners: {
          'submit-success': () => {
            this.getData()
          }
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
