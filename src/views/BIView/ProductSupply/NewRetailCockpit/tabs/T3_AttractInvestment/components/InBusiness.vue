<template>
    <div class="InBusiness">
        <Table @click="clickTable" v-bind="table" class="table" ref="table"/>
        <v-chart ref="bar" class="bar" style="overflow: visible;" :options="bar" autoresize></v-chart>
    </div>
</template>

<script>
import Table from '../../../components/Table'
import base from '../../../utils/base.js'
import moment from "moment";
export default {
    mixins: [ base ],
    components: {
        Table,
    },
    props: {
        date: {
            type: Array,
        },
        STORE_TYPE: {
            type: String,
        }
    },
    async created() {
        this.bar = await this.createBarAndLineEchart()
        let that = this
        this.bar.series[0].name = '营业中'
        this.bar.yAxis[0].axisLabel.formatter = function(val) {
            return that.handleNum('round', val)
        }
        this.bar.series[0].data = []
        // this.bar.series[0].itemStyle.normal.barBorderRadius = 0
        this.bar.grid.bottom = 0
        this.getTableData()
        this.getBarData()
    },
    mounted() {
        console.log(this.$refs.table.$el)
        this.$refs.table.$el.children[1].children[0].classList.add('active')
    },
    computed: {
        START_TIME() {
            return this.date[0].format('YYYYMM')
        },
        END_TIME() {
            return this.date[1].format('YYYYMM')
        }
    },
    watch: {
        STORE_TYPE: {
            handler() {
                this.getTableData()
                this.getBarData(this.currentRegion)
            }
        },
        date: {
            handler(val) {
                this.getTableData()
                this.getBarData(this.currentRegion)
            },
            deep: true,
        },
        currentRegion: {
            handler(val) {
                this.getBarData(val)
            }
        }
    },
    data() {
        return {
            bar: null,
            table: {
                index: 'AttractInvestmentB',
                labelData: ['区域', '营业中', '年累净增门店', '环比净增门店'],
                tableData: [
                    ['全国', '/', '/', '/', '/'],
                    ['东区', '/', '/', '/', '/'],
                    ['南区', '/', '/', '/', '/'],
                    ['西区', '/', '/', '/', '/'],
                    ['北区', '/', '/', '/', '/']
                ]
            },
            currentRegion: '全国',
            areaOpenData: [],
        }
    },
    methods: {
        clickTable(e) {
            let text = e.target.innerText
            let keys = ['全国', '东区', '西区', '南区', '北区']
            if(keys.indexOf(text) > -1) {
                // if(text === keys[0]) this.getBarData()
                // else this.getBarData(text)
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
            this.STORE_TYPE && this.STORE_TYPE !== '总体' ? query.STORE_TYPE = this.STORE_TYPE : null
            let res =  await this.$fetchSql('new_retail', 'new_retail_open_areabusiness', query)
            this.areaOpenData = res.data.concat()
            this.handleData('table', res.data)
            // this.handleData('table', arr)
        },
        async getBarData(S_OR_N = '全国') {
            // let arr = [
            //     {a: 1, b: 10},
            //     {a: 3, b: 11},
            //     {a: 2, b: 15},
            //     {a: 4, b: 12},
            // ]
            let query = {
                START_TIME: moment(this.START_TIME).format('YYYY') + '01',
                END_TIME: moment(this.END_TIME).format('YYYY') + '12'
            }
            S_OR_N !== '全国' ? query.S_OR_N = S_OR_N : null
            this.STORE_TYPE && this.STORE_TYPE !== '总体' ? query.STORE_TYPE = this.STORE_TYPE : null
            let res =  await this.$fetchSql('new_retail', 'new_retail_open_areabusiness_trend', query)
            this.handleData('bar', res.data)
            // this.handleData('bar', arr)
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
                    return ['S_OR_N', 'TOT_OPENING', 'Y_OPENING', 'M_OPENING'].map(key => {
                        return item[key]
                    })
                })

            }
            if(type === 'bar') {
                this.bar.series[0].data = []
                this.$refs?.bar?.$refs?.echarts.clear()
                if(!source.length) return
                let arr = source.concat()
                arr = arr.sort((a, b) => a.MONTH_DATE - b.MONTH_DATE)
                let fun = function(val){
                    if(val < 10) return val.split('0')[1] + '月'
                    else return val + '月'
                }
                this.bar.xAxis[0].data = Array.from(new Set(arr.filter(_ => _.MONTH_DATE <= moment().format('MM')).map(_ => fun(_.MONTH_DATE))))
                this.bar.series[0].data = arr.map(item => {
                    return ['MONTH_DATE', 'TOT_OPENING'].map(key => {
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
.InBusiness{
    margin-top: 5px;
    height: calc(100% - 206px);
    .table{
        /deep/ .col {
            .row:nth-child(1) {
                text-decoration: underline;
                cursor: pointer;
            }
            .row:nth-child(1):hover{
                text-decoration: underline;
                cursor: pointer;
                color: #4C89FF;
            }
            .active{
                color: #4C89FF!important;
            }
        }
    }
    .bar{
        margin-top: 10px;
        height: calc(100% - 110px)!important;
    }
}
</style>