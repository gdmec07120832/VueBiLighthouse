<!--
 * @Author: 黄浩
 * @Date: 2021-12-16 17:40:23
 * @LastEditTime: 2021-12-20 10:54:43
 * @LastEditors: Please set LastEditors
 * @Descripttion: 
 * @FilePath: \lsmy-bi-lighthouse-front\src\views\BIView\ProductSupply\AuditableDataDetails\components\tab3.vue
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
                { title: '业务员分组', dataIndex: 'GROUP_NAME', width: 100, ellipsis: true, sorter: true,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.$refs.tab.openMenu(e,text)}} title={text}>{text}</div>
                    }
                },
                { title: '业务员昵称', dataIndex: 'STAFF_NAME', width: 100, ellipsis: true, sorter: true,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.$refs.tab.openMenu(e,text)}} title={text}>{text}</div>
                    }
                },
                { title: '可货审金额', dataIndex: 'PTD_CAN_AUDIT_AMT', width: 100, ellipsis: true, sorter: true,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.$refs.tab.openMenu(e,text.toFixed(0))}} title={text.toFixed(0)}>{text && parseInt(text).toLocaleString()}</div>
                    }
                },
                { title: '昨天货审金额', dataIndex: 'PTD_GOODS_AUDIT_AMT', width: 100, ellipsis: true, sorter: true,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.$refs.tab.openMenu(e,text.toFixed(0))}} title={text.toFixed(0)}>{text && parseInt(text).toLocaleString()}</div>
                    }
                },
                { title: '今天货审金额', dataIndex: 'PTD_L_GOODS_AUDIT_AMT', width: 100, ellipsis: true, sorter: true,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.$refs.tab.openMenu(e,text.toFixed(0))}} title={text.toFixed(0)}>{text && parseInt(text).toLocaleString()}</div>
                    }
                },
                { title: '昨天货审数', dataIndex: 'PTD_GOODS_AUDIT_CNT', width: 100, ellipsis: true, sorter: true,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.$refs.tab.openMenu(e,text.toFixed(0))}} title={text.toFixed(0)}>{text && parseInt(text).toLocaleString()}</div>
                    }
                },
                { title: '昨天发货金额', dataIndex: 'PTD_SEND_AMT', width: 100, ellipsis: true, sorter: true,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.$refs.tab.openMenu(e,text.toFixed(0))}} title={text.toFixed(0)}>{text && parseInt(text).toLocaleString()}</div>
                    }
                },
                { title: '今天发货金额', dataIndex: 'PTD_L_SEND_AMT', width: 100, ellipsis: true, sorter: true,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.$refs.tab.openMenu(e,text.toFixed(0))}} title={text.toFixed(0)}>{text && parseInt(text).toLocaleString()}</div>
                    }
                },
                { title: '昨天发货数', dataIndex: 'PTD_SEND_CNT', width: 100, ellipsis: true, sorter: true,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.$refs.tab.openMenu(e,text.toFixed(0))}} title={text.toFixed(0)}>{text && parseInt(text).toLocaleString()}</div>
                    }
                },
                { title: '已货审未发货数量', dataIndex: 'PTD_AUDITED_WF_CNT', width: 128, ellipsis: true, sorter: true,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.$refs.tab.openMenu(e,text.toFixed(0))}} title={text.toFixed(0)}>{text && parseInt(text).toLocaleString()}</div>
                    }
                },
                { title: '已货审未发货金额', dataIndex: 'PTD_AUDITED_WF_AMT', width: 128, ellipsis: true, sorter: true,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.$refs.tab.openMenu(e,text.toFixed(0))}} title={text.toFixed(0)}>{text && parseInt(text).toLocaleString()}</div>
                    }
                },
            ]
        },
    },
    data() {
        return {
            api: 'fs_good_audit_staff'
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