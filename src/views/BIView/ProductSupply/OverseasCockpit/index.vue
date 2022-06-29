<!--
 * @Author: 黄浩
 * @Date: 2022-01-04 15:39:12
 * @LastEditTime: 2022-02-17 15:05:41
 * @LastEditors: Please set LastEditors
 * @Descripttion: 海外驾驶舱
 * @FilePath: \lsmy-bi-lighthouse-front\src\views\BIView\ProductSupply\OverseasCockpit\index.vue
-->
<template>
    <div class="overseasCockpit" id="OverseasCockpit">
        <div class="header" ref="header">
            <HeaderItem @click.native="changeTabV1(item.comp, item.label)" v-for="(item,index) in HeaderItemArr"
                        :key="index" v-bind="item" :class="['headerItem', computeClass(item.comp, index, item.label)]"/>
        </div>
        <div class="tabs-container" ref="tabContainer" style="height: calc(100vh - 250px); opacity: 1;min-height: 596px">
            <div class="tabs-content-wrapper" style="flex: 1;min-height: 554px;overflow-y: overlay">
                <component :is="curTab.comp" ref="curComp"></component>
            </div>
        </div>
    </div>
</template>

<script>
import { dragscroll } from 'vue-dragscroll'
import HeaderItem from '@/views/BIView/ProductSupply/OverseasCockpit/components/HeaderItem.vue'
import base from './utils/base.js'
// 业绩概览
import Comp1 from '@/views/BIView/ProductSupply/OverseasCockpit/tabs/Comp1/index.vue'
// 人员概览
// import Comp2 from '@/views/BIView/ProductSupply/OverseasCockpit/tabs/Comp2/index.vue'
// 访客分析
import Comp3 from '@/views/BIView/ProductSupply/OverseasCockpit/tabs/Comp3/index.vue'
// 广告投入
import Comp4 from '@/views/BIView/ProductSupply/OverseasCockpit/tabs/Comp4/index.vue'
// 广告RoAS
import Comp5 from '@/views/BIView/ProductSupply/OverseasCockpit/tabs/Comp5/index.vue'
// 采购成本
import Comp6 from '@/views/BIView/ProductSupply/OverseasCockpit/tabs/Comp6/index.vue'
// 头程费用
// import Comp7 from '@/views/BIView/ProductSupply/OverseasCockpit/tabs/Comp7/index.vue'
// 仓储费用
// import Comp8 from '@/views/BIView/ProductSupply/OverseasCockpit/tabs/Comp8/index.vue'
// 配送费用
import Comp9 from '@/views/BIView/ProductSupply/OverseasCockpit/tabs/Comp9/index.vue'
// 商品退款 退款率
import Comp10 from '@/views/BIView/ProductSupply/OverseasCockpit/tabs/Comp10/index.vue'
// 年化周转
import Comp11 from '@/views/BIView/ProductSupply/OverseasCockpit/tabs/Comp11/indexV2.vue'
// 定价毛利
import Comp12 from '@/views/BIView/ProductSupply/OverseasCockpit/tabs/Comp12/indexV2.vue'
// 边际毛利(待补充)
import Comp13 from '@/views/BIView/ProductSupply/OverseasCockpit/tabs/Comp13/index.vue'
// 指标说明
import Comp14 from '@/views/BIView/ProductSupply/OverseasCockpit/tabs/Comp14/index.vue'
// 未发取消
import Comp15 from '@/views/BIView/ProductSupply/OverseasCockpit/tabs/Comp15/index.vue'
export default {
    mixins: [ base ],
    directives: {
        dragscroll,
    },
    components: {
        HeaderItem,
        Comp1,
        // Comp2,
        Comp3,
        Comp4,
        Comp5,
        Comp6,
        // Comp7,
        // Comp8,
        Comp9,
        Comp10,
        Comp11,
        Comp12,
        Comp13,
        Comp14,
        Comp15,
    },
    created() {
        this.curTab = {
            label: this.HeaderItemArr[0].label,
            comp: this.HeaderItemArr[0].comp
        }
        this.getHeaderData()
        let that = this
        this.timer = setInterval(() => {
            that.getHeaderData()
        }, 60 * 60 * 1000)
    },
    beforeDestroy() {
        clearInterval(this.timer)
    },
    data() {
        return {
            timer: null,
            // tabs: [
            //     { title: '业绩概览', comp: 'Comp1' },
            //     // { title: '人员概览', comp: 'Comp2' },
            //     { title: '访客分析', comp: 'Comp3' },
            //     { title: '广告投入', comp: 'Comp4' },
            //     { title: '广告RoAS', comp: 'Comp5' },
            //     { title: '采购成本', comp: 'Comp6' },
            //     // { title: '头程费用', comp: 'Comp7' },
            //     // { title: '仓储费用', comp: 'Comp8' },
            //     { title: '配送费用', comp: 'Comp9' },
            //     { title: '退款率', comp: 'Comp10' },
            //     { title: '未发取消', comp: 'Comp15' },
            //     { title: '年化周转', comp: 'Comp11' },
            //     { title: '定价毛利', comp: 'Comp12' },
            //     { title: '边际毛利(待补充)', comp: 'Comp13' },
            //     { title: '指标说明', comp: 'Comp14' },
            // ],
            curTab: {},
            HeaderItemArr: [
                {
                    label: '支付业绩',
                    value: null,
                    label1: '日累计达成',
                    value1: null,
                    label2: '日累计同比',
                    value2: null,
                    comp: 'Comp1',
                },
                {
                    label: '发货业绩',
                    value: null,
                    label1: '日累计达成',
                    value1: null,
                    label2: '日累计同比',
                    value2: null,
                    comp: 'Comp1',
                },
                {
                    subTitle: '(亚马逊)',
                    label: '访客转化率',
                    value: null,
                    label1: '当月目标',
                    value1: null,
                    label2: '同期',
                    value2: null,
                    comp: 'Comp3',
                },
                {
                    subTitle: '(亚马逊)',
                    label: '广告投入占比',
                    value: null,
                    label1: '当月目标',
                    value1: null,
                    label2: '同期',
                    value2: null,
                    comp: 'Comp4',
                },
                {
                    subTitle: '(亚马逊)',
                    label: '广告RoAS',
                    value: null,
                    label1: '当月目标',
                    value1: null,
                    label2: '同期',
                    value2: null,
                    comp: 'Comp5',
                },
                // 原8
                {
                    label: '年化周转',
                    value: null,
                    label1: '当月目标',
                    value1: null,
                    label2: '同期',
                    value2: null,
                    comp: 'Comp6',
                },
                {
                    label: '采购成本',
                    value: null,
                    label1: '同期',
                    value1: null,
                    label2: '同比',
                    value2: null,
                    comp: 'Comp9',
                },
                // 原5
                {
                    label: '定价毛利率',
                    value: null,
                    label1: '当月目标',
                    value1: null,
                    label2: '同期',
                    value2: null,
                    comp: 'Comp10',
                },
                {
                    label: '退款率',
                    value: null,
                    label1: '当月目标',
                    value1: null,
                    label2: '同期',
                    value2: null,
                    comp: 'Comp11',
                },
                {
                    label: '未发取消',
                    value: '待补充',
                    label1: '目标',
                    value1: null,
                    label2: '同期',
                    value2: null,
                    comp: null,
                },
                {
                    label: '滞销',
                    value: '待补充',
                    label1: '目标',
                    value1: null,
                    label2: '同期',
                    value2: null,
                    comp: null,
                },
                {
                    label: '缺货',
                    value: '待补充',
                    label1: '目标',
                    value1: null,
                    label2: '同期',
                    value2: null,
                    comp: null,
                },
                {
                    label: '仓储',
                    value: '待补充',
                    label1: '目标',
                    value1: null,
                    label2: '同期',
                    value2: null,
                    comp: null,
                },
                {
                    label: '物流',
                    value: '待补充',
                    label1: '目标',
                    value1: null,
                    label2: '同期',
                    value2: null,
                    comp: null,
                },
            ],
            topY: null,
            oComp: 'Comp1',
            visible: false,
            // 用户未活动 头部面板为false
            defaultState: false,
            sidebarValue: null,
            showSidebar: true,
        }
    },
    mounted() {
        const that = this
        window.onresize = () => {
            return (() => {
                setTimeout(() => {
                    window.screenWidth = document.body.clientWidth
                    that.topY = that.$refs.header.clientHeight / 1 + 'px'

                }, 100)
            })()
        }
        that.topY = that.$refs.header.clientHeight / 1 + 'px'
    },
    methods: {
        computeClass(comp, index, label) {
            if(!this.defaultState) return
            // if(!comp) return
            // if(comp === 'Comp1' && title === index) return 'active'
            // else if(comp !== 'Comp1') return comp === this.curTab.comp ? 'active' : ''
            if(comp === this.curTab.comp && label === this.curTab.label) return 'active'
            else return ''
        },
        changeTabV1(comp, label) {
            this.defaultState = true
            if(this.curTab.comp === comp && this.curTab.label === label || !comp) return
            this.curTab = this.HeaderItemArr.filter(_ => _.comp === comp && _.label === label)[0]
            if(comp === 'Comp1') {
                this.$nextTick(() => {
                    this.$refs.curComp.radio2.model = label === '支付业绩' ? 1 : 2
                })
            }
        },
        async getHeaderData() {
            let res = await this.$fetchSql('oversea_cockpit', 'oversea_index_set')
            this.HeaderItemArr = [
                {
                    label: '支付业绩',
                    value: null,
                    label1: '日累计达成',
                    value1: null,
                    label2: '日累计同比',
                    value2: null,
                    comp: 'Comp1',
                },
                {
                    label: '发货业绩',
                    value: null,
                    label1: '日累计达成',
                    value1: null,
                    label2: '日累计同比',
                    value2: null,
                    comp: 'Comp1',
                },
                {
                    subTitle: '(亚马逊)',
                    label: '访客转化率',
                    value: null,
                    label1: '当月目标',
                    value1: null,
                    label2: '同期',
                    value2: null,
                    comp: 'Comp3',
                },
                {
                    subTitle: '(亚马逊)',
                    label: '广告投入占比',
                    value: null,
                    label1: '当月目标',
                    value1: null,
                    label2: '同期',
                    value2: null,
                    comp: 'Comp4',
                },
                {
                    subTitle: '(亚马逊)',
                    label: '广告RoAS',
                    value: null,
                    label1: '当月目标',
                    value1: null,
                    label2: '同期',
                    value2: null,
                    comp: 'Comp5',
                },
                // 原8
                {
                    label: '年化周转',
                    value: null,
                    label1: '当月目标',
                    value1: null,
                    label2: '同期',
                    value2: null,
                    comp: 'Comp11',
                },
                {
                    label: '采购成本',
                    value: null,
                    label1: '上期',
                    value1: null,
                    label2: '环比',
                    value2: null,
                    comp: 'Comp6',
                },
                // 原5
                {
                    label: '定价毛利率',
                    value: null,
                    label1: '当月目标',
                    value1: null,
                    label2: '同期',
                    value2: null,
                    comp: 'Comp12',
                },
                {
                    label: '退款率',
                    value: null,
                    label1: '当月目标',
                    value1: null,
                    label2: '同期',
                    value2: null,
                    comp: 'Comp10',
                },
                {
                    label: '待补充',
                    value: null,
                    label1: '目标',
                    value1: null,
                    label2: '同期',
                    value2: null,
                    comp: null,
                },
                {
                    label: '待补充',
                    value: null,
                    label1: '目标',
                    value1: null,
                    label2: '同期',
                    value2: null,
                    comp: null,
                },
                {
                    label: '待补充',
                    value: null,
                    label1: '目标',
                    value1: null,
                    label2: '同期',
                    value2: null,
                    comp: null,
                },
                {
                    label: '待补充',
                    value: null,
                    label1: '目标',
                    value1: null,
                    label2: '同期',
                    value2: null,
                    comp: null,
                },
                {
                    label: '待补充',
                    value: null,
                    label1: '目标',
                    value1: null,
                    label2: '同期',
                    value2: null,
                    comp: null,
                },
            ]
            if(!res.data.length) return
            this.HeaderItemArr.forEach(item => {
                let data = res.data[0]
                if(item.label === '支付业绩'){
                    item.value = this.handleNum('tenThousand', data.BQ_PAY_AMT !== null ? data.BQ_PAY_AMT : 0)
                    item.color = this.handleColor('reach', data.REACH_PAY_AMT)
                    item.value1 = this.handleNum('percent_one_dot', data.REACH_PAY_AMT !== null ? data.REACH_PAY_AMT : 0)
                    item.color1 = this.handleColor('reach', data.REACH_PAY_AMT)
                    item.value2 = this.handleNum('percent_one_dot', data.PAY_AMT_TB)
                    item.color2 = this.handleColor('YOY', data.PAY_AMT_TB)
                }
                else if(item.label === '发货业绩'){
                    item.value = this.handleNum('tenThousand', data.BQ_SENT_AMT !== null ? data.BQ_SENT_AMT : 0)
                    item.color = this.handleColor('reach', data.REACH_SENT_AMT)
                    item.value1 = this.handleNum('percent_one_dot', data.REACH_SENT_AMT !== null ? data.REACH_SENT_AMT : 0)
                    item.color1 = this.handleColor('reach', data.REACH_SENT_AMT)
                    item.value2 = this.handleNum('percent_one_dot', data.SENT_AMT_TB)
                    item.color2 = this.handleColor('YOY', data.SENT_AMT_TB)
                }
                else if(item.label === '访客转化率'){
                    item.value = this.handleNum('percent_one_dot', data.CNT_SALES_RATE)
                    item.color = this.handleColor('diff', this.handleYOYOrReach('diff', data.CNT_SALES_RATE, data.CNT_SALES_TGT))
                    item.value1 = this.handleNum('percent_one_dot', data.CNT_SALES_TGT)
                    item.color1 = ''
                    item.value2 = this.handleNum('percent_one_dot', data.TQ_CNT_SALES_RATE)
                    item.color2 = ''
                }
                else if(item.label === '广告投入占比'){
                    item.value = this.handleNum('percent_one_dot', data.ADV_INV_RATE !== null ? data.ADV_INV_RATE : 0)
                    item.color = this.handleColor('diff_reverse', this.handleYOYOrReach('diff', data.ADV_INV_RATE, data.ADV_INV_RATE_TARGET))
                    item.value1 = this.handleNum('percent_one_dot', data.ADV_INV_RATE_TARGET)
                    item.color1 = ''
                    item.value2 = this.handleNum('percent_one_dot', data.TQ_ADV_INV_RATE)
                    item.color2 = ''
                }
                else if(item.label === '广告RoAS'){
                    item.value = this.handleNum('toFixed2', data.ADV_ROI_RATE !== null ? data.ADV_ROI_RATE : 0)
                    item.color = this.handleColor('diff', this.handleYOYOrReach('diff', data.ADV_ROI_RATE, data.ROI_GARGET))
                    item.value1 = this.handleNum('toFixed2', data.ROI_GARGET)
                    item.color1 = ''
                    item.value2 = this.handleNum('toFixed2', data.TQ_ADV_ROI_RATE)
                    item.color2 = ''
                }
                else if(item.label === '年化周转'){
                    item.value = this.handleNum('toFixed2', data.BQ_TRNVR_RATE !== null ? data.BQ_TRNVR_RATE : 0)
                    item.color = this.handleColor('diff', this.handleYOYOrReach('diff', data.BQ_TRNVR_RATE, data.TRNVR_TG))
                    item.value1 = this.handleNum('toFixed2', data.TRNVR_TG)
                    item.color1 = ''
                    item.value2 = this.handleNum('toFixed2', data.TQ_TRNVR_RATE)
                    item.color2 = ''
                }
                else if(item.label === '采购成本'){
                    item.value = this.handleNum('tenThousand', data.BQ_PUR_AMT !== null ? data.BQ_PUR_AMT : 0)
                    item.color = this.handleColor('diff_reverse', this.handleYOYOrReach('diff', data.BQ_PUR_AMT, data.SQ_PUR_AMT))
                    item.value1 = this.handleNum('tenThousand', data.SQ_PUR_AMT)
                    item.color1 = ''
                    item.value2 = this.handleNum('percent_one_dot', data.PUR_HB)
                    item.color2 = ''
                }
                else if(item.label === '定价毛利率'){
                    item.value = this.handleNum('percent_one_dot', data.BQ_GRS_PRFT)
                    item.color = this.handleColor('diff', this.handleYOYOrReach('diff', data.BQ_GRS_PRFT, data.GROSS_PROFIT_TARGET))
                    item.value1 = this.handleNum('percent_one_dot', data.GROSS_PROFIT_TARGET)
                    item.color1 = ''
                    item.value2 = this.handleNum('percent_one_dot', data.TQ_GRS_PRFT)
                    item.color2 = ''
                }
                else if(item.label === '退款率'){
                    item.value = this.handleNum('percent_two_dot', data.BQ_REFUND_RATE !== null ? data.BQ_REFUND_RATE: 0)
                    item.color = this.handleColor('diff_reverse', this.handleYOYOrReach('diff', data.BQ_REFUND_RATE, data.REFUND_MONTH_TARGET))
                    item.value1 = this.handleNum('percent_one_dot', data.REFUND_MONTH_TARGET)
                    item.color1 = ''
                    item.value2 = this.handleNum('percent_one_dot', data.TQ_REFUND_RATE)
                    item.color2 = ''
                }
            })
        }
    }
}
</script>

