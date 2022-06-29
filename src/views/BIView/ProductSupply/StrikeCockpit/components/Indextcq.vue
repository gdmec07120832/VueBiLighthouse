<template>
  <div class="TopIndex">
    <div class="TopIndList" v-for="(item, index) in IndexData" :key="index">
      <div v-if="item.title==null" class="TopITitle" style="color: #ffffff;">--</div>
      <div v-else class="TopITitle">
        {{ item.title }}
        <a-popover v-if="item.remarks"  placement="bottomLeft">
          <template #content>
            <p v-for="(itext,indenum) in item.RemTex" :key="indenum" class="ContCss">
              {{itext.value}}
            </p>
          </template>
          <template #title>
            <span>备注说明</span>
          </template>
          <a-icon style="font-size: 16px;color: rgb(153, 153, 153);" type="question-circle"/>  
        </a-popover>
      </div>

      <div class="TopINum">{{ HandVal(index, -1, item.Tnum,sign) }}</div>
      <div class="TopCoun">
        <ul class="TopCouUl">
          <li
            v-for="(item1, index1) in item.ContInfo"
            :key="index1"
            class="TopCouUlLi"
            :style="{ width: IndeWidth + '%' }"
          >
            <ul class="TopCouULUl">
              <li>{{ item1.name }}</li>
              <li :class="[HandleColor(index, index1, item1.value,sign)]">{{ HandVal(index, index1, item1.value,sign) }}</li>
              <li></li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { HandleNum } from '../utils/tcq'

export default {
  name: 'Indextcq',
  props: {
    OnType: {
      type: String,
    },
    IndeWidth: {
      type: Number,
    },
    sign:{
      type:Number,
    },
    IndexData: {
      type: Array,
    },
    // remarks:{
    //   type:Boolean,
    // }
  },
  data() {
    return {}
  },
  created() {},
  mounted() {
    // console.log("======asdasd======")
    // console.log(this.sign);
    // console.log(this.IndexData);
  },
  methods: {
    HandleColor(Cval, Rval, val,Sign) {
      if (this.OnType === 'BShopDSR') {
        if (Rval === 0 || Rval === 1) {
          return val > 0 ? 'red' : 'green'
        }
      }else if(this.OnType === 'KAReach'){
        if(Sign!==0&&Rval===1) return val > 1 ? 'red' : 'green'
          else if(Rval===2) return (val)? val > 0 ? 'red' : 'green':''

      }else if(this.OnType === 'UnsalableAmount'){
        if((Sign===0||Sign===1)&&(Rval===1)) return (val)? val < 0 ? 'red' : 'green':''
          else if((Sign===0)&&(Cval===0)&&(Rval===0)) return (val)?(val) > 1 ? 'red' : 'green':''
          else if(Sign===2&&(Rval===2||Rval===3)) return (val)?(val) > 1 ? 'red' : 'green' :''
      }else if(this.OnType === 'GrossProfit'){
        if(Rval === 1) return (val)? (val>0)?'red':'green':''
      }else if(this.OnType === 'GuestList'){
        if(Rval === 1) return (val)? (val>0)?'red':'green':''
      }
    },
    HandVal(Cval, Rval, val,Sign) {
      if (this.OnType === 'BShopDSR') {
        if (Rval === 0 || Rval === 1 || Rval === 3) {
          return HandleNum('percent', val)
        }else if(Rval === 4){
          return (val==0||val===undefined)?'--':(val*1).toFixed(0)
        }else if ((Rval===-1) || Rval === 2 ) {
          return  HandleNum('Null',val)
        }
      }else if(this.OnType === 'KAReach'){
        if (Cval===0&&Rval===-1){
          return HandleNum('HundredMillion', val)
        }else if(Sign===0){
          if(Rval===2) return HandleNum('percent1', val)
            else return HandleNum('HundredMillion', val)
        }else{
          if(Rval===1||Rval===2) return HandleNum('percent1', val)
            else return HandleNum('HundredMillion', val)       
        }
      }else if(this.OnType === 'CityYOY'){
        if(Rval===1||Rval===2) return val
          else return HandleNum('percent1', val)
      }else if(this.OnType === 'StoreBPreSale'){  
        return HandleNum('round', val)
      }else if(this.OnType === 'UnsalableAmount'){
        if(Cval===0&&Rval===-1&&Sign===0) return HandleNum('round', val)
          else if(Sign===0||Sign===1) return HandleNum('percent1', val)
          else if(Sign===2)
            if(Rval===0||Rval===1||Rval===-1) return HandleNum('round', val)
              else if(Rval===2||Rval===3) return HandleNum('percent1', val)
      }else if(this.OnType === 'GuestList'){
        if(Rval===1) return HandleNum('percent1', val)
          else return HandleNum('round', val)
      }else if(this.OnType === 'GrossProfit'){
        if(Cval === 0) return HandleNum('percent1', val)
          else return HandleNum('percent1', val)
      }

    },
  },
}
</script>

<style lang="scss" scoped>
@import '../assets/styles.scss';

p.ContCss{
  margin: 0px;
  padding: 0px;
  font-size: 12px;    
}
.TopIndex {
  display: flex;
  .TopIndList {
    flex: 1;
    padding: 15px;
    .TopITitle {
      // color: rgb(153, 153, 153);
      color: rgba(0, 0, 0, 0.64);
      font-size: 13px;
    }
    .TopINum {
      // font-size: 20px;
      line-height: 40px;
      height: 40px;
      font-size: 24px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 600;
      color: #333333;

    }

    .TopCoun {
      .TopCouUl {
        list-style: none;
        padding: 0px;
        margin: 0px;
        .TopCouUlLi {
          float: left;
          // width: 50%;
          .TopCouULUl {
            padding: 0px;
            list-style: none;
            display: flex;
            justify-content: space-between;
            li {
              // float: left;
              // width: 50%;
              font-size: 12px;
              line-height: 25px;
            }
            li:nth-child(1) {
              color: #999999;
              flex: 30;
            }
            li:nth-child(2) {
              text-align: right;
              color: rgba(0, 0, 0, 0.64);
              flex: 40;
            }
            li:nth-child(3) {
              flex: 30;
            }
            li.red {
              color: $red;
            }
            li.green {
              color: $green;
            }
          }
        }
      }
    }
  }
}
</style>