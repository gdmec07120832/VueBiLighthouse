<template>
  <div class="my15" style="overflow: hidden">
    <div>
      <div class="section-head">指标分类</div>
      <div class="flex-start my5" style="align-items: start">
        <div class="cate-cell" @click="selectCate({id: -1})" :class="{current: currentCate === -1}">全部</div>
        <slick-list :value="categories" lockAxis="x" axis="x" class="flex-start drag-container" :class="{isDragging: !!isDraggingNode}"
                    @sort-start="onDragStart" @sort-end="onDragEnd" @input="onDrop"
                    useDragHandle helperClass="isDragging">
          <slick-item class="cate-cell"
                      @click.native="selectCate(cate)"
                      :class="{current: currentCate === cate.id, dropdownVisible: dropdownVisible}"
                      v-for="(cate, index) in categories" :index="index" :key="cate.id">
            <drag-svg v-handle class="dragIcon"/>
            <div>{{ cate.title }}</div>
            <a-dropdown :trigger="['click']" @visibleChange="visibleChange" placement="bottomCenter">
              <more-svg class="moreIcon" @click.stop></more-svg>
              <a-menu slot="overlay" @click="handleMenuClick($event, cate)" style="width: 80px">
                <a-menu-item key="edit">
                  编辑
                </a-menu-item>
                <a-menu-item key="delete">
                  <span style="color: #ff4d4f">删除</span>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </slick-item>
        </slick-list>
        <div class="cate-cell" style="padding: 0 10px; margin-right: 0; margin-left: 10px" @click="addNewCate">+</div>
      </div>
    </div>
    <div>
      <div class="flex flex-between py5">
        <div class="section-head">指标说明</div>
        <div>
          <div style="cursor: pointer; color: #46BCA0" @click="openEditDialog">
            配置指标
          </div>
        </div>
      </div>
      <a-spin :spinning="tableLoading">
        <vxe-table :data="metricTableList" highlight-hover-row class="metricTable" size="mini">
          <vxe-column
            width="120"
            field="dataFields"
            title="数据域"
          />
          <vxe-column
            width="120"
            field="businessProcess"
            title="业务过程"
          />
          <vxe-column
            field="kpiName"
            title="指标"
          />
          <vxe-column
            field="pageKpi"
            title="页面指标"
          />
          <vxe-column
            field="calcFormula"
            title="计算公式"
          >
            <template v-slot="{row}">
              <overflow-tooltip class="nowrap" style="display: block">
                {{ row.calcFormula }}
              </overflow-tooltip>
            </template>
          </vxe-column>
          <vxe-column
            field="description"
            title="描述"
          >
            <template v-slot="{row}">
              <overflow-tooltip class="nowrap" style="display: block">
                {{ row.description }}
              </overflow-tooltip>
            </template>
          </vxe-column>
        </vxe-table>
        <div v-if="pagination.total > 0" style="text-align: right; margin-top: 10px">
          <a-pagination @change="handlePageChange" size="small" :total="pagination.total" v-model="pagination.current" :show-total="total => `共${total}条记录`"></a-pagination>
        </div>
      </a-spin>
    </div>
  </div>
</template>

<script>
import DragSvg from '@/assets/svg/drag.svg'
import MoreSvg from '@/assets/svg/more.svg'
import { HandleDirective, SlickItem, SlickList } from 'vue-slicksort'
import { createDialog } from '@/utils/helper'
import { cloneDeep } from 'lodash'
import EditDialog from '@/views/Admin/menu-manage/MetricEdit/EditDialog'
import OverflowTooltip from '@/views/BIView/components/OverflowTooltip/OverflowTooltip'
import { Pagination } from 'ant-design-vue'

const EditCateModal = {
  functional: true,
  props: {
    reportCode: String,
    row: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      visible: false,
      submitLoading: false
    }
  },
  created() {

  },
  methods: {
    handleOk(e) {
      return this.$refs.form.validate().then(() => {
        this.submitLoading = true
        return this.$axios.post('/api/admin/biWKpiType/saveOrUpdate', {
          reportCode: this.reportCode,
          typeName: this.row.title,
          sortValue: this.row.sortValue,
          id: this.row.id
        }).then(() => {
          this.visible = false
          this.$message.success('操作成功')
          this.$emit('success')
        }).finally(() => {
          this.submitLoading = false
        })
      })
    }
  },
  render() {
    return <a-modal title={this.row.id ? '编辑' : '新增'} onChange={(v) => this.visible = v} visible={this.visible}
                    okButtonProps={{ props: { loading: this.submitLoading } }}
                    onOk={this.handleOk}>
      <a-form-model ref="form" props={{ model: this.row }} layout={'horizontal'} labelCol={{ flex: '80px' }} wrapperCol={{ flex: 1 }}>
        <a-form-model-item label={'分类名称'} prop={'title'} style={{ display: 'flex' }} rules={[{
          required: true,
          message: '分类名称不能为空'
        }]}>
          <a-input value={this.row.title} maxLength={20} onChange={e => {
            this.row.title = e.target.value
          }}/>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  }
}

const editCateModalService = createDialog(EditCateModal)
const editDialogService = createDialog(EditDialog)


