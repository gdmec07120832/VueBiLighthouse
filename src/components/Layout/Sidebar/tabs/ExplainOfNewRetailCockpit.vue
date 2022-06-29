<template>
    <a-drawer
        class="ExplainOfNewRetailCockpit"
        wrapClassName="explain"
        width="50%"
        :closable="false"
        :visible="visible && label === '新零售驾驶舱'"
        @close="onClose"
    >
        <template class="box">
            <div class="title text-black">
                <explain style="display: none;width: 20px;height: 20px;transform: translateY(4px)"/>
                <div style="width: 3px;height: 15px;background: #46BCA0;display: inline-block;transform: translateY(2px)"></div>
                报表指标说明
            </div>
            <div style="margin-bottom: 5px;display: flex">
                <div style="font-size: 12px;color: #666;min-width: 60px">报表名称：</div>
                <div class="buttons">
                    <a-button @click="clickButton(btn)" v-for="btn in btns" size="small" :class="[{active: currentObj.CUBE_NAME === btn ? true : false}]" :key="btn">
                        {{ btn }}
                    </a-button>
                </div>
            </div>
            <div style="margin-bottom: 5px;font-size: 12px;color: #666;display: flex">
                <div style="display: flex;flex: 4">
                    <div>业务负责人：</div>
                    <div style="flex: 1">{{ currentObj.BS_OWNER }}</div>
                </div>
                <div style="display: flex;flex: 6">
                    <div>产品负责人：</div>
                    <div style="flex: 1">{{ currentObj.PRO_OWNER }}</div>
                </div>
            </div>
            <div style="margin-bottom: 5px;font-size: 12px;color: #666;display: flex">
                <div style="display: flex;flex: 4">
                    <div>数据更新：</div>
                    <div style="flex: 1">{{ currentObj.UPDATER }}</div>
                </div>
                <div style="display: flex;flex: 6">
                    <div>更新频率：</div>
                    <div style="flex: 1">{{ currentObj.UPDATE_FREQ }}</div>
                </div>
            </div>
            <div style="width: 100%;height: 1px;background: #F1F1F1;margin: 16px 0;"></div>
            <div class="select" style="display: flex;align-items: center;">
                <span style="color: rgba(0, 0, 0, 0.65);font-size: 12px">指标名称：</span>
                <a-select
                    v-model="fieldSearch.value"
                    show-search
                    option-filter-prop="children"
                    style="min-width: 180px"
                    :allowClear="true"
                    mode="multiple"
                    placeholder="请输入关键字"
                    :maxTagCount="1"
                    dropdownClassName="ExplainOfNewRetailCockpit"
                    maxTagPlaceholder="..."
                >
                    <a-select-option v-for="option in fieldSearch.options" :key="option" :value="option">
                        {{ option }}
                    </a-select-option>
                </a-select>
            </div>
            <div class="list">
                <div class="item" v-for="(item, index) in list" :key="index">
                    <div class="topBox">
                        <div class="col1">{{ item.INDEX_NAME }}</div>
                        <div style="flex: 1"></div>
                        <div>指标业务负责人：</div>
                        <div style="margin-right: 24px">{{ item.BS_OWNER }}</div>
                        <div>数据来源：</div>
                        <div>{{ item.RAW_DATA }}</div>
                    </div>
                    <div class="bottomBox">
                        <div class="row">
                            <div>业务描述：</div>
                            <div>{{ item.DESCRIPTION1 }}</div>
                        </div>
                        <div class="row">
                            <div>口径说明：</div>
                            <div>{{ item.DESCRIPTION2 }}</div>
                        </div>
                        <div class="row">
                            <div>计算公式：</div>
                            <div>{{ item.FORMULA }}</div>
                        </div>
                    </div>
                </div>
                <a-empty v-if="!list.length" style="margin: 30px 0" />
            </div>
            <div class="commonExplain">
                <div>通用型指标：</div>
                <div>
                    同比：（当期值-同期值）/同期值*100%<br/>
                    环比：（当期值-上期值）/上期值*100%<br/>
                    差值：当期值-同期值、当期值-上期值、实际值-目标值<br/>
                    完成率：实际值/目标*100%<br/>
                </div>
            </div>
        </template>
    </a-drawer>
