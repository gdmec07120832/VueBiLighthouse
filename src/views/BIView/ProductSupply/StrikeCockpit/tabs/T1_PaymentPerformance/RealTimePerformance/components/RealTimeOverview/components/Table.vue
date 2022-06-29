<!--
 * @Author: 黄浩
 * @Date: 2021-12-27 14:48:28
 * @LastEditTime: 2021-12-29 17:29:43
 * @LastEditors: Please set LastEditors
 * @Descripttion: 
 * @FilePath: \lsmy-bi-lighthouse-front\src\views\BIView\ProductSupply\ChannelOverviewRealTimePerformance\components\RealTimeOverview\components\table.vue
-->
<template>
    <div class="table">
        <div class="top">
            <div v-if="widthOther !== '0%'" :style="{'width': widthOther}" class="col1">汇总
<!--                <div class="border"></div>-->
            </div>
            <div v-if="widthOl !== '0%'" :style="{'width': widthOl}" class="col">线上
<!--                <div class="border"></div>-->
            </div>
            <div v-if="widthOffline !== '0%'" :style="{'width': widthOffline}" class="col">线下
<!--                <div class="border"></div>-->
            </div>
            <div v-if="widthOverSea !== '0%'" :style="{'width': widthOverSea}" class="col">海外
<!--                <div class="border"></div>-->
            </div>
            <div style="flex: 1;" class="col">/</div>
<!--            <div style="background: #fff;flex: 1;height: 254px;transform: translateX(1px) translateY(-1px)"></div>-->
        </div>
        <div class="content">
            <div class="col1">
                <div class="row">渠道细分</div>
                <div @mouseover="mouseover(0, 0)" @mouseout="mouseout" :class="active(0, 0)" class="row">目标</div>
                <div @mouseover="mouseover(1, 0)" @mouseout="mouseout" :class="active(1, 0)" class="row">实绩</div>
                <div @mouseover="mouseover(2, 0)" @mouseout="mouseout" :class="active(2, 0)" class="row">达成</div>
                <div @mouseover="mouseover(3, 0)" @mouseout="mouseout" :class="active(3, 0)" class="row">占总</div>
                <div @mouseover="mouseover(4, 0)" @mouseout="mouseout" :class="active(4, 0)" class="row">同比</div>
            </div>
            <div class="col" v-for="(item, index) in tableData" :key="index">
                <div class="row1">{{index == 0 ? '合计' : item.CHANNEL}}</div>
                <div @mouseover="mouseover(0, index + 1)" @mouseout="mouseout" :class="active(0, index + 1)" :title="item.SALES_TARGET" @contextmenu="(e) => openMenu(e,item.SALES_TARGET)" class="row">{{item.SALES_TARGET}}</div>
                <div @mouseover="mouseover(1, index + 1)" @mouseout="mouseout" :class="active(1, index + 1)" :title="item.SALE_AMT" @contextmenu="(e) => openMenu(e,item.SALE_AMT)" class="row">{{item.SALE_AMT}}</div>
                <div @mouseover="mouseover(2, index + 1)" @mouseout="mouseout" :class="['row', classFun(item.CMP_RATE), active(2, index + 1)]" :title="item.CMP_RATE" @contextmenu="(e) => openMenu(e,item.CMP_RATE)">{{item.CMP_RATE}}</div>
                <div @mouseover="mouseover(3, index + 1)" @mouseout="mouseout" :class="active(3, index + 1)" :title="item.TOT_RATE" @contextmenu="(e) => openMenu(e,item.TOT_RATE)" class="row">{{item.TOT_RATE}}</div>
                <div @mouseover="mouseover(4, index + 1)" @mouseout="mouseout" :class="['row', classFun1(item.AGO_DIF_RATE), active(4, index + 1)]" :title="item.AGO_DIF_RATE" @contextmenu="(e) => openMenu(e,item.AGO_DIF_RATE)">{{item.AGO_DIF_RATE}}</div>
            </div>
        </div>
        <div v-if="menuVisible" class="selectMenu" :style="[{left: menuX},{top: menuY}]">
            <div class="item box" v-clipboard="currentRow" >复制内容</div>
            <!-- <div class="item" @click="copy">其他</div> -->
        </div>
    </div>
</template>

