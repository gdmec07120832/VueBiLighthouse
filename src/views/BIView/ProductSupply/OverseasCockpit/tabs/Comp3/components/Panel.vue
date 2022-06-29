<!--
 * @Author: 黄浩
 * @Date: 2022-01-07 11:30:49
 * @LastEditTime: 2022-02-16 16:09:28
 * @LastEditors: Please set LastEditors
 * @Descripttion: Comp3 展示top 的数据面板
 * @FilePath: \lsmy-bi-lighthouse-front\src\views\BIView\ProductSupply\OverseasCockpit\tabs\Comp3\components\Panel.vue
-->
<template>
    <div class="col2" style="position: relative">
        <div class="line1">
            <div class="block">
                <div class="top">
                    {{l1}}
                </div>
                <div :class="['bottom', handlerColor(0, v1)]" @contextmenu.prevent="openMenu($event)">
                    {{v1}}
                </div>
            </div>
            <div class="block">
                <div class="top">
                    {{l2}}
                </div>
                <div class="bottom" @contextmenu.prevent="openMenu($event)">
                    {{v2}}
                </div>
            </div>
            <div class="block">
                <div class="top">
                    {{l3}}
                </div>
                <div class="bottom" @contextmenu.prevent="openMenu($event)">
                    {{v3}}
                </div>
            </div>
        </div>
        <div class="line1">
            <div class="block">
                <div class="top">
                    {{l4}}
                </div>
                <div class="bottom" @contextmenu.prevent="openMenu($event)">
                    {{v4}}
                </div>
            </div>
            <div class="block">
                <div class="top">
                    {{l5}}
                </div>
                <div :class="['bottom', handlerColor(1, v5)]" @contextmenu.prevent="openMenu($event)">
                    {{v5}}
                </div>
            </div>
            <div class="block">
                <div class="top">
                    {{l6}}
                </div>
                <div class="bottom" @contextmenu.prevent="openMenu($event)">
                    {{v6}}
                </div>
            </div>
        </div>
        <CopyBoard ref="CopyBoard"/>
    </div>
</template>

<script>
import CopyBoard from '../../../components/CopyBoard.vue'

export default {
    components: { CopyBoard },
    props: {
        l1: {
            type: String,
            default: ''
        },
        v1: {
            type: [String, Number],
            default: ''
        },
        l2: {
            type: String,
            default: ''
        },
        v2: {
            type: [String, Number],
            default: ''
        },
        l3: {
            type: String,
            default: ''
        },
        v3: {
            type: [String, Number],
            default: ''
        },
        l4: {
            type: String,
            default: ''
        },
        v4: {
            type: [String, Number],
            default: ''
        },
        l5: {
            type: String,
            default: ''
        },
        v5: {
            type: [String, Number],
            default: ''
        },
        l6: {
            type: String,
            default: ''
        },
        v6: {
            type: [String, Number],
            default: ''
        }
    },
    mounted() {
    },
    data() {
        return {
            
        }
    },
    methods: {
        handlerColor(p, value) {
            if(this.l1 === '访客量') {
                if(p === 0) {
                    if(value == 0 || value === null || value === '--') return
                    if(this.v3.replace(/,/gi, '') <= 0) return 'red'
                    else return 'green'
                }else if(p === 1) {
                    if(value == 0 || value === null || value === '--') return
                    if(value.split('%')[0] > 0) return 'red'
                    else if(value.split('%')[0] < 0) return 'green'
                }
            }else if(this.l1 === '销量') {
                if(p === 0) {
                    if(value == 0 || value === null || value === '--') return
                    if(this.v3.replace(/,/gi, '') <= 0) return 'red'
                    else return 'green'
                }else if(p === 1) {
                    if(value == 0 || value === null || value === '--') return
                    if(value.split('%')[0] > 0) return 'red'
                    else if(value.split('%')[0] < 0) return 'green'
                }
            }else if(this.l1 === '目标') {
                if(p === 1) {
                    if(value == 0 || value === null || value === '--') return
                    if(value.split('%')[0] > 0) return 'red'
                    else if(value.split('%')[0] < 0) return 'green'
                }
            }
        },
        openMenu(e) {
            this.$refs.CopyBoard.openMenu(e, e.target.innerText)
        }
    }
}
</script>

<style lang='scss' scoped>
@import '../../../assets/styles.scss';
.col2{
    flex: 1;
    margin-top: 18px;
    line-height: 24px;
    font-size: 12px;
    display: flex;
    flex-direction: column;
    .line1{
        flex: 1;
        display: flex;
        justify-content: space-between;
        .block{
            flex: 1;
            //width: 33%;
            .top, .bottom{
                text-align: left;
                white-space: nowrap;
            }
            .bottom{
                cursor: text;
            }
        }
        .block:nth-last-child(1) {
            width: auto;
             flex: none;
            padding: 0 10px 0 0;
        }
        .block:nth-child(1) {
            // flex: 1;
            width: 33%;
        }
        .red{
            color: $red
        }
        .green{
            color: $green
        }
    }
}
</style>