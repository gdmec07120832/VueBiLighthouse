<template>
    <div class="panels">
        <div class="title">开店总览</div>
        <div class="box">
            <CircleEchart @click.native="clickPanel('已开店')" :class="{active: currentPanel === '已开店' ? true: false}" class="circle" :value="obj.TOT_OPEN_RATE" :comp="comp" :type="'type1'"/>
            <div class="panel">
                <div @click="clickPanel('已开店')" :class="{active: currentPanel === '已开店' ? true: false}" class="col1">
                    <div class="line1">已开店</div>
                    <div class="line2" style="display: flex">
                        <span style="width: 65px">{{obj.TOT_OPEN_SHOP}}</span>
                        <div style="flex: 1"></div>
                        <div style="display: flex;width: 65px;align-items: center;justify-content: space-between">
                            <span style="color: #999">目标</span>
                            <span style="text-align: right;flex: none;font-size: 12px;color: #333;">{{obj.TOT_OPEN_TGT}}</span>
                        </div>
<!--                        <span style="width: 30px;display: inline-block;width: 30px"></span>-->
<!--                        <span style="width: calc(50% / 2 - 7.5px)">差值：</span>-->
<!--                        <span style="width: calc(50% / 2 - 7.5px);text-align: right;" :class="computeColor(1, obj.TOT_OPEN_DIFF)">{{obj.TOT_OPEN_DIFF}}</span>-->
                    </div>
                    <div class="line3">
                        <div class="item">
                            <div class="row1">
                                <span>成品店</span>
                                <span>{{obj.CP_OPEN_SHOP}}</span>
                            </div>
                            <div class="row2">
                                <span>目标</span>
                                <span>{{obj.CP_OPEN_TGT}}</span>
                            </div>
                        </div>
                        <div style="flex: 1"></div>
                        <div class="item">
                            <div class="row1">
                                <span>融合店</span>
                                <span>{{obj.RH_OPEN_SHOP}}</span>
                            </div>
                            <div class="row2">
                                <span>目标</span>
                                <span>{{obj.RH_OPEN_TGT}}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div @click="clickPanel('已开店')" :class="{active: currentPanel === '已开店' ? true: false}" style="flex: 1"></div>
                <div @click="clickPanel('已开店')" :class="{active: currentPanel === '已开店' ? true: false}" style="width: 50px;display: none"></div>
                <div @click="clickPanel('已开店')" :class="{active: currentPanel === '已开店' ? true: false}" class="col2" style="padding-right: 20px">
                    <div class="line1">已关店</div>
                    <div class="line2">{{obj.TOT_CLOSE_SHOP}}</div>
                    <div class="line3">
                        <span>成品店</span>
                        <span>{{obj.CP_CLOSE_SHOP}}</span>
                    </div>
                    <div class="line4">
                        <span>融合店</span>
                        <span>{{obj.RH_CLOSE_SHOP}}</span>
                    </div>
                </div>
                <div @click="clickPanel('营业中')" :class="{active: currentPanel === '营业中' ? true: false}" class="col3">
                    <div class="line1">营业中
                        <a-tooltip overlayClassName="panelTooltop" :title="'当前累计营业门店数'" placement="right">
                            <a-icon style="color: rgba(0, 0, 0, 0.45);cursor: pointer" type="question-circle"/>
                        </a-tooltip>
                    </div>
<!--                    <div class="line2">{{obj.TOT_OPENING}}</div>-->
                    <div class="line2">
                        <span style="width: 70px">{{obj.TOT_OPENING}}</span>
                        <div style="flex: 1"></div>
                        <div style="display: flex;align-items: center;width: 70px;justify-content: space-between">
                            <span style="color: #999">年累净增</span>
                            <span style="text-align: right;flex: none;font-size: 12px;color: #333;">{{obj.TOT_NEW_OPENING}}</span>
                        </div>
                    </div>
                    <div class="line3">
                        <div class="item">
                            <div class="row1">
                                <span>成品店</span>
                                <span>{{obj.CP_OPENING}}</span>
                            </div>
                            <div class="row2">
                                <span>年累净增</span>
                                <span>{{obj.CP_NEW_OPENING}}</span>
                            </div>
                        </div>
                        <div style="flex: 1"></div>
                        <div class="item">
                            <div class="row1">
                                <span>融合店</span>
                                <span>{{obj.RH_OPENING}}</span>
                            </div>
                            <div class="row2">
                                <span>年累净增</span>
                                <span>{{obj.RH_NEW_OPENING}}</span>
                            </div>
                        </div>
                    </div>

<!--                    <div class="line3">-->
<!--                        <span>成品店</span>-->
<!--                        <span>{{obj.CP_OPENING}}</span>-->
<!--                    </div>-->
<!--                    <div class="line4">-->
<!--                        <span>融合店</span>-->
<!--                        <span>{{obj.RH_OPENING}}</span>-->
<!--                    </div>-->
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import CircleEchart from "@/views/BIView/ProductSupply/NewRetailCockpit/components/CircleEchart";
import _ from 'lodash'
export default {
    components: {
        CircleEchart
    },
    props: {
        openOverView: {
            type: Object,
            default() {return {}}
        },
        comp: {
            type: String,
            default: '',
        },
        currentPanel: {
            type: String,
            default: '已开店',
        }
    },
    computed: {
        obj() {
            let obj1 = _.cloneDeep(this.openOverView)
            for(let key in obj1) {
                obj1[key] = this.computeNum(key, obj1[key])
            }
            return obj1
        }
    },
    data() {
        return {
        }
    },
    methods: {
        clickPanel(val) {
            this.$emit('update:currentPanel', val)
        },
        computeNum(key, val){
            if(val === null || val === undefined || val === '--') return '--'
            else return val
        },
        computeColor(p, val) {
            if(val === null || val === undefined || val === '--') return
            if(p === 0) {
                if(val < 1) return 'green'
                else if(val >= 1) return 'red'
            }
            if(p === 1 || p === 2 || p === 3) {
                if(val < 0) return 'green'
                else if(val >= 0) return 'red'
            }
        }
    }
}
</script>

