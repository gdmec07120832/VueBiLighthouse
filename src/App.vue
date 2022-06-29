<template>
  <div id="app" :class="curEnv">
    <a-spin :spinning="fullLoading">
      <router-view />
    </a-spin>
  </div>
</template>

<script>
console.log(process.env.VUE_APP_RELEASE_ENV)
export default {
  name: 'App',
  computed: {
    fullLoading() {
      return this.$store.state.app.fullLoading
    }
  },
  data() {
    return {
      curEnv: process.env.VUE_APP_RELEASE_ENV
    }
  },
}
</script>

<style lang="scss">
.dev {
  --top-nav-bg-color: #2062e6;
}

.sit {
  --top-nav-bg-color: #2062e6
}

.pro {
  --top-nav-bg-color: #46bca0;
}
</style>
