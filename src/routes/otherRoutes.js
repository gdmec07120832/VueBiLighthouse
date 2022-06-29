export default [
  {
    name: '403',
    path: '/403',
    component: {
      render () {
        return (
          <a-result status="403" title="403" sub-title="没有权限，请联系管理员">
            <template slot="extra">
              {window.parent === window && (
                <a-button type="primary">
                  <router-link to={'/'}>重试</router-link>
                </a-button>
              )
              }
            </template>
          </a-result>
        )
      }
    }
  },
  {
    name: '404',
    path: '/404',
    component: {
      render () {
        let title = 404
        let subTitle = '抱歉，页面不存在'
        const errorUrl = this.$route.query.url
        const json = this.$route.query.json
        if (errorUrl) {
          title = '请求被终止'
          subTitle = ''
        }
        return (
          <a-result status="404" title={title} sub-title={subTitle}>
            <template slot="extra">
              {
                errorUrl ? (
                  <div style="margin-bottom: 10px">
                    <p>请求路径：{errorUrl}</p>
                    <div style={{
                      maxWidth: '500px', margin: 'auto',
                      textAlign: 'left', fontSize: '12px', wordBreak: 'break-all'
                    }}>
                      {json}
                    </div>
                  </div>
                ) : null
              }{
              window.parent === window &&
              <a-button type="primary">
                <router-link to={'/'}>回到首页</router-link>
              </a-button>
            }
            </template>
          </a-result>
        )
      }
    }
  },
  {
    name: '502',
    path: '/502',
    component: {
      render () {
        return (
          <a-result status="500" title="502" sub-title="服务暂时不可用">
            <template slot="extra">
              {window.parent === window && (
                <a-button type="primary">
                  <router-link to={'/'}>重试</router-link>
                </a-button>
              )
              }
            </template>
          </a-result>
        )
      }
    }
  },
  {
    name: 'noticePage',
    path: '/noticePage',
    component: () => import('@/views/NoticePage/NoticePage'),
  },
  {
    path: '*',
    component: {
      render () {
        return (
          <a-result status="404" title="404" sub-title="抱歉，页面不存在">
            <template slot="extra">
              <a-button type="primary">
                <router-link to={'/'}>回到首页</router-link>
              </a-button>
            </template>
          </a-result>
        )
      }
    }
  }
]
