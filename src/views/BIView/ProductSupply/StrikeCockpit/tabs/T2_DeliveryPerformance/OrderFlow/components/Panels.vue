<template>
<!--    <div class="allPanels">-->
<!--        <div v-for="(item, index) in allPanels" :key="item.left.name" @click="clickPanel(index)" class="item" :class="{active: currentPanel === index ? true : false}">-->
<!--            <Panel v-bind="item.left" class="mr10"/>-->
<!--            <Panel v-if="selects0.value.toString() === '全部'" v-bind="item.right"/>-->
<!--            <div v-else style="width: 100%;height: 100%;"></div>-->
<!--        </div>-->
<!--    </div>-->
    <div class="allPanels">
        <Panel @clickPanel="clickPanel" v-for="item in allPanels" :class="{active: currentPanel === item.name ? true : false, noAll: selects[0].value.toString() !== '全部' ? true : false}" v-bind="item" :key="item.name"/>
    </div>
</template>

<script>
import Panel from '../../../../components/Panel'
import _ from 'lodash'
import moment from 'moment'
export default {
    components: {
        Panel,
    },
    props: {
        selects: {
            type: Array
        }
    },
    async created(){
        this.getAllPanel()
    },
    watch: {
        selects: {
            handler(){
                this.getAllPanel()
            },
            deep: true
        }
    },
    data() {
        return {
            currentPanel: '总待货审订单金额',
            // allPanels: [
            //     {
            //         left: {
            //             name: '待货审订单分布',
            //             tabIndex: 'T2_OrderFlow_allPanels',
            //             row: 3,
            //             column: 2,
            //             area: [
            //                 ['a', 'a'],
            //                 ['b', 'b'],
            //                 ['c', 'c_v'],
            //             ],
            //             map: [
            //                 {areaName: 'a', value: '待货审订单分布', className: 'label'},
            //                 {areaName: 'b', keyName: 'PTD_WAIT_GOODS_AUD_AMT', className: 'subTitle', valueFormat: 'round'},
            //                 {areaName: 'c', value: '占比', className: 'label'},
            //                 {areaName: 'c_v', keyName: 'rate', className: 'label', valueFormat: 'percent'},
            //             ],
            //             dataSource: {
            //
            //             }
            //         },
            //         right: {
            //             name: '',
            //             tabIndex: 'T2_OrderFlow_allPanels',
            //             row: 6,
            //             column: 2,
            //             area: [
            //                 ['a', 'b'],
            //                 ['a_v', 'b_v'],
            //                 ['c', 'd'],
            //                 ['c_v', 'd_v'],
            //                 ['e', 'f'],
            //                 ['e_v', 'f_v'],
            //             ],
            //             map: [
            //                 {areaName: 'a', value: '线上', className: 'label'},
            //                 {areaName: 'a_v', keyName: 'ON_WAIT_GOODS_AUD_AMT', className: 'value', valueFormat: 'hundredMillion_double_dot'},
            //                 {areaName: 'b', value: '占比', className: 'label'},
            //                 {areaName: 'b_v', keyName: 'ON_WAIT_GOODS_AUD_RATE', className: 'value', valueFormat: 'percent'},
            //                 {areaName: 'c', value: '线下', className: 'label'},
            //                 {areaName: 'c_v', keyName: 'OFF_WAIT_GOODS_AUD_AMT', className: 'value', valueFormat: 'hundredMillion_double_dot'},
            //                 {areaName: 'd', value: '占比', className: 'label'},
            //                 {areaName: 'd_v', keyName: 'OFF_WAIT_GOODS_AUD_RATE', className: 'value', valueFormat: 'percent'},
            //                 {areaName: 'e', value: '海外', className: 'label'},
            //                 {areaName: 'e_v', keyName: 'HW_WAIT_GOODS_AUD_AMT', className: 'value', valueFormat: 'hundredMillion_double_dot'},
            //                 {areaName: 'f', value: '占比', className: 'label'},
            //                 {areaName: 'f_v', keyName: 'HW_WAIT_GOODS_AUD_RATE', className: 'value', valueFormat: 'percent'},
            //             ],
            //             dataSource: {}
            //         }
            //     },
            //     {
            //         left: {
            //             name: '按承诺发货',
            //             tabIndex: 'T2_OrderFlow_allPanels',
            //             row: 3,
            //             column: 2,
            //             area: [
            //                 ['a', 'a'],
            //                 ['b', 'b'],
            //                 ['c', 'c_v'],
            //             ],
            //             map: [
            //                 {areaName: 'a', value: '按承诺发货', className: 'label'},
            //                 {areaName: 'b', keyName: 'PTD_COMMIT_SEND_AMT', className: 'subTitle', valueFormat: 'round'},
            //                 {areaName: 'c', value: '占比', className: 'label'},
            //                 {areaName: 'c_v', keyName: 'PTD_COMMIT_SEND_RATE', className: 'label', valueFormat: 'percent'},
            //             ],
            //             dataSource: {
            //
            //             }
            //         },
            //         right: {
            //             name: '',
            //             tabIndex: 'T2_OrderFlow_allPanels',
            //             row: 6,
            //             column: 2,
            //             area: [
            //                 ['a', 'b'],
            //                 ['a_v', 'b_v'],
            //                 ['c', 'd'],
            //                 ['c_v', 'd_v'],
            //                 ['e', 'f'],
            //                 ['e_v', 'f_v'],
            //             ],
            //             map: [
            //                 {areaName: 'a', value: '线上', className: 'label'},
            //                 {areaName: 'a_v', keyName: 'ON_COMMIT_SEND_AMT', className: 'value', valueFormat: 'hundredMillion_double_dot'},
            //                 {areaName: 'b', value: '占比', className: 'label'},
            //                 {areaName: 'b_v', keyName: 'ON_COMMIT_SEND_RATE', className: 'value', valueFormat: 'percent'},
            //                 {areaName: 'c', value: '线下', className: 'label'},
            //                 {areaName: 'c_v', keyName: 'OFF_COMMIT_SEND_AMT', className: 'value', valueFormat: 'hundredMillion_double_dot'},
            //                 {areaName: 'd', value: '占比', className: 'label'},
            //                 {areaName: 'd_v', keyName: 'OFF_COMMIT_SEND_RATE', className: 'value', valueFormat: 'percent'},
            //                 {areaName: 'e', value: '海外', className: 'label'},
            //                 {areaName: 'e_v', keyName: 'HW_COMMIT_SEND_AMT', className: 'value', valueFormat: 'hundredMillion_double_dot'},
            //                 {areaName: 'f', value: '占比', className: 'label'},
            //                 {areaName: 'f_v', keyName: 'HW_COMMIT_SEND_RATE', className: 'value', valueFormat: 'percent'},
            //             ],
            //             dataSource: {}
            //         }
            //     },
            //     {
            //         left: {
            //             name: '待通知发货',
            //             tabIndex: 'T2_OrderFlow_allPanels',
            //             row: 3,
            //             column: 2,
            //             area: [
            //                 ['a', 'a'],
            //                 ['b', 'b'],
            //                 ['c', 'c_v'],
            //             ],
            //             map: [
            //                 {areaName: 'a', value: '待通知发货', className: 'label'},
            //                 {areaName: 'b', keyName: 'PTD_WAIT_INFO_SEND_AMT', className: 'subTitle', valueFormat: 'round'},
            //                 {areaName: 'c', value: '占比', className: 'label'},
            //                 {areaName: 'c_v', keyName: 'PTD_WAIT_INFO_SEND_RATE', className: 'label', valueFormat: 'percent'},
            //             ],
            //             dataSource: {
            //
            //             }
            //         },
            //         right: {
            //             name: '',
            //             tabIndex: 'T2_OrderFlow_allPanels',
            //             row: 6,
            //             column: 2,
            //             area: [
            //                 ['a', 'b'],
            //                 ['a_v', 'b_v'],
            //                 ['c', 'd'],
            //                 ['c_v', 'd_v'],
            //                 ['e', 'f'],
            //                 ['e_v', 'f_v'],
            //             ],
            //             map: [
            //                 {areaName: 'a', value: '线上', className: 'label'},
            //                 {areaName: 'a_v', keyName: 'ON_WAIT_INFO_SEND_AMT', className: 'value', valueFormat: 'hundredMillion_double_dot'},
            //                 {areaName: 'b', value: '占比', className: 'label'},
            //                 {areaName: 'b_v', keyName: 'ON_WAIT_INFO_RATE', className: 'value', valueFormat: 'percent'},
            //                 {areaName: 'c', value: '线下', className: 'label'},
            //                 {areaName: 'c_v', keyName: 'OFF_WAIT_INFO_SEND_AMT', className: 'value', valueFormat: 'hundredMillion_double_dot'},
            //                 {areaName: 'd', value: '占比', className: 'label'},
            //                 {areaName: 'd_v', keyName: 'OFF_WAIT_INFO_RATE', className: 'value', valueFormat: 'percent'},
            //                 {areaName: 'e', value: '海外', className: 'label'},
            //                 {areaName: 'e_v', keyName: 'HW_WAIT_INFO_SEND_AMT', className: 'value', valueFormat: 'hundredMillion_double_dot'},
            //                 {areaName: 'f', value: '占比', className: 'label'},
            //                 {areaName: 'f_v', keyName: 'HW_WAIT_INFO_RATE', className: 'value', valueFormat: 'percent'},
            //             ],
            //             dataSource: {}
            //         }
            //     }
            // ]
            allPanels: [
                {
                    name: '总待货审订单金额',
                    tabIndex: 'T2_OrderFlow_allPanels',
                    row: 5,
                    column: 6,
                    area: [
                        ['a', 'a', 'a', 'a', 'a', 'a'],
                        ['b', 'b', 'b', 'b', 'b', 'b'],
                        ['c', 'c_v', 'c_v', 'c_v', 'c_v', 'c_v'],
                        ['d', 'd', 'e', 'e', 'f', 'f'],
                        ['d_v', 'd_v', 'e_v', 'e_v', 'f_v', 'f_v'],
                    ],
                    map: [
                        {areaName: 'a', value: '总待货审订单金额', className: 'title'},
                        {areaName: 'b', keyName: 'PTD_WAIT_GOODS_AUD_AMT', className: 'subTitle', valueFormat: 'round'},
                        {areaName: 'c', value: '占比', className: 'label'},
                        {areaName: 'c_v', keyName: 'rate', className: 'value', valueFormat: 'percent'},
                        {areaName: 'd', value: '线上占比', className: 'label'},
                        {areaName: 'd_v', keyName: 'ON_WAIT_GOODS_AUD_RATE', className: 'value', valueFormat: 'percent'},
                        {areaName: 'e', value: '线下占比', className: 'label'},
                        {areaName: 'e_v', keyName: 'OFF_WAIT_GOODS_AUD_RATE', className: 'value', valueFormat: 'percent'},
                        {areaName: 'f', value: '海外占比', className: 'label'},
                        {areaName: 'f_v', keyName: 'HW_WAIT_GOODS_AUD_RATE', className: 'value', valueFormat: 'percent'},
                    ],
                    dataSource: {}
                },
                {
                    name: '承诺待发货金额（已剔除待通知）',
                    tabIndex: 'T2_OrderFlow_allPanels',
                    row: 5,
                    column: 6,
                    area: [
                        ['a', 'a', 'a', 'a', 'a', 'a'],
                        ['b', 'b', 'b', 'b', 'b', 'b'],
                        ['c', 'c_v', 'c_v', 'c_v', 'c_v', 'c_v'],
                        ['d', 'd', 'e', 'e', 'f', 'f'],
                        ['d_v', 'd_v', 'e_v', 'e_v', 'f_v', 'f_v'],
                    ],
                    map: [
                        {areaName: 'a', value: '承诺待发货金额（已剔除待通知）', className: 'title'},
                        {areaName: 'b', keyName: 'PTD_COMMIT_SEND_AMT', className: 'subTitle', valueFormat: 'round'},
                        {areaName: 'c', value: '占比', className: 'label'},
                        {areaName: 'c_v', keyName: 'PTD_COMMIT_SEND_RATE', className: 'value', valueFormat: 'percent'},
                        {areaName: 'd', value: '线上占比', className: 'label'},
                        {areaName: 'd_v', keyName: 'ON_COMMIT_SEND_RATE', className: 'value', valueFormat: 'percent'},
                        {areaName: 'e', value: '线下占比', className: 'label'},
                        {areaName: 'e_v', keyName: 'OFF_COMMIT_SEND_RATE', className: 'value', valueFormat: 'percent'},
                        {areaName: 'f', value: '海外占比', className: 'label'},
                        {areaName: 'f_v', keyName: 'HW_COMMIT_SEND_RATE', className: 'value', valueFormat: 'percent'},
                    ],
                    dataSource: {}
                },
                {
                    name: '待通知发货金额',
                    tabIndex: 'T2_OrderFlow_allPanels',
                    row: 5,
                    column: 6,
                    area: [
                        ['a', 'a', 'a', 'a', 'a', 'a'],
                        ['b', 'b', 'b', 'b', 'b', 'b'],
                        ['c', 'c_v', 'c_v', 'c_v', 'c_v', 'c_v'],
                        ['d', 'd', 'e', 'e', 'f', 'f'],
                        ['d_v', 'd_v', 'e_v', 'e_v', 'f_v', 'f_v'],
                    ],
                    map: [
                        {areaName: 'a', value: '待通知发货金额', className: 'title'},
                        {areaName: 'b', keyName: 'PTD_WAIT_INFO_SEND_AMT', className: 'subTitle', valueFormat: 'round'},
                        {areaName: 'c', value: '占比', className: 'label'},
                        {areaName: 'c_v', keyName: 'PTD_WAIT_INFO_SEND_RATE', className: 'value', valueFormat: 'percent'},
                        {areaName: 'd', value: '线上占比', className: 'label'},
                        {areaName: 'd_v', keyName: 'ON_WAIT_INFO_RATE', className: 'value', valueFormat: 'percent'},
                        {areaName: 'e', value: '线下占比', className: 'label'},
                        {areaName: 'e_v', keyName: 'OFF_WAIT_INFO_RATE', className: 'value', valueFormat: 'percent'},
                        {areaName: 'f', value: '海外占比', className: 'label'},
                        {areaName: 'f_v', keyName: 'HW_WAIT_INFO_RATE', className: 'value', valueFormat: 'percent'},
                    ],
                    dataSource: {}
                },
            ]
        }
    },
    methods: {
        clickPanel(val){
            this.currentPanel = val
            let obj = {
                '总待货审订单金额': 0,
                '承诺待发货金额（已剔除待通知）': 1,
                '待通知发货金额': 2
            }
            this.$emit('clickPanel', obj[val])
        },
        async getAllPanel(){
            let query = {}
            let { value:CHNL_NAME } = this.selects[0]
            let { value:CHNL_TYPE } = this.selects[1]
            if(CHNL_NAME.toString() !== '全部') query.CHNL_NAME = CHNL_NAME.toString()
            if(CHNL_TYPE.toString() !== '全部') query.CHNL_TYPE = CHNL_TYPE.toString()
            let res = await this.$fetchSql('all_center', 'all_center_send_order_distri', query)
            this.handleData('allPanel', res.data)
        },
        handleData(type, source){
            if(type === 'allPanel'){
                // let arr = source.concat()
                // this.allPanels.forEach(item => {
                //     item.left.dataSource = {}
                //     item.right.dataSource = {}
                // })
                // this.allPanels[0].left.dataSource.rate = '--'
                // if(!arr.length) return
                // this.allPanels.forEach(item => {
                //     item.left.dataSource = arr[0]
                //     item.right.dataSource = arr[0]
                // })
                // this.allPanels[0].left.dataSource.rate = 1

                this.allPanels[0].dataSource = {}
                let arr = source.concat()
                if(!arr.length) return
                arr[0].rate = 1
                if(this.selects[0].value.toString() === '其它') arr[0].rate = null
                this.allPanels[0].dataSource = arr[0]
                this.allPanels[1].dataSource = arr[0]
                this.allPanels[2].dataSource = arr[0]
            }
        }
    }
}
</script>

