<template>
  <div>
    <a-tabs default-active-key="1" :animated="false">
      <a-tab-pane key="1" tab="角色-权限">
        <RoleManage/>
      </a-tab-pane>
      <a-tab-pane key="2" tab="角色-模块">
        <RoleModuleManage/>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import RoleManage from '@/views/Admin/role-manage/RoleManage'
import RoleModuleManage from '@/views/Admin/role-module-manage/RoleModuleManage'

export default {
  name: 'RoleManageIndex',
  components: { RoleModuleManage, RoleManage }
}
</script>

<style scoped>

</style>
