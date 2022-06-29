import moment from 'moment'
import Title from '../components/Title'
import CircleEchart from "@/views/BIView/ProductSupply/NewRetailCockpit/components/CircleEchart";
import Select from '../components/Select'
import * as echarts from 'echarts5/lib/echarts'
import echartStyle from "./echartStyle.js";
export default {
    components: {
        Title,
        CircleEchart,
        Select,
    },
    methods: {
        disabledDate(current) {
            return current && current > moment()
        },
        computeYasisLabel(arr = [], target) {
            let max = 0
            if(!arr.length) return
            for(let i = 0; i < arr.length; i++) {
                if(!arr[i].length) continue
                for(let j = 0; j < arr[i].length; j ++) {
                    max = arr[i][j] > max ? arr[i][j] : max
                }
            }
            // 取最高位 + 1 * 位数
            let fun = function(val, FM = 10) {
                if(val / FM > 1) return fun(val, FM * 10)
                else return (val / (FM / 10) + 0.1).toFixed(1) * (FM / 10)
            }
            max = fun(max)
            if(target.indexOf('.') > -1) {
                this[target.split('.')[0]][target.split('.')[1]].yAxis[0].max = max.toFixed(0) * 1
                this[target.split('.')[0]][target.split('.')[1]].yAxis[0].minInterval = (max / this[target.split('.')[0]][target.split('.')[1]].yAxis[0].axisLabel.interval).toFixed(0) * 1
                return
            }
            this[target].yAxis[0].max = max.toFixed(0) * 1
            this[target].yAxis[0].minInterval = (max / this[target].yAxis[0].axisLabel.interval).toFixed(0) * 1
        },
        createDoubleBar() {
            let that = this
            return {
                legend: {
                    top: 0,
                    left: 'right',
                    orient: 'horizontal',
                    align: 'left',
                    // itemWidth: 10,
                    // itemHeight: 4,
                    ...echartStyle.legendLine,
                    icon: 'rect',
                    selectedMode: true
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'line'
                    },
                    backgroundColor: '#fff',
                    textStyle: {
                        color: 'rgba(0,0,0,0.65)',
                        fontSize: 12
                    },
                    borderWidth: 1,
                    borderColor: '#ccc',
                    extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);'
                },
                grid: {
                    left: 0,
                    right: 0,
                    bottom: 10,
                    top: 30,
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        // 月份
                        data: [],
                        axisTick: {
                            show: false,
                            alignWithLabel: true
                        },
                        axisLine: {
                            show: false,
                        },
                        axisLabel: {
                            color: echartStyle.axisLabel
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        axisTick: {
                            show: false
                        },
                        axisLine: {
                            show: false
                        },
                        axisLabel: {
                            show: false,
                            color: echartStyle.axisLabel,
                        },
                        splitLine: {
                            show: false,
                            lineStyle: {
                                // color: '#F0F0F0',
                                // type: 'dashed'
                                color: echartStyle.splitLine,
                                type: 'solid'
                            },
                        },
                    }
                ],
                series: [
                    {
                        name: '当期',
                        type: 'bar',
                        barWidth: '20',
                        data: [],
                        itemStyle: {
                            color: echartStyle.thisYear,
                            barBorderRadius: [10, 10, 0, 0],
                        },
                        label: {
                            show: false,
                            position: 'top'
                        },
                        z: 2
                    },
                    {
                        name: '同期',
                        type: 'bar',
                        barWidth: '20',
                        data: [],
                        itemStyle: {
                            normal: {
                                color: echartStyle.previousYear,
                                barBorderRadius: [10, 10, 0, 0],
                            },
                            emphasis: {
                                color: echartStyle.previousYear,
                                barBorderRadius: [10, 10, 0, 0],
                            }
                        },
                        label: {
                            show: false,
                            position: 'top'
                        },
                        z: 1
                    },
                ]
            }
        },
        createBarAndLineEchart() {
            let that = this
            return {
                // legend: {
                //     icon: 'rect'
                // },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'line'
                    },
                    backgroundColor: '#fff',
                    textStyle: {
                        color: 'rgba(0,0,0,0.65)',
                        fontSize: 12
                    },
                    borderWidth: 1,
                    borderColor: '#ccc',
                    extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);'
                },
                grid: {
                    left: '0%',
                    right: '0%',
                    bottom: 20,
                    top: 10,
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        // 月份
                        data: [],
                        axisTick: {
                            show: false,
                            alignWithLabel: true
                        },
                        axisLine: {
                            show: false,
                        },
                        axisLabel: {
                            color: echartStyle.axisLabel
                        }
                        // axisLabel: {
                        //     formatter: (value) => {
                        //         if (that.dateV2.dayOrMonth === 1) return value
                        //         else return value < 10 ? value.replace('0', '') + '月' : value + '月'
                        //     }
                        // }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        axisTick: {
                            show: false
                        },
                        axisLine: {
                            show: false
                        },
                        axisLabel: {
                            formatter: (value) => {
                                return (value / 10000).toString().toLocaleString() + '万'
                            },
                            color: echartStyle.axisLabel
                        },
                        splitLine: {
                            lineStyle: {
                                // color: '#F0F0F0',
                                // type: 'dashed'
                                color: echartStyle.splitLine,
                                type: 'solid'
                            },
                        }
                    }
                ],
                series: [
                    {
                        name: '本期业绩',
                        type: 'bar',
                        barWidth: '20',
                        data: [],
                        itemStyle: {
                            normal: {
                                color: function (params) {
                                    let color = ['#00a854', '#ff5953', echartStyle.thisYear]
                                    // 2 目标 1 业绩
                                    if (params.data[2] === null || params.data[2] === '--' || params.data[2] === undefined) return color[2]
                                    let index = params.data[1] - params.data[2] >= 0 ? 1 : 0
                                    return color[index]
                                },
                                barBorderRadius: [10, 10, 0, 0]
                            }
                        },
                        label: {
                            show: false,
                            position: 'top'
                        },
                        z: 2,
                    },
                    {
                        name: '同期业绩',
                        type: 'line',
                        barWidth: '20',
                        data: [],
                        itemStyle: {
                            color: function (params) {
                                let color = ['#ff5953', '#00a854']
                                return color[params.dataIndex % 2 === 0 ? '0' : '1']
                            }
                        },
                        label: {
                            show: false,
                            position: 'top'
                        },
                        z: 1,
                        // areaStyle: {
                        //     color: '#f3f5f9',
                        //     opacity: 1
                        // },
                        smooth: true,
                        lineStyle: {
                            color: echartStyle.previousYear
                        },
                        symbol: 'none',
                    },
                    // 业绩
                    // {
                    //     name: '1',
                    //     type: 'line',
                    //     barWidth: '20',
                    //     data: [],
                    //     label: {
                    //         show: false,
                    //         position: 'top'
                    //     },
                    //     z: 2,
                    //     itemStyle: {
                    //         color: '#2680eb'
                    //     },
                    //     lineStyle: {
                    //         color: '#2680eb',
                    //         width: 1.5
                    //     },
                    //     areaStyle: {
                    //         color: new graphic.LinearGradient(0, 0, 0, 1, [
                    //             {
                    //             offset: 0,
                    //             color: '#2680eb'
                    //             },
                    //             {
                    //             offset: 1,
                    //             color: '#2680eb00'
                    //             }
                    //         ])
                    //     },
                    //     smooth: true
                    // },
                    // // 目标
                    // {
                    //     name: '2',
                    //     type: 'line',
                    //     barWidth: '20',
                    //     data: [],
                    //     label: {
                    //         show: false,
                    //         position: 'top'
                    //     },
                    //     z: 1,
                    //     smooth: true,
                    //     symbol: 'none',
                    //     itemStyle: {
                    //         color: '#cce0e9'
                    //     },
                    //     lineStyle: {
                    //         color: '#cce0e9',
                    //         width: 1.5,
                    //     },
                    //     areaStyle: {
                    //         color: new graphic.LinearGradient(0, 0, 0, 1, [
                    //             {
                    //             offset: 0,
                    //             color: '#cce0e9'
                    //             },
                    //             {
                    //             offset: 1,
                    //             color: '#cce0e900'
                    //             }
                    //         ])
                    //     },
                    // },
                ]
            }
        },
        createLine() {
            let that = this
            return {
                tooltip: {
                    extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
                    trigger: 'axis',
                    axisPointer: {
                        type: 'line'
                    },
                    formatter: function (params) {
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
                    backgroundColor: '#fff',
                    textStyle: {
                        color: 'rgba(0,0,0,0.65)',
                        fontSize: 12
                    },
                    borderWidth: 1,
                    borderColor: '#ccc'
                },
                legend: {
                    top: 0,
                    left: 'right',
                    orient: 'horizontal',
                    align: 'left',
                    // itemWidth: 10,
                    // itemHeight: 4,
                    ...echartStyle.legendLine,
                    // data: ['花费', '支付占比'],
                    icon: 'rect',
                    selectedMode: true
                },
                // color: ['#6395f9', '#DFDFDF'],
                color: [echartStyle.thisYear, echartStyle.previousYear],
                grid: {
                    left: 0,
                    right: 0,
                    top: 10,
                    bottom: 10,
                    containLabel: true
                },
                xAxis: {
                    name: '统计日期',
                    nameTextStyle: {
                        color: 'transparent'
                    },
                    type: 'category',
                    data: [],
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        color: echartStyle.axisLabel
                    }
                },
                yAxis: [
                    {
                        type: 'value',
                        splitLine: {
                            show: true,
                            lineStyle: {
                                // color: '#F0F0F0',
                                // type: 'dashed'
                                color: echartStyle.splitLine,
                                type: 'solid'
                            }
                        },
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            formatter: (value) => {
                                if(value === 0) return '0%'
                                else return (value * 100).toFixed(0) + '%'
                            },
                            color: echartStyle.axisLabel
                        },
                    },
                    {
                        type: 'value',
                        show: false,
                        splitLine: {
                            show: false,
                        },
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        }
                    }
                ],
                series: [
                    {
                        name: '花费',
                        data: [],
                        type: 'line',
                        smooth: true,
                        symbolSize: 7,
                        z: 2,
                        symbol: 'none',
                        areaStyle: echartStyle.areaStyle[0]
                    },
                    {
                        name: '支付占比',
                        data: [],
                        type: 'line',
                        smooth: true,
                        symbolSize: 7,
                        z: 1,
                        symbol: 'none',
                        areaStyle: echartStyle.areaStyle[1]
                    }
                ]
            }
        },
        //处理数
        handleNum(type, val, boolean = false) {
            if (val === null || val === undefined || (!val && val !== 0)) return '--'
            if (boolean && val === 0) return '--'
            if (type === 'percent') {
                return (val * 100).toFixed(1) + '%'
            }
            else if (type === 'percent_not_dot') {
                return (val * 100).toFixed(0) + '%'
            }
            else if (type === 'percent_double_dot') {
                return (val * 100).toFixed(2) + '%'
            }
            else if (type === 'tenThousand') {
                return ((val / 10000).toFixed(1) * 1).toLocaleString() + '万'
            }
            else if (type === 'round') {
                return ((val * 1).toFixed(0) * 1).toLocaleString()
            }
        },
        createCircle() {
            return {
                itemStyle: {
                    color: (params) => {
                        let arr = ['#5b8ff9', '#f6bd16']
                        return arr[params.dataIndex]
                    },
                },
                // tooltip: {
                //     trigger: 'none'
                // },
                series: [
                    {
                        name: '',
                        type: 'pie',
                        radius: ['40%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                // fontSize: '40',
                                // fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: []
                    }
                ]
            }
        },
        createCategoryX() {
            let that = this
            return {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        // Use axis to trigger tooltip
                        type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
                    },
                    // formatter: function (params) {
                    //     let fun = (num) => {
                    //         let colors = ['#5b8ff9', '#f6bd16']
                    //         return `<div style="border-radius: 5px;width: 10px;height: 10px;background: ${colors[num]};display: inline-block;margin: 1px 5px 1px 0"></div>`
                    //     }
                    //     let div1 = fun(0), div2 = fun(1)
                    //     let str
                    //     str = `区域：${params[0].axisValue}<br/>${div1}B货占比：${that.handleNum('percent', params[0].data)}<br/>${div2}D货占比：${that.handleNum('percent', params[1].data)}`
                    //     return str
                    // },
                    formatter: function (params) {
                        if(Object.prototype.toString.call(params) === '[object Array]') {
                            let str = `${params[0].axisValue}<br/>`
                            params.forEach((item, index) => {
                                if(Object.prototype.toString.call(params[index].data) === '[object Array]'){
                                    str += `${params[index].marker}${params[index].seriesName}：${that.handleNum('percent', params[index].data[1])}<br/>`
                                }
                                else  str += `${params[index].marker}${params[index].seriesName}：${that.handleNum('percent', params[index].data)}<br/>`
                            })
                            return str
                        }else if(Object.prototype.toString.call(params) === '[object Object]') {
                            let str
                            if(Object.prototype.toString.call(params.data) === '[object Array]') {
                                str = `${params.axisValue}<br/>${params.marker}${params.seriesName}：${that.handleNum('percent', params.data[1])}<br/>`
                            }
                            else str = `${params.axisValue}<br/>${params.marker}${params.seriesName}：${that.handleNum('percent', params.data)}<br/>`
                            return str
                        }
                    },
                    backgroundColor: '#fff',
                    textStyle: {
                        color: 'rgba(0,0,0,0.65)',
                        fontSize: 12
                    },
                    borderWidth: 1,
                    borderColor: '#ccc',
                    extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);'
                },
                // legend: {},
                legend: {
                    top: 0,
                    left: 'right',
                    orient: 'horizontal',
                    align: 'left',
                    ...echartStyle.legendLine,
                    icon: 'rect',
                    selectedMode: true
                },
                grid: {
                    left: 0,
                    right: 0,
                    bottom: 10,
                    top: 10,
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        axisLabel: {
                            interval: 0,
                            color: echartStyle.axisLabel,
                        },
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        data: ['东区', '南区', '西区', '北区'],
                    },
                    {
                        type: 'category',
                        // inverse: true,
                        axisTick: 'none',
                        axisLine: 'none',
                        show: true,
                        axisLabel: {
                            textStyle: {
                                color: '#282c33',
                                fontSize: '12'
                            },
                            formatter: (val) => {
                                return this.handleNum('percent', val)
                            }
                        },
                        data: []
                    }
                ],
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        interval: 0,
                        formatter: (val) => {
                            if (val === 0) return '0%'
                            else return this.handleNum('percent', val)
                        },
                        color: echartStyle.axisLabel
                    },
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    },
                    splitLine: {
                        show: false,
                        lineStyle: {
                            // color: '#F0F0F0',
                            // type: 'dashed'
                            color: echartStyle.splitLine,
                            type: 'solid'
                        }
                    }
                },
                series: [
                    {
                        name: 'B货占比',
                        type: 'bar',
                        barWidth: 20,
                        stack: 'total',
                        label: {
                            show: true,
                            formatter: (params) => {
                                return that.handleNum('percent', params.value)
                            },
                            offset: [30, 0],
                            fontSize: 10,
                            color: 'rgba(0, 0, 0, 0.65)'
                        },
                        emphasis: {
                            focus: 'series'
                        },
                        data: [],
                        itemStyle: {
                            color: echartStyle.type1
                        }
                    },
                    {
                        name: 'D货占比',
                        type: 'bar',
                        barWidth: 20,
                        stack: 'total',
                        label: {
                            show: true,
                            formatter: (params) => {
                                return that.handleNum('percent', params.value)
                            },
                            offset: [0, -10],
                            fontSize: 10,
                            color: 'rgba(0, 0, 0, 0.65)'
                        },
                        emphasis: {
                            focus: 'series'
                        },
                        data: [],
                        itemStyle: {
                            color: echartStyle.type3
                        }
                    }
                ]
            }
        }
    }
}