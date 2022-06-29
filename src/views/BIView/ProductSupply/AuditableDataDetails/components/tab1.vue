<!--
 * @Author: 黄浩
 * @Date: 2021-12-16 17:40:23
 * @LastEditTime: 2021-12-22 08:47:50
 * @LastEditors: Please set LastEditors
 * @Descripttion: 
 * @FilePath: \lsmy-bi-lighthouse-front\src\views\BIView\ProductSupply\AuditableDataDetails\components\tab1.vue
-->
<!--
 * @Author: 黄浩
 * @Date: 2021-12-16 17:34:09
 * @LastEditTime: 2021-12-16 17:38:24
 * @LastEditors: Please set LastEditors
 * @Descripttion: 
 * @FilePath: \lsmy-bi-lighthouse-front\src\views\BIView\ProductSupply\AuditableDataDetails\components\tab6.vue
-->
<template>
    <div>
        <Tab ref="tab" :tableColumns="tableColumns" :api="api" :query="query" :queryMap="queryMap" :startTime="startTime" :endTime="endTime" :alReady="alReady" @callBack="callBack"/>
    </div>
</template>

<script>
import Tab from './Tab.vue'
export default {
    props: {
        query: {
            type: Object
        },
        queryMap: {
            type: Object
        },
        startTime: {
            type: Object
        },
        endTime: {
            type: Object
        },
        alReady: {
            type: Boolean
        }
    },
    components: {
        Tab
    },
    computed: {
        tableColumns() {
            return [
                { title: '渠道分类', dataIndex: 'MAX_CHANNEL', width: 100, ellipsis: true, sorter: true,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.$refs.tab.openMenu(e,text)}} title={text}>{text}</div>
                    }
                },
                { title: '渠道细分', dataIndex: 'MIN_CHANNEL', width: 100, ellipsis: true, sorter: true,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.$refs.tab.openMenu(e,text)}} title={text}>{text}</div>
                    }
                },
                { title: '区域', dataIndex: 'S_OR_N', width: 100, ellipsis: true, sorter: true,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.$refs.tab.openMenu(e,text)}} title={text}>{text}</div>
                    }
                },
                { title: '大区', dataIndex: 'AREA_NAME', width: 100, ellipsis: true, sorter: true,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.$refs.tab.openMenu(e,text)}} title={text}>{text}</div>
                    }
                },
                { title: '片区', dataIndex: 'SUB_AREA_NAME', width: 100, ellipsis: true, sorter: true,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.$refs.tab.openMenu(e,text)}} title={text}>{text}</div>
                    }
                },
                { title: '业务员大分组', dataIndex: 'BIG_GROUP_NAME', width: 100, ellipsis: true, sorter: true,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.$refs.tab.openMenu(e,text)}} title={text}>{text}</div>
                    }
                },
                { title: '业务员分组', dataIndex: 'GROUP_NAME', width: 130, ellipsis: true, sorter: true,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.$refs.tab.openMenu(e,text)}} title={text}>{text}</div>
                    }
                },
                { title: '商品是否可货审', dataIndex: 'IF_CAN_AUDIT', width: 100, ellipsis: true, sorter: true,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.$refs.tab.openMenu(e,text)}} title={text}>{text}</div>
                    }
                },
                { title: '期货标签', dataIndex: 'GOODS_TAG', width: 100, ellipsis: true, sorter: true,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.$refs.tab.openMenu(e,text)}} title={text}>{text}</div>
                    }
                },
                { title: '实际售价', dataIndex: 'ACT_PRICE', width: 100, ellipsis: true, sorter: true,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.$refs.tab.openMenu(e,parseInt(text))}} title={parseInt(text)}>{text&&parseInt(text).toLocaleString()}</div>
                    }
                }
            ]
        },
    },
    data() {
        return {
            api: 'fs_good_audit_data'
        }
    },
    methods: {
        callBack(value) {
            this.$emit('update:alReady',value)
        }
    }
}
</script>

<style lang='scss' scoped>

</style>