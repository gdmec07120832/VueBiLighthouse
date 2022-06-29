<template>
  <a-modal title="操作教程" v-model="visible" :footer="null" width="60vw" style="max-width: 1160px" @cancel="handleCancel">
    <video :src="require('@/assets/images/BI_tutorial.mp4')" ref="video" preload="auto" autoplay
           controls="controls" controlslist="nodownload" oncontextmenu="return false" style="width: 100%">
    </video>
  </a-modal>
</template>

<script>
export default {
  name: 'TutorialModal',
  data() {
    return {
      visible: false,
    }
  },
  methods: {
    handleCancel() {
      this.$refs.video.pause()
    }
  },
}
</script>

<style scoped>

</style>
