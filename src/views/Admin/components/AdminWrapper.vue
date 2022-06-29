<template>
  <div class="admin-wrapper">
    <div class="close-button">
      <a-button @click="close" shape="round" icon="close"></a-button>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
  name: "AdminWrapper",
  computed: {
    ...mapState('app', ['currentTab', 'currentTopLevelMenu'])
  },
  methods: {
    close() {
      // if(this.currentTab) {
      //   this.$router.push(this.currentTab)
      //   return
      // }
      // if(this.currentTopLevelMenu.id) {
      //   this.$router.push({
      //     name: 'x',
      //     params: {menuPath: this.currentTopLevelMenu.id + ''}
      //   })
      //   return
      // }
      const lastRoute = window.lastRoute
      console.log(lastRoute)
      if(lastRoute) {
        if(lastRoute.path !== this.$route.path) {
          this.$router.push(lastRoute)
          return
        } else {
          if(this.currentTopLevelMenu.id) {
            this.$router.push({
              name: 'x',
              params: {menuPath: this.currentTopLevelMenu.id + ''}
            })
            return
          } else {
            this.$router.push('/')
            return
          }
        }
      }
      this.$router.push('/')
    }
  }
}
</script>

<style lang="scss" scoped>
.admin-wrapper {
  position: relative;
  height: 100%;
}

.close-button {
  position: absolute;
  right: 20px;
  top: 10px;
}
</style>
