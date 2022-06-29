<template>
  <a-modal v-model="visible" title="新增" width="800px" @ok="onOk" :confirm-loading="confirmLoading">
    <a-spin :spinning="loading">
      <a-form-model :model="form" :rules="formRules" ref="form" :label-col="{ span: 6 }" :wrapper-col="{ span:18 }">
        <a-row :gutter="12">
          <a-col :span="12">
            <a-form-model-item label="中文名称" prop="cnName">
              <a-input :max-length="10" v-model="form.cnName" placeholder="请输入中文名称"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="上级菜单" prop="parentId">
              <a-select v-model="form.parentId" placeholder="请选择" allow-clear>
                <a-select-option v-for="item in allMenusOptions" :key="item.value" :value="item.value">{{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="URL" prop="url">
              <a-input v-model="form.url" placeholder="请输入URL"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="机密程度" prop="secrecyLevel">
              <a-select v-model="form.secrecyLevel" placeholder="请选择" allow-clear>
                <a-select-option v-for="item in secrecyLevelOptions" :key="item.secrecyLevel" :value="item.secrecyLevel">
                  {{ item.secrecyLevel }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="Token" prop="token">
              <a-input v-model="form.token" placeholder="请输入Token"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="数据内容" prop="dataInfo">
              <a-input :max-length="200" v-model="form.dataInfo" placeholder="请输入数据内容"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="顺序" prop="seq">
              <a-input v-model="form.seq" type="number" placeholder="请输入顺序"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="业务描述" prop="businessDescription">
              <a-input :max-length="200" v-model="form.businessDescription" placeholder="请输入业务描述"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="预览图片" prop="picUrl">
              <a-upload :file-list="pics" list-type="picture-card" accept="image/*"
                        :action="uploadAction" @change="onFileChange" @preview="onFilePreview" name="files">
                <div v-if="pics.length < 1">
                  <a-icon type="plus"/>
                  <div class="ant-upload-text">
                    上传
                  </div>
                </div>
              </a-upload>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import instance from '@/utils/axios'

export default {
  name: "AddOrUpdate",
  props: {
    id: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      visible: false,
      loading: false,
      confirmLoading: false,
      pics: [],
      uploadAction: instance.defaults.baseURL + '/api/file/picUpload',
      form: {
        businessDescription: "",
        cnName: "",
        dataInfo: "",
        iconName: "",
        parentId: "",
        secrecyLevel: "",
        seq: 0,
        token: "",
        url: "",
        picUrl: [],
      },
      secrecyLevelOptions: [],
      allMenusOptions: [],
      formRules: {
        cnName: {required: true, message: '此项必填'},
        url: {type: 'url', message: 'url格式有误'},
        token: {
          validator:(rule, value, cb) => {
            if(this.form.url && !value) {
              cb(new Error('填写URL后必须填写Token'))
            }else {
              cb()
            }
          },
        },
        seq: [
          {required: true, message: '此项必填'},
          {
            validator: (rule, value, cb) => {
              if (/^\d{1,2}$/.test(value) && Number(value) <= 50) {
                cb()
              } else {
                cb(new Error('输入0-50之间的整数'))
              }
            }
          }
        ]
      }
    }
  },
  created() {
    if(this.id) {
      this.getDetailById(this.id)
    }
    this.getAllSecrecyLevelOptions()
    this.getAllMenusOptions()
  },
  methods: {
    resolveUrl(url) {
      if((url || '').startsWith('http')) {
        return url
      }
      return location.origin + instance.defaults.baseURL + '/download' + url
    },
    getDetailById(id) {
      this.loading = true
      this.$axios.get('/api/menuForScreen/selectById', {
        params: {id}
      }).then(({data}) => {
        Object.assign(this.form, data)
        if(this.form.picUrl) {
          this.pics = [
            {
              uid: this.form.picUrl,
              status: 'done',
              url: this.resolveUrl(this.form.picUrl),
              thumbUrl: this.resolveUrl(this.form.picUrl),
              name: this.form.picUrl,
              response: {
                data: [
                  { path: this.form.picUrl }
                ]
              }
            }
          ]
          console.log(this.pics)
        }
      }).finally(() => {
        this.loading = false
      })
    },
    onOk() {
      this.$refs['form'].validate().then(() => {
        this.confirmLoading = true
        this.$axios.post('/api/menuForScreen/insertOrUpdate', {
          ...this.form,
          picUrl: this.pics[0]?.response?.data?.[0]?.path
        }).then(() => {
          this.$message.success('操作成功')
          this.visible = false
          this.$emit('submit-success')
        }).finally(() => {
          this.confirmLoading = false
        })
      })
    },
    getAllSecrecyLevelOptions() {
      this.$axios.get('/api/menu/getAllSecrecyLevelOptions').then(({data}) => {
        this.secrecyLevelOptions = data
      })
    },
    getAllMenusOptions() {
      this.$axios.get('/api/menuForScreen/getAllMenusOptions').then(({data}) => {
        this.allMenusOptions = data
      })
    },
    onFileChange ({ fileList }) {
      this.pics = fileList
      console.log(fileList)
    },
    onFilePreview(file) {
      let path = file.response?.data?.[0]?.path
      if(path) {
        if((path || '').startsWith('http')) {
          window.open(path)
        } else {
          window.open(location.origin + instance.defaults.baseURL + '/download' + path)
        }
      } else {
        this.$message.error('预览失败')
      }
    }
  }
}
</script>

<style scoped>

</style>
