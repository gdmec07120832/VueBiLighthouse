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
                    return (((val / 10000).toFixed(2)*1||0)).toLocaleString()+'万'
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
                    // return parseInt(val / 10000).toLocaleString() + '万'
                    return (((val / 10000).toFixed(0)*1||0)).toLocaleString()+'万'
                },
            ]
            let numType = this.numType
            // 支付业绩 万 百分比 百分比 0 2 2
            // 发货业绩 万 百分比 百分比 0 2 2
            if (value === null) return '--'
            if (numType === 0 || numType === 1||numType === 2) {
                if (p === 0) {
                    if (value === 0) return '--'
                    else return fun[5](value)
                } else if (p === 1) {
                    if (value === 0) return '--'
                    else return fun[2](value)
                } else if (p === 2) {
                    if (value === 0) return '--'
                    return fun[2](value)
                }
            }else if(numType === 3){
                if (p === 0) {
                    if (value === 0) return '--'
                    else return fun[0](value)
                } else if (p === 1) {
                    if (value === 0) return '--'
                    else return fun[2](value)
                } else if (p === 2) {
                    if (value === 0) return '--'
                    return fun[2](value)
                }
            }else if(numType === 4){
                if (p === 0) {
                    if (value === 0) return '--'
                    else return fun[6](value)
                } else if (p === 1) {
                    if (value === 0) return '--'
                    else return fun[2](value)
                } else if (p === 2) {
                    if (value === 0) return '--'
                    return fun[2](value)
                }
            }else if(numType === 5||numType === 6){
                if (p === 0) {
                    return fun[6](value)
                } else if (p === 1) {
                    return fun[6](value)
                } else if (p === 2) {
                    if (value === 0) return '--'
                    return fun[2](value)
                }
            }else if(numType === 7 ||numType === 11){
                if (p === 0) {
                    if (value === 0) return '--'
                    else return fun[2](value)
                } else if (p === 1) {
                    if (value === 0) return '--'
                    else return fun[2](value)
                } else if (p === 2) {
                    if (value === 0) return '--'
                    return fun[2](value)
                }
            }else if(numType === 8||numType === 9){
                if (p === 0) {
                    if (value === 0) return '--'
                    else return fun[5](value)
                } else if (p === 1) {
                    if (value === 0) return '--'
                    else return fun[5](value)
                } else if (p === 2) {
                    if (value === 0) return '--'
                    return fun[2](value)
                }  
            }else if(numType === 10){
                if (p === 0) {
                    if (value === 0) return '--'
                    else return fun[3](value)
                } else if (p === 1) {
                    if (value === 0) return '--'
                    else return fun[3](value)
                } else if (p === 2) {
                    if (value === 0) return '--'
                    return fun[2](value)
                }  
            }else if(numType === 12){
                if (p === 0) {
                    if (value === 0) return '--'
                    else return fun[2](value)
                } else if (p === 1) {
                    if (value === 0) return '--'
                    else return fun[2](value)
                } else if (p === 2) {
                    return fun[2](value)
                }
            } 


        },
        handleColor(p, value, v) {
            let numType = this.numType
            let MatVal = this.value
            let TagVal = this.value1  
            let DiffVal = this.value2
            // 支付业绩 发货业绩
            if (numType === 0 || numType === 1||numType === 2) {
                if (p === 0) {
                    if (value === 0 || value === null) return
                    else if (TagVal > 1) return 'red'
                    else return 'green'
                } else if (p === 1) {
                    if (value === 0 || value === null) return
                    else if (value > 1) return 'red'
                    else return 'green'
                } else if (p === 2) {
                    if (value === 0 || value === null) return
                    else if (value > 0) return 'red'
                    else return 'green'
                }
            }else if(numType === 3||numType === 4){
                if (p === 0) {
                    if (value === 0 || value === null || TagVal === 0) return
                    else if (TagVal > 1) return 'red'
                    else return 'green'
                } else if (p === 1) {
                    if (value === 0 || value === null) return
                    else if (value > 1) return 'red'
                    else return 'green'
                } else if (p === 2) {
                    if (value === 0 || value === null) return
                    else if (value > 0) return 'red'
                    else return 'green'
                }
            }else if(numType === 5||numType === 6){
                if (p === 0) {
                    if (value > TagVal) return 'green'
                    else return 'red'
                } else if (p === 1) {
                    return ''
                } else if (p === 2) { 
                    if (MatVal > TagVal) return 'green'
                    else return 'red'
                }
            }else if(numType === 7){
                if (p === 0) {
                    if (value < TagVal) return 'green'
                    else return 'red'
                } else if (p === 1) {
                    return ''
                } else if (p === 2) { 
                    if (MatVal < TagVal) return 'green'
                    else return 'red'
                }
            }else if(numType === 8){
                if (p === 0) {
                    return ''
                } else if (p === 1) {
                    return ''
                } else if (p === 2) { 
                    if (value > 0) return 'green'
                    else return 'red'
                }
            }else if(numType === 9){
                if (p === 0) {
                    if (value < TagVal) return 'red'
                    else return 'green'                    
                } else if (p === 1) {
                    return ''
                } else if (p === 2) { 
                    if (value < 0.1) return 'red'
                    else return 'green'
                }
            }else if(numType === 10){
                if (p === 0) {
                    if (value > TagVal) return 'red'
                    else return 'green'                    
                } else if (p === 1) {
                    return ''
                } else if (p === 2) { 
                    if (MatVal > TagVal) return 'red'
                    else return 'green'
                }
            }else if(numType === 11){
                if (p === 0) {
                    if (value < TagVal) return 'red'
                    else return 'green'                    
                } else if (p === 1) {
                    return ''
                } else if (p === 2) { 
                    if (MatVal < TagVal) return 'red'
                    else return 'green'
                }
            }else if(numType === 12){
                if (p === 0) {
                    if (value > TagVal) return 'red'
                    else return 'green'                    
                } else if (p === 1) {
                    return ''
                } else if (p === 2) { 
                    if (MatVal > TagVal) return 'red'
                    else return 'green'
                }
            }


        }



    }
}
</script>

<style lang='scss' scoped>
$red: #ff5953;
$green: #00a854;
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

    .right {
        display: flex;
        flex-flow: column;
        justify-content: space-around;
        text-align: right;
        padding-right: 10px;
        flex: 2;
    }
}

</style>