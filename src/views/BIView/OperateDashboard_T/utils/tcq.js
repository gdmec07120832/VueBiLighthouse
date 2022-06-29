export const HandleNum = (Type, val) => {
    if (val === null || val === undefined || (!val && val !== 0) || val == 'NaN' || val == '--' || val == 0) return '--'
    if (Type === 'percent') {
        return (val * 100).toFixed(2) + '%'
    } else if (Type === 'percent1') {
        return (val * 100).toFixed(1) + '%'
    } else if (Type === 'tenThousand') {
        return (val / 10000).toFixed(1).toLocaleString() + '万'
    } else if (Type === 'tenThousand2') {
        return (val / 10000).toFixed(0).toLocaleString() + '万'
    } else if (Type === 'HundredMillion') {
        return (val / 10000 / 10000).toFixed(2).toLocaleString() + '亿'
    } else if (Type === 'round') {
        return ((val * 1).toFixed(0) * 1).toLocaleString()
    } else if (Type === 'Null') {
        return val
    }

}

export const ChartData = () => {

    return {
        tooltip: {
            backgroundColor: '#fff',
            trigger: 'axis',
            extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
            textStyle: {
                color: '#333',
                fontSize: 12
            },
            formatter: null,
        },
        grid: {
            left: '0%',
            right: '0%',
            bottom: 0,
            top: 0,
            containLabel: true
        },
        xAxis: [{
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
                formatter: null,
            }
        }],
        yAxis: [{
                type: 'value',
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                axisLabel: {

                    formatter: null,
                },
                splitLine: {
                    lineStyle: {
                        color: 'rgba(234,234,234,0.5)',
                        type: 'dashed'
                    },
                },
                splitNumber: '3',
        },

        ],
        series: [{
                name: '',
                type: 'bar',
                barWidth: '20',
                data: [],
                itemStyle: {
                    normal: {
                        color: function (params) {
                            let color = ['#00a854', '#ff5953', '#5b8ff9']
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
                    position: 'top',
                    fontSize: 12,
                    color: 'rgba(0, 0, 0, 0.88)',
                    formatter:null
                },
                areaStyle: {
                    opacity:0,
                    color:null,
                },
                z: 2,
                smooth: true,
                symbol: 'none',
            },
            {
                name: '',
                type: 'line',
                barWidth: '20',
                data: [],
                itemStyle: {
                    color: '#e7e7e7',
                },
                label: {
                    show: false,
                    position: 'top',
                    fontSize: 12,
                    color: 'rgba(0, 0, 0, 0.88)',
                    formatter:null
                },
                z: 1,
                areaStyle: {
                    color: null,
                    opacity: 0
                },
                smooth: true,
                lineStyle: {
                    color: '#e7e7e7'
                },
                symbol: 'none',
            },
        ]
    }

}