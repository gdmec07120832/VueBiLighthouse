<template>
  <div>
    <div class="centerTopWrapper">
      <div class="shopName">林氏木业家具旗舰店</div>
      <div class="mainText">今日支付业绩</div>
      <div class="mainNumbersWrapper">
        <numbers-count :value="numeral(data1.SALE_AMT).format('0')"/>
      </div>
      <div class="mainSimpleCounts">
        <div>
          <span class="countsText">目标</span>
          <span class="countsNum">{{ numFormat(data1.SALES_TARGET) || '--' }}</span>
        </div>
        <div>
          <span class="countsText">达成</span>
          <span class="countsNum">{{ data1.SALES_RATE ? numeral(data1.SALES_RATE).format('0.00%') : '--' }}</span>
        </div>
      </div>

      <div class="gridCells bottomCells1">
        <div class="gridCellItem">
          <span class="itemIcon" :style="{
            backgroundImage: `url(${require('./images/icons/icon1.png')})`
          }"></span>
          <div class="itemInfo">
            <span>{{ data2.PAY_AMT ? numeral(data2.PAY_AMT).format('0,0') : '--' }}</span>
            <span>日累计支付</span>
          </div>
        </div>
        <div class="gridCellItem">
          <span class="itemIcon" :style="{
            backgroundImage: `url(${require('./images/icons/icon2.png')})`
          }"></span>
          <div class="itemInfo">
            <span>{{ data2.PAY_AMT_FIN_RATE_D ? numeral(data2.PAY_AMT_FIN_RATE_D).format('0.00%') : '--' }}</span>
            <span>日累计达成</span>
          </div>
        </div>
        <div class="gridCellItem">
          <span class="itemIcon" :style="{
            backgroundImage: `url(${require('./images/icons/icon3.png')})`
          }"></span>
          <div class="itemInfo">
            <span>{{ data2.PAY_AMT_YOY_DIFF ? numeral(data2.PAY_AMT_YOY_DIFF).format('0.00%') : '--' }}</span>
            <span>日累计同比</span>
          </div>
        </div>
        <div class="gridCellItem">
          <span class="itemIcon" :style="{
            backgroundImage: `url(${require('./images/icons/icon4.png')})`
          }"></span>
          <div class="itemInfo">
            <span>{{ data2.PAY_AMT_FIN_RATE_M ? numeral(data2.PAY_AMT_FIN_RATE_M).format('0.00%') : '--' }}</span>
            <span>月累计达成</span>
          </div>
        </div>
      </div>
    </div>

    <div class="centerBottomWrapper">
      <div class="bottomMainText">累计发货业绩</div>

      <div class="bottomMainNumber">
        <animate-num class="num" :number="numeral(data2.DLVRED_AMT).format('0')" />
<!--        <span class="num">{{ data2.DLVRED_AMT ? numeral(data2.DLVRED_AMT).format('0,0') : '&#45;&#45;' }}</span>-->
<!--        <span class="unit">万元</span>-->
      </div>

      <div class="bottomSplitLine"></div>
      <div class="gridCells bottomCells2">
        <div class="gridCellItem">
          <span class="itemIcon" :style="{
            backgroundImage: `url(${require('./images/icons/icon1.png')})`
          }"></span>
          <div class="itemInfo">
            <span>{{ data2.DLVRED_AMT_FIN_RATE_D ? numeral(data2.DLVRED_AMT_FIN_RATE_D).format('0.00%') : '--' }}</span>
            <span>日累计达成</span>
          </div>
        </div>
        <div class="gridCellItem">
          <span class="itemIcon" :style="{
            backgroundImage: `url(${require('./images/icons/icon2.png')})`
          }"></span>
          <div class="itemInfo">
            <span>{{ data2.DLVRED_AMT_YOY_DIFF ? numeral(data2.DLVRED_AMT_YOY_DIFF).format('0.00%') : '--' }}</span>
            <span>日累计同比</span>
          </div>
        </div>
        <div class="gridCellItem">
          <span class="itemIcon" :style="{
            backgroundImage: `url(${require('./images/icons/icon3.png')})`
          }"></span>
          <div class="itemInfo">
            <span>{{ data2.TGT_DLVRED_AMT_CUM_M ? numeral(data2.TGT_DLVRED_AMT_CUM_M).format('0,0') : '--' }}</span>
            <span>月累计目标</span>
          </div>
        </div>
        <div class="gridCellItem">
          <span class="itemIcon" :style="{
            backgroundImage: `url(${require('./images/icons/icon4.png')})`
          }"></span>
          <div class="itemInfo">
            <span>{{ data2.DLVRED_AMT_FIN_RATE_M ? numeral(data2.DLVRED_AMT_FIN_RATE_M).format('0.00%') : '--' }}</span>
            <span>月累计达成</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import numeral from 'numeral'
import NumbersCount from '@/views/BIView/DataV/TmallScreen/components/NumbersCount'
import { numFormat } from '@/utils/helper'

const AnimateNum =  {
  props:{number:{default:0}},
  data() {
    return {
      displayNumber: 0,
      interval:false
    }
  },
  watch: {
    number: function(){
      clearInterval(this.interval);
      if(Number(this.number) === this.displayNumber){
        return;
      }
      this.interval = window.setInterval(function(){
        if(this.displayNumber !== this.number){
          let change = (this.number - this.displayNumber) / 2;
          change = change >= 0 ? Math.ceil(change) : Math.floor(change);
          this.displayNumber = this.displayNumber + change;
        }
      }.bind(this), 30);
    }
  },
  render() {
    return <span>{this.displayNumber ? numeral(this.displayNumber).format('0,0') : '--'}</span>
  }
}

