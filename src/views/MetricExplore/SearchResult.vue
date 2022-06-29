<template>
  <transition name="swing-in-top-fwd">
    <div v-if="show" class="searchResultWrapper">
      <div class="searchResult">
        <div class="leftSide">
          <div class="flex-between" style="padding: 0 12px">
            <span>筛选</span>
            <span class="resetButton" @click="handleReset">重置</span>
          </div>
          <div style="height: calc(100% - 20px); overflow-y: auto">
            <div class="mt5">
              <div class="filterHead flex-between" style="overflow: hidden"
                   @click="collapseState.fieldsList = !collapseState.fieldsList">
                <span>数据域</span>
                <span style="cursor: pointer; color: #adadad;">
                  <a-icon type="double-right" style="transition: all .3s;"
                          :style="{transform: `rotate(${collapseState.fieldsList ? -90 : 90}deg)`}"/></span>
              </div>
              <div ref="fieldListRef" style="overflow: hidden; transition: height .3s; padding: 0 12px; margin: 5px auto"
                   :style="{height: collapseState.fieldsList ? 0 : heights.fieldsListH + 'px'}">
                <div class="itemGrids">
                  <div @click="selectField(item)" :class="{selected: !!selectedField.find(_ => item.uuid === _.uuid)}"
                       v-for="item in fieldsList" :key="item.uuid" class="nowrap">
                    <overflow-tooltip>
                      {{ item.nodeName }}
                    </overflow-tooltip>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div class="filterHead flex-between mb10" @click="collapseState.processList = !collapseState.processList">
                <span>业务过程</span>
                <span style="cursor: pointer; color: #adadad"><a-icon type="double-right" style="transition: all .3s;"
                                                                      :style="{transform: `rotate(${collapseState.processList ? -90 : 90}deg)`}"/></span>
              </div>
              <div ref="processListRef" style="overflow: hidden; transition: height .3s; padding: 0 12px; margin: 5px auto"
                   :style="{height: collapseState.processList ? 0 : heights.processListH + 'px'}">
                <div class="itemGrids" v-if="processList.length">
                  <div v-for="(item, index) in processList" @click="selectProcess(item)"
                       :class="{selected: !!selectedProcess.find(_ => item.uuid === _.uuid)}" :key="index" class="nowrap">
                    <overflow-tooltip>
                      {{ item.nodeName }}
                    </overflow-tooltip>
                  </div>
                </div>
                <div v-else style="overflow: auto">
                  <a-empty :image="simpleImage" :description="selectedField.length ? '暂无业务过程' : '请先选择数据域'"/>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="rightSide">
          <a-spin :spinning="loading" wrapperClassName="metricSearchResultSpin">
            <a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
            <div class="mb5">
              <span style="font-size: 18px">搜索结果</span>
              <span style="margin-left: 5px; color: #adadad; font-size: 12px">{{ pagination.total ? `为你找到${pagination.total}个结果` : '' }}</span>
            </div>
            <div style="height: calc(100% - 32px); background: #f8f8fa; border-radius: 8px">
              <div style="overflow-y: scroll" class="customScrollbar">
                <table class="resultTable" style="width: 100%">
                  <thead>
                  <tr>
                    <th width="18%" style="padding-left: 2%">指标名称</th>
                    <th width="10%">指标类型</th>
                    <th>业务描述</th>
                    <th width="10%">数据来源</th>
                    <th width="10%">业务负责人</th>
                    <th width="180">最后更新时间</th>
                    <th width="80">操作</th>
                  </tr>
                  </thead>
                </table>
              </div>
              <div class="customScrollbar" style="height: calc(100% - 48px); overflow-y: scroll">
                <table v-if="resultList.length" class="resultTable" style="width: 100%">

                  <colgroup>
                    <col width="18%" style="padding-left: 2%"/>
                    <col width="10%">
                    <col/>
                    <col width="10%"/>
                    <col width="10%"/>
                    <col width="180"/>
                    <col width="80"/>
                  </colgroup>

                  <tbody>
                  <template v-for="(item, index) in resultList">
                    <tr :key="index" @click="toggleExpandRow(item)">
                      <td style="padding-left: 2%" v-html="coloredKeyword(item.nodeName)"></td>
                      <td>{{ item.nodeType }}</td>
                      <td>
                        <div style="width: 100%">
                          <overflow-tooltip class="nowrap">
                            <span v-html="coloredKeyword(item.kpiDcrp)"></span>
                          </overflow-tooltip>
                        </div>
                      </td>
                      <td>{{ item.dataSourceNames || '--' }}</td>
                      <td>
                        {{ item.businessAscertainer || '--' }}
                      </td>
                      <td>{{ item.updateDate }}</td>
                      <td>
                            <span style="color: #6bc9b0;cursor: pointer; user-select: none" @click.stop="toggleExpandRow(item)">详情
                              <a-icon class="ml2" :style="{transform: `rotate(${item.__expand__ ? 180 : 0}deg)`}" type="down"/></span>
                      </td>
                    </tr>
                    <transition :key="`${index}expand`">
                      <tr v-if="item.__expand__">
                        <td colspan="7">
                          <div style="padding-left: 2%;" class="py10">
                            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px">
                              <div class="flex" style="align-items: start">
                                <span style="flex: 0 1 65px">上级指标：</span>
                                <span style="flex: 1">{{ item.sname }}</span>
                              </div>
                              <div class="flex" style="align-items: start">
                                <span style="flex: 0 1 65px">计算公式：</span>
                                <span style="flex: 1">{{ item.calcFormula }}</span>
                              </div>
                              <div class="flex" style="align-items: start">
                                <span style="flex: 0 1 65px">取数模型：</span>
                                <span style="flex: 1">{{ item.tableFields || '--' }}</span>
                              </div>
                              <div>
                                <span>取数口经：</span>
                                <span>{{ item.kpiDataDcrp || '--' }}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </transition>
                  </template>

                  </tbody>
                </table>
                <div v-else class="flex-center" style="height: 100%; width: 100%">
                  <a-empty :image="simpleImage" description="没有符合条件的结果"></a-empty>
                </div>
              </div>
            </div>
          </a-spin>
        </div>
      </div>
    </div>
    <a-spin v-if="!show">
      <a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
      <div style="height: 400px"></div>
    </a-spin>
  </transition>
