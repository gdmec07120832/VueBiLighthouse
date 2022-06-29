<template>
  <div class="MonitAll" style="overflow: hidden">

    <div
      :style="{
        width: bg_css.BgAllWidth / 1 + 'px',
        height: bg_css.BgAllWidth / 1.78 + 'px',
        overflow: 'hidden'
      }"
      class="MonitBg"
    >
      <div class="dataTime" :style="{
        top: bg_css.BgAllWidth / 60 + 'px',
        right: bg_css.BgAllWidth / 32 + 'px',
        'z-index': '2'
      }">数据加载时间：{{dataTime}}</div>
      <div class="star" :style="{
        width: bg_css.BgAllWidth / 1 + 'px',
        height: bg_css.BgAllWidth / 1.78 + 'px',
        overflow: 'hidden'
      }"></div>
      <!-- 标题开始 -->
      <!-- <div
        class="MonitTitle"
        style="float: left"
        :style="{
          'margin-left': bg_css.BgAllWidth / 20.65 + 'px',
          'font-size': bg_css.BgAllWidth / 32 + 'px',
          'margin-top': bg_css.BgAllWidth / 96 + 'px',
        }"
      >
        <div class="MonitTitleCss">
          <p class="p1">新品监控大屏</p>
        </div>
      </div> -->
          <!-- 'margin-left': bg_css.BgAllWidth / 20.65 + 'px', -->

      <div class="MonitTitle" :style="{
          'float': 'left',
          'height': bg_css.BgAllWidth / 16.7 + 'px',
        }">
        <div class="box" :style="{
          'width': bg_css.BgAllWidth / 2.1 + 'px',
          'height': bg_css.BgAllWidth / 10.97 + 'px',
        }"></div>
        
        <div :style="{
          'width': bg_css.BgAllWidth / 1.088 + 'px',
          'height': bg_css.BgAllWidth / 2.95 + 'px',
          display: 'flex',
          'flex-direction': 'column'
        }">
          <div class="bg1" :style="{
            'width': bg_css.BgAllWidth / 1.088 + 'px',
            'min-height': bg_css.BgAllWidth / 2.95 + 'px',
          }"></div>
        </div>
      </div>

      <div style="clear: both"></div>
      <!-- 标题结束 -->
      <div class="MonitCont" :style="{
        'width': bg_css.BgAllWidth / 1.0406 + 'px',
        'height': bg_css.BgAllWidth / 1.99 + 'px',
        'margin': 'auto',
        'display': 'flex'
      }">
        <div class="bg"></div>

        <div class="MonitContLeft" style="float: left;z-index: 1">
              <!-- 'margin-left': bg_css.BgAllWidth / 24.62 + 'px', -->
          <div
            class="MonitContLeftOn"
            :style="{
              width: bg_css.BgAllWidth / 1.777 + 'px',
              height: bg_css.BgAllWidth / 2.11 + 'px',
              'margin-top': bg_css.BgAllWidth / 128 + 'px',
            }"
          >
            <!-- 左边开始 -->
            <div class="MonitCLeftOAll">
              <!-- 左标题开始 -->
              <div class="MonitCLOTitle">
                <div
                  class="MonitCLOText"
                  style="float: left"
                  :style="{
                    'margin-left': bg_css.BgAllWidth / 61.94 + 'px',
                    'margin-top': bg_css.BgAllWidth / 32 + 'px',
                    'font-size': bg_css.BgAllWidth / 68.57 + 'px',
                  }"
                >
                  <p>
                    项目组新品概览
                    <!-- <span
                      style="color: #ffffff"
                      :style="{
                        'font-size': bg_css.BgAllWidth / 96 + 'px',
                        'margin-left': bg_css.BgAllWidth / 192 + 'px',
                      }"
                      >(当月)</span
                    > -->
                  </p>
                </div>

                <!-- <div
                  class="MonitCLOCen"
                  :style="{
                    width: bg_css.BgAllWidth / 4.9 + 'px',
                    height: bg_css.BgAllWidth / 384 + 'px',
                    'margin-left': bg_css.BgAllWidth / 106.67 + 'px',
                    'margin-top': bg_css.BgAllWidth / 22.59 + 'px',
                  }"
                ></div> -->

                <!-- <div
                  class="MonitCLOCss"
                  :style="{
                    width: bg_css.BgAllWidth / 7.65 + 'px',
                    height: bg_css.BgAllWidth / 192 + 'px',
                    'margin-top': bg_css.BgAllWidth / 24.62 + 'px',
                  }"
                ></div> -->
              </div>
              <div style="clear: both"></div>
              <!-- 左标题结束 -->

              <!-- 表头列表开始 'font-size': bg_css.BgAllWidth / 120 + 'px',-->
              <div
                class="MonitCLOList"
                :style="{
                  'margin-left': bg_css.BgAllWidth / 71.11 + 'px',
                  'width': bg_css.BgAllWidth / 1.88 + 'px',
                  'font-size': bg_css.BgAllWidth / 101.05+'px',
                  'margin-top': bg_css.BgAllWidth / 96 + 'px',
                }"
              >
                <table>
                  <tbody>
                    <tr class="tableTitle" :style="{'height': bg_css.BgAllWidth / 44.65 + 'px',}">
                      <td class="group" rowspan='2'>项目组</td>
                      <td colspan='2' style="border-right: 1px solid #1E3C6D;">上架数量</td>
                      <td colspan='4' style="border-right: 1px solid #1E3C6D;">可销售sku数</td>
                      <!-- <td>达成</td> -->
                      <td style="border-right: 1px solid #1E3C6D;">净增</td>
                      <td class="matv">销售额</td>
                    </tr>
                    <tr class="tableTitle2" :style="{'height': bg_css.BgAllWidth / 44.65 + 'px',}">
                      <!-- <td>项目组</td> -->
                      <td>spu数</td>
                      <td style="border-right: 1px solid #1E3C6D;">sku数</td>
                      <td>sku总数</td>
                      <td>停产数</td>
                      <td>停产占比</td>
                      <td style="border-right: 1px solid #1E3C6D;">净增数</td>
                      <td style="border-right: 1px solid #1E3C6D;">spu数</td>
                      <td class="newmat">新品占比</td>
                    </tr>
                  </tbody>

                  <!-- 29.54 -->
                  <tbody v-for="(item,index) in UserData.Group" :key="index">
                    <div style="width:100%;display:none;" :style="{'height': bg_css.BgAllWidth / 640 + 'px',}"></div>
                    <tr class="MonitCLOCon" :style="{'height': bg_css.BgAllWidth / 40 + 'px','font-weight': (index==0)?'bold':''}">
                      <td style="border-top-left-radius: 5px;border-bottom-left-radius: 5px;" >{{item.TEAM_SUPPLY}}</td>
                      <td :style="{'color':(item.SPU_CNT_YOY==0)?'#67D516':(item.SPU_CNT_YOY<0)?'#67D516':'#FF2727'}">{{item.SPU_CNT}}</td>  
                      <td :style="{'color':(item.SKU_CNT_YOY==0)?'#67D516':(item.SKU_CNT_YOY<0)?'#67D516':'#FF2727'}">{{item.SKU_CNT}}</td>   
                      <td>{{item.SKU_MARKBLE_CNT}}</td>  
                      <td>{{item.SKU_STOP_MARKBLE_CNT}}</td>   
                      <td>{{(item.SKU_STOP_MARKBLE_RTO)?((item.SKU_STOP_MARKBLE_RTO*100).toFixed(0)+'%'):'--'}}</td>
                      <td>{{item.INCR_SKU_MARKBLE_CNT}}</td>  
                      <td>{{item.INCR_SPU_MARKBLE_CNT}}</td>  
                      <td style="border-top-right-radius: 5px;border-bottom-right-radius: 5px;">
                        {{(item.NEW_MTRL_ACT_PRICE_RTO)?((item.NEW_MTRL_ACT_PRICE_RTO*100).toFixed(0)+'%'):'--'}}
                      </td>
                    </tr>   
                  </tbody>


                </table>
              </div>
              <!-- 表头列表结束 -->
            </div>
            <!-- 左边结束 -->
          </div>
        </div>

        <div class="MonitContRight" style="color: #ffffff; float: left;z-index: 1">
          <!-- 右边 -->
          <div class="MonitCRightUp">
            <div class="MonitCRtUpBg" :style="{'width': bg_css.BgAllWidth / 2.55 + 'px','height': bg_css.BgAllWidth / 4.32 + 'px',
              'margin-top': bg_css.BgAllWidth / 128 + 'px','margin-left': bg_css.BgAllWidth / 320 +'px'
            }">

              <!-- 右上标题开始 -->
              <div class="MonitCLOTitle">
                <div
                  class="MonitCLOText"
                  style="float: left"
                  :style="{
                    'margin-left': bg_css.BgAllWidth / 61.94 + 'px',
                    'margin-top': bg_css.BgAllWidth / 32 + 'px',
                    'font-size': bg_css.BgAllWidth / 68.57 + 'px',
                  }"
                >
                  <p>
                    新品立项
                    <!-- <span
                      style="color: #ffffff"
                      :style="{
                        'font-size': bg_css.BgAllWidth / 96 + 'px',
                        'margin-left': bg_css.BgAllWidth / 192 + 'px',
                      }"
                      >(当月)</span
                    > -->
                  </p>
                </div>
                <!-- <div
                  class="MonitCLOCen"
                  :style="{
                    width: bg_css.BgAllWidth / 4.9 + 'px',
                    height: bg_css.BgAllWidth / 384 + 'px',
                    'margin-left': bg_css.BgAllWidth / 106.67 + 'px',
                    'margin-top': bg_css.BgAllWidth / 36.92 + 'px',
                  }"
                ></div> -->
                <!-- <div
                  class="MonitCROCss2"
                  :style="{
                    width: bg_css.BgAllWidth / 14.88 + 'px',
                    height: bg_css.BgAllWidth / 192 + 'px',
                    'margin-top': bg_css.BgAllWidth / 42.67 + 'px',
                  }"
                ></div> -->
              </div>
              <div style="clear: both"></div>
              <!-- 右上标题结束 -->

              <!-- 右上列表开始 height: 300px; overflow: auto; style="overflow: auto;"-->
              <div class="MonitCRUList" :style="{'width': bg_css.BgAllWidth / 2.75 + 'px',
                'margin-left': bg_css.BgAllWidth / 61.94 + 'px','font-size': bg_css.BgAllWidth / 101.05 + 'px',
                'margin-top': bg_css.BgAllWidth / 80+ 'px',
              }">
                <ul class="MonitCRULUi" :style="{'height': bg_css.BgAllWidth / 5.75 + 'px',}">
                  <li class="MonitCRULUTitle" :style="{'height': bg_css.BgAllWidth / 35.56 + 'px',
                    'line-height': bg_css.BgAllWidth / 36.23+'px','margin-bottom': bg_css.BgAllWidth / 240+ 'px',
                  }">
                    <ul>
                      <!-- <li style="width:10%;text-align: left;padding-left: 15px;"><p>主图</p></li> -->
                      <li style="width: 43%;" class="MonitCRULUTName"><p>主型号</p></li>
                      <li><p>项目部</p></li>
                      <li><p>上架时间</p></li>
                    </ul>
                    <div style="clear: both;"></div>
                  </li>


                  <div ref="UserScrollDiv" id="" style="overflow: hidden;" :style="{'height': (bg_css.BgAllWidth / 28.24)*4 + 'px',}">
                    <div ref="UserScroll1" id="">
                      <li v-for="(item,index) in UserData.NewItem" :key="index" class="MonitCRULUCont" 
                      :style="{'height': bg_css.BgAllWidth / 28.24 + 'px',
                        'line-height': bg_css.BgAllWidth / 29.1+'px',
                      }">
                        <!--  -->
                        <ul>
                          <li style="width:10%;">
                            <img :src="(item.IMAGE_URL=='/')?img.ximg:item.IMAGE_URL" :width="bg_css.BgAllWidth / 38.4" :height="bg_css.BgAllWidth / 38.4" 
                              style="float: left;margin-left: 10px;"
                              :style="{'margin-top':((bg_css.BgAllWidth / 28.24)-(bg_css.BgAllWidth / 38.4))/2+'px'}"
                            />
                          </li>  
                        
                          <li style="width: 33.5%;" class="MonitCRULUCName" >
                            <!-- <i :style="{'width': bg_css.BgAllWidth / 38.4 + 'px','height': bg_css.BgAllWidth / 38.4 + 'px',
                              'background':(item.IMAGE_URL=='/')?('url('+img.ximg+') no-repeat left top/cover'):('url('+item.IMAGE_URL+') no-repeat left top/cover'),
                              'margin-top':((bg_css.BgAllWidth / 28.24)-(bg_css.BgAllWidth / 38.4))/2+'px'
                            }"></i>  -->
                            <!-- <img :src="(item.IMAGE_URL=='/')?img.ximg:item.IMAGE_URL" :width="bg_css.BgAllWidth / 38.4" :height="bg_css.BgAllWidth / 38.4" 
                              style="margin-right: 30px;float: left;"
                              :style="{'margin-top':((bg_css.BgAllWidth / 28.24)-(bg_css.BgAllWidth / 38.4))/2+'px'}"
                            /> -->
                            <p>{{item.MAIN_MODEL}}</p></li>  

                          <li><p>{{item.TEAM_SUPPLY}}</p></li>
                          <li><p>{{item.USERTIME}}</p></li>
                        </ul>
                        <div style="clear: both;"></div>
                      </li>                       
                    </div>

                    <div ref="UserScroll2" id=""></div>
                   
                  </div>




                </ul>
              </div>
              <!-- 右上列表结束 -->



            </div>
          </div>

          <div class="MonitCRightDown">
            <div class="MonitCRDownBg" :style="{'width': bg_css.BgAllWidth / 2.55 + 'px','height': bg_css.BgAllWidth / 4.24 + 'px',
              'margin-top': bg_css.BgAllWidth / 137.14 +'px','margin-left': bg_css.BgAllWidth / 320 +'px'
            }">

              <!-- 右下标题开始 -->
              <div class="MonitCLOTitle">
                <div
                  class="MonitCLOText"
                  style="float: left"
                  :style="{
                    'margin-left': bg_css.BgAllWidth / 61.94 + 'px',
                    'margin-top': bg_css.BgAllWidth / 60 + 'px',
                    'font-size': bg_css.BgAllWidth / 68.57 + 'px',
                  }"
                >
                  <p>
                    新品销售额排名Top30
                    <!-- <span
                      style="color: #ffffff"
                      :style="{
                        'font-size': bg_css.BgAllWidth / 96 + 'px',
                        'margin-left': bg_css.BgAllWidth / 192 + 'px',
                      }"
                      >(当月)</span
                    > -->
                  </p>
                </div>
                <!-- <div
                  class="MonitCLOCen"
                  :style="{
                    width: bg_css.BgAllWidth / 7.8 + 'px',
                    height: bg_css.BgAllWidth / 384 + 'px',
                    'margin-left': bg_css.BgAllWidth / 106.67 + 'px',
                    'margin-top': bg_css.BgAllWidth / 36.92 + 'px',
                  }"
                ></div> -->
                <!-- <div
                  class="MonitCROCss2"
                  :style="{
                    width: bg_css.BgAllWidth / 14.88 + 'px',
                    height: bg_css.BgAllWidth / 192 + 'px',
                    'margin-top': bg_css.BgAllWidth / 42.67 + 'px',
                  }"
                ></div> -->
              </div>
              <div style="clear: both"></div>
              <!-- 右下标题结束 -->
              <!-- this.UserData.NmewAmtTop -->

              <!-- 右下列表开始 -->
              <div class="MonitCRDList" :style="{'width': bg_css.BgAllWidth / 2.75 + 'px',
                'margin-left': bg_css.BgAllWidth / 61.94 + 'px','font-size': bg_css.BgAllWidth / 101.05 + 'px',
                'margin-top': bg_css.BgAllWidth / 106.67+ 'px',
              }">
                <!-- style="overflow: auto;" :style="{'height': bg_css.BgAllWidth / 5.75 + 'px',}" -->
                <ul class="MonitCRDLUi">
                  <li class="MonitCRDLUTitle" style="position: relative;z-index: 99;opacity: 1;" :style="{'height': bg_css.BgAllWidth / 35.56 + 'px',
                    'line-height': bg_css.BgAllWidth / 36.23+'px','margin-bottom': bg_css.BgAllWidth / 240+ 'px',
                  }">
                    <ul>
                      <li style="width:15%;">排名</li>
                      <!-- <li style="width:10%;text-align: left;" >主图</li> -->
                      <li style="width:30%;" class="MonitCRDLUTName">主型号</li>
                      <li style="width:20%">项目部</li>
                      <li>累计销量</li>
                      <li>上架时间</li>
                    </ul>
                    <div style="clear: both;"></div>
                  </li> 

                  <div ref="UserScrollDivTOP" id="" style="float: left;overflow: hidden;width: 100%;" 
                  :style="{'height':(bg_css.BgAllWidth / 28.24)*4 + 'px',}">
                    <!-- <div :class="{AnimUser:animate==true}" :style="{'margin-top': ((animate==true)?-(bg_css.BgAllWidth / 28.24)*AnMargin_top:0)+'px'}"> -->
                    <div ref="UserScrollTOP1" id="">
                      <li class="MonitCRDLUCont" v-for="(item,index) in UserData.NmewAmtTop" :key="index"
                      :style="{'height': bg_css.BgAllWidth / 28.24 + 'px',
                        'line-height': bg_css.BgAllWidth / 29.1+'px',
                      }">
                        <ul>
                          <li style="width:15%;" class="MonitCRDLUTImg">
                            <div style="width:100%;" :style="{'height':((bg_css.BgAllWidth / 28.24)-(bg_css.BgAllWidth / 38.4))/2+'px'}"></div>
                            <i :class="'img'+item.NUMBERUSER" 
                            :style="{'width': bg_css.BgAllWidth / 38.4 + 'px','height': bg_css.BgAllWidth / 38.4 + 'px',
                              'font-size': bg_css.BgAllWidth / 64 + 'px', 'line-height': bg_css.BgAllWidth / 38.4+'px',
                            }">
                            <!-- v-if="item.NUMBERUSER>2" -->
                              <span  style="font-style: normal;">{{(item.NUMBERUSER&&item.NUMBERUSER*1+1)}}</span>
                            </i>
                          </li>
                          <!--  -->
                          <!-- 'background': (item.IMAGE_URL=='/')?('url('+img.ximg+') no-repeat left top/cover'):'url('+item.IMAGE_URL+') no-repeat left top/cover', -->

                          <li  style="width:10%;">
                            <img :src="(item.IMAGE_URL=='/')?img.ximg:item.IMAGE_URL" :width="bg_css.BgAllWidth / 38.4" :height="bg_css.BgAllWidth / 38.4" 
                              style="float: left;"
                              :style="{'margin-top':((bg_css.BgAllWidth / 28.24)-(bg_css.BgAllWidth / 38.4))/2+'px'}"
                            />
                          </li> 
                          <li  style="width:20%;" class="MonitCRDLUTName">
                            <!-- <i :style="{'width': bg_css.BgAllWidth / 38.4 + 'px','height': bg_css.BgAllWidth / 38.4 + 'px',
                              'background':('url('+img.ximg+') no-repeat left top/cover'),
                              'margin-top':((bg_css.BgAllWidth / 28.24)-(bg_css.BgAllWidth / 38.4))/2+'px'}"></i> -->

                            <!-- <img :src="(item.IMAGE_URL=='/')?img.ximg:item.IMAGE_URL" :width="bg_css.BgAllWidth / 38.4" :height="bg_css.BgAllWidth / 38.4" 
                              style="margin-right: 30px;float: left;"
                              :style="{'margin-top':((bg_css.BgAllWidth / 28.24)-(bg_css.BgAllWidth / 38.4))/2+'px'}"
                            /> -->
                            
                            <div :id="'TOP30Text_'+index" style="float: left; white-space:nowrap; overflow:hidden;"
                              :style="{'width': bg_css.BgAllWidth / 6 + 'px'}">
                              <span :ref="'TOPLi_'+index" :id="'TOP30Text1_'+index">{{item.MAIN_MODEL+'  '}}</span>
                              <span :id="'TOP30Text2_'+index"></span>
                            </div>
                          </li> 

                          <li style="white-space: nowrap;width: 20%">{{item.TEAM_SUPPLY}}</li>
                          <li>{{(item.ACT_PRICE)?(item.ACT_PRICE/10000).toFixed(1)+'万':'--'}}</li>
                          <li>{{item.USERTIME}}</li>
                        </ul>
                        <div style="clear: both;"></div>
                      </li>                       
                    </div>

                    <div ref="UserScrollTOP2" id=""></div>

                  </div>





                </ul>

              </div>
              
              <!-- 右下列表结束 -->






            </div>
          </div>

        </div>

      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
