<template>
  <div class="modal-wrapper">
    <div v-if="closeBtn" class="close-btn-wrapper">
      <div class="close-btn" @click="closeModal">关闭</div>
    </div>
    <div class="intro-gallery">
      <slot/>
    </div>
    <div class="intro-gallery-nav" v-if="$slots.navbar">
      <slot name="navbar"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'modalWrapper',
  props: {
    closeBtn: {
      type: Boolean,
      default: false
    }
    // navbar: { type: Boolean, default: false }
  },
  methods: {
    closeModal () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.modal-wrapper {
  user-select: none;
  position: relative;

  .close-btn-wrapper {
    height: 40px;
  }

  .close-btn {
    position: absolute;
    right: 0;
    top: 0;
    z-index: 10;
    cursor: pointer;
    color: #fff;
    width: 65px;
    height: 32px;
    line-height: 32px;
    font-size: 14px;
    text-align: center;
    background: transparent;
    border-radius: 2px;
    border: 1px solid #ffffff80;
  }
}

.intro-gallery {
  background: #fff;
  width: 1200px;
  overflow: hidden;
  border-radius: 4px;

  &-nav {
    width: 1200px;
    height: 60px;
    margin-top: 10px;
    border-radius: 4px;
    background: #fff;
  }
}
</style>
