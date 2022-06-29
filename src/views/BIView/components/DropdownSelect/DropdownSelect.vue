<template>
  <div class="flex flex-between">
    <div class="flex-start">
      <span class="text-xs text-gary" :style="labelStyle">{{ label }}</span>
      <div class="selectedText text-xs text-gary">
        <slot name="selectedText"></slot>
      </div>
    </div>
    <div>
      <a-tooltip placement="bottomRight" overlayClassName="light-tooltip" trigger="click">
        <template slot="title">
          <slot name="default"></slot>
        </template>
        <div class="dropdown-icon">
          <a-icon type="double-right" style="color: #079909;transform: rotate(90deg); cursor: pointer"/>
        </div>
      </a-tooltip>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DropdownSelect',
  props: {
    label: {
      type: String,
      required: true
    },
    labelStyle: Object
  }
}
</script>

<style lang="scss" scoped>
.selectedText {
  min-width: 80px;
  text-align: center;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.dropdown-icon {
  display: inline-block;
  width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  background: #fff;
  box-shadow: rgba(10, 30, 51, 0.2) 0 0 5px 0;
  border-radius: 4px;

  &:hover {
    cursor: pointer;

    i {
      opacity: .5;
    }
  }

}
</style>
