<template>
  <div style="overflow-y: auto; height: calc(100% - 100px);">
    <div class="graphWrapper">
      <div class="circleCenter">
      <div class="innerCircleOutline"
           :style="{width: 2 * innerCircleRadius + 'px', height: 2 * innerCircleRadius + 'px', top: centerOffsetY + 'px'}">
        <div v-for="(field, index) in fieldList"
             ref="fieldListRef"
             @click="handleFieldClick(field, index)"
             :key="field.uuid" class="fieldItem"
             :data-degree="field.degree"
             :class="{selected: field.uuid === (currentSelectField && currentSelectField.uuid)}"
             :style="{
                 opacity: currentSelectField ? currentSelectField.uuid === field.uuid ? 1 : 0.3 : 1,
                 transform: `translate(${field.x}px, ${field.y}px)`,
                 width: (2 * fieldItemRadius) + 'px',
                 height: (2 * fieldItemRadius) + 'px',
                 top: `calc(50% - ${fieldItemRadius}px)`,
                 left: `calc(50% - ${fieldItemRadius}px)`
               }">
          <div style="width: 100%; height: 100%" :style="{transform: `rotate(${(field.degree / Math.PI) * 180 + 90}deg)`}">
              <div style="color: #000; transform: translateY(-24px)" class="text-ellipsis nowrap">
                <overflow-tooltip>
                  {{field.nodeName}}
                </overflow-tooltip>
              </div>



            <div class="fieldItemIcon" :style="{fontSize: `${fieldItemRadius * 0.9}px`}">
              <metric-field-svg />
            </div>
          </div>
          <div class="processList">
            <div class="processItem" @click.s.stop="handleProcessClick(p)" v-for="(p, index) in field.processList" :key="p.uuid"
                 :data-x="field.itemsPos && field.itemsPos[index] && field.itemsPos[index].translateX"
                 :data-y="field.itemsPos && field.itemsPos[index] && field.itemsPos[index].translateY">
              <overflow-tooltip :description="p.nodeName" style="position: absolute; left: 0; top: 0; width: 100%; height: 100%">
                <div class="flex-center" style="height: 40px">
                  <metric-process-svg style="width: 18px; height: 18px" />
                </div>
              </overflow-tooltip>
            </div>
          </div>
        </div>
      </div>
      <div class="outerCircleOutline"
           :style="{width: 2 * outerCircleRadius + 'px', height: 2 * outerCircleRadius + 'px', top: centerOffsetY + 'px'}">
      </div>
      <div class="centerBottom" :style="{
            width: (2 * centerBottomRadius) + 'px',
            height: (2 * centerBottomRadius) + 'px',
            top: `calc(50% - ${centerBottomRadius}px)`,
            left: `calc(50% - ${centerBottomRadius}px)`
        }">
        <div class="centerBottom__inner" :style="{height: centerBottomRadius + 'px'}">
          <div :style="{fontSize: Math.max(0.12 * centerBottomRadius, 16) + 'px'}" style="padding-top: 10%">林氏木业指标体系</div>
          <div>指标总数：{{metricCount}}</div>
          <div>涵盖业务域：{{ fieldList.length }}</div>
        </div>
      </div>
    </div>
      <a-spin v-if="loading" :spinning="loading" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0">
        <a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
        <div style="height: 400px"></div>
      </a-spin>
    <transition name="swing-in-top-fwd">
      <div class="contentCard" v-if="currentSelectField"
           :style="{right: currentSelectField.__index__ >= fieldList.length / 2 ? '50px' : 'auto',
                      left: currentSelectField.__index__ < fieldList.length / 2 ? '50px' : 'auto'
                    }">
        <div class="cardTitle">描述卡片</div>
        <div class="flex mt10" style="align-items: start">
          <span style="width: 70px; flex: none; text-align: right">业务域：</span>
          <span style="color: #adadad">{{currentSelectField.nodeName}}</span>
        </div>
        <div class="flex mt10" style="align-items: start">
          <span style="width: 70px; flex: none; text-align: right">指标数：</span>
          <span style="color: #adadad">{{currentSelectField.kpiNumber}}</span>
        </div>
        <div class="flex mt10" style="align-items: start">
          <span style="width: 70px; flex: none; text-align: right">业务过程：</span>
          <span style="color: #adadad">{{currentSelectField.processList.length ? currentSelectField.processList.map(item => item.nodeName).join('，') : '--'}}</span>
        </div>
        <div class="flex mt10" style="align-items: start">
          <span style="width: 70px; flex: none; text-align: right">数域描述：</span>
          <span style="color: #adadad">{{currentSelectField.description || '--'}}</span>
        </div>
      </div>
    </transition>
  </div>
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
import { gsap } from 'gsap'
import OverflowTooltip from '@/views/BIView/components/OverflowTooltip/OverflowTooltip'
import MetricProcessSvg from '@/assets/svg/metricProcess.svg'
import MetricFieldSvg from '@/assets/svg/metricField.svg'

