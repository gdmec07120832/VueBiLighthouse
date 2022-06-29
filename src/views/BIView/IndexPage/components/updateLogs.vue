<template>
  <div>
    <div class="list-wrapper">
      <div class="list-item flex" v-for="(item, index) in list" :key="index">
        <span class="newFlag text-red">{{ item.isNew ? 'New' : '' }}</span>
        <div @click="handlePreview(item)">{{ item.content }}</div>
        <div style="cursor: pointer; color: #46BCA0"
             @click="handlePreview(item)">{{ item.canPreview ? '预览' : '' }}
        </div>
      </div>
    </div>
    <simple-paginator :pagination.sync="pagination" @change="getData"/>
  </div>
</template>

<script>
import SimplePaginator from '@/views/BIView/IndexPage/components/simplePaginator'
import moment from 'moment'
import ModalWrapper from '@/views/Admin/release-version-mgmt/components/modalWrapper'
import ContentPage from '@/views/Admin/release-version-mgmt/components/contentPage'

export default {
  name: 'updateLogs',
  components: { SimplePaginator },
  data () {
    return {
      pagination: {
        total: 0,
        pageSize: 7,
        current: 1
      },
      list: []
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      const { current, pageSize } = this.pagination
      this.$axios.get('/api/menu/listReleaseInfo', {
        params: {
          page: current,
          pageSize
        }
      }).then(({ data: { list, totalRows } }) => {
        this.pagination.total = totalRows
        this.list = list.map(_ => ({
          ..._,
          canPreview: _['thumbnailUrl'],
          // canPreview: true,
          isNew: moment(_['releaseDate']).add(15, 'day') > moment()
        }))
      })
    },
    handlePreview (content) {
      if (!content.canPreview) {
        return
      }
      this.$modal.show(
          {
            components: { ModalWrapper, ContentPage },
            props: ['detail'],
            render () {
              return <modal-wrapper>
                <content-page detail={this.detail}/>
              </modal-wrapper>
            }
          }, {
            detail: {
              imgUrl: content.thumbnailUrl,
              reportUrl: '',
              reportName: /《(.+)》/.exec(content.content)[1],
              dataValue: content.dataValue,
              descText: content.dataInfo
            }
          }, {
            width: 1200, height: 'auto', classes: ['release-modal']
          }
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.list-wrapper {
  padding-top: 20px;
}

.list-item {
  span.newFlag {
    flex: 0 0 40px;
  }

  white-space: nowrap;
  font-size: 12px;
  color: rgba(0, 0, 0, .9);
  line-height: 36px;
}
</style>
