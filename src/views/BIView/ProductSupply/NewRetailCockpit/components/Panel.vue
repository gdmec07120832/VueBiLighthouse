<template>
    <div class="Panel">
        <div v-if="type === 'type1'" class="type1">
            <CircleEchart class="echarts" :type="type" :value="echart.value" :comp="comp"/>
            <div class="datas">
                <div class="r1">
                    <div>{{ datas.label1 }}</div>
                    <div :class="computeColor(1, datas.value1)">{{ computeNum(1, datas.value1) }}</div>
                </div>
                <div class="r2">
                    <span>{{ datas.label2 }}</span>
                    <span :class="computeColor(2, datas.value2)">{{ computeNum(2, datas.value2) }}</span>
                </div>
                <div class="r3">
                    <span>{{ datas.label3 }}</span>
                    <span :class="computeColor(3, datas.value3)">{{ computeNum(3, datas.value3) }}</span>
                </div>
                <div class="r4">
                    <span>{{ datas.label4 }}</span>
                    <span :class="computeColor(4, datas.value4)">{{ computeNum(4, datas.value4) }}</span>
                </div>
            </div>
        </div>
        <div v-if="type === 'type2'" class="type2">
            <div class="r1">
                <div>{{ datas.label1 }}</div>
                <div :class="computeColor(1, datas.value1)">{{ computeNum(1, datas.value1) }}</div>
            </div>
            <div class="r2">
                <span>{{ datas.label2 }}</span>
                <span :class="computeColor(2, datas.value2)">{{ computeNum(2, datas.value2) }}</span>
            </div>
            <div class="r3">
                <span>{{ datas.label3 }}</span>
                <span :class="computeColor(3, datas.value3)">{{ computeNum(3, datas.value3) }}</span>
            </div>
            <div class="r4">
                <span>{{ datas.label4 }}</span>
                <span :class="computeColor(4, datas.value4)">{{ computeNum(4, datas.value4) }}</span>
            </div>
        </div>
        <div v-if="type === 'type3'" class="type3">
            <CircleEchart class="echarts" :value="echart.value" :type="type" :label="echart.label" :comp="comp" :id="echart.id"/>
            <div class="datas">
                <div class="r1">
                    <div>{{ datas.label1 }}</div>
                    <div>{{ computeNum(1, datas.value1) }}</div>
                </div>
                <div class="box">
                    <div class="r2" v-if="datas.label2">
                        <span>{{ datas.label2 }}</span>
                        <span>{{ computeNum(2, datas.value2) }}</span>
                    </div>
                    <div class="r3" v-if="datas.label3">
                        <span>{{ datas.label3 }}</span>
                        <span>{{ computeNum(3, datas.value3) }}</span>
                    </div>
                    <div class="r4"  v-if="datas.label4">
                        <span>{{ datas.label4 }}</span>
                        <span>{{ computeNum(4, datas.value4) }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import CircleEchart from './CircleEchart'
import base from '../utils/base'

export default {
    mixins: [base],
    name: 'Panel',
    props: {
        type: {
            type: String,
            default: 'type2'
        },
        echart: {
            type: Object,
            default() {
                return {}
            }
        },
        datas: {
            type: Object,
            default() {
                return {}
            }
        },
        comp: {
            type: String,
            default: '',
        }
    },
    components: {
        CircleEchart,
    },
    data() {
        return {}
    },
    methods: {
        computeNum(p, val) {
            if(this.comp === 'OpenAShop') {
                if(val === null || val === undefined || val === '--') return '--'
                if (p === 1 || p === 2) return this.handleNum('round', val)
                else if (p === 3 || p === 4) return this.handleNum('percent', val)
            }
            else if(this.comp === 'Activity') {
                if(val === null || val === undefined || val === '--') return '--'
                if(p === 1 || p === 2 || p === 3) return this.handleNum('round', val)
                return val
            }
        },
        computeColor(p, val) {
            if(val === null || val === undefined || val === '--') return
            if(this.comp === 'OpenAShop') {
                if(p === 3) {
                    if(val >= 1) return 'red'
                    else if(val < 1) return 'green'
                }
            }else if(this.comp === 'Activity') {
                if(p === 3) {
                    if(val >= 0) return 'red'
                    else if(val < 1) return 'green'
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.red{
    color: #ff5953!important;
}
.green{
    color: #00a854!important;
}
.Panel {
    display: inline-block;
    position: relative;

    .type1 {
        width: 366px;
        height: 136px;
        // background: #FAFAFA;
        display: flex;

        .echarts {
            display: inline-block;
            height: 136px !important;
            width: 136px !important;
        }

        .datas {
            padding: 0 30px 0 8px;
            display: inline-block;
            width: 230px;
            height: 136px;

            .r1 {
                div:nth-child(1) {
                    margin-top: 14px;
                    height: 22px;
                    font-size: 13px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    color: rgba(0, 0, 0, 0.64);
                    line-height: 22px;
                }

                div:nth-child(2) {
                    margin-top: 4px;
                    height: 24px;
                    font-size: 24px;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 600;
                    color: #333333;
                    line-height: 24px;
                }
            }

            .r2 {
                margin-top: 8px;
            }

            .r2, .r3, .r4 {
                display: flex;
                justify-content: space-between;

                span:nth-child(1) {
                    height: 18px;
                    font-size: 12px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    color: #999999;
                    line-height: 18px;
                }

                span:nth-child(2) {
                    height: 18px;
                    font-size: 12px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    color: rgba(0, 0, 0, 0.64);
                    line-height: 18px;
                }
            }
        }
    }

    .type2 {
        padding: 0 30px 0 20px;
        display: inline-block;
        min-width: 150px;
        width: 100%;
        height: 136px;

        .r1 {
            div:nth-child(1) {
                margin-top: 14px;
                height: 22px;
                font-size: 13px;
                font-family: PingFangSC-Regular, PingFang SC;
                color: rgba(0, 0, 0, 0.64);
                line-height: 22px;
            }

            div:nth-child(2) {
                margin-top: 4px;
                height: 24px;
                font-size: 24px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 600;
                color: #333333;
                line-height: 24px;
            }
        }

        .r2 {
            margin-top: 8px;
        }

        .r2, .r3, .r4 {
            display: flex;
            justify-content: space-between;

            span:nth-child(1) {
                height: 18px;
                font-size: 12px;
                font-family: PingFangSC-Regular, PingFang SC;
                color: #999999;
                line-height: 18px;
            }

            span:nth-child(2) {
                height: 18px;
                font-size: 12px;
                font-family: PingFangSC-Regular, PingFang SC;
                color: rgba(0, 0, 0, 0.64);
                line-height: 18px;
            }
        }
    }

    .type2::before, .type3::before {
        content: '';
        background: #F0F0F0;
        width: 1px;
        height: 75px;
        position: absolute;
        top: 50px;
        right: 0;
    }

    .type3 {
        width: 366px;
        height: 136px;
        //background: #FAFAFA;
        display: flex;

        .echarts {
            display: inline-block;
            height: 136px !important;
            width: 136px !important;
        }

        .datas {
            padding: 0 30px 0 8px;
            display: inline-block;
            width: 230px;
            height: 136px;

            .r1 {
                div:nth-child(1) {
                    margin-top: 14px;
                    height: 22px;
                    font-size: 13px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    color: rgba(0, 0, 0, 0.64);
                    line-height: 22px;
                }

                div:nth-child(2) {
                    margin-top: 4px;
                    height: 24px;
                    font-size: 24px;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 600;
                    color: #333333;
                    line-height: 24px;
                }
            }

            .box {
                min-height: calc(100% - 64px);
                max-height: calc(100% - 64px);
                display: flex;
                flex-direction: column;
                justify-content: center;
                .r2 {
                    margin-top: 8px;
                }

                .r2, .r3, .r4 {
                    display: flex;
                    justify-content: space-between;

                    span:nth-child(1) {
                        height: 18px;
                        font-size: 12px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        color: #999999;
                        line-height: 18px;
                    }

                    span:nth-child(2) {
                        height: 18px;
                        font-size: 12px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        color: rgba(0, 0, 0, 0.64);
                        line-height: 18px;
                    }
                }
            }
        }
    }
}
</style>