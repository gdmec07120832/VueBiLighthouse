<template>
  <div>
    <a-table
      class="y-table"
      v-bind="options"
      v-on="$listeners"
      :columns="columns"
      size="small"
      :data-source="options.data"
      :bordered="false"
      :pagination="false"
      :rowKey="$attrs.rowKey || 'key'"
      :rowClassName="options.rowClassName"
      :scroll="{ x: 400, y: false }"
    ></a-table>
    <y-pagination :pagination="options.pagination"></y-pagination>
    <Popup :visible="popupVisible" :x="popupX" :y="popupY" :record="popupRecord" />
  </div>
</template>

<script>
import Vue from 'vue'
import YPagination from '@/views/BIView/components/YPagination/YPagination'

const Popup = {
  functional: true,
  // eslint-disable-next-line no-unused-vars
  render (createElement, { props }) {
    const { visible, x, y, record } = props
    const handleClick = () => {
      Vue.prototype.$clipboard(record)
    }

    return visible && <ul class="y-table-popup" style={{ left: `${x}px`, top: `${y}px` }}>
      <li onClick={handleClick}>复制内容</li>
    </ul>
  }
}

export default {
  name: 'YTable',
  components: { YPagination, Popup },
  props: {
    options: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      popupVisible: false,
      popupX: 0,
      popupY: 0,
      popupRecord: '',
      columns: [],
    }
  },
  created() {
    this.initOptions()
  },
  watch: {
    'options.columns': {
      immediate: true,
      handler(columns, oldColumns) {
        if(JSON.stringify(columns) === JSON.stringify(oldColumns)) {
          return
        }
        this.handleColumns(columns)
      }
    }
  },
  methods: {
    initOptions () {
      const { data, pagination } = this.options
      this.options.data = data || []
      this.options.pagination = Object.assign({
        showTotal: (total, range) => `${range[0]}-${range[1]}/${total}`
      }, pagination || {})
      this.options.rowClassName = (record, index) => {
        return index % 2 === 0 ? 'even' : 'odd'
      }
    },
    handleColumns(columns) {
      const _this = this
      this.columns = columns.map(column => {
        return {
          ...column,
          customCell: (record) => {
            return {
              on: {
                contextmenu: (e) => {
                  e.preventDefault()
                  if (!_this.popupVisible) {
                    document.addEventListener('click', function onClickOutSide () {
                      _this.popupVisible = false
                      document.removeEventListener('click', onClickOutSide)
                    })
                  }
                  _this.popupX = e.clientX
                  _this.popupY = e.clientY
                  _this.popupVisible = true
                  _this.popupRecord = record[column['dataIndex']]
                }
              }
            }
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.y-table {
  border-radius: 4px;
  border: 1px solid #f0f0f0;

  /deep/ .ant-table {
    border-color: transparent !important;
  }

  /deep/ td {
    border-color: transparent !important;
    padding: 4.5px 8px !important;
    height: 33px;
    line-height: 33px;
  }

  /deep/ .odd {
    background-color: #fafafa;
  }

  font-size: 12px;

  /deep/ .ant-table-column-title {
    font-size: 12px;
    font-weight: 400;
  }

  /deep/ .ant-table-row {
    font-size: 12px;
  }

  /deep/ .ant-table-thead {
    background: #fafafa;
  }

  /deep/ .ant-table-head {
    td {
      font-weight: 800;
    }
  }
}
</style>

<style lang="scss">
.y-table-popup {
  background-clip: padding-box;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  left: 0;
  list-style-type: none;
  margin: 0;
  padding: 0;
  position: fixed;
  text-align: left;
  top: 0;
  overflow: hidden;
  z-index: 999;

  li {
    clear: both;
    color: rgba(0, 0, 0, 0.65);
    cursor: pointer;
    font-size: 14px;
    font-weight: normal;
    line-height: 22px;
    margin: 0;
    padding: 5px 12px;

    &:hover {
      background-color: #e6f7ff;
    }
  }
}
</style>