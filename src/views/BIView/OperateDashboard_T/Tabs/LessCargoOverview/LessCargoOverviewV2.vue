<template>
  <div>
    <div class="Header">
      <Title class="title" :label="'欠货概览'" :jump="true" :jumpTarget="JumpStr" />
    </div> 
    <div class="CountCss">
      <LessCargoOverview />   
    </div>   

  </div>
</template>


<script>
import LessCargoOverview from '@/views/BIView/PsDashboard/Tabs/ShortShippedOverview/ShortShippedCharts'
import Title from '../../components/Title'
export default {
  name: 'LessCargoOverviewV2',
  components: {
    Title,
    LessCargoOverview,
  },
  data(){
    return{
      JumpStr:'',
    }
  },
  async created() {
    this.jumpTarget();
  },
  methods:{
    async jumpTarget() {
      let query = {
        versionMainNum:(process.env.VUE_APP_RELEASE_ENV !== 'pro')?'BI_PC_2021_00137':'BI_PC_2021_00182'
      }
      let res =  await this.$fetchSql('ALL_USER', 'getMenuIdAbsolutePathByVersionMainNum',query);
      if(process.env.VUE_APP_RELEASE_ENV !== 'pro') {
        this.JumpStr = 'http://test.bi.linshimuye.com:9090/x/'+res.data[0].ID_ABSOLUTE_PATH;
      }
      else {
        this.JumpStr = 'http://bi.linshimuye.com:9090/x/'+res.data[0].ID_ABSOLUTE_PATH;
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.Header{
  margin-top: 10px;
  // height: 38px;
  height: 30px;
  padding-bottom: 10px;
  border-bottom: 0px solid #F0F0F0;  
}
.CountCss{
  margin-top: -35px;
  /deep/ .px15{
    div.flex-between:nth-child(1){ 
      div{
        div.chart-sub-title,div.Jump{
          display: none;
        }
      }
    }
    div.flex-between:nth-child(2){
      margin-top: 8px;

    }
  }

}
</style>