export default {
  name: 'MetricGraph',
  components: { OverflowTooltip, MetricProcessSvg, MetricFieldSvg },
  data() {
    return {
      metricCount: 0,
      windowWidth: 0,
      innerCircleRadius: 0,
      outerCircleRadius: 0,
      fieldItemRadius: 0,
      centerBottomRadius: 0,
      fieldList: [],
      centerOffsetY: 180, // 圆心偏移距离
      currentSelectField: undefined,
      tweenList: [],
      loading: false
    }
  },
  created() {
  },
  mounted: async function () {
    const resizeHandle = debounce(() => {
      this.calcWidth()
      this.calcFieldPosition()
      this.initGsap()
      this.currentSelectField = undefined
    }, 100)
    window.addEventListener('resize', resizeHandle)

    this.$on('hook:beforeDestroy', () => {
      window.removeEventListener('resize', resizeHandle)
    })
    await this.getMetrics()
    resizeHandle()
  },
  methods: {
    getMetrics() {
      this.loading = true
      return this.$axios.get('/api/user/reportAndKpi/getHomePageInfo').then(({data}) => {
        const {businessDomainsAndProcesses: _list, kpiTotalCount} = data
        this.metricCount = kpiTotalCount
        const list = _list.map(item => {
          return {
            ...item.businessProcess,
            kpiNumber: item.cardDescription.kpiNumber,
            processList: item.businessProcess.children,
            description: item.cardDescription.description
          }
        })
        this.fieldList = list
      }).finally(() => {
        this.loading = false
      })
    },
    initGsap() {
      const listRef = this.$refs.fieldListRef
      if (this.tweenList.length) {
        this.tweenList.forEach(tween => {
          tween.restart()
          tween.kill()
        })
      }
      this.tweenList = listRef.map((dom) => {
        const children = dom.querySelectorAll('.processItem')
        return gsap.to(children, {
          scale: 1,
          paused: true,
          opacity: 1,
          duration: 0.25,
          stagger: 0.03,
          ease: 'power1.in',
          x: (index, target) => {
            return target.getAttribute('data-x')
          },
          y: (index, target) => {
            return target.getAttribute('data-y')
          }
        })
      })
    },
    calcWidth() {
      this.windowWidth = Math.max(document.body.clientWidth, 1366)
      this.innerCircleRadius = this.windowWidth * 0.64 / 2
      this.outerCircleRadius = this.windowWidth * 0.82 / 2
      this.fieldItemRadius = this.innerCircleRadius * 0.07
      this.centerBottomRadius = this.innerCircleRadius * 0.26
    },
    calcFieldPosition() {
      const startAngle = -Math.PI + Math.asin(this.centerOffsetY / this.innerCircleRadius)
      const endAngle = -Math.asin(this.centerOffsetY / this.innerCircleRadius)
      const angle = endAngle - startAngle
      const singleAngle = angle / (this.fieldList.length + 1)

      this.fieldList = this.fieldList.map((item, index) => {
        const degree = startAngle + (index + 1) * singleAngle
        const x = Math.cos(degree) * this.innerCircleRadius
        const y = Math.sin(degree) * this.innerCircleRadius
        return {
          ...item,
          degree,
          x,
          y,
          itemsPos: (() => {
            const len = item.processList.length
            let _startAngle
            let _singleAngle = Math.PI / 20
            _startAngle = degree - ((len / 2) - 0.5) * _singleAngle
            let _endAngle = _startAngle + _singleAngle * item.processList.length
            if(_endAngle > endAngle) {
              _startAngle = _startAngle - (_endAngle - endAngle - singleAngle / 2)
            }
            if(_startAngle < startAngle) {
              _startAngle = startAngle
            }
            return item.processList.map((_, index) => {
              return {
                translateX: Math.cos(_startAngle + _singleAngle * index) * (this.outerCircleRadius) - x,
                translateY: Math.sin(_startAngle + _singleAngle * index) * (this.outerCircleRadius) - y
              }
            })
          })()
        }
      })
    },
    handleFieldClick(field, index) {
      const _index = this.fieldList.findIndex(item => item.uuid === this.currentSelectField?.uuid)
      if (field.uuid === this.currentSelectField?.uuid) {
        this.tweenList[_index].reverse()
        this.currentSelectField = undefined
        return
      }

      if (_index !== undefined && _index !== -1) {
        this.tweenList[_index].reverse()
      }
      this.currentSelectField = undefined
      this.tweenList[index].play()
      this.$nextTick(() => {
        this.currentSelectField = {
          ...field,
          __index__: index
        }
      })
    },
    handleProcessClick(process) {
      this.$router.push({
        name: 'metricExploreSearchResult',
        query: {
          // q: process.nodeName,
          t: Date.now(),
          p: process.uuid,
          f: this.currentSelectField?.uuid
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.graphWrapper {
  position: relative;
  height: 100%;
  overflow-y: hidden;
  min-height: 600px;

  .circleCenter {
    position: absolute;
    left: 50%;
    bottom: 0;
    border: 0;
    border-radius: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
  }

  .innerCircleOutline, .outerCircleOutline {
    position: absolute;
    border-radius: 100%;
    border: 2px solid rgba(70, 188, 160, 0.5);
    transform: translate(-50%, -50%);
  }

  .innerCircleOutline {
    z-index: 10;

    .fieldItem {
      position: absolute;
      border-radius: 50%;
      background: rgb(61, 189, 126);
      color: #fff;
      text-align: center;
      transition: all .5s;

      &:hover {
        cursor: pointer;
        box-shadow: 0 0 0 15px rgba(61, 189, 126, 0.2);
      }

      &.selected {
        box-shadow: 0 0 0 15px rgba(61, 189, 126, 0.2);
      }
      .fieldItemIcon {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }

      .processList {
        position: absolute;
        width: 0;
        height: 0;
        left: 50%;
        top: 50%;

        .processItem {
          transform: scale(0);
          opacity: 0;
          position: absolute;
          left: calc(50% - 20px);
          top: calc(50% - 20px);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgb(61, 189, 126);
          box-shadow: 0 0 0 10px rgba(61, 189, 126, 0.2);
        }
      }
    }
  }

  .outerCircleOutline {
    z-index: 1;
  }


  .centerBottom {
    position: absolute;
    border-radius: 100%;
    background: rgb(61, 189, 126);
    transition: all .5s;

    .centerBottom__inner {
      text-align: center;
      color: #fff;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;

    }
  }
}

.contentCard {
  position: absolute;
  user-select: text;
  top: 20px;
  left: 50px;
  padding: 8px 16px;
  width: 350px;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  min-height: 200px;

  .cardTitle {
    position: relative;
    padding-left: 12px;
    margin-bottom: 12px;

    &:before {
      position: absolute;
      content: "";
      display: block;
      width: 4px;
      left: 0;
      top: calc(50% - 10px);
      height: 20px;
      background: rgb(81, 189, 126);
    }
  }
}
</style>

<style lang="scss" scoped>
.swing-in-top-fwd-enter-active {
  animation: swing-in-top-fwd .5s cubic-bezier(0.175, 0.885, 0.320, 1.275) forwards;
}

.swing-in-top-fwd-leave-active {
  animation: swing-in-top-fwd .5s cubic-bezier(0.175, 0.885, 0.320, 1.275) reverse;
}

@keyframes swing-in-top-fwd {
  0% {
    transform: rotateX(-100deg);
    transform-origin: top;
    opacity: 0;
  }
  100% {
    transform: rotateX(0deg);
    transform-origin: top;
    opacity: 1;
  }
}
</style>