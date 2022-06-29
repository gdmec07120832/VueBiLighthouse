import moment from "moment";
import graphic from 'echarts/lib/util/graphic'
export default {
    methods: {
        createEcharts() {
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
                    // formatter: function (params, $index) {
                    //     let flag = that.radio2.model === 1 ? true : false
                    //     // 本期业绩flag
                    //     let flag1 = moment(moment(that.dateV2.month2).format('YYYY-') + params[0].data[3]).format('x') > moment(moment(new Date()).format('YYYY-MM')).format('x')
                    //     let fun = (num) => {
                    //         let colors = ['#2680eb', '#cce0e9']
                    //         return `<div style="border-radius: 5px;width: 10px;height: 10px;background: ${colors[num]};display: inline-block;margin: 1px 5px 1px 0"></div>`
                    //     }
                    //     let div1 = fun(0), div2 = fun(1)
                    //     let str, str1
                    //     if (that.dateV2.dayOrMonth === 1) {
                    //         str = `统计年月：${params[0].data[3]}<br/>支付目标：${that.handleNumV2(1, params[0].data[2])}<br/>支付业绩：${that.handleNumV2(1, params[0].data[1])}`
                    //         str1 = `统计年月：${params[0].data[3]}<br/>发货目标：${that.handleNumV2(1, params[0].data[2])}<br/>发货业绩：${that.handleNumV2(1, params[0].data[1])}`
                    //     } else if (that.dateV2.dayOrMonth === 2) {
                    //         str = `统计年月：${moment(that.dateV2.month2).format('YYYY-') + params[0].axisValue}<br/>${div1}支付业绩：${flag1 ? '--' : that.handleNumV2(1, params[0].data[1])}<br/>${div2}同期业绩：${that.handleNumV2(1, params[0].data[2])}`
                    //         str1 = `统计年月：${moment(that.dateV2.month2).format('YYYY-') + params[0].axisValue}<br/>${div1}发货业绩：${flag1 ? '--' : that.handleNumV2(1, params[0].data[1])}<br/>${div2}同期业绩：${that.handleNumV2(1, params[0].data[2])}<br/>`
                    //     }
                    //     // let str = `统计年月：${params.data[3]}<br/>支付目标：${that.handleNum(1, params.data[2])}<br/>支付业绩：${that.handleNum(1, params.data[1])}`
                    //     // let str1 = `统计年月：${params.data[3]}<br/>发货目标：${that.handleNum(1, params.data[2])}<br/>发货业绩：${that.handleNum(1, params.data[1])}`
                    //     return flag ? str : str1
                    //
                    // },
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
                        splitLine: {
                            lineStyle: {
                                color: '#f7f7f7'
                            }
                        },
                        axisLabel: {
                            formatter: (value) => {
                                return (value / 10000).toString().toLocaleString() + '万'
                            }
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
                            color: function (params) {
                                // let color = ['#00a854', '#ff5953', '#5b8ff9']
                                let color = ['#00B050', '#FF2219', '#5b8ff9']
                                // 2 目标 1 业绩
                                if (params.data[2] === 0 || params.data[2] === null || params.data[2] === '--' || params.data[1] - params.data[2] === 0) return color[2]
                                let index = params.data[1] - params.data[2] > 0 ? 1 : 0
                                return color[index]
                            }
                        },
                        label: {
                            show: false,
                            position: 'top'
                        },
                        z: 2
                    },
                    {
                        name: '同期业绩',
                        type: 'line',
                        barWidth: '20',
                        data: [],
                        itemStyle: {
                            color: function () {
                                // return '#cce0e9'
                                return '#f3f5f9'
                            }
                        },
                        label: {
                            show: false,
                            position: 'top'
                        },
                        z: 2,
                        areaStyle: {
                            color: '#f3f5f9',
                            opacity: 1,
                            // color: new graphic.LinearGradient(0, 0, 0, 1, [
                            //     {
                            //         offset: 0,
                            //         color: '#cce0e9'
                            //     },
                            //     {
                            //         offset: 1,
                            //         color: '#cce0e900'
                            //     }
                            // ])
                        },
                        smooth: true,
                        lineStyle: {
                            color: 'transparent'
                        },
                        symbolSize: 8
                        // symbol: 'none',
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
        // 筛选器 提供条件 最后输出只有key为属性的数组选项
        // options提供所有数组  relationshipObj模拟选择器父子关系  key是要获取的选择器选项  optionName操作的数组名
        filterFun(options = [], relationshipObj = {}, key = '', optionName = '') {

        },
        //处理数
        handleNum(type, val) {
            if(type === 'percent') {
                return (val * 100).toFixed(2) + '%'
            }
            else if(type === 'tenThousand') {
                return (val / 10000).toFixed(1).toLocaleString() + '万'
            }
            else if(type === 'round') {
                return val.toFixed(0)
            }
        }
    }
}