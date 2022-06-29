<template>
  <PageWrapper>
    <div class="w1366">
      <div style="position: sticky; top: 0; padding: 20px 0; background: #f0f2f5; width: 100%; z-index: 99">
        <a-breadcrumb>
          <a-breadcrumb-item>
            <router-link to="/frame/release-version-mgmt">发版管理</router-link>
          </a-breadcrumb-item>
          <a-breadcrumb-item>
            <router-link to="/frame/release-version-mgmt">发版列表</router-link>
          </a-breadcrumb-item>
          <a-breadcrumb-item>配置内容</a-breadcrumb-item>
        </a-breadcrumb>
      </div>

      <div class="page-section">
        <div class="flex-between"
             style="margin: -20px -20px 0; height: 53px; padding: 0 20px; border-bottom: 1px solid rgba(0, 0, 0, .08)">
          <div style="font-size: 16px; font-weight: bold;">
            封面
            <span v-if="pushConfig.coverId" style="margin-left: 10px; font-size: 12px; color: rgba(0, 0, 0, .25)">
                      {{ pushConfig.lastModifierName }} 最后保存于：{{ pushConfig.updatedDate }}
                    </span>
          </div>
          <div class="flex-end">
            <a-button type="link" size="small" @click="saveIndexPage()" v-if="!disabled">保存</a-button>
            <a-button type="link" size="small" @click="previewCover">预览</a-button>
          </div>
        </div>
        <div class="mt20" style="width: 50%">
          <FieldItem required label="封面名称:">
            <CountInput :disabled="disabled" v-model="pushConfig.coverTitle" :min="4" :max="10"/>
          </FieldItem>
        </div>
        <div class="mt20" style="width: 80%">
          <FieldItem required label="说明文字:">
            <CountInput :disabled="disabled" v-model="pushConfig.descText" :min="10" :max="150"/>
          </FieldItem>
        </div>
      </div>

      <div class="page-section mt20">
        <div class="flex-between"
             style="margin: -20px -20px 0; height: 53px; padding: 0 20px; border-bottom: 1px solid rgba(0, 0, 0, .08)">
          <div style="font-size: 16px; font-weight: bold;">
            结束页
            <span v-if="lastPage.id" style="margin-left: 10px; font-size: 12px; color: rgba(0, 0, 0, .25)">
                      {{ lastPage.lastModifierName }} 最后保存于：{{ lastPage.updatedDate }}
                    </span>
          </div>
          <div class="flex-end">
            <a-button type="link" size="small" @click="saveLastPage()" v-if="!disabled">保存</a-button>
            <a-button type="link" size="small" @click="previewLastPage">预览</a-button>
          </div>
        </div>
        <div class="mt20 flex-center" style="text-align: center">
          <a-upload class="upload-placeholder"
                    :disabled="disabled"
                    accept="image/*"
                    :customRequest="uploadImage(lastPage)"
                    list-type="picture-card"
                    :show-upload-list="false">
            <img v-if="lastPage.imgUrl" :src="lastPage.imgUrl" alt="">
            <div class="empty-holder" v-else>
              <a-icon type="plus"/>
              <div class="ant-upload-text">
                上传
              </div>
            </div>
          </a-upload>
        </div>
      </div>


      <div class="mt20 page-section">
        <div class="flex-between"
             style="margin: -20px -20px 0; height: 53px; padding: 0 20px; border-bottom: 1px solid rgba(0, 0, 0, .08)">
          <div style="font-size: 16px; font-weight: bold;">内容页</div>
          <div class="flex-end"></div>
        </div>
        <div style="padding: 24px">
          <Container @drop="onDrop"
                     :should-accept-drop="shouldAcceptDrop"
                     drag-class="opacity-ghost" drop-class="opacity-ghost-drop"
                     drag-handle-selector=".drag-handle">
            <Draggable v-for="(content, index) in contentPages" :key="content.__key__">
              <div style="border: 1px solid rgba(0, 0, 0, .06);" class="mb20">
                <div class="flex-between"
                     style="height: 48px; padding-right: 16px; background: #fafafa; border-bottom: 1px solid rgba(0, 0, 0, .06)">
                  <div class="flex-start" style="user-select: none">
                    <span class="drag-handle"
                          v-if="!disabled"
                          style="cursor: move; line-height: 48px; padding-left: 10px; padding-right: 10px;">☰</span>
                    <span :style="{paddingLeft: disabled ? '10px' : '0'}">内容页{{ index + 1 }}</span>
                    <span v-if="content.id" style="margin-left: 10px; font-size: 12px; color: rgba(0, 0, 0, .25)">
                      {{ content.lastModifierName }} 最后保存于：{{ content.updatedDate }}
                    </span>
                  </div>
                  <div class="flex-end">
                    <a-button type="link" size="small" @click="saveContentPage(content, index)">保存</a-button>
                    <a-button type="link" size="small" @click="previewContent(content)">预览</a-button>
                    <a-popconfirm title="确定删除吗？" @confirm="deleteContent(content)">
                      <a-button type="link" size="small" v-if="!disabled">删除</a-button>
                    </a-popconfirm>
                  </div>
                </div>

                <div style="padding: 22px">
                  <div class="flex-start">
                    <div style="flex: 0 0 30%" class="mr20">
                      <a-upload class="upload-placeholder"
                                :disabled="disabled"
                                accept="image/*"
                                :openFileDialogOnClick="!content.imgUrl"
                                :customRequest="uploadImage(content)"
                                list-type="picture-card"
                                :show-upload-list="false">
                        <div v-if="content.imgUrl" class="img-cover-actions-wrapper">
                          <img :src="content.imgUrl" alt="">
                          <div class="img-cover-actions">
                            <div class="flex">
                              <div title="下载" class="px10" @click.stop="checkContentImg(content)">
                                <a-icon type="download"/>
                              </div>
                              <div v-if="!disabled" title="删除" class="px10" @click.stop="removeContentImg(content)">
                                <a-icon type="delete"/>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="empty-holder" v-else>
                          <a-icon type="plus"/>
                          <div class="ant-upload-text">
                            上传
                          </div>
                        </div>
                      </a-upload>
                    </div>
                    <div style="flex: 1">
                      <div style="width: 65%">
                        <FieldItem align="right" required label="报表名称:" label-width="100px" class="mb20">
                          <CountInput :disabled="disabled" v-model="content.reportName" :min="4" :max="10"/>
                        </FieldItem>
                        <FieldItem align="right" required label="数据价值:" label-width="100px" class="mb20">
                          <CountInput :disabled="disabled" v-model="content.dataValue" :min="4" :max="20"/>
                        </FieldItem>
                        <FieldItem align="right" required label="访问路径:" label-width="100px" class="mb20">
                          <v-select style="flex: 1" :disabled="disabled" v-model="content.reportPath"
                                    :options="allMenuPath"
                                    @itemClick="handleReportPathChange($event, content)"
                                    item-key-prop="value"
                                    item-label-prop="label" item-value-prop="value"/>
                        </FieldItem>
                        <FieldItem align="right" label="允许查询角色:" label-width="100px" class="mb20" required>
                          <MultipleSelect v-model="content.roles" style="flex: 1" :options="allRoles"/>
                        </FieldItem>
                      </div>
                      <div>
                        <FieldItem style="align-items: flex-start" required label-width="100px" align="right"
                                   label="功能介绍:">
                          <CountInput :disabled="disabled" v-model="content.descText" input-type="textarea" :min="20"
                                      :max="200"
                                      flex-flow="column" placeholder=""/>
                        </FieldItem>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Draggable>
          </Container>
          <template v-if="!disabled">
            <div v-if="contentPages.length < 15" class="flex flex-center addNewContentPageBtn mt20" @click="addContent">
              <a-icon type="plus"/>
              新增内容页
            </div>
            <div v-if="contentPages.length === 15" class="flex-center mt20"
                 style="color: rgba(0, 0, 0, .3); height: 40px">
              不能添加更多内容页了～
            </div>
          </template>
        </div>
      </div>
    </div>
  </PageWrapper>