</template>

<script>
import OverflowTooltip from '@/views/BIView/components/OverflowTooltip/OverflowTooltip'
import { Empty } from 'ant-design-vue'
import debounce from 'lodash/debounce'

export default {
  name: 'SearchResult',
  components: { OverflowTooltip },
  data() {
    return {
      loading: false,
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
      show: false,
      fieldsList: [],
      processList: [],
      resultList: [],
      pagination: {
        total: 0
      },
      selectedField: [],
      selectedProcess: [],
      collapseState: {
        fieldsList: false,
        processList: false
      },
      heights: {
        fieldsListH: 0,
        processListH: 0
      }
    }
  },
  watch: {
    selectedField(val) {
      this.processList = val.reduce((acc, cur) => {
        return acc.concat(cur.children)
      }, [])
      this.selectedProcess = this.selectedProcess.filter(item => {
        return this.processList.find(_ => _.uuid === item.id)
      })
      this.$nextTick(() => {
        this.heights.processListH = this.$refs.processListRef?.firstElementChild.clientHeight
      })
      this.handleSearch()
    },
    selectedProcess() {
      this.handleSearch()
    },
    $route: {
      handler() {
        this.resultList = []
        if (!this.resolved) {
          return
        }
        this.handleSearch()
      },
      immediate: true
    }
  },
  async mounted() {
    const { q: keyword, f, p } = this.$route.query || {}
    this.$emit('updateQuery', keyword)
    await this.getFieldAndProcess()
    if (f) {
      this.selectedField = this.fieldsList.filter(item => item.uuid === f)
      if (p) {
        setTimeout(() => {
          this.selectedProcess = this.processList.filter(item => item.uuid === p)
          this.resolved = true
        }, 20)
      }
    } else {
      this.resolved = true
      this.handleSearch()
    }

    setTimeout(() => {
      this.show = true
      this.$nextTick(() => {
        this.heights.processListH = this.$refs.processListRef?.firstElementChild.clientHeight
      })
    }, 20)
  },
  methods: {
    coloredKeyword(str) {
      const q = this.$route.query.q || ''
      return (str || '').replace(new RegExp('(' + q + ')', 'ig'), '<i style="color: darkorange">$1</i>')
    },
    handleReset() {
      this.selectedField = []
    },
    getFieldAndProcess() {
      return this.$axios.get('/api/normal/kpiNodeQuery/queryDataDomainsAndBusinessProcesses').then(({ data }) => {
        this.fieldsList = data
        setTimeout(() => {
          this.heights.fieldsListH = this.$refs.fieldListRef?.querySelector('.itemGrids')?.clientHeight
        }, 50)
      })
    },
    selectField(field) {
      const index = this.selectedField.findIndex(item => item.uuid === field.uuid)
      if (index === -1) {
        this.selectedField.push(field)
      } else {
        this.selectedField.splice(index, 1)
      }
    },
    selectProcess(p) {
      const index = this.selectedProcess.findIndex(item => item.uuid === p.uuid)
      if (index === -1) {
        this.selectedProcess.push(p)
      } else {
        this.selectedProcess.splice(index, 1)
      }
    },
    toggleExpandRow(row) {
      row.__expand__ = !row.__expand__
    },
    handleSearch: debounce(function() {
      const q = this.$route.query.q
      this.loading = true
      this.$axios.get('/api/normal/kpiNodeQuery/findByKeyword', {
        params: {
          pageSize: 999,
          page: 1,
          businessProcess: this.selectedProcess.map(item => item.uuid).join('|'),
          dataField: this.selectedField.map(item => item.uuid).join('|'),
          keyword: q
        }
      }).then(({ data: { list, totalRows } }) => {
        this.resultList = list.map((item) => {
          return {
            ...item,
            __expand__: false
          }
        })
        this.pagination.total = totalRows
      }).finally(() => {
        this.loading = false
      })
    }, 200)
  }
}
</script>

