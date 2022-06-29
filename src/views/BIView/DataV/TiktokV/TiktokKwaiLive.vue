
<template>
  <div class="MonitAll">
    <!-- 全屏背景开始 -->
    <div
      :style="{
        width: bg_css.BgAllWidth / 1 + 'px',
        height: bg_css.BgAllWidth / 1.78 + 'px',
      }"
      class="TiktoKbg"
    >
      <!-- 顶部标题开始 -->
      <div
        :style="{
          width: bg_css.BgAllWidth / 1 + 'px',
          height: bg_css.BgAllWidth / 6.21 + 'px',
        }"
        class="TiktoKBan"
      >
        <!-- 标题开始 -->
        <div class="TKTitle">
          <div
            :style="{
              width: bg_css.BgAllWidth / 1 + 'px',
              height: bg_css.BgAllWidth / 9.6 + 'px',
            }"
            class="TKTitlebg"
          >
          <div style="width: 100%;float: left;" 
            :style="{
              'margin-top': bg_css.BgAllWidth / 40.85 + 'px',
            }">
            <div class="TKTitle_old"
              :style="{
                width: bg_css.BgAllWidth / 1.99 + 'px',
                height: bg_css.BgAllWidth / 20.43 + 'px',
              }"
            ></div>
          </div>
          </div>
        </div>
        <!-- 标题结束 -->
        <!-- 业绩装饰开始 'margin-top': bg_css.BgAllWidth / 46.83 + 'px',-->
        <div class="TKStitle">
          <div
            :style="{
              width: bg_css.BgAllWidth / 1.04 + 'px',
              height: bg_css.BgAllWidth / 480 + 'px',
              'margin-top': -(bg_css.BgAllWidth / 192) + 'px',

            }"
            class="TKStitlebg"
          ></div>
          <div class="TKDayAmt">
            <div
              :style="{
                'font-size': bg_css.BgAllWidth / 68.57 + 'px',
                'margin-top': -(bg_css.BgAllWidth / 80) + 'px',
              }"
              style="text-align: center; color: #66dcf2"
            >
              <p style="padding: 0px; margin: 0px">今日支付业绩</p>
            </div>
            <div class="TKuptime">
              <div
                style="
                  color: #ffffff;
                  margin: 0 auto;
                  text-align: right;
                  opacity: 0.8;
                  font-size: 18px;
                "
                :style="{
                  width: bg_css.BgAllWidth / 1.04 + 'px',
                  'margin-top': -(bg_css.BgAllWidth / 29.54) + 'px',
                }"
              >
                <p style="margin-bottom: 0px">时间：{{TimeToDay}}</p>
              </div>
            </div>
          </div>
        </div>
        <!-- 业绩装饰结束 -->

        <!-- top5布局开始 -->
        <div
          style="clear: both; width: 100%"
          :style="{
            height: bg_css.BgAllWidth / 96 + 'px',
          }"
        ></div>
        <!-- top5布局结束 -->
      </div>
      <!-- top5豆腐块开始 'margin-top': -(bg_css.BgAllWidth / 15.74) + 'px',-->
      <div
        class="TKTop5All"
        style="width: 100%;float: left;"
        :style="{
          'margin-top': bg_css.BgAllWidth / 64 + 'px',
        }"
      >
        <div class="TKTop5InvMar">
          <div
            class="TKTop5Inverted"
            :style="{
              width: bg_css.BgAllWidth / 1.04 + 'px',
              height: bg_css.BgAllWidth / 7.08 + 'px',
            }"
          ></div>
        </div>

        <div
          class="TKTop5Cube"
          :style="{
            width: bg_css.BgAllWidth / 1.04 + 'px',
            'margin-top': -(bg_css.BgAllWidth / 4.54) + 'px',
          }"
        >

          <div style="float: left">
            <div
              :class="(ISTKscaleX3==true)?'TKTop5Cube4 TKscaleX':'TKTop5Cube4'"
              style="transition: all 2s;"
              @click="FunTKscaleX()"

              :style="{
                width: bg_css.BgAllWidth / 6.02 + 'px',
                height: bg_css.BgAllWidth / 6.91 + 'px',
              }"
            >

              <div class="TKContent" style="float: left;width: 100%;"
                :style="{
                  'margin-top': (bg_css.BgAllWidth / 25.95)+'px',
                }"
              >
                <div
                  class="TKCTitle"
                  :style="{
                    'font-size': bg_css.BgAllWidth / 64 + 'px',
                  }"
                >
                  <!-- <p>{{(this.TDTop5Amt[3])?(this.TDTop5Amt[3].AUTHOR_NAME):'--'}}</p> -->
                  <div :ref="'TOP5dom'" style="float: left;width: 100%;">
                    <div :ref="'TOP5Text_'+3" style="white-space:nowrap; overflow:hidden; display: block;margin: 0 auto;"
                      :style="{width: bg_css.BgAllWidth / 6+'px'}"
                    >
                      <span :ref="'TOP5Text1_'+3">{{(this.TDTop5Amt[3])?(this.TDTop5Amt[3].AUTHOR_NAME+' '):'--'}}</span>
                      <span :ref="'TOP5Text2_'+3"></span>                              
                    </div>
                  </div>


                </div>
                <div
                  class="TKCRate"
                  :style="{
                    'margin-top': bg_css.BgAllWidth / 96 + 'px',
                    'font-size': bg_css.BgAllWidth / 60 + 'px',
                  }"
                >
                  <p>{{(this.TDTop5Amt[3])?(((this.TDTop5Amt[3].TAGRATE)?(this.TDTop5Amt[3].TAGRATE*100).toFixed(1):0)+'%'):'--'}}</p>
                </div>
                <div
                  class="TKCAmt"
                  :style="{
                    'margin-top': bg_css.BgAllWidth / 96 + 'px',
                  }"
                >
                  <div
                    class="TKCAmtBg"
                    :style="{
                      width: bg_css.BgAllWidth / 12.72 + 'px',
                      height: bg_css.BgAllWidth / 53.33 + 'px',
                      'border-radius': bg_css.BgAllWidth / 106.67 + 'px',
                      'line-height': bg_css.BgAllWidth / 54.86 + 'px',
                      'font-size': bg_css.BgAllWidth / 96 + 'px',
                    }"
                  >
                    <p>{{(this.TDTop5Amt[3])?((this.TDTop5Amt[3].SALE_AMT)?((this.TDTop5Amt[3].SALE_AMT/10000).toFixed(1)+'万'):0):'--'}}</p>
                  </div>
                </div>
              </div>
            </div>  

            <div 
              class="TKTank4" 
              style="position: relative;"
              :style="{
                'margin-top': -(bg_css.BgAllWidth / 6.91) + 'px',
              }"
            >
              <div
                class="TKTank4Img"
                :style="{
                  width: bg_css.BgAllWidth / 23.7 + 'px',
                  height: bg_css.BgAllWidth / 44.65 + 'px',
                }"
              ></div>
            </div>
          </div>



          <div style="float: left;" 
            :style="{
              'margin-left': bg_css.BgAllWidth / 68.57 + 'px',
              'margin-top': bg_css.BgAllWidth / 50.53 + 'px',            
            }"
          >
            <div
              :class="(ISTKscaleX2==true)?'TKTop5Cube2 TKscaleX':'TKTop5Cube2'"
              style="transition: all 2s;"
              @click="FunTKscaleX()"
              :style="{
                width: bg_css.BgAllWidth / 5.49 + 'px',
                height: bg_css.BgAllWidth / 8.07 + 'px',

              }"
            >

              <div class="TKContent" style="float: left;width: 100%;"
                :style="{
                  'margin-top': (bg_css.BgAllWidth / 33.68)+'px',
                }"
              >
                <div
                  class="TKCTitle"
                  :style="{
                    'font-size': bg_css.BgAllWidth / 64 + 'px',
                  }"
                >
                  <!-- <p>{{(this.TDTop5Amt[1])?(this.TDTop5Amt[1].AUTHOR_NAME):'--'}}</p> -->
                  <div :ref="'TOP5dom'" style="float: left;width: 100%;">
                    <div :ref="'TOP5Text_'+1" style="white-space:nowrap; overflow:hidden; display: block;margin: 0 auto;"
                      :style="{width: bg_css.BgAllWidth / 6+'px'}"
                    >
                      <span :ref="'TOP5Text1_'+1">{{(this.TDTop5Amt[1])?(this.TDTop5Amt[1].AUTHOR_NAME+' '):'--'}}</span>
                      <span :ref="'TOP5Text2_'+1"></span>                              
                    </div>
                  </div>



                </div>
                <div
                  class="TKCRate"
                  :style="{
                    'margin-top': bg_css.BgAllWidth / 192 + 'px',
                    'font-size': bg_css.BgAllWidth / 60 + 'px',
                    'line-height': bg_css.BgAllWidth / 40.85 + 'px',
                  }"
                >
                  <p>{{(this.TDTop5Amt[1])?(((this.TDTop5Amt[1].TAGRATE)?(this.TDTop5Amt[1].TAGRATE*100).toFixed(1):0)+'%'):'--'}}</p>
                </div>
                <div
                  class="TKCAmt"
                  :style="{
                    'margin-top': bg_css.BgAllWidth / 192 + 'px',
                  }"
                >
                  <div
                    class="TKCAmtBg"
                    :style="{
                      width: bg_css.BgAllWidth / 12.72 + 'px',
                      height: bg_css.BgAllWidth / 53.33 + 'px',
                      'border-radius': bg_css.BgAllWidth / 106.67 + 'px',
                      'line-height': bg_css.BgAllWidth / 54.86 + 'px',
                      'font-size': bg_css.BgAllWidth / 96 + 'px',
                    }"
                  >
                    <p>{{(this.TDTop5Amt[1])?((this.TDTop5Amt[1].SALE_AMT)?((this.TDTop5Amt[1].SALE_AMT/10000).toFixed(1)+'万'):0):'--'}}</p>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="TKTank2"
              style="position: relative;"
              :style="{
                'margin-top': -(bg_css.BgAllWidth / 7.33) + 'px',
              }"
            >
              <div
                :class="(crown2==true)?'TKTank2Imgx':'TKTank2Img'" 
                :style="{
                  width: bg_css.BgAllWidth / 22.59 + 'px',
                  height: bg_css.BgAllWidth / 29.09 + 'px',
                }"
              ></div>
            </div>            
          </div>



          <div style="float: left;"
            :style="{                
              'margin-left': bg_css.BgAllWidth / 68.57 + 'px',
              'margin-top': bg_css.BgAllWidth / 31.48 + 'px',
            }"
          >

            <!-- <transition
              v-on:before-enter="beforeEnter"
              v-on:enter="enter"
              v-bind:css="false"
            >             </transition> -->
              <!-- <p v-if="">1</p> -->
              <div
                :class="(ISTKscaleX==true)?'TKTop5Cube1 TKscaleX':'TKTop5Cube1'"
                style="transition: all 2s;"
                @click="FunTKscaleX()"
                v-if="FirstAnim==true"
                :style="{
                  width: bg_css.BgAllWidth / 4.97 + 'px',
                  height: bg_css.BgAllWidth / 8.93 + 'px',
                }"
              >
                <div class="TKContent" style="float: left;width: 100%;"
                  :style="{
                    'margin-top': (bg_css.BgAllWidth / 42.67)+'px',
                  }"
                >
                  <div
                    class="TKCTitle"
                    :style="{
                      'font-size': bg_css.BgAllWidth / 64 + 'px',
                    }"
                  >
                    <!-- <p>{{(this.TDTop5Amt[0])?(this.TDTop5Amt[0].AUTHOR_NAME):'--'}}</p> -->
                    <div :ref="'TOP5dom'" style="float: left;width: 100%;">
                      <div :ref="'TOP5Text_'+0" style="white-space:nowrap; overflow:hidden; display: block;margin: 0 auto;"
                        :style="{width: bg_css.BgAllWidth / 6+'px'}"
                      >
                        <span :ref="'TOP5Text1_'+0">{{(this.TDTop5Amt[0])?(this.TDTop5Amt[0].AUTHOR_NAME+' '):'--'}}</span>
                        <span :ref="'TOP5Text2_'+0"></span>                              
                      </div>
                    </div>
                    
                  </div>
                  <div
                    class="TKCRate"
                    :style="{
                      'margin-top': bg_css.BgAllWidth / 192 + 'px',
                      'font-size': bg_css.BgAllWidth / 60 + 'px',
                      'line-height': bg_css.BgAllWidth / 40.85 + 'px',
                    }"
                  >
                    <p>{{(this.TDTop5Amt[0])?(((this.TDTop5Amt[0].TAGRATE)?(this.TDTop5Amt[0].TAGRATE*100).toFixed(1):0)+'%'):'--'}}</p>
                  </div>
                  <div
                    class="TKCAmt"
                    :style="{
                      'margin-top': bg_css.BgAllWidth / 192 + 'px',
                    }"
                  >
                    <div
                      class="TKCAmtBg"
                      style="background: rgba(177, 23, 228, 0.39)"
                      :style="{
                        width: bg_css.BgAllWidth / 12.72 + 'px',
                        height: bg_css.BgAllWidth / 53.33 + 'px',
                        'border-radius': bg_css.BgAllWidth / 106.67 + 'px',
                        'line-height': bg_css.BgAllWidth / 54.86 + 'px',
                        'font-size': bg_css.BgAllWidth / 96 + 'px',
                      }"
                    >
                      <p>{{(this.TDTop5Amt[0])?((this.TDTop5Amt[0].SALE_AMT)?((this.TDTop5Amt[0].SALE_AMT/10000).toFixed(1)+'万'):0):'--'}}</p>
                    </div>
                  </div>
                </div>
              </div>   



            <div
              class="TKTank1"
              style="position: relative;"
              :style="{
                'margin-top': -(bg_css.BgAllWidth / 7.84) + 'px',
              }"
            >
              <div
                :class="(crown1==true)?'TKTank1Imgx':'TKTank1Img'" 
                :style="{
                  width: bg_css.BgAllWidth / 22.59 + 'px',
                  height: bg_css.BgAllWidth / 29.09 + 'px',
                }"
              ></div>
            </div>     

          </div>


          <div style="float: left;"
            :style="{
              'margin-left': bg_css.BgAllWidth / 71.11 + 'px',
              'margin-top': bg_css.BgAllWidth / 48 + 'px',              
            }"
          >
            <div
              :class="(ISTKscaleX2==true)?'TKTop5Cube3 TKscaleX':'TKTop5Cube3'"
              style="transition: all 2s;"
              @click="FunTKscaleX()"
              :style="{
                width: bg_css.BgAllWidth / 5.49 + 'px',
                height: bg_css.BgAllWidth / 8.14 + 'px',
              }"
            >
              <!-- 'margin-top': bg_css.BgAllWidth / 106.67 + 'px', -->

              <div class="TKContent" style="float: left;width: 100%;"
                :style="{
                  'margin-top': (bg_css.BgAllWidth / 33.68)+'px',
                }"
              >
                <div
                  class="TKCTitle"
                  :style="{
                    'font-size': bg_css.BgAllWidth / 64 + 'px',
                  }"
                >
                  <!-- <p>{{(this.TDTop5Amt[2])?(this.TDTop5Amt[2].AUTHOR_NAME):'--'}}</p> -->

                  <div :ref="'TOP5dom'" style="float: left;width: 100%;">
                    <div :ref="'TOP5Text_'+2" style="white-space:nowrap; overflow:hidden; display: block;margin: 0 auto;"
                      :style="{width: bg_css.BgAllWidth / 6+'px'}"
                    >
                      <span :ref="'TOP5Text1_'+2">{{(this.TDTop5Amt[2])?(this.TDTop5Amt[2].AUTHOR_NAME+' '):'--'}}</span>
                      <span :ref="'TOP5Text2_'+2"></span>                              
                    </div>
                  </div>

                </div>
                <div
                  class="TKCRate"
                  :style="{
                    'margin-top': bg_css.BgAllWidth / 192 + 'px',
                    'font-size': bg_css.BgAllWidth / 60 + 'px',
                    'line-height': bg_css.BgAllWidth / 40.85 + 'px',
                  }"
                >
                  <p>{{(this.TDTop5Amt[2])?(((this.TDTop5Amt[2].TAGRATE)?(this.TDTop5Amt[2].TAGRATE*100).toFixed(1):0)+'%'):'--'}}</p>
                </div>
                <div
                  class="TKCAmt"
                  :style="{
                    'margin-top': bg_css.BgAllWidth / 192 + 'px',
                  }"
                >
                  <div
                    class="TKCAmtBg"
                    :style="{
                      width: bg_css.BgAllWidth / 12.72 + 'px',
                      height: bg_css.BgAllWidth / 53.33 + 'px',
                      'border-radius': bg_css.BgAllWidth / 106.67 + 'px',
                      'line-height': bg_css.BgAllWidth / 54.86 + 'px',
                      'font-size': bg_css.BgAllWidth / 96 + 'px',
                    }"
                  >
                    <p>{{(this.TDTop5Amt[2])?((this.TDTop5Amt[2].SALE_AMT)?((this.TDTop5Amt[2].SALE_AMT/10000).toFixed(1)+'万'):0):'--'}}</p>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="TKTank3"
              style="position: relative;"
              :style="{
                'margin-top': -(bg_css.BgAllWidth / 7.33) + 'px',
              }"
            >
              <div
                :class="(crown3==true)?'TKTank3Imgx':'TKTank3Img'" 
                :style="{
                  width: bg_css.BgAllWidth / 22.59 + 'px',
                  height: bg_css.BgAllWidth / 29.09 + 'px',
                }"
              ></div>
            </div>

          </div>



          <div style="float: left;" 
            :style="{
              'margin-left': bg_css.BgAllWidth / 71.11 + 'px',
              'margin-top': (bg_css.BgAllWidth / 48) * 0 + 'px',              
            }"
          >
            <div
              :class="(ISTKscaleX3==true)?'TKTop5Cube5 TKscaleX':'TKTop5Cube5'"
              style="transition: all 2s;"
              @click="FunTKscaleX()"

              :style="{
                width: bg_css.BgAllWidth / 5.82 + 'px',
                height: bg_css.BgAllWidth / 7.06 + 'px',
              }"
            >

              <div class="TKContent" style="float: left;width: 100%;"
                :style="{
                  'margin-top': (bg_css.BgAllWidth / 25.95)+'px',
                }"
              >
                <div
                  class="TKCTitle"
                  :style="{
                    'font-size': bg_css.BgAllWidth / 64 + 'px',
                  }"
                >
                  <!--<p> {{(this.TDTop5Amt[4])?(this.TDTop5Amt[4].AUTHOR_NAME+' aqqq'):'--'}} </p>-->
                  <div :ref="'TOP5dom'" style="float: left;width: 100%;">
                    <div :ref="'TOP5Text_'+4" style="white-space:nowrap; overflow:hidden; display: block;margin: 0 auto;"
                      :style="{width: bg_css.BgAllWidth / 6+'px'}"
                    >
                      <span :ref="'TOP5Text1_'+4">{{(this.TDTop5Amt[4])?(this.TDTop5Amt[4].AUTHOR_NAME+' '):'--'}}</span>
                      <span :ref="'TOP5Text2_'+4"></span>                              
                    </div>
                  </div>
                    
                </div>
                <div
                  class="TKCRate"
                  :style="{
                    'margin-top': bg_css.BgAllWidth / 96 + 'px',
                    'font-size': bg_css.BgAllWidth / 60 + 'px',
                  }"
                >
                  <p>{{(this.TDTop5Amt[4])?(((this.TDTop5Amt[4].TAGRATE)?(this.TDTop5Amt[4].TAGRATE*100).toFixed(1):0)+'%'):'--'}}</p>
                </div>
                <div
                  class="TKCAmt"
                  :style="{
                    'margin-top': bg_css.BgAllWidth / 96 + 'px',
                  }"
                >
                  <div
                    class="TKCAmtBg"
                    :style="{
                      width: bg_css.BgAllWidth / 12.72 + 'px',
                      height: bg_css.BgAllWidth / 53.33 + 'px',
                      'border-radius': bg_css.BgAllWidth / 106.67 + 'px',
                      'line-height': bg_css.BgAllWidth / 54.86 + 'px',
                      'font-size': bg_css.BgAllWidth / 96 + 'px',
                    }"
                  >
                    <p>{{(this.TDTop5Amt[4])?((this.TDTop5Amt[4].SALE_AMT)?((this.TDTop5Amt[4].SALE_AMT/10000).toFixed(1)+'万'):0):'--'}}</p>
                  </div>
                </div>
              </div>
            </div>

            <div 
              class="TKTank5"
              style="position: relative;"
              :style="{
                'margin-top': -(bg_css.BgAllWidth / 7.06) + 'px',
              }"
            >
              <div
                class="TKTank5Img"
                :style="{
                  width: bg_css.BgAllWidth / 23.7 + 'px',
                  height: bg_css.BgAllWidth / 44.65 + 'px',
                }"
              ></div>
            </div>
          </div>



        </div>
      </div>
      <!-- top5豆腐块结束 -->
      <!-- 顶部标题结束 -->

      <!-- 自播业绩月榜开始 -->
      <div style="clear: both; width: 100%"></div>
      <div class="TKAmtMonth" :style="{
        'margin-top': bg_css.BgAllWidth / 38.4 + 'px',
      }">
        <!-- 标题的开始 -->
        <div class="TKAMtitle">
          <div
            :style="{
              'margin-top': bg_css.BgAllWidth / 64 + 'px',
              width: bg_css.BgAllWidth / 1.04 + 'px',
              height: bg_css.BgAllWidth / 480 + 'px',
            }"
            class="TKAMtitleImg TKStitlebg"
          ></div>

          <div class="TKDayAmt">
            <div
              :style="{
                'font-size': bg_css.BgAllWidth / 68.57 + 'px',
                'margin-top': -(bg_css.BgAllWidth / 80) + 'px',
              }"
              style="text-align: center; color: #66dcf2"
            >
              <p style="padding: 0px; margin: 0px">自播业绩月榜</p>
            </div>
            <div class="TKuptime">
              <div
                style="
                  color: #ffffff;
                  margin: 0 auto;
                  text-align: right;
                  opacity: 0.8;
                  font-size: 18px;
                "
                :style="{
                  width: bg_css.BgAllWidth / 1.04 + 'px',
                  'margin-top': -(bg_css.BgAllWidth / 54.86) + 'px',
                }"
              >
                <p style="margin-bottom: 0px">时间：{{TimeFirstDay+'~'+TimeToDay}}</p>
              </div>
            </div>
          </div>
        </div>
        <!-- 标题的结束 -->

        <!-- 列表的开始 -->
        <div
          class="TKAmtList"
          :style="{ 'margin-top': bg_css.BgAllWidth / 96 + 'px' }"
        >
          <div
            class="TKAListwidth"
            style="margin: 0 auto"
            :style="{
              width: bg_css.BgAllWidth / 1.04 + 'px',
            }"
          >
            <!-- style="float: left; background: rgba(47, 56, 173, 0.29)" -->
            <div
              class="TKALwidth"
              style="float: left; background: rgba(22, 28, 122, 0.8)"
              :style="{
                width: bg_css.BgAllWidth / 1.71 + 'px',
                height: bg_css.BgAllWidth / 3.54 + 'px',
              }"
            >
              <div style="width: 30%; float: left">
                <!-- 左 -->
                <p></p>
              </div>
              <div
                style="
                  width: 70%;
                  float: left;
                  color: #ffffff;
                  line-height: 55px;
                  text-align: center;
                  font-size: 24px;
                "
              >
                <!-- 右 -->
                <p style="margin: 0">支付业绩</p>
              </div>
            </div>

            <div
              class="TKARwidth"
              style="float: left; background: rgba(22, 28, 122, 0.8)"
              :style="{
                width: bg_css.BgAllWidth / 2.66 + 'px',
                height: bg_css.BgAllWidth / 3.54 + 'px',
              }"
            >
              <div
                style="
                  width: 100%;
                  float: left;
                  color: #ffffff;
                  line-height: 55px;
                  text-align: center;
                  font-size: 24px;
                "
              >
                <p style="margin: 0">发货业绩</p>
              </div>
            </div>

            <div
              class="TKAmtListArr"
              :style="{
                width: bg_css.BgAllWidth / 1.04 + 'px',
                'margin-top': -(bg_css.BgAllWidth / 3.54) + 'px',
              }"
            >
              <div class="TKAmtListArrW">
                <ul class="TKAmtListArrUl">
                  <li
                    class="TKAListAUlTitle"
                    style="background: rgb(47, 56, 173, 0.28)"
                    :style="{
                      height: bg_css.BgAllWidth / 36.92 + 'px',
                      'margin-top': bg_css.BgAllWidth / 34.91 + 'px',
                    }"
                  >
                    <ul class="TKAListAUlTitleUl">
                      <li style="width: 13%"><p :style="{'padding-left': bg_css.BgAllWidth / 24+'px'}">自播账号</p></li>
                      <li style="width: 7%"><p>负责人</p></li>
                      <li><p>月达成率</p></li>
                      <li><p>月累计业绩</p></li>
                      <li><p>月目标差值</p></li>
                      <li><p>剩余日均目标</p></li>
                      <li><p>月达成率</p></li>
                      <li><p>月累计业绩</p></li>
                      <li><p>月目标差值</p></li>
                      <li><p>剩余日均目标</p></li>
                    </ul>
                  </li>

                  <!-- height: (((index*1+1)<=3)?bg_css.BgAllWidth / 24.62:bg_css.BgAllWidth / 30.97) + 'px', 
                    -(bg_css.BgAllWidth / 480)
                    bg_css.BgAllWidth / 30.97
                  -->

                  <div v-if="TDListData.length>0">
                    <li
                      class="TKAListAUlCont"
                      
                      v-for="(item,index) in TDListData.slice(0,7)" :key="index"
                      ref="fanzhuan"
                      :style="{
                        height: (((index*1+1)<=3)?bg_css.BgAllWidth / 30:bg_css.BgAllWidth / 36.92) + 'px',
                        'margin-top': (((index*1+1)<=3)?5:5) + 'px',
                        'background': ((index*1+1)<=3)?'':'rgb(47, 56, 173, 0.28)',
                        'background-position': 0 + 'px',
                      }"
                    >
                      <ul
                        :class="((index*1+1)<=3)?'TKAListAUlContUl':'TKAListAUlContUl TKAListAUlContUlN'"
                        :style="{ 'line-height': 80 + 'px' }"
                      >
                        <li class="TKListName">
                          <p>
                            <i
                              :class="((index*1+1)<=3)?('listContTop'+(index*1+1)):'listContTop4'"
                              :style="{
                                width: bg_css.BgAllWidth / 30 + 'px',
                                height: bg_css.BgAllWidth / 41.74 + 'px',
                                'margin-top': (((index*1+1)<=3)?bg_css.BgAllWidth / 240:0) + 'px',
                                'margin-left': bg_css.BgAllWidth / 87.27 + 'px',
                              }"
                            >{{((index*1+1)>3)?(index*1+1):''}}</i
                            >
                            <!-- {{item.AUTHOR_NAME}} -->
                            <span :ref="'TOP6Text_'+index" style="white-space:nowrap; overflow:hidden; display: block;float: left;margin-left: 15px;"
                              :style="{width: bg_css.BgAllWidth / 14.2+'px'}"
                            >
                              <span :ref="'TOP6Text1_'+index">{{item.AUTHOR_NAME+'  '}}</span>
                              <span :ref="'TOP6Text2_'+index"></span>                              
                            </span>

                          </p>
                        </li>
                        <li class="TKListPer"><p>{{(item.AUTHOR_CONTROLLER)?item.AUTHOR_CONTROLLER:'--'}}</p></li>
                        <li><p style="color: #ffca1e;">{{((item.TAGRATE)?(item.TAGRATE*100).toFixed(1)+'%':'--')}}</p></li>
                        <li><p>{{((item.SALE_AMT)?(item.SALE_AMT/10000).toFixed(1)+'万':'--')}}</p></li>
                        <li><p>{{((item.PAY_AMT_DIFF)?(item.PAY_AMT_DIFF/10000).toFixed(1)+'万':'--')}}</p></li>  
                        <li><p>{{((item.REM_TGT_PAY_AMT)?(item.REM_TGT_PAY_AMT/10000).toFixed(1)+'万':'--')}}</p></li>   
                        <li><p style="color: #ffca1e;">{{((item.TAGRATE_DLV)?(item.TAGRATE_DLV*100).toFixed(1)+'%':'--')}}</p></li>   
                        <li><p>{{((item.DLVR_AMT)?(item.DLVR_AMT/10000).toFixed(1)+'万':'--')}}</p></li>
                        <li><p>{{((item.DLVRED_AMT_DIFF)?(item.DLVRED_AMT_DIFF/10000).toFixed(1)+'万':'--')}}</p></li>
                        <li><p>{{((item.REM_TGT_DLVRED_AMT)?(item.REM_TGT_DLVRED_AMT/10000).toFixed(1)+'万':'--')}}</p></li>
                      </ul>
                    </li>
                  </div>


                  <!-- <li
                    class="TKAListAUlCont"
                    :style="{
                      height: bg_css.BgAllWidth / 24.62 + 'px',
                      'margin-top': 0 + 'px',
                      'background-position': -(bg_css.BgAllWidth / 480) + 'px',
                    }"
                  >
                    <ul
                      class="TKAListAUlContUl"
                      :style="{ 'line-height': 80 + 'px' }"
                    >
                      <li class="TKListName">
                        <p>
                          <i
                            class="listContTop3"
                            :style="{
                              width: bg_css.BgAllWidth / 30 + 'px',
                              height: bg_css.BgAllWidth / 41.74 + 'px',
                              'margin-top': bg_css.BgAllWidth / 120 + 'px',
                              'margin-left': bg_css.BgAllWidth / 87.27 + 'px',
                            }"
                          ></i
                          >官方直播间
                        </p>
                      </li>
                      <li class="TKListPer"><p>小林</p></li>
                      <li><p>90%</p></li>
                      <li><p>9000万</p></li>
                      <li><p>100万</p></li>
                      <li><p>10万</p></li>
                      <li><p>90%</p></li>
                      <li><p>9000万</p></li>
                      <li><p>100万</p></li>
                      <li><p>10万</p></li>
                    </ul>
                  </li>

                  <li
                    class="TKAListAUlCont"
                    style="background: rgb(47, 56, 173, 0.28)"
                    :style="{
                      height: bg_css.BgAllWidth / 30.97 + 'px',
                      'margin-top': 5 + 'px',
                      'background-position': -(bg_css.BgAllWidth / 480) + 'px',
                    }"
                  >
                    <ul
                      class="TKAListAUlContUl TKAListAUlContUlN"
                      :style="{ 'line-height': 80 + 'px' }"
                    >
                      <li class="TKListName">
                        <p>
                          <i
                            class="listContTop4"
                            :style="{
                              width: bg_css.BgAllWidth / 30 + 'px',
                              height: bg_css.BgAllWidth / 41.74 + 'px',
                              'margin-top': 0 + 'px',
                              'margin-left': bg_css.BgAllWidth / 87.27 + 'px',
                            }"
                            >4</i
                          >官方直播间
                        </p>
                      </li>
                      <li class="TKListPer"><p>小林</p></li>
                      <li><p>90%</p></li>
                      <li><p>9000万</p></li>
                      <li><p>100万</p></li>
                      <li><p>10万</p></li>
                      <li><p>90%</p></li>
                      <li><p>9000万</p></li>
                      <li><p>100万</p></li>
                      <li><p>10万</p></li>
                    </ul>
                  </li>

                  <li
                    class="TKAListAUlCont"
                    style="background: rgb(47, 56, 173, 0.28)"
                    :style="{
                      height: bg_css.BgAllWidth / 30.97 + 'px',
                      'margin-top': 5 + 'px',
                      'background-position': -(bg_css.BgAllWidth / 480) + 'px',
                    }"
                  >
                    <ul
                      class="TKAListAUlContUl TKAListAUlContUlN"
                      :style="{ 'line-height': 80 + 'px' }"
                    >
                      <li class="TKListName">
                        <p>
                          <i
                            class="listContTop4"
                            :style="{
                              width: bg_css.BgAllWidth / 30 + 'px',
                              height: bg_css.BgAllWidth / 41.74 + 'px',
                              'margin-top': 0 + 'px',
                              'margin-left': bg_css.BgAllWidth / 87.27 + 'px',
                            }"
                            >5</i
                          >官方直播间
                        </p>
                      </li>
                      <li class="TKListPer"><p>小林</p></li>
                      <li><p>90%</p></li>
                      <li><p>9000万</p></li>
                      <li><p>100万</p></li>
                      <li><p>10万</p></li>
                      <li><p>90%</p></li>
                      <li><p>9000万</p></li>
                      <li><p>100万</p></li>
                      <li><p>10万</p></li>
                    </ul>
                  </li> -->


                </ul>
              </div>
            </div>
            <!-- 竖线装饰开始 -->
            <div
              class="TKList"
              style="float: left"
              :style="{
                'margin-top': -(bg_css.BgAllWidth / 3.54) + 'px',
              }"
            >
              <div
                class="TKListbg"
                :style="{
                  width: bg_css.BgAllWidth / 96 + 'px',
                  height: bg_css.BgAllWidth / 3.54 + 'px',
                  'margin-left': bg_css.BgAllWidth / 4.92 + 'px',
                }"
              ></div>
            </div>

            <div
              class="TKList"
              style="margin-right: 705px;float: right;"
              :style="{
                'margin-top': -(bg_css.BgAllWidth / 3.54) + 'px',
              }"
            >
              <div
                class="TKListbg"
                :style="{
                  width: bg_css.BgAllWidth / 96 + 'px',
                  height: bg_css.BgAllWidth / 3.54 + 'px',
                  'margin-left': bg_css.BgAllWidth / 4.92 + 'px',
                }"
              ></div>
            </div>


            <div
              class="TKList"
              style="float: left"
              :style="{
                'margin-top': -(bg_css.BgAllWidth / 3.54) + 'px',
              }"
            >
              <div
                class="TKListbg"
                :style="{
                  width: bg_css.BgAllWidth / 96 + 'px',
                  height: bg_css.BgAllWidth / 3.54 + 'px',
                  'margin-left': bg_css.BgAllWidth / 4.92 + 'px',
                }"
              ></div>
            </div>

            <div
              class="TKList"
              style="margin-right: 705px;float: right;"
              :style="{
                'margin-top': -(bg_css.BgAllWidth / 3.54) + 'px',
              }"
            >
              <div
                class="TKListbg"
                :style="{
                  width: bg_css.BgAllWidth / 96 + 'px',
                  height: bg_css.BgAllWidth / 3.54 + 'px',
                  'margin-left': bg_css.BgAllWidth / 4.92 + 'px',
                }"
              ></div>
            </div>




            <!-- 竖线装饰结束 -->
          </div>
          <div style="clear: both; width: 100%"></div>
        </div>
        <!-- 列表的结束 -->

        <!-- <p style="color: #ffffff">抖音大屏！！！</p> -->
      </div>
      <!-- 自播业绩月榜结束 -->
    </div>
    <!-- 全屏背景结束 -->
  </div>
