<template>
  <div class="flex" style="flex-wrap: wrap">
    <div class="manager-item">
      <div class="s-module-title">产品（供应/市场）</div>
      <div>风筝（老惠敏）</div>
      <div>18319186017</div>
      <div>laohuimin@linshimuye.com</div>
    </div>
    <div class="manager-item">
      <div class="s-module-title">销售渠道</div>
      <div>语荣（黎志勇）</div>
      <div>15813488962</div>
      <div>lizhiyong@linshimuye.com</div>
    </div>
    <div class="manager-item">
      <div class="s-module-title">仓储物流</div>
      <div>伯兮（汪杰）</div>
      <div>18605885695</div>
      <div>wangjie@linshimuye.com</div>
    </div>
    <div class="manager-item">
      <div class="s-module-title">财务管理</div>
      <div>语荣（黎志勇）</div>
      <div>15813488962</div>
      <div>lizhiyong@linshimuye.com</div>
    </div>
    <div class="manager-item">
      <div class="s-module-title">数字内控</div>
      <div>宁好（潘炜团）</div>
      <div>13726332471</div>
      <div>panweituan@linshimuye.com</div>
    </div>
    <div class="manager-item">
      <div class="s-module-title">平台投诉及建议</div>
      <div>大滨（郑海滨）</div>
      <div style="height: 24px"></div>
      <div>zhenghaibin@linshimuye.com</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'projectManagerList'
}
</script>

<style lang="scss" scoped>
.manager-item {
  position: relative;
  padding: 25px;
  line-height: 2;
  font-size: 12px;
  color: rgba(0, 0, 0, .8);
  flex: 0 0 33.33%;
  max-width: 33.33%;

  &:before {
    content: "";
    position: absolute;
    top: 33px;
    left: 10px;
    width: 4px;
    height: 12px;
    background: #46BCA0;
  }

  .s-module-title {
    color: rgba(0, 0, 0, .9);
    font-size: 14px;
    font-weight: bold;
  }
}
</style>
