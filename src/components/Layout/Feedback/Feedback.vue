<template>
  <a-modal v-model="visible" title="意见反馈" ok-text="提交" :mask-closable="false" @ok="onOK">
    <a-form-model :model="form" :rules="formRules" :label-col="{ span: 4 }" :wrapper-col="{ span:20 }">
      <a-form-model-item label="报表名称">
        <a-input disabled :value="reportName"></a-input>
      </a-form-model-item>
      <a-form-model-item label="简要描述" prop="shortDesc">
        <a-input v-model="form.shortDesc" type="textarea"></a-input>
      </a-form-model-item>
      <a-form-model-item label="图片">
        <a-upload :file-list="form.files" @change="onFileChange" list-type="picture-card" accept="image/*"
                  :action="action" name="files" @preview="handlePreview">
          <div v-if="form.files.length < 1">
            <a-icon type="plus"/>
            <div class="ant-upload-text">
              上传
            </div>
          </div>
        </a-upload>
      </a-form-model-item>
      <a-modal :visible="previewVisible" title="预览" :footer="null" @cancel="handlePreviewCancel">
        <img alt="example" style="width: 100%" :src="previewImage"/>
      </a-modal>
    </a-form-model>
  </a-modal>
</template>

<script>
import store from '@/store';
import instance from '@/utils/axios';

export default {
  name: "Feedback",
  data() {
    return {
      visible: false,
      previewVisible: false,
      previewImage: '',
      action: instance.defaults.baseURL + '/api/file/upload',
      form: {
        files: [],
        shortDesc: ''
      },
      formRules: {
        shortDesc: [{required: true, message: '此项必填'}, {max: 255, message: '长度超出限制'}]
      }
    }
  },
  computed: {
    reportName() {
      const menuPath = this.$route.params.menuPath || ''
      const trailId = menuPath.split('_').pop()
      if (trailId) {
        return store.state.app.globalMenuMap[Number(trailId)].cnName
      } else {
        return ''
      }
    }
  },
  created() {

  },
  methods: {
    handlePreview(file) {
      this.previewImage = file.thumbUrl
      this.previewVisible = true
    },
    handlePreviewCancel() {
      this.previewVisible = false
    },
    onFileChange({fileList}) {
      this.form.files = fileList
    },
    onOK() {
      const menuPath = this.$route.params.menuPath || ''
      const trailId = menuPath.split('_').pop()
      this.$axios.post('/api/proposal/saveOrUpdate', {
        description: this.form.shortDesc,
        files: this.form.files.filter(file => file.status === 'done').map(file => ({id: file.response.data[0]})),
        menuId: trailId
      }).then(() => {
        this.$message.success('提交成功')
        this.visible = false
      })
    }
  }
}
</script>

<style scoped>

</style>