export default {
  name: 'CenterComp',
  components: { NumbersCount, AnimateNum },
  data() {
    return {
      data1: {},
      data2: {},
    }
  },
  watch: {},
  mounted() {
    this.getData1()
    this.getData2()
    this.timer = setInterval(() => {
      this.getData1()
      this.getData2()
    }, 5000)
    this.$on('hook:beforeDestroy', () => {
      clearInterval(this.timer)
    })
  },
  methods: {
    numeral,
    numFormat,
    async getData1() {
      const ret = await this.$fetchSql('NON_PM_b_shop', 'b_shop_amt_realtime')
      try {
        this.data1 = ret?.data?.[0] || {}
      } catch (e) {
        console.log(e)
      }
    },
    async getData2() {
      const ret = await this.$fetchSql('NON_PM_b_shop', 'b_shop_amt_month')
      try {
        this.data2 = ret?.data?.[0] || {}
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/assets/styles/utils.scss";


.centerTopWrapper {
  height: vh(530);
  position: relative;
  background: url("./images/main-center-bg.png") left top/100% 100%;

  .shopName {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 12%;
    font-weight: 700;
    font-size: vw(30);
    color: #FFFFFF;
    letter-spacing: 4px;
    text-indent: 4px;
    text-shadow: 0 0 20px #ff0000;
  }

  .mainText {
    position: absolute;
    letter-spacing: 12px;
    text-indent: 12px;
    text-align: center;
    font-size: vw(30);
    top: 34%;
    left: 50%;
    transform: translateX(-50%);
    font-weight: bold;
    color: #FFF;
    line-height: vh(24);
    text-shadow: 0 3px 1px rgba(82, 0, 57, 0.1);
  }

  .mainNumbersWrapper {
    position: absolute;
    top: 45%;
    left: 50%;
    transform: translateX(-50%);

    &:after {
      content: "";
      width: vw(800);
      height: vh(200);
      position: absolute;
      left: 50%;
      top: 0;
      z-index: -1;
      transform: translateX(-50%);
      background: url("./images/main-center-light.png") left top/100% 100%;
    }
  }

  .mainSimpleCounts {
    position: absolute;
    top: 71%;
    width: 100%;
    color: #fff;
    display: flex;
    justify-content: space-evenly;
    padding: 0 20%;

    .countsText {
      font-size: vw(15);
      margin-right: vw(10);
    }

    .countsNum {
      font-size: vw(25);
    }
  }
}


.centerBottomWrapper {
  margin-left: vw(20);
  margin-right: vw(20);
  margin-top: vh(9);
  height: vh(345);
  position: relative;
  background: url("./images/center-bottom-bg.png") left top/100% 100%;

  .bottomMainText {
    position: absolute;
    top: 15%;
    left: 50%;
    transform: translateX(-50%);
    letter-spacing: 6px;
    text-indent: 6px;
    font-size: vw(28);
    font-weight: bold;
    color: #FFF;
    line-height: vh(24);
    text-shadow: 0 3px 1px rgba(82, 0, 57, 0.1);

    &:before {
      content: "";
      position: absolute;
      width: vw(150);
      height: 11px;
      top: 50%;
      transform: translateY(-50%);
      left: vw(-130);
      background: url("./images/center-bottom-text-dec-left.png") left top/100% 100%;
    }

    &:after {
      content: "";
      position: absolute;
      width: vw(150);
      height: 11px;
      top: 50%;
      transform: translateY(-50%);
      right: vw(-130);
      background: url("./images/center-bottom-text-dec-right.png") left top/100% 100%;
    }
  }

  .bottomMainNumber {
    position: absolute;
    top: 25%;
    left: 50%;
    transform: translateX(-50%);
    white-space: nowrap;

    .num {
      font-size: vw(80);
      font-weight: 400;
      color: #00E4FF;
      //background: linear-gradient(0deg, #0C73FF 0%, #00E4FF 100%);
      //-webkit-background-clip: text;
      //-webkit-text-fill-color: transparent;
    }

    .unit {
      position: absolute;
      bottom: vw(22);
      margin-left: vw(18);
      font-size: vw(35);
      font-weight: 400;
      color: #00E4FF;
    }
  }

  .bottomSplitLine {
    position: absolute;
    top: 65%;
    left: 50%;
    transform: translateX(-50%);
    width: vw(400);
    height: 3px;
    background: url("./images/center-bottom-splitline.png") left top/100% 100%;
  }
}


.gridCells {
  display: flex;
  justify-content: center;
  width: 100%;

  &.bottomCells1 {
    padding-left: vw(20);
    padding-right: vw(20);
    position: absolute;
    bottom: vh(25);
  }

  &.bottomCells2 {
    position: absolute;
    bottom: vh(25);
  }

  .gridCellItem {
    display: flex;
    flex: 1;
    padding-left: vw(40);

    .itemIcon {
      width: vw(26);
      margin-right: vw(10);
      background-position: center center;
      background-repeat: no-repeat;
      background-size: contain;
    }

    .itemInfo {
      display: flex;
      flex-direction: column;

      > span:first-child {
        font-size: vw(25);
        color: #fff;
      }

      > span:last-child {
        font-size: 13px;
        color: #E8E8E8;
      }
    }
  }
}
</style>