<template>
  <div class="flex flex-start">
    <div style="flex-grow: 0; flex-shrink: 0; margin-right: 10px;"
         :style="{ flexBasis: labelWidth || '80px', textAlign: align}">
       <span :class="{required: required}"
             style=" padding-left: 10px">
         {{ label }}</span>
    </div>
    <slot/>
  </div>
</template>

<script>
export default {
  name: 'FieldItem',
  props: {
    required: Boolean,
    labelWidth: String,
    label: String,
    align: String
  }
}
</script>

<style lang="scss" scoped>
.required {
  position: relative;

  &:before {
    content: "*";
    color: red;
    position: absolute;
    left: 0;
    top: 0;
  }
}
</style>