export default {
  name: 'MetricEdit',
  directives: {
    handle: HandleDirective
  },
  components: { OverflowTooltip, SlickList, SlickItem, DragSvg, MoreSvg, APagination: Pagination },
  props: {
    reportItem: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      currentClick: null,
      dropdownVisible: false,
      isDraggingNode: null,
      currentCate: -1,
      categories: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      metricTableList: [],
      tableLoading: false
    }
  },
  watch: {
    currentCate(val) {
      this.pagination.current = 1
      if (val === -1) {
        this.getMetricTableListByCate()
      } else {
        this.getMetricTableListByCate(val)
      }
    }
  },
  mounted() {
    this.getCategories()
    this.getMetricTableListByCate()
  },
  methods: {
    getMetricTableListByCate(cateId) {
      this.tableLoading = true
      this.$axios.get('/api/user/biWKpiType/findByMainCodeOrTypeId', {
        params: {
          page: this.pagination.current,
          pageSize: this.pagination.pageSize,
          code: this.reportItem.versionMainNum,
          typeId: cateId
        }
      }).then(({ data: { list, totalRows } }) => {
        this.metricTableList = list
        this.pagination.total = totalRows
      }).finally(() => {
        this.tableLoading = false
      })
    },
    getCategories() {
      this.$axios.get('/api/user/biWKpiType/findByReportCode', {
        params: {
          code: this.reportItem.versionMainNum
        }
      }).then(({ data }) => {
        this.categories = data.map((item) => {
          return {
            title: item.typeName,
            ...item
          }
        })
      })
    },
    visibleChange(visible) {
      this.dropdownVisible = visible
    },
    addNewCate() {
      editCateModalService.create.call(this, {
        destroy: true,
        propsData: {
          row: { title: '', sortValue: this.categories.length },
          reportCode: this.reportItem.versionMainNum
        },
        _parentListeners: {
          success: () => {
            this.getCategories()
          }
        }
      })
    },
    handleMenuClick(e, cate) {
      this.dropdownVisible = false
      if (e.key === 'delete') {
        this.$confirm({
          title: `确定删除【${cate.title}】吗？`,
          onOk: () => {
            return this.$axios.get('/api/admin/biWKpiType/deleteById', {
              params: {
                id: cate.id
              }
            }).then(() => {
              this.$message.success('删除成功')
              this.getCategories()
            })
          }
        })
      }

      if (e.key === 'edit') {
        editCateModalService.create.call(this, {
          destroy: true,
          propsData: {
            row: cloneDeep(cate),
            reportCode: this.reportItem.versionMainNum
          },
          _parentListeners: {
            success: () => {
              this.getCategories()
            }
          }
        })
      }
    },
    openEditDialog() {
      editDialogService.create.call(this, {
        destroy: true,
        propsData: {
          reportName: this.reportItem.cnName,
          reportMainCode: this.reportItem.versionMainNum,
          categories: this.categories,
          currentCate: this.currentCate
        },
        _parentListeners: {
          success: () => {
            this.getMetricTableListByCate(this.currentCate === -1 ? undefined : this.currentCate)
          }
        }
      })
    },
    onDragStart({ node }) {
      node.classList.add('isDragging')
      this.isDraggingNode = node
    },
    onDragEnd() {
      this.isDraggingNode.classList.remove('isDragging')
      this.isDraggingNode = null
    },
    onDrop(result) {
      const old = this.categories
      this.categories = result.map((item, index) => {
        return { ...item, sortValue: index }
      })
      this.$axios.post('/api/admin/biWKpiType/setTypeSortValue', result.map((item, index) => {
        return { sortValue: index, typeId: item.id }
      })).catch(() => {
        this.categories = old
      })
    },
    selectCate(cate) {
      this.currentCate = cate.id
    },
    handlePageChange(page) {
      this.pagination.current = page
      this.getMetricTableListByCate(this.currentCate === -1 ? undefined : this.currentCate)
    }
  }
}
</script>

<style scoped lang="scss">
.section-head {
  font-size: 14px;
  font-weight: bold
}

.drag-container {
  &.isDragging {
    .cate-cell {
      opacity: .5;
    }

    .cate-cell:hover .dragIcon {
      opacity: 0 !important;
    }
  }
}

.cate-cell {
  position: relative;
  margin-right: 10px;
  height: 30px;
  line-height: 30px;
  padding: 0 20px;
  border-radius: 4px;
  border: 1px solid #46BCA0;
  white-space: nowrap;
  background-color: rgba(70, 188, 160, 0.2);
  user-select: none;
  color: #46BCA0;

  .dragIcon, .moreIcon {
    position: absolute;
    font-size: 12px;
    left: 2px;
    top: 50%;
    transform: translateY(-50%);
    opacity: 0;
    transition: all .2s;
    cursor: move;
  }

  .moreIcon {
    padding: 2px;
    font-size: 16px;
    cursor: pointer;
    left: auto;
    right: 2px;
    outline: none;
  }

  &.current {
    color: #fff;
    background: #46BCA0;
  }

  &:hover {
    cursor: pointer;

    .dragIcon, .moreIcon {
      opacity: 1;
    }
  }

  &.dropdownVisible .dragIcon {
    display: none;
  }

  .moreIcon:hover {
    background: rgba(0, 0, 0, .08);
    border-radius: 50%;
  }

  .moreIcon.ant-dropdown-open {
    opacity: 1;
    background: rgba(0, 0, 0, .08);
    border-radius: 50%;
  }

  &.isDragging {
    z-index: 19990;
    opacity: 1;

    .dragIcon {
      opacity: 1;
    }
  }
}

.drag-container {
  max-width: calc(100% - 250px);
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 2px;
  margin-bottom: -10px;

  .cate-cell:last-child {
    margin-right: 0;
  }
}


.metricTable {
  /deep/ .vxe-cell--title {
    font-weight: normal;
  }
}
</style>