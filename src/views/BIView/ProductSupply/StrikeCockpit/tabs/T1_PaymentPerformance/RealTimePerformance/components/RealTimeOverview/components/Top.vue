<!--
 * @Author: 黄浩
 * @Date: 2021-12-23 11:50:47
 * @LastEditTime: 2021-12-31 09:25:50
 * @LastEditors: Please set LastEditors
 * @Descripttion: 
 * @FilePath: \lsmy-bi-lighthouse-front\src\views\BIView\ProductSupply\ChannelOverviewRealTimePerformance\components\RealTimeOverview\components\top.vue
-->
<template>
    <div class="top">
        <div class="bar" :style="{width: currentTab === 1 ? '34%' : '22%',transform: `translateX(${translateX})`}"></div>
        <div class="content">
            <div ref="item1" @click="currentTabChange(1)" class="item" :class="TabActiveOrNot(1)">
                <div id="circle" class="left"></div>
                <div class="right">
                    <div class="row1">{{title}}</div>
                    <div @contextmenu="(e) => openMenu(e,overview.SALE_AMT)" class="row2">{{overview.SALE_AMT}}</div>
                    <div class="row3">
                        <div class="col1">
                            <span>目标</span>
                            <span @contextmenu="(e) => openMenu(e,overview.SALES_TARGET)">{{overview.SALES_TARGET}}</span>
                            <span></span>
                        </div>
                        <div class="col2">
                            <span>差值</span>
                            <span @contextmenu="(e) => openMenu(e,overview.DIF_AMT)">{{overview.DIF_AMT}}</span>
                            <span></span>
                        </div>
                    </div>
                    <div class="row3">
                        <div class="col1">
                            <span>同比</span>
                            <span @contextmenu="(e) => openMenu(e,overview.AGO_DIF_RATE)" :class="classYearOnYear(overview.AGO_DIF_RATE)">{{overview.AGO_DIF_RATE}}</span>
                            <span></span>
                        </div>
                        <div class="col2">
                            <span>同期</span>
                            <span @contextmenu="(e) => openMenu(e,overview.AGO_SALE_AMT)">{{overview.AGO_SALE_AMT}}</span>
                            <span></span>
                        </div>
                    </div>
                </div>
            </div>
            <div ref="item2" @click="currentTabChange(2)" class="item" :class="TabActiveOrNot(2)" style="width: 22%">
                <div class="row1">
                    <div class="icon"></div>
                    <div class="label">线上渠道</div>
                </div>
                <div class="row2" @contextmenu="(e) => openMenu(e,ol.SALE_AMT)">
                    {{ol.SALE_AMT}}
                </div>
                <div class="row3">
                    <div class="col1">
                        <span>目标</span>
                        <span @contextmenu="(e) => openMenu(e,ol.SALES_TARGET)">{{ol.SALES_TARGET}}</span>
                        <span></span>
                    </div>
                    <div class="col2">
                        <span>达成</span>
                        <span @contextmenu="(e) => openMenu(e,ol.CMP_RATE)" :class="classReach(ol.CMP_RATE)">{{ol.CMP_RATE}}</span>
                        <span></span>
                    </div>
                </div>
                <div class="row3">
                    <div class="col1">
                        <span>同比</span>
                        <span @contextmenu="(e) => openMenu(e,ol.AGO_DIF_RATE)" :class="classYearOnYear(ol.AGO_DIF_RATE)">{{ol.AGO_DIF_RATE}}</span>
                        <span></span>
                    </div>
                    <div class="col2">
                        <span>占比</span>
                        <span @contextmenu="(e) => openMenu(e,ol.TOT_RATE)">{{ol.TOT_RATE}}</span>
                        <span></span>
                    </div>
                </div>
            </div>
            <div v-if="currentView !== 3" ref="item3" @click="currentTabChange(3)" class="item" :class="TabActiveOrNot(3)" style="width: 22%">
                <div class="row1">
                    <div class="icon"></div>
                    <div class="label">线下渠道</div>
                </div>
                <div class="row2" @contextmenu="(e) => openMenu(e,offline.SALE_AMT)">
                    {{offline.SALE_AMT}}
                </div>
                <div class="row3">
                    <div class="col1">
                        <span>目标</span>
                        <span @contextmenu="(e) => openMenu(e,offline.SALES_TARGET)">{{offline.SALES_TARGET}}</span>
                        <span></span>
                    </div>
                    <div class="col2">
                        <span>达成</span>
                        <span @contextmenu="(e) => openMenu(e,offline.CMP_RATE)" :class="classReach(offline.CMP_RATE)">{{offline.CMP_RATE}}</span>
                        <span></span>
                    </div>
                </div>
                <div class="row3">
                    <div class="col1">
                        <span>同比</span>
                        <span @contextmenu="(e) => openMenu(e,offline.AGO_DIF_RATE)" :class="classYearOnYear(offline.AGO_DIF_RATE)">{{offline.AGO_DIF_RATE}}</span>
                        <span></span>
                    </div>
                    <div class="col2">
                        <span>占比</span>
                        <span @contextmenu="(e) => openMenu(e,offline.TOT_RATE)">{{offline.TOT_RATE}}</span>
                        <span></span>
                    </div>
                </div>
            </div>
            <div v-if="currentView !== 3" ref="item4" @click="currentTabChange(4)" class="item" :class="TabActiveOrNot(4)" style="width: 22%">
                <div class="row1">
                    <div class="icon"></div>
                    <div class="label">海外渠道</div>
                </div>
                <div class="row2">
                    --
                </div>
                <div class="row3">
                    <div class="col1">
                        <span>目标</span>
                        <span @contextmenu="(e) => openMenu(e,oversea.SALES_TARGET)">{{oversea.SALES_TARGET}}</span>
                        <span></span>
                    </div>
                </div>
                <div class="row3">
                    <div class="col1" style="width: 100%">
                        <span>海外渠道并非每天产生业绩</span>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="menuVisible" class="selectMenu" :style="[{left: menuX},{top: menuY}]">
            <div class="item box" v-clipboard:copy="currentText">复制内容</div>
            <!-- <div class="item" @click="copy">其他</div> -->
        </div>
    </div>
