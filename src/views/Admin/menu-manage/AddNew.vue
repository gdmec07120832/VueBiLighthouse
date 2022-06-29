<template>
  <a-modal
    v-model="visible"
    :bodyStyle="{ padding: '12px 24px' }"
    :confirm-loading="confirmLoading"
    :maskClosable="false"
    width="800px"
    @ok="onOk"
    :footer="footer"
  >
    <div slot="title" class="flex flex-between" style="width: 95%">
      <span>{{ title }}</span>
    </div>
    <div>
      <a-form-model
        ref="form"
        :label-col="{ span: 3 }"
        :model="form"
        :rules="rules"
        :wrapper-col="{ span: 21 }"
        class="custom-form"
      >
        <a-form-model-item label="中文名称" prop="cnName">
          <a-input v-model="form.cnName" placeholder="请输入菜单名称" :disabled="readonly" />
        </a-form-model-item>
        <a-form-model-item v-if="!rowData.id" label="上级菜单">
          <v-select
            :disabled="readonly"
            v-model="form.parentId"
            :options="parentMenuList"
            item-key-prop="value"
            item-label-prop="label"
            item-value-prop="value"
            placeholder="输入关键字搜索菜单"
          />
        </a-form-model-item>

        <a-form-model-item label="新增类型" v-if="!rowData.id">
          <ARadioGroup v-if="!isAddIteration && !isUpdateIteration" :disabled="!!rowData.id" v-model="form.menuType">
            <ARadio value="Menu">菜单创建</ARadio>
            <ARadio value="Report">报表创建</ARadio>
          </ARadioGroup>
        </a-form-model-item>
        <a-form-model-item label="永洪报表路径">
          <div class="flex flex-between">
            <v-select
              :disabled="readonly"
              v-model="form.yongHongReportName"
              :options="
                yongHongPath.map((_) => ({
                  value: _.path,
                  label: _.path,
                  key: _.url,
                }))
              "
              item-key-prop="key"
              item-label-prop="label"
              item-value-prop="value"
              style="flex: 1"
              @clear="onYHChange"
              @itemClick="onYHChange"
            />
            <a-button class="ml10" size="small" type="link" @click="copyPath">{{ copyPathText }}</a-button>
          </div>
        </a-form-model-item>
        <a-form-model-item label="永洪报表URL" prop="url">
          <a-input v-model="form.url" :disabled="readonly" placeholder="选择永洪报表路径后自动带出"></a-input>
          <div style="color: red; font-size: 12px; line-height: 12px;">永洪9.0地址：
            {{env.VUE_APP_RELEASE_ENV === 'pro' ? 'http://yh9.bi.linshimuye.com:9080/bi/Viewer' : 'http://yh9-test.bi.linshimuye.com:9092/bi/'}}
          </div>
        </a-form-model-item>
        <a-form-model-item v-if="form.menuType === 'Report'" label="报表主编码" prop="versionMainNum">
          <div class="flex flex-between">
            <a-input :value="form.versionMainNum" readOnly :disabled="readonly" />
            <AButton v-if="!readonly && !isUpdateIteration" class="ml10" size="small" type="link" @click="getVersionNo"
              >刷新</AButton
            >
          </div>
        </a-form-model-item>
        <a-form-model-item v-if="form.menuType === 'Report'" label="报表子编码" prop="versionMainNum">
          <a-input :value="form.versionSubNum" readOnly :disabled="readonly" />
        </a-form-model-item>

        <a-row v-if="isAddIteration || (isUpdateIteration && form.versionSubNum !== '001')" :gutter="0">
          <a-col :span="12">
            <a-form-model-item
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 18 }"
              label="迭代类型"
              prop="iterativeType"
            >
              <a-select v-model="form.iterativeType" :disabled="readonly || isUpdateIteration">
                <a-select-option value="LogicalIteration">逻辑大迭代</a-select-option>
                <a-select-option value="PageIteration">页面大迭代</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 18 }"
              label="迭代备注"
              prop="iterativeDescription"
            >
              <a-input :disabled="readonly || isUpdateIteration" />
            </a-form-model-item>
          </a-col>
        </a-row>

        <a-row :gutter="0">
          <a-col :span="12" v-if="!rowData.id || (rowData.id && form.menuType === 'Report')">
            <a-form-model-item :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" label="顺序" prop="seq">
              <a-input
                v-model="form.seq"
                placeholder="数字越大，菜单就越排在后面"
                :disabled="readonly || !!rowData.id"
              />
            </a-form-model-item>
          </a-col>
          <a-col v-if="form.menuType === 'Report'" :span="12">
            <a-form-model-item
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 18 }"
              label="机密程度"
              prop="secrecyLevel"
            >
              <a-select v-model="form.secrecyLevel" allow-clear placeholder="选择机密程度" :disabled="readonly">
                <a-select-option
                  v-for="item in secrecyLevelOptions"
                  :key="item.secrecyLevel"
                  :value="item.secrecyLevel"
                >
                  {{ item.secrecyLevel }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>

        <a-row :gutter="0">
          <a-col :span="12" v-if="form.menuType === 'Report'">
            <a-form-model-item
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 18 }"
              label="重要程度"
              prop="importanceDegree"
            >
              <a-select v-model="form.importanceDegree" allow-clear :disabled="readonly">
                <a-select-option value="Important">重要</a-select-option>
                <a-select-option value="Secondary">次要</a-select-option>
                <a-select-option value="Normal">普通</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="12" v-if="form.menuType === 'Report'">
            <a-form-model-item :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" label="数据价值" prop="dataValue">
              <a-input v-model="form.dataValue" :disabled="readonly" />
            </a-form-model-item>
          </a-col>
        </a-row>

        <a-row :gutter="0">
          <a-col :span="12" v-if="form.menuType === 'Report'">
            <a-form-model-item :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" label="功能介绍" prop="dataInfo">
              <a-input v-model="form.dataInfo" :rows="5" style="height: 104px" type="textarea" :disabled="readonly" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12" v-if="form.menuType === 'Report'">
            <a-form-model-item :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" label="预览图" prop="files">
              <a-upload
                class="preview-img-uploader"
                style="display: block; margin-bottom: 4px; height: 104px"
                :action="action"
                :file-list="form.files"
                :show-upload-list="{ showPreviewIcon: true }"
                accept="image/*"
                list-type="picture-card"
                name="files"
                :disabled="readonly"
                @change="onFileChange"
                @preview="handlePreview"
              >
                <div v-if="form.files.length < 1">
                  <a-icon type="plus" />
                  <div class="ant-upload-text">上传</div>
                </div>
              </a-upload>
            </a-form-model-item>
          </a-col>
        </a-row>
        <div class="text-center">
          <AButton size="small" type="link" @click="showMore = !showMore">
            {{ showMore ? '隐藏高级选项' : '显示高级选项' }}
          </AButton>
        </div>
        <a-row v-if="form.menuType === 'Report'" v-show="showMore" :gutter="0">
          <a-col :span="12">
            <a-form-model-item prop="businessManager" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" label="业务负责人">
              <v-select
                :disabled="readonly"
                v-model="form.businessManager"
                :options="userList"
                item-key-prop="value"
                item-label-prop="label"
                item-value-prop="value"
                placeholder="输入名称或工号搜索"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item prop="productOwner" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" label="产品负责人">
              <v-select
                :disabled="readonly"
                v-model="form.productOwner"
                :options="userList"
                item-key-prop="value"
                item-label-prop="label"
                item-value-prop="value"
                placeholder="输入名称或工号搜索"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row v-show="showMore" :gutter="0">
          <a-col :span="12">
            <a-form-model-item :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" label="启用web页面">
              <a-switch v-model="form.useBackupsUrl" :disabled="readonly"></a-switch>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item
              v-if="form.useBackupsUrl"
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 18 }"
              label="页面路径"
              prop="backupsUrl"
            >
              <a-select v-model="form.backupsUrl" allowClear :disabled="readonly">
                <a-select-option v-for="item in backupUrlOptions" :key="item.url" :label="item.name" :value="item.url">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </div>
  </a-modal>
