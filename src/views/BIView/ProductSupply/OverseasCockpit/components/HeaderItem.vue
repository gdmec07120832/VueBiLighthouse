<!--
 * @Author: 黄浩
 * @Date: 2022-01-04 16:02:32
 * @LastEditTime: 2022-02-16 15:33:22
 * @LastEditors: Please set LastEditors
 * @Descripttion: 
 * @FilePath: \lsmy-bi-lighthouse-front\src\views\BIView\ProductSupply\OverseasCockpit\components\headerItem.vue
-->
<template>
    <div class="s-board" style="position: relative;overflow: visible">
        <div class="left">
            <p style="margin-bottom: 0;line-height: 20px;color: rgba(0, 0, 0, 0.88)" class="text-black">{{ label }}</p>
            <p style="font-size: 12px;
            height: 20px;
            font-family: PingFangSC-Regular,PingFang SC;
            color: #999;
            line-height: 16px;
            font-weight: 400;
            margin-bottom: 0;
            ">
                {{subTitle}}
            </p>
            <div
                :class="['text-xl', color]" @contextmenu.prevent="openMenu($event)"
                style="line-height: 24px;color: rgba(0, 0, 0, 0.88);height: 24px;font-size: 18px"
            >
                {{ computeNum(0, value) }}
            </div>
        </div>
        <div class="right">
            <div class="text-gary" style="height: 21px">{{ label1 }}</div>
            <div :class="['text-xs',color1]" style="height: 19.5px" @contextmenu.prevent="openMenu($event)">
                {{ computeNum(1, value1) }}
            </div>
            <div class="text-gary" style="height: 21px">{{ label2 }}</div>
            <div :class="['text-xs',color2]" style="height: 19.5px" @contextmenu.prevent="openMenu($event)">
                {{ computeNum(2, value2) }}
            </div>
        </div>
        <CopyBoard ref="CopyBoard"/>
    </div>
</template>

<script>
import CopyBoard from './CopyBoard.vue'
export default {
    components: {CopyBoard},
    props: {
        subTitle: {
            type: String,
            default: ''
        },
        label: {
            type: String,
            default: '--'
        },
        label1: {
            type: String,
            default: '--'

        },
        label2: {
            type: String,
            default: '--'
        },
        // 展示值
        value: {
            type: [Number, String],
            default: '--'

        },
        value1: {
            type: [Number, String],
            default: '--'

        },
        value2: {
            type: [Number, String],
            default: '--'
        },
        color: {
            type: String,
            default: ''
        },
        color1: {
            type: String,
            default: ''
        },
        color2: {
            type: String,
            default: ''
        },
    },
    data() {
        return {}
    },
    methods: {
        openMenu(e) {
            this.$refs.CopyBoard.openMenu(e, e.target.innerText)
        },
        computeNum(p, value){
            if(!value) return '--'
            return value
        },
    }
}
</script>

<style lang='scss' scoped>
@import '../assets/styles.scss';
.s-board:hover::before{
    position: absolute;
    left: 0;
    top: 0;
    border-radius: 6px 6px 0 0;
    content: "";
    width: 100%;
    height: 4px;
    background: #46bca0;
}
.s-board {
    cursor: pointer;
    border-radius: 6px;
    width: calc((100% - 60px) / 7);
    height: 6.8vw;
    min-height: 84px;
    background: #fff;
    padding: 5px 10px;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    // display: inline-flex;
    display: flex;
    justify-content: space-between;
    margin-right: 10px;
    margin-bottom: 10px;
    user-select: text;
    white-space: nowrap;
    overflow: hidden;
    max-height: 105px;

    .text-xl {
        font-size: 21px;
    }

    .text-xs {
        font-size: 13px;
        color: rgba(0, 0, 0, 0.88);
    }

    .red {
        // color: #ff2219
        color: $red!important;
    }

    .green {
        // color: #00b050
        color: $green!important;
    }

    .black {
        color: #333
    }

    &:nth-child(7n) {
        margin-right: 0;
    }

    .left {
        display: flex;
        flex-flow: column;
        justify-content: center;
        padding: 0 10px;
        flex: 3;
        div, p{
            cursor: text;
        }
    }

    .right {
        display: flex;
        flex-flow: column;
        justify-content: space-around;
        text-align: right;
        padding-right: 10px;
        flex: 2;
        div{
            cursor: text;
        }
    }
}

// .default {
//   color: #aeaeae
// }
</style>