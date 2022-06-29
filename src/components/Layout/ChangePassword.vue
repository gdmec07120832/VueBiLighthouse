<template>
  <a-modal title="修改密码" v-model="visible" @ok="onOK" :confirm-loading="confirmLoading">
    <a-form-model :model="form" ref="form" :rules="formRules">
      <a-form-model-item label="旧密码" prop="oldPass">
        <a-input v-model="form.oldPass"/>
      </a-form-model-item>
      <a-form-model-item label="新密码" prop="newPass">
        <a-input v-model="form.newPass" :maxLenght="50"></a-input>
      </a-form-model-item>
      <a-form-model-item label="确认新密码" prop="ensurePass">
        <a-input v-model="form.ensurePass" :maxLength="50"></a-input>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
export default {
  name: "ChangePassword",
  data() {
    return {
      visible: false,
      form: {
        oldPass: '',
        newPass: '',
        ensurePass: ''
      },
      formRules: {
        oldPass: {required: true, message: '请输入旧密码'},
        newPass: [{required: true, message: '请输入新密码'},
          {type: 'string', min: 6, message: '新密码长度不能小于6位'},
          {type: 'string', max: 20, message: '新密码长度不能超过20位'},
          {
            validator: (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请输入新密码'));
            } else {
              if (this.form.ensurePass !== '') {
                this.$refs.ruleForm.validateField('ensurePass');
              }
              callback();
            }
          }
          },
          {
            validator: (rule, value, callback) => {
              if(/\d/.test(value) && /[a-zA-Z]/.test(value)) {
                callback()
              } else {
                callback(new Error('密码必须包含数字和英文字母'))
              }
            }
          }
        ],
        ensurePass: [{
          validator: (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请确认新密码'));
            } else if (value !== this.form.newPass) {
              callback(new Error('两次输入密码不一致!'));
            } else {
              callback();
            }
          }
        }],
      },
      confirmLoading: false
    }
  },
  methods: {
    onOK() {
      this.$refs['form'].validate().then(() => {
        this.confirmLoading = true
        this.$axios.post('/api/changePassword', {
          ...this.form
        }).then(() => {
          this.$message.success('修改成功')
          this.visible = false
          setTimeout(() => {
            this.logout()
          }, 500)
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
