<template>
  <div class="flex-start" :style="{flexFlow:  flexFlow}" style="width: 100%">
    <a-input :value="value" v-if="inputType === 'input'" style="flex: 1"
             @change="onChange" :maxLength="max" v-bind="$attrs"/>
    <a-textarea :value="value" v-if="inputType === 'textarea'" :autoSize="{minRows: 5}" style="flex: 1"
                @change="onChange"
                :maxLength="max" v-bind="$attrs"/>
    <span ref="countTip" :style="{alignSelf: flexFlow === 'column' ? 'flex-end' : 'center'}"
          style="flex: 0 0 auto; margin-left: 10px; color: rgba(0, 0, 0, .25); font-size: 12px">
      <span v-if="value">({{ (value || '').length }}) /</span>
      {{ `${min}-${max}字` }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'CountInput',
  props: {
    inputType: {
      type: String,
      default: 'input'
    },
    flexFlow: {
      type: String,
      default: 'row'
    },
    value: String,
    min: Number,
    max: Number,
  },
  watch: {},
  methods: {
    handleInput (e) {
      console.log(e, 'input')
      // this.$emit('input', e.target.value)
    },
    onChange (e) {
      this.$emit('input', e.target.value)
    }
  }
}
</script>

<style scoped>

</style>
