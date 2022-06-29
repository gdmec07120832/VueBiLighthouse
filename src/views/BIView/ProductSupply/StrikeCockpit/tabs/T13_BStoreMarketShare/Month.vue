<template>
    <div class="Month">
        <div class="panels">
            <Panel
            @click.native="clickPanel(item.name)"
            :class="{active: item.name === currentPanel ? true : false}"
            v-bind.sync="item"
            v-for="(item, index) in panels"
            style="width: 468px;flex: none;cursor: pointer;"
            :key="index"
            />
        </div>
        <div class="bottomBox">
            <Table ref="table" class="table" v-bind.sync="table" :style="{'--isSticky': isSticky, '--stickyTop': stickyTop}"/>
            <div style="width: 30px"></div>
            <div class="rightBox">
                <div style="display: flex;align-items: center;">
                    <div class="title_2">{{ echartType.value }}{{currentPanel === 'B店支付业绩（参谋）' ? '（业绩）' : '（访客）'}}</div>
                    <div style="flex: 1"></div>
                    <Radio v-bind.sync="echartType"/>
<!--                    <Select v-bind.sync="storeSelect" style="min-width: 200px"/>-->
                    <virtual-select
                    style="width: 250px;margin-right: 0"
                    v-model="storeSelect.value"
                    :label="storeSelect.label"
                    :options="storeSelect.options.map((_) => ({ label: _ }))"
                    :allowShowClear="false"
                    ></virtual-select>
                </div>
                <v-chart v-if="echartType.value === '市场占比'" ref="line" class="barAndLine mt10" style="height: calc(100% - 38px)" :options="line" autoresize></v-chart>
                <v-chart v-else ref="line1" class="barAndLine mt10" style="height: calc(100% - 38px)" :options="line1" autoresize></v-chart>
            </div>
        </div>
    </div>
</template>

