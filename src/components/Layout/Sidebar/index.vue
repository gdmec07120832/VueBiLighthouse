<template>
  <div class="Sidebar" id="Sidebar" :style="{
    pointerEvents: show ? 'auto' : 'none'
  }">
    <a-radio-group v-if="show" :style="[{opacity: show ? '1' : '0'}]" v-model="value" @change="change" size="small">
      <a-radio-button value="1" id="MetricExplainTrigger" :disabled="!metricExplainTrigger">
        <explain style="width: 20px;height: 20px;" class="mt10"/>
        <p>指标说明</p>
      </a-radio-button>
      <a-radio-button value="2">
        <all-screen style="width: 20px;height: 20px" class="mt10"/>
        <p>全屏</p>
      </a-radio-button>
      <a-radio-button value="3">
        <callback style="width: 20px;height: 20px" class="mt10"/>
        <p>意见反馈</p>
      </a-radio-button>
    </a-radio-group>
    <a-button v-if="show" :key="1" size="small" class="button" @click="changeShow(false)">
      <right style="width: 10px;height: 10px"/>
    </a-button>
    <a-button v-if="!show" :key="2" size="small" class="buttonClose" @click="changeShow(true)"
              style="box-shadow: 0 2px 12px 0 rgba(100, 101, 102, 0.12); pointer-events: auto">
      <left style="width: 10px;height: 10px"/>
    </a-button>
    <!--   指标说明-->
    <metric-explain-drawer :visible.sync="visible" @toggleMetricExplainTrigger="toggleExplainTrigger" />

    <!--    意见反馈-->
    <a-drawer
      wrapClassName="feedback"
      width="50%"
      :closable="false"
      :visible="visible1"
      @close="onClose"
    >
      <div slot="title" style="font-weight: bold; font-size: 16px; padding-top: 8px;padding-bottom: 8px" class="text-black">
        意见反馈
      </div>
      <template>
        <div class="reportForm">
          <span>报表名称：</span>
          <span>{{ reportName }}</span>
        </div>
        <div class="staff">
          <span>业务负责人：</span>
          <span>{{(curReport && curReport.businessManagerName) || '--'}}</span>
          <span>产品负责人：</span>
          <span>{{(curReport && curReport.productOwnerName) || '--'}}</span>
        </div>
        <div class="input">
          <span>意见反馈：</span>
          <a-textarea v-model="form.message" :maxLength="500" style="width: calc(100% - 140px);display: inline-block;margin-left: 40px" placeholder="请输入意见" :auto-size="{ minRows: 10, maxRows: 10 }" allow-clear/>
        </div>
        <div class="upload">
          <span>图片上传：</span>
          <a-upload
            style="width: calc(100% - 140px);display: inline-block;margin-left: 40px"
            name="files"
            list-type="picture-card"
            class="avatar-uploader"
            accept="image/*"
            :action="action"
            @preview="handlePreview"
            @change="onFileChange"
          >
            <div v-if="form.files.length < 1">
              <a-icon type="plus"/>
              <div class="ant-upload-text">
                上传
              </div>
            </div>
          </a-upload>
        </div>
        <div class="footer-btn">
          <a-button @click="submit">提交</a-button>
          <a-button @click="onClose">取消</a-button>
        </div>
        <a-modal :visible="previewVisible" title="预览" :footer="null" @cancel="handlePreviewCancel">
          <img alt="example" style="width: 100%" :src="previewImage"/>
        </a-modal>
      </template>
    </a-drawer>
  </div>
</template>

<script>
import instance from '@/utils/axios'
import explain from '@/assets/svg/explain.svg'
import left from '@/assets/svg/left.svg'
import right from '@/assets/svg/right.svg'
import callback from '@/assets/svg/callback.svg'
import allScreen from '@/assets/svg/allscreen.svg'
import { mapState } from 'vuex'
import MetricExplainDrawer from '@/components/Layout/Sidebar/components/MetricExplainDrawer/MetricExplainDrawer'

