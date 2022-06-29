<template>
  <a-modal v-model="visible" :title="title" :mask-closable="false" @ok="onOK" :confirmLoading="confirmLoading">
    <a-form-model :model="form" :rules="formRules" ref="form" :label-col="{ span: 4 }" :wrapper-col="{ span:20 }">
      <a-form-model-item label="通知类型" prop="noticeType">
        <a-select v-model="form.noticeType">
          <a-select-option :value="1">首页通知</a-select-option>
          <a-select-option :value="2">实时通知</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="标题" prop="title">
        <a-input v-model="form.title" placeholder="请输入标题" />
      </a-form-model-item>
      <a-form-model-item label="内容" prop="content">
        <a-input v-model="form.content" type="textarea" placeholder="请输入内容" :rows="6" :maxLength="1000"></a-input>
      </a-form-model-item>
      <a-form-model-item label="开始时间" prop="startDate" v-if="form.noticeType === 1">
        <a-date-picker value-format="YYYY-MM-DD" style="width: 100%" v-model="form.startDate" :locale="locale"/>
      </a-form-model-item>
      <a-form-model-item label="结束时间" prop="endDate" v-if="form.noticeType === 1">
        <a-date-picker value-format="YYYY-MM-DD" style="width: 100%" v-model="form.endDate" :locale="locale" />
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import moment from 'moment'
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';
export default {
  name: "addNew",
  props: {
    id: {
      type: [String, Number],
      default: ''
    },
    rowData: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    title() {
      return this.id ? '更新通知' : '新增通知'
    }
  },
  data() {
    return {
      locale,
      confirmLoading: false,
      visible: false,
      form: {
        noticeType: 1,
        title: '',
        content: '',
        startDate: '',
        endDate: ''
      },
      formRules: {
        title: {required: true, message: '此项必填'},
        content: {required: true, message: '此项必填'},
        startDate: {required: true, message: '此项必填'},
        endDate: {required: true, message: '此项必填'}
      }
    }
  },
  created() {
    if(this.id) {
      Object.assign(this.form, this.rowData)
    }
  },
  methods: {
    onOK() {
      return this.$refs['form'].validate().then(() => {
        const {startDate, endDate} = this.form
        if(moment(startDate).valueOf() > moment(endDate).valueOf()) {
          this.$message.error('开始时间必须小于结束时间')
          return Promise.reject()
        } else {
          return Promise.resolve()
        }
      }).then(() => {
        this.confirmLoading = true
        this.$axios.post('/api/notice/insertOrUpdate', {
          id: this.id,
          ...this.form
        }).then(() => {
          this.$message.success('操作成功')
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