</template>

<script>
var table_width = window.innerWidth;

export default {
  name: "TiktokKwaiLive",
  data() {
    return {
      bg_css: {
        BgAllWidth: table_width,
      },
      data: {},
      TDTop5Amt:{},
      TDListData:{},
      set_time:
        new Date().getFullYear() +
        "-" +
        (new Date().getMonth() + 1 >= 1 && new Date().getMonth() + 1 <= 9
          ? "0" + (new Date().getMonth() + 1)
          : new Date().getMonth() + 1) +
        "-01",
      TimeToDay:        
        new Date().getFullYear() +
        "年" +
        (new Date().getMonth() + 1 >= 1 && new Date().getMonth() + 1 <= 9
          ? "0" + (new Date().getMonth() + 1)
          : new Date().getMonth() + 1) +('月'+new Date().getDate()+
        "日"),
      TimeFirstDay:        
        new Date().getFullYear() +
        "年" +
        (new Date().getMonth() + 1 >= 1 && new Date().getMonth() + 1 <= 9
          ? "0" + (new Date().getMonth() + 1)
          : new Date().getMonth() + 1) +
        "月1日",
      ISTKscaleX:false,
      FirstAnim:false,
      ISTKscaleX2:false,
      ISTKscaleX3:false,
      crown1:false,
      crown2:false,
      crown3:false,
    };
  },
  created() {
    this.apiMap2 = {
      "SQL-fs-big_bord_dy_ks_zb_amt_td": {resultProp: "big_bord_dy_ks_zb_amt_td",},
      "SQL-fs-big_bord_dy_ks_zb_amt": { resultProp: "big_bord_dy_ks_zb_amt" },
    };
    this.ajax_data(this.apiMap2,true);
    console.log(this.data);
    console.log(this.set_time);
  },
  mounted() {
    this.FirstAnim=true;

    this.user_data_set();

    this.datav_setTimeout(this,this.apiMap2);
    this.Anim_setTimeout(this);


    setTimeout(()=>{
      for(let i=0;i<5;i++){
        if(this.$refs["TOP5Text_"+i]){
          if(this.$refs["TOP5Text1_"+i].offsetWidth>(this.$refs["TOP5Text_"+i].offsetWidth)){
            this.rollText(80,this.$refs["TOP5Text_"+i],this.$refs["TOP5Text1_"+i],this.$refs["TOP5Text2_"+i]); 
          }
        }

      }   
    },3000)

    setTimeout(()=>{   
      Object.keys(this.TDListData).forEach((keyU) => {
        // console.log(this.$refs["TOP6Text1_"+keyU]);
        if(this.$refs["TOP6Text1_"+keyU]){
          if(this.$refs["TOP6Text1_"+keyU][0].offsetWidth>(this.bg_css.BgAllWidth / 14.2)){
            // this.rollText(80,keyU,'TOP6Text_','TOP6Text1_','TOP6Text2_'); 
            this.rollText(80,this.$refs["TOP6Text_"+keyU][0],this.$refs["TOP6Text1_"+keyU][0],this.$refs["TOP6Text2_"+keyU][0]); 
          }          
        }
      });
    },3000)

  },
  methods: {


    // beforeEnter: function (el) {
    //   el.style.opacity = 0;
    //   // el.style.width = '0px';
    //   // el.style.height = '0px';
    //   console.log("====ahahaha===")
    // },
    // enter: function (el, done) {
    //   // , width: '280px',height: '369px'
    //   this.$velocity(el, {opacity: 1}, {duration: 600, easing: "swing"})
    //   done();
    //   console.log("========222222222222222====");
    // },

    rollText(t,name_all,name_1,name_2){
        //把内容重复复制，达到滚动不间断的效果
        // this.$refs["TOP6Text2_"+num][0].innerHTML=this.$refs["TOP6Text1_"+num][0].innerHTML;
        // this.$refs["TOP6Text_"+num][0].scrollTop=0;
        name_2.innerHTML=name_1.innerHTML;
        name_all.scrollTop=0;
      setInterval( 
        ()=>{
          // if ((this.$refs["TOP6Text_"+num][0].scrollLeft) >= (this.$refs["TOP6Text1_"+num][0].offsetWidth )) {
          //     this.$refs["TOP6Text_"+num][0].scrollLeft = 0;
          // } else {
          //     this.$refs["TOP6Text_"+num][0].scrollLeft++;
          //     // this.Ascrolldivt.scrollLeft+=10;
          // } 
          if ((name_all.scrollLeft) >= (name_1.offsetWidth )) {
              name_all.scrollLeft = 0;
          } else {
              name_all.scrollLeft++;
          }         
        },
      t);
    },


    datav_setTimeout(set_val,data){
      // let _this=this;
      setTimeout(()=>{
        // console.log(data);
        // set_val.FunTKscaleX();
        // set_val._fanzhuan("fanzhuan",0,this);
        set_val.ajax_data(data);
        set_val.user_data_set();
        set_val.datav_setTimeout(set_val,data);
      },300000);
    },

    Anim_setTimeout(set_val){
      // let _this=this;
      setTimeout(()=>{
        console.log("运行到动画这里来！！！");
        set_val.FunTKscaleX();
        set_val.Anim_setTimeout(set_val);
      },300000);
    },
    FunTKscaleX(){
      this.crown1=false;
      this.crown2=false;
      this.crown3=false;
      setTimeout(() => {
        if(this.ISTKscaleX==false){
          this.ISTKscaleX=true;
        }else{
          this.ISTKscaleX=false;
        }
        this.crown1=true;        
      },50);
      setTimeout(() => {
        // this.ISTKscaleX2=true;
        if(this.ISTKscaleX2==false){
          this.ISTKscaleX2=true;
        }else{
          this.ISTKscaleX2=false;
        }
        this.crown2=true;
        this.crown3=true;
      }, 2000);

      setTimeout(() => {
        if(this.ISTKscaleX3==false){
          this.ISTKscaleX3=true;
        }else{
          this.ISTKscaleX3=false;
        }
      }, 4000);

      setTimeout(() => {
        this._fanzhuan("fanzhuan",0,this);
      }, 6000);

      console.log("运行到的！！！！");
    },
    user_data_set(){

      this.p1.then(()=>{

        // this.data["fs-big_bord_dy_ks_zb_amt_td"].sort((a,b)=>{return b["SALE_AMT"]-a["SALE_AMT"]});
        this.TDTop5Amt=this.data["fs-big_bord_dy_ks_zb_amt_td"];
        Object.keys(this.TDTop5Amt).forEach((key_fun) => {
          this.TDTop5Amt[key_fun].AUTHOR_NAME=(this.TDTop5Amt[key_fun].AUTHOR_NAME)?this.TDTop5Amt[key_fun].AUTHOR_NAME.replace('林氏木业',''):'--';
          this.TDTop5Amt[key_fun].TAGRATE=
            (this.TDTop5Amt[key_fun].TGT_PAY_AMT&&this.TDTop5Amt[key_fun].TGT_PAY_AMT!=0)?this.TDTop5Amt[key_fun].SALE_AMT/this.TDTop5Amt[key_fun].TGT_PAY_AMT:0;

        });
        this.TDTop5Amt=this.TDTop5Amt.sort((a,b)=>{return b["TAGRATE"]-a["TAGRATE"]});

        this.TDListData=this.data["fs-big_bord_dy_ks_zb_amt"].filter(_ => {return _['MDATE'].substring(0,10) === this.set_time});
        Object.keys(this.TDListData).forEach((key_list) => {
          this.TDListData[key_list].AUTHOR_NAME=(this.TDListData[key_list].AUTHOR_NAME)?this.TDListData[key_list].AUTHOR_NAME.replace('林氏木业',''):'--';
          this.TDListData[key_list].TAGRATE=
            (this.TDListData[key_list].TGT_PAY_AMT&&this.TDListData[key_list].TGT_PAY_AMT!=0)?this.TDListData[key_list].SALE_AMT/this.TDListData[key_list].TGT_PAY_AMT:0;
          this.TDListData[key_list].TAGRATE_DLV=
            (this.TDListData[key_list].TGT_DLVRED_AMT&&this.TDListData[key_list].TGT_DLVRED_AMT!=0)?this.TDListData[key_list].DLVR_AMT/this.TDListData[key_list].TGT_DLVRED_AMT:0;

        });
        this.TDListData.sort((a,b)=>{return b["TAGRATE"]-a["TAGRATE"]});


        console.log(this.data["fs-big_bord_dy_ks_zb_amt"]);
        console.log(this.TDListData);


        // console.log(this.data["fs-big_bord_dy_ks_zb_amt_td"]);
        // console.log(this.TDTop5Amt);
        // // console.log(this.TDTop5Amt[0].AUTHOR_NAME.replace('林氏木业',''));
        // console.log(("asdad adaw").replace('林氏木业',''));

      });


    },


    _fanzhuan(refs,num,_this){
      if((num+1)>(_this.$refs[refs]).length){
        setTimeout(()=>{
          _this.handleAfter(refs);
        },1500);        
      }else{
        let useron_refs=_this.$refs[refs];
        useron_refs[num].style.transition='1s';
        useron_refs[num].style.transform='rotateX(360deg)';          
        setTimeout(()=>{
          _this._fanzhuan(refs,num,_this);          
        },900);
      }
      num++;
    },

    handleAfter(refs_on){
      let test=this.$refs[refs_on]
      for(let i=0;i<test.length;i++){
        test[i].style.transition='0s';
        test[i].style.transform='rotateX(0deg)';
      }
    },


    ajax_data(apiMap,Istrue) {
      console.log("运行到ajax交互哪里！！！！！！！！");
      let num_api = 0;
      // let num_api_pd=0;
      let p_array = [];
      let variable = {};

      // 数组处理开始
      Object.keys(apiMap).forEach((key_fun) => {
        num_api++;
        [variable["p" + num_api], variable["resolve" + num_api]] =
          this.generatePromise();
        p_array.push(variable["p" + num_api]);
        apiMap[key_fun].type = Array;
        apiMap[key_fun]["resolve" + num_api] = variable["resolve" + num_api];
        apiMap[key_fun]["num"] = num_api;
      });
      // 数组处理结束

      Object.keys(apiMap).forEach((key) => {
        const [, prefix, interfaceName] = key.split("-"); //把上面的拆分出来
        if (prefix && interfaceName) {
          this.$axios
            .post(`/api/admin/data/${prefix}/${interfaceName}/get`, {},(Istrue)?{headers:{username:encodeURIComponent("抖音快手直播业绩大屏")}}:{})
            .then(({ data }) => {
              if (apiMap[key].type === Array) {
                this.data[`${prefix}-${interfaceName}`] = data;
              } else {
                this.data[`${prefix}-${interfaceName}`] = data;
              }

              Object.keys(variable).forEach((key_var) => {
                if (key_var == "resolve" + apiMap[key]["num"]) {
                  apiMap[key]["resolve" + apiMap[key]["num"]]();
                }
              });
            });
        }
      });

      this.p1 = Promise.all(p_array);
    },

    generatePromise() {
      let resolve, reject;
      const p = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
      });
      return [p, resolve, reject];
    },
  },
};
</script>