</template>

<script>
import * as echarts from 'echarts5/lib/echarts'
import 'echarts5/lib/chart/pie'
import 'echarts5/lib/component/tooltip'
import 'echarts5/lib/component/title'
import 'echarts5/lib/component/graphic'
export default {
    props: {
        duration: {
            type: Number  
        },
        currentView: {
            type: Number
        },
        currentTab: {
            type: Number
        }
    },
    created() {
        let that = this
        this.timer = setInterval(() => {
            this.getOverview()
            this.getChannelData()
        },that.duration)
    },
    mounted() {
        this.getOverview()
        this.getChannelData()
        document.body.addEventListener('click',() => {
            if(this.menuVisible) this.menuVisible = !this.menuVisible
        })
    },
    watch: {
        currentView: {
            handler(val) {
                // this.circle.dispose()
                // if(val === 3) {
                    this.$emit('callBack',1)
                    this.getOverview()
                    // this.initCircle()

                    // this.currentTab = 1
                // }
            }
        },
    },
    computed: {
        title() {
            let map = ['全司', '全中', '品市']
            return map[this.currentView - 1]
        },
        translateX() {
            let i = 1
            let left = 0
            while(i < this.currentTab){
                if(!this.$refs['item' + i]) return '0px'
                left += this.$refs['item' + i].offsetWidth
                i++
            }
            return left + 'px'
        },
        // 达成率
        CMP_RATE() {
            return this.overviewData[this.currentView - 1].CMP_RATE
        },
        // echarts配置
        option() {
            return {
                // 设置环心
                graphic: [
                    {
                        type: 'text',
                        left: 'center',
                        top: 'center',
                        z: 10,
                        style: {
                            fill: '#333333',
                            // 达成率
                            // text: this.overviewData.length ?  this.overviewData[this.currentTab - 1].CMP_RATE + '%' : 0,
                            text: (this.CMP_RATE * 100).toFixed(1) + '%',
                            font: '20px "PingFangSC-Medium", "PingFang SC"'
                        }
                    },
                    {
                        type: 'text',
                        left: 'center',
                        top: '70%',
                        z: 10,
                        style: {
                            fill: 'rgba(0, 0, 0, 0.65)',
                            text: '达成',
                            font: '14px "PingFangSC-Regular", "PingFang SC"'
                        }
                    }
                ],
                series: [
                    // 数据
                    {
                        silent: true,
                        color: ['#5A8DF3','transparent','transparent'],
                        name: 'Access From',
                        type: 'pie',
                        radius: ['60%', '70%'],
                        avoidLabelOverlap: false,
                        startAngle: 234,
                        itemStyle: {
                            borderRadius: '50%'
                        },
                        label: {
                            show: false,
                        },
                        emphasis: {
                            inherit: 'transparent',
                            scale: false,
                            label: {
                                show: true,
                                fontSize: '40',
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: [
                            // 达成率   80是显示的条 20是隐藏的条用来占位 然后80里再分达成率 
                            { value: this.CMP_RATE * 80, name: '达成率' },
                            { value: (1 - this.CMP_RATE) * 80, name: '未达成率' },
                            { value: 20, name: ''}
                        ],
                        z: 2
                    },
                    // 背景
                    {
                        silent: true,
                        color: ['#F0F0F0','transparent'],
                        name: 'Access From',
                        type: 'pie',
                        radius: ['60%', '70%'],
                        avoidLabelOverlap: false,
                        startAngle: 234,
                        itemStyle: {
                            borderRadius: '50%'
                        },
                        label: {
                            show: false,
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: '40',
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: [
                            { value: 800},
                            { value: 200}
                        ],
                        z: 1
                    }
                ]
            }
        },
        // 全司 
        overview() {
            if(!this.overviewData.length) return {
                SALE_AMT: '',
                SALES_TARGET: '',
                DIF_AMT: '',
                AGO_DIF_RATE: '',
                AGO_SALE_AMT: '',
                CMP_RATE: '',
            }
            else {
                // return this.overviewData[this.currentView - 1]
                let obj = this.overviewData[this.currentView - 1]
                return {
                    // 业绩
                    SALE_AMT: parseInt(obj.SALE_AMT).toLocaleString(),
                    // 目标
                    SALES_TARGET: parseInt(obj.SALES_TARGET).toLocaleString(),
                    // 差值
                    DIF_AMT: parseInt(obj.DIF_AMT).toLocaleString(),
                    // 同比
                    AGO_DIF_RATE: (obj.AGO_DIF_RATE * 100).toFixed(1) + '%',
                    // 同期
                    AGO_SALE_AMT: parseInt(obj.AGO_SALE_AMT).toLocaleString(),
                    // 达成
                    CMP_RATE: obj.CMP_RATE,
                }
            }
        },
        // 线上渠道
        ol() {
            if(!this.olData.length) return {
                SALE_AMT: '',
                SALES_TARGET: '',
                CMP_RATE: '',
                AGO_DIF_RATE: '',
                TOT_RATE: '',
                // DIF_AMT: '',
                // AGO_SALE_AMT: '',
            }
            else {
                // return this.overviewData[this.currentView - 1]
                let obj = this.olData[this.currentView - 1]
                return {
                    // 业绩
                    SALE_AMT: parseInt(obj.SALE_AMT).toLocaleString(),
                    // 目标
                    SALES_TARGET: parseInt(obj.SALES_TARGET).toLocaleString(),
                    // 达成
                    CMP_RATE: (obj.CMP_RATE * 100).toFixed(1) + '%',
                    // 同比
                    AGO_DIF_RATE: (obj.AGO_DIF_RATE * 100).toFixed(1) + '%',
                    // 占比
                    TOT_RATE: (obj.TOT_RATE * 100).toFixed(1) + '%',
                    // DIF_AMT: parseInt(obj.DIF_AMT).toLocaleString(),
                    // AGO_SALE_AMT: parseInt(obj.AGO_SALE_AMT).toLocaleString(),
                }
            }
        },
        // 线下渠道
        offline() {
            if(this.currentView === 3) return
            if(!this.olData.length) return {
                SALE_AMT: '',
                SALES_TARGET: '',
                CMP_RATE: '',
                AGO_DIF_RATE: '',
                TOT_RATE: '',
                // DIF_AMT: '',
                // AGO_SALE_AMT: '',
            }
            else {
                // return this.overviewData[this.currentView - 1]
                let obj = this.offlineData[this.currentView - 1]
                return {
                    // 业绩
                    SALE_AMT: parseInt(obj.SALE_AMT).toLocaleString(),
                    // 目标
                    SALES_TARGET: parseInt(obj.SALES_TARGET).toLocaleString(),
                    // 达成
                    CMP_RATE: (obj.CMP_RATE * 100).toFixed(1) + '%',
                    // 同比
                    AGO_DIF_RATE: (obj.AGO_DIF_RATE * 100).toFixed(1) + '%',
                    // 占比
                    TOT_RATE: (obj.TOT_RATE * 100).toFixed(1) + '%',
                    // DIF_AMT: parseInt(obj.DIF_AMT).toLocaleString(),
                    // AGO_SALE_AMT: parseInt(obj.AGO_SALE_AMT).toLocaleString(),
                }
            }
        },
        // 海外渠道
        oversea() {
            if(!this.olData.length) return {
                // SALE_AMT: '',
                SALES_TARGET: '',
                // CMP_RATE: '',
                // AGO_DIF_RATE: '',
                // TOT_RATE: '',
                // DIF_AMT: '',
                // AGO_SALE_AMT: '',
            }
            else {
                // return this.overviewData[this.currentView - 1]
                let obj = this.overseaData[this.currentView - 1]
                return {
                    // 业绩
                    // SALE_AMT: obj.SALE_AMT.toLocaleString(),
                    // 目标
                    SALES_TARGET: parseInt(obj.SALES_TARGET).toLocaleString(),
                    // 达成
                    // CMP_RATE: (obj.CMP_RATE * 100).toFixed(1) + '%',
                    // 同比
                    // AGO_DIF_RATE: (obj.AGO_DIF_RATE * 100).toFixed(1) + '%',
                    // 占比
                    // TOT_RATE: (obj.TOT_RATE * 100).toFixed(1) + '%',
                    // DIF_AMT: parseInt(obj.DIF_AMT).toLocaleString(),
                    // AGO_SALE_AMT: parseInt(obj.AGO_SALE_AMT).toLocaleString(),
                }
            }
        },
    },
    beforeDestroy() {
        if(this.circle !== null) this.circle.dispose()
        clearInterval(this.timer)
    },
    data() {
        return {
            timer: null,
            // currentTab: '1',
            circle: null,
            // 全司总览数据 有三种视角 对应三条数据
            overviewData: [],
            // 线上、线下、海外渠道数据 同样有三种视角
            olData: [],
            offlineData: [],
            overseaData: [],
            menuVisible: false,
            menuX: '0px',
            menuY: '0px',
            currentText: ''
        }
    },
    methods: {
        TabActiveOrNot(val) {
            if(val === this.currentTab) return 'active'
            else return ''
        },
        // 右键展开菜单
        openMenu(e,text) {
            e.preventDefault();
            this.menuX = e.layerX + 'px'
            this.menuY = e.layerY + 'px'
            this.currentText = text
            this.menuVisible = true
        },
        currentTabChange(val) {
            this.$emit('callBack',val)
            // this.$emit('update:currentTab',val)
        },
        initCircle() {
            if(!(document.getElementById('circle'))) return
            if(this.circle === null) this.circle = echarts.init(document.getElementById('circle'))
            let myChart = this.circle
            // 绘制图表
            myChart.setOption(this.option);
            window.addEventListener('resize', () => {
                myChart.resize()
            })
        },
        // 获取全司 总览 
        async getOverview() {
            let res = await this.$fetchSql('real_time', 'read_time_tot')
            this.overviewData = res.data.concat()
            this.initCircle()
        },
        // 获取线上、线下、海外渠道数据
        async getChannelData() {
            let res = await this.$fetchSql('real_time', 'read_time_tot_sub')
            this.olData = res.data.filter(item => {
                return item.CHANNEL === '线上渠道'
            }).concat()
            let map = {
                '全司视角': 0,
                '全中视角': 1,
                '品市视角': 2,
            }
            this.olData = this.olData.sort((a,b) => {
                return map[a.CHANNEL_VIEW] - map[b.CHANNEL_VIEW]
            })

            this.offlineData = res.data.filter(item => {
                return item.CHANNEL === '线下渠道'
            }).concat()
            this.offlineData = this.offlineData.sort((a,b) => {
                return map[a.CHANNEL_VIEW] - map[b.CHANNEL_VIEW]
            })
            this.overseaData = res.data.filter(item => {
                return item.CHANNEL === '海外渠道'
            }).concat()
            this.overseaData = this.overseaData.sort((a,b) => {
                return map[a.CHANNEL_VIEW] - map[b.CHANNEL_VIEW]
            })
        },
        // 同比数据颜色
        classYearOnYear(val){
            if([null, undefined, '--'].includes(val)) return ''
            val = val.split('%')[0] / 100
            if(val > 0) return 'red'
            else if(val < 0) return 'green'
        },
        // 达成颜色
        classReach(val) {
            if( [null, undefined, '--'].includes(val) ) return ''
            val = val.split('%')[0] / 100
            if(val >= 1) return 'red'
            else return 'green'
        }

    },
}
</script>

<style lang='scss' scoped>
@import '~@/assets/styles/common.scss';
.top{
    height: 120px;
    background: #FFFFFF;
    //border: 1px solid #F0F0F0;
    //margin-bottom: 16px;
    position: relative;
    .bar{
        display: none;
        position: absolute;
        top: 0;
        width: 257px;
        height: 4px;
        background: #00B08D;
        transform: translateX(0);
        transition: all 0.3s 0s ease-out;
    }
    .content{
        height: 100%;
        display: flex;
        .active{
            background: rgba(0, 0, 0, 0.03);
        }
        .item{
            width: 100%;
            height: 100%;
            cursor: pointer;
            &:hover {
              background-color: rgba(0,0,0,.02);
            }
        }
        .item:nth-child(1) {
            width: 34%;
            display: flex;
            //border-right: 1px solid #F0F0F0;
            .left{
                width: 120px;
            }
            .right{
                flex: 1;
                .row1{
                    //margin-top: 24px;
                    margin-top: 8px;
                    font-size: 14px;
                    font-family: PingFangSC-Regular, PingFang SC,sans-serif;
                    font-weight: 400;
                    color: rgba(0, 0, 0, 0.64);
                    //margin-bottom: 4px;
                    line-height: 22px;
                }
                .row2{
                    font-size: 30px;
                    font-family: HelveticaNeue,sans-serif;
                    color: rgba(0, 0, 0, 0.85);
                    line-height: 38px;
                    //margin-bottom: 20px;
                }
                .row3{
                    display: flex;
                    .col1, .col2{
                        width: 50%;
                        span:nth-child(1) {
                            display: inline-block;
                            margin-right: 10px;
                            font-size: 12px;
                            font-family: PingFangSC-Regular, PingFang SC,sans-serif;
                            font-weight: 400;
                            color: rgba(0, 0, 0, 0.64);
                            line-height: 20px;
                        }
                        span:nth-child(2) {
                            font-size: 12px;
                            font-family: PingFangSC-Medium, PingFang SC,sans-serif;
                            font-weight: 500;
                            color: rgba(0, 0, 0, 0.64);
                            line-height: 20px;
                        }
                    }
                    .green{
                        color: $theme!important;
                    }
                    .red{
                        color: $rise!important
                    }
                }
            }
        }
        .item:nth-child(2), .item:nth-child(3), .item:nth-child(4){
            width: 22%;
            padding-left: 29px;
            //border-right: 1px solid #F0F0F0;
            .row1{
                margin-top: 7px;
                //margin-top: 20px;
                display: flex;
                align-items: center;
                //margin-bottom: 8px;
                .icon{
                    width: 35px;
                    height: 35px;
                    margin-right: 12px;
                }
                .label{
                    font-size: 14px;
                    font-family: PingFangSC-Regular, PingFang SC,sans-serif;
                    font-weight: 400;
                    color: rgba(0, 0, 0, 0.64);
                    line-height: 22px;
                }
            }
            .row2{
                font-size: 20px;
                font-family: HelveticaNeue,sans-serif;
                color: rgba(0, 0, 0, 0.85);
                line-height: 28px;
                //margin-bottom: 17px;
            }
            .row3{
                display: flex;
                .col1, .col2{
                    width: 50%;
                    span:nth-child(1) {
                        display: inline-block;
                        margin-right: 10px;
                        font-size: 12px;
                        font-family: PingFangSC-Regular, PingFang SC,sans-serif;
                        font-weight: 400;
                        color: rgba(0, 0, 0, 0.64);
                        line-height: 20px;
                    }
                    span:nth-child(2) {
                        font-size: 12px;
                        font-family: PingFangSC-Medium, PingFang SC,sans-serif;
                        font-weight: 500;
                        color: rgba(0, 0, 0, 0.64);
                        line-height: 20px;
                    }
                }
                // .col1{
                //     display: flex;
                //     span{
                //         flex: 1;
                //     }
                // }
                .green{
                    color: $fall!important
                }
                .red{
                    color: $rise!important
                }
            }
        }
        .item:nth-child(2) {
            .row1{
                .icon{
                    background: url('~@/views/BIView/OperateDashboard/Tabs/LivePerf/images/p1.png');
                    background-size: 100% 100%;
                }
            }
        }
        .item:nth-child(3) {
            .row1{
                .icon{
                    background: url('~@/views/BIView/OperateDashboard/Tabs/LivePerf/images/p2.png');
                    background-size: 100% 100%;
                }
            }
        }
        .item:nth-child(4) {
            border: none;
            .row1{
                .icon{
                    background: url('~@/views/BIView/OperateDashboard/Tabs/LivePerf/images/p3.png');
                    background-size: 100% 100%;
                }
            }
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

.top{
    .content{
        .item{
            .right{
                .row3{
                    .col1,.col2{
                        display: flex;
                        span{
                            margin-right: 0px!important;
                        }
                        span:nth-child(1){
                            flex: 20;
                        }
                        span:nth-child(2){
                            flex: 40;
                            text-align: right;
                        }
                        span:nth-child(3){
                            flex: 40;
                        }
                    }
                }
            }
            .row3{
                .col1,.col2{
                    display: flex;
                    span{
                        // color: #00B08D!important;
                        margin-right: 0px!important;
                    }
                    span:nth-child(1){
                        flex: 20;
                    }
                    span:nth-child(2){
                        flex: 45;
                        text-align: right;
                    }
                    span:nth-child(3){
                        flex: 35;
                    }

                } 
            }
        }
    }
}            

</style>