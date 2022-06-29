<template>
    <div class="SiteSelection">
        <div class="topBox">
            <div class="select">
                <div class="title">{{ topBoxSelects.radio.value }}概览</div>
                <div style="flex: 1"></div>
                <a-radio-group v-model="topBoxSelects.radio.value">
                    <a-radio :value="item" v-for="item in topBoxSelects.radio.options" :key="item">
                        {{ item }}
                    </a-radio>
                </a-radio-group>
<!--                <span class="text-xs mr10 text-black">统计月份</span>-->
<!--                <a-month-picker v-model="topBoxSelects.month" valueFormat="YYYYMM" :allowClear="false"/>-->
            </div>
            <div class="content">
                <div class="overview">
                    <div>{{ topBoxSelects.radio.value }}概览</div>
                    <div style="height: calc(100% - 31px);display: flex" class="mt10">
                        <v-chart
                            id="circle"
                            ref="circle"
                            style="overflow: visible"
                            :style="{width: circleWidth}"
                            :options="circle"
                            autoresize
                        ></v-chart>
                        <div class="legend" v-if="circle !== null">
                            <div class="item" v-for="item in circle.series[0].data" :key="item.name">
                                <div class="icon mr5"></div>
                                <div class="name text-black text-xs mr5">{{item.name}}</div>
                                <div class="value text-xs">{{handleNum('percent', item.value)}}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="post">
                    <div>评级发货达成</div>
                    <v-chart
                        ref="bar"
                        style="overflow: visible;height: calc(100% - 31px)"
                        class="mt10"
                        :options="bar"
                        autoresize
                    ></v-chart>
                </div>
                <div class="survey" ref="survey">
                    <div>{{ topBoxSelects.radio.value === '门店位置' ? '选址' : '选商' }}概况</div>
                    <Table v-bind="table" class="mt10" :style="{'--trHeight': trHeight}"/>
                </div>
            </div>
        </div>
        <div class="bottomBox">
            <div class="selects">
                <div class="title mr20">分布概览</div>
                <a-radio-group v-model="bottomBoxSelects.radio.value">
                    <a-radio :value="item" v-for="item in bottomBoxSelects.radio.options" :key="item">
                        {{ item }}
                    </a-radio>
                </a-radio-group>
            </div>
            <div class="mt10" style="display: flex;height: calc(100% - 32px)">
                <div class="leftBox" style="position: relative">
                    <div style="position: absolute;top: 0;left: 0">{{ bottomBoxSelects.radio.value.replace('视角', '') }}门店评级分布</div>
                    <v-chart
                        ref="category"
                        style="overflow: visible;"
                        :options="category"
                        autoresize
                    ></v-chart>
                </div>
                <div style="width: 100px"></div>
                <div class="rightBox" style="position: relative">
                    <div style="position: absolute;top: 0;left: 0">{{ bottomBoxSelects.radio.value.replace('视角', '') }}评级发货达成</div>
                    <v-chart
                        ref="category1"
                        style="overflow: visible;"
                        :options="category1"
                        autoresize
                    ></v-chart>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment'