<style lang="scss" scoped>
body {
  overflow: auto;
  /* overflow: hidden;  bg_banner*/
}
.MonitAll {
}
.TiktoKbg {
  background: url("~@/assets/images/datav/TiktokKwaiLive/bg.png") no-repeat left
    top/cover;
  margin: 0 auto;
}
// .TiktoKBan {
//   background: url("~@/assets/images/datav/TiktokKwaiLive/bg_banner.png")
//     no-repeat left top/cover;
//   margin: 0 auto;
//   // bg_banners
// }
.TKTitle_old {
  background: url("~@/assets/images/datav/TiktokKwaiLive/title.png") no-repeat
    left top/cover;
  margin: 0 auto;
}
.TKTitle {
  float: left;
  width: 100%;
}
.TKStitle {
  float: left;
  width: 100%;
}
.TKStitlebg {
  background: url("~@/assets/images/datav/TiktokKwaiLive/Stitlebg.png")
    no-repeat left top/cover;
  margin: 0 auto;
}
.TKTop5Cube {
  margin: 0 auto;
}
.TKTop5Cube4 {
  background: url("~@/assets/images/datav/TiktokKwaiLive/top4bg.png") no-repeat
    left top/cover;
  margin: 0 auto;
}
.TKTop5Cube2 {
  background: url("~@/assets/images/datav/TiktokKwaiLive/top2bg.png") no-repeat
    left top/cover;
  margin: 0 auto;
}
.TKTop5Cube1 {
  background: url("~@/assets/images/datav/TiktokKwaiLive/top1bg.png") no-repeat
    left top/cover;
  margin: 0 auto;
}
.TKTop5Cube3 {
  background: url("~@/assets/images/datav/TiktokKwaiLive/top3bg.png") no-repeat
    left top/cover;
  margin: 0 auto;
}
.TKTop5Cube5 {
  background: url("~@/assets/images/datav/TiktokKwaiLive/top5bg.png") no-repeat
    left top/cover;
  margin: 0 auto;
}
.TKTank4Img {
  background: url("~@/assets/images/datav/TiktokKwaiLive/top4.png") no-repeat
    left top/cover;
  margin: 0 auto;
}
.TKTank2Img {
  background: url("~@/assets/images/datav/TiktokKwaiLive/top2x.png") no-repeat
    left top/cover;
  margin: 0 auto;
  background-size: 1620px,105px;
  background-position: 0px -10px;
}
.TKTank1Img {
  background: url("~@/assets/images/datav/TiktokKwaiLive/top1x.png") no-repeat
    left top/cover;
  margin: 0 auto;
  background-size: 1580px,85px;
  background-position: 0px -11px;
}
.TKTank3Img {
  background: url("~@/assets/images/datav/TiktokKwaiLive/top3x.png") no-repeat
    left top/cover;
  margin: 0 auto;
  background-size: 1580px,85px;
  background-position: 0px -11px;
}

