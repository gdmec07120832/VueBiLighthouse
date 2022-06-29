<template>
  <div>
    <a-input @click="showModal" :value="(value || []).toString()" read-only/>
    <a-modal :visible.sync="visible" title="请选择" @cancel="visible = false" @ok="handleOk" width="660px">
      <a-transfer :data-source="dataSource"
                  :list-style="{
                    width: '285px',
                    height: '350px'
                  }"
                  :render="item => item.title"
                  show-search :filter-option="filterOption"
                  :target-keys="targetKeys" @change="handleChange">

      </a-transfer>
    </a-modal>
  </div>
</template>

<script>
export default {
  name: 'multipleSelect',
  props: {
    value: {
      type: Array,
      default: () => []
    },
    options: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    dataSource () {
      return this.options.map(_ => {
        return {
          key: _.value,
          title: _.label,
        }
      })
    }
  },
  data () {
    return {
      visible: false,
      targetKeys: []
    }
  },
  methods: {
    filterOption (inputValue, option) {
      return (option.title || '').toLowerCase().indexOf(inputValue.toLowerCase()) > -1
    },
    showModal () {
      this.visible = true
      this.targetKeys = this.value
    },
    handleOk () {
      this.$emit('input', this.targetKeys)
      this.visible = false
    },
    handleChange (targetKeys) {
      this.targetKeys = targetKeys
    }
  }
}
</script>

<style scoped>

</style>
