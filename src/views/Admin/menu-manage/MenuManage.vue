<template>
  <div style="padding: 10px 20px">
    <h2 style="color: #46bca0; font-weight: bold">菜单管理</h2>
    <div class="flex flex-between pb10">
      <search-input
        ref="queryInput"
        @search="search($event, true)"
      />
      <a-space>
        <a-button @click="refreshMenu">刷新</a-button>
        <a-button type="primary" @click="addNewMenu">新增</a-button>
      </a-space>
    </div>
    <ASpin :spinning="table.loading">
      <div style="height: calc(100vh - 100px)">
        <vxe-table
          class="mainTable"
          ref="xTree"
          :data="table.data"
          :expand-config="{
            accordion: true,
            toggleMethod: toggleMethod,
            visibleMethod: expandVisibleMethod,
            reserve: true,
          }"
          :max-height="tableMaxHeight"
          :show-header="true"
          :tree-config="{ children: 'subMenu', trigger: 'cell', reserve: true }"
          border="full"
          header-cell-class-name="custom-ant-table-header-cell"
          highlight-current-row
          highlight-hover-row
          row-id="id"
          show-overflow="title"
          @current-change="handleCurrentChange"
        >
          <vxe-column
            class-name="tree-config-trigger-cell"
            field="cnName"
            title="报表/菜单名称"
            tree-node
            type="html"
            show-overflow="ellipsis"
            :min-width="200"
          />
          <vxe-column
            field="versionMainNum"
            type="html"
            show-overflow="ellipsis"
            :width="200"
            title="报表/菜单主编码"
            :min-width="150"
          ></vxe-column>
          <vxe-column :width="90" field="status" title="显示状态" :show-overflow="false">
            <template slot-scope="{ row }">
              <a-popconfirm title="确定切换吗?" v-if="row.menuType === 'Menu'" @confirm="changeStatus(row)">
                <a-switch :checked="row.status === 0" style="transform: scale(0.85)" />
              </a-popconfirm>
            </template>
          </vxe-column>
          <vxe-column field="yongHongReportName" title="永洪路径" :min-width="150"></vxe-column>
          <vxe-column title="顺序" field="seq" :width="80" />
          <vxe-column :width="120" field="secrecyLevel" title="机密程度"></vxe-column>
          <vxe-column :width="80" title="版本">
            <template v-slot="{row}">
              <i v-if="expandVisibleMethod({row})" @click="toggleVersionExpand(row)" style="cursor: pointer" class="vxe-table--expand-btn" :class="{
                'vxe-icon--arrow-right': !$refs.xTree.isExpandByRow(row) || !expandVersionClick,
                'vxe-icon--arrow-bottom': $refs.xTree.isExpandByRow(row) && expandVersionClick
              }"></i>
            </template>
          </vxe-column>
          <vxe-column type="expand" :visible="false">
            <template v-slot:content="{ row }">
              <vxe-table
                v-if="expandVersionClick"
                row-id="versionSubNum"
                size="small"
                auto-resize
                :max-height="250"
                show-overflow="title"
                :data="row.versions || []"
                class="menu-table-expand-table"
                header-cell-class-name="custom-ant-table-header-cell"
              >
                <vxe-column title="版本号" field="versionSubNum" width="80" />
                <vxe-column title="报表名称" field="cnName" />
                <vxe-column title="状态" field="status" width="80" :show-overflow="false">
                  <template slot-scope="{ row: version }">
                    {{ version.status === 0 ? '上架' : '下架' }}
                  </template>
                </vxe-column>
                <vxe-column title="永洪路径" field="yongHongReportName" min-width="150" />
                <vxe-column title="机密程度" field="secrecyLevel" width="100" />
                <vxe-column title="创建时间" field="createDate" width="150" />
                <vxe-column title="发布时间" field="releaseDate" width="150">
                  <template v-slot="{row: version}">
                    {{version.releaseDate ? version.releaseDate.replace('T', ' ').replace(/\.(.)+/, '') : ''}}
                  </template>
                </vxe-column>
                <vxe-column title="下架时间" field="removedDate" width="150">
                  <template v-slot="{ row: version }">
                    {{ version.removedDate }}
                    <span v-if="row.id === version.id && !version.removedDate">（当前版本）</span>
                  </template>
                </vxe-column>
                <vxe-column title="操作" field="actions" :show-overflow="false" width="150">
                  <template v-slot="{ row: version }">
                    <ASpace>
                      <AButton v-if="version.status === -1" size="small" type="link" @click="checkVersionRow(version)">
                        查看
                      </AButton>
                      <AButton v-if="version.status === 0" size="small" type="link" @click="updateVersionRow(version)">
                        修改
                      </AButton>
                      <a-popconfirm
                        title="是否确定报表下架？下架后将无法重新上架"
                        placement="topRight"
                        @confirm="offShelf(version)"
                      >
                        <AButton v-if="version.status === 0" size="small" type="link">下架</AButton>
                      </a-popconfirm>
                    </ASpace>
                  </template>
                </vxe-column>
              </vxe-table>
              <div v-if="expandMetricClick" class="mr20">
                <metric-edit :reportItem="row" />
              </div>
            </template>
          </vxe-column>
          <vxe-column :width="360" field="action" fixed="right" title="操作" :show-overflow="false">
            <template v-slot="{ row }">
              <ASpace>
                <AButton size="small" type="link" @click="updatePath(row)">菜单路径</AButton>
                <AButton v-if="row.menuType === 'Menu'" size="small" type="link" @click="updateRow(row)">修改</AButton>
                <AButton v-if="row.menuType === 'Menu' && !row.subMenu.length"
                         size="small" type="link" style="color: #ff4d4f" @click="deleteRow(row)">删除</AButton>
                <AButton
                  v-if="row.menuType === 'Report' && ( (row.versions && row.versions.length === 1 && row.versions[0].releaseDate) ||
                    (row.versions && row.versions.length > 1))"
                  size="small"
                  type="link"
                  @click="addIteration(row)"
                >
                  新增迭代
                </AButton>
                <AButton
                  size="small"
                  type="link"
                  v-if="row.menuType === 'Report' && (!(row.versions && row.versions.length === 1 && row.versions[0].releaseDate))"
                  @click="releaseRow(row)"
                  >发布</AButton
                >
                <AButton
                  v-if="row.menuType === 'Report' && row.versions && row.versions.length >= 1"
                  size="small"
                  type="link"
                  @click="checkRowLog(row)"
                >
                  日志
                </AButton>
                <AButton v-if="row.menuType==='Report'" size="small" type="link" @click="openMetric(row)">
                  指标关系
                  <i style="cursor: pointer; font-size: 14px; vertical-align: -2px" class="vxe-table--expand-btn" :class="{
                'vxe-icon--arrow-right': !$refs.xTree.isExpandByRow(row) || !expandMetricClick,
                'vxe-icon--arrow-bottom': $refs.xTree.isExpandByRow(row) && expandMetricClick
                }"></i>
                </AButton>
              </ASpace>
            </template>
          </vxe-column>
        </vxe-table>
      </div>
    </ASpin>
  </div>
