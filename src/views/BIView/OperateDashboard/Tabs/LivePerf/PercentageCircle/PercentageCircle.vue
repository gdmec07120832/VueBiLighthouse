<template>
  <div style="width: 100%; height: 100%" ref="chart">
    <v-chart v-if="percent" :options="options" autoresize :key="key"></v-chart>
    <v-chart v-else :options="optionZ" autoresize :key="key+1"></v-chart>
  </div>
</template>

<script>
import deepmerge from 'deepmerge'
import graphic from 'echarts/lib/util/graphic'

let key = 1
export default {
  name: 'PercentageCircle',
  props: {
    percent: {
      type: [Number, Boolean],
      default: 0
    }
  },
  data () {
    return {
      key: key++,
      options: {
        grid: {
          left: 'center',
          top: 'center'
        },
        title: {
          text: '',
          subtext: '达成',
          textStyle: {
            color: 'rgba(0, 0, 0, .65)',
            fontSize: 16
          },
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
      },
      optionZ: {
        grid: {
          left: 'center',
          top: 'center'
        },
        title: {
          text: '0%',
          textStyle: {
            color: 'rgba(0, 0, 0, .65)',
            fontSize: 12
          },
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
                  color: new graphic.LinearGradient(1, 0, 0, 0, [{
                    offset: 0,
                    color: '#6bbbfa'
                  }, {
                    offset: 1,
                    color: '#1562e6'
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
            data: [{
              value: 100,
              itemStyle: {
                color: '#e2e2e2',
              }
            }],
            coordinateSystem: 'polar',
            silent: true,
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
    percent: {
      handler (val) {
        this.options.title.text = val + '%'
        this.options.series[0].data[0].value = val
      },
      immediate: true
    }
  },
  methods: {
    deepmerge
  },
  created () {
  }
}
</script>

<style lang="scss" scoped>
</style>
