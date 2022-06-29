<template>
  <div>
    <div class="menu-section__title">
      <div v-for="item in path" :key="`${item.id}_${item.subMenu.length}`" class="menu-section__title__path-item" @click="handleItemClick(item)">
        {{item.cnName}}
      </div>

      <div>
        {{ currentFolder && currentFolder.cnName }}
      </div>
    </div>

    <div v-for="m in sortedMenu" :key="`${m.id}_${m.subMenu.length}`" class="menu-page" @click="handleItemClick(m)">
        <menu-item :menu="m" />
    </div>
  </div>

</template>

<script>
import findDeep from 'deepdash/es/findDeep'
import MenuItem from '@/components/Layout/AsideMenuV2/MenuItem'
import { mapState } from 'vuex'
import mixins from '@/components/Layout/AsideMenuV2/mixins'
import orderBy from 'lodash/orderBy'
export default {
  name: 'MenuFolder',
  mixins: [mixins],
  components: {MenuItem},
  props: {
    menu: {
      type: Object
    }
  },
  computed: {
    ...mapState('app', ['filteredAsideMenu',
      'cachedTabMenu', 'menuCollapsed', 'currentAsideMenu',
      'currentTopLevelMenu', 'indexPage', 'asideMenuOpenedKeys']),
    sortedMenu() {
      return orderBy((this.currentFolder && this.currentFolder.subMenu) || [], ['subMenu'], ['desc'])
    },
    selectable () {
      const len = this.cachedTabMenu.length
      return len < 7
    },
    currentRelativePathKeys() {
      return this.$route.path.replace('/x/', '').split('_')
    },
    path() {
      const id = this.currentFolder?.id
      let ret = []
      if(id) {
        findDeep(this.menu, (value, key, parentValue, context) => {
          if(value.id === id) {
            ret = context.parents.map(item => item.value)
          }
        }, {
          childrenPath: ['subMenu']
        })
      }
      return ret
    }
  },
  watch: {
    currentRelativePathKeys: {
      handler() {
        const curId = this.currentRelativePathKeys[this.currentRelativePathKeys.length - 1]
        if(curId) {
          this.calcCurrentFolder(curId)
        }
      },
      immediate: true
    }
  },
  data() {
    return {
      currentFolderDepth: 0,
      currentFolderId: null,
      currentFolder: null
    }
  },
  created() {},
  methods: {
    calcCurrentFolder (id) {
      const ret = findDeep(this.menu, (value, key, parentValue, context) => {
        return String(value.id) === id
      }, {
        childrenPath: ['subMenu']
      })

      if(ret) {
        this.currentFolder = ret.parent
        this.currentFolderId = ret.parent.id
      } else {
        this.currentFolderId = this.menu.id
        this.currentFolder = this.menu
      }
    }
  }
}
</script>

<style scoped lang="scss">
.menu-section__title {
  display: flex;
  padding-left: 8px;
  position: relative;
  white-space: nowrap;
  color: rgba(0,0,0,1);
  margin-bottom: 8px;

  &:before {
    content: "";
    position: absolute;
    left: -6px;
    top: 2px;
    width: 4px;
    border-radius: 4px;
    height: 20px;
    background: #46BCA0;
  }

  .menu-section__title__path-item {
    //padding-right: 10px;
    color: rgba(0,0,0,.25);
    cursor: pointer;
    &:after {
      content: '>';
      padding-right: 5px;
    }
  }
}
</style>