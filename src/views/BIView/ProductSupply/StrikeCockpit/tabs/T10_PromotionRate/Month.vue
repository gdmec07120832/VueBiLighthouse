<template>
    <div class="content">
        <div class="leftBox">
            <div class="title_1" style="height: 28px;line-height: 28px">整体概览</div>
            <div class="panels">
                <Panel v-bind="item" v-for="(item, index) in panels" :key="index"/>
            </div>
            <div style="display: flex;margin-top: 18px">
                <div style="width: calc(50% - 30px)" class="title_2">费用结构</div>
                <div style="width: 60px"></div>
                <div style="width: calc(50% - 30px)" class="title_2">访客结构</div>
            </div>
            <div class="circleBox" :style="{height: `calc(100% - 189px - ${32 * (table.dataSource.length + 1)}px)`}">
                <v-chart ref="circle" class="circle" style="width: calc(50% - 30px);overflow: visible" :options="circle"
                         autoresize></v-chart>
                <div style="width: 60px"></div>
                <v-chart ref="circle" class="circle" style="width: calc(50% - 30px);overflow: visible;" :options="circle1"
                         autoresize></v-chart>
            </div>
            <div ref="table" class="table mt20" :style="{'--showLine': showLine}">
                <Table v-bind.sync="table"/>
            </div>
        </div>
        <div style="width: 40px"></div>
        <div class="rightBox">
            <div style="display: flex;justify-content: space-between;align-items: center">
                <div class="title_1">工具效果</div>
                <Select v-bind.sync="storeSelect" style="width: 250px"/>
            </div>
            <div class="table1 mt20">
                <Table v-bind.sync="table1"/>
            </div>
            <Radio v-bind.sync="fieldRadio" class="mt20"/>
            <div class="UALChartTitle">
              <div class="UATName">
                    {{ `${storeSelect.value ? storeSelect.value : ''}(${table1.currentClick.value})`}}
              </div>
              <div class="UATlegend">
                <span>{{fieldRadio_label}}</span>
                <span>{{'目标'}}</span>
              </div>
            </div>

            <v-chart ref="barAndLine" class="barAndLine mt10" style="height: calc(100% - 315px - 36px);overflow: visible" :options="barAndLine"
                     :style="{height: `calc(100% - 133px - ${(table1.dataSource.length + 1) * 25}px)`}"
                     autoresize
            ></v-chart>
<!--                     :style="{height: calc()}"-->
        </div>
    </div>
</template>

