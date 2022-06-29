<template>
    <div class="ProgressBar">
        <span>{{value}}</span>
        <div class="innerbar" :style="[{background: color[colorIndex], width: width}]">
<!--            {{value}}-->
        </div>
    </div>
</template>

<script>
export default {
    props: {
        value: {
            type: [String, Number],
            default: ''
        },
        colorIndex: {
            type: Number,
            default: 0
        }
    },
    computed: {
        width() {
            let str = ''
            if(this.value === null || this.value === undefined || this.value === '--') return val = '0%'
            let val = this.value.split('%')[0]
            if(val >= 100) str = '100%'
            else if(val >= 0 && val < 100) str = val + '%'
            return str
        }
    },
    data() {
        return {
            color: ['#B9D0FF', '#FFE7A2', '#D5EFEF']
        }
    },
}
</script>

<style lang="scss" scoped>
.ProgressBar{
    width: 100px;
    height: 12px;
    background: #F1F1F1;
    position: relative;
    span:nth-child(1) {
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        text-align: center;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        color: #000000;
        line-height: 12px;
        font-weight: 600;
    }
    .innerbar{
        height: 12px;
    }
}
</style>