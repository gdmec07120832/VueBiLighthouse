<template>
    <div class="StoreProfitRate">
        <div class="header">
            <Title class="title" :label="'门店盈利比例'"/>
            <span style="margin-top: 2px;font-size: 12px;color: rgba(0, 0, 0, 0.88);line-height: 20px">（财务口径）</span>
            <div style="flex: 1;"></div>
            <span>
                当前数据截止月份：{{loadTime}}
                <!-- 统计月份：
                <a-month-picker v-model="month" :allowClear="false" valueFormat="YYYYMM"/> -->
            </span>
        </div>
        <div class="main">
            <div class="overView">
                <div :class="[{'active': flag && cItem === item.label ? true : false}]"
                     @click="flag = true;cItem = item.label" class="item" v-for="(item, index) in overView"
                     :key="index">
                    <div>{{ item.label }}</div>
                    <div>
                        <span>{{ handleOverViewData('MTD_PROFIT_RATE', item.YTD_PROFIT_RATE) }}</span>
                        <span>上期</span>
                        <span>{{ handleOverViewData('YTD_PROFIT_RATE', item.LAST_YTD_PROFIT_RATE) }}</span>
                    </div>
                    <div>
                        <span>总营业门店</span>
                        <span>{{ handleOverViewData('MTD_OPENING_CNT', item.MTD_OPENING_CNT) }}</span>
                    </div>
                    <div>
                        <span>考核门店</span>
                        <span>{{ handleOverViewData('MTD_ASSESS_CNT', item.YTD_ASSESS_CNT) }}</span>
                    </div>
                    <div>
                        <span>盈利门店</span>
                        <span>{{ handleOverViewData('MTD_PROFIT_CNT', item.YTD_PROFIT_CNT) }}</span>
                    </div>
                </div>
            </div>
            <div class="box">
                <span class="area">
                    <div class="title">区域盈利</div>
                    <Table ref="table" @click.native="clickTable" class="table" v-bind="table"/>
                    <span class="barTitle">新老店盈利比例</span>
                    <v-chart ref="bar" style="overflow: visible" class="bar" :options="bar" autoresize></v-chart>
                </span>
                <span class="Profit">
                    <div class="title">月度盈利趋势</div>
                    <div class="selects">
                        <span>区域</span>
                        <a-select class="ml10 mr20" v-model="area" dropdownClassName="NewRetailCockpitSelect" style="width: 120px">
                            <a-select-option :value="item" v-for="item in areaOption" :key="item">
                                {{ item }}
                            </a-select-option>
                        </a-select>
                        <span class="mr10">开业年份</span>
                        <a-select v-model="year" style="width: 120px" dropdownClassName="NewRetailCockpitSelect">
                            <a-select-option :value="item" v-for="item in yearOption" :key="item">
                                {{ item }}
                            </a-select-option>
                        </a-select>
                    </div>
                    <v-chart ref="line" class="line" style="overflow: visible" :options="line" autoresize></v-chart>
                    <Table class="table" v-bind="table1"/>
                </span>
            </div>
        </div>
        <!-- <Jump/> -->
        <Jump style="display: none"/>
    </div>
</template>

<script>
import moment from 'moment'
import Title from '../../components/Title'
import base from '../../utils/base'
import Jump from '../../components/Jump'
import Table from '../../components/Table'

