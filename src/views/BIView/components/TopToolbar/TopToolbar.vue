<template>
  <div class="top-toolbar-wrapper">
    <div @mouseenter="show=true" style="height: 10px; width: 100%; opacity: 0" v-show="!show"></div>
    <div @mouseleave="show=false" class="top-toolbar" v-show="show">
      <div style="padding: 0 2%">
        <div class="toolbar-item flex" @click="showContext" style="line-height: 40px; display: inline-block; cursor: pointer;">
          <span style="margin-right: 5px">
            <export-icon style="font-size: 14px; color: #fff"></export-icon>
          </span>
          <span class="toolbar-item-text">输出</span>
          <cc-down-icon style="font-size: 14px; color: #fff; margin-left: 5px; transform: translateY(2px)"></cc-down-icon>
          <div v-click-outside="hide" v-show="contextShow" class="context-menu" style="position: absolute; top: 40px; left: 0; width: 100px; background-color: #fff">
            <div class="context-menu-item" @click="handleClickContextMenu('downloadExcel')">Excel格式</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ClickOutside from 'vue-click-outside'
import exportIcon from '@/assets/svg/export.svg'
import ccDownIcon from '@/assets/svg/cc-down.svg'
export default {
  name: 'TopToolbar',
  directives: {ClickOutside},
  components: {exportIcon, ccDownIcon},
  data () {
    return {
      show: false,
      contextShow: false
    }
  },
  methods: {
    handleClickContextMenu(payload) {
      this.hide()
      this.$emit('contextMenuClick', payload)
    },
    showContext() {
      setTimeout(() => {
        this.contextShow = true
      }, 50)
    },
    hide() {
      if(this.contextShow) {
        this.contextShow = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.top-toolbar-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;

  .top-toolbar {
    height: 40px;
    background: rgb(89, 210, 181);
  }

  .toolbar-item {
    position: relative;
  }
  .toolbar-item:hover {
    .toolbar-item-text {
      color: #fff;
    }
  }
  .toolbar-item-text {
    color: rgb(47, 46, 44);
  }

  .context-menu {
    min-height: 30px;
    padding: 2px 0;
    font-size: 12px;
    background-color: #fff;
    background-clip: padding-box;
    border-radius: 2px;
    box-shadow: 0 0 5px #ccc;
    .context-menu-item {
      line-height: 28px;
      text-align: center;
      &:hover {
        background: #cccccc80;
      }
    }
  }
}
</style>
