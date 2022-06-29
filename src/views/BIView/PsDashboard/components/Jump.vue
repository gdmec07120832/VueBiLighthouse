<template>
    <div class="Jump">
        跳到分析专页
        <dbRight style="height: 10px;width: 10px;" class="svg"/>
    </div>
</template>

<script>
import dbRight from '@/assets/svg/dbRight.svg'

export default {
    props: {
        label: {
            type: String,
            default: '跳到分析专页'
        }
    },
    components: {
        dbRight
    },
    data() {
        return {

        }
    }
}
</script>

<style lang="scss" scoped>
.Jump{
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    font-size: 12px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #4C89FF;
    line-height: 14px;
    .svg g{
        fill: #4C89FF
    }
}
</style>