<!--
 * @Author: 黄浩
 * @Date: 2022-01-05 11:08:16
 * @LastEditTime: 2022-02-28 15:40:46
 * @LastEditors: Please set LastEditors
 * @Descripttion: 
 * @FilePath: \lsmy-bi-lighthouse-front\src\views\BIView\ProductSupply\OverseasCockpit\components\Table.vue
-->
<template>
    <div @click="clickTable" class="Table" @mouseleave="mouseenter(null, null)">
        <div class="col1">
            <div class="row" v-for="(item,index) in labelData" :key="index" :title="item" @mouseenter="mouseenter(0, index)"
            :class="computeHoverClass(0, index)"
            >
                {{item}}
            </div>
        </div>
        <div class="col" v-for="(item, index) in tableData" :key="index">
            <div :class="['row', handlerColor(index1, item1, item, index), computeHoverClass(index + 1, index1)]"
                 v-for="(item1, index1) in item" :key="index1"
                 :title="handlerNum(index1, item1, item, index)"
                 @contextmenu="openMenu($event, handlerNum(index1, item1, item, index))"
                 @mouseenter="mouseenter(index + 1, index1)"
            >{{handlerNum(index1,item1,item, index)}}</div>
        </div>
        <template v-if="!tableData.length">
            <div class='col' v-for="index in (1 - tableData.length)" :key="'empty' + index">
                <div :class="['row']" v-for="(item,index1) in  labelData.length" :key="index1">/</div>
            </div>
        </template>
        <div v-if="menuVisible" class="selectMenu" :style="[{left: menuX},{top: menuY}]">
            <div class="item box" v-clipboard="currentRow" >复制内容</div>
        </div>
    </div>
</template>

<script>
import moment from 'moment'
import base from '../utils/base'
export default {
    name: 'TableComp',
    mixins: [base],
    props: {
        tableData: {
            type: Array
        },
        labelData: {
            type: Array
        },
        index: {
            type: [Number, String]
        }
    },
    data() {
        return {
            menuVisible: false,
            menuX: '0px',
            menuY: '0px',
            currentRow: '',
            curRow: null,
            curCol: null,
            // rgba(65,105,225,0.10)
            // hoverColor: '#edfcf6',
            hoverColor: 'rgba(135,206,250, 0.2)'
        }
    },
    mounted() {
        document.body.addEventListener('click', () => {
            if(this.menuVisible) this.menuVisible = !this.menuVisible
        })
    },
    methods: {
        computeHoverClass(col, row) {
            let that = this
            let fun = function(itemNum = 1, normalRowNum = 0) {
                if(that.curCol === null || that.curRow === null) return ''
                if(row === 0) return ''
                else if(row > 0 && row <= normalRowNum) {
                    if(that.curCol === col || that.curRow === row) return 'hover'
                    else return ''
                }
                else if(row > 0 && row > normalRowNum) {
                    if(col === 0) {
                        let rowNum = Math.ceil((that.curRow - normalRowNum) / itemNum)
                        if(that.curCol === 0 || rowNum === row - normalRowNum) return 'hover'
                        else return ''
                    }
                    else if(col > 0) {
                        let rowNum = Math.ceil((row - normalRowNum) / itemNum)
                        if(that.curCol === 0 && rowNum === that.curRow - normalRowNum) return 'hover'
                        else if(that.curCol > 0 && (that.curCol === col || that.curRow === row)) return 'hover'
                        else return ''
                    }
                }
            }
            if(this.index === 'T2_DeliveryPerformance_SpotRatio') return fun(2,1)
            if(this.index === 'T13_BStoreMarketShare') return fun(4,0)
            else return fun (1, 0)

        },
        clickTable(e) {
            this.$emit('click', e)
        },
        mouseenter(col, row) {
            if(row === 0) {
                this.curRow = null
                this.curCol = null
            }
            else {
                this.curCol = col
                this.curRow = row
            }
        },
        // 右键展开菜单
        openMenu(e,text) {
            e.preventDefault();
            // this.menuX = e.x + 'px'
            // this.menuY = e.y + 'px'
            this.menuX = e.target.offsetLeft + e.offsetX + 'px'
            this.menuY = e.target.offsetTop + e.offsetY + 'px'
            // this.menuX = e.layerX + 'px'
            // this.menuY = e.layerY + 'px'
            this.currentRow = text
            this.menuVisible = true
        },
        // 处理数值 p是行index col是列index
        handlerNum(p,value,item, col) {
            if(value === '/') return '/'
            if(value === null || value === undefined || value === '--') return '--'
            if(this.index === 'T1_PaymentPerformance_ChannelOverview'){
                if(p === 0) return value
                else if([1, 2].includes(p)) return this.handleNum('tenThousand', value)
                else if([3, 4].includes(p)) return this.handleNum('percent', value)
            }
            else if(this.index === 'T2_DeliveryPerformance_SpotRatio'){
                if(p === 0) return value
                else if(p !== 0 && col === 0) return value
                else if(p !== 0 && col !== 0 && [1, 2, 3].includes(p)) return this.handleNum('percent', value)
                else if(p !== 0 && col !== 0 && [4, 5, 6, 7].includes(p)) return this.handleNum('round', value)
            }
            else if(this.index === 'T9_EffectiveFlow'){
                if(p === 0) return value
                else if([1, 2, 3].includes(p)) return this.handleNum('tenThousand', value)
                else if([4, 5].includes(p)) return this.handleNum('percent', value)
            }
            else if(this.index === 'T13_BStoreMarketShare'){
                if(p === 0) return value
                else if(col === 0) return value
                else if(p !== 0 && col !== 0 && p % 4 === 1) return this.handleNum('round', value)
                else if(p !== 0 && col !== 0 && (p % 4 === 2 || p % 4 === 3)) return this.handleNum('percent', value)
                else if(p !== 0 && col !== 0 && p % 4 === 0) return this.handleNum('toFixed2', value)
            }
            return value
        },
        // 处理颜色 p是行index col是列index
        handlerColor(p, value, item, col) {
            if (value === null || value === undefined || value === '--' || value === '/') return ''
            if(this.index === 'T1_PaymentPerformance_ChannelOverview'){
                if(p === 3) return this.handleColor('reach', value)
            }
            else if(this.index === 'T2_DeliveryPerformance_SpotRatio'){
                if(p === 1 && col !== 0) return this.handleColor('YOY', value)
            }
            else if(this.index === 'T9_EffectiveFlow'){
                if(p === 4) return this.handleColor('YOY', value)
                else if(p === 5) return this.handleColor('reach', value)
            }
            else if(this.index === 'T13_BStoreMarketShare'){
                if(col !== 0 && p % 4 === 2) return this.handleColor('YOY', value)
            }
            return ''
        },
        comparyDate(d1, d2 = moment(new Date()).format('YYYYMM')) {
            return moment(d1).format('x') > moment(d2).format('x')
        }
    }
}
</script>

