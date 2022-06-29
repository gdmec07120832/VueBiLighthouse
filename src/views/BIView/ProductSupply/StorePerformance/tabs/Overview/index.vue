<template>
    <div class="Overview">
        <div class="header">
            <div>店铺业绩概览</div>
            <DatepickerV3 class="DatepickerV3" v-bind.sync="dateV3"/>
        </div>
        <div class="tabs my10">
            <div class="mr20">渠道分类</div>
            <a-radio-group v-model="currentTab">
                <a-radio-button :value="item" v-for="(item,index) in TabArr" :key="index">
                    {{item}}
                </a-radio-button>
            </a-radio-group>
        </div>
        <div class="selects mb10" ref="selects">
            <template v-for="(item, index) in selects[currentTab].obj">
                <virtual-select :key="index" v-if="item.type === 'select' && item.key !== 'SHOP_NAME'" style="width: calc(100% - 20px)"
                                :style="[{'grid-column-start': index === 2 ? 1 : '','grid-column-end': index === 2 ? 2 : ''}]"
                                v-model="selects[currentTab][item.key]"
                                :options="options[currentTab][item.key].map((_) => ({ label: _ }))"
                                :label="item.label"
                ></virtual-select>
                <div class="radio" :key="index" v-if="item.type === 'radio'" style="margin-right: 20px">
                    <span style="padding-right: 20px" class="text-black">{{item.label}}</span>
                    <a-radio-group v-model="selects.海外渠道.CHNL_TYPE" name="radioGroup" :default-value="options.海外渠道.CHNL_TYPE.length ? options.海外渠道.CHNL_TYPE[0] : null">
                        <a-radio :value="label" v-for="(label, i) in options[currentTab][item.key]" :key="i">
                            {{label}}
                        </a-radio>
                    </a-radio-group>
                </div>
            </template>
        </div>
        <virtual-select class="shopNameSelect mb15" style="width: 300px;"
                        v-model="selects[currentTab].SHOP_NAME"
                        :options="options[currentTab].SHOP_NAME.map((_) => ({ label: _ }))"
                        label="店铺"
        ></virtual-select>
        <div class="panels mb10">
            <Panel @click.native="curPanel = 1" :panelData="panelData" :label="'支付金额'" :class="[{active: curPanel === 1 ? true : false}]"/>
            <Panel @click.native="curPanel = 2" :panelData="panelData" :label="'发货金额'" :class="[{active: curPanel === 2 ? true : false}]"/>
            <Panel @click.native="curPanel = 3" :panelData="panelData" :label="'付返前发货金额'" :class="[{active: curPanel === 3 ? true : false}]"/>
        </div>
        <Day v-if="dateV3.dayOrMonth === 1" v-bind="propObj" :style="[{height: `calc(100% - ${271 + selectsHeight}px)`}]"/>
        <Month v-if="dateV3.dayOrMonth === 2" v-bind="propObj" :style="[{height: `calc(100% - ${271 + selectsHeight}px)`}]"/>
    </div>
</template>

