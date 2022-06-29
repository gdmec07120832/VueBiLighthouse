<template>
  <div style="height: 100%; width: 100%">
    <v-chart :autoresize="false" :options="options" ref="chart"/>
  </div>
</template>

<script>
import graphic from 'echarts/lib/util/graphic'

export default {
  name: 'CircleRate',
  props: {
    value: {
      default: 0,
      require: true,
      type: [String, Number]
    }
  },
  data () {
    return {
      currentValue: 0,
      options: {
        title: {
          text: '0%',
          textStyle: {
            fontWeight: 400,
            color: 'rgba(0, 0, 0, .65)',
            fontSize: 12
          },
          left: 'center',
          top: 'center'
        },
        grid: {
          left: 'center',
          top: 'center'
        },
        angleAxis: {
          max: 100,
          clockwise: true,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: false
          },
          splitLine: {
            show: false
          }
        },
        radiusAxis: {
          type: 'category',
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: false
          },
          splitLine: {
            show: false
          }
        },
        polar: {
          center: ['50%', '50%'],
          radius: '130%' //图形大小
        },
        series: [
          {
            type: 'bar',
            data: [{
              value: 0,
              itemStyle: {
                normal: {
                  color: new graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: '#1ac5fc'
                  }, {
                    offset: 1,
                    color: '#2680eb'
                  }])
                }
              },
            }],
            coordinateSystem: 'polar',
            roundCap: true,
            barWidth: '10%',
            barGap: '-100%', // 两环重叠
            z: 2,
          },
          { // 灰色环
            type: 'bar',
            silent: true,
            animation: false,
            data: [{
              value: 100,
              itemStyle: {
                color: '#dcdddd',
                shadowColor: 'rgba(0, 0, 0, 0.2)',
                shadowBlur: 2,
                shadowOffsetY: 1
              }
            }],
            coordinateSystem: 'polar',
            roundCap: true,
            barWidth: '10%',
            barGap: '-100%',
            z: 1
          }
        ]
      }
    }
  },
  watch: {
    value: {
      handler () {
        this.$refs.chart && this.$refs.chart.clear()
        this.currentValue = isNaN(Number(this.value)) ? 0 : (Number(this.value) * 100).toFixed(0)
        this.options.series[0].data[0].value = this.currentValue
        this.options.title.text = this.currentValue + '%'
      },
      immediate: true
    }
  },
  created () {

  },
  mounted () {
    const resizeChart = () => {
      this.$refs['chart']?.$refs['echarts']?.resize()
    }
    setTimeout(() => {
      resizeChart()
    }, 50)
    window.addEventListener('resize', resizeChart)
    this.$once('hook:beforeDestroy', () => {
      window.removeEventListener('resize', resizeChart)
    })
  },
}
</script>

<style scoped>

</style>