<style lang='scss' scoped>
$red: #ff5953;
$green: #00a854;
.Table{
    display: flex;
    position: relative;
    .col1, .col{
        flex: 1;
        overflow: hidden;
        .row{
            height: 25px;
            line-height: 25px;
            font-size: 12px;
            overflow: hidden;
            white-space: normal;
            //text-overflow: ellipsis;
            font-family: PingFangSC-Regular, PingFang SC;
            color: rgba(0, 0, 0, 0.88);
        }
    }
    .hover{
        background: rgba(135,206,250, 0.2)!important;
    }
    .col1 {
        min-width: 105px;
        max-width:   105px;
    }
    .col1{
        .row{
            padding: 0 8px;
            border-top: 1px solid #e7e9f0;
            border-right: 1px solid #e7e9f0;
            border-left: 1px solid #e7e9f0;
        }
        .row:nth-last-child(1){
            border: 1px solid #e7e9f0
        }
        .row:nth-child(2n - 1) {
            //background: #fcfcff;
            background: #fafafa;
        }
        .row:nth-child(1) {
            //background: #f5f7ff;
            background: #F5F7FF;
        }
        .red{
            color: $red
        }
        .green{
            color: $green
        }
    }
    .col{
        .row{
            padding: 0 8px;
            border-top: 1px solid #e7e9f0;
            border-right: 1px solid #e7e9f0;
            text-align: right;
            cursor: text;
        }
        .row:nth-last-child(1){
            border-top: 1px solid #e7e9f0;
            border-right: 1px solid #e7e9f0;
            border-bottom: 1px solid #e7e9f0;
        }
        .row:nth-child(2n - 1) {
            //background: #fcfcff;
            background: #fafafa;
        }
        .row:nth-child(1) {
            //background: #f5f7ff;
            background: #F5F7FF;
        }
        // .row:nth-child(2n) {
        //     background: #f5f5f5;
        // }
        .red{
            color: $red
        }
        .green{
            color: $green
        }
    }
    //.col:hover .row{
    //    //background: rgba(230,255,251, 0.7);
    //    //background: rgba(65,105,225,0.10);
    //    //background: #edfcf6;
    //    background: rgba(135,206,250, 0.2);
    //}
    //.col:hover .row:nth-child(1) {
    //    //background: #f5f7ff;
    //    //background: rgba(65,105,225,0.10);
    //    //background: #edfcf6;
    //    background: rgba(135,206,250, 0.2);
    //}
}
.selectMenu{
    position: absolute;
    background: #fff;
    border-radius: 2px;
    border: 1px solid #ccc;
    z-index: 2;
    .item{
        cursor: text;
        padding: 5px 20px;
        font-size: 12px;
        color: #666;
    }
    .item:hover{
        background: #f3f3f3;
    }
}
</style>