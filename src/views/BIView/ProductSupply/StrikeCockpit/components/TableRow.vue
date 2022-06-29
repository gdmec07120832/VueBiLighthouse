<template>
    <div class="TableBox">
        <div ref="TableHeaderBox" class="TableHeaderBox">
            <table class="TableHeader" ref="TableHeader"></table>
        </div>
<!--        <div class="border" :style="{top: TableHeaderBoxHeight + 'px'}" style="z-index: 3"></div>-->
        <div class="TableBodyBox" ref="TableBodyBox" @scroll="scroll" :style="[{height: height},{maxHeight: maxHeight}]">
            <table class="Table" ref="Table"></table>
        </div>
        <div v-if="showBorder" style="background: #e7e9f0;width: calc(100% - 8px);height: 1px;transform: translateY(-1px)"></div>
        <!--        <div class="border" :style="{bottom: pagination.show ? '38px' : '0'}"></div>-->
        <a-pagination
            v-if="pagination.show"
            :current="pagination.page"
            :pageSize="pagination.pageSize"
            :total="pagination.total"
            @change="change"
            @showSizeChange="showSizeChange"
            :showTotal="total => `共${total}条, 第${pagination.page}页`"
            :pageSizeOptions="pagination.pageSizeOptions"
            class="mt10"
            show-size-changer
            style="display: flex;align-items: center;justify-content: flex-end"
        />
<!--            size="small"-->
    </div>
</template>

