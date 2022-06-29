<template>
  <div>
    <table class="sortTable sortTable-head" :style="{tableLayout: tableLayout}">
      <tr :style="{height: thHeight !== 'auto' ? thHeight : trHeight}">
        <td v-for="col in columns" :key="col.dataIndex"
            @click="handleSort(col)"
            :width="col.width"
            :class="{clickable: col.sortable}"
            :align="col.align || 'center'">
          <OverflowTooltip>
             <span v-if="col.sortable && sorter.col === col.dataIndex">
            {{ ({ desc: '↓', asc: '↑' }[sorter.type]) }}
          </span>
            {{ col.title }}
          </OverflowTooltip>
        </td>
      </tr>
    </table>
    <div :style="bodyStyle" class="sortTable-bodyWrapper">
      <table class="sortTable sortTable-body" :style="{tableLayout: tableLayout}">
        <TotalRow v-if="totalRow.render" v-bind="totalRow"/>
        <tr :style="{height: trHeight}" v-for="row in dataSource" :key="row[rowKey]">
          <td v-for="col in columns" :align="col.align || 'center'" :width="col.width" :key="col.dataIndex">
            <Cell :row="row" :cellProp="col.dataIndex" :render="col.render"/>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>


import OverflowTooltip from '@/views/BIView/components/OverflowTooltip/OverflowTooltip'

const Cell = {
  functional: true,
  props: ['row', 'cellProp', 'render'],
  render (h, context) {
    const { row, cellProp, render } = context.props
    if (!render) {
      return <overflow-tooltip>{row[cellProp]}</overflow-tooltip>
    } else {
      return render(h, { row, cellProp })
    }
  }
}

const TotalRow = {
  functional: true,
  props: ['data', 'render'],
  render (createElement, context) {
    const { data, render } = context.props
    return render(createElement, data)
  }
}

const sorterType = ['desc', 'asc', '']
export default {
  name: 'SortTable',
  components: { OverflowTooltip, Cell, TotalRow },
  data () {
    return {}
  },
  props: {
    rowKey: String,
    totalRow: {
      type: Object,
      /**
       * @return {{render?: function, data?: {}}}
       * */
      default: () => ({})
    },
    thHeight: {
      type: String,
      default: 'auto'
    },
    trHeight: {
      type: String,
      default: 'auto'
    },
    sorter: {
      type: Object,
      default: () => ({ col: '', type: '' })
    },
    tableLayout: {
      type: String,
      default: 'fixed'
    },
    dataSource: {
      type: Array,
      default: () => [],
    },
    bodyStyle: {
      type: Object,
      default: () => ({})
    },

    columns: {
      type: Array,
      /**
       * @return {{sortable?: boolean, align?: string}[]}
       * */
      default: () => []
    }
  },
  methods: {
    handleSort (col) {
      if (!col.sortable) {
        return
      }
      let newSorter = { col: '', type: '' }
      newSorter.col = col.dataIndex
      if (col.dataIndex !== this.sorter.col) {
        newSorter.type = 'desc'
      } else {
        newSorter.type = sorterType[(sorterType.indexOf(this.sorter.type) % 3) + 1]
        if (newSorter.type === '') {
          newSorter.col = ''
        }
      }
      this.$emit('update:sorter', newSorter)
      this.$emit('sortCol', newSorter)
    }
  }
}
</script>

<style lang="scss" scoped>
.sortTable {
  width: 100%;
  font-size: 12px;

  td {
    padding: 0 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &.clickable:hover {
      background: rgba(112, 112, 112, .1);
      border-radius: 5px;
      cursor: pointer;
    }
  }

  tr {
    border-bottom: 1px dashed rgba(0, 0, 0, .3);
  }
}

.sortTable-bodyWrapper {
  overflow: auto;

  &::-webkit-scrollbar-thumb {
    background: transparent;
  }

  &:hover::-webkit-scrollbar-thumb {
    background: #d1d1d1;
  }
}

.sortTable-body {
  tr {
    &:nth-child(2n+ 1) {
      background: #fcfcff;
    }

    &:last-child {
      border-bottom: none;
    }
  }
}
</style>