</template>

<script>
import explain from '@/assets/svg/explain.svg'
export default {
    components: {
        explain,
    },
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
        label: {
            type: String,
            default: '',
        },
    },
    computed: {
        computeTitle() {
            return this.currentMode.title
        }
    },
    watch: {
        currentMode: {
            handler(val) {
                if(val.CUBE_NAME !== null) {
                    let value = val.CUBE_NAME
                    this.currentBtn = value
                    this.fieldSearch.options = this.fullList.filter(_ => _.CUBE_NAME === value).map(_ => _.INDEX_NAME)
                    this.handleData('contentData', this.fullList.filter(_ => _.CUBE_NAME.includes(value)))
                }
            },
            deep: true
        },
        visible: {
            handler() {
                console.log()
            }
        },
        'currentObj.CUBE_NAME': {
            handler(val) {
                if(val === undefined) {
                    this.fieldSearch.options = this.fullList.map(_ => _.INDEX_NAME)
                    this.handleData('contentData', this.fullList)
                }
                else {
                    this.fieldSearch.options = this.fullList.filter(_ => _.CUBE_NAME === val).map(_ => _.INDEX_NAME)
                    this.handleData('contentData', this.fullList.filter(_ => _.CUBE_NAME.includes(val)))
                }
            },
        },
        'fieldSearch.value': {
            handler(val) {
                if(!val.length) this.handleData('contentData', this.fullList.filter(_ => this.currentObj.CUBE_NAME == _.CUBE_NAME))
                else this.handleData('contentData', this.fullList.filter(_ => val.includes(_.INDEX_NAME)))
            }
        },
    },
    created() {
        this.getHeader()
        this.getData()
    },
    async mounted() {
        let that = this
        let obj1 = JSON.parse(localStorage.getItem('NewRetailCockpitCurrentMode'))
        if(obj1 && obj1.currentWeb === '新零售驾驶舱') this.currentMode = obj1
        this.handleData('headerData', this.headerData)
        await window.addEventListener('storage', function(e) {
            let obj = JSON.parse(localStorage.getItem('NewRetailCockpitCurrentMode'))
            if(obj && obj.currentWeb === '新零售驾驶舱') that.currentMode = obj
            that.handleData('headerData', that.headerData)
        })
    },
    data() {
        return {
            btns: [],
            currentObj: {
                CUBE_NAME: '',
                BS_OWNER: '',
                PRO_OWNER: '',
                UPDATER: '',
                UPDATE_FREQ: '',
            },
            currentMode: {
                title: null,
                comp: null,
                currentWeb: '新零售驾驶舱',
                currentIndex: 0,
                CUBE_NAME: null,
            },
            fieldSearch: {
                value: [],
                options: [],
            },
            commonExplain: [],
            fullList: [],
            list: [],
            headerData: [],
            currentData: []
        }
    },
    methods: {
        clickButton(mode) {
            this.currentObj = this.headerData.filter(_ => _.CUBE_NAME === mode)[0]
        },
        onClose() {
            this.$emit('close')
        },
        async getHeader() {
            let res = await this.$fetchSql('new_retail', 'new_retail_index_report')
            this.headerData = res.data.concat()
            this.btns = res.data.map(_ => _.CUBE_NAME)
            this.handleData('headerData', res.data)
        },
        async getData() {
            let res = await this.$fetchSql('new_retail', 'new_retail_index_state')
            this.fullList = res.data.concat()
            this.fieldSearch.options = Array.from(new Set(res.data.filter(_ => _.CUBE_NAME === '招商开店').map(_ => _.INDEX_NAME)))
            this.handleData('contentData', res.data.filter(_ => _.CUBE_NAME === '招商开店'))
        },
        handleData(type, source) {
            if(type === 'headerData') {
                if(!source.length) return
                if(this.currentMode.title === null) return
                this.currentObj = source.filter(_ => _.CUBE_NAME === this.currentMode.CUBE_NAME)[0]
            }
            if(type === 'contentData') {
                this.currentData = source.concat()
                this.list = source.concat()
            }
        }
    }
}
</script>
<style lang="scss">
.ExplainOfNewRetailCockpit{
    .ant-select-dropdown-menu-item{
        font-size: 12px;
    }
}
</style>
<style lang="scss" scoped>
.explain{
    /deep/ .ant-drawer-body{
        height: 100%;
        overflow: hidden scroll;
        padding: 16px 20px;
    }
    /deep/ .ant-select{
        font-size: 12px;
    }
    /deep/ .ant-select-dropdown-menu-item{
        font-size: 12px;
    }
    .title{
        //margin-top: 16px;
        margin-bottom: 26px;
        font-weight: bold;
        font-size: 14px;
        color: #000;
        svg g{
            fill: rgba(0, 0, 0, 0.65)
        }
    }
    .title::before{
        display: block;
        content: '';
        width: calc(100% + 48px);
        height: 1px;
        background: #F1F1F1;
        position: relative;
        top: 34px;
        left: -24px;
    }
    .buttons{
        button{
            margin-left: 10px;
            margin-bottom: 5px;
        }
        /deep/ .ant-btn:hover, .active{
            color: #fff;
            background-color: #6bc9b0;
            border-color: #6bc9b0;
        }
    }
    .staff{
        margin-bottom: 20px;
        span{
            display: inline-block;
            width: 70px;
            font-size: 12px;
            white-space: nowrap;
        }
        span:nth-child(2n - 1) {
            font-weight: bold;
            text-align: left;
        }
        span:nth-child(2n) {
            margin-left: 20px;
            text-align: left;
        }
        span:nth-child(3) {
            margin-left: 20px;
        }
    }
    .list{
        margin-top: 16px;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        color: rgba(0, 0, 0, 0.65);
        border: 1px solid #F0F0F0;
        border-radius: 2px;
        max-height: 500px;
        overflow: hidden auto;
        .item{
            .topBox{
                height: 36px;
                padding: 0 16px;
                width: 100%;
                display: flex;
                align-items: center;
                background: #F0F0F0;
                .col1{
                    font-size: 13px;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: bold;
                    color: rgba(0, 0, 0, 0.85);
                }
            }
            .bottomBox{
                padding: 12px 16px;
                .row{
                    display: flex;
                    margin-bottom: 5px;
                    &:nth-last-child(1) {
                        margin-bottom: 0;
                    }
                    div:nth-child(2) {
                        flex: 1;
                    }
                }
            }
        }
    }
    .commonExplain{
        margin-top: 12px;
        display: flex;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        color: #8C8C8C;
        line-height: 20px;
        div:nth-child(2) {
            flex: 1;
        }
    }
    .input{
        display: flex;
        align-items: flex-start;
        margin-bottom: 40px;
        span:nth-child(1){
            display: inline-block;
            width: 100px;
            text-align: right;
            font-weight: bold;
        }
        span:nth-child(1)::before{
            display: inline-block;
            margin-right: 4px;
            color: #f5222d;
            font-size: 14px;
            font-family: SimSun,sans-serif;
            line-height: 1;
            content: "*";
        }
        /deep/ textarea{
            resize: none;
        }
    }
    .upload{
        display: flex;
        align-items: flex-start;
        margin-bottom: 40px;
        span:nth-child(1){
            display: inline-block;
            width: 100px;
            text-align: right;
            font-weight: bold;
        }
    }
    .btns{
        button:nth-child(1) {
            background: #6bc9b0;
            color: #fff;
            margin-left: 36px;
        }
        button:nth-child(2) {
            margin-left: 20px;
        }
    }
}

</style>