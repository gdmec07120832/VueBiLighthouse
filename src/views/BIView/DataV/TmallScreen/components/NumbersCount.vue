<template>
  <div class="numberCountWrapper">
    <div class="currencySign">¥</div>
    <div class="numWrapper">
      <div class="numItem">
        <digital-roll :rollDigits="value$[0]" />
      </div>
      <div class="numItem">
        <digital-roll :rollDigits="value$[1]" />
      </div>
      <div class="numItem">
        <digital-roll :rollDigits="value$[2]" />
      </div>
      <div class="splitDot">,</div>
      <div class="numItem">
        <digital-roll :rollDigits="value$[3]" />
      </div>
      <div class="numItem">
        <digital-roll :rollDigits="value$[4]" />
      </div>
      <div class="numItem">
        <digital-roll :rollDigits="value$[5]" />
      </div>
      <div class="splitDot">,</div>
      <div class="numItem">
        <digital-roll :rollDigits="value$[6]" />
      </div>
      <div class="numItem">
        <digital-roll :rollDigits="value$[7]" />
      </div>
      <div class="numItem">
        <digital-roll :rollDigits="value$[8]" />
      </div>
    </div>
  </div>
</template>

<script>
import { padStart } from 'lodash'
import DigitalRoll from '@/views/BIView/DataV/TmallScreen/components/DigitalRoll'
export default {
  name: 'NumbersCount',
  components: {DigitalRoll},
  props: {
    value: {
      type: [Number, String],
      default: 0
    }
  },
  data() {
    return {
      value$: padStart('', 9, '0')
    }
  },
  watch: {
    value: {
      handler() {
        this.value$ = padStart(String(this.value), 9, '0')
      }
    }
  },
  created() {
    this.value$ = padStart(String(this.value), 9, '0')
    // setInterval(() => {
    //   this.value$ = padStart(String(random(0, 10000000)), 9, '0')
    // }, 5000)
  }
}
</script>

<style scoped lang="scss">
@import "@/assets/styles/utils.scss";

.numberCountWrapper {
  display: flex;
  align-items: flex-end;
}

.currencySign {
  font-size: vw(35);
  line-height: 1;
  color: #fff;
}

.numWrapper {
  display: flex;
  align-items: flex-end;
  margin-left: vw(5);

  .splitDot {
    font-size: vw(60);
    line-height: 1;
    color: #fff;
    margin-right: vw(4);
  }

  .numItem {
    width: vw(68);
    height: vh(105);
    line-height: 1;
    background: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 12px;
    margin-right: vw(6);
    position: relative;

    &:after {
      content: "";
      position: absolute;
      width: 100%;
      top: 50%;
      left: 0;
      height: 1px;
      background: #B50608;
      z-index: 1;
    }

    /deep/ .d-roll-bar>div {
      position: relative;
      z-index: 10;
      color: #B50608;
      font-size: vw(98);
      line-height: 1;
      font-weight: bold;
      background: linear-gradient(0deg, #E26F44 0%, #B80608 51%, #9E0305 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
}
</style>