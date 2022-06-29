<template>
    <div class="RealTimePerformance">
        <div class="selects">
<!--            <div class="text-xs text-black" style="font-weight: bold">{{radio.value}}</div>-->
            <div class="title_1">{{radio.value}}</div>
            <div style="flex: 1;"></div>
            <Radio v-bind.sync="radio"/>
            <span class="mr10" style="display: none">视角&nbsp;<a-icon @click="showTips" type="question-circle" style="color: rgba(0, 0, 0, 0.45);cursor: pointer;"/></span>
            <Radio style="display: none" v-bind.sync="viewRadio"/>
        </div>
        <RealTimeOverview :duration="duration" :currentView="currentView" :currentTab.sync="currentTab" v-if="radio.value === '渠道总览'"/>
        <ChannelDetails :duration="duration" :currentView="currentView" :currentTab.sync="currentTab" v-if="radio.value === '店铺/区域'"/>
    </div>
</template>

<script>
import Radio from '../../../components/Radio'
import RealTimeOverview from './components/RealTimeOverview'
// import ChannelDetails from './components/ChannelDetails'
import ChannelDetails from './components/ChannelDetailsV1'
export default {
    components: {
        Radio,
        RealTimeOverview,
        ChannelDetails,
    },
    watch: {
        'viewRadio.value': {
            handler(val) {
                let map = {
                    全司视角: 1,
                    全中视角: 2,
                    品市视角: 3,
                }
                this.currentView = map[val]
            }
        }
    },
    data() {
        return {
            radio: {
                value: '渠道总览',
                options: ['渠道总览', '店铺/区域'],
            },
            viewRadio: {
                value: '全司视角',
                options: ['全司视角', '全中视角', '品市视角'],
            },
            // duration: 999999999,
            duration: 30000,
            // 视角
            currentView: 2,
            // 渠道
            currentTab: 1,
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
    }
}
</script>

<style lang="scss" scoped>
@import '../../../assets/styles';

.RealTimePerformance{
    .selects{
        height: 28px;
        display: flex;
        align-items: center;
    }
}
</style>