<style lang='scss' scoped>
// datepicker的输入框
/deep/ .ant-input{
    font-size: 12px;
}
/deep/ {
    user-select: text;
}
/deep/ .ant-drawer-body{
    padding: 10px;
}
// VirtualSelect
/deep/ .select-container .flex-start:nth-child(1) span:nth-child(1){
    font-size: 12px!important;
}
///deep/ > .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
//    border-color: #6bc9b0;
//    color: #fff;
//    background: #6bc9b0;
//}
///deep/ > .ant-radio-button-wrapper{
//    height: auto;
//    padding: 0 2px;
//    border-radius: 4px 0 0 4px;
//    border: 1px solid #d9d9d9;
//    color: #bbb;
//    span:nth-child(2) {
//        width: 20px;
//        display: inline-block;
//        word-break: break-word;
//        text-align: center;
//    }
//}
///deep/ > .ant-radio-button-wrapper:hover {
//    color: #46BCA0
//}
///deep/ > .ant-radio-button-wrapper::before{
//    display: none;
//}
///deep/ > .ant-radio-group{
//    width: 30px;
//    display: flex;
//    flex-direction: column;
//    align-items: center;
//}
.overseasCockpit{
    user-select: none;
    height: 100vh;
    min-width: 1550px;
    background: #eef1f6;
    padding: 10px 2%;
    overflow-y: auto;
    scrollbar-width: thin;
    position: relative;
    /deep/ .ant-radio-checked .ant-radio-inner {
        border-color: #39ad36;
    }
    /deep/ .ant-radio-inner::after {
        background-color: #39ad36;
    }
    .header{
        display: flex;
        flex-wrap: wrap;
        transition: background 1s ease 0s;
        .headerItem{
            transition: all 0.3s ;
        }
        .headerItem:hover {
            transform: translateY(-5px);
            box-shadow: 0 3px 6px 2px rgba(0, 0, 0, 0.2), 0 3px 4px 2px rgba(0, 0, 0, 0.12);
        }
        .active {
            transform: translateY(-5px);
            box-shadow: 0 3px 6px 2px rgba(0, 0, 0, 0.2), 0 3px 4px 2px rgba(0, 0, 0, 0.12);
        }
        .active::before{
            position: absolute;
            left: 0;
            top: 0;
            border-radius: 6px 6px 0 0;
            content: "";
            width: 100%;
            height: 4px;
            background: #46bca0;
        }
    }
    .tabs-container {
        background: #fff;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
        display: flex;
        flex-direction: column;
        .comp-tabs {
            padding: 8px 10px 8px;
            border-bottom: 1px solid #eee;
            overflow: hidden;
        }

        .tab-item {
            padding: 5px 10px;
            span {
            color: #888e99;
            }
            &.active span {
            color: rgb(70, 188, 160);
            }

            &:hover {
            cursor: pointer;
            }

            & > span {
            white-space: nowrap;
            }
        }

        .tabs-content-wrapper{
            // flex: 1;
            height: 554px;
            display: flex;
            flex-direction: column;
        }
    }
}
</style>