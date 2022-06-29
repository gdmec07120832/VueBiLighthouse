<template>
    <a-pagination
    :current="page"
    :pageSize="pageSize"
    :total="total"
    @change="change"
    @showSizeChange="showSizeChange"
    :showTotal="total => `共${total}条, 第${page}页`"
    :pageSizeOptions="pageSizeOptions"
    show-size-changer
    style="display: flex;align-items: center;justify-content: flex-end"
    />
</template>

<script>
export default {
    props: {
        page: {
            type: Number,
            default: 1,
        },
        pageSize: {
            type: Number,
            default: 10,
        },
        total: {
            type: Number,
            default: 0,
        },
        pageSizeOptions: {
            type: Array,
            default() {return ['10', '20', '30', '50', '100']}
        },
    },
    data() {
        return {

        }
    },
    methods: {
        change(page, pageSize) {
            this.$emit('update:page', page)
        },
        showSizeChange(current, size) {
            this.$emit('update:pageSize', size)
        },
    }
}
</script>

<style lang="scss" scoped>

</style>