<script>
import _ from 'lodash'
import Panel from '../../components/Panel'
import Table from '../../components/TableRow'
// import Select from '../../components/Select'
import base from '../../utils/base.js'
import moment from 'moment'
import VirtualSelect from '@/views/BIView/components/VSelect/VSelectV3'
import Radio from '../../components/Radio'
import Vue from 'vue'
export default {
    mixins: [ base ],
    components: {
        Panel,
        Table,
        // Select,
        VirtualSelect,
        Radio,
    },
    props: {
        month: {
            type: Array,
            default() {return [moment(), moment()]}
        }
    },
    async created() {
        this.panels = ['B店支付业绩（参谋）', 'B店访客人数'].map(name => {
            let obj = _.cloneDeep(this.panel)
            obj.name = name
            obj.map[0].value = name
            return obj
        })
        this.line = await this.createLine({
            tooltipFormatter: ['percent', 'percent', 'percent', 'percent', 'percent'],
            yAxisLabelFormatter: 'percent',
            xAxisLabelFormatter: 'normal',
        })
        delete this.line.series[0].areaStyle
        delete this.line.series[1].areaStyle
        this.line.series.push(_.cloneDeep(this.line.series[0]))
        this.line.series.push(_.cloneDeep(this.line.series[0]))
        this.line.series.push(_.cloneDeep(this.line.series[0]))
        // this.line.series.push(_.cloneDeep(this.line.series[0]))
        this.line.legend.left = 0
        this.line.grid.top = 30
        this.line.color = ['#5B8FF9', '#F6BD16', '#EB63D8', '#2EBFBE', '#5D7092']
        this.line.series[0].name = ''
        this.line.series[0].data = []
        this.line.series[1].name = ''
        this.line.series[1].data = []
        this.line.series[2].name = ''
        this.line.series[2].data = []
        this.line.series[3].name = ''
        this.line.series[3].data = []
        this.line.series[4].name = ''
        this.line.series[4].data = []

        this.line1 = await this.createLine({
            tooltipFormatter: ['toFixed2', 'toFixed2', 'toFixed2', 'toFixed2', 'toFixed2'],
            yAxisLabelFormatter: 'toFixed2',
            xAxisLabelFormatter: 'normal',
        })
        delete this.line1.series[0].areaStyle
        delete this.line1.series[1].areaStyle
        this.line1.series.push(_.cloneDeep(this.line1.series[0]))
        this.line1.series.push(_.cloneDeep(this.line1.series[0]))
        this.line1.series.push(_.cloneDeep(this.line1.series[0]))
        this.line1.legend.left = 0
        this.line1.grid.top = 30
        this.line1.color = ['#5B8FF9', '#F6BD16', '#EB63D8', '#2EBFBE', '#5D7092']
        this.line1.series[0].name = ''
        this.line1.series[0].data = []
        this.line1.series[1].name = ''
        this.line1.series[1].data = []
        this.line1.series[2].name = ''
        this.line1.series[2].data = []
        this.line1.series[3].name = ''
        this.line1.series[3].data = []
        this.line1.series[4].name = ''
        this.line1.series[4].data = []
        this.getPanel()
        this.getTrend()
    },
    watch: {
        month: {
            handler(){
                this.getPanel()
                this.getTrend()
            },
            deep: true
        },
        'storeSelect.value': {
            async handler(val, oval){
                if(val.toString() === oval.toString()) return
                if(val.length < 1){
                    this.$message.warning('最少选择1个店铺');
                    this.storeSelect.value = oval.concat()
                    return
                }
                else if(val.length > 5){
                    this.$message.warning('最多选择5个店铺');
                    this.storeSelect.value = oval.concat()
                    return
                }
                this.getTrend()
            },
        },
        currentPanel: {
            handler(val){
                if(val === 'B店支付业绩（参谋）') {
                    this.isSticky = 'sticky'
                    this.stickyTop = '25px'
                    this.table.header.data.c = '业绩'
                    this.table.sorting = {field: 'PAY_AMOUNT', order: 'desc'}
                }
                else {
                    this.isSticky = 'static'
                    this.stickyTop = 'auto'
                    this.table.header.data.c = '访客人数'
                    this.table.sorting = {field: 'VISITORS', order: 'desc'}
                }

                this.handleData('table', this.tableData)
                this.handleData('trend', this.trendData)
            }
        },
        'table.pagination.page': {
            handler(){
                this.handleData('table', this.tableData)
            }
        },
        'table.pagination.pageSize': {
            handler(val){
                this.table.pagination.page = 1
                this.handleData('table', this.tableData)
            }
        },
        'table.sorting': {
            handler(val){
                this.table.tableColumn.forEach(item => {
                    if('sort' in item) {
                        item.sort = null
                        if(item.key === val.field){
                            if(val.order === 'asc') item.sort = 'up'
                            else if(val.order === 'desc') item.sort = 'down'
                        }
                    }
                })
                this.handleData('table', this.tableData)
            },
            deep: true
        },
        'echartType.value': {
            handler(){
                this.handleData('trend', this.trendData)
            }
        }
    },
    data() {
        let panel = {
            name: '',
            tabIndex: 'T10_PromotionRate',
            row: 4,
            column: 4,
            area: [
                ['a', 'a', 'a', 'a'],
                ['b', 'b', 'b', 'b'],
                ['c', 'd', 'e', 'f'],
                ['g', 'h', 'i', 'j'],
            ],
            map: [
                {areaName: 'a', value: '', className: 'title'},
                {areaName: 'b', keyName: 'b', className: 'subTitle', valueFormat: 'tenThousand'},
                {areaName: 'c', value: '源氏木语家居旗舰店', className: 'label'},
                {areaName: 'd', keyName: 'd', className: 'value', valueFormat: 'tenThousand'},
                {areaName: 'e', value: '全友家居官方旗舰店', className: 'label'},
                {areaName: 'f', keyName: 'f', className: 'value', valueFormat: 'tenThousand',},
                {areaName: 'g', value: '顾家家居官方旗舰店', className: 'label'},
                {areaName: 'h', keyName: 'h', className: 'value', valueFormat: 'tenThousand'},
                {areaName: 'i', value: '芝华仕官方旗舰店', className: 'label'},
                {areaName: 'j', keyName: 'j', className: 'value', valueFormat: 'tenThousand',},
            ],
            dataSource: {
                b: null,
                d: null,
                f: null,
                h: null,
                j: null,
            },
        }
        this.getTrend = _.debounce(this.getTrend, 200, {
            leading: false,
            trailing: true
        })
        return {
            panel,
            panels: [],
            currentPanel: 'B店支付业绩（参谋）',
            table: {
                maxHeight: 'calc(100% - 63px)',
                height: 'calc(100% - 63px)',
                header: {
                    area: [
                        ['a', 'b', 'c', 'd', 'e', 'f'],
                    ],
                    data: {
                        a: '排名',
                        b: '店铺',
                        c: '业绩',
                        d: '同比',
                        e: '市占',
                        f: '林氏/竞店',
                    },
                },
                // 配置字段
                // valueFormat sumFirstFormat sumLastFormat 可以是字符串或函数
                tableColumn: [
                    {key: 'index', areaName: 'a', canClick: false},
                    {key: 'FULL_STORE_NAME', areaName: 'b'},
                    {
                        key: 'PAY_AMOUNT',
                        areaName: 'c',
                        valueFormat: 'tenThousand',
                        sort: 'down',
                    },
                    {key: 'yoy_PAY_AMOUNT', areaName: 'd', valueFormat: 'percent', colorFormat: 'YOY', sort: null},
                    {key: 'PAY_AMOUNT_RATE', areaName: 'e', valueFormat: 'percent', sort: null},
                    {key: 'ratio_PAY_AMOUNT', areaName: 'f', valueFormat: 'toFixed2', sort: null},
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
                    show: true,
                    page: 1,
                    pageSize: 10,
                    pageSizeOptions: ['10', '20', '30', '50', '100'],
                    total: 0,
                },
                // sorting: {field: 'PAY_AMOUNT', order: 'desc'}
                sorting: {field: 'PAY_AMOUNT', order: 'desc'}
            },
            tableData: [],
            echartType: {
                label: '',
                value: '市场占比',
                options: ['市场占比', '林氏/竞店']
            },
            storeSelect: {
                label: '店铺选择',
                // value: ['林氏木业家具旗舰店', '源氏木语家居旗舰店', '全友家居官方旗舰店', '顾家家居官方旗舰店', '芝华仕官方旗舰店'],
                value: ['林氏木业家具旗舰店', '源氏木语家居旗舰店', '全友家居官方旗舰店',],
                options: ['林氏木业家具旗舰店', '源氏木语家居旗舰店', '全友家居官方旗舰店', '顾家家居官方旗舰店', '芝华仕官方旗舰店']
            },
            trendData: [],
            line: null,
            line1: null,
            isSticky: 'sticky',
            stickyTop: '25px',
        }
    },
    methods: {
        clickPanel(name) {
            this.currentPanel = name
        },
        async getPanel(){
            let query = {
                START_DATE: this.month[0].format('YYYYMMDD'),
                END_DATE: this.month[1].format('YYYYMMDD')
            }
            let res = await this.$fetchSql('all_center', 'all_center_b_shop_d', query)
            this.tableData = res.data.concat()
            this.handleData('panel', res.data)
            this.handleData('table', res.data)
            res.data.sort((a, b) => b.PAY_AMOUNT - a.PAY_AMOUNT)
            this.storeSelect.options = Array.from(new Set(res.data.map(_ => _.FULL_STORE_NAME).filter(_ => _ !== null && _ !== '林氏木业家具旗舰店' && _ !== '林氏木业家具旗舰店（纯线上）')))
            this.storeSelect.options.unshift('林氏木业家具旗舰店')
        },
        async getTrend(){
            let query = {
                START_DATE: this.month[0].format('YYYYMMDD'),
                END_DATE: this.month[1].format('YYYYMMDD')
            }
            // if(this.storeSelect.value.toString() === '林氏木业家具旗舰店') query.FULL_STORE_NAME = '林氏木业家具旗舰店,源氏木语家居旗舰店,全友家私家具旗舰店,顾家家居官方旗舰店,芝华仕官方旗舰店'
            // else query.FULL_STORE_NAME = '林氏木业家具旗舰店,' + this.storeSelect.value.toString()
            query.FULL_STORE_NAME = this.storeSelect.value.toString()
            let res = await this.$fetchSql('all_center', 'all_center_b_shop_d_trend', query)
            this.trendData = res.data.concat()
            this.handleData('trend', res.data)
        },
        handleData(type, source){
            if(type === 'panel'){
                let arr = _.cloneDeep(source)
                this.panels[0].dataSource = {
                    b: null,
                    d: null,
                    f: null,
                    h: null,
                    j: null,
                }
                this.panels[1].dataSource = {
                    b: null,
                    d: null,
                    f: null,
                    h: null,
                    j: null,
                }
                if(!arr.length) return
                let mapObj = [
                    {FULL_STORE_NAME: '林氏木业家具旗舰店', keyName: 'b'},
                    {FULL_STORE_NAME: '源氏木语家居旗舰店', keyName: 'd'},
                    {FULL_STORE_NAME: '全友家居官方旗舰店', keyName: 'f'},
                    {FULL_STORE_NAME: '顾家家居官方旗舰店', keyName: 'h'},
                    {FULL_STORE_NAME: '芝华仕官方旗舰店', keyName: 'j'},
                ]
                let newArr = mapObj.map(obj => {
                    let item = arr.filter(_ => _.FULL_STORE_NAME === obj.FULL_STORE_NAME)
                    if(item.length) item = item[0]
                    else item = {
                        PAY_AMOUNT: null,
                        VISITORS: null
                    }
                    return {
                        ...obj,
                        data: item
                    }
                })
                let obj = {}, obj1 = {}
                newArr.forEach(item => {
                    obj[item.keyName] = item.data.PAY_AMOUNT
                    obj1[item.keyName] = item.data.VISITORS
                })
                this.panels[0].dataSource = obj
                this.panels[1].dataSource = obj1
            }
            else if(type === 'table'){
                let arr = _.cloneDeep(source)
                this.table.dataSource = [
                    {
                        index: '/',
                        FULL_STORE_NAME: '/',
                        PAY_AMOUNT: '/',
                        yoy_PAY_AMOUNT: '/',
                        PAY_AMOUNT_RATE: '/',
                        ratio_PAY_AMOUNT: '/',
                        VISITORS: '/',
                        yoy_VISITORS: '/',
                        VISITORS_RATE: '/',
                        ratio_VISITORS: '/',
                    }
                ]
                if(!arr.length) return
                // 取 林氏木业家具旗舰店（纯线上）
                let online = arr.filter(_ => _.FULL_STORE_NAME === '林氏木业家具旗舰店（纯线上）')
                if(online.length) online = online[0]
                else online = {}
                // 取 林氏木业家具旗舰店
                let offline = arr.filter(_ => _.FULL_STORE_NAME === '林氏木业家具旗舰店')
                if(offline.length) offline = offline[0]
                else offline = {}
                arr = arr.filter(_ => !['林氏木业家具旗舰店（纯线上）', '林氏木业家具旗舰店'].includes(_.FULL_STORE_NAME))
                // 计算 同比 林氏/竞店 比值
                let fun = function(type, a, b){
                    if(type === 'YOY'){
                        if([undefined, null].includes([a, b]) || b === 0) return null
                        else return (a - b) / b
                    }
                    else if(type === 'reach'){
                        if([undefined, null].includes([a, b]) || b === 0) return null
                        else return a / b
                    }
                }
                let keys
                if(this.currentPanel === 'B店支付业绩（参谋）'){
                    keys = ['index', 'FULL_STORE_NAME', 'PAY_AMOUNT', 'yoy_PAY_AMOUNT', 'PAY_AMOUNT_RATE', 'ratio_PAY_AMOUNT']
                    this.table.tableColumn = this.table.tableColumn.map((item, index) => {
                        return {
                            ...item,
                            key: keys[index]
                        }
                    })
                }
                else if(this.currentPanel === 'B店访客人数'){
                    keys = ['index', 'FULL_STORE_NAME', 'VISITORS', 'yoy_VISITORS', 'VISITORS_RATE', 'ratio_VISITORS']
                    this.table.tableColumn = this.table.tableColumn.map((item, index) => {
                        return {
                            ...item,
                            key: keys[index]
                        }
                    })
                }
                let { field, order } = this.table.sorting
                online = {
                    index: '--',
                    FULL_STORE_NAME: online.FULL_STORE_NAME,
                    PAY_AMOUNT: online.PAY_AMOUNT,
                    yoy_PAY_AMOUNT: fun('YOY', online.PAY_AMOUNT, online.YOY_PAY_AMOUNT),
                    PAY_AMOUNT_RATE: fun('reach', online.PAY_AMOUNT, online.MARKET_AMOUNT),
                    ratio_PAY_AMOUNT: '--',
                    VISITORS: online.VISITORS,
                    yoy_VISITORS: fun('YOY', online.VISITORS, online.YOY_VISITORS),
                    // VISITORS_RATE: online.VISITORS_RATE,
                    VISITORS_RATE: fun('reach', online.VISITORS, online.MARKET_VISITORS),
                    ratio_VISITORS: '--',
                    MARKET_AMOUNT: online.MARKET_AMOUNT,
                    MARKET_VISITORS: online.MARKET_VISITORS,
                }
                offline = {
                    index: '--',
                    FULL_STORE_NAME: offline.FULL_STORE_NAME,
                    PAY_AMOUNT: offline.PAY_AMOUNT,
                    yoy_PAY_AMOUNT: fun('YOY', offline.PAY_AMOUNT, offline.YOY_PAY_AMOUNT),
                    PAY_AMOUNT_RATE: fun('reach', offline.PAY_AMOUNT, offline.MARKET_AMOUNT),
                    // PAY_AMOUNT_RATE: offline.PAY_AMOUNT_RATE,
                    ratio_PAY_AMOUNT: 1,
                    VISITORS: offline.VISITORS,
                    yoy_VISITORS: fun('YOY', offline.VISITORS, offline.YOY_VISITORS),
                    // VISITORS_RATE: offline.VISITORS_RATE,
                    VISITORS_RATE: fun('reach', offline.VISITORS, offline.MARKET_VISITORS),
                    ratio_VISITORS: 1,
                    MARKET_AMOUNT: offline.MARKET_AMOUNT,
                    MARKET_VISITORS: online.MARKET_VISITORS,
                }
                let indexObj = {}
                let indexArr = _.cloneDeep(source)
                indexArr = indexArr.filter(_ => !['林氏木业家具旗舰店（纯线上）'].includes(_.FULL_STORE_NAME))
                if(this.currentPanel === 'B店支付业绩（参谋）') indexArr.sort((a, b) => b.PAY_AMOUNT - a.PAY_AMOUNT)
                else indexArr.sort((a, b) => b.VISITORS - a.VISITORS)
                indexArr.forEach((item, index) => {
                    indexObj[item.FULL_STORE_NAME] = index + 1
                })
                offline.index = indexObj['林氏木业家具旗舰店']
                let newArr = arr.map((item, index) => {
                    return {
                        index: indexObj[item.FULL_STORE_NAME],
                        FULL_STORE_NAME: item.FULL_STORE_NAME,
                        PAY_AMOUNT: item.PAY_AMOUNT,
                        yoy_PAY_AMOUNT: fun('YOY', item.PAY_AMOUNT, item.YOY_PAY_AMOUNT),
                        // PAY_AMOUNT_RATE: item.PAY_AMOUNT_RATE,
                        PAY_AMOUNT_RATE: fun('reach', item.PAY_AMOUNT, item.MARKET_AMOUNT),
                        // 林氏比
                        ratio_PAY_AMOUNT: fun('reach', offline.PAY_AMOUNT, item.PAY_AMOUNT),
                        VISITORS: item.VISITORS,
                        yoy_VISITORS: fun('YOY', item.VISITORS, item.YOY_VISITORS),
                        // VISITORS_RATE: item.VISITORS_RATE,
                        VISITORS_RATE: fun('reach', item.VISITORS, item.MARKET_VISITORS),
                        ratio_VISITORS: fun('reach', offline.VISITORS, item.VISITORS),
                    }
                })
                // 排序
                let {page, pageSize} = this.table.pagination
                if(field !== 'rownum' && order === 'desc') newArr.sort((a, b) => b[field] - a[field])
                else if(field !== 'rownum' && order === 'asc') newArr.sort((a, b) => a[field] - b[field])
                // 分页
                this.table.pagination.total = newArr.length
                newArr = newArr.slice((page - 1) * pageSize, page * pageSize)
                newArr.unshift(offline)
                if(this.currentPanel === 'B店支付业绩（参谋）') newArr.unshift(online)
                this.table.dataSource = newArr
                let vm = this
                this.$nextTick(() => {
                    let tbody = vm.$refs.table.$el.children[1].children[0].children[0]
                    for(let i = 0; i < tbody.children.length; i++) {
                        let tr = tbody.children[i]
                        let td = tr.children[1]
                        if(td.title === '林氏木业家具旗舰店') {
                            td.style.position = 'relative'
                            let div = new Vue({
                                render: function(h) {
                                    return <a-tag color="blue" style="height: 16px;line-height: 14px;position: absolute;right: 0;zIndex: 2" class="text-xs">B店</a-tag>
                                }
                            }).$mount().$el
                            td.appendChild(div)
                        }
                        else if(td.title === '林氏旗舰店') {
                            td.style.position = 'relative'
                            td.style.position = 'relative'
                            let div = new Vue({
                                render: function(h) {
                                    return <a-tag color="blue" style="height: 16px;line-height: 14px;position: absolute;right: 0;zIndex: 2" class="text-xs">D店</a-tag>
                                }
                            }).$mount().$el
                            td.appendChild(div)
                        }
                    }
                })
            }
            else if(type === 'trend'){
                let arr = _.cloneDeep(source)
                this.line.xAxis[0].data = []
                this.line1.xAxis[0].data = []
                for(let i = 0; i < 5; i++){
                    this.line.series[i].name = ''
                    this.line.series[i].data = []
                    this.line1.series[i].name = ''
                    this.line1.series[i].data = []
                }
                let line = _.cloneDeep(this.line)
                let line1 = _.cloneDeep(this.line1)
                this.$refs?.line?.$refs?.echarts.clear()
                this.$refs?.line1?.$refs?.echarts.clear()
                this.line = line
                this.line1 = line1
                if(!arr.length) return
                let newArr
                // if(this.storeSelect.value.toString() === '林氏木业家具旗舰店'){
                //     newArr = ['林氏木业家具旗舰店', '源氏木语家居旗舰店', '全友家私家具旗舰店', '顾家家居官方旗舰店', '芝华仕官方旗舰店'].map(name => {
                //         let item = arr.filter(_ => _.FULL_STORE_NAME === name)
                //         if(!item.length) item = []
                //         return item
                //     })
                // }
                // else if(this.storeSelect.value.toString() !== '林氏木业家具旗舰店'){
                //     let nameArr = this.storeSelect.value.concat()
                //     nameArr.unshift('林氏木业家具旗舰店')
                //     newArr = nameArr.map(name => {
                //         let item = arr.filter(_ => _.FULL_STORE_NAME === name)
                //         if(!item.length) item = []
                //         return item
                //     })
                // }
                let nameArr = this.storeSelect.value.concat()
                newArr = nameArr.map(name => {
                    let item = arr.filter(_ => _.FULL_STORE_NAME === name)
                    if(!item.length) item = []
                    return item
                })
                arr.sort((a, b) => a.TDATE_WID - b.TDATE_WID)
                this.line.xAxis[0].data = Array.from(new Set(arr.map(_ => moment(_.TDATE_WID).format('M月D日'))))
                this.line1.xAxis[0].data = Array.from(new Set(arr.map(_ => moment(_.TDATE_WID).format('M月D日'))))
                let keys = this.currentPanel === 'B店支付业绩（参谋）' ? ['TDATE_WID', 'PAY_AMOUNT_RATE'] : ['TDATE_WID', 'VISITORS_RATE']
                let keys1 = this.currentPanel === 'B店支付业绩（参谋）' ? ['TDATE_WID', 'LS_RATE_PAY_AMOUNT'] : ['TDATE_WID', 'LS_RATE_VISITORS']
                let sortObj = {}
                this.storeSelect.options.forEach((name, index) => {
                    sortObj[name] = index
                })
                newArr.sort((a, b) => {
                    let a_i = 99
                    let b_i = 99
                    if(a.length) a_i = sortObj[a[0].FULL_STORE_NAME]
                    if(b.length) b_i = sortObj[b[0].FULL_STORE_NAME]
                    return a_i - b_i
                })
                this.line.legend.data = newArr.map(_ => _[0].FULL_STORE_NAME)
                this.line1.legend.data = newArr.map(_ => _[0].FULL_STORE_NAME)
                newArr.forEach((item, index) => {
                    item.sort((a, b) => a.TDATE_WID - b.TDATE_WID)
                    this.line.series[index].name = item[0].FULL_STORE_NAME
                    this.line.series[index].data = item.map(_ => {
                        return keys.map(key => {
                            if(key === 'TDATE_WID') return moment(_[key]).format('M月D日')
                            return _[key]
                        })
                    })
                    this.line1.series[index].name = item[0].FULL_STORE_NAME
                    this.line1.series[index].data = item.map(_ => {
                        return keys1.map(key => {
                            if(key === 'TDATE_WID') return moment(_[key]).format('M月D日')
                            return _[key]
                        })
                    })
                })
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../../assets/styles';
.Month{
    margin-top: 10px;
    height: calc(100% - 48px);
    .panels{
        display: flex;
        .active{
            background: rgba(0, 0, 0, 0.03);
        }
        /deep/ .Panel{
            padding: 12px 24px 16px 24px;
            &:hover{
                background: rgba(0, 0, 0, 0.03);
            }
            .row_2{
                margin-top: 6px;
            }
            .row_3{
                margin-top: 14px;
            }
            .row_3, .row_4{
                .column:nth-child(odd){
                    width: 120px;
                    flex: none
                }
                .column:nth-child(4){
                    width: 60px;
                    flex: none;
                    text-align: right;
                    padding-right: 0px;
                }
                .column:nth-child(1){
                    margin-right: 10px;
                }
                .column:nth-child(2){
                    flex: 1;
                    width: auto;
                    text-align: right;
                    // margin-right: 50px;
                    margin-right: 0px;
                    padding-right: 30px;
                    
                }
            }
            //.row_3, .row_4{
            //    .column:nth-child(even){
            //        text-align: right;
            //    }
            //}
        }
    }
    .bottomBox{
        margin-top: 18px;
        display: flex;
        height: calc(100% - 148px);
        /deep/ .table{
            flex: 5;
            tr{
                height: 25px!important;
            }
            td:nth-child(1) {
                flex: none;
                width: 60px;
                justify-content: center!important;
            }
            td:nth-child(2) {
                flex: none;
                width: 180px;
                justify-content: flex-start;
            }
            .row_2{
                position: sticky;
                top: 0;
                background: #fff;
            }
            .row_3{
                position: var(--isSticky);
                top: var(--stickyTop);
                background: #fff;
            }
        }
        .rightBox{
            flex: 6;
        }
    }
}
</style>