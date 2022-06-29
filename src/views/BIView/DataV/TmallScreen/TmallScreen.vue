<template>
  <div class="container">
    <div class="headBar">
      <span class="headBar__text">
        天猫大屏
      </span>
      <div class="headBar__time">{{formatTime(time)}}</div>
    </div>
    <div class="mainContent">
      <div class="part-left">
        <left-side />
      </div>
      <div class="part-center">
        <center-comp />
      </div>
      <div class="part-right">
        <right-side />
      </div>
    </div>
  </div>
</template>

<script>
import LeftSide from '@/views/BIView/DataV/TmallScreen/LeftSide'
import moment from 'moment'
import RightSide from '@/views/BIView/DataV/TmallScreen/RightSide'
import CenterComp from '@/views/BIView/DataV/TmallScreen/CenterComp'
export default {
  name: 'TmallScreen',
  components: { CenterComp, RightSide, LeftSide },
  data() {
    return {
      time: moment()
    }
  },
  created() {
    if(process.env.VUE_APP_RELEASE_ENV === 'pro') {
      if(window.location.href.indexOf('bi.linshimuye.com:9090') > -1) {
        window.location.href = window.location.href.replace('bi.linshimuye.com:9090', '10.10.1.168:9090')
      }
    }
  },
  mounted() {
    const timer = setInterval(() => {
      this.time = moment()
    })
    this.$on('hook:beforeDestroy', () => {
      clearInterval(timer)
    })
  },
  methods: {
    formatTime(time) {
      const textMap = {
        '1': '一',
        '2': '二',
        '3': '三',
        '4': '四',
        '5': '五',
        '6': '六',
        '0': '日',

      }
      return `${time.year()}年${time.month() + 1}月${time.date()}日 星期${textMap[time.day()]} ${time.format('HH:mm:ss')}`
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/styles/utils.scss";

.container {
  width: 100vw;
  height: 100vh;
  font-family: "Microsoft YaHei",serif;
  background: rgba(0, 0, 0, .19);
  background: url("./images/bg.png") no-repeat left top/cover;
  user-select: none;

  .mainContent {
    padding: vh(15) vw(15);
    display: flex;
    .part-center {
      width: 44%;
    }

    .part-left, .part-right {
      width: 28%;
      height: 100vh;
    }
  }

}

.headBar {
  height: vh(100);
  background: url("./images/top-bar.png") no-repeat left top/100% 100%;
  text-align: center;
  position: relative;
  .headBar__text {
    font-size: vw(62);
    font-family: fzxs12,serif;
    letter-spacing: 12px;
    text-indent: 12px;
    color: #F3FCFF;
    text-shadow: 0 1px 3px rgba(4, 35, 28, 0.38);
    background: linear-gradient(0deg, #158DFF 0%, #FFFFFF 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .headBar__time {
    position: absolute;
    top: vh(45);
    right: vw(20);
    color: #fff;
    font-size: 12px;
  }
}
</style>