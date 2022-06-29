<template>
  <a-modal title="版本发布" :visible="visible" @cancel="visible = false" @ok="handleOk">
    <AFormModelItem :model="form" :rules="rules">
      <ARow :gutter="36">
        <ACol :span="12">
          <AFormModelItem label="上新版本" prop="newId">
            <ASelect style="width: 100%" v-model="form.newId" notFoundContent="暂无未发布的版本">
              <ASelectOption v-for="item in toBeReleaseList" :value="item.value" :key="item.value">
                {{ item.label }}
              </ASelectOption>
            </ASelect>
          </AFormModelItem>
        </ACol>
        <ACol :span="12">
          <AFormModelItem label="原主版本">
            <AInput readOnly v-model="form.oldNo" />
          </AFormModelItem>
        </ACol>
      </ARow>
    </AFormModelItem>
  </a-modal>
</template>

<script>
export default {
  name: 'ReleaseModal',
  props: {
    rowData: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      visible: false,
      toBeReleaseList: [],
      form: {
        newId: '',
        oldNo: '',
        oldId: '',
      },
      rules: {
        newId: [{ required: true, message: '此项必填' }],
      },
    }
  },
  created() {
    this.form.oldId = this.rowData.id
    this.form.oldNo = this.rowData.versionMainNum + '_' + this.rowData.versionSubNum
    this.toBeReleaseList = (this.rowData.versions || [])
      .filter((item) => item.id !== this.rowData.id)
      .filter((item) => !item.removedDate)
      .filter((item) => !item.releaseDate)
      .map((item) => {
        return {
          label: item.versionMainNum + '_' + item.versionSubNum,
          value: item.id,
        }
      })
    if (this.toBeReleaseList.length) {
      this.form.newId = this.toBeReleaseList.slice(-1)[0].value
    }
  },
  methods: {
    handleOk() {
      if (!this.form.newId) {
        this.$message.error('请选择上新版本')
        return
      }
      this.$axios
        .get('/api/menu/releaseMenu', {
          params: { releaseType: 'ReleaseIteration', newMenuId: this.form.newId, oldMenuId: this.form.oldId },
        })
        .then(() => {
          this.$message.success('操作成功')
          this.visible = false
          this.$emit('submit-success')
        })
    },
  },
}
</script>

<style scoped></style>