.TKTank5Img {
  background: url("~@/assets/images/datav/TiktokKwaiLive/top5.png") no-repeat
    left top/cover;
  margin: 0 auto;
}
.TKTop5Inverted {
  background: url("~@/assets/images/datav/TiktokKwaiLive/inverted.png")
    no-repeat left top/cover;
  margin: 0 auto;
}

.TKContent {
  text-align: center;
}
.TKContent div p {
  margin: 0;
}
.TKContent .TKCTitle {
  /* font-size: 30px; */
  color: #ffffff;
}
.TKContent .TKCRate {
  /* font-size: 32px; */
  color: #ffca1e;
}
.TKContent .TKCAmt {
  /* font-size: 20px; */
  color: #ffffff;
}
.TKContent .TKCAmt .TKCAmtBg {
  /* background: #5659f8; */
  background: rgba(86, 89, 248, 0.39);
  /* border-radius: 18px; */
  margin: 0 auto;
}

.TKAmtListArr {
  color: #ffffff;
  float: left;
}
.TKAmtListArr .TKAmtListArrW li {
  list-style: none;
  margin: 0;
  padding: 0;
}
.TKAmtListArrUl,
.TKAListAUlTitleUl,
.TKAListAUlContUl {
  padding: 0;
  margin: 0;
}
.TKAListAUlTitleUl li,
.TKAListAUlContUl li {
  width: 10%;
  float: left;
}

