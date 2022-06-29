<!--
 * @Author: 黄浩
 * @Date: 2022-01-04 16:02:32
 * @LastEditTime: 2022-02-16 15:33:22
 * @LastEditors: Please set LastEditors
 * @Descripttion: 
 * @FilePath: \lsmy-bi-lighthouse-front\src\views\BIView\ProductSupply\OverseasCockpit\components\headerItem.vue
-->
<template>
    <div class="s-board" style="position: relative;overflow: visible;border-radius: 6px">

        <div  class="bar" :style="[{display: active === 'active' ? 'block' : 'none'}]"></div>
        <div v-if="numType!==14" class="left">
            <p style="margin-bottom: 0">{{ label }}</p>
            <p style="margin-bottom: 0;">{{ subTitle }}</p>
            <div
                :class="['text-xl',handleColor(0, value, v)]" @contextmenu.prevent="openMenu($event)"
            >
                {{ handleNum(value, 0) }}
            </div>
        </div>
        <div v-if="numType!==14" class="right">
            <div class="text-gary">{{ label1 }}</div>
            <div :class="['text-xs',handleColor(1, value1, v1)]" @contextmenu.prevent="openMenu($event)">
                {{ handleNum(value1, 1) }}
            </div>
            <div class="text-gary">{{ label2 }}</div>
            <div :class="['text-xs',handleColor(2, value2, v2)]" @contextmenu.prevent="openMenu($event)">
                {{ handleNum(value2, 2) }}
            </div>
        </div>

        <div v-if="numType===14" class="BShopDSR">
            <div class="DSRTitle">
                <div class="DSRLeft">{{titlenam}}</div>
                <div class="DSRRight">{{subTitle}}</div>
            </div>
            <div class="DSRCount">
                <div class="DSR_CLeft">
                    <div class="CLMs">
                        <div class="CLMsTitle">{{label}}</div>
                        <div class="CLMsVal">{{handleNum(value.val,0)}}</div> 
                    </div>
                    <div class="CLMs">
                        <div class="CLMsTitle">{{label1}}</div>
                        <div class="CLMsVal">{{handleNum(value1.val,1)}}</div> 
                    </div>
                    <div class="CLMs">
                        <div class="CLMsTitle">{{label2}}</div>
                        <div class="CLMsVal">{{handleNum(value2.val,2)}}</div> 
                    </div>
                </div>
                <div class="DSR_CRight">
                    <div :class="['CRVal',handleColor(3, value.ago)]" >{{handleNum(value.ago,3)}}</div>
                    <div :class="['CRVal',handleColor(4, value1.ago)]" >{{handleNum(value1.ago,4)}}</div>
                    <div :class="['CRVal',handleColor(5, value2.ago)]" >{{handleNum(value2.ago,5)}}</div>
                </div>
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
        titlenam:{
            type: String
        },
        active: {
            type: String
        },
        label: {
            type: String
        },
        label1: {
            type: String
        },
        label2: {
            type: String
        },
        subTitle: {
            type: String,
            default: ' '
        },
        // 展示值
        value: {
            type: [Number,Object]
        },
        value1: {
            type: [Number,Object]
        },
        value2: {
            type: [Number,Object]
        },
        value3:{
            type: [Number,Object]
        },
        // type控制数值处理逻辑
        numType: {
            type: Number,
            default: 0
        },
        // 比较值
        v: {
            default: ''
        },
        v1: {
            default: ''
        },
        v2: {
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
        handleNum(value, p) {
            // type 0整数带万 1整数 2两位小数百分数 3两位小数
            let fun = [
                (val) => {
                    // return parseInt(val / 10000).toLocaleString() + '万'
                    return (((val / 10000).toFixed(0)*1||0)).toLocaleString()+'万'
                },
                (val) => {
                    return parseInt(val).toLocaleString()
                },
                (val) => {
                    return (val * 100).toFixed(2) + '%'
                },
                (val) => {
                    return val.toFixed(2)
                },
                (val) => {
                    return (val * 100).toFixed(1) + '%'
                },
                (val) => {
                    return (((val / 10000 / 10000).toFixed(2)*1||0)).toLocaleString()+'亿'
                },
                (val) => {
                    return val.toFixed(0)
                },
                (val) => {
                    return (((val / 10000).toFixed(1)*1||0)).toLocaleString()+'万'
                },
                (val) => {
                    return (((val).toFixed(0)*1||0)).toLocaleString()
                },
            ]
            let numType = this.numType
            if (value === null) return '--'
            if (numType === 1 || numType === 2) {
                if (p === 0) {
                    if (value === 0) return '--'
                    else return fun[5](value)
                } else if (p === 1|| p === 2) {
                    if (value === 0) return '--'
                    else return fun[4](value)
                }
            }else if(numType === 3){
                // 活动蓄水
                if(p === 0) return (value!==0)?fun[0](value):'--'
                else if(p === 2||p === 1) return (value!==0)?fun[4](value):'--'
            }else if(numType === 4){
                // B店预售
                if(p === 0) return (value!==0)?fun[0](value):'--'
                else if(p === 1||p === 2) return (value!==0)?fun[4](value):'--'
            }else if(numType === 5){
                // 采购毛利率
                if(p === 0) return (value!==0)?fun[4](value):'--'
                else if(p === 2||p === 1) return (value!==0)?fun[4](value):'--'
            }else if(numType === 6){
                // KA全年达成
                if(p === 0) return (value!==0)?fun[5](value):'--'
                else if(p === 1||p === 2) return (value!==0)?fun[4](value):'--'
            }else if(numType === 7){
                // 城市同增
                if(p === 1||p === 0||p === 2) return (value!==0)?fun[4](value):'--'
            }else if(numType === 8){
                // 开店完成率
                if(p === 0) return (value!==0)?fun[4](value):'--'
                else if(p === 1||p === 2) return (value!==0)?fun[6](value):'--'
            }else if(numType === 9){
                // 有效流量
                if(p === 0) return (value!==0)?fun[0](value):'--'
                else if(p === 1||p === 2) return (value!==0)?fun[4](value):'--'
            }else if(numType === 10){
                // 推广费率
                if(p === 0) return (value!==0)?fun[4](value):'--'
                else if(p === 1||p === 2) return (value!==0)?fun[4](value):'--'
            }else if(numType === 11){
                // 客单价
                if(p === 0||p === 1) return (value!==0)?fun[8](value):'--'
                else if(p === 2) return (value!==0)?fun[4](value):'--'
            }else if(numType === 12){
                // 滞销金额
                if(p === 0||p === 1) return (value!==0)?fun[0](value):'--'
                else if(p === 2) return (value!==0)?fun[4](value):'--'
            }else if(numType === 13){
                // B店市占
                if(p === 0||p === 1||p === 2) return (value!==0)?fun[4](value):'--'
            }else if(numType === 14){
                // B店DSR
                if(p === 0||p === 1||p === 2) return (value!==0)?value.toFixed(3):'--'
                else return (value!==0)?fun[4](value):'--'
            }
            else{
                return value
            }

        },
        handleColor(p, value, v) {
            let numType = this.numType
            let TagVal = this.value1  
            let DiffVal = this.value2
            let Dingzhi = this.value3;
            // 支付业绩 发货业绩
            if (numType === 1 || numType === 2) {
                if (p === 0) {
                    if (value === 0 || value === null) return ''
                    else if (DiffVal > 1) return 'red'
                    else return 'green'
                } else if (p === 1) {
                    if (value === 0 || value === null) return ''
                    else if (value > 1) return 'red'
                    else return 'green'
                } else if (p === 2) {
                    if (value === 0 || value === null) return
                    else if (value > 1) return 'red'
                    else return 'green'
                }
            } else if(numType === 3){
                // 活动蓄水
                if(p === 0) return (DiffVal)?(DiffVal>=1)?'red':'green':''
                // else if() return ''
                else if(p === 2||p === 1) return (value)?(value>1)? 'red':'green':''
            } else if(numType === 4){
                // B店预售
                if(p === 0) return (DiffVal)?(DiffVal>=1)?'red':'green':''
                // else if(p === 1) return ''
                else if(p === 1||p === 2) return (value)?(value>1)? 'red':'green':''
            }else if(numType === 5){
                // 采购毛利率
                if(p === 0) return (TagVal)?(value>=TagVal)?'red':'green':''
                else if(p === 1) return ''
                else if(p === 2) return (value)?(value>=0)? 'red':'green':''
            }else if(numType === 6){
                // KA全年达成
                if(p === 0) return (value)?(TagVal>=1)?'red':'green':''
                else if(p === 2||p === 1) return (value)?(value>=1)? 'red':'green':''
            }else if(numType === 7){
                // 城市同增
                if(p === 0) return (DiffVal>0)? 'red':'green'
                else if(p === 2) return (value>=0)? 'red':'green'
                else return '' 
            }else if(numType === 8){
                // 开店完成率
                if(p === 0) return (DiffVal>0)? 'red':'green'
                else if(p === 1) return ''
                else if(p === 2) return (value>0)? 'red':'green'
            }else if(numType === 9){
                // 有效流量
                if(p === 0) return (DiffVal)?(DiffVal>1)? 'red':'green':''
                else if(p === 1) return (value)?(value>=1)? 'red':'green':''
                else if(p === 2) return (value)?(value>=1)? 'red':'green':''
            }else if(numType === 10){
                // 推广费率
                if(p === 0) return (value)?(DiffVal<0)? 'red':'green':''
                else if(p === 1) ''
                else if(p === 2) return (value)?(value<0)? 'red':'green':''
            }else if(numType === 11){
                // 客单价
                if(p === 0) return (DiffVal)?(DiffVal>0)? 'red':'green':''
                else if(p === 1) ''
                else if(p === 2) return (value)?(value>0)? 'red':'green':''
            }else if(numType === 12){
                // 滞销金额
                if(p === 0) return (TagVal)?(value<=TagVal)? 'red':'green':''
                else if(p === 2) return (value)?(value-Dingzhi<=0)? 'red':'green':''
                else if(p === 1) ''
                // else if(p === 2) return (value)?(value>0)? 'red':'green':''
            }else if(numType === 13){
                // B店市占
                return ''
            }else if(numType === 14){
                // B店DSR
                // if(p === 0) return (DiffVal)?(DiffVal>=0)? 'red':'green':''
                // else if(p === 1) ''
                // else if(p === 2) return (value)?(value>=0)? 'red':'green':''
                if(p === 3||p === 4||p === 5) return (value)?(value>=0)? 'red':'green':''

            }

        }

    }
}
</script>