</template>

<script>
import {Container, Draggable} from 'vue-smooth-dnd'
import PageWrapper from '@/views/Admin/release-version-mgmt/pageWrapper'
import FieldItem from '@/views/Admin/components/FieldItem'
import CountInput from '@/views/Admin/components/CountInput'
import ModalWrapper from '@/views/Admin/release-version-mgmt/components/modalWrapper'
import MultipleSelect from '@/views/Admin/release-version-mgmt/components/multipleSelect'
import IndexPage from '@/views/Admin/release-version-mgmt/components/indexPage'
import ContentPage from '@/views/Admin/release-version-mgmt/components/contentPage'
import VSelect from '@/components/VirtualScroll/VSelect'
import {applyDrag} from "@/utils/helper";


let i = 1

export default {
  name: 'edit',
  components: {VSelect, MultipleSelect, CountInput, FieldItem, PageWrapper, Container, Draggable},
  computed: {
    disabled() {
      // 已发布的需要禁用编辑
      return this.versionConfig.status === 1
    },
    versionId() {
      return this.$route.params.id
    }
  },
  data() {
    return {
      versionConfig: {},
      allRoles: [],
      allMenuPath: [],
      pushConfig: {
        coverId: undefined,
        coverTitle: '数据灯塔上新功能指南',
        descText: '数据感知未来，欢迎开启新章',
        lastModifierName: '',
        updatedDate: ''

      },
      lastPage: {
        id: undefined,
        lastModifierName: '',
        updatedDate: '',
        imgUrl: require('@/assets/images/release-notice/last-bg.png')
      },
      contentPages: []
    }
  },
  async created() {
    const roles = await this.getAllRoles()
    this.allRoles = roles.map(_ => ({label: _.key, value: _.value}))
    const menus = await this.getAllMenuPath()
    this.allMenuPath = menus.map(_ => ({label: _.key, value: _.value}))
  },
  async mounted() {
    this.$store.commit('app/SET_FULL_LOADING', true)
    const promise1 = this.getData()
    const promise2 = this.getPageByType(0)
    const promise3 = this.getPageByType(1)
    const promise4 = this.getPageByType(2)
    this.versionConfig = await promise1
    const [indexPage] = await promise2
    const [lastPage] = await promise4
    if (indexPage) {
      const {itemName, description, id, lastModifierName, updatedDate} = indexPage
      this.pushConfig.coverTitle = itemName
      this.pushConfig.descText = description
      this.pushConfig.coverId = id
      this.pushConfig.lastModifierName = lastModifierName
      this.pushConfig.updatedDate = updatedDate
    } else {
      this.saveIndexPage(true)
    }
    if (lastPage) {
      const {id, imgUrl, lastModifierName, updatedDate} = lastPage
      this.lastPage = {
        id, imgUrl, lastModifierName, updatedDate
      }
    } else {
      this.saveLastPage(true)
    }
    const contentPages = await promise3
    this.$store.commit('app/SET_FULL_LOADING', false)
    if (contentPages.length) {
      let ret = []
      for (let item of contentPages) {
        ret.push({
          __key__: ++i,
          ...item,
          reportPath: item.menuId,
          reportName: item.itemName,
          descText: item.description,
          roles: (item.canReadRoles || '').split(',').filter(Boolean)
        })
      }
      this.contentPages = ret
    } else {
      if (this.versionConfig.status === 0) {
        this.addContent()
      }
    }
  },
  methods: {
    getAllRoles() {
      return this.$axios.get('/api/permission/selectAllYHRolesOptions').then(({data}) => {
        return data
      })
    },
    getAllMenuPath() {
      return this.$axios.get('/api/menu/getAllActiveMenuFullPathOptions').then(({data}) => {
        return data
      })
    },
    getData() {
      const id = this.versionId
      return this.$axios.get('/api/admin/version/selectById', {
        params: {id}
      }).then(({data}) => {
        return data
      })
    },
    getPageByType(type) {
      // 0 首页 1 内容页 2 尾页
      return this.$axios.get('/api/admin/versionDetail/list', {
        params: {page: 1, pageSize: 100, detailType: type, versionId: this.versionId}
      }).then(({data: {list}}) => {
        return list
      })
    },
    shouldAcceptDrop() {
      if (this.contentPages.find(item => !item.id)) {
        this.$message.error('请先保存所有内容页，再调整顺序')
        return false
      }
      return true
    },
    onDrop(dropResult) {
      console.log(dropResult)
      const ordered = applyDrag(this.contentPages, dropResult)
      const list = ordered.map((_, index) => {
        return {id: _.id, seq: index}
      })
      const oldOrder = this.contentPages
      this.contentPages = ordered
      this.$axios.post('/api/admin/versionDetail/batchUpdateSeq', list).then(() => {
        this.$message.success('顺序调整成功')
      }).catch(() => {
        this.$message.success('顺序调整失败')
        this.contentPages = oldOrder
      })
    },
    deleteContent(content) {
      const deleteData = () => {
        const i = this.contentPages.findIndex(item => item.__key__ === content.__key__)
        if (i > -1) {
          this.contentPages.splice(i, 1)
        }
      }

      if (content.id) {
        this.$axios.get('/api/admin/versionDetail/delete', {params: {id: content.id}}).then(() => {
          deleteData()
          this.$message.success('删除成功')
        })
      } else {
        deleteData()
        this.$message.success('删除成功')
      }

    },
    addContent() {
      this.contentPages.push({
        __key__: ++i,
        id: undefined,
        lastModifierName: '',
        updatedDate: '',
        roles: [],
        reportName: '', dataValue: '', descText: '', imgUrl: '', reportPath: '',
      })
    },
    handleReportPathChange(e, content) {
      this.$store.commit('app/SET_FULL_LOADING', true)
      const p1 = this.$axios.get('/api/permission/selectYHRolesByMenuId', {
        params: {id: e}
      }).then(({data}) => {
        content.roles = (data || '').split(',').filter(Boolean)
      })
      const p2 = this.$axios.get('/api/menu/selectById', {
        params: {id: e}
      }).then(({data}) => {
        const {thumbnailUrl, cnName, dataValue, dataInfo} = data
        content.dataValue = dataValue
        content.reportName = cnName
        content.imgUrl = thumbnailUrl
        content.descText = dataInfo
      })

      Promise.allSettled([p1, p2]).then(() => {
        this.$store.commit('app/SET_FULL_LOADING', false)
      })
    },
    previewCover() {
      this.$modal.show({
        components: {ModalWrapper, IndexPage},
        props: ['detail'],
        render() {
          return <modal-wrapper>
            <index-page detail={this.detail}/>
          </modal-wrapper>
        }
      }, {
        detail: {
          coverTitle: this.pushConfig.coverTitle,
          descText: this.pushConfig.descText,
          versionName: this.versionConfig.versionName
        }
      }, {width: 1200, height: 'auto', classes: ['release-modal']})
    },
    previewContent(content) {
      this.$modal.show({
        components: {ModalWrapper, ContentPage},
        props: ['detail'],
        render() {
          return <modal-wrapper>
            <content-page detail={this.detail}/>
          </modal-wrapper>
        }
      }, {
        detail: content
      }, {width: 1200, height: 'auto', classes: ['release-modal']})
    },
    uploadImage(content) {
      return ({file}) => {
        const fd = new FormData()
        fd.append('files', file)
        this.$axios.post('/api/file/picUpload', fd).then(({data: [ret]}) => {
          content.imgUrl = ret.path.startsWith('http') ? ret.path
              : this.$axios.defaults.baseURL + '/download' + ret.path
        })
      }
    },
    checkContentImg(content) {
      console.log(content)
      const url = content.imgUrl
      window.top.open(url)
    },
    removeContentImg(content) {
      content.imgUrl = ''
    },
    // 保存尾页
    saveLastPage(silent) {
      this.$store.commit('app/SET_FULL_LOADING', true)
      this.$axios.post('/api/admin/versionDetail/insertOrUpdate', {
        imgUrl: this.lastPage.imgUrl,
        detailType: '2',
        id: this.lastPage.id,
        versionId: this.versionId
      }).then(({data}) => {
        this.lastPage.id = data.id
        this.lastPage.lastModifierName = data.lastModifierName
        this.lastPage.updatedDate = data.updatedDate
        if(!silent) {
          this.$message.success('结束页保存成功')
        }
        this.$store.commit('app/SET_FULL_LOADING', false)
      })
    },
    // 预览尾页
    previewLastPage() {
      this.previewContent(this.lastPage)
    },

    // 保存封面页
    saveIndexPage(silent) {
      const {coverTitle, descText} = this.pushConfig
      if ((coverTitle || '').length < 4 || (coverTitle || '').length > 10) {
        this.$message.error('【封面名称】长度应为4-10个字符')
        return
      }

      if ((descText || '').length < 10 || (descText || '').length > 150) {
        this.$message.destroy()
        this.$message.error('【说明文字】长度应为10-150个字符')
        return
      }

      this.$store.commit('app/SET_FULL_LOADING', true)
      this.$axios.post('/api/admin/versionDetail/insertOrUpdate', {
        imgUrl: '-1',
        itemName: this.pushConfig.coverTitle,
        description: this.pushConfig.descText,
        id: this.pushConfig.coverId,
        detailType: '0',
        versionId: this.versionId
      }).then(({data}) => {
        this.pushConfig.coverId = data.id
        this.pushConfig.updatedDate = data.updatedDate
        this.pushConfig.lastModifierName = data.lastModifierName
        if(!silent) {
          this.$message.success('封面保存成功')
        }
      }).finally(() => {
        this.$store.commit('app/SET_FULL_LOADING', false)
      })
    },
    // 保存内容页
    saveContentPage(content, index) {
      if ((content.reportName || '').length > 10 || (content.reportName || '').length < 4) {
        this.$message.destroy()
        this.$message.error('【报表名称】长度应为4-10个字符')
        return
      }

      if ((content.dataValue || '').length > 20 || (content.dataValue || '').length < 4) {
        this.$message.destroy()
        this.$message.error('【数据价值】长度应为4-20个字符')
        return
      }

      if (!content.reportPath) {
        this.$message.destroy()
        this.$message.error('【访问路径】不能为空')
        return
      }

      if (!content?.roles?.length) {
        this.$message.destroy()
        this.$message.error('【允许查询角色】不能为空')
        return
      }

      if ((content.descText || '').length > 200 || (content.descText || '').length < 20) {
        this.$message.destroy()
        this.$message.error('【功能介绍】长度应为20-200个字符')
        return
      }

      if (this.versionConfig.status === 1) {
        this.$store.commit('app/SET_FULL_LOADING', true)
        this.$axios.post('/api/admin/versionDetail/updateCanReadRolesAfterRelease', {
          id: content.id,
          canReadRoles: content.roles.toString()
        }).then(({data}) => {
          this.contentPages[index].lastModifierName = data.lastModifierName
          this.contentPages[index].updatedDate = data.updatedDate
          this.$message.success('角色更新成功')
        }).finally(() => {
          this.$store.commit('app/SET_FULL_LOADING', false)
        })
        return
      }

      if ((content.reportName || '').length < 4 || (content.reportName || '').length > 10) {
        this.$message.destroy()
        this.$message.error('【报表名称】长度应为4-10个字符')
        return
      }
      this.$store.commit('app/SET_FULL_LOADING', true)
      this.$axios.post('/api/admin/versionDetail/insertOrUpdate', {
        imgUrl: content.imgUrl,
        itemName: content.reportName,
        dataValue: content.dataValue,
        description: content.descText,
        id: content.id,
        detailType: '1',
        seq: index,
        menuId: content.reportPath,
        canReadRoles: (content.roles || []).toString(),
        versionId: this.versionId
      }).then(({data}) => {
        this.contentPages[index].id = data.id
        this.contentPages[index].lastModifierName = data.lastModifierName
        this.contentPages[index].updatedDate = data.updatedDate
        this.$message.success(`内容页${index + 1}保存成功`)
      }).finally(() => {
        this.$store.commit('app/SET_FULL_LOADING', false)
      })
    }
  }
}
</script>


