<template>
  <div @click="clickTable" class="tablelist">
    <div class="tablelthead" style="padding-right: 8px;">
      <table class="TRORCLeftTUser2">
        <thead>
          <tr v-if="labelSub">
            <div v-for="(item, index) in labelSub" :key="index" class="TitleHand">
              <td v-if="item.name!=='-1'" style="vertical-align: middle;" :rowspan="item.row" :colspan="item.col">{{item.name}}</td>
            </div>
          </tr>

          <tr>
            <div v-for="(item, index) in labelD" :key="index" class="TitleHand">
              <td v-if="item!=='-1'" :title="item" :class="[(index===0)?'Title':'']">{{ item }}</td>
            </div>
          </tr>
        </thead>
      </table>
    </div>

    <div :class="(labelSub)?'tableltbody_sub':'tableltbody'" style="width: 100%; overflow-y: scroll; border: 0px solid">
      <table class="TRORCLeftTUser2">
        <tbody v-if="IsMerge">
          <tr v-for="(item, index) in tableD" :key="index">
            <div class="BodyHand" v-for="(item1, index1) in item" :key="index1">
              <td v-if="item1.value!=='-1'" style="vertical-align: middle;"
                @mouseenter="index1 === 0 ? mouseenter(null, null) : mouseenter(index, index1)"
                @contextmenu="openMenu($event, item1.value)"
                :title="item1.value"
                :style="[
                  {
                    background:
                      (curRow === index1 && index1 !== 0) || (curCol === index && index1 !== 0) ? hoverColor : null,
                  },
                ]"
                :rowspan="item1.row"
                :class="[HandleColor(index,index1,item1.value),
                  (isparm&&index1===0)?'IsLine':'',(isparm&&IsChoose===index&&index1===0)?'ChooseCss':'',(index1===0)?'Title':'']"
                @click="(isparm&&index1===0)?SentParm(item1.value,index,index1):''"
              >
                {{ HandVal(index,index1,item1.value)}}
              </td>              
            </div>

          </tr>
        </tbody>
        
        <tbody v-else>
          <tr v-for="(item, index) in tableD" :key="index">
            <td
              @mouseenter="index1 === 0 ? mouseenter(null, null) : mouseenter(index, index1)"
              @contextmenu="openMenu($event, item1)"
              :title="item1"
              :style="[
                {
                  background:
                    (curRow === index1 && index1 !== 0) || (curCol === index && index1 !== 0) ? hoverColor : null,
                },
              ]"
              v-for="(item1, index1) in item"
              :key="index1"
              :class="[HandleColor(index,index1,item1),
                (isparm&&index1===0)?'IsLine':'',(isparm&&IsChoose===index&&index1===0)?'ChooseCss':'',(index1===0)?'Title':'']"
              @click="(isparm&&index1===0)?SentParm(item1,index,index1):''"
            >
              {{ HandVal(index,index1,item1)}}
            </td>
          </tr>
        </tbody>


      </table>
    </div>

    <div v-if="menuVisible" class="selectMenu" :style="[{ left: menuX }, { top: menuY }]">
      <div class="item box" v-clipboard="currentRow">复制内容</div>
    </div>
  </div>
</template>

<script>
import { HandleNum } from '../utils/tcq'

export default {
  name: 'TableComptcq',
  props: {
    labelSub:{
      type: Array,
    },
    labelD: {
      type: Array,
    },
    tableD: {
      type: Array,
    },
    index: {
      type: [Number, String],
    },
    isparm:{
      type:Boolean
    },
    IsMerge:{
      type:Boolean
    }
  },

  data() {
    return {
      menuVisible: false,
      menuX: '0px',
      menuY: '0px',
      currentRow: '',
      hoverColor: 'rgba(135,206,250, 0.2)',
      curRow: null,
      curCol: null,
      IsChoose:0,
    }
  },
  mounted() {
    document.body.addEventListener('click', () => {
      if (this.menuVisible) this.menuVisible = !this.menuVisible
    })
  },
  methods: {
    clickTable(e) {
      this.$emit('click', e)
    },
    mouseenter(col, row) {
      this.curCol = col
      this.curRow = row
    },
    // 右键展开菜单
    openMenu(e, text) {
      e.preventDefault()
      // this.menuX = e.target.offsetLeft + e.offsetX + 'px'
      // this.menuY = (e.target.offsetTop + e.offsetY) + 'px'
      this.currentRow = text
      this.menuVisible = true
      this.menuX = e.x + 'px'
      this.menuY = e.y + 'px'
    },
    HandleColor(Cval, Rval, val) {
      if (this.index === 'T2_Activity') {
        if(Rval===0) return ''
          else if((Cval===2||Cval===4)&&Rval!==0) return  (val>0)?'red':'green'
          else return ''
      }else if(this.index === 'StoreBPreSale'){
        if(Rval===6) return (val>1)?'red':'green'
          else return ''
      }
    },
    HandVal(Cval, Rval, val){

      if(this.index==='T2_Activity'){
        if(Rval===0) return val
          else if((Cval===2||Cval===4)&&Rval!==0) return  HandleNum('percent', val)
          else return HandleNum('tenThousand',val)
      }else if(this.index === 'StoreBPreSale'){
        if(Rval===0||Rval===1) return val
          else if(Rval===6||Rval===7||Rval===10) return HandleNum('percent',val)
          else return HandleNum('round',val)
      }else{
        return val
      }

    },

    SentParm(data,Cval,Rval){
      this.IsChoose=Cval;
      this.$emit("OnParm", data);
    }

  },
}
</script>

<style lang="scss" scoped>
@import '../assets/styles.scss';
.tablelist {
  height: 100%;

  .tableltbody{
    height: calc(100% - 27px);
  }

  .tableltbody_sub{
    height: calc(100% - 54px);
  }

  .tablelthead .TRORCLeftTUser2,
  .tableltbody .TRORCLeftTUser2,
  .tableltbody_sub .TRORCLeftTUser2 {
    font-size: 12px;
    line-height: 2;
    width: 100%;
    table-layout: fixed;
    border-collapse: collapse;
    text-align: center;
    td {
      border: 1px solid #e7e9f0;
      border-top: 0px;

      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    tr:nth-child(2n) {
      background-color: #fcfcff;
    }
    // thead tr {
    //   background-color: #f5f7ff;
    // }
  }
  .tablelthead .TRORCLeftTUser2{
    thead tr {
      background-color: #f5f7ff;
    }
    tr:nth-child(2n) {
      background-color: #f5f7ff;
    }
    td {
      border-top: 1px solid #e7e9f0;
    }    
    .TitleHand{
      display: contents;
    }  
  }

  .tableltbody .TRORCLeftTUser2,
  .tableltbody_sub .TRORCLeftTUser2{
    td.red{
      color: $red;
    }
    td.green{
      color: $green;
    }
    .BodyHand{
      display: contents;
    }

    td.IsLine{
      text-decoration: underline;
      cursor: pointer;      
    }
    td.ChooseCss{
      color: #4C89FF;
    }

  }


  .tablelthead .TRORCLeftTUser2,
  .tableltbody .TRORCLeftTUser2{
    td.Title{
      width: 105px;
    }
  }


  .selectMenu {
    position: absolute;
    // position: relative;
    background: #fff;
    border-radius: 2px;
    border: 1px solid #ccc;
    z-index: 2;
    .item {
      cursor: text;
      padding: 5px 20px;
      font-size: 12px;
      color: #666;
    }
    .item:hover {
      background: #f3f3f3;
    }
  }
}
</style>