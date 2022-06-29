<!--
 * @Author: 黄浩
 * @Date: 2021-12-16 17:34:09
 * @LastEditTime: 2021-12-21 18:03:18
 * @LastEditors: Please set LastEditors
 * @Descripttion: 
 * @FilePath: \lsmy-bi-lighthouse-front\src\views\BIView\ProductSupply\AuditableDataDetails\components\tab5.vue
-->
<template>
    <div>
        <Tab ref="tab" :tableColumns="tableColumns" :api="api" :query="query" :queryMap="queryMap" :startTime="startTime" :endTime="endTime" :alReady="alReady" @callBack="callBack"/>
    </div>
</template>

<script>
import Tab from './Tab.vue'
import moment from 'moment'
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
                { title: '渠道分类', dataIndex: 'MAX_CHANNEL', width: 100, ellipsis: true, sorter: true, fixed: true,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.$refs.tab.openMenu(e,text)}} title={text}>{text}</div>
                    }
                },
                { title: '渠道细分', dataIndex: 'MIN_CHANNEL', width: 100, ellipsis: true, sorter: true, fixed: true,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.$refs.tab.openMenu(e,text)}} title={text}>{text}</div>
                    }
                },
                { title: '买家昵称', dataIndex: 'CUSTOMER_NAME', width: 100, ellipsis: true, sorter: true, fixed: true,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.$refs.tab.openMenu(e,text)}} title={text}>{text}</div>
                    }
                },
                { title: '承诺发货时间', dataIndex: 'COMMIT_TIME', width: 100, ellipsis: true, sorter: true, fixed: true,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.$refs.tab.openMenu(e,moment(text).format('YYYY-MM-DD'))}} title={text === '-' ? '-' : moment(text).format('YYYY-MM-DD')}>{text === '-' ? '-' : moment(text).format('YYYY-MM-DD')}</div>
                    }
                },
                { title: '合并单号', dataIndex: 'MERGE_TRADE_NO', width: 180, ellipsis: true, sorter: true, fixed: true,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.$refs.tab.openMenu(e,text)}} title={text}>{text}</div>
                    }
                },
                { title: '批次订单号', dataIndex: 'BATCH_TRADE_NO', width: 220, ellipsis: true, sorter: true,
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
                { title: '业务员', dataIndex: 'STAFF_NAME', width: 100, ellipsis: true, sorter: true,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.$refs.tab.openMenu(e,text)}} title={text}>{text}</div>
                    }
                },
                { title: '商品编码', dataIndex: 'MATERIAL_NUMBER', width: 130, ellipsis: true, sorter: true,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.$refs.tab.openMenu(e,text)}} title={text}>{text}</div>
                    }
                },
                { title: '商品名称', dataIndex: 'MATERIAL_NAME', width: 100, ellipsis: true, sorter: true,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.$refs.tab.openMenu(e,text)}} title={text}>{text}</div>
                    }
                },
                { title: '期货标签', dataIndex: 'GOODS_TAG', width: 100, ellipsis: true, sorter: true,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.$refs.tab.openMenu(e,text)}} title={text}>{text}</div>
                    }
                },
                { title: '商品是否可货审', dataIndex: 'IF_CAN_AUDIT', width: 100, ellipsis: true, sorter: true,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.$refs.tab.openMenu(e,text)}} title={text}>{text}</div>
                    }
                },
                { title: '实际售价', dataIndex: 'ACT_PRICE', width: 100, ellipsis: true, sorter: true,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.$refs.tab.openMenu(e,text.toFixed(0))}} title={text.toFixed(0)}>{text && parseInt(text).toLocaleString()}</div>
                    }
                },
                { title: '省', dataIndex: 'DELIVER_PROVINCE', width: 100, ellipsis: true, sorter: true,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.$refs.tab.openMenu(e,text)}} title={text}>{text}</div>
                    }
                },
                { title: '市', dataIndex: 'DELIVER_CITY', width: 100, ellipsis: true, sorter: true,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.$refs.tab.openMenu(e,text)}} title={text}>{text}</div>
                    }
                },
                { title: '区', dataIndex: 'DELIVER_DISTRICT', width: 130, ellipsis: true, sorter: true,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.$refs.tab.openMenu(e,text)}} title={text}>{text}</div>
                    }
                },
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