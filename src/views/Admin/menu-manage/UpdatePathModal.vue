<template>
  <a-modal :visible="visible" title="更新菜单路径" @cancel="visible = false" @ok="handleOk">
    <AFormModel ref="form" :model="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
      <AFormModelItem label="上级菜单" prop="parentId">
        <v-select
          v-model="form.parentId"
          :options="parentMenuList"
          item-key-prop="value"
          item-label-prop="label"
          item-value-prop="value"
          placeholder="输入关键字搜索菜单"
        />
      </AFormModelItem>
      <AFormModelItem label="顺序" prop="seq">
        <AInput v-model="form.seq" />
      </AFormModelItem>
    </AFormModel>
  </a-modal>
</template>

<script>
import VSelect from '../../../components/VirtualScroll/VSelect'

export default {
  name: 'UpdatePathModal',
  components: { VSelect },
  props: {
    rowData: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      form: {
        parentId: undefined,
        seq: '',
      },
      parentMenuList: [],
      visible: false,
    }
  },
  created() {
    console.log(this.rowData)
    this.getAllMenuOption()
    this.form.parentId = this.rowData.parentId
    this.form.seq = this.rowData.seq
  },
  methods: {
    getAllMenuOption() {
      this.$axios.get('/api/menu/getAllMenusOptions').then(({ data }) => {
        this.parentMenuList = data
      })
    },
    handleOk() {
      this.$confirm({
        content: '此操作将会立即更新菜单所在路径，确定修改吗？',
        onOk: () => {
          return this.$axios
            .get('/api/menu/updateParentIdAndSeq', {
              params: {
                menuId: this.rowData.id,
                seq: this.form.seq || '',
                parentId: this.form.parentId || '',
              },
            })
            .then(() => {
              this.$message.success('路径修改成功')
              this.visible = false
              this.$emit('submit-success')
            })
        },
      })
    },
  },
}
</script>

<style scoped></style>
