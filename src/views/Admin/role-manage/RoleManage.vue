<template>
  <div style="padding: 10px 20px; user-select: text">
    <div class="flex flex-between pb10">
      <div class="flex flex-between mr20" style="flex: 1">
        <div>
          <a-input-group compact style="width: 320px">
            <a-select default-value="ALL" v-model="query.searchRange">
              <a-select-option value="ALL">全部</a-select-option>
              <a-select-option value="REPORT">报表</a-select-option>
              <a-select-option value="USER" :disabled="!showCol['USER']">用户</a-select-option>
              <a-select-option value="ROLE" :disabled="!showCol['ROLE']">角色</a-select-option>
            </a-select>
            <a-input
              v-model="query.keyword"
              @keydown.native.enter="search"
              style="width: 80%"
              placeholder="输入关键字搜索"
            />
          </a-input-group>
        </div>
        <div>
          <span>展示列：</span>
          <a-checkbox :checked="showCol.USER" @change="checkBoxChange('USER')" :disabled="calcDisable('USER')"
            >用户
          </a-checkbox>
          <a-checkbox :checked="showCol.ROLE" @change="checkBoxChange('ROLE')" :disabled="calcDisable('ROLE')"
            >角色
          </a-checkbox>
        </div>
      </div>
      <a-space>
        <a-button @click="exportExcel" :loading="exportLoading">导出Excel</a-button>
        <a-button @click="resetPassword">重置密码</a-button>
        <a-button @click="updatePermission">权限同步</a-button>
        <a-button @click="clearRedisCacheAuth()">清空权限缓存</a-button>
        <a-button @click="refresh">刷新</a-button>
      </a-space>
    </div>
    <div>
      <a-table
        size="middle"
        :key="JSON.stringify(showCol)"
        :data-source="table.data"
        :columns="tableColumns"
        :pagination="table.pagination"
        :loading="table.loading"
        :rowKey="(record) => record.user + record.roles"
        :scroll="{ y: 'calc(100vh - 220px)' }"
        @change="handleTableChange"
      ></a-table>
      <a-modal v-model="showResetPass" title="重置密码" @ok="resetPassOkClick" :confirm-loading="confirmLoading">
        <a-form-model :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-form-model-item label="外部账号">
            <a-input v-model="resetPass.userName" />
          </a-form-model-item>
          <a-form-model-item label="确认账号">
            <a-input v-model="resetPass.ensureUserName" />
          </a-form-model-item>
        </a-form-model>
      </a-modal>
    </div>
  </div>
</template>

<script>
import { createDialog, downloadBlob } from '@/utils/helper'
import CheckPermission from '@/views/Admin/role-manage/CheckPermission'

const CheckPermissionService = createDialog(CheckPermission)