<script>
export default {
    computed: {
        widthOther() {
            let arr = this.tableData.filter(item => {
                return item.CHANNEL.indexOf('汇总') > -1
            })
            return (arr.length * 9 + 10) + '%'
        },
        widthOl() {
            let arr = this.tableData.filter(item => {
                return item.CHANNEL.indexOf('线上') > -1
            })
            return arr.length * 9 + '%'
        },
        widthOffline() {
            let arr = this.tableData.filter(item => {
                return item.CHANNEL.indexOf('线下') > -1
            })
            return arr.length * 9 + '%'
        },
        widthOverSea() {
            let arr = this.tableData.filter(item => {
                return item.CHANNEL.indexOf('海外') > -1
            })
            return arr.length * 9 + '%'
        }
    },
    mounted() {
        document.body.addEventListener('click',() => {
            if(this.menuVisible) this.menuVisible = !this.menuVisible
        })
    },
    props: {
        currentView: {
            type: Number
        },
        tableData: {
            type: Array
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
        }
    },
    methods: {
        // 右键展开菜单
        openMenu(e,text) {
            e.preventDefault();
            this.menuX = e.target.offsetLeft + 50 + 'px'
            this.menuY = e.target.offsetTop + 18 + 'px'
            this.currentRow = text
            this.menuVisible = true
        },
        // 达成
        classFun(val) {
            if(val.split('%')[0] >= 100) return 'red'
            else return 'green'
        },
        // 同比
        classFun1(val) {
            if(val.split('%')[0] > 0) return 'red'
            else if(val.split('%')[0] < 0) return 'green'
        },
        mouseover(row, col) {
            this.curRow = row
            this.curCol = col
        },
        mouseout() {
            this.curRow = null
            this.curCol = null
        },
        active(row, col) {
            if(row === this.curRow || col === this.curCol) return 'active'
            else return ''
        }
    }
}
</script>

<style lang='scss' scoped>
@import '~@/assets/styles/common.scss';
.table{
    width: 100%;
    position: relative;
    .green {
        color: $fall!important
    }
    .red{
        color: $rise!important
    }
    .top{
        display: flex;
        height: 36px;
        .col1{
            height: 36px;
            position: relative;
            //background: #FAFAFA;
            background: #F5F7FF;
            font-size: 12px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 600;
            color: rgba(0, 0, 0, 0.85);
            line-height: 36px;
            text-align: center;
            position: relative;
            border-right: 1px solid #e7e9f0;
        }
        .col{
            font-size: 12px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 600;
            color: rgba(0, 0, 0, 0.85);
            line-height: 36px;
            text-align: center;
            position: relative;
            //background: #FAFAFA;
            background: #F5F7FF;
            border-right: 1px solid #e7e9f0;
        }
        .col:nth-last-child(1){
            border-right: none;
        }
        .col1, .col{
            border-bottom: 1px solid #e7e9f0;
            .border{
                position: absolute;
                right: 0;
                top: 0;
                width: 1px;
                height: 252px;
                background: #e7e9f0;
            }
        }
    }
    .content{
        width: 100%;
        display: flex;
        .col1{
            width: 10%;
            border-right: 1px solid #e7e9f0;
            .row{
                height: 36px;
                width: 100%;
                text-align: center;
                line-height: 36px;
                font-size: 12px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 600;
                color: rgba(0, 0, 0, 0.88);
                border-bottom: 1px solid #e7e9f0;
            }
            .row:nth-last-child(1){
                border-bottom: none;
            }
            .row:nth-child(odd){
                background: #FAFAFA;
            }
            .active {
                background: rgba(135, 206, 250, 0.2)!important;
            }
        }
        .col{
            width: 9%;
            border-right: 1px solid #e7e9f0;
            .row1{
                height: 36px;
                width: 100%;
                text-align: center;
                line-height: 36px;
                font-size: 12px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 600;
                color: rgba(0, 0, 0, 0.88);
                background: #FAFAFA;
                border-bottom: 1px solid #e7e9f0;
            }
            .row{
                height: 36px;
                width: 100%;
                text-align: center;
                line-height: 36px;
                font-size: 12px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: rgba(0, 0, 0, 0.88);
                overflow: hidden;
                border-bottom: 1px solid #e7e9f0;
            }
            .row:nth-last-child(1){
                border-bottom: none;
            }
            .active {
                background: rgba(135, 206, 250, 0.2)!important;
            }
            .row:nth-child(odd){
                background: #FAFAFA;
            }
        }
        .col:nth-last-child(1){
            border-right: none;
        }
    }
    .selectMenu{
        position: absolute;
        background: #fff;
        border-radius: 2px;
        border: 1px solid #ccc;
        .item{
            cursor: pointer;
            padding: 5px 20px;
            font-size: 12px;
            color: #666;
        }
        .item:hover{
            background: #f3f3f3;
        }
    }
}
</style>