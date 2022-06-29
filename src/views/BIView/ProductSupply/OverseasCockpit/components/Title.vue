<template>
    <div class="Title" :class="className" :style="styleName">
<!--        <a-icon type="snippets" class="mr10" style="color: #00b08d"></a-icon>-->
        <span style="font-size: 16px;font-weight: bold" class="text-black">{{ label }}</span>
        <a-tooltip v-if="ps" placement="rightTop" overlayClassName="overseasCockpitTooltip">
            <template slot="title">
                <div v-html="ps" class="tooltip" style="font-size: 14px;background: transparent;color: #bbb;"></div>
            </template>
            <a-icon type="question-circle" class="text-gary" style="cursor: pointer;transform: translateY(-3px);margin-left: 4px;"></a-icon>
        </a-tooltip>
<!--        <QuestionCircleOutlined />-->
    </div>
</template>

<script>
export default {
    name: 'Title',
    props: {
        label: {
            type: String,
            default: '标题'
        },
        className: {
            type: String,
            default: '',
        },
        styleName: {
            type: String,
            default: ''
        },
        ps: {
            type: String,
            default: null
        }
    },
    data() {
        return {

        }
    }
}
</script>

<style lang="scss">
.overseasCockpitTooltip{
    max-width: none;
    .ant-tooltip{
        max-width: 300px;
    }
    .ant-tooltip-arrow::before {
        background: #fff;
    }
    .ant-tooltip-inner{
        background: #fff;
    }
}
</style>
<style lang="scss" scoped>
.Title::before{
    display: inline-block;
    width: 5px;
    height: 14px;
    background: #6bc9b0;
    content: '';
    margin-right: 10px;
    transform: translateY(2px);
    //vertical-align: middle;
}
//.Title::after{
//    position: relative;
//    bottom: -10px;
//    left: -20px;
//    display: block;
//    content: '';
//    width: calc(100% + 40px);
//    height: 1px;
//    background: #ccc;
//}


</style>