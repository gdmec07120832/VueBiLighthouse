<template>
  <div class="flex flex-between mr20 text-xs select-container" ref="container" style="width: 100%; position: relative;">
    <div class="flex flex-start" style="overflow: hidden" :style="labelWidth">
      <span style="font-size: 12px">{{ label }}:</span>
    </div>
    <a-tooltip placement="bottomRight"
               :getPopupContainer="getPopupContainer"
               :overlayStyle="{minWidth: selectTriggerWidth ? selectTriggerWidth + 'px' : 'auto'}"
               overlayClassName="light-tooltip-select"
               trigger="click">
      <template slot="title">
        <div :style="{minWidth: boxWidth}">
          <div style="height: 32px; padding: 0 6px; margin-top: 5px" v-if="filterable">
            <input type="text" class="select-filter" placeholder="输入关键字查找"
                   style="font-size: 12px; width: 100%; color: #999; height: 30px;line-height: 30px"
                   @keyup="handleFilter">
          </div>
          <div style="margin-top: 5px">
            <a-checkbox-group v-model="query" style="width: 100%">
              <virtual-list ref="virtualList" style="max-height: 200px; overflow-y: auto; overflow-x: hidden"
                            :data-component="ItemComponent"
                            data-key="label"
                            :data-sources="filteredOptions"></virtual-list>
            </a-checkbox-group>
          </div>
        </div>
      </template>

      <div ref="selectTrigger" style="height: 32px; flex: 1; margin-left: 10px;
      padding-left: 6px; padding-right: 32px;
      color: rgba(0, 0, 0, .65);
      line-height: 32px; border: 1px solid rgba(0, 0, 0, .15); border-radius: 2px; cursor: pointer">
        <div style="flex: 1; overflow: hidden">
          <span class="nowrap" v-if="query.length">{{ query.join('; ') }}</span>
        </div>
      </div>
      <span v-if="value.length"
            :style="{opacity: query.length ? 1 : 0, pointerEvents: query.length ? 'inherit' : 'none'}"
            class="mx10" style="top: 0; right: 0; line-height: 32px;
            cursor: pointer; position: absolute" title="清空" @click="clearValue">
        <a-icon type="close-circle" style="color: #999"></a-icon>
        </span>
      <div class="dropdown-button" v-if="!value.length">
        <a-icon type="down" class="drop-down-icon"/>
      </div>
    </a-tooltip>
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
import VirtualList from 'vue-virtual-scroll-list'

