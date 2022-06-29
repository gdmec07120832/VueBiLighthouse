<template>
  <!--  <a-tooltip :visible.sync="show" destroyTooltipOnHide overlayClassName="overflowText-tooltip">-->
  <!--    <template slot="title">-->
  <!--      <slot></slot>-->
  <!--    </template>-->
  <!--    <div class="overflowText-wrapper"-->
  <!--         ref="el"-->
  <!--         @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">-->
  <!--      <slot></slot>-->
  <!--    </div>-->
  <!--  </a-tooltip>-->

  <div class="overflowText-wrapper" ref="el">
    <slot/>
  </div>
</template>

<script>
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'

export default {
  name: 'OverflowTooltip',
  props: {
    lines: {
      type: Number,
      default: 1
    },
    description: String,
  },
  data () {
    return {
      instance: null,
      isOverflow: false,
    }
  },
  watch: {
    isOverflow (v) {
      if (v) {
        this.instance && this.instance.enable()
      } else {
        this.instance && this.instance.disable()
      }
    }
  },
  mounted () {
    this.instance = tippy(this.$refs.el, {
      duration: 0,
      arrow: false,
      content: this.description || this.$refs.el.innerText
    })

    if(!this.description) {
      this.compare()
    }
    window.addEventListener('resize', this.compare)
    this.$once('hook:beforeDestroy', () => {
      window.removeEventListener('resize', this.compare)
    })
  },
  updated () {
    this.instance.setContent(this.description || this.$refs.el.innerText)
    if(!this.description) {
      this.compare()
    }
  },
  methods: {
    compare () {
      const el = this.$refs.el
      this.isOverflow = el.scrollWidth > el.clientWidth
      if (this.isOverflow) {
        this.instance && this.instance.enable()
      } else {
        this.instance && this.instance.disable()
      }
    }
  }
}
</script>

<style lang="scss">
.tippy-content  {
  font-size: 12px;
}

.overflowText-tooltip {
  .ant-tooltip-arrow::before {
    background: #fff;
  }

  .ant-tooltip-inner {
    font-size: 12px;
    background: #fff;
    color: #000;
  }
}
</style>

<style scoped>
.overflowText-wrapper {
  transition: none;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
}
</style>
