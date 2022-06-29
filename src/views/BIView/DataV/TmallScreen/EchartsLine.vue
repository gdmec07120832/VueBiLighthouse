<template>
  <div ref="chart" />
</template>

<script>
import numeral from 'numeral'
import * as echarts from 'echarts5/lib/echarts'
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts5/components'
import { LineChart } from 'echarts5/charts'

echarts.use([
  GridComponent, TooltipComponent,
  LineChart, LegendComponent
])
export default {
  name: 'EchartsLine',
  props: {

  },
  mounted() {
    this.initCharts()
    const handleResize = () => {
      this?.chartInstance?.resize()
    }
    window.addEventListener('resize', handleResize)
    this.$on('hook:beforeDestroy', () => {
      window.removeEventListener('resize', handleResize)
    })
  },
  methods: {
    initCharts() {
      const instance = echarts.init(this.$refs.chart)
      this.chartInstance = instance
      instance.setOption({
        tooltip: {
          show: true,
          trigger: 'axis',
        },
        legend: {
          icon: 'rect',
          itemHeight: 4,
          itemWidth: 16,
          top: 10,
          right: 0,
          textStyle: {
            color: '#fff'
          }
        },
        grid: {
          top: 50,
          right: 10,
          bottom: 10,
          left: 10,
          containLabel: true
        },
        xAxis: {
          data: [],
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#fff'
          },
          axisLine: {
            lineStyle: {
              color: '#2a49b160'
            }
          }
        },
        yAxis: {
          splitNumber: 4,
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: 'rgba(128,128,128,.3)'
            }
          },
          axisLabel: {
            color: '#fff',
            formatter: v => v ? numeral(v / 10000).format('0.[00]') + '万' : 0
          },
          axisLine: {
            lineStyle: {
              color: '#2a49b160'
            }
          }
        },
        series: [
          {
            type: 'line',
            name: '实际',
            z: 10,
            symbol: 'none',
            itemStyle: {
              color: '#34D2FF'
            },
            smooth: true,

            data: []
          },
          {
            type: 'line',
            name: '目标',
            symbol: 'none',
            itemStyle: {
              color: '#929292'
            },
            smooth: true,
            data: []
          }
        ]
      })
    },
    setOption(option) {
      this.chartInstance.setOption(option)
    },
  }
}
</script>

<style scoped>

</style>