<style lang="scss">
.panelTooltop{
    max-width: none;
    .ant-tooltip{
        max-width: 300px;
    }
    .ant-tooltip-arrow::before {
        background: #fff;
    }
    .ant-tooltip-inner{
        background: #fff;
        font-size: 14px;
        color: #bbb;
    }
}
</style>
<style lang="scss" scoped>
.red {
    color: #ff5953!important;
}
.green {
    color: #00a854!important;
}
.panels {
    margin-top: 15px;
    height: 150px;
    .title {
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 600;
        color: #000000;
        line-height: 20px;
        margin-bottom: 12px;
    }

    .box {
        display: flex;
        align-items: center;
        height: 118px;
        cursor: pointer;
        .active{
            background: rgba(0, 0, 0, 0.03);
        }
        .circle {
            height: 118px !important;
            width: 118px !important;
        }

        .panel {
            flex: 1;
            //transform: translateY(-5px);
            display: flex;
            height: 100%;
            span{
                white-space: nowrap;
            }
            .col1 {
                padding-top: 15px;
                //flex: 3;
                //width: 50%;
                width: 150px;
                // padding-right: 44px;
                .line1 {
                    font-size: 13px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    //font-weight: 600;
                    color: #333333;
                    line-height: 22px;
                }
                .line2 {
                    display: flex;
                    align-items: center;
                    //justify-content: space-between;
                    margin-bottom: 8px;

                    span:nth-child(1) {
                        font-size: 18px;
                        font-family: PingFangSC-Medium, PingFang SC;
                        font-weight: 600;
                        color: #3C3C3C;
                        line-height: 24px;
                    }
                    >div:nth-child(3) {
                        span:nth-child(1) {
                            font-size: 12px;
                            font-family: PingFangSC-Regular, PingFang SC;
                            color: #999999;
                            line-height: 18px;
                            font-weight: 500!important;
                        }
                    }
                }

                .line3 {
                    display: flex;
                    .item {
                        //flex: 1;
                        width: 65px;
                        .row1, .row2, .row3 {
                            display: flex;
                            // width: 66px;
                            justify-content: space-between;
                        }

                        .row1 {
                            font-size: 12px;
                            font-family: PingFangSC-Regular, PingFang SC;
                            color: #999999;
                            line-height: 18px;
                            margin-bottom: 5px;
                            span:nth-child(2) {
                                color: #333
                            }
                        }

                        .row2, .row3 {
                            font-size: 12px;
                            font-family: PingFangSC-Regular, PingFang SC;
                            color: #999999;
                            line-height: 18px;

                            span:nth-child(2) {
                                color: #333
                            }
                        }
                    }
                }
            }
            .col2{
                //flex: 2;
                 width: 75px;
                padding-top: 15px;
                //padding-left: 20px;
                //padding-right: 20px;
                .line1 {
                    font-size: 13px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    line-height: 22px;
                }
                .line2 {
                    margin-bottom: 8px;
                    font-size: 18px;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 600;
                    color: #3C3C3C;
                    line-height: 24px;
                }
                .line3{
                    margin-bottom: 5px;
                }
                .line3, .line4{
                    display: flex;
                    //width: 54px;
                    justify-content: space-between;
                    span:nth-child(1){
                        font-size: 12px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        color: #999999;
                        line-height: 18px;
                    }
                    span:nth-child(2) {
                        font-size: 12px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        color: #333333;
                        line-height: 18px;
                    }
                }
            }
            .col3{
                flex: 3;
                // width: 25%;
                padding-top: 15px;
                padding-left: 20px;
                padding-right: 20px;
                .line1 {
                    font-size: 13px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    line-height: 22px;
                }
                .line2 {
                    display: flex;
                    align-items: center;
                    //justify-content: space-between;
                    margin-bottom: 8px;
                    span{
                        //flex: 1;
                    }
                    span:nth-child(1) {
                        font-size: 18px;
                        font-family: PingFangSC-Medium, PingFang SC;
                        font-weight: 600;
                        color: #3C3C3C;
                        line-height: 24px;
                    }
                    >div:nth-child(3) {
                        span:nth-child(1) {
                            font-size: 12px;
                            font-family: PingFangSC-Regular, PingFang SC;
                            color: #999999;
                            line-height: 18px;
                            font-weight: 500!important;
                        }
                    }
                }
                .line3 {
                    display: flex;
                    .item {
                        //flex: 1;
                        width: 70px;
                        .row1, .row2, .row3 {
                            display: flex;
                            justify-content: space-between;
                        }
                        .row1 {
                            margin-bottom: 5px;
                            font-size: 12px;
                            font-family: PingFangSC-Regular, PingFang SC;
                            color: #999999;
                            line-height: 18px;
                            span:nth-child(2) {
                                color: #333
                            }
                        }
                        .row2, .row3 {
                            font-size: 12px;
                            font-family: PingFangSC-Regular, PingFang SC;
                            color: #999999;
                            line-height: 18px;

                            span:nth-child(2) {
                                color: #333
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>