<template>
    <div class="T13_BStoreMarketShare">
        <div class="header">
            <Title class="title" style="z-index: 2" :label="'天猫竞店'"/>
            <div style="flex: 1"></div>
            <Radio v-bind.sync="monthOrYear"/>
            <a-range-picker v-model="month" :allowClear="false"
            style="width: 250px"
            v-if="monthOrYear.value === '当月'"
            :disabled-date="disabledDate"
            @calendarChange="calendarChange"
            @openChange="openChange"
            />
            <Select class="ml10" style="min-width: 200px" v-if="monthOrYear.value === '月度'" v-bind.sync="selectYear"/>
        </div>
        <Month v-if="monthOrYear.value === '当月'" :month="month"/>
        <Year v-if="monthOrYear.value === '月度'" :storeValue="store.value" :store.sync="store" :selectYearValue="selectYear.value">
            <virtual-select
            class="ml10"
            v-if="monthOrYear.value === '月度'"
            style="width: 250px;margin-right: 0"
            v-model="store.value"
            :label="store.label"
            :options="store.options.map((_) => ({ label: _ }))"
            :allowShowClear="false"
            ></virtual-select>
        </Year>
    </div>
</template>

<script>
import moment from "moment";
import Title from '../../components/Title'
import Radio from '../../components/Radio'
import VirtualSelect from '@/views/BIView/components/VSelect/VSelectV3'
import Month from './Month'
import Select from '../../components/Select'
import Year from './Year'
import _ from 'lodash'
export default {
    components: {
        Title,
        Radio,
        Month,
        Select,
        Year,
        VirtualSelect,
    },
    created() {
        this.getOption()
    },
    watch: {
        // 'store.value': {
        //     handler(val, oval){
        //         let diff = []
        //         if(val.length > oval.length) {
        //             diff = val.filter(_ => !oval.includes(_))
        //         }
        //         else if(oval.length > val.length) {
        //             diff = oval.filter(_ => !val.includes(_))
        //         }
        //         if(diff.includes('林氏木业家具旗舰店') && val.length > oval.length){
        //             if(oval.length > 0){
        //                 this.store.value = ['林氏木业家具旗舰店']
        //             }
        //         }
        //         else if(!diff.includes('林氏木业家具旗舰店') && val.length > oval.length){
        //             this.store.value = this.store.value.filter(_ => _ !== '林氏木业家具旗舰店')
        //         }
        //         if(val.length === 0){
        //             this.store.value = ['林氏木业家具旗舰店']
        //         }
        //         if(val.length > 4 && !val.includes('林氏木业家具旗舰店')){
        //             this.store.value = [].concat(oval)
        //             return
        //         }
        //         else if(val.length === 5 && val.includes('林氏木业家具旗舰店')){
        //             this.store.value = ['林氏木业家具旗舰店']
        //             return
        //         }
        //     }
        // },
        'selectYear.value': {
            handler(){
                this.handleOptions(this.allOptions)
            }
        }
    },
    data() {
        return {
            monthOrYear: {
                value: '当月',
                options: ['当月', '月度']
            },
            month: [
                moment().format('DD') === '01' ? moment().subtract(1, 'M').startOf('month') : moment().startOf('month'),
                moment().format('DD') === '01' ? moment().subtract(1, 'M').endOf('month') : moment().endOf('month')
            ],
            selectYear: {
                label: '统计年份',
                value: moment().format('YYYY年'),
                options: []
            },
            hoverDate: null,
            store: {
                label: '店铺选择',
                // value: ['林氏木业家具旗舰店', '源氏木语家居旗舰店', '全友家居官方旗舰店', '顾家家居官方旗舰店', '芝华仕官方旗舰店'],
                value: ['林氏木业家具旗舰店', '源氏木语家居旗舰店', '全友家居官方旗舰店',],
                options: ['林氏木业家具旗舰店', '源氏木语家居旗舰店', '全友家居官方旗舰店', '顾家家居官方旗舰店', '芝华仕官方旗舰店']
            },
            allOptions: [],
        }
    },
    methods: {
        disabledDate(current) {
            if (current.format('HH:ss:mm').indexOf('59') <= -1) {
                return current &&
                    (this.hoverDate && (current - moment(this.hoverDate).subtract(31, 'days') < 0 || current - moment(this.hoverDate).add(31, 'days') > 0) ||
                        current - moment().endOf('month') > 0)
            } else {
                return current &&
                    (this.hoverDate && (current - moment(this.hoverDate).subtract(31, 'days') < 0 || current - moment(this.hoverDate).add(31, 'days') > 0) ||
                        current - moment().endOf('month').add(1, 'day') > 0)
            }
        },
        calendarChange(val, str, datestr) {
            this.hoverDate = moment(val[0]).format('YYYYMMDD')
        },
        openChange(status) {
            if (!status) this.hoverDate = null
        },
        async getOption(){
            let res = await this.$fetchSql('all_center', 'all_center_b_shop_m')
            let arr = res.data.map(_ => moment(_.MDATE_WID).format('YYYY年'))
            arr.sort((a, b) => b.split('年')[0] - a.split('年')[0])
            this.selectYear.options = Array.from(new Set(arr))
            this.allOptions = res.data.concat()
            this.handleOptions(res.data)
        },
        handleOptions(source){
            this.store.options = ['林氏木业家具旗舰店', '源氏木语家居旗舰店', '全友家居官方旗舰店', '顾家家居官方旗舰店', '芝华仕官方旗舰店']
            if(!source.length) return
            let arr = source.filter(_ => _.FULL_STORE_NAME !== '林氏木业家具旗舰店（纯线上）')
            let obj = _.groupBy(arr.filter(_ => moment(_.MDATE_WID).format('YYYY年') === this.selectYear.value),_ => _.FULL_STORE_NAME)
            let objToArr = []
            for(let key in obj){
                if(!obj[key]) continue
                objToArr.push(obj[key])
            }
            objToArr = objToArr.map(item => {
                let initial = {
                    FULL_STORE_NAME: item[0].FULL_STORE_NAME,
                    PAY_AMOUNT: 0,
                }
                return item.reduce((a, b) => {
                    return {
                        FULL_STORE_NAME: a.FULL_STORE_NAME,
                        PAY_AMOUNT: a.PAY_AMOUNT + b.PAY_AMOUNT
                    }
                }, initial)
            })
            objToArr.sort((a, b) => b.PAY_AMOUNT - a.PAY_AMOUNT)
            this.store.options = Array.from(new Set(objToArr.map(_ => _.FULL_STORE_NAME)))
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../../assets/styles';
.T13_BStoreMarketShare{
    .header {
        height: 38px;
        padding-bottom: 10px;
        border-bottom: 1px solid #F0F0F0;
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }
}
</style>