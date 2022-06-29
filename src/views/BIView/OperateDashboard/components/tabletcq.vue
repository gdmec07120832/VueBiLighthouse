<template>
  <div @click="clickTable" class="tablelist">
    <div class="tablelthead" style="padding-right: 8px;">
      <table class="TRORCLeftTUser2">
        <thead>
          <tr v-if="labelSub" class="labelSubCss">
            <div v-for="(item, index) in labelSub" :key="index" class="TitleHand">
              <td v-if="item.name!=='-1'" :class="[(index===0)?'Title':'ConSub'+index ]"
                style="vertical-align: middle;" :rowspan="item.row" :colspan="item.col">{{item.name}}</td>
            </div>
          </tr>


          <tr>
            <div v-for="(item, index) in labelD" :key="index" class="TitleHand">
              <td v-if="item!=='-1'" :title="item" :class="[(index===0)?'Title':'Con'+index]">{{ item }}</td>
            </div>
          </tr>


          <tr v-if="IsTotalArr" class="IsTotal" style="background-color: #ffffff;">
            <div v-for="(item, index) in IsTotalArr.arr[0]" :key="index" class="TitleHand">
              <td :class="[HandleColor('Total',index,item),(index===0)?'Title':'Con'+index]"
                @mouseenter="mouseenter('total', index)"
                @contextmenu="openMenu($event, HandVal('Total',index,item))"
                :title="HandVal('Total',index,item)"
                :style="[
                  {
                    background:
                      (curRow === index) || (curCol === 'total') ? hoverColor : null,
                  },
                ]"
              >
                {{ HandVal('Total',index,item)}}
              </td>
            </div>
          </tr>

        </thead>
      </table>
    </div>


    <div v-if="IsPage" class="IsPageCss">
      <div  :class="[(IsTotalArr)?'tableltbody_Total':(labelSub)?'tableltbody_sub':'tableltbody']" style="width: 100%; overflow-y: scroll; border: 0px solid">
        <div class="PageCont">
          <table class="TRORCLeftTUser2">
            <tbody  @mouseleave="mouseenter(null, null)">
              <tr v-for="(item, index) in ((IsRankData)?IsRankData:tableD).slice(StartNum,EndNum)" :key="index"
                :style="{height:BodyTdHeight?BodyTdHeight:''}"
              >
                <td
                  @mouseenter="mouseenter(index, index1)"
                  @contextmenu="openMenu($event, item1)"
                  :title="item1"
                  :style="[
                    {
                      background:
                        (curRow === index1) || (curCol === index) ? hoverColor : null,
                    },
                  ]"
                  v-for="(item1, index1) in item"
                  :key="index1"
                  :class="[HandleColor(index,index1,item1),
                    (isparm&&index1===0)?'IsLine':'',(isparm&&IsChoose===index&&index1===0)?'ChooseCss':'',(index1===0)?'Title':'ConBoy'+index1]"
                  @click="(isparm&&index1===0)?SentParm(item1,index,index1):''"
                >
                  {{ HandVal(index,index1,item1)}}
                </td>
              </tr>
            </tbody>
          </table>             
        </div>
      </div>
      <div style="padding-top: 10px;display: flex;justify-content: flex-end;">
        <a-pagination v-if="IsPage"
          :current="Pagination.page" 
          :pageSize="Pagination.pageSize"
          :total="Pagination.total"
          :showTotal="total => `共${total}条, 第${Pagination.page}页`"
          :pageSizeOptions="Pagination.pageSizeOptions"
          @change="PagChange"
          @showSizeChange="ShowSizeChange"
          show-size-changer
        />         
      </div>
    </div>

    <div v-else :class="[(IsTotalArr)?'tableltbody_Total':(labelSub)?'tableltbody_sub':'tableltbody']" style="width: 100%; overflow-y: scroll; border: 0px solid">
      <table class="TRORCLeftTUser2">
        <tbody v-if="IsMerge" @mouseleave="mouseenter(null, null)">
          <tr v-for="(item, index) in ((IsRankData)?IsRankData:tableD)" :key="index"
            :style="{height:BodyTdHeight?BodyTdHeight:''}"
          >
            <div class="BodyHand" v-for="(item1, index1) in item" :key="index1">
              <td v-if="item1.value!=='-1'" style="vertical-align: middle;"
                @mouseenter="mouseenter(index, index1)"
                @contextmenu="openMenu($event, item1.value)"
                :title="item1.value"
                :style="[
                  {
                    background:
                      (curRow === index1) || (curCol === index) ? hoverColor : null,
                  },
                ]"
                :rowspan="item1.row"
                :class="[HandleColor(index,index1,item1.value),
                  (isparm&&index1===0)?'IsLine':'',(isparm&&IsChoose===index&&index1===0)?'ChooseCss':'',(index1===0)?'Title':'ConBoy'+index1]"
                @click="(isparm&&index1===0)?SentParm(item1.value,index,index1):''"
              >
                {{ HandVal(index,index1,item1.value)}}
              </td>              
            </div>

          </tr>
        </tbody>
        <tbody v-else @mouseleave="mouseenter(null, null)">
          <tr v-for="(item, index) in ((IsRankData)?IsRankData:tableD)" :key="index"
            :style="{height:BodyTdHeight?BodyTdHeight:''}"
          >
            <td
              @mouseenter="mouseenter(index, index1)"
              @contextmenu="openMenu($event, item1)"
              :title="item1"
              :style="[
                {
                  background:
                    (curRow === index1) || (curCol === index) ? hoverColor : null,
                },
              ]"
              v-for="(item1, index1) in item"
              :key="index1"
              :class="[HandleColor(index,index1,item1),
                (isparm&&index1===0)?'IsLine':'',(isparm&&IsChoose===index&&index1===0)?'ChooseCss':'',(index1===0)?'Title':'ConBoy'+index1]"
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
import orderBy from 'lodash/orderBy'
import { HandleNum } from '../utils/tcq'

