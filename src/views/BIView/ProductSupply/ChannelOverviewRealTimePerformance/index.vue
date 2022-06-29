<template>
    <div style="min-width: 1210px">
        <y-loading :loading.sync="loading" @candelLoading="cancelExport"></y-loading>
        <top-toolbar @contextMenuClick="handleContextMenuClick" />
        <div ref="ele" id="channelOverviewRealTimePerformance" style="background-color: #f5f6fa; height: 100vh; padding: 0 2%; overflow: auto">
            <div class="py10" style="margin: auto">
                <div style="font-size: 26px;margin-left: 20px;">实时业绩</div>
                <div style="line-height: 24px;margin-top: 10px;margin-left: 20px;font-size: 12px;color: #999" class="sub-tip">备注：【1】报表为当日实时数据，页面刷新频率为30秒；【2】实时业绩未包含状态为“首款已付，尾款未付”部分业绩；【3】不包含业务渠道为其它；</div>
            </div>
            <div class="block1">
                <div class="flex-between topBox">
                    <div class="left">实时总览</div>
                    <div class="right flex">
                        <div class="mr5">视角</div>
                        <a-icon @click="showTips" type="question-circle" style="color: rgba(0,0,0,0.45); cursor: pointer; transform: translateY(1px)" />
                        <span class="mx5" style="color: rgba(0,0,0,0.45)">:</span>
                        <a-radio-group v-model="currentView">
                            <a-radio :style="radioStyle" :value="1">
                                全司视角
                            </a-radio>
                            <a-radio :style="radioStyle" :value="2">
                                全中视角
                            </a-radio>
                            <a-radio :style="radioStyle" :value="3">
                                品市视角
                            </a-radio>
                        </a-radio-group>
                    </div>
                </div>
                <RealTimeOverview :duration="duration" :currentView="currentView" :currentTab.sync="currentTab" class="component" style="flex: 1"/>
            </div>
            <div class="block2">
                <ChannelDetails :duration="duration" :currentView="currentView" :currentChannel="currentTab"/>
            </div>
        </div>
    </div>
</template>

<script>
import YLoading from '@/views/BIView/components/YLoading/YLoading'
import TopToolbar from '@/views/BIView/components/TopToolbar/TopToolbar'
import RealTimeOverview from './components/RealTimeOverview/index.vue'
import ChannelDetails from './components/ChannelDetails/index.vue'
export default {
    components: { YLoading, TopToolbar ,RealTimeOverview, ChannelDetails },
    data() {
        return {
            loading: false,
            radioStyle: {
                display: 'block',
                height: '30px',
                lineHeight: '30px',
            },
            // 视角
            currentView: 1,
            // 渠道
            currentTab: 1,
            timer: null,
            scrollTop: 0,
            // 刷新间隔
            duration: 30000
            // duration: 999999999
        }
    },
    methods: {
        showTips () {
        this.$modal.show({
          methods: {
            handleClose() {
              this.$modal.hide('thisModal')
            }
          },
          render() {
            return <div>
                <div style={{height: '50px', background: '#46bca0', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px'}}>
                  <div style={{display: 'flex', alignItems: 'center'}}>
                    <a-icon type="question-circle" style={{ fontSize: '24px' }}/>
                    <div class="ml10" style={{ fontSize: '16px' }}>视角说明</div>
                  </div>
                  <div onClick={this.handleClose} style={{padding: '4px', cursor: 'pointer'}}>
                    <a-icon type="close" style={{ fontSize: '14px'}}/>
                  </div>
                </div>
              <div style={{color: 'rgba(0,0,0,.65)', padding: '24px', background: `url(${require('@/assets/images/notification-bg.png')}) right bottom/100px auto no-repeat`}}>
                <div class="mb15" style={{display: 'flex'}}>
                  <span style={{flex: '0 0 auto'}}>一、</span>
                  <span>全司视角：全公司产生业绩汇总，但不含其他（非正常业务产生的业绩）</span>
                </div>
                <div class="mb15" style={{display: 'flex'}}>
                  <span style={{flex: '0 0 auto'}}>二、</span>
                  <span>全中视角：全司视角的统计对象基础上，但不含①定制&拎包、②品牌市场所属业绩、③其他</span>
                </div>
                <div style={{display: 'flex'}}>
                  <span style={{flex: '0 0 auto'}}>三、</span>
                  <span>品市视角：母婴店、快手店、抖音店，海外B2C的汇总业绩</span>
                </div>
              </div>
            </div>
          }
        }, {}, {
          name: 'thisModal',
          width: 450,
          height: 'auto',
          styles: {borderRadius: '12px', overflow: 'hidden'}
        })
      },
        handleContextMenuClick(type) {
            if (this.loading) {
                return
            }
        },
        cancelExport() {

        },
    }
}
</script>

<style lang='scss' scoped>
.block1{
    width: 100%;
    background: #FFFFFF;
    border-radius: 2px;
    margin-bottom: 16px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    .topBox{
        height: 55px;
        padding: 0 24px;
        border-bottom: 1px solid #F0F0F0;
        .left{
            font-size: 16px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 600;
            color: rgba(0, 0, 0, 0.88);
            line-height: 24px;
        }
        .right{
            /deep/ .ant-radio-group{
                display: flex;
            }
        }
    }
    .component{
        flex: 1
    }
}
.block2{
    width: 100%;
    background: #FFFFFF;
    border-radius: 2px;
    margin-bottom: 37px;
    overflow: hidden;
}
</style>