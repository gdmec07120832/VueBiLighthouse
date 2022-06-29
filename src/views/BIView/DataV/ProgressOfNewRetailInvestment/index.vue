<template>
    <div class="ProgressOfNewRetailInvestment">
        <div class="header">
            <div class="center">新零售招商进度</div>
            <div class="right">截至{{ currentDate }}</div>
        </div>
        <div class="main">
            <div class="overView">
                <div class="title">大区概览</div>
<!--                <SubItem v-bind="leftItem1"/>-->
                <SubItem v-bind="leftItem2"/>
                <SubItem v-bind="leftItem3"/>
            </div>
            <div class="progress">
                <div class="title">{{YY}}年开店进度</div>
                <div class="subTitle">
                    <span></span>
                    <span>区域开店进度</span>
                </div>
                <div class="topBox">
                    <div class="leftBox">
                        <div class="item" v-for="(item, index) in middleLeft" style="background: #070e21;transition: all 0.8s;border-radius: 3px"
                             :style="item.style" :key="index"
                             :class="item.class"
                        >
                            <div class="ball">
                                <div>{{item.title}}</div>
                                <div>{{item.value}}</div>
                            </div>
                            <div class="valueBox">
                                <div class="row1">
                                    <div class="col">
                                        <span class="label">{{item.label1}}</span>
                                        <span class="value">{{item.value1}}</span>
                                    </div>
                                    <div class="col">
                                        <span class="label">{{item.label2}}</span>
                                        <span class="value">{{item.value2}}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="area">
                        <div class="areaTitle">
                            <span></span>
                            <span>{{ currentAreaTitle }}</span>
                        </div>
                        <div class="label">
                            <div class="col" v-for="(item, index) in middleArea[0].tableColumn" :key="index">{{item.label}}</div>
                        </div>
                        <div class="valueBoxs" style="overflow:hidden;">
                            <div class="valueBox" v-for="(_, __) in middleArea" :key="__" :style="_.style" style="background: #061122;position: absolute;transition: all 0.8s linear">
                                <div class="row" v-for="(item, index) in _.source" :key="index">
                                    <div class="col" v-for="(cItem, cIndex) in _.tableColumn" :key="index + '-' + cIndex">{{item[cItem.key]}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="map">
                    <div class="mapTitle">全国开店状况</div>
<!--                    <div class="content"></div>-->
                    <Map class="content" :provinceData="provinceData"/>
                </div>
            </div>
            <div class="rank">
                <div class="title">开店排行榜</div>
<!--                <SubItem v-bind="rightItem1"/>-->
                <SubItem v-bind="rightItem2"/>
                <SubItem v-bind="rightItem3"/>
            </div>
        </div>
    </div>
</template>

<script>
import SubItem from './components/SubItem'
import moment from 'moment'
import Map from './components/Map'
import _ from 'lodash'
export default {
    components: {
        SubItem,
        Map
    },
    created() {
        if(this.currentUrl.indexOf('test.bi.linshimuye.com')>=0){
            window.location.replace("http://10.10.14.123:9090/frame/progress-of-new-retail-investment");
        }else if(this.currentUrl.indexOf('bi.linshimuye.com')>=0){
            window.location.replace("http://10.10.1.168:9090/frame/progress-of-new-retail-investment");
        }
        this.getAreaSum()
        this.getAreaStoreType()
        this.getOpenSum()
        this.getAreaOpen()
        this.getProvince()
        this.getOpenRank()
        let that = this
        this.timer = setInterval(() => {
            that.getAreaSum()
            that.getAreaStoreType()
            that.getOpenSum()
            that.getAreaOpen()
            that.getProvince()
            that.getOpenRank()
        }, 5 * 60 * 1000)
        this.timer1 = setInterval(() => {
            let arr = this.middleLeft.map(item => item.style)
            arr.unshift(arr.pop())
            this.middleLeft = this.middleLeft.map((item, index) => {
                return {
                    ...item,
                    style: arr[index],
                }
            })
            this.currentAreaTitle = this.middleLeft.filter(_ => _.style.background === '#1b314e')[0].title
        }, 10000)
        this.timer2 = setInterval(() => {
            let arr = this.middleArea.map(item => item.style)
            arr.unshift(arr.pop())
            this.middleArea = this.middleArea.map((item, index) => {
                return {
                    ...item,
                    style: arr[index]
                }
            })
        }, 10000)
    },
    beforeDestroy() {
        clearInterval(this.timer)
    },
    data() {
        let currentUrl = window.location.host
        return {
            currentUrl,
            timer: null,
            timer1: null,
            timer2: null,
            currentDate: moment().format('YYYY年MM月DD日'),
            YY: moment().format('YY'),
            leftItem1: {
                title: '汇总',
                tableColumn: [
                    {label: '部门', key: 'AREA_NAME'},
                    {label: '开店目标', key: 'OPEN_TGT'},
                    {label: '累计开店', key: 'OPEN_ACT'},
                    {label: '建店中', key: 'BUILDING_SHOP'},
                    {label: '完成率', key: 'OPEN_RATE'},
                    {label: '选址通过', key: 'LOCAT_ACT'},
                    {label: '意向金', key: 'YXJ_ACT'},
                ],
                dataSource: []
            },
            leftItem2: {
                title: '成品店（个）',
                tableColumn: [
                    {label: '大区', key: 'AREA_NAME'},
                    {label: '开店目标', key: 'OPEN_TGT'},
                    {label: '累计开店', key: 'OPEN_ACT'},
                    {label: '建店中', key: 'BUILDING_SHOP'},
                    {label: '完成率', key: 'OPEN_RATE'},
                    {label: '选址通过', key: 'LOCAT_ACT'},
                    {label: '意向金', key: 'YXJ_ACT'},
                ],
                dataSource: []
            },
            leftItem3: {
                title: '融合店（个）',
                tableColumn: [
                    {label: '大区', key: 'AREA_NAME'},
                    {label: '开店目标', key: 'OPEN_TGT'},
                    {label: '累计开店', key: 'OPEN_ACT'},
                    {label: '建店中', key: 'BUILDING_SHOP'},
                    {label: '完成率', key: 'OPEN_RATE'},
                    {label: '选址通过', key: 'LOCAT_ACT'},
                    {label: '意向金', key: 'YXJ_ACT'},
                ],
                dataSource: []
            },
            middleLeft: [
                {
                    title: '汇总',
                    value: '--',
                    label1: '目标',
                    value1: '--',
                    label2: '累计',
                    value2: '--',
                    // boxShadow: '1px 1px 2px 1px #158dff, 1px 1px 1px 1px #158dff'
                    style: {background: '#1b314e'},
                },
                {
                    title: '成品店',
                    value: '--',
                    label1: '目标',
                    value1: '--',
                    label2: '累计',
                    value2: '--',
                    style: {},
                },
                {
                    title: '融合店',
                    value: '--',
                    label1: '目标',
                    value1: '--',
                    label2: '累计',
                    value2: '--',
                    style: {},
                },
                // {
                //     title: '融合店',
                //     value: '--',
                //     label1: '目标',
                //     value1: '--',
                //     label2: '目标',
                //     value2: '--',
                //     label3: '累计',
                //     value3: '--',
                //     label4: '累计',
                //     value4: '--',
                //     label5: '达成',
                //     value5: '--',
                //     label6: '达成',
                //     value6: '--',
                // },
            ],
            // middleArea: {
            //     tableColumn: [
            //         {label: '部门', key: 'S_OR_N'},
            //         {label: '开店目标', key: 'OPEN_TGT'},
            //         {label: '累计开店', key: 'OPEN_ACT'},
            //         {label: '建店中', key: 'BUILDING_SHOP'},
            //         {label: '完成率', key: 'OPEN_RATE'},
            //         {label: '选址通过', key: 'LOCAT_ACT'},
            //         {label: '意向金', key: 'YXJ_ACT'},
            //     ],
            //     source: []
            // },
            currentAreaTitle: '汇总',
            middleArea: [
                {
                    name: '汇总',
                    style: {top: '0', zIndex: 99},
                    tableColumn: [
                        {label: '区域', key: 'S_OR_N'},
                        {label: '开店目标', key: 'OPEN_TGT'},
                        {label: '累计开店', key: 'OPEN_ACT'},
                        {label: '建店中', key: 'BUILDING_SHOP'},
                        {label: '完成率', key: 'OPEN_RATE'},
                        {label: '选址通过', key: 'LOCAT_ACT'},
                        {label: '意向金', key: 'YXJ_ACT'},
                    ],
                    source: [],
                },
                {
                    name: '成品店',
                    style: {top: 'calc(23.7vh)', zIndex: 9},
                    tableColumn: [
                        {label: '区域', key: 'S_OR_N'},
                        {label: '开店目标', key: 'OPEN_TGT'},
                        {label: '累计开店', key: 'OPEN_ACT'},
                        {label: '建店中', key: 'BUILDING_SHOP'},
                        {label: '完成率', key: 'OPEN_RATE'},
                        {label: '选址通过', key: 'LOCAT_ACT'},
                        {label: '意向金', key: 'YXJ_ACT'},
                    ],
                    source: [],
                },
                {
                    name: '融合店',
                    style: {top: 'calc(-23.7vh)', zIndex: 1},
                    tableColumn: [
                        {label: '区域', key: 'S_OR_N'},
                        {label: '开店目标', key: 'OPEN_TGT'},
                        {label: '累计开店', key: 'OPEN_ACT'},
                        {label: '建店中', key: 'BUILDING_SHOP'},
                        {label: '完成率', key: 'OPEN_RATE'},
                        {label: '选址通过', key: 'LOCAT_ACT'},
                        {label: '意向金', key: 'YXJ_ACT'},
                    ],
                    source: [],
                },
            ],
            rightItem1: {
                firstColIsImg: true,
                title: '汇总排行',
                tableColumn: [
                    {label: '排名', key: 'index'},
                    {label: '花名', key: 'AREA_MANAGER_NAME'},
                    {label: '开店数量', key: 'OPEN_ACT'},
                    {label: '累计发货额', key: 'QZ_DLVRED_AMT'},
                ],
                dataSource: []
            },
            rightItem2: {
                firstColIsImg: true,
                title: '成品店',
                tableColumn: [
                    {label: '排名', key: 'index'},
                    {label: '大区经理', key: 'AREA_MANAGER_NAME'},
                    {label: '开店数量（个）', key: 'OPEN_ACT'},
                    {label: '累计发货额（元）', key: 'QZ_DLVRED_AMT'},
                ],
                dataSource: []
            },
            rightItem3: {
                firstColIsImg: true,
                title: '融合店',
                tableColumn: [
                    {label: '排名', key: 'index'},
                    {label: '大区经理', key: 'AREA_MANAGER_NAME'},
                    {label: '开店数量（个）', key: 'OPEN_ACT'},
                    {label: '累计发货额（元）', key: 'QZ_DLVRED_AMT'},
                ],
                dataSource: []
            },
            provinceData: [],
        }
    },
    methods: {
        handleNum(type, value) {
            if([null, undefined, '--'].includes(value)) return '--'
            if(type === 'round') return (value.toFixed(0) * 1).toLocaleString()
            else if(type === 'percent') return (value * 100).toFixed(0) + '%'
        },
        computeLeftItem(data) {
            let source = _.cloneDeep(data)
            // let sum = {
            //     OPEN_TGT: 0,
            //     OPEN_ACT: 0,
            //     BUILDING_SHOP: 0,
            //     LOCAT_ACT: 0,
            //     YXJ_ACT: 0,
            // }
            // for(let key in sum) {
            //     sum[key] = source.map(_ => _[key]).reduce((a, b) => a + b)
            // }
            // sum.AREA_NAME = '总和'
            // sum.OPEN_RATE = sum.OPEN_ACT / sum.OPEN_TGT
            // source.unshift(sum)
            return source.map(_ => {
                return {
                    ..._,
                    OPEN_RATE: (_.OPEN_RATE * 100).toFixed(0) + '%'
                }
            })
        },
        // 左上
        async getAreaSum() {
            let res = await this.$fetchSql('NON_PM_new_retail_invest', 'new_retail_invest_bigarea_sum')
            this.leftItem1.dataSource = this.computeLeftItem(res.data)
        },
        // 左中 左下
        async getAreaStoreType() {
            let res = await this.$fetchSql('NON_PM_new_retail_invest', 'new_retail_invest_bigarea_type')
            this.leftItem2.dataSource = this.computeLeftItem(res.data.filter(_ => _.STORE_TYPE === '成品店'))
            this.leftItem3.dataSource = this.computeLeftItem(res.data.filter(_ => _.STORE_TYPE === '融合店'))
        },
        // 中左
        async getOpenSum() {
            let res = await this.$fetchSql('NON_PM_new_retail_invest', 'new_retail_invest_sum')
            let sum = res.data.filter(_ => _.STORE_TYPE === '汇总')[0]
            let arr = [
                {spaceKey: 'value', key: 'OPEN_RATE', format: 'percent'},
                {spaceKey: 'value1', key: 'OPEN_TGT', format: 'round'},
                {spaceKey: 'value2', key: 'OPEN_ACT', format: 'round'},
            ]
            arr.forEach(item => {
                this.middleLeft[0][item.spaceKey] = this.handleNum(item.format, sum[item.key])
            })
            let CPStore = res.data.filter(_ => _.STORE_TYPE === '成品店')[0]
            arr.forEach(item => {
                this.middleLeft[1][item.spaceKey] = this.handleNum(item.format, CPStore[item.key])
            })
            let RHStore = res.data.filter(_ => _.STORE_TYPE === '融合店')[0]
            let arr2 = [
                {spaceKey: 'value', key: 'OPEN_RATE', format: 'percent'},
                {spaceKey: 'value1', key: 'OPEN_TGT', format: 'round'},
                {spaceKey: 'value2', key: 'OPEN_ACT', format: 'round'},
            ]
            arr2.forEach(item => {
                this.middleLeft[2][item.spaceKey] = this.handleNum(item.format, RHStore[item.key])
            })
        },
        // 中右
        async getAreaOpen() {
            let res = await this.$fetchSql('NON_PM_new_retail_invest', 'new_retail_invest_area');
            ['汇总', '成品店', '融合店'].forEach((STORE_TYPE, index) => {
                // let source = res.data.filter(_ => _.STORE_TYPE === STORE_TYPE)
                // let arr = []
                // arr.push(source.filter(_ => _.S_OR_N == '东区')[0])
                // arr.push(source.filter(_ => _.S_OR_N == '南区')[0])
                // arr.push(source.filter(_ => _.S_OR_N == '西区')[0])
                // arr.push(source.filter(_ => _.S_OR_N == '北区')[0])
                let arr = res.data.filter(_ => _.STORE_TYPE === STORE_TYPE && _.S_OR_N !== '汇总')
                arr = arr.map(_ => {
                    return {
                        ..._,
                        OPEN_RATE: this.handleNum('percent', _.OPEN_RATE)
                    }
                })
                this.middleArea[index].source = arr
            })
        },
        async getProvince() {
            let res = await this.$fetchSql('NON_PM_new_retail_invest', 'new_retail_invest_province')
            this.provinceData = res.data.concat()
        },
        // 右
        async getOpenRank() {
            let res = await this.$fetchSql('NON_PM_new_retail_invest', 'new_retail_invest_open_bank')
            res.data = res.data.map(_ => {
                _.QZ_DLVRED_AMT = this.handleNum('round', _.QZ_DLVRED_AMT)
                return _
            })
            let sum = res.data.filter(_ => _.STORE_TYPE === '汇总')
            this.rightItem1.dataSource = sum.map((_, index) => {
                if(index >= 3) {
                    _.index = index + 1
                }
                else _.index = ''
                return _
            })
            let CPStore = res.data.filter(_ => _.STORE_TYPE === '成品店')
            this.rightItem2.dataSource = CPStore.map((_, index) => {
                if(index >= 3) {
                    _.index = index + 1
                }
                else _.index = ''
                return _
            })
            let RHStore = res.data.filter(_ => _.STORE_TYPE === '融合店')
            this.rightItem3.dataSource = RHStore.map((_, index) => {
                if(index >= 3) {
                    _.index = index + 1
                }
                else _.index = ''
                return _
            })
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/styles/largeScreen.scss';
.ProgressOfNewRetailInvestment{
    height: 100vh;
    width: 100vw;
    background-image: url("~@/assets/images/datav/ProgressOfNewRetailInvestment/background.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    /deep/ div, /deep/span{
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }
    .header{
        height: px2vh(111);
        width: 100vw;
        background-image: url("~@/assets/images/datav/ProgressOfNewRetailInvestment/header.png");
        background-repeat: no-repeat;
        background-size: 100% 100%;
        position: relative;
        .right{
            position: absolute;
            width: px2vw(204);
            font-size: px2vh(20);
            line-height: px2vh(20);
            font-family: Microsoft YaHei;
            font-weight: bold;
            color: #FFFFFF;
        }
        .right{
            top: px2vh(46);
            right: px2vw(72);
        }
        .center{
            position: absolute;
            top: px2vh(16);
            left: 50%;
            transform: translateX(-50%);
            width: px2vw(584);
            text-align: center;
            font-size: px2vh(50);
            line-height: px2vh(52);
            font-family: Microsoft YaHei;
            font-weight: bold;
            color: #FFFFFF;
            background: linear-gradient(0deg, #0C5397 0%, #FFFFFF 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
    }
    .main{
        margin: px2vh(7) px2vw(16) px2vh(12);
        height: px2vh(952);
        //width: calc(100vw - px2vw(32));
        width: px2vw(1920 - 32);
        display: flex;
        .overView{
            width: px2vw(518);
            height: 100%;
            padding-top: px2vh(39);
            background-image: url("~@/assets/images/datav/ProgressOfNewRetailInvestment/leftBox.png");
            background-repeat: no-repeat;
            background-size: 100% 100%;
            position: relative;
            .title{
                position: absolute;
                top: px2vh(0);
                left: px2vw(42);
                font-size: px2vh(20);
                line-height: px2vh(39);
                font-family: MicrosoftYaHei;
                font-weight: bold;
                color: #DFEEF3;
            }
            /deep/ .SubItem {
                height: px2vh(456);
                .box1{
                    height: px2vh(405);
                }
            }
        }
        .progress{
            margin: 0 px2vw(14);
            width: px2vw(825);
            height: 100%;
            //background: #7B68EE;
            .title{
                height: px2vh(39);
                padding-left: px2vw(42);
                width: 100%;
                font-size: px2vh(20);
                line-height: px2vh(39);
                font-family: MicrosoftYaHei;
                font-weight: bold;
                color: #DFEEF3;
                background-image: url("~@/assets/images/datav/ProgressOfNewRetailInvestment/middleBox.png");
                background-repeat: no-repeat;
                background-size: 100% 100%;
            }
            .subTitle{
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
            .topBox{
                display: flex;
                height: px2vh(348);
                background-image: url("~@/assets/images/datav/ProgressOfNewRetailInvestment/middleArea.png");
                background-repeat: no-repeat;
                background-size: 98% 98%;
                background-position: center;
                .leftBox{
                    width: px2vw(358);
                    height: 100%;
                    overflow: hidden;
                    padding: px2vh(15) 0 px2vh(15) px2vw(20);
                    .item::before, .item::after{
                        content: '';
                        //display: inline-block;
                        display: none;
                        position: absolute;
                        width: px2vw(20);
                        height: px2vh(1);
                        bottom: px2vh(1);
                        background: #19a0f2;
                    }
                    .item:nth-last-child(1)::before, .item:nth-last-child(1)::after{
                        //display: none;
                    }
                    .item::before{
                        left: px2vw(26);
                    }
                    .item::after{
                        right: px2vw(55);
                    }
                    .item{
                        position: relative;
                        height: 33.33%;
                        display: flex;
                        align-items: center;
                        .ball{
                            //margin: px2vh(16) px2vw(23) 0;
                            margin: 0 px2vw(23);
                            width: px2vw(117);
                            height: px2vh(90);
                            background-image: url("~@/assets/images/datav/ProgressOfNewRetailInvestment/ball.png");
                            background-repeat: no-repeat;
                            background-size: 100% 100%;
                            div:nth-child(1) {
                                margin-bottom: px2vh(5);
                                text-align: center;
                                font-size: px2vh(13);
                                font-family: Microsoft YaHei;
                                color: #DFEEF3;
                            }
                            div:nth-child(2) {
                                text-align: center;
                                font-size: px2vh(20);
                                font-family: MicrosoftYaHei;
                                font-weight: bold;
                                color: #15CFFF;
                            }
                        }
                        .valueBox1 .subItemTitle{
                            display: flex;
                            span{
                                display: inline-block;
                                width: 50%;
                                font-size: px2vh(13);
                                text-align: center;
                                font-family: Microsoft YaHei;
                                color: #158DFF;
                            }
                        }
                        .valueBox, .valueBox1{
                            //margin-right: px2vw(23);
                            padding-right: px2vw(40);
                            width: px2vw(195);
                            height: 100%;
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            .row1, .row2{
                                width: 100%;
                                display: flex;
                                justify-content: space-between;
                                .col{
                                    display: flex;
                                    justify-content: space-between;
                                    width: calc(50% - 10px);
                                    .label{
                                        //margin-right: px2vw(10);
                                        display: inline-block;
                                        font-size: px2vh(13);
                                        //line-height: px2vh(29);
                                        font-family: Microsoft YaHei;
                                        color: #FFFFFF;
                                    }
                                    .value{
                                        display: inline-block;
                                        font-size: px2vh(13);
                                        //line-height: px2vh(29);
                                        font-family: Microsoft YaHei;
                                        color: #158DFF;
                                    }
                                }
                            }
                        }
                    }
                }
                .area{
                    display: inline-block;
                    color: #fff;
                    width: px2vw(467);
                    height: 100%;
                    //background: aquamarine;
                    //background-image: url("~@/assets/images/datav/ProgressOfNewRetailInvestment/middleArea.png");
                    //background-repeat: no-repeat;
                    //background-size: 100% 100%;
                    padding: px2vh(28) px2vw(30);
                    .areaTitle{
                        height: px2vh(20);
                        display: flex;
                        align-items: center;
                        margin-left: px2vh(-10);
                        //padding: 0 px2vw(10);
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
                            font-size: px2vh(15);
                            //line-height: px2vh(18);
                            font-family: Microsoft YaHei;
                            color: #FFFFFF;
                        }
                    }
                    .label{
                        width: px2vw(407);
                        height: px2vh(44);
                        display: flex;
                        .col{
                            flex: 1;
                            text-align: center;
                            font-size: px2vh(13);
                            font-family: Microsoft YaHei;
                            color: #FFFFFF;
                        }
                        .col:nth-child(1){
                            flex: none;
                            width: px2vw(50);
                            text-align: left;
                        }
                        .col:nth-child(5) {
                            color: #158DFF;
                        }
                        .col::after{
                            display: inline-block;
                            content: '';
                            height: 100%;
                            vertical-align: middle;
                        }
                    }
                    .valueBoxs{
                        width: px2vw(407);
                        height: px2vh(236);
                        position: relative;
                    }
                    .valueBox{
                        width: px2vw(407);
                        height: px2vh(256);
                        .row{
                            height: 25%;
                            display: flex;
                            align-items: center;
                            .col{
                                flex: 1;
                                text-align: center;
                                font-size: px2vh(13);
                                font-family: Microsoft YaHei;
                                color: #FFFFFF;
                            }
                            .col:nth-child(1){
                                flex: none;
                                width: px2vw(50);
                                text-align: left;
                            }
                            .col:nth-child(5) {
                                color: #158DFF;
                                display: flex;
                                align-items: center;
                            }
                            .col:nth-child(5)::before {
                                content: '';
                                display: inline-block;
                                transform: translateY(px2vh(2));
                                vertical-align: middle;
                                margin-right: px2vw(3);
                                width: px2vw(17);
                                height: px2vh(25);
                                //background-image: url("~@/assets/images/datav/ProgressOfNewRetailInvestment/middleArea.png");
                                background-repeat: no-repeat;
                                background-size: 100% 100%;
                            }
                            .col::after{
                                display: inline-block;
                                content: '';
                                height: 100%;
                                vertical-align: middle;
                            }
                        }
                        .row:nth-child(1) .col:nth-child(5)::before{
                            background-image: url("~@/assets/images/datav/ProgressOfNewRetailInvestment/active1.png");
                        }
                        .row:nth-child(2) .col:nth-child(5)::before{
                            background-image: url("~@/assets/images/datav/ProgressOfNewRetailInvestment/active2.png");
                        }
                        .row:nth-child(3) .col:nth-child(5)::before{
                            background-image: url("~@/assets/images/datav/ProgressOfNewRetailInvestment/active3.png");
                        }
                        //.row:nth-child(4) .col:nth-child(5)::before{
                        //    background-image: url("~@/assets/images/datav/ProgressOfNewRetailInvestment/active4.png");
                        //}
                    }
                }
            }
            .map{
                //height: px2vh(565);
                height: px2vh(514);
                width: 100%;
                .mapTitle{
                    margin-left: px2vw(39);
                    margin-top: px2vh(10);
                    font-size: px2vh(18);
                    line-height: px2vh(24);
                    font-family: Microsoft YaHei;
                    color: #FFFFFF;
                }
                .content{
                    //height: px2vh(531)!important;
                    height: px2vh(480)!important;
                    width: 100%!important;
                }
            }
        }
        .rank{
            width: px2vw(518);
            height: 100%;
            padding-top: px2vh(39);
            background-image: url("~@/assets/images/datav/ProgressOfNewRetailInvestment/leftBox.png");
            background-repeat: no-repeat;
            background-size: 100% 100%;
            position: relative;
            .title{
                position: absolute;
                top: px2vh(0);
                left: px2vw(42);
                font-size: px2vh(20);
                line-height: px2vh(39);
                font-family: MicrosoftYaHei;
                font-weight: bold;
                color: #DFEEF3;
            }
            /deep/ .SubItem {
                height: px2vh(456);
                .box1{
                    height: px2vh(405);
                }
            }
        }
    }
}
</style>