.TKAListAUlContUl li.TKListName {
  width: 13%;
}
.TKAListAUlContUl li.TKListPer {
  width: 7%;
}

.TKAListAUlTitleUl li p,
.TKAListAUlContUl li p {
  margin: 0;
  font-size: 20px;
  color: #ffffff;
  opacity: 0.8;
  text-align: center;
  line-height: 50px;
}

.TKAListAUlCont {
  background: url("~@/assets/images/datav/TiktokKwaiLive/listbg.png") no-repeat
    left top/cover;
}
.TKAListAUlContUl li p {
  // line-height: 76px;
  line-height: 64px;
}

.TKAListAUlContUlN li p {
  // line-height: 60px;
  line-height: 52px;
}

.TKAListAUlContUl li p i {
  font-style: normal;
  display: block;
  float: left;
}

.listContTop1 {
  background: url("~@/assets/images/datav/TiktokKwaiLive/medal1.png") no-repeat
    left top/cover;
}

.listContTop2 {
  background: url("~@/assets/images/datav/TiktokKwaiLive/medal2.png") no-repeat
    left top/cover;
}

.listContTop3 {
  background: url("~@/assets/images/datav/TiktokKwaiLive/medal3.png") no-repeat
    left top/cover;
}

.TKListbg {
  background: url("~@/assets/images/datav/TiktokKwaiLive/division.png")
    no-repeat left top/cover;
}

