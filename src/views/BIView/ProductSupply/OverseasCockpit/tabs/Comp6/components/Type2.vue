<!--
 * @Author: 黄浩
 * @Date: 2022-01-07 17:12:34
 * @LastEditTime: 2022-02-16 14:52:32
 * @LastEditors: Please set LastEditors
 * @Descripttion: 
 * @FilePath: \lsmy-bi-lighthouse-front\src\views\BIView\ProductSupply\OverseasCockpit\tabs\Comp6\components\Type2.vue
-->
<template>
    <div class="Type2">
        <div class="header">
            <div class="left">
                <div class="r1">当月采购成本</div>
                <div class="r2" @contextmenu.prevent="openMenu($event)">{{computeNum(0, panel.v1)}}</div>
                <div class="r3">
                    <div class="item">
                        <div class="c1">上月采购成本</div>
                        <div class="c2" @contextmenu.prevent="openMenu($event)">{{handleNum(4, panel.v2) + (panel.v2 !== '--' ? '万': '')}}</div>
                    </div>
                    <div class="item">
                        <div class="c1">与上月差值</div>
                        <div class="c2" @contextmenu.prevent="openMenu($event)">{{handleNum(1, panel.v3)}}</div>
                    </div>
                    <div class="item">
                        <div class="c1">环比</div>
                        <div class="c2" @contextmenu.prevent="openMenu($event)" :style="[{color: computeColor(0, panel.v4)}]">{{handleNum(2, panel.v4)}}</div>
                    </div>
                </div>
            </div>
            <CopyBoard ref="CopyBoard"/>
            <Border style="padding: 40px 0"/>
            <div class="right">
                <div>采购环比趋势</div>
                <div style="margin-top: 20px;color: rgb(136, 142, 153)">备注：当月采购成本=上月发货量*当月平均采购价；上月采购成本=上月发货量*上月平均采购价。</div>
                <Table class="table" v-bind="table" style="margin-top: 20px"/>
            </div>
        </div>
        <div class="bottom">
            <virtual-select style="width: 200px;position: absolute;right: -20px;top: 10px;z-index: 2"
                v-model="people"
                :options="peopleArr.map((_) => ({ label: _ }))"
                label="人员"
            ></virtual-select>
            <div style="margin: 10px;line-height: 32px">人员采购月情况</div>
            <y-table
            style="flex: 1"
            class="text-black"
            @change="handleChange"
            :options="{ ...table2, columns: tableColumns, rowClassName: (record,index) => {return index === 0 ? 'bold grey': index % 2 !== 0 ? '' : 'grey'}}"
            rowKey="STAFF_NAME"
            :loading="table.loading"
            ></y-table>
        </div>
    </div>
</template>

