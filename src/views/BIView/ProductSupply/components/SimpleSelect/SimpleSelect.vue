<template>
  <div class="flex flex-start">
    <label style="margin-right: 5px; font-size: 12px" :style="labelWidth">{{ label }}</label>
    <div class="flex flex-start" style="flex: 1; align-items: stretch; position: relative">
      <input type="text" class="simple-select-input" readonly :value="value" @click="showBox">
      <span @click="showBox" class="drop-down-button">
        <a-icon type="down" class="drop-down-icon"/>
      </span>
      <div class="simple-select-box" style="position: absolute;" v-show="show" v-click-outside="hideBox">
        <div v-for="(item, index) in options" :key="index"
             @click="selectItem(item)"
             class="box-item"
             :class="{selected: item === value}"
             style="padding: 3px 8px; font-size: 12px; cursor: pointer">{{ item }}
        </div>
      </div>
    </div>
  </div>
</template>d

<script>
import ClickOutside from 'vue-click-outside'

export default {
  name: 'SimpleSelect',
  directives: {
    ClickOutside
  },
  props: {
    labelWidth: {
      type: Object,
      default: () => ({flex: '0 0 auto'})
    },
    label: {
      default: '',
      type: String
    },
    options: {
      type: Array,
      default: () => []
    },
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      show: false
    }
  },
  methods: {
    hideBox () {
      if (this.show) {
        this.show = false
      }
    },
    showBox () {
      setTimeout(() => {
        this.show = true
      })
    },
    selectItem (item) {
      this.$emit('input', item)
      this.show = false
    }
  }
}
</script>

<style scoped lang="scss">
.simple-select-input {
  font-size: 12px;
  padding: 0 24px 0 6px;
  border: 1px solid rgba(0, 0, 0, .15);
  border-radius: 2px;
  height: 32px;
  min-width: 180px;
  cursor: pointer;
  color: rgba(0, 0, 0, .65);

  &:focus {
    outline: none;
  }
}

.simple-select-box {
  width: 100%;
  top: 32px;
  background: #fff;
  max-height: 160px;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 999;
  border: 1px solid #ccc;

  .box-item {
    line-height: 32px;
    height: 32px;

    &:hover {
      background: rgba(0, 0, 0, .04);
    }

    &.selected {
      background: rgba(0, 0, 0, .15);
    }
  }
}

.drop-down-button {
  display: inline-block;
  position: absolute;
  right: 0;
  width: 24px;
  text-align: center;
  cursor: pointer;
  height: 32px;
  line-height: 32px;
  color: rgba(0, 0, 0, .25);
  padding: 0 5px;
  box-sizing: content-box;

  /deep/ .drop-down-icon {
    transform: scaleX(1.2);
  }
}

//.drop-down-icon{
//  font-size: 12px; color: #999;
//}
</style>
