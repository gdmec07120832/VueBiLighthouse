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
            :style="[{background: computeHoverColor(0, index)}]"
            >{{item}}</div>
        </div>
        <div class="col" v-for="(item, index) in tableData" :key="index">
            <div :class="['row', handlerColor(index1, item1, item, index)]"
                 v-for="(item1, index1) in item" :key="index1"
                 :title="handlerNum(index1, item1, item, index)"
                 @contextmenu="openMenu($event, handlerNum(index1, item1, item, index))"
                 @mouseenter="index1 === 0 ? mouseenter(null, null) : mouseenter(index + 1, index1)"
                 :style="[{background: computeHoverColor(index + 1, index1)}]"
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
        computeHoverColor(col, row) {
            let that = this
            let fun = function(itemNum = 1, normalRowNum = 0) {
                if(that.curCol === null || that.curRow === null) return ''
                if(row === 0) return ''
                else if(row > 0 && row <= normalRowNum) {
                    if(that.curCol === col || that.curRow === row) return that.hoverColor
                    else return ''
                }
                else if(row > 0 && row > normalRowNum) {
                    if(col === 0) {
                        let rowNum = Math.ceil((that.curRow - normalRowNum) / itemNum)
                        if(that.curCol === 0 || rowNum === row - normalRowNum) return that.hoverColor
                        else return ''
                    }
                    else if(col > 0) {
                        let rowNum = Math.ceil((row - normalRowNum) / itemNum)
                        if(that.curCol === 0 && rowNum === that.curRow - normalRowNum) return that.hoverColor
                        else if(that.curCol > 0 && (that.curCol === col || that.curRow === row)) return that.hoverColor
                        else return ''
                    }
                }
            }
            if(this.index === 'CustomerUnitPrice') return fun(3,0)
            if(this.index === 'Deal_channel') return fun(6,0)
            if(this.index === 'Deal_area') return fun(4,0)
            else return fun(1, 0)
        },
        clickTable(e) {
            this.$emit('click', e)
        },
        mouseenter(col, row) {
            this.curCol = col
            this.curRow = row
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
            if(this.index === 'OpenAShop') {
                if(p === 0) return value
                else if(p === 1 || p === 2) return this.handleNum('round', value)
                else if(p === 3) return this.handleNum('percent', value)
            }
            else if(this.index === 'Activity') {
                if(p === 0) return value
                // else if(p === 1 || p === 2 || p === 4) return this.handleNum('tenThousand', value)
                else if(p === 1 || p === 2 || p === 4) {
                    if(value >= 10000) return (value / 10000).toFixed(0) + '万'
                    else if(value < 10000) return (value / 10000).toFixed(1) + '万'
                }
                else if(p === 3 || p === 5) return this.handleNum('percent', value)
            }
            else if(this.index === 'AttractInvestmentA') {
                if(p === 0) return value
                else if(p === 3) return this.handleNum('percent_not_dot', value)
                else return this.handleNum('round', value)

            }
            else if(this.index === 'AttractInvestmentB') {
                if(p === 0) return value
                return this.handleNum('round', value)
            }
            else if(this.index === 'AttractInvestment_SiteSelection') {
                if(p === 0) return value
                else if(p !== 0 && [0, 1, 2].includes(col)) return this.handleNum('round', value)
                else if(p !== 0 && [3].includes(col)) return this.handleNum('percent', value)
            }
            else if(this.index === 'BD') {
                if(p === 0) return value
                else return this.handleNum('percent', value)
            }
            else if(this.index === 'PoorRatingRate_A') {
                if(p === 0) return value
                else return this.handleNum('percent', value)
                // else if(p === 1 || p === 2) return this.handleNum('percent', value)
                // else if((p === 3 || p === 4 || p === 5) && col === 1) return this.handleNum('round', value)
                // else if((p === 3 || p === 4 || p === 5) && col === 2) return this.handleNum('percent', value)
            }
            else if(this.index === 'PoorRatingRate_B') {
                if(p === 0) return value
                else return this.handleNum('percent', value)
                // else if(p === 1 || p === 2 || p === 3 || p === 4) return this.handleNum('percent', value)
            }
            else if(this.index === 'AttractInvestmentC') {
                if(p === 0) return value
                else return this.handleNum('round', value)
                // else if(p === 1 || p === 2 || p === 3 || p === 4) return this.handleNum('percent', value)
            }
            else if(this.index === 'Racquet') {
                if(p === 0) return value
                else if(p === 1 || p === 3 || p === 4) return this.handleNum('round', value)
                else if(p === 2) return this.handleNum('percent', value)
            }
            else if(this.index === 'Deal_channel' || this.index === 'Deal_area') {
                if(p === 0) return value
                else if(col === 0) return value
                else if(col !== 0) return this.handleNum('percent', value)
            }
            else if(this.index === 'CustomerUnitPrice') {
                if(p === 0) return value
                else if(col === 0) return value
                else if(p === 1 || p === 2) return this.handleNum('round', value)
                else if(p === 3) return this.handleNum('percent', value)
            }
            else if(this.index === 'PromotionCost_overView') {
                if(p === 0) return value
                else if([0].indexOf(col) > - 1) return (value / 10000).toFixed(0).toLocaleString() + '万'
                else if([1, 2, 4, 5, 7, 8].indexOf(col) > -1) return this.handleNum('percent', value)
                else if(col === 3 || col === 6) return this.handleNum('round', value)
            }
            else if(this.index === 'PromotionCost_tool_A') {
                if(p === 0) return value
                else if([9].indexOf(col) > - 1) return value >= 10000 ? (value / 10000).toFixed(0).toLocaleString() + '万' : this.handleNum('round', value)
                else if([0, 3, 6].indexOf(col) > - 1) return this.handleNum('round', value)
                else if([1, 2, 4, 5, 7, 8].indexOf(col) > -1) return this.handleNum('percent', value)
                // else if(col === 6) return this.handleNum('round', value)
            }
            else if(this.index === 'PromotionCost_tool_B') {
                if(p === 0) return value
                else if(col === 0) return this.handleNum('round', value)
                else if([6, 9, 12].indexOf(col) > - 1) return value >= 10000 ? (value / 10000).toFixed(0).toLocaleString() + '万' : this.handleNum('round', value)
                else if([3].indexOf(col) > -1) return value.toFixed(2)
                else if([1, 2, 4, 5, 7, 8, 10, 11, 13, 14].indexOf(col) > -1) return this.handleNum('percent', value)
            }
            else if(this.index === 'StoreProfitRate_area') {
                if(p === 0) return value
                else if(p !== 0 && [0, 1, 2].indexOf(col) > -1) return this.handleNum('round', value)
                else if(p !== 0 && [3, 4].indexOf(col) > -1) return this.handleNum('percent', value)
            }
            else if(this.index === 'StoreProfitRate_profit') {
                if(p === 0) return value
                else if(p === 1 || p === 2) return this.handleNum('round', value)
                else if(p === 3) return this.handleNum('percent', value)
            }else if(this.index === 'SFPinRate'){
                if(p === 0) return value
                else if(p === 1) return this.handleNum('round', value)
                // else return this.handleNum('percent', value)
                else return value

            }else if(this.index === 'TuRateOfRetDat'){
                if(p === 0) return value
                else return this.handleNum('round', value)
            }else if(this.index === 'TuRateOfRetDatB'){
                if(p === 0) return value
                else return value
            }else if(this.index === 'HousekeepS'){
                if(p === 0) return value
                else return this.handleNum('round', value)
            }
        },
        // 处理颜色 p是行index col是列index
        handlerColor(p, value, item, col) {
            if (value === null || value === undefined || value === '--' || value === '/') return
            if(this.index === 'OpenAShop') {
                if (p === 3) {
                    if (value >= 1) return 'red'
                    else return 'green'
                }
            }
            else if(this.index === 'Activity') {
                if (p === 3 || p === 5) {
                    if (value >= 1) return 'red'
                    else if(value < 1) return 'green'
                }
            }
            else if(this.index === 'AttractInvestmentA') {
                if(p === 3) {
                    if(value >= 1) return 'red'
                    else return 'green'
                }
            }
            else if(this.index === 'BD') {
                if(p === 3 || p === 5) {
                    if(value >= 0) return 'red'
                    else if(value < 0) return 'green'
                }
            }
            else if(this.index === 'Deal_channel') {
                if(p === 4 && col !== 0) {
                    if(value > 0) return 'red'
                    else if(value < 0) return 'green'
                }
                else if(p === 6 && col !== 0) {
                    if(value >= 1) return 'red'
                    else if(value < 1) return 'green'
                }
            }
            else if(this.index === 'Deal_area') {
                if(p === 3 && col !== 0) {
                    if(value > 0) return 'red'
                    else if(value < 0) return 'green'
                }
                else if(p === 4 && col !== 0) {
                    if(value >= 1) return 'red'
                    else if(value < 1) return 'green'
                }
            }
            else if(this.index === 'CustomerUnitPrice') {
                if(col !== 0 && p === 3) {
                    if(value > 0) return 'red'
                    else if(value < 0) return 'green'
                }
            }
            else if(this.index === 'PromotionCost_overView') {
                if(col === 2 || col === 8) {
                    if(value > 0) return 'green'
                    else if(value < 0) return 'red'
                }
                else if(col === 4) {
                    if(value >= 1) return 'red'
                    else if(value < 1) return 'green'
                }
            }
            // 淘外
            else if(this.index === 'PromotionCost_tool_A') {
                if(col === 5) {
                    if(value >= 0) return 'red'
                    else if(value < 0) return 'green'
                }
                else if(col === 2 || col === 8) {
                    if(value > 0) return 'green'
                    else if(value < 0) return 'red'
                }
            }
            // 淘内
            else if(this.index === 'PromotionCost_tool_B') {
                if([2].indexOf(col) > -1) {
                    if(value >= 1) return 'green'
                    else if(value < 1) return 'red'
                }
                else if([4, 7, 10, 13].indexOf(col) > -1) {
                    if(value >= 1) return 'red'
                    else if(value < 1) return 'green'
                }
            }
            else if(this.index === 'StoreProfitRate_area') {
                if(p !== 0 && col === 3) {
                    if(value > this.tableData[4][p]) return 'red'
                    else if(value <= this.tableData[4][p]) return 'green'
                }
            }else if(this.index === 'SFPinRate'){
                if(p === 4) {
                    if(value.replace(/[%]/g,'') >= 0) return 'red'
                    else if(value.replace(/[%]/g,'') < 0) return 'green'
                }
            }else if(this.index === 'TuRateOfRetDatB'){
                if(p !== 0 &&(p === 4)) {
                    return ''
                }else if(p === 5){
                    if(value.replace(/[%]/g,'') >= 100) return 'red'
                    else if(value.replace(/[%]/g,'') < 100) return 'green'
                }
            }

        },
        comparyDate(d1, d2 = moment(new Date()).format('YYYYMM')) {
            return moment(d1).format('x') > moment(d2).format('x')
        }
    }
}
</script>

<style lang='scss' scoped>
@import '../assets/styles.scss';
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
            white-space: nowrap;
            text-overflow: ellipsis;
            font-family: PingFangSC-Regular, PingFang SC;
            color: rgba(0, 0, 0, 0.88);
        }
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