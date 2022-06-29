<template>
  <label class="flex flex-start">
    <span class="nowrap y-input-label">{{ label }}:</span>
    <input :value="value" @change="handleChange" @keyup="handleKeyUp" type="text" class="y-input" placeholder="输入文本...">
    <div style="width: 32px; height: 32px; border: 1px solid rgba(0, 0, 0, .15); border-left: 0; border-radius: 0 2px 2px 0;
    color: rgba(0, 0, 0, .25); cursor: pointer;
    line-height: 32px; padding: 0 9px" v-if="showSuffix" @click="handleSearch">
      <a-icon type="search"/>
    </div>
  </label>
</template>

<script>
export default {
  name: 'YInput',
  props: {
    showSuffix: Boolean,
    label: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    }
  },
  methods: {
    handleSearch () {
      this.$emit('input', this.value)
    },
    handleChange (e) {
      this.value = e.target.value
    },
    handleKeyUp (e) {
      this.value = e.target.value
      if (e.keyCode === 13) {
        this.$emit('input', e.target.value)
      }
      this.$emit('keyup')
    }
  }
}
</script>

<style scoped>
.y-input-label {
  font-size: 12px;
  margin-right: 10px;
}

.y-input {
  outline: none;
  height: 32px;
  line-height: 32px;
  border: 1px solid #e4e4e4;
  flex: 1;
  font-size: 12px;
  border-radius: 2px;
  padding: 0 6px;
}
</style>
