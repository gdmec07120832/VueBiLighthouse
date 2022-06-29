<template>
    <div @click="clickPanel" class="Panel" ref="Panel">
    </div>
</template>

<script>
import base from '../utils/base.js'
import Vue from 'vue'

export default {
    mixins: [base],
    mounted() {
        this.initPanel()
    },
    props: {
        name: {
            type: [String, Number],
            default: '',
        },
        tabIndex: {
            type: String,
            default: '',
        },
        row: {
            type: Number,
            default: 0,
        },
        column: {
            type: Number,
            default: 0,
        },
        area: {
            type: Array,
            default() {
                return []
            },
        },
        map: {
            type: Array,
            default() {
                return []
            },
        },
        dataSource: {
            type: Object,
            default() {
                return {}
            },
        },
    },
    watch: {
        $props: {
            handler() {
                this.initPanel()
            },
            deep: true
        }
    },
    data() {
        return {
            // 例1
            // name: '线上渠道',
            // tabIndex: 'T1_PaymentPerformance',
            // row: 4,
            // column: 4,
            // area: area,
            // map: [
            //     {areaName: 'a', value: '线上渠道', className: 'title'},
            //     {areaName: 'b', keyName: 'val_b', className: 'subTitle', valueFormat: 'round'},
            //     {areaName: 'c', value: '目标', className: 'label'},
            //     {areaName: 'd', keyName: 'val_d', className: 'value', valueFormat: 'hundredMillion_double_dot'},
            //     {areaName: 'e', value: '达成:', className: 'label'},
            //     {areaName: 'f', keyName: 'val_f', className: 'value', valueFormat: 'percent', colorFormat: 'reach'},
            //     {areaName: 'g', value: '同比:', className: 'label'},
            //     {areaName: 'h', keyName: 'val_h', className: 'value', valueFormat: 'percent', colorFormat: 'reach'},
            //     {areaName: 'i', value: '占总', className: 'label'},
            //     {areaName: 'j', keyName: 'val_j', className: 'value', valueFormat: 'percent', colorFormat: 'reach'},
            // ],
            // dataSource: {
            //     val_b: 123456789,
            //     val_d: 123456789,
            //     val_f: 0.3,
            //     val_h: 0.3,
            //     val_j: 0.4,
            // }

            // 例2
            // name: '订单',
            // tabIndex: 'T1_PaymentPerformance',
            // row: 5,
            // column: 4,
            // area: [
            //     ['a', 'a', 'a', 'a'],
            //     ['b', 'c'],
            //     ['d', 'e', 'f', 'g'],
            //     ['h', 'i', 'j', 'k'],
            //     ['l', 'm', 'n', 'o'],
            // ],
            // map: [
            //     {areaName: 'a', value: '按承诺发货订单', className: 'title'},
            //     {areaName: 'b', keyName: 'val_b', className: 'subTitle', valueFormat: 'round'},
            //     {areaName: 'c', keyName: 'val_c', className: 'subTitle', valueFormat: 'percent'},
            //     {areaName: 'd', value: '线上渠道', className: 'label'},
            //     {areaName: 'e', keyName: 'val_e', className: 'value', valueFormat: 'hundredMillion_double_dot'},
            //     {areaName: 'f', value: '占比', className: 'label'},
            //     {areaName: 'g', keyName: 'val_g', className: 'value', valueFormat: 'percent'},
            //     {areaName: 'h', value: '线下渠道', className: 'label'},
            //     {areaName: 'i', keyName: 'val_i', className: 'value', valueFormat: 'percent', colorFormat: 'reach'},
            //     {areaName: 'j', value: '占比', className: 'label'},
            //     {areaName: 'k', keyName: 'val_k', className: 'value', valueFormat: 'percent', colorFormat: 'reach'},
            //     {areaName: 'l', value: '海外渠道', className: 'label'},
            //     {areaName: 'm', keyName: 'val_m', className: 'value', valueFormat: 'percent', colorFormat: 'reach'},
            //     {areaName: 'n', value: '占比', className: 'label'},
            //     {areaName: 'o', keyName: 'val_o', className: 'value', valueFormat: 'percent', colorFormat: 'reach'},
            // ],
            // dataSource: {
            //     val_b: 123456789,
            //     val_c: 0.76,
            //     val_e: 123456789,
            //     val_g: 0.3,
            //     val_i: 0.26,
            //     val_k: 0.6,
            //     val_m: 0.26,
            //     val_o: 0.6,
            // }
        }
    },
    methods: {
        clickPanel() {
            this.$emit('clickPanel', this.name)
        },
        initPanel() {
            let row = this.row
            let area = this.area
            let match = this.match
            let str = ''
            for (let i = 0; i < row; i++) {
                let item = ''
                let itemArr = Array.from(new Set(area[i]))
                for (let j = 0; j < itemArr.length; j++) {
                    item += `<div id="col_${itemArr[j]}" class="column col_${itemArr[j]} ${match(itemArr[j], 'className')} ${match(itemArr[j], 'colorFormat')}" title="${match(itemArr[j], 'valueFormat')}">${match(itemArr[j], 'valueFormat')}</div>`
                }
                str += `<div class="row row_${i + 1}">${item}</div>`
            }
            this.$refs.Panel.innerHTML = str
            let that = this
            this.$nextTick(() => {
                for(let i = 0; i < that.row; i++) {
                    let col = Array.from(new Set(that.area[i]))
                    for(let j = 0; j < col.length; j++) {
                        let areaName = that.area[i][j]
                        let colName = `.col_${areaName}`
                        let dom = document.querySelector(colName)
                        let classList = dom.classList
                        if(that.match(areaName, 'before') || that.match(areaName, 'after')) {
                            new Vue({
                                render() {
                                    return <div id={dom.id} class={classList.value} title={dom.innerText}>{that.match(areaName, 'before')}{dom.innerHTML}{that.match(areaName, 'after')}</div>
                                }
                            }).$mount(colName)
                        }
                    }
                }
            })
        },
        match(areaName, type = 'value') {
            let dataSource = this.dataSource
            let arr = this.map.filter(_ => _.areaName === areaName)
            if (type === 'value') {
                // map中value和keyName同时存在时取value
                let value = arr[0].value
                let keyName
                if (arr.length) keyName = arr[0].keyName
                let hasValue = 'value' in arr[0]
                let hasKeyName = 'keyName' in arr[0]
                if (!hasValue && !hasKeyName) {
                    if (process.env.VUE_APP_RELEASE_ENV !== 'pro') console.error('map中即没有value属性又没有keyName属性--Panel组件')
                    return ''
                } else if (hasValue && !hasKeyName) return arr[0].value
                else if (!hasValue && hasKeyName) return dataSource[keyName]
                else if (hasValue && hasKeyName) return arr[0].value
            }
            else if (type === 'className' || type === 'before' || type === 'after') {
                if (arr[0][type] || arr[0][type] === 0) return arr[0][type]
                else return ''
            }
            else if (type === 'valueFormat') {
                let value = this.match(areaName)
                if (!(type in arr[0])) return value
                else {
                    if (Object.prototype.toString.call(arr[0][type]) === '[object String]') {
                        let clearZero = 'clearZero' in arr[0] ? arr[0].clearZero : false
                        return this.handleNum(arr[0][type], value, clearZero)
                    } else if (Object.prototype.toString.call(arr[0][type]) === '[object Function]') {
                        return arr[0][type](value)
                    }
                }
            }
            else if (type === 'colorFormat') {
                let value = this.match(areaName)
                if (!(type in arr[0])) return ''
                if (Object.prototype.toString.call(arr[0][type]) === '[object String]') {
                    return this.handleColor(arr[0][type], value)
                } else if (Object.prototype.toString.call(arr[0][type]) === '[object Function]') {
                    return arr[0][type](value)
                }
            }
            else if(type === 'before' || type === 'after') {
                if(arr.length) return arr[0][type]
                else return undefined
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.Panel {
    width: 100%;
    height: 100%;
    //background: aquamarine;
    /deep/ .row {
        display: flex;

        .column {
            flex: 1;
            overflow: hidden;
        }

        .title {
            font-size: 13px;
            font-family: PingFangSC-Regular, PingFang SC;
            color: rgba(0, 0, 0, .64);
            line-height: 22px;
        }

        .subTitle {
            font-size: 22px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 600;
            color: #333;
            line-height: 24px;
        }

        .label {
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            color: #999;
            line-height: 18px;
        }

        .value {
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            color: rgba(0, 0, 0, .64);
            line-height: 18px;
        }

        .red {
            color: #ff5953
        }

        .green {
            color: #00a854
        }
    }
}
</style>