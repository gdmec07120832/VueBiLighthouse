<template>
    <div class="TimeLine">
        <template v-for="(item, index) in datas">
            <div class="col" :key="index + item.label">
                <div class="row1">
                    {{item.label}}
                </div>
                <div class="item">
                    <div class="leftLine" :style="[{opacity: index !== 0 ? 1 : 0}]"></div>
                    <div class="dot"></div>
                    <div class="rightLine" :style="[{opacity: index !== datas.length - 1 ? 1 : 0}]"></div>
                </div>
                <div class="row3">
                    {{item.date}}
                </div>
                <div class="row4">
                    {{item.date1}}
                </div>
            </div>
            <template v-if="index !== datas.length - 1">
                <div v-for="index1 in item.num" class="connentLine" :key="index + '-' + index1 + '-' + item.label">
                </div>
            </template>
        </template>
    </div>
</template>

<script>
import moment from 'moment'
export default {
    name: 'TimeLine',
    props: {
        datas: {
            type: Array,
            default() {return []}
        }
    },
    data() {
        return {

        }
    }
}
</script>

<style lang="scss" scoped>
.TimeLine{
    display: flex;
    .col{
        text-align: center;
        white-space: nowrap;
        .row1{
            padding: 0 10px;
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            color: #666666;
            line-height: 18px;
            margin-bottom: 14px;
        }
        .item{
            margin-bottom: 14px;
            display: flex;
            align-items: center;
            .leftLine, .rightLine{
                //width: calc(50% - 5px);
                flex: 1;
                height: 2px;
                background: #5C8FFA;
            }
            .dot{
                width: 6px;
                height: 6px;
                background: #5C8FFA;
                border-radius: 3px;
                margin: 0 2px;
            }
            .rightLine{

            }
        }
        .row3, .row4{
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            color: #666666;
            line-height: 16px;
        }
    }
    .connentLine{
        margin-top: 34px;
        height: 2px;
        background: #5C8FFA;
        flex: 1;
    }
}
</style>