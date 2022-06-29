<template>
  <div style="height: 100%" @contextmenu="handleWrapperRightClick">
    <a-spin :spinning="fetching" class="hide-scrollbar" @scroll="handleScroll" style="height: 100%; overflow: auto">
      <div v-if="showTips" class="notice-bar">
        右键可实现自定义文件夹收藏整理，欢迎使用。
        <a-icon type="close-circle" @click="handleCloseTips"/>
      </div>
      <div style="min-height: 300px;" :loading="fetching">
        <TreeNodes ref="treeNodes"
                   :nodes="curMenu" :unCollect="unCollect"
                   :nodeClick="menuItemClick"
                   :nodeRightClick="handleItemRightClick" :onDrop="onDrop"/>
        <div style="margin-top: 50px; color: rgba(0,0,0,.3)" v-if="!curMenu.length && !fetching">
          <a-empty />
        </div>
      </div>
    </a-spin>

    <Tooltip ref="tooltip"
             :visible="tooltipVisible" :x="tooltipX" :y="tooltipY" :isTop="isTop"
             :unCollect="unCollect"
             :toggleTree="toggleTree"
             :expandAllByKey="expandAllByKey"
             :collapseAllByKey="collapseAllByKey"/>

    <AModal :visible="modalVisible" :title="modalUpdate ? '更新名称' : modalMenuParent ? '新增子文件夹' : '新增文件夹'"
            @ok="handleModalSubmit"
            @cancel="modalVisible = false; modalMenuName = '';" destroyOnClose>
      <p>{{ modalUpdate ? '新名称' : modalMenuParent ? `父级：${modalMenuParent['cnName']}` : '文件夹名称' }}</p>
      <AInput placeholder="输入名称" :maxLength="30" v-model="modalMenuName" @keyup.enter="handleModalSubmit"/>
    </AModal>
  </div>
</template>

<script>
import FavoriteIcon from '@/assets/svg/favorite.svg'
import Vue from 'vue'

Vue.component('favorite-icon', FavoriteIcon)

import { mapState } from 'vuex'
import axios from '@/utils/axios'
import uniq from 'lodash/uniq'
import debounce from 'lodash/debounce'

const TreeNodes = {
  props: ['nodes', 'unCollect', 'nodeRightClick', 'onDrop', 'nodeClick'],
  data () {
    return {
      expandedKeys: [],
      selectedKeys: []
    }
  },
  methods: {
    replaceExpandedKeys (keys) {
      this.expandedKeys = keys
    },
    toggleKey (key) {
      if (this.expandedKeys.indexOf(key) === -1) {
        this.setExpandedKeys([key])
      } else {
        this.removeExpandKeys([key])
      }
    },
    setExpandedKeys (keys) {
      this.expandedKeys = uniq(this.expandedKeys.concat(keys))
    },
    removeExpandKeys (keys) {
      this.expandedKeys = this.expandedKeys.filter(item => !keys.includes(item))
    },
    onExpand (expandedKeys) {
      this.expandedKeys = expandedKeys
    },
    onSelect (selectedKeys) {
      if(selectedKeys?.length) {
        this.selectedKeys = selectedKeys
      }
    }
  },
  // eslint-disable-next-line no-unused-vars
  render (createElement) {
    const { nodes, unCollect, nodeRightClick, onDrop, nodeClick } = this.$props
    const Child = function ({ id, cnName, nodeName, subMenu, ...rest }, depth = 1) {
      return (
          <a-tree-node key={id} value={{ ...rest, id, cnName }}>
            <div slot="title" class="node-title"
                 title={nodeName || cnName}
                 onContextmenu={(e) => {
                   nodeRightClick(e, { ...rest, id, cnName, nodeName }, depth)
                 }}
                 onClick={() => nodeClick({ ...rest, id, cnName, nodeName })}>
              <div title={nodeName || cnName}>
                <i class={`collect-item-icon ${rest.url ? 'page' : 'folder'}`}/>
                {nodeName || cnName}
              </div>
              {
                rest.url ?
                    <favorite-icon onClick={(e) => {
                      e.stopPropagation()
                      unCollect({ id, ...rest })
                    }}
                                   class="favorite-icon" style="color: #f9ab07"/> : null
              }
            </div>
            {
              (subMenu && subMenu.length) && subMenu.map((node) => {
                return Child(node, depth + 1)
              })
            }
          </a-tree-node>
      )
    }
    return (
        <a-tree block-node draggable selectable
                selectedKeys={this.selectedKeys}
                expandedKeys={this.expandedKeys}
                onExpand={this.onExpand}
                onDrop={onDrop}
                onselect={this.onSelect}
                class="collect-menu-tree">
          {
            nodes.map(node => {
              return Child(node)
            })
          }
        </a-tree>
    )
  }
}