<style lang="scss" scoped>
//.allPanels{
//    display: flex;
//    align-items: center;
//    height: 176px;
//    .active{
//        background: rgba(0, 0, 0, 0.03)
//    }
//    .item{
//        flex: 1;
//        display: flex;
//        align-items: center;
//        height: 100%;
//        padding: 10px;
//        &:hover{
//            background: rgba(0, 0, 0, 0.03)
//        }
//        /deep/ .Panel{
//            display: flex;
//            flex-direction: column;
//            justify-content: space-between;
//            &:nth-child(odd){
//                .row{
//                    margin-bottom: 15px;
//                }
//            }
//            .subTitle{
//                font-size: 20px;
//                line-height: 20px;
//            }
//        }
//    }
//}
.allPanels{
    display: flex;
    align-items: center;
    height: 151px;
    .active{
        background: rgba(0, 0, 0, 0.03);
    }
    /deep/ .Panel{
        padding: 10px 30px 10px 10px;
        &:hover{
            background: rgba(0, 0, 0, 0.03);
        }
        &:nth-last-child(1){
            margin-right: 0;
        }
        .row_2, .row_3, .row_4, .row_5{
            margin-top: 8px;
        }
        .row_3{
            .column:nth-child(1){
                flex: 1;
            }
            .column:nth-child(2){
                flex: 2;
            }
        }
    }
    /deep/ .noAll{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .row_4, .row_5{
            display: none;
        }
    }
}
</style>