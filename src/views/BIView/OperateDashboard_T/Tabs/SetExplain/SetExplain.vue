<template>
  <div style="margin: 0 -20px;" class="setExplain">
    <div class="px20" style="height: 100%">
      <div class="flex flex-start" style="width: 340px">
        <div style="height: 50px;font-size: 16px; font-weight: bold; line-height: 50px; margin-right: 20px">{{month}}</div>
        <div class="text-xs text-red">{{remark}}</div>
      </div>
      <div style="height: calc(100% - 55px);">
        <table class="desc-table">
          <thead>
          <tr>
            <th style="width: 120px; text-align: left">指标名称</th>
            <th style="width: 10%;">标杆值</th>
            <th style="width: 15%;">定标逻辑</th>
            <th style="text-align: left">指标口径</th>
          </tr>
          </thead>
        </table>
        <div style="height: calc(100% - 24px); overflow-y: auto" class="hoverScroll">
          <table class="desc-table">
            <thead style="opacity: 0; line-height: 0;">
            <tr>
              <th style="width: 120px; text-align: left;padding: 0">指标名称</th>
              <th style="width: 10%;padding: 0">标杆值</th>
              <th style="width: 15%;padding: 0">定标逻辑</th>
              <th style="text-align: left;padding: 0">指标口径</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, index) in tableData" :key="index">
              <td style="font-weight: bold; color: #333; text-align: left">
                {{item['KPI_NAME']}}
              </td>
              <td style="text-align: center">
                {{item['KPI_VALUES']}}
              </td>
              <td style="text-align: center">{{item['KPI_DESC']}}</td>
              <td style="text-align: left; white-space: pre-wrap" v-html="item['KPI_RAMK']"></td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SetExplain",
  data() {
    return {
      month: '',
      remark: '',
      tableData: []
    }
  },
  created () {
    this.getData1()
  },
  methods: {
    getData1() {
      this.$axios.post('/api/admin/data/kpi_report/kpi_describe/get').then(res => {
        const monthIndex = res.data.findIndex(item => item['KPI_NAME'] === '月份')
        const remarkIndex = res.data.findIndex(item => item['KPI_NAME'] === '备注')
        if(monthIndex > -1) {
          this.month = res.data[monthIndex]['KPI_VALUES']
        }
        if(remarkIndex > -1) {
          this.remark = res.data[remarkIndex]['KPI_VALUES']
        }
        this.tableData = res.data.filter((item, index) => {
          return index !== monthIndex && index !== remarkIndex
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.setExplain {
  height: calc(var(--height) * 1px);
}

.desc-table {
  width: 100%;
  text-align: center;
  thead tr {
    th {
      color: #808492;
      font-weight: 400;
    }
    //border-bottom: 3px solid #666;
  }
  tr {
    border-bottom: 1px solid #e7e9f0;
    td {
      padding: 11px 0;
      line-height: 16px;
      min-height: 36px;
      font-size: 12px;
      color: #999;
    }
  }
}

.hoverScroll {
  &::-webkit-scrollbar-thumb {
    background-color: transparent;
  }
  &:hover {
    &::-webkit-scrollbar-thumb {
      background-color: #d1d1d1;
    }
  }
}
</style>