export default {
  name: 'TableComptcq',
  props: {
    labelSub:{
      type: Array,
    },
    BodyTdHeight:{
      type:String
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
    },

    IsRankDefa:{
      type:[Boolean,Object]
    },
    IsTotalArr:{
      type:[Object]
    },
    IsPage:{
      type:Boolean
    },
    Pagination_SenOn:{
      type:[Array,Object]
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
      IsCurrent:null,
      IsRankData:null,
      OnNum:null,
      LastNum:null,
      Pagination: {
        show: true,
        page: 1,
        pageSize: 10,
        total: 100,
        pageSizeOptions:['10','20','30','50','100'],
      },
      StartNum:0,
      EndNum:10,


    }
  },


  watch: {
    'tableD': {
      handler() {
        // console.log("========aaaaa=======");
        // console.log(this.labelD);   
        this.IsRankData = null;     

      }
    },
  },

  mounted() {

    if(this.IsPage){
      this.Pagination=this.Pagination_SenOn;
      this.StartNum=0;
      this.EndNum=this.Pagination.pageSize;   
    }
    if(this.IsRankDefa.Boolean){
      this.OnNum=this.IsRankDefa.index;
      this.IsCurrent=this.IsRankDefa.value;
    }



    document.body.addEventListener('click', () => {
      if (this.menuVisible) this.menuVisible = !this.menuVisible
    })
  },
  methods: {

    PagChange(page, pageSize){
      // console.log("===========变化的！==========");
      // console.log(page+'   '+pageSize);
      this.StartNum=pageSize*page-pageSize;
      this.EndNum=pageSize*page;
      this.Pagination.page=page;
    },
    ShowSizeChange(current, size){
      // console.log("=========Size==========");
      // console.log(current+'  '+size);
      this.StartNum=0;
      this.EndNum=size;
      this.Pagination.pageSize=size;
    },

    OnIsRankFun(num){
      // console.log("========aaaaa=======");
      // console.log(this.labelD);
      this.OnNum=num;
      if(this.OnNum !== this.LastNum){
        this.IsCurrent=null;
      }
      let sum=this.tableD.filter(_=>_[1] === '合计');
      let tabcont = this.tableD.filter(_=>_[1]!=='合计');
      switch (this.IsCurrent) {
          case null:
              this.IsCurrent = 'up'
              tabcont.sort((a, b) => (a[num] - b[num]));
              (sum.length>0)?tabcont.unshift(sum[0]):'';
              this.IsRankData=tabcont;
              break;
          case 'up':
              this.IsCurrent = 'down'
              tabcont.sort((a, b) => (b[num] - a[num]));
               (sum.length>0)?tabcont.unshift(sum[0]):'';
              this.IsRankData=tabcont;
              break;
          case 'down':
              this.IsCurrent = null
              this.IsRankData=this.tableD;
              break;
      }
      this.LastNum=this.OnNum;
    },
    clickTable(e) {
      this.$emit('click', e)
    },
    mouseenter(col, row) {
      this.curCol = col;
      this.curRow = row;
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
      if(val!=undefined){
        if(val.value){
          if (this.index === 'T3_AttractInvestmentCate') {
            if(Rval===0) return ''
              else if(Rval===4) return  (val.value2)?(val.value>val.value2)?'red':'green':'--'
              else return ''
          }else if(this.index==='T4_BDPen'){
            if(Rval===0||Rval===1) return ''
              else if(Cval===2||Cval===5) return (val.value&&val.value2)?(val.value>0)? 'red':'green':''
          }  
        }else{
          if (this.index === 'AfterSalesExpenses') {
            if(Rval===0) return ''
              else if(Cval===2||Cval===5) return (val)?(val<0)? 'red':'green':''
          }else if(this.index==='OrderDistributionV2_UP'){
            if(Rval===3) return (val)?(val>1)?'red':'green':''
          }

        }
      }
      

    },
    HandVal(Cval, Rval, val){
      if(val!=undefined){
        if(val.value){
          if(this.index==='OrderDistributionV2_Dow'){
            if(Rval===0) return val.value
              else if((Rval===1)) return  HandleNum('round', val.value)
              else return (val!==0||val)? HandleNum('percent',val.value):'--'
          }
        }else{
          
          if(this.index==='OrderDistributionV2_Dow'){
            if(Rval===0) return val
              else if((Rval===1||Rval===5)) return  HandleNum('round', val)
              else return (val!==0||val)? HandleNum('percent1',val):'--'
          }else if(this.index==='AfterSalesExpenses'){
            if(Rval===0) return val
              else if(Cval===0||Cval===1) return HandleNum('round', val)
              else if(Cval===3||Cval===4||Cval===2||Cval===5) return HandleNum('percent', val)
          }else if(this.index==='OrderDistributionV2_UP'){
            if(Rval===0) return val
              else if(Rval===1||Rval===2||Rval===4||Rval===5||Rval===6) return HandleNum('round', val)
              else if(Rval===3) return HandleNum('percent1',val)
              else return val
          }

        }
      }
      return val;

    },

    SentParm(data,Cval,Rval){
      this.IsChoose=Cval;
      this.$emit("OnParm", data);
    }

  },
}
</script>

