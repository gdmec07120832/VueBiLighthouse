<!--
 * @Author: 黄浩
 * @Date: 2021-11-30 09:09:16
 * @LastEditTime: 2022-01-17 15:25:52
 * @LastEditors: Please set LastEditors
 * @Descripttion: 项目组排名
 * @FilePath: \lsmy-bi-lighthouse-front\src\views\BIView\DataV\ProjectGroupRanking\index.vue
-->
<template>
    <div class="ProjectGroupRanking">
        <div class="bg">
            <div class="bg1"></div>
            <div class="bg2"></div>
            <div class="bg3"></div>
            <div class="light"></div>
            <div class="txt"></div>
            <div class="time">
                数据加载时间: {{time}}
            </div>
        </div>
        <div class="content">
            <div class="top">
                数据展示 : 目标 / 结果
            </div>
            <div class="lineTitle">
                <div class="item">总计</div>
                <div class="item">得分</div>
                <div class="item">发货({{judgeValue(rate.SEND_RATIO)}}%)</div>
                <div class="item">售后不良({{judgeValue(rate.WG_RATIO)}}%)</div>
                <div class="item">新品({{judgeValue(rate.NEW_MTRL_RATIO)}}%)</div>
                <div class="item">日均承诺欠货({{judgeValue(rate.AVG_MEX_RATIO)}}%)</div>
                <!-- <div class="item">SKU均值({{judgeValue(rate.AVG_MTRL_RATIO)}}%)</div> -->
                <div class="item">周转率({{judgeValue(rate.PROFIT_RATIO)}}%)</div>
                <div class="item">滞销金额({{judgeValue(rate.UNSALABLE_RATIO)}}%)</div>
            </div>
            <!-- 加入flexBox 以缓解后续数据条数增加导致 无法全部展示数据的情况 -->
            <div class="flexBox">
                <div class="total">
                    <div class="col1">汇总</div>
                    <div class="col2">--</div>
                    <!-- 发货 -->
                    <div class="col3" >
                        <span class="left">{{judgeValue(total.SEND_TGT)}}万 /</span>
                        <span :class="['right',{'red': total.SEND_TGT.replace(/,/gi,'')*1 <= total.SEND_AMT.replace(/,/gi,'')*1}]"> {{judgeValue(total.SEND_AMT)}}万</span>
                    </div>
                    <!-- 售后不良 -->
                    <div class="col3" >
                        <span class="left">{{judgeValue(total.WG_TGT)}}% /</span>
                        <span :class="['right',{'red': total.WG_TGT*1 >= total.AFS_BAD_RTO*1}]"> {{judgeValue(total.AFS_BAD_RTO)}}%</span>
                    </div>
                    <!-- 新品 -->
                    <div class="col3" >
                        <span class="left">{{judgeValue(total.NEW_MTRL_TGT)}}万 /</span>
                        <span :class="['right',{'red': total.NEW_MTRL_TGT.replace(/,/gi,'')*1 <= total.NEW_MTRL_AMT.replace(/,/gi,'')*1}]"> {{judgeValue(total.NEW_MTRL_AMT)}}万</span>
                    </div>
                    <!-- 日均承诺欠货 -->
                    <div class="col3" >
                        <span class="left">{{judgeValue(total.AVG_MEX_TGT)}}万 /</span>
                        <span :class="['right',{'red': total.AVG_MEX_TGT.replace(/,/gi,'')*1 >= total.AVG_PURPRICE_AMT.replace(/,/gi,'')*1}]"> {{judgeValue(total.AVG_PURPRICE_AMT)}}万</span>
                    </div>
                    <!-- sku均值 -->
                    <!-- <div class="col3" >
                        <span class="left">{{judgeValue(total.TGT_AVG_SKU_DLVR_AMT)}}万 /</span>
                        <span :class="['right',{'red': total.TGT_AVG_SKU_DLVR_AMT.replace(/,/gi,'')*1 <= total.AVG_SKU_DLVR_AMT.replace(/,/gi,'')*1}]"> {{judgeValue(total.AVG_SKU_DLVR_AMT)}}万</span>
                    </div> -->
                    <!-- 毛利率 -->
                    <div class="col3" >
                        <span class="left">{{judgeValue(total.PROFIT_TGT)}} /</span>
                        <span :class="['right',{'red': total.PROFIT_TGT*1 <= total.DAILY_GRS_PRFT_CUM*1}]"> {{judgeValue(total.DAILY_GRS_PRFT_CUM)}}</span>
                    </div>
                    <!-- 滞销指标 -->
                    <div class="col3" >
                        <span class="left">{{judgeValue(total.UNSALABLE_TGT)}}万 /</span>
                        <span :class="['right',{'red': total.UNSALABLE_TGT.replace(/,/gi,'')*1 >= total.UNCLEAN_INV_AMT.replace(/,/gi,'')*1}]"> {{judgeValue(total.UNCLEAN_INV_AMT)}}万</span>
                    </div>
                </div>
                <div :class="['line1',{'line2': index === 1},{'line3': index === 2},{'line4': index !== 0 && index !== 1 && index !== 2}]"  v-for="(item,index) in list" :key="index">
                    <div class="col1">
                        <div v-if="index === 0 || index === 1 || index === 2" class="img"></div>
                        <div v-else class="index">{{index + 1}}</div>
                        <div class="name">{{item.TEAM_SUPPLY}}</div>
                    </div>
                    <div class="col2">{{judgeValue(item.TOT_SCORE)}}</div>
                    <!-- 发货 -->
                    <div class="col3" >
                        <span class="left">{{judgeValue(item.SEND_TGT)}}万 /</span>
                        <span :class="['right',{'red': item.SEND_TGT.replace(/,/gi,'')*1 <= item.SEND_AMT.replace(/,/gi,'')*1}]"> {{judgeValue(item.SEND_AMT)}}万</span>
                    </div>
                    <!-- 售后不良 -->
                    <div class="col3" >
                        <span class="left">{{judgeValue(item.WG_TGT)}}% /</span>
                        <span :class="['right',{'red': item.WG_TGT*1 >= item.AFS_BAD_RTO*1}]"> {{judgeValue(item.AFS_BAD_RTO)}}%</span>
                    </div>
                    <!-- 新品 -->
                    <div class="col3" >
                        <span class="left">{{judgeValue(item.NEW_MTRL_TGT)}}万 /</span>
                        <span :class="['right',{'red': item.NEW_MTRL_TGT.replace(/,/gi,'')*1 <= item.NEW_MTRL_AMT.replace(/,/gi,'')*1}]"> {{judgeValue(item.NEW_MTRL_AMT)}}万</span>
                    </div>
                    <!-- 日均承诺欠货 -->
                    <div class="col3" >
                        <span class="left">{{judgeValue(item.AVG_MEX_TGT)}}万 /</span>
                        <span :class="['right',{'red': item.AVG_MEX_TGT.replace(/,/gi,'')*1 >= item.AVG_PURPRICE_AMT.replace(/,/gi,'')*1}]"> {{judgeValue(item.AVG_PURPRICE_AMT)}}万</span>
                    </div>
                    <!-- sku均值 -->
                    <!-- <div class="col3" >
                        <span class="left">{{judgeValue(item.TGT_AVG_SKU_DLVR_AMT)}}万 /</span>
                        <span :class="['right',{'red': item.TGT_AVG_SKU_DLVR_AMT.replace(/,/gi,'')*1 <= item.AVG_SKU_DLVR_AMT.replace(/,/gi,'')*1}]"> {{judgeValue(item.AVG_SKU_DLVR_AMT)}}万</span>
                    </div> -->
                    <!-- 毛利率 -->
                    <div class="col3" >
                        <span class="left">{{judgeValue(item.PROFIT_TGT)}} /</span>
                        <span :class="['right',{'red': item.PROFIT_TGT*1 <= item.DAILY_GRS_PRFT_CUM*1}]"> {{judgeValue(item.DAILY_GRS_PRFT_CUM)}}</span>
                    </div>
                    <!-- 滞销指标 -->
                    <div class="col3" >
                        <span class="left">{{judgeValue(item.UNSALABLE_TGT)}}万 /</span>
                        <span :class="['right',{'red': item.UNSALABLE_TGT.replace(/,/gi,'')*1 >= item.UNCLEAN_INV_AMT.replace(/,/gi,'')*1}]"> {{judgeValue(item.UNCLEAN_INV_AMT)}}万</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment'
