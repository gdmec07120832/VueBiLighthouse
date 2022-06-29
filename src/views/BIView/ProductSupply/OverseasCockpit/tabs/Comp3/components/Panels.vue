<template>
    <div class="Panels">
        <div class="box" style="width: 220px;height: 100%;flex: none;display: flex;align-items: center;cursor: pointer"
        :class="{'active': currentPanel === panel.name ? true: false}"
        @click="clickPanel('访客转化率')"
        >
            <div class="leftBox" style="position: relative;width: 120px;height: 100%">
                <div class="text-xs text-black" style="position: absolute;top: 5px;left: 10px;">访客转化率</div>
                <div class="text-black" :class="computeColor(dateV2.dayOrMonth === 1 ? dayOverview.PTD_PAY_RATE : monthOverview.PTD_PAY_RATE)" style="font-size: 20px;font-weight: bold;position: absolute;top: 50%;left: 10px;margin-top: 2px;transform: translateY(-50%)">{{ handleNum('percent_one_dot', dateV2.dayOrMonth === 1 ? dayOverview.PTD_PAY_RATE : monthOverview.PTD_PAY_RATE) }}</div>
            </div>
            <Panel
            style="flex: 1"
            v-bind="panel"
            class="item"
            />
        </div>
        <div
        class="circlePanel"
        @click="clickPanel('访客量')"
        :class="{'active': currentPanel === '访客量' ? true: false}"
        style="position: relative"
        >
            <div class="text-xs text-black" style="position: absolute;top: 5px;left: 10px;">访客量</div>
            <CircleEchart ref="circle1" class="circle" :value="dateV2.dayOrMonth === 1 ? dayOverview.PTD_VISITOR_RATE : monthOverview.PTD_VISITOR_RATE" :comp="'Comp3'" :id="1"/>
            <Panel v-bind="circlePanel1" class="panel"/>
        </div>
        <div
        class="circlePanel"
        @click="clickPanel('销量')"
        :class="{'active': currentPanel === '销量' ? true: false}"
        style="position: relative"
        >
            <div class="text-xs text-black" style="position: absolute;top: 5px;left: 10px;">销量</div>
            <CircleEchart ref="circle2" class="circle" :value="dateV2.dayOrMonth === 1 ? dayOverview.PTD_SALES_RATE : monthOverview.PTD_SALES_RATE" :comp="'Comp3'" :id="2"/>
            <Panel v-bind="circlePanel2" class="panel"/>
        </div>
    </div>
</template>

