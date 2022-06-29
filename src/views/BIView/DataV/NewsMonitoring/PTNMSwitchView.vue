<template>
  <div style="width: 100%; overflow: hidden" 
    :style="{'height':bg_css.BgAllWidth/1.78+'px'}">
    <div
      :class="
        AnimUserset == 1 ? 'AnimUser' : AnimUserset == 2 ? 'AnimUser2' : ''
      "
      v-if="AnimUserset === 0"
      :style="{'height':bg_css.BgAllWidth/1.78+'px','margin-top':(-(bg_css.BgAllWidth/1.78))*AnimUserset+'px'}"
    >
      <NewsMonitoringset psMsg='大屏切换' :CheckValSet='CheckVal'></NewsMonitoringset>
    </div>

    <!-- <div v-if="currentUrl" class="MonitBg" style="width: 100%;" :style="{'height':bg_css.BgAllWidth/1.78+'px'}">
      <iframe
        :src="currentUrl"
        style="border: 0; width: 100%;"
        :style="{'height':bg_css.BgAllWidth/1.78+'px'}"
      ></iframe>
    </div> -->
    <div style="width: 100%;overflow: hidden" :style="{'height':bg_css.BgAllWidth/1.78+'px'}">
      <ProjectGroupRanking style="border: 0; width: 100%;"
        :style="{'height':bg_css.BgAllWidth/1.78+'px'}"/>
    </div>

    <div>
      <NewsMonitoringset psMsg='大屏切换' :CheckValSet='CheckVal'></NewsMonitoringset>
    </div>
  </div>
</template>

<script>
var CurrUrl = window.location.host;
var table_width = window.innerWidth;


import NewsMonitoring from "@/views/BIView/DataV/NewsMonitoring/NewsMonitoring.vue";
import ProjectGroupRanking from '@/views/BIView/DataV/ProjectGroupRanking/index.vue'
export default {
  data() {
    return {
      bg_css: {
        BgAllWidth: table_width,
      },
      userurl: CurrUrl,
      currentUrl: "",
      AnimUserset: 0,
      CheckVal:false,
    };
  },
  components: {
    NewsMonitoringset: NewsMonitoring,
    ProjectGroupRanking
  },

  created() {
    console.log(this.userurl); 
    // 给业务的只给ip地址过去
    // 生产:10.10.1.168
    // sit:10.10.14.123  

    if(this.userurl.indexOf('test.bi.linshimuye.com')>=0){
      window.location.replace("http://10.10.14.123:9090/frame/ptnm-ptnmswitchview");
    }else if(this.userurl.indexOf('bi.linshimuye.com')>=0){
      window.location.replace("http://10.10.1.168:9090/frame/ptnm-ptnmswitchview");
    }


    // if(this.userurl.indexOf('10.20.3.214')>=0||this.userurl.indexOf('test.bi.linshimuye.com')>=0||this.userurl.indexOf('10.10.14.123')>=0){

    //     console.log('这是测试环境');
    //     this.$axios.get("/api/menuForScreen/noPm/getSignatureUrl", {
    //         params: { id: 11},
    //     }).then(({ data }) => {
    //         this.currentUrl = data;
    //         console.log("=====adadasdsa adasd as          ====");
    //         console.log(this.currentUrl);
    //     });
    // }else if(this.userurl.indexOf('bi.linshimuye.com')>=0||this.userurl.indexOf('10.10.1.168')>=0){
    //     console.log('这是生产环境');
    //     this.$axios.get("/api/menuForScreen/noPm/getSignatureUrl", {
    //         params: { id: 4 },
    //     }).then(({ data }) => {
    //         this.currentUrl = data;
    //         console.log("=====adadasdsa adasd as          ====");
    //         console.log(this.currentUrl);
    //     });
    // }else{
    //   this.currentUrl = null;
    // }
    // {id: 11, cnName: "项目组排名"}  产品供应-项目组排名   生产的是id: 4     测试的id：11 
    // this.$axios.get("/api/menuForScreen/noPm/getSignatureUrl", {
    //     params: { id: (this.userurl.indexOf('10.20.3.214')>=0||
    //                    this.userurl.indexOf('test.bi.linshimuye.com')>=0||
    //                    this.userurl.indexOf('10.10.14.123')>=0)?11:4 },
    // }).then(({ data }) => {
    //     this.currentUrl = data;
    //     console.log("=====adadasdsa adasd as          ====");
    //     console.log(this.currentUrl);
    // });
    let that = this
    setTimeout(() => {
      that.switchfun(300000, this);
    },4000)
    // this.switchfun(10000, this);
  },

  methods: {
    switchfun(timeset, set_val) {
      setTimeout(() => {
        if (set_val.AnimUserset == 2) {
          set_val.AnimUserset = 0;
          this.CheckVal=true;
        } else {
          set_val.AnimUserset++;
          this.CheckVal=false;
        }
        set_val.switchfun(timeset, set_val);
      }, timeset);
    },
  },
};
</script>

<style>
.AnimUser {
  transition: all 1s;
}
.AnimUser2 {
  transition: all 1s;
}

.MonitBg {
  background: url("~@/assets/images/datav/NewsMonitoringNew/bg.png") no-repeat left
    top/cover;
  margin: 0 auto;
}
</style>