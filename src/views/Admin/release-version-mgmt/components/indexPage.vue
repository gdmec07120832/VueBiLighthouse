<template>
  <div class="index-page">
    <div class="release-title">{{ detail.coverTitle }}</div>
    <div class="release-version-name">
      <span>{{ detail.versionName }}</span>
    </div>
    <div class="release-desc">{{ detail.descText }}</div>
  </div>
</template>

<script>
export default {
  name: 'indexPage',
  props: {
    detail: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style lang="scss" scoped>
.index-page {
  position: relative;
  height: 520px;
  background: url("~@/assets/images/release-notice/index-bg.png") no-repeat center center / cover;

  .release-title {
    font-size: 44px;
    font-weight: 500;
    text-align: center;
    padding-top: 150px;
  }

  .release-desc {
    width: 768px;
    text-align: center;
    color: #474747;
    font-size: 18px;
    margin: 40px auto auto;
    line-height: 1.75;
    word-break: break-all;
  }

  .release-version-name {
    position: relative;
    text-align: center;
    font-size: 18px;
    width: 300px;
    height: 24px;
    margin: 10px auto auto;
    color: rgba(0, 0, 0, .45);

    span {
      position: relative;
      display: inline-block;
      padding: 0 10px;
      z-index: 10;
      background: #fff;
    }

    &:before {
      z-index: 1;
      position: absolute;
      display: block;
      top: 50%;
      content: "";
      width: 100%;
      height: 1px;
      background: #bbb;
    }
  }

}
</style>
