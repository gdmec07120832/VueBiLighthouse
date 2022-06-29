<template>
  <a-modal title="修改" v-model="visible" @ok="onOk" :confirm-loading="confirmLoading">
    <a-form-model :model="form" :label-col="{ span: 4 }" :wrapper-col="{ span:20 }">
      <a-form-model-item label="角色">
        <a-input v-model="form.roleName"/>
      </a-form-model-item>
      <a-form-model-item label="所属模块">
        <a-select show-search  :not-found-content="null" @search="handleSearch"
                  v-model="form.modeName" allow-clear>
          <a-select-option v-for="item in options" :key="item" :value="item">{{item}}</a-select-option>
        </a-select>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
export default {
  name: "EditRow",
  props: {
    rowData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      visible: false,
      confirmLoading: false,
      options: [],
      form: {
        roleName: '',
        modeName: ''
      }
    }
  },
  created() {
    this.getAllOptions()
    Object.assign(this.form, this.rowData)
  },
  methods: {
    getAllOptions() {
      this.$axios.get('/api/roleAndMode/getAllModeNameOptions').then(({data}) => {
        this.orginalData = data
        this.options = data.slice()
      })
    },
    handleSearch(value) {
      if(!value?.trim()) {
        this.options = this.orginalData
      } else {
        this.options = this.orginalData.filter(item => {
          return (item || '').toLowerCase().indexOf(value.toLowerCase()) > -1
        }).concat(value)
      }
    },
    onOk() {
      this.confirmLoading = true
      return this.$axios.post('/api/roleAndMode/update', {
        ...this.form
      }).then(() => {
        this.$message.success('更新成功')
        this.visible = false
        this.$emit('submit-success')
      }).finally(() => {
        this.confirmLoading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
