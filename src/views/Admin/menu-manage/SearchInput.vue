<template>
  <div class="flex">
    <a-input
      style="width: 300px"
      :placeholder="query.status === '1' ? '输入报表/菜单名称或主编码' : '输入报表名称或主编码'"
      v-model="query.keyword"
      allow-clear
      @keyup.enter.native="search"
    />
    <a-select v-model="query.status" style="width: 100px; flex: none; margin-left: 10px">
      <a-select-option value="1">全部</a-select-option>
      <a-select-option value="2">已上架</a-select-option>
      <a-select-option value="3">已下架</a-select-option>
    </a-select>
    <a-button class="ml10" @click="search">搜索</a-button>
  </div>
</template>

<script>
export default {
  name: 'SearchInput',
  props: ['placeholder'],
  data() {
    return {
      query: { keyword: '', status: '1' },
    }
  },
  methods: {
    clear() {
      this.query.keyword = ''
    },
    search() {
      this.$emit('search', this.query)
    },
  },
}
</script>

<style scoped></style>