<script>
import Border from '../../../components/Border'
import Table from '../../../components/Table'
import YTable from '@/views/BIView/components/YTable/YTable2'
import VirtualSelect from '@/views/BIView/components/VSelect/VSelectV3'
import base from '../../../utils/base.js'
import moment from 'moment'
import CopyBoard from '../../../components/CopyBoard.vue'
export default {
    mixins: [ base ],
    props: {
        dateV2: {
            type: Object,
        },
    },
    components: {
        Border,
        Table,
        YTable,
        VirtualSelect,
        CopyBoard,
    },
    watch: {
        'dateV2.day2': {
            handler() {
                this.getCurrent()
            }
        },
        month: {
            handler() {
                this.getData()
                this.getPeople()
                this.getPeopleArr()
            }
        },
        'table2.pagination.page': {
            handler() {
                this?.handlePage(this.table2, this.table2Data)
            }
        },
        people: {
            handler() {
                this.getPeople()
            }
        }
    },
    computed: { 
        month() {
            return this.dateV2.month1 + this.dateV2.month2
        }
    },
    created() {
        this.getCurrent()
        this.getData()
        this.getPeople()
        this.getPeopleArr()
    },
    data() {
        return {
            table: {
                type: 2,
                index: 5,
                labelData: ['类型', '当月', '上月', '差值'],
                tableData: []
            },
            people: [],
            peopleArr: [],
            table2: {
                loading: false,
                pagination: {
                    total: 0,
                    page: 1,
                    pageSize: 5
                },
                data: [],
                needPaging: true
            },
            panel: {
                v1: '--',
                v2: '--',
                v3: '--',
                v4: '--',
            },
            // tableColumns() {
            //     return [
            //         { title: '人员', dataIndex: 'STAFF_NAME', width: 100, ellipsis: true, sorter: false,
            //             customRender: (text) => {
            //                 return <div oncontextmenu={(e) => {this.openMenu(e,text)}} title={text}>{text}</div>
            //             }
            //         },
            //         // { title: '合计', dataIndex: 'SUM', width: 100, ellipsis: true, sorter: false,
            //         //     customRender: (text) => {
            //         //         return <div oncontextmenu={(e) => {this.openMenu(e,text)}} title={text}>{text}</div>
            //         //     }
            //         // }
            //     ]
            // },
            tableColumns: [
                { title: '人员', dataIndex: 'STAFF_NAME', width: 100, ellipsis: true, sorter: false,
                    customRender: (text) => {
                        return <div title={text}>{text}</div>
                    }
                },
            ],
            table2Data: []
        }
    },
    methods: {
        openMenu(e) {
            this.$refs.CopyBoard.openMenu(e, e.target.innerText)
        },
        computeNum(p, value) {
            if(p === 0) {
                if(value === 0 || value === null || value === '--') return '--'
                return this.handleNum(4, this.panel.v1) + '万'
            }
        },
        computeColor(p, value) {
            if(p === 0) {
                if(value === 0 || value === null || value === '--') return
                if(value > 0) return 'red'
                else if(value < 0) return 'green'
            }  
        },
        async getCurrent() {
            let query = {
                START_TIME: this.dateV2.day2 + '01',
                END_TIME: this.dateV2.day2 + '01',
            }
            let res =  await this.$fetchSql('oversea_cockpit', 'oversea_purchase_cost', query)
            let {data} = {...res}
            console.log(data);
            if(!data.length) {
                this.panel.v1 = '--'
                this.panel.v2 = '--'
                this.panel.v3 = '--'
                this.panel.v4 = '--'
                return
            }
            this.panel.v1 = data[0].PUR_AMT
            this.panel.v2 = data[0].LAST_PUR_AMT
            this.panel.v3 = data[0].DIFF
            this.panel.v4 = data[0].RATE
        },
        handleChange() {

        },
        async getData() {
            let query = {
                START_TIME: this.dateV2.month1 + '01',
                END_TIME: this.dateV2.month2 + '01',
            }
            let res =  await this.$fetchSql('oversea_cockpit', 'oversea_purchase_cost', query)
            res.data.sort((a, b) => moment(a.MDATE).toDate().getTime() - moment(b.MDATE).toDate().getTime())
            this.handleData(1, res.data)
            // this.handleData(3, res.data)
        },
        // 1采购table 2人员table
        handleData(type, source) {
            if(type === 1){
                if(!source.length) {
                    this.table.tableData = []
                    this.table.tableData.push(['--', '--', '--', '--', '--'])
                    return
                }
                this.table.labelData = ['类型', '当月', '上月', '差值']
                let keys = ['MDATE', 'PUR_AMT', 'LAST_PUR_AMT', 'DIFF']                
                let arr = source.concat()
                arr = arr.map(item => {
                    return [
                        item[keys[0]],
                        item[keys[1]],
                        item[keys[2]],
                        item[keys[3]],
                    ]
                })
                let sum = [
                    '合计',
                    0,
                    0,
                    0,
                ]
                arr.forEach(item => {
                    sum[1] += item[1]
                    sum[2] += item[2]
                })
                sum[3] = sum[1] - sum[2]
                arr.unshift(sum)
                this.table.tableData = arr.concat()
                console.log(arr);
            }else if(type === 2) {
                let compute = (val) => {
                    if(val === '--') return '--'
                    else return parseInt(val / 10000).toLocaleString() + '万'
                }
                // 清空数据
                this.tableColumns = this.tableColumns.slice(0,1)
                this.tableColumns.push({ title: '合计', dataIndex: 'SUM', width: 100, ellipsis: true, sorter: false,
                    customRender: (text) => {
                        return <div title={text}>{compute(text)}</div>
                    }
                })
                this.table2.data = []
                if(!source.length) return 
                // 设置tablecolumn
                let arr = source.concat()
                let month = Object.freeze(Array.from(new Set(arr.map(_ => moment(_.MDATE).format('YYYY-MM')))))
                month.forEach(item => {
                    let col = { title: item, dataIndex: item, width: 100, ellipsis: true, sorter: false,
                        customRender: (text) => {
                            return <div title={text}>{compute(text)}</div>
                        }
                    }
                    this.tableColumns.push(col)
                })
                let names = Object.freeze(Array.from(new Set(arr.map(_ => _.STAFF_NAME))))
                let newArr = []
                for(let i = 0; i < names.length; i++) newArr.push([])
                arr.forEach(item => {
                    let index = names.indexOf(item.STAFF_NAME)
                    if(index > -1) newArr[index].push(item)
                })
                console.log(newArr);
                // 补充月份 如果没有的月 就补充'--'
                newArr.forEach(people => {
                    let pm = Object.freeze(Array.from(new Set(people.map(_ => moment(_.MDATE).format('YYYY-MM')))))
                    month.forEach(m => {
                        if(pm.indexOf(m) <= -1) {
                            people.push({
                                MDATE: m,
                                PUR_AMT: '--'
                            })
                        }
                    })
                })
                newArr = newArr.map(item => {
                    // 算出每行的合计
                    let SUM = 0
                    item.forEach(item1 => {
                        if(item1.PUR_AMT !== '--') SUM += item1.PUR_AMT
                    })
                    let obj = {
                        STAFF_NAME: item[0]?.STAFF_NAME,
                        SUM
                    }
                    let kv = item.map(item1 => {
                        return [
                            [moment(item1.MDATE).format('YYYY-MM')],
                            item1.PUR_AMT
                        ]
                    })
                    kv.forEach(item1 => {
                        obj[item1[0]] = item1[1]
                    })
                    // console.log(obj);
                    return obj
                })
                // {
                //     STAFF_NAME: '合计'
                //     SUM: 1234,
                //     '2021-01': 134,
                // }
                // 算出首行合计 列合计
                let sum = {
                    STAFF_NAME: '合计',
                    SUM: 0
                }
                month.forEach(m => {
                    sum[m] = 0
                })
                for(let key in sum) {
                    if(key !== 'STAFF_NAME' && key !== 'SUM'){
                        newArr.forEach(item => {
                            if(item[key] !== '--') sum[key] += item[key]
                        })
                    }
                }
                for(let key in sum) {
                    if(key !== 'STAFF_NAME' && key !== 'SUM') {
                        if(sum[key] !== '--') sum.SUM += sum[key]
                    }
                }
                // console.log(sum);
                // 每页插入合计
                let pageSize = this.table2.pagination.pageSize
                let num = Math.ceil(newArr.length / (pageSize - 1))
                for(let i = 0; i < num; i++) {
                    newArr.splice(i * pageSize, 0, sum)                    
                }
                console.log(newArr);
                this.table2Data = newArr.concat()
                this.table2.pagination.total = newArr.length
                this.handlePage(this.table2, this.table2Data)
            }
        },
        async getPeople() {
            let query = {
                START_TIME: this.dateV2.month1 + '01',
                END_TIME: this.dateV2.month2 + '01',
            }
            if(this.people.length) query.STAFF_NAME = this.people.toString()
            let res =  await this.$fetchSql('oversea_cockpit', 'oversea_purchase_cost_stf', query)
            res.data.sort((a, b) => moment(a.MDATE).toDate().getTime() - moment(b.MDATE).toDate().getTime())
            this.handleData(2, res.data)
        },
        async getPeopleArr() {
            let query = {
                START_TIME: this.dateV2.month1 + '01',
                END_TIME: this.dateV2.month2 + '01',
            }
            let res =  await this.$fetchSql('oversea_cockpit', 'oversea_purchase_cost_stf', query)
            this.peopleArr = Object.freeze(Array.from(new Set(res.data.map(_ => _.STAFF_NAME))))
        }
        
    }
}
</script>

<style lang='scss' scoped>
@import '../../../assets/styles.scss';
.Type2{
    display: flex;
    flex-direction: column;
    .header{
        height: calc(100% - 346px);
        display: flex;
        border-bottom: 1px solid #f2f2f2;
        .left{
            .r1{

            }
            .r2{
                margin: 10px 0;
                line-height: 32px;
                font-size: 18px;
                font-weight: bold;
            }
            .r3{
                .item{
                    display: flex;
                    width: 200px;
                    .c1, .c2{
                        width: 50%;
                        font-size: 12px;
                        line-height: 32px;
                    }
                }
            }
        }
        .right{
            flex: 1;
            margin-left: 20px;
            display: flex;
            flex-direction: column;
            padding-bottom: 10px;
            .table /deep/ .row{
                line-height: 20px;
                height: 20px;
            }
        }
    }
    .bottom{
        position: relative;
        .text-black /deep/ .ant-empty-normal{
            margin: 21px 0;
        }
    }
}
</style>