var table_width = window.innerWidth;

    /**word scroll css**/
    // window.onload = roll(40);
    // var Ascroll1 = document.getElementById("scroll1");
    // var Ascroll2= document.getElementById("scroll2");
    // var Ascrolldiv = document.getElementById("scrolldiv"); 

export default {
  name: "NewsMonitoring",
  data() {
    return {

      // scroll_lists:[
      //   {time:'2秒钟前',company:'海康威视（002415）'},  
      //   {time:'8秒钟前',company:'烽火通信（600498）'}, 
      //   {time:'3分钟前',company:'恒逸石化（000703）'},  
      //   {time:'5分钟前',company:'紫光国微（002049）'},
      //   {time:'39分钟前',company:'新天科技（300259）'},
      //   {time:'1小时前',company:'兴业银行（601166）'},
      //   {time:'3小时前',company:'中国核建（601611）'}
      // ],
      // animate:false,
      items:[
        {name:"马云"},
        {name:"雷军"},
        {name:"王勤"}
      ],
      AnMargin_top:0,
      animate:false,
      test: 0,
      img:{
        ximg:require("@/assets/images/datav/NewsMonitoring/noimg.png"),
      },
      UserData:{
        Group:[],
        NewItem:[],
        NmewAmtTop:[]
      },
      bg_css: {
        BgAllWidth: table_width,
      },
      data:{},
      dataTime: ''
    };
  },
  props:['psMsg','CheckValSet'],//接手psMsg值
  created() {

    this.apiMap2 = {     
      "SQL-NON_PM_pds_big_bord-main_model_top30":{resultProp:"main_model_top30"},
      "SQL-NON_PM_pds_big_bord-main_model_shelf":{resultProp:"main_model_shelf"},
      "SQL-NON_PM_pds_big_bord-spl_new_prod":{resultProp:"spl_new_prod"},
    };
    this.ajax_data(this.apiMap2,true);
    console.log(this.data);

    console.log(table_width);
    this.UserData.Group=[{name:'1'},{name:'1'},{name:'1'},{name:'1'},{name:'1'},{name:'1'},{name:'1'},{name:'1'},{name:'1'},{name:'1'}];
    this.UserData.NewItem=[{name:'1'},{name:'1'},{name:'1'},{name:'1'}];
    this.UserData.NmewAmtTop=[{name:'1'},{name:'1'},{name:'1'},{name:'1'}];
  },
  mounted() {

        console.log(this.$refs["UserScroll1"]);

        // var Ascroll1 = document.getElementById("UserScroll1");
        // var Ascroll2= document.getElementById("UserScroll2");
        // var Ascrolldiv = document.getElementById("UserScrollDiv"); 
        var Ascroll1 = this.$refs["UserScroll1"];
        var Ascroll2= this.$refs["UserScroll2"];
        var Ascrolldiv = this.$refs["UserScrollDiv"]; 

        this.scroll1 = Ascroll1;
        this.scroll2= Ascroll2;
        this.scrolldiv = Ascrolldiv;  

        // top30的滚动代码开始
        // var AscrollTOP1 = document.getElementById("UserScrollTOP1");
        // var AscrollTOP2= document.getElementById("UserScrollTOP2");
        // var AscrolldivTOP = document.getElementById("UserScrollDivTOP"); 
        var AscrollTOP1 = this.$refs["UserScrollTOP1"];
        var AscrollTOP2= this.$refs["UserScrollTOP2"];
        var AscrolldivTOP =this.$refs["UserScrollDivTOP"]; 
        this.scrollTOP1 = AscrollTOP1;
        this.scrollTOP2= AscrollTOP2;
        this.scrolldivTOP = AscrolldivTOP;          
        // top30的滚动代码结束

        // console.log(this.scroll1);   
        // console.log(this.scroll2); 
        // console.log(this.scrolldiv);          
        // let test=setInterval(()=>{
        //   if(j==6){
        //     clearInterval(test);
        //   }else{
        //     _this.welcome_characters+=(set_characters.substring(j,j+1));
        //     j++;
        //   }
        // },250);
        // this.timer = setInterval(this.testfun,1000);

        // 初步用这个方案
        // setInterval(this.scroll,1000);
        // var arr2 = ['a','b','c','d'] 
        // arr2.push(arr2[0],arr2[1]),
        // arr2.splice(0,2); 
        // console.log(arr2);

        // console.log("========================asdasdasd============");
        // console.log(this.psMsg);
        // console.log(this.CheckValSet);



    this.user_data_set();
    this.datav_setTimeout(this,this.apiMap2)
    setTimeout(()=>{    
      if(this.psMsg=='大屏切换'){
        this.roll(140); 
        this.rollTOP(140);
      }else{
        this.roll(80); 
        this.rollTOP(80);
      }  
      // console.log(this.psMsg);
      // setInterval(this.ViewScroll,6000);
      
      Object.keys(this.UserData.NmewAmtTop).forEach((keyU) => {
        if(this.$refs["TOPLi_"+keyU][0].offsetWidth>(this.bg_css.BgAllWidth / 11.57)){
          this.rollText(80,keyU);    
        }
      });

    },3000)


  },

  methods: {

    // scroll(){
    //    this.animate=true;    // 因为在消息向上滚动的时候需要添加css3过渡动画，所以这里需要设置true
    //    setTimeout(()=>{      //  这里直接使用了es6的箭头函数，省去了处理this指向偏移问题，代码也比之前简化了很多
    //            this.items.push(this.items[0]);  // 将数组的第一个元素添加到数组的
    //            this.items.shift();               //删除数组的第一个元素
    //            this.animate=false;  // margin-top 为0 的时候取消过渡动画，实现无缝滚动
    //    },500)
    // },
    // 成功的不过看看有没有更好的
    roll(t) {
        //把内容重复复制，达到滚动不间断的效果
        this.scroll2.innerHTML = this.scroll1.innerHTML;
        this.scrolldiv.scrollTop = 0;
        let _this=this;
        // setInterval(this.rollStart, t);
        this.rollStart(_this,t)
    },
    rollStart(set_this,t) {
      setTimeout(()=>{ 
        if (set_this.scrolldiv.scrollTop >= set_this.scroll1.scrollHeight) {
            set_this.scrolldiv.scrollTop = 0;
        } else {
            set_this.scrolldiv.scrollTop++;
            // this.scrolldiv.scrollTop+=10;
        }
        set_this.rollStart(set_this,t);        
      },t);
    },  

    rollTOP(t) {

        //把内容重复复制，达到滚动不间断的效果
        this.scrollTOP2.innerHTML = this.scrollTOP1.innerHTML;
        this.scrolldivTOP.scrollTop = 0;
        let _this=this;
        //  setInterval(this.rollStartTOP, t);
        this.rollStartTOP(_this,t)
    },
    rollStartTOP(set_this,t) {
      setTimeout(()=>{   
        if ((set_this.scrolldivTOP.scrollTop) >= (set_this.scrollTOP1.scrollHeight-((set_this.bg_css.BgAllWidth / 28.24)*4))) {
            set_this.scrolldivTOP.scrollTop = 0;
        } else {
            set_this.scrolldivTOP.scrollTop++;
            // this.scrolldivTOP.scrollTop+=10;
        } 
        set_this.rollStartTOP(set_this,t);           
      },t)
    },  

    rollText(t,num){
        //把内容重复复制，达到滚动不间断的效果
        document.getElementById("TOP30Text2_"+num).innerHTML = document.getElementById("TOP30Text1_"+num).innerHTML;
        document.getElementById("TOP30Text_"+num).scrollTop = 0;
      setInterval( 
        ()=>{
          if ((document.getElementById("TOP30Text_"+num).scrollLeft) >= (document.getElementById("TOP30Text1_"+num).offsetWidth )) {
              document.getElementById("TOP30Text_"+num).scrollLeft = 0;
          } else {
              document.getElementById("TOP30Text_"+num).scrollLeft++;
              // this.Ascrolldivt.scrollLeft+=10;
          }          
        },
      t);
    },


    ViewScroll(){
       this.animate=true;    // 因为在消息向上滚动的时候需要添加css3过渡动画，所以这里需要设置true
       setTimeout(()=>{      //  这里直接使用了es6的箭头函数，省去了处理this指向偏移问题，代码也比之前简化了很多
              //  this.items.push(this.items[0]);  // 将数组的第一个元素添加到数组的
              // this.UserData.NmewAmtTop.push(this.UserData.NmewAmtTop[0],
              //    this.UserData.NmewAmtTop[1],
              //    this.UserData.NmewAmtTop[2],
              //    this.UserData.NmewAmtTop[3]
              //    );
              // // this.items.shift();               //删除数组的第一个元素
              // this.UserData.NmewAmtTop.splice(0,4);
              if(this.AnMargin_top>25){
                this.AnMargin_top=0;
                this.animate=false;  // margin-top 为0 的时候取消过渡动画，实现无缝滚动
              }else{
                this.AnMargin_top++;
              }
              // this.animate=false;  // margin-top 为0 的时候取消过渡动画，实现无缝滚动
       },3000)
    },


    datav_setTimeout(set_val,data){
      // let _this=this;
      setTimeout(()=>{
        set_val.ajax_data(data);
        set_val.user_data_set();
        set_val.datav_setTimeout(set_val,data);
        // let testaa=this.$refs["fanzhuan"]
        // this._fanzhuan(testaa,0,this);
        // if(this.psMsg=='大屏切换'){
        //   this.roll(160); 
        //   this.rollTOP(160);
        // }else{
        //   this.roll(80); 
        //   this.rollTOP(80);
        // }  
      },500000);
    },

    user_data_set(){
      this.p1.then(()=>{
        this.data['NON_PM_pds_big_bord-spl_new_prod']=this.data['NON_PM_pds_big_bord-spl_new_prod'].sort((a,b)=>{return b["SPU_CNT"]-a["SPU_CNT"]});
        this.UserData.Group=this.data['NON_PM_pds_big_bord-spl_new_prod'];
        console.log(this.UserData.Group);
        this.dataTime = moment(this.UserData.Group[0].LOAD_TIME).format('YYYY-MM-DD')
        this.UserData.NewItem=this.data['NON_PM_pds_big_bord-main_model_shelf'];
        this.UserData.NewItem.sort((a, b) => {
          let value_sort = "";
          let a_time = new Date(a["SHELF_DATE"]).getTime(new Date(a["SHELF_DATE"]));
          let b_time = new Date(b["SHELF_DATE"]).getTime(new Date(b["SHELF_DATE"]));
          value_sort = Number(b_time) - Number(a_time);
          return value_sort;
        });
        Object.keys(this.UserData.NewItem).forEach((key_fun) => {
          this.UserData.NewItem[key_fun].USERTIME=(this.UserData.NewItem[key_fun].SHELF_DATE)?(this.UserData.NewItem[key_fun].SHELF_DATE.substring(0,4)+'/'+
            this.UserData.NewItem[key_fun].SHELF_DATE.substring(5,7)+'/'+this.UserData.NewItem[key_fun].SHELF_DATE.substring(8,10)):'--';
        });

        this.UserData.NmewAmtTop=this.data['NON_PM_pds_big_bord-main_model_top30'].sort((a,b)=>{return a["ACT_PRICE_RN"]-b["ACT_PRICE_RN"]});
        Object.keys(this.UserData.NmewAmtTop).forEach((key_rn) => {
          this.UserData.NmewAmtTop[key_rn].NUMBERUSER=key_rn;
          this.UserData.NmewAmtTop[key_rn].USERTIME=(this.UserData.NmewAmtTop[key_rn].SHELF_DATE)?(this.UserData.NmewAmtTop[key_rn].SHELF_DATE.substring(0,4)+'/'+
            this.UserData.NmewAmtTop[key_rn].SHELF_DATE.substring(5,7)+'/'+this.UserData.NmewAmtTop[key_rn].SHELF_DATE.substring(8,10)):'--';
        });
        // console.log(this.UserData.NmewAmtTop);
      
      });
    },
  
    ajax_data(apiMap,Istrue){

      console.log("运行到ajax交互哪里！！！！！！！！");

      let num_api=0;
      // let num_api_pd=0;
      let p_array=[];
      let variable={};

      // 数组处理开始
      Object.keys(apiMap).forEach((key_fun) => {
        num_api++;
        [variable['p'+num_api],variable['resolve'+num_api]]=this.generatePromise();
        p_array.push(variable['p'+num_api]);
        apiMap[key_fun].type=Array;
        apiMap[key_fun]['resolve'+num_api]=variable['resolve'+num_api];
        apiMap[key_fun]['num']=num_api;
      });
      // 数组处理结束

      Object.keys(apiMap).forEach((key) => {

          const [, prefix, interfaceName] = key.split("-"); //把上面的拆分出来
          if (prefix && interfaceName) {
            this.$axios
              .post(`/api/admin/data/${prefix}/${interfaceName}/get`, {},(Istrue)?{headers:{username:encodeURIComponent("新品监控大屏")}}:{})
              .then(({ data }) => {
                if (apiMap[key].type === Array) {
                  this.data[`${prefix}-${interfaceName}`] = data;
                } else {
                  this.data[`${prefix}-${interfaceName}`] = data;
                }

                Object.keys(variable).forEach((key_var) => {

                  if(key_var==('resolve'+apiMap[key]['num'])){
                    apiMap[key]['resolve'+apiMap[key]['num']]();
                  }
                });

              });
          }
          
      });

      this.p1= Promise.all(p_array);

    },
  
    generatePromise(){
      let resolve, reject
      const p = new Promise((res, rej) => {
        resolve = res
        reject = rej
      })
      return [p, resolve ,reject]
    },
  },
};
</script>