export default {
  name: 'VirtualSelect',
  components: { VirtualList },
  provide () {
    return {
      multiple: this.multiple,
      name: Math.random().toString(36).slice(-8)
    }
  },
  props: {
    labelWidth: {
      type: Object,
      default: () => ({ flex: '0 0 auto' })
    },
    filterable: {
      type: Boolean,
      default: true
    },
    boxWidth: {
      type: String,
      default: '200px'
    },
    multiple: {
      type: Boolean,
      default: true
    },
    value: {
      type: [Array, String, Number],
      default: () => []
    },
    label: {
      type: String,
      default: ''
    },
    options: {
      type: Array,
      default: () => [],
    }
  },
  watch: {
    value: {
      immediate: true,
      handler (val) {
        if (this.multiple) {
          this.query = val
          this.dataOptions.forEach(item => {
            item.checked = val.indexOf(item.label) > -1
          })
        } else {
          this.query = [val];
          (this.dataOptions.find(item => item.label === val) || {}).checked = true
        }
      }
    },
    options: {
      handler (val, oldVal) {
        if (JSON.stringify(val) === JSON.stringify(oldVal)) {
          return
        }
        this.dataOptions = this.options.map(_ => {
          return {
            label: _.label,
            checked: this.value.indexOf(_.label) > -1 ? true : _.checked || false
          }
        })
        const indexes = []
        this.value.forEach((label, index) => {
          const find = this.dataOptions.find(_ => _.label === label)
          if (!find) {
            indexes.push(index)
          }
        })
        const value = this.value.filter((_, index) => {
          return indexes.indexOf(index) < 0
        })
        this.$emit('input', value)
        this.filteredOptions = this.dataOptions.slice()
      },
      immediate: true
    }
  },
  created () {
    this.$on('SelectItemClick', (source) => {
      if (this.multiple === false) {
        this.filteredOptions.forEach(item => {
          item.checked = false
        })
        this.query = [this.value]
        source.checked = true
        this.$emit('input', source.label)
        return
      }
      source.checked = !source.checked
      const index = this.value.indexOf(source.label)
      if (source.checked) {
        if (index === -1) {
          this.value.push(source.label)
        }
      } else {
        if (index > -1) {
          this.value.splice(index, 1)
        }
      }
      this.query = this.value
      this.$emit('input', this.value)
    })
  },
  data () {
    return {
      selectTriggerWidth: 0,
      query: [],
      dataOptions: [],
      filteredOptions: [],
      ItemComponent: {
        name: 'virtualListItem',
        inject: ['multiple', 'name'],
        props: {
          source: {
            type: Object,
            default: () => ({})
          }
        },
        methods: {
          dispatch (componentName, eventName, ...rest) {
            let parent = this.$parent || this.$root
            let name = parent.$options.name

            while (parent && (!name || name !== componentName)) {
              parent = parent.$parent
              if (parent) {
                name = parent.$options.name
              }
            }

            if (parent) {
              parent.$emit.apply(parent, [eventName].concat(rest))
            }
          },
          emitEvents (source) {
            this.dispatch('VirtualSelect', 'SelectItemClick', source)
          }
        },
        render () {
          return (
              <div style="font-size: 12px">
                <input class="custom-checkbox" name={this.name} type={this.multiple ? 'checkbox' : 'radio'}
                       checked={this.source.checked}/>
                <label class="custom-checkbox-label" title={this.source.label} onClick={(e) => {
                  e.preventDefault()
                  this.emitEvents(this.source)
                }}
                       style="display: block; cursor: pointer; padding: 0 6px;border-bottom: 1px solid #e4e4e4;"
                       key={this.source.label}>
                  {this.source.label}
                </label>
              </div>
          )
        }
      },
    }
  },
  mounted () {
    this.selectTriggerWidth = this.$refs['selectTrigger'].clientWidth
    console.log(this.selectTriggerWidth)
  },
  methods: {
    clearValue () {
      this.$emit('input', this.multiple ? [] : '')
    },
    getPopupContainer () {
      return this.$refs['container']
    },
    handleFilter: debounce(function (e) {
      const v = e?.target?.value
      this.filteredOptions = this.dataOptions.filter(op => {
        return op?.label?.toString().indexOf(v) > -1
      })
      this.$refs['virtualList'].reset()
    }, 100)
  },
}
</script>

<style lang="scss">
.custom-checkbox-label {
  position: relative;
  white-space: nowrap;

  &:before {
    content: "";
    display: inline-block;
    width: 14px;
    height: 14px;
    border-radius: 2px;
    vertical-align: top;
    margin-right: .5em;
    margin-top: 2px;
    border: 1px solid #ccc;
    background-color: #fff;
    transition: border-color .2s ease-in-out, background-color .2s ease-in-out;
  }

  &:after {
    content: "";
    display: inline-block;
    width: 4px;
    height: 8px;
    border: 1px solid #fff;
    border-top: 0;
    border-left: 0;
    position: absolute;
    left: 11px;
    top: 5px;
    transform: rotate(45deg) scale(0);
    transition: all .2s ease-in-out;
  }

}

.custom-checkbox[type=checkbox] {
  position: absolute;
  clip: rect(0, 0, 0, 0);

  &:checked {
    + label:before {
      border-color: #39ad36 !important;
      background-color: #39ad36;
    }

    + label:after {
      transform: rotate(45deg) scale(1);
      transition: all .2s ease-in-out;
    }
  }
}

.custom-checkbox[type=radio] {
  position: absolute;
  clip: rect(0, 0, 0, 0);

  + label:before {
    border-radius: 50%;
  }

  &:checked {
    + label:before {
      border-color: #39ad36 !important;
      background-color: #39ad36;
    }

    + label:after {
      width: 6px;
      height: 6px;
      border-radius: 6px;
      background: #fff;
      transform: scale(1);
      border: 0;
      left: 10px;
      top: 6px;
    }
  }
}

.select-container > span {
  flex: 1;
  width: 0;
}
</style>

<style lang="scss" scoped>
.dropdown-button {
  position: absolute;
  cursor: pointer;
  top: 0;
  right: 10px;
  line-height: 32px;
  height: 32px;

  .drop-down-icon {
    transform: scaleX(1.2);
    color: rgba(0, 0, 0, .15);
  }
}

.select-filter {
  appearance: none;
  outline: none;
  border: 1px solid #e4e4e4;
}
</style>
