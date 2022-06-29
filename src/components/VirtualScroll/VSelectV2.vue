<template>
  <a-select v-bind="$attrs">
    <div slot="dropdownRender" slot-scope="menu">
      <v-nodes :vnodes="menu"/>
    </div>
    <virtual-list :key="randomKey" ref="virtualList"
                  :data-sources="options"
                  style="max-height: 300px; overflow-y: auto;"
                  :estimate-size="itemHeight" data-key="value"
                  :data-component="ItemComponent"></virtual-list>
  </a-select>
</template>

<script>
import VirtualList from 'vue-virtual-scroll-list'

export default {
  name: 'VSelectV2',
  components: {
    VirtualList,
    VNodes: {
      functional: true,
      render: (createElement, context) => context.props.vnodes
    }
  },
  props: {
    options: {
      type: Array,
      default: () => [],
    },
    itemHeight: {
      type: Number,
      default: 32
    },
    value: {
      type: [String, Array]
    }
  },
  data () {
    return {
      randomKey: Math.random(),
      ItemComponent: {
        props: {
          index: [Number, String],
          source: {
            type: Object,
            default: () => ({})
          },
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
          emitEvents (value, label) {
            this.dispatch('VSelect', 'itemClick', value, label)
          }
        },
        render () {
          return <a-select-option key={this.source.value} value={this.source.value} label={this.source.label}>
            {this.source.label}
          </a-select-option>
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
