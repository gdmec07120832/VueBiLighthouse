<template>
  <a-modal
    :title="title"
    v-model="visible"
    width="690px"
    :mask-closable="false"
    @ok="onOk"
    :confirm-loading="confirmLoading"
  >
    <a-spin :spinning="loading">
      <a-form-model ref="form" class="screen-role-manage-modal">
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-model-item label="角色名称">
              <a-input :value="form.roleName" @blur.native="handleRoleNameChange" placeholder="请输入角色名称" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="所属模块">
              <a-select v-model="form.modeName" placeholder="请选择" allow-clear>
                <a-select-option v-for="item in allModules" :value="item" :key="item">{{ item }}</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="选择人员">
              <a-transfer
                :list-style="{
                  width: '300px',
                  height: '250px'
                }"
                :target-keys="form.users"
                :data-source="allUsers.map(_ => ({ key: String(_.userName), title: _.alias || '' }))"
                show-search
                :show-select-all="false"
                :locale="{
                  itemUnit: '项',
                  itemsUnit: '项',
                  notFoundContent: '列表为空',
                  searchPlaceholder: '请输入搜索内容'
                }"
                :titles="['人员', '已选人员']"
                :render="item => item.title"
                @change="handleUsersSelectChange"
              >
                <template v-slot:children="{ props: { filteredItems, selectedKeys }, on: { itemSelect } }">
                  <a-checkbox-group :value="selectedKeys" style="width: 100%">
                    <VxeList :height="160" :data="filteredItems">
                      <template v-slot="{ items }">
                        <div class="my-list-item" v-for="item in items" :key="item.key">
                          <a-checkbox class="block" :value="item.key" @change="handleChange($event, itemSelect)">{{
                            item.title
                          }}</a-checkbox>
                        </div>
                      </template>
                    </VxeList>
                  </a-checkbox-group>
                </template>
              </a-transfer>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="菜单权限">
              <a-tree
                v-model="form.menu4BSIds"
                :tree-data="allMenuTree"
                checkable
                :replace-fields="replaceFields"
                style="height: 180px; overflow: auto"
              >
              </a-tree>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import { List } from 'vxe-table'
export default {
  name: 'AddOrUpdate',
  components: { VxeList: List },
  props: {
    id: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      selected: [],
      visible: false,
      leafNodeKey: [],
      loading: false,
      replaceFields: {
        children: 'subMenu',
        title: 'cnName',
        key: 'id'
      },
      allMenuTree: [],
      allUsers: [],
      allModules: [],
      confirmLoading: false,
      form: {
        menu4BSIds: [],
        users: [],
        roleName: '',
        modeName: undefined
      }
    }
  },
  computed: {
    title() {
      return this.id ? '编辑' : '创建'
    }
  },
  created() {
    this.getAllMenus()
    this.getAllUsers()
    this.getAllModules()
    if (this.id) {
      this.getDetailById(this.id)
    }
  },
  methods: {
    handleChange(e, itemSelect) {
      itemSelect(e.target.value, e.target.checked)
    },
    getDetailById(id) {
      this.loading = true
      this.$axios
        .get('/api/roleForBigScreen/selectById', {
          params: { id }
        })
        .then(({ data }) => {
          Object.assign(this.form, data)
        })
        .finally(() => {
          this.loading = false
        })
    },
    getAllUsers() {
      this.loading = true
      this.$axios
        .get('/api/permission/selectAllYHUsersOptions')
        .then(({ data }) => {
          this.allUsers = data
        })
        .finally(() => {
          this.loading = false
        })
    },
    getAllMenus() {
      this.$axios.get('/api/menuForScreen/selectLevelOneMenuWithSubMenus').then(({ data }) => {
        console.log(data)
        const leafNodeKey = []
        const walk = arr => {
          for (let item of arr) {
            if (item.subMenu && item.subMenu.length) {
              walk(item.subMenu)
            } else {
              leafNodeKey.push(item.id)
            }
          }
          return leafNodeKey
        }

        this.leafNodeKey = walk(data)
        this.allMenuTree = data
      })
    },
    getAllModules() {
      this.$axios.get('/api/roleAndMode/getAllModeNameOptions').then(({ data }) => {
        this.allModules = data
      })
    },
    handleRoleNameChange(e) {
      this.form.roleName = e.target.value
    },
    handleUsersSelectChange(targetKeys) {
      this.form.users = targetKeys
    },
    onOk() {
      this.confirmLoading = true
      this.$axios
        .post('/api/roleForBigScreen/insertOrUpdate', {
          ...this.form,
          menu4BSIds: this.form.menu4BSIds.filter(key => this.leafNodeKey.indexOf(key) > -1)
        })
        .then(() => {
          this.$message.success('操作成功')
          this.visible = false
          this.$emit('submit-success')
        })
        .finally(() => {
          this.confirmLoading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.my-list-item {
  min-height: 32px;
  line-height: 32px;
  padding: 0 12px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  transition: all 0.3s;
  &:hover {
    background-color: #edfcf6;
    cursor: pointer;
  }
}

.screen-role-manage-modal {
  /deep/ .ant-form-item {
    margin-bottom: 4px;
  }
}
</style>