<style lang="scss" scoped>
.searchResultWrapper {
  padding: 50px;
  height: calc(100% - 100px);
  overflow-y: auto;
}

.searchResult {
  border-radius: 8px;
  height: 100%;
  min-height: 400px;
  background: #fff;
  display: flex;
  padding: 16px;
  align-items: stretch;
  user-select: text;

  .leftSide {
    padding: 12px 0;
    flex: 0 1 300px;
    min-width: 300px;
    background: #f8f8fa;
    border-radius: 8px;

    .resetButton {
      padding: 2px 8px;
      border-radius: 4px;

      &:hover {
        cursor: pointer;
        background: rgba(0, 0, 0, .05);
      }
    }

    .filterHead {
      cursor: pointer;
      padding: 4px 12px;

      &:hover {
        background: rgba(0, 0, 0, .04);
        border-radius: 4px;
      }
    }

    .itemGrids {
      display: grid;
      grid-template-columns: repeat(3, calc((100% - 20px) / 3));
      column-gap: 10px;
      row-gap: 10px;

      > div {
        padding: 0 2px;
        border: 1px solid #e3e3e3;
        text-align: center;
        line-height: 28px;
        height: 28px;
        background: #fff;
        cursor: pointer;
        font-size: 13px;
        color: #333;

        &.selected {
          border-color: #46BCA0;
          color: #46BCA0;
        }
      }
    }
  }

  .rightSide {
    .customScrollbar {
      &::-webkit-scrollbar-track {
        background: rgb(248, 248, 250);
      }
    }

    margin-left: 16px;
    flex: 1;


    .resultTable {
      table-layout: fixed;
      font-size: 13px;

      th, td {
        font-weight: normal;
        color: #adadad;
        padding: 12px 4px;
        border-bottom: 1px solid #eaeaea;
      }

      tbody tr:hover {
        background: rgba(0, 0, 0, .03);
      }

      td {
        color: #333;
      }
    }
  }
}


.swing-in-top-fwd-enter-active {
  animation: swing-in-top-fwd 0.5s cubic-bezier(0.175, 0.885, 0.320, 1.275) forwards;
}

@keyframes swing-in-top-fwd {
  0% {
    transform: rotateX(-100deg);
    transform-origin: top;
    opacity: 0;
  }
  100% {
    transform: rotateX(0deg);
    transform-origin: top;
    opacity: 1;
  }
}

</style>
<style lang="scss">
.metricSearchResultSpin {
  height: 100%;
  .ant-spin-container {
    height: 100%;
  }
}
</style>
