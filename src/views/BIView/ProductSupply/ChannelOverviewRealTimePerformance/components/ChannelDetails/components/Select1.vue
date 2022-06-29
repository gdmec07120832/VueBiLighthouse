<!--
 * @Author: 黄浩
 * @Date: 2021-12-28 10:25:35
 * @LastEditTime: 2022-02-25 16:10:57
 * @LastEditors: Please set LastEditors
 * @Descripttion: 筛选区域1
 * @FilePath: \lsmy-bi-lighthouse-front\src\views\BIView\ProductSupply\ChannelOverviewRealTimePerformance\components\ChannelDetails\components\Select1.vue
-->
<template>
    <div>
        <virtual-select
            style="width: 275px;margin-right: 20px"
            v-model="SHOP_GROUP"
            label="平台搜索"
            :options="SHOP_GROUPArr.map((_) => ({ label: _ }))"
        ></virtual-select>
        <virtual-select
            style="width: 275px"
            v-model="SHOP_NAME"
            label="店铺搜索"
            :options="SHOP_NAMEArr.map((_) => ({ label: _ }))"
        ></virtual-select>
    </div>
</template>

<script>
import VirtualSelect from '@/views/BIView/components/VSelect/VSelect'
import _ from 'lodash'
export default {
    created() {
        this.getArr()
        this.getData()
    },
    props: {
        currentView: {
            type: Number
        },
        col1: {
            type: Number
        },
        duration: {
            type: Number
        },
        timerNumber: {
            type: Number
        }
    },
    watch: {
        SHOP_GROUP: {
            handler(val){
                // this.$emit('CHANNEL_TYPEChange',val)
                if(this.SHOP_NAME.length) {
                    this.$emit('update:col1',2)
                }else{
                    this.$emit('update:col1',1)
                }
                if(val.length) {
                    let subArr = this.allOption.filter(_ => {
                        return val.indexOf(_.SHOP_GROUP) > -1
                    })
                    this.SHOP_NAMEArr = Object.freeze(Array.from(new Set(subArr.map(_ => _.SHOP_NAME))))
                }else{
                    this.SHOP_NAMEArr = Object.freeze(Array.from(new Set(this.allOption.map(_ => _.SHOP_NAME))))
                }
                this.getData()
            }
        },
        SHOP_NAME: {
            handler(){
                if(this.SHOP_NAME.length) {
                    this.$emit('update:col1',2)
                }else{
                    this.$emit('update:col1',1)
                }
                this.getData()
                // this.$emit('CHANNELChange',val)
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
    components: { VirtualSelect },
    data() {
        this.getData = _.debounce(this.getData, 100, {
            leading: false,
            trailing: true
        })
        return {
            timer: null,
            allOption: [],
            // 平台
            SHOP_GROUP: [],
            SHOP_GROUPArr: [],
            // 店铺
            SHOP_NAME: [],
            SHOP_NAMEArr: []
        }
    },
    methods: {
        async getArr() {
            let map = ['全司视角', '全中视角', '品市视角']
            let params = {
                CHANNEL_VIEW: map[this.currentView - 1]
            }
            let res = await this.$fetchSql('real_time', 'real_time_chnl',params)
            this.allOption = res.data.concat()
            this.SHOP_GROUPArr = Object.freeze(Array.from(new Set(res.data.map(_ => _.SHOP_GROUP))))
            this.SHOP_NAMEArr =  Object.freeze(Array.from(new Set(res.data.map(_ => _.SHOP_NAME))))
        },
        async getData() {
            let map = ['全司视角', '全中视角', '品市视角']
            let params = {
                CHANNEL_VIEW: map[this.currentView - 1]
            }
            let arr = ['SHOP_GROUP', 'SHOP_NAME']
            arr.forEach(item => {
                if(this[item].length){
                    params[item] = this[item].toString()
                }
            })
            let res = await this.$fetchSql('real_time', 'real_time_chnl',params)
            let obj = this.computeSum(res.data)
            obj.SHOP_GROUP = '汇总'
            if(this.SHOP_NAME.length > 0) obj.SHOP_NAME = '汇总'
            // 每页插入一条汇总 number为插入次数
            // let number = res.data.length / 9
            // let newArr = []
            // for(let i = 0; i < number; i++) {
                // newArr.push(obj)
                // newArr = newArr.concat(res.data.slice(9 * i, 9 * (i+1)))
            // }
            res.data.unshift(obj)
            this.$emit('callBack', res.data)
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