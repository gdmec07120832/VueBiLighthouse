<template>
  <div>
    <div class="list-wrapper">
      <div class="list-item flex" v-for="(item, index) in list" :key="index">
        <span class="newFlag text-red">{{ item.isNew ? 'New' : '' }}</span>
        <div @click="checkDetail(item)">
          <span style="margin-right: 5px">{{ item['date'] }}</span>
          {{ item.versionName }}
        </div>
        <div style="cursor: pointer; color: #46BCA0; margin-left: 10px" @click="checkDetail(item)">
          查看
        </div>
      </div>
    </div>
    <simple-paginator :pagination.sync="pagination" @change="getData"/>
  </div>
</template>

<script>
import SimplePaginator from '@/views/BIView/IndexPage/components/simplePaginator'
import ReleaseModalV2 from '@/views/Admin/release-version-mgmt/components/ReleaseModalV2'
import moment from 'moment'

export default {
  name: 'versionLogs',
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
      this.$axios.get('/api/admin/version/list', {
        params: {
          status: 1,
          page: current,
          pageSize
        }
      }).then(({ data: { list, totalRows } }) => {
        this.list = list.map(_ => {
          return {
            ..._,
            date: moment(_['factReleaseDate']).format('YYYY年MM月DD日'),
            isNew: moment(_['factReleaseDate']).add(15, 'day') > moment()
          }
        })
        this.pagination.total = totalRows
      })
    },
    getPageByType (id, type) {
      // 0 首页 1 内容页 2 尾页
      return this.$axios.get('/api/admin/versionDetail/list', {
        params: { page: 1, pageSize: 100, detailType: type, versionId: id }
      }).then(({ data: { list } }) => {return list})
    },
    async checkDetail (item) {
      const id = item.id
      this.$store.commit('app/SET_FULL_LOADING', true)
      const p1 = this.getPageByType(id, 0)
      const p2 = this.getPageByType(id, 1)

      try {
        const [indexPage] = await p1
        const contentPages = await p2
        this.$store.commit('app/SET_FULL_LOADING', false)
        if (!indexPage || !contentPages.length) {
          console.log('没有封面或内容页，无法查看')
          return
        }

        this.$modal.show(ReleaseModalV2, {
          pushConfig: {
            coverTitle: indexPage.itemName,
            descText: indexPage.description,
            versionName: item.versionName
          },
          contentPages: contentPages.map(_ => {
            return {
              ..._,
              reportName: _.itemName,
              descText: _.description
            }
          })
        }, {
          clickToClose: false,
          width: 1200,
          height: document.body.clientHeight - 20,
          classes: ['release-modal']
        })
      } catch {
        this.$store.commit('app/SET_FULL_LOADING', false)
      }
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
