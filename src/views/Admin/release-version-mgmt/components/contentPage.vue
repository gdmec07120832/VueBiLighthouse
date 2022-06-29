<template>
  <div class="content-page">
    <img v-if="!detail.descText && detail.imgUrl"
         class="only-screenshot" :src="detail.imgUrl" alt="">
    <div class="content-inner-wrapper" v-else>
      <div class="release-content-left">
        <div class="release-content-reportName">{{ detail.reportName }}</div>
        <div class="release-content-dataValue">{{ detail.dataValue }}</div>
        <div class="release-content-descText" style="color: #474747">
          <div style="text-indent: -7px">【功能介绍】</div>{{ detail.descText }}
        </div>
        <div class="mt20" style="color: #474747" v-if="detail.menuAbsolutePath">
          <div style="text-indent: -7px">【路径指引】</div>
          {{ detail.menuAbsolutePath }}
        </div>
      </div>
      <div class="release-content-right">
        <img v-if="detail.imgUrl"
             class="release-content-screenshot" :src="detail.imgUrl" alt="screenshot"/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'contentPage',
  props: {
    detail: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style lang="scss" scoped>
.content-page {
  display: flex;
  align-items: center;
  height: 520px;
  background: url("~@/assets/images/release-notice/content-bg.png") no-repeat center center / cover;

  .only-screenshot {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .content-inner-wrapper {
    width: 80%;
    display: flex;
    margin: auto;

    .release-content-left {
      display: flex;
      flex-flow: column;
      justify-content: center;
      flex: 0 0 350px;
      padding-right: 5%;

      .release-content-reportName {
        font-size: 30px;
        line-height: 38px;
        margin-bottom: 15px;
        font-weight: 500;
      }

      .release-content-dataValue {
        font-size: 18px;
        font-weight: 500;
        color: #474747;
        line-height: 26px;
        margin-bottom: 20px;
      }

      .release-content-descText {
        font-size: 14px;
        color: rgba(0, 0, 0, .65);
        line-height: 22px;
        white-space: pre-wrap;
      }
    }

    .release-content-right {
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: flex-end;

      .release-content-screenshot {
        width: 560px;
        //height: 374px;
        border-radius: 10px;
        background: #fff;
        max-height: 520px;
        box-shadow: 0 10px 15px -4px rgba(0, 0, 0, 0.04), 0 9px 16px 8px rgba(0, 0, 0, .05);
        object-fit: contain;
      }
    }
  }
}
</style>
