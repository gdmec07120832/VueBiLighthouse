<template>
  <a-sub-menu :key="menuInfo.id" v-bind="$props" v-on="$listeners">
    <span slot="title">
      <span style="padding-left: 36px">{{ menuInfo.cnName }}</span>
    </span>
    <template v-for="item in menuInfo.subMenu">
      <sub-menu
          :deep="deep + 1"
          v-if="item.subMenu && item.subMenu.length"
          :key="item.id"
          :menu-info="item"
      />
      <a-menu-item v-else :key="item.id" :path="item.url" :title="item.cnName">
        <span style="padding-left: 36px">{{ item.cnName }}</span>
      </a-menu-item>
    </template>
  </a-sub-menu>
</template>

<script>
import {Menu} from 'ant-design-vue'

export default {
  name: "SubMenu",
  isSubMenu: true,
  props: {
    ...Menu.SubMenu.props,
    menuInfo: {
      type: Object,
      default: () => ({}),
    },
    deep: {
      type: Number,
      default: 0
    }
  }
}
</script>

<style scoped>

</style>
