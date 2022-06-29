<!--
 * @Author: 黄浩
 * @Date: 2021-12-23 15:46:17
 * @LastEditTime: 2022-02-28 13:42:37
 * @LastEditors: Please set LastEditors
 * @Descripttion: 线上店铺
 * @FilePath: \lsmy-bi-lighthouse-front\src\views\BIView\ProductSupply\ChannelOverviewRealTimePerformance\components\ChannelDetails\components\Tab1.vue
-->
<template>
    <div class="tab1">
        <Select1 :timerNumber="timerNumber" :duration="duration" v-if="currentTab === 1" :currentView="currentView" @changeSelectOptions="changeSelectOptions"
                 @callBack="tableDataChange" :col1.sync="col1" class="top"/>
        <Select2 :timerNumber="timerNumber" :duration="duration" v-if="currentTab === 2" :currentView="currentView" @changeSelectOptions="changeSelectOptions"
                 @callBack="tableDataChange" :col1.sync="col1" class="top"/>
        <Select3 ref="select3" :timerNumber="timerNumber" :duration="duration" v-if="currentTab === 3" @changeSelectOptions="changeSelectOptions"
                 :currentView="currentView" @callBack="tableDataChange" :col1.sync="col1" class="top"/>
        <div class="bottom" :style="{height: currentTab === 1 ? 'calc(100% - 56px)' : 'calc(100% - 87px)'}">
            <!-- v-if="showTable" -->
            <y-table
                    style="width: 40%;height: 100%"
                    class="text-black table"
                    @change="handleChange"
                    :options="{ ...table, pagination: table.pagination, needPagingDefault: true, columns: tableColumns,
            rowClassName: (record,index) => {return index === 0 ? 'totalRow' : index % 2 !== 0 ? 'rowClass' : ''},
            customRow: (record) => {return {on: {click: (event) => {this.rowClick(event,record)}}}}
            }"
            :rowKey="(row, index) => row.toString() + index"
            ></y-table>
            <div class="chart" style="height: 100%">
                <div class="time">
                    <div class="left">{{ rightTitle }}</div>
                    <div class="right">
                        <SwitchButton style="margin-right: 8px" :label1="'同期对比'" :label2="'对比日期'"
                                      :currentBtn.sync="currentBtn"/>
                        <a-date-picker :disabledDate="disabledDate" :allowClear="false" v-if="currentBtn === 1"
                                       style="width: 148px" size="small" v-model="date" valueFormat="YYYY-MM-DD"/>
                    </div>
                </div>
                <div id="line3" class="chart1"></div>
                <div id="line4" class="chart1 mt10"></div>
            </div>
        </div>
        <div v-if="menuVisible" class="selectMenu" :style="[{left: menuX},{top: menuY}]">
            <div class="item box" v-clipboard="currentRow">复制内容</div>
            <!-- <div class="item" @click="copy">其他</div> -->
        </div>
    </div>
</template>

<script>
import numeral from 'numeral'
import YTable from '@/views/BIView/components/YTable/YTable2'
import SwitchButton from '../../RealTimeOverview/components/SwitchButton.vue'
import moment from 'moment'
import * as echarts from 'echarts5/lib/echarts'
import 'echarts5/lib/component/tooltip'
import 'echarts5/lib/component/title'
import {GridComponent} from 'echarts5/components'
import {LineChart} from 'echarts5/charts';
// 第一块筛选区域 对应线上区域tab
import Select1 from './Select1.vue'
import Select2 from './Select2.vue'
import Select3 from './Select3.vue'
import _, {groupBy} from 'lodash'
import debounce from 'lodash/debounce'

echarts.use([GridComponent])
echarts.use([LineChart])

