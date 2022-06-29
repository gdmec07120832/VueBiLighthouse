<template>
    <Tab ref="tab" style="padding: 0"/>
</template>

<script>
import Tab from '@/views/BIView/PsDashboard/Tabs/BadAfterSale/BadAfterSale.vue'
export default {
    name: 'BadAfterSale',
    components: {
        Tab,
    },
    mounted(){
        let target = this.$refs.tab.$el.children[0].children[0].children[0]
        target.innerText = '售后不良'
    },
    data() {
        return {}
    },
}
</script>

<style lang="scss" scoped>

</style>