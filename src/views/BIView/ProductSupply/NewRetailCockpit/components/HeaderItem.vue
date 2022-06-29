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
        <div class="bar" :style="[{display: active === 'active' ? 'block' : 'none'}]"></div>
        <div class="left">
            <p style="margin-bottom: 0">{{ label }}</p>
            <p style="margin-bottom: 0;">{{ subTitle }}</p>
            <div
                    :class="['text-xl',handleColor(0, value, v)]" @contextmenu.prevent="openMenu($event)"
            >
                {{ handleNum(value, 0) }}
            </div>
        </div>
        <div class="right">
            <div class="text-gary">{{ label1 }}</div>
            <div :class="['text-xs',handleColor(1, value1, v1)]" @contextmenu.prevent="openMenu($event)">
                {{ handleNum(value1, 1) }}
            </div>
            <div class="text-gary">{{ label2 }}</div>
            <div :class="['text-xs',handleColor(2, value2, v2)]" @contextmenu.prevent="openMenu($event)">
                {{ handleNum(value2, 2) }}
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
            type: Number
        },
        value1: {
            type: Number
        },
        value2: {
            type: Number
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
            ]
            let numType = this.numType
            let TagVal = this.value1  
            let DiffVal = this.value2
            // 支付业绩 万 百分比 百分比 0 2 2
            // 发货业绩 万 百分比 百分比 0 2 2
            if (value === null) return '--'
            if (numType === 0 || numType === 1) {
                if (p === 0) {
                    if (value === 0) return '--'
                    else return fun[5](value)
                } else if (p === 1) {
                    if (value === 0) return '--'
                    else return fun[4](value)
                } else if (p === 2) {
                    return fun[4](value)
                }
            } else if (numType === 2) {
                // 访客量 整数 整数 百分比 1 1 2
                if (value === 0) return '--'
                if (p === 0) return fun[1](value)
                else if (p === 1) return fun[1](value)
                else if (p === 2) return fun[2](value)
            } else if (numType === 3) {
                // 广告投入占比 百分比 百分比 整数 2 2 1
                if (value === 0) return '--'
                if (p === 0) return fun[2](value)
                else if (p === 1) return fun[2](value)
                else if (p === 2) return fun[1](value)
            } else if (numType === 4) {
                // 广告RoAS 两位小数 两位小数 整数 3 3 1
                if (value === 0) return '--'
                if (p === 0) return fun[3](value)
                else if (p === 1) return fun[3](value)
                else if (p === 2) return fun[1](value)
            } else if (numType === 5) {
                // 商品退款率 百分比 百分比 百分比 2 2 2
                if (p === 0 || p === 1) {
                    if (value === 0) return '--'
                    else return fun[2](value)
                } else return fun[2](value)
            } else if (numType === 6) {
                // 头程费用 万 百分比 百分比 0 2 2
                if (value === 0) return '--'
                if (p === 0) return fun[0](value)
                else if (p === 1 || p === 2) return fun[2](value)
            } else if (numType === 7) {
                // 仓储费 万 百分比 百分比 0 2 2
                if (value === 0) return '--'
                if (p === 0) return fun[0](value)
                else if (p === 1 || p === 2) return fun[2](value)
            } else if (numType === 8) {
                // 采购成本 万 万 百分比 0 0 2
                if (p === 0 || p === 1) {
                    if (value === 0) return '--'
                    return fun[0](value)
                } else if (p === 2) return fun[2](value)
            } else if (numType === 9) {
                // 年化周转 两位小数 两位小数 两位小数 3 3 3
                if (p === 0 || p === 1) {
                    if (value === 0) return '--'
                    return fun[3](value)
                } else return fun[3](value)
            } else if (numType === 10) {
                // 定价毛利率 百分比 百分比 百分比 2 2 2
                return fun[2](value)
            } else if (numType === 11) {
                // 边际毛利率 万 万 万 0 0 0
                return fun[0](value)
            }else if (numType === 21){
                // 开店完成率 
                if(p === 0){
                    return fun[4](value)
                }else {
                    return fun[1](value)
                } 
            }else if (numType === 22){
                // 活动蓄水
                if(p === 0){
                    return fun[0](value)
                }else if(p===1){
                    return this.value1===0? '--':fun[4](value)
                }else{
                    return (value===0)?'--':fun[4](value)
                }
            }else if(numType === 23){
                //网拍业绩
                if(p === 0){
                    return fun[0](value)
                }else{
                    return fun[4](value)
                }
            }else if(numType === 25){
                //客单价
                if(p === 0||p === 1){
                    return fun[1](value.toFixed(0))
                }else{
                    return fun[4](value)
                }
            }else if(numType === 24){
                //24 DB货占比
                if(p===0){
                    return fun[4](value)
                }else if(p===2){
                    return (this.value1===0)?'--':fun[4](value)
                }else{
                    return (value==0)?'--':fun[4](value)
                }
            }else if(numType === 26||numType === 30||numType === 32){
                  //26主体摆场动销率     //30付费留资成交率  //31成交毛利率  //32门店盈利率
                if(p===0){
                    return fun[4](value)
                }else{
                    return (value==0)?'--':fun[4](value)
                }
                
            }else if(numType === 28){
                //28差评率
                if(p===0){
                    return fun[2](value)
                }else if(p===2){
                    return (TagVal===0||TagVal==='--')?'--':(value==0)?'--':fun[2](value)
                }else{
                    return (value==0)?'--':fun[2](value)
                }
            }else if(numType === 27){
                //27内务评分  
                if(p===0){
                    return (value==0)?'--':fun[1](value)
                }else if(p===2){
                    if (TagVal){
                        return (value==0)?'--':fun[1](value)
                    }else{
                        return '--'
                    }
                }else{
                    return (value==0)?'--':fun[1](value)
                }
                
            }else if(numType === 29){
                //29线上投放费用
                if(p===0){
                    return fun[0](value)
                }else{
                    return fun[1](value)
                }
                
            }else if(numType === 31){
                //31成交毛利率
                if(p===0){
                    return fun[4](value)
                }else if(p===2){
                    return (this.value1==0)?'--':fun[4](value)
                }else{
                    return (value==0)?'--':fun[4](value)
                }
            }
  

        },
        handleColor(p, value, v) {
            let numType = this.numType
            let TagVal = this.value1  
            let DiffVal = this.value2
            // 支付业绩 发货业绩
            if (numType === 0 || numType === 1) {
                if (p === 0) {
                    if (value === 0 || value === null) return
                    else if (DiffVal > 1) return 'red'
                    else return 'green'
                } else if (p === 1) {
                    if (value === 0 || value === null) return
                    else if (value > 1) return 'red'
                    else return 'green'
                } else if (p === 2) {
                    if (value === 0 || value === null) return
                    else if (value > 1) return 'red'
                    else return 'green'
                }
            } else if (numType === 2) {
                // 访客量
                if (p === 0) {
                    if (value === 0 || value === null) return
                    else if (v <= 0) return 'red'
                    else return 'green'
                } else if (p === 1) return
                else if (p === 2) {
                    if (value === 0 || value === null) return
                    else if (value > 0) return 'red'
                    else return 'green'
                }
            } else if (numType === 3) {
                // 广告投入占比
                if (p === 0) {
                    if (value === 0 || value === null) return
                    else if (v >= 0) return 'red'
                    else return 'green'
                } else if (p === 1 || p === 2) return
            } else if (numType === 4) {
                // 广告RoAS
                if (value === 0 || value === null) return
                if (p === 0) {
                    if (v <= 0) return 'red'
                    else return 'green'
                } else return
            } else if (numType === 5) {
                // 商品退款率
                if (value === 0 || value === null) return
                if (p === 0) {
                    if (v <= 0) return 'red'
                    else return 'green'
                } else if (p === 1) return
                else {
                    if (value < 0) return 'red'
                    else return 'green'
                }
            } else if (numType === 6) {
                // 头程费用
                if (value === 0 || value === null) return
                if (p === 0) {
                    if (v <= 0) return 'red'
                    else return 'green'
                } else if (p === 1) return
                else {
                    if (v <= 0) return 'red'
                    else return 'green'
                }
            } else if (numType === 7) {
                // 仓储费
                if (value === 0 || value === null) return
                if (p === 0) {
                    if (v <= 0) return 'red'
                    else return 'green'
                } else if (p === 1) return
                else {
                    if (v <= 0) return 'red'
                    else return 'green'
                }
            } else if (numType === 8) {
                // 采购成本
                if (value === 0 || value === null) return
                if (p === 0) return 'black'
                else if (p === 1) return
                else if (p === 2) {
                    if (value < 0) return 'red'
                    else return 'green'
                }
            } else if (numType === 9) {
                // 年化周转
                if (p === 0) {
                    if (value === 0 || value === null) return
                    if (v <= 0) return 'red'
                    else return 'green'
                } else if (p === 1) return
                else {
                    if (value === 0 || value === null) return
                    if (value <= 0) return 'red'
                    else return 'green'
                }
            } else if (numType === 10) {
                // 定价毛利率
                if (p === 0) {
                    if (value === 0 || value === null) return
                    if (v <= 0) return 'red'
                    else return 'green'
                } else if (p === 1) return
                else {
                    if (value <= 0) return 'red'
                    else return 'green'
                }
            }else if(numType === 21){
                //开店完成率
                if(p === 0){
                    if(DiffVal>0) return 'red'
                    else return 'green'
                }else if(p === 1){
                    return ''
                } else{
                    if(value>0){
                        return 'red'
                    }else{
                        return 'green'
                    }
                }
            }else if(numType === 22){
                // 活动蓄水
                if(this.value1!==0){
                    if(p === 0){
                        if(DiffVal>=1) return 'red'
                        else return 'green'
                    }else if(p === 1){
                        if(value>=1){
                            return 'red'
                        }else{
                            return 'green'
                        }
                    }else{
                        if(value>=1){
                            return 'red'
                        }else{
                            return 'green'
                        }
                    }                    
                }else{
                    return ''
                }
            }else if(numType === 23){
                //网拍业绩
                if(p === 0){
                    return ''
                    // if(DiffVal>0) return 'red'
                    // else if(DiffVal==0) return ''
                    // else return 'green'
                }else if(p === 1){
                    return ''
                }else{
                    if(value>0){
                        return 'red'
                    }else{
                        return 'green'
                    }
                }
            }else if(numType === 24){
                //DB货占比
                if(TagVal==0){
                    return ''
                }else{
                    if(p === 0){
                        if(DiffVal>0) return 'red'
                        else return 'green'
                    }else if(p === 1){
                        return ''
                    }else{
                        if(value>0){
                            return 'red'
                        }else{
                            return 'green'
                        }
                    }                    
                }

            }else if(numType === 25){
                //客单价
                if(p === 0){
                    if(DiffVal>0) return 'red'
                    else if(DiffVal==0) return ''
                    else return 'green'
                }else if(p === 1){
                    return ''
                }else{
                    if(value>0){
                        return 'red'
                    }else{
                        return 'green'
                    }
                }
            }else if(numType === 26||numType === 27||numType === 30||numType === 31){
                //26主体摆场动销率 //27内务评分  //30付费留资成交率 //31成交毛利率
                if(TagVal==0||value==0){
                    return ''
                }else{
                    if(p === 0){
                        if(DiffVal>0) return 'red'
                        else return 'green'
                    }else if(p === 1){
                        return ''
                    }else{
                        if(value>0){
                            return 'red'
                        }else{
                            return 'green'
                        }
                    }                    
                }
            }else if(numType === 28){
                //28差评率
                if(p === 1){
                    return ''
                }else if(p === 2){
                    return (TagVal)?(value>0)?'green':'red':''
                }else{
                    if(TagVal==0||value==0){
                        return ''
                    }else{
                        if(value>TagVal){
                            return 'green'
                        }else{
                            return 'red'
                        }                    
                    }                    
                }
            }else if(numType === 29){
                //29推广费用 
                return ''
            }else if(numType === 32){
                //32门店盈利率
                if(p === 0){
                    if(DiffVal>0) return 'red'
                    else return 'green'
                }else if(p === 1){
                    return ''
                } else{
                    if(value>0){
                        return 'red'
                    }else{
                        return 'green'
                    }
                }
            }
        }
        // 处理数值 p为位置  type 1整数带万 2整数 3两位小数百分数 4两位小数
        // handleNum(value,p) {
        //   let arr = [
        //     [1,3,3],
        //     [1,3,3],
        //     [2,2,3],
        //     [3,3,2],
        //     [4,4,2],
        //     [3,3,3],

        //     [1,3,3],
        //     [1,3,1],
        //     [1,1,3],
        //     [1,4,4],
        //     [3,3,3],
        //     [1,1,1]
        //   ]
        //   let type = arr[this.numType][p]
        //   let str = ''
        //   if(value === null || value === 0) return '--'
        //   if(type === 1) {
        //     str = parseInt(value/10000).toLocaleString() + '万'
        //   }else if(type === 2) {
        //     str = parseInt(value).toLocaleString()
        //   }else if(type === 3) {
        //     str = (value * 100).toFixed(2) + '%'
        //   }else if(type === 4) {
        //     str = value.toFixed(2)
        //   }
        //   return str
        // },

        // // p位置
        // handleNum(value,p){
        //   let arr = [
        //     [1,3,3],
        //     [1,3,3],
        //     [2,2,3],
        //     [3,3,2],
        //     [4,4,2],
        //     [3,3,3],
        //     [1,3,3],
        //     [1,3,1],
        //     [1,1,3],
        //     [1,4,4],
        //     [3,3,3],
        //     [1,1,1]
        //   ]
        //   return this.handleNumByType(arr[this.numType][p], value, p)
        // },
        // handleNumByType(type,value,p) {
        //   let str = ''
        //   if((value === null || value === 0) &&
        //   (this.numType !== 0 || p !== 2) && // 支付业绩环比
        //   (this.numType !== 5 || p !== 2) && // 商品退款率环比
        //   (this.numType !== 8 || p !== 2) && // 采购成本环比
        //   (this.numType !== 9 || p !== 2) && // 年化周转差值
        //   (this.numType !== 10 || p !== 2)  // 定价毛利率差值
        //   ) {
        //     return '--'
        //   }
        //   if(value === null) return '--'
        //   if(type === 1) {
        //     str = parseInt(value/10000).toLocaleString() + '万'
        //   }else if(type === 2) {
        //     str = parseInt(value).toLocaleString()
        //   }else if(type === 3) {
        //     str = (value * 100).toFixed(2) + '%'
        //   }else if(type === 4) {
        //     str = value.toFixed(2)
        //   }
        //   return str
        // },
        // // p位置 v1原值 v2其他值
        // handleColor(p,v1) {
        //   let arr = [
        //     // 支付业绩
        //     [1,1,3],
        //     // 发货业绩
        //     [1,1,3],
        //     // 访客量
        //     [4,6,3],
        //     // 广告投入占比
        //     [2,6,6],
        //     // 广告RoAS
        //     [4,6,6],
        //     // 商品退款率
        //     [4,6,5],
        //     // 头程费用
        //     [4,6,4],
        //     // 仓储费
        //     [4,6,4],
        //     // 采购成本
        //     [6,6,5],
        //     // 年化周转
        //     [4,6,4],
        //     // 定价毛利率
        //     [4,6,4],
        //     // 边际毛利率
        //     [6,6,6]
        //   ]
        //   let ruleNum = arr[this.numType][p]
        //   // 默认为灰
        //   let str = ''
        //   // 规则1 0为灰 值大于1为红 否则为绿
        //   if(ruleNum === 1) {
        //     if(v1 === null) str = 'default'
        //     else if(v1 > 1) str = 'red'
        //     else str = 'green'
        //   // 规则2 0为灰 值大于等于0为红 否则为绿
        //   }else if(ruleNum === 2) {
        //     if(v1 === null) str = 'default'
        //     else if(v1 >= 0) str = 'red'
        //     else str = 'green'
        //   // 规则3 0为灰 值大于0为红 否则为绿
        //   }else if(ruleNum === 3) {
        //     if(v1 === null) str = 'default'
        //     else if(v1 > 0) str = 'red'
        //     else str = 'green'
        //   // 规则4 0为灰 值小于等于0为红 否则为绿
        //   }else if(ruleNum === 4) {
        //     if(v1 === null) str = 'default'
        //     else if(v1 <= 0) str = 'red'
        //     else str = 'green'
        //   // 规则5 0为灰 值小于0为红 否则为绿
        //   }else if(ruleNum === 5) {
        //     if(v1 === null) str = 'default'
        //     else if(v1 < 0) str = 'red'
        //     else str = 'green'
        //   // 规则6 为黑
        //   }else if(ruleNum === 6) {
        //     if(v1 === null) str = 'default'
        //     else str = ''
        //   }
        //   return str
        // }


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
            //color: #333;
            //width: 60px;
            //height: 20px;
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
            //font-weight: 500;
            // color: #079909;
            color: rgba(0, 0, 0, 0.88);
            line-height: 24px;
        }
    }


    .left div.text-xl {
        font-size: 21px;
        // color: #aeaeae
    }

    .text-xs {
        font-size: 13px;
        // color: #aeaeae
        color: rgba(0, 0, 0, 0.88);
    }

    .red,.left div.red {
        // color: #ff2219
        color: $red 
    }

    .green,.left div.green {
        // color: #00b050
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
}

// .default {
//   color: #aeaeae
// }
</style>