<style lang="scss">
.opacity-ghost {
  transition: all .18s ease;
  opacity: 0.8;
  box-shadow: 3px 3px 10px 3px rgba(0, 0, 0, 0.3);
}

.opacity-ghost-drop {
  opacity: 1;
  box-shadow: 3px 3px 10px 3px rgba(0, 0, 0, 0.0);
}
</style>
<style lang="scss" scoped>
.addNewContentPageBtn {
  color: rgba(0, 0, 0, .65);
  height: 42px;
  border-radius: 2px;
  border: 1px dashed rgba(0, 0, 0, .4);
  user-select: none;
  cursor: pointer;

  &:hover {
    background: rgba(0, 0, 0, .06);
    color: rgba(0, 0, 0, 1);
    border-color: rgba(0, 0, 0, .5);
  }
}

.upload-placeholder {

  /deep/ .anticon {
    font-size: 32px;
    color: #999;
  }

  /deep/ .ant-upload {
    //display: block;
    width: 362px;
    height: 240px;
    padding: 0;

    img {
      width: 360px;
      height: 240px;
      object-fit: contain;
    }
  }

  .empty-holder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
}

.img-cover-actions-wrapper {
  position: relative;
  cursor: default;

  &:hover {
    .img-cover-actions {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}

.img-cover-actions {
  display: none;
  position: absolute;
  pointer-events: auto;
  background: rgba(0, 0, 0, .5);
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;

  .anticon {
    cursor: pointer;
    color: #fff;
  }
}
</style>
