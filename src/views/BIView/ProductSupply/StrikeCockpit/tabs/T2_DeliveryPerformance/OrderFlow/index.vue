<template>
    <div class="OrderFlow">
        <div class="leftBox">
            <div class="title_1" style="height: 30px;line-height: 30px">发货达成</div>
            <TableRow v-bind.sync="table" class="mt10"/>
            <div class="title_2 mt20">待处理情况</div>
            <v-chart ref="singleBar" style="overflow: visible;height: calc(50% - 131.5px)" :options="singleBar" autoresize/>
            <div class="title_2 mt10">当天累计处理情况</div>
            <v-chart ref="singleBar" style="overflow: visible;height: calc(50% - 131.5px)" :options="singleBar1" autoresize/>
        </div>
        <div style="width: 64px"></div>
        <div class="rightBox" ref="rightBox">
            <div class="select" style="display: flex;align-items: center;">
                <div class="title_1">待货审订单分布</div>
                <!--                <div class="title_1" style="font-weight: normal">承诺时间分布</div>-->
                <div style="flex: 1"></div>
                <!--                <Radio v-bind.sync="includeDeliverGoods"/>-->
                <!--                <div class="text-xs text-black mr10">是否含待通知发货</div>-->
                <!--                <a-switch class="mr10" checked-children="是" un-checked-children="否" v-model="includeDeliverGoods.value"/>-->
                <virtual-select
                    style="width: 180px;margin-right: 20px"
                    v-model="selects[0].value"
                    :label="selects[0].label"
                    :options="selects[0].options.map((_) => ({ label: _ }))"
                    :allowShowClear="false"
                ></virtual-select>
                <virtual-select
                    style="width: 180px;margin-right: 0"
                    v-model="selects[1].value"
                    :label="selects[1].label"
                    :options="selects[1].options.map((_) => ({ label: _ }))"
                    :allowShowClear="false"
                ></virtual-select>
                <!--                <Select v-for="(item, index) in selects" v-bind.sync="item" :key="index" class="ml10"/>-->
            </div>
            <Panels class="mt10" :selects="selects" @clickPanel="clickPanel"/>
<!--            <div class="panelBox mt10">-->
<!--                <Panel v-bind="panel[0]"/>-->
<!--                <div style="width: 75px"></div>-->
<!--                <Panel v-bind="panel[1]"/>-->
<!--            </div>-->
            <div class="mt20" style="display: flex;align-items: center;justify-content: space-between">
                <div class="title_1" style="font-weight: normal">承诺时间分布</div>
                <Radio v-bind.sync="goodstype" style="display: flex;align-items: center;justify-content: flex-end"/>
            </div>
            <Panel class="middlePanel" v-bind="panel2" style="height: auto;"/>
            <!--            <Radio v-bind.sync="includeDeliverGoods" style="margin-top: 26px;display: flex;align-items: center;justify-content: flex-end"/>-->
            <TableRow class="table1" :style="{'--table1TdHeight': table1TdHeight}" style="margin-top: 30px" v-bind="table1"/>
        </div>
    </div>
</template>