export default {
    components: {YTable, SwitchButton, Select1, Select2, Select3},
    props: {
        // 平台
        currentTab: {
            type: Number
        },
        currentView: {
            type: Number
        },
        currentChannel: {
            type: Number
        },
        duration: {
            type: Number
        }
    },
    computed: {
        tableColumns() {
            let map = [
                {
                    title: '平台', dataIndex: 'SHOP_GROUP', width: '9%', ellipsis: true,
                    customRender: (text) => {
                        return <div class="tableRow"
                                    style={{textDecoration: text ? 'underline' : 'none', color: text ? '' : 'inherit'}}
                                    oncontextmenu={(e) => {
                                        this.openMenu(e, text)
                                    }} title={text}>{text || '——'}</div>
                    }
                },
                {
                    title: '店铺', dataIndex: 'SHOP_NAME', width: '15%', ellipsis: true,
                    customRender: (text) => {
                        return <div class="tableRow"
                                    style={{textDecoration: text ? 'underline' : 'none', color: text ? '' : 'inherit'}}
                                    oncontextmenu={(e) => {
                                        this.openMenu(e, text)
                                    }} title={text}>{text || '——'}</div>
                    }
                },
                {
                    title: '负责人', dataIndex: 'BOSS', width: '9%', ellipsis: true,
                    customRender: (text) => {
                        return <div class="tableRow"
                                    style={{textDecoration: text ? 'underline' : 'none', color: text ? '' : 'inherit'}}
                                    oncontextmenu={(e) => {
                                        this.openMenu(e, text)
                                    }} title={text}>{text || '——'}</div>
                    }
                },
                {
                    title: '分组', hidden: this.col1 === 3, dataIndex: 'GROUP_NAME', width: '9%', ellipsis: true,
                    customRender: (text) => {
                        return <div class="tableRow"
                                    style={{textDecoration: text ? 'underline' : 'none', color: text ? '' : 'inherit'}}
                                    oncontextmenu={(e) => {
                                        this.openMenu(e, text)
                                    }} title={text}>{text || '——'}</div>
                    }
                },
                {
                    title: '区域', dataIndex: 'S_OR_N', width: '9%', ellipsis: true,
                    customRender: (text) => {
                        return <div class="tableRow" oncontextmenu={(e) => {
                            this.openMenu(e, text)
                        }} title={text}>{text}</div>
                    }
                },
                {
                    title: '大区', dataIndex: 'AREA_NAME', width: '9%', ellipsis: true,
                    customRender: (text) => {
                        return <div class="tableRow" oncontextmenu={(e) => {
                            this.openMenu(e, text)
                        }} title={text}>{text}</div>
                    }
                },
                {
                    title: '片区', dataIndex: 'SUB_AREA_NAME', width: '9%', ellipsis: true,
                    customRender: (text) => {
                        return <div class="tableRow" oncontextmenu={(e) => {
                            this.openMenu(e, text)
                        }} title={text}>{text}</div>
                    }
                },
                {
                    title: '店铺', dataIndex: 'SHOP_NAME', width: '9%', ellipsis: true,
                    customRender: (text) => {
                        return <div class="tableRow" oncontextmenu={(e) => {
                            this.openMenu(e, text)
                        }} title={text}>{text}</div>
                    }
                },
            ]
            let arr = [
                {
                    title: '目标',
                    dataIndex: 'SALES_TARGET',
                    width: '9%',
                    ellipsis: true,
                    // sorter: (a, b, order) => this.sortFun(a, b, order, 'SALES_TARGET'),
                    sorter: true,
                    defaultSortOrder: 'descend',
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {
                            this.openMenu(e, text)
                        }} title={text}>{this.handlerValue(text)}</div>
                    }
                },
                {
                    title: '实绩',
                    dataIndex: 'SALE_AMT',
                    width: '9%',
                    ellipsis: true,
                    // sorter: (a, b, order) => this.sortFun(a, b, order, 'SALE_AMT'),
                    sorter: true,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {
                            this.openMenu(e, text)
                        }} title={text}>{this.handlerValue(text)}</div>
                    }
                },
                {
                    title: '达成',
                    dataIndex: 'CMP_RATE',
                    width: '9%',
                    ellipsis: true,
                    // sorter: (a, b, order) => this.sortFun(a, b, order, 'CMP_RATE'),
                    sorter: true,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {
                            this.openMenu(e, text)
                        }} title={text}>{this.handlerValue(text, true)}</div>
                    }
                }
            ]
            if (this.currentTab === 1) {
                arr = map.slice(0, 2).concat(arr)
            } else if (this.currentTab === 2) {
                arr = map.slice(2, 4).concat(arr)
            } else {
                arr.unshift(map[this.col1 - 1])
            }
            return arr.filter(col => !col.hidden)

        },
        sorting_fieldAndOrder() {
            return this.sorting.field + this.sorting.order
        },
    },
    watch: {
        // selectOptions: {
        //     async handler(val) {
        //         // if(val.name === '线上店铺'){
        //             if (this.currentBtn === 0) {
        //                 await this.getEchartsData(val)
        //             }
        //             else if (this.currentBtn === 1) {
        //                 //await this.getEchartsData(this.currentRecord)
        //                 await this.getCompare(val)
        //             }
        //         // }
        //     },
        //     deep: true,
        // },
        currentBtn: {
            async handler(val) {
                if (val === 0) {
                    this.date = moment().format('YYYYMMDD')
                    // await this.getEchartsData(this.currentRecord)

                } else if (val === 1) {
                    // await this.getEchartsData(this.currentRecord)
                    // await this.getCompare(this.currentRecord)
                }
                this.getEchartsData(this.currentRecord)
                this.getCompare(this.currentRecord)
            }
        },
        currentView: {
            async handler() {
                // if (this.currentBtn === 0) {
                //     await this.getEchartsData(this.currentRecord)
                // } else if (this.currentBtn === 1) {
                //     // await this.getEchartsData(this.currentRecord)
                //     await this.getCompare(this.currentRecord)
                // }
                this.getEchartsData(this.currentRecord)
                this.getCompare(this.currentRecord)
            }
        },
        // 控制是哪个select 线上店铺/线下区域
        currentTab: {
            handler(val) {
                // this.tableColumns = {}
                // this.tableColumns = this.computeTableComp()
                // this.tableColumns.filter(_ => _.title === '目标' || _.title === '达成')
                // .forEach(_ => _.sortOrder = false)
                // this.tableColumns.filter(_ => _.title === '实绩')
                // .forEach(_ => _.sortOrder = 'descend')
                this.rightTitle = '汇总'
                if (val === 1) {
                    this.currentRecord = this.table.data[0]
                    this.col1 = 1
                } else if (val === 2) {
                    this.currentRecord = this.table.data[0]
                    this.col1 = 3
                } else if (val === 3) {
                    this.currentRecord = this.table.data[0]
                    this.col1 = 5
                }
                let that = this
                this.showTable = false
                setTimeout(() => {
                    that.showTable = true
                }, 100)
                this.sorting.field = 'SALE_AMT'
                this.sorting.order = 'desc'
                this.$nextTick(() => {
                    setTimeout(() => {
                        that.line3.resize()
                        that.line4.resize()
                    }, 300)
                })
            }
        },
        date: {
            async handler() {
                if (this.currentBtn === 0) {
                    //await this.getEchartsData(this.currentRecord)
                    await this.getEchartsData(this.currentRecord)
                }
                else if(this.currentBtn === 1) {
                    await this.getCompare(this.currentRecord)
                }
                this.getEchartsData(this.currentRecord)
                this.getCompare(this.currentRecord)
            }
        },
        col1: {
            async handler(val) {
                // if(val !== 1 && val !== 2){
                //     if(this.currentBtn === 0) {
                //         await this.getEchartsData(this.currentRecord)
                //     }
                //     else if(this.currentBtn === 1) {
                //         //await this.getEchartsData(this.currentRecord)
                //         await this.getCompare(this.currentRecord)
                //     }
                // }
                this.getEchartsData(this.currentRecord)
                this.getCompare(this.currentRecord)
            }
        },
        // 选择select时的选项 或者 点击table时的数据
        currentRecord: {
            async handler(val) {
                // if (this.currentBtn === 0) {
                //     this.getEchartsData(this.currentRecord)
                // }
                // else if (this.currentBtn === 1) {
                //     await this.getEchartsData(this.currentRecord)
                //     this.getCompare(this.currentRecord)
                // }
                this.getEchartsData(this.currentRecord)
                this.getCompare(this.currentRecord)
            }
        },
        // sorting_fieldAndOrder: {
        //     handler(val, oval) {
        //         console.log(val, oval)
        //         let sorting = this.sorting
        //         if(val === oval) return
        //         else {
        //             if(sorting.field === 'rownum') {
        //                 this.table.data = this.temporaryStorage.concat()
        //             }else if(sorting.field !== 'rownum') {
        //                 let sum,data
        //                 let pageSize = this.table.pagination.pageSize
        //                 let obj = {
        //                     1: 'SHOP_GROUP',
        //                     2: 'BOSS',
        //                     5: 'S_OR_N',
        //                     6: 'AREA_NAME',
        //                     7: 'SUB_AREA_NAME',
        //                     8: 'SHOP_NAME',
        //                 }
        //                 if(this.currentTab === 1 || this.currentTab === 2) {
        //                     sum = this.table.data.filter(_ => _[obj[this.currentTab]] === '汇总')[0]
        //                     data = this.table.data.filter(_ => _[obj[this.currentTab]] !== '汇总').concat()
        //                 }else if(this.currentTab === 3) {
        //                     sum = this.table.data.filter(_ => _[obj[this.col1]] === '汇总')[0]
        //                     data = this.table.data.filter(_ => _[obj[this.col1]] !== '汇总').concat()
        //                 }
        //                 console.log(this.table.data)
        //                 if(sorting.order === 'asc') {
        //                     data.sort((a, b) => a[sorting.field] - b[sorting.field])
        //                 }else {
        //                     data.sort((a, b) => b[sorting.field] - a[sorting.field])
        //                 }
        //                 let num = Math.ceil(data.length / (pageSize - 1))
        //                 this.table.data = []
        //                 for(let i = 0; i < num; i++) {
        //                     let arr = []
        //                     arr.push(sum)
        //                     arr = arr.concat(data.slice(pageSize * i, pageSize * (i + 1) - 1))
        //                     this.table.data = this.table.data.concat(arr)
        //                 }
        //                 console.log(this.table.data)
        //             }
        //         }
        //     }
        // },
        // 'table.pagination.current': {
        //     handler(val) {
        //         console.log(val, this.)
        //     }
        // }
    },
    created() {
        this.option1 = _.cloneDeep(this.model)
        this.option2 = _.cloneDeep(this.model)
        this.getEchartsData(this.currentRecord)
        let that = this
        this.timer = setInterval(async () => {
            if (that.currentBtn === 0) {
                that.getEchartsData(that.currentRecord)
            } else if (that.currentBtn === 1) {
                await that.getEchartsData(that.currentRecord)
                that.getCompare(that.currentRecord)
            }
            that.timerNumber++
        }, that.duration);

        // this.tableColumns = this.computeTableComp()
    },
    mounted() {
        this.rightTitle = '汇总'
        this.currentRecord = {
            SHOP_GROUP: ''
        }
        const handler = () => {
            if (this.menuVisible) this.menuVisible = !this.menuVisible
        }
        document.body.addEventListener('click', handler)
        const handler2 = debounce(() => {
            this.menuVisible = false
        }, 500, {leading: true})
        document.querySelector('#channelOverviewRealTimePerformance')?.addEventListener('scroll', handler2)
        this.$on('hook:beforeDestroy', () => {
            document.body.removeEventListener('click', handler)
            document.querySelector('#channelOverviewRealTimePerformance')?.removeEventListener('scroll', handler2)
        })
    },
    beforeDestroy() {
        clearInterval(this.timer)
        if(this.line3 !== null) this.line3.dispose()
        if(this.line4 !== null) this.line4.dispose()
    },
    data() {
        this.getEchartsData = _.debounce(this.getEchartsData, 200, {
            leading: false,
            trailing: true
        })
        this.getCompare = _.debounce(this.getCompare, 200, {
            leading: false,
            trailing: true
        })
        return {
            // // 存储每个select的选项供调用echartsApi时调用
            selectOptions: {},
            // tableColumns: {},
            showTable: true,
            //tab1 "SALE_AMT" 2 3
            sorting: {
                field: 'SALE_AMT',
                order: 'desc',
                // field: 'SALE_AMT',
                // order: 'desc',
            },
            // 三个select要与主页面步调一致 因为是if 所以 当if为true时 select里的定时器才产生
            // 这样就会到时别人30秒刷新一次 他要延时一会 这个延时是不定的 所以定义一个标志
            // 让三个select监听这个标志来调用 进而达到步调一致的效果
            timerNumber: 0,
            timer: null,
            menuVisible: false,
            menuX: '0px',
            menuY: '0px',
            currentRow: '',
            rightTitle: '',
            // 平台
            CHANNEL_TYPE: [],
            // 店铺
            CHANNEL: [],
            table: {
                loading: false,
                pagination: {
                    total: 0,
                    page: 1,
                    pageSize: 10,
                    showTotal: (total) => `共${total}条 每页${this.table.pagination.pageSize}条`
                },
                data: [],
                needPaging: false
            },
            date: moment(new Date()).format('YYYY-MM-DD'),
            currentBtn: 0,
            // echarts model
            model: {
                title: {
                    text: '分时趋势图',
                    textStyle: {
                        fontSize: 14,
                        fontWeight: 400,
                        fontFamily: 'PingFangSC-Medium, PingFang SC',
                        color: 'rgba(0, 0, 0, 0.65)',
                        lineHeight: 20,
                    },
                    top: 3,
                    left: 16,
                    padding: 0
                },
                grid: {
                    top: 30,
                    left: 16,
                    bottom: 0,
                    containLabel: true,
                },
                // 取色盘
                color: ['#5B8FF9', '#DFE4EA', '#DFE4EA'],
                // 每条线的取色策略
                colorBy: 'series',
                // 图例
                // legend: {
                //     data: ['同期业绩', '支付业绩'],
                //     show: false,
                // },
                // 鼠标放到线上的提示
                tooltip: {
                    trigger: 'axis',
                    formatter: function (params) {
                        let str = `小时: ${params[0].axisValue}<br/>`
                        params.forEach(item => {
                            str += `${item.seriesName}:${numeral(item.value[1]).format('0,0')}<br/>`
                        })
                        // if(params.length > 1){
                        //     let hour = params[0].axisValue
                        //     let ago = params[1].value.toLocaleString()
                        //     let now = params[0].value.toLocaleString()
                        // }else{
                        //     let hour = params[0].axisValue
                        //     let ago = params[1].value.toLocaleString()
                        //     let now = params[0].value.toLocaleString()
                        // }
                        // return `小时: ${params[0].axisValue}<br/>同期业绩: ${params[1].value.toLocaleString()}<br/>支付业绩: ${params[0].value.toLocaleString()}`;
                        return str
                    },
                    axisPointer: {
                        type: 'line'
                    }
                },
                xAxis: {
                    type: 'category',
                    data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
                    // 坐标轴刻度标签
                    axisLabel: {
                        color: 'rgba(0,0,0,0.45)',
                        fontSize: 12,
                        fontFamily: 'Helvetica'
                    },
                    // 坐标轴刻度
                    axisTick: {
                        show: false
                    },
                    // 坐标轴轴线
                    axisLine: {
                        show: false
                    },
                },
                yAxis: {
                    type: 'value',
                    // 坐标轴在 grid 区域中的分隔线。
                    splitLine: {
                        lineStyle: {
                            color: '#F0F0F0',
                            type: 'dashed'
                        },
                    },
                    axisLabel: {
                        color: 'rgba(0,0,0,0.45)',
                        fontSize: 12,
                        fontFamily: 'Helvetica',
                        formatter: function (value, index) {
                            return (value / 10000).toLocaleString() + '万';
                        }
                    },
                },
                series: [
                    {
                        name: '支付业绩',
                        data: [],
                        type: 'line',
                        smooth: true,
                        symbol: 'none',
                        z: 2,
                        emphasis: {
                            lineStyle: {
                                color: '#5B8FF9'
                            }
                        }
                    },
                    {
                        name: '同期业绩',
                        data: [],
                        type: 'line',
                        smooth: true,
                        symbol: 'none',
                        z: 1,
                        emphasis: {
                            lineStyle: {
                                color: '#DFE4EA'
                            }
                        }
                    }
                ],
            },
            // 分时趋势图
            line3: null,
            // 时段累计图
            option1: {},
            line4: null,
            // 线上负责人&分组 1是负责人 2是分组
            option2: {},
            // 控制table首行是什么 1和2 分别为tab1中的输入 1为平台 2为店铺 以此类推 
            col1: 1,
            type1: 1,
            type2: 2,
            // 当前行点击的位置 第一个 或 第二个
            currentClickCol: 0,
            currentRecord: {},
            // 暂存 用来还原的数据
            temporaryStorage: [],
            // Tab3Type: 0
        }
    },
    methods: {
        // 每个select选项改变时调用
        changeSelectOptions(obj){
            this.selectOptions = obj
            this.currentRecord = obj
        },
        sortFun(a, b, order, field) {
            let sumField = {
                1: 'SHOP_GROUP',
                3: 'BOSS',
                5: 'S_OR_N',
                6: 'AREA_NAME',
                7: 'SUB_AREA_NAME',
                8: 'SHOP_NAME',
            }
            if (a[sumField[this.col1]] === '汇总' || b[sumField[this.col1]] === '汇总') {
                if (order === 'descend') return false
                return true
            }
            return a[field] - b[field]
        },
        computeTableComp() {
            let map = [
                {
                    title: '平台', dataIndex: 'SHOP_GROUP', width: '9%', ellipsis: true,
                    customRender: (text) => {
                        return <div class="tableRow"
                                    style={{textDecoration: text ? 'underline' : 'none', color: text ? '' : 'inherit'}}
                                    oncontextmenu={(e) => {
                                        this.openMenu(e, text)
                                    }} title={text}>{text || '——'}</div>
                    }
                },
                {
                    title: '店铺', dataIndex: 'SHOP_NAME', width: '15%', ellipsis: true,
                    customRender: (text) => {
                        return <div class="tableRow"
                                    style={{textDecoration: text ? 'underline' : 'none', color: text ? '' : 'inherit'}}
                                    oncontextmenu={(e) => {
                                        this.openMenu(e, text)
                                    }} title={text}>{text || '——'}</div>
                    }
                },
                {
                    title: '负责人', dataIndex: 'BOSS', width: '9%', ellipsis: true,
                    customRender: (text) => {
                        return <div class="tableRow"
                                    style={{textDecoration: text ? 'underline' : 'none', color: text ? '' : 'inherit'}}
                                    oncontextmenu={(e) => {
                                        this.openMenu(e, text)
                                    }} title={text}>{text || '——'}</div>
                    }
                },
                {
                    title: '分组', hidden: this.col1 === 3, dataIndex: 'GROUP_NAME', width: '9%', ellipsis: true,
                    customRender: (text) => {
                        return <div class="tableRow"
                                    style={{textDecoration: text ? 'underline' : 'none', color: text ? '' : 'inherit'}}
                                    oncontextmenu={(e) => {
                                        this.openMenu(e, text)
                                    }} title={text}>{text || '——'}</div>
                    }
                },
                {
                    title: '区域', dataIndex: 'S_OR_N', width: '9%', ellipsis: true,
                    customRender: (text) => {
                        return <div class="tableRow" oncontextmenu={(e) => {
                            this.openMenu(e, text)
                        }} title={text}>{text}</div>
                    }
                },
                {
                    title: '大区', dataIndex: 'AREA_NAME', width: '9%', ellipsis: true,
                    customRender: (text) => {
                        return <div class="tableRow" oncontextmenu={(e) => {
                            this.openMenu(e, text)
                        }} title={text}>{text}</div>
                    }
                },
                {
                    title: '片区', dataIndex: 'SUB_AREA_NAME', width: '9%', ellipsis: true,
                    customRender: (text) => {
                        return <div class="tableRow" oncontextmenu={(e) => {
                            this.openMenu(e, text)
                        }} title={text}>{text}</div>
                    }
                },
                {
                    title: '店铺', dataIndex: 'SHOP_NAME', width: '9%', ellipsis: true,
                    customRender: (text) => {
                        return <div class="tableRow" oncontextmenu={(e) => {
                            this.openMenu(e, text)
                        }} title={text}>{text}</div>
                    }
                },
            ]
            let arr = [
                {
                    title: '目标',
                    dataIndex: 'SALES_TARGET',
                    width: '9%',
                    ellipsis: true,
                    // sorter: (a, b) => a.SALES_TARGET - b.SALES_TARGET,
                    sorter: true,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {
                            this.openMenu(e, text)
                        }} title={text}>{this.handlerValue(text)}</div>
                    }
                },
                {
                    title: '实绩',
                    dataIndex: 'SALE_AMT',
                    width: '9%',
                    ellipsis: true,
                    // sorter: (a, b) => a.SALE_AMT - b.SALE_AMT,
                    sorter: true,
                    defaultSortOrder: 'descend',
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {
                            this.openMenu(e, text)
                        }} title={text}>{this.handlerValue(text)}</div>
                    }
                },
                {
                    title: '达成',
                    dataIndex: 'CMP_RATE',
                    width: '9%',
                    ellipsis: true,
                    // sorter: (a, b) => a.CMP_RATE - b.CMP_RATE,
                    sorter: true,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {
                            this.openMenu(e, text)
                        }} title={text}>{this.handlerValue(text, true)}</div>
                    }
                }
            ]
            if (this.currentTab === 1) {
                arr = map.slice(0, 2).concat(arr)
            } else if (this.currentTab === 2) {
                arr = map.slice(2, 4).concat(arr)
            } else {
                arr.unshift(map[this.col1 - 1])
            }
            return arr.filter(col => !col.hidden)
        },
        handleChange(pagination, filter, sorters) {
            // console.log(JSON.parse(JSON.stringify(sorters)))
            const orderMap = {
                ascend: 'asc',
                descend: 'desc',
            }
            let {field, order} = sorters
            if (field && order) {
                field = `${field}`
                order = orderMap[order]
            } else {
                field = 'rownum'
                order = 'asc'
            }
            this.sorting.field = field
            this.sorting.order = order
            let sumkey = this.computeTableComp()[0].dataIndex
            // 抽sum
            let sum = this.temporaryStorage.filter(_ => _[sumkey] === '汇总')
            let arr = this.temporaryStorage.filter(_ => _[sumkey] !== '汇总')
            if(order === 'asc') arr.sort((a, b) => a[field] - b[field])
            else if(order === 'desc') arr.sort((a, b) => b[field] - a[field])
            let num = Math.ceil(arr.length / 9)
            let newArr = []
            for(let i = 0; i < num; i++){
                newArr.push(sum[0])
                newArr = newArr.concat(arr.slice(i * 9, (i + 1) * 9))
            }
            this.table.data = newArr.concat()
            // this.table.data = [].concat()
            // this.getSumData()
            // this.getData()
        },
        formatHour(val) {
            if(val === '00') return '0'
            else if(val < 10 && val > 0) return val.split('0')[1]
            else return val
        },
        // 右键展开菜单
        openMenu(e, text) {
            e.preventDefault();
            this.menuX = e.pageX - 30 + 'px'
            this.menuY = e.pageY + 20 + 'px'
            this.currentRow = text
            this.menuVisible = true
        },
        disabledDate(current) {
            return current && current > moment().startOf('day');
        },
        rowClick(event, record) {
            let childrenList = event.target.parentElement.parentElement.children
            let index = 0
            for(let i = 0; i < childrenList.length; i++){
                if(childrenList[i].children[0].innerText === event.target.innerText){
                    index = i
                    break
                }
            }
            this.currentClickCol = index
            // if(index === 0) {
            //     this.getEchartsData()
            // }
            // if (this.currentBtn === 1) this.getCompare(this.currentRecord)
            let map = ['SHOP_GROUP', 'SHOP_NAME', 'BOSS', 'BOSS', 'S_OR_N', 'AREA_NAME', 'SUB_AREA_NAME', 'SHOP_NAME']
            this.rightTitle = record[map[this.col1 - 1]]
            let obj = {}
            if(this.col1 <= 2){
                console.log(obj.SHOP_GROUP)
                if(index === 0) obj.SHOP_GROUP = record.SHOP_GROUP
                else if(index === 1) {
                    obj.SHOP_GROUP = record.SHOP_GROUP
                    obj.SHOP_NAME = record.SHOP_NAME
                }
                else obj.SHOP_GROUP = record.SHOP_GROUP
                if(obj.SHOP_GROUP === '汇总') {
                    this.currentRecord = _.cloneDeep(this.selectOptions)
                    return
                }
            }
            else if(this.col1 >= 5){
                let keys = {
                    5: 'S_OR_N',
                    6: 'AREA_NAME',
                    7: 'SUB_AREA_NAME',
                    8: 'SHOP_NAME'
                }
                obj[keys[this.col1]] = record[keys[this.col1]]
                if(obj[keys[this.col1]] === '汇总') {
                    this.currentRecord = _.cloneDeep(this.selectOptions)
                    return
                }
            }
            this.currentRecord = _.cloneDeep(obj)
            // this.getEchartsData(obj)
        },
        async getEchartsData(record) {
            let map = ['全司视角', '全中视角', '品市视角']
            let params = {
                CHANNEL_VIEW: map[this.currentView - 1],
                TDATE: moment(new Date()).format('YYYYMMDD')
            }
            // let arrName = [['SHOP_GROUP', 'SHOP_NAME'], ['BOSS', 'GROUP_NAME'], ['S_OR_N', 'AREA_NAME', 'SUB_AREA_NAME', 'SHOP_NAME']]
            // let arrName1 = []
            // if (this.col1 <= 2) {
            //     arrName1 = arrName[0].concat()
            //     arrName1.splice(this.col1)
            // } else if (this.col1 > 2 && this.col1 < 5) {
            //     arrName1 = arrName[1].concat()
            //     arrName1.splice(this.col1 - 2)
            // } else if (this.col1 >= 5) {
            //     arrName1 = arrName[2].concat()
            //     arrName1.splice(this.col1 - 4)
            // }
            // console.log(arrName1)
            // arrName1.forEach(_ => {
            //     if (record[_]) {
            //         params[_] = record[_]
            //     }
            // })
            let api = [
                'real_time_chnl_qs',
                'real_time_boss_qs',
                'real_time_group_qs',
                'real_time_off_area_qs',
                'real_time_off_big_area_qs',
                'real_time_off_sub_area_qs',
                'real_time_off_shop_qs'
            ]
            let thisApi = api[this.col1 > 1 ? this.col1 - 2 : 0]
            if(this.col1 <= 2){
                let keys = ['SHOP_GROUP', 'SHOP_NAME']
                keys.forEach(key => {
                    if(record[key]) params[key] = record[key]
                })
            }
            if(this.col1 >= 5){
                let keys = ['S_OR_N', 'AREA_NAME', 'SUB_AREA_NAME', 'SHOP_NAME']
                keys.forEach(key => {
                    if(record[key]) params[key] = record[key]
                })
            }
            // if (thisApi === 'real_time_chnl_qs') {
            //     // if(this.currentClickCol === 0){}
            //     if (params['SHOP_GROUP'] === '汇总') {
            //         delete params['SHOP_GROUP']
            //     }
            // }
            //
            // if (thisApi === 'real_time_boss_qs' || thisApi === 'real_time_group_qs') {
            //     if (params['BOSS'] === '汇总') {
            //         delete params['BOSS']
            //     }
            // }
            let res = await this.$fetchSql('real_time', thisApi, params)
            // res.data = this.handlerArr(res.data)
            let indexMap = {
                1: 'SHOP_NAME',
                2: 'SHOP_NAME',
                5: 'S_OR_N',
                6: 'AREA_NAME',
                7: 'SUB_AREA_NAME',
                8: 'SHOP_NAME',
            }
            // res.data = res.data.filter(_ => _[indexMap[this.col1]] === '汇总')
            res.data = this.handlerArr(res.data)
            if (res.data.length) {
                // this.option1 = _.cloneDeep(this.model)
                this.option1.series[0].data = res.data.map(item => {
                    return ['TDATE_HOURS', 'SALE_AMT'].map(key => {
                        if(key === 'TDATE_HOURS') return this.formatHour(item[key])
                        return item[key]
                    })
                })
                // this.option1.series[1].data = res.data.map(item => {
                //     return ['TDATE_HOURS', 'AGO_AMT'].map(key => {
                //         if(key === 'TDATE_HOURS') return this.formatHour(item[key])
                //         return item[key]
                //     })
                // })
                // this.option2 = _.cloneDeep(this.model)
                this.option2.title.text = '时段累计图'
                this.option2.series[0].name = '支付累计业绩'
                // this.option2.series[1].name = '同期累计业绩'
                this.option2.series[0].data = res.data.map(item => {
                    return ['TDATE_HOURS', 'SALE_AMT_TOT'].map(key => {
                        if(key === 'TDATE_HOURS') return this.formatHour(item[key])
                        return item[key]
                    })
                })
                // this.option2.series[1].data = res.data.map(item => {
                //     return ['TDATE_HOURS', 'AGO_AMT_TOT'].map(key => {
                //         if(key === 'TDATE_HOURS') return this.formatHour(item[key])
                //         return item[key]
                //     })
                // })
            } else {
                // this.option1 = _.cloneDeep(this.model)
                // this.option2 = _.cloneDeep(this.model)
                this.option2.title.text = '时段累计图'
                this.option2.series[0].name = '支付累计业绩'
                // this.option2.series[1].name = '同期累计业绩'
                this.option1.series[0].data = []
                // this.option1.series[1].data = []
                this.option2.series[0].data = []
                // this.option2.series[1].data = []
                for(let i = 0; i < 24; i++) {
                    this.option1.series[0].data.push([i + '', 0])
                    // this.option1.series[1].data.push([i + '', 0])
                    this.option2.series[0].data.push([i + '', 0])
                    // this.option2.series[1].data.push([i + '', 0])
                }
            }
            this.initLine('line3', this.option1)
            this.initLine('line4', this.option2)
        },
        async getCompare(record) {
            let map = ['全司视角', '全中视角', '品市视角']
            let params = {
                CHANNEL_VIEW: map[this.currentView - 1]
                // TDATE: moment(this.date).format('YYYYMMDD')
            }
            if(this.currentBtn === 0) params.TDATE = moment().format('YYYYMMDD')
            else params.TDATE = moment(this.date).format('YYYYMMDD')
            let arrName = [['SHOP_GROUP', 'SHOP_NAME'], ['BOSS', 'GROUP_NAME'], ['S_OR_N', 'AREA_NAME', 'SUB_AREA_NAME', 'SHOP_NAME']]
            let arrName1 = []
            if (this.col1 <= 2) {
                arrName1 = arrName[0].concat()
                arrName1.splice(this.col1)
            } else if (this.col1 > 2 && this.col1 < 5) {
                arrName1 = arrName[1].concat()
                arrName1.splice(this.col1 - 2)
            } else if (this.col1 >= 5) {
                arrName1 = arrName[2].concat()
                arrName1.splice(this.col1 - 4)
            }
            arrName1.forEach(_ => {
                if (record[_]) {
                    params[_] = record[_]
                }
            })
            let api = [
                'real_time_chnl_qs',
                'real_time_boss_qs',
                'real_time_group_qs',
                'real_time_off_area_qs',
                'real_time_off_big_area_qs',
                'real_time_off_sub_area_qs',
                'real_time_off_shop_qs'
            ]
            let thisApi = api[this.col1 > 1 ? this.col1 - 2 : 0]
            if (thisApi === 'real_time_chnl_qs') {
                if (params['SHOP_GROUP'] === '汇总') {
                    delete params['SHOP_GROUP']
                }
            }

            if (thisApi === 'real_time_boss_qs' || thisApi === 'real_time_group_qs') {
                if (params['BOSS'] === '汇总') {
                    delete params['BOSS']
                }
            }
            let res = await this.$fetchSql('real_time', thisApi, params)
            console.log(JSON.parse(JSON.stringify(res.data)))
            // 汇总
            res.data = await this.handlerArr(res.data)
            console.log(JSON.parse(JSON.stringify(res.data)))
            if (res.data.length) {
                this.option1.series[1].name = '对比业绩'
                this.option1.series[1].data = res.data.map(item => {
                    return ['TDATE_HOURS', 'SALE_AMT'].map(key => {
                        if(key === 'TDATE_HOURS') return this.formatHour(item[key])
                        return item[key]
                    })
                })
                this.option2.series[1].name = '对比累计业绩'
                this.option2.series[1].data = res.data.map(item => {
                    return ['TDATE_HOURS', 'SALE_AMT_TOT'].map(key => {
                        if(key === 'TDATE_HOURS') return this.formatHour(item[key])
                        return item[key]
                    })
                })
            } else {
                this.option1.series[1].name = '对比业绩'
                this.option2.series[1].name = '对比累计业绩'
                this.option1.series[1].data = []
                this.option2.series[1].data = []
                for(let i = 0; i < 24; i++) {
                    this.option1.series[1].data.push([i + '', 0])
                    this.option2.series[1].data.push([i + '', 0])
                }
            }
            this.initLine('line3', this.option1)
            this.initLine('line4', this.option2)
        },
        // 因为返回的趋势图 会有多个店铺 有相同的时间 所以把相同时间的数据合一下
        handlerArr(arr) {
            let keysMap = ['S_OR_N', 'AREA_NAME', 'SUB_AREA_NAME', 'SHOP_NAME']
            if(this.col1 <= 2) arr = arr.filter(_ => _.SHOP_NAME !== '汇总')
            else if(this.col1 >= 5) arr = arr.filter(_ => _[keysMap[this.col1 - 5]] !== '汇总')
            const groupByHours = groupBy(arr, 'TDATE_HOURS')
            console.log(groupByHours, arr.length)
            return Object.keys(groupByHours).sort((a, b) => {
                return a - b
            }).map((hour) => {
                // const data = groupByHours[hour].filter(item => item['SHOP_NAME'] !== '汇总')
                const data = groupByHours[hour]
                return data.reduce((acc, cur) => {
                    return {
                        'SALE_AMT': acc['SALE_AMT'] + cur['SALE_AMT'],
                        'AGO_AMT': acc['AGO_AMT'] + cur['AGO_AMT'],
                        'SALE_AMT_TOT': acc['SALE_AMT_TOT'] + cur['SALE_AMT_TOT'],
                        'AGO_AMT_TOT': acc['AGO_AMT_TOT'] + cur['AGO_AMT_TOT'],
                        'TDATE_HOURS': hour,
                    }
                },
                {
                    'SALE_AMT': 0, 'AGO_AMT': 0, 'SALE_AMT_TOT': 0, 'AGO_AMT_TOT': 0, 'TDATE_HOURS': hour,
                })
            })
            // let obj = {}
            // arr.forEach(item => {
            //     if(!Object.prototype.hasOwnProperty.call(obj, item.TDATE_HOURS)){
            //         obj[item.TDATE_HOURS] = item
            //     }else{
            //         let keys = ['SALE_AMT', 'AGO_AMT', 'SALE_AMT_TOT', 'AGO_AMT_TOT']
            //         keys.forEach(key => {
            //             obj[item.TDATE_HOURS][key] += item[key]
            //         })
            //     }
            // })
            // let newArr = []
            // for(let key in obj) {
            //     newArr.push(obj[key])
            // }
            // newArr.sort((a, b) => {
            //     return a.TDATE_HOURS - b.TDATE_HOURS
            // })
            // console.log(newArr)
            // return []
        },
        handlerValue(val, percent = false) {
            if([null, undefined, '——'].includes(val)) return '——'
            if (!percent) {
                return numeral(val).format('0,0')
            } else {
                return (val * 100).toFixed(1) + '%'
            }
        },
        tableDataChange(val) {
            // let sum,data
            // let pageSize = this.table.pagination.pageSize
            // let obj = {
            //     1: 'SHOP_GROUP',
            //     2: 'BOSS',
            //     5: 'S_OR_N',
            //     6: 'AREA_NAME',
            //     7: 'SUB_AREA_NAME',
            //     8: 'SHOP_NAME',
            // }
            // if(this.currentTab === 1 || this.currentTab === 2) {
            //     sum = val.filter(_ => _[obj[this.currentTab]] === '汇总')[0]
            //     data = val.filter(_ => _[obj[this.currentTab]] !== '汇总').concat()
            // }else if(this.currentTab === 3) {
            //     sum = val.filter(_ => _[obj[this.col1]] === '汇总')[0]
            //     data = val.filter(_ => _[obj[this.col1]] !== '汇总').concat()
            // }
            // console.log(val)
            //     data.sort((a, b) => b.SALE_AMT - a.SALE_AMT)
            // let num = Math.ceil(data.length / (pageSize - 1))
            // this.table.data = []
            // for(let i = 0; i < num; i++) {
            //     let arr = []
            //     arr.push(sum)
            //     arr = arr.concat(data.slice(pageSize * i, pageSize * (i + 1) - 1))
            //     this.table.data = this.table.data.concat(arr)
            // }
            this.temporaryStorage = val.data.concat()
            this.table.data = val.sortData.concat()

        },
        rowClass(record, index) {
            return index % 2 != 0 ? 'rowClass' : ''
        },
        initLine(id, option) {
            // 判断是否初始化 如果初始化了就不要重复初始化
            if(document.getElementById(id) === null) return
            if(this[id] === null) {
                this[id] = echarts.init(document.getElementById(id))
            }
            let myChart = this[id]
            myChart.setOption(option)
            window.addEventListener('resize', function () {
                setTimeout(() => {
                    myChart.resize()
                }, 200)
            })
        },
    }
}
</script>