<script>
import base from '../../utils/base.js'
import _ from 'lodash'
import Radio from '../../components/Radio'
import Panel from '../../components/Panel'
import Table from '../../components/TableRow'
import Select from '../../components/Select'
import moment from 'moment'
import echartStyle from "../../utils/echartStyle";
export default {
    mixins: [base],
    components: {
        Radio,
        Panel,
        Table,
        Select,
    },
    props: {
        month: {
            type: String,
            defalut: moment().format('YYYYMM')
        }
    },
    async created() {
        let that = this
        this.circle = await this.createCircle()
        this.circle.series[0].center = ['50%', '50%']
        this.circle.series[0].radius = ['30%', '50%']
        this.circle.series[0].label.formatter = function(params) {
            return `${params.percent}%`
        }
        this.circle.legend = {
            right: 0,
            bottom: 'center',
            type: 'scroll',
            icon: 'circle',
            orient: 'vertical',
            data: [],
            pageIconSize: 10
        }
        this.circle.tooltip = {
            extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
            // trigger: 'axis',
            axisPointer: {
                type: 'item'
            },
            backgroundColor: '#fff',
            textStyle: {
                color: 'rgba(0,0,0,0.65)',
                fontSize: 12
            },
            borderWidth: 1,
            borderColor: '#ccc',
            formatter: function(params) {
                let str = `${params.marker}${params.data.fullName}（${params.name}）<br/>`
                str += `花费 ${that.handleNum('round', params.data.value)}<br/>`
                str += `占比 ${that.handleNum('percent', params.data.value / that.circleCostSum)}`
                return str
            }
        }
        this.circle.series[0].data = []
        this.circle1 = _.cloneDeep(this.circle)
        this.circle1.tooltip.formatter = function(params) {
            let str = `${params.marker}${params.data.fullName}（${params.name}）<br/>`
            str += `访客数 ${that.handleNum('round', params.data.value)}<br/>`
            str += `占比 ${that.handleNum('percent', params.data.value / that.circleCostSum1)}`
            return str
        }
        this.barAndLine = await this.createBarAndLineEchart()
        this.barAndLine.legend = {
            show:false,
            top: 0,
            left: 'right',
            orient: 'horizontal',
            align: 'left',
            itemWidth: 10,
            itemHeight: 4,
            data: [],
            icon: 'rect',
            selectedMode: false,
        }
        // this.barAndLine.color = ['#6395f9', '#DFDFDF']
        this.barAndLine.grid.top = 20
        this.barAndLine.series[0].barWidth = 16
        this.barAndLine.series[0].data = []
        this.barAndLine.series[1].data = []
        await this.getStoreOption()
        this.getOverView()
        this.getCircle()
        this.getToolTable()
        this.getToolTrend()
    },
    computed: {
        showLine() {
            if (this.table.dataSource.length >= 4) return 'block'
            else return 'none'
        },
    },
    watch: {
        month: {
            async handler(){
                await this.getStoreOption()
                this.getOverView()
                this.getCircle()
                this.getToolTable()
                this.getToolTrend()
            }
        },
        'storeSelect.value': {
            handler(){
                this.table1.currentClick = {
                    i: 0,
                    j: 0,
                    value: '合计'
                }
                this.getToolTable()
                this.getToolTrend()
            }
        },
        'table1.currentClick': {
            handler(){
                this.getToolTrend()
            },
            deep: true
        },
        'fieldRadio.value': {
            handler(){
                this.handleData('toolTrend', this.toolTrendData)
            }
        }
    },
    data() {
        this.getToolTrend = _.debounce(this.getToolTrend, 200, {
            leading: false,
            trailing: true
        })
        return {
            panels: [
                {
                    name: '推广费用',
                    tabIndex: 'T10_PromotionRate',
                    row: 4,
                    column: 2,
                    area: [
                        ['a', 'a'],
                        ['b', 'b'],
                        ['c', 'd'],
                        ['e', 'f'],
                    ],
                    map: [
                        {areaName: 'a', value: '推广费用', className: 'title'},
                        {areaName: 'b', keyName: 'COST', className: 'subTitle', valueFormat: 'tenThousand'},
                        {areaName: 'c', value: '目标', className: 'label'},
                        {areaName: 'd', keyName: 'TGT_COST', className: 'value', valueFormat: 'tenThousand'},
                        {areaName: 'e', value: '差额', className: 'label'},
                        {areaName: 'f', keyName: 'DIFF_TGT_COST', className: 'value', valueFormat: 'round',},
                    ],
                    dataSource: {},
                },
                {
                    name: '付费访客',
                    tabIndex: 'T10_PromotionRate',
                    row: 4,
                    column: 2,
                    area: [
                        ['a', 'a'],
                        ['b', 'b'],
                        ['c', 'd'],
                        ['e', 'f'],
                    ],
                    map: [
                        {areaName: 'a', value: '付费访客', className: 'title'},
                        {areaName: 'b', keyName: 'VISITORS_PAY', className: 'subTitle', valueFormat: 'tenThousand'},
                        {areaName: 'c', value: '同期', className: 'label'},
                        {areaName: 'd', keyName: 'YOY_VISITORS_PAY', className: 'value', valueFormat: 'tenThousand'},
                        {areaName: 'e', value: '同比', className: 'label'},
                        {areaName: 'f', keyName: 'YOY_DIFF_VISITORS_PAY', className: 'value', valueFormat: 'percent', colorFormat: 'YOY'},
                    ],
                    dataSource: {},
                },
                {
                    name: '推广费率',
                    tabIndex: 'T10_PromotionRate',
                    row: 4,
                    column: 2,
                    area: [
                        ['a', 'a'],
                        ['b', 'b'],
                        ['c', 'd'],
                        ['e', 'f'],
                    ],
                    map: [
                        {areaName: 'a', value: '推广费率', className: 'title'},
                        {areaName: 'b', keyName: 'COST_RATE', className: 'subTitle', valueFormat: 'percent'},
                        {areaName: 'c', value: '同期', className: 'label'},
                        {areaName: 'd', keyName: 'YOY_COST_RATE', className: 'value', valueFormat: 'percent'},
                        {areaName: 'e', value: '同比', className: 'label'},
                        {areaName: 'f', keyName: 'YOY_DIFF_COST_RATE', className: 'value', valueFormat: 'percent', colorFormat: 'YOY_reverse'},
                    ],
                    dataSource: {},
                }
            ],
            circle: null,
            circle1: null,
            circleCostSum: 1,
            table: {
                // maxHeight: 'calc(100% - 59px)',
                // height: '128px',
                maxHeight: 'auto',
                height: 'auto',
                header: {
                    area: [
                        ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
                    ],
                    data: {
                        a: '店铺',
                        b: '花费',
                        c: '花费同比',
                        d: '访客数',
                        e: '访客同比',
                        f: '费率',
                        g: '费率同比',
                    },
                },
                // 配置字段
                // valueFormat sumFirstFormat sumLastFormat 可以是字符串或函数
                tableColumn: [
                    {key: 'SHOP_NAME', areaName: 'a', valueFormat: 'normal'},
                    {key: 'COST', areaName: 'b', valueFormat: 'tenThousand'},
                    {
                        key: 'YOY_DIFF_COST',
                        areaName: 'c',
                        valueFormat: 'percent',
                        colorFormat: 'YOY_reverse',
                    },
                    {key: 'VISITORS_PAY', areaName: 'd', valueFormat: 'tenThousand'},
                    {key: 'YOY_DIFF_VISITORS_PAY', areaName: 'e', valueFormat: 'percent', colorFormat: 'YOY'},
                    {key: 'COST_RATE', areaName: 'f', valueFormat: 'percent'},
                    {key: 'YOY_DIFF_COST_RATE', areaName: 'g',valueFormat: 'percent', colorFormat: 'YOY_reverse'},
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
                dataSource: [],
                pagination: {
                    show: false,
                },
            },
            storeSelect: {
                label: '店铺选择',
                value: '',
                options: []
            },
            table1: {
                maxHeight: 'auto',
                height: 'auto',
                header: {
                    area: [
                        ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n'],
                    ],
                    data: {
                        a: '推广工具',
                        b: '花费',
                        c: '花费达成',
                        d: '花费同比',
                        e: '点击量',
                        f: '点击同比',
                        g: 'CPC',
                        h: 'CPC同比',
                        i: '收加量',
                        j: '收加同比',
                        k: '收加率',
                        l: '收加率同比',
                        m: '收加成本',
                        n: '收加成本同比',
                    },
                },
                // 配置字段
                // valueFormat sumFirstFormat sumLastFormat 可以是字符串或函数
                tableColumn: [
                    {key: 'TOOL', areaName: 'a', canClick: true},
                    {key: 'COST', areaName: 'b', valueFormat: 'tenThousand'},
                    {
                        key: 'COST_REACH',
                        areaName: 'c',
                        valueFormat: 'percent',
                        // colorFormat: 'reach_reverse',
                    },
                    {key: 'YOY_DIFF_COST', areaName: 'd', valueFormat: 'percent', colorFormat: 'YOY_reverse'},
                    {key: 'CLICKS', areaName: 'e', valueFormat: 'tenThousand'},
                    {key: 'YOY_DIFF_CLICKS', areaName: 'f', valueFormat: 'percent', colorFormat: 'YOY'},
                    {key: 'CPC', areaName: 'g', valueFormat: 'toFixed2'},
                    {key: 'YOY_DIFF_CPC', areaName: 'h', valueFormat: 'percent', colorFormat: 'YOY'},
                    {key: 'ADDITIONAL_PURCHASE', areaName: 'i', valueFormat: 'tenThousand'},
                    {key: 'YOY_DIFF_ADDITIONAL_PURCHASE', areaName: 'j', valueFormat: 'percent', colorFormat: 'YOY'},
                    {key: 'ADDITIONAL_PURCHASE_RATE', areaName: 'k', valueFormat: 'percent'},
                    {key: 'YOY_DIFF_ADDI_PURCHASE_RATE', areaName: 'l', valueFormat: 'percent', colorFormat: 'YOY'},
                    {key: 'ADDITIONAL_PURCHASE_COST', areaName: 'm', valueFormat: 'toFixed2'},
                    {key: 'YOY_DIFF_ADDI_PURCHASE_COST', areaName: 'n', valueFormat: 'percent', colorFormat: 'YOY_reverse'},
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
                dataSource: [],
                pagination: {
                    show: false,
                },
                currentClick: {
                    i: 0,
                    j: 0,
                    value: '合计'
                }
            },
            fieldRadio: {
                label: '指标选择',
                value: 'COST',
                // options: ['花费', '点击量', 'CPC', '收藏加购量', '收藏加购率', '收藏加购成本'],
                options: [
                    {label: '花费', value: 'COST'},
                    {label: '点击量', value: 'CLICKS'},
                    {label: 'CPC', value: 'CPC'},
                    {label: '收藏加购量', value: 'ADDITIONAL_PURCHASE'},
                    {label: '收藏加购率', value: 'ADDITIONAL_PURCHASE_RATE'},
                    {label: '收藏加购成本', value: 'ADDITIONAL_PURCHASE_COST'},
                ]
            },
            fieldRadio_label:'花费',
            barAndLine: null,
            toolTrendData: [],
        }
    },
    methods: {
        async getStoreOption(){
            let query = {
                YYYYMM: this.month
            }
            let {data} = await this.$fetchSql('all_center', 'all_center_adv_launch_shop_tool_tm', query)
            data.sort((a, b) => b.PAY_AMT - a.PAY_AMT)
            this.storeSelect.options = Array.from(new Set(data.map(_ => _.SHOP_NAME)))
            this.storeSelect.value = this.storeSelect.options[0]
        },
        async getOverView(){
            let query = {
                YYYYMM: this.month
            }
            let {data} = await this.$fetchSql('all_center', 'all_center_adv_launch_ovview_tm', query)
            this.handleData('panel', data)
        },
        // 费用结构
        async getCircle(){
            let query = {
                YYYYMM: this.month
            }
            let {data} = await this.$fetchSql('all_center', 'all_center_adv_launch_shop_ovview_tm', query)
            this.handleData('circle', data)
            this.handleData('circleTable', data)
        },
        async getToolTable(){
            let query = {
                YYYYMM: this.month,
                SHOP_NAME: this.storeSelect.value
            }
            let {data} = await this.$fetchSql('all_center', 'all_center_adv_launch_shop_tool_tm', query)
            this.handleData('toolTable', data)
            // data.sort((a, b) => )
            // this.storeSelect.options = Array.from(new Set(data.map(_ => _.SHOP_NAME)))
            // this.storeSelect.value = this.storeSelect.options[0]
        },
        async getToolTrend(){
            if(!this.storeSelect.value) return
            let query = {
                YYYYMM: this.month,
                SHOP_NAME: this.storeSelect.value
            }
            let {value:TOOL} = this.table1.currentClick
            if(TOOL !== '/') query.TOOL = TOOL === '合计' ? '汇总' : TOOL
            let {data} = await this.$fetchSql('all_center', 'all_center_adv_launch_shop_d', query)
            this.toolTrendData = data.concat()
            this.handleData('toolTrend', data)
        },
        handleData(type, source){
            if(type === 'panel'){
                let arr = _.cloneDeep(source)
                this.panels[0].dataSource = {}
                this.panels[1].dataSource = {}
                this.panels[2].dataSource = {}
                if(!arr.length) return
                this.panels[0].dataSource = arr[0]
                this.panels[1].dataSource = arr[0]
                this.panels[2].dataSource = arr[0]
            }
            else if(type === 'circle'){
                let arr = _.cloneDeep(source)
                this.circleCostSum = 1
                this.circleCostSum1 = 1
                this.circle.series[0].data = []
                this.circle1.series[0].data = []
                if(!arr.length) return
                arr.sort((a, b) => b.COST - a.COST)
                this.circleCostSum = arr.map(_ => _.COST).filter(_ => _ !== null && _ !== undefined).reduce((a, b) => a + b)
                this.circle.series[0].data = arr.map(item => {
                    return {
                        name: item.SHORT_NAME,
                        value: item.COST,
                        fullName: item.SHOP_NAME
                    }
                })
                this.circle.legend.data = this.circle.series[0].data.map((item) => {
                    return {
                        name: item.name
                    }
                })
                this.circleCostSum1 = arr.map(_ => _.VISITORS_PAY).filter(_ => _ !== null && _ !== undefined).reduce((a, b) => a + b)
                this.circle1.series[0].data = arr.map(item => {
                    return {
                        name: item.SHORT_NAME,
                        value: item.VISITORS_PAY,
                        fullName: item.SHOP_NAME
                    }
                })
                this.circle1.legend.data = this.circle.series[0].data.map((item) => {
                    return {
                        name: item.name
                    }
                })
            }
            else if(type === 'circleTable'){
                let arr = _.cloneDeep(source)
                this.table.dataSource = [
                    {
                        SHOP_NAME: '/',
                        COST: '/',
                        YOY_DIFF_COST: '/',
                        VISITORS_PAY: '/',
                        YOY_DIFF_VISITORS_PAY: '/',
                        COST_RATE: '/',
                        YOY_DIFF_COST_RATE: '/',
                    }
                ]
                if(!arr.length) return
                arr.sort((a, b) => b.COST - a.COST)
                this.table.dataSource = arr
                // let length = arr.length
                // if(length <= 4){
                //     let empty = {
                //         SHOP_NAME: '/',
                //         COST: '/',
                //         YOY_DIFF_COST: '/',
                //         VISITORS_PAY: '/',
                //         YOY_DIFF_VISITORS_PAY: '/',
                //         COST_RATE: '/',
                //         YOY_DIFF_COST_RATE: '/',
                //     }
                //     for(let i = 0; i < 4 - length; i++){
                //         this.table.dataSource.push(_.cloneDeep(empty))
                //     }
                // }
            }
            else if(type === 'toolTable'){
                let arr = _.cloneDeep(source)
                this.table1.dataSource = []
                for(let i = 0; i < 1; i++){
                    this.table1.dataSource.push({
                        TOOL: '/',
                        COST: '/',
                        COST_REACH: '/',
                        YOY_DIFF_COST: '/',
                        CLICKS: '/',
                        YOY_DIFF_CLICKS: '/',
                        CPC: '/',
                        YOY_DIFF_CPC: '/',
                        ADDITIONAL_PURCHASE: '/',
                        YOY_DIFF_ADDITIONAL_PURCHASE: '/',
                        ADDITIONAL_PURCHASE_RATE: '/',
                        YOY_DIFF_ADDI_PURCHASE_RATE: '/',
                        ADDITIONAL_PURCHASE_COST: '/',
                        YOY_DIFF_ADDI_PURCHASE_COST: '/',
                    })
                }
                if(!arr.length) return
                let newArr = arr.filter(_ => _.TOOL !== '汇总').sort((a, b) => b.COST - a.COST)
                let sum = arr.filter(_ => _.TOOL === '汇总')
                if(sum.length){
                    sum[0].TOOL = '合计'
                    newArr.unshift(sum[0])
                }
                this.table1.dataSource = newArr
            }
            else if(type === 'toolTrend'){
                let arr = source.concat()
                this.barAndLine.series[0].name = ''
                this.barAndLine.series[0].data = []
                this.barAndLine.series[1].name = ''
                this.barAndLine.series[1].data = []
                if(!arr.length) return
                let {value:TOOL} = this.table1.currentClick
                let field = this.fieldRadio.value
                if(field === '/') return
                if(!TOOL) return
                arr = arr.filter(_ => _.TOOL === (TOOL === '合计' ? '汇总' : TOOL))
                this.$refs?.barAndLine?.$refs?.echarts?.clear()
                if(!arr.length) return
                arr.sort((a, b) => moment(a.TDATE_WID).format('x') - moment(b.TDATE_WID).format('x'))
                let that = this
                let obj = {
                    COST: {
                        key: 'TGT_COST',
                        key_reach: 'COST_REACH',
                        format_reach: 'percent',
                        labelFormat: 'round',
                        tooltipFormat: 'round',
                        label: '花费'
                    },
                    CLICKS: {
                        key: 'TGT_CLICKS',
                        key_reach: 'CLICKS_REACH',
                        format_reach: 'percent',
                        labelFormat: 'round',
                        tooltipFormat: 'round',
                        label: '点击量'
                    },
                    CPC: {
                        key: 'TGT_CPC',
                        key_reach: 'CPC_REACH',
                        format_reach: 'percent',
                        labelFormat: 'toFixed2',
                        tooltipFormat: 'toFixed2',
                        label: 'CPC'
                    },
                    ADDITIONAL_PURCHASE: {
                        key: 'TGT_ADDITIONAL_PURCHASE',
                        key_reach: 'ADDITIONAL_PURCHASE_REACH',
                        format_reach: 'percent',
                        labelFormat: 'round',
                        tooltipFormat: 'round',
                        label: '收藏加购量'
                    },
                    ADDITIONAL_PURCHASE_RATE: {
                        key: 'TGT_ADDITIONAL_PURCHASE_RATE',
                        key_reach: 'ADDITIONAL_PURCHASE_RATE_REACH',
                        format_reach: 'percent',
                        labelFormat: 'percent',
                        tooltipFormat: 'percent',
                        label: '收藏加购率'
                    },
                    ADDITIONAL_PURCHASE_COST: {
                        key: 'TGT_ADDITIONAL_PURCHASE_COST',
                        key_reach: 'ADDITIONAL_PURCHASE_COST_REACH',
                        format_reach: 'percent',
                        labelFormat: 'toFixed2',
                        tooltipFormat: 'toFixed2',
                        label: '收藏加购成本'

                    }
                }
                this.barAndLine.yAxis[0].axisLabel.formatter = function(val){
                    return that.handleNum(obj[field].labelFormat, val)
                }
                this.barAndLine.tooltip.formatter = function(params){
                    let str = params[0].axisValue + '<br/>'
                    str += `${params[0].marker}${obj[field].label} ${that.handleNum(obj[field].tooltipFormat, params[0].data[1])}<br/>`
                    str += `${params[1].marker}目标 ${that.handleNum(obj[field].tooltipFormat, params[1].data[1])}<br/>`
                    str += `达成 ${that.handleNum(obj[field].format_reach, params[0].data[3])}`
                    return str
                }
                this.barAndLine.xAxis[0].data = Array.from(new Set(arr.map(_ => moment(_.TDATE_WID).format('D日'))))
                this.barAndLine.series[0].name = obj[field].label
                this.barAndLine.series[0].data = arr.map(item => {
                    return ['TDATE_WID', field, obj[field].key, obj[field].key_reach].map(key => {
                        if(key === 'TDATE_WID') return moment(item[key]).format('D日')
                        return item[key]
                    })
                })
                this.barAndLine.series[1].name = '目标'
                this.barAndLine.series[1].data = arr.map(item => {
                    return ['TDATE_WID', obj[field].key].map(key => {
                        if(key === 'TDATE_WID') return moment(item[key]).format('D日')
                        return item[key]
                    })
                })
                let {name} =  this.barAndLine.series[0]
                let {name:name1} =  this.barAndLine.series[1]
                // this.barAndLine.legend.data = [name, name1]
                this.fieldRadio_label=obj[field].label;
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../../assets/styles';
.content {
    margin-top: 10px;
    height: calc(100% - 48px);
    display: flex;
    .leftBox {
        flex: 4;
        .panels {
            margin-top: 12px;
            display: flex;

            /deep/ .Panel {
                margin-right: 48px;

                &:nth-last-child(1) {
                    margin-right: 0;
                }

                .row_2 {
                    margin-top: 2px;
                }

                .row_3 {
                    margin-top: 6px;
                }

                .row_3, .row_4 {
                    .column:nth-last-child(1) {
                        text-align: right;
                    }
                }
            }
        }

        .circleBox {
            height: calc(100% - 349px);
            display: flex;
        }
        /deep/ .table {
            position: relative;
            tr{
                height: 32px!important;
            }
            td:nth-child(1){
                width: 150px;
                flex: none;
            }
            td:nth-child(3), td:nth-child(5), td:nth-child(7){
                width: 70px;
                flex: none;
            }
            &::before {
                display: block;
                content: '';
                position: absolute;
                z-index: 3;
                top: 32px;
                width: calc(100% - 8px);
                height: 1px;
                background: #e7e9f0;
            }

            &::after {
                display: var(--showLine);
                content: '';
                position: absolute;
                bottom: 0;
                width: calc(100% - 8px);
                height: 1px;
                background: #e7e9f0;
            }
        }
    }
    .rightBox {
        flex: 7;
        .UALChartTitle{
            padding: 15px;
            padding-bottom: 0px;
            padding-left: 0px;
            display: flex;
            justify-content: space-between;
            .UATlegend {
              // margin-bottom: 20px;
              align-items: center;
              span{
                padding-right: 10px;
              }
              span:nth-child(1),
              span:nth-child(2) {
                font-size: 12px;
                font-family: PingFangSC-Regular, PingFang SC;
                color: #8c8c8c;
                line-height: 17px;
              }
              span:nth-child(1)::before,
              span:nth-child(2)::before {
                content: '';
                display: inline-block;
                width: 14px;
                height: 2px;
                background: #5C8FF9;
                margin-right: 5px;
                margin-bottom: 3px;
              }
              span:nth-child(2)::before {
                background: #e7e7e7;
              }
            }

        }
        /deep/ .table1 {
            position: relative;

            &::before {
                display: block;
                content: '';
                position: absolute;
                z-index: 3;
                top: 25px;
                width: calc(100% - 8px);
                height: 1px;
                background: #e7e9f0;
            }
            td:nth-last-child(1){
                width: 90px;
                flex: none;
            }
            td:nth-last-child(3){
                width: 80px;
                flex: none;
            }
            td:nth-child(1), td:nth-child(3), td:nth-child(4), td:nth-child(6), td:nth-child(8), td:nth-child(10), td:nth-child(13){
                width: 70px;
                flex: none;
            }
            tr {
                //height: 36px!important;
            }
        }
    }
}
</style>