<template>
  <div class="page-wrapper">
    <slot/>
  </div>
</template>

<script>
export default {
  name: 'pageWrapper'
}
</script>

<style lang="scss" scoped>
.page-wrapper {
  background: #f0f2f5;
  height: 100vh;
  overflow-y: auto;

  /deep/ .w1366 {
    padding: 0 2% 20px;
    //max-width: 1366px;
    margin: auto;
  }

  /deep/ .page-section {
    padding: 20px;
    background: #fff;
    border-radius: 5px;
  }
}
</style>
