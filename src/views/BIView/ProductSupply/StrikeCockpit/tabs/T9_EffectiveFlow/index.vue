<template>
    <div class="T9_EffectiveFlow">
        <div class="header">
            <Title class="title" style="z-index: 2" :label="'全域流量'" :jump="true" :jumpTarget="JumpStr" />
            <div style="flex: 1"></div>
            <Radio v-bind.sync="flowType"/>
            <a-popover  placement="bottomLeft" class="mr10">
                <template #content>
                    <p class="pClass">
                        ① 有效流量：统计周期内每日访问店铺的去重访客数、剔除异常流量（互动城、聚划算章鱼、淘金币等异常流量）<br/>
                        ② 平台流量：统计周期内每日访问店铺的去重访客数
                    </p>
                </template>
                <template #title>
                    <span>备注说明</span>
                </template>
                <a-icon style="font-size: 16px;color: rgb(153, 153, 153);" type="question-circle"/>
            </a-popover>
            <div class="text-xs text-black mr10">统计月份</div>
            <a-month-picker v-model="month" valueFormat="YYYYMM" :allowClear="false"/>
        </div>
        <div class="content">
            <div class="leftBox">
                <div class="select">
                    <div class="title_1">整体达成</div>
                    <Select v-bind.sync="store" style="min-width: 250px"/>
                </div>
                <div class="title_2">访客数</div>
                <div class="panels">
                    <template v-for="(item, index) in panels">
                        <Panel v-bind="item" :key="'panel' + index" style="flex: 1"/>
                        <div v-if="index !== panels.length - 1" :key="'div' + index" style="width: 30px"></div>
                    </template>
                </div>
                <v-chart ref="line" :options="line" style="overflow: visible;height: calc(100% - 347px);margin-top: 30px" class="barAndLine" autoresize></v-chart>
                <Table v-bind="table" style="margin-top: 30px"/>
            </div>
            <div style="width: 60px"></div>
            <div ref="rightBox" class="rightBox">
                <div style="display: flex;align-items: center;justify-content: space-between;height: 28px">
                    <div class="title_1">店铺情况</div>
                    <Radio v-bind.sync="monthOrYear"/>
                </div>
                <TableRow class="table" v-bind.sync="table1" style="height: calc(100% - 42px);" :style="{'--trHeight': trHeight}"/>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment'