</template>

<script>
import Vue from 'vue'
import { createDialog } from '@/utils/helper'
import AddNew from '@/views/Admin/menu-manage/AddNew'
import UpdatePathModal from '@/views/Admin/menu-manage/UpdatePathModal'
import CheckLog from '@/views/Admin/menu-manage/CheckLog'
import SearchInput from '@/views/Admin/menu-manage/SearchInput'
import ReleaseModal from '@/views/Admin/menu-manage/ReleaseModal'
import { Column, Header, Icon, Table, VXETable } from 'vxe-table'
import XEUtils from 'xe-utils'
import MetricEdit from '@/views/Admin/menu-manage/MetricEdit/MetricEdit'

VXETable.setup({
  emptyCell: ' ',
  table: {
    emptyText: '暂无数据',
  },
})
Vue.use(Header).use(Column).use(Icon).use(Table)
const addNewService = createDialog(AddNew)
const updatePathService = createDialog(UpdatePathModal)
const checkLogService = createDialog(CheckLog)
const releaseModalService = createDialog(ReleaseModal)

export default {
  name: 'MenuManage',
  components: { MetricEdit, SearchInput },
  data() {
    return {
      tableMaxHeight: 0,
      tableKey: '',
      allMenus: [],
      allMenusMap: {},
      selectedMenuMap: {},
      currentMenuMap: {},
      query: {
        keyword: '',
      },
      table: {
        selectedRow: null,
        loading: false,
        data: [],
      },
      expandVersionClick: false,
      expandMetricClick: false
    }
  },
  created() {
    this.getTableData()
  },
  mounted() {
    this.tableMaxHeight = document.documentElement.clientHeight - 94
    window.xTree = this.$refs.xTree
  },
  methods: {
    search(query, clearExpand) {
      const {keyword, status} = query
      const word = (keyword || '').trim()
      let options = { children: 'subMenu' }
      let searchProps = ['cnName', 'versionMainNum']

      if(status === '1') {
        // 搜全部
        if(word) {
         const data = XEUtils.searchTree(
            this.allMenus,
            (item) => {
              return searchProps.some(
                (key) => XEUtils.toValueString((item[key] || '').toLowerCase()).indexOf(word.toLowerCase()) > -1
              )
            },
            options
          )
          const filterRE = new RegExp(word, 'gi')
          XEUtils.eachTree(
            data,
            (item) => {
              searchProps.forEach((key) => {
                item[key] = `<div title="${item[key]}">` + XEUtils.toValueString(item[key]).replace(
                  filterRE,
                  (match) => `<span class='keyword-lighten'>${match}</span>`
                ) + '</div>'
              })
            },
            options
          )
          this.table.data = data
            // 搜索之后默认展开所有子节点
          this.$nextTick(() => {
            this.$refs.xTree.setAllTreeExpand(true)
          })
        } else {
          const data = JSON.parse(JSON.stringify(this.allMenus))
          XEUtils.eachTree(data, (item) => {
            searchProps.forEach((key) => {
              item[key] =  item[key] ? `<div title="${item[key]}">` + item[key] +'</div>' : item[key]
            })
          }, options)
          this.table.data = data
          if (clearExpand) {
            this.$nextTick(() => {
              this.$refs.xTree.clearTreeExpand()
              this.$refs.xTree.clearRowExpand()
            })
          }
        }
      } else {
        // 搜已上架 或 已下架
        if(word) {
          const data = XEUtils.searchTree(
            this.allMenus,
            (item) => {
                let statusRet = false
                if(status === '2') {
                  statusRet = item.status === 0
                }

                if(status === '3') {
                  statusRet = item.status === -1
                }
              return statusRet && item.menuType === 'Report' && searchProps.some(
                (key) => XEUtils.toValueString((item[key] || '').toLowerCase()).indexOf(word.toLowerCase()) > -1
              )
            },
            options
          )
          const filterRE = new RegExp(word, 'gi')
          const rows = []
          XEUtils.eachTree(
            data,
            (item) => {
              rows.push(item)
              searchProps.forEach((key) => {
                if(item.menuType === 'Report') {
                  item[key] = `<div title="${item[key]}">` + XEUtils.toValueString(item[key]).replace(
                    filterRE,
                    (match) => `<span class='keyword-lighten'>${match}</span>`
                  ) + '</div>'
                }
              })
            },
            options
          )
          this.table.data = data
          this.$nextTick(() => {
            this.$refs.xTree.setTreeExpand(rows.filter(item => item.subMenu?.length).slice(0,10), true)
            this.$refs.xTree.clearRowExpand()
          })
        } else {
          const rows = []
          const data = XEUtils.searchTree(
            this.allMenus,
            (item) => {
              rows.push(item)
              let statusRet = false
              if(status === '2') {
                statusRet = item.status === 0
              }

              if(status === '3') {
                statusRet = item.status === -1
              }
              return statusRet && item.menuType === 'Report'
            },
            options
          )


          this.table.data = data
          if(clearExpand) {
            this.$refs.xTree.setTreeExpand(rows.filter(item => item.subMenu?.length).slice(0,10), true)
            this.$refs.xTree.clearRowExpand()
          }
        }
      }
      if (this.isRefresh) {
        this.isRefresh = false
        setTimeout(() => {
          this.$refs.xTree.scrollTo(undefined, this.tableScrollTop)
        })
      }
    },
    handleCurrentChange({ newValue }) {
      this.table.selectedRow = newValue
    },
    expandVisibleMethod({ row }) {
      const { menuType, versions } = row
      return menuType === 'Report' && versions && versions.length >= 1
    },
    toggleMethod(param) {
      console.log(param)
      return true
    },
    refreshMenu() {
      const { scrollTop } = this.$refs.xTree.getScroll()
      this.tableScrollTop = scrollTop
      this.isRefresh = true
      this.getTableData()
    },
    addIteration(_row) {
      const row = { ..._row }
      row.versionMainNum = (row.versionMainNum || '').replace(/<span class='keyword-lighten'>(.+)<\/span>/g, '$1')
      row.cnName = (row.cnName || '').replace(/<span class='keyword-lighten'>(.+)<\/span>/g, '$1')
      addNewService.create.call(this, {
        destroy: true,
        propsData: {
          isAddIteration: true,
          rowData: row,
        },
        _parentListeners: {
          'submit-success': () => {
            this.getTableData()
          },
        },
      })
    },
    addNewMenu() {
      addNewService.create.call(this, {
        destroy: true,
        propsData: {
          parentId: this.table.selectedRow ? this.table.selectedRow.id : '',
        },
        _parentListeners: {
          'submit-success': () => {
            this.getTableData()
          },
        },
      })
    },
    updatePath(row) {
      updatePathService.create.call(this, {
        destroy: true,
        propsData: {
          rowData: row,
        },
        _parentListeners: {
          'submit-success': () => {
            this.getTableData()
          },
        },
      })
    },
    updateRow(row) {
      addNewService.create.call(this, {
        destroy: true,
        propsData: {
          rowData: row,
        },
        _parentListeners: {
          'submit-success': () => {
            this.getTableData()
            this.$message.success('保存成功')
          },
        },
      })
    },
    deleteRow({ id }) {
      this.$confirm({
        title: '提示',
        content: '确定删除吗？',
        onOk: () => {
          this.$axios
            .get('/api/menu/deleteMenu', {
              params: { id },
            })
            .then(() => {
              this.$message.success('删除成功')
              this.getTableData()
            })
        },
      })
    },
    releaseRow(row) {
      const { id, versions } = row
      let tipContent = ''
      let releaseType = ''
      let newMenuId = ''
      if (versions?.length && versions?.length > 1) {
        tipContent = `确定发布版本号为【${versions.slice(-1)[0].versionSubNum}】的迭代吗？`
        releaseType = 'ReleaseIteration'
        newMenuId = versions.slice(-1)[0].id
      } else {
        tipContent = '确定发布吗？'
        releaseType = 'ReleaseNew'
        newMenuId = id
      }

      if (releaseType === 'ReleaseNew') {
        this.$confirm({
          title: '提示',
          content: tipContent,
          onOk: () => {
            this.$axios
              .get('/api/menu/releaseMenu', {
                params: { releaseType, newMenuId, oldMenuId: releaseType === 'ReleaseNew' ? '' : id },
              })
              .then(() => {
                this.$message.success('发布成功')
                this.getTableData()
              }).catch(err => {
                if(err?.code === 6) {
                  if(!this.$refs.xTree.isExpandByRow(row) || !this.expandMetricClick) {
                    this.$refs.xTree.setRowExpand(row, true)
                    this.expandMetricClick = true
                    this.expandVersionClick = false
                  }
                }
            })
          },
        })
      } else {
        releaseModalService.create.call(this, {
          destroy: true,
          propsData: {
            rowData: row,
          },
          _parentListeners: {
            'submit-success': () => {
              this.getTableData()
            },
          },
        })
      }
    },
    checkVersionRow(row) {
      addNewService.create.call(this, {
        destroy: true,
        propsData: {
          readonly: true,
          isUpdateIteration: true,
          rowData: row,
        },
      })
    },
    updateVersionRow(row) {
      addNewService.create.call(this, {
        destroy: true,
        propsData: {
          isUpdateIteration: true,
          rowData: row,
        },
        _parentListeners: {
          'submit-success': () => {
            this.getTableData()
          },
        },
      })
    },
    checkRowLog(_row) {
      const row = { ..._row }
      row.versionMainNum = (row.versionMainNum || '').replace(/<span class='keyword-lighten'>(.+)<\/span>/g, '$1')
      checkLogService.create.call(this, {
        destroy: true,
        propsData: {
          mainNo: row.versionMainNum,
        },
      })
    },
    getTableData() {
      this.table.loading = true
      this.$axios
        .get('/api/menu/list')
        .then(({ data }) => {
          this.allMenus = Object.freeze(data)

          this.search(this.$refs.queryInput.query)
        })
        .finally(() => {
          this.table.loading = false
        })
    },
    offShelf(versionRow) {
      this.$axios
        .get('/api/menu/stopMenu', {
          params: { id: versionRow.id },
        })
        .then(() => {
          this.refreshMenu()
        })
    },
    changeStatus({ id, status }) {
      let url
      if (status === 0) {
        url = '/api/menu/stopMenu'
      } else if (status === -1) {
        url = '/api/menu/startMenu'
      }
      if (url) {
        this.$axios
          .get(url, {
            params: { id },
          })
          .then(() => {
            this.refreshMenu()
          })
      }
    },
    openMetric(row) {
      if(!this.$refs.xTree.isExpandByRow(row) || !this.expandMetricClick) {
        this.$refs.xTree.setRowExpand(row, true)
        this.expandMetricClick = true
        this.expandVersionClick = false
      } else {
        this.$refs.xTree.setRowExpand(row, false)
        this.expandMetricClick = false
      }
    },
    toggleVersionExpand(row) {
      if(!this.expandVersionClick || !this.$refs.xTree.isExpandByRow(row)) {
        this.$refs.xTree.setRowExpand(row, true)
        this.expandVersionClick = true
        this.expandMetricClick = false
      } else {
        this.$refs.xTree.setRowExpand(row, false)
        this.expandVersionClick = false
      }
    }
  },
}
</script>

<style lang="scss">
.custom-ant-table-header-cell {
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
  background: #fafafa;
  transition: background 0.3s ease;
}

.keyword-lighten {
  color: #000;
  background-color: #ffff00;
}

.tree-config-trigger-cell {
  cursor: pointer;

  &:hover {
    .vxe-tree--node-btn {
      color: #606266;
    }
  }
}
</style>

<style lang="scss" scoped>
.mainTable {
  /deep/ .vxe-body--expanded-cell {
    position: relative;
    z-index: 99;
    background: #fafafa;
    border: 1px solid #e8eaec;
  }
}

.menu-table-expand-table {
  box-shadow: rgba(0, 0, 0, 0.02) 0 1px 3px 0, rgba(27, 31, 35, 0.15) 0 0 0 1px;
  margin: 16px 10px 16px 0;
}
</style>