export default {
  name: 'Sidebar',
  components: {
    MetricExplainDrawer,
    explain,
    left,
    right,
    callback,
    allScreen,
  },
  computed: {
    ...mapState('app', ['globalMenuMap']),
    currentBIViewURL() {
      return this.$store.state.app.BIViewURL
    },
    curReport() {
      const menuPath = this.$route.params.menuPath || ''
      const trailId = menuPath.split('_').pop()
      if (trailId) {
        return this.globalMenuMap[Number(trailId)]
      } else {
        return null
      }
    },
    reportName() {
      const menuPath = this.$route.params.menuPath || ''
      const trailId = menuPath.split('_').pop()
      if (trailId) {
        return this.globalMenuMap[Number(trailId)]?.cnName
      } else {
        return ''
      }
    }
  },
  watch: {
    currentBIViewURL: {
      handler() {
        this.visible = false
        this.visible1 = false
      }
    },
  },
  data() {
    return {
      value: null, // sideBar 按钮当前值
      show: true, // sideBar 展开或收起
      visible: false, // 指标说明
      visible1: false, // 意见反馈 drawer
      metricExplainTrigger: true,
      form: {
        message: '',
        files: []
      },
      action: instance.defaults.baseURL + '/api/file/upload',
      previewVisible: false,
      previewImage: '',
    }
  },
  methods: {
    submit() {
      const menuPath = this.$route.params.menuPath || ''
      console.log(this.$store.state.app)
      const trailId = menuPath.split('_').pop()
      this.$axios.post('/api/proposal/saveOrUpdate', {
        description: this.form.message,
        files: this.form.files.filter(file => file.status === 'done').map(file => ({ id: file.response.data[0] })),
        menuId: trailId
      }).then(() => {
        this.$message.success('提交成功')
        this.onClose()
        // this.visible1 = false
      })
    },
    handlePreview(file) {
      this.previewImage = file.thumbUrl
      this.previewVisible = true
    },
    handlePreviewCancel() {
      this.previewVisible = false
    },
    onFileChange({ fileList }) {
      this.form.files = fileList
    },
    requestFull() {
      const el = document.querySelector('#BiViewer')
      if (el.requestFullscreen) {
        el.requestFullscreen()
      } else if (el.webkitRequestFullScreen) {
        el.webkitRequestFullScreen()
      } else if (el.mozRequestFullScreen) {
        el.mozRequestFullScreen()
      } else {
        el.msRequestFullscreen()
      }
    },
    change(e) {
      const val = e.target.value
      let isFullscreen = false
      const handler = () => {
        isFullscreen = document.fullscreenElement !== null
        if (!isFullscreen) {
          this.$emit('update:value', null)
          // document.removeEventListener("fullscreenchange", handler);
        }
      }
      if (val === '1') {
        this.visible = true
        document.removeEventListener('fullscreenchange', handler)
      } else if (val === '2') {
        this.requestFull()
        document.addEventListener('fullscreenchange', handler)
      } else if (val === '3') {
        this.visible1 = true
        document.removeEventListener('fullscreenchange', handler)
      }
      setTimeout(() => {
        this.value = null
      }, 50)
    },
    changeShow(val) {
      this.show = val
    },
    onClose() {
      this.visible = false
      this.visible1 = false
      this.$emit('update:value', null)
    },
    toggleExplainTrigger(v) {
      this.metricExplainTrigger = v
    }
  }
}
</script>

