<template>
  <a-modal title="更新业务描述" v-model="visible" @ok="onOk">
    <a-input v-model="form.businessDescription" type="textarea" placeholder="输入业务描述" :rows="6"></a-input>
  </a-modal>
</template>

<script>
export default {
  name: "UpdateDesc",
  props: {
    rowData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      form: {
        id: '',
        businessDescription: ''
      },
      visible: false
    }
  },
  created() {
    const {id} =this.rowData
    this.getDescById(id)
    this.form.id = id
  },
  methods: {
    getDescById(id) {
      this.$axios.get('/api/menu/selectMenuBD', {
        params: {id}
      }).then(({data}) => {
        this.form.businessDescription = data
      })
    },
    onOk() {
      this.$axios.get('/api/menu/saveBusinessDescription', {
        params: {
          ...this.form
        }
      }).then(() => {
        this.$message.success('更新成功')
        this.visible = false
        this.$emit('submit-success')
      })
    }
  }
}
</script>

<style scoped>

</style>
