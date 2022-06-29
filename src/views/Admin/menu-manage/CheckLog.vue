<template>
  <a-modal title="日志" :visible="visible" width="980px" @cancel="visible = false" :footer="null">
    <vxe-table
      :data="table.data"
      :expand-config="{ lazy: true, trigger: 'row', loadMethod: loadContentMethod, accordion: true, reserve: true }"
    >
      <vxe-column type="expand" :width="50">
        <template v-slot:content="{ row }">
          <vxe-table :data="row.detailList" auto-resize size="small" style="margin: 16px 16px 8px 60px">
            <vxe-column title="操作内容" field="content"></vxe-column>
            <vxe-column title="操作人" field="operationUser">
              <template v-slot="{ row }">
                <span> {{ row['operationUserName'] }} （{{ row['operationUser'] }}）</span>
              </template>
            </vxe-column>
            <vxe-column title="操作时间" field="operationDate"></vxe-column>
          </vxe-table>

          <a-pagination
            hideOnSinglePage
            @change="handleInnerTableChange(arguments, row)"
            :pageSize="5"
            :current="row.current"
            :total="row.total || 0"
            style="text-align: right; margin-bottom: 16px; margin-right: 16px"
          />
        </template>
      </vxe-column>
      <vxe-column
        v-for="col in table.columns"
        :field="col.dataIndex"
        :title="col.title"
        :key="col.dataIndex"
        :width="col.width"
        :min-width="col.minWidth"
        :show-overflow="col.ellipsis"
      >
        <template v-slot="{ row }">
          <template v-if="!col.customRender">{{ row[col.dataIndex] }}</template>
          <RenderNode v-else :render="() => col.customRender(row[col.dataIndex], row)" />
        </template>
      </vxe-column>
    </vxe-table>
    <a-pagination v-bind="table.pagination" style="margin-top: 16px; text-align: right" @change="handleTableChange" />
  </a-modal>
</template>

<script>
const ACTIONS_TYPES = {
  CREATE: '创建',
  UPDATE: '更新',
  PATH_UPDATE: '路径更新',
  RELEASE: '发布',
  OFFLINE: '下线',
}
export default {
  name: 'CheckLog',
  components: {
    RenderNode: {
      functional: true,
      render(createElement, { props }) {
        const { render } = props
        return render()
      },
    },
  },
  props: {
    mainNo: {
      type: String,
      required: true,
    },
    subNo: {
      type: String,
    },
  },
  data() {
    return {
      visible: false,
      table: {
        data: [],
        pagination: {
          total: 0,
          pageSize: 5,
          current: 1,
          size: 'default',
          hideOnSinglePage: true,
        },
        columns: [
          { dataIndex: 'versionSubNum', title: '版本号', width: 80 },
          {
            dataIndex: 'operationType',
            title: '操作类型',
            width: 80,
            customRender: (text) => {
              return <span>{ACTIONS_TYPES[text]}</span>
            },
          },
          { dataIndex: 'content', title: '操作内容', minWidth: 180, ellipsis: true },
          {
            dataIndex: 'operationUser',
            title: '操作人',
            width: 120,
            ellipsis: true,
            customRender: (text, row) => {
              return (
                <span>
                  {row['operationUserName']}（{text}）
                </span>
              )
            },
          },
          { dataIndex: 'operationDate', title: '操作时间', minWidth: 150 },
          { dataIndex: 'lastModifyDate', title: '最后更新时间', minWidth: 150 },
        ],
      },
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      let p
      const { current, pageSize } = this.table.pagination
      if (!this.mainNo) {
        return
      }
      if (!this.subNo) {
        p = this.$axios.get('/api/menu/getMenuReleaseLog', {
          params: {
            versionMainNum: this.mainNo,
            page: current,
            pageSize,
          },
        })
      } else {
        p = this.$axios.get('/api/menu/getMenuReleaseDetailLog', {
          params: {
            versionMainNum: this.mainNo,
            versionSubNum: this.subNo,
            page: current,
            pageSize,
          },
        })
      }

      p.then(({ data: { list, totalRows } }) => {
        this.table.data = list
        this.table.pagination.total = totalRows
      })
    },
    loadContentMethod({ row }) {
      return this.$axios
        .get('/api/menu/getMenuReleaseDetailLog', {
          params: {
            versionMainNum: this.mainNo,
            versionSubNum: row.versionSubNum,
            pageSize: 5,
            page: row.current || 1,
          },
        })
        .then(({ data: { list, totalRows, page } }) => {
          row.detailList = list
          row.current = page
          row.total = totalRows
          this.key = this.key + 1
        })
    },
    handleTableChange(current) {
      this.table.pagination.current = current
      this.getData()
    },
    handleInnerTableChange([current], row) {
      row.current = current
      this.table.data = [...this.table.data]
    },
  },
}
</script>

<style scoped></style>