import _ from 'lodash'
import base from '../../utils/base.js'
import Title from '../../components/Title'
import Radio from '../../components/Radio'
import Select from '../../components/Select'
import Panel from '../../components/Panel'
import Table from '../../components/TableOld'
import TableRow from '../../components/TableRow'
export default {
    mixins: [ base ],
    components: {
        Title,
        Radio,
        Select,
        Panel,
        Table,
        TableRow,
    },
    created() {
        this.line = this.createLine({xAxisLabelFormatter: 'normal'})
        this.line.grid.top = 10
        this.line.series[0].name = '当期'
        this.line.series[1].name = '同期'
        this.getData();
        this.jumpTarget();
    },
    mounted() {
        // this.trHeight = (this.$refs.rightBox.offsetHeight - 38 - 42 ) / (this.table1.pagination.pageSize + 2) + 'px'
        this.rightBoxOffsetHeight = this.$refs.rightBox.offsetHeight
        let h = (this.rightBoxOffsetHeight - 42)  / (this.table1.dataSource.length + 2)
        h = (h > 20) ? h : 20
        this.table1.height = this.rightBoxOffsetHeight - 42 - h + 'px'
        this.table1.maxHeight = this.rightBoxOffsetHeight - 42 - h + 'px'
        window.addEventListener('resize', this.resizeEvent)
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.resizeEvent)
    },
    watch: {
        // 有效流量 / 平台流量
        'flowType.value': {
            handler(val) {
                this.table1.sorting = {
                    field: 'VISITORS',
                    order: 'desc'
                }
                let {field, order} = this.table1.sorting
                this.table1.tableColumn.forEach(item => {
                    if(Object.prototype.hasOwnProperty.call(item, 'sort') && item.key !== field) item.sort = null
                    else if(Object.prototype.hasOwnProperty.call(item, 'sort') && item.key === field) item.sort = order === 'desc' ? 'down' : 'up'
                })
                this.store.options = Array.from(new Set(this.allData.filter(_ => _.VISITORS_TYPE === val && _.YDATE_WID === this.month.slice(0, 4)).sort((a, b) => b.VISITORS - a.VISITORS).map(_ => _.STORE_NAME).filter(_ => _ !== '汇总')))
                this.store.options.unshift({label: '全部', value: '汇总'})
                this.store.value = '汇总'
                this.handleData('panel', this.generateData('panel'))
                this.handleData('line', this.generateData('line'))
                this.handleData('table', this.generateData('table'))
                let arr = this.generateData('table1').sort((a, b) => b.VISITORS - a.VISITORS)
                this.handleData('table1', arr)
            }
        },
        month: {
            handler() {
                this.handleData('panel', this.generateData('panel'))
                this.handleData('line', this.generateData('line'))
                this.handleData('table', this.generateData('table'))
                let arr = this.generateData('table1').sort((a, b) => b.VISITORS - a.VISITORS)
                this.handleData('table1', arr)
            }
        },
        'store.value': {
            handler(val) {
                this.handleData('panel', this.generateData('panel'))
                this.handleData('line', this.generateData('line'))
                this.handleData('table', this.generateData('table'))
            }
        },
        // 当月 / 年度
        'monthOrYear.value': {
            handler(val) {
                this.table1.sorting = {
                    field: 'VISITORS',
                    order: 'desc'
                }
                let {field, order} = this.table1.sorting
                this.table1.tableColumn.forEach(item => {
                    if(Object.prototype.hasOwnProperty.call(item, 'sort') && item.key !== field) item.sort = null
                    else if(Object.prototype.hasOwnProperty.call(item, 'sort') && item.key === field) item.sort = order === 'desc' ? 'down' : 'up'
                })
                this.table1.pagination.page = 1
                let arr = this.generateData('table1').sort((a, b) => b.VISITORS - a.VISITORS)
                this.handleData('table1', arr)
            }
        },
        'table1.pagination.page': {
            handler(val) {
                this.handleData('table1', this.table1Data)

            }
        },
        'table1.pagination.pageSize': {
            handler() {
                this.table1.pagination.page = 1
                this.handleData('table1', this.table1Data)
            }
        },
        'table1.sorting': {
            handler(val) {
                this.table1.tableColumn.forEach(item => {
                    if('sort' in item) {
                        item.sort = null
                        if(item.key === val.field){
                            if(val.order === 'asc') item.sort = 'up'
                            else if(val.order === 'desc') item.sort = 'down'
                        }
                    }
                })
                this.sorter()
            },
            deep: true
        },
    },
    computed: {
        trHeight() {
            let h = (this.rightBoxOffsetHeight - 42)  / (this.table1.dataSource.length + 2)
            return h > 20 ? h + 'px' : '20px'
        }
    },
    data() {
        let that = this
        let resizeEvent = function () {
            setTimeout(() => {
                that.rightBoxOffsetHeight = that.$refs.rightBox.offsetHeight
                let h = (that.rightBoxOffsetHeight - 42)  / (that.table1.dataSource.length + 2)
                h = (h > 25) ? h : 25
                that.table1.height = that.rightBoxOffsetHeight - 42  - h + 'px'
                that.table1.maxHeight = that.rightBoxOffsetHeight - 42  - h + 'px'
            }, 200)
        }
        return {
            allData: [],
            resizeEvent,
            rightBoxOffsetHeight: 0,
            flowType: {
                value: '有效访客',
                options: [
                    {label: '有效流量', value: '有效访客'},
                    {label: '平台流量', value: '平台访客'},
                ],
            },
            month: moment().format('DD') === '01' ? moment().subtract('1', 'M').format('YYYYMM') : moment().format('YYYYMM'),
            store: {
                label: '店铺选择',
                value: '汇总',
                options: []
            },
            panels: [
                {
                    name: '访客数',
                    tabIndex: 'T9_EffectiveFlow',
                    row: 3,
                    column: 2,
                    area: [
                        ['a', 'a'],
                        ['b', 'c'],
                        ['d', 'e'],
                    ],
                    map: [
                        {areaName: 'a', keyName: 'VISITORS', className: 'subTitle', valueFormat: 'round'},
                        {areaName: 'b', value: '同期', className: 'label'},
                        {areaName: 'c', keyName: 'YOY_VISITORS', className: 'value', valueFormat: 'round'},
                        {areaName: 'd', value: '同比', className: 'label'},
                        {areaName: 'e', keyName: 'YOY_DIFF_VISITORS', className: 'value', valueFormat: 'percent', colorFormat: 'YOY'},
                    ],
                    dataSource: {},
                },
                {
                    name: '日累计',
                    tabIndex: 'T9_EffectiveFlow',
                    row: 3,
                    column: 2,
                    area: [
                        ['a', 'a'],
                        ['b', 'c'],
                        ['d', 'e'],
                    ],
                    map: [
                        {areaName: 'a', value: ''},
                        {areaName: 'b', value: '日累计目标', className: 'label'},
                        {areaName: 'c', keyName: 'CUM_VISITOR_TARGET', className: 'value', valueFormat: 'round'},
                        {areaName: 'd', value: '日累计达成', className: 'label'},
                        {areaName: 'e', keyName: 'CUM_VISITORS_RATE', className: 'value', valueFormat: 'percent', colorFormat: 'reach'},
                    ],
                    dataSource: {},
                },
                {
                    name: '月累计',
                    tabIndex: 'T9_EffectiveFlow',
                    row: 3,
                    column: 2,
                    area: [
                        ['a', 'a'],
                        ['b', 'c'],
                        ['d', 'e'],
                    ],
                    map: [
                        {areaName: 'a', value: ''},
                        {areaName: 'b', value: '月累计目标', className: 'label'},
                        {areaName: 'c', keyName: 'VISITOR_TARGET_ALL_MONTH', className: 'value', valueFormat: 'round'},
                        {areaName: 'd', value: '月累计达成', className: 'label'},
                        {areaName: 'e', keyName: 'VISITORS_RATE', className: 'value', valueFormat: 'percent', colorFormat: 'reach'},
                    ],
                    dataSource: {},
                },
            ],
            line: null,
            monthOrYear: {
                value: '当月',
                options: ['当月', {label: '年度', value: '年累'}]
            },
            table: {
                index: 'T9_EffectiveFlow',
                labelData: ['年份', '目标', moment().format('YYYY年'), moment().subtract(1, 'y').format('YYYY年'), '同比', '达成'],
                tableData: [
                    ['当期累计', '/', '/', '/', '/', '/']
                ],
            },
            table1: {
                maxHeight: 'calc(100% - 73px)',
                height: 'calc(100% - 73px)',
                header: {
                    area: [
                        ['a', 'b', 'c', 'd', 'e', 'f'],
                    ],
                    data: {
                        a: '店铺',
                        b: '目标',
                        c: '实际',
                        d: '达成',
                        e: '同期',
                        f: '同比',
                    },
                },
                // 配置字段
                // valueFormat sumFirstFormat sumLastFormat 可以是字符串或函数
                tableColumn: [
                    {key: 'STORE_NAME', areaName: 'a', valueFormat: 'normal', sumFirstFormat: 'normal', canClick: false},
                    {key: 'VISITOR_TARGET_ALL_MONTH', areaName: 'b', valueFormat: 'tenThousand', sumFirstFormat: 'tenThousand', sort: null},
                    {key: 'VISITORS', areaName: 'c', valueFormat: 'tenThousand', sumFirstFormat: 'tenThousand', sort: 'down'},
                    {key: 'VISITORS_RATE', areaName: 'd', valueFormat: 'percent', sumFirstFormat: 'percent', slot: 'bar', slotValueKey: 'VISITORS_RATE', colorFormat: 'reach', sumFirstColorFormat: 'reach', sort: null},
                    {key: 'YOY_VISITORS', areaName: 'e', valueFormat: 'tenThousand', sumFirstFormat: 'tenThousand', sort: null},
                    {key: 'YOY_DIFF_VISITORS', areaName: 'f', valueFormat: 'percent', sumFirstFormat: 'percent', colorFormat: 'YOY', sumFirstColorFormat: 'YOY', sort: null},
                ],
                // 合并项
                // 首行或首列 尾行或尾列
                sum: {
                    first: {
                        show: true,
                        // 暂时只能固定一行 一列 多的会被覆盖
                        data: [
                            {STORE_NAME: '汇总', VISITOR_TARGET_ALL_MONTH: null, VISITORS: null, VISITORS_RATE: null, YOY_VISITORS: null, YOY_DIFF_VISITORS: null}
                        ],
                        sticky: true,
                    },
                    last: {
                        show: false,
                    }
                },
                // 放数据
                dataSource: [
                    {
                        STORE_NAME: '/',
                        VISITOR_TARGET_ALL_MONTH: '/',
                        VISITORS: '/',
                        VISITORS_RATE: '/',
                        YOY_VISITORS: '/',
                        YOY_DIFF_VISITORS: '/',
                    },
                    {
                        STORE_NAME: '/',
                        VISITOR_TARGET_ALL_MONTH: '/',
                        VISITORS: '/',
                        VISITORS_RATE: '/',
                        YOY_VISITORS: '/',
                        YOY_DIFF_VISITORS: '/',
                    }
                ],
                pagination: {
                    show: false,
                    page: 1,
                    pageSize: 99999999,
                    pageSizeOptions: ['12', '20', '30', '50', '100'],
                    total: 0,
                },
                sorting: {field: 'VISITORS', order: 'desc'}
            },
            table1Data: [],
            JumpStr:'',
        }
    },
    methods: {
        async jumpTarget() {
        let query = {
            versionMainNum:(process.env.VUE_APP_RELEASE_ENV !== 'pro')?'BI_PC_2022_00051':'BI_PC_2020_00309'
        }
        let res =  await this.$fetchSql('ALL_USER', 'getMenuIdAbsolutePathByVersionMainNum',query);
        if(process.env.VUE_APP_RELEASE_ENV !== 'pro') {
            this.JumpStr = 'http://test.bi.linshimuye.com:9090/x/'+res.data[0].ID_ABSOLUTE_PATH;
        }
        else {
            this.JumpStr = 'http://bi.linshimuye.com:9090/x/'+res.data[0].ID_ABSOLUTE_PATH;
        }
        },
        async getData() {
            let res = await this.$fetchSql('all_center', 'all_center_effect_flow')
            this.allData = res.data.concat()
            this.store.options = Array.from(new Set(this.allData.filter(_ => _.VISITORS_TYPE === this.flowType.value).sort((a, b) => b.VISITORS - a.VISITORS).map(_ => _.STORE_NAME).filter(_ => _ !== '汇总')))
            this.store.options.unshift({label: '全部', value: '汇总'})
            this.handleData('panel', this.generateData('panel'))
            this.handleData('line', this.generateData('line'))
            this.handleData('table', this.generateData('table'))
            let arr = this.generateData('table1').sort((a, b) => b.VISITORS - a.VISITORS)
            this.handleData('table1', arr)
        },
        computeNum(type, a, b) {
            if(type === 'YOY') {
                if([undefined, null].includes(a) || [0, undefined, null].includes(b)) return null
                else return a / b - 1
            }
            else if(type === 'reach') {
                if([undefined, null].includes(a) || [0, undefined, null].includes(b)) return null
                else return a / b
            }
        },
        generateData(type) {
            if(type === 'panel') {
                if(!this.allData.length) return []
                return this.allData.filter(_ => _.MDATE_WID === this.month &&  _.VISITORS_TYPE === this.flowType.value && _.STORE_NAME === this.store.value && _.TIME_TYPE === '当月')
            }
            else if(type === 'line' || type === 'table') {
                if(!this.allData.length) return []
                let source = this.allData.filter(_ => _.YDATE_WID === this.month.slice(0, 4) &&  _.VISITORS_TYPE === this.flowType.value && _.STORE_NAME === this.store.value && _.TIME_TYPE === '当月')
                source = source.sort((a, b) => a.MDATE_WID - b.MDATE_WID)
                let sum = {
                    VISITOR_TARGET_ALL_MONTH: null,
                    VISITORS: null,
                    YOY_VISITORS: null,
                }
                for(let key in sum) {
                    let targetArr = source.filter(_ => _.MDATE_WID <= this.month).map(_ => _[key])
                    if(targetArr.length) sum[key] = targetArr.reduce((a, b) => a + b)
                }
                sum.MDATE_WID = '当期累计'
                sum.YOY_DIFF_VISITORS = this.computeNum('YOY', sum.VISITORS, sum.YOY_VISITORS)
                sum.CUM_VISITORS_RATE = this.computeNum('reach', sum.VISITORS, sum.VISITOR_TARGET_ALL_MONTH)
                source.unshift(sum)
                return source
            }
            else if(type === 'table1') {
                if(!this.allData.length) return []
                let source
                if(this.monthOrYear.value === '当月'){
                    source = this.allData.filter(_ => _.MDATE_WID === this.month &&  _.VISITORS_TYPE === this.flowType.value && _.TIME_TYPE === '当月')
                }
                else if(this.monthOrYear.value === '年累'){
                    // source = this.allData.filter(_ => _.YDATE_WID === this.month.slice(0, 4) && _.MDATE_WID <= this.month && _.VISITORS_TYPE === this.flowType.value && _.TIME_TYPE === '年累')
                    source = this.allData.filter(_ => _.YDATE_WID === this.month.slice(0, 4) && _.VISITORS_TYPE === this.flowType.value && _.TIME_TYPE === '年累')
                }
                let {field, order} = this.table1.sorting
                if(field !== 'rownum' && order === 'asc') source.sort((a, b) => a[field] - b[field])
                if(field !== 'rownum' && order === 'desc') source.sort((a, b) => b[field] - a[field])
                this.table1.pagination.total = source.length - 1
                this.table1Data = source
                return source
            }
        },
        handleData(type, source) {
            if(type === 'panel') {
                if(!source.length) {
                    let obj = {
                        VISITORS: null,
                        YOY_VISITORS: null,
                        YOY_DIFF_VISITORS: null,
                        CUM_VISITOR_TARGET: null,
                        VISITORS_RATE: null,
                        VISITOR_TARGET_ALL_MONTH: null,
                        CUM_VISITORS_RATE: null,
                    }
                    this.panels[0].dataSource = obj
                    this.panels[1].dataSource = obj
                    this.panels[2].dataSource = obj
                    return
                }
                this.panels[0].dataSource = source[0]
                this.panels[1].dataSource = source[0]
                this.panels[2].dataSource = source[0]
            }
            else if(type === 'line') {
                let arr = source.slice(1)
                this.$refs?.line?.$refs?.echarts?.clear()
                if(!arr.length) return
                this.line.series[0].name = this.month.slice(0, 4) + '年'
                this.line.series[1].name = this.month.slice(0, 4) - 1 + '年'
                this.line.xAxis[0].data = arr.map(_ => moment(_.MDATE_WID).format('M月'))
                let keys = ['MDATE_WID', 'VISITORS', 'YOY_VISITORS']
                this.line.series[0].data = arr.map(item => {
                    return keys.map(key => {
                        if(key === 'MDATE_WID') return moment(item[key]).format('M月')
                        if(item.MDATE_WID > this.month && item[key] === 0) return null
                        return item[key]
                    })
                })
                this.line.series[1].data = arr.map(item => {
                    return [
                        moment(item[keys[0]]).format('M月'),
                        item.MDATE_WID > this.month && item[keys[2]] === 0 ? null : item[keys[2]]
                    ]
                })
                this.line.yAxis[0].axisLabel.interval = 5
                this.computeYasisLabel([
                    this.line.series[0].data.map(_ => {
                        return _[1]
                    }).filter(_ => _ !== undefined && _ !== null),
                    this.line.series[1].data.map(_ => {
                        return _[1]
                    }).filter(_ => _ !== null && _ !== undefined)
                ], 'line')
            }
            else if(type === 'table') {
                this.table.labelData[2] = this.month.slice(0, 4) + '年'
                this.table.labelData[3] = this.month.slice(0, 4) - 1 + '年'
                this.table.tableData = [
                    ['当期累计', '/', '/', '/', '/', '/']
                ]
                if(!source.length) return
                let keys = ['MDATE_WID', 'VISITOR_TARGET_ALL_MONTH', 'VISITORS', 'YOY_VISITORS', 'YOY_DIFF_VISITORS', 'CUM_VISITORS_RATE']
                let arr = source.map(item => {
                    return keys.map(key => {
                        if(key === 'MDATE_WID') return item[key] === '当期累计' ? '当期累计' : moment(item[key]).format('M月')
                        else if(item.MDATE_WID > this.month && (item[key] === 0 || item[key] === -1)) return null
                        return item[key]
                    })
                })
                this.table.tableData = arr
            }
            else if(type === 'table1') {
                let arr = _.cloneDeep(source)
                this.table1.sum.first.data = [
                    {STORE_NAME: '合计', VISITOR_TARGET_ALL_MONTH: null, VISITORS: null, VISITORS_RATE: null, YOY_VISITORS: null, YOY_DIFF_VISITORS: null}
                ]
                this.table1.dataSource = [
                    {
                        STORE_NAME: '/',
                        VISITOR_TARGET_ALL_MONTH: '/',
                        VISITORS: '/',
                        VISITORS_RATE: '/',
                        YOY_VISITORS: '/',
                        YOY_DIFF_VISITORS: '/',
                    },
                    {
                        STORE_NAME: '/',
                        VISITOR_TARGET_ALL_MONTH: '/',
                        VISITORS: '/',
                        VISITORS_RATE: '/',
                        YOY_VISITORS: '/',
                        YOY_DIFF_VISITORS: '/',
                    }
                ]
                if(!arr.length) return
                let sum = arr.filter(_ => _.STORE_NAME === '合计' || _.STORE_NAME === '汇总' )
                if(sum.length) {
                    sum = sum[0]
                    sum.STORE_NAME = '合计'
                    this.table1.sum.first.data = []
                    this.table1.sum.first.data.push(sum)
                }
                let { page, pageSize } = this.table1.pagination
                let newArr = arr.filter(_ => _.STORE_NAME !== '合计').slice((page - 1) * pageSize, page * pageSize)
                // 添加字段用来做实际slot的宽度
                let maxArr = _.cloneDeep(newArr)
                maxArr.sort((a,b) => b.VISITORS - a.VISITORS)
                let maxVISITORS
                if(maxArr.length) maxVISITORS = maxArr[0].VISITORS
                else maxVISITORS = 0
                newArr.forEach(item => {
                    if(maxVISITORS === 0) item.slotWidth = 0
                    else if(maxVISITORS >= 0) item.slotWidth = item.VISITORS / maxVISITORS
                })
                this.table1.dataSource = newArr
                this.rightBoxOffsetHeight = this.$refs.rightBox.offsetHeight
                let h = (this.rightBoxOffsetHeight - 42)  / (this.table1.dataSource.length + 2)
                h = (h > 20) ? h : 20
                this.table1.height = this.rightBoxOffsetHeight - 42 - h + 'px'
                this.table1.maxHeight = this.rightBoxOffsetHeight - 42 - h + 'px'
            }
        },
        sorter(){
            let {field, order} = this.table1.sorting
            if(field === 'rownum') {
                this.handleData('table1', this.generateData('table1'))
            }
            else {
                if(order === 'asc'){
                    this.handleData('table1', this.table1Data.sort((a, b) => a[field] - b[field]))
                }else if(order === 'desc'){
                    this.handleData('table1', this.table1Data.sort((a, b) => b[field] - a[field]))
                }
            }
        }
    }
}
</script>


