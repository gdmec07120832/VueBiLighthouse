import moment from 'moment'
import echartStyle from './echartStyle.js'

export default {
    data() {
        let that = this
        let tooltip = function(format = []) {
            return {
                extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
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
                formatter: function (params) {
                    if(Object.prototype.toString.call(params) === '[object Array]') {
                        let str = `${params[0].axisValue}<br/>`
                        params.forEach((item, index) => {
                            let fun = (format === undefined || !format.length) ? 'round' : format[index]
                            if(Object.prototype.toString.call(params[index].data) === '[object Array]'){
                                str += `${params[index].marker}${params[index].seriesName}：${that.handleNum(fun, params[index].data[1])}<br/>`
                            }
                            else if(Object.prototype.toString.call(params[index].data) === '[object Object]'){
                                str += `${params[index].marker}${params[index].seriesName}：${that.handleNum(fun, params[index].data.value)}<br/>`
                            }
                        })
                        return str
                    }
                    else if(Object.prototype.toString.call(params) === '[object Object]') {
                        let fun = !format.length ? 'round' : format[0]
                        let str = `${params.axisValue}<br/>${params.marker}${params.seriesName}：${that.handleNum(fun, params.data[1])}<br/>`
                        return str
                    }
                },
            }
        }
        let labelFormatter = function(type) {
            let fun
            if(!type) fun = 'round'
            else fun = type
            return function(value) {
                return that.handleNum(fun, value)
            }
        }
        return {
            axisLabel: {
                show: true,
                fontSize: 12,
                // color: '#999',
                color: echartStyle.axisLabel,
            },
            tooltip,
            labelFormatter,
            obj: {
                tooltipFormatter: [],
                xAxisLabelFormatter: 'normal',
                yAxisLabelFormatter: 'normal',
            }
        }
    },
    methods: {
        handleNum(type, val, boolean = false) {
            if(val === '/') return '/'
            if (val === null || val === undefined || (!val && val !== 0) || val === '--') return '--'
            if (boolean && val === 0) return '--'
            if (type === 'percent') {
                return (val * 100).toFixed(1) + '%'
            }
            else if (type === 'percent_double_dot') {
                return (val * 100).toFixed(2) + '%'
            }
            else if (type === 'percent_not_dot') {
                return (val * 100).toFixed(0) + '%'
            }
            else if(type === 'toFixed2'){
                return (val * 1).toFixed(2)
            }
            else if (type === 'tenThousand') {
                return ((val / 10000).toFixed(0) * 1).toLocaleString() + '万'
            }
            else if (type === 'tenThousand_one_dot') {
                return ((val / 10000).toFixed(1) * 1).toLocaleString() + '万'
            }
            else if (type === 'round') {
                return ((val * 1).toFixed(0) * 1).toLocaleString()
            }
            else if(type === 'hundredMillion_double_dot') {
                return ((val / 100000000).toFixed(2) * 1).toLocaleString() + '亿'
            }
            else if(type === 'YYYY/M/DD') {
                return moment(val).format('YYYY/M/DD')
            }
            else if(type === 'normal') {
                return val
            }
            else if(type === 'DD日') {
                return moment(val).format(type)
            }
            else return ''
        },
        handleColor(type, val, clearZero = false) {
            if(val === '/') return ''
            if (val === null || val === undefined || (!val && val !== 0)) return ''
            if (clearZero && val === 0) return ''
            if(type === 'reach'){
                if(val >= 1) return 'red'
                else return 'green'
            }
            if(type === 'reach_reverse'){
                if(val >= 1) return 'green'
                else return 'red'
            }
            else if(type === 'YOY') {
                if(val > 0) return 'red'
                else if(val < 0) return 'green'
            }
            else if(type === 'YOY_reverse') {
                if(val > 0) return 'green'
                else if(val < 0) return 'red'
            }
            else if(type === 'diff'){
                if(val > 0) return 'red'
                else if(val < 0) return 'green'
            }
        },
        computeYasisLabel(arr = [], target) {
            // let max = 0
            // if(!arr.length) return
            // for(let i = 0; i < arr.length; i++) {
            //     if(!arr[i].length) continue
            //     for(let j = 0; j < arr[i].length; j++) {
            //         max = arr[i][j] > max ? arr[i][j] : max
            //     }
            // }
            // // 取最高位 + 1 * 位数
            // let fun = function(val, FM = 10) {
            //     if(val / FM > 1) return fun(val, FM * 10)
            //     else return (val / (FM / 10) + 0.1).toFixed(1) * (FM / 10)
            // }
            // max = fun(max)
            // if(target.indexOf('.') > -1) {
            //     this[target.split('.')[0]][target.split('.')[1]].yAxis[0].max = max.toFixed(0) * 1
            //     this[target.split('.')[0]][target.split('.')[1]].yAxis[0].minInterval = (max / this[target.split('.')[0]][target.split('.')[1]].yAxis[0].axisLabel.interval).toFixed(0) * 1
            //     return
            // }
            // this[target].yAxis[0].max = max.toFixed(0) * 1
            // this[target].yAxis[0].minInterval = (max / this[target].yAxis[0].axisLabel.interval).toFixed(0) * 1

            let max = 0
            if(!arr.length) return
            for(let i = 0; i < arr.length; i++) {
                if(!arr[i].length) continue
                for(let j = 0; j < arr[i].length; j++) {
                    max = arr[i][j] > max ? arr[i][j] : max
                }
            }
            let maxArr = max.toFixed(0).split('')
            max = (maxArr[0] * 1 + maxArr[1] * 0.1 + 0.1) * 10 ** (maxArr.length - 1)
            if(target.indexOf('.') > -1) {
                let interval = this[target.split('.')[0]][target.split('.')[1]].yAxis[0].axisLabel.interval
                let space = (max / interval)
                let spaceArr = space.toFixed(0).split('')
                space = Math.ceil(spaceArr[0] * 1 + spaceArr[1] * 0.1 + 0.1) * 10 ** (spaceArr.length - 1)
                max = space * interval
                this[target.split('.')[0]][target.split('.')[1]].yAxis[0].max = max
                this[target.split('.')[0]][target.split('.')[1]].yAxis[0].minInterval = space
                return
            }
            let interval = this[target].yAxis[0].axisLabel.interval
            let space = max / interval
            let spaceArr = space.toFixed(0).split('')
            space = Math.ceil(spaceArr[0] * 1 + spaceArr[1] * 0.1 + 0.1) * 10 ** (spaceArr.length - 1)
            console.log(space, spaceArr, interval, max)
            max = space * interval
            this[target].yAxis[0].max = max
            this[target].yAxis[0].minInterval = space
            console.log(this[target].yAxis[0])
        },
        createBarAndLineEchart(obj = this.obj) {
            let that = this
            return {
                legend: {
                    top: 0,
                    left: 'right',
                    orient: 'horizontal',
                    align: 'left',
                    ...echartStyle.legendLine,
                    icon: 'rect',
                    selectedMode: true
                },
                tooltip: that.tooltip(obj.tooltipFormatter),
                grid: {
                    left: '0%',
                    right: '0%',
                    bottom: 0,
                    top: 0,
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
                            ...that.axisLabel,
                            formatter: that.labelFormatter(obj.xAxisLabelFormatter),
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
                            ...that.axisLabel,
                            formatter: that.labelFormatter(obj.yAxisLabelFormatter),
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
                        name: '',
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
                        name: '',
                        type: 'line',
                        barWidth: '20',
                        data: [],
                        itemStyle: {
                            color: echartStyle.previousYear,
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
                ]
            }
        },
        createLine(obj = this.obj) {
            let that = this
            return {
                tooltip: that.tooltip(obj.tooltipFormatter),
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
                    top: 0,
                    bottom: 0,
                    containLabel: true
                },
                xAxis: [
                    {
                        name: '',
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
                            ...that.axisLabel,
                            formatter: that.labelFormatter(obj.xAxisLabelFormatter),
                        },
                    },
                ],
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
                            ...that.axisLabel,
                            formatter: that.labelFormatter(obj.yAxisLabelFormatter),
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
                        name: '',
                        data: [],
                        type: 'line',
                        smooth: true,
                        symbolSize: 7,
                        z: 2,
                        symbol: 'none',
                        areaStyle: echartStyle.areaStyle[0]
                    },
                    {
                        name: '',
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
        createDoubleBar(obj = this.obj) {
            let that = this
            return {
                legend: {
                    top: 0,
                    left: 'right',
                    orient: 'horizontal',
                    align: 'left',
                    // itemWidth: 10,
                    // itemHeight: 4,
                    ...echartStyle.legendRect,
                    icon: 'rect',
                    selectedMode: true
                },
                tooltip: that.tooltip(obj.tooltipFormatter),
                grid: {
                    left: 0,
                    right: 0,
                    bottom: 0,
                    top: 0,
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
                            ...that.axisLabel,
                            formatter: that.labelFormatter(obj.xAxisLabelFormatter),
                        },
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
                            ...that.axisLabel,
                            formatter: that.labelFormatter(obj.yAxisLabelFormatter),
                        },
                        splitLine: {
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
                        name: '',
                        type: 'bar',
                        barWidth: '20',
                        data: [],
                        itemStyle: {
                            // color: '#5B8FF9',
                            color: echartStyle.thisYear,
                            barBorderRadius: [10, 10, 0, 0],
                        },
                        label: {
                            show: true,
                            position: 'top',
                            fontSize: 12,
                            color: 'rgba(0, 0, 0, 0.88)',
                        },
                        z: 2
                    },
                ]
            }
        },
        createCircle(ojb = this.obj) {
            return {
                // itemStyle: {
                //     color: (params) => {
                //         console.log(params)
                //         let arr = ['#5b8ff9', '#f6bd16', '#5d7092', '#fd84b6','#FF458C','#5C7BD9','#9FE080','#FFDC60','#FF7070','#CB7BF4', '#4B7CF3',
                //             '#F24354','#32D5B9','#F19E34','#9565F4','#0255FD','#7ED3F4','#002E5A','#07D2F9']
                //         return arr[params.dataIndex]
                //     },
                // },
                color: ['#5b8ff9', '#f6bd16', '#5d7092', '#fd84b6','#FF458C','#5C7BD9','#9FE080','#FFDC60','#FF7070','#CB7BF4', '#4B7CF3',
                    '#F24354','#32D5B9','#F19E34','#9565F4','#0255FD','#7ED3F4','#002E5A','#07D2F9'],
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
                            show: true,
                            position: 'outside',
                            formatter: function(params) {
                                // return `${params.data.name}\n${(params.data.value * 100).toFixed(0)}%`
                                return `${params.data.name}\n${params.percent}%`
                            }
                        },
                        emphasis: {
                            label: {
                                show: true,
                                // fontSize: '40',
                                // fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: true,
                            length: 10,
                            length2: 10,
                            lineStyle: {
                                color: '#8C8C8C'
                            }
                        },
                        selectedMode: 'single',
                        data: []
                    }
                ]
            }
        },
    }
}