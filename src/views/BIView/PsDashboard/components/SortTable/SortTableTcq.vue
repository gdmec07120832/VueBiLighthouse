<template>
  <div>
    <div class="Table_Title">
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
    </div>

    <div :style="bodyStyle" class="sortTable-bodyWrapper">
      <table class="sortTable sortTable-body" :style="{tableLayout: tableLayout}">
        <TotalRow v-if="totalRow.render" v-bind="totalRow" />
        <tr :style="{height: trHeight}" v-for="(row,index) in dataSource" :key="row[rowKey]">
          <td v-for="col in columns" :align="col.align || 'center'" :width="col.width" :key="col.dataIndex" 
            @mouseenter="mouseenter(col.dataIndex, index)"               
            :style="[
              {
                background:
                  (curRow === index) || (curCol === col.dataIndex) ? hoverColor : null,
              },]">
            <Cell :row="row" :cellProp="col.dataIndex" :render="col.render"  />
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
  components: { OverflowTooltip, 
  Cell, 
  TotalRow 
  },
  data () {
    return {
      hoverColor: 'rgba(135,206,250, 0.2)',
      curRow: null,
      curCol: null,
    }
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
    },

    mouseenter(col, row) {
      this.curCol = col
      this.curRow = row
    },

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

// .sortTable-body {
//   tr {
//     &:nth-child(2n+ 1) {
//       background: #fcfcff;
//     }

//     &:last-child {
//       border-bottom: none;
//     }
//   }
// }

.sortTable-body {
  tr {

    td {
      border: 1px solid #e7e9f0;
      border-top: 0px;

      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    tr:nth-child(2n) {
      background-color: #fcfcff;
    }

  }
}

.sortTable-head{

  tr {
    background-color: #f5f7ff;
    // border: 1px solid #e7e9f0;
    td{
      border: 1px solid #e7e9f0;
    }
  }

}

.Table_Title{
  padding-right: 8px;
}
</style>