export default {
    async created(){
        let that = this
        // this.time = moment().format('YYYY-MM-DD')
        // this.timer = setInterval(() => {
        //     that.time = moment().format('YYYY-MM-DD')
        // },5*1000)
        this.getData()
        this.getDataTimer = await setInterval(() => {
            that.getData()
        }, 10 * 60 * 1000)
    },
    beforeDestroy() {
        if(this.timer){
            clearInterval(this.timer)
        }
        if(this.getDataTimer){
            clearInterval(this.getDataTimer)
        }
    },
    data() {
        return {
            time: '',
            timer: null,
            rate: {
                // 发货
                // DLVR_CMPL_RTO: '',
                SEND_RATIO: '',
                // 售后不良
                // AFS_BAD_CMPL_RTO: '',
                WG_RATIO: '',
                // 新品
                // NEW_MTRL_CMPL_RTO: '',
                NEW_MTRL_RATIO: '',
                // 日均承诺欠货
                // AVG_SHRT_CMPL_RTO: '',
                AVG_MEX_RATIO: '',
                // SKU均值
                // AVG_SKU_CMPL_RTO: '',
                AVG_MTRL_RATIO: '',
                // 毛利率
                // GRS_PRFT_CMPL_RTO: '',
                PROFIT_RATIO: '',
                // 滞销指标
                // UNCLEAN_CMPL_RTO: '',
                UNSALABLE_RATIO: '',
            },
            total: {
                // 发货目标
                SEND_TGT: '',
                SEND_AMT: '',
                // 售后不良
                WG_TGT: '',
                AFS_BAD_RTO: '',
                // 新品
                NEW_MTRL_TGT: '',
                NEW_MTRL_AMT:'',
                // 日均欠货
                AVG_MEX_TGT: '',
                AVG_PURPRICE_AMT: '',
                // sku均值
                TGT_AVG_SKU_DLVR_AMT: '',
                AVG_SKU_DLVR_AMT: '',
                // 毛利率
                PROFIT_TGT: '',
                DAILY_GRS_PRFT_CUM: '',
                // 滞销目标
                UNSALABLE_TGT: '',
                UNCLEAN_INV_AMT: ''
            },
            list: [],
            getDataTimer: null,
            // 首次请求带上username 后续不用
            flag: false
        }
    },
    methods: {
        async getData() {
            let headers = !this.flag ? {
                username: encodeURIComponent("项目组排名"),
                'Content-Type': 'application/json'
            } : {
                'Content-Type': 'application/json'
            }
            let res = await this.$axios.post(`/api/admin/data/NON_PM_pds_big_bord/spl_rank/get`,null,{
                headers
            })
            if(!this.flag && res.data.length) this.flag = true
            let sumIndex
            for(let i = 0; i < res.data.length; i++) {
                if(res.data[i].TEAM_SUPPLY === '汇总') {
                    sumIndex = i
                    break
                }
            }
            res.data.unshift(...res.data.splice(sumIndex, 1))
            for(let key in this.rate){
                this.$set(this.rate,key,(res.data[0][key]*100).toFixed(0))
            }
            for(let key in this.total){
                if(key === 'WG_TGT' || key === 'AFS_BAD_RTO' ){
                    this.$set(this.total,key,(res.data[0][key]*100)?.toFixed(2))
                }else if(key === 'PROFIT_TGT' || key === 'DAILY_GRS_PRFT_CUM'){
                    this.$set(this.total,key,res.data[0][key]?.toFixed(2))
                }else{
                    if((res.data[0][key] / 10000) > 1){
                        this.$set(this.total,key,((res.data[0][key]/10000)?.toFixed(0)*1).toLocaleString())
                    }else{
                        this.$set(this.total,key,(res.data[0][key]/10000)?.toFixed(1))
                    }
                }
            }
            this.list = res.data.slice(1,res.data.length)
            this.list.sort((a,b) => {
                return b.TOT_SCORE - a.TOT_SCORE  
            })
            // let length = this.list.length
            // for(let i = 0; i < length - 1; i++){
            //     for(let j = 0; j < length - 1 - i; j++){
            //         if(this.list[j].TOT_SCORE < this.list[j+1].TOT_SCORE){
            //             let cup = this.list[j]
            //             this.list[j] = this.list[j+1]
            //             this.list[j+1] = cup
            //         }
            //     }
            // }
            this.list.forEach((item) => {
                for(let key in item){
                    if(key === 'WG_TGT' || key === 'AFS_BAD_RTO'){
                        item[key] = (item[key]*100).toFixed(2)
                    }
                    if(key === 'PROFIT_TGT' || key === 'DAILY_GRS_PRFT_CUM'){
                        item[key] = item[key].toFixed(2)
                    }
                    if(key === 'SEND_TGT' || key === 'SEND_AMT' || key === 'NEW_MTRL_TGT' || key === 'NEW_MTRL_AMT' 
                    || key === 'AVG_MEX_TGT' || key === 'AVG_PURPRICE_AMT' || key === 'TGT_AVG_SKU_DLVR_AMT' || key === 'AVG_SKU_DLVR_AMT'
                    || key === 'UNSALABLE_TGT' || key === 'UNCLEAN_INV_AMT'){
                        if((item[key] / 10000) > 1){
                            item[key] = ((item[key] / 10000)?.toFixed(0)*1).toLocaleString()
                        }else{
                            item[key] = (item[key] / 10000)?.toFixed(1)
                        }
                    }
                    if(key === 'TOT_SCORE'){
                        item[key] = item[key]?.toFixed(1)
                    }
                }
            })
            this.time = moment(res.data[0].LOAD_TIME).format('YYYY-MM-DD')
        },
        judgeValue(val) {
            if(val || val == '0'){
                return val
            }else{
                return '--'
            }
        }
    }
}
</script>

