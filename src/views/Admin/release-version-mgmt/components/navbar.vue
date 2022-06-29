<template>
  <div class="release-modal-navbar">
    <div class="prev-icon" :class="{disabled: current === 0}" @click="handlePrev">
      <a-icon type="left-circle"/>
    </div>
    <div class="navbar-items" ref="navItemsWrapper">
      <div class="nav-item"
           v-for="(item, index) in navItems"
           :key="index"
           @click="changeIndex(index)"
           :class="{active: current === index}">
        {{ item }}
        <span class="len-indicator" v-show="current === index">{{ index + 1 }}/{{ navItems.length }}</span>
      </div>
    </div>
    <div class="next-icon" :class="{disabled: current === navItems.length -1}" @click="handleNext">
      <a-icon type="right-circle"/>
    </div>
  </div>
</template>

<script>


export default {
  name: 'navbar',
  props: {
    current: {
      type: Number,
      default: 0
    },
    navItems: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      itemsWrapperWidth: 0,
      itemWidth: 0
    }
  },
  watch: {
    current (val) {
      const a = ((val + 1) * this.itemWidth) - this.itemsWrapperWidth
      this.$refs.navItemsWrapper.scrollTo({
        left: a,
        behavior: 'smooth'
      })
    }
  },
  mounted () {
    this.itemsWrapperWidth = this.$refs.navItemsWrapper.clientWidth
    this.itemWidth = this.$refs.navItemsWrapper.children[0].clientWidth
  },
  methods: {
    changeIndex (index) {
      this.$emit('update:current', index)
    },
    handlePrev () {
      if (this.current > 0) {
        this.$emit('update:current', this.current - 1)
      }
    },
    handleNext () {
      if (this.current < this.navItems.length - 1) {
        this.$emit('update:current', this.current + 1)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.release-modal-navbar {
  display: flex;
  width: 100%;

  .prev-icon, .next-icon {
    text-align: center;
    font-size: 30px;
    color: #979797;
    width: 54px;
    line-height: 60px;
    cursor: pointer;

    &.disabled {
      cursor: not-allowed;
      color: rgba(0, 0, 0, .1);
    }
  }

  .navbar-items {
    position: relative;
    display: flex;
    flex: 1;
    border-left: 1px solid #a6a6a660;
    border-right: 1px solid #a6a6a660;
    overflow: hidden;

    .nav-item {
      position: relative;
      min-width: 155px;
      z-index: 10;
      flex: 1;
      text-align: center;
      line-height: 60px;
      height: 60px;
      font-size: 15px;
      color: rgba(0, 0, 0, .45);
      cursor: pointer;
      transition: all .5s;

      &.active {
        color: #fff;

        &:before {
          background: #46BCA0;
        }

        &:after {
          background: #46BCA0;
        }
      }

      .len-indicator {
        position: absolute;
        font-size: 12px;
        bottom: 8px;
        left: 50%;
        line-height: 1;
        transform: scale(.95) translateX(-50%);
      }

      &:last-child:after {
        content: "";
        position: absolute;
        right: -23px;
        left: 90px;
        z-index: -1;
        top: 0;
        bottom: 0;
      }

      &:first-child:after {
        content: "";
        position: absolute;
        left: -23px;
        right: 90px;
        z-index: -1;
        top: 0;
        bottom: 0;
      }

      &:before {
        position: absolute;
        z-index: -1;
        content: "";
        transform: skew(18deg);
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        border-right: 1px solid #a6a6a660;
      }

      &:last-child:before {
        border-right: none;
      }
    }
  }
}
</style>
