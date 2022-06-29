<template>
    <div ref="Year" class="Year" style="position: relative">
<!--        <Radio v-bind.sync="fieldRadio" style="justify-content: flex-end;display: flex;align-items: center"/>-->
<!--        <div class="title_2" style="position: absolute; top: 0px">市场占比{{fieldRadio.value === '线上支付业绩' ? '（业绩）' : '（访客）'}}</div>-->
        <div style="display: flex;align-items: center">
            <div class="title_2" style="font-weight: bold">月度趋势</div>
            <div style="flex: 1"></div>
            <Radio v-bind.sync="fieldRadio" style="justify-content: flex-end;display: flex;align-items: center"/>
            <slot></slot>
        </div>
        <span style="position: absolute;top: 40px;right: 0;z-index: 2;cursor: pointer" @click="foldedChange">
            <a-icon v-if="!folded" type="arrow-up" style="color: #2F67E4"/>
            <a-icon v-else type="arrow-down" style="color: #2F67E4"/>
            <span style="margin-left: 0;color: #2F67E4" class="text-xs">
                {{!folded ? '折叠趋势图' : '展开趋势图'}}
            </span>
        </span>
        <div v-if="folded" style="height: 31px;"></div>
        <div v-if="!folded" class="lineBox mt10" style="display: flex;align-items: center;position: relative" :style="{height: `calc(100% - 88px - ${25 * table.tableData[0].length}px)`}">
            <div class="text-xs" style="position: absolute;top: 0;left: 0">市场占比{{fieldRadio.value === '线上支付业绩' ? '（业绩）' : '（访客）'}}</div>
            <div class="text-xs" style="position: absolute;top: 0;left: calc(50% + 10px)">林氏/竞店{{fieldRadio.value === '线上支付业绩' ? '（业绩）' : '（访客）'}}</div>
            <v-chart ref="line" style="overflow: visible;width: calc(50% - 10px);margin-top: 30px;height: calc(100% - 30px)" :options="line" autoresize></v-chart>
            <div style="width: 20px"></div>
            <v-chart ref="line1" style="overflow: visible;width: calc(50% - 10px);margin-top: 30px;height: calc(100% - 30px)" :options="line1" autoresize></v-chart>
        </div>
        <Table style="margin-top: 10px" v-bind="table" ref="table" :style="{'--trHeight': trHeight}"/>
<!--        <div style="background: #e7e9f0;width: 100%; height: 1px;position: absolute;bottom: 1px;left: 0"></div>-->
        <Pagination class="mt10" v-bind.sync="tablePagination"/>
    </div>
</template>

