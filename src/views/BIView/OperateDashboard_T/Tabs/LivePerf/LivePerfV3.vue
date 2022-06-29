<template>
    <LivePerfV3 class="v3"/>
</template>

<script>
import LivePerfV3 from '../../../PsDashboard/Tabs/LivePerf/LivePerfV3'
export default {
    components: {
        LivePerfV3
    },
    data() {
        return {

        }
    }
}
</script>

<style lang="scss" scoped>
.v3{
    /deep/ .topBox{
        padding: 0!important;
    }
    /deep/ .parent{
        padding: 0!important;
    }
}
</style>