<style lang='scss' scoped>
@import '../assets/styles.scss';
.s-board:hover ::before{
    position: absolute;
    left: 0;
    top: 0;
    border-radius: 6px 6px 0 0;
    content: '';
    width: 100%;
    height: 4px;
    background: #46BCA0;
}
.s-board .bar{
    position: absolute;
    left: 0;
    top: 0;
    border-radius: 6px 6px 0 0;
    content: '';
    width: 100%;
    height: 4px;
    background: #46BCA0;
}
.s-board {
    width: calc((100% - 60px) / 7);
    height: 6.8vw;
    min-height: 84px;
    max-height: 98px;
    background: #fff;
    padding: 5px 10px;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    // display: inline-flex;
    display: flex;
    justify-content: space-between;
    margin-right: 10px;
    margin-bottom: 10px;
    user-select: none;
    white-space: nowrap;
    overflow: hidden;
    border-radius: 6px;

    .left {
        display: flex;
        flex-flow: column;
        justify-content: center;
        padding: 0 00px;
        flex: 3;
        p:nth-child(1) {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            color: rgba(0, 0, 0, 0.88);
            line-height: 20px;
        }
        p:nth-child(2) {
            font-size: 12px;
            height: 20px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #999999;
            line-height: 16px;
            font-weight: 400;
        }
        div{
            font-size: 18px;
            font-family: PingFangSC, PingFang SC sans-serif;
            color: rgba(0, 0, 0, 0.88);
            line-height: 24px;
        }
    }

    .left div.text-xl {
        font-size: 21px;
    }

    .text-xs {
        font-size: 13px;
        color: rgba(0, 0, 0, 0.88);
    }

    .red,.left div.red {
        color: $red 
    }
    .green,.left div.green {
        color: $green
    }

    .black {
        color: #333
    }

    &:nth-child(7n) {
        margin-right: 0;
    }

    .right {
        display: flex;
        flex-flow: column;
        justify-content: space-around;
        text-align: right;
        padding-right: 10px;
        flex: 2;
    }

    .BShopDSR{
        width: 100%;
        .DSRTitle{
            font-family: PingFangSC-Regular, PingFang SC;
            display: flex;
            justify-content: space-between;
            .DSRLeft{
                // flex: 1;
            }
            .DSRRight{
                // flex: 1;
                color: #bbbbbb;
                padding-right: 10px;
            }
        }
        .DSRCount{
            display: flex;
            padding-top: 5px;
            .DSR_CLeft{
                flex: 55;
                .CLMs{
                    display: flex;
                    font-size: 13px;
                    .CLMsTitle{
                        flex: 1;
                        color: #bbbbbb;
                    }
                    .CLMsVal{
                        flex: 1;
                        text-align: right;
                        font-size: 13px;
                    }
                }
            }
            .DSR_CRight{
                flex: 45;
                .CRVal{
                    font-size: 13px;
                    text-align: right;
                    padding-right: 10px;
                }
            }


        }
    }




}

</style>