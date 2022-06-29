<!--
 * @Author: 黄浩
 * @Date: 2022-01-10 13:37:08
 * @LastEditTime: 2022-02-15 11:45:22
 * @LastEditors: Please set LastEditors
 * @Descripttion: 指标说明
 * @FilePath: \lsmy-bi-lighthouse-front\src\views\BIView\ProductSupply\OverseasCockpit\tabs\Comp14\index.vue
-->
<template>
    <div class="Comp14" style="position: relative;overflow: hidden" @mouseleave="curCol = 0">
        <Title :label="'指标说明'" />
        <div class="select">
            <virtual-select style="width: 200px;margin-right: 10px"
                v-model="type"
                :options="typeArr.map((_) => ({ label: _ }))"
                label="分类"
            ></virtual-select>
            <virtual-select style="width: 250px;"
                v-model="name"
                :options="nameArr.map((_) => ({ label: _ }))"
                label="名称"
            ></virtual-select>
        </div>
        <div class="header">
            <div style="width: 5%;line-height: 32px">分类</div>
            <div style="width: 5%;line-height: 32px">序号</div>
            <div style="width: 5%;line-height: 32px">名称</div>
            <div style="width: 15%;line-height: 32px">名称定义</div>
            <div style="width: 30%;line-height: 32px">计算公式</div>
            <div style="width: 40%;line-height: 32px">逻辑说明</div>
        </div>
        <div style="height: calc(100% - 65px);overflow-y: scroll">
            <div class="content" style="position: relative;">
                <div class="item" v-for="(item, index) in panel" :key = index>
                    <div class="left px10" @contextmenu.prevent="openMenu($event)">
                        {{item.CLASSIFY}}
                    </div>
                    <div class="right">
                        <div class="row" v-for="(child, index1) in item.children" :key="index1">
                            <div @mouseenter="curCol = 1" :style="[{background: curCol === 1 ? 'rgba(65,105,225,0.10)' : null}]"
                                 class="col2 px10" @contextmenu.prevent="openMenu($event)">{{child.XUHAO}}</div>
                            <div @mouseenter="curCol = 2" :style="[{background: curCol === 2 ? 'rgba(65,105,225,0.10)' : null}]"
                                 class="col3 px10" @contextmenu.prevent="openMenu($event)">{{child.KPINAME}}</div>
                            <div @mouseenter="curCol = 3" :style="[{background: curCol === 3 ? 'rgba(65,105,225,0.10)' : null}]"
                                 class="col4 px10" @contextmenu.prevent="openMenu($event)">{{child.DEFOFKPI}}</div>
                            <div @mouseenter="curCol = 4" :style="[{background: curCol === 4 ? 'rgba(65,105,225,0.10)' : null}]"
                                 class="col5 px10" @contextmenu.prevent="openMenu($event)" v-html="child.NLMS"></div>
                            <div @mouseenter="curCol = 5" :style="[{background: curCol === 5 ? 'rgba(65,105,225,0.10)' : null}]"
                                 class="col6 px10" @contextmenu.prevent="openMenu($event)" v-html="child.LOGISPE"></div>
                        </div>
                    </div>
                </div>
                <CopyBoard ref="CopyBoard"/>
            </div>
        </div>
    </div>
</template>

