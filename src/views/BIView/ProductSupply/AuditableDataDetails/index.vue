<!--
 * @Author: 黄浩
 * @Date: 2021-12-15 08:44:29
 * @LastEditTime: 2021-12-22 08:43:38
 * @LastEditors: Please set LastEditors
 * @Descripttion: 可货审数据明细
 * @FilePath: \lsmy-bi-lighthouse-front\src\views\BIView\ProductSupply\AuditableDataDetails\index.vue
-->
<template>
    <div>
        <y-loading :loading.sync="loading" @candelLoading="cancelExport"></y-loading>
        <top-toolbar @contextMenuClick="handleContextMenuClick" />
        <div style="background-color: #f5faff; height: 100vh; padding: 0 2%; overflow: auto">
            <div class="py10" style="margin: auto">
                <div style="font-size: 26px;margin-left: 20px;">可货审数据明细</div>
                <div style="line-height: 24px;margin-top: 10px;margin-left: 20px" class="sub-tip">备注：【1】实时报表；每25分钟更新一次；</div>
            </div>
            <div style="background-color: #fff; border-radius: 4px;border: 2px solid #dde7f7; min-height: calc(100vh - 100px)">
                <div class="flex flex-between mx20 py10" style="font-size: 14px;height: 53px">
                    <span>可货审数据明细</span>
                    <div class="flex">
                        <a-date-picker v-model="startTime"/>
                        <div class="px10">--</div>
                        <a-date-picker v-model="endTime"/>
                    </div>
                </div>
                <div class="mx20">
                    <div class="flex py10">
                        <virtual-select class="selectBox" style="width: 24%;"
                            v-model="query.max_channel"
                            label="渠道分类"
                            :options="max_channelArr.map((_) => ({ label: _ }))"
                        ></virtual-select>
                        <virtual-select class="selectBox" style="width: 24%;"
                            v-model="query.min_channel"
                            label="渠道细分"
                            :options="min_channelArr.map((_) => ({ label: _ }))"
                        ></virtual-select>
                    </div>
                    <div class="flex py10">
                        <virtual-select class="selectBox" style="width: 24%;"
                            v-model="query.big_group_name"
                            label="大分组"
                            :options="big_group_nameArr.map((_) => ({ label: _ }))"
                        ></virtual-select>
                        <virtual-select class="selectBox" style="width: 24%;"
                            v-model="query.group_name"
                            label="分组"
                            :options="group_nameArr.map((_) => ({ label: _ }))"
                        ></virtual-select>
                        <virtual-select class="selectBox" style="width: 24%;"
                            v-model="query.staff_name"
                            label="人员"
                            :options="staff_nameArr.map((_) => ({ label: _ }))"
                        ></virtual-select>
                    </div>
                    <div class="flex py10">
                        <virtual-select class="selectBox" style="width: 24%;"
                            v-model="query.s_or_n"
                            label="区域"
                            :options="s_or_nArr.map((_) => ({ label: _ }))"
                        ></virtual-select>
                        <virtual-select class="selectBox" style="width: 24%;"
                            v-model="query.area_name"
                            label="大区"
                            :options="area_nameArr.map((_) => ({ label: _ }))"
                        ></virtual-select>
                        <virtual-select class="selectBox" style="width: 24%;"
                            v-model="query.sub_area_name"
                            label="片区"
                            :options="sub_area_nameArr.map((_) => ({ label: _ }))"
                        ></virtual-select>
                    </div>
                    <div class="flex py10">
                        <virtual-select class="selectBox" style="width: 24%;"
                            v-model="query.if_can_audit"
                            label="商品是否可货审"
                            :options="if_can_auditArr.map((_) => ({ label: _ }))"
                        ></virtual-select>
                        <virtual-select class="selectBox" style="width: 24%;"
                            v-model="query.if_batch_dlvr"
                            label="批次单是否可货审"
                            :options="if_batch_dlvrArr.map((_) => ({ label: _ }))"
                        ></virtual-select>
                        <virtual-select class="selectBox" style="width: 24%;"
                            v-model="query.goods_tag"
                            label="期货标签"
                            :options="goods_tagArr.map((_) => ({ label: _ }))"
                        ></virtual-select>
                        <div style="flex: 1"></div>
                        <div
                            style="
                            display: inline-block;
                            line-height: 32px;
                            border-radius: 2px;
                            font-size: 12px;
                            border: 1px solid rgba(0, 0, 0, 0.15);
                            padding: 0 8px;
                            cursor: pointer;
                            "
                            @click="handleContextMenuClick('downloadExcel')"
                        >
                            导出Excel
                        </div>
                    </div>
                </div>
                <v-tabs :value.sync="currentTab" :tabs="TabArr" class="mx20 my10 tabs"/>
                <component ref="components" :is="tabMap[currentTab]" :query="query" :queryMap="queryMap" :startTime="startTime" :endTime="endTime" :alReady.sync="alReady"/>
            </div>
        </div>
    </div>
