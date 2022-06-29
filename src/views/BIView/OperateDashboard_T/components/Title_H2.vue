<template>
    <div class="Title" :class="className" :style="styleName">
        <span class="text-black label">{{ label }}</span>
        <a-tooltip v-if="ps" placement="right" overlayClassName="overseasCockpitTooltip">
            <template slot="title">
                <div v-html="ps" class="tooltip" style="font-size: 14px;background: transparent;color: #bbb"></div>
            </template>
            <a-icon type="question-circle" class="text-gary" style="cursor: pointer;transform: translateY(-3px);margin-left: 4px;"></a-icon>
        </a-tooltip>
        <Jump class="jump" style="cursor: pointer" @click.native="clickJump" v-if="jump"/>
    </div>
</template>

<script>
import Jump from './Jump.vue'
import { debounce } from 'lodash'
export default {
    name: 'Title',
    components: {
        Jump
    },
    props: {
        label: {
            type: String,
            default: '标题'
        },
        className: {
            type: String,
            default: '',
        },
        styleName: {
            type: String,
            default: ''
        },
        ps: {
            type: String,
            default: null
        },
        jump: {
            type: Boolean,
            default: false
        },
        // 页面id
        jumpTarget: {
            type: Array,
            // 测试id, 生产id
            default() {return ['#', '#']}
        }
    },
    created() {
        this.getUrl()
    },
    data() {
        this.clickJump = debounce(this.clickJump, 200)
        return {
            url: '#'
        }
    },
    methods: {
        clickJump() {
            let msg = {
                url: this.url,
                webTitle: '经营驾驶舱'
            }
            window.parent.postMessage(JSON.stringify(msg), '*')
        },
        async getUrl() {
            let query = {
                versionMainNum: (process.env.VUE_APP_RELEASE_ENV !== 'pro') ? this.jumpTarget[0] : this.jumpTarget[1]
            }
            let res =  await this.$fetchSql('ALL_USER', 'getMenuIdAbsolutePathByVersionMainNum', query);
            if(!res.data.length) return
            let prefix = 'http://test.bi.linshimuye.com:9090/x/'
            if(process.env.VUE_APP_RELEASE_ENV === 'pro') prefix = 'http://bi.linshimuye.com:9090/x/'
            this.url = prefix + res.data[0].ID_ABSOLUTE_PATH
        }
    }
}
</script>

<style lang="scss" scoped>
.Title::before{
    display: inline-block;
    width: 3px;
    height: 16px;
    background: #6bc9b0;
    content: '';
    margin-right: 7px;
    //transform: translateY(2px);
}
.Title{
    width: auto;
    height: 24px;
    display: flex;
    align-items: center;
    /deep/ .Jump {
        margin-top: 4px;
        margin-left: 10px;
        color: #2F67E4;
        .svg g{
           fill: #2F67E4
        }
    }
    /deep/ .Jump:hover{
        color: #48A3FC;
        .svg g{
            fill: #48A3FC
        }
    }
        
    .jump {
        transition: all 0.2s;
    }
    .jump:hover {
        // opacity: 1;
    }
}

.label{
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.88);
    line-height: 24px;
}
</style>