<style lang='scss' scoped>
@import '@/assets/styles/largeScreen.scss';
@keyframes fanzhuan{
    0%{
        transform: rotateX(0deg);
    }
    87.5%{
        transform: rotateX(0deg);
    }
    100%{
        transform: rotateX(-360deg);
    }
}
@keyframes move1 {
    0%{
        top: 0px
    }
    50%{
        top: px2vh(-100)
    }
    100%{
        top: 0px
    }
}
@keyframes move2 {
    0%{
        top: px2vh(19)
    }
    50%{
        top: px2vh(80)
    }
    100%{
        top: x2vh(19)
    }
}
@keyframes move3 {
    0%{
        top: px2vh(25)
    }
    25%{
        top: px2vh(0)
    }
    50%{
        top: px2vh(-25)
    }
    75%{
        top: px2vh(0)
    }
    100%{
        top: x2vh(25)
    }
}

.ProjectGroupRanking{
    position: relative;
    .bg{
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        width: 100vw;
        height: 100vh;
        background: url('~@/assets/images/datav/ProjectGroupRanking/bg.png') no-repeat 0 px2vh(-38)/px2vw(1920) px2vh(1118);
        .bg1{
            position: absolute;
            left: px2vw(51);
            width: px2vw(1840);
            height: px2vh(404);
            background: url('~@/assets/images/datav/ProjectGroupRanking/bg1.png') no-repeat 0 0/px2vw(1840) px2vh(404);
            animation: move1 5s 0s infinite;
            transition: all;
        }
        .bg2{
            position: absolute;
            top: px2vh(19);
            left: px2vw(107);
            width: px2vw(1564);
            height: px2vh(351);
            background: url('~@/assets/images/datav/ProjectGroupRanking/bg2.png') no-repeat 0 0/px2vw(1564) px2vh(351);
            animation: move2 5s 0s infinite;
            transition: all;
        }
        .bg3{
            position: absolute;
            top: px2vh(25);
            left: px2vw(130);
            width: px2vw(1790);
            height: px2vh(334);
            background: url('~@/assets/images/datav/ProjectGroupRanking/bg3.png') no-repeat 0 0/px2vw(1790) px2vh(334);
            animation: move3 5s 0s infinite;
            transition: all;
        }
        .light{
            position: absolute;
            top: px2vh(-50);
            left: px2vw(98);
            width: px2vw(1233);
            height: px2vh(352);
            background: url('~@/assets/images/datav/ProjectGroupRanking/light.png') no-repeat 0 0/px2vw(1233) px2vh(352);
        }
        .txt{
            position: absolute;
            top: px2vh(57);
            left: 50%;
            -webkit-transform: translateX(-50%);
                -ms-transform: translateX(-50%);
                    transform: translateX(-50%);
            width: px2vw(528);
            height: px2vh(107);
            background: url('~@/assets/images/datav/ProjectGroupRanking/txt.png') no-repeat 0 0/px2vw(528) px2vh(107);
        }
        .time{
            position: absolute;
            left: px2vw(47);
            top: px2vh(44);
            font-size: px2vh(16);
            font-family: PingFang SC;
            font-weight: bold;
            color: #FFFFFF;
            line-height: px2vh(7);
            opacity: 0.8;
        }
    }
    .content{
        position: absolute;
        top: px2vh(135);
        left: 50%;
        -webkit-transform: translateX(-50%);
            -ms-transform: translateX(-50%);
                transform: translateX(-50%);
        z-index: 2;
        width: px2vw(1842);
        height: px2vh(925);
        background: url('~@/assets/images/datav/ProjectGroupRanking/border.png') no-repeat 0 0/px2vw(1842) px2vh(866);
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
            -ms-flex-direction: column;
                flex-direction: column;
        -webkit-box-align: center;
            -ms-flex-align: center;
                align-items: center;
        .top{
            width: px2vw(1802);
            padding-right: px2vw(18);
            margin-top: px2vh(45);
            text-align: right;
            font-size: px2vh(16);
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #FFFFFF;
            opacity: 0.8;
        }
        .lineTitle{
            margin-top: px2vh(21);
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            width: px2vw(1798);
            background: rgba(0, 12, 49,0.38);
            border-radius: 10px;
            .item{
                -webkit-box-flex: 1;
                    -ms-flex: 1;
                        flex: 1;
                height: px2vh(80);
                font-size: px2vh(20);
                font-family: Microsoft YaHei;
                font-weight: 400;
                color: #FFFFFF;
                text-align: center;
                line-height: px2vh(80);
                opacity: 0.8;
                overflow: hidden;
                -o-text-overflow: ellipsis;
                   text-overflow: ellipsis;
                white-space: nowrap;
            }
            .item:nth-child(1){
                -webkit-box-flex: 0;
                    -ms-flex: none;
                        flex: none;
                width: px2vw(300);
                padding-left: px2vw(0);
            }
            .item:nth-child(2){
                -webkit-box-flex: 0;
                    -ms-flex: none;
                        flex: none;
                width: px2vw(100)
            }
        }
        .flexBox{
            height: px2vh(752);
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-orient: vertical;
            -webkit-box-direction: normal;
                -ms-flex-direction: column;
                    flex-direction: column;
        }
        .total{
            max-height: 200px;
            -webkit-box-flex: 1;
                -ms-flex: 1;
                    flex: 1;
            width: px2vw(1802);
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-align: center;
                -ms-flex-align: center;
                    align-items: center;
            vertical-align: middle;
            .col1{
                width: px2vw(300);
                padding-left: px2vw(114);
                text-align: left;
                font-size: px2vh(24);
                font-family: Microsoft YaHei;
                font-weight: bold;
                color: #FFFFFF;
                opacity: 0.85;
                white-space: nowrap;
                overflow: hidden;
            }
            .col2{
                width: px2vw(100);
                text-align: center;
                font-size: px2vh(24);
                font-family: Microsoft YaHei;
                font-weight: bold;
                color: #FFFFFF;
                opacity: 0.85;
                white-space: nowrap;
            }
            .col3{
                -webkit-box-flex: 1;
                    -ms-flex: 1;
                        flex: 1;
                opacity: 0.85;
                text-align: center;
                white-space: nowrap;
                display: -webkit-box;
                display: -ms-flexbox;
                display: flex;
                -webkit-box-pack: center;
                    -ms-flex-pack: center;
                        justify-content: center;
                overflow: hidden;
                .left{
                    -webkit-box-flex: 1;
                        -ms-flex: 1;
                            flex: 1;
                    font-size: px2vh(17);
                    font-family: Microsoft YaHei;
                    font-weight: bold;
                    color: #FFFFFF;
                    text-align: right;
                    -o-text-overflow: ellipsis;
                       text-overflow: ellipsis;
                    overflow: hidden;
                }
                .right{
                    padding-left: px2vh(4);
                    -webkit-box-flex: 1;
                        -ms-flex: 1;
                            flex: 1;
                    text-align: left;
                    font-size: px2vh(17);
                    font-family: Microsoft YaHei;
                    font-weight: bold;
                    color: #48FF00;
                    -o-text-overflow: ellipsis;
                       text-overflow: ellipsis;
                    overflow: hidden;
                }
                .red{
                    color: #FF0000;
                    font-weight: bold;
                }
            }
        }
        .line1{
            -webkit-box-flex: 1;
                -ms-flex: 1;
                    flex: 1;
            width: px2vw(1798);
            background: url('~@/assets/images/datav/ProjectGroupRanking/lineborder.png') no-repeat 0 0/100% 100%;
            border-radius: 5px;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-align: center;
                -ms-flex-align: center;
                    align-items: center;
            vertical-align: middle;
            animation: fanzhuan 30s 0s infinite;
            transition: all;
            .col1{
                width: px2vw(300);
                height: 100%;
                display: -webkit-box;
                display: -ms-flexbox;
                display: flex;
                -webkit-box-align: center;
                    -ms-flex-align: center;
                        align-items: center;
                // padding: px2vh(13) 0 px2vh(13) px2vw(12);
                padding: px2vh(5) 0 px2vh(5) px2vw(12);
                // padding: 3px 0 3px px2vw(12);
                .img{
                    height: 100%;
                    width: px2vw(84);
                    // min-width: px2vw(84);
                    min-width: 52px;
                    background: url('~@/assets/images/datav/ProjectGroupRanking/line1.png') no-repeat 0 0/auto 100%;
                    background-position: center;
                }
                .name{
                    margin-left: px2vw(18);
                    display: table-cell;
                    vertical-align: middle;
                    -webkit-box-flex: 1;
                        -ms-flex: 1;
                            flex: 1;
                    font-size: px2vh(20);
                    font-family: Microsoft YaHei;
                    font-weight: 400;
                    color: #FFFFFF;
                    opacity: 0.85;
                    -o-text-overflow: ellipsis;
                       text-overflow: ellipsis;
                    white-space: nowrap;
                    overflow: hidden;
                }
            }
            .col2{
                width: px2vw(100);
                font-size: px2vh(20);
                font-family: Microsoft YaHei;
                font-weight: 400;
                color: #FFFFFF;
                text-align: center;
                overflow: hidden;
            }
            .col3{
                -webkit-box-flex: 1;
                    -ms-flex: 1;
                        flex: 1;
                text-align: center;
                opacity: 0.85;
                white-space: nowrap;
                overflow: hidden;
                display: -webkit-box;
                display: -ms-flexbox;
                display: flex;
                -webkit-box-pack: center;
                    -ms-flex-pack: center;
                        justify-content: center;
                .left{
                    font-size: px2vh(17);
                    font-family: Microsoft YaHei;
                    font-weight: 400;
                    color: #FFFFFF;
                    text-align: left;
                    -o-text-overflow: ellipsis;
                       text-overflow: ellipsis;
                    overflow: hidden;

                }
                .right{
                    padding-left: px2vh(4);
                    font-size: px2vh(17);
                    font-family: Microsoft YaHei;
                    font-weight: 400;
                    color: #48FF00;
                    text-align: right;
                    -o-text-overflow: ellipsis;
                       text-overflow: ellipsis;
                    overflow: hidden;
                }
                .red{
                    color: #FF0000;
                    // font-weight: bold;
                }
            }
        }
        .line2{
            animation: fanzhuan 30s 2s infinite;
            transition: all;
            .col1{
                .img{
                    background: url('~@/assets/images/datav/ProjectGroupRanking/line2.png') no-repeat 0 0/auto 100%;
                    background-position: center;
                }
            }
        }
        .line3{
            animation: fanzhuan 30s 4s infinite;
            transition: all;
            .col1{
                .img{
                    background: url('~@/assets/images/datav/ProjectGroupRanking/line3.png') no-repeat 0 0/auto 100%;
                    background-position: center;
                }
            }
        }
        .line4{
            background: none;
            border-bottom: 1px solid #2235AA;
            margin-bottom: 0;
            animation: none;
            .col1{
                .index{
                    width: px2vw(84);
                    // min-width: px2vw(84);
                    min-width: 52px;
                    font-size: px2vh(24);
                    line-height: px2vh(24);
                    text-align: center;
                    font-family: Microsoft YaHei;
                    font-weight: bold;
                    color: #FFFFFF;
                }
            }
        }
    }
}
</style>