<script>
import base from '../../utils/base.js'
import Radio from '../../components/Radio'
import _ from "lodash";
import Table from '../../components/TableOld'
import moment from 'moment'
import Pagination from '../../components/Pagination'
export default {
    mixins: [ base ],
    components: {
        Radio,
        Table,
        Pagination,
    },
    props: {
        storeValue: {
            type: Array
        },
        selectYearValue: {
            type: String,
            default: moment().format('YYYY年'),
        },
        store: {
            type: Object
        }
    },
    async created(){
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
        this.line.legend.left = 'center'
        this.line.grid.top = 30
        this.line.color = ['#5B8FF9', '#F6BD16', '#EB63D8', '#2EBFBE', '#5D7092']
        this.line.xAxis[0].data = []
        this.line.series[0].data = []
        this.line.series[0].name = ''
        this.line.series[1].data = []
        this.line.series[1].name = ''
        this.line.series[2].data = []
        this.line.series[2].name = ''
        this.line.series[3].data = []
        this.line.series[3].name = ''
        this.line.series[4].data = []
        this.line.series[4].name = ''
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
        this.line1.legend.left = 'center'
        this.line1.grid.top = 30
        this.line1.color = ['#5B8FF9', '#F6BD16', '#EB63D8', '#2EBFBE', '#5D7092']
        this.line1.xAxis[0].data = []
        this.line1.series[0].data = []
        this.line1.series[0].name = ''
        this.line1.series[1].data = []
        this.line1.series[1].name = ''
        this.line1.series[2].data = []
        this.line1.series[2].name = ''
        this.line1.series[3].data = []
        this.line1.series[3].name = ''
        this.line1.series[4].data = []
        this.line1.series[4].name = ''
        this.getData()
    },
    mounted(){
        let childrenList = this.$refs?.table?.$el?.children
        for(let i = 0; i < childrenList.length; i++){
            childrenList[i].addEventListener('scroll', this.scroll)
        }
    },
    beforeDestroy(){
        let childrenList = this.$refs.table.$el.children
        for(let i = 0; i < childrenList.length; i++){
            childrenList[i].removeEventListener('scroll', this.scroll)
        }
        this.$message.destroy()
    },
    watch: {
        folded: {
            handler(val){
                if(val){
                    this.resizeTable()
                    window.addEventListener('resize', this.resizeTable)
                }
                else if(!val){
                    this.trHeight = 25
                    window.removeEventListener('resize', this.resizeTable)
                }
            }
        },
        'fieldRadio.value': {
            handler(){
                this.tablePagination.page = 1
                this.getData()
                // this.handleData('table', this.tableData)
                // this.handleData('trend', this.tableData)
            }
        },
        'store.value': {
            handler(val, oval){
                if(val.toString() === oval.toString()) return
                if(val.length < 1){
                    this.$message.warning('最少选择1个店铺');
                    this.$emit('update:store', {
                        ...this.store,
                        value: oval.concat()
                    })
                    return
                }
                else if(val.length > 5){
                    this.$message.warning('最多选择5个店铺');
                    this.$emit('update:store', {
                        ...this.store,
                        value: oval.concat()
                    })
                    return
                }
                this.getData()
            }
        },
        selectYearValue: {
            handler(val){
                this.getData()
            }
        },
        'tablePagination.page': {
            handler(){
                this.handleData('table', this.tableData)
            }
        },
        'tablePagination.pageSize': {
            handler(val){
                if(val === 4) this.folded = true
                else if([2, 3].includes(val)) this.folded = false
                this.tablePagination.page = 1
                this.handleData('table', this.tableData)
            }
        },
    },
    data() {
        this.scroll = _.debounce(this.scroll, 10, {
            leading: false,
            trailing: true
        })
        return {
            trHeight: '25',
            folded: false,
            fieldRadio: {
                label: '指标选择',
                value: '线上支付业绩',
                options: ['线上支付业绩', '访客人数'],
            },
            line: null,
            line1: null,
            table: {
                index: 'T13_BStoreMarketShare',
                labelData: ['店铺', '林氏木业家具旗舰店', '源氏木语家居旗舰店'],
                tableData: [
                    ['指标', '支付金额', '同比增幅', '市场占比', '支付金额', '同比增幅', '市场占比'],
                    ['累计', '/', '/', '/', '/', '/', '/'],
                    ['/', '/', '/', '/', '/', '/', '/'],
                ]
            },
            tableData: [],
            scrollTop: 0,
            tablePagination: {
                page: 1,
                total: 0,
                pageSize: 2,
                pageSizeOptions: ['2', '4']
            },
        }
    },
    methods: {
        resizeTable() {
            this.$nextTick(() => {
                let contentHeight = this.$refs.Year.offsetHeight
                let {page, total, pageSize} = this.tablePagination
                let lastPage = Math.ceil(total / pageSize)
                let currentPageSize
                // 最后一页可能不满pageSize条 所以高度按最后一页数据的条数算 使页面占满
                if(lastPage === page) currentPageSize = total - (page - 1) * pageSize
                else currentPageSize = pageSize
                this.trHeight = (contentHeight - 109) / (currentPageSize * 4 + 1)
            })
        },
        foldedChange(){
            this.folded = !this.folded
            if(!this.folded) this.tablePagination.pageSize = 2
            else if(this.folded) this.tablePagination.pageSize = 4
        },
        scroll(e){
            this.scrollTop = e.target.scrollTop
            let childrenList = this.$refs.table.$el.children
            for(let i = 0; i < childrenList.length; i++){
                childrenList[i].scrollTop = this.scrollTop
                // childrenList[i].scrollTo(this.scrollTop)
            }
        },
        async getData(){
            let query = {}
            if(this.fieldRadio.value === '线上支付业绩') query.FULL_STORE_NAME = '林氏木业家具旗舰店（纯线上）,'
            else query.FULL_STORE_NAME = ''
            // if(this.storeValue.toString() === '林氏木业家具旗舰店') query.FULL_STORE_NAME += '林氏木业家具旗舰店,源氏木语家居旗舰店,全友家私家具旗舰店,顾家家居官方旗舰店,芝华仕官方旗舰店'
            // else query.FULL_STORE_NAME += '林氏木业家具旗舰店,' + this.storeValue.toString()
            query.FULL_STORE_NAME += this.storeValue.toString()
            let res = await this.$fetchSql('all_center', 'all_center_b_shop_m', query)
            let data = res.data.filter(_ => _.YDATE_WID === this.selectYearValue.split('年')[0])
            this.tableData = data
            this.tablePagination.page = 1
            this.handleData('table', data)
            this.handleData('trend', data)
        },
        handleData(type, source){
            if(type === 'table'){
                this.table.labelData = ['店铺', '/', '/']
                this.table.tableData = [
                    ['指标', '支付金额', '同比增幅', '市场占比', '支付金额', '同比增幅', '市场占比'],
                    ['累计', '/', '/', '/', '/', '/', '/'],
                    ['/', '/', '/', '/', '/', '/', '/']
                ]
                let arr = _.cloneDeep(source)
                if(!arr.length) return
                let obj = _.groupBy(arr, _ => _.FULL_STORE_NAME)
                for(let key in obj){
                    obj[key].sort((a, b) => a.MDATE_WID - b.MDATE_WID)
                }
                let newArr = []
                if(this.fieldRadio.value === '线上支付业绩' && this.store.value.includes('林氏木业家具旗舰店')) {
                    newArr.push(obj['林氏木业家具旗舰店（纯线上）'])
                }
                // if(this.storeValue.toString() === '林氏木业家具旗舰店'){
                //     newArr.push(obj['林氏木业家具旗舰店'])
                //     newArr.push(obj['源氏木语家居旗舰店'])
                //     newArr.push(obj['全友家私家具旗舰店'])
                //     newArr.push(obj['顾家家居官方旗舰店'])
                //     newArr.push(obj['芝华仕官方旗舰店'])
                // }
                // else {
                //     newArr.push(obj['林氏木业家具旗舰店'])
                //     delete obj['林氏木业家具旗舰店']
                //     delete obj['林氏木业家具旗舰店（纯线上）']
                //     for(let key in obj){
                //         newArr.push(obj[key])
                //     }
                // }
                delete obj['林氏木业家具旗舰店（纯线上）']
                for(let key in obj){
                    newArr.push(obj[key])
                }
                // 排序
                let sortObj = {
                    '林氏木业家具旗舰店（纯线上）': -1
                }
                this.store.options.forEach((item, index) => {
                    sortObj[item] = index
                })
                newArr.sort((a, b) => {
                    return sortObj[a[0].FULL_STORE_NAME] - sortObj[b[0].FULL_STORE_NAME]
                })
                this.tablePagination.total = newArr.length
                let {page, pageSize} = this.tablePagination
                newArr = newArr.filter(_ => ![null, undefined].includes(_) && _.length).slice((page - 1) * pageSize, page * pageSize)
                // newArr.sort((a, b) => {
                //     let key = this.fieldRadio.value === '线上支付业绩' ? 'PAY_AMOUNT' : 'VISITORS'
                //     let reduce_a = a.map(_ => _[key]).filter(_ => ![undefined, null].includes(_)).reduce((a, b) => a + b)
                //     let reduce_b = b.map(_ => _[key]).filter(_ => ![undefined, null].includes(_)).reduce((a, b) => a + b)
                //     return reduce_b - reduce_a
                // })
                // let linshi
                // linshi = newArr.filter(_ => _[0].FULL_STORE_NAME === '林氏木业家具旗舰店')
                // if(linshi.length) linshi = linshi[0]
                // else linshi = []
                // let linshiOnline
                // if(this.fieldRadio.value !== '线上支付业绩'){
                //     linshiOnline = newArr.filter(_ => _[0].FULL_STORE_NAME === '林氏木业家具旗舰店（纯线上）')
                //     if(linshiOnline) linshiOnline = linshiOnline[0]
                //     else linshiOnline = []
                // }
                // newArr = newArr.filter(_ => !['林氏木业家具旗舰店', '林氏木业家具旗舰店（纯线上）'].includes(_[0].FULL_STORE_NAME))
                // newArr.unshift(linshi)
                // if(this.fieldRadio.value !== '线上支付业绩') newArr.unshift(linshiOnline)
                // console.log(newArr)
                //最新的调整
                // let keys = this.fieldRadio.value === '线上支付业绩' ? ['PAY_AMOUNT', 'YOY_DIFF_PAY_AMOUNT', 'PAY_AMOUNT_RATE'] : ['VISITORS', 'YOY_DIFF_VISITORS', 'VISITORS_RATE']
                let keys = this.fieldRadio.value === '线上支付业绩' ? ['PAY_AMOUNT', 'YOY_DIFF_PAY_AMOUNT', 'PAY_AMOUNT_RATE','LS_RATE_PAY_AMOUNT'] : ['VISITORS', 'YOY_DIFF_VISITORS', 'VISITORS_RATE','LS_RATE_VISITORS']
                let lastArr = []
                for(let i = 0; i < 12; i++){
                    if(i < 9) lastArr.push(['0' + (i + 1)])
                    else lastArr.push([i + 1 + ''])
                }
                lastArr = lastArr.map(item => {
                    // 某个月份
                    let filters = []
                    for(let i = 0; i < newArr.length; i++){
                        if(newArr[i] === null || newArr[i] === undefined) {
                            filters.push({})
                            continue
                        }
                        let filter = newArr[i].filter(_ => moment(_.MDATE).format('MM') === item[0] + '')
                        if(filter.length) filters.push(filter[0])
                        else filters.push({})
                    }
                    let data = [item[0] + '月']
                    let date = this.selectYearValue.split('年')[0] + item[0] + '01'
                    if(moment(date).format('YYYYMMDD') <= moment().format('YYYYMMDD')){
                        for(let i = 0; i < filters.length; i++){
                            data = data.concat((keys.map(key => {
                                return filters[i][key]
                            })))
                        }
                    }
                    else {
                        for(let i = 0; i < filters.length; i++){
                            data = data.concat((keys.map(key => {
                                return null
                            })))
                        }
                    }
                    return data
                })
                lastArr = lastArr.filter(_ => {
                    let date = this.selectYearValue.split('年')[0] + _[0].split('月')[0] + '01'
                    return ['指标', '累计'].includes(_[0]) || moment(date).format('YYYYMM') <= moment().format('YYYYMM')
                })


                let sum = ['累计'].concat(...newArr.map(item => {
                    let sumItem = this.computeSum(item)
                    if(item.length && item[0].STORE_NAME === '林氏木业家具旗舰店（纯线上）'){
                        sumItem.LS_RATE_PAY_AMOUNT = null
                        sumItem.LS_RATE_VISITORS = null
                    }
                    return keys.map(key => {
                        return sumItem[key]
                    })
                }))
                this.table.labelData = this.table.labelData.slice(0, 1).concat(
                    newArr.map(_ => _[0].FULL_STORE_NAME)
                )
                this.table.tableData[0] = ['指标'].concat(
                    ...newArr.map(_ => this.fieldRadio.value === '线上支付业绩' ? ['支付金额', '同比增幅', '市场占比','林氏/竞店'] : ['访客人数', '同比增幅', '市场占比','林氏/竞店'])
                )

                this.table.tableData[1] = sum
                this.table.tableData = this.table.tableData.slice(0, 2).concat(lastArr)
                // if(newArr.length <= 2){
                //     this.table.labelData = this.table.labelData.concat(['/'])
                //     this.table.tableData[0] = this.table.tableData[0].concat(['/', '/', '/'])
                //     for(let i = 0; i < this.table.tableData.length - 2; i++){
                //         this.table.tableData[i + 1] = this.table.tableData[i + 1].concat(['/', '/', '/'])
                //     }
                // }
                let that = this
                this.$nextTick(() => {
                    let childrenList = that.$refs.table.$el.children
                    for(let i = 0; i < childrenList.length; i++){
                        childrenList[i].removeEventListener('scroll', that.scroll)
                        childrenList[i].addEventListener('scroll', that.scroll)
                    }
                })
                if(this.folded) this.resizeTable()
            }
            else if(type === 'trend'){
                this.line.xAxis[0].data = []
                this.line1.xAxis[0].data = []
                for(let i = 0; i < 12; i++){
                    let year = this.selectYearValue.split('年')[0]
                    let month = i < 9 ? '0' + (i + 1) : i + 1
                    let date = year + month + '01'
                    if(moment(date).format('YYYYMM') <= moment().format('YYYYMM')){
                        this.line.xAxis[0].data.push((i + 1) + '月')
                        this.line1.xAxis[0].data.push((i + 1) + '月')
                    }
                }
                for(let i = 0; i < this.line.series.length; i++){
                    this.line.series[i].name = ''
                    this.line.series[i].data = []
                }
                for(let i = 0; i < this.line1.series.length; i++){
                    this.line1.series[i].name = ''
                    this.line1.series[i].data = []
                }
                let line = _.cloneDeep(this.line)
                let line1 = _.cloneDeep(this.line1)
                this.$refs?.line?.$refs?.echarts.clear()
                this.$refs?.line1?.$refs?.echarts.clear()
                this.line = line
                this.line1 = line1
                let arr = _.cloneDeep(source)
                if(!arr.length) return
                let obj = _.groupBy(arr, _ => _.FULL_STORE_NAME)
                let newArr = []
                // if(this.storeValue.toString() === '林氏木业家具旗舰店'){
                //     newArr.push(obj['林氏木业家具旗舰店'])
                //     newArr.push(obj['源氏木语家居旗舰店'])
                //     newArr.push(obj['全友家私家具旗舰店'])
                //     newArr.push(obj['顾家家居官方旗舰店'])
                //     newArr.push(obj['芝华仕官方旗舰店'])
                // }
                // else {
                //     newArr.push(obj['林氏木业家具旗舰店'])
                //     delete obj['林氏木业家具旗舰店']
                //     delete obj['林氏木业家具旗舰店（纯线上）']
                //     for(let key in obj){
                //         newArr.push(obj[key])
                //     }
                // }
                // for(let key in obj){
                //     newArr.push(obj[key])
                // }
                delete obj['林氏木业家具旗舰店（纯线上）']
                for(let key in obj){
                    newArr.push(obj[key])
                }
                newArr = newArr.filter(_ => ![null, undefined].includes(_) && _.length)
                let keys = this.fieldRadio.value === '线上支付业绩' ? ['MDATE', 'PAY_AMOUNT_RATE'] : ['MDATE', 'VISITORS_RATE']
                let keys1 = this.fieldRadio.value === '线上支付业绩' ? ['MDATE', 'LS_RATE_PAY_AMOUNT'] : ['MDATE', 'LS_RATE_VISITORS']
                let sortObj = {}
                this.store.options.forEach((name, index) => {
                    sortObj[name] = index
                })
                newArr.sort((a, b) => {
                    let a_i = 99
                    let b_i = 99
                    if(a.length) a_i = sortObj[a[0].FULL_STORE_NAME]
                    if(b.length) b_i = sortObj[b[0].FULL_STORE_NAME]
                    return a_i - b_i
                })
                newArr.forEach((item, index) => {
                    item.sort((a, b) => moment(a.MDATE).format('YYYYMM') - moment(b.MDATE).format('YYYYMM'))
                    this.line.series[index].name = item[0].FULL_STORE_NAME
                    this.line.series[index].data = item.map((_, i) => {
                        if(moment(_.MDATE).format('YYYYMM') > moment().format('YYYYMM')) return 'null' + i
                        return keys.map(key => {
                            if(key === 'MDATE') return moment(_[key]).format('M月')
                            return _[key]
                        })
                    })
                    this.line1.series[index].name = item[0].FULL_STORE_NAME
                    this.line1.series[index].data = item.map((_, i) => {
                        if(moment(_.MDATE).format('YYYYMM') > moment().format('YYYYMM')) return 'null' + i
                        return keys1.map(key => {
                            if(key === 'MDATE') return moment(_[key]).format('M月')
                            return _[key]
                        })
                    })
                })
            }
        },
        // 计算table累计列
        computeSum(arr){
            let initial = {
                // 支付金额
                PAY_AMOUNT: 0,
                // 同期支付金额 算同比增幅
                YOY_PAY_AMOUNT: 0,
                // 市场业绩 算市场占比
                MARKET_AMOUNT: 0,
                // 林氏店铺业绩 算业绩林氏比
                LS_PAY_AMOUNT: 0,

                // 访客数
                VISITORS: 0,
                // 同期访客数 算同比增幅
                YOY_VISITORS: 0,
                // 市场访客数 算市场占比
                MARKET_VISITORS: 0,
                // 林氏访客人数 算访客林氏比
                LS_VISITORS: 0,
            }
            let sum = arr.filter(_ => _ !== null && _ !== undefined).reduce((a, b) => {
                return {
                    // 支付金额
                    PAY_AMOUNT: a.PAY_AMOUNT + b.PAY_AMOUNT,
                    // 同期支付金额 算同比增幅
                    YOY_PAY_AMOUNT: a.YOY_PAY_AMOUNT + b.YOY_PAY_AMOUNT,
                    // 市场业绩 算市场占比
                    MARKET_AMOUNT: a.MARKET_AMOUNT + b.MARKET_AMOUNT,
                    // 林氏店铺业绩 算业绩林氏比
                    LS_PAY_AMOUNT: a.LS_PAY_AMOUNT + b.LS_PAY_AMOUNT,
                    // 访客数
                    VISITORS: a.VISITORS + b.VISITORS,
                    // 同期访客数 算同比增幅
                    YOY_VISITORS: a.YOY_VISITORS + b.YOY_VISITORS,
                    // 市场访客数 算市场占比
                    MARKET_VISITORS: a.MARKET_VISITORS + b.MARKET_VISITORS,
                    // 林氏访客人数 算访客林氏比
                    LS_VISITORS: a.LS_VISITORS + b.LS_VISITORS,
                }
            }, initial)
            // 计算 同比 占比
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
            return {
                PAY_AMOUNT: sum.PAY_AMOUNT,
                YOY_DIFF_PAY_AMOUNT: fun('YOY', sum.PAY_AMOUNT, sum.YOY_PAY_AMOUNT),
                PAY_AMOUNT_RATE: fun('reach', sum.PAY_AMOUNT, sum.MARKET_AMOUNT),
                LS_RATE_PAY_AMOUNT: fun('reach', sum.LS_PAY_AMOUNT, sum.PAY_AMOUNT),
                VISITORS: sum.VISITORS,
                YOY_DIFF_VISITORS: fun('YOY', sum.VISITORS, sum.YOY_VISITORS),
                VISITORS_RATE: fun('reach', sum.VISITORS, sum.MARKET_VISITORS),
                LS_RATE_VISITORS: fun('reach', sum.LS_VISITORS, sum.VISITORS),
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../../assets/styles';
.Year{
    height: calc(100% - 48px);
    margin-top: 10px;
    /deep/ .Table{
        //height: 225px;
        .row{
            height: calc(var(--trHeight) * 1px);
        }
        .col1{
            min-width: 130px;
            max-width: 130px;
            .row{
                // height: 75px;
                // 迭代的
                height: calc(var(--trHeight) * 4px);
                //line-height: 100px;
                display: flex;
                align-items: center;
                text-align: center;
            }
            .row:nth-child(1) {
                height: calc(var(--trHeight) * 1px);
            }
            //.row:nth-child(2), .row:nth-child(3), .row:nth-child(4), .row:nth-child(5), .row:nth-child(6), .row:nth-child(7) {
            //    height: 75px;
            //    //line-height: 100px;
            //    display: flex;
            //    align-items: center;
            //    text-align: center;
            //}
        }
        .col:nth-child(2){
            width: 100px;
            flex: none;
            .row{
                text-align: left;
            }
        }
        .col1, .col{
            overflow: hidden scroll;
            &::-webkit-scrollbar{
                width: 0;
            }
            .row:nth-child(1){
                position: sticky;
                top: 0;
            }
        }
    }
}
</style>