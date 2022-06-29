<template>
    <div class="Sidebar" id="Sidebar" :style="[{'box-shadow':  show ? '0px 2px 12px 0px rgba(100, 101, 102, 0.12)' : ''}]">
        <a-radio-group v-if="show" :style="[{opacity: show ? '1' : '0'}]" :value="value" @change="change" size="small">
            <a-radio-button value="1" class="aBtn">
                <explain style="width: 20px;height: 20px;" class="mt10"/>
                <p>指标说明</p>
            </a-radio-button>
            <a-radio-button value="2">
                <allscreen style="width: 20px;height: 20px" class="mt10"/>
                <p >全屏</p>
            </a-radio-button>
            <a-radio-button value="3">
                <callback style="width: 20px;height: 20px" class="mt10"/>
                <p >意见反馈</p>
            </a-radio-button>
        </a-radio-group>
        <a-button v-if="show" :key="1" :style="[{opacity: show ? '1' : '0'}]" size="small" class="button" @click="changeShow(false)">
            <right style="width: 10px;height: 10px"/>
        </a-button>
        <a-button v-if="!show" :key="2" :style="[{opacity: show ? '0' : '1'}]" size="small" class="buttonClose" @click="changeShow(true)"
        style="box-shadow: 0px 2px 12px 0px rgba(100, 101, 102, 0.12);">
            <left style="width: 10px;height: 10px"/>
        </a-button>
        <a-drawer
                wrapClassName="explain"
                width="50%"
                :closable="false"
                :visible="visible"
                @close="onClose"
        >
           <template class="box">
               <div class="title text-xl text-black">
                   <explain style="width: 20px;height: 20px;transform: translateY(4px)"/>
                   报表指标说明
               </div>
               <div class="reportForm">
                   <span>报表名称：</span>
                   <span>海外驾驶舱</span>
               </div>
               <div class="staff">
                   <span>业务负责人：</span>
                   <span>张三</span>
                   <span>产品负责人：</span>
                   <span>张三</span>
               </div>
               <div class="select" style="display: flex">
                   <virtual-select style="width: 188px;margin-right: 20px;margin-bottom: 10px"
                                   class="select"
                                   v-model="CLASSIFY"
                                   :options="CLASSIFYOption.map((_) => ({ label: _ }))"
                                   label="分类"
                   ></virtual-select>
                   <virtual-select style="width: 188px;margin-right: 0;margin-bottom: 10px"
                                   class="select"
                                   v-model="KPINAME"
                                   :options="KPINAMEOption.map((_) => ({ label: _ }))"
                                   label="指标名称"
                   ></virtual-select>
               </div>
               <div class="list">
                    <div class="labels">
                        <span title="指标名称">指标名称</span>
                        <span title="页面指标">页面指标</span>
                        <span title="计算公式">计算公式</span>
                        <span title="描述">描述</span>
                    </div>
                   <div class="items">
                       <div class="item" v-for="(item, index) in list" :key="index">
                           <span v-html="item.KPINAME" :title="item.KPINAME"></span>
                           <span v-html="item.DEFOFKPI" :title="item.DEFOFKPI"></span>
                           <span v-html="item.NLMS" :title="item.NLMS"></span>
                           <span v-html="item.LOGISPE" :title="item.LOGISPE"></span>
                       </div>
                   </div>
               </div>
               <y-pagination :pagination="pagination"></y-pagination>
           </template>
        </a-drawer>
        <a-drawer
                wrapClassName="explain"
                width="50%"
                :closable="false"
                :visible="visible1"
                @close="onClose"
        >
            <template class="box">
                <div class="title text-xl text-black">意见反馈</div>
                <div class="reportForm">
                    <span>报表名称：</span>
                    <span>海外驾驶舱</span>
                </div>
                <div class="staff">
                    <span>业务负责人：</span>
                    <span>张三</span>
                    <span>业务负责人：</span>
                    <span>张三</span>
                </div>
                <div class="input">
                    <span>意见反馈：</span>
                    <a-textarea v-model="form.message" :maxLength="500" style="width: calc(100% - 140px);display: inline-block;margin-left: 40px" placeholder="请输入意见" :auto-size="{ minRows: 10, maxRows: 10 }" allow-clear/>
                </div>
                <div class="upload">
                    <span>图片上传：</span>
                    <a-upload
                            style="width: calc(100% - 140px);display: inline-block;margin-left: 40px"
                            name="files"
                            list-type="picture-card"
                            class="avatar-uploader"
                            accept="image/*"
                            :action="action"
                            @preview="handlePreview"
                            @change="onFileChange"
                    >
                        <div v-if="form.files.length < 1">
                            <a-icon type="plus"/>
                            <div class="ant-upload-text">
                                上传
                            </div>
                        </div>
                    </a-upload>
                </div>
                <div class="btns">
                    <a-button @click="sumbit">提交</a-button>
                    <a-button @click="onClose">取消</a-button>
                </div>
                <a-modal :visible="previewVisible" title="预览" :footer="null" @cancel="handlePreviewCancel">
                    <img alt="example" style="width: 100%" :src="previewImage"/>
                </a-modal>
            </template>
        </a-drawer>
    </div>
