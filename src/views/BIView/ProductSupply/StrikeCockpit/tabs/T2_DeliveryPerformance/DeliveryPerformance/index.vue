<template>
    <div class="PaymentPerformance">
        <div class="selectBox mb10">
<!--            <div class="text-xs text-black" style="font-weight: bold">{{typeRadio.value}}</div>-->
            <div class="title_1">{{typeRadio.value}}</div>
            <div style="flex: 1"></div>
            <Radio v-bind="typeRadio" :value.sync="typeRadio.value"/>
            <!--            <RangePickerMonth :date.sync="monthRange.date"/>-->
            <a-range-picker v-model="date" :allowClear="false"
                style="width: 250px"
                :disabled-date="disabledDate"
                @calendarChange="calendarChange"
                @openChange="openChange"
            />
        </div>
        <div class="content" style="height: calc(100% - 38px)">
            <ChannelOverview
                v-if="typeRadio.value === '渠道总览'"
                :date="date"
                :duration="duration"
            />
            <StoreDetails
                v-if="typeRadio.value === '店铺/区域' && tab.value === '线上店铺'"
                :date="date"
                :tab.sync="tab"
                :duration="duration"
            />
            <StoreDetailsOffline
                v-if="typeRadio.value === '店铺/区域' && tab.value === '线下区域'"
                :date="date"
                :tab.sync="tab"
                :duration="duration"
            />
        </div>
    </div>
</template>

<script>
import Radio from '../../../components/Radio'
// import RangePickerMonth from '../../../components/RangePickerMonth'
import moment from "moment";
import ChannelOverview from './components/ChannelOverview'
import StoreDetails from './components/StoreDetails'
import StoreDetailsOffline from './components/StoreDetailsOffline'

export default {
    components: {
        Radio,
        // RangePickerMonth,
        ChannelOverview,
        StoreDetails,
        StoreDetailsOffline,
    },
    data() {
        return {
            duration: 30000,
            typeRadio: {
                value: '渠道总览',
                options: ['渠道总览', '店铺/区域']
            },
            tab: {
                value: '线上店铺',
                options: ['线上店铺', '线下区域']
            },
            date: [
                moment().format('DD') === '01' ? moment().subtract(1, 'M').startOf('month') : moment().startOf('month'),
                moment().format('DD') === '01' ? moment().subtract(1, 'M').endOf('month') : moment().endOf('month')
            ],
            hoverDate: null,
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
    }
}
</script>

<style lang="scss" scoped>
@import '../../../assets/styles';
.PaymentPerformance{
    .selectBox{
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }

    .content {

    }
}
</style>