const Tooltip = {
  functional: true,
  render (createElement, { props, parent }) {
    let { visible, x, y, isTop, unCollect, toggleTree, expandAllByKey, collapseAllByKey } = props
    // const updateName = () => {
    //   parent.modalMenuName = parent.modalMenuParent.nodeName || parent.modalMenuParent.cnName
    //   parent.modalVisible = true
    //   parent.modalUpdate = parent.modalMenuParent.id
    // }
    const handleOneClick = () => {
      parent.modalMenuName = ''
      parent.modalUpdate = null
      parent.modalVisible = true
      parent.modalMenuParent = null
    }
    const handleTwoClick = () => {
      parent.modalMenuName = ''
      parent.modalUpdate = null
      parent.modalVisible = true
    }
    const handleUpdateClick = () => {
      parent.modalUpdate = parent.modalMenuParent.id
      parent.modalVisible = true
      parent.modalMenuName = parent.modalMenuParent.nodeName || parent.modalMenuParent.nodeName
    }

    const handleDelete = () => {
      unCollect({ id: parent.modalMenuParent.id })
    }

    const handleCollapseAll = () => {
      collapseAllByKey(parent.modalMenuParent.id)
    }

    const handleExpandAll = () => {
      expandAllByKey(parent.modalMenuParent.id)
    }

    const expandAll = () => {
      toggleTree('expand')
    }

    const collapseAll = () => {
      toggleTree('collapse')
    }

    if(y + (isTop ? 100 : 200) > document.body.clientHeight) {
      y = document.body.clientHeight - (isTop ? 100 : 200)
    }


    return visible && <ul class="collect-menu-tooltip" style={{ left: `${x}px`, top: `${y}px` }}>
      {
        parent.modalMenuParent ? !parent.modalMenuParent.url ?
            [<li key="0" onClick={handleUpdateClick}>修改文件夹</li>,
              parent.depth < 4 ? <li onClick={handleTwoClick}>新增子文件夹</li> : null,
              <li onClick={handleExpandAll}>打开该文件夹全部</li>,
              <li onClick={handleCollapseAll}>折叠该文件夹全部</li>,
              <li onClick={handleDelete}>删除文件夹</li>
            ] : null : null
      }
      {
        isTop ? [
          <li onClick={handleOneClick}>新增文件夹</li>,
          <li onClick={expandAll}>打开全部</li>,
          <li onClick={collapseAll}>折叠全部</li>,
        ] : null
      }
    </ul>
  }
}

const findChildKeys = (tree, targetKey) => {
  const ret = []
  let target = null
  const findItem = (_tree) => {
    for (let item of _tree) {
      if (item.id === targetKey) {
        target = item
      } else {
        if (item.subMenu) {
          findItem(item.subMenu)
        }
      }
    }
    return target
  }

  let targetItem = findItem(tree)
  const pushKeys = (_tree) => {
    for (let item of _tree) {
      if (!item.url) {
        ret.push(item.id)
      }
      if (item.subMenu) {
        pushKeys(item.subMenu)
      }
    }
  }
  pushKeys(targetItem.subMenu)
  return ret
}
const findAllKeys = (tree) => {
  const ret = []
  const pushKeys = (_tree) => {
    for (let item of _tree) {
      if (!item.url) {
        ret.push(item.id)
      }
      if (item.subMenu) {
        pushKeys(item.subMenu)
      }
    }
  }
  pushKeys(tree)
  return ret
}

