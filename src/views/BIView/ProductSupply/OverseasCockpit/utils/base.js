/*
 * @Author: 黄浩
 * @Date: 2022-01-17 11:03:36
 * @LastEditTime: 2022-02-11 11:56:11
 * @LastEditors: Please set LastEditors
 * @Descripttion: 
 * @FilePath: \lsmy-bi-lighthouse-front\src\views\BIView\ProductSupply\OverseasCockpit\utils\base.js
 */
export default {
    methods: {
        // 数值处理
        // type 1为取整加千分 2为百分比两位小数 3为取两位小数 4除以10000取整
        // removeZero 为true时返回'--'
        handleNum(type, value, removeZero = false) {
            if(removeZero && value === 0) return '--'
            if(value === '/') return '/'
            if(value === undefined || value === null || value === '--') return '--'
            let arr = [
                () => {
                    // return parseInt(value).toLocaleString()
                    // console.log((value.toFixed(0)).toLocaleString(), value, parseInt(value))
                    return Number(value.toFixed(0)).toLocaleString()
                },
                () => {
                    return (value * 100).toFixed(2) + '%'
                },
                () => {
                    return Number(value.toFixed(2)).toLocaleString()
                },
                () => {
                    return parseInt(value / 10000).toLocaleString()
                },
            ]
            if(typeof type === 'number') return arr[type - 1]()
            else if(typeof type === 'string') {
                if(type === 'tenThousand') return ((value / 10000).toFixed(0) * 1).toLocaleString() + '万'
                else if(type === 'tenThousand_one_dot') return ((value / 10000).toFixed(1) * 1).toLocaleString() + '万'
                else if(type === 'percent') return (value * 100).toFixed(0) + '%'
                else if(type === 'percent_one_dot') return (value * 100).toFixed(1) + '%'
                else if(type === 'percent_two_dot') return (value * 100).toFixed(2) + '%'
                else if(type === 'round') return ((value * 1).toFixed(0) * 1).toLocaleString()
                else if(type === 'normal') return value
                else if(type === 'toFixed1') return (value * 1).toFixed(1)
                else if(type === 'toFixed2') return (value * 1).toFixed(2)
            }
        },
        handleColor(type, val, clearZero = false) {
            if(val === '/') return ''
            if (val === null || val === undefined || (!val && val !== 0)) return ''
            if (clearZero && val === 0) return ''
            if(type === 'reach'){
                if(val >= 1) return 'red'
                else return 'green'
            }
            if(type === 'reach_reverse'){
                if(val >= 1) return 'green'
                else return 'red'
            }
            else if(type === 'YOY') {
                if(val > 0) return 'red'
                else if(val < 0) return 'green'
            }
            else if(type === 'YOY_reverse') {
                if(val > 0) return 'green'
                else if(val < 0) return 'red'
            }
            else if(type === 'diff'){
                if(val > 0) return 'red'
                else if(val < 0) return 'green'
            }
            else if(type === 'diff_reverse'){
                if(val < 0) return 'red'
                else if(val > 0) return 'green'
            }
        },
        // table分页赋值操作
        handlePage(table,source) {
            let page = table.pagination.page
            let pageSize = table.pagination.pageSize
            table.data = source.slice((page - 1) * pageSize, page * pageSize).concat()
        },
        handleYOYOrReach(type, a, b){
            if(type === 'YOY'){
                if([undefined, null].includes(a) || [undefined, null, 0].includes(b)) return null
                else return (a - b) / b
            }
            else if(type === 'reach'){
                if([undefined, null].includes(a) || [undefined, null, 0].includes(b)) return null
                else return a / b
            }
            else if(type === 'diff'){
                if([undefined, null].includes(a) || [undefined, null].includes(b)) return null
                else return a - b
            }
        },
        openMenu(e) {
            this.$refs.CopyBoard.openMenu(e, e.target.innerText)
        },
    }
}