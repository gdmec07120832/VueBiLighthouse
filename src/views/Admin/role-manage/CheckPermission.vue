<template>
  <a-modal v-model="visible" title="查看权限" :footer="null">
    <div class="flex" style="align-items: flex-start">
      <div style="height: 350px; width: 65%; overflow: auto; margin-right: 10px">
        <a-tree :tree-data="treeData" :replace-fields="replaceFields"
                disabled
                checkable
                class="permissionTree"
                :auto-expand-parent="autoExpandParent"
                :expanded-keys="expandedKeys"
                :checked-keys="selectedKeys" @expand="onExpand">
          <template slot="title" slot-scope="{title}">
             <span v-if="title.indexOf(searchValue) > -1">
               {{ title.substr(0, title.indexOf(searchValue)) }}
               <span style="color: #f50">{{ searchValue }}</span>
               {{ title.substr(title.indexOf(searchValue) + searchValue.length) }}
             </span>
            <span v-else>{{title}}</span>
          </template>
        </a-tree>
      </div>
      <div>
        <a-input v-model="searchValue" placeholder="搜索" @keyup.native.enter="handleSearchChange"/>
        <div class="flex flex-center my10" @click="expandAll"><a-button>展开全部</a-button></div>
        <div class="flex flex-center" @click="collapseAll"><a-button>收起全部</a-button></div>
      </div>
    </div>
  </a-modal>
</template>

<script>
export default {
  name: "CheckPermission",
  props: {
    type: {
      type: String,
      default: ''
    },
    id: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      autoExpandParent: true,
      searchValue: '',
      treeData: [],
      dataList: [],
      selectedKeys: [],
      expandedKeys: [],
      replaceFields: {
        title: 'cnName',
        key: 'id',
        children: 'subMenu'
      },
      visible: false
    }
  },
  created() {
    this.getTree()
    this.getPermissionList()
  },
  methods: {
    expandAll() {
      this.expandedKeys = this.dataList.map(_ => _.id)
    },
    collapseAll() {
      this.expandedKeys = []
    },
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    getTree() {
      this.$axios.get('/api/menu/selectLevelOneMenuWithSubMenus').then(({data}) => {
        const list = []
        const traverse = (tree) => {
          for(let node of tree) {
            list.push(node)
            node.title = node.cnName
            node['scopedSlots'] = {title: 'title'}
            if(node.subMenu && node.subMenu.length) {
              traverse(node.subMenu)
            }
          }
          return tree
        }
        this.dataList = list
        this.treeData = traverse(data)
      })
    },
    getPermissionList() {
      this.$axios.get('/api/menu/selectPermissionMenuIdByColTypeAndId', {
        params: {
          colType: this.type,
          id: this.id
        }
      }).then(({data}) => {
        console.log(data)
        this.selectedKeys = data
      })
    },
    handleSearchChange() {
      const value = this.searchValue;
      if(!value) {
        this.expandedKeys = []
        this.autoExpandParent = false
      }
      this.expandedKeys = this.dataList.map(_ => {
        if(_.cnName.indexOf(value) > -1) {
          return _.parentId
        } else {
          return null
        }
      }).filter((item, i, self) => item && self.indexOf(item) === i)
      this.autoExpandParent = true
    }
  }
}
</script>

<style lang="scss" scoped>
.permissionTree {
  /deep/ .ant-tree-checkbox-checked + .ant-tree-node-content-wrapper .ant-tree-title span {
      color: #46BCA0;
    }
}
</style>
