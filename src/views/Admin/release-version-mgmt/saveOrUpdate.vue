<template>
  <a-modal :visible.sync="visible" :title="computedTitle" @cancel="handleCancel"
           @ok="handleOk" :confirm-loading="confirmLoading">
    <a-form-model ref="formRef" :rules="formRules" :model="form" :label-col="{ span: 4 }" :wrapper-col="{ span:20 }">
      <a-form-model-item label="版本号" prop="versionNum">
        <a-input v-model="form.versionNum" :maxLength="20"/>
      </a-form-model-item>
      <a-form-model-item label="版本名称" prop="versionName">
        <a-input v-model="form.versionName" :maxLength="20"/>
      </a-form-model-item>
      <a-form-model-item label="发版时间" prop="planReleaseDate">
        <a-date-picker :locale="locale" v-model="form.planReleaseDate" style="width: 100%"/>
      </a-form-model-item>
      <a-form-model-item label="发版人" prop="pmNo">
        <v-select v-model="form.pmNo" :options="allUsers" item-key-prop="value"
                  item-label-prop="label" item-value-prop="value"/>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN'
import moment from 'moment'
import VSelect from '@/components/VirtualScroll/VSelect'

export default {
  name: 'saveOrUpdate',
  components: { VSelect },
  props: {
    row: Object,
  },
  computed: {
    computedTitle () {
      return this.row?.id ? '编辑版本信息' : '新增发版'
    }
  },
  data () {
    return {
      locale,
      allUsers: [],
      visible: false,
      form: {
        id: undefined,
        pmNo: '',
        versionName: '',
        versionNum: '',
        planReleaseDate: ''
      },
      formRules: {
        pmNo: [{ required: true, message: '此项必填' }],
        versionName: [{ required: true, message: '此项必填' }],
        versionNum: [{ required: true, message: '此项必填' }],
        planReleaseDate: [{ required: true, message: '此项必填' }],
      },
      confirmLoading: false,
    }
  },
  async created () {
    if (this.row?.id) {
      Object.keys(this.form).forEach(key => {
        this.form[key] = this.row[key]
      })
      this.form.planReleaseDate = moment(this.row.planReleaseDate)
    }
    const users = await this.getAllUsers()
    this.allUsers = users.map((item) => {
      return {
        value: item.value,
        label: item.key
      }
    })
  },
  methods: {
    getAllUsers () {
      return this.$axios.get('/selectAllAdminUser').then(({ data }) => {
        return data
      })
    },
    handleCancel () {
      this.visible = false
    },
    handleOk () {
      this.$refs.formRef.validate().then(() => {
        this.confirmLoading = true
        this.$axios.post('/api/admin/version/insertOrUpdate', {
          ...this.form,
          planReleaseDate: this.form.planReleaseDate.format('YYYY-MM-DD')
        }).then(() => {
          this.visible = false
          this.$emit('submit-success')
        }).finally(() => {
          this.confirmLoading = false
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
