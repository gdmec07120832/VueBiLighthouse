<template>
  <div style="position: relative">
    <y-loading :loading.sync="loading" @cancelLoading="cancelExport"></y-loading>
    <top-toolbar @contextMenuClick="handleContextMenuClick" />
    <div style="background-color: #f5faff; min-height: 100vh; height: 100vh; overflow-y: auto; padding: 0 2%">
      <div class="px10 py10" style="margin: auto">
        <div style="font-size: 26px; padding-top: 20px">项目组发货日报</div>
        <div style="line-height: 24px" class="sub-tip">
          备注：【1】数据统计时间未订单发货时间；【2】报表更新未T+1,数据截止到昨天；【3】业绩剔除开店前第一批采购，补样业绩加回到当店
        </div>
        <div style="background-color: #fff; border-radius: 2px; margin-top: 10px">
          <div class="flex flex-between mx20 py15" style="border-bottom: 1px solid #f0f0f0">
            <div style="font-weight: bold; font-size: 16px">发货业绩日明细</div>
            <div style="width: 170px; font-size: 12px; text-align: right" class="flex flex-start">
              <span style="margin-right: 10px; color: #999">发货年月</span>
              <ez-month-select v-model="query.yearMonth" style="flex: 1">
                <div
                  style="
                    cursor: pointer;
                    color: rgba(0, 0, 0, 0.15);
                    position: relative;
                    height: 32px;
                    line-height: 32px;
                    border-radius: 2px;
                    border: 1px solid rgba(0, 0, 0, 0.15);
                  "
                >
                  <div style="position: absolute; left: 0; top: 0; line-height: 32px; padding: 0 10px">
                    <a-icon type="calendar" style="transform: scaleX(1.2)" />
                  </div>
                  <div style="text-align: center; color: rgba(0, 0, 0, 0.65)">
                    {{ `${query.yearMonth.getFullYear()}-${('0' + (query.yearMonth.getMonth() + 1)).slice(-2)}` }}
                  </div>
                  <div style="position: absolute; right: 0; top: 0; line-height: 32px; padding: 0 10px">
                    <a-icon type="down" style="transform: scaleX(1.2)" />
                  </div>
                </div>
              </ez-month-select>
            </div>
          </div>
          <div class="px20 pt10">
            <div class="flex flex-start" style="align-items: flex-start">
              <div style="width: 65px; font-size: 12px; text-align: left; margin-right: 10px; color: #999">
                渠道细分:
              </div>
              <div class="text-xs-checkbox">
                <a-checkbox-group v-model="query.channel">
                  <div v-for="item in queryOptions.channel" :key="item">
                    <a-checkbox :value="item">{{ item }}</a-checkbox>
                  </div>
                </a-checkbox-group>
              </div>
            </div>
            <div class="flex flex-start mt10" style="align-items: flex-start">
              <div style="width: 65px; font-size: 12px; text-align: left; margin-right: 10px; color: #999">项目组:</div>
              <div class="text-xs-checkbox">
                <a-checkbox-group v-model="query.team">
                  <div v-for="item in queryOptions.team" :key="item">
                    <a-checkbox :value="item">{{ item }}</a-checkbox>
                  </div>
                </a-checkbox-group>
              </div>
            </div>
          </div>
          <div class="px20 pt20" style="min-height: 320px">
            <div class="flex flex-end">
              <div class="text-xs-radio">
                <a-radio-group v-model="query.dateType">
                  <a-radio-button value="1">1-15日</a-radio-button>
                  <a-radio-button value="2">16-31日</a-radio-button>
                  <a-radio-button value="3">1-31日</a-radio-button>
                </a-radio-group>
              </div>
              <div
                style="
                  display: inline-block;
                  line-height: 32px;
                  border-radius: 2px;
                  margin-left: 10px;
                  border: 1px solid rgba(0, 0, 0, 0.15);
                  padding: 0 8px;
                  cursor: pointer;
                  font-size: 12px;
                "
                @click="handleContextMenuClick('downloadExcel')"
              >
                导出Excel
              </div>
            </div>

            <div ref="table" class="flex flex-start mt10" style="align-items: flex-start">
              <div>
                <table class="table" style="table-layout: fixed; font-size: 12px; text-align: right">
                  <thead>
                    <tr class="rowBg">
                      <td width="80" style="text-align: left">项目组</td>
                      <td width="80" style="text-align: right">累计业绩</td>
                      <td width="100" style="text-align: right">同期累计业绩</td>
                      <td width="80" style="text-align: right">同比</td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style="font-weight: bold">
                      <td style="text-align: left">汇总</td>
                      <td>{{ numGroupSep(allDataTotal['SEND_AMT'] && Math.round(allDataTotal['SEND_AMT'])) }}</td>
                      <td>{{ numGroupSep(allDataTotal['AGO_AMT'] && Math.round(allDataTotal['AGO_AMT'])) }}</td>
                      <td :class="{ 'text-red': allDataTotal['RATE'] > 0, 'text-green': teamDataTotal['RATE'] < 0 }">
                        {{ allDataTotal['RATE'] && (allDataTotal['RATE'] * 100).toFixed(2) + '%' }}
                      </td>
                    </tr>
                    <tr v-for="(team, index) in teamsData" :key="team.name" :class="{ rowBg: index % 2 === 0 }">
                      <td style="text-align: left">{{ team.name }}</td>
                      <td>
                        {{ numGroupSep(teamDataTotal[team.name] && Math.round(teamDataTotal[team.name]['SEND_AMT'])) }}
                      </td>
                      <td>
                        {{ numGroupSep(teamDataTotal[team.name] && Math.round(teamDataTotal[team.name]['AGO_AMT'])) }}
                      </td>
                      <td
                        :class="{
                          'text-red': teamDataTotal[team.name] && teamDataTotal[team.name]['RATE'] > 0,
                          'text-green': teamDataTotal[team.name] && teamDataTotal[team.name]['RATE'] < 0,
                        }"
                      >
                        {{ teamDataTotal[team.name] && (teamDataTotal[team.name]['RATE'] * 100).toFixed(2) + '%' }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div style="flex: 1; overflow: auto">
                <table class="table" style="table-layout: fixed; font-size: 12px; text-align: right">
                  <thead>
                    <tr class="rowBg">
                      <td style="min-width: 80px; width: 1%" v-for="date in tableDates" :key="date">
                        {{ moment(date).format('MM月DD日') }}
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style="font-weight: bold">
                      <td v-for="date in tableDates" :key="date">
                        {{ dateDataTotal[date] && numGroupSep(Math.round(dateDataTotal[date]['SEND_AMT'])) }}
                      </td>
                    </tr>
                    <tr v-for="(team, index) in teamsData" :key="team.name" :class="{ rowBg: index % 2 === 0 }">
                      <td v-for="date in tableDates" :key="date">
                        {{ team.data[date] ? numGroupSep(Math.round(team.data[date]['SEND_AMT'])) : '--' }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div style="background-color: #fff; border-radius: 2px; margin-top: 20px">
          <div class="flex flex-between mx20 py15" style="border-bottom: 1px solid #f0f0f0">
            <div style="font-weight: bold; font-size: 16px">发货业绩日趋势</div>
          </div>
          <div style="height: 300px; margin: 0 20px">
            <v-chart ref="chart" autoresize :options="chartOptions"></v-chart>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

import { array2HashMapByKey, formatNumber, numGroupSep, htmlWrapper } from '@/utils/helper'
import EzMonthSelect from '@/views/BIView/OperateDashboard/components/EzMonthSelect'
import YLoading from '@/views/BIView/components/YLoading/YLoading'
import TopToolbar from '@/views/BIView/components/TopToolbar/TopToolbar'

export default {
  name: 'TeamShipDaily',
  components: { TopToolbar, YLoading, EzMonthSelect },
  data() {
    let defaultDate = moment()
    if(defaultDate.date() === 1) {
      defaultDate = moment().subtract(1, 'month')
    }

    return {
      loading: false,
      queryOptions: {
        channel: [],
        team: [],
      },
      query: {
        channel: [],
        team: [],
        yearMonth: defaultDate.toDate(),
        dateType: '3',
      },
      chartOptions: {
        tooltip: {
          confine: true,
          backgroundColor: '#fff',
          trigger: 'item',
          extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
          textStyle: {
            color: '#333',
            fontSize: 12,
          },
          formatter: (params) => {
            return `日: ${params.name}<br>项目组: ${params.seriesName}<br>发货业绩: ${params.data}`
          },
        },
        legend: {
          selectedMode: false,
          icon: 'rect',
          itemWidth: 12,
          itemHeight: 12,
          top: 15,
          left: 0,
        },
        grid: {
          left: 10,
          right: 10,
          top: 80,
          bottom: 10,
          containLabel: true,
        },
        xAxis: {
          axisLabel: {
            show: true,
            color: '#999',
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          data: [],
        },
        yAxis: {
          axisLine: {
            show: false,
          },
          axisLabel: {
            color: '#999',
            formatter(val) {
              return formatNumber(val, 100000000) + '亿'
            },
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            lineStyle: {
              type: 'solid',
              color: ['rgba(0, 0, 0, .05)'],
            },
          },
        },
        series: [],
      },
      teamsData: [],
      tableDates: [],
      teamDataTotal: {},
      dateDataTotal: {},
      allDataTotal: {},
    }
  },
  watch: {
    'query.yearMonth'() {
      this.getData1()
    },
    'query.team'() {
      this.parseData1(this.allData)
    },
    'query.channel'() {
      this.parseData1(this.allData)
    },
    'query.dateType'() {
      this.parseData2(this.filteredData)
    },
  },
  created() {
    this.getData1()
  },
  methods: {
    moment,
    numGroupSep,
    getData1() {
      this.$fetchSql('spl_dlvr', 'dly_spl_chnl', {
        MDATE: moment(this.query.yearMonth).format('YYYYMM'),
      }).then(({ data }) => {
        this.queryOptions.channel = Array.from(new Set(data.map((_) => _['SHOP_TYPE'])))
        this.queryOptions.team = Array.from(new Set(data.map((_) => _['TEAM_SUPPLY'])))
        const colors = [
          '#5b8ff9',
          '#b9d0ff',
          '#2ebfbe',
          '#89e2da',
          '#6d88b6',
          '#98b4d8',
          '#f6bd16',
          '#ffe7a2',
          '#fd84b6',
          '#fdc9df',
          '#6dc8ec',
          '#bcecff',
          '#a466cf',
          '#ff9845',
        ]
        const colorsMap = {}
        this.queryOptions.team.forEach((t, index) => {
          colorsMap[t] = colors[index]
        })
        this.colorsMap = colorsMap
        this.allData = data
        this.parseData1(data)
      })
    },
    parseData1(data) {
      const filterTeam = data.filter((item) => {
        return !this.query.team || !this.query.team.length ? true : this.query.team.indexOf(item['TEAM_SUPPLY']) > -1
      })
      const filterTeamAndChannel = filterTeam.filter((item) => {
        return !this.query.channel || !this.query.channel.length
          ? true
          : this.query.channel.indexOf(item['SHOP_TYPE']) > -1
      })
      this.filteredData = filterTeamAndChannel
      this.parseData2(filterTeamAndChannel)
      this.dateArr = Array.from(new Set(filterTeam.map((_) => _['TDATE'])))
        .map((_) => moment(_).format('YYYY-MM-DD'))
        .sort((a, b) => {
          return moment(a) - moment(b)
        })
      this.chartOptions.xAxis.data = this.dateArr.map((_) => moment(_).format('DD日'))
      const allTeamData = array2HashMapByKey(filterTeamAndChannel, 'TEAM_SUPPLY')
      const series = []
      Object.keys(allTeamData).forEach((team) => {
        const thisTeamData = allTeamData[team]
        const thisTeamDataByDate = array2HashMapByKey(
          thisTeamData.map((_) => ({
            ..._,
            _TDATE: moment(_['TDATE']).format('YYYY-MM-DD'),
          })),
          '_TDATE'
        )
        const data = this.dateArr.map((date) => {
          const dataArr = thisTeamDataByDate[date]
          if (dataArr) {
            return dataArr.reduce((acc, cur) => {
              return acc + cur['SEND_AMT']
            }, 0)
          } else {
            return 0
          }
        })
        series.push({
          name: team,
          itemStyle: {
            color: this.colorsMap[team],
          },
          type: 'bar',
          barWidth: '25%',
          stack: true,
          data: data.map((_) => Math.round(_ * 100) / 100),
        })
      })
      if (series.length) {
        series[series.length - 1].label = {
          show: true,
          color: 'rgba(0, 0, 0, .64)',
          position: 'top',
          formatter: (params) => {
            const val = series.reduce((acc, cur) => {
              return acc + cur.data[params.dataIndex]
            }, 0)
            return formatNumber(val, 100000000, 2) + '亿'
          },
        }
      }
      this.$refs['chart'].$refs['echarts'].clear()
      console.log(series)
      this.chartOptions.series = series
    },
    parseData2(filteredData) {
      let _filteredData = filteredData.map((_) => ({
        ..._,
        _TDATE: moment(_['TDATE']).format('YYYY-MM-DD'),
      }))

      if (this.query.dateType === '1') {
        _filteredData = _filteredData.filter((_) => {
          return moment(_['TDATE']).format('D') < 16
        })
      } else if (this.query.dateType === '2') {
        _filteredData = _filteredData.filter((_) => {
          return moment(_['TDATE']).format('D') > 15
        })
      }

      const teamData = array2HashMapByKey(_filteredData, 'TEAM_SUPPLY')

      const teamDataTotal = Object.keys(teamData).reduce((acc, cur) => {
        acc[cur] = teamData[cur].reduce(
          (_acc, _cur) => {
            return {
              SEND_AMT: _acc['SEND_AMT'] + _cur['SEND_AMT'],
              AGO_AMT: _acc['AGO_AMT'] + _cur['AGO_AMT'],
            }
          },
          {
            SEND_AMT: 0,
            AGO_AMT: 0,
          }
        )
        acc[cur]['RATE'] = acc[cur]['AGO_AMT'] ? (acc[cur]['SEND_AMT'] - acc[cur]['AGO_AMT']) / acc[cur]['AGO_AMT'] : 0
        return acc
      }, {})

      this.teamDataTotal = teamDataTotal
      const dateDataMap = array2HashMapByKey(_filteredData, '_TDATE')
      const dateDataTotal = Object.keys(dateDataMap).reduce((acc, cur) => {
        acc[cur] = dateDataMap[cur].reduce(
          (_acc, _cur) => {
            return {
              SEND_AMT: _acc['SEND_AMT'] + _cur['SEND_AMT'],
              AGO_AMT: _acc['AGO_AMT'] + _cur['AGO_AMT'],
            }
          },
          {
            SEND_AMT: 0,
            AGO_AMT: 0,
          }
        )
        return acc
      }, {})
      this.dateDataTotal = dateDataTotal
      const dateData = Object.keys(dateDataMap).sort((a, b) => {
        return moment(a) - moment(b)
      })
      this.allDataTotal = Object.keys(dateDataTotal).reduce(
        (acc, cur) => {
          return {
            AGO_AMT: acc['AGO_AMT'] + dateDataTotal[cur]['AGO_AMT'],
            SEND_AMT: acc['SEND_AMT'] + dateDataTotal[cur]['SEND_AMT'],
          }
        },
        {
          AGO_AMT: 0,
          SEND_AMT: 0,
        }
      )
      this.allDataTotal['RATE'] = this.allDataTotal['AGO_AMT']
        ? (this.allDataTotal['SEND_AMT'] - this.allDataTotal['AGO_AMT']) / this.allDataTotal['AGO_AMT']
        : 0

      this.tableDates = dateData
      this.teamsData = Object.keys(teamData)
        .map((team) => {
          const data = array2HashMapByKey(teamData[team], '_TDATE')
          Object.keys(data).forEach((date) => {
            const dateDataArr = data[date]
            const ret = dateDataArr.reduce(
              (acc, cur) => {
                return {
                  AGO_AMT: acc['AGO_AMT'] + cur['AGO_AMT'],
                  SEND_AMT: acc['SEND_AMT'] + cur['SEND_AMT'],
                }
              },
              {
                AGO_AMT: 0,
                SEND_AMT: 0,
              }
            )
            data[date] = ret
          })
          return {
            name: team,
            data,
          }
        })
        .sort((a, b) => {
          return teamDataTotal[b.name]['SEND_AMT'] - teamDataTotal[a.name]['SEND_AMT']
        })
    },
    handleContextMenuClick(type) {
      if (type === 'downloadExcel') {
        let tables = this.$refs['table'].querySelectorAll('table')
        const rowsHtml = [].map
          .call(tables[0].rows, (_, index) => {
            const rowA = tables[0].rows[index]
            const rowB = tables[1].rows[index]
            const rowAHtml = rowA.innerHTML.replace(/(data-v-[^\s>]+)/g, '')
            const rowBHtml = rowB.innerHTML.replace(/(data-v-[^\s>]+)/g, '')
            return `<tr class="${index % 2 === 0 ? 'bg-gary' : 'bg-white'}">${rowAHtml}${rowBHtml}</tr>`
          })
          .join('')
        let html = `<table><tbody>${rowsHtml}</tbody></table>`
        const filteredDateMap = array2HashMapByKey(this.filteredData, 'TDATE')
        Object.keys(filteredDateMap).forEach((date) => {
          filteredDateMap[date] = array2HashMapByKey(filteredDateMap[date], 'TEAM_SUPPLY')
          Object.keys(filteredDateMap[date]).forEach((team) => {
            const dataArr = filteredDateMap[date][team]
            const value = dataArr.reduce((acc, cur) => acc + cur['SEND_AMT'], 0)
            filteredDateMap[date][team] = Math.round(value * 100) / 100
          })
        })
        const dataStr = Object.keys(filteredDateMap)
          .map((date) => {
            return Object.keys(filteredDateMap[date])
              .map((team) => {
                return `<tr><td>${moment(date).format('DD日')}</td><td>${team}</td><td>${
                  filteredDateMap[date][team]
                }</td></tr>`
              })
              .join('')
          })
          .join('')

        let html2 = `<table><tbody><tr><td>日</td><td>项目组</td><td>发货业绩</td></tr>${dataStr}</tbody></table>`
        let xml = htmlWrapper([html, html2], ['发货业绩日明细', '图表2'])

        const link = document.createElement('a')
        link.href = 'data:application/vnd.ms-excel;base64,' + window.btoa(unescape(encodeURIComponent(xml)))

        link.download = '发货业绩日明细.xls'
        link.target = '_blank'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    },
    cancelExport() {},
  },
}
</script>

<style scoped lang="scss">
.sub-tip {
  color: #999;
  font-size: 12px;
}

.dropdown-icon {
  display: inline-block;
  width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  background: #fff;
  box-shadow: rgba(10, 30, 51, 0.2) 0 0 5px 0;
  border-radius: 4px;

  &:hover {
    cursor: pointer;

    i {
      opacity: 0.5;
    }
  }
}

.text-xs-checkbox {
  flex: 1;

  /deep/ .ant-checkbox-group {
    width: 100%;

    > div {
      display: inline-block;
      overflow: hidden;
      width: calc(100% / 8);
      height: 26px;
    }
  }

  /deep/ .ant-checkbox-wrapper {
    white-space: nowrap;
    overflow: hidden;
    font-size: 12px;
    color: #999;
  }
}

.text-xs-radio /deep/ .ant-radio-wrapper span {
  font-size: 12px;
}

.table {
  td {
    line-height: 32px;
    height: 32px;
    padding: 0 6px;
    white-space: nowrap;
    overflow: hidden;
  }
}

.rowBg {
  background-color: #fafafa;
}
</style>
