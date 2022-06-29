<template>
  <div class="y-pagination flex flex-start py5 px10 text-xs">
    <a-icon type="vertical-right" class="mr5" :class="{disabled: isFirst}" @click="handleFirstClick"></a-icon>
    <a-icon type="left" class="mr10" :class="{disabled: isFirst}" @click="handlePrevClick"></a-icon>
    <div style="margin-right: 20px">
      <input type="text" class="page-input" oninput="value=value.replace(/[^\d]/g, '')"
             :value="pagination.page" @blur="handleBlur">
      <span class="mx15">/</span>
      {{ pagination.total ? this.totalPage : 0 }}
    </div>
    <a-icon type="right" class="mr5" :class="{disabled: isLast}" @click="handleNextClick"></a-icon>
    <a-icon type="vertical-left" :class="{disabled: isLast}" @click="handleLastClick"></a-icon>
    <span class="ml10">
      [{{ (pagination.page - 1) * pagination.pageSize + 1}}
      -
      {{Math.min(pagination.page * pagination.pageSize, pagination.total)}}
      /{{pagination.total}}]
    </span>
  </div>
</template>

<script>
export default {
  name: 'YPagination',
  props: {
    pagination: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    isFirst() {
      return this.pagination.page === 1
    },
    isLast () {
      return this.pagination.page === Math.ceil(this.pagination.total / (this.pagination.pageSize || 10))
    },
    totalPage() {
      return Math.ceil(this.pagination.total / (this.pagination.pageSize || 10))
    }
  },
  created () {
    if(!this.pagination.page) {
      this.pagination.page = 1
    }
  },
  methods: {
    handleBlur(e) {
      const v = parseInt(e.target.value)
      const totalPage = this.totalPage
      this.pagination.page = v < totalPage ? v : totalPage
      this.$emit('update:pagination', this.pagination)
    },
    handleNextClick() {
      console.log(this.pagination.page);
      if(this.isLast) {
        return
      }
      this.pagination.page = this.pagination.page + 1
      this.$emit('update:pagination', this.pagination)
    },
    handleLastClick() {
      this.pagination.page = this.totalPage
      this.$emit('update:pagination', this.pagination)
    },
    handleFirstClick() {
      this.pagination.page = 1
      this.$emit('update:pagination', this.pagination)
    },
    handlePrevClick() {
      if(this.isFirst) {
        return
      }
      this.pagination.page = this.pagination.page - 1
      this.$emit('update:pagination', this.pagination)
    }
  }
}
</script>

<style lang="scss" scoped>
.y-pagination {
  background: #f5faff80;
  user-select: none;
  .page-input {
    border: 0;
    outline: 0;
    text-align: center;
    width: 60px;
    background: transparent;
    font-size: 12px;
    &:focus {
      box-shadow: 0 0 0.1875rem #29b758;
    }
  }
  .anticon {
    cursor: pointer;
  }
  .anticon.disabled {
    cursor: not-allowed;
    color: #b9b9b9;
    pointer-events: none;
  }
}
</style>
