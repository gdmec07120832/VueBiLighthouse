<template>
  <div class="kpiDesc">
    <div style="height: 40px; padding: 0 35px" class="flex-start">
      <DropdownSelect label="分类" style="margin-right: 60px">
        <div slot="selectedText" style="width: 120px;" class="text-xs text-ellipsis px20">
          {{ query.className.toString() }}
        </div>
        <a-checkbox-group v-model="query.className">
          <div v-for="item in classOptions" :key="item">
            <a-checkbox :value="item">
              {{ item }}
            </a-checkbox>
          </div>
        </a-checkbox-group>

      </DropdownSelect>

      <DropdownSelect label="名称">
        <div slot="selectedText" style="width: 200px;" class="text-ellipsis text-xs px20">
          {{ query.name.toString() }}
        </div>
        <div style="max-height: 300px; width: 210px; overflow: auto">
          <a-checkbox-group v-model="query.name" style="display: flex; flex-wrap: wrap">
            <div v-for="item in filteredNameOptions" :key="item" style="width: 105px">
              <a-checkbox :value="item">{{ item }}</a-checkbox>
            </div>
          </a-checkbox-group>
        </div>
      </DropdownSelect>
    </div>
    <table class="desc-table">
      <tr>
        <th width="100">分类</th>
        <th width="80">序号</th>
        <th style="text-align: left" width="10%">名称</th>
        <th style="text-align: left" width="15%">名称定义</th>
        <th style="text-align: left" width="20%">计算公式</th>
        <th style="text-align: left">逻辑说明</th>
      </tr>
    </table>
    <div style="height: calc(100% - 85px); overflow-y: auto">
      <table class="desc-table">
        <tr class="fake-row" style="line-height: 0; opacity: 0; border: 0">
          <th width="100">分类</th>
          <th width="80">序号</th>
          <th width="10%">名称</th>
          <th width="15%">名称定义</th>
          <th width="20%">计算公式</th>
          <th>逻辑说明</th>
        </tr>
        <tr v-for="(row, index) in resultData" :key="index">
          <td v-if="resultUniqIndex.includes(index)"
              :rowspan="rowspan[resultUniqIndex.indexOf(index)]"
          >{{ row.CLASS }}
          </td>
          <td>{{ row['KPI_NO'] }}</td>
          <td align="left">{{ row['KPI_NAME'] }}</td>
          <td align="left">{{ row['KPI_DESC'] }}</td>
          <td align="left" style="white-space: pre-wrap" v-html="row['FORMULA']"></td>
          <td align="left" style="white-space: pre-wrap" v-html="row['KPI_RAMK']"></td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import DropdownSelect from '@/views/BIView/components/DropdownSelect/DropdownSelect'
import uniq from 'lodash/uniq'
import { groupBy } from 'lodash'

export default {
  name: 'KpiDesc',
  components: { DropdownSelect },
  data () {
    return {
      query: {
        className: [],
        name: []
      },
      classOptions: [],
      nameOptions: [],
      resultData: [],
      resultUniqIndex: [],
      rowspan: []
    }
  },
  computed: {
    filteredNameOptions () {
      if (!this.query.className.length) {
        return this.nameOptions.map(_ => _['name'])
      } else {
        return (this.nameOptions.filter(_ => {
          return this.query.className.indexOf(_['className']) > -1
        })).map(_ => _['name'])
      }
    }
  },
  watch: {
    'filteredNameOptions' (v) {
      this.query.name = this.query.name.filter(_ => v.indexOf(_) > -1)
    },
    'query.name' () {
      this.parseData1(this.allData)
    },
    'query.className' () {
      this.parseData1(this.allData)
    }
  },
  mounted () {
    this.getData1()
  },
  methods: {
    getData1 () {
      this.$fetchSql('pds_cockpit', 'tb_pds_kpi_desc').then(({ data }) => {
        this.classOptions = uniq(data.map(_ => _['CLASS']))
        this.nameOptions = data.map(_ => {
          return {
            name: _['KPI_NAME'],
            className: _['CLASS']
          }
        })
        this.allData = data
        this.parseData1(this.allData)
      })
    },
    parseData1 (allData) {
      const grouped = (groupBy(allData, 'CLASS'))
      const _allData = Object.keys(grouped).reduce((acc, cur) => {
        acc = acc.concat(grouped[cur].sort((a, b) => a['KPI_NO'] - b['KPI_NO']))
        return acc
      }, [])
      this.resultData = _allData.filter(_ => {
        return this.query.className.length ? this.query.className.indexOf(_['CLASS']) > -1 : true
      }).filter(_ => {
        return this.query.name.length ? this.query.name.indexOf(_['KPI_NAME']) > -1 : true
      })
      console.log(this.resultData)

      let indexes = []
      let lastname = ''
      for (let key = 0; key < this.resultData.length; key++) {
        if (this.resultData[key]['CLASS'] !== lastname) {
          indexes.push(key)
          lastname = this.resultData[key]['CLASS']
        }
      }

      this.resultUniqIndex = indexes
      let rowspan = []
      if (indexes.length > 1) {
        for (let i = 1; i < indexes.length; i++) {
          rowspan.push(indexes[i] - indexes[i - 1])
        }
      }
      rowspan.push(this.resultData.length - indexes[indexes.length - 1])
      this.rowspan = rowspan
      console.log(indexes, rowspan)
    }
  }
}
</script>

<style lang="scss" scoped>
.kpiDesc {
  height: calc(var(--height) * 1px);
}

.desc-table {
  width: 100%;
  text-align: center;
  table-layout: fixed;

  tr:not(.fake-row) {
    th {
      padding: 11px 20px;
      color: #808492;
      font-weight: 400;
    }

    //border-bottom: 3px solid #666;
  }

  tr {
    border-bottom: 1px solid #e7e9f0;

    td {
      padding: 11px 20px;
      line-height: 16px;
      min-height: 36px;
      font-size: 12px;
      color: #999;
    }
  }
}
</style>
