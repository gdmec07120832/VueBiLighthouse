<template>
  <div ref="chart"></div>
</template>

<script>
import * as echarts from 'echarts5/core'
import { GridComponent, LegendComponent } from 'echarts5/components'
import { GaugeChart, BarChart } from 'echarts5/charts'
import { CanvasRenderer } from 'echarts5/renderers'

echarts.use([
  GridComponent,
  BarChart,
  GaugeChart, LegendComponent, CanvasRenderer
])
export default {
  name: 'EchartsGauge',
  props: {
    value: [Number, String]
  },
  data() {
    return {}
  },
  watch: {
    value(val) {
      this.chartInstance.setOption({
        series: [
          {
            data: [
              { value: val || 0 }
            ],
            progress: {
              itemStyle: {
                color: val < 100 ? '#0EE4F9' : {
                  colorStops: [
                    {
                      offset: 0,
                      color: '#0EE4F9'
                    },
                    {
                      offset: 1,
                      color: '#FA6603'
                    }
                  ]
                }
              }
            }
          },
        ],
      })
    }
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
        series: [
          {
            type: 'gauge',
            center: ['50%', '60%'],
            radius: '80%',
            min: 0,
            max: 100,
            startAngle: 225,
            endAngle: -45,
            axisLine: {
              lineStyle: {
                width: 7,
                color: [[1, '#6162a5']]
              },
              roundCap: true
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: false
            },
            splitLine: {
              show: false
            },
            progress: {
              show: true,
              width: 7,
              roundCap: true
            },
            pointer: {
              show: false
            },
            anchor: {
              show: false
            },
            data: [
              {
                value: this.value || 0
              }
            ],
            detail: {
              color: '#fff',
              fontSize: 15,
              fontWeight: 'normal',
              offsetCenter: [0, '10%'],
              formatter: v => v + '%'
            }
          }
        ]
      })
    }
  }
}
</script>

<style scoped>

</style>