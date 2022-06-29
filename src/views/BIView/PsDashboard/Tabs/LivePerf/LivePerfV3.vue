<template>
    <RealTimePerformance v-if="show" class="component" />
</template>

<script>
import RealTimePerformance from "../../../ProductSupply/ChannelOverviewRealTimePerformance/index"
export default {
    name: 'LivePerfV2',
    components: {
        RealTimePerformance
    },
    data() {
        return {
            show: false
        }
    },
    mounted() {
        this.show = true
        console.log(RealTimePerformance)
    }
}
</script>

<style lang="scss" scoped>
    .component{
        //height: auto!important;
        height: calc(var(--height) * 1px);
        //
        position: relative;
        min-height: auto!important;
        /deep/ .top-toolbar-wrapper{
            display: none;
        }
        /deep/ > div:nth-child(2) {
            padding: 0!important;
            height: calc(var(--height) * 1px)!important;
            //height: 100%;
            > div:nth-child(1) {
                display: none;
            }
            > div:nth-child(3) {
                display: none;
            }
            > div:nth-child(2) {
                height: 100%;
                margin: 0!important;
                //height: calc(var(--height) * 1px);
                .topBox{
                    height: 41px;
                    padding: 0 20px;
                    border-bottom: none;
                    div:nth-child(1) {
                        margin-top: -4px;
                    }
                }
                .parent{
                    flex: none!important;
                    height: calc(100% - 41px);
                    padding: 0 20px;
                    >div:nth-child(1) {
                        height: 120px!important;
                        margin-bottom: 0;
                        .content{
                            .item{
                                .row1, .row2, .row3, .row4{
                                    margin: 0;
                                }
                                .row1{
                                    margin: 10px 0 0 0;
                                    .icon{
                                        height: 32px;
                                        width: 32px
                                    }
                                }
                            }
                            .item:nth-child(1) {
                                .left{
                                    height: 120px;
                                }
                                .right{
                                    .row1, .row2, .row3, .row4{
                                        margin: 0;
                                    }
                                    .row1{
                                        margin: 9px 0 0 0;
                                    }
                                }
                            }
                        }
                    }
                    .time{
                        //margin-top: 10px;
                        height: 30px;
                        padding: 0;
                        background: #fff;
                        .switchButton{
                            margin: 0!important;
                        }
                    }
                    .echarts{
                        height: calc(100% - 348px)!important;
                        .left, .right{
                            height: 100%!important;
                        }
                    }
                    .bottom{
                        margin-top: 10px;
                        //display: none;
                        border: 1px solid #e7e9f0;
                        border-right: none;
                        .top {
                            height: 24px;
                            .col1, .col{
                                height: 24px;
                                line-height: 24px;
                                border-bottom: 1px solid #e7e9f0;
                                background: #f5f7ff;
                            }
                            .border{
                                height: 168px;
                            }
                        }
                        .content{
                            .col1 {
                                .row:nth-child(2n){
                                    background: #fff;
                                }
                                .row:nth-child(2n + 1){
                                    background: #fcfcff;
                                }
                            }
                            .col {
                                .row:nth-child(2n){
                                    background: #fff;
                                }
                                .row:nth-child(2n + 1), .row1{
                                    background: #fcfcff;
                                }
                            }
                            .row, .row1{
                                height: 24px;
                                line-height: 24px;
                                border-bottom: 1px solid #e7e9f0;
                                border-right: 1px solid #e7e9f0;
                            }
                            .col:nth-last-child(1) .row, .col:nth-last-child(1) .row1{
                                border-right: none;
                            }
                            .row:nth-last-child(1), .row:nth-last-child(1) {
                                border-bottom: none;
                            }
                        }
                    }
                }
            }
        }
    }
</style>