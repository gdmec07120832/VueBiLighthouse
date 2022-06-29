<template>
  <table class="dashboard-common-table">
    <tr>
      <td>年月</td>
      <td v-for="item in months" :key="item">{{ item + '月' }}</td>
    </tr>
    <tr>
      <td @mouseenter="mouseenter(0, 0,null)"
        :style="{background:(curCol === 0) || (curRow === 0) ? hoverColor : null,}"
      >同增</td>
      <td  @mouseenter="mouseenter(0, (m+'月'),null)"
        :style="{background:(curCol === 0) || (curRow === (m+'月')) ? hoverColor : null,}"
        v-for="m in months" :key="m" :class="{
        'text-red':  calcYoy(year, m - 1) && calcYoy(year, m - 1) > 0,
        'text-green': calcYoy(year, m - 1) && calcYoy(year, m - 1) < 0
      }">
        {{
          formatRto(calcYoy(year, m - 1))
        }}
      </td>
    </tr>
    <tr>
      <td @mouseenter="mouseenter(1, 0,null)"
        :style="{background:(curCol === 1) || (curRow === 0) ? hoverColor : null,}"
      >{{ year }}年</td>
      <td @mouseenter="mouseenter(1, (m+'月'),null)"
        :style="{background:(curCol === 1) || (curRow === (m+'月')) ? hoverColor : null,}"
        v-for="m in months" :key="m">
        {{
          formatZ2(
              ((yearMonthValues[year] || [])[m - 1] || {})['TRNVR_RATE']
          )
        }}
      </td>
    </tr>
    <tr>
      <td @mouseenter="mouseenter(2, 0,null)"
        :style="{background:(curCol === 2) || (curRow === 0) ? hoverColor : null,}"
      >{{ year - 1 }}年</td>
      <td @mouseenter="mouseenter(2, (m+'月'),null)"
        :style="{background:(curCol === 2) || (curRow === (m+'月')) ? hoverColor : null,}"
        v-for="m in months" :key="m">
        {{
          formatZ2(
              ((yearMonthValues[year - 1] || [])[m - 1] || {})['TRNVR_RATE']
          )
        }}
      </td>
    </tr>
  </table>
</template>

<script>
import mixin from '@/views/BIView/PsDashboard/Tabs/AssessmentSummary/Tables/mixin'

export default {
  name: 'ASTable4',
  mixins: [mixin],
  props: {
    query: Object,
    yearMonthValues: Object
  },
  data(){
    return{
      hoverColor: 'rgba(135,206,250, 0.2)',
      curRow: null,
      curCol: null,
      curType:null,
    }
  },
  methods: {
    calcYoy (year, m) {
      const a = this.yearMonthValues[year]?.[m]?.['TRNVR_RATE']
      const b = this.yearMonthValues[year - 1]?.[m]?.['TRNVR_RATE']
      return (a && b) ? (a / b) - 1 : null
    },
    getYearTotal (year) {
      const arr = this.yearMonthValues[year] || []
      return arr.reduce((acc, cur) => {
        return acc + (cur['AVG_PURPRICE1'] || 0)
      }, 0)
    },
    getCurTotal (year) {
      const arr = (this.yearMonthValues[year] || []).slice(0, this.month + 1)
      return arr.reduce((acc, cur) => {
        return acc + (cur['AVG_PURPRICE1'] || 0)
      }, 0)
    },
    mouseenter(col, row,type) {
      this.curCol = col
      this.curRow = row
      this.curType = type
    }, 

  }
}
</script>

<style scoped>

</style>
