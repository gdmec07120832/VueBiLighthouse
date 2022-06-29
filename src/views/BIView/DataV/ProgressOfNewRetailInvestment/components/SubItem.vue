<template>
    <div class="SubItem">
        <div class="title">
            <span></span>
            <span>{{ title }}</span>
        </div>
        <div class="box1">
            <div class="content" :style="{'--duration': dataSource.length * 10 + 's'}">
                <div :class="!firstColIsImg ? 'label' : 'label1'">
                    <span class="col" v-for="(item, index) in tableColumn" :key="index">{{item.label}}</span>
                </div>
                <div v-if="!firstColIsImg" class="flexBox">
                    <div class="row" v-for="(item, index) in dataSource.slice(0, 3)" :key="index">
                        <span class="col" :class="cIndex === 4 ? 'active' + (index + 1) : ''" v-for="(col, cIndex) in tableColumn" :key="index + '-' + cIndex">{{item[col.key]}}</span>
                    </div>
                </div>
                <div v-else class="flexBox1">
                    <div class="row" v-for="(item, index) in dataSource.slice(0,3)" :key="index">
                        <span class="col" v-for="(col, cIndex) in tableColumn" :key="index + '-' + cIndex">{{item[col.key]}}</span>
                    </div>
                </div>
                <div class="value" v-if="!firstColIsImg">
                    <div class="valueBox1">
                        <div class="row" v-for="(item, index) in dataSource.slice(3)" :key="index">
                            <span class="col" :class="computeRank(index, cIndex)" v-for="(col, cIndex) in tableColumn" :key="index + '-' + cIndex">{{item[col.key]}}</span>
                        </div>
                    </div>
                    <!--复制一份 滚动的时候不会突兀-->
                    <div class="valueBox2">
                        <div class="row1" v-for="(item, index) in dataSource.slice(3)" :key="index">
                            <span class="col" :class="computeRank(index, cIndex)" v-for="(col, cIndex) in tableColumn" :key="index + '-' + cIndex">{{item[col.key]}}</span>
                        </div>
                    </div>
                </div>
                <div class="value1" v-else>
                    <div class="valueBox1">
                        <div class="row" v-for="(item, index) in dataSource.slice(3)" :key="index">
                            <span class="col" :class="computeRank(index, cIndex)" v-for="(col, cIndex) in tableColumn" :key="index + '-' + cIndex">{{item[col.key]}}</span>
                        </div>
                    </div>
                    <!--复制一份 滚动的时候不会突兀-->
                    <div class="valueBox2">
                        <div class="row1" v-for="(item, index) in dataSource.slice(3)" :key="index">
                            <span class="col" :class="computeRank(index, cIndex)" v-for="(col, cIndex) in tableColumn" :key="index + '-' + cIndex">{{item[col.key]}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            default: '',
        },
        tableColumn: {
            type: Array,
            default() {return []}
        },
        dataSource: {
            type: Array,
            default() {return []}
        },
        firstColIsImg: {
            type: Boolean,
            default: false,
        }
    },
    data() {
        return {

        }
    },
    methods: {
        computeRank(i, cI){
            if(cI === 4) {
                return 'empty'
                // if(i === 0 || i === 1 || i === 2) {
                //     return 'active' + (i + 1)
                // }
                // else {
                //     return 'empty'
                // }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/styles/largeScreen.scss';
.SubItem{
    //padding: 0 px2vw(10);
    height: px2vh(304);
    div, span{
        overflow: hidden;
    }
    .title{
        height: px2vh(51);
        display: flex;
        align-items: center;
        padding: 0 px2vw(10);
        span:nth-child(1) {
            margin-left: px2vw(11);
            margin-right: px2vw(5);
            display: inline-block;
            width: px2vw(13);
            height: px2vh(16);
            background-image: url("~@/assets/images/datav/ProgressOfNewRetailInvestment/doubleRight.png");
            background-repeat: no-repeat;
            background-size: 100% 100%;
        }
        span:nth-child(2) {
            font-size: px2vh(18);
            //line-height: px2vh(18);
            font-family: Microsoft YaHei;
            color: #FFFFFF;
        }
    }
    .box1{
        width: 100%;
        height: px2vh(253);
        position: relative;
        background-image: url("~@/assets/images/datav/ProgressOfNewRetailInvestment/middleArea.png");
        background-repeat: no-repeat;
        background-size: 98% 98%;
        background-position: center;
        .content{
            //z-index: 2;
            width: 100%;
            height: 100%;
            font-size: px2vh(15);
            font-family: Microsoft YaHei;
            color: #FFFFFF;
            //padding: px2vh(10) px2vw(20);
            border-top: px2vh(10) solid transparent;
            border-bottom: px2vh(20) solid transparent;
            border-left: px2vw(20) solid transparent;
            border-right: px2vw(20) solid transparent;
            .label, .label1{
                height: px2vh(40);
                width: 100%;
                display: flex;
                .col{
                    flex: 1;
                    text-align: center;
                }
                .col::before{
                    display: inline-block;
                    content: '';
                    height: 100%;
                    vertical-align: middle;
                }
                .col:nth-child(1) {
                    flex: none;
                    width: px2vw(80);
                    //text-align: left;
                }
                .col:nth-child(5) {
                    color: #158DFF;
                }
                .col:nth-last-child(1) {
                    //text-align: right;
                }
            }
            .label1 .col:nth-child(1) {
                text-align: center;
            }
            .value::-webkit-scrollbar, .value1::-webkit-scrollbar{
                width:0;
            }
            .flexBox{
                height: px2vh(125.4)!important;
            }
            .flexBox1{
                height: px2vh(142.5)!important;
            }
            .value, .value1, .flexBox, .flexBox1{
                //189
                //height: px2vh(63.6);
                //height: px2vh(189);
                height: px2vh(250);
                width: 100%;
                overflow: hidden;
                @keyframes scroll {
                    0% {
                        transform: translateY(0);
                    }
                    49.9% {
                        opacity: 1;
                        transform: translateY(-100%);
                    }
                    50% {
                        opacity: 0;
                        transform: translateY(-100%);
                    }
                    50.1% {
                        opacity: 0;
                        transform: translateY(100%);
                    }
                    50.2% {
                        opacity: 1;
                        transform: translateY(100%);
                    }
                    100% {
                        transform: translateY(0);
                    }
                }
                @keyframes scroll1 {
                    0% {
                        transform: translateY(0);
                    }
                    100% {
                        transform: translateY(-200%);
                    }
                }
                .valueBox1{
                    animation: scroll var(--duration) linear infinite;
                }
                .valueBox2{
                    animation: scroll1 var(--duration) linear infinite;
                }
                .row, .row1{
                    display: flex;
                    height: px2vh(41.8);
                    border-bottom: px2vh(1) solid rgba(21, 141, 255, 0.1);
                    //position: relative;
                    .active1::before, .active2::before, .active3::before, .empty::before{
                        display: inline-block;
                        content: '';
                        width: px2vw(17);
                        height: px2vh(25);
                        transform: translateY(px2vh(2));
                        background-repeat: no-repeat;
                        background-size: 100% 100%;
                        vertical-align: middle;
                        margin-right: px2vw(3);
                    }
                    .active1::before{
                        background-image: url("~@/assets/images/datav/ProgressOfNewRetailInvestment/active1.png");
                    }
                    .active2::before{
                        background-image: url("~@/assets/images/datav/ProgressOfNewRetailInvestment/active2.png");
                    }
                    .active3::before{
                        background-image: url("~@/assets/images/datav/ProgressOfNewRetailInvestment/active3.png");
                    }
                    .col{
                        flex: 1;
                        text-align: center;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    .col::after{
                        display: inline-block;
                        content: '';
                        height: 100%;
                        vertical-align: middle;
                    }
                    .col:nth-child(1) {
                        flex: none;
                        //justify-content: flex-start;
                        width: px2vw(80);
                        text-align: left;
                    }
                    .col:nth-child(5) {
                        color: #158DFF;
                        justify-content: flex-start;
                    }
                    .col:nth-last-child(1) {
                        //text-align: right;
                    }
                }
            }
            .value1, .flexBox1{
                .row .col:nth-child(1), .row1 .col:nth-child(1) {
                    text-align: center;
                }
                .row:nth-child(1), .row:nth-child(2), .row:nth-child(3), .row1:nth-child(1), .row1:nth-child(2), .row1:nth-child(3){
                    height: px2vh(47.5);
                    .col:nth-child(1)::before {
                        display: inline-block;
                        content: '';
                        width: px2vw(35);
                        height: px2vh(35);
                        background-repeat: no-repeat;
                        background-size: 100% 100%;
                        background-position: center;
                        vertical-align: middle;
                        //margin-right: px2vw(3);
                    }
                }
                .row:nth-child(1) .col:nth-child(1)::before, .row1:nth-child(1) .col:nth-child(1)::before{
                    background-image: url("~@/assets/images/datav/ProgressOfNewRetailInvestment/rank1.png");
                }
                .row:nth-child(2) .col:nth-child(1)::before, .row1:nth-child(2) .col:nth-child(1)::before{
                    background-image: url("~@/assets/images/datav/ProgressOfNewRetailInvestment/rank2.png");
                }
                .row:nth-child(3) .col:nth-child(1)::before, .row1:nth-child(3) .col:nth-child(1)::before{
                    background-image: url("~@/assets/images/datav/ProgressOfNewRetailInvestment/rank3.png");
                }
            }
            .value1{
                .col:nth-child(1)::before{
                    display: none!important;
                }
            }
        }
    }
}
</style>