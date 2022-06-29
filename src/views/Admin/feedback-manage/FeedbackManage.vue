<template>

  <div style="padding: 10px 20px">
    <h2 style="color: #46BCA0; font-weight: bold">意见反馈管理</h2>
    <div class="flex flex-between mb10">
      <div class="flex">
        <a-input @keyup.enter.native="search" v-model="query.keyword" placeholder="输入关键字搜索"/>
        <a-button class="ml10" @click="search">搜索</a-button>
      </div>
      <a-space>
        <a-button @click="search">刷新</a-button>
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
import moment from 'moment'

export default {
  name: 'FeedbackManage',
  data () {
    return {
      query: {
        keyword: ''
      },
      table: {
        data: [],
        pagination: {
          current: 1,
          total: 0,
          pageSize: 10
        },
        columns: [
          { title: '报表名称', dataIndex: 'menuCnName' },
          { title: '简要描述', dataIndex: 'description', ellipsis: true },
          {
            title: '附件', dataIndex: 'files', customRender: (val) => {
              if (val[0]) {
                let path = val[0].path
                path = path.startsWith('http') ? path : this.$axios.defaults.baseURL + '/download' + path
                return (
                    <a href={path} target="_blank">
                      <img src={path} width="40" height="40" style="object-fit: cover" alt=""/>
                    </a>
                )
              } else {
                return '-'
              }
            }
          },
          {
            title: '提交时间', dataIndex: 'createDate', customRender: (val) => {
              return moment(val).format('YYYY-MM-DD HH:mm:ss')
            }
          },
          {
            title: '提交人', dataIndex: 'issuer', customRender: (val, row) => {
              const { alias, username } = row
              return <span>{alias}/{username}</span>
            }
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
      const { current, pageSize } = this.table.pagination
      this.$axios.get('/api/proposal/list', {
        params: {
          keyword: this.query.keyword,
          page: current,
          pageSize
        }
      }).then(({ data: { list, totalRows } }) => {
        console.log(list, totalRows)
        this.table.data = list
        this.table.pagination.total = totalRows
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
  },

}
</script>

<style scoped>

</style>
