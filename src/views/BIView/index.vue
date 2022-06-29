<template>
  <!--  <iframe width="100%" height="100%" :src="urlWithToken(indexPage.url)" style="border: 0"/>-->
  <div style="height: 100%; overflow-y: auto">
    <IndexPage />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Cookies from 'js-cookie'
import IndexPage from '@/views/BIView/IndexPage/IndexPage'
import indexPage from '@/views/Admin/release-version-mgmt/components/indexPage'

export default {
  name: 'index',
  components: { IndexPage },
  computed: {
    ...mapState('app', ['indexPage']),
  },
  watch: {
    indexPage: {
      handler() {
        this.$store.commit('app/SET_CURRENT_TOP_LEVEL_MENU', this.indexPage)
        if (this.indexPage.menuType === 'Report') {
          this.$axios.get('/api/admin/common/log/save', {
            params: {
              logLevel: 'Info',
              logType: 'Web',
              logSource: 'ReportView',
              description: '访问',
              extAssociationKey: this.indexPage?.versionMainNum + '_' + this.indexPage?.versionSubNum,
              methodName: 'YH',
              qualifiedName: '首页',
            },
            silent: true,
          })
        }
      },
    },
  },
  created() {
    // this.$store.commit('app/SET_MENU_COLLAPSED', false)
    this.$store.commit('app/SET_MENU_HIDDEN', true)
  },
  methods: {
    urlWithToken(url) {
      const token = Cookies.get('lsmyToken')
      if (token && url) {
        return url + '&token=' + token
      } else {
        return url
      }
    },
  },
}
</script>

<style scoped></style>
