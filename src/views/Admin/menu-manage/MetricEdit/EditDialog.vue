<template>
  <a-modal :title="reportName" width="60vw" @ok="handleOk" :okButtonProps="{props: {loading: submitLoading}}" v-model="visible" wrapClassName="editReportMetricDialog" :maskClosable="false">
    <div class="editWrapper" style="min-width: 800px">
      <div class="edit-left">
        <div class="flex">
          <span style="flex: 0 0 70px; text-align: right">数据域：</span>
          <a-select style="flex: 1" placeholder="请选择" v-model="curDataField" showSearch optionFilterProp="label">
            <template #notFoundContent>
              <div class="text-center">无数据</div>
            </template>
            <a-select-option v-for="item in fieldList" :key="item.uuid" :value="item.uuid" :label="item.nodeName">{{ item.nodeName }}</a-select-option>
          </a-select>
        </div>
        <div class="flex mt10">
          <span style="flex: 0 0 70px; text-align: right">业务过程：</span>
          <a-select style="flex: 1" placeholder="请选择" allowClear v-model="curBizProcess" showSearch optionFilterProp="label">
            <template #notFoundContent>
              <div class="text-center">无数据</div>
            </template>
            <a-select-option v-for="item in bizProcessList" :key="item.uuid" :value="item.uuid" :label="item.nodeName">{{ item.nodeName }}</a-select-option>
          </a-select>
        </div>

        <div class="mt10">
          <a-input placeholder="搜索" v-model="searchKeyword" allowClear>
            <a-icon slot="prefix" type="search" style="color: #d0d0d0"/>
          </a-input>
        </div>
        <div class="mt10 treeListWrapper">
          <div style="height: 100%;" class="flex-center" v-if="!treeNodes.length">
            <a-empty v-if="!curBizProcess" :image="simpleImage" description="请先选择数据域和业务过程" style="color: rgba(0,0,0,.4); font-size: 12px"></a-empty>
            <a-empty v-if="curBizProcess" :image="simpleImage">
              <div slot="description" class="text-xs">
                <div>暂无相关指标，可前往<span style="color: #1890FF">DMS系统</span>中进行配置</div>
                <div class="flex flex-center mt10">
                  <div @click="gotoDms" style="cursor: pointer; width: 100px; height: 31px; line-height: 31px; color: #fff; background: rgba(24, 144, 255, 1); border-radius: 4px">立即前往</div>
                </div>
              </div>
            </a-empty>
          </div>
          <div style="height: 100%;" class="flex-center" v-if="!filteredTreeNodes.length && searchKeyword">
            <a-empty v-if="curBizProcess" :image="simpleImage">
              <div slot="description" class="text-xs">
                <div>暂无相关指标，可前往<span style="color: #46BCA0">DMS系统</span>中进行配置</div>
                <div class="flex flex-center mt10">
                  <div @click="gotoDms" style="cursor: pointer; width: 100px; height: 31px; line-height: 31px; color: #fff;
                  background: #46BCA0; border-radius: 4px">立即前往</div>
                </div>
              </div>
            </a-empty>
          </div>
          <div v-if="filteredTreeNodes.length && curBizProcess" style="height: 100%;">
            <a-directory-tree
              @check="onNodeCheck"
              :checkedKeys="currentCheckedKeys"
              :expandAction="false"
              checkStrictly
              :expandedKeys.sync="expandedKeys"
              class="treeWrapper"
              :selectable="false" checkable
              style="height: 100%; overflow-y: auto"
              :treeData=filteredTreeNodes
              :replaceFields="{title: 'nodeName', key: 'uuid', children: 'children'}" :showIcon="false">

            </a-directory-tree>
          </div>
        </div>
      </div>
      <div class="edit-right">
        <div class="flex flex-between" style="width: 100%">
          <div>指标关系配置</div>
          <div class="flex">
            <div style="color: #ff4d4f; cursor: pointer" @click="batchDelete">批量移除</div>
            <div style="color: #6bc9b0;cursor: pointer; margin-left: 20px">一键导入</div>
          </div>
        </div>
        <div class="mt10">
          <vxe-table ref="table" :data="metricList" max-height="440px" size="mini" class="editTable" auto-resize>
            <vxe-column type="checkbox" align="left" width="40"></vxe-column>
            <vxe-column field="nodeName" title="指标" align="left" width="150"></vxe-column>
            <vxe-column field="type" title="指标类型" align="left" width="100">
              <template v-slot="{row}">
                {{ ({ '1': '原子指标', '2': '派生指标' })[row.nodeType] }}
              </template>
            </vxe-column>
            <vxe-column field="type" title="指标分类" align="left" width="120">
              <template v-slot="{row}">
                {{ calcTypeText(row.typeId) }}
              </template>
            </vxe-column>
            <vxe-column field="cnName" title="页面指标" align="left" min-width="100">
              <template v-slot="{row}">
                <input class="editInput" v-model="row.pageKpi" placeholder="输入页面对应指标"/>
              </template>
            </vxe-column>
            <vxe-column field="cnName" title="操作" align="center" width="60">
              <template v-slot="{row}">
                <a-icon type="delete" style="cursor: pointer; font-size: 16px" @click="deleteRow(row)"/>
              </template>
            </vxe-column>
          </vxe-table>
        </div>
      </div>
    </div>
  </a-modal>
