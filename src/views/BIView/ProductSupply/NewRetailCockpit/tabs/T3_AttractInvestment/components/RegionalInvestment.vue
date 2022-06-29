<template>
    <div class="RegionalInvestment">
        <Table @click="clickTable" v-bind="table" class="table" ref="table"/>
        <div class="select">
            <div>
                <div></div>
                <div>累计实际值</div>
                <div></div>
                <div>累计目标</div>
            </div>
            <div style="flex: 1"></div>
            <a-radio-group v-model="radio">
                <a-radio value="意向金">
                    意向金
                </a-radio>
                <a-radio value="选址">
                    选址
                </a-radio>
                <a-radio value="量尺">
                    量尺
                </a-radio>
            </a-radio-group>
        </div>
        <v-chart ref="barAndLine" class="barAndLine" style="overflow: visible;" :options="barAndLine" autoresize></v-chart>
    </div>
</template>

<script>
import Table from '../../../components/Table'
import base from '../../../utils/base.js'
import moment from 'moment'
export default {
    mixins: [ base ],
    components: {
        Table,
    },
    props: {
        regionSTORE_TYPE: {
            type: String,
        },
        date: {
            type: Array,
        }
    },
    async created() {
        this.barAndLine = await this.createBarAndLineEchart()
        console.log(this.barAndLine)
        this.barAndLine.series[0].data = []
        this.barAndLine.series[1].lineStyle.color = '#e7e7e7'
        this.barAndLine.series[1].itemStyle.color = '#e7e7e7'
        let that = this
        this.barAndLine.series[0].name = '累计实际值'
        this.barAndLine.series[1].name = '累计目标'
        this.barAndLine.yAxis[0].axisLabel.formatter = function(val) {
            return that.handleNum('round', val)
        }
        // this.barAndLine.series[0].itemStyle.normal.barBorderRadius = 0
        this.barAndLine.grid.bottom = 0
        this.getTableData()
        this.getBarAndLineData()
    },
    mounted() {
        this.$refs.table.$el.children[1].children[0].classList.add('active')
    },
    watch: {
        regionSTORE_TYPE() {
            this.getTableData()
            this.getBarAndLineData(this.currentRegion)
        },
        radio() {
            this.handleData('barAndLine', this.barAndLineData)
        },
        date: {
            handler() {
                this.getTableData()
                this.getBarAndLineData(this.currentRegion)
            },
            deep: true,
        },
        currentRegion: {
            handler(val) {
                this.getBarAndLineData(val)
            }
        }
    },
    computed: {
        START_TIME() {
            return this.date[0].format('YYYYMM')
        },
        END_TIME() {
            return this.date[1].format('YYYYMM')
        }
    },
    data() {
        return {
            table: {
                index: 'AttractInvestmentC',
                labelData: ['区域', '意向金通过', '选址通过', '量尺通过', '筹备中'],
                tableData: [
                    ['全国', '/', '/', '/', '/'],
                    ['东区', '/', '/', '/', '/'],
                    ['南区', '/', '/', '/', '/'],
                    ['西区', '/', '/', '/', '/'],
                    ['北区', '/', '/', '/', '/']
                ]
            },
            barAndLine: null,
            radio: '意向金',
            barAndLineData: [],
            currentRegion: '全国',
        }
    },
    methods: {
        clickTable(e) {
            let text = e.target.innerText
            let keys = ['全国', '东区', '西区', '南区', '北区']
            if(keys.indexOf(text) > -1) {
                this.currentRegion = text
                let cols = e.target.parentElement.parentElement.children
                for(let i = 1; i < cols.length; i++) {
                    let children = cols[i].children[0]
                    // for(let j = )
                    children.classList.remove('active')
                }
                e.target.classList.add('active')
            }
        },
        async getTableData() {
            let query = {
                START_TIME: this.START_TIME,
                END_TIME: this.END_TIME
            }
            this.regionSTORE_TYPE && this.regionSTORE_TYPE !== '总体' ? query.STORE_TYPE = this.regionSTORE_TYPE : null
            let res =  await this.$fetchSql('new_retail', 'new_retail_open_areainvest', query)
            this.areaOpenData = res.data.concat()
            this.handleData('table', res.data)
        },
        async getBarAndLineData(S_OR_N = '全国') {
            let query = {
                START_TIME: this.START_TIME,
                END_TIME: this.END_TIME,
            }
            S_OR_N !== '全国' ? query.S_OR_N = S_OR_N : null
            this.regionSTORE_TYPE && this.regionSTORE_TYPE !== '总体' ? query.STORE_TYPE = this.regionSTORE_TYPE : null
            let res =  await this.$fetchSql('new_retail', 'new_retail_open_areabuild', query)
            this.barAndLineData = res.data.concat()
            this.handleData('barAndLine', res.data)
        },
        handleData(type, source) {
            if(type === 'table') {
                this.table.tableData = []
                if(!source.length) return
                let sortObj = {
                    全国: 1,
                    东区: 2,
                    南区: 3,
                    西区: 4,
                    北区: 5,
                }
                let arr = source.sort((a, b) => sortObj[a.S_OR_N] - sortObj[b.S_OR_N])
                this.table.tableData = arr.map(item => {
                    return ['S_OR_N', 'PTD_MONEY', 'PTD_LOCAT', 'PTD_RULE', 'PTD_OPEN_CNT'].map(key => {
                        return item[key]
                    })
                })
            }
            if(type === 'barAndLine') {
                this.barAndLine.series[0].data = []
                this.barAndLine.series[1].data = []
                this.$refs?.barAndLine?.$refs?.echarts?.clear()
                if(!source.length) return
                let arr = source.concat()
                arr = arr.sort((a, b) => a.MONTH_DATE - b.MONTH_DATE)
                let keys
                if(this.radio === '意向金') keys = ['MONTH_DATE', 'PTD_MONEY', 'PTD_MONEY_TGT']
                if(this.radio === '选址') keys = ['MONTH_DATE', 'PTD_LOCAT', 'PTD_LOCAT_TGT']
                if(this.radio === '量尺') keys = ['MONTH_DATE', 'PTD_RULE', 'PTD_RULE_TGT']
                let fun = function(val) {
                    if(val < 10) return val.split('0')[1] + '月'
                    else return val + '月'
                }
                this.barAndLine.xAxis[0].data = Array.from(new Set(arr.filter(_ => _.MONTH_DATE <= moment().format('MM')).map(_ => fun(_.MONTH_DATE))))
                this.barAndLine.series[0].data = arr.map(item => {
                    return keys.map(key => {
                        if(key === 'MONTH_DATE') return item[key] > moment().format('MM') ? undefined : fun(item[key])
                        return item[key]
                    })
                })
                this.barAndLine.series[1].data = arr.map(item => {
                    return [keys[0], keys[2]].map(key => {
                        if(key === 'MONTH_DATE') return item[key] > moment().format('MM') ? undefined : fun(item[key])
                        return item[key]
                    })
                })
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.RegionalInvestment{
    margin-top: 5px;
    height: calc(100% - 207px);
    .table{
        /deep/ .col {
            .row:nth-child(1) {
                text-decoration: underline;
                cursor: pointer;
            }
            .row:nth-child(1):hover{
                text-decoration: underline;
                cursor: pointer;
                color: #4C89FF
            }
            .active{
                color: #4C89FF
            }
        }
    }
    .select{
        margin-top: 6px;
        display: flex;
        //position: relative;
        > div:nth-child(1) {
            z-index: 2;
            //position: absolute;
            //right: 0;
            //top: 0;
            display: flex;
            align-items: center;
            div{
                margin-right: 10px;
            }
            div:nth-child(1) {
                width: 16px;
                height: 2px;
                background: #5c8ff9;
            }
            div:nth-child(3) {
                width: 16px;
                height: 2px;
                background: #e7e7e7;
            }
            div:nth-child(2), div:nth-child(4) {
                font-size: 12px;
                font-family: PingFangSC-Regular, PingFang SC;
                color: rgba(0, 0, 0, 0.88);
                line-height: 17px;
            }
        }
    }
    .barAndLine{
        height: calc(100% - 152px)!important;
    }
}
</style>