// eslint-disable-next-line no-unused-vars
const listInterface = {
  roles: '',
  user: '',
  alias: '',
}
export default {
  name: 'RoleManage',
  data() {
    return {
      exportLoading: false,
      showResetPass: false,
      confirmLoading: false,
      resetPass: {
        userName: '',
        ensureUserName: '',
      },
      showCol: {
        ROLE: true,
        USER: true,
      },
      query: {
        keyword: '',
        colList: '',
        searchRange: 'ALL',
      },
      table: {
        loading: false,
        data: [],
        pagination: {
          size: 'default',
          pageSize: 10,
          current: 1,
          total: 0,
          showTotal: (total) => `共${total}条记录`,
        },
        columns: [
          { title: '工号', dataIndex: 'user', width: 120, align: 'center' },
          { title: '艺名', dataIndex: 'alias', width: 120, align: 'center' },
          { title: '角色', dataIndex: 'roles', ellipsis: true, width: 300, align: 'center' },
          {
            title: '操作',
            dataIndex: 'action',
            customRender: (val, row) => {
              const { showCol } = this
              return (
                <a-space>
                  <a-button type="link" size="small" onClick={this.checkRow.bind(this, row)}>
                    查看权限
                  </a-button>
                  {showCol.USER && (
                    <a-button type="link" size="small" onClick={this.clearRedisCacheAuth.bind(this, row)}>
                      清除权限缓存
                    </a-button>
                  )}
                </a-space>
              )
            },
            width: 120,
            align: 'center',
          },
        ],
      },
    }
  },
  computed: {
    tableColumns() {
      if (!this.showCol['USER']) {
        return this.table.columns.filter((_) => {
          return ['user', 'alias'].indexOf(_.dataIndex) === -1
        })
      } else if (!this.showCol['ROLE']) {
        return this.table.columns.filter((_) => {
          return ['roles'].indexOf(_.dataIndex) === -1
        })
      } else {
        return this.table.columns
      }
    },
  },
  created() {
    this.getList()
  },
  methods: {
    clearRedisCacheAuth(row) {
      let data
      if (row) {
        data = [row.user]
      } else {
        data = []
      }
      this.$axios.post('/api/permission/cleanPermissionInfoInRedis', data).then(() => {
        this.$message.success('清除成功')
      })
    },
    calcDisable(i) {
      if ((i === 'USER' && !this.showCol['ROLE']) || (i === 'ROLE' && !this.showCol['USER'])) {
        return true
      }
    },
    checkBoxChange(i) {
      this.showCol[i] = !this.showCol[i]
      if (!this.showCol[i] && this.query.searchRange === i) {
        this.query.searchRange = 'ALL'
      }
      this.search()
    },
    getList() {
      const { pageSize, current: page } = this.table.pagination
      this.query.colList = Object.keys(this.showCol)
        .filter((key) => this.showCol[key])
        .toString()
        .toLowerCase()
      this.table.loading = true
      this.$axios
        .get('/api/permission/list', {
          params: {
            ...this.query,
            page,
            pageSize,
          },
        })
        .then(({ data: { list, totalRows } }) => {
          this.table.data = list
          this.table.pagination.total = totalRows
        })
        .finally(() => {
          this.table.loading = false
        })
    },
    search() {
      this.table.pagination.current = 1
      this.getList()
    },
    refresh() {
      this.search()
    },
    exportExcel() {
      this.exportLoading = true
      this.$axios
        .post('/api/permission/downloadUserAndRolePermissionList', null, {
          responseType: 'blob',
        })
        .then(({ data, headers }) => {
          const filename = headers['content-disposition'].match(/filename=(.*)/)[1]
          downloadBlob(data, decodeURIComponent(filename))
        })
        .finally(() => {
          this.exportLoading = false
        })
    },
    updatePermission() {
      this.$axios
        .get('/api/permission/updateAuth')
        .then(() => {
          this.$success({
            title: '提示',
            content: '更新成功，已添加至执行队列，请耐心等候',
          })
        })
        .catch(() => {
          this.$message.error('同步失败')
        })
    },
    resetPassword() {
      this.showResetPass = true
    },
    resetPassOkClick() {
      if (!this.resetPass.userName) {
        this.$message.error('请填写账号')
        return Promise.reject()
      }
      if (this.resetPass.userName !== this.resetPass.ensureUserName) {
        this.$message.error('输入的账号不一致')
        return Promise.reject()
      }
      this.confirmLoading = true
      return this.$axios
        .post('/api/resetExtUserPass', {
          ...this.resetPass,
        })
        .then(() => {
          this.$message.success('重置成功')
        })
        .catch(() => {
          return Promise.reject()
        })
        .finally(() => {
          this.confirmLoading = false
        })
    },
    handleTableChange(pagination) {
      Object.assign(this.table.pagination, pagination)
      this.getList()
    },
    checkRow({ user, roles }) {
      CheckPermissionService.create.call(this, {
        destroy: true,
        propsData: {
          type: this.showCol.USER ? 'user' : 'roles',
          id: this.showCol.USER ? user : roles,
        },
      })
    },
  },
}
</script>

<style scoped></style>
