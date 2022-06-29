<template>
  <a-menu mode="inline" @click="menuClick" class="screen-menu" :inlineIndent="12">
    <template v-for="item in menu">
      <sub-menu :key="item.id" v-if="item.subMenu && item.subMenu.length" :menu-info="item"></sub-menu>
      <a-menu-item deep="0" v-else :key="item.id" :path="item.url" :title="item.cnName">
        <span style="padding-left: 36px">{{ item.cnName }}</span>
      </a-menu-item>
    </template>
  </a-menu>
</template>

<script>
import SubMenu from './SubMenu'

export default {
  name: "ScreenMenu",
  components: {SubMenu},
  props: {
    menu: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    menuClick(e) {
      this.$emit('click', e)
    }
  }
}
</script>

<style lang="scss" scoped>
.screen-menu {
  border-right-color: transparent;
  /deep/ .ant-menu-submenu[deep='0'] {
    border-bottom: 1px solid rgba(107, 108, 109, .19);
  }

  /deep/ .ant-menu-item[deep='0'] {
    border-bottom: 1px solid rgba(107, 108, 109, .19);
    &:first-child {
      //border-top: 1px solid rgba(107, 108, 109, .19);
    }
  }

  /deep/ .ant-menu-item:after {
    left: 0;
    right: auto;
  }
}
</style>
