<template>
  <div class="BILoading-wrapper" v-if="loading">
    <div class="BILoading">
      <img :src="require('@/assets/images/loading.gif')" alt="">
      <span class="BILoading-font" @click="emitLoadingCancel">取消</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'YLoading',
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    emitLoadingCancel () {
      this.$emit('update:loading', false)
      this.$emit('cancelLoading')
    },
  }
}
</script>

<style lang="scss" scoped>
.BILoading-wrapper {
  z-index: 6000;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 5px;
  display: flex;
}

.BILoading {
  background-color: #d7d7d7;
  opacity: .95;
  align-items: center;
  box-sizing: border-box;
  padding: 0 .4375rem;
  border-radius: 2px;
}

.BILoading-font {
  font-size: .75rem;
  font-weight: 700;
  color: #686868;
  cursor: default;

  &:hover {
    opacity: .75;
  }
}
</style>
