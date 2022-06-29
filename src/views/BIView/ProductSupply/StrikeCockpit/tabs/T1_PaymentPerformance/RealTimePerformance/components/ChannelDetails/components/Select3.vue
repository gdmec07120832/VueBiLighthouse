<!--
 * @Author: 黄浩
 * @Date: 2021-12-28 17:43:22
 * @LastEditTime: 2022-02-25 16:12:49
 * @LastEditors: Please set LastEditors
 * @Descripttion: 
 * @FilePath: \lsmy-bi-lighthouse-front\src\views\BIView\ProductSupply\ChannelOverviewRealTimePerformance\components\ChannelDetails\components\Select3.vue
-->
<template>
    <div style="display: flex;flex-direction: column;align-items: flex-start;">
        <a-radio-group v-model="type1" name="radioGroup" :default-value="1" style="margin-bottom: 10px">
            <a-radio :value="1">
            区域
            </a-radio>
            <a-radio :value="2">
            大区
            </a-radio>
            <a-radio :value="3">
            片区
            </a-radio>
            <a-radio :value="4">
            店铺
            </a-radio>
        </a-radio-group>
        <div style="display: flex;">
            <virtual-select
                style="width: 275px;margin-right: 20px"
                v-model="S_OR_N"
                label="区域选项"
                :options="S_OR_NArr.map((_) => ({ label: _ }))"
            ></virtual-select>
            <virtual-select
                v-if="type1 > 1"
                style="width: 275px;margin-right: 20px"
                v-model="AREA_NAME"
                label="大区选项"
                :options="AREA_NAMEArr.map((_) => ({ label: _ }))"
            ></virtual-select>
            <virtual-select
                v-if="type1 > 2"
                style="width: 275px;margin-right: 20px"
                v-model="SUB_AREA_NAME"
                label="片区选项"
                :options="SUB_AREA_NAMEArr.map((_) => ({ label: _ }))"
            ></virtual-select>
            <virtual-select
                v-if="type1 > 3"
                style="width: 275px;margin-right: 20px"
                v-model="SHOP_NAME"
                label="店铺选项"
                :options="SHOP_NAMEArr.map((_) => ({ label: _ }))"
            ></virtual-select>
        </div>
    </div>
</template>

