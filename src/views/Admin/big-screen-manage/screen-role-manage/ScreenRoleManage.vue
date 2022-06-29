<template>
  <div style="padding: 10px 20px">
    <h2 style="color: #46BCA0; font-weight: bold">大屏角色管理</h2>
    <div class="flex flex-between mb10">
      <div class="flex">
        <a-input v-model="query.keyword" @keyup.enter.native="search" placeholder="搜索"/>
        <a-button class="ml10" @click="search">搜索</a-button>
      </div>
      <a-space>
        <a-button @click="getData">刷新</a-button>
        <a-button @click="addNew" type="primary">创建</a-button>
      </a-space>
    </div>
    <div>
      <a-table :data-source="table.data" :columns="table.columns" :pagination="table.pagination"
               :loading="table.loading" row-key="id" @change="onTableChange" :scroll="{y: `calc(100vh - 250px)`}"></a-table>
    </div>
  </div>
</template>

<script>
import {createDialog} from '@/utils/helper';
import AddOrUpdate from '@/views/Admin/big-screen-manage/screen-role-manage/AddOrUpdate';

const AddOrUpdateService = createDialog(AddOrUpdate)

export default {
  name: "ScreenRoleManage",
  data() {
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
          showTotal: (total) => `共${total}条记录`
        },
        columns: [
          {title: 'ID', dataIndex: 'id'},
          {title: '角色名', dataIndex: 'roleName'},
          {title: '所属模块', dataIndex: 'modeName'},
          {
            title: '操作', dataIndex: 'action', customRender: (val ,row) => {
              return <div class="flex">
                <a-button onClick={this.updateRow.bind(this, row)} type="link" size="small">编辑</a-button>
                <a-button onClick={this.deleteRow.bind(this, row)} type="link" size="small" style="color: red">删除</a-button>
              </div>
            }, width: 150
          },
        ]
      }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      const {keyword} = this.query
      const {pageSize, current: page} = this.table.pagination
      this.table.loading = true
      this.$axios.get('/api/roleForBigScreen/list', {
        params: {
          keyword,
          pageSize,
          page
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
    addNew() {
      AddOrUpdateService.create.call(this, {
        destroy: true,
        _parentListeners: {
          'submit-success': () => {
            this.getData()
          }
        }
      })
    },
    onTableChange(pagination) {
      Object.assign(this.table.pagination, pagination)
      this.getData()
    },
    deleteRow({id}) {
      this.$confirm({
        title: '提示',
        content: '确定删除吗？',
        onOk: () => {
          this.$axios.get('/api/roleForBigScreen/delete', {
            params: {id}
          }).then(() => {
            this.getData()
          })
        }
      })
    },
    updateRow({id}) {
      AddOrUpdateService.create.call(this, {
        destroy:true,
        propsData: {
          id
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
