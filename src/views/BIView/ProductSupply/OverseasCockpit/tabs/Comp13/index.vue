<!--
 * @Author: 黄浩
 * @Date: 2022-01-10 13:36:08
 * @LastEditTime: 2022-01-23 17:51:58
 * @LastEditors: Please set LastEditors
 * @Descripttion: 边际毛利
 * @FilePath: \lsmy-bi-lighthouse-front\src\views\BIView\ProductSupply\OverseasCockpit\tabs\Comp13\index.vue
-->
<template>
    <div class="Comp13">
        <Title :label="'边际毛利率'"/>
        <a-empty style="width: 100%;height: calc(100% - 42px)" />
    </div>
</template>

<script>
import Title from '../../components/Title'
export default {
    components: {
        Title,
    },
    name: 'Comp13',
    data() {
        return {
            
        }
    }
}
</script>

<style lang='scss' scoped>
.Comp13{
    height: 100%;
    padding: 10px 20px;
    /deep/ .ant-empty{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
}
</style>