<!--
 * @Author: 黄浩
 * @Date: 2022-01-06 17:13:39
 * @LastEditTime: 2022-02-11 16:40:55
 * @LastEditors: Please set LastEditors
 * @Descripttion: 垂直的一条边
 * @FilePath: \lsmy-bi-lighthouse-front\src\views\BIView\ProductSupply\OverseasCockpit\components\Border.vue
-->
<template>
    <div :style="{padding: padding}">
        <div style="width: 1px;background: #ccc;height: 100%;margin-left: 50%;transfrom: transLateX(-50%)"></div>
    </div>
</template>

<script>
export default {
    props: {
        padding: {
            type: String,
            default: '5px 0'
        }
    },
    data() {
        return {
            
        }
    }
}
</script>

<style lang='scss' scoped>

</style>