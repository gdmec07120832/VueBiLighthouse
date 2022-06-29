<template>
  <div>
    <div class="logo-wrap flex flex-start">
      <div class="toggleTrigger" :class="{active: siteMenuShow}" @click="toggleSiteMenuShow">
        <a-icon type="menu" class="toggleTriggerIcon" />
      </div>
      <div class="logo"></div>
    </div>
    <SiteMenu :show.sync="siteMenuShow" :quick-nav-map="siteData" />
  </div>
</template>

<script>
import SiteMenu from '@/components/Layout/SiteMenu'
export default {
  name: 'LogoWrapper',
  components: { SiteMenu },
  data() {
    return {
      siteMenuShow: false,
      siteData: {}
    }
  },
  created() {
    this.getSiteData()
  },
  methods: {
    getSiteData () {
      this.$axios.get('/api/user/getQuickNavBar').then(({data}) => {
        this.siteData = data
      })
    },
    toggleSiteMenuShow () {
      this.siteMenuShow = !this.siteMenuShow
    }
  }
}
</script>

<style scoped lang="scss">
.toggleTrigger {
  width: 50px;
  height: 50px;
  margin-right: 15px;
  text-align: center;
  .toggleTriggerIcon {
    margin: 16px auto;
    font-size: 18px;
    color: #fff;
  }
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
    cursor: pointer;
  }
  &:active, &.active {
    background-color: rgba(0, 0, 0, 0.08);
  }
}
.logo-wrap {
  flex: 0 0 210px;
  width: 210px;
  height: 50px;

  .logo {
    width: 123px;
    height: 50px;
    background: url('~@/assets/images/lighthouse-logo.png') no-repeat left center/contain;
  }
}
</style>