<style lang="scss" scoped>
@keyframes move{
  0%{
    transform: translateY(100vh);
  }
  100%{
    transform: translateY(-50%);
  }
}
@keyframes scale{
  0%{
    transform: scale(1);
    // background-size: 100% 100%;
  }
  100%{
    transform: scale(1.5);
    // background-size: 150% 150%;
  }
}
body {
  overflow: auto;
  /* overflow: hidden; */
}
.MonitTitle {
  /* width: 359px;
  height: 65px; */
  /* font-size: 60px; */
  font-weight: bolder;
  /* color: #ffffff; */
}
.MonitTitleCss p.p1 {
  background: linear-gradient(0deg, #9df7ff 0%, #defdff 80%, #ffffff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.MonitTitle p {
  margin: 0 auto;
  padding: 0;
  color: #ffffff;
  /* background: linear-gradient(0deg, #9df7ff 0%, #defdff 100%); */
}
.MonitTitle{
  position: relative;
  width: 100%;
  z-index: 1;
  .box{
    position: absolute;
    left: 52%;
    transform: translateX(-50%);
    z-index: 1;
    background: url("~@/assets/images/datav/NewsMonitoringNew/title.png") no-repeat left top/cover;
    background-size: 100% 100%;
  }
  .bg1{
    background: url("~@/assets/images/datav/NewsMonitoringNew/bg1.png") no-repeat left top/cover;
    background-size: 100% 100%;
    animation: move 30s linear infinite;
    transition: all;
  }
}
.MonitBg {
  background: url("~@/assets/images/datav/NewsMonitoringNew/bg.png") no-repeat left
    top/cover;
  margin: 0 auto;
  position: relative;
}
.dataTime{
  position: absolute;
  font-size: 18px;
  font-family: PingFang SC;
  font-weight: 400;
  color: #FFFFFF;
  line-height: 7px;
  opacity: 0.8;
}
.star{
  position: absolute;
  background: url("~@/assets/images/datav/NewsMonitoringNew/star.png") no-repeat left;
  background-size: 100% 100%;
  z-index: 1;
  animation: scale 10s linear infinite;
}
.MonitCont {
  /* background: url("~@/assets/images/datav/NewsMonitoring/broder.png") no-repeat left top/cover;
  background-position: 0px -3px; */
  margin: 0 auto;
  overflow: hidden;
  // background: url("~@/assets/images/datav/NewsMonitoringNew/content.png") no-repeat left;
  // background-size: 100% 100%;
  z-index: 2;
  position: relative;
  .bg{
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: url("~@/assets/images/datav/NewsMonitoringNew/content.png") no-repeat left;
    background-size: 100% 100%;
    z-index: 1;
    opacity: 0.8;
  }
}
.MonitContLeftOn {
  // background: url("~@/assets/images/datav/NewsMonitoring/leftbg.png") no-repeat
  //   left top/cover;
  /* margin: 0 auto; */
}
.MonitCLeftOAll div.MonitCLOTitle div.MonitCLOText p,.MonitCRtUpBg div.MonitCLOTitle div.MonitCLOText p,
.MonitCRDownBg div.MonitCLOTitle div.MonitCLOText p{
  // color: #8feaff;
  color: #97D9FF;
  padding: 0px;
  margin: 0px;
}

.MonitCLeftOAll div.MonitCLOCen, .MonitCRtUpBg div.MonitCLOTitle div.MonitCLOCen,
.MonitCRDownBg div.MonitCLOTitle div.MonitCLOCen{
  background: linear-gradient(90deg, #3ab5cf, rgba(0,24,70,0));
  height: 5px;
  float: left;
}

.MonitCLOTitle div.MonitCLOCss {
  background: url("~@/assets/images/datav/NewsMonitoring/letcss.png") no-repeat
    left top/cover;
  float: left;
}
.MonitCLOList table tbody:nth-child(odd){
  background: #0b21b6;
  border-radius: 5px;
  tr{
    color: #fff;
    background: none;
    opacity: 0.85;
  }
}
.MonitCLOList table tbody:nth-child(even){
  background: none;
  border-radius: 5px;
  tr{
    color: #fff;
    background: none;
    opacity: 0.85;
  }
}
.MonitCLOList table tbody:nth-child(1){
  background: linear-gradient(90deg, #0B23BD, #1009D1);
  tr{
    background: none;
  }
}
.MonitCLOList table {
  width: 100%;
  text-align: center;
}
.MonitCLOList table tr.tableTitle,
.MonitCLOList table tr.tableTitle2 {
  color: #ffffff;
  background: #02205A;
  /* border-radius: 5px; */
  opacity: 0.85;
}
.MonitCLOList table tr.tableTitle td.group{
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
}
.MonitCLOList table tr.tableTitle td.matv{
  border-top-right-radius: 5px;
}
.MonitCLOList table tr.tableTitle2 td.newmat{
  border-bottom-right-radius: 5px;
}

// .MonitCLOList table tr.MonitCLOCon{
//   color: #ffffff;
//   /* height: 80px; */
//   background: #02225B;
//   opacity: 0.85;
// }

.MonitCRightUp .MonitCRtUpBg{
  // background: url("~@/assets/images/datav/NewsMonitoring/rightup.png") no-repeat left top/cover;
}

.MonitCRightDown .MonitCRDownBg{
  // background: url("~@/assets/images/datav/NewsMonitoring/rightdown.png") no-repeat left top/cover;
}

.MonitCLOTitle div.MonitCROCss2 {
  background: url("~@/assets/images/datav/NewsMonitoring/rightcss.png") no-repeat
    left top/cover;
  float: left;
}

.MonitCRUList ul.MonitCRULUi,.MonitCRUList ul.MonitCRULUi li ul,
.MonitCRDList ul.MonitCRDLUi,.MonitCRDList ul.MonitCRDLUi li ul{
  list-style: none;
  padding: 0px;
  margin: 0px;
}

.MonitCRUList ul.MonitCRULUi li.MonitCRULUTitle,
.MonitCRDList ul.MonitCRDLUi li.MonitCRDLUTitle{
  // background: #1E3C6D;
  background: linear-gradient(-90deg, #1C238E, #0E08C4);
  border-radius: 5px;
  // opacity: 0.8;
}
.MonitCRDList ul.MonitCRDLUi li.MonitCRDLUTitle{
  background: linear-gradient(-90deg, #0D1A80, #0E08C4);
  border-radius: 5px;
}

.MonitCRUList ul.MonitCRULUi li.MonitCRULUCont,.MonitCRDList ul.MonitCRDLUi li.MonitCRDLUCont{
  // background: #0C2554;
  background: none;
  // border: 1px solid #092049;
  border-bottom: 1px solid rgba(255,255,255,0.12);
  // opacity: 0.8;
}

.MonitCRDList ul.MonitCRDLUi li.MonitCRDLUCont ul li.MonitCRDLUTImg i{
  display: block;
  margin: 0 auto;
  background: #0B13A7;
  border-radius: 4px;
}
.MonitCRDList ul.MonitCRDLUi li.MonitCRDLUCont ul li.MonitCRDLUTImg i.img0{
  background: url("~@/assets/images/datav/NewsMonitoringNew/1.png") no-repeat left top/cover;
}
.MonitCRDList ul.MonitCRDLUi li.MonitCRDLUCont ul li.MonitCRDLUTImg i.img1{
  background: url("~@/assets/images/datav/NewsMonitoringNew/2.png") no-repeat left top/cover;
}
.MonitCRDList ul.MonitCRDLUi li.MonitCRDLUCont ul li.MonitCRDLUTImg i.img2{
  background: url("~@/assets/images/datav/NewsMonitoringNew/3.png") no-repeat left top/cover;
}
.MonitCRDList ul.MonitCRDLUi li.MonitCRDLUCont ul li.MonitCRDLUTImg{
  opacity: 1;
}

.MonitCRUList ul.MonitCRULUi::-webkit-scrollbar-track{
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    border-radius: 10px;
    /* background-color: rgba(245,245,245,0); */
}
.MonitCRUList ul.MonitCRULUi li ul li{
  float: left;
  text-align: center;
  /* width: 33.333%; */
  width: 25%;
}

.MonitCRDList ul.MonitCRDLUi li ul li{
  float: left;
  text-align: center;
  /* width: 20%; */
  width: 16.66667%;
  opacity: 0.85;
}

.MonitCRUList ul.MonitCRULUi li ul li p{
  padding: 0px;
  margin: 0px;
  white-space:nowrap; 
  overflow:hidden; 
  text-overflow:ellipsis;
  opacity: 0.85;
}
.MonitCRUList ul.MonitCRULUi li ul li.MonitCRULUTName,.MonitCRUList ul.MonitCRULUi li ul li.MonitCRULUCName{
  text-align: left;
  padding-left: 4%;
}

.MonitCRUList ul.MonitCRULUi li ul li.MonitCRULUCName i{
  background: url("~@/assets/images/datav/NewsMonitoring/1.png") no-repeat left top/cover;
  display: block;
  float: left;
  margin-right: 30px;
}

.MonitCRDList ul.MonitCRDLUi li.MonitCRDLUTitle ul li.MonitCRDLUTName,
.MonitCRDList ul.MonitCRDLUi li.MonitCRDLUCont ul li.MonitCRDLUTName{
  text-align: left;
}
.MonitCRDList ul.MonitCRDLUi li.MonitCRDLUCont ul li.MonitCRDLUTName i{
  background: url("~@/assets/images/datav/NewsMonitoring/1.png") no-repeat left top/cover;
  display: block;
  float: left;
  margin-right: 12%;
}

.MonitCRDList ul.MonitCRDLUi li.MonitCRDLUCont ul li.MonitCRDLUTName{
  white-space:nowrap; 
  overflow:hidden; 
  text-overflow:ellipsis;
}

.MonitAll div.scrollaa{
  height: 400px;
  overflow: hidden;
}

.MonitAll div.scrollaa ul.scrollDiv li{
  height: 200px;

}


.AnimUser{
    transition: all 1s;
    /* margin-top: -30px; */
}



#box{
    width: 300px;
    height: 32px;
    overflow: hidden;
    padding-left: 30px;
    border: 1px solid black;
}
.anim{
    transition: all 0.5s;
    margin-top: -30px;
}
#con1 li{
    list-style: none;
    line-height: 30px;
    height: 30px;
}


</style>