</template>

<script>
import YPagination from '@/views/BIView/components/YPagination/YPagination'
import instance from '@/utils/axios';
import explain from '@/assets/svg/explain.svg'
import left from '@/assets/svg/left.svg'
import right from '@/assets/svg/right.svg'
import callback from '@/assets/svg/callback.svg'
import allscreen from '@/assets/svg/allscreen.svg'
import VirtualSelect from '@/views/BIView/components/VSelect/VSelectV3'

// import store from ''
export default {
    name: 'Sidebar',
    components: {
        YPagination,
        explain,
        left,
        right,
        callback,
        allscreen,
        VirtualSelect,
    },
    props: {
        value: {
            type: String
        },
        show: {
            type: Boolean,
            default: true,
        },
        el: {

        }
    },
    watch: {
        value: {
            handler(val) {
                if(val === "1") {
                    this.visible = true
                }else if(val === "2") {
                    this.requestFull()
                }else if(val === "3") {
                    this.visible1 = true
                }
            }
        },
        'pagination.page': {
            handler(val) {
                console.log(val)
                this.changePage(val)
            }
        },
        KPINAME: {
            handler(val) {
                console.log(val)
                this.changePage(this.pagination.page)
            }
        },
        CLASSIFY: {
            handler(val) {
                if(val.length) {
                    this.KPINAMEOption = Object.freeze(Array.from(new Set(this.listData.filter(_ => val.indexOf(_.CLASSIFY) > -1).map(_ => _.KPINAME))))
                }else {
                    this.KPINAMEOption = Object.freeze(Array.from(new Set(this.listData.map(_ => _.KPINAME))))
                }
            }
        }
    },
    created() {
        this.getData()
    },
    mounted() {
        let isFullscreen = false;
        const handler = () => {
            isFullscreen = document.fullscreenElement !== null;
            if (!isFullscreen) {
                this.$emit('update:value', null)
                document.removeEventListener("fullscreenchange", handler);
            }
        };
        document.addEventListener("fullscreenchange", handler);
    },
    data() {
        return {
            // show: true
            visible: false,
            visible1: false,
            listData: [],
            list: [],
            pagination: {
                page: 1,
                total: 0,
                pageSize: 5,
            },
            form: {
                message: '',
                files: [],
            },
            action: instance.defaults.baseURL + '/api/file/upload',
            previewVisible: false,
            previewImage: '',
            KPINAME: [],
            CLASSIFY: [],
            KPINAMEOption: [],
            KPINAMEOption1: [],
            CLASSIFYOption: [],
        }
    },
    methods: {
        sumbit() {
            const menuPath = this.$route.params.menuPath || ''
            console.log(this.$store.state.app)
            const trailId = menuPath.split('_').pop()
            this.$axios.post('/api/proposal/saveOrUpdate', {
                description: this.form.message,
                files: this.form.files.filter(file => file.status === 'done').map(file => ({id: file.response.data[0]})),
                menuId: trailId
            }).then(() => {
                this.$message.success('提交成功')
                this.onClose()
                // this.visible1 = false
            })
        },
        handlePreview(file) {
            this.previewImage = file.thumbUrl
            this.previewVisible = true
        },
        handlePreviewCancel() {
            this.previewVisible = false
        },
        onFileChange({fileList}) {
            this.form.files = fileList
        },
        requestFull() {
            const el = document.querySelector('#BiViewer')
            if (el.requestFullscreen) {
                el.requestFullscreen()
            } else if (el.webkitRequestFullScreen) {
                el.webkitRequestFullScreen()
            } else if (el.mozRequestFullScreen) {
                el.mozRequestFullScreen()
            } else {
                el.msRequestFullscreen()
            }
        },
        changePage(page) {
            let size = this.pagination.pageSize
            let length = 0
            let arr = this.listData.concat()
            if(this.CLASSIFY.length) {
                arr = arr.filter(_ => this.CLASSIFY.indexOf(_.CLASSIFY) > -1)
            }
            if(this.KPINAME.length) {
                arr = arr.filter(_ => this.KPINAME.indexOf(_.KPINAME) > -1)
            }
            // if(this.KPINAME.length) {
            //     this.list = this.listData.filter(_ => this.KPINAME.indexOf(_.KPINAME) > -1).slice((page - 1) * size, page * size)
            //     length = this.listData.filter(_ => this.KPINAME.indexOf(_.KPINAME) > -1).length
            // }else {
                this.list = arr.slice((page - 1) * size, page * size)
                length = arr.length
            // }
            this.pagination.total = length
        },
        async getData() {
            let res = await this.$fetchSql('oversea_cockpit', 'oversea_index_state')
            res.data = res.data.map((_) => {
                return {
                    ..._,
                    LOGISPE: _.LOGISPE.replace(/\n/g, '<br/>'),
                    NLMS: _.NLMS.replace(/\n/g, '<br/>')
                }
            })
            this.KPINAMEOption = Object.freeze(Array.from(new Set(res.data.map(_ => _.KPINAME))))
            this.CLASSIFYOption = Object.freeze(Array.from(new Set(res.data.map(_ => _.CLASSIFY))))
            this.listData = res.data.concat()
            this.pagination.page = 1
            this.changePage(1)
        },
        change(e) {
            this.$emit('update:value', e.target.value)
        },
        changeShow(val) {
            this.$emit('update:show', val)
        },
        onClose() {
            this.visible = false
            this.visible1 = false
            this.$emit('update:value', null)
        }
    }
}
</script>

