<template>
    <Tab ref="tab" style="padding: 0"/>
</template>

<script>
import Tab from '@/views/BIView/PsDashboard/Tabs/AnnualizedTurnover/AnnualizedTurnover.vue'
export default {
    name: 'AnnualizedTurnover',
    components: {
        Tab,
    },
    mounted(){
        let target = this.$refs.tab.$el.children[0].children[0].children[0]
        target.innerText = '库存周转'
    },
    data() {
        return {}
    },
}
</script>

<style lang="scss" scoped>

</style>