<script>
import VirtualSelect from '@/views/BIView/components/VSelect/VSelect'
import _ from 'lodash'
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
        },
    },
    created() {
        this.getArr()
        this.getData()
    },
    computed: {
        selects() {
            return this.S_OR_N.toString() + '&&' + this.AREA_NAME.toString() + '&&' + this.SUB_AREA_NAME.toString() + '&&' + this.SHOP_NAME.toString()
        }
    },
    watch: {
        selects: {
            handler() {
                this.$emit('changeSelectOptions', {
                    name: '线下区域',
                    S_OR_N: this.S_OR_N.toString(),
                    AREA_NAME: this.AREA_NAME.toString(),
                    SUB_AREA_NAME: this.SUB_AREA_NAME.toString(),
                    SHOP_NAME: this.SHOP_NAME.toString(),
                })
            },
        },
        type1: {
            handler(val) {
                if(val === 1) {
                    this.$emit('update:col1',5)
                    this.AREA_NAME = [].concat()
                    this.SUB_AREA_NAME = [].concat()
                    this.SHOP_NAME = [].concat()
                }
                else if(val === 2){
                    this.$emit('update:col1',6)
                    this.SUB_AREA_NAME = [].concat()
                    this.SHOP_NAME = [].concat()
                }
                else if(val === 3){
                    this.$emit('update:col1',7)
                    this.SHOP_NAME = [].concat()
                }
                else if(val === 4){
                    this.$emit('update:col1',8)
                }
            }
        },
        S_OR_N: {
            handler(val) {
                this.getData()
                if(val.length) {
                    let subArr = this.allOption.filter(item => {
                        return val.indexOf(item.S_OR_N) > -1
                    })
                    this.AREA_NAMEArr= Object.freeze(Array.from(new Set(subArr.map(_ => _.AREA_NAME))))
                    this.SUB_AREA_NAMEArr= Object.freeze(Array.from(new Set(subArr.map(_ => _.SUB_AREA_NAME))))
                    this.SHOP_NAMEArr= Object.freeze(Array.from(new Set(subArr.map(_ => _.SHOP_NAME))))
                }else{
                    this.AREA_NAMEArr= Object.freeze(Array.from(new Set(this.allOption.map(_ => _.AREA_NAME))))
                    this.SUB_AREA_NAMEArr= Object.freeze(Array.from(new Set(this.allOption.map(_ => _.SUB_AREA_NAME))))
                    this.SHOP_NAMEArr= Object.freeze(Array.from(new Set(this.allOption.map(_ => _.SHOP_NAME))))
                }
            }
        },
        AREA_NAME: {
            handler(val) {
                this.getData()
                if(val.length) {
                    let subArr = this.allOption.filter(item => {
                        return val.indexOf(item.AREA_NAME) > -1
                    })
                    this.SUB_AREA_NAMEArr= Object.freeze(Array.from(new Set(subArr.map(_ => _.SUB_AREA_NAME))))
                    this.SHOP_NAMEArr= Object.freeze(Array.from(new Set(subArr.map(_ => _.SHOP_NAME))))
                }else{
                    let name = ['S_OR_N']
                    let subArr = this.allOption.concat()
                    name.forEach(item => {
                        if(this[item].length){
                            subArr = this.allOption.filter(_ => {
                                return this[item].indexOf(_[item]) > -1
                            })
                        }
                    })
                    this.SUB_AREA_NAMEArr= Object.freeze(Array.from(new Set(subArr.map(_ => _.SUB_AREA_NAME))))
                    this.SHOP_NAMEArr= Object.freeze(Array.from(new Set(subArr.map(_ => _.SHOP_NAME))))
                }
            }
        },
        SUB_AREA_NAME: {
            handler(val) {
                this.getData()
                if(val.length) {
                    let subArr = this.allOption.filter(item => {
                        return val.indexOf(item.SUB_AREA_NAME) > -1
                    })
                    this.SHOP_NAMEArr= Object.freeze(Array.from(new Set(subArr.map(_ => _.SHOP_NAME))))
                }else{
                    let name = ['S_OR_N','AREA_NAME']
                    let subArr = this.allOption.concat()
                    name.forEach(item => {
                        if(this[item].length){
                            subArr = this.allOption.filter(_ => {
                                return this[item].indexOf(_[item]) > -1
                            })
                        }
                    })
                    this.SHOP_NAMEArr= Object.freeze(Array.from(new Set(subArr.map(_ => _.SHOP_NAME))))
                }
            }
        },
        SHOP_NAME: {
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
    data() {
        this.getData = _.debounce(this.getData, 100, {
            leading: false,
            trailing: true
        })
        return {
            type1: 1,
            allOption: [],
            // 区域
            S_OR_N: [],
            S_OR_NArr: [],
            // 大区
            AREA_NAME: [],
            AREA_NAMEArr: [],
            // 片区
            SUB_AREA_NAME: [],
            SUB_AREA_NAMEArr: [],
            // 店铺
            SHOP_NAME: [],
            SHOP_NAMEArr: [],
        }
    },
    methods: {
        async getArr() {
            let map = ['全司视角', '全中视角', '品市视角']
            let params = {
                CHANNEL_VIEW: map[this.currentView - 1],
            }
            let res = await this.$fetchSql('real_time', 'real_time_off_scr',params)
            this.allOption = res.data.concat()
            this.S_OR_NArr= Object.freeze(Array.from(new Set(res.data.map(_ => _.S_OR_N))))
            this.AREA_NAMEArr= Object.freeze(Array.from(new Set(res.data.map(_ => _.AREA_NAME))))
            this.SUB_AREA_NAMEArr= Object.freeze(Array.from(new Set(res.data.map(_ => _.SUB_AREA_NAME))))
            this.SHOP_NAMEArr= Object.freeze(Array.from(new Set(res.data.map(_ => _.SHOP_NAME))))
        },
        async getData() {
            let map = ['全司视角', '全中视角', '品市视角']
            let params = {
                CHANNEL_VIEW: map[this.currentView - 1],
            }
            let arr = ['S_OR_N', 'AREA_NAME', 'SUB_AREA_NAME','SHOP_NAME']
            arr.splice(this.type1)
            arr.forEach(item => {
                if(this[item].length) {
                    params[item] = this[item].toString()
                }
            })
            let api = ['real_time_off_area', 'real_time_off_big_area', 'real_time_off_sub_area', 'real_time_off_shop']
            let res = await this.$fetchSql('real_time', api[this.type1 - 1], params)
            let obj = this.computeSum(res.data)
            obj[arr[this.type1 - 1]] = '汇总'
            // if(this.SHOP_NAME.length > 0) obj.SHOP_NAME = '汇总'
            let arr1 = res.data.concat()
            // 每页插入一条汇总 number为插入次数
            let number = arr1.length / 9
            let newArr = []
            for(let i = 0; i < number; i++) {
                newArr.push(obj)
                newArr = newArr.concat(arr1.slice(9 * i, 9 * (i+1)))
            }
            arr1.sort((a, b) => b.SALES_TARGET - a.SALES_TARGET)
            let newArr1 = []
            for(let i = 0; i < number; i++) {
                newArr1.push(obj)
                newArr1 = newArr1.concat(arr1.slice(9 * i, 9 * (i+1)))
            }
            this.$emit('callBack', {data: newArr, sortData: newArr1, name: 'select1'})

            // 每页插入一条汇总 number为插入次数
            // let number = res.data.length / 9
            // let newArr = []
            // for(let i = 0; i < number; i++) {
            //     newArr.push(obj)
            //     newArr = newArr.concat(res.data.slice(9 * i, 9 * (i+1)))
            // }

            // res.data.unshift(obj)
            // this.$emit('callBack', res.data)
        },
        computeSum(data) {
            let obj = {
                SALES_TARGET: 0,
                SALE_AMT: 0,
            }
            data.forEach(item => {
                for(let key in obj) {
                    obj[key] += item[key]
                }
            })
            if([0, null, undefined].includes(obj.SALE_AMT) || [0, null, undefined].includes(obj.SALES_TARGET)) obj.CMP_RATE = '——'
            else obj.CMP_RATE = obj['SALE_AMT'] / obj['SALES_TARGET']
            return obj
        }
    }
}
</script>

<style lang='scss' scoped>

</style>