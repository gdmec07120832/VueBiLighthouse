<!--
 * @Author: 黄浩
 * @Date: 2021-12-23 11:51:11
 * @LastEditTime: 2021-12-31 09:08:17
 * @LastEditors: Please set LastEditors
 * @Descripttion: 
 * @FilePath: \lsmy-bi-lighthouse-front\src\views\BIView\ProductSupply\ChannelOverviewRealTimePerformance\components\RealTimeOverview\components\bottom.vue
-->
<template>
    <div class="bottom">
        <Table :tableData="tableData"/>
    </div>
</template>

<script>
import Table from './Table.vue'
export default {
    created() {
        this.getData()
        let that = this
        this.timer = setInterval(() => {
            that.getData()
        }, that.duration);
    },
    beforeDestroy() {
        clearInterval(this.timer)  
    },
    props: {
        currentView: {
            type: Number
        },
        duration: {
            type: Number
        }
    },
    components: { Table },
    watch: {
        currentView: {
            handler() {
                this.getData()
            }
        }
    },
    data() {
        return {
            timer: null,
            table: {
                loading: false,
                pagination: {
                    total: 0,
                    page: 1,
                    pageSize: 12
                },
                data: [],
                needPaging: false
            },
            tableData: []
        }
    },
    methods: {
        colorFun(text,index) {
            if(index === 2) {
                return text.split('%')[0] >= 100 ? 'red' : 'green'
            }else if(index === 4){
                if(text.split('%')[0] > 0) return 'red'
                else if(text.split('%')[0] < 0) return 'green'
            }
        },
        rowClass(record, index){
            return index % 2 === 0 ? 'rowClass': ''
        },
        async getData() {
            let map = ['全司视角', '全中视角', '品市视角']
            let params = {
                CHANNEL_VIEW: map[this.currentView - 1],
            }
            let res = await this.$fetchSql('real_time', 'read_time_chnl_type', params)
            let map1 = {
                汇总: 0,
                线上平台: 1,
                线上外包: 2,
                线下直营: 3,
                线下经销: 4,
                线下家装: 5,
                线下定制: 6,
                线下拎包: 7,
                海外B2B: 8,
                海外B2C: 9,
            }
            let arr = res.data
            arr.sort((a,b) => {
                return map1[a.CHANNEL] - map1[b.CHANNEL]
            })
            arr.forEach(item => {
                item.SALES_TARGET = parseInt(item.SALES_TARGET).toLocaleString()
                item.SALE_AMT = parseInt(item.SALE_AMT).toLocaleString()
                item.CMP_RATE = (item.CMP_RATE * 100).toFixed(1) + '%'
                item.TOT_RATE = (item.TOT_RATE * 100).toFixed(1) + '%'
                item.AGO_DIF_RATE = (item.AGO_DIF_RATE * 100).toFixed(1) + '%'
            })
            this.tableData = arr.concat()
            if(this.currentView === 2) {
                let arr = [
                    {
                        CHANNEL_VIEW: "/",
                        CHANNEL: "/",
                        SALES_TARGET: "/",
                        SALE_AMT: "/",
                        AGO_SALE_AMT: "/",
                        AGO_DIF_RATE: "/",
                        CMP_RATE: "/",
                        TOT_RATE: "/"
                    },
                    {
                        CHANNEL_VIEW: "/",
                        CHANNEL: "/",
                        SALES_TARGET: "/",
                        SALE_AMT: "/",
                        AGO_SALE_AMT: "/",
                        AGO_DIF_RATE: "/",
                        CMP_RATE: "/",
                        TOT_RATE: "/"
                    },
                    {
                        CHANNEL_VIEW: "/",
                        CHANNEL: "/",
                        SALES_TARGET: "/",
                        SALE_AMT: "/",
                        AGO_SALE_AMT: "/",
                        AGO_DIF_RATE: "/",
                        CMP_RATE: "/",
                        TOT_RATE: "/"
                    },
                ]
                this.tableData = this.tableData.concat(arr)
            }
        }
    }
}
</script>

<style lang='scss' scoped>
@import '~@/assets/styles/common.scss';

.bottom{
    // height: 250px;
    border-radius: 4px;
    border: 1px solid #F0F0F0;
    position: relative;
    .border{
        position: absolute;
        width: 2px;
        height: 100%;
        background: #F5F6FA;
        z-index: 2;
    }
    .classification{
        width: 100%;
        display: flex;
        height: 32px;
        background: #FAFAFA;
        div{
            text-align: center;
            font-size: 12px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: rgba(0, 0, 0, 0.85);
            line-height: 32px;
        }
    }
}
/deep/ .rowClass{
    background: #FAFAFA;
}
.red{
    color: $rise
}
.green{
    color: $fall
}
</style>