<style lang="scss" scoped>
.feedback {
  /deep/ .ant-drawer-body {
    height: 100%;
  }

  .reportForm {
    margin-top: 20px;
    margin-bottom: 40px;
    span {
      display: inline-block;
      width: 70px;
      font-size: 12px;
    }

    span:nth-child(1) {
      text-align: left;
      font-weight: bold;
      width: 70px;
    }

    span:nth-child(2) {
      margin-left: 20px;
      width: auto;
    }
  }

  .staff {
    margin-bottom: 20px;

    span {
      display: inline-block;
      width: 70px;
      font-size: 12px;
      white-space: nowrap;
    }

    span:nth-child(2n - 1) {
      font-weight: bold;
      text-align: left;
    }

    span:nth-child(2n) {
      margin-left: 20px;
      text-align: left;
    }

    span:nth-child(3) {
      margin-left: 20px;
    }
  }

  .list {
    height: calc(100% - 247px);

    .labels {
      width: calc(100% - 8px);
      height: 50px;
      background: #fafafa;
      border-radius: 4px;
      border: 1px solid #bbb;

      span {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        display: inline-block;
        font-weight: bold;
        font-size: 12px;
        line-height: 50px;
        width: 35%;
        padding-left: 14px;
        border-right: 1px solid #bbb;
      }

      span:nth-last-child(1) {
        border-right: none;
      }

      span:nth-child(1), span:nth-child(2) {
        width: 15%;
      }
    }

    .items {
      height: calc(100% - 50px);
      overflow-y: scroll;

      .item {
        min-height: 100px;
        overflow: hidden;
        height: auto;
        border: 1px solid #bbb;
        border-top: none;
        display: flex;

        span {
          display: flex;
          align-items: center;
          padding: 10px 10px 10px 14px;
          width: 35%;
          font-size: 12px;
          border-right: 1px solid #bbb;
        }

        span:nth-last-child(1) {
          border-right: none;
        }

        span:nth-child(1) {
          color: #608dff;
        }

        span:nth-child(1), span:nth-child(2) {
          width: 15%;
          //line-height: 130px;
        }
      }

      .item:hover {
        background: rgba(135, 206, 250, 0.2);
      }
    }
  }

  .input {
    display: flex;
    align-items: flex-start;
    margin-bottom: 40px;

    span:nth-child(1) {
      display: inline-block;
      width: 100px;
      text-align: right;
      font-weight: bold;
    }

    span:nth-child(1)::before {
      display: inline-block;
      margin-right: 4px;
      color: #f5222d;
      font-size: 14px;
      font-family: SimSun, sans-serif;
      line-height: 1;
      content: "*";
    }

    /deep/ textarea {
      resize: none;
    }
  }

  .upload {
    display: flex;
    align-items: flex-start;
    margin-bottom: 40px;

    span:nth-child(1) {
      display: inline-block;
      width: 100px;
      text-align: right;
      font-weight: bold;
    }
  }

  .footer-btn {
    button:nth-child(1) {
      background: #6bc9b0;
      color: #fff;
      margin-left: 36px;
    }

    button:nth-child(2) {
      margin-left: 20px;
    }
  }
}

.Sidebar:hover {
  opacity: 1;
}

.Sidebar {
  position: fixed;
  right: 10px;
  bottom: 100px;
  z-index: 999;
  width: 60px;
  height: 208px;
  opacity: 0.25;
  transition: all 0.2s;
  user-select: none;

  .button {
    width: 60px;
    height: 28px;
  }

  /deep/ .ant-btn-sm {
    padding: 0;
  }

  ///deep/ .ant-btn:nth-child(2){
  //    border-radius: 0 0 4px 4px;
  //    transition: all 0.1s linear 0.1s;
  //}
  .buttonClose {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 80px;
    text-align: center;
  }

  ///deep/ .ant-btn:nth-child(3){
  //    border-radius: 4px;
  //}
  ///deep/ .ant-btn-sm:nth-child(3){
  //    padding: 0;
  //    transition: all 0.1s linear 0.1s;
  //}

  //.explain /deep/ .ant-drawer-body{
  //    padding: 16px;
  //}
  //.explain{
  //    //.box{
  //        /deep/ .title{
  //            margin-bottom: 40px;
  //        }
  //    //}
  //}
}

/deep/ > .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
  border-color: #6bc9b0;
  color: #fff;
  background: #6bc9b0;
}

/deep/ > .ant-radio-button-wrapper {
  //height: auto;
  height: 60px;
  width: 60px;
  padding: 0 2px;
  //border-radius: 4px 0 0 4px;
  border: 1px solid #d9d9d9;
  //color: #bbb;
  color: rgba(0, 0, 0, 0.65);

  span:nth-child(2) {
    //width: 20px;
    display: inline-block;
    word-break: break-word;
    text-align: center;
  }
}

/deep/ .ant-radio-button-wrapper:first-child {
  border-radius: 4px 4px 0 0;
}

/deep/ .ant-radio-button-wrapper:last-child {
  border-radius: 0;
}

/deep/ > .ant-radio-button-wrapper {
  background: #fff;
  color: rgba(0, 0, 0, 0.65);

  svg g {
    fill: rgba(0, 0, 0, 0.65);
  }
}

/deep/ > .ant-radio-button-wrapper:hover {
  // color: #46BCA0;
  background: #008eed;
  color: #fff;

  svg g {
    // fill: #46BCA0;
    fill: #fff;
  }
}

/deep/ .ant-btn:hover {
  border-color: #008eed;
  background: #008eed;
  color: #fff;

  svg g {
    // fill: #46BCA0;
    // fill: #fff;
    stroke: #fff;
  }
}

/deep/ > .ant-radio-button-wrapper::before {
  display: none;
}

/deep/ > .ant-radio-group {
  width: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: all 0.1s linear 0.1s;

  p {
    font-size: 12px;
    margin-bottom: 0;
  }
}
</style>