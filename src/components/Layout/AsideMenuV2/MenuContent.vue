<template>
  <div class="menu-content-inner-wrapper">
    <div v-for="m in sortedMenu" :key="`${m.id}_${m.subMenu.length}`" :class="{'menu-section': m.subMenu.length, 'menu-page': !m.subMenu.length}" @click="handleClick(m)">
      <menu-folder v-if="m.subMenu.length" :menu="m" />
      <menu-item v-else :menu="m" />
    </div>
  </div>
</template>

<script>

import MenuFolder from '@/components/Layout/AsideMenuV2/MenuFolder'
import MenuItem from '@/components/Layout/AsideMenuV2/MenuItem'
import mixins from '@/components/Layout/AsideMenuV2/mixins'
import sortBy from 'lodash/sortBy'

export default {
  name: 'MenuContent',
  mixins: [mixins],
  components: { MenuFolder, MenuItem },
  props: {
    menu: {
      type: Array
    }
  },
  computed: {
    sortedMenu () {
      return sortBy(this.menu, ['subMenu'])
    }
  },
  methods: {
    handleClick (m) {
      if(!m.subMenu.length) {
        this.handleItemClick(m)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.menu-content-inner-wrapper {
  white-space: normal;
  padding: 12px 24px;

  /deep/ .menu-page {
    color: rgba(0, 0, 0, .65);
    width: 25%;
    display: inline-block;

    &:hover {
      cursor: pointer;
      border-radius: 8px;
      background: rgba(0, 0, 0, .05);
    }
  }
}

.menu-section {
  margin-bottom: 16px;
  margin-top: 16px;
  position: relative;
  color: rgba(0, 0, 0, .65);
  &:first-child {
    margin-top: 0;
  }
}


</style>