<script>
import Title from '../../components/Title'
import VirtualSelect from '@/views/BIView/components/VSelect/VSelectV3'
import CopyBoard from '../../components/CopyBoard.vue'
export default {
    components: {
        VirtualSelect,
        CopyBoard,
        Title
    },
    watch: {
        type: {
            handler(val) {
                if(val.length) {
                    this.nameArr = Object.freeze(Array.from(new Set(this.panelData.filter(_ => val.indexOf(_.CLASSIFY) > -1).map(_ => _.KPINAME))))
                }else {
                    this.nameArr = Object.freeze(Array.from(new Set(this.panelData.map(_ => _.KPINAME))))
                }
                this.handleData(1, this.panelData)
            },
        },
        name: {
            handler() {
                this.handleData(1, this.panelData)
            }
        }
    },
    created() {
        this.getData()
    },
    data() {
        return {
            type: [],
            typeArr: [],
            name: [],
            nameArr: [],
            panelData: [],
            panel: [
                {
                    CLASSIFY: '销售发货',
                    children: [
                        {
                            XUHAO: 1,
                            KPINAME: '名称',
                            DEFOFKPI: '名称定义',
                            NLMS: '计算公式',
                            LOGISPE: '逻辑说明'
                        },
                        {
                            XUHAO: 1,
                            KPINAME: '名称',
                            DEFOFKPI: '名称定义',
                            NLMS: '计算公式',
                            LOGISPE: '逻辑说明'
                        }
                    ]
                },
                {
                    CLASSIFY: '访客分析',
                    children: [
                        {
                            XUHAO: 1,
                            KPINAME: '名称',
                            DEFOFKPI: '名称定义',
                            NLMS: '计算公式',
                            LOGISPE: '逻辑说明'
                        }
                    ]
                }
            ],
            curCol: 0
        }
    },
    methods: {
        openMenu(e) {
            this.$refs.CopyBoard.openMenu(e, e.target.innerText)
        },
        async getData() {
            let res =  await this.$fetchSql('oversea_cockpit', 'oversea_index_state')
            this.typeArr = Object.freeze(Array.from(new Set(res.data.map(_ => _.CLASSIFY))))
            this.nameArr = Object.freeze(Array.from(new Set(res.data.map(_ => _.KPINAME))))
            this.panelData = res.data.concat()
            this.handleData(1, res.data)
        },
        handleData(type, source) {
            if(type === 1) {
                this.panel = []
                if(!source.length) return
                source = source.map(_ => {
                    return {
                        ..._,
                        LOGISPE: _.LOGISPE.replace(/\n/g, '<br/>'),
                        NLMS: _.NLMS.replace(/\n/g, '<br/>')
                    }
                })
                // 筛选数据
                let type1 = !this.type.length ? this.typeArr.concat() : this.type.concat()
                let name = !this.name.length ? this.nameArr.concat() : this.name.concat()
                let arr = source.filter(_ => type1.indexOf(_.CLASSIFY) > -1 && name.indexOf(_.KPINAME) > -1)
                type1 = Array.from(new Set(arr.map(_ => _.CLASSIFY)))
                this.panel = type1.map(CLASSIFY => {
                    return {
                        CLASSIFY,
                        children: arr.filter(_ => _.CLASSIFY === CLASSIFY)
                    }
                })
            }
        }
    }
}
</script>

<style lang='scss' scoped>
.Comp14{
    flex: 1;
    padding: 10px 20px;
    .select{
        display: flex;
        padding: 0 0 0 10px;
        /deep/ span {
            color: #999!important;
        }
    }
    .header{
        color: #808492;
        width: calc(100% - 8px);
        display: flex;
        border-bottom: 1px solid #e4eaec;
        div{
            padding: 0 10px
        }
    }
    .content{
        color: #999;
        .item{
            display: flex;
            border-bottom: 1px solid #e4eaec;
            .left{
                width: 5%;
                display: flex;
                align-items: center;
                //border-left: 1px solid #e4eaec;
                //border-right: 1px solid #e4eaec;
            }
            .right{
                flex: 1;
                .row:hover div{
                    //background: #e6fffb;
                    //background: rgba(230,255,251, 0.7);
                    background: rgba(65,105,225,0.10);
                }
                .row{
                    display: flex;
                    height: 100px;
                    border-bottom: 1px solid #e4eaec;
                    cursor: text;
                    .col2, .col3, .col4, .col5, .col6{
                        display: flex;
                        align-items: center;
                    }
                    .col2{
                        width: calc(500% / 95);
                    }
                    .col3{
                        width: calc(500% / 95);
                    }
                    .col4{
                        width: calc(1500% / 95);
                    }
                    .col5{
                        width: calc(3000% / 95);
                    }
                    .col6{
                        width: calc(4000% / 95);
                        
                    }
                }
                .row:nth-last-child(1) {
                    border-bottom: none;
                }
                //.row:nth-child(2n - 1) {
                //    background: #f5f5f5;
                //}
            }
        }
    }
}
</style>