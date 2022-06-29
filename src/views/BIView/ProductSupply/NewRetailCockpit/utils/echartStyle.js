import graphic from 'echarts/lib/util/graphic'

const echartStyle = {
    thisYear: '#5C8FF9',
    lastYear: '#9AC5FF',
    previousYear: '#e7e7e7',

    type1: '#5C8FF9',
    type2: '#6DC8EC',
    type3: '#FF9D4D',

    splitLine: '#f7f7f7',
    axisLabel: '#adadad',
    legendLine: {
        itemWidth: 16,
        itemHeight: 2
    },
    legendRect: {
        itemWidth: 12,
        itemHeight: 12
    },
    areaStyle: [
        // thisYear
        {
            color: new graphic.LinearGradient(0, 0, 0, 1, [
                {
                    offset: 0,
                    color: 'rgba(92, 143, 249, 0.6)'
                },
                {
                    offset: 1,
                    color: 'rgba(92, 143, 249, 0.1)'
                }
            ])
        },
        // previousYear
        {
            color: new graphic.LinearGradient(0, 0, 0, 1, [
                {
                    offset: 0,
                    color: 'rgba(231, 231, 231, 0.6)'
                },
                {
                    offset: 1,
                    color: 'rgba(231, 231, 231, 0.1)'
                }
            ])
        },
    ]
}
export default echartStyle