<style lang='scss' scoped>
/deep/ .ant-pagination-item {
    border: none
}

/deep/ .rowClass {
    background: #FAFAFA;

    &:hover {
        td {
            background: rgba(135, 206, 250, 0.2) !important;
        }
    }
}

/deep/ .totalRow {
    font-weight: 800;
}

/deep/ .custom-checkbox-label {
    height: 30px;
    line-height: 26px;
}

/deep/ .custom-checkbox-label:before {
    margin-top: 6px;
}

/deep/ .custom-checkbox-label:after {
    top: 7px;
}

.tab1 {
    width: 100%;
    flex: 1;
    position: relative;

    /deep/ .bottom .table[data-v-f6507df8] .y-table .ant-table {
        //min-height: calc(100% - 200px)!important;
    }

    .top {
        display: flex;
        align-items: center;
        padding: 12px 0;

        div:nth-child(1) {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC, sans-serif;
            font-weight: 400;
            color: #000000;
            line-height: 22px;
        }
    }

    .bottom {
        height: calc(100% - 56px);
        flex: 1;
        display: flex;

        .table {
            /deep/ .ant-table-thead > tr > th, .ant-table-tbody > tr > td {
                padding: 4px !important;
            }

            /deep/ .y-table {
                height: calc(100%);

                tr {
                    &:hover {
                        td {
                            background: rgba(135, 206, 250, 0.2) !important;
                        }
                    }
                }

                & td {
                    height: 25px;
                    line-height: 25px;
                    padding: 2px !important;
                }

                .ant-table-pagination.ant-pagination {
                    margin: 0;
                }
            }

            /deep/ .y-table .ant-table {
                height: calc(100% - 56px);
                // min-height: 100%!important;
                //min-height: 520px!important;
            }

            /deep/ .y-table .ant-empty-normal {
                height: calc(100% - 56px);
                //min-height: 520px!important;
            }
        }

        //.rowClass{
        //    background: #D7F0E7;
        //}
        .chart {
            margin-left: 25px;
            width: 60%;
            //display: flex;
            //flex-direction: column;
            .time {
                height: 44px;
                background: #FAFAFA;
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0 16px;

                .left {
                    font-size: 14px;
                    font-family: PingFangSC-Medium, PingFang SC, sans-serif;
                    font-weight: 500;
                    color: #4D5053;
                    line-height: 20px;
                }

                .right {
                    width: auto;
                    display: flex;
                    align-items: center;
                }
            }

            .chart1 {
                height: calc(50% - 27px);
                //height: 290px;
            }
        }
    }

    .selectMenu {
        position: fixed;
        background: #fff;
        border-radius: 2px;
        border: 1px solid #ccc;

        .item {
            cursor: pointer;
            padding: 5px 20px;
            font-size: 12px;
            color: #666;
        }

        .item:hover {
            background: #f3f3f3;
        }
    }
}

.tableRow {
    cursor: pointer;
    text-decoration: underline;
}

.tableRow:hover {
    color: #00B08D
}
</style>