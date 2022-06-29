<template>
    <div @click="clickTable" class="Table" @mouseleave="mouseenter(null, null)">
        <div class="col1">
            <div class="row" v-for="(item,index) in labelData" :key="index" :title="item"
                 @mouseenter="mouseenter(0, index)"
                 :style="[{background: ((curRow === index && index !== 0) || (curCol === 0 && index !== 0)) ? hoverColor : null}]"
            >{{ item }}
            </div>
        </div>
        <div class="col" v-for="(item, index) in tableData" :key="index">
            <template v-if="index !== 0">
                <div :class="['row', handlerColor(index1, item1, item, index)]" v-for="(item1, index1) in item"
                     :key="index1"
                     :title="handlerNum(index1,item1,item)"
                     @contextmenu="openMenu($event, handlerNum(index1, item1, item, index))"
                     @mouseenter="index1 === 0 ? mouseenter(null, null) : mouseenter(index + 1, index1)"
                     :style="[{background: ((curRow === index1 && index1 !== 0) || (curCol === index + 1 && index1 !== 0)) ? hoverColor : null}]"
                >{{ handlerNum(index1, item1, item, index) }}
                </div>
            </template>
            <template v-if="index === 0">
                <div :class="['row', handlerColor(index1, item1, item, index)]" v-for="(item1, index1) in item"
                     :key="index1"
                     :title="handlerNum(index1,item1,item)"
                     @contextmenu="openMenu($event, handlerNum(index1, item1, item, index))"
                     @mouseenter="index1 === 0 ? mouseenter(null, null) : mouseenter(index + 1, index1)"
                     style="text-align: left;position: relative"
                     :style="[{background: ((curRow === index1 && index1 !== 0) || (curCol === index + 1 && index1 !== 0)) ? hoverColor : null}]"
                >
                    <span style="position: absolute;left: 50%;transform: translateX(-50%)">{{ handlerNum(index1, item1, item, index) }}</span>
                    <div v-if="index1 !== 0" :style="[{width: `${item1 * 100}%`}]" style="background: #BAE7FF;height: calc(100% - 8px);text-align: center;line-height: 16px;margin: 4px 0px">
<!--                        {{ handlerNum(index1, item1, item, index) }}-->
                    </div>
                </div>
            </template>
        </div>
        <template v-if="!tableData.length">
            <div class='col' v-for="index in (1 - tableData.length)" :key="'empty' + index">
                <div :class="['row']" v-for="(item,index1) in  labelData.length" :key="index1">/</div>
            </div>
        </template>
        <div v-if="menuVisible" class="selectMenu" :style="[{left: menuX},{top: menuY}]">
            <div class="item box" v-clipboard="currentRow">复制内容</div>
        </div>
    </div>
</template>

<script>
import moment from 'moment'
import base from '../../../utils/base'

export default {
    name: 'TableComp',
    mixins: [base],
    props: {
        tableData: {
            type: Array
        },
        labelData: {
            type: Array
        },
        index: {
            type: [Number, String]
        }
    },
    mounted() {
        document.body.addEventListener('click', () => {
            if (this.menuVisible) this.menuVisible = !this.menuVisible
        })
    },
    data() {
        return {
            menuVisible: false,
            menuX: '0px',
            menuY: '0px',
            currentRow: '',
            curRow: null,
            curCol: null,
            // rgba(65,105,225,0.10)
            // hoverColor: '#edfcf6',
            hoverColor: 'rgba(135,206,250, 0.2)'
        }
    },
    methods: {
        clickTable(e) {
            this.$emit('click', e)
        },
        mouseenter(col, row) {
            this.curCol = col
            this.curRow = row
        },
        // 右键展开菜单
        openMenu(e, text) {
            e.preventDefault();
            // this.menuX = e.x + 'px'
            // this.menuY = e.y + 'px'
            this.menuX = e.target.offsetLeft + e.offsetX + 'px'
            this.menuY = e.target.offsetTop + e.offsetY + 'px'
            // this.menuX = e.layerX + 'px'
            // this.menuY = e.layerY + 'px'
            this.currentRow = text
            this.menuVisible = true
        },
        handlerNum(p, val) {
            if(p === 0) return val
            return this.handleNum('percent', val)
        },
        handlerColor(p, val, item, col) {
            if(col === 3 || col === 5) {
                if(val > 0) return 'red'
                else if(val < 0) return 'green'
            }
            return
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../../../assets/styles.scss';

.Table {
    display: flex;
    position: relative;

    .col1, .col {
        flex: 1;
        overflow: hidden;

        .row {
            height: 25px;
            line-height: 25px;
            font-size: 12px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            font-family: PingFangSC-Regular, PingFang SC;
            color: rgba(0, 0, 0, 0.88);
        }
    }

    //.col:nth-child(2) {
    //    min-height: 100px;
    //    //background: aqua !important;
    //    .row div{
    //        line-height: 16px;
    //    }
    //}

    .col1 {
        min-width: 105px;
        max-width: 105px;
    }

    .col1 {
        .row {
            padding: 0 8px;
            border-top: 1px solid #e7e9f0;
            border-right: 1px solid #e7e9f0;
            border-left: 1px solid #e7e9f0;
        }

        .row:nth-last-child(1) {
            border: 1px solid #e7e9f0
        }

        .row:nth-child(2n - 1) {
            //background: #fcfcff;
            background: #fafafa;
        }

        .row:nth-child(1) {
            //background: #f5f7ff;
            background: #F5F7FF;
        }

        .red {
            color: $red
        }

        .green {
            color: $green
        }
    }

    .col {
        .row {
            padding: 0 8px;
            border-top: 1px solid #e7e9f0;
            border-right: 1px solid #e7e9f0;
            text-align: right;
            cursor: text;
        }

        .row:nth-last-child(1) {
            border-top: 1px solid #e7e9f0;
            border-right: 1px solid #e7e9f0;
            border-bottom: 1px solid #e7e9f0;
        }

        .row:nth-child(2n - 1) {
            //background: #fcfcff;
            background: #fafafa;
        }

        .row:nth-child(1) {
            //background: #f5f7ff;
            background: #F5F7FF;
        }

        // .row:nth-child(2n) {
        //     background: #f5f5f5;
        // }
        .red {
            color: $red
        }

        .green {
            color: $green
        }
    }

    //.col:hover .row{
    //    //background: rgba(230,255,251, 0.7);
    //    //background: rgba(65,105,225,0.10);
    //    //background: #edfcf6;
    //    background: rgba(135,206,250, 0.2);
    //}
    //.col:hover .row:nth-child(1) {
    //    //background: #f5f7ff;
    //    //background: rgba(65,105,225,0.10);
    //    //background: #edfcf6;
    //    background: rgba(135,206,250, 0.2);
    //}
}

.selectMenu {
    position: absolute;
    background: #fff;
    border-radius: 2px;
    border: 1px solid #ccc;
    z-index: 2;

    .item {
        cursor: text;
        padding: 5px 20px;
        font-size: 12px;
        color: #666;
    }

    .item:hover {
        background: #f3f3f3;
    }
}
</style>