.TKscaleX{
  -moz-transform:rotatey(360deg) ;
  -webkit-transform: rotatey(360deg);
  -o-transform: rotatey(360deg);
  transform: rotatey(360deg);
}


.TKTank1Imgx {
  background: url("~@/assets/images/datav/TiktokKwaiLive/top1x.png") no-repeat
    left top/cover;
  margin: 0 auto;
  background-size: 1580px,85px;
  background-position: 0px -11px;
  // animation: shakenew 0.5s steps(26) both;
  // animation:1s move infinite steps(18,end)  //infinite  循环播放
  animation:1s move 1 steps(18,end)
}
.TKTank2Imgx {
  background: url("~@/assets/images/datav/TiktokKwaiLive/top2x.png") no-repeat
    left top/cover;
  margin: 0 auto;
  background-size: 1620px,105px;
  background-position: 0px -10px;
  animation:1s movea 1 steps(19,end)
}
.TKTank3Imgx {
  background: url("~@/assets/images/datav/TiktokKwaiLive/top3x.png") no-repeat
    left top/cover;
  margin: 0 auto;
  background-size: 1580px,85px;
  background-position: 0px -11px;
  animation:1s move 1 steps(18,end) 
}


.TiktoKBan {
  background: url("~@/assets/images/datav/TiktokKwaiLive/bg_banners.png")
    no-repeat left top/cover;
  margin: 0 auto;
  // background-size: 57600px,85px;
  background-size: 57600px,1080px;
  background-position: 0px 0px;
  animation:2s run_name steps(30,end) infinite;
}

