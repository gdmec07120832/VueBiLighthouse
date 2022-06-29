<template>
    <div class="TimeLine">
        <template v-for="(item, index) in datas">
            <div class="col" :key="index + 'a'">
                <div class="item">
                    <div :style="[{opacity: index !== 0 ? 1 : 0}]" class="leftLine"></div>
                    <div class="dot"></div>
                    <div :style="[{opacity: index !== datas.length - 1 ? 1 : 0}]" class="rightLine"></div>
                </div>
                <div class="label">{{ item.label }}
                    <a-tooltip overlayClassName="panelTooltop" :title="'当前累计建店异常数'" placement="right" v-if="item.label === '建店异常'">
                        <a-icon style="color: rgba(0, 0, 0, 0.45);cursor: pointer" type="question-circle"/>
                    </a-tooltip>
                </div>
                <div :class="['value', computeColor(item.data1, index)]">{{handleNum('round', item.data1)}}</div>
                <div class="store">
                    <span>成品店</span>
                    <span>{{handleNum('round', item.data2)}}</span>
                </div>
                <div class="store">
                    <span>融合店</span>
                    <span>{{handleNum('round', item.data3)}}</span>
                </div>
            </div>
            <div :key="index + 'b'" style="height: 12px;margin-bottom: 10px;display: flex;align-items: center" :style="{flex: index !== datas.length - 1 ? 1 : 'none'}">
                <div style="width: 100%;height: 2px;background: #F2F3F5"></div>
            </div>
        </template>
    </div>
</template>

<script>
import base from '../../../utils/base'
export default {
    mixins: [ base ],
    props: {
        datas: {
            type: Array,
            default() {return []}
        }
    },
    data() {
        return {
            // datas: [
            //     {label: '意向金进度', data1: '1', data2: '2', data3: '3'},
            //     {label: '选址进度', data1: '1', data2: '2', data3: '3'},
            //     {label: '量尺进度', data1: '1', data2: '2', data3: '3'},
            //     {label: '建店异常', data1: '1', data2: '2', data3: '3'}
            // ]
        }
    },
    methods: {
        computeColor(val, col) {
            return ''
            // if(col === 0 || col === 1 || col === 2) {
            //     if(val >= 1) return 'red'
            //     else if(val < 1) return 'green'
            // }
            // if(col === 3) {
            //     if(val >= 0.5) return 'green'
            // }
        }
    }
}
</script>

<style lang="scss" scoped>
.green{
    color: #00a854!important;
}
.red{
    color: #ff5953!important;
}
.TimeLine{
    width: 100%;
    display: flex;
    .col{
        //flex: 1;
        width: 80px;
        .item{
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            .leftLine{
                width: 20px;
                height: 2px;
                background: #F2F3F5;
            }
            .rightLine{
                flex: 1;
                height: 2px;
                background: #F2F3F5;
            }
            .dot{
                width: 12px;
                height: 12px;
                background: #5C8FFA;
                border-radius: 6px;
                margin: 0 3px;
            }
        }
        .label{
            font-size: 13px;
            font-family: PingFangSC-Regular, PingFang SC;
            color: #666666;
            line-height: 22px;
        }
        .value{
            font-size: 18px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 600;
            color: #3C3C3C;
            line-height: 24px;
        }
        .store{
            display: flex;
            justify-content: space-between;
            span:nth-child(1) {
                font-size: 12px;
                font-family: PingFangSC-Regular, PingFang SC;
                color: #999999;
                line-height: 18px;
            }
            span:nth-child(2) {
                font-size: 12px;
                font-family: PingFangSC-Regular, PingFang SC;
                color: rgba(0, 0, 0, 0.64);
                line-height: 18px;
                //margin-right: 60px;
            }
        }
    }
}
</style>