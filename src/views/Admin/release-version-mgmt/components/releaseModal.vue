<template>
  <modal-wrapper :close-btn="closeBtn" @close="handleClose">
    <template>
      <siema ref="siema" :current.sync="curSide" :options="{draggable: true}">
        <index-page :detail="pushConfig"/>
        <content-page v-for="page in contentPages" :key="page.id" :detail="page"/>
      </siema>
    </template>
    <template slot="navbar">
      <navbar :nav-items="navItems" :current.sync="curSide"/>
    </template>
  </modal-wrapper>
</template>

<script>
import Vue from 'vue'
import Siema from 'vue2-siema'

import ModalWrapper from '@/views/Admin/release-version-mgmt/components/modalWrapper'
import Navbar from '@/views/Admin/release-version-mgmt/components/navbar'
import IndexPage from '@/views/Admin/release-version-mgmt/components/indexPage'
import ContentPage from '@/views/Admin/release-version-mgmt/components/contentPage'

Vue.use(Siema)

export default {
  name: 'releaseModal',
  components: { ContentPage, IndexPage, Navbar, ModalWrapper },
  props: {
    closeBtn: Boolean,
    isPreview: {
      type: Boolean,
      default: true
    },
    pushConfig: {
      type: Object,
      default: () => ({})
    },
    contentPages: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    navItems () {
      return [this.pushConfig.coverTitle].concat(this.contentPages.map(_ => _.reportName))
    }
  },
  watch: {
    curSide: {
      handler (v) {
        this.$refs.siema && this.$refs.siema.goTo(v)
        if (!this.isPreview) {
          this.saveLog(v)
        }
      },
      immediate: true
    }
  },
  data () {
    return {
      curSide: 0
    }
  },
  methods: {
    handleClose () {
      this.$emit('close')
    },
    saveLog (index) {
      let id
      if (index === 0) {
        id = this.pushConfig.coverId
      } else {
        id = this.contentPages[index - 1].id
      }
      this.$axios.get('/api/admin/common/log/save', {
        params: {
          description: 'hasRead',
          logLevel: 'Info',
          logSource: 'ReleaseVersion',
          logType: 'Web',
          extAssociationKey: id
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