</template>

<script>
import VSelect from '../../../components/VirtualScroll/VSelect'
import instance from '@/utils/axios'

export default {
  name: 'AddNew',
  components: { VSelect },
  props: {
    readonly: {
      type: Boolean,
      default: false,
    },
    isUpdateIteration: {
      type: Boolean,
      default: false,
    },
    isAddIteration: {
      type: Boolean,
      default: false,
    },
    parentId: {
      type: [Number, String],
      default: '',
    },
    rowData: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      env: process.env,
      userList: [],
      action: instance.defaults.baseURL + '/api/file/picUpload',
      visible: false,
      showMore: false,
      copyPathText: '复制路径',
      confirmLoading: false,
      parentMenuList: [],
      yongHongPath: [],
      filteredYongHongReport: [],
      secrecyLevelOptions: [],
      backupUrlOptions: [],
      form: {
        id: '',
        menuType: 'Menu',
        files: [],
        cnName: '',
        dataValue: '',
        parentId: undefined,
        url: '',
        yongHongReportName: undefined,
        seq: 0,
        secrecyLevel: '',
        iterativeType: undefined,
        iterativeDescription: '',
        importanceDegree: undefined,
        dataInfo: '',
        versionMainNum: undefined,
        versionSubNum: undefined,
        backupsUrl: '',
        useBackupsUrl: false,
        productOwner: undefined,
        businessManager: undefined
      },
    }
  },
  computed: {
    footer() {
      return this.readonly ? (
        <a-button
          type="primary"
          onClick={() => {
            this.visible = false
          }}
        >
          关闭
        </a-button>
      ) : undefined
    },
    rules() {
      const required = !!this.form.url
      return {
        cnName: [{ required: true, message: '必填' }],
        backupsUrl: [{ required: true, message: '必填' }],
        secrecyLevel: [{ required: required, message: '必填' }],
        importanceDegree: [{ required: required, message: '必填' }],
        dataValue: [
          { required: required, message: '必填' },
          { max: 20, message: '最多20字' },
        ],
        dataInfo: [
          { required: required, message: '必填' },
          { max: 200, min: 20, message: '输入20~200个字' },
        ],
        files: [{ required: required, message: '必填', type: 'array', len: 1 }],
        iterativeType: [{ required: required, message: '必填' }],
      }
    },
    title() {
      return this.readonly
        ? '查看'
        : this.isAddIteration
        ? '新增迭代'
        : this.isUpdateIteration
        ? '修改迭代'
        : this.rowData.id
        ? '更新'
        : '新增'
    },
  },
  async created() {
    if (this.rowData.id) {
      await this.getDetailById(this.rowData.id)
    } else {
      this.getVersionNo()
      if (this.parentId) {
        this.form.parentId = this.parentId
      }
    }
    if (this.isAddIteration) {
      this.getVersionNo()
      this.form.iterativeType = 'PageIteration'
    }
    this.getAllMenuOption()
    this.getAllYongHongPath()
    this.getAllSecrecyLevelOptions()
    this.getAllBackupUrls()
    this.getUserList()
  },
  methods: {
    getVersionNo() {
      this.$axios
        .get('/api/menu/getVersionMainNum', {
          params: { versionMainNum: this.rowData?.versionMainNum || '' },
        })
        .then(({ data }) => {
          const { versionMainNum, versionSubNum } = data
          this.form.versionMainNum = versionMainNum
          this.form.versionSubNum = versionSubNum
        })
    },
    onFileChange({ fileList }) {
      this.form.files = fileList
    },
    handlePreview(e) {
      const url = e?.response?.data?.[0]?.path || e.thumbUrl
      window.open(url)
    },
    copyPath() {
      try {
        this.$clipboard(this.form.yongHongReportName)
      } catch {
        this.$message.error('复制失败')
        throw new Error('复制失败')
      }
      this.copyPathText = '已复制'
      setTimeout(() => {
        this.copyPathText = '复制路径'
      }, 2000)
      this.$message.success('复制成功')
    },
    getDetailById(id) {
      return this.$axios
        .get('/api/menu/selectById', {
          params: { id },
        })
        .then(({ data }) => {
          Object.assign(this.form, data)
          this.form.files = data.thumbnailUrl
            ? [
                {
                  uid: Math.random().toString(32).slice(-8),
                  name: Math.random().toString(32).slice(-8),
                  status: 'done',
                  thumbUrl: data.thumbnailUrl,
                  url: data.thumbnailUrl,
                },
              ]
            : []
        })
    },
    getAllBackupUrls() {
      this.$axios.get('/api/menu/getAllActiveBackupUrlOptions').then(({ data }) => {
        this.backupUrlOptions = data
      })
    },
    getAllMenuOption() {
      this.$axios.get('/api/menu/getAllMenusOptions').then(({ data }) => {
        this.parentMenuList = data
      })
    },
    getAllYongHongPath() {
      this.$axios.get('/api/permission/selectAllYHPathOptions').then(({ data }) => {
        this.yongHongPath = Object.freeze(data)
        this.filteredYongHongReport = data.slice(0, 200)
        // 添加
        const formYhName = this.form.yongHongReportName
        if (!this.filteredYongHongReport.find((item) => item.path === formYhName)) {
          const option = data.find((item) => item.path === formYhName)
          option && this.filteredYongHongReport.unshift(option)
        }
      })
    },
    getAllSecrecyLevelOptions() {
      this.$axios.get('/api/menu/getAllSecrecyLevelOptions').then(({ data }) => {
        this.secrecyLevelOptions = data
      })
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    onYHChange(val) {
      if (!val) {
        this.form.url = ''
        return
      }
      let item = this.yongHongPath.find((item) => item.path === val)
      if (item) {
        this.form.url = item.url
      }
    },
    onOk() {
      if (this.readonly) {
        this.visible = false
        return
      }
      let isValidate = true
      this.$refs.form.validate((validate, err) => {
        isValidate = validate
        if (err && err.backupsUrl) {
          this.showMore = true
        }
      })

      if (!isValidate) {
        return
      }

      this.confirmLoading = true

      const imgPath = this.form.files[0]?.response?.data?.[0]?.path
      const imgPathPrefix = this.$axios.defaults.baseURL + 'download'
      const form = {
        ...this.form,
        parentId: this.form.parentId || '',
        yongHongReportName: this.form.yongHongReportName || '',
        thumbnailUrl: imgPath
          ? imgPath.startsWith('http')
            ? imgPath
            : imgPathPrefix + imgPath
          : this.form.files[0]?.thumbUrl,
      }
      delete form.files
      if (this.isAddIteration) {
        this.createReportSubmit(form)
        return
      }
      this.$axios
        .post('/api/menu/insertOrUpdateMenu', form)
        .then(() => {
          this.$message.success('操作成功')
          this.visible = false
          this.$emit('submit-success')
        })
        .finally(() => {
          this.confirmLoading = false
        })
    },
    createReportSubmit(form) {
      this.$axios
        .post('/api/menu/createReportMenu', form)
        .then(() => {
          this.$message.success('操作成功')
          this.visible = false
          this.$emit('submit-success')
        })
        .finally(() => {
          this.confirmLoading = false
        })
    },
    getUserList() {
      this.$axios.get('/api/permission/selectAllYHUsersOptions').then(({data}) => {
        this.userList = data.map((item) => {
          return {
            value: item.userName,
            label: `${item.alias} / ${item.userName}`
          }
        })
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.custom-form {
  /deep/ .ant-form-item {
    margin-bottom: 8px;
  }
}
.preview-img-uploader {
  display: block;
  height: 104px;
  margin-bottom: 4px;
  /deep/ .ant-upload.ant-upload-select-picture-card {
    margin-bottom: 0;
  }
}
</style>
