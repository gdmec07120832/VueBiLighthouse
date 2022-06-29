<template>
    <div class="Panels">
        <div class="circlePanel" @click="clickPanel('circle')"
             :class="{'active': currentPanel === 'circle' ? true: false}">
            <CircleEchart
                class="circle"
                :value="
                    dateV2.dayOrMonth === 1 ?
                    radio2.model === 1 ? circlePanel.dataSource.REACH_PAY_AMT : circlePanel.dataSource.REACH_SENT_AMT :
                    radio2.model === 1 ? circlePanel.dataSource.pay_reach : circlePanel.dataSource.dev_reach
                "
                :comp="'Comp1'"
                :label="dateV2.dayOrMonth === 1 ? '累计\n达成' : '达成'"
            />
            <Panel v-bind="circlePanel" class="panel"/>
        </div>
        <template v-for="item in panels">
            <div style="width: 1px;height: calc(100% - 20px);background: #eee" :key="'box' + item.name"></div>
            <Panel
                v-bind="item"
                class="item"
                @clickPanel="clickPanel"
                :class="{'active': currentPanel === item.name ? true: false}"
                :key="item.name"
            />
        </template>
    </div>
</template>

<script>
import CircleEchart from '../../../components/CircleEchart'
import Panel from '../../../components/Panel'
import _ from 'lodash'
import moment from 'moment'
export default {
    components: {
        CircleEchart,
        Panel,
    },
    props: {
        dateV2: {
            type: Object
        },
        // radio2.model === 1为支付口径 2为发货口径
        radio2: {
            type: Object
        }
    },
    async created() {
        await this.getShopNameArr()
        if(this.dateV2.dayOrMonth === 1) this.getDay()
        else this.getMonth()
    },
    watch: {
        'radio2.model': {
            handler(){
                if(this.dateV2.dayOrMonth === 1) this.getDay()
                else this.getMonth()
            }
        },
        dateV2:{
            handler(){
                if(this.dateV2.dayOrMonth === 1) this.getDay()
                else this.getMonth()
            },
            deep: true
        }
    },
    computed: {
        circlePanel() {
            let isPay = this.radio2.model === 1 ? true : false
            let isDay = this.dateV2.dayOrMonth === 1 ? true : false
            let obj = {
                name: '',
                tabIndex: 'Comp1',
                row: 5,
                column: 2,
                area: [
                    ['a', 'a'],
                    ['b', 'b'],
                    ['c', 'c_v'],
                    ['d', 'd_v'],
                    ['e', 'e_v'],
                ],
                map: [
                    {areaName: 'a', value: '', className: 'title'},
                    {
                        areaName: 'b',
                        keyName: isDay ?
                            isPay ? 'BQ_PAY_AMT' : 'BQ_SENT_AMT' :
                            isPay ? 'PTD_PAY_AMT' : 'PTD_DEV_AMT',
                        className: 'subTitle',
                        valueFormat: 'tenThousand_one_dot'
                    },
                    {areaName: 'c', value: isDay ? '日累计目标' : '目标', className: 'label'},
                    {
                        areaName: 'c_v',
                        keyName: isDay ?
                            isPay ? 'BQ_PAY_TGT' : 'BQ_SEND_TARGET' :
                            isPay ? 'PTD_PAY_TGT' : 'PTD_DEV_TGT',
                        className: 'value',
                        valueFormat: 'tenThousand'
                    },
                    {areaName: 'd', value: isDay ? '日累计达成' : '达成率', className: 'label'},
                    {
                        areaName: 'd_v',
                        keyName: isDay ?
                            isPay ? 'REACH_PAY_AMT' : 'REACH_SENT_AMT' :
                            isPay ? 'pay_reach' : 'dev_reach',
                        className: 'value',
                        valueFormat: 'percent_one_dot',
                        colorFormat: 'reach',
                    },
                    {areaName: 'e', value: isDay ? '日累计同比' : '同比', className: 'label'},
                    {
                        areaName: 'e_v',
                        keyName: isDay ?
                            isPay ? 'PAY_AMT_TB' : 'SENT_AMT_TB' :
                            isPay ? 'pay_YOY' : 'dev_YOY',
                        className: 'value',
                        valueFormat: 'percent_one_dot',
                        colorFormat: 'YOY',
                    },
                ],
                dataSource: {}
            }
            obj.name = 'circle'
            obj.dataSource = this.circlePanelDataSource
            if(this.dateV2.dayOrMonth === 1) obj.map[0].value = '当月累计'
            else if(this.dateV2.dayOrMonth === 2) obj.map[0].value = '全年汇总'
            return obj
        },
        panels() {
            let arr = []
            let isDay = this.dateV2.dayOrMonth === 1 ? true : false
            let isPay = this.radio2.model === 1 ? true : false
            this.SHOP_CHNL.forEach((name) => {
                let panel = {
                    name: '',
                    tabIndex: 'Comp1',
                    row: 5,
                    column: 2,
                    area: [
                        ['a', 'a'],
                        ['b', 'b'],
                        ['c', 'c_v'],
                        ['d', 'd_v'],
                        ['e', 'e_v'],
                    ],
                    map: [
                        {areaName: 'a', value: '', className: 'title'},
                        {
                            areaName: 'b',
                            keyName: isDay ?
                                isPay ? 'BQ_PAY_AMT' : 'BQ_SENT_AMT' :
                                isPay ? 'PTD_PAY_AMT' : 'PTD_DEV_AMT',
                            className: 'subTitle',
                            valueFormat: 'tenThousand_one_dot'
                        },
                        {areaName: 'c', value: isDay ? '日累计目标' : '目标', className: 'label'},
                        {
                            areaName: 'c_v',
                            keyName: isDay ?
                                isPay ? 'BQ_PAY_TGT' : 'BQ_SEND_TARGET' :
                                isPay ? 'PTD_PAY_TGT' : 'PTD_DEV_TGT',
                            className: 'value',
                            valueFormat: 'tenThousand'
                        },
                        {areaName: 'd', value: isDay ? '日累计达成' : '达成率', className: 'label'},
                        {
                            areaName: 'd_v',
                            keyName: isDay ?
                                isPay ? 'REACH_PAY_AMT' : 'REACH_SENT_AMT' :
                                isPay ? 'pay_reach' : 'dev_reach',
                            className: 'value',
                            valueFormat: 'percent_one_dot',
                            colorFormat: 'reach',
                        },
                        {areaName: 'e', value: isDay ? '日累计同比' : '同比', className: 'label'},
                        {
                            areaName: 'e_v',
                            keyName: isDay ?
                                isPay ? 'PAY_AMT_TB' : 'SENT_AMT_TB' :
                                isPay ? 'pay_YOY' : 'dev_YOY',
                            className: 'value',
                            valueFormat: 'percent_one_dot',
                            colorFormat: 'YOY',
                        },
                    ],
                    dataSource: {}
                }
                panel.name = name
                panel.map[0].value = name
                arr.push(panel)
            })
            return arr
        },
    },
    data() {
        return {
            circlePanelDataSource: {},
            // panels: [],
            currentPanel: 'circle',
            SHOP_CHNL: [],
        }
    },
    methods: {
        clickPanel(val) {
            this.currentPanel = val
            this.$emit('clickPanel', val)
        },
        async getShopNameArr() {
            let res = await this.$fetchSql('oversea_cockpit', 'oversea_perf_overview_src')
            let sortObj = {
                亚马逊: 0,
                Walmart: 1,
                Shopline: 2,
                wayfair: 3,
                其他: 4
            }
            res.data.sort((a, b) => {
                return sortObj[a.SHOP_CHNL] - sortObj[b.SHOP_CHNL]
            })
            this.SHOP_CHNL = Object.freeze(Array.from(new Set(res.data.map(_ => _.SHOP_CHNL).filter(_ => ![null].includes(_)))))
        },
        // async getDay() {
        //     let arr = this.panels.map((_, index) => {
        //         return {
        //             panel: this.panels[index],
        //             SHOP_CHNL: _.name
        //         }
        //     })
        //     arr = arr.map(async item => {
        //         let queryItem = {
        //             MDATE: this.dateV2.day2,
        //             SHOP_CHNL: item.SHOP_CHNL
        //         }
        //         let res = await this.$fetchSql('oversea_cockpit', 'oversea_perf_overview_d', queryItem)
        //         return {
        //             ...item,
        //             data: res.data.filter(_ => _.TDATE_DAY !== '合计')
        //         }
        //     })
        //     let arrRes = await Promise.all(arr)
        //     arrRes.forEach(item => {
        //         this.handleData('dayPanel', item.data, item.panel)
        //     })
        //     let query = {
        //         MDATE: this.dateV2.day2
        //     }
        //     let res = await this.$fetchSql('oversea_cockpit', 'oversea_perf_overview_d', query)
        //     this.handleData('dayPanel', res.data.filter(_ => _.TDATE_DAY !== '合计'), this.circlePanel)
        // },
        async getDay() {
            let query = {
                MDATE: this.dateV2.day2,
            }
            let res = await this.$fetchSql('oversea_cockpit', 'oversea_perf_overview_ov', query)
            this.handleData('dayPanel', res.data)
        },
        async getMonth() {
            let arr = this.panels.map((_, index) => {
                return {
                    panel: this.panels[index],
                    SHOP_CHNL: _.name
                }
            })
            arr = arr.map(async item => {
                let queryItem = {
                    START_TIME: this.dateV2.month2 + '01',
                    END_TIME: this.dateV2.month2 + '12',
                    SHOP_CHNL: item.SHOP_CHNL
                }
                let res = await this.$fetchSql('oversea_cockpit', 'oversea_perf_overview_m', queryItem)
                return {
                    ...item,
                    data: res.data
                }
            })
            let arrRes = await Promise.all(arr)
            arrRes.forEach(item => {
                this.handleData('monthPanel', item.data, item.panel)
            })
            let query = {
                START_TIME: this.dateV2.month2 + '01',
                END_TIME: this.dateV2.month2 + '12'
            }
            let res = await this.$fetchSql('oversea_cockpit', 'oversea_perf_overview_m', query)
            this.handleData('monthPanel', res.data, this.circlePanel)
        },
        computeReachOrYOY(type, a, b) {
            if (type === 'reach') {
                if ([undefined, null].includes(a) || [undefined, null, 0].includes(b)) return null
                else return a / b
            } else if (type === 'YOY') {
                if ([undefined, null].includes(a) || [undefined, null, 0].includes(b)) return null
                else return (a - b) / b
            }
        },
        handleData(type, source, target) {
            // if (type === 'dayPanel') {
            //     let arr = source.concat()
            //     arr.sort((a, b) => a.TDATE_DAY - b.TDATE_DAY)
            //     if(this.dateV2.day2 === moment().format('YYYYMM')) {
            //         arr = arr.filter(_ => _.TDATE_DAY <= moment().format('DD'))
            //     }
            //     target.dataSource = {}
            //     if(target.name === 'circle') this.circlePanelDataSource = {}
            //     if (!arr.length) return
            //     let initial = {
            //         PTD_PAY_AMT: 0,
            //         PTD_PAY_TGT: 0,
            //         PTD_DEV_AMT: 0,
            //         PTD_DEV_TGT: 0,
            //         TQ_PTD_PAY_AMT: 0,
            //         TQ_PTD_DEV_AMT: 0,
            //     }
            //     let sum = arr.reduce((a, b) => {
            //         let a_obj = _.cloneDeep(initial)
            //         let b_obj = _.cloneDeep(initial)
            //         for (let key in a_obj) {
            //             if (a[key]) a_obj[key] = a[key]
            //         }
            //         for (let key in b_obj) {
            //             if (b[key]) b_obj[key] = b[key]
            //         }
            //         return {
            //             PTD_PAY_AMT: a_obj.PTD_PAY_AMT + b_obj.PTD_PAY_AMT,
            //             PTD_PAY_TGT: a_obj.PTD_PAY_TGT + b_obj.PTD_PAY_TGT,
            //             PTD_DEV_AMT: a_obj.PTD_DEV_AMT + b_obj.PTD_DEV_AMT,
            //             PTD_DEV_TGT: a_obj.PTD_DEV_TGT + b_obj.PTD_DEV_TGT,
            //             TQ_PTD_PAY_AMT: a_obj.TQ_PTD_PAY_AMT + b_obj.TQ_PTD_PAY_AMT,
            //             TQ_PTD_DEV_AMT: a_obj.TQ_PTD_DEV_AMT + b_obj.TQ_PTD_DEV_AMT,
            //         }
            //     }, initial)
            //     sum.pay_reach = this.computeReachOrYOY('reach', sum.PTD_PAY_AMT, sum.PTD_PAY_TGT)
            //     sum.dev_reach = this.computeReachOrYOY('reach', sum.PTD_DEV_AMT, sum.PTD_DEV_TGT)
            //     sum.pay_YOY = this.computeReachOrYOY('YOY', sum.PTD_PAY_AMT, sum.TQ_PTD_PAY_AMT)
            //     sum.dev_YOY = this.computeReachOrYOY('YOY', sum.PTD_DEV_AMT, sum.TQ_PTD_DEV_AMT)
            //     if (target.name === 'circle'){
            //         this.circlePanelDataSource = sum
            //         return
            //     }
            //     target.dataSource = sum
            // }
            if(type === 'dayPanel'){
                let arr = source.concat()
                if(!arr.length) return
                arr.forEach(item => {
                    if(item.CHANNEL === '合计') this.circlePanelDataSource = item
                    else {
                        let index = this.panels.findIndex(_ => _.name === item.CHANNEL)
                        this.panels[index].dataSource = item
                    }
                })
            }
            else if(type === 'monthPanel'){
                let arr = source.concat()
                target.dataSource = {}
                if(target.name === 'circle') this.circlePanelDataSource = {}
                if(!arr.length) return
                let sum = arr.filter(_ => _.MDATE_MONTH === '合计')
                if(sum.length) sum = sum[0]
                sum.pay_reach = this.computeReachOrYOY('reach', sum.PTD_PAY_AMT, sum.PTD_PAY_TGT)
                sum.dev_reach = this.computeReachOrYOY('reach', sum.PTD_DEV_AMT, sum.PTD_DEV_TGT)
                let pay_amt = 0
                let pay_amt_ago = 0
                let dev_amt = 0
                let dev_amt_ago = 0
                if(arr.length) {
                    let targetArr
                    if(this.dateV2.month2 === moment().format('YYYY')) {
                        targetArr = arr.filter(_ => _.MDATE_MONTH !== '合计' && _.MDATE <= moment().format('YYYYMM'))
                    }
                    else targetArr = arr.filter(_ => _.MDATE_MONTH !== '合计')
                    pay_amt = targetArr.map(_ => _.PTD_PAY_AMT).reduce((a, b) => a + b)
                    pay_amt_ago = targetArr.map(_ => _.AGO_PAY_AMT).reduce((a, b) => a + b)
                    dev_amt = targetArr.map(_ => _.PTD_DEV_AMT).reduce((a, b) => a + b)
                    dev_amt_ago = targetArr.map(_ => _.AGO_DEV_AMT).reduce((a, b) => a + b)
                }
                // sum.pay_YOY = this.computeReachOrYOY('YOY', sum.PTD_PAY_AMT, sum.AGO_PAY_AMT)
                // sum.dev_YOY = this.computeReachOrYOY('YOY', sum.PTD_DEV_AMT, sum.AGO_DEV_AMT)
                sum.pay_YOY = this.computeReachOrYOY('YOY', pay_amt, pay_amt_ago)
                sum.dev_YOY = this.computeReachOrYOY('YOY', dev_amt, dev_amt_ago)
                if(target.name === 'circle'){
                    this.circlePanelDataSource = sum
                    return
                }
                target.dataSource = sum
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.Panels {
    height: 120px;
    display: flex;
    align-items: center;

    .active {
        background: rgba(0, 0, 0, 0.03);
    }

    .circlePanel {
        height: 120px;
        width: calc(100% / 6 + 100px);
        display: flex;
        align-items: center;

        &:hover {
            background: rgba(0, 0, 0, 0.03);
        }

        .circle {
            height: 120px;
            width: 120px;
            flex: none;
        }

        /deep/ .panel {
            padding: 0 30px 0 10px;

            .row:nth-child(1) {
                margin-top: 10px;
            }

            .row:nth-child(3) {
                margin-top: 5px;
            }

            .row:nth-child(3), .row:nth-child(4), .row:nth-child(5) {
                .column:nth-child(2) {
                    //text-align: right;
                }
            }
        }
    }

    /deep/ .item {
        &:hover {
            background: rgba(0, 0, 0, 0.03);
        }

        padding: 0 30px 0 10px;
        width: calc(100% / 6 - 20px);

        .row:nth-child(1) {
            margin-top: 10px;
        }

        .row:nth-child(3) {
            margin-top: 5px;
        }
        .row:nth-child(3), .row:nth-child(4), .row:nth-child(5) {
            .column:nth-child(2) {
                //text-align: right;
            }
        }
        &:nth-last-child(1){
            padding: 0 10px
        }
    }
}
</style>