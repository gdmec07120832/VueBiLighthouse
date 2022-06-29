<template>
  <div class="flex-start" v-if="pagination.total !== 0" style="font-size: 12px; line-height: 32px">
    <div class="px5 pager-icon"
         @click="toFirst"
         :class="{disabled: pagination.current === 1}">
      <a-icon type="vertical-right"/>
    </div>
    <div class="px5 pager-icon"
         @click="toPrev"
         :class="{disabled: pagination.current === 1}">
      <a-icon type="left"/>
    </div>
    <div>
      <input class="text-input" type="text" @input="handleInput" @blur="handleBlur" :value="pagination.current">
    </div>
    <div>/</div>
    <div style="margin-left: 6px; margin-right: 18px">{{ lastPage }}</div>
    <div class="px5 pager-icon"
         @click="toNext"
         :class="{disabled: pagination.current === lastPage}">
      <a-icon type="right"/>
    </div>
    <div class="px5 pager-icon"
         @click="toLast"
         :class="{disabled: pagination.current === lastPage}">
      <a-icon type="vertical-left"/>
    </div>
    <div v-if="pagination.total" class="ml10">[{{ currentStart }}-{{ currentEnd }}/{{ pagination.total }}]</div>
  </div>
</template>

<script>
export default {
  name: 'simplePaginator',
  props: {
    pagination: {
      type: Object,
      default: () => ({
        current: 1,
        pageSize: 10,
        total: 0
      })
    }
  },
  computed: {
    lastPage () {
      return Math.ceil(this.pagination.total / this.pagination.pageSize)
    },
    currentStart () {
      const { current, pageSize } = this.pagination
      return pageSize * (current - 1) + 1
    },
    currentEnd () {
      const { current, pageSize, total } = this.pagination
      return total < pageSize * (current) ? total : pageSize * (current)
    }
  },
  methods: {
    handleInput (e) {
      e.target.value = e.target.value.replace(/\D/g, '')
    },
    handleBlur (e) {
      this.$emit('update:pagination', {
        ...this.pagination,
        current: e.target.value
      })
      this.$emit('change')
    },
    toFirst () {
      if (this.pagination.current === 1) {
        return
      }
      this.$emit('update:pagination', {
        ...this.pagination,
        current: 1
      })
      this.$emit('change')
    },
    toPrev () {
      if (this.pagination.current === 1) {
        return
      }
      this.$emit('update:pagination', {
        ...this.pagination,
        current: this.pagination.current - 1
      })
      this.$emit('change')
    },
    toNext () {
      if (this.pagination.current === this.lastPage) {
        return
      }
      this.$emit('update:pagination', {
        ...this.pagination,
        current: this.pagination.current + 1
      })
      this.$emit('change')
    },
    toLast () {
      if (this.pagination.current === this.lastPage) {
        return
      }
      this.$emit('update:pagination', {
        ...this.pagination,
        current: this.lastPage
      })
      this.$emit('change')
    }
  }
}
</script>

<style lang="scss" scoped>
.text-input {
  font-size: 12px;
  text-align: center;
  min-width: 50px;
  width: 50px;
  height: 22px;
  margin: auto 12px;
  background: rgba(250, 250, 250, .6);
  appearance: none;
  outline: none;
  border: 1px solid #fff;

  &:focus {
    box-shadow: 0 0 2px #46BCA0;
  }
}

.pager-icon {
  cursor: pointer;
}

.pager-icon.disabled {
  color: rgb(185, 185, 185)
}
</style>