<script>
import DatepickerV3 from "../../components/DatepickerV3"
import VirtualSelect from '@/views/BIView/components/VSelect/VSelectV3'
import moment from "moment";
import Panel from '../../components/Panel'
import Day from './components/Day'
import Month from './components/Month'
export default {
    name: "Overview",
    components: {
        DatepickerV3,
        VirtualSelect,
        Panel,
        Day,
        Month,
    },
    created() {
        this.getOption()
        this.getOverview()
    },
    mounted() {
        this.selectsHeight = this?.$refs?.selects?.offsetHeight * 1
        this.$emit('updatePropObj', this.propObj)
    },
    watch: {
        currentTab: {
            handler() {
                let that = this
                this.$nextTick(() => {
                    that.selectsHeight = that?.$refs?.selects?.offsetHeight * 1
                })
            }
        },
        'selects.线上渠道.SHOP_GROUP': {
            handler(val) {
                let option = this.allOptions.filter(_ => _.CHNL_NAME === '线上渠道')
                if(val.length) {
                    this.options.线上渠道.SHOP_NAME = Object.freeze(Array.from(new Set(option.filter(_ => val.indexOf(_.SHOP_GROUP) > -1).map(_ => _.SHOP_NAME))))
                }else {
                    this.options.线上渠道.SHOP_NAME = Object.freeze(Array.from(new Set(option.map(_ => _.SHOP_NAME))))
                }
            }
        },
        offlineSelects: {
            handler() {
                let option = this.allOptions.filter(_ => _.CHNL_NAME === '线下渠道')
                let relationshipArr = ['STORE_TYPE', 'PRODUCT_CATE', 'AREA_NAME', 'SUB_AREA_NAME', 'S_OR_N']
                relationshipArr.forEach((key, index) => {
                    if(index !== 0) {
                        let pKey = relationshipArr[index - 1]
                        let p = this.selects.线下渠道[pKey]
                        if(p.length) {
                            option = option.filter(_ => p.indexOf(_[pKey]) > -1)
                        }
                        this.options.线下渠道[key] = Object.freeze(Array.from(new Set(option.map(_ => _[key]))))
                    }
                })
                this.options.线下渠道.SHOP_NAME = Object.freeze(Array.from(new Set(option.map(_ => _.SHOP_NAME))))
            }
        },
        'selects.海外渠道.CHNL_TYPE': {
            handler(val) {
                console.log(val)
                let option = this.allOptions.filter(_ => _.CHNL_NAME === '海外渠道')
                option = option.filter(_ => _.CHNL_TYPE === val)
                this.options.海外渠道.SHOP_NAME = Object.freeze(Array.from(new Set(option.map(_ => _.SHOP_NAME))))

            }
        },
        allCondition: {
            handler(val) {
                console.log(val)
                this.getOverview()
            }
        },
        propObjString: {
            handler(val) {
                this.$emit('updatePropObj', this.propObj)
            }
        }
    },
    computed: {
        propObj() {
            return {
                dateV3: this.dateV3,
                currentTab: this.currentTab,
                selects: this.selects,
                curPanel: this.curPanel,
                allCondition: this.allCondition
            }
        },
        propObjString() {
            return JSON.stringify(this.propObj)
        },
        //所有条件 月份加渠道加选项
        allCondition(val) {
            console.log(val)
            let select = ''
            for(let key in this.selects[this.currentTab]) {
                select += JSON.stringify(this.selects[this.currentTab][key]) + '-'
            }
            return JSON.stringify(this.dateV3) + '-' + this.currentTab + '-' + select
        },
        offlineSelects() {
            let str = ''
            for(let key in this.selects.线下渠道) {
                str += JSON.stringify(this.selects.线下渠道[key]) + '-'
            }
            return str
        }
    },
    data() {
        return {
            dateV3: {
                options: ['日', '月'],
                dayOrMonth: 1,
                day2: moment(new Date()).format('YYYYMM'),
                monthType: 3,
                month2: moment(new Date()).format('YYYY'),
            },
            TabArr: ['线上渠道','线下渠道','海外渠道'],
            currentTab: '线上渠道',
            selects: {
                线上渠道: {
                    obj: [
                        {key: 'SHOP_GROUP',type: 'select', label: '平台'},
                        {key: 'SHOP_NAME',type: 'select', label: '店铺'},
                    ],
                    SHOP_GROUP: [],
                    SHOP_NAME: [],
                },
                线下渠道: {
                    obj: [
                        {key: 'STORE_TYPE',type: 'select', label: '店态'},
                        {key: 'PRODUCT_CATE',type: 'select', label: '主营类目'},
                        {key: 'AREA_NAME',type: 'select', label: '大区'},
                        {key: 'SUB_AREA_NAME',type: 'select', label: '片区'},
                        {key: 'S_OR_N',type: 'select', label: '区域'},
                        {key: 'SHOP_NAME',type: 'select', label: '店铺'},
                    ],
                    STORE_TYPE: [],
                    AREA_NAME: [],
                    PRODUCT_CATE: [],
                    SUB_AREA_NAME: [],
                    S_OR_N: [],
                    SHOP_NAME: [],
                },
                海外渠道: {
                    obj: [
                        {key: 'CHNL_TYPE',type: 'radio', label: '选择'},
                        {key: 'SHOP_NAME',type: 'select', label: '店铺'},
                    ],
                    CHNL_TYPE: null,
                    SHOP_NAME: [],
                }
            },
            options: {
                线上渠道: {
                    SHOP_GROUP: [],
                    SHOP_NAME: [],
                },
                线下渠道: {
                    STORE_TYPE: [],
                    AREA_NAME: [],
                    PRODUCT_CATE: [],
                    SUB_AREA_NAME: [],
                    S_OR_N: [],
                    SHOP_NAME: [],
                },
                海外渠道: {
                    CHNL_TYPE: [],
                    SHOP_NAME: [],
                },
            },
            selectsHeight: null,
            panelData: [
                {label: '保留月累计', value: null},
                {label: '保留日累计', value: null},
                {label: '同比', value: null},
                {label: '环比', value: null},
                {label: '目标', value: null},
            ],
            // 1是支付 2是发货 3是付返前发货
            curPanel: 1,
            allOptions: [],
            overviewData: [],
        }
    },
    methods: {
        async getOption() {
            let res =  await this.$fetchSql('shop_perf', 'shop_perf_scr')
            this.allOptions = res.data.concat()
            for(let tab in this.options) {
                for(let key in this.options[tab]) {
                    this.options[tab][key] = Object.freeze(Array.from(new Set(res.data.filter(_ => _.CHNL_NAME === tab).map(_ => _[key]))))
                }
            }
            this.options.海外渠道.CHNL_TYPE.length ? this.selects.海外渠道.CHNL_TYPE = this.options.海外渠道.CHNL_TYPE[0] : null
        },
        async getOverview() {
            let dayOrMonth = this.dateV3.dayOrMonth
            let query = dayOrMonth === 1 ?
            {
                MDATE: this.dateV3.day2,
                CHNL_NAME: this.currentTab
            }
            :
            {
                START_TIME: this.dateV3.month2 + '01',
                END_TIME: this.dateV3.month2 + '12',
                CHNL_NAME: this.currentTab
            }
            let api = dayOrMonth === 1 ? 'shop_perf_day_sum' : 'shop_perf_month_sum'
            for(let key in this.selects[this.currentTab]) {
                if(key !== 'obj') {
                    let select = this.selects[this.currentTab][key]
                    if(Object.prototype.toString.call(select) === '[object Array]' && select.length) {
                        query[key] = select.toString()
                    }else if(Object.prototype.toString.call(select) === '[object String]' && select) {
                        query[key] = select.toString()
                    }
                }
            }
            let res = await this.$fetchSql('shop_perf', api, query)
            this.overviewData = res.data.concat()
            //保留月累计 保留日累计 同比 环比 目标
            let keys = [
                //支付
                ['MTD_PAY_RATE', 'PTD_PAY_RATE', 'AGO_PAY_RATE', '', dayOrMonth ? 'PTD_TOT_PAY_TGT' : 'MTD_PAY_TGT'],
                //发货
                ['MTD_DLVR_RATE', 'PTD_DLVR_RATE', 'AGO_DLVR_RATE', '', dayOrMonth ? 'PTD_TOT_DLVR_TGT' : 'MTD_DLVR_TGT'],
                //付返前发货
                ['MTD_BEF_DLVR_RATE', 'PTD_BEF_DLVR_RATE', 'AGO_BEF_DLVR_RATE', '', dayOrMonth ? 'PTD_TOT_DLVR_TGT' : 'MTD_DLVR_TGT'],
            ]
            this.panelData.forEach((item, index) => {
                item.value = res.data.length ? res.data[0][keys[this.curPanel - 1][index]] : null
            })

        },
    }
}
</script>