export default {
  name: 'CollectedMenu',
  components: {
    TreeNodes,
    Tooltip
  },
  props: {
    menu: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      showTips: false,
      modalVisible: false,
      modalMenuName: '',
      tooltipVisible: false,
      tooltipX: 0,
      tooltipY: 0,
      modalMenuParent: null,
      modalUpdate: false,
      isTop: true,
      depth: null,
      dragging: false,
      fetching: false,
      selected: {},
      curMenu: []
    }
  },
  computed: {
    ...mapState('app', ['cachedTabMenu', 'globalMenuMap'])
  },
  watch: {
    curMenu () {
      if (this.$route.name === 'x') {
        const menuPath = this.$route.params.menuPath
        const tailKey = (menuPath || '').split('_').slice(-1)[0]
        if (tailKey) {
          this.selected = (this.curMenu.find(item => item.id === Number(tailKey)) || {})
        }
      }
    },
    $route (route) {
      if (route.name === 'x') {
        const menuPath = route.params.menuPath
        const tailKey = (menuPath || '').split('_').slice(-1)[0]
        if (tailKey) {
          this.selected = (this.curMenu.find(item => item.id === Number(tailKey)) || {})
        }
      }
    }
  },
  created () {
    const collectMenuTips = window.localStorage.getItem('collectMenuTips')
    if (!collectMenuTips) {
      this.showTips = true
    } else {
      this.showTips = false
    }
    this._getUserCollectedMenus()
  },
  methods: {
    handleScroll: debounce(function() {
      console.log(this)
      this.tooltipVisible = false
    }, 50),
    handleCloseTips () {
      this.showTips = false
      window.localStorage.setItem('collectMenuTips', 1)
    },
    handleModalSubmit () {
      if(!(this.modalMenuName || '').trim()) {
        this.$message.destroy()
        this.$message.error('文件夹名称不能为空')
        return
      }
      axios.post('/api/menuCollect/saveMenuCollect', [
        {
          nodeName: this.modalMenuName,
          parentNodeId: this.modalUpdate ? this.modalMenuParent.parentNodeId : this.modalMenuParent ? this.modalMenuParent.id : null,
          id: this.modalUpdate,
          menuId: this.modalUpdate ? this.modalMenuParent.menuId : null,
          seq: this.modalUpdate ? this.modalMenuParent.seq : 999
        }
      ]).then(() => {
        this.modalVisible = false
        this._getUserCollectedMenus()
      })
    },
    handleWrapperRightClick (e) {
      const _this = this
      e.preventDefault()
      if (!this.tooltipVisible) {
        window.addEventListener('click', function onClickOutside () {
          _this.tooltipVisible = false
          window.removeEventListener('click', onClickOutside)
        })
        window.addEventListener('blur', function _onClickOutside () {
          _this.tooltipVisible = false
          window.removeEventListener('blur', _onClickOutside)
        })
      }
      this.modalMenuParent = null
      this.tooltipX = e.clientX
      this.tooltipY = e.clientY
      this.isTop = true
      this.tooltipVisible = true
      window.focus()
    },
    handleItemRightClick (e, item, depth) {
      e.preventDefault()
      e.stopPropagation()
      this.isTop = false
      this.depth = depth
      const _this = this
      if (!this.tooltipVisible) {
        window.addEventListener('click', function onClickOutside () {
          _this.tooltipVisible = false
          window.removeEventListener('click', onClickOutside)
        }, true)
        window.addEventListener('blur', function _onClickOutside () {
          _this.tooltipVisible = false
          window.removeEventListener('blur', _onClickOutside)
        }, true)
      }
      this.modalMenuParent = item
      this.tooltipX = e.clientX
      this.tooltipY = e.clientY
      this.tooltipVisible = true
      window.focus()
    },
    unCollect (item) {
      this.$axios.get('/api/menuCollect/deleteById', {
        params: {
          nodeId: item.id
        }
      }).then(() => {
        if (item.menuId) {
          this.$store.commit('app/UPDATE_FILTERED_ASIDE_MENU', {
            id: item.menuId,
            properties: { collected: false }
          })
          this.$message.success('已取消收藏')
        } else {
          this.$message.success('已删除收藏文件夹')
        }
        this._getUserCollectedMenus()
      })
    },
    expandAllByKey (key) {
      const retKeys = findChildKeys(this.curMenu, key)
      this.$refs.treeNodes.setExpandedKeys(retKeys.concat(key))
    },
    collapseAllByKey (key) {
      const retKeys = findChildKeys(this.curMenu, key)
      this.$refs.treeNodes.removeExpandKeys(retKeys.concat(key))
    },
    toggleTree (type) {
      if (type === 'expand') {
        const keys = findAllKeys(this.curMenu)
        this.$refs.treeNodes.replaceExpandedKeys(keys)
      } else if (type === 'collapse') {
        this.$refs.treeNodes.replaceExpandedKeys([])
      }
    },
    _getUserCollectedMenus () {
      this.fetching = true
      this.$axios.get('/api/menuCollect/selectCollectMenuList').then(({ data }) => {
        this.curMenu = data
        this.$store.commit('app/SET_GLOBAL_MENU_MAP', data)
        this.$store.state.app.initAsideMenuFinishPromise[1]()
        this.fetching = false
      })
    },
    menuItemClick (item) {
      if (!item.url) {
        this.$refs.treeNodes.toggleKey(item.id)
        return
      }
      const found = this.cachedTabMenu.find(_ => {
        return String(item.id) === (_.path).split('_').slice(-1)[0]
      })
      if (this.cachedTabMenu.length >= 7 && !found) {
        this.$notification.open({
          message: '提示',
          placement: 'bottomRight',
          description: '您打开的报表数量达到上限，请关闭部分已打开的报表后再试！',
          icon: <a-icon type="sound" style="color: #f9ab07"/>
        })
        return
      }
      if (found) {
        this.$store.commit('app/SET_CURRENT_TAB', found.path)
        this.$router.push(found.path)
      } else {
        this.selected = item
        const topId = item.idAbsolutePath.split('_')[0];

        (this.$store.state.app.globalMenuMap[item.menuId] ? Promise.resolve({}) : this.$axios.get('/api/menu/getSubMenusByRankOneMenuIdAndLoginUser', {
          params: {rankOneMenuId: topId}
        })).then(({data}) => {
          if(data) {
            this.$store.commit('app/SET_GLOBAL_MENU_MAP', data)
          }
          const path = this.$router.resolve({
            name: 'x',
            params: { menuPath: item.idAbsolutePath }
          }).href
          this.$router.push(path)
          this.$store.commit('app/ADD_CACHED_TAB_MENU', {
            name: item.cnName,
            path
          })
          this.$store.commit('app/SET_CURRENT_TAB', path)
        })
      }
    },
    onDrop (info) {
      const { dragNode, node, dropToGap, dropPosition } = info
      this.$refs.treeNodes.removeExpandKeys([dragNode.value.id])
      const dropPos = node.pos.split('-')
      const _dropPosition = dropPosition - Number(dropPos[dropPos.length - 1])
      if (node.value.url && dropToGap === false) {
        return
      }
      let paramsData = [
        {
          id: dragNode.value.id,
          menuId: dragNode.value.menuId,
          nodeName: dragNode.value.cnName,
          parentNodeId: dropToGap ? node.value.parentNodeId : node.value.id,
          seq: -1
        }
      ]
      console.log(dragNode, node, dropToGap, _dropPosition)
      if (dropToGap) {
        const loop = (data, key, callback) => {
          if (key === null) {
            return callback({ subMenu: data })
          }
          data.forEach((item, index, arr) => {
            if (item.id === key) {
              return callback(item, index, arr)
            }
            if (item.subMenu) {
              return loop(item.subMenu, key, callback)
            }
          })
        }

        loop(this.curMenu, node.value.parentNodeId, (item) => {
          const pos = Number(dropPos.pop())
          if (dragNode.value.parentNodeId === node.value.parentNodeId) {
            const oPos = item.subMenu.findIndex(_ => _.id === dragNode.value.id)
            console.log(oPos, pos)
            item.subMenu.splice(oPos, 1)
            if(_dropPosition === -1) {
              item.subMenu.splice(pos, 0, dragNode.value)
            } else {
              item.subMenu.splice(pos + 1, 0, dragNode.value)
            }
          } else {
            if(_dropPosition === -1) {
              item.subMenu.splice(pos, 0, dragNode.value)
            } else {
              item.subMenu.splice(pos + 1, 0, dragNode.value)
            }

          }
          paramsData = item.subMenu.map((_, index) => ({
            ..._,
            parentNodeId: node.value.parentNodeId,
            nodeName: _.cnName,
            seq: index
          }))
        })
      }

      axios.post('/api/menuCollect/saveMenuCollect', paramsData).then(() => {
        this._getUserCollectedMenus()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.notice-bar {
  position: relative;
  padding: 6px 8px;
  font-size: 12px;
  color: #ed6a0c;
  background-color: #fffbe8;

  /deep/ i.anticon {
    position: absolute;
    cursor: pointer;
    right: 10px;
    bottom: 5px;
  }
}

.collect-menu-tree /deep/ .node-title {
  font-size: 14px;
  position: relative;
  height: 28px;
  line-height: 28px;

  &:before {
    position: absolute;
    content: "";
    top: -4px;
    bottom: -4px;
    left: 0;
    right: 0;
  }

  > div {
    width: 100%;
    padding-right: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &:hover {
    .favorite-icon {
      transform: scale(1);
    }
  }
}

.collect-menu-tree /deep/ .favorite-icon {
  position: absolute;
  color: #f9ab07;
  right: 0;
  top: 4px;
  transform: scale(0.00001);
  transition: all .2s;
  vertical-align: middle;
  font-size: 18px;
}
</style>

<style lang="scss" scoped>
.collect-menu-tree {
  /deep/ .collect-item-icon {
    vertical-align: top;
    display: inline-block;
    width: 20px;
    height: 28px;
    margin-right: 5px;

    &.folder {
      background: url("~@/assets/images/folder-icon.png") no-repeat center center/14px 14px;
    }

    &.page {
      background: url("~@/assets/images/page-icon.png") no-repeat center center/12px 14px;
    }
  }
  /deep/ li .ant-tree-node-content-wrapper {
    position: relative;
    padding-left: 0;
    &:before {
      content: "";
      pointer-events: none;
      position: absolute;
      top: -4px;
      right: 0;
      height: 36px;
      width: 210px;
      border-radius: 4px;
    }
    &:hover {
      background: transparent;
      &:before {
        background: rgba(0,0,0,.07);
      }
    }
    &.ant-tree-node-selected {
      background: transparent;
      &:before {
        background: #e1f0ea;
      }
    }
  }

  /deep/ .ant-motion-collapse-legacy .ant-tree-node-content-wrapper:before {
    background: transparent!important;
  }

  /deep/ li span.ant-tree-switcher, li span.ant-tree-iconEle {
    height: 36px;
    z-index: 10;
    i.anticon {
      font-size: 14px !important;
      line-height: 36px;
    }
    &:hover +span.ant-tree-node-content-wrapper {
      &:before {
        background: rgba(0,0,0,.07);
      }
    }
  }

  /deep/ li {
    padding: 0;
    span[draggable], span[draggable=true] {
      line-height: 36px;
      border-top-width: 4px;
      border-bottom-width: 4px;
      height: 36px;
    }
  }
}
</style>


<style lang="scss">
.collect-menu-tooltip {
  background-clip: padding-box;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .15);
  left: 0;
  list-style-type: none;
  border-radius: 4px;
  margin: 0;
  padding: 0;
  position: fixed;
  text-align: left;
  top: 0;
  overflow: hidden;
  z-index: 999;

  li {
    clear: both;
    color: rgba(0, 0, 0, .65);
    cursor: pointer;
    font-size: 14px;
    font-weight: normal;
    line-height: 22px;
    margin: 0;
    padding: 5px 12px;

    &:hover {
      background-color: #e6f7ff;
    }
  }
}
</style>
