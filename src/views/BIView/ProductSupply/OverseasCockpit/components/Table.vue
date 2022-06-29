<!--
 * @Author: 黄浩
 * @Date: 2022-01-05 11:08:16
 * @LastEditTime: 2022-02-28 15:40:46
 * @LastEditors: Please set LastEditors
 * @Descripttion: 
 * @FilePath: \lsmy-bi-lighthouse-front\src\views\BIView\ProductSupply\OverseasCockpit\components\Table.vue
-->
<template>
    <div v-if="type === 2" class="Table" @mouseleave="curRow = null;curCol = null">
        <div class="col1" @mouseenter="mouseenter(null, null)">
            <div class="row" v-for="(item,index) in labelData" :key="index" :title="item"
                 :style="[{background: (curRow === index && curRow !== 0) ? hoverColor : null}]"
                 >{{item}}</div>
        </div>
        <div class="col" v-for="(item, index) in tableData" :key="index">
            <div :class="['row', handlerColor(index1, item1, item)]" v-for="(item1, index1) in item" :key="index1"
                 :title="handlerNum(index1,item1,item)" @contextmenu="openMenu($event, handlerNum(index1,item1,item))"
                 @mouseenter="index1 !== 0 ? mouseenter(index, index1) : mouseenter(null, null)"
                 :style="[{background: ((curRow === index1 && curRow !== 0) || (curCol === index && index1 !== 0) ) ? hoverColor : null}]">{{handlerNum(index1,item1,item)}}</div>
        </div>
        <template v-if="tableData.length <= 12">
            <div class='col' v-for="index in (12 - tableData.length)" :key="'empty' + index">
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
import base from '../utils/base.js'
export default {
    mixins: [ base ],
    props: {
        type: {
            type: Number,
            default: 1  
        },
        label1: {
            type: String
        },
        label2: {
            type: String
        },
        label3: {
            type: String
        },
        label4: {
            type: String
        },
        tableData: {
            type: Array
        },
        labelData: {
            type: Array
        },
        // tab标志 0 为业绩概览 '2A' 为访客分析的访客量 '2B' 销量 '2C' 销售转化率 '2D'是访客分析月访客量 '2E'销量 '2F'销量转化率
        // 3A是广告投放情况-日 3B是广告投放情况-月 4A广告RoAS-日 4B广告RoAS-月 5采购成本 6头程费用 7仓储费用 10年化周转
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
            hoverColor: 'rgba(135,206,250, 0.2)',
        }
    },
    mounted() {
        document.body.addEventListener('click', () => {
            if(this.menuVisible) this.menuVisible = !this.menuVisible
        })
    },
    methods: {
        mouseenter(col, row) {
            this.curCol = col
            this.curRow = row
        },
        // 右键展开菜单
        openMenu(e,text) {
            console.log(e);
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
        // 处理数值 p位置 0,1,2
        handlerNum(p,value,item) {
            let str = ''
            // if(value === '--' || value === null || value === undefined) return '--'
            if(value === ' ' || value === '/') return value
            else if(value === '--' || value === null || value === undefined) return '--'
            // 业绩概览
            if(this.index === '0A') {
                if(p === 0) return value
                // if(this.comparyDate(moment(item[0]).format('YYYYMMDD'))) return '--'
                else if(p === 1 || p === 2) str = value === 0 ? '--' : (value / 10000).toFixed(2).toLocaleString() + '万'
                else if(p === 3) str = (value * 100).toFixed(2) + '%'
            }else if(this.index === '0B') {
                if(p === 0) return value
                // if(item[0] !== '合计' && this.comparyDate(moment(item[0]).format('YYYYMM'))) return '--'
                // else if(p === 1) str = (value * 100).toFixed(2) + '%'
                // else if(p === 2 || p === 3 || p === 4) str = value === 0 ? '--' : (value / 10000).toFixed(2).toLocaleString() + '万'
                // else if(p === 5) str = (value * 100).toFixed(2) + '%'
                // else if(p === 5) str = (value * 100).toFixed(2) + '%'
                if([1, 2, 4].includes(p)) return this.handleNum('tenThousand', value)
                else if([3, 5].includes(p)) return this.handleNum('percent_one_dot', value)
            }
            else if(this.index === '访客转化率_当月_访客转化率') {
                if(p === 0) str = value
                else if([1, 2, 3].includes(p)) return this.handleNum('percent_one_dot', value)
            }
            else if(this.index === '访客转化率_当月_访客量' || this.index === '访客转化率_当月_销量') {
                // 访客分析
                if(p === 0) str = value
                else if(p === 1 || p === 2) return this.handleNum('round', value)
                else if(p === 3) return this.handleNum('percent_one_dot', value)
            }
            else if(this.index === '访客转化率_月度_访客转化率') {
                if(p === 0) return value
                else if([1, 2, 3].includes(p)) return this.handleNum('percent_one_dot', value)
            }
            else if(this.index === '访客转化率_月度_访客量' || this.index === '访客转化率_月度_销量') {
                if(p === 0) return value
                else if([1, 2].includes(p)) return this.handleNum('round', value)
                else if([3, 4].includes(p)) return this.handleNum('percent_one_dot', value)
            }
            else if(this.index === '广告投入占比_当月') {
                if(p === 0) str = value
                else if([1, 2].includes(p)) return this.handleNum('round', value)
                else if([3].includes(p)) return this.handleNum('percent_one_dot', value)
                // else if(p === 1 || p === 2 || p === 3) str = value === 0 ? '--' : parseInt(value).toLocaleString()
                // else if(p === 4) str = value === 0 ? '--' : (value * 100).toFixed(2) + '%'
            }
            else if(this.index === '广告投入占比_月度') {
                if(p === 0) return value
                else if([1, 2, 5].includes(p)) return this.handleNum('percent_one_dot', value)
                else if([3, 4].includes(p)) return this.handleNum('tenThousand', value)
            }
            else if(this.index === '广告roas_当月') {
                if(p === 0) str = value
                else if(p === 1 || p === 2) str = value === 0 ? '--' : parseInt(value).toLocaleString()
                else if(p === 3) str = value === 0 ? '--' : this.handleNum('toFixed2', value)
            }else if(this.index === '广告roas_月度') {
                if(p === 0) return value
                else if([1, 2].includes(p)) return this.handleNum('tenThousand', value)
                else if([3, 4, 5, 6].includes(p)) return this.handleNum('toFixed2', value)
            }
            else if(this.index === '采购成本') {
                if([0].includes(p)) return value
                else if([1, 2].includes(p)) return this.handleNum('round', value)
                else if([3].includes(p)) return this.handleNum('percent_one_dot', value)
            }
            else if(this.index === 6) {
                if(p === 0) str = value === '合计' ? '合计' : moment(value).format('YYYY-MM')
                else if(p === 1 || p === 2) str = (value * 100).toFixed(2) + '%'
                else if(p === 3 || p === 4) str = parseInt(value).toLocaleString()
            }else if(this.index === 7 || this.index === 8) {
                if(p === 0) return str = value === '合计' ? '合计' : moment(value).format('YYYY-MM')
                if(item[0] !== '合计' && this.comparyDate(moment(item[0]).format('YYYYMM'))) return '--'
                else if(p === 1 || p === 2) str = value === 0 ? '--' : (value * 100).toFixed(2) + '%'
                else if(p === 3 || p === 4) str = value === 0 ? '--' : parseInt(value).toLocaleString()
            }else if(this.index === '9A') {
                if(p === 0) str = moment(value).format('DD')
                else if(p === 1 || p === 2) str = value === 0 ? '--' : parseInt(value).toLocaleString()
                else if(p === 3) str = value === 0 ? '--' : (value * 100).toFixed(2) + '%'
                // else if(p === 1 || p === 3) str = value === 0 ? '--' : (value * 100).toFixed(2) + '%'
                // else if(p === 2 || p === 4) str = value === 0 ? '--' : parseInt(value).toLocaleString()
            }else if(this.index === '退款率') {
                if([0].includes(p)) return value
                else if([1, 2].includes(p)) return this.handleNum('round', value)
                else if([3].includes(p)) return this.handleNum('percent_one_dot', value)
                else if([4, 5].includes(p)) return this.handleNum('percent_two_dot', value)
            }
            else if(this.index === '年化周转') {
                if([0].includes(p)) return value
                else if([3, 5].includes(p)) return this.handleNum('percent_one_dot', value)
                else return this.handleNum('toFixed2', value)
            }
            else if(this.index === '定价毛利率') {
                if(p === 0) return value
                else return this.handleNum('percent_one_dot', value)
            }else if(this.index === '14A') {
                if(p === 0) str = moment(value).format('DD')
                else if(p === 1 || p === 2) str = value === 0 ? '--' : parseInt(value).toLocaleString()
                else if(p === 3) str = value === 0 ? '--' : (value * 100).toFixed(2) + '%'
            }else if(this.index === '14B') {
                if(p === 0) return str = moment(value).format('YYYY-MM')
                if(item[0] !== '合计' && this.comparyDate(moment(item[0]).format('YYYYMM'))) return '--'
                else if(p === 1) str = value === 0 ? '--' : parseInt(value).toLocaleString()
                else if(p === 2 || p === 3) str = value === 0 ? '--' : (value * 100).toFixed(2) + '%'
            }
            return str
        },
        // 处理颜色
        handlerColor(p, value, item) {
            if(this.index === '0A') {
                if(p === 3) {
                    if(value === 0 || value === null || value === '--') return
                    if(value >= 1) return 'red'
                    else return 'green'
                }
            }else if(this.index === '0B') {
                if(value === 0 || value === null || value === '--') return
                if(p === 5) {
                    if(value > 0) return 'red'
                    else if(value < 0) return 'green'
                }else if(p === 3) {
                    if(value >= 1) return 'red'
                    else return 'green'
                    // if(value === '是') return 'red'
                    // else if(value === '否') return 'green'
                    // if(value === 0 || value === null || value === '--') return
                    // if(value >= 1) return 'red'
                    // else return 'green'
                }
            }
            else if(this.index === '访客转化率_当月_访客转化率') {
                if(p === 2) return this.handleColor('diff', this.handleYOYOrReach('diff', item[2], item[1]))
            }
            else if(this.index === '访客转化率_当月_访客量' || this.index === '访客转化率_当月_销量') {
                if(p === 3) return this.handleColor('reach', value)
            }
            else if(this.index === '访客转化率_月度_访客转化率') {
                if([2].includes(p)) return this.handleColor('diff', this.handleYOYOrReach('diff', item[2], item[1]))
            }
            else if(this.index === '访客转化率_月度_访客量' || this.index === '访客转化率_月度_销量') {
                if(p === 3) return this.handleColor('reach', value)
            }
            else if(this.index === '广告投入占比_月度'){
                if([2].includes(p)) return this.handleColor('diff_reverse', this.handleYOYOrReach('diff', item[2], item[1]))
            }
            else if(this.index === '采购成本'){
                if([2, 3].includes(p)) return this.handleColor('diff', value)
            }
            else if(this.index === '广告roas_月度') {
                if([4].includes(p)) return this.handleColor('diff', this.handleYOYOrReach('diff', item[4], item[3]))
                return ''
                // if(p === 4) {
                //     if(value === 0 || value === null || value === '--') return
                //     if(value > 0) return 'red'
                //     else if(value < 0) return 'green'
                // }
            }
            else if(this.index === '退款率') {
                if(p === 4) return this.handleColor('diff_reverse', this.handleYOYOrReach('diff', item[4], item[3]))
            }
            else if(this.index === '定价毛利率'){
                if([2].includes(p)) return this.handleColor('diff', this.handleYOYOrReach('diff', item[2], item[1]))
            }
            else if(this.index === '年化周转'){
                if([3].includes(p)) return this.handleColor('reach', value)
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
            color: #808492;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
        .row:nth-child(1) {
            font-weight: bold;
        }
    }
    .col1 {
        min-width: 105px;
        max-width: 105px;
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
            background: #fafafa;
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
            background: #fafafa;
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
    //    background: rgba(135,206,250, 0.2);
    //}
    //.col .row:hover{
    //    background: rgba(135,206,250, 0.2);
    //}
    //.col .row:nth-child(1):hover{
    //    background: #fafafa;
    //}
    //.col:hover .row:nth-child(1) {
    //    background: #fafafa;
        //background: rgba(135,206,250, 0.2);
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