<style lang="scss" scoped>
.Overview{
    background: #fff;
    width: 100%;
    height: 800px;
    padding: 10px 20px;
    .header{
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 10px;
        //border-bottom: 1px solid #f0f0f0;
        .DatepickerV3{
            /deep/ > div:nth-child(1) {
                width: 60px!important;
            }
        }
    }
    .header::after{
        content: '';
        display: block;
        width: calc(100% + 40px);
        height: 1px;
        background: #f0f0f0;
        position: absolute;
        bottom: 1px;
        left: -20px;
    }
    .tabs{
        display: flex;
        align-items: center;
        /deep/ .ant-radio-button-wrapper-checked{
            color: #fff;
            background: #46BCA0
        }
    }
    .selects{
        width: 960px;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        //grid-template-rows: repeat(3, 1fr);
        .radio >span:nth-child(1)::before{
            display: inline-block;
            height: 100%;
            content: '';
            vertical-align: middle;
        }
    }
    .shopNameSelect{
        /deep/ > div:nth-child(1) > span:nth-child(1) {
            font-size: 21px!important;
            font-weight: bold;
        }
        /deep/ > span:nth-child(2) > div:nth-child(1) {
            border: 1px solid #e4e4e4;
            border-radius: 4px;
        }
    }
    .panels{
        display: grid;
        grid-template-columns: repeat(3, 300px);
        grid-template-rows: repeat(1, 110px);
        gap: 20px;
    }
    @keyframes bounce
    {
        0%   {transform: translateY(-5px);}
        50%  {transform: translateY(0px);}
        100% {transform: translateY(-5px);}
    }
    .active{
        box-shadow: rgba(0, 0, 0, 0.2) 0px 3px 6px 2px, rgba(0, 0, 0, 0.12) 0px 3px 4px 2px;
        transform: translateY(-5px);
        animation: bounce 0.4s;
    }
}
</style>