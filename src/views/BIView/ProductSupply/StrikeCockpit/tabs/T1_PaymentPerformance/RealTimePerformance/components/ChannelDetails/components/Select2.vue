<!--
 * @Author: 黄浩
 * @Date: 2021-12-28 10:58:56
 * @LastEditTime: 2022-02-25 16:12:24
 * @LastEditors: Please set LastEditors
 * @Descripttion: 
 * @FilePath: \lsmy-bi-lighthouse-front\src\views\BIView\ProductSupply\ChannelOverviewRealTimePerformance\components\ChannelDetails\components\Select2.vue
-->
<template>
    <div style="display: flex;flex-direction: column;align-items: flex-start;">
        <a-radio-group v-model="type1" name="radioGroup" :default-value="1" style="margin-bottom: 10px">
            <a-radio :value="1">
            负责人
            </a-radio>
            <a-radio :value="2">
            分组
            </a-radio>
        </a-radio-group>
        <div style="display: flex;">
            <virtual-select
                style="width: 275px;margin-right: 20px"
                v-model="BOSS"
                label="负责人选项"
                :options="BOSSArr.map((_) => ({ label: _ }))"
            ></virtual-select>
            <virtual-select
                v-if="type1 > 1"
                style="width: 275px;margin-right: 20px"
                v-model="GROUP_NAME"
                label="分组选项"
                :options="GROUP_NAMEArr.map((_) => ({ label: _ }))"
            ></virtual-select>
        </div>
    </div>
</template>

<script>
import VirtualSelect from '@/views/BIView/components/VSelect/VSelect'
import _, { groupBy } from 'lodash'
export default {
    components: { VirtualSelect },
    props: {
        currentView: {
            type: Number,
        },
        duration: {
            type: Number
        },
        timerNumber: {
            type: Number
        }
    },
    watch: {
        type1: {
            handler(val) {
                if(val === 1) {
                    this.$emit('update:col1',3)
                    this.GROUP_NAME = [].concat()
                }
                else if(val === 2)this.$emit('update:col1',4)
                // this.getArr()
                // this.getData()
            }
        },
        BOSS: {
            handler(val) {
                this.getData()
                if(val.length) {
                    let subArr = this.allOption.filter(item => {
                        return val.indexOf(item.BOSS) > -1
                    })
                    this.GROUP_NAMEArr= Object.freeze(Array.from(new Set(subArr.map(_ => _.GROUP_NAME))))
                }else{
                    this.GROUP_NAMEArr= Object.freeze(Array.from(new Set(this.allOption.map(_ => _.GROUP_NAME))))
                }
            }
        },
        GROUP_NAME: {
            handler() {
                this.getData()
            }
        },
        currentView: {
            handler() {
                this.getArr()
                this.getData()
            }
        },
        timerNumber: {
            handler() {
                this.getArr()
                this.getData()
            }
        }
    },
    created() {
        this.getArr()
        this.getData()
    },
    data() {
        this.getData = _.debounce(this.getData, 100, {
            leading: false,
            trailing: true
        })
        return {
            type1: 1,
            allOption: [],
            // 负责人
            BOSS: [],
            BOSSArr: [],
            // 分组
            GROUP_NAME: [],
            GROUP_NAMEArr: []
        }
    },
    methods: {
        async getArr() {
            let map = ['全司视角', '全中视角', '品市视角']
            let params = {
                CHANNEL_VIEW: map[this.currentView - 1],
            }
            let res = await this.$fetchSql('real_time', 'real_time_group',params)
            this.allOption = res.data.concat()
            this.BOSSArr= Object.freeze(Array.from(new Set(res.data.map(_ => _.BOSS))))
            this.GROUP_NAMEArr= Object.freeze(Array.from(new Set(res.data.map(_ => _.GROUP_NAME))))
            // this.CHANNELArr =  Object.freeze(Array.from(new Set(res.data.map(_ => _.CHANNEL))))
        },
        async getData() {
            let map = ['全司视角', '全中视角', '品市视角']
            let params = {
                CHANNEL_VIEW: map[this.currentView - 1],
            }
            let arr = ['BOSS', 'GROUP_NAME']
            arr.forEach(item => {
                if(this[item].length) {
                    params[item] = this[item].toString()
                }
            })
            let res = await this.$fetchSql('real_time', 'real_time_group',params)
            let obj = this.computeSum(res.data)
            const groupByUser = groupBy(res.data, 'BOSS')
            let data = Object.keys(groupByUser).map(key => {
              const data = groupByUser[key]
              let totalData = data.reduce((acc, cur) => {
                return {
                  SALES_TARGET: acc['SALES_TARGET'] + cur['SALES_TARGET'],
                  SALE_AMT: acc['SALE_AMT'] + cur['SALE_AMT'],
                }
              }, {
                SALES_TARGET: 0,
                SALE_AMT: 0
              })
              totalData['BOSS'] = key
              const rate = totalData['SALE_AMT'] / totalData['SALES_TARGET']
              totalData['CMP_RATE'] = isNaN(rate) ? 0 : rate
              return totalData
            })
            obj[arr[0]] = '汇总'
            // 每页插入一条汇总 number为插入次数

            const tableData = this.type1 === 1 ? data : res.data

            // let number = tableData.length / 9
            // let newArr = []
            // for(let i = 0; i < number; i++) {
            //     newArr.push(obj)
            //     newArr = newArr.concat(tableData.slice(9 * i, 9 * (i+1)))
            // }
            tableData.unshift(obj)
            this.$emit('callBack', tableData)
        },
        computeSum(data) {
            let obj = {
                SALES_TARGET: 0,
                SALE_AMT: 0,
                CMP_RATE: 0
            }
            data.forEach(item => {
                for(let key in obj) {
                    obj[key] += item[key]
                }
            })
            const rate = obj['SALE_AMT'] / obj['SALES_TARGET']
            obj.CMP_RATE = isNaN(rate) ? 0 : rate
            return obj
        }
    }
}
</script>

<style lang='scss' scoped>

</style>