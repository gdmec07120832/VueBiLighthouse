<template>
  <div class="v-tabs flex flex-start">
    <div v-for="tab in tabs" :key="tab" :class="{active: value === tab}" @click="onTabClick(tab)">{{ tab }}</div>
  </div>
</template>

<script>
export default {
  name: 'VTabs',
  props: {
    value: {
      type: [Number, String],
      default: ''
    },
    tabs: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {}
  },
  methods: {
    onTabClick(tab) {
      this.$emit('update:value', tab)
    }
  }
}
</script>

<style lang="scss" scoped>
  .v-tabs {
    font-size: 12px;
    color: #666;
    >div {
      position: relative;
      padding: 6px 20px;
      cursor: pointer;
      &.active {
        color: #2680eb;
        &:before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: #2680eb;
        }
      }
    }
  }
</style>
