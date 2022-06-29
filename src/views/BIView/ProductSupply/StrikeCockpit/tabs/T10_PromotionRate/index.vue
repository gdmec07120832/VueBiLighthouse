<template>
    <div class="T10_PromotionRate">
        <div class="header">
            <Title class="title" style="z-index: 2" :label="'付费推广'"/>
            <span>&nbsp;&nbsp;【其他店铺数据业务在补充中，敬请期待】</span>
            <div style="flex: 1"></div>
            <Radio v-bind.sync="monthOrYear" style="display: none"/>
            <div style="font-size: 12px;margin-right: 10px;color: rgba(0,0,0,0.65)">统计月份</div>
            <a-month-picker v-model="month" valueFormat="YYYYMM" :allowClear="false"/>
        </div>
        <Month v-if="monthOrYear.value === '当月'" :month="month"/>
        <Year v-if="monthOrYear.value === '月度'"/>
    </div>
</template>

<script>
import Title from '../../components/Title'
import Radio from '../../components/Radio'
import Month from './Month'
import Year from './Year'
import moment from 'moment'

export default {
    components: {
        Title,
        Radio,
        Month,
        Year,
    },
    data() {
        return {
            monthOrYear: {
                value: '当月',
                options: ['当月', '月度']
            },
            month: moment().format('DD') === '01' ? moment().subtract('1', 'M').format('YYYYMM') : moment().format('YYYYMM'),
        }
    },
}
</script>

<style lang="scss" scoped>
@import '../../assets/styles';
.T10_PromotionRate{
    .header {
        height: 38px;
        padding-bottom: 10px;
        border-bottom: 1px solid #F0F0F0;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        span:nth-child(2) {
            margin-top: 0;
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            color: rgba(0, 0, 0, 0.25);
            line-height: 20px;
        }
    }
}
</style>