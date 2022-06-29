<template>
  <div>
    <div class="admin-banner"></div>
    <div style="padding: 20px; color: #666">
      &lt;-- 点击左侧菜单进行具体的操作
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminLandingPage'
}
</script>

<style lang="scss" scoped>
.admin-banner {
  width: 100%;
  padding-bottom: 23.4%;
  background: url("~@/assets/images/index-banner.jpeg") no-repeat 0 0/100% 100%;
}
</style>
