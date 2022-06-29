<template>
    <div class="Table" :style="[{'grid-template-columns': `120px repeat(${datas.length ? datas.length : 12}, 1fr)`,height: 20 * labels.length + 'px'}]">
        <div class="col1" :style="[{'grid-template-rows': `repeat(${labels.length}, 1fr)`}]">
            <div class="row" v-for="(label, index) in labels" :key="index" @contextmenu="openMenu($event)">{{label}}</div>
        </div>
        <template v-if="datas.length">
            <div class="col" v-for="(col, cIndex) in datas" :style="[{'grid-template-rows': `repeat(${labels.length}, 1fr)`}]" :key="cIndex">
                <div :class="['row', computeColor(index, value)]" v-for="(value, index) in col" :key="index" :title="computeNum(index, value)" @contextmenu="openMenu($event)">{{computeNum(index, value)}}</div>
            </div>
        </template>
        <template v-else>
            <div class="col" v-for="cIndex in 12" :style="[{'grid-template-rows': `repeat(${labels.length}, 1fr)`}]" :key="cIndex">
                <div class="row" v-for="index in labels.length" :key="index">/</div>
            </div>
        </template>
        <div v-if="menuVisible" class="selectMenu" :style="[{left: menuX},{top: menuY}]">
            <div class="item box" v-clipboard="currentRow" >复制内容</div>
        </div>
    </div>
</template>

<script>
import moment from 'moment'
export default {
    name: 'Table',
    props: {
        labels: {
            type: Array,
            default() {return []}
        },
        datas: {
            type: Array,
            default() {return []}
        },
        index: {
            type: [Number,String],
        }
    },
    mounted() {
        // document.body.addEventListener('click', () => {
        //     if(this.menuVisible) this.menuVisible = !this.menuVisible
        // })
    },
    data() {
        return {
            menuVisible: false,
            menuX: '0px',
            menuY: '0px',
            currentRow: '',
        }
    },
    methods: {
        computeNum(p, value, value2) {
            if(value === '--' || value === '/') return value
            let str = ''
            let index = this.index
            if(this.index === '1A') {
                if(p === 0) {
                    str = value
                }else if(p === 1 || p === 2) {
                    str = (value / 10000).toFixed(0) + '万'
                }else if(p === 3 || p === 4) {
                    str = (value * 100).toFixed(1) + '%'
                }
            }
            else if(this.index === '1B') {
                if(p === 0) {
                    str = value
                }else if(p === 1 || p === 2) {
                    str = (value / 10000).toFixed(0) + '万'
                }else if(p === 3 || p === 4) {
                    str = (value * 100).toFixed(1) + '%'
                }
            }
            return str
        },
        // 右键展开菜单
        openMenu(e) {
            e.preventDefault();
            // this.menuX = e.x + 'px'
            // this.menuY = e.y + 'px'
            this.menuX = e.target.offsetLeft + e.offsetX + 'px'
            this.menuY = e.target.offsetTop + e.offsetY + 'px'
            // this.menuX = e.layerX + 'px'
            // this.menuY = e.layerY + 'px'
            // this.currentRow = text
            this.currentRow = e.target.innerText
            this.menuVisible = true
            let fun = () => {
                if(this.menuVisible) {
                    this.menuVisible = !this.menuVisible
                    document.body.removeEventListener('click', fun)
                }
            }
            document.body.addEventListener('click', fun)
        },
        computeColor(p, value) {
            if(value === '--' || value === '/' || value === null || value === undefined) return
            if(p === 3) {
                if(value >= 1) return 'red'
                else return 'green'
            }else if(p === 4) {
                if(value > 0) return 'red'
                else return 'green'
            }
        },
    }
}
</script>

<style lang="scss" scoped>
.red {
    color: #FF2219!important;
}
.green {
    color: #00B050!important;
}
.Table{
    position: relative;
    background: #e7e9f0;
    width: 100%;
    display: grid;
    height: auto;
    grid-template-columns: 120px repeat(16, 1fr);
    grid-template-rows: repeat(1, 1fr);
    //gap: 1px;
    //padding: 1px;
    border: 1px solid #e7e9f0;
    .col1{
        display: grid;
        .row{
            border-right: 1px solid #e7e9f0;
            width: 120px;
            padding: 0 10px;
            text-align: left;
        }
    }
    .col{
        display: grid;
        border-right: 1px solid #e7e9f0;
        .row{
            padding: 0 10px;
            text-align: right;
        }
    }
    .col:nth-last-child(1) {
        border: 0;
    }
    .row{
        border-bottom: 1px solid #e7e9f0;
        color: rgba(0, 0, 0, 0.65);
        //height: 25px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        font-size: 12px;
    }
    .row::before{
        display: inline-block;
        content: '';
        height: 100%;
        vertical-align: middle;
    }
    .row:nth-child(2n) {
        background: #fff;
    }
    .row:nth-child(2n + 1) {
        background: #fcfcff;
    }
    .row:nth-child(1) {
        background: #f5f7ff;
    }
    .row:nth-last-child(1) {
        border-bottom: 0;
    }
    .selectMenu{
        position: absolute;
        background: #fff;
        border-radius: 5px;
        border: 1px solid #ccc;
        z-index: 2;
        .item{
            cursor: pointer;
            padding: 5px 20px;
            font-size: 12px;
            color: #666;
            white-space: nowrap;
        }
        .item:hover{
            background: #f3f3f3;
        }
    }
}
</style>