<style lang="scss" scoped>
.explain{
    /deep/ .ant-drawer-body{
        height: 100%;
    }
    .title{
        margin-bottom: 64px;
        font-weight: bold;
        font-size: 16px;
        svg g{
            fill: rgba(0, 0, 0, 0.65)
        }
    }
    .title::before{
        display: block;
        content: '';
        width: calc(100% + 48px);
        height: 1px;
        background: #ddd;
        position: relative;
        top: 45px;
        left: -24px;
    }
    .reportForm{
        margin-bottom: 40px;
        span{
            display: inline-block;
            width: 70px;
            font-size: 12px;
        }
        span:nth-child(1){
            text-align: left;
            font-weight: bold;
        }
        span:nth-child(2){
            margin-left: 20px;
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
        height: calc(100% - 247px);
        .labels{
            width: calc(100% - 8px);
            height: 50px;
            background: #fafafa;
            border-radius: 4px;
            border: 1px solid #bbb;
            span{
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                display: inline-block;
                font-weight: bold;
                font-size: 12px;
                line-height: 50px;
                width: 35%;
                padding-left: 14px;
                border-right: 1px solid #bbb;
            }
            span:nth-last-child(1) {
                border-right: none;
            }
            span:nth-child(1), span:nth-child(2) {
                width: 15%;
            }
        }
        .items{
            height: calc(100% - 50px);
            overflow-y: scroll;
            .item{
                min-height: 100px;
                overflow: hidden;
                height: auto;
                border: 1px solid #bbb;
                border-top: none;
                display: flex;
                span{
                    padding: 10px;
                    display: flex;
                    align-items: center;
                    padding-left: 14px;
                    width: 35%;
                    font-size: 12px;
                    border-right: 1px solid #bbb;
                }
                span:nth-last-child(1) {
                    border-right: none;
                }
                span:nth-child(1) {
                    color: #608dff;
                }
                span:nth-child(1), span:nth-child(2) {
                    width: 15%;
                    //line-height: 130px;
                }
            }
            .item:hover{
                background: rgba(135,206,250, 0.2);
            }
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
.aBtn:hover{
    .aBtn svg g{
        fill: #00b08d;
    }
}
.Sidebar{
    width: 60px;
    height: 208px;
    position: relative;
    .button{
        width: 60px;
        height: 28px;
    }
    /deep/ .ant-btn-sm{
        padding: 0;
    }
    ///deep/ .ant-btn:nth-child(2){
    //    border-radius: 0 0 4px 4px;
    //    transition: all 0.1s linear 0.1s;
    //}
    .buttonClose{
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 20px;
        height: 80px;
        text-align: center;
    }
    ///deep/ .ant-btn:nth-child(3){
    //    border-radius: 4px;
    //}
    ///deep/ .ant-btn-sm:nth-child(3){
    //    padding: 0;
    //    transition: all 0.1s linear 0.1s;
    //}

    //.explain /deep/ .ant-drawer-body{
    //    padding: 16px;
    //}
    //.explain{
    //    //.box{
    //        /deep/ .title{
    //            margin-bottom: 40px;
    //        }
    //    //}
    //}
}
/deep/ > .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
    border-color: #6bc9b0;
    color: #fff;
    background: #6bc9b0;
}
/deep/ > .ant-radio-button-wrapper{
    //height: auto;
    height: 60px;
    width: 60px;
    padding: 0 2px;
    //border-radius: 4px 0 0 4px;
    border: 1px solid #d9d9d9;
    //color: #bbb;
    color: rgba(0, 0, 0, 0.65);
    span:nth-child(2) {
        //width: 20px;
        display: inline-block;
        word-break: break-word;
        text-align: center;
    }
}
/deep/ .ant-radio-button-wrapper:first-child {
    border-radius: 4px 4px 0 0;
}
/deep/ .ant-radio-button-wrapper:last-child {
    border-radius: 0;
}
/deep/ > .ant-radio-button-wrapper {
    color: rgba(0, 0, 0, 0.65);
    svg g {
        fill: rgba(0, 0, 0, 0.65);
    }
}
/deep/ > .ant-radio-button-wrapper:hover {
    color: #46BCA0;
    svg g {
        fill: #46BCA0;
    }
}
/deep/ > .ant-radio-button-wrapper::before{
    display: none;
}
/deep/ > .ant-radio-group{
    width: 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    transition: all 0.1s linear 0.1s;
    p{
        font-size: 12px;
        margin-bottom: 0;
    }
}
</style>