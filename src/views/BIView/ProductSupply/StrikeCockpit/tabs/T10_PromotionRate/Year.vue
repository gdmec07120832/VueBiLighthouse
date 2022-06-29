<template>
    <div class="content">
        <Radio v-bind.sync="yearRadio"/>
        <CheckBox v-bind.sync="checkStore" style="margin-top: 10px"/>
        <CheckBox v-bind.sync="checkTool" style="margin-top: 10px"/>
        <Radio v-bind.sync="fieldRadio" style="margin-top: 10px"/>
        <div style="height: calc(100% - 284px);display: flex;position: relative;margin-top: 10px">
            <div style="width: 100%;position: absolute;top: 0;display: flex;">
                <div class="title_2" style="width: calc(50% - 20px)">目标达成</div>
                <div style="width: 40px"></div>
                <div class="title_2" style="width: calc(50% - 20px)">同期对比</div>
            </div>
            <v-chart ref="barAndLine" :options="barAndLine" style="width: calc(50% - 20px)" autoresize></v-chart>
            <div style="width: 40px"></div>
            <v-chart ref="barAndLine" :options="barAndLine" style="width: calc(50% - 20px)" autoresize></v-chart>
        </div>
        <Table v-bind="table" style="margin-top: 10px"/>
    </div>
</template>

<script>
import base from '../../utils/base.js'
import Radio from '../../components/Radio'
import moment from 'moment'
import CheckBox from '../../components/CheckBox'
import Table from '../../components/TableOld'
export default {
    mixins: [ base ],
    components: {
        Radio,
        CheckBox,
        Table,
    },
    created() {
        this.yearRadio.options.push(moment().format('YYYY'))
        for(let i = 0; i < moment().format('YYYY') - '2020'; i++) {
            this.yearRadio.options.push(moment().format('YYYY') - i - 1)
        }
        this.barAndLine = this.createBarAndLineEchart()
        this.barAndLine.grid.top = 30
        this.barAndLine.grid.bottom = 0
        this.barAndLine.series[0].data = [100, 200, 50]
        this.barAndLine.series[1].data = [100, 200, 50]
    },
    data() {
        return {
            yearRadio: {
                label: '年份',
                value: moment().format('YYYY'),
                options: []
            },
            checkStore: {
                label: '店铺选择',
                value: '',
                options: ['1', '2' ,'3']
            },
            checkTool: {
                label: '推广工具',
                value: '',
                options: ['1', '2' ,'3']
            },
            fieldRadio: {
                label: '指标选择',
                value: '花费',
                options: ['花费', '点击量', 'CPC', '收藏加购量', '收藏加购率', '收藏加购成本']
            },
            barAndLine: null,
            table: {
                index: 'T10_PromotionRate',
                labelData: ['年份', moment().format('YYYY'), moment().subtract(1, 'y').format('YYYY'), '同比', '目标', '达成'],
                tableData: [
                    ['年累计', 1, 2, 3, 4, 5],
                    ['当期累计', 1, 2, 3, 4, 5],
                    [1, 2, 3, 4, 5, 6],
                    [1, 2, 3, 4, 5, 6],
                    [1, 2, 3, 4, 5, 6],
                    [1, 2, 3, 4, 5, 6],
                ]
            },
        }
    }
}
</script>

<style lang="scss" scoped>
.content{
    margin-top: 10px;
    height: calc(100% - 48px);
}
</style>