<script>
import base from '../../../utils/base.js'
import TableRow from '../../../components/TableRow'
import Panel from '../../../components/Panel'
// import Select from '../../components/Select'
import Radio from '../../../components/Radio'
import VirtualSelect from '@/views/BIView/components/VSelect/VSelectV3'
import Panels from './components/Panels'
import _ from 'lodash'
export default {
    mixins: [ base ],
    components: {
        TableRow,
        Panel,
        // Select,
        Radio,
        VirtualSelect,
        Panels,
    },
    async created() {
        let that = this
        this.singleBar = await this.createDoubleBar({
            tooltipFormatter: ['round'],
            xAxisLabelFormatter: 'normal',
            yAxisLabelFormatter: 'normal'
        })
        this.singleBar.yAxis[0].splitLine.show = false
        this.singleBar1 = await this.createDoubleBar({
            tooltipFormatter: ['round'],
            xAxisLabelFormatter: 'normal',
            yAxisLabelFormatter: 'normal'
        })
        this.singleBar1.yAxis[0].splitLine.show = false
        this.singleBar.grid.top = 20
        this.singleBar.yAxis[0].axisLabel.show = false
        this.singleBar.series[0].label.formatter = function(item) {
            return that.handleNum('round', item.value)
        }
        this.singleBar.series[0].data = [
            {name: '待客审', value: null},
            {name: '当月待货审', value: null},
            {name: '待财审', value: null},
            {name: '待打印', value: null},
            {name: '待发货', value: null},
        ]
        this.singleBar.xAxis[0].data = ['待客审', '待货审', '待财审', '待打印', '待发货']
        this.singleBar1.grid.top = 20
        this.singleBar1.series[0].label.formatter = function(item) {
            return that.handleNum('round', item.value)
        }
        this.singleBar1.yAxis[0].axisLabel.show = false
        this.singleBar1.series[0].data = [
            {name: '已客审', value: null},
            {name: '已货审', value: null},
            {name: '已财审', value: null},
            {name: '已打印', value: null},
            {name: '已发货', value: null},
        ]
        this.singleBar1.xAxis[0].data = ['已客审', '已货审', '已财审', '已打印', '已发货']
        await this.getOptions()
        this.getTable()
        this.getBar()
        this.getPanel()
        this.getPanel1()
        this.getTable1()
    },
    mounted() {
        let that = this
        // that.table1TdHeight = (that.$refs.rightBox.offsetHeight / 2 - 131.5 + 21) / 6 + 'px'
        that.table1TdHeight = (that.$refs.rightBox.offsetHeight - 350) / 6 + 'px'
        window.addEventListener('resize', this.event)
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.event)
    },
    watch: {
        currentPanel: {
            handler(){
                this.getPanel1()
                this.getTable1()
            }
        },
        'selects.0.value': {
            handler(val, oval){
                let diff = []
                if(val.length > oval.length) {
                    diff = val.filter(_ => !oval.includes(_))
                }
                else if(oval.length > val.length) {
                    diff = oval.filter(_ => !val.includes(_))
                }
                if(diff.includes('全部') && val.length > oval.length){
                    if(oval.length > 0){
                        this.selects[0].value = ['全部']
                    }
                }
                else if(!diff.includes('全部') && val.length > oval.length){
                    this.selects[0].value = this.selects[0].value.filter(_ => _ !== '全部')
                }
                if(val.length === 0){
                    this.selects[0].value = ['全部']
                }
                if(val.toString() === '全部'){
                    this.selects[1].options = Array.from(new Set(this.allOptions.map(_ => _.CHNL_TYPE)))
                }
                else{
                    this.selects[1].options = Array.from(new Set(this.allOptions.filter(_ => val.includes(_.CHNL_NAME)).map(_ => _.CHNL_TYPE)))
                }
            }
        },
        'selects.1.value': {
            handler(val, oval){
                let diff = []
                if(val.length > oval.length) {
                    diff = val.filter(_ => !oval.includes(_))
                }
                else if(oval.length > val.length) {
                    diff = oval.filter(_ => !val.includes(_))
                }
                if(diff.includes('全部') && val.length > oval.length){
                    if(oval.length > 0){
                        this.selects[1].value = ['全部']
                    }
                }
                else if(!diff.includes('全部') && val.length > oval.length){
                    this.selects[1].value = this.selects[1].value.filter(_ => _ !== '全部')
                }
                if(val.length === 0){
                    this.selects[1].value = ['全部']
                }
            }
        },
        twoSelect: {
            handler(){
                this.getPanel1()
                this.getTable1()
            }
        },
        // 'includeDeliverGoods.value': {
        //     handler(){
        //         this.getPanel1()
        //         this.getTable1()
        //     }
        // },
        'table.currentClick': {
            handler(){
                this.getBar()
            }
        },
        'goodstype.value': {
            handler(val){
                console.log(val)
                this.getPanel1()
            }
        }
    },
    computed: {
        twoSelect(){
            return this.selects[0].value.toString() + '&&' + this.selects[1].value.toString()
        },
        panel2(){
            let flag = this.goodstype.value === '待货审' ? true : false
            return {
                name: '待货审订单',
                tabIndex: 'T2_DeliveryPerformance',
                row: 3,
                column: 8,
                area: [
                    // ['a', 'a', 'b', 'b', 'c', 'c'],
                    // ['d', 'd', 'e', 'e', 'f', 'f'],
                    // ['g', 'h', 'i', 'j', 'k', 'l'],
                    ['a', 'a', 'b', 'b', 'c', 'c', 'd', 'd'],
                    ['e', 'e', 'f', 'f', 'g', 'g', 'h', 'h'],
                    ['i', 'j', 'k', 'l', 'm', 'n', 'o', 'p'],
                ],
                map: [
                    // {areaName: 'a', value: '按承诺本月发货', className: 'title'},
                    // {areaName: 'b', value: '承诺次月发货', className: 'title'},
                    // {areaName: 'c', value: '承诺次月后发货', className: 'title'},
                    // {areaName: 'd', keyName: 'PTD_THIS_COMMIT_SEND_AMT', className: 'subTitle', valueFormat: 'round'},
                    // {areaName: 'e', keyName: 'PTD_NEXT_COMMIT_SEND_AMT', className: 'subTitle', valueFormat: 'round'},
                    // {areaName: 'f', keyName: 'PTD_AFTER_COMMIT_SEND_AMT', className: 'subTitle', valueFormat: 'round',},
                    // {areaName: 'g', value: '占总待货审金额比', className: 'label'},
                    // {areaName: 'h', keyName: 'PTD_THIS_COMMIT_SEND_RATE', className: 'value', valueFormat: 'percent'},
                    // {areaName: 'i', value: '占总待货审金额比', className: 'label'},
                    // {areaName: 'j', keyName: 'PTD_NEXT_COMMIT_SEND_RATE', className: 'value', valueFormat: 'percent',},
                    // {areaName: 'k', value: '占总待货审金额比', className: 'label'},
                    // {areaName: 'l', keyName: 'PTD_AFTER_COMMIT_SEND_RATE', className: 'value', valueFormat: 'percent'},

                    {areaName: 'a', value: flag ? '到期待货审' : '到期可货审', className: 'title'},
                    {areaName: 'b', value: '按承诺本月发货', className: 'title'},
                    {areaName: 'c', value: '承诺次月发货', className: 'title'},
                    {areaName: 'd', value: '承诺次月后发货', className: 'title'},

                    {areaName: 'e', keyName: flag ? 'PTD_DUE_COMMIT_SEND_AMT' : 'PTD_DUE_COMMIT_AUDIT_AMT', className: 'subTitle', valueFormat: 'round'},
                    {areaName: 'f', keyName: flag ? 'PTD_THIS_COMMIT_SEND_AMT' : 'PTD_THIS_COMMIT_AUDIT_AMT', className: 'subTitle', valueFormat: 'round'},
                    {areaName: 'g', keyName: flag ? 'PTD_NEXT_COMMIT_SEND_AMT' : 'PTD_NEXT_COMMIT_AUDIT_AMT', className: 'subTitle', valueFormat: 'round'},
                    {areaName: 'h', keyName: flag ? 'PTD_AFTER_COMMIT_SEND_AMT' : 'PTD_AFTER_COMMIT_AUDIT_AMT', className: 'subTitle', valueFormat: 'round'},

                    {areaName: 'i', value: '占比', className: 'label'},
                    {areaName: 'j', keyName: flag ? 'PTD_DUE_COMMIT_SEND_RATE' : 'PTD_DUE_COMMIT_ADUIT_RATE', className: 'value', valueFormat: 'percent'},
                    {areaName: 'k', value: '占比', className: 'label'},
                    {areaName: 'l', keyName: flag ? 'PTD_THIS_COMMIT_SEND_RATE' : 'PTD_THIS_COMMIT_ADUIT_RATE', className: 'value', valueFormat: 'percent'},
                    {areaName: 'm', value: '占比', className: 'label'},
                    {areaName: 'n', keyName: flag ? 'PTD_NEXT_COMMIT_SEND_RATE' : 'PTD_NEXT_COMMIT_ADUIT_RATE', className: 'value', valueFormat: 'percent',},
                    {areaName: 'o', value: '占比', className: 'label'},
                    {areaName: 'p', keyName: flag ? 'PTD_AFTER_COMMIT_SEND_RATE' : 'PTD_AFTER_COMMIT_ADUIT_RATE', className: 'value', valueFormat: 'percent'},
                ],
                dataSource: this.panel2Datasource
            }
        }
    },
    data() {
        let that = this
        let event = function() {
            setTimeout(() => {
                // that.table1TdHeight = (that.$refs.rightBox.offsetHeight / 2 - 131.5 + 21) / 6 + 'px'
                that.table1TdHeight = (that.$refs.rightBox.offsetHeight - 350) / 6 + 'px'
            }, 200)
        }
        this.getTable1 = _.debounce(this.getTable1, 200, {
            leading: false,
            trailing: true
        })
        this.getBar = _.debounce(this.getBar, 200, {
            leading: false,
            trailing: true
        })
        return {
            goodstype: {
                value: '待货审',
                options: ['待货审', '可货审']
            },
            currentPanel: 0,
            event: event,
            table: {
                // height: '200px',
                maxHeight: 'calc(100% - 59px)',
                height: 'calc(100% - 59px)',
                sorting: {
                    field: 'rownum',
                    order: 'asc',
                },
                currentClick: {
                    i: 0,
                    value: null,
                },
                header: {
                    area: [
                        ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
                    ],
                    data: {
                        a: '渠道',
                        b: '月目标',
                        c: '本月累计发货',
                        d: '日累计达成',
                        e: '今日发货',
                        f: '剩余日均',
                        g: '今天计划发货',
                    },
                },
                // 配置字段
                // valueFormat sumFirstFormat sumLastFormat 可以是字符串或函数
                tableColumn: [
                    {key: 'CHNL_NAME', areaName: 'a', canClick: true,},
                    {key: 'PTD_SEND_TGT', areaName: 'b', valueFormat: 'round'},
                    {key: 'PTD_SEND_AMT', areaName: 'c', valueFormat: 'round'},
                    {key: 'PTD_SEND_RATE', areaName: 'd', valueFormat: 'percent', colorFormat: 'reach'},
                    {key: 'DAY_SEND_AMT', areaName: 'e', valueFormat: 'round'},
                    {key: 'PTD_DAILY_SURP_TGT', areaName: 'f', valueFormat: 'round'},
                    {key: 'PTD_TODAY_EST_AMT', areaName: 'g', valueFormat: 'round'},
                ],
                // 合并项
                // 首行或首列 尾行或尾列
                sum: {
                    first: {
                        show: false,
                    },
                    last: {
                        show: false,
                    }
                },
                // 放数据
                dataSource: [
                    {
                        CHNL_NAME: '合计',
                        PTD_SEND_TGT: '/',
                        PTD_SEND_AMT: '/',
                        PTD_SEND_RATE: '/',
                        DAY_SEND_AMT: '/',
                        PTD_DAILY_SURP_TGT: '/',
                        PTD_TODAY_EST_AMT: '/',
                    },
                    {
                        CHNL_NAME: '线上渠道',
                        PTD_SEND_TGT: '/',
                        PTD_SEND_AMT: '/',
                        PTD_SEND_RATE: '/',
                        DAY_SEND_AMT: '/',
                        PTD_DAILY_SURP_TGT: '/',
                        PTD_TODAY_EST_AMT: '/',
                    },
                    {
                        CHNL_NAME: '线下渠道',
                        PTD_SEND_TGT: '/',
                        PTD_SEND_AMT: '/',
                        PTD_SEND_RATE: '/',
                        DAY_SEND_AMT: '/',
                        PTD_DAILY_SURP_TGT: '/',
                        PTD_TODAY_EST_AMT: '/',
                    },
                    {
                        CHNL_NAME: '海外渠道',
                        PTD_SEND_TGT: '/',
                        PTD_SEND_AMT: '/',
                        PTD_SEND_RATE: '/',
                        DAY_SEND_AMT: '/',
                        PTD_DAILY_SURP_TGT: '/',
                        PTD_TODAY_EST_AMT: '/',
                    },
                ],
                pagination: {
                    show: false
                },
            },
            singleBar: null,
            singleBar1: null,
            panel: [
                {
                    name: '按承诺发货订单',
                    tabIndex: 'T2_DeliveryPerformance',
                    row: 6,
                    column: 6,
                    area: [
                        ['a', 'a', 'a', 'a', 'a', 'a'],
                        ['b', 'b', 'b', 'b', 'b', 'b'],
                        ['c', 'c', 'c', 'd', 'd', 'd'],
                        ['e0', 'e0', 'f0', 'f0', 'g0', 'g0'],
                        ['e1', 'e1', 'f1', 'f1', 'g1', 'g1'],
                        ['e2', 'e3', 'f2', 'f3', 'g2', 'g3'],
                    ],
                    map: [
                        {areaName: 'a', value: '按承诺发货订单', className: 'title'},
                        {areaName: 'b', keyName: 'PTD_COMMIT_SEND_AMT_0', className: 'subTitle', valueFormat: 'round'},
                        {areaName: 'c', value: '占比', className: 'label'},
                        {areaName: 'd', keyName: 'PTD_COMMIT_SEND_RATE_0', className: 'value',  valueFormat: 'percent'},
                        {areaName: 'e0', value: '线上渠道', className: 'label'},
                        {areaName: 'f0', value: '线下渠道', className: 'label'},
                        {areaName: 'g0', value: '海外渠道', className: 'label'},
                        {areaName: 'e1', keyName: 'PTD_COMMIT_SEND_AMT_1', className: 'value', valueFormat: 'hundredMillion_double_dot',},
                        {areaName: 'f1', keyName: 'PTD_COMMIT_SEND_AMT_2', className: 'value', valueFormat: 'hundredMillion_double_dot',},
                        {areaName: 'g1', keyName: 'PTD_COMMIT_SEND_AMT_3', className: 'value', valueFormat: 'hundredMillion_double_dot',},
                        {areaName: 'e2', value: '占比', className: 'label'},
                        {areaName: 'f2', value: '占比', className: 'label'},
                        {areaName: 'g2', value: '占比', className: 'label'},
                        {areaName: 'e3', keyName: 'PTD_COMMIT_SEND_RATE_1', className: 'value', valueFormat: 'percent'},
                        {areaName: 'f3', keyName: 'PTD_COMMIT_SEND_RATE_2', className: 'value', valueFormat: 'percent'},
                        {areaName: 'g3', keyName: 'PTD_COMMIT_SEND_RATE_3', className: 'value', valueFormat: 'percent'},
                        // {areaName: 'e', value: '线上渠道', className: 'label'},
                        // {areaName: 'f', keyName: 'PTD_COMMIT_SEND_AMT_1', className: 'value', valueFormat: 'hundredMillion_double_dot',},
                        // {areaName: 'g', value: '占比', className: 'label'},
                        // {areaName: 'h', keyName: 'PTD_COMMIT_SEND_RATE_1', className: 'value', valueFormat: 'percent'},
                        // {areaName: 'i', value: '线下渠道', className: 'label'},
                        // {areaName: 'j', keyName: 'PTD_COMMIT_SEND_AMT_2', className: 'value', valueFormat: 'hundredMillion_double_dot',},
                        // {areaName: 'k', value: '占比', className: 'label'},
                        // {areaName: 'l', keyName: 'PTD_COMMIT_SEND_RATE_2', className: 'value', valueFormat: 'percent'},
                        // {areaName: 'm', value: '海外渠道', className: 'label'},
                        // {areaName: 'n', keyName: 'PTD_COMMIT_SEND_AMT_3', className: 'value', valueFormat: 'hundredMillion_double_dot',},
                        // {areaName: 'o', value: '占比', className: 'label'},
                        // {areaName: 'p', keyName: 'PTD_COMMIT_SEND_RATE_3', className: 'value', valueFormat: 'percent'},
                    ],
                    dataSource: {
                        PTD_COMMIT_SEND_AMT_0: '--',
                        PTD_COMMIT_SEND_AMT_1: '--',
                        PTD_COMMIT_SEND_AMT_2: '--',
                        PTD_COMMIT_SEND_AMT_3: '--',
                        PTD_COMMIT_SEND_RATE_0: '--',
                        PTD_COMMIT_SEND_RATE_1: '--',
                        PTD_COMMIT_SEND_RATE_2: '--',
                        PTD_COMMIT_SEND_RATE_3: '--',

                    }
                },
                {
                    name: '待通知发货订单',
                    tabIndex: 'T2_DeliveryPerformance',
                    row: 6,
                    column: 6,
                    area: [
                        ['a', 'a', 'a', 'a', 'a', 'a'],
                        ['b', 'b', 'b', 'b', 'b', 'b'],
                        ['c', 'c', 'c', 'd', 'd', 'd'],
                        ['e0', 'e0', 'f0', 'f0', 'g0', 'g0'],
                        ['e1', 'e1', 'f1', 'f1', 'g1', 'g1'],
                        ['e2', 'e3', 'f2', 'f3', 'g2', 'g3'],
                    ],
                    map: [
                        {areaName: 'a', value: '待通知发货订单', className: 'title'},
                        {areaName: 'b', keyName: 'PTD_WAIT_INFO_SEND_AMT_0', className: 'subTitle', valueFormat: 'round'},
                        {areaName: 'c', value: '占比', className: 'label'},
                        {areaName: 'd', keyName: 'PTD_WAIT_INFO_SEND_RATE_0', className: 'value',  valueFormat: 'percent'},
                        {areaName: 'e0', value: '线上渠道', className: 'label'},
                        {areaName: 'f0', value: '线下渠道', className: 'label'},
                        {areaName: 'g0', value: '海外渠道', className: 'label'},
                        {areaName: 'e1', keyName: 'PTD_WAIT_INFO_SEND_AMT_1', className: 'value', valueFormat: 'hundredMillion_double_dot',},
                        {areaName: 'f1', keyName: 'PTD_WAIT_INFO_SEND_AMT_2', className: 'value', valueFormat: 'hundredMillion_double_dot',},
                        {areaName: 'g1', keyName: 'PTD_WAIT_INFO_SEND_AMT_3', className: 'value', valueFormat: 'hundredMillion_double_dot',},
                        {areaName: 'e2', value: '占比', className: 'label'},
                        {areaName: 'f2', value: '占比', className: 'label'},
                        {areaName: 'g2', value: '占比', className: 'label'},
                        {areaName: 'e3', keyName: 'PTD_WAIT_INFO_SEND_RATE_1', className: 'value', valueFormat: 'percent'},
                        {areaName: 'f3', keyName: 'PTD_WAIT_INFO_SEND_RATE_2', className: 'value', valueFormat: 'percent'},
                        {areaName: 'g3', keyName: 'PTD_WAIT_INFO_SEND_RATE_3', className: 'value', valueFormat: 'percent'},

                        // {areaName: 'a', value: '待通知发货订单', className: 'title'},
                        // {areaName: 'b', keyName: 'PTD_WAIT_INFO_SEND_AMT_0', className: 'subTitle', valueFormat: 'round'},
                        // {areaName: 'c', value: '占比', className: 'label'},
                        // {areaName: 'd', keyName: 'PTD_WAIT_INFO_SEND_RATE_0', className: 'value',  valueFormat: 'percent'},
                        // {areaName: 'e', value: '线上渠道', className: 'label'},
                        // {areaName: 'f', keyName: 'PTD_WAIT_INFO_SEND_AMT_1', className: 'value', valueFormat: 'hundredMillion_double_dot',},
                        // {areaName: 'g', value: '占比', className: 'label'},
                        // {areaName: 'h', keyName: 'PTD_WAIT_INFO_SEND_RATE_1', className: 'value', valueFormat: 'percent'},
                        // {areaName: 'i', value: '线下渠道', className: 'label'},
                        // {areaName: 'j', keyName: 'PTD_WAIT_INFO_SEND_AMT_2', className: 'value', valueFormat: 'hundredMillion_double_dot',},
                        // {areaName: 'k', value: '占比', className: 'label'},
                        // {areaName: 'l', keyName: 'PTD_WAIT_INFO_SEND_RATE_2', className: 'value', valueFormat: 'percent'},
                        // {areaName: 'm', value: '海外渠道', className: 'label'},
                        // {areaName: 'n', keyName: 'PTD_WAIT_INFO_SEND_AMT_3', className: 'value', valueFormat: 'hundredMillion_double_dot',},
                        // {areaName: 'o', value: '占比', className: 'label'},
                        // {areaName: 'p', keyName: 'PTD_WAIT_INFO_SEND_RATE_3', className: 'value', valueFormat: 'percent'},
                    ],
                    dataSource: {
                        PTD_WAIT_INFO_SEND_AMT_0: '--',
                        PTD_WAIT_INFO_SEND_AMT_1: '--',
                        PTD_WAIT_INFO_SEND_AMT_2: '--',
                        PTD_WAIT_INFO_SEND_AMT_3: '--',
                        PTD_WAIT_INFO_SEND_RATE_0: '--',
                        PTD_WAIT_INFO_SEND_RATE_1: '--',
                        PTD_WAIT_INFO_SEND_RATE_2: '--',
                        PTD_WAIT_INFO_SEND_RATE_3: '--',

                    }
                },
            ],
            panel2Datasource: {},
            selects: [
                {
                    label: '渠道分类',
                    value: ['全部'],
                    options: ['全部', '线上渠道', '线下渠道', '海外渠道', '其它'],
                },
                {
                    label: '渠道细分',
                    value: ['全部'],
                    options: ['全部', '线上平台', '线上外包', '线下经销', '线下直营', '线下定制', '线下拎包', '其它'],
                },
            ],
            // includeDeliverGoods: {
            //     // label: '是否含待通知发货',
            //     value: true,
            //     // options: ['是', '否']
            // },
            table1: {
                // height: '200px',
                maxHeight: 'calc(100% - 59px)',
                height: 'calc(100% - 59px)',
                sorting: {
                    field: 'rownum',
                    order: 'asc',
                },
                currentClick: {
                    i: 0,
                    value: null,
                },
                header: {
                    area: [
                        ['a', 'b', 'c', 'd', 'e', 'f'],
                    ],
                    data: {
                        a: '时间区间',
                        b: '待货审业绩',
                        c: '金额占比',
                        d: '订单匹配率（总仓）',
                        e: '订单匹配率（总仓&供应仓）',
                        f: '可货审金额',
                    },
                },
                // 配置字段
                // valueFormat sumFirstFormat sumLastFormat 可以是字符串或函数
                tableColumn: [
                    {key: 'DURATION', areaName: 'a', valueFormat: 'normal'},
                    {key: 'PTD_WAIT_GOODS_AUD_AMT', areaName: 'b', valueFormat: 'round'},
                    {key: 'PTD_WAIT_GOODS_AUD_RATE', areaName: 'c', valueFormat: 'percent'},
                    {key: 'PTD_ZK_SUP_RATE', areaName: 'd', valueFormat: 'percent'},
                    {key: 'PTD_LK_SUP_RATE', areaName: 'e', valueFormat: 'percent'},
                    {key: 'PTD_CAN_GOODS_AUD_AMT', areaName: 'f', valueFormat: 'round'},
                ],
                // 合并项
                // 首行或首列 尾行或尾列
                sum: {
                    first: {
                        show: false,
                        // 暂时只能固定一行 一列 多的会被覆盖
                        sticky: true,
                    },
                    last: {
                        show: false,
                    }
                },
                // 放数据
                dataSource: [
                    {DURATION: '汇总', PTD_WAIT_GOODS_AUD_AMT: '/', PTD_WAIT_GOODS_AUD_RATE: '/', PTD_ZK_SUP_RATE: '/', PTD_LK_SUP_RATE: '/'},
                    {DURATION: '到期订单', PTD_WAIT_GOODS_AUD_AMT: '/', PTD_WAIT_GOODS_AUD_RATE: '/', PTD_ZK_SUP_RATE: '/', PTD_LK_SUP_RATE: '/'},
                    {DURATION: '0-14天', PTD_WAIT_GOODS_AUD_AMT: '/', PTD_WAIT_GOODS_AUD_RATE: '/', PTD_ZK_SUP_RATE: '/', PTD_LK_SUP_RATE: '/'},
                    {DURATION: '15-28天', PTD_WAIT_GOODS_AUD_AMT: '/', PTD_WAIT_GOODS_AUD_RATE: '/', PTD_ZK_SUP_RATE: '/', PTD_LK_SUP_RATE: '/'},
                    {DURATION: '4周以上', PTD_WAIT_GOODS_AUD_AMT: '/', PTD_WAIT_GOODS_AUD_RATE: '/', PTD_ZK_SUP_RATE: '/', PTD_LK_SUP_RATE: '/'},
                ],
                pagination: {
                    show: false
                },
            },
            table1TdHeight: '25px',
            allOptions: [],
        }
    },
    methods: {
        clickPanel(val){
            this.currentPanel = val
        },
        // 发货达成 左上
        async getTable(){
            let res = await this.$fetchSql('all_center', 'all_center_send_order_reach')
            this.handleData('table', res.data)
        },
        // 待处理情况 左中 左下
        async getBar(){
            let query = {}
            let { value, i } = this.table.currentClick
            if(value !== '合计' && i !== 0) query.CHNL_NAME = value
            let res = await this.$fetchSql('all_center', 'all_center_send_order_handle', query)
            this.handleData('bar', res.data)
        },
        // 右上
        async getPanel(){
            let res = await this.$fetchSql('all_center', 'all_center_send_order_distri')
            this.handleData('panel', res.data)
        },
        // 待货审订单筛选项
        async getOptions(){
            let res = await this.$fetchSql('all_center', 'all_center_send_spot_src')
            this.allOptions = res.data.concat()
            let sortObj = {
                '全部': 0,
                '线上': 1,
                '线下': 2,
                '海外': 3,
                '其它': 4
            }
            let sortObj_1 = {
                '全部': 0,
                '线上平台': 1,
                '线上外包': 2,
                '线下直营': 3,
                '线下经销': 4,
                '线下家装': 5,
                '线下定制': 6,
                '线下拎包': 7,
                '海外B2B': 8,
                '其它': 9
            }
            res.data.sort((a, b) => {
                let a_i = 5, b_i = 5
                for(let key in sortObj){
                    if(a.CHNL_NAME.indexOf(key) > -1) a_i = sortObj[key]
                    if(b.CHNL_NAME.indexOf(key) > -1) b_i = sortObj[key]
                }
                return a_i - b_i
            })
            this.selects[0].options = await Array.from(new Set(res.data.map(_ => _.CHNL_NAME)))
            this.selects[0].options.unshift('全部')
            this.selects[0].value = ['全部']
            res.data.sort((a, b) => {
                let a_i = 10, b_i = 10
                for(let key in sortObj_1){
                    if(a.CHNL_TYPE.indexOf(key) > -1) a_i = sortObj_1[key]
                    if(b.CHNL_TYPE.indexOf(key) > -1) b_i = sortObj_1[key]
                }
                return a_i - b_i
            })
            this.selects[1].options = await Array.from(new Set(res.data.map(_ => _.CHNL_TYPE)))
            this.selects[1].options.unshift('全部')
            this.selects[1].value = ['全部']
        },
        // 右中
        async getPanel1(){
            let query = {}
            // if(!this.includeDeliverGoods.value) query.IS_WAIT_SEND = '否'
            if(this.currentPanel === 1) query.IS_WAIT_SEND = '否'
            else if(this.currentPanel === 2) query.IS_WAIT_SEND = '是'
            if(this.selects[0].value.toString() !== '全部') query.CHNL_NAME = this.selects[0].value.toString()
            if(this.selects[1].value.toString() !== '全部') query.CHNL_TYPE = this.selects[1].value.toString()
            let api = this.goodstype.value === '待货审' ?
                'all_center_send_order_goods_ord' :
                'all_center_send_order_goods_can'
            let res = await this.$fetchSql('all_center', api, query)
            this.handleData('panel1', res.data)
        },
        // 右下
        async getTable1(){
            let query = {}
            // if(!this.includeDeliverGoods.value) query.IS_WAIT_SEND = '否'
            if(this.currentPanel === 1) query.IS_WAIT_SEND = '否'
            else if(this.currentPanel === 2) query.IS_WAIT_SEND = '是'
            if(this.selects[0].value.toString() !== '全部') query.CHNL_NAME = this.selects[0].value.toString()
            if(this.selects[1].value.toString() !== '全部') query.CHNL_TYPE = this.selects[1].value.toString()
            let res = await this.$fetchSql('all_center', 'all_center_send_order_goods_range', query)
            this.handleData('table1', res.data)
        },
        handleData(type, source){
            if(type === 'table'){
                let arr = _.cloneDeep(source)
                let empty = {
                    CHNL_NAME: '合计',
                    PTD_SEND_AMT: '/',
                    PTD_SEND_RATE: '/',
                    PTD_DAILY_SURP_TGT: '/',
                    PTD_TODAY_EST_AMT: '/',
                    PTD_TMORO_EST_AMT: '/',
                    PTD_NEXT_EST_AMT: '/',
                }
                this.table.dataSource = ['合计', '线上渠道', '线下渠道', '海外渠道'].map(CHNL_NAME => {
                    let item = _.cloneDeep(empty)
                    item.CHNL_NAME = CHNL_NAME
                    return item
                })
                if(!arr.length) return
                let obj = { 合计: 0, 线上渠道: 1, 线下渠道: 2, 海外渠道: 3}
                arr.sort((a, b) => obj[a.CHNL_NAME] - obj[b.CHNL_NAME])
                arr = arr.map(_ => {
                    return {
                        ..._,
                        CHNL_NAME: _.CHNL_NAME
                    }
                })
                this.table.dataSource = arr
            }
            else if(type === 'bar'){
                let arr = _.cloneDeep(source)
                let obj = [
                    {name: '待客审', value: null, key: 'PTD_WAIT_CS_AUD_AMT'},
                    {name: '待货审', value: null, key: 'PTD_WAIT_GOODS_AUD_AMT'},
                    {name: '待财审', value: null, key: 'PTD_WAIT_FIN_AUD_AMT'},
                    {name: '待打印', value: null, key: 'PTD_WAIT_PRINT_AMT'},
                    {name: '待发货', value: null, key: 'PTD_WAIT_SEND_AMT'},
                ]
                let obj1 = [
                    {name: '已客审', value: null, key: 'PTD_CS_AUD_AMT'},
                    {name: '已货审', value: null, key: 'PTD_GOODS_AUD_AMT'},
                    {name: '已财审', value: null, key: 'PTD_FIN_AUD_AMT'},
                    {name: '已打印', value: null, key: 'PTD_PRINT_AMT'},
                    {name: '已发货', value: null, key: 'PTD_SEND_AMT'},
                ]
                this.singleBar.series[0].data = _.cloneDeep(obj)
                this.singleBar1.series[0].data = _.cloneDeep(obj1)
                if(!arr.length) return
                this.singleBar.series[0].data = obj.map(item => {
                    return {
                        ...item,
                        value: arr[0][item.key]
                    }
                })
                this.singleBar1.series[0].data = obj1.map(item => {
                    return {
                        ...item,
                        value: arr[0][item.key]
                    }
                })
            }
            else if(type === 'panel'){
                let arr = _.cloneDeep(source)
                let obj = {汇总: 0, 线上渠道: 1, 线下渠道: 2, 海外渠道: 3}
                arr = arr.sort((a, b) => obj[a.CHNL_NAME] - obj[b.CHNL_NAME])
                let newObj = {}
                for(let key in obj){
                    let PTD_COMMIT_SEND_AMT = null
                    if(arr.filter(_ => _.CHNL_NAME === key).length) PTD_COMMIT_SEND_AMT = arr.filter(_ => _.CHNL_NAME === key)[0].PTD_COMMIT_SEND_AMT
                    newObj['PTD_COMMIT_SEND_AMT_' + obj[key]] = PTD_COMMIT_SEND_AMT
                    let PTD_COMMIT_SEND_RATE = null
                    if(arr.filter(_ => _.CHNL_NAME === key).length) PTD_COMMIT_SEND_RATE = arr.filter(_ => _.CHNL_NAME === key)[0].PTD_COMMIT_SEND_RATE
                    newObj['PTD_COMMIT_SEND_RATE_' + obj[key]] = PTD_COMMIT_SEND_RATE
                }
                let newObj1 = {}
                for(let key in obj){
                    let PTD_WAIT_INFO_SEND_AMT = null
                    if(arr.filter(_ => _.CHNL_NAME === key).length) PTD_WAIT_INFO_SEND_AMT = arr.filter(_ => _.CHNL_NAME === key)[0].PTD_WAIT_INFO_SEND_AMT
                    let PTD_WAIT_INFO_SEND_RATE = null
                    if(arr.filter(_ => _.CHNL_NAME === key).length) PTD_WAIT_INFO_SEND_RATE = arr.filter(_ => _.CHNL_NAME === key)[0].PTD_WAIT_INFO_SEND_RATE
                    newObj1['PTD_WAIT_INFO_SEND_AMT_' + obj[key]] = PTD_WAIT_INFO_SEND_AMT
                    newObj1['PTD_WAIT_INFO_SEND_RATE_' + obj[key]] = PTD_WAIT_INFO_SEND_RATE
                }
                this.panel[0].dataSource = newObj
                this.panel[1].dataSource = newObj1
            }
            else if(type === 'panel1'){
                let arr = _.cloneDeep(source)
                this.panel2Datasource = arr[0]
                return
            }
            else if(type === 'table1'){
                let arr = _.cloneDeep(source)
                this.table1.dataSource = [
                    {DURATION: '汇总', PTD_WAIT_GOODS_AUD_AMT: '/', PTD_WAIT_GOODS_AUD_RATE: '/', PTD_ZK_SUP_RATE: '/', PTD_LK_SUP_RATE: '/', PTD_CAN_GOODS_AUD_AMT: '/'},
                    {DURATION: '到期订单', PTD_WAIT_GOODS_AUD_AMT: '/', PTD_WAIT_GOODS_AUD_RATE: '/', PTD_ZK_SUP_RATE: '/', PTD_LK_SUP_RATE: '/', PTD_CAN_GOODS_AUD_AMT: '/'},
                    {DURATION: '0-14天', PTD_WAIT_GOODS_AUD_AMT: '/', PTD_WAIT_GOODS_AUD_RATE: '/', PTD_ZK_SUP_RATE: '/', PTD_LK_SUP_RATE: '/', PTD_CAN_GOODS_AUD_AMT: '/'},
                    {DURATION: '15-28天', PTD_WAIT_GOODS_AUD_AMT: '/', PTD_WAIT_GOODS_AUD_RATE: '/', PTD_ZK_SUP_RATE: '/', PTD_LK_SUP_RATE: '/', PTD_CAN_GOODS_AUD_AMT: '/'},
                    {DURATION: '4周以上', PTD_WAIT_GOODS_AUD_AMT: '/', PTD_WAIT_GOODS_AUD_RATE: '/', PTD_ZK_SUP_RATE: '/', PTD_LK_SUP_RATE: '/', PTD_CAN_GOODS_AUD_AMT: '/'},
                ]
                if(!arr.length) return
                let obj = {汇总: 0, 到期订单: 1, '0-14天': 2, '15-28天': 3, '4周以上': 4}
                arr.sort((a, b) => obj[a.DURATION] - obj[b.DURATION])
                this.table1.dataSource = arr
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../../../assets/styles.scss';
.OrderFlow{
    display: flex;
    .leftBox{
        //flex: 1;
        width: calc(45% - 32px);
        /deep/ .TableBox{
            .row, .rowHeader{
                height: 30px;
                line-height: 30px;
            }
            td:nth-child(1){
                width: 80px;
                flex: none;
            }
        }
        .singleBar{

        }
    }
    .rightBox{
        //flex: 1;
        width: calc(55% - 32px);
        /deep/ .panelBox{
            display: flex;
            .row_2{
                margin-top: 5px;
                .col_b{
                    flex: 2;
                }
            }
            .row_3{
                .column:nth-child(1){
                    width: 36px;
                    flex: none;
                }
                .column:nth-child(2){
                    flex: 5;
                }
            }
            .row_4{
                margin-top: 3px;
            }
            .row_6{
                .column:nth-child(odd){
                    width: 36px;
                    flex: none;
                }
            }
        }
        /deep/ .middlePanel{
            //height: calc(50% - 122px)!important;
            //height: calc(50% - 112.5px - 50px)!important;
            margin-top: 10px;
            //height: calc(50% - 151.5px)!important;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .row_2{
                margin-top: 10px;
                .column {
                    font-weight: normal;
                    font-size: 18px;
                }
            }
            .row_3{
                margin-top: 10px;
                .column:nth-child(odd){
                    width: 36px;
                    flex: none;
                }
                .column{
                    line-height: 12px;
                }
            }
        }
        /deep/ .table1{
            tr{
                height: var(--table1TdHeight)!important;
                line-height: var(--table1TdHeight)!important;
            }
            td:nth-child(1){
                width: 80px;
                flex: none;
            }

            td:nth-last-child(3) {
                flex: none;
                width: 130px;
            }
            td:nth-last-child(2) {
                flex: none;
                width: 180px;
            }
        }
    }
}
</style>