export default {
    name: 'StoreProfitRate',
    mixins: [base],
    components: {
        Title,
        Jump,
        Table,
    },
    async created() {
        let that = this
        this.bar = await this.createDoubleBar()
        this.bar.grid.bottom = 0
        this.bar.series[0].name = '当期年累'
        this.bar.series[1].name = '上期年累'
        // this.bar.series[1].itemStyle.color = '#F6BD16'
        this.bar.series[1].itemStyle.color = '#e7e7e7'
        this.bar.tooltip.formatter = function (params) {
            if(Object.prototype.toString.call(params) === '[object Array]') {
                let str = `${params[0].axisValue}<br/>`
                params.forEach((item, index) => {
                    str += `${params[index].marker}${params[index].seriesName}：${that.handleNum('percent', params[index].data[1])}<br/>`
                })
                return str
            }else if(Object.prototype.toString.call(params) === '[object Object]') {
                let str = `${params.axisValue}<br/>${params.marker}${params.seriesName}：${that.handleNum('percent', params.data[1])}<br/>`
                return str
            }
        },
        this.line = await this.createLine()
        delete this.line.series[0].areaStyle
        this.line.yAxis[0].axisLabel.interval = 5
        this.line.yAxis[0].min = 0
        this.line.yAxis[0].max = 1
        this.line.series[0].data = []
        this.line.series[0].name = '盈利比例'
        this.line.legend = null
        this.line.tooltip.formatter = function (params) {
            let str = `${params[0].axisValue}<br/>`
            str += `${params[0].marker}${params[0].seriesName}：${that.handleNum('percent', params[0].data[1])}<br/>`
            str += `考核门店：${that.handleNum('round', params[0].data[2])}<br/>`
            str += `盈利门店：${that.handleNum('round', params[0].data[3])}<br/>`
            return str
        }
        console.log(this.line)
        this.getLoadTime()
        this.getOverView()
        this.getArea()
        this.getShopTrend()
        this.getTrend()
    },
    mounted() {
        this.$refs.table.$el.children[0].children[1].classList.add('active')
    },
    watch: {
        trend: {
            handler(val) {
                // this.handleData('trend', this.trendData)
                // this.handleData('table', this.trendData)
                this.getTrend()
            }
        },
        S_OR_N: {
            handler() {
                this.getArea()
                this.getShopTrend()
            }
        },
        condiction: {
            handler() {
                this.getOverView()
                this.getArea()
                this.getShopTrend()
                this.getTrend()
            }
        }
    },
    computed: {
        trend() {
            return this.area + '-' + this.year
        },
        condiction() {
            return this.cItem + '-' + this.month
        }
    },
    data() {
        return {
            loadTime: '--',
            flag: true,
            cItem: '线下整体',
            month: moment(new Date()).subtract(1, 'month').format('YYYYMM'),
            overView: [
                {
                    label: '线下整体',
                    YTD_PROFIT_RATE: null,
                    LAST_YTD_PROFIT_RATE: null,
                    MTD_OPENING_CNT: null,
                    YTD_PROFIT_CNT: null,
                    YTD_ASSESS_CNT: null,
                },
                {
                    label: '成品店',
                    YTD_PROFIT_RATE: null,
                    LAST_YTD_PROFIT_RATE: null,
                    MTD_OPENING_CNT: null,
                    YTD_PROFIT_CNT: null,
                    YTD_ASSESS_CNT: null,
                },
                {
                    label: '融合店',
                    YTD_PROFIT_RATE: null,
                    LAST_YTD_PROFIT_RATE: null,
                    MTD_OPENING_CNT: null,
                    YTD_PROFIT_CNT: null,
                    YTD_ASSESS_CNT: null,
                },
            ],
            S_OR_N: '全国',
            table: {
                index: 'StoreProfitRate_area',
                labelData: ['区域', '全国', '东区', '南区', '西区', '北区'],
                tableData: []
            },
            bar: null,
            area: '全国',
            areaOption: ['全国', '东区', '南区', '西区', '北区'],
            year: '',
            yearOption: [],
            line: null,
            table1: {
                index: 'StoreProfitRate_profit',
                labelData: ['月份', '考核门店', '盈利门店', '盈利比例'],
                tableData: []
            },
            open: false,
            trendData: [],
        }
    },
    methods: {
        async getLoadTime() {
            let res = await this.$fetchSql('new_retail', 'new_retail_shop_profit_load')
            if(res.data.length) {
                this.loadTime = moment(res.data[0].LOAD_TIME).format('YYYY年MM月')
            }
            else this.loadTime = '--'
        },
        clickTable(e) {
            if(this.table.labelData.indexOf(e.target.innerText) > -1) {
                let brother = e.target.parentElement.children
                for(let i = 0; i < brother.length; i++) {
                    brother[i].setAttribute('class', 'row')
                }
                this.S_OR_N = e.target.innerText
                e.target.classList.add('active')
            }
        },
        handleOverViewData(type, val) {
            if (val === null || val === undefined) return '--'
            if (['MTD_PROFIT_RATE', 'YTD_PROFIT_RATE'].indexOf(type) > -1) {
                return this.handleNum('percent', val)
            } else if (['MTD_OPENING_CNT', 'MTD_ASSESS_CNT', 'MTD_PROFIT_CNT'].indexOf(type) > -1) {
                return this.handleNum('round', val)
            }
        },
        onChange(val) {
            this.year = val
        },
        openChange(status) {
            if (status) {
                this.open = true
            }
            else {
                this.open = false
            }
        },
        panelChange(val) {
            this.year = moment(val).format('YYYY')
            this.open = false
        },
        async getOverView() {
            // let query = {
            //     MDATE: this.month
            // }
            let res = await this.$fetchSql('new_retail', 'new_retail_shop_profit_sum')
            this.handleData('overView', res.data)
        },
        async getArea() {
            let query = {
                MDATE: this.month,
                YDATE: moment(this.month).year(),
                STORE_TYPE: this.cItem
            }
            let res = await this.$fetchSql('new_retail', 'new_retail_shop_profit_area', query)
            this.handleData('area', res.data)
        },
        async getShopTrend() {
            let query = {
                MDATE: this.month,
                YDATE: moment(this.month).year(),
                STORE_TYPE: this.cItem,
                S_OR_N: this.S_OR_N
            }
            let res = await this.$fetchSql('new_retail', 'new_retail_shop_profit_newold', query)
            this.handleData('shopTrend', res.data)
        },
        async getTrend() {
            let query = {
                STORE_TYPE: this.cItem,
                S_OR_N: this.area,
                YDATE: this.year
            }
            let res = await this.$fetchSql('new_retail', 'new_retail_shop_profit_trend', query)
            this.trendData = res.data.concat()
            if(!this.yearOption.length) {
                this.yearOption = Array.from(new Set(res.data.map(_ => _.YDATE)))
                this.yearOption.sort((a, b) => {
                    if(a === '全部' || b === '全部') return true
                    return b - a
                })
                this.yearOption = this.yearOption.filter(_ => _ !== '全部')
                this.yearOption.unshift('全部')
                this.year = this.yearOption[0]
            }
            this.handleData('trend', res.data)
            this.handleData('table', res.data)
        },
        handleData(type, source) {
            if (type === 'overView') {
                this.overView.forEach(item => {
                    Object.keys(item).forEach(key => {
                        if (key !== 'label') item[key] = null
                    })
                })
                if (!source.length) return
                this.overView.forEach(item => {
                    let obj = source.filter(_ => _.STORE_TYPE === item.label) [0]
                    Object.keys(item).forEach(key => {
                        if (key !== 'label') item[key] = obj[key]
                    })
                })
            }
            else if (type === 'area') {
                this.table.tableData = []
                if (!source.length) return
                let arr = []
                this.table.labelData.forEach(area => {
                    if(area !== '区域') {
                        if (source.filter(_ => _.S_OR_N === area).length) arr.push(source.filter(_ => _.S_OR_N === area)[0])
                        else arr.push([])
                    }
                })
                let obj = [
                    {label: '营业门店', key: 'MTD_OPENING_CNT'},
                    {label: '考核门店', key: 'YTD_ASSESS_CNT'},
                    {label: '盈利门店', key: 'YTD_PROFIT_CNT'},
                    // {label: '门店盈利率', key: 'MTD_PROFIT_RATE'},
                    // {label: '年累盈利率', key: 'YTD_PROFIT_RATE'},
                    {label: '年累盈利比例', key: 'YTD_PROFIT_RATE'},
                    {label: '上期盈利比例', key: 'LAST_YTD_PROFIT_RATE'},
                ]
                // let keys = ['MTD_OPENING_CNT', 'MTD_ASSESS_CNT', 'MTD_PROFIT_CNT', 'MTD_PROFIT_RATE', 'YTD_PROFIT_RATE']
                obj.forEach(item => {
                    this.table.tableData.push(
                        [
                            item.label,
                            ...arr.map(_ => _[item.key])
                        ]
                    )
                })
            }
            else if (type === 'shopTrend') {
                this.bar.xAxis[0].data = []
                this.bar.series[0].data = []
                this.bar.series[1].data = []
                this.$refs?.bar?.$refs?.echarts?.clear()
                if(!source.length) return
                let arr = source.sort((a, b) => moment(a.YDATE.split('年')[0]).format('x') - moment(b.YDATE.split('年')[0]).format('x'))
                arr = arr.filter(_ => _.YTD_PROFIT_RATE > 0 || _.LAST_YTD_PROFIT_RATE > 0)
                let keys = ['YDATE', 'YTD_PROFIT_RATE', 'LAST_YTD_PROFIT_RATE']
                this.bar.xAxis[0].data = Array.from(new Set(arr.map(_ => _[keys[0]])))
                this.bar.series[0].data = arr.map(item => {
                    return keys.map(key => item[key])
                })
                this.bar.series[1].data = arr.map(item => {
                    return [
                        item[keys[0]],
                        item[keys[2]]
                    ]
                })
            }
            else if (type === 'trend') {
                this.line.xAxis.data = []
                this.line.series[0].data = []
                this.$refs?.line?.$refs?.echarts?.clear()
                if(!source.length) return
                let arr = source.filter(_ => _.YDATE === this.year).sort((a, b) => a.MDATE.split('月')[0] - b.MDATE.split('月')[0])
                this.line.xAxis.data = Array.from(new Set(arr.map(_ => _.MDATE)))
                let keys = ['MDATE', 'MTD_PROFIT_RATE', 'MTD_ASSESS_CNT', 'MTD_PROFIT_CNT']
                this.line.series[0].data = arr.map(item => {
                    return keys.map(key => {
                        if(key !== 'MDATE' && item.MDATE.split('月')[0] * 1 > moment().format('M')) return null
                        return item[key]
                    })
                })
            }
            else if (type === 'table') {
                this.table1.tableData = []
                if(!source.length) return
                let arr = source.filter(_ => _.YDATE === this.year).sort((a, b) => a.MDATE.split('月')[0] - b.MDATE.split('月')[0])
                let keys = ['MDATE', 'MTD_ASSESS_CNT', 'MTD_PROFIT_CNT', 'MTD_PROFIT_RATE']
                this.table1.tableData = arr.map(item => {
                    return keys.map(key => {
                        if(key !== 'MDATE' && item.MDATE.split('月')[0] *1 > moment().format('M')) return null
                        return item[key]
                    })
                })

            }
        }
    }

}
</script>

