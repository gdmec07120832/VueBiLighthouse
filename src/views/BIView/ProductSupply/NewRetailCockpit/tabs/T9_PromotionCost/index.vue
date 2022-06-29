<template>
    <div class="PromotionCost">
        <div class="header">
            <Title class="title" :label="'推广费用'"/>
            <span>（线上投放）</span>
            <span>【线下投放内容与业务共创中，敬请期待】</span>
            <div></div>
            <span style="font-size: 12px">
                统计月份
                <a-month-picker :disabledDate="disabledDate" v-model="month" :allowClear="false" class="ml10" valueFormat="YYYYMM" />
            </span>
        </div>
        <div class="main">
            <div class="OverallOverview">
                <div class="title">整体概况</div>
                <div class="overView">
                    <div :class="['item', {'active': clickFlag && index === currentOverview ? true : false}]"
                        v-for="(item, index) in overView" :key="index"
                        @click="clickFlag = true;currentOverview = index">
                        <div>{{item.label}}</div>
                        <div>{{computeNum(index, 0,item.value1)}}</div>
                        <div>
                            <span>{{ item.label2 }}</span>
                            <span></span>
                            <span :class="[computeColor(index, 1, item.value2)]">{{ computeNum(index, 1, item.value2) }}</span>
                        </div>
                        <div>
                            <span>{{ item.label3 }}</span>
                            <span></span>
                            <span :class="[computeColor(index, 2, item.value3)]">{{ computeNum(index, 2, item.value3) }}</span>
                        </div>
                    </div>
                </div>
                <Table @click.native="clickTable" ref="overViewTable" class="table" v-bind="table" />
                <span class="lineTitle" :style="[{bottom: `calc(100% - 20px - 19px - 11px - 105px - ${127}px - 18px - 22px)`}]">
                    {{currentOverview === 0 ? '推广费用趋势' : currentOverview === 1 ? '留资数量趋势' : '留资成本趋势'}}
                </span>
                <v-chart ref="overViewEchart" 
                :style="[{height: `calc(100% - 20px - 19px - 11px - 105px - ${127}px - 18px - 22px)`}]"
                style="overflow: visible"
                class="line"
                :options="line"
                autoresize
                ></v-chart>
            </div>
            <div style="width: 74px"></div>
            <div class="tools">
                <div class="title">工具效果</div>
                <a-radio-group v-model="toolsType" style="position: absolute;right: 0;top: 18px" buttonStyle="solid" size="small">
                    <a-radio-button value="淘外工具">
                        淘外工具
                    </a-radio-button>
                      <a-radio-button value="淘内工具">
                        淘内工具
                    </a-radio-button>
                </a-radio-group>
                <div class="selects">
                    <span class="mr10">店态选择</span>
                    <a-checkbox-group v-model="STORE_TYPE">
                        <a-checkbox value="成品店">
                            成品店
                        </a-checkbox>
                        <a-checkbox value="融合店">
                            融合店
                        </a-checkbox>
                    </a-checkbox-group>
                    <span class="ml10">主营类目：</span>
                    <a-select v-model="category" mode="multiple" style="min-width: 100px;font-size: 12px" dropdownClassName="category">
                        <a-select-option :value="item" v-for="item in categoryOption" :key="item">
                            {{item}}
                        </a-select-option>
                    </a-select>
                </div>
                <Table ref="toolsTable" @click.native="clickTable1" class="table" v-bind="table1" />
                <div class="lineRadio">
                    <span class="mr10">指标选择</span>
                    <a-radio-group v-model="toolsTrendRadio">
                        <a-radio value="花费">
                            花费
                        </a-radio>
                        <template v-if="toolsType === '淘外工具'">
                            <a-radio value="留资数量">
                                留资数量
                            </a-radio>
                            <a-radio value="留资成本">
                                留资成本
                            </a-radio>
                        </template>
                        <template v-if="toolsType === '淘内工具'">
                            <a-radio value="CPC">
                                CPC
                            </a-radio>
                            <a-radio value="收藏加购成本">
                                收藏加购成本
                            </a-radio>
                            <a-radio value="咨询数">
                                咨询数
                            </a-radio>
                            <a-radio value="咨询成本">
                                咨询成本
                            </a-radio>
                        </template>
                    </a-radio-group>
                </div>
                <div style="margin-top: 22px;position: relative" :style="{height: `calc(100% - 20px - 19px - 28px - 12px - 14px - ${25 * (table1.labelData.length - 1)}px - 60px - 21px - 20px - 22px)`}">
                     <span class="lineTitle" style="position: absolute;top: 0; left: 0;">
                        {{toolsTrendRadio === '花费' ? '推广费用趋势' : toolsTrendRadio === '留资数量' ? '留资数量趋势' : toolsTrendRadio === '留资成本趋势' ? '留资成本趋势' : toolsTrendRadio + '趋势'}}
                    </span>
                    <v-chart ref="line1" class="line"
                    style="overflow: visible;"
                    :options="line1" autoresize></v-chart>
<!--                    :style="[{height: `calc(100% - 20px - 19px - 28px - 12px - ${25 * (table1.labelData.length)}px - 14px - 54px - 22px - 22px)`}]"-->
                </div>
            </div>
        </div>
        <Jump style="display: none"/>
    </div>
</template>

