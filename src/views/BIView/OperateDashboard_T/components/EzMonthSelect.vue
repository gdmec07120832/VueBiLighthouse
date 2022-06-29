<template>
  <a-tooltip v-model="visible"
             placement="bottomRight" overlayClassName="light-tooltip" trigger="click">
    <template slot="title">
      <div class="text-black ez-month-selector">
        <div class="ez-month-selector__head flex flex-between text-center" style="line-height: 30px">
          <div @click="onPageChange('prev')" style="width: 40px; color: rgba(0, 0, 0, .45)">
            <a-icon type="double-left"/>
          </div>
          <div style="flex: 1; font-weight: bold; font-size: 14px; color: rgba(0, 0, 0, .85)"
               @click="showYearPicker"
               :style="{background: !yearPicker && (selectingYear || currentYear) === (new Date().getFullYear())}">
            {{ yearPicker ? `${yearPickerRange[0]}-${yearPickerRange.slice(-1)[0]}` : (selectingYear || currentYear) + '年' }}
          </div>
          <div @click="onPageChange('next')" style="width: 40px; color: rgba(0, 0, 0, .45)">
            <a-icon type="double-right"/>
          </div>
        </div>
        <div v-if="!yearPicker" class="month-picker flex flex-between">
          <div @click="selectMonth(m)" class="picker-item"
               :class="{active: (selectingYear === currentYear) && (currentMonth === m)}" v-for="m in months" :key="m">
            {{ m }} 月
          </div>
        </div>
        <div v-if="yearPicker" class="year-picker flex flex-between">
          <div @click="selectYear(y)" class="picker-item" :class="{active: currentYear === y}"
               v-for="y in yearPickerRange" :key="y">{{ y }}
          </div>
        </div>
      </div>
    </template>
    <div ref="tooltipTrigger" style="position: relative">
      <slot></slot>
    </div>
  </a-tooltip>
</template>

<script>
import moment from 'moment'

export default {
  name: 'EzMonthSelect',
  props: {
    value: {
      type: Date,
      default: (new Date())
    },
  },
  data () {
    return {
      visible: false,
      yearPicker: false,
      yearRangeIndex: 0,
      yearPickerRange: [],
      months: Array(12).fill(null).map((a, b) => b + 1),
      currentValue: undefined,
      selectingYear: ''
    }
  },
  computed: {
    currentYear () {
      return this.value.getFullYear()
    },
    currentMonth () {
      return this.value.getMonth() + 1
    }
  },
  watch: {
    value: {
      handler (val) {
        this.yearRangeIndex = this.getYearRangeIndex(moment(val).year())
      },
      immediate: true
    },
    yearRangeIndex: {
      handler (val) {
        this.yearPickerRange = this.getYearRangeByIndex(val)
      },
      immediate: true
    }
  },
  created () {
    this.selectingYear = this.currentYear
  },
  methods: {
    getYearRangeIndex (year) {
      return Math.ceil(year / 12) - 1
    },
    getYearRangeByIndex (index) {
      return Array(12).fill(null).map((a, b) => {
        return (12 * index) + b + 1
      })
    },
    showYearPicker () {
      this.yearPicker = true
    },
    selectYear (y) {
      this.selectingYear = y
      this.yearPicker = false
    },
    selectMonth (m) {
      const date = moment(`${this.selectingYear}-${m}`).toDate()
      this.$emit('input', date)
      this.$emit('change', date)
      this.visible = false
    },
    onPageChange (ac) {
      const map = {
        prev: -1,
        next: 1
      }
      if (this.yearPicker) {
        this.yearRangeIndex = this.yearRangeIndex + map[ac]
      } else {
        this.selectingYear = this.selectingYear + map[ac]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.ez-month-selector {
  margin: -6px -8px;
  user-select: none;
  border: 1px solid rgba(0, 0, 0, .15);
  border-radius: 4px;
}


.month-picker, .year-picker {
  width: 270px;
  box-sizing: content-box;
  flex-wrap: wrap;

  .picker-item {
    cursor: pointer;
    width: 40px;
    height: 26px;
    margin: 15px 25px;
    text-align: center;
    line-height: 26px;
    border-radius: 2px;

    &:hover {
      background: #f1f9fd;
    }

    &.active {
      color: #fff;
      background: #00b08d;
    }
  }
}

.ez-month-selector__head {
  height: 50px;
  border-bottom: 1px solid rgba(0, 0, 0, .06);

  > div {
    line-height: 50px;
    cursor: pointer;

    &:hover {
      background: #f1f9fd;
    }
  }
}
</style>