</template>

<script>
import YLoading from '@/views/BIView/components/YLoading/YLoading'
import TopToolbar from '@/views/BIView/components/TopToolbar/TopToolbar'
import VirtualSelect from '@/views/BIView/components/VSelect/VSelect'
import VTabs from '@/views/BIView/components/VTabs/VTabs'
import Tab1 from './components/tab1.vue'
import Tab2 from './components/tab2.vue'
import Tab3 from './components/tab3.vue'
import Tab4 from './components/tab4.vue'
import Tab5 from './components/tab5.vue'
import moment from 'moment'
import axios from 'axios'
import { downloadBlob } from '@/utils/helper'

export default {
    created() {
        this.getFilterData()
    },
    watch: {
        'query.max_channel': {
            handler(val) {
                if(this.loadNum > this.loadNumLimit){
                    this.handlerArr(val,'MAX_CHANNEL',[{'min_channelArr':'MIN_CHANNEL'}])
                }else this.loadNum++
            }
        },
        'query.big_group_name': {
            handler(val) {
                if(this.loadNum > this.loadNumLimit){
                    this.handlerArr(val,'BIG_GROUP_NAME',[
                        {'group_nameArr':'GROUP_NAME'},
                        {'staff_nameArr':'STAFF_NAME'},
                    ])
                }else this.loadNum++
            }
        },
        'query.group_name': {
            handler(val) {
                if(this.loadNum > this.loadNumLimit){
                    if(val.length){
                        this.handlerArr(val,'GROUP_NAME',[
                            {'staff_nameArr':'STAFF_NAME'},
                        ])
                    }else{
                        this.handlerArr(this.query.big_group_name,'BIG_GROUP_NAME',[
                            {'staff_nameArr':'STAFF_NAME'},
                        ])
                    }
                }else this.loadNum++
            }
        },
        'query.s_or_n': {
            handler(val) {
                if(this.loadNum > this.loadNumLimit){
                    this.handlerArr(val,'S_OR_N',[
                        {'area_nameArr':'AREA_NAME'},
                        {'sub_area_nameArr':'SUB_AREA_NAME'},
                    ])
                }else this.loadNum++
            }
        },
        'query.area_name': {
            handler(val) {
                if(this.loadNum > this.loadNumLimit){
                    if(val.length){
                        this.handlerArr(val,'AREA_NAME',[
                            {'sub_area_nameArr':'SUB_AREA_NAME'},
                        ])
                    }else{
                        this.handlerArr(this.query.s_or_n,'S_OR_N',[
                            {'sub_area_nameArr':'SUB_AREA_NAME'},
                        ])
                    }
                }else this.loadNum++
            }
        },
    },
    components: { YLoading, TopToolbar, VirtualSelect, VTabs, Tab1, Tab2, Tab3, Tab4, Tab5},
    data() {
        return {
            alReady: false,
            loadNum: 0,
            loadNumLimit: 9,
            loading: false,
            // 开始时间
            startTime: moment(moment(new Date()).format('YYYYMM') + '01'),
            // 结束时间
            endTime: moment(new Date()),
            query: {
                // 渠道分类
                max_channel: [],
                // 渠道细分
                min_channel: [],
                // 大分组
                big_group_name: [],
                // 分组
                group_name: [],
                // 人员
                staff_name: [],
                // 区域
                s_or_n: [],
                // 大区
                area_name: [],
                // 片区
                sub_area_name: [],
                // 商品是否可货审
                if_can_audit: [],
                // 批次单是否可货审
                if_batch_dlvr: [],
                // 期货标签
                goods_tag: [],
            },
            allOptions: [],
            // 渠道分类
            max_channelArr: [],
            // 渠道细分
            min_channelArr: [],
            // 大分组
            big_group_nameArr: [],
            // 分组
            group_nameArr: [],
            // 人员
            staff_nameArr: [],
            // 区域
            s_or_nArr: [],
            // 大区
            area_nameArr: [],
            // 片区
            sub_area_nameArr: [],
            // 商品是否可货审
            if_can_auditArr: [],
            // 批次单是否可货审
            if_batch_dlvrArr: [],
            // 期货标签
            goods_tagArr: [],
            queryMap: {
                // 渠道分类
                maxChannel: 'max_channel',
                // 渠道细分
                minChannel: 'min_channel',
                // 大分组
                bigGroupName: 'big_group_name',
                // 分组
                groupName: 'group_name',
                // 人员
                staffName: 'staff_name',
                // 区域
                s_or_n: 's_or_n',
                // 大区
                areaName: 'area_name',
                // 片区
                subAreaName: 'sub_area_name',
                // 商品是否可货审
                ifCanAudit: 'if_can_audit',
                // 批次单是否可货审
                ifBatchDlvr: 'if_batch_dlvr',
                // 期货标签
                goodsTag: 'goods_tag',
            },
            TabArr: ['汇总货审情况','小组/门店货审情况','人员货审情况','整单可货审明细','商品可货审明细'],
            currentTab: '汇总货审情况',
            tabMap: {
                '汇总货审情况': Tab1,
                '小组/门店货审情况': Tab2,
                '人员货审情况': Tab3,
                '整单可货审明细': Tab4,
                '商品可货审明细': Tab5,
            },
        }
    },
    methods: {
        // 处理筛选框  attr:属性名 与监听属性同名  arr: [{$key: $attr}] 传入数组 进行联动 改变子选项
        // handlerArr例子
        // let subArr = this.allOptions.filter(_ => {
        //     return val && val.length ? val.indexOf(_.MAX_CHANNEL) > -1 : true
        // })
        // this.min_channelArr = Object.freeze(Array.from(new Set(subArr.map(_ => _.MIN_CHANNEL))))
        handlerArr(val,attr,arr = []){
            let subArr = this.allOptions.filter(_ => {
                return val && val.length ? val.indexOf(_[attr]) > -1 : true
            })
            arr.forEach(item => {
                for(let key in item){
                    this[key] = Object.freeze(Array.from(new Set(subArr.map(_ => _[item[key]]))))
                }
            }) 
        },
        getFilterData() {
            this.$fetchSql('fs_good_audit', 'fs_good_audit_scr').then(({ data }) => {
                this.allOptions = Object.freeze(data)
                this.max_channelArr = Object.freeze(Array.from(new Set(this.allOptions.map((_) => _.MAX_CHANNEL))))
                let index = this.max_channelArr.indexOf('线上渠道')
                if(index > -1) {
                    let subArr = this.max_channelArr[index]
                    this.max_channelArr = this.max_channelArr.map((item,i) => {
                        return item
                    })
                    this.max_channelArr.splice(index,1)
                    this.max_channelArr.unshift(subArr)
                }
                this.min_channelArr = Object.freeze(Array.from(new Set(this.allOptions.map((_) => _.MIN_CHANNEL))))
                this.big_group_nameArr = Object.freeze(Array.from(new Set(this.allOptions.map((_) => _.BIG_GROUP_NAME))))
                this.group_nameArr = Object.freeze(Array.from(new Set(this.allOptions.map((_) => _.GROUP_NAME))))
                this.staff_nameArr = Object.freeze(Array.from(new Set(this.allOptions.map((_) => _.STAFF_NAME))))
                this.s_or_nArr = Object.freeze(Array.from(new Set(this.allOptions.map((_) => _.S_OR_N))))
                this.area_nameArr = Object.freeze(Array.from(new Set(this.allOptions.map((_) => _.AREA_NAME))))
                this.sub_area_nameArr = Object.freeze(Array.from(new Set(this.allOptions.map((_) => _.SUB_AREA_NAME))))
                this.if_can_auditArr = Object.freeze(Array.from(new Set(this.allOptions.map((_) => _.IF_CAN_AUDIT))))
                this.if_batch_dlvrArr = Object.freeze(Array.from(new Set(this.allOptions.map((_) => _.IF_BATCH_DLVR))))
                this.goods_tagArr = Object.freeze(Array.from(new Set(this.allOptions.map((_) => _.GOODS_TAG))))
            })
        },
        cancelExport() {
            this.cancelTokenSource.cancel()
        },
        handleContextMenuClick(type) {
            if (this.loading) {
                return
            }
            if (type === 'downloadExcel') {
                let tabMap = {
                    '汇总货审情况': 'fs_good_audit_data',
                    '小组/门店货审情况': 'fs_good_audit_staff',
                    '人员货审情况': 'fs_good_audit_staff',
                    '整单可货审明细': 'fs_good_audit_data',
                    '商品可货审明细': 'fs_good_audit_data',
                }
                let api = tabMap[this.currentTab]
                const params = {}
                for(let key in this.queryMap) {
                    if(this.query[this.queryMap[key]].length > 0) {
                        params[key] = this.query[this.queryMap[key]].toString()
                    }
                }
                if(this.startTime) {
                    params.startTime = moment(this.startTime).format('YYYYMMDD')
                }
                if(this.endTime) {
                    params.endTime = moment(this.endTime).format('YYYYMMDD')
                }
                let tableColumns = this.$refs.components.tableColumns
                this.loading = true
                this.cancelTokenSource = axios.CancelToken.source()
                this.$axios
                .post(
                    '/api/admin/data/exportExcel',
                    {
                        excelName: '可货审数据明细报表',
                        sheetConfigList: [
                            {
                            params,
                            prefix: 'fs_good_audit',
                            interfaceName: api,
                            sheetName: '精简报表',
                            columnConfigList: tableColumns.map((_) => ({
                                colWidth: Number((_.width / 10).toFixed(0)),
                                dbColName: _.dataIndex,
                                excelColName: _.title,
                            })),
                            },
                        ],
                    },
                    {
                        timeout: 60 * 1000 * 3,
                        responseType: 'blob',
                        cancelToken: this.cancelTokenSource.token,
                    }
                )
                .then(({ data, headers }) => {
                    const filename = headers['content-disposition'].match(/filename=(.*)/)[1]
                    downloadBlob(data, decodeURIComponent(filename))
                })
                .finally(() => {
                    this.loading = false
                })
            }
        }
    }
}
</script>

<style lang='scss' scoped>
@import '@/assets/styles/common.scss';
/deep/ .custom-checkbox-label{
    height: 30px;
    line-height: 26px;
}
/deep/ .custom-checkbox-label:before{
    margin-top: 7px;
}
/deep/ .custom-checkbox-label:after{
    top: 9px;
}
.selectBox{
    /deep/ div:nth-child(1) span{
        width: 100px;
    }
}
.tabs {
    /deep/ .active{
        color: $theme !important;
        &:before{
            background: $theme !important;
        }
    }
}
</style>