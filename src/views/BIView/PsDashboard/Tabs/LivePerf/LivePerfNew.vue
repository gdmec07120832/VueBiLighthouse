<template>
  <div class="Test">
    <LivePerfV2 />
  </div>
</template>

<script>
import LivePerfV2 from '@/views/BIView/OperateDashboard/Tabs/LivePerf/LivePerf'
export default {
  name: 'LivePerfNew',
  components: {
    LivePerfV2,
  },
}
</script>

<style lang="scss" scoped>
.Test{
    padding: 0px 15px;
}
</style>