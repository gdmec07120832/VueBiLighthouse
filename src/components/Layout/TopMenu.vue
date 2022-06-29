<template>
  <div class="top-menu-wrapper">
    <div class="prev" :class="{inactive: currentScrollLeft === 0}" v-if="isOverflow" @click="prevClick">
      <a-icon type="left"/>
    </div>
    <div class="next" :class="{inactive: currentScrollLeft === maxScrollLeft}" v-if="isOverflow" @click="nextClick">
      <a-icon type="right"/>
    </div>
    <div class="menu-item-container flex-start" ref="menuContainer">
      <div class="main-menu--item"
           v-for="m in menus" :key="m.id"
           @click="handleItemClick(m)"
           :class="{active: current.id === m.id}">
        {{ m.cnName }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TopMenu',
  props: {
    menus: {
      type: Array,
      default: () => []
    },
    current: Object
  },
  data () {
    return {
      isOverflow: false,
      maxScrollLeft: 0,
      currentScrollLeft: 0,
      currentIndex: 0,
      offsets: []
    }
  },
  mounted () {
    const ob = new MutationObserver(() => {
      this.calcOffset()
      this.calcOverflow()
    })
    const wrap = this.$refs.menuContainer
    ob.observe(wrap, {
      childList: true,
      subtree: true
    })
    this.calcOffset()
    this.calcOverflow()

    window.addEventListener('resize', this.calcOverflow)
    this.$on('hook:beforeDestroy', () => {
      window.removeEventListener('resize', this.calcOverflow)
    })
  },
  methods: {
    handleItemClick (item) {
      this.$emit('itemClick', item)
    },
    calcOffset () {
      const wrap = this.$refs.menuContainer
      const els = wrap.querySelectorAll('.main-menu--item')
      const offsets = Array.prototype.map.call(els, (el) => {
        return el.offsetLeft
      })

      this.offsets = offsets.map(_ => {
        return _ - 20
      }).filter((_, index) => {
        return index % 2 === 0
      })
      console.log(this.offsets)
    },
    calcOverflow () {
      const wrap = this.$refs.menuContainer
      this.isOverflow = wrap.clientWidth < wrap.scrollWidth
      if (this.isOverflow === false) {
        //
        this.maxScrollLeft = 0
      } else {
        this.maxScrollLeft = wrap.scrollWidth - wrap.clientWidth
      }

      wrap.scrollTo({ left: 0, behavior: 'smooth' })
      this.currentScrollLeft = 0
      this.currentIndex = 0
    },
    prevClick () {
      if (this.currentScrollLeft === 0) {
        console.log('已经滚动到最左')
        return
      }

      const wrap = this.$refs.menuContainer
      this.currentIndex = this.currentIndex - 1
      const left = this.offsets[this.currentIndex]
      this.currentScrollLeft = left
      wrap.scrollTo({
        left,
        behavior: 'smooth'
      })
    },
    nextClick () {
      if (this.currentScrollLeft === this.maxScrollLeft) {
        console.log('已经滚动到最右')
        return
      }

      const wrap = this.$refs.menuContainer
      this.currentIndex = this.currentIndex + 1
      const left = this.offsets[this.currentIndex]
      const actLeft = Math.min(left, this.maxScrollLeft)
      this.currentScrollLeft = actLeft
      wrap.scrollTo({
        left: actLeft,
        behavior: 'smooth'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.top-menu-wrapper {
  position: relative;
  padding: 0 20px;
  flex: 1;
  overflow: hidden;

  .prev, .next {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 20px;
    text-align: center;
    line-height: 50px;
    height: 50px;
    color: #fff;
    cursor: pointer;
    background: var(--top-nav-bg-color);
    z-index: 10;

    &.inactive {
      cursor: default;
      box-shadow: none;
      opacity: 0;
    }
  }

  .prev {
    left: 0;
    box-shadow: 6px 0 6px -4px rgba(0, 0, 0, .15);
  }

  .next {
    right: 0;
    box-shadow: -6px 0 6px -4px rgba(0, 0, 0, .15);
  }
}

.menu-item-container {
  overflow: hidden;
}


.main-menu--item {
  position: relative;
  font-size: 14px;
  margin-right: 15px;
  color: #fff;
  padding: 0 15px;
  line-height: 50px;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;

  &.active {
    font-weight: bold;

    &:after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: #fff;
    }
  }
}
</style>