<style lang="scss" scoped>
@import '../../assets/styles.scss';
.StoreProfitRate {
    .header {
        height: 38px;
        padding-bottom: 10px;
        border-bottom: 1px solid #F0F0F0;
        display: flex;
        align-items: center;
        position: relative;

        span:nth-child(4) {
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            color: #000000;
            line-height: 22px;
        }
    }

    .main {
        height: calc(100% - 38px - 22px);
        margin-top: 22px;

        .overView {
            grid-column-start: 1;
            grid-column-end: 3;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            border: 1px solid #F0F0F0;
            cursor: pointer;
            .item {
                padding: 6px 200px 6px 40px;
                border-right: 1px solid #F0F0F0;
                transition: background 0.3s;
                background: #fff;

                div:nth-child(1) {
                    font-size: 14px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    color: #333333;
                    line-height: 22px;
                    margin-bottom: 3px;
                }

                div:nth-child(2) {
                    margin-bottom: 5px;

                    span:nth-child(1) {
                        font-size: 22px;
                        font-family: PingFangSC-Medium, PingFang SC;
                        font-weight: 600;
                        color: #333333;
                        line-height: 24px;
                        margin-right: 16px;
                    }

                    span:nth-child(2) {
                        font-size: 12px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        color: #999999;
                        line-height: 18px;
                        margin-right: 3px;
                    }

                    span:nth-child(3) {
                        font-size: 12px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        color: rgba(0, 0, 0, 0.64);
                        line-height: 18px;
                    }
                }

                div:nth-child(3), div:nth-child(4), div:nth-child(5) {
                    display: flex;
                    justify-content: space-between;

                    span:nth-child(1) {
                        font-size: 12px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        color: #999999;
                        line-height: 18px;
                    }

                    span:nth-child(2) {
                        font-size: 12px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        color: rgba(0, 0, 0, 0.64);
                        line-height: 18px;
                    }
                }
            }

            .item:nth-last-child(1) {
                border-right: none;
            }

            .item:hover {
                background: $panelsHoverColor;
                // border-top: 5px solid #46bca0
            }
            .active {
                background: $panelsHoverColor;
                // border-top: 5px solid #46bca0
            }
        }

        .box {
            margin-top: 18px;
            height: calc(100% - 130px - 18px);
            display: flex;

            .area {
                margin-right: 64px;
                width: calc(40% - 64px);
                height: 100%;
                position: relative;

                .title {
                    font-size: 14px;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 500;
                    color: #000000;
                    line-height: 20px;
                    margin-bottom: 9px;
                }

                .table {
                    margin-bottom: 20px;
                    /deep/ .col1 .row{
                        text-decoration: underline;
                        cursor: pointer;
                    }
                    /deep/ .col1 .row:hover{
                        text-decoration: underline;
                        cursor: pointer;
                        color: #4C89FF
                    }
                    /deep/ .col1 .row:nth-child(1) {
                        text-decoration: none;
                        cursor: text;
                        color: rgba(0, 0, 0, 0.88)
                    }
                    /deep/ .col1 .active{
                        color: #4C89FF
                    }
                    /deep/ .row {
                        height: 28px;
                        line-height: 28px;
                    }
                }

                .barTitle {
                    position: absolute;
                    transform: translateY(0);
                    font-size: 13px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    color: #333333;
                    line-height: 18px;
                }

                .bar {
                    height: calc(100% - 20px - 9px - 168px - 20px) !important;
                }
            }

            .Profit {
                width: 60%;
                height: 100%;

                .title {
                    margin-bottom: 8px;
                    font-size: 14px;
                    font-family: PingFangSC-Medium, PingFang SC;
                    //font-weight: 600;
                    color: #000000;
                    line-height: 20px;
                }

                .selects {
                    font-size: 12px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    color: #000000;
                    line-height: 22px;
                }

                .line {
                    margin-top: 10px;
                    height: calc(100% - 120px - 20px - 20px - 8px - 32px) !important;
                }

                .table {
                    margin-top: 10px;

                    /deep/ .row {
                        height: 30px;
                        line-height: 30px;
                    }
                }
            }
        }

    }
}
</style>