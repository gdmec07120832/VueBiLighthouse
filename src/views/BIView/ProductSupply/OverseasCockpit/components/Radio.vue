<!--
 * @Author: 黄浩
 * @Date: 2022-01-06 09:27:43
 * @LastEditTime: 2022-01-06 10:53:56
 * @LastEditors: Please set LastEditors
 * @Descripttion: 海外驾驶舱中的radio组件
 * @FilePath: \lsmy-bi-lighthouse-front\src\views\BIView\ProductSupply\OverseasCockpit\components\Radio.vue
-->
<template>
    <div class="Radio">
        <div style="color: rgba(0,0,0,0.65);margin-right: 20px;white-space:nowrap;font-size: 12px">{{name}}</div>
        <a-radio-group name="radioGroup" :value="model" @change="change" style="white-space:nowrap;">
            <!-- style="width: 78px" -->
            <a-radio :value="_.value" v-for="(_,index) in arr" :key="index" >
            {{_.label}}
            </a-radio>
        </a-radio-group>
    </div>
</template>

<script>
export default {
    props: {
        name: {
            type: String
        },
        arr: {
            type: Array
        },
        model: {
            type: [Number, String]
        }
    },
    data() {
        return {
            
        }
    },
    methods: {
        change(e) {
            this.$emit('update:model',e.target.value)
        }
    }
}
</script>

<style lang='scss' scoped>
.Radio{
    display: flex;
    align-items: center;
}
/deep/ span.ant-radio + *{
    padding-left: 2px;
    padding-right: 0px;
}
/deep/ .ant-radio-wrapper{
    margin-right: 10px;
    span:nth-child(2){
        font-size: 12px;
    }
}
/deep/ .ant-radio-wrapper:nth-last-child(1){
    margin-right: 0px;
}
</style>