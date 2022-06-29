<template>
  <div class="metricWrapper" :style="{
    background: $route.name === 'metricExploreSearchResult' ? '#ebeaef' : 'transparent'
  }">
    <div class="backToPrev" v-if="$route.name === 'metricExploreSearchResult'" @click="$router.push({name:'metricExplore'})">
      <a-icon type="left" />返回指标搜索</div>
    <div class="searchWrapper">
      <a-input-search ref="searchInput" v-model="keyword" placeholder="输入关键字搜索" size="large" @search="onSearch">
        <a-button slot="enterButton" type="primary">
          搜索
        </a-button>
      </a-input-search>
    </div>
    <router-view @updateQuery="updateQuery"/>
  </div>
</template>

<script>

export default {
  name: 'MetricExplore',
  data() {
    return {
      keyword: ''
    }
  },
  mounted() {
    this.$store.commit('app/SET_MENU_HIDDEN', true)
  },
  methods: {
    updateQuery(q) {
      this.keyword = q
    },
    onSearch() {
      if(!this.keyword){
        this.$message.error('请输入关键字')
        this.$refs.searchInput.$el.classList.add('shake-horizontal')
        setTimeout(() => {
          this.$refs.searchInput.$el.classList.remove('shake-horizontal')
        }, 1000)
        return
      }
      this.$router.push({
        name:'metricExploreSearchResult',
        query: {
          q: this.keyword,
          t: Date.now()
        }
      })
    }
  },

}
</script>

<style lang="scss" scoped>
.metricWrapper {
  position: relative;
  height: 100%;
  transition: all .2s;
  //overflow: auto;

  .searchWrapper {
    width: 700px;
    margin: auto;
    padding-top: 50px;

    ::v-deep .ant-input-lg {
      height: 50px;
      padding: 11px;
    }

    ::v-deep .ant-btn-lg {
      height: 50px;
      padding-left: 40px;
      padding-right: 40px;
    }
  }


  .backToPrev {
    position: absolute;
    top: 20px;
    left: 50px;
    cursor: pointer;
    color: #6bc9b0;
  }
}

.shake-horizontal {
  animation: shake-horizontal 0.8s both;
}

@keyframes shake-horizontal {
  0%,
  100% {
    transform: translateX(0);
  }
  10%,
  30%,
  50%,
  70% {
    transform: translateX(-10px);
  }
  20%,
  40%,
  60% {
    transform: translateX(10px);
  }
  80% {
    transform: translateX(8px);
  }
  90% {
    transform: translateX(-8px);
  }
}

</style>