import base from '../../../utils/base.js'
import Table from '../../../components/Table'
import { cloneDeep, groupBy } from "lodash";
export default {
    name: 'SiteSelection',
    mixins: [ base ],
    components: {
        Table,
    },
    async created() {
        let vm = this
        this.circle = await this.createCircle()
        this.circle.series[0].emphasis = {
            label: {
                show: false
            }
        }
        this.circle.tooltip = {
            formatter: params => {
                let str = `${params.name}<br/>`
                str += `${params.marker} ${vm.handleNum('percent', params.value)}`
                return str
            },
            backgroundColor: '#fff',
            textStyle: {
                color: 'rgba(0,0,0,0.65)',
                fontSize: 12
            },
            borderWidth: 1,
            borderColor: '#ccc',
            extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);'
        }
        // this.circle.color = ['#5b8ff9', '#f6bd16', '#5d7092', '#fd84b6','#FF458C','#5C7BD9','#9FE080','#FFDC60','#FF7070','#CB7BF4', '#4B7CF3',
        //     '#F24354','#32D5B9','#F19E34','#9565F4','#0255FD','#7ED3F4','#002E5A','#07D2F9']
        this.circle.color = ['#5d8ef9', '#fc84b6', '#f7be14', '#5d7292', '#2cc2bd']
        this.circle.itemStyle = {}
        this.circle.series[0].data = [
            {name: '优', value: null},
            {name: '良', value: null},
            {name: '中', value: null},
            {name: '差', value: null},
            {name: '极差', value: null},
        ]
        this.bar = await this.createDoubleBar()
        this.bar.tooltip.formatter = params => {
            let str = `${params[0].axisValue}<br/>`
            params.forEach((item, index) => {
                if(Object.prototype.toString.call(params[index].data) === '[object Array]'){
                    str += `${params[index].marker}${params[index].seriesName}：${vm.handleNum('percent', params[index].data[1])}<br/>`
                }
                else  str += `${params[index].marker}${params[index].seriesName}：${vm.handleNum('percent', params[index].data)}<br/>`
            })
            return str
        }
        this.bar.series = [this.bar.series[0]]
        this.bar.grid.bottom = 0
        this.bar.xAxis[0].data = ['优', '良', '中', '差', '极差']
        this.bar.series[0].data = []
        this.bar.series[0].name = ''
        this.bar.series[0].itemStyle.barBorderRadius = 0
        this.bar.yAxis[0].axisLabel.show = true
        this.bar.yAxis[0].axisLabel.color = 'rgba(0, 0, 0, 0.65)'
        this.bar.yAxis[0].axisLabel.formatter = val => {
            return vm.handleNum('percent_not_dot', val)
        }
        this.bar.xAxis[0].axisLabel = {
            show: true,
            color: 'rgba(0, 0, 0, 0.65)',
        }
        this.bar.series[0].label.show = true
        this.bar.series[0].label.color = '#000'
        this.bar.series[0].label.formatter = params => {
            return vm.handleNum('percent_not_dot', params.data[1])
        }
        this.category = this.createCategoryX()
        this.category.tooltip.axisPointer.type = 'line'
        this.category.grid.bottom = 0
        this.category.grid.top = 30
        this.category.legend = {
            top: 0,
            right: 0,
            itemWidth: 10,
            itemHeight: 4,
            data: ['优', '良', '中', '差', '极差']
        }
        this.category.yAxis.axisLabel.formatter = val => {
            return vm.handleNum('round', val)
        }
        this.category.tooltip.formatter = params => {
            let str = `${params[0].axisValue}<br/>`
            // params.forEach((item, index) => {
            //     if(Object.prototype.toString.call(params[index].data) === '[object Array]'){
            //         str += `${params[index].marker}${params[index].seriesName}：${vm.handleNum('round', params[index].data[1])}<br/>`
            //     }
            //     else  str += `${params[index].marker}${params[index].seriesName}：${vm.handleNum('round', params[index].data)}<br/>`
            // })
            for(let index = params.length - 1; index >= 0; index--) {
                if(Object.prototype.toString.call(params[index].data) === '[object Array]'){
                    str += `${params[index].marker}${params[index].seriesName}：${vm.handleNum('round', params[index].data[1])}<br/>`
                }
                else  str += `${params[index].marker}${params[index].seriesName}：${vm.handleNum('round', params[index].data)}<br/>`
            }
            return str
        }
        this.category.series[0].label.show = false
        this.category.series[0].name = '极差'
        this.category.series[0].itemStyle.color = '#2cc2bd'
        this.category.series = [this.category.series[0]]
        for(let i = 0; i < 4; i++){
            // let colors = ['#5d8ef9', '#fc84b6', '#f7be14', '#5d7292', '#2cc2bd']
            let colors = ['#2cc2bd', '#5d7292', '#f7be14', '#fc84b6', '#5d8ef9']
            // let names = ['优', '良', '中', '差', '极差']
            let names = ['极差', '差', '中', '良', '优']
            let item = cloneDeep(this.category.series[0])
            item.itemStyle.color = colors[i + 1]
            item.name = names[i + 1]
            this.category.series.push(item)
        }
        this.category.xAxis[0].data = ['特级', '一级', '二级', '三级', '四级', '五级', '六级']
        this.category1 = cloneDeep(this.category)
        this.category1.yAxis.axisLabel.formatter = val => {
            return vm.handleNum('percent_not_dot', val)
        }
        this.category1.tooltip.formatter = params => {
            let str = `${params[0].axisValue}<br/>`
            for(let index = params.length - 1; index >= 0; index--) {
                if(Object.prototype.toString.call(params[index].data) === '[object Array]'){
                    str += `${params[index].marker}${params[index].seriesName}：${vm.handleNum('percent', params[index].data[1])}<br/>`
                }
                else  str += `${params[index].marker}${params[index].seriesName}：${vm.handleNum('percent', params[index].data)}<br/>`
            }
            return str
        }
        this.getOverview()
        this.getCity()
    },
    mounted() {
        this.resizeEvent()
        window.addEventListener('resize', this.resizeEvent)
        let vm = this
        setTimeout(() => {
            vm.$refs.circle.$refs.echarts.dispatchAction({
                type: 'highlight',
                seriesIndex: 0,
                dataIndex: 0,
            })
        }, 100)

    },
    beforeDestroy() {
        window.removeEventListener('resize', this.resizeEvent)
    },
    watch: {
        // 'topBoxSelects.month': {
        //     handler() {
        //         this.getOverview()
        //         if(this.bottomBoxSelects.radio.value === '城市等级视角') {
        //             this.getCity()
        //         }
        //         else if(this.bottomBoxSelects.radio.value === '区域视角') {
        //             this.getArea()
        //         }
        //     }
        // },
        'topBoxSelects.radio.value': {
            handler() {
                this.getOverview()
                if(this.bottomBoxSelects.radio.value === '城市等级视角') {
                    this.getCity()
                }
                else if(this.bottomBoxSelects.radio.value === '区域视角') {
                    this.getArea()
                }
            }
        },
        'bottomBoxSelects.radio.value': {
            handler(val) {
                if(val === '城市等级视角') {
                    this.getCity()
                }
                else if(val === '区域视角') {
                    this.getArea()
                }
            }
        },
    },
    data() {
        let vm = this
        let resizeEvent = function() {
            setTimeout(() => {
                vm.circleWidth = vm.$refs.circle.$el.offsetHeight + 'px'
                vm.trHeight = (vm.$refs.survey.offsetHeight - 31) / vm.table.labelData.length + 'px'
            }, 200)
        }
        return {
            resizeEvent,
            circleWidth: '100px',
            topBoxSelects: {
                radio: {
                    value: '门店位置',
                    options: ['门店位置', '代理商'],
                },
                month: moment().format('DD') !== '01' ? moment().format('YYYYMM') : moment.subtract(1, 'M').format('YYYYMM')
            },
            circle: null,
            bar: null,
            table: {
                index: 'AttractInvestment_SiteSelection',
                labelData: ['类目', '优', '良', '中', '差', '极差'],
                tableData: [
                    ['门店数', '/', '/', '/', '/', '/'],
                    ['考核目标', '/', '/', '/', '/', '/'],
                    ['发货业绩', '/', '/', '/', '/', '/'],
                    ['考核达成', '/', '/', '/', '/', '/'],
                ]
            },
            trHeight: '30px',
            bottomBoxSelects: {
                radio: {
                    value: '城市等级视角',
                    options: ['城市等级视角', '区域视角'],
                },
            },
            category: null,
            category1: null,
            cityData: [],
            areaData: [],
        }
    },
    methods: {
        async getOverview() {
            // let query = {
            //     MDATE: this.topBoxSelects.month
            // }
            let api = this.topBoxSelects.radio.value === '门店位置' ? 'new_retail_open_xsxz_sum' : 'new_retail_open_xsxz_agent_sum'
            let res = await this.$fetchSql('new_retail', api)
            this.handleData('circle', res.data)
            this.handleData('bar', res.data)
            this.handleData('table', res.data)
        },
        async getCity() {
            // let query = {
            //     MDATE: this.topBoxSelects.month
            // }
            let api = this.topBoxSelects.radio.value === '门店位置' ? 'new_retail_open_xsxz_city' : 'new_retail_open_xsxz_agent_city'
            let res = await this.$fetchSql('new_retail', api)
            this.cityData = res.data.concat()
            this.handleData('category', res.data)
            this.handleData('category1', res.data)
        },
        async getArea() {
            // let query = {
            //     MDATE: this.topBoxSelects.month
            // }
            let api = this.topBoxSelects.radio.value === '门店位置' ? 'new_retail_open_xsxz_area' : 'new_retail_open_xsxz_agent_area'
            let res = await this.$fetchSql('new_retail', api)
            this.areaData = res.data.concat()
            this.handleData('category', res.data)
            this.handleData('category1', res.data)
        },
        handleData(type, source) {
            if(type === 'circle') {
                this.circle.series[0].data = ['优', '良', '中', '差', '极差'].map(name => {
                    return {
                        name,
                        value: null
                    }
                })
                let arr = source.concat()
                if(!arr.length) return
                let sortObj = {
                    '优': 1,
                    '良': 2,
                    '中': 3,
                    '差': 4,
                    '极差': 5,
                }
                let field = this.topBoxSelects.radio.value === '门店位置' ? 'STORE_TYPE' : 'AGENT_TYPE'
                arr.sort((a, b) => {
                    let sort_a = sortObj[a[field]]
                    let sort_b = sortObj[b[field]]
                    !sort_a ? sort_a = 99 : null
                    !sort_b ? sort_b = 99 : null
                    return sort_a - sort_b
                })
                this.circle.series[0].data = arr.map(item => {
                    return {
                        name: item[field],
                        value: item.MTD_SHOP_RATE
                    }
                })
            }
            else if(type === 'bar') {
                this.bar.series.forEach(item => {
                    item.data = []
                    item.name = ''
                })
                let arr = source.concat()
                if(!arr.length) return
                let field = this.topBoxSelects.radio.value === '门店位置' ? 'STORE_TYPE' : 'AGENT_TYPE'
                let keys = [field, 'MTD_DLVRED_RATE']
                this.bar.series[0].data = arr.map(item => {
                    return keys.map(key => {
                        return item[key]
                    })
                })
            }
            else if(type === 'table') {
                this.table.tableData = []
                let arr = source.concat()
                if(!arr.length) return
                let sortObj = {
                    '优': 1,
                    '良': 2,
                    '中': 3,
                    '差': 4,
                    '极差': 5,
                }
                let field = this.topBoxSelects.radio.value === '门店位置' ? 'STORE_TYPE' : 'AGENT_TYPE'
                arr.sort((a, b) => {
                    let sort_a = sortObj[a[field]]
                    let sort_b = sortObj[b[field]]
                    !sort_a ? sort_a = 99 : null
                    !sort_b ? sort_b = 99 : null
                    return sort_a - sort_b
                })
                let keys = ['MTD_SHOP_CNT', 'MTD_DLVRED_TGT', 'MTD_DLVRED_AMT', 'MTD_DLVRED_RATE']
                this.table.tableData = keys.map(key => {
                    let keysToLabel = {
                        'MTD_SHOP_CNT': '门店数',
                        'MTD_DLVRED_TGT': '考核目标',
                        'MTD_DLVRED_AMT': '发货业绩',
                        'MTD_DLVRED_RATE': '考核达成',
                    }
                    return [keysToLabel[key]].concat(arr.map(item => {
                        return item[key]
                    }))
                })
            }
            else if(type === 'category') {
                this.$refs.category.$refs.echarts.clear()
                let flag = this.bottomBoxSelects.radio.value === '城市等级视角' ? true : false
                this.category.xAxis[0].data = flag ? ['特级', '一级', '二级', '三级', '四级', '五级', '六级'] : ['东区', '南区', '西区', '北区']
                this.category.series.forEach(item => {
                    item.data = []
                })
                let arr = source.concat()
                if(!arr.length) return
                let field = this.topBoxSelects.radio.value === '门店位置' ? 'STORE_TYPE' : 'AGENT_TYPE'
                let obj = groupBy(arr, _ => _[field])
                for(let key in obj) {
                    let index = this.category.series.findIndex(_ => _.name === key)
                    if(index > -1) {
                        let keys = flag ? ['CITY_LEVEL', 'MTD_SHOP_CNT'] : ['S_OR_N', 'MTD_SHOP_CNT']
                        this.category.series[index].data = obj[key].map(item => {
                            return keys.map(key => {
                                return item[key]
                            })
                        })
                    }
                }
            }
            else if(type === 'category1') {
                this.$refs.category1.$refs.echarts.clear()
                let flag = this.bottomBoxSelects.radio.value === '城市等级视角' ? true : false
                this.category1.xAxis[0].data = flag ? ['特级', '一级', '二级', '三级', '四级', '五级', '六级'] : ['东区', '南区', '西区', '北区']
                this.category1.series.forEach(item => {
                    item.data = []
                })
                let arr = source.concat()
                if(!arr.length) return
                let field = this.topBoxSelects.radio.value === '门店位置' ? 'STORE_TYPE' : 'AGENT_TYPE'
                let obj = groupBy(arr, _ => _[field])
                for(let key in obj) {
                    let index = this.category1.series.findIndex(_ => _.name === key)
                    if(index > -1) {
                        let keys = flag ? ['CITY_LEVEL', 'MTD_DLVRED_RATE'] : ['S_OR_N', 'MTD_DLVRED_RATE']
                        this.category1.series[index].data = obj[key].map(item => {
                            return keys.map(key => {
                                return item[key]
                            })
                        })
                    }
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.SiteSelection{
    width: 100%;
    height: 100%;
    .title{
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 600;
        color: #000000;
        line-height: 20px;
    }
    .topBox{
        height: calc(50% - 10px);
        .select{
            display: flex;
            align-items: center;
            padding: 11px 0;
        }
        .content{
            height: calc(100% - 50px);
            display: flex;
            align-items: center;
            justify-content: space-between;
            .overview{
                //width: 30%;
                height: 100%;
                .legend{
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: flex-start;
                    .item{
                        display: flex;
                        align-items: center;
                        margin-bottom: 10px;
                        &:nth-last-child(1){
                            margin-bottom: 0;
                        }
                        .icon{
                            width: 10px;
                            height: 4px;
                        }
                        &:nth-child(1) .icon{
                            background: #5d8ef9;
                        }
                        &:nth-child(2) .icon{
                            background: #fc84b6;
                        }
                        &:nth-child(3) .icon{
                            background: #f7be14;
                        }
                        &:nth-child(4) .icon{
                            background: #5d7292;
                        }
                        &:nth-child(5) .icon{
                            background: #2cc2bd;
                        }
                    }
                }
            }
            .post{
                width: 30%;
                height: 100%;
            }
            .survey{
                width: 30%;
                height: 100%;
                /deep/ .Table{
                    .row{
                        height: var(--trHeight);
                        line-height: var(--trHeight);
                    }
                    .col1{
                        min-width: 60px;
                        max-width: 60px;
                    }
                }
            }
        }
    }
    .bottomBox{
        margin-top: 20px;
        height: calc(50% - 10px);
        .selects{
            display: flex;
            align-items: center;
        }
        .leftBox{
            width: calc(50% - 50px);
            height: 100%;
        }
        .rightBox{
            width: calc(50% - 50px);
            height: 100%;
        }
    }
}
</style>