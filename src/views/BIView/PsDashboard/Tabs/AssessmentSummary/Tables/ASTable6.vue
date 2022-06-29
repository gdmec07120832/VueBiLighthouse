<template>
  <table class="dashboard-common-table">
    <tr>
      <td>年月</td>
      <td>累计SKU均值</td>
      <td>当期SKU均值</td>
      <td v-for="item in months" :key="item">{{ item + '月' }}</td>
    </tr>
    <tr>
      <td @mouseenter="mouseenter(0, 0,null)"
        :style="{background:(curCol === 0) || (curRow === 0) ? hoverColor : null,}"
      >同增</td>
      <td @mouseenter="mouseenter(0, 1,null)"
        :style="{background:(curCol === 0) || (curRow === 1) ? hoverColor : null,}"
        :class="{
        'text-red': getYearTotal(year) > getYearTotal(year - 1),
        'text-green': getYearTotal(year) < getYearTotal(year - 1),
      }">
        {{
          formatRto((getYearTotal(year) / getYearTotal(year - 1)) - 1)
        }}
      </td>
      <td @mouseenter="mouseenter(0, 2,null)"
        :style="{background:(curCol === 0) || (curRow === 2) ? hoverColor : null,}"
        :class="{
        'text-red': getCurTotal(year) > getCurTotal(year - 1),
        'text-green': getCurTotal(year) < getCurTotal(year - 1),
      }">
        {{
          formatRto((getCurTotal(year) / getCurTotal(year - 1)) - 1)
        }}
      </td>
      <td @mouseenter="mouseenter(0, (m+'月'),null)"
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
      <td @mouseenter="mouseenter(1, 1,null)"
        :style="{background:(curCol === 1) || (curRow === 1) ? hoverColor : null,}"
      >
        {{
          formatZ(getYearTotal(year))
        }}
      </td>
      <td @mouseenter="mouseenter(1, 2,null)"
        :style="{background:(curCol === 1) || (curRow === 2) ? hoverColor : null,}"
      >
        {{
          formatZ(getCurTotal(year))
        }}
      </td>
      <td @mouseenter="mouseenter(1, (m+'月'),null)"
        :style="{background:(curCol === 1) || (curRow === (m+'月')) ? hoverColor : null,}"
        v-for="m in months" :key="m">
        {{
          formatZ(
              ((yearMonthValues[year] || [])[m - 1] || {})['SKU_AVG_AMT']
          )
        }}
      </td>
    </tr>
    <tr>
      <td @mouseenter="mouseenter(2, 0,null)"
        :style="{background:(curCol === 2) || (curRow === 0) ? hoverColor : null,}"
      >{{ year - 1 }}年</td>
      <td @mouseenter="mouseenter(2, 1,null)"
        :style="{background:(curCol === 2) || (curRow === 1) ? hoverColor : null,}"
      >
        {{
          formatZ(getYearTotal(year - 1))
        }}
      </td>
      <td @mouseenter="mouseenter(2, 2,null)"
        :style="{background:(curCol === 2) || (curRow === 2) ? hoverColor : null,}"
      >
        {{
          formatZ(getCurTotal(year - 1))
        }}
      </td>
      <td @mouseenter="mouseenter(2, (m+'月'),null)"
        :style="{background:(curCol === 2) || (curRow === (m+'月')) ? hoverColor : null,}"
        v-for="m in months" :key="m">
        {{
          formatZ(
              ((yearMonthValues[year - 1] || [])[m - 1] || {})['SKU_AVG_AMT']
          )
        }}
      </td>
    </tr>
  </table>
</template>

<script>
import mixin from '@/views/BIView/PsDashboard/Tabs/AssessmentSummary/Tables/mixin'

export default {
  name: 'ASTable6',
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
      const a = this.yearMonthValues[year]?.[m]?.['SKU_AVG_AMT']
      const b = this.yearMonthValues[year - 1]?.[m]?.['SKU_AVG_AMT']
      return (a && b) ? (a / b) - 1 : null
    },
    getYearTotal (year) {
      const arr = this.yearMonthValues[year] || []
      const a = arr.reduce((acc, cur) => {
        return acc + (cur['DLVR_AMT'] || 0)
      }, 0)
      const b = arr.reduce((acc, cur) => {
        return acc + (cur['DLVR_QTY'] || 0)
      }, 0)
      return a && b ? a / b : null
    },
    getCurTotal (year) {
      const arr = (this.yearMonthValues[year] || []).slice(0, this.month + 1)
      const a = arr.reduce((acc, cur) => {
        return acc + (cur['DLVR_AMT'] || 0)
      }, 0)
      const b = arr.reduce((acc, cur) => {
        return acc + (cur['DLVR_QTY'] || 0)
      }, 0)
      return a && b ? a / b : null
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