<script>
    import Title from '../../components/Title'
    import moment from 'moment'
    import Table from '../../components/Table'
    import base from '../../utils/base'
    import Jump from '../../components/Jump'
    import _ from 'lodash'
    export default {
        name: 'PromotionCost',
        mixins: [base],
        components: {
            Title,
            Table,
            Jump,
        },
        async created() {
            let that = this
            this.line = await this.createLine()
            this.line.yAxis[0].axisLabel.interval = 4
            this.line.yAxis[0].min = 0
            this.line.series[0].data = []
            this.line.series[1].data = []
            this.line.series[0].name = '当期'
            this.line.series[1].name = '同期'
            this.line.grid.top = 40
            // this.line.legend = {
            //     top: 0,
            //     left: 'right',
            //     orient: 'horizontal',
            //     align: 'left',
            //     itemWidth: 10,
            //     itemHeight: 4,
            //     icon: 'rect',
            //     selectedMode: false
            // }
            this.line.yAxis[0].axisLabel.formatter = function(val) {
                // return val >= 10000 ? (val / 10000).toFixed(0).toLocaleString() + '万' : that.handleNum('round', val)
                 return that.handleNum('round', val)
            }
            this.line.tooltip.formatter = function (params) {
                if (Object.prototype.toString.call(params) === '[object Array]') {
                    let str = `${params[0].axisValue}<br/>`
                    params.forEach((item, index) => {
                        if(that.currentOverview === 1 || that.currentOverview === 2) {
                            str += `${params[index].marker}${params[index].seriesName}：${that.handleNum('round', params[index].data[1])}<br/>`
                        }
                        else str += `${params[index].marker}${params[index].seriesName}：${that.handleNum('tenThousand', params[index].data[1])}<br/>`
                    })
                    return str
                } else if (Object.prototype.toString.call(params) === '[object Object]') {
                    let str =
                        `${params.axisValue}<br/>${params.marker}${params.seriesName}：${that.handleNum('percent', params.data[1])}<br/>`
                    return str
                }
            }
            this.lineCopy = _.cloneDeep(this.line)
            this.line1 = await this.createLine()
            this.line1.yAxis[0].axisLabel.interval = 4
            this.line1.yAxis[0].min = 0
            this.line1.series[0].data = []
            this.line1.series[1].data = []
            this.line1.series[0].name = '当期'
            this.line1.series[1].name = '同期'
            this.line1.grid.top = 40
            // this.line1.legend = {
            //     top: 0,
            //     left: 'right',
            //     orient: 'horizontal',
            //     align: 'left',
            //     itemWidth: 10,
            //     itemHeight: 4,
            //     icon: 'rect',
            //     selectedMode: false
            // }
            this.line1.tooltip.formatter = function (params) {
                if (Object.prototype.toString.call(params) === '[object Array]') {
                    let str = `${params[0].axisValue}<br/>`
                    params.forEach((item, index) => {
                        // if(that.toolsTrendRadio === '留资数量' || that.toolsTrendRadio === '留资成本') {
                        //     str += `${params[index].marker}${params[index].seriesName}：${that.handleNum('round', params[index].data[1])}<br/>`
                        // }
                        // else str += `${params[index].marker}${params[index].seriesName}：${that.handleNum('tenThousand', params[index].data[1])}<br/>`
                        if(that.toolsTrendRadio === '花费') {
                            str += `${params[index].marker}${params[index].seriesName}：${that.handleNum('tenThousand', params[index].data[1])}<br/>`
                        }
                        else if(that.toolsTrendRadio === 'CPC') {
                            str += `${params[index].marker}${params[index].seriesName}：${params[index].data[1].toFixed(2)}<br/>`
                        }
                        else{
                            str += `${params[index].marker}${params[index].seriesName}：${that.handleNum('round', params[index].data[1])}<br/>`
                        }
                    })
                    return str
                } else if (Object.prototype.toString.call(params) === '[object Object]') {
                    let str =
                        `${params.axisValue}<br/>${params.marker}${params.seriesName}：${that.handleNum('percent', params.data[1])}<br/>`
                    return str
                }
            }
            this.line1.yAxis[0].axisLabel.formatter = function(val) {
                if(that.toolsTrendRadio === 'CPC') {
                    return val === 0 ? 0 : val.toFixed(1)
                }
                else return that.handleNum('round', val)
            }
            this.getOverView()
            this.getTrend()
            this.getTools()
        },
        mounted() {
            this.$refs.overViewTable.$el.children[0].children[1].classList.add('active')
            this.$refs.toolsTable.$el.children[0].children[1].classList.add('active')
            // for(let i = 1; i < this.$refs.overViewTable.$el.children[0].children.length; i++) {
            //     this.$refs.overViewTable.$el.children[0].children[i].classList.add('tableClick')
            // }
            // this.$refs.overViewTable.$el.children[0].children[1].classList.add('tableActive')
        },
        watch: {
            type: {
                handler(val) {
                    this.handleData('trend', this.overViewTrendData)
                }
            },
            currentOverview: {
                handler() {
                    this.handleData('trend', this.overViewTrendData)
                }
            },
            toolsType: {
                handler() {
                    this.toolsCol = '合计'
                    let children = this.$refs.toolsTable.$el.children[0].children
                    for(let i = 1; i < children.length; i++) {
                        children[i].setAttribute('class', 'row')
                    }
                    this.$refs.toolsTable.$el.children[0].children[1].classList.add('active')
                }
            },
            toolsCol: {
                handler() {
                    this.handleData('toolsTrend', this.toolsData)
                }
            },
            toolsTrendRadio: {
                handler() {
                    this.handleData('toolsTrend', this.toolsData)
                }
            },
            toolsWatcher: {
                handler(val) {
                    this.handleData('toolsTrend', this.toolsData)
                    this.handleData('toolsTable', this.toolsData)
                }
            },
            month: {
                handler(val) {
                    this.getOverView()
                    this.getTrend()
                    this.getTools()
                }
            }
        },
        computed: {
            toolsWatcher() {
                return this.STORE_TYPE.toString() + '-' + this.category.toString() + '-' + this.toolsType
            },
        },
        data() {
            return {
                // month: moment(new Date()).format('YYYYMM'),
                month: moment(new Date()).format('DD') === '01' ? moment(new Date()).subtract(1, 'month').format('YYYYMM') : moment().format('YYYYMM'),
                overView: [
                    {
                        label: '推广费用',
                        value1: null,
                        label2: '进度',
                        value2: null,
                        label3: '同比',
                        value3: null
                    },
                    {
                        label: '留资数量',
                        value1: null,
                        label2: '达成',
                        value2: null,
                        label3: '同比',
                        value3: null
                    },
                    {
                        label: '留资成本',
                        value1: null,
                        label2: '目标',
                        value2: null,
                        label3: '同比',
                        value3: null
                    },
                ],
                type: '合计',
                table: {
                    index: 'PromotionCost_overView',
                    labelData: ['店态', '合计', '成品店', '融合店'],
                    tableData: []
                },
                line: null,
                lineCopy: null,
                clickFlag: true,
                currentOverview: 0,
                overViewData: [],
                overViewTrendData: [],
                toolsData: [],
                toolsType: '淘外工具',
                STORE_TYPE: [],
                category: ['定制', '成品'],
                categoryOption: ['定制', '成品'],
                table1: {
                    index: 'PromotionCost_tool_A',
                    labelData: ['工具', '合计', '/', '/', '/'],
                    tableData: []
                },
                toolsCol: '合计',
                toolsTrendRadio: '花费',
                line1: null,
            }
        },
        methods: {
            clickTable(e, type) {
                let text = e.target.innerText
                let keys = this.table.labelData.slice(1)
                if(keys.indexOf(text) > -1) {
                    this.type = text
                    let children = e.target.parentElement.children
                    for(let i = 1; i < children.length; i++) {
                        children[i].setAttribute('class', 'row')
                    }
                    e.target.classList.add('active')
                }
            },
            clickTable1(e, type) {
                let text = e.target.innerText
                let arr = this.toolsData.filter(_ => _.TOOL_TYPE === this.toolsType)
                if(this.STORE_TYPE.length) arr = arr.filter(_ => this.STORE_TYPE.indexOf(_.STORE_TYPE) > -1)
                if(this.category.length) arr = arr.filter(_ => this.category.indexOf(_.PRODUCT_CATE) > -1)
                let keys = []
                if(arr.length) keys = Array.from(new Set(arr.map(_ => _.TOOL)))
                keys.unshift('合计')
                if(keys.length === 1) {
                    this.toolsCol = '合计'
                }
                if(keys.length > 1 && keys.indexOf(text) > -1) {
                    this.toolsCol = text
                    let children = e.target.parentElement.children
                    for(let i = 1; i < children.length; i++) {
                        children[i].setAttribute('class', 'row')
                    }
                    e.target.classList.add('active')
                }
        
            },
            computeColor(col, index, value) {
                if(value === null || value === undefined) return
                if(index === 1) {
                    if(col === 0) {
                        let target = this.overViewData.filter(_ => _.STORE_TYPE === '整体')
                        if(!target.TGT_COST && target.TGT_COST !== 0) return
                        else {
                            if(value >= 1) return 'red'
                            else if(value < 1) return 'green'
                        }
                    }
                    if(col === 1) {
                        if(value >= 1) return 'red'
                        else if(value < 1) return 'green'
                    }
                }
                else if(index === 2) {
                    if(col === 1){
                        if(value > 0) return 'red'
                        else if(value < 0) return 'green'
                    }
                    else if(col === 0 || col === 2){
                        if(value > 0) return 'green'
                        else if(value < 0) return 'red'
                    }
                }
            },
            computeNum(col, index, value) {
                if (value === null) return '--'
                if (col === 0) {
                    if (index === 0) return (value / 10000).toFixed(0).toLocaleString() + '万'
                    else if (index === 1 || index === 2) {
                        return this.handleNum('percent', value)
                    }
                }
                else if (col === 1) {
                    if (index === 0) return this.handleNum('round', value)
                    // else if (index === 1) return (value * 1).toFixed(1) + '%'
                    else if (index === 1 || index === 2) return this.handleNum('percent', value)
                }
                else if (col === 2) {
                    if (index === 0 || index === 1) return this.handleNum('round', value)
                    else if (index === 2) return this.handleNum('percent', value)
                }
            },
            async getOverView() {
                let query = {
                    MDATE_WID: this.month
                }
                let res = await this.$fetchSql('new_retail', 'new_retail_promote_ovview', query)
                this.overViewData = res.data.concat()
                this.handleData('overView', res.data)
                this.handleData('overViewTable', res.data)
            },
            async getTrend() {
                let query = {
                    MDATE_WID1: moment(this.month).startOf('year').format('YYYYMM'),
                    MDATE_WID2: moment(this.month).endOf('year').format('YYYYMM')
                }
                let res = await this.$fetchSql('new_retail', 'new_retail_promote_ovview_trend', query)
                this.overViewTrendData = res.data.concat()
                this.handleData('trend', res.data)
            },
            async getTools() {
                let query = {
                    MDATE_WID1: moment(this.month).startOf('year').format('YYYYMM'),
                    MDATE_WID2: moment(this.month).endOf('year').format('YYYYMM')
                    // MDATE_WID: this.month
                }
                let res = await this.$fetchSql('new_retail', 'new_retail_promote_tool', query)
                this.toolsData = res.data.concat()
                this.handleData('toolsTable', res.data)
                this.handleData('toolsTrend', res.data)
            },
            comparyNone(arr = [], filterZeroFlag) {
                if (!arr.length) return
                let flag = true
                arr.forEach(item => {
                    if (item === null || item === undefined) flag = false
                })
                if (filterZeroFlag && arr[1] === 0) flag = false
                return flag
            },
            handleData(type, source) {
                if (type === 'overView') {
                    this.overView.forEach(item => {
                        item.value1 = null
                        item.value2 = null
                        item.value3 = null
                    })
                    let all = source.filter(_ => _.STORE_TYPE === '整体' && moment(_.MDATE).format('YYYYMM') === this.month)
                    if (!all.length) return
                    all = all[0]
                    this.overView[0].value1 = all.COST
                    this.overView[0].value2 = all.COST_FIN_RAT
                    this.overView[0].value3 = all.YOY_DIF_COST
                    this.overView[1].value1 = all.LZ_NUM
                    this.overView[1].value2 = all.LZ_FIN_RAT
                    this.overView[1].value3 = all.YOY_DIF_LZ_NUM
                    this.overView[2].value1 = all.LZ_COST
                    this.overView[2].value2 = all.TGT_LZ_COST
                    this.overView[2].value3 = all.YOY_DIF_LZ_COST
                }
                else if (type === 'overViewTable') {
                    this.table.tableData = []
                    let arr = []
                    // if (!arr.length) return
                    let obj = {
                        COST: null,
                        COST_FIN_RAT: null,
                        YOY_DIF_COST: null,
                        LZ_NUM: null,
                        LZ_FIN_RAT: null,
                        YOY_DIF_LZ_NUM: null,
                        LZ_COST: null,
                        LZ_COST_FIN_RAT: null,
                        YOY_DIF_LZ_COST: null,
                    }
                    if(source.filter(_ => _.STORE_TYPE === '整体' && _.MDATE_WID === this.month).length) {
                        arr.push(...source.filter(_ => _.STORE_TYPE === '整体' && _.MDATE_WID === this.month))
                    }else arr.push(_.cloneDeep(obj))
                    if(source.filter(_ => _.STORE_TYPE === '成品店' && _.MDATE_WID === this.month).length) {
                        arr.push(...source.filter(_ => _.STORE_TYPE === '成品店' && _.MDATE_WID === this.month))
                    }else arr.push(_.cloneDeep(obj))
                    if(source.filter(_ => _.STORE_TYPE === '融合店' && _.MDATE_WID === this.month).length) {
                        arr.push(...source.filter(_ => _.STORE_TYPE === '融合店' && _.MDATE_WID === this.month))
                    }else arr.push(_.cloneDeep(obj))
                    let keys = [{
                            label: '花费',
                            key: 'COST'
                        },
                        {
                            label: '花费进度',
                            key: 'COST_FIN_RAT'
                        },
                        {
                            label: '花费同比',
                            key: 'YOY_DIF_COST'
                        },
                        {
                            label: '留资数',
                            key: 'LZ_NUM'
                        },
                        {
                            label: '留资达成',
                            key: 'LZ_FIN_RAT'
                        },
                        {
                            label: '留资同比',
                            key: 'YOY_DIF_LZ_NUM'
                        },
                        {
                            label: '留资成本',
                            key: 'LZ_COST'
                        },
                        {
                            label: '留资成本达成',
                            key: 'LZ_COST_FIN_RAT'
                        },
                        {
                            label: '留资成本同比',
                            key: 'YOY_DIF_LZ_COST'
                        },
                    ]
                    this.table.tableData = keys.map(obj => {
                        return [
                            obj.label,
                            arr[0][obj.key],
                            arr[1][obj.key],
                            arr[2][obj.key],
                        ]
                    })
                }
                else if (type === 'trend') {
                    let arr
                    if(this.type === '合计'){
                        arr = source.filter(_ => _.STORE_TYPE === '整体' && moment(_.MDATE).format('YYYY') === moment(this.month).format('YYYY'))
                    }
                    else {
                        arr = source.filter(_ => _.STORE_TYPE === this.type && moment(_.MDATE).format('YYYY') === moment(this.month).format('YYYY'))
                    }
                    this.line.series[0].data = []
                    this.line.series[1].data = []
                    this.line.xAxis.data = []
                    this.$refs.overViewEchart.$refs.echarts.clear()
                    this.line = _.cloneDeep(this.lineCopy)
                    if (!arr.length) return
                    arr.sort((a, b) => a.MDATE_WID - b.MDATE_WID)
                    let keys = [
                        ['MDATE', 'COST', 'YOY_COST'],
                        ['MDATE', 'LZ_NUM', 'YOY_LZ_NUM'],
                        ['MDATE', 'LZ_COST', 'YOY_LZ_COST']
                    ]
                    this.line.series[0].data = arr.map(item => {
                        // return keys[this.currentOverview].map(key => {
                        //     if (key === 'MDATE') return moment(item[key]).format('M月')
                        //     return item[key]
                        // })
                        return [
                            moment(item[keys[this.currentOverview][0]]).format('M月'),
                            item[keys[this.currentOverview][1]]
                        ]
                    })
                    this.line.series[1].data = arr.map(item => {
                        return [
                            moment(item[keys[this.currentOverview][0]]).format('M月'),
                            item[keys[this.currentOverview][2]]
                        ]
                    })
                    this.computeYasisLabel([
                        this.line.series[0].data.map(_ => {
                            return _[1]
                        }).filter(_ => _ !== undefined && _ !== null),
                        this.line.series[1].data.map(_ => {
                            return _[1]
                        }).filter(_ => _ !== null && _ !== undefined)
                    ], 'line')
                    this.line.xAxis.data = arr.map(_ => moment(_.MDATE).format('M月'))
                }
                else if(type === 'toolsTable') {
                    let arr = source.filter(_ => _.TOOL_TYPE === this.toolsType && moment(_.MDATE).format('YYYYMM') === this.month)
                    this.table1.index = this.toolsType === '淘外工具' ? 'PromotionCost_tool_A' : 'PromotionCost_tool_B'
                    this.table1.labelData = this.table1.labelData.slice(0, 2)
                    this.table1.tableData = []
                    if(this.STORE_TYPE.length) arr = arr.filter(_ => this.STORE_TYPE.indexOf(_.STORE_TYPE) > -1)
                    if(this.category.length) arr = arr.filter(_ => this.category.indexOf(_.PRODUCT_CATE) > -1)
                    if(!arr.length) return
                    let obj = {
                        TOOL: null,
                        COST: null,
                        COST_FIN_RAT: null,
                        YOY_DIF_COST: null,
                        LZ_NUM: null,
                        LZ_FIN_RAT: null,
                        YOY_DIF_LZ_NUM: null,
                        LZ_COST: null,
                        LZ_COST_FIN_RAT: null,
                        YOY_DIF_LZ_COST: null,
                    }
                    let newArr = []
                    Array.from(new Set(arr.map(_ => _.TOOL))).map(TOOL => {
                        let newObj = _.cloneDeep(obj)
                        newObj.TOOL = TOOL
                        newArr.push(newObj)
                        return TOOL
                    })
                    newArr = newArr.map(item => {
                        return {
                            arr: arr.filter(_ => _.TOOL === item.TOOL),
                            ...item
                        }
                    })
                    newArr = newArr.map(item => {
                        let newObj = _.cloneDeep(obj)
                        // let keys = ['COST', 'YOY_COST', 'LZ_NUM', 'TGT_LZ_NUM', 'YOY_LZ_NUM', 'LZ_COST', 'TGT_COST', 'YOY_LZ_COST', 'DJ_NUM', 'TGT_DJ_NUM', 'YOY_DJ_NUM', 'SCJG_NUM',
                        //     'TGT_SCJG_NUM', 'YOY_SCJG_NUM', 'ZX_NUM', 'TGT_ZX_NUMB', 'YOY_ZX_NUM', 
                        // ]
                        let keys = ['COST', 'YOY_COST', 'LZ_NUM', 'TGT_LZ_NUM', 'YOY_LZ_NUM', 'TGT_COST', 'DJ_NUM', 'TGT_DJ_NUM', 'YOY_DJ_NUM', 'SCJG_NUM',
                            'TGT_SCJG_NUM', 'YOY_SCJG_NUM', 'ZX_NUM', 'TGT_ZX_NUMB', 'YOY_ZX_NUM', 
                        ]
                        for(let i = 0; i < keys.length; i++) {
                            if(item.arr.map(_ => _[keys[i]]).filter(_ => _ !== null && _ !== undefined).length) {
                                newObj[keys[i]] = item.arr.map(_ => _[keys[i]]).filter(_ => _ !== null && _ !== undefined).reduce((a, b) => a + b)
                            }
                            else {
                                newObj[keys[i]] = null
                            }
                        }
                        return {
                            obj: _.cloneDeep(newObj),
                            ...item
                        }
                    })
                    newArr.forEach(item => {
                        // let keys = ['COST', 'YOY_COST', 'LZ_NUM', 'TGT_LZ_NUM', 'YOY_LZ_NUM', 'LZ_COST', 'TGT_COST', 'YOY_LZ_COST', 'DJ_NUM', 'TGT_DJ_NUM', 'YOY_DJ_NUM', 'SCJG_NUM',
                        //     'TGT_SCJG_NUM', 'YOY_SCJG_NUM', 'ZX_NUM', 'TGT_ZX_NUMB', 'YOY_ZX_NUM', 
                        // ]
                        let keys = ['COST', 'YOY_COST', 'LZ_NUM', 'TGT_LZ_NUM', 'YOY_LZ_NUM', 'TGT_COST', 'DJ_NUM', 'TGT_DJ_NUM', 'YOY_DJ_NUM', 'SCJG_NUM',
                            'TGT_SCJG_NUM', 'YOY_SCJG_NUM', 'ZX_NUM', 'TGT_ZX_NUMB', 'YOY_ZX_NUM', 
                        ]
                        keys.forEach(key => {
                            item[key] = item.obj[key]
                        })
                    })
                    let sumkeys = ['COST', 'YOY_COST', 'LZ_NUM', 'TGT_LZ_NUM', 'YOY_LZ_NUM', 'TGT_COST', 'DJ_NUM', 'TGT_DJ_NUM', 'YOY_DJ_NUM', 'SCJG_NUM',
                        'TGT_SCJG_NUM', 'YOY_SCJG_NUM', 'ZX_NUM', 'TGT_ZX_NUMB', 'YOY_ZX_NUM', 
                    ]
                    // let sumkeys = ['COST', 'YOY_COST', 'LZ_NUM', 'TGT_LZ_NUM', 'YOY_LZ_NUM', 'LZ_COST', 'TGT_COST', 'YOY_LZ_COST', 'DJ_NUM', 'TGT_DJ_NUM', 'YOY_DJ_NUM', 'SCJG_NUM',
                        // 'TGT_SCJG_NUM', 'YOY_SCJG_NUM', 'ZX_NUM', 'TGT_ZX_NUMB', 'YOY_ZX_NUM', 
                    // ]
                    let sum = {}
                    sumkeys.forEach(key => {
                        if(newArr.map(_ => _[key]).filter(_ => _ !== null && _ !== undefined).length) {
                            sum[key] = newArr.map(_ => _[key]).filter(_ => _ !== null && _ !== undefined).reduce((a, b) => a + b)
                        }
                        else sum[key] = null
                    })

                    newArr.sort((a, b) => b.COST - a.COST)
                    newArr.unshift(sum)
                    let that = this
                    let computeFun = function(type = 'reach', arr = []) {
                        if(type === 'reach') {
                            if(!that.comparyNone(arr, true)) return null
                            else return arr[0] / arr[1]
                        }
                        else if(type === 'YOY') {
                            if(!that.comparyNone(arr, true)) return null
                            else return (arr[0] - arr[1]) / arr[1]
                        }
                    }
                    let newObj = [
                        // 花费进度
                        {targetKey: 'COST_FIN_RAT', key1: 'COST', key2: 'TGT_COST', funType: 'reach'},
                        // 花费同比
                        {targetKey: 'YOY_DIF_COST', key1: 'COST', key2: 'YOY_COST', funType: 'YOY'},
                        /*  */// 留资成本
                        {targetKey: 'LZ_COST', key1: 'COST', key2: 'LZ_NUM', funType: 'reach'},
                        /*  */// 同期留资成本
                        {targetKey: 'YOY_LZ_COST', key1: 'YOY_COST', key2: 'YOY_LZ_NUM', funType: 'reach'},
                        // 留资达成
                        {targetKey: 'LZ_FIN_RAT', key1: 'LZ_NUM', key2: 'TGT_LZ_NUM', funType: 'reach'},
                        // 留资同比
                        {targetKey: 'YOY_DIF_LZ_NUM', key1: 'LZ_NUM', key2: 'YOY_LZ_NUM', funType: 'YOY'},
                        /* 留资成本目标 */
                        {targetKey: 'LZ_COST_MB', key1: 'TGT_COST', key2: 'TGT_LZ_NUM', funType: 'reach'},
                        // 留资成本达成
                        {targetKey: 'LZ_COST_FIN_RAT', key1: 'LZ_COST', key2: 'LZ_COST_MB', funType: 'reach'},
                        // 留资成本同比
                        {targetKey: 'YOY_DIF_LZ_COST', key1: 'LZ_COST', key2: 'YOY_LZ_COST', funType: 'YOY'},
                        // CPC
                        {targetKey: 'CPC', key1: 'COST', key2: 'DJ_NUM', funType: 'reach'},
                        /* CPC达成分母 */
                        {targetKey: 'CPC_DC_FM', key1: 'TGT_COST', key2: 'TGT_DJ_NUM', funType: 'reach'},
                        // CPC达成
                        {targetKey: 'CPC_DC', key1: 'CPC', key2: 'CPC_DC_FM', funType: 'reach'},
                        /* 同期CPC */
                        {targetKey: 'CPC_TQ', key1: 'YOY_COST', key2: 'YOY_DJ_NUM', funType: 'reach'},
                        // CPC同比
                        {targetKey: 'CPC_TB', key1: 'CPC', key2: 'CPC_TQ', funType: 'YOY'},
                        // 收藏加购成本
                        {targetKey: 'SCJG_CB', key1: 'COST', key2: 'SCJG_NUM', funType: 'reach'},
                        /* 收藏加购成本达成 分母 */
                        {targetKey: 'SCJG_CB_DC_FM', key1: 'TGT_COST', key2: 'TGT_SCJG_NUM', funType: 'reach'},
                        // 收藏加购成本达成
                        {targetKey: 'SCJG_CB_DC', key1: 'SCJG_CB', key2: 'SCJG_CB_DC_FM', funType: 'reach'},
                        /* 同期收藏加购成本 */
                        {targetKey: 'SCJG_CB_TQ', key1: 'YOY_COST', key2: 'YOY_SCJG_NUM', funType: 'reach'},
                        // 收藏加购成本同比
                        {targetKey: 'SCJG_CB_TB', key1: 'SCJG_CB', key2: 'SCJG_CB_TQ', funType: 'YOY'},
                        // 咨询数达成
                        {targetKey: 'ZXS_DC', key1: 'ZX_NUM', key2: 'TGT_ZX_NUMB', funType: 'reach'},
                        // 咨询数同比
                        {targetKey: 'ZXS_TB', key1: 'ZX_NUM', key2: 'YOY_ZX_NUM', funType: 'YOY'},
                        // 咨询成本
                        {targetKey: 'ZXS_CB', key1: 'COST', key2: 'ZX_NUM', funType: 'reach'},
                        /* 咨询成本目标 */
                        {targetKey: 'ZXS_CB_MB', key1: 'TGT_COST', key2: 'TGT_ZX_NUMB', funType: 'reach'},
                        // 咨询成本达成
                        {targetKey: 'ZXS_CB_DC', key1: 'ZXS_CB', key2: 'ZXS_CB_MB', funType: 'reach'},
                        /* 同期咨询成本 */
                        {targetKey: 'ZXS_CB_TQ', key1: 'YOY_COST', key2: 'YOY_ZX_NUM', funType: 'reach'},
                        // 咨询成本同比
                        {targetKey: 'ZXS_CB_TB', key1: 'ZXS_CB', key2: 'ZXS_CB_TQ', funType: 'YOY'},
                        
                    ]
                    newArr.forEach(item => {
                        for(let i = 0; i < newObj.length; i ++) {
                            item[newObj[i].targetKey] = computeFun(newObj[i].funType, [ item[newObj[i].key1], item[newObj[i].key2] ])
                        }
                    })
                    let keys = [
                        {label: '花费', key: 'COST'},
                        {label: '花费进度', key: 'COST_FIN_RAT'},
                        {label: '花费同比', key: 'YOY_DIF_COST'},
                        {label: '留资数', key: 'LZ_NUM'},
                        {label: '留资达成', key: 'LZ_FIN_RAT'},
                        {label: '留资同比', key: 'YOY_DIF_LZ_NUM'},
                        {label: '留资成本', key: 'LZ_COST'},
                        {label: '留资成本达成', key: 'LZ_COST_FIN_RAT'},
                        {label: '留资成本同比', key: 'YOY_DIF_LZ_COST'},
                    ]
                    let keys1 = [
                        {label: '花费', key: 'COST'},
                        {label: '花费进度', key: 'COST_FIN_RAT'},
                        {label: '花费同比', key: 'YOY_DIF_COST'},
                        {label: 'CPC', key: 'CPC'},
                        {label: 'CPC达成', key: 'CPC_DC'},
                        {label: 'CPC同比', key: 'CPC_TB'},
                        {label: '收藏加购成本', key: 'SCJG_CB'},
                        {label: '收藏加购成本达成', key: 'SCJG_CB_DC'},
                        {label: '收藏加购成本同比', key: 'SCJG_CB_TB'},
                        {label: '咨询数', key: 'ZX_NUM'},
                        {label: '咨询数达成', key: 'ZXS_DC'},
                        {label: '咨询数同比', key: 'ZXS_TB'},
                        {label: '咨询成本', key: 'ZXS_CB'},
                        {label: '咨询成本达成', key: 'ZXS_CB_DC'},
                        {label: '咨询成本同比', key: 'ZXS_CB_TB'},
                        
                    ]
                    if(this.toolsType === '淘外工具') {
                        this.table1.tableData = newArr.forEach(item => {
                            return keys.map(obj => {
                                return item[obj.key]
                            }).unshift(null)
                        })
                    }
                    else if(this.toolsType === '淘内工具') {
                         this.table1.tableData = newArr.forEach(item => {
                            return keys1.map(obj => {
                                return item[obj.key]
                            }).unshift(null)
                        })
                    }
                    this.table1.labelData = ['工具'].concat(Array.from(new Set(newArr.map(item => {
                        if(!item.TOOL) return '合计'
                        return item.TOOL
                    }))))
                    let keysobj = this.toolsType === '淘外工具' ? keys : keys1
                    this.table1.tableData = keysobj.map(obj => {
                        return [
                            obj.label,
                            ...newArr.map(item => item[obj.key])
                        ]
                    })
                }
                else if(type === 'toolsTrend') {
                    let arr = source.filter(_ => _.TOOL_TYPE === this.toolsType && moment(_.MDATE_WID).format('YYYY') === moment(this.month).format('YYYY'))
                    if(this.STORE_TYPE.length) arr = arr.filter(_ => this.STORE_TYPE.indexOf(_.STORE_TYPE) > -1)
                    if(this.category.length) arr = arr.filter(_ => this.category.indexOf(_.PRODUCT_CATE) > -1)
                    if(this.toolsCol !== '合计') arr = arr.filter(_ => _.TOOL === this.toolsCol)
                    this.line1.xAxis.data = []
                    this.line1.series[0].data = []
                    this.line1.series[1].data = []
                    this.$refs?.line1?.$refs?.echarts?.clear()
                    if(!arr.length) return
                    arr.sort((a, b) => moment(a.MDATE).format('x') - moment(b.MDATE).format('x'))
                    let objKey = ['COST', 'YOY_COST', 'LZ_NUM', 'YOY_LZ_NUM', 'DJ_NUM', 'SCJG_NUM', 'ZX_NUM', 'YOY_ZX_NUM', 'YOY_DJ_NUM', 'YOY_SCJG_NUM', 'YOY_ZX_NUM']
                    let newArr = Array.from(new Set(arr.map(_ => moment(_.MDATE).format('YYYYMM')))).map(m => {
                        let obj = {}
                        objKey.map(key => {
                            let targetArr = arr.filter(_ => moment(_.MDATE).format('YYYYMM') === m).map(_ => _[key]).filter(_ => _ !== null && _ !== undefined)
                            if(targetArr.length) return obj[key] = targetArr.reduce((a,b) => a + b)
                            else obj[key] = null
                        })
                        return {
                            MDATE: m,
                            ...obj
                        }
                    })
                        // {targetKey: 'CPC_TQ', key1: 'YOY_COST', key2: 'YOY_DJ_NUM', funType: 'reach'},
                        // {targetKey: 'SCJG_CB', key1: 'COST', key2: 'SCJG_NUM', funType: 'reach'},
                        // {targetKey: 'ZXS_CB', key1: 'COST', key2: 'ZX_NUM', funType: 'reach'},

                    newArr.forEach(item => {
                        if(this.comparyNone([item.COST, item.LZ_NUM], true)) item.LZ_CB = item.COST / item.LZ_NUM
                        else item.LZ_CB = null
                        if(this.comparyNone([item.YOY_COST, item.YOY_LZ_NUM], true)) item.LZ_CB_TQ = item.YOY_COST / item.YOY_LZ_NUM
                        else item.LZ_CB_TQ = null
                        if(this.comparyNone([item.COST, item.DJ_NUM], true)) item.CPC = item.COST / item.DJ_NUM
                        else item.CPC = null
                        if(this.comparyNone([item.COST, item.SCJG_NUM], true)) item.SCJG_CB = item.COST / item.SCJG_NUM
                        else item.SCJG_CB = null
                        if(this.comparyNone([item.COST, item.ZX_NUM], true)) item.ZXS_CB = item.COST / item.ZX_NUM
                        else item.ZXS_CB = null
                        if(this.comparyNone([item.YOY_COST, item.YOY_DJ_NUM], true)) item.CPC_TQ = item.YOY_COST / item.YOY_DJ_NUM
                        else item.CPC_TQ = null
                        if(this.comparyNone([item.YOY_COST, item.YOY_SCJG_NUM], true)) item.SCJG_CB_TQ = item.YOY_COST / item.YOY_SCJG_NUM
                        else item.SCJG_CB_TQ = null
                        if(this.comparyNone([item.YOY_COST, item.YOY_ZX_NUM], true)) item.ZXS_CB_TQ = item.YOY_COST / item.YOY_ZX_NUM
                        else item.ZXS_CB_TQ = null
                    })
                    let keys
                    if(this.toolsTrendRadio === '花费') keys = ['MDATE', 'COST', 'YOY_COST']
                    else if(this.toolsTrendRadio === '留资数量') keys = ['MDATE', 'LZ_NUM', 'YOY_LZ_NUM']
                    else if(this.toolsTrendRadio === '留资成本') keys = ['MDATE', 'LZ_CB', 'LZ_CB_TQ']
                    else if(this.toolsTrendRadio === 'CPC') keys = ['MDATE', 'CPC', 'CPC_TQ']
                    else if(this.toolsTrendRadio === '收藏加购成本') keys = ['MDATE', 'SCJG_CB', 'SCJG_CB_TQ']
                    else if(this.toolsTrendRadio === '咨询数') keys = ['MDATE', 'ZX_NUM', 'YOY_ZX_NUM']
                    else if(this.toolsTrendRadio === '咨询成本') keys = ['MDATE', 'ZXS_CB', 'ZXS_CB_TQ']
                    this.line1.xAxis.data = Array.from(new Set(newArr.map(_ => moment(_.MDATE).format('M月'))))
                    this.line1.series[0].data = newArr.map(item => {
                        return keys.map(key => {
                            if(key === 'MDATE') return moment(item[key]).format('M月')
                            return item[key]
                        })
                    })
                    this.line1.series[1].data = newArr.map(item => {
                        return [
                            moment(item[keys[0]]).format('M月'),
                            item[keys[2]]
                        ]
                    })
                      this.computeYasisLabel([
                        this.line1.series[0].data.map(_ => {
                            return _[1]
                        }).filter(_ => _ !== undefined && _ !== null),
                        this.line1.series[1].data.map(_ => {
                            return _[1]
                        }).filter(_ => _ !== null && _ !== undefined)
                    ], 'line1')
                }
            }
        }
    }