<script>
import Panel from '../../../components/Panel'
import CircleEchart from "../../../components/CircleEchart";
import base from '../../../utils/base.js'
import _ from 'lodash'
import moment from 'moment'
export default {
    mixins: [base],
    components: {
        Panel,
        CircleEchart,
    },
    props: {
        dateV2: {
            type: Object
        }
    },
    created(){
        if(this.dateV2.dayOrMonth === 1) this.getDayOverview()
        else if(this.dateV2.dayOrMonth === 2) this.getMonthOverview()
    },
    watch: {
        'dateV2.dayOrMonth': {
            handler(val){
                if(val === 1) this.getDayOverview()
                else if(val === 2) this.getMonthOverview()
                this.currentPanel = '访客转化率'
                this.$emit('clickPanel', '访客转化率')
            }
        },
        'dateV2.month2': {
            handler(){
                this.getMonthOverview()
            }
        },
        'dateV2.day2': {
            handler(){
                this.getDayOverview()
            }
        }
    },
    data() {
        return {
            panel: {
                name: '访客转化率',
                tabIndex: 'Comp3',
                row: 4,
                column: 1,
                area: [
                    ['a'],
                    ['a_v'],
                    ['b'],
                    ['b_v']
                ],
                map: [
                    {areaName: 'a', value: '转化率目标', className: 'label'},
                    {areaName: 'a_v', keyName: 'PTD_PAY_RATE_TGT', className: 'value', valueFormat: 'percent_one_dot'},
                    {areaName: 'b', value: '同期转化率', className: 'label'},
                    {areaName: 'b_v', keyName: 'LAST_PAY_RATE', className: 'value', valueFormat: 'percent_one_dot'},
                ],
                dataSource: {}
            },
            circlePanel1: {
                name: '访客量',
                tabIndex: 'Comp3',
                row: 4,
                column: 2,
                area: [
                    ['a', 'b'],
                    ['a_v', 'b_v'],
                    ['c', 'd'],
                    ['c_v', 'd_v'],
                ],
                map: [
                    {areaName: 'a', value: '访客量目标', className: 'label'},
                    {areaName: 'a_v', keyName: 'PTD_VISITOR_TGT', className: 'value', valueFormat: 'round'},
                    {areaName: 'b', value: '同期访客量', className: 'label'},
                    {areaName: 'b_v', keyName: 'LAST_VISITOR_CNT', className: 'value', valueFormat: 'round'},
                    {areaName: 'c', value: '访客量', className: 'label'},
                    {areaName: 'c_v', keyName: 'PTD_VISITOR_CNT', className: 'value', valueFormat: 'round'},
                    {areaName: 'd', value: '访客量同比', className: 'label'},
                    {areaName: 'd_v', keyName: 'YOY_PTD_VISITOR_CNT', className: 'value', valueFormat: 'percent_one_dot'},
                ],
                dataSource: {}
            },
            circlePanel2: {
                name: '销量',
                tabIndex: 'Comp3',
                row: 4,
                column: 2,
                area: [
                    ['a', 'b'],
                    ['a_v', 'b_v'],
                    ['c', 'd'],
                    ['c_v', 'd_v'],
                ],
                map: [
                    {areaName: 'a', value: '销量目标', className: 'label'},
                    {areaName: 'a_v', keyName: 'PTD_SALES_TGT', className: 'value', valueFormat: 'round'},
                    {areaName: 'b', value: '同期销量', className: 'label'},
                    {areaName: 'b_v', keyName: 'LAST_SALES_AMT', className: 'value', valueFormat: 'round'},
                    {areaName: 'c', value: '销量', className: 'label'},
                    {areaName: 'c_v', keyName: 'PTD_SALES_AMT', className: 'value', valueFormat: 'round'},
                    {areaName: 'd', value: '销量同比', className: 'label'},
                    {areaName: 'd_v', keyName: 'YOY_PTD_SALES_AMT', className: 'value', valueFormat: 'percent_one_dot'},
                ],
                dataSource: {}
            },
            dayOverview: {},
            data_day: [],
            monthOverview: {},
            data_month: [],
            currentPanel: '访客转化率'
        }
    },
    methods: {
        computeColor(value){
            if([null, undefined, '--'].includes(value)) return ''
            if(value > 1) return 'red'
            else return 'green'
        },
        clickPanel(val){
            this.currentPanel = val
            this.$emit('clickPanel', val)
        },
        async getDayOverview(){
            let query = {
                MDATE: this.dateV2.day2
            }
            let res = await this.$fetchSql('oversea_cockpit', 'oversea_visitor_anal_ov',query)
            this.data_day = res.data.concat()
            this.handleData('day', res.data)
        },
        async getMonthOverview(){
            let query = {
                // YDATE: this.dateV2.month2
                START_TIME: this.dateV2.month2 + '01',
                END_TIME: this.dateV2.month2 + '12'
            }
            let res = await this.$fetchSql('oversea_cockpit', 'oversea_visitor_anal_m',query)
            this.data_month = res.data.concat()
            this.handleData('month', res.data)
        },
        handleData(type, source){
            if(type === 'day'){
                this.dayOverview = {}
                this.panel.dataSource = {}
                this.circlePanel1.dataSource = {}
                this.circlePanel2.dataSource = {}
                let arr = source.concat()
                if(!arr.length) return
                let obj = _.cloneDeep(arr[0])
                // 访客量同比
                obj.YOY_PTD_VISITOR_CNT = this.handleYOYOrReach('YOY', obj.PTD_VISITOR_CNT, obj.LAST_VISITOR_CNT)
                // 销量同比
                obj.YOY_PTD_SALES_AMT = this.handleYOYOrReach('YOY', obj.PTD_SALES_AMT, obj.LAST_SALES_AMT)
                this.dayOverview = obj
                this.panel.dataSource = obj
                this.circlePanel1.dataSource = obj
                this.circlePanel2.dataSource = obj
            }
            else if(type === 'month'){
                let arr = source.concat()
                this.monthOverview = {}
                this.panel.dataSource = {}
                this.circlePanel1.dataSource = {}
                this.circlePanel2.dataSource = {}
                if(!arr.length) return
                let initial = {
                    PTD_VISITOR_CNT: 0,
                    AGO_VISITOR_CNT: 0,
                    PTD_VISITOR_TGT: 0,
                    PTD_SALES_AMT: 0,
                    AGO_SALES_AMT: 0,
                    PTD_SALES_TGT: 0,
                }
                let sum = arr.filter(_ => moment(_.MDATE + '01').format('x') <= moment().format('x')).reduce((a, b) => {
                    let obj = _.cloneDeep(initial)
                    for(let key in obj){
                        obj[key] = a[key] + b[key]
                    }
                    return obj
                }, initial)
                sum.PTD_PAY_RATE = this.handleYOYOrReach('reach', sum.PTD_SALES_AMT, sum.PTD_VISITOR_CNT)
                sum.LAST_PAY_RATE = this.handleYOYOrReach('reach', sum.AGO_SALES_AMT, sum.AGO_VISITOR_CNT)
                sum.PTD_PAY_RATE_TGT = null

                sum.LAST_VISITOR_CNT = sum.AGO_VISITOR_CNT
                sum.YOY_PTD_VISITOR_CNT = this.handleYOYOrReach('YOY', sum.PTD_VISITOR_CNT, sum.LAST_VISITOR_CNT)
                sum.PTD_VISITOR_RATE = this.handleYOYOrReach('reach', sum.PTD_VISITOR_CNT, sum.PTD_VISITOR_TGT)

                sum.LAST_SALES_AMT = sum.AGO_SALES_AMT
                sum.YOY_PTD_SALES_AMT = this.handleYOYOrReach('YOY', sum.PTD_SALES_AMT, sum.LAST_SALES_AMT)
                sum.PTD_SALES_RATE = this.handleYOYOrReach('reach', sum.PTD_SALES_AMT, sum.PTD_SALES_TGT)
                this.monthOverview = sum
                this.panel.dataSource = sum
                this.circlePanel1.dataSource = sum
                this.circlePanel2.dataSource = sum
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.red {
    color: #ff5953!important;
}
.green {
    color: #00a854!important;
}
.Panels {
    height: 120px;
    display: flex;
    align-items: center;

    .active {
        background: rgba(0, 0, 0, 0.03);
    }
    .box:hover{
        background: rgba(0, 0, 0, 0.03);
    }
    .circlePanel {
        height: 120px;
        width: 320px;
        display: flex;
        align-items: center;
        cursor: pointer;
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
                margin-top: 20px;
            }
            .row:nth-child(3) {
                margin-top: 10px;
            }
            .row{
                .column:nth-child(2) {
                    text-align: right;
                }
            }
        }
    }

    /deep/ .item {
        padding: 0 30px 0 10px;
        width: 320px;

        .row:nth-child(1) {
            margin-top: 20px;
        }

        .row:nth-child(3) {
            margin-top: 10px;
        }
        .row{
            .column:nth-child(2) {
                text-align: right;
            }
        }
        &:nth-last-child(1){
            padding: 0 10px
        }
    }
}
</style>