<script>
import base from '../utils/base'
import Sort from './Sort'
import Vue from 'vue'
import _ from 'lodash'
export default {
    mixins: [ base ],
    props: {
        height: {
            type: String,
            default: 'auto',
        },
        maxHeight: {
            type: String,
            default: 'none',
        },
        header: {
            type: Object,
            default() {return {}},
        },
        tableColumn: {
            type: Array,
            default() {return {}},
        },
        sum: {
            type: Object,
            default() {
                return {
                    first: {
                        show: false,
                        data: [],
                        sticky: false,
                    },
                    last: {
                        show: false,
                        data: [],
                        sticky: false,
                    },
                }
            },
        },
        dataSource: {
            type: Array,
            default() {return {}},
        },
        pagination: {
            type: Object,
            default() {return {}},
        },
        sorting: {
            type: Object,
            default(){return {field: 'rownum', order: 'asc'}}
        },
        currentClick: {
            type: Object,
            default(){return {i: 0, value: null}}
        }
    },
    data() {
        // let slot = Vue.component('Slot', {
        //     data: function () {
        //         return {
        //             value: 0
        //         }
        //     },
        //     template: '<div>{{value}}12341234</div>'
        // })
        let sort = Sort
        return {
            TableHeaderBoxHeight: 0,
            TableBodyBoxHeight: 0,
            TableHeight: 0,
            oldSorter: null,
            curRow: null,
            curCol: null,
            body: null,
            top: '25px',
            bottom: '34px',
            // row 为竖向 字段在第一行
            // column 为横向 字段在第一列
            // direction: 'column',
            // header: {
            //     area: [
            //         ['a', 'b', 'c', 'c', 'd', 'd', 'd'],
            //         ['a', 'b', 'e', 'f', 'g', 'h', 'i']
            //     ],
            //     // area: [
            //     //     // ['a', 'b', 'c', 'c', 'd', 'd', 'd'],
            //     //     ['a', 'b', 'e', 'f', 'g', 'h', 'i']
            //     // ],
            //     data: {
            //         a: '日期',
            //         b: '店铺名称',
            //         c: '总计',
            //         d: '实际',
            //         e: '总预售件数',
            //         f: '总预售业绩',
            //         g: '实际预售件数',
            //         h: '实际预售业绩',
            //         i: '实际业绩日占比',
            //     }
            // },
            // // 配置字段
            // // valueFormat sumFirstFormat sumLastFormat 可以是字符串或函数
            // tableColumn: [
            //     {key: 'day', areaName: 'a', valueFormat: 'YYYY/M/DD', sumFirstFormat: 'normal', sumLastFormat: 'normal',},
            //     {key: 'storeName', areaName: 'b'},
            //     {key: 'num', areaName: 'e', sumFirstFormat: 'round', colorFormat: 'colorFormat', sumFirstColorFormat: 'colorFormat', sumLastColorFormat: 'colorFormat'},
            //     {key: 'num1', areaName: 'f'},
            //     {key: 'day4', areaName: 'g'},
            //     {key: 'day5', areaName: 'h'},
            //     {key: 'day6', areaName: 'i'},
            // ],
            // // 合并项
            // // 首行或首列 尾行或尾列
            // sum: {
            //     first: {
            //         show: true,
            //         // 暂时只能固定一行 一列 多的会被覆盖
            //         data: [
            //             {day: '合计', storeName: '', num: 1234, num1: 123},
            //         ],
            //         sticky: true,
            //     },
            //     last: {
            //         show: true,
            //         data: [
            //             {day: '尾行', storeName: '', num: 1234, num1: 123},
            //         ],
            //         sticky: false,
            //     }
            // },
            // // 放数据
            // dataSource: [
            //     {day: '20220304', storeName: '林氏木业', num: 1234, num1: 1234},
            //     {day: '20220305', storeName: '林氏木业', num: 1000, num1: 1234},
            //     {day: '20220306', storeName: '林氏木业', num: 1234, num1: 1234},
            //     {day: '20220304', storeName: '林氏木业', num: 1234, num1: 1234},
            //     {day: '20220304', storeName: '林氏木业', num: 1234, num1: 1234},
            //     {day: '20220304', storeName: '林氏木业', num: 1234, num1: 1234},
            //     {day: '20220304', storeName: '林氏木业', num: 1234, num1: 1234},
            //     {day: '20220304', storeName: '林氏木业', num: 1234, num1: 1234},
            // ],
            // pagination: {
            //     show: true,
            //     page: 1,
            //     pageSize: 10,
            //     total: 100,
            // },
        }
    },
    watch: {
        dataSource: {
            async handler() {
                this.initTable()
                await this.$emit('update:currentClick', {
                    ...this.currentClick,
                    i: 0,
                })
                this.renderClickClass()
                this.TableHeaderBoxHeight = this.$refs.TableHeaderBox.offsetHeight
                this.TableBodyBoxHeight = this.$refs.TableBodyBox.offsetHeight
                this.TableHeight = this.$refs.Table.offsetHeight
            },
            deep: true
        },
        // TableHeight: {
        //     handler() {
        //     }
        // }
    },
    computed: {
        // 生成area映射
        vArea() {
            let area = this.header.area.concat()
            let arr = []
            area.forEach(row => arr = arr.concat(...row))
            arr = Array.from(new Set(arr))
            let vArea = {}
            arr.forEach(areaName => {
                vArea[areaName] = this.computeSpan(areaName)
            })
            return vArea
        },
        showBorder(){
            return this.TableHeight >= this.TableBodyBoxHeight
        }
    },
    mounted() {
        this.initTable()
        this.TableHeaderBoxHeight = this.$refs.TableHeaderBox.offsetHeight
        this.TableBodyBoxHeight = this.$refs.TableBodyBox.offsetHeight
        this.TableHeight = this.$refs.Table.offsetHeight
        window.addEventListener('resize', this.resizeHandler)
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.resizeHandler)
    },
    methods: {
        resizeHandler() {
            let that = this
            this.$nextTick(() => {
                setTimeout(() => {
                    that.TableHeaderBoxHeight = that.$refs.TableHeaderBox.offsetHeight
                    that.TableBodyBoxHeight = that.$refs.TableBodyBox.offsetHeight
                    that.TableHeight = that.$refs.Table.offsetHeight
                }, 300)
            })
        },
        scroll(e) {
            this.$refs.TableHeaderBox.scrollLeft = e.target.scrollLeft
        },
        change(page, pageSize) {
            this.pagination.page = page
            // console.log("=================")
            // console.log(this.pagination)
        },
        showSizeChange(current, size) {
            this.pagination.pageSize = size
        },
        async renderClickClass() {
            let tbody = this.body.children[0]
            if(this.currentClick.i > this.dataSource.length) {
                await this.$emit('update:currentClick', {
                    ...this.currentClick,
                    i: 0,
                })
            }
            if(!tbody || !tbody.children) return
            for(let row = 0; row < tbody.children.length; row ++) {
                for(let col = 0; col < tbody.children[row].children.length; col++) {
                    tbody.children[row].children[col].classList.remove('currentClick')
                    let {i, j, canclick} = tbody.children[row].children[col].dataset
                    if(i == this.currentClick.i && canclick) {
                        tbody.children[row].children[col].classList.add('currentClick')
                    }
                }
            }
        },
        initTable() {
            let area = this.header.area.concat()
            let match = this.match
            let vArea = this.vArea
            area = area.map((row, index) => {
                return Array.from(new Set(row))
            })
                .map((row, index) => {
                    let arr = []
                    area.slice(0, index).forEach(row1 => {
                        arr = arr.concat(...row1)
                    })
                    arr = Array.from(new Set([...arr]))
                    return row.filter(_ => !arr.includes(_))
                })
            let tableHeaderStr = '', str = ''
            // 生成表头
            for(let i = 0; i < area.length; i++) {
                tableHeaderStr += `<tr class="rowHeader row_${i + 1}">`
                for(let j = 0; j < area[i].length; j++) {
                    let areaName = area[i][j]
                    let parentTd = vArea[areaName].colSpan > 1 ? 'parentTd' : ''
                    let sticky = this.match(area[i][j], 'sticky')
                    tableHeaderStr +=
                        `
                        <td class="col_${areaName} ${parentTd} ${sticky}"
                        rowspan="${vArea[areaName].rowSpan}"
                        colspan="${vArea[areaName].colSpan}"
                        title="${match(areaName, 'headerData')}"
                        >
                        ${match(areaName, 'headerData')}
                        </td>
                        `
                }
                tableHeaderStr += '</tr>'
            }
            let className = this.tableColumn.map(_ => _.areaName)
            // 加首行合计
            let { show:sumFirstShow, data:sumFirstData, sticky:sumFirstSticky} = this.sum.first
            if(sumFirstShow) {
                for(let i = 0; i < sumFirstData.length; i++) {
                    let rowSticky = ''
                    if(sumFirstSticky) rowSticky = 'stickyTop'
                    str += `<tr class="row row_${area.length + i + 1} ${rowSticky}">`
                    for (let j = 0; j < this.tableColumn.length; j++) {
                        let sticky = this.match(className[j], 'sticky')
                        let color = this.match(className[j], 'sumFirstColorFormat', i)
                        let canClick = this.match(className[j], 'canClick') ? 'canClick' : ''
                        let currentClick = canClick && i === this.currentClick.i ? 'currentClick' : ''
                        str +=
                            `
                            <td class="col_${className[j]} ${sticky} ${color} ${canClick} ${currentClick}"
                            title="${ match(className[j], 'sumFirstFormat', i) }"
                            data-i=${i}
                            data-j=${j}
                            ${j === 0 ? '' : `data-hasactiveevent="true"`}
                            data-canClick=${canClick}
                            >${ match(className[j], 'sumFirstFormat', i) }</td>
                        `
                    }
                    str += '</tr>'
                }
            }
            // 生产数据列表
            let { dataSource, tableColumn} = this
            for(let i = 0; i < dataSource.length; i++) {
                let sumFirstLength = sumFirstShow ? sumFirstData.length : 0
                str += `<tr class="row row_${area.length + sumFirstLength + i + 1}">`
                for(let j = 0; j < tableColumn.length; j++) {
                    let sticky = this.match(className[j], 'sticky')
                    let color = this.match(className[j], 'colorFormat', i)
                    let canClick = this.match(className[j], 'canClick') ? 'canClick' : ''
                    let currentClick = canClick && sumFirstLength + i === this.currentClick.i ? 'currentClick' : ''
                    str += `
                        <td class="col_${className[j]} ${sticky} ${color} ${canClick} ${currentClick}"
                        title="${ match(className[j], 'valueFormat', i) }"
                        data-i=${sumFirstLength + i}
                        data-j=${j}
                        data-hasactiveevent="true"
                        data-canClick=${canClick}
                        >${match(className[j], 'valueFormat', i)}</td>
                    `
                }
                str += '</tr>'
            }
            // 加尾行合计
            let {show:sumLastShow, data:sumLastData, sticky:sumLastSticky} = this.sum.last
            if(sumLastShow) {
                for(let i = 0; i < sumLastData.length; i++) {
                    let rowSticky = ''
                    if(sumLastSticky) rowSticky = 'stickyBottom'
                    str += `<tr class="row row_${area.length + sumFirstData.length + dataSource.length + i + 1} ${rowSticky}">`
                    for (let j = 0; j < tableColumn.length; j++) {
                        let sticky = this.match(className[j], 'sticky')
                        str += `<td class="col_${className[j]} ${sticky}" title="${ match(className[j], 'sumLastFormat', i) }">${ match(className[j], 'sumLastFormat', i) }</td>`
                    }
                    str += '</tr>'
                }
            }
            this.$refs.TableHeader.innerHTML= tableHeaderStr
            this.$refs.Table.innerHTML= str
            let body = this.$refs.Table
            this.body = body
            body.addEventListener('click', (e) => {
                let { dataset } = e.target
                let { i, j, canclick} = dataset
                if(canclick) {
                    let tbody = e.target.parentElement.parentElement
                    for(let row = 0; row < tbody.children.length; row ++) {
                        tbody.children[row].children[j].classList.remove('currentClick')
                    }
                    e.target.classList.add('currentClick')
                    this.$emit('update:currentClick', {
                        i: i,
                        j: j,
                        value: e.target.innerText
                    })
                }
            })
            body.addEventListener('mouseover', (e) => {
                let { dataset } = e.target
                let { position } = dataset
                if('hasactiveevent' in dataset || position === 'inner' || position === 'innermost') {
                    let i, j
                    let target, tbody
                    if(!position) {
                        target = e.target
                        tbody = e.target.parentElement.parentElement
                    }
                    else if(position === 'inner') {
                        target = e.target.parentElement
                        tbody = e.target.parentElement.parentElement.parentElement
                    }
                    else if(position === 'innermost') {
                        target = e.target.parentElement.parentElement
                        tbody = e.target.parentElement.parentElement.parentElement.parentElement
                    }
                    this.curRow = target.dataset.i
                    this.curCol = target.dataset.j
                    i = this.curRow
                    j = this.curCol
                    target.classList.add('active')
                    for(let row = 0; row < tbody.children.length; row ++) {
                        for(let col = 0; col < tbody.children[0].children.length; col ++) {
                            tbody.children[row].children[col].classList.remove('active')
                        }
                    }
                    for(let row = 0; row < tbody.children.length; row ++) {
                        tbody.children[row].children[j].classList.add('active')
                    }
                    for(let col = 0; col < tbody.children[0].children.length; col ++) {
                        tbody.children[i].children[col].classList.add('active')
                    }
                }
            })
            body.addEventListener('mouseout', (e) => {
                let {dataset} = e.target
                let { position } = dataset
                // let {i, j, hasactiveevent} = dataset
                if('hasactiveevent' in dataset || position === 'inner' || position === 'innermost') {
                    let tbody = e.target.parentElement.parentElement
                    for (let row = 0; row < tbody.children.length; row++) {
                        for (let col = 0; col < tbody.children[0].children.length; col++) {
                            tbody.children[row].children[col].classList.remove('active')
                        }
                    }
                }
            })
            let that = this
            this.$nextTick(() => {
                for(let i = 0; i < area.length; i++) {
                    for(let j = 0; j < area[i].length; j++) {
                        let className = area[i][j]
                        let arr = this.tableColumn.filter(_ => _.areaName === className)
                        if(arr.length && 'sort' in arr[0] && [null, 'up', 'down'].includes(arr[0].sort)){
                            let index = null
                            let trList = this.$refs.TableHeader.children[0].children[0].children
                            for(let k = 0; k < trList.length; k++) {
                                if(trList[k].classList.value.indexOf('col_' + className) > -1){
                                    index = k
                                    break
                                }
                            }
                            if(index !== null) {
                                new Vue({
                                    computed: {
                                        sort() {
                                            // return <Sort :current.sync="this.sort"/>
                                            // return <Sort style="position: absolute;top: 0px;margin-left: 2px"/>
                                            return <Sort current={this.current} style="margin-left: 2px"/>
                                        }
                                    },
                                    data() {
                                        return {
                                            current: arr[0].sort,
                                            vm: that,
                                        }
                                    },
                                    render() {
                                        if(this.current !== null) this.vm.oldSorter = this
                                        return <td onclick={() => that.clickSorter(className, this, this.vm)} style="position: relative;cursor: pointer;">{trList[index].innerText}{this.sort}</td>
                                    }
                                }).$mount(trList[index])
                            }
                        }
                    }
                }
            })
            // 渲染 slot bar
            this.$nextTick(() => {
                for(let num = 0; num < area[0].length; num++) {
                    let arr = this.tableColumn.filter(_ => _.areaName === area[0][num])
                    if(!this.sum.first.show) break
                    if(arr[0] !== undefined && arr[0].slot === 'bar') {
                        // let value = this.sum.first.data[0].num1
                        let value = this.match(area[0][num], 'sumFirstFormat', 0)
                        let width = this.sum.first.data[0][arr[0].key]
                        // match(className[j], 'sumFirstFormat', i)
                        let targetTr = this.$refs.Table.children[0].children[0].children[num]
                        let className = this.match(area[0][num], 'sumFirstColorFormat', 0)
                        targetTr.style.position = 'relative'
                        targetTr.innerHTML = this.renderBar(value, width, className)
                    }
                }
                for(let i = 0; i < dataSource.length; i++) {
                    for(let j = 0; j < area[0].length; j++) {
                        let className = area[0][j]
                        let slot = this.match(className, 'slot', i)
                        if(slot){
                            let index = null
                            let trList = this.$refs.Table.children[0].children[i + 1].children
                            for(let k = 0; k < trList.length; k++) {
                                if(trList[k].classList.value.indexOf('col_' + className) > -1){
                                    index = k
                                    break
                                }
                            }
                            if(index !== null) {
                                let slot = this.match(className, 'slot', i)
                                trList[index].style.position = 'relative'
                                trList[index].innerHTML = slot
                            }
                        }
                    }
                }
            })
        },
        clickSorter(areaName, that, vm) {
            if(this.oldSorter !== null && this.oldSorter.sort !== that.sort){
                this.oldSorter.sort.componentInstance.reset()
                this.oldSorter.current = null
            }
            switch (that.current) {
                case null:
                    that.current = 'up'
                    break;
                case 'up':
                    that.current = 'down'
                    break;
                case 'down':
                    that.current = null
                    break;
            }
            let arr = this.tableColumn.filter(_ => _.areaName === areaName)
            let field
            if(arr.length) field = arr[0].key
            that.sort.componentInstance?.click()
            let order = that.current
            const orderMap = {
                up: 'asc',
                down: 'desc',
            }
            if (field && order) {
                field = `${field}`
                order = orderMap[order]
            }
            else {
                field = 'rownum'
                order = 'asc'
            }
            let obj = {
                field,
                order,
            }
            vm.$emit('update:sorting', obj)
            this.oldSorter = that
        },
        computeSpan(areaName) {
            let area = this.header.area.concat()
            area = area.filter(row => row.includes(areaName)).map(row => {
                return row.filter(_ => _ === areaName).length
            })
            let colSpan = 1,rowSpan = area.length
            for(let i = 0; i < rowSpan; i++) {
                area[i] > colSpan ? colSpan = area[i] : null
            }
            return {
                rowSpan,
                colSpan,
            }
        },
        match(areaName, type = 'value', i) {
            let headerData = JSON.parse(JSON.stringify(this.header.data))
            let dataSource = this.dataSource
            let tableColumn = this.tableColumn
            if (type === 'headerData') {
                return headerData[areaName]
            }
            else if (type === 'value') {
                let arr = tableColumn.filter(_ => _.areaName === areaName)
                return dataSource[i][arr[0].key]
            }
            else if (type === 'valueFormat') {
                let arr = tableColumn.filter(_ => _.areaName === areaName)
                let value = this.match(areaName, 'value', i)
                if (!(type in arr[0])) {
                    if(value === '/') return '/'
                    if(value === undefined || value === null || value === '--') return '--'
                    return value
                }
                else {
                    if (Object.prototype.toString.call(arr[0][type]) === '[object String]') {
                        let clearZero = 'clearZero' in arr[0] ? arr[0].clearZero : false
                        return this.handleNum(arr[0][type], value, clearZero)
                    } else if (Object.prototype.toString.call(arr[0][type]) === '[object Function]') {
                        return arr[0][type](value)
                    }
                }
            }
            else if (type === 'sumFirstFormat' || type === 'sumLastFormat') {
                let arr = tableColumn.filter(_ => _.areaName === areaName)
                let { key, sumFormat } = arr[0]
                let firstOrLast = type.split('sum')[1].split('Format')[0].toLowerCase()
                if(!this.sum[firstOrLast].data.length) return '/'
                let value = this.sum[firstOrLast].data[i][key]
                if (!(type in arr[0])) {
                    if(value === '/') return '/'
                    if(value === undefined || value === null || value === '--') return '--'
                    return value
                }
                else {
                    if (Object.prototype.toString.call(arr[0][type]) === '[object String]') {
                        // let clearZero = 'clearZero' in arr[0] ? arr[0].clearZero : false
                        return this.handleNum(arr[0][type], value)
                    }
                    else if (Object.prototype.toString.call(arr[0][type]) === '[object Function]') {
                        return arr[0][type](value)
                    }
                }
            }
            else if (type === 'sticky') {
                let arr = tableColumn.filter(_ => _.areaName === areaName)
                if(arr.length && arr[0].sticky) {
                    return `sticky${arr[0].sticky.slice(0, 1).toUpperCase() + arr[0].sticky.slice(1).toLowerCase()}`
                }
                else return ''
            }
            else if (type === 'colorFormat') {
                let arr = tableColumn.filter(_ => _.areaName === areaName)
                let value = this.match(areaName, 'value', i)
                if (!(type in arr[0])) return ''
                else {
                    if (Object.prototype.toString.call(arr[0][type]) === '[object String]') {
                        return this.handleColor(arr[0][type], value)
                    } else if (Object.prototype.toString.call(arr[0][type]) === '[object Function]') {
                        return arr[0][type](value)
                    }
                }
            }
            else if (type === 'sumFirstColorFormat' || type === 'sumLastColorFormat') {
                let arr = tableColumn.filter(_ => _.areaName === areaName)
                let { key, sumFormat } = arr[0]
                let firstOrLast = type.split('sum')[1].split('ColorFormat')[0].toLowerCase()
                if(!this.sum[firstOrLast].data.length) return ''
                let value = this.sum[firstOrLast].data[i][key]
                if (!(type in arr[0])) return ''
                else {
                    if (Object.prototype.toString.call(arr[0][type]) === '[object String]') {
                        return this.handleColor(arr[0][type], value)
                    } else if (Object.prototype.toString.call(arr[0][type]) === '[object Function]') {
                        return arr[0][type](value)
                    }
                }
            }
            else if (type === 'canClick') {
                let arr = tableColumn.filter(_ => _.areaName === areaName)
                if(arr.length && arr[0].canClick) {
                    return true
                }
                else return ''
            }
            else if (type === 'slot') {
                let arr = tableColumn.filter(_ => _.areaName === areaName)
                if(!arr.length) return
                let slotValueKey = arr[0].slotValueKey
                // let arr1 = tableColumn.filter(_ => _.key === slotValueKey)
                // if(!arr.length || !arr1.length) return
                let value = this.match(areaName, 'valueFormat', i)
                let width = dataSource[i][slotValueKey]
                if (!(type in arr[0])) return ''
                else {
                    if(arr[0].slot === 'bar') {
                        return this.renderBar(value, width)
                    }
                    else return ''
                }
            }
        },
        renderBar(value, widthValue, className) {
            let width = null
            if(widthValue > 1) width = '100%'
            else width = widthValue * 100 + '%'
            return `<div style="width: 100%;height: 100%;padding: 5px 3px;position: absolute;top: 0;left: 0" data-position="inner">
                <div style="background: #BAE7FF;height: 100%;width: ${width}" data-position="innermost"></div>
                <div class="${className}" style="position: absolute;top: 50%;right: 10px;transform: translateY(-50%);white-space: nowrap" data-position="innermost">${value}</div>
            </div>`
        }
    }
}
</script>

