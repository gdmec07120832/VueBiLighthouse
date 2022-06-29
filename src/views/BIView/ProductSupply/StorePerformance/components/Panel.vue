<template>
    <div class="Panel">
        <div style="grid-column-start: 1;grid-column-end: 4;text-align: center;font-size: 14px;line-height: 14px">{{label}}</div>
        <template v-for="(item, index) in panelData">
            <div class="item" :key="index">
                <div @contextmenu="openMenu($event)">{{item.label}}</div>
                <div @contextmenu="openMenu($event)" :class="[computeColor(index, item.value)]">{{computeNum(index, item.value)}}</div>
            </div>
        </template>
        <div @click.stop="menuVisible = menuVisible ? false : true" v-if="menuVisible" class="selectMenu" :style="[{left: menuX},{top: menuY}]">
            <div class="item box" v-clipboard="currentRow" @click="() => {}">复制内容</div>
        </div>
    </div>
</template>

<script>
import base from '../utils/base'
export default {
    name: 'Panel',
    mixins: [ base ],
    props: {
        panelData: {
            type: Array,
            default() {return []}
        },
        label: {
            type: String,
            default: ''
        }
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
        changeV(val) {
            console.log(val)
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
        computeNum(p, val) {
            if(val === null || val === undefined) return '--'
            if(p === 0 || p === 1 || p === 2 || p === 3) return this.handleNum('percent', val)
            else if(p === 4) return this.handleNum('tenThousand', val)
        },
        computeColor(p, val) {
            if(val === '--' || val === null || val === undefined) return
            if(p === 0 || p === 1) {
                if(val >= 1) return 'red'
                else return 'green'
            }
            else if(p === 2) {
                if(val > 0) return 'red'
                else if(val <= 0) return 'green'
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.red{
    color: #FF2219;
}
.green{
    color: #00B050;
}
.Panel {
    //width: 200px;
    height: 110px;
    border-radius: 20px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: 14px repeat(2, 1fr);
    gap: 6px;
    padding: 7px 15px;
    transition: all 0.3s ease 0s;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 1px, rgba(0, 0, 0, 0.06) 0px 1px 2px 1px;
    position: relative;
    .item{
        div{
            font-size: 12px;
            height: 50%;
        }
        div::before{
            display: inline-block;
            content: '';
            vertical-align: middle;
            height: 100%;
        }
    }
}
.Panel:hover{
    box-shadow: rgba(0, 0, 0, 0.2) 0px 3px 6px 2px, rgba(0, 0, 0, 0.12) 0px 3px 4px 2px;
    transform: translateY(-5px);
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
</style>