<style lang="scss" scoped>
.tablelist {
  height: 100%;

  .tableltbody{
    height: calc(100% - 27px);
    table{
      height: calc(100% - 2px);
      tbody{
        height: 100%;
      }
    }
  }

  .tableltbody_sub{
    height: calc(100% - 54px);
    table{
      height: calc(100% - 2px);
      tbody{
        height: 100%;
      }
    }
  }

  .tableltbody_Total{
    height: calc(100% - 81px);
    table{
      height: calc(100% - 2px);
      tbody{
        height: 100%;
      }
    }
  }

  .IsPageCss{
    height: calc(100% - 42px);
    .tableltbody{
      height: calc(100% - 27px);
      table{
        // height: calc(100% - 2px);
        tbody{
          // height: 100%;
        }
      }
    }
    .tableltbody_sub{
      height: calc(100% - 54px);
      table{
        // height: calc(100% - 2px);
        tbody{
          // height: 100%;
        }
      }
    }
    .tableltbody_Total{
      height: calc(100% - 81px);
      table{
        tbody{
        }
      }
    }
  }



  .tablelthead .TRORCLeftTUser2,
  .tableltbody .TRORCLeftTUser2,
  .tableltbody_sub .TRORCLeftTUser2,
  .tableltbody_Total .TRORCLeftTUser2 {
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
    .IsRank{
      td.OnR{
        position: relative;
        cursor: pointer;
        .IsRankAllCss{
          display: flex;
          justify-content: center;          
          .THName{
            // margin-top: -2px;
          }          
        }
      }
    }  
  }

  .tableltbody .TRORCLeftTUser2,
  .tableltbody_sub .TRORCLeftTUser2,
  .tableltbody_Total .TRORCLeftTUser2,
  .TRORCLeftTUser2 thead tr{
    td.red{
      color: #ff5953;
    }
    td.green{
      color: #00a854;
    }
    .BodyHand{
      display: contents;
    }

    td.IsLine{
      text-decoration: underline;
      cursor: pointer;      
    }
    td.IsLine:hover{
      color: #4C89FF;
    }
    td.ChooseCss{
      color: #4C89FF;
    }

  }


  .tablelthead .TRORCLeftTUser2,
  .tableltbody .TRORCLeftTUser2{
    td.Title{
      // width: 105px;
      
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