<style lang="scss" scoped>
$tdWidth: auto;
$tdHeight: 25px;
/deep/ .red {
    color: #ff5953!important;
}
/deep/ .green {
    color: #00a854!important;
}
.TableBox{
    position: relative;
    /deep/ .TableHeaderBox{
        overflow: hidden;
        padding-right: 8px;
        .TableHeader {
            width: 100%;
            //border-color: #e7e9f0;
            table-layout: fixed;
            display: flex;
            flex-direction: column;
            .rowHeader, .row{
                flex: 1;
                height: $tdHeight;
                position: relative;
                display: flex;
                td{
                    flex: 1;
                    padding: 0 10px;
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    white-space: nowrap;
                    border-top: 1px solid #e7e9f0;
                    border-left: 1px solid #e7e9f0;
                    //width: $tdWidth;
                    background: #f5f7ff;
                    text-align: center;
                    font-size: 12px;
                    font-family: PingFangSC-Regular,PingFang SC;
                    color: rgba(0,0,0,.88);
                    left: 0px;
                    &:nth-child(1){
                        text-align: left;
                        justify-content: flex-start;
                    }
                    &:nth-last-child(1) {
                        border-right: 1px solid #e7e9f0;
                    }
                    &::before{
                        width: 0px;
                        content: '';
                        display: inline-block;
                        vertical-align: middle;
                        height: 100%;
                    }
                }
                .stickyLeft {
                    position: sticky!important;
                    position: -webkit-sticky!important;
                    left: 0;
                    z-index: 2;
                    &::after{
                        position: absolute;
                        top: 0;
                        right: 0;
                        bottom: -1px;
                        width: 30px;
                        box-shadow: inset 10px 0 8px -8px #00000026;
                        transform: translate(100%);
                        transition: box-shadow .3s;
                        transition-property: box-shadow;
                        transition-duration: 0.3s;
                        transition-timing-function: ease;
                        transition-delay: 0s;
                        content: "";
                        pointer-events: none;
                    }
                }
                .stickyRight {
                    position: sticky!important;
                    position: -webkit-sticky!important;
                    right: 0;
                    z-index: 2;
                }
                .parentTd{
                    color: #808492
                }
            }
            .row td{
                background: #fff;
            }
        }
    }
    /deep/ .TableBodyBox{
        width: 100%;
        overflow: hidden scroll;
        max-height: 300px;
        height: 300px;
        position: relative;
        .Table{
            width: 100%;
            table-layout: fixed;
            //border: 1px solid #ccc;
            //border-color: #e7e9f0;
            display: flex;
            flex-direction: column;
            .row{
                flex: 1;
                display: flex;
                height: $tdHeight;
                &:nth-child(1) {
                    //border-top: 1px solid #fafafa;
                }
                &:nth-last-child(1) {
                    td{
                        border-bottom: 1px solid #e7e9f0;
                    }
                }
                td{
                    flex: 1;
                    padding: 0 10px;
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                    white-space: nowrap;
                    overflow: hidden;
                    border-top: 1px solid #e7e9f0;
                    border-left: 1px solid #e7e9f0;
                    width: $tdWidth;
                    text-align: center;
                    font-size: 12px;
                    font-family: PingFangSC-Regular,PingFang SC;
                    color: rgba(0,0,0,.88);
                    &:nth-child(1){
                        text-align: left;
                        justify-content: flex-start;
                    }
                    &:nth-last-child(1) {
                        border-right: 1px solid #e7e9f0;
                    }
                    &::before{
                        width: 0px;
                        content: '';
                        display: inline-block;
                        vertical-align: middle;
                        height: 100%;
                    }
                }
                .active{
                    //background: rgba(135, 206, 250, 0.2)!important;
                    background: rgba(135, 206, 250, 0.2)!important;
                }
                .canClick{
                    cursor: pointer;
                    text-decoration: underline;
                    &:hover{
                        color: #4c89ff;
                    }
                }
                .currentClick{
                    color: #4c89ff!important;
                }
                &:nth-child(even) td{
                    background: #fafafa;
                }
                &:nth-child(odd) td{
                    background: #fff;
                }
                .stickyLeft {
                    position: sticky!important;
                    position: -webkit-sticky!important;
                    left: 0;
                    z-index: 2;
                    &::after{
                        position: absolute;
                        top: 0;
                        right: 0;
                        bottom: -1px;
                        width: 30px;
                        box-shadow: inset 10px 0 8px -8px #00000026;
                        transform: translate(100%);
                        transition: box-shadow .3s;
                        transition-property: box-shadow;
                        transition-duration: 0.3s;
                        transition-timing-function: ease;
                        transition-delay: 0s;
                        content: "";
                        pointer-events: none;
                    }
                }
                .stickyRight {
                    position: sticky!important;
                    position: -webkit-sticky!important;
                    right: 0;
                    z-index: 2;
                }
            }
            .stickyTop{
                position: sticky!important;
                position: -webkit-sticky!important;
                top: 0;
                z-index: 3;
                background: #fff;
                //transform: translateY(-1px);
                //&:before{
                //    position: absolute;
                //    top: -1px;
                //    content: '';
                //    //width: 100%;
                //    height: 1px;
                //    background: red;
                //}
            }
            .stickyBottom{
                position: sticky!important;
                position: -webkit-sticky!important;
                bottom: 0;
                z-index: 3;
                border-bottom: 0px solid #fff;
                //transform: translateY(2px);
            }
        }
    }
    .border{
        position: absolute;
        left: 0;
        width: calc(100% - 8px);
        height: 1px;
        background: #e7e9f0;
    }
}
</style>