<!--
 * @Author: 黄浩
 * @Date: 2022-02-11 11:18:48
 * @LastEditTime: 2022-02-11 14:03:11
 * @LastEditors: Please set LastEditors
 * @Descripttion: 
 * @FilePath: \lsmy-bi-lighthouse-front\src\views\BIView\ProductSupply\OverseasCockpit\components\CopyBoard.vue
-->
<template>
    <div v-if="menuVisible" class="selectMenu" :style="[{left: menuX},{top: menuY}]">
        <div class="item box" v-clipboard="currentRow" >复制内容</div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            menuVisible: false,
            menuX: '0px',
            menuY: '0px',
            currentRow: '',
        }
    },
    methods: {
        // 右键展开菜单
        openMenu(e,text) {
            this.menuX = e.layerX + 'px'
            this.menuY = e.layerY + 'px'
            // this.menuX = e.x + 'px'
            // this.menuY = e.y + 'px'
            this.currentRow = text
            this.menuVisible = true
            let fun = () => {
                if(this.menuVisible) this.menuVisible = !this.menuVisible
                document.body.removeEventListener('click', fun)
            }
            document.body.addEventListener('click', fun)
        },
    }
}
</script>

<style lang='scss' scoped>
.selectMenu{
    position: absolute;
    background: #fff;
    border-radius: 2px;
    border: 1px solid #ccc;
    z-index: 2;
    .item{
        white-space: nowrap;
        cursor: pointer;
        padding: 5px 20px;
        font-size: 12px;
        color: #666;
    }
    .item:hover{
        background: #f3f3f3;
    }
}
</style>