<style lang="scss" scoped>
@import '../../assets/styles.scss';
.pCss{
    margin: 0px;
    padding: 0px;
    font-size: 12px;
}
.T9_EffectiveFlow{
    .header {
        height: 38px;
        padding-bottom: 10px;
        border-bottom: 1px solid #F0F0F0;
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }
    .content{
        margin-top: 10px;
        height: calc(100% - 58px);
        display: flex;
        .leftBox{
            height: 100%;
            width: calc(60% - 30px);
            .select{
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            /deep/ .panels{
                margin-top: 10px;
                width: 100%;
                display: flex;
                .Panel{
                    width: 140px;
                    //margin-right: 60px;
                    &:nth-last-child(1) {
                        margin-right: 0;
                    }
                    .row_1 {
                        height: 22px;
                    }
                    .row_2, .row_3{
                        margin-top: 10px;
                        .column:nth-child(1){
                            width: auto;
                            margin-right: 20px;
                            flex: none;
                        }
                        .column:nth-last-child(1) {
                            // text-align: left;
                            text-align: right;
                            padding-right: 50%;
                        }
                    }
                }
            }
            /deep/ .Table{
                .col1{
                    width: 60px;
                    min-width: 60px;
                    max-width: 60px;
                }
                //.row:nth-child(1){
                //    width: 60px;
                //}
                .col:nth-child(2){
                    min-width: 70px;
                }
                .row{
                    padding: 0 2px;
                }
            }
        }
        .rightBox{
            width: calc(40% - 30px);
            /deep/ .table{
                margin-top: 14px;
                .row_2 .col_d{
                    > div:nth-child(1) > div:nth-child(1){
                        display: none;
                    }
                }
                tr{
                    height: var(--trHeight);
                    td:nth-child(1) {
                        text-align: left;
                        justify-content: left;
                        width: 150px;
                        flex: none;
                    }
                }
                .ant-pagination{
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                }
            }
            /deep/ .TableBodyBox tr:nth-child(1) {
                font-weight: bold;
            }
        }
    }
}
</style>