import IntroJS from 'intro.js'
import 'intro.js/introjs.css'
import './intro.scss'
import Vue from 'vue'

export default {
  mounted() {
    const recorder = this.introRecorder()
    if(recorder.get()) {
      return
    }
    const instance = IntroJS().setOptions({
      disableInteraction: true,
      exitOnOverlayClick: false,
      showButtons: false,
      steps: [
        {
          element: '#MetricEntryIcon',
          title: '指标字典（1）',
          intro: this.generateTemplate(
            'BI系统上线指标字典功能，用户可以在指标字典中根据数据域或者关键字找到对应的指标的描述、统计口径、统计逻辑等指标信息。',
            'step1'
          )
        },
        {
          element: '#introjsStep2',
          title: '指标字典（2）',
          intro: this.generateTemplate(
            '在指标字典首页可以知道林氏数据指标的大概情况，点击对应数据域，可以看到对应的业务过程，点击业务过程也进入搜索详情。',
            'step2'
          )
        },
        {
          element: '#MetricExplainTrigger',
          title: '指标说明',
          intro: this.generateTemplate(
            '每个报表的右下角新增指标说明按钮，点击可展开该报表下对应的指标定义，如果按钮不可点击则表明该报表下暂无维护指标信息。',
            'step3'
          )
        }
      ]
    })

    setTimeout(() => {
      instance.start()
      recorder.set()
      document.querySelector('.introjs-tooltipReferenceLayer').addEventListener('click', (e) => {
        if (e.target) {
          const step = ((e.target).getAttribute('data-introStep'))

          if (step === 'skip') {
            instance.exit(true)
          }

          if (step === 'step1') {
            this.$router.push({
              path: '/metricExplore/index'
            }).then(() => {
              instance.nextStep()
            })
          }
          if (step === 'step2') {
            const menuId = this.$store.state.app.topLevelMenus[1]?.id
            if(menuId) {
              this._getAsideMenuById(menuId).then(() => {
                this.$router.push({
                  path: `/x/${menuId}`
                }).then(() => {
                  instance._introItems[2].element = document.querySelector('#MetricExplainTrigger').parentElement.parentElement
                  instance._introItems[2].position = 'left'
                  instance.nextStep()
                })
              })
            }
          }
          if (step === 'step3') {
            instance.exit(true)
          }
        }
      })


      document.querySelector('.introjs-bullets').addEventListener('click', (e) => {
        if(e.target && e.target.getAttribute('role') === 'presentation') {
          const stepNum = (e.target.firstElementChild).getAttribute('data-step-number')
          if(stepNum === '1') {
            // do nothing
            instance.goToStep(stepNum)
          }
          if(stepNum === '2') {
            this.$router.push({
              path: '/metricExplore/index'
            }).then(() => {
              instance.goToStep(stepNum)
            })
          }
          if(stepNum === '3') {
            const menuId = this.$store.state.app.topLevelMenus[1]?.id
            if(menuId) {
              this._getAsideMenuById(menuId).then(() => {
                this.$router.push({
                  path: `/x/${menuId}`
                }).then(() => {
                  instance._introItems[2].element = document.querySelector('#MetricExplainTrigger')?.parentElement?.parentElement
                  instance._introItems[2].position = 'left'
                  instance.goToStep(stepNum)
                })
              })
            }
          }
        }
      })
    }, 200)
  },
  methods: {
    introRecorder(){
      const record = localStorage.getItem('IntroJS_new_metric_page')
      return {
        get: () => !!record,
        set: () => {
          localStorage.setItem('IntroJS_new_metric_page', '1')
        }
      }
    },
    generateTemplate(intro, key) {
      const VNode = () => {
        return <div style={{ userSelect: 'none' }}>
          <div>{intro}</div>
          <div class={'py15 flex flex-end'}>
            {
              key === 'step3' ? null :

                <span data-introStep={'skip'} style={{ cursor: 'pointer', color: '#adadad' }}>跳过引导</span>
            }
            <span data-introStep={key} class={`ml15 px10`} style={{
              cursor: 'pointer',
              borderRadius: '4px',
              color: '#fff',
              background: '#46bca0'
            }}>
              {key === 'step3' ? '完成' : '下一步'}
            </span>
          </div>
        </div>
      }
      const Ctor = Vue.extend(VNode)
      const instance = new Ctor()
      instance.$mount()
      return instance.$el.outerHTML
    },
    _getAsideMenuById(id) {
      return this.$axios.get('/api/menu/getSubMenusByRankOneMenuIdAndLoginUser', {
        params: {rankOneMenuId: id}
      }).then(({data}) => {
        this.$store.commit('app/SET_GLOBAL_MENU_MAP', data)
        this.$store.commit('app/SET_CURRENT_ASIDE_MENU', data)
        this.$store.commit('app/SET_FILTERED_ASIDE_MENU', JSON.parse(JSON.stringify(data)))
        this.$store.state.app.initAsideMenuFinishPromise[1]()
        if (!data.length) {
          this.$store.commit('app/SET_MENU_HIDDEN', true)
        } else {
          this.$store.commit('app/SET_MENU_HIDDEN', false)
        }
      }).finally(() => {
      })
    },
  }
}