@keyframes run_name {
  from{
    background-position: 0px 0px;
  }
  to{
    background-position: -57600px 0px;
  }
}


@keyframes move {
  from{
    background-position: -4px -12px;
  }
  to{
    background-position: -1580px -12px;
  }
}
@keyframes movea {
  from{
    background-position: -4px -11px;
  }
  to{
    background-position: -1620px -10px;
  }
}

// .TKTitlebg {
//   background: url("~@/assets/images/datav/TiktokKwaiLive/css_sprites.png") no-repeat
//     left top/cover;
//   background-size: 138240px,200px;
//   margin: 0 auto;
//   background-position: 0px 0px;
//   animation:3s run_title steps(72,end) infinite;

// }
// @keyframes run_title {
//   from{
//     background-position: 0px 0px;
//   }
//   to{
//     background-position: -138240px 0px;
//   }
// }
// @keyframes moveb {
//   from{
//     background-position: -4px,-11px;
//   }
//   to{
//     background-position: -1620px,-10px;
//   }
// }

// @keyframes shakenew {
//   0% {
//     background-position: -4px -12px;
//   }
//   6.25% {
//     background-position: -88px -12px;
//   }
//   12.5% {
//     background-position: -172px -12px;
//   }
//   18.75% {
//     background-position: -262px -12px;
//   }
//   25% {
//     background-position: -350px -12px;
//   }
//   31.25% {
//     background-position: -444px -12px;
//   }
//   37.5% {
//     background-position: -528px -12px;
//   }
//   43.75% {
//     background-position: -612px -12px;
//   }
//   50% {
//     background-position: -706px -12px;
//   }
//   56.25% {
//     background-position: -796px -12px;
//   }
//   62.5% {
//     background-position: -844px -12px;
//   }
//   68.75% {
//     background-position: -928px -12px;
//   }
//   75% {
//     background-position: -1012px -12px;
//   }
//   81.25% {
//     background-position: -1096px -12px;
//   }
//   87.5% {
//     background-position: -1180px -12px;
//   }
//   93.75% {
//     background-position: -1264px -12px;
//   }
//   100% { 
//     background-position: -1410px -12px;
//   }
// }

</style>
