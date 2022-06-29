<template>
  <a-modal v-model="visible" :footer="null" :closable="false" width="390px" dialogClass="notify-dialog">
    <div>
      <div class="notify-image"></div>
      <div style="padding: 20px 15px; min-height: 180px">
        <p>{{rowData.title}}</p>
        <p style="white-space: pre-wrap" v-html="rowData.content"></p>
      </div>
      <div class="flex flex-center py20">
        <button class="notify-dialog-close-btn" @click="visible = false">我知道了</button>
      </div>
    </div>
  </a-modal>
</template>

<script>
export default {
  name: "previewMsg",
  props: {
    rowData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      visible: false
    }
  }
}
</script>

<style>
.notify-dialog .ant-modal-content {
  border-radius: 12px;
}


.notify-dialog .ant-modal-body {
  padding: 0;
}

</style>

<style lang="scss" scoped>
.notify-image {
  height: 210px;
  background: url("~@/assets/images/notify-img.png") no-repeat left top/contain;
}
.notify-dialog-close-btn {
  height: 55px;
  border-radius: 30px;
  text-align: center;
  width: 215px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  background-color: #46BCA0;
  border: 2px solid #46BCA0;
  &:focus {
    outline: none;
  }
  &:hover {
    background-color: #fefefe;
    color: #46BCA0;
  }
}
</style>