</template>
<script>
import { Empty } from 'ant-design-vue'
import { cloneDeep } from 'lodash'
import filterDeep from 'deepdash/es/filterDeep.js'

export default {
  name: 'edit-dialog',
  props: {
    reportName: {
      type: String,
      default: ''
    },
    reportMainCode: {
      type: String,
      default: ''
    },
    categories: {
      type: Array,
      default: () => []
    },
    currentCate: {
      type: [String, Number],
      default: -1
    }
  },
  data() {
    return {
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
      visible: false,
      searchKeyword: '',
      fieldList: [],
      bizProcessList: [],
      treeNodes: [],
      filteredTreeNodes: [],
      metricList: [],
      expandedKeys: [],
      allCheckedKeys: [],
      currentCheckedKeys: [],
      curDataField: undefined,
      curBizProcess: undefined,
      submitLoading: false
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.getDataField()
        this.getAllMetricList()
      }
    },
    searchKeyword(val) {
      if (!val) {
        this.filteredTreeNodes = cloneDeep(this.treeNodes)
      } else {
        this.filteredTreeNodes = filterDeep(this.treeNodes, (value) => {
          return (value.nodeName.toLowerCase()).indexOf(val.toLowerCase()) > -1
        }, {
          childrenPath: ['children'], onTrue: {
            skipChildren: true
          }
        }) || []
      }
      this.expandedKeys = this.filteredTreeNodes.map(item => item.uuid)
    },
    curDataField: async function(val) {
      this.curBizProcess = undefined
      if (val) {
        try {
          this.bizProcessList = await this.getChildNodeByPid(val)
        } catch {
          this.bizProcessList = []
        }
      } else {
        this.bizProcessList = []
      }
    },
    curBizProcess: {
      handler: async function(val) {
        this.searchKeyword = ''
        if (val) {
          this.treeNodes = await this.getChildNodeByPid(val)
          this.filteredTreeNodes = cloneDeep(this.treeNodes)
          this.expandedKeys = this.filteredTreeNodes.map(item => item.uuid)
        } else {
          this.treeNodes = []
        }
      }
    }
  },
  mounted() {

  },
  methods: {
    getAllMetricList() {
      this.$axios.get('/api/user/biWKpiType/findByMainCodeOrTypeId', {
        params: {
          page: 1,
          pageSize: 999,
          typeId: this.currentCate === -1 ? undefined : this.currentCate,
          code: this.reportMainCode
        }
      }).then(({ data: { list } }) => {
        this.metricList = list.map(item => {
          return {
            ...item,
            uuid: item.kpiUuid,
            nodeName: item.kpiName,
            pageKpi: item.pageKpi,
            nodeType: item.kpiType === '原子指标' ? 1 : item.kpiType === '派生指标' ? 2 : null
          }
        })
        this.currentCheckedKeys = list.map(item => item.kpiUuid)
      })
    },
    getDataField() {
      this.$axios.get('/api/user/reportAndKpi/queryLevelInfo', {
        params: { level: 1 }
      }).then(({ data }) => {
        this.fieldList = data
      })
    },
    getChildNodeByPid(id) {
      return this.$axios.get('/api/user/reportAndKpi/findByParentId', {
        params: {
          parentUUID: id
        }
      }).then(({ data }) => {
        return data?.children || []
      })
    },
    onNodeCheck(checkedKeys, { checked, checkedNodes, node, event }) {
      console.log(node)
      if (checked) {
        this.metricList.push({
          ...node.dataRef,
          pageKpi: '',
          typeId: this.currentCate === -1 ? undefined : this.currentCate
        })
        this.currentCheckedKeys.push(node.dataRef.uuid)
      } else {
        const index = this.metricList.findIndex(item => node.dataRef.uuid === item.uuid)
        if (index > -1) {
          this.metricList.splice(index, 1)
          this.currentCheckedKeys.splice(index, 1)
        }
      }
    },
    deleteRow(row) {
      const index = this.metricList.findIndex(item => item.uuid === row.uuid)
      if (index > -1) {
        this.metricList.splice(index, 1)
        this.currentCheckedKeys.splice(index, 1)
      }
    },
    handleOk() {
      this.submitLoading = true
      this.$axios.post('/api/admin/reportAndKpi/insertBatchReportAndKpi', {
        reportCode: this.reportMainCode,
        typeId: this.currentCate === -1 ? undefined : this.currentCate,
        kpinodeList: this.metricList.map(item => {
          return {
            typeId: item.typeId ? item.typeId : this.currentCate === -1 ? undefined : this.currentCate,
            kpiUuid: item.uuid,
            reportCode: this.reportMainCode,
            pageKpi: item.pageKpi
          }
        })
      }).then(() => {
        this.$emit('success')
        this.$message.success('保存成功')
        this.visible = false
      }).finally(() => {
        this.submitLoading = false
      })
    },
    batchDelete() {
      let selectRecords = this.$refs.table.getCheckboxRecords()
      console.log(selectRecords)
      this.metricList = this.metricList.filter(item => !selectRecords.find(r => r.uuid === item.uuid))
      this.currentCheckedKeys = this.metricList.map(item => item.uuid)
    },
    calcTypeText(id) {
      return this.categories.find(item => item.id === id)?.typeName || ''
    },
    gotoDms() {
      if(process.env.VUE_APP_RELEASE_ENV === 'pro') {
        window.open('http://dm.bi.linshimuye.com:9015/')
      } else {
        window.open('http://sit.dm.bi.linshimuye.com:9020/')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.editWrapper {
  display: flex;
  height: 500px;

  .edit-left {
    padding: 16px;
    width: 280px;
    flex: 0 0 280px;
    border-right: 1px solid #eee;

    .treeListWrapper {
      height: 350px;
      margin-right: -16px;
      overflow-y: hidden;
    }
  }

  .edit-right {
    //border-left: 1px solid #eee;
    //margin-left: 40px;
    padding: 16px;
    flex: 1;
    overflow: hidden;

    .editTable {
      /deep/ .vxe-cell--title {
        font-weight: normal;
      }
    }
  }
}

.treeWrapper {
  &::-webkit-scrollbar-thumb {
    border-radius: 0;
    background: rgba(0, 0, 0, 0.15);
  }
}

.editInput {
  width: 100%;
  border: none;
  padding-left: 10px;
  padding-right: 10px;
  background: #f2f2f2;
  outline: none;

  &::placeholder {
    color: rgba(0, 0, 0, .25);
  }

  &:focus {
    background: #ececec;
  }
}
</style>

<style lang="scss">
.editReportMetricDialog {
  .ant-modal {
    min-width: 960px;
  }

  .ant-modal-body {
    padding: 0;
  }
}
</style>