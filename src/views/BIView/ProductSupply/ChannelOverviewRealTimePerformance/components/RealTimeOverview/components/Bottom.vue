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
        <!-- <div class="border" style="left: 18%"></div>
        <div class="border" style="left: 36%"></div>
        <div class="border" style="left: 81%"></div>
        <div class="classification">
            <div style="width: 18%"></div>
            <div style="width: 18%">线上</div>
            <div style="width: 45%">线下</div>
            <div style="width: 19%">海外</div>
        </div> -->
        <!-- <y-table
        class="text-black"
        :options="{ ...table, columns: tableColumns, rowClassName: (record,index) => {return rowClass(record, index)}}"
        rowKey="key"
        :loading="table.loading"
        ></y-table> -->
        <Table :tableData="tableData"/>
    </div>
</template>

<script>
// import YTable from '@/views/BIView/components/YTable/YTable2'
import Table from './Table.vue'
import { cloneDeep } from 'lodash'
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
    computed: {
        tableColumns() {
            return [
                { title: '渠道细分', dataIndex: '渠道细分', width: '9%', ellipsis: true,
                    customRender: (text,index) => {
                        return <div oncontextmenu={(e) => {this.openMenu(e,text)}} title={text}>{text}</div>
                    }
                },
                { title: '汇总', dataIndex: '汇总', width: '9%', ellipsis: true,
                    customRender: (text, record, index) => {
                        return <div oncontextmenu={(e) => {this.openMenu(e,text)}} title={text} class={this.colorFun(text, index)}>{text}</div>
                    }
                },
                { title: '线上平台', dataIndex: '线上平台', width: '9%', ellipsis: true,
                    customRender: (text, record, index) => {
                        return <div oncontextmenu={(e) => {this.openMenu(e,text)}} title={text} class={this.colorFun(text, index)}>{text}</div>
                    }
                },
                { title: '线上外包', dataIndex: '线上外包', width: '9%', ellipsis: true,
                    customRender: (text, record, index) => {
                        return <div oncontextmenu={(e) => {this.openMenu(e,text)}} title={text} class={this.colorFun(text, index)}>{text}</div>
                    }
                },
                { title: '线下直营', dataIndex: '线下直营', width: '9%', ellipsis: true,
                    customRender: (text, record, index) => {
                        return <div oncontextmenu={(e) => {this.openMenu(e,text)}} title={text} class={this.colorFun(text, index)}>{text}</div>
                    }
                },
                { title: '线下经销', dataIndex: '线下经销', width: '9%', ellipsis: true,
                    customRender: (text, record, index) => {
                        return <div oncontextmenu={(e) => {this.openMenu(e,text)}} title={text} class={this.colorFun(text, index)}>{text}</div>
                    }
                },
                { title: '线下家装', dataIndex: '线下家装', width: '9%', ellipsis: true,
                    customRender: (text, record, index) => {
                        return <div oncontextmenu={(e) => {this.openMenu(e,text)}} title={text} class={this.colorFun(text, index)}>{text}</div>
                    }
                },
                { title: '线下定制', dataIndex: '线下定制', width: '9%', ellipsis: true,
                    customRender: (text, record, index) => {
                        return <div oncontextmenu={(e) => {this.openMenu(e,text)}} title={text} class={this.colorFun(text, index)}>{text}</div>
                    }
                },
                { title: '线下拎包', dataIndex: '线下拎包', width: '9%', ellipsis: true,
                    customRender: (text, record, index) => {
                        return <div oncontextmenu={(e) => {this.openMenu(e,text)}} title={text} class={this.colorFun(text, index)}>{text}</div>
                    }
                },
                { title: '海外B2B', dataIndex: '海外B2B', width: '9%', ellipsis: true,
                    customRender: (text, record, index) => {
                        return <div oncontextmenu={(e) => {this.openMenu(e,text)}} title={text} class={this.colorFun(text, index)}>{text}</div>
                    }
                },
                { title: '海外B2C', dataIndex: '海外B2C', width: '10%', ellipsis: true,
                    customRender: (text, record, index) => {
                        return <div oncontextmenu={(e) => {this.openMenu(e,text)}} title={text} class={this.colorFun(text, index)}>{text}</div>
                    }
                },
            ]
        },
    },
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
                // 线上渠道: 3,
                线下直营: 4,
                线下经销: 5,
                线下家装: 6,
                线下定制: 7,
                线下拎包: 8,
                海外B2B: 9,
                海外B2C: 10,
            }
            if(this.currentView === 3) map1['线上渠道'] = 3
            for(let key in map1) {
                let emptyItem = {
                    AGO_DIF_RATE: null,
                    AGO_SALE_AMT: null,
                    CHANNEL: null,
                    CHANNEL_VIEW: null,
                    CMP_RATE: null,
                    SALES_TARGET: null,
                    SALE_AMT: null,
                    TOT_RATE: null
                }
                let CHANNEL = Array.from(new Set(res.data.map(_ => _.CHANNEL)))
                if(!CHANNEL.includes(key)) {
                    let item = cloneDeep(emptyItem)
                    item.CHANNEL = key
                    res.data.push(item)
                }
                if(this.currentView === 3 && key === '汇总' && !CHANNEL.includes(key)){
                    let index = res.data.findIndex(_ => _.CHANNEL === key)
                    if(index > -1) {
                        res.data.splice(index, 1)
                        let sum = res.data.filter(_ => _.CHANNEL === '线上渠道')
                        if(sum.length) {
                            sum = cloneDeep(sum[0])
                            sum.CHANNEL = '汇总'
                            res.data.push(sum)
                        }
                    }
                }
            }
            let arr = res.data
            arr.sort((a,b) => {
                return map1[a.CHANNEL] - map1[b.CHANNEL]
            })
            arr.forEach(item => {
                item.SALES_TARGET = ![null].includes(item.SALES_TARGET) ? parseInt(item.SALES_TARGET).toLocaleString() : '--'
                item.SALE_AMT = ![null].includes(item.SALE_AMT) ? parseInt(item.SALE_AMT).toLocaleString() : '--'
                item.CMP_RATE = ![null].includes(item.CMP_RATE) ? (item.CMP_RATE * 100).toFixed(1) + '%' : '--'
                item.TOT_RATE = ![null].includes(item.TOT_RATE) ? (item.TOT_RATE * 100).toFixed(1) + '%' : '--'
                item.AGO_DIF_RATE = ![null].includes(item.AGO_DIF_RATE) ? (item.AGO_DIF_RATE * 100).toFixed(1) + '%' : '--'
            })
            this.tableData = arr.concat()
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