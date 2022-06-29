<template>
    <Tab ref="tab" style="padding: 0"/>
</template>

<script>
import Tab from '@/views/BIView/PsDashboard/Tabs/UnsalableAmt/UnsalableAmt.vue'
export default {
    name: 'UnsalableAmt',
    components: {
        Tab,
    },
    mounted(){
        let target = this.$refs.tab.$el.children[0].children[0].children[0].children[0]
        target.innerText = '库龄滞销'
    },
    data() {
        return {}
    },
}
</script>

<style lang="scss" scoped>

</style>