</script>

<style lang="scss">
.category{
    .ant-select-dropdown-menu-item{
        font-size: 12px;
    }
}
</style>
<style lang="scss" scoped>
@import '../../assets/styles.scss';
    .red{
        color: #ff5953!important
    }
    .green{
        color: #00a854!important
    }
    .PromotionCost {
        .header {
            height: 38px;
            padding-bottom: 10px;
            border-bottom: 1px solid #F0F0F0;
            display: flex;
            align-items: center;
            position: relative;
            span:nth-child(2) {
                padding-top: 2px;
                font-size: 12px;
                font-family: PingFangSC-Regular, PingFang SC;
                color: rgba(0, 0, 0, 0.88);
                line-height: 20px;
            }
            span:nth-child(3) {
                margin-top: 2px;
                font-size: 12px;
                font-family: PingFangSC-Regular, PingFang SC;
                color: rgba(0, 0, 0, 0.25);
                line-height: 20px;
            }
            >div:nth-child(4) {
                flex: 1
            }
        }

        .main {
            height: calc(100% - 38px);
            display: flex;

            .OverallOverview {
                flex: 4;
                position: relative;

                .title {
                    margin-top: 19px;
                    font-size: 14px;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 600;
                    color: #000000;
                    line-height: 20px;
                }

                .overView {
                    margin-top: 11px;
                    display: flex;
                    cursor: pointer;
                    .item:hover {
                        background: $panelsHoverColor;
                        // border-top: 5px solid #46bca0
                    }
                    .active {
                        background: $panelsHoverColor;
                        // border-top: 5px solid #46bca0
                    }

                    .item {
                        flex: 1;
                        padding: 5px 30px 5px 5px;
                        transition: background 0.3s;
                        border-radius: 5px;

                        div:nth-child(1) {
                            font-size: 13px;
                            font-family: PingFangSC-Regular, PingFang SC;
                            color: rgba(0, 0, 0, 0.64);
                            line-height: 22px;
                            margin-bottom: 8px;
                        }

                        div:nth-child(2) {
                            font-size: 22px;
                            font-family: PingFangSC-Medium, PingFang SC;
                            font-weight: 600;
                            color: #333333;
                            line-height: 24px;
                        }

                        div:nth-child(3),
                        div:nth-child(4) {
                            display: grid;
                            grid-template-columns: auto 1fr auto;

                            span:nth-child(1) {
                                font-size: 12px;
                                font-family: PingFangSC-Regular, PingFang SC;
                                color: #999999;
                                line-height: 18px;
                            }

                            span:nth-child(3) {
                                font-size: 12px;
                                font-family: PingFangSC-Regular, PingFang SC;
                                color: rgba(0, 0, 0, 0.64);
                                line-height: 18px;
                            }
                        }
                    }
                }

                .table {
                    margin-top: 18px;
                    /deep/ .row{
                        height: 25px;
                        line-height: 25px;
                        padding: 0 4px;
                    }
                    /deep/ .row:nth-child(1) {
                        height: 52px;
                        line-height: 52px;
                        padding: 0 4px;
                    }
                    /deep/ .col1{
                        width: 60px;
                        min-width: 60px;
                        max-width: 60px;
                    }

                    /deep/ .col1 .row {
                        cursor: pointer;
                        text-decoration: underline;
                    }
                    /deep/ .col1 .row:hover {
                        cursor: pointer;
                        text-decoration: underline;
                        color: #4C89FF;
                    }
                    /deep/ .col1 .active{
                        color: #4C89FF;
                    }
                    /deep/ .col1 .row:nth-child(1) {
                        cursor: text;
                        text-decoration: none;
                        color: rgba(0, 0, 0, 0.88)
                    }

                    /deep/ .col .row:nth-child(1) {
                        display: flex;
                        justify-content: flex-end;
                        align-items: center;
                        white-space: initial;
                        text-overflow: initial;
                        text-align: center;
                        line-height: 16px;
                    }
                }

                .lineTitle {
                    position: absolute;
                    left: 0;
                    // bottom: calc(100% - 20px - 19px - 11px - 100px - 156px - 18px - 22px);
                    transform: translateY(100%);
                    font-size: 13px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    // color: rgba(0, 0, 0, 0.64);
                    color: #333;
                    line-height: 22px;
                }

                .line {
                    margin-top: 22px;
                    // height: calc(100% - 20px - 19px - 11px - 100px - 156px - 18px - 22px) !important;
                    overflow: visible !important;
                }
            }

            .tools {
                flex: 6;
                position: relative;
                .title {
                    margin-top: 19px;
                    font-size: 14px;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 600;
                    color: #000000;
                    line-height: 20px;
                }
                /deep/ .ant-radio-group{
                    font-size: 12px;
                }
                .selects {
                    /deep/ .ant-checkbox-wrapper{
                        font-size: 12px;
                    }
                    // /deep/ 
                    /deep/ .ant-select{
                        font-size: 12px;
                    }
                    margin-top: 12px;
                    display: flex;
                    align-items: center;
                    font-size: 12px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    color: #000000;
                    line-height: 18px;
                }

                .table {
                    margin-top: 14px;
                    /deep/ .row {
                        height: 25px;
                        line-height: 25px;
                        padding: 0 4px;
                    }
                    /deep/ .row:nth-child(1){
                        height: 60px;
                        font-size: 12px;
                        line-height: 13px;
                        white-space: inherit;
                        text-overflow: initial;
                        display: flex;
                        align-items: center;
                        justify-content: flex-end;
                    }
                    /deep/ .col1 .row:nth-child(1){
                        justify-content: flex-start;
                    }
                    /deep/ .col1 .row{
                        cursor: pointer;
                        text-decoration: underline;
                    }
                    /deep/ .col1 .active{
                        color: #4C89FF;
                    }
                    /deep/ .col1 .row:hover {
                        cursor: pointer;
                        text-decoration: underline;
                        color: #4C89FF;
                    }
                 
                    /deep/ .col1 .row:nth-child(1) {
                        cursor: text;
                        text-decoration: none;
                        color: rgba(0, 0, 0, 0.88)
                    }
                }

                .lineTitle {
                    //margin-top: 10px;
                    //position: absolute;
                    //left: 0;
                    //bottom: calc(100% - 20px - 19px - 11px - 90px - 156px - 18px - 22px);
                    //transform: translateY(100%);
                    font-size: 13px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    // color: rgba(0, 0, 0, 0.64);
                    color: #333;
                    line-height: 22px;
                }

                .lineRadio {
                    //position: absolute;
                    //left: 0;
                    // bottom: calc(100% - 20px - 19px - 11px - 90px - 166px - 18px - 22px - 22px - 7px);
                    //transform: translateY(100%);
                    margin-top: 20px;
                    font-size: 12px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    color: #666666;
                    line-height: 20px;
                }

                .line {
                    // height: calc(100% - 20px - 19px - 32px - 12px - 228px - 14px - 54px) !important;
                    overflow: visible;
                    //margin-top: 54px;
                }
            }
        }
    }
</style>