<template>
  <div style="padding: 10px 20px">
    <h2 style="color: #46BCA0; font-weight: bold">大屏菜单管理</h2>
    <div class="flex flex-end mb10">
<!--      <div class="flex">-->
<!--        <a-input placeholder="搜索"/>-->
<!--        <a-button class="ml10">搜索</a-button>-->
<!--      </div>-->
      <a-space>
        <a-button @click="getData">刷新</a-button>
        <a-button @click="addNew" type="primary">创建</a-button>
      </a-space>
    </div>
    <div>
      <a-table :columns="table.columns" :loading="table.loading" :data-source="table.data" :expand-icon="table.expandIcon"
               childrenColumnName="subMenu" row-key="id"></a-table>
    </div>
  </div>
</template>

<script>
import {createDialog} from '@/utils/helper';
import AddOrUpdate from '@/views/Admin/big-screen-manage/screen-menu-manage/AddOrUpdate';
const AddOrUpdateService = createDialog(AddOrUpdate)

export default {
  name: "ScreenMenuManage",
  data() {
    return {
      table: {
        data: [],
        loading: false,
        expandIcon: (props) => {
          if (props.record.subMenu.length > 0) {
            if (props.expanded) {
              return <a style={{color: '#666', marginRight: '4px'}} onClick={e => {
                props.onExpand(props.record, e);
              }}>
                <a-icon type="minus-square" style={{fontSize: '18px'}}/>
              </a>
            } else {
              return <a style={{color: '#666', marginRight: '4px'}} onClick={e => {
                props.onExpand(props.record, e);
              }}>
                <a-icon type="plus-square" style={{fontSize: '18px'}}/>
              </a>
            }
          } else {
            return <span style={{marginRight: '20px'}}/>
          }
        },
        columns: [
          {title: '名称', dataIndex: 'cnName', width: 250},
          {
            title: '状态', dataIndex: 'status', customRender: (val, row) => {
              return <a-switch default-checked={val === 0} onChange={this.changeStatus.bind(this, row)}/>
            }, width: 100, align: 'center'
          },
          {title: '顺序', dataIndex: 'seq', width: 100, align: 'center'},
          {title: '机密程度', dataIndex: 'secrecyLevel', width: 100, align: 'center'},
          {title: '数据内容', dataIndex: 'dataInfo', ellipsis: true, align: 'center'},
          {title: '业务描述', dataIndex: 'businessDescription', ellipsis: true, align: 'center'},
          {
            title: '操作', dataIndex: 'action', customRender: (val, row) => {
              const {status} = row
                return <div class="flex">
                  {status === 0 ? <a-button onClick={this.releaseRow.bind(this, row)} size="small" type="link">发布</a-button> : null}
                  <a-button onClick={this.updateRow.bind(this, row)} size="small" type="link">编辑</a-button>
                  <a-button onClick={this.deleteRow.bind(this, row)} size="small" type="link" style="color: red">删除</a-button>
                </div>
            }, width: 200, align: 'center'
          }
        ]
      }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      this.table.loading = true
      this.$axios.get('/api/menuForScreen/list').then(({data}) => {
        this.table.data = data
      }).finally(() => {
        this.table.loading = false
      })
    },
    changeStatus({id, status}) {
      let url
      if (status === 0) {
        url = '/api/menuForScreen/stop'
      } else if (status === -1) {
        url = '/api/menuForScreen/start'
      }

      if (url) {
        this.$axios.get(url, {
          params: {id}
        }).then(() => {
          this.getData()
        })
      }
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
    updateRow({id}) {
      AddOrUpdateService.create.call(this, {
        destroy: true,
        propsData: {
          id
        },
        _parentListeners: {
          'submit-success': () => {
            this.getData()
          }
        }
      })
    },
    deleteRow({id}) {
      this.$confirm({
        title: '提示',
        content: '确认删除吗？',
        onOk: () => {
          this.$axios.get('/api/menuForScreen/delete', {
            params: {id}
          }).then(() => {
            this.getData()
          })
        }
      })
    },
    releaseRow({id}) {
      this.$confirm({
        title: '提示',
        content: '确认发布吗？',
        onOk: () => {
          this.$axios.get('/api/menuForScreen/releaseMenu', {
            params: {id}
          }).then(() => {
            this.$message.success('发布成功')
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
