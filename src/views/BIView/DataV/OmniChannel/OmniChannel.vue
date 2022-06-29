<template>
  <div style="position: relative">
    <!-- <div style="width:100%;height:150px; background: linear-gradient(90deg, #6cb7fd, #132177);"></div> -->
    <div style="overflow: auto; background-color: #0f092a">



      <!-- 大背景图开始 -->
      <div
        :style="{
          width: bg_css.bg_all_width + 'px',
          height: bg_css.bg_all_height + 'px',
        }"
        class="bg_allimg"
      >
        <!-- 顶部布局开始 -->
        <div>
          <div :style="{
              width: bg_css.bg_all_width/1.64 + 'px',
              height: bg_css.bg_all_width/3.77 + 'px',
          }" class="banner_bg">
              <!-- top装饰开始 -->
              <div :style="{
                width: bg_css.bg_all_width/2.53 + 'px',
                height: bg_css.bg_all_width/7.164 + 'px',
              }" class="decorate_bg"></div>
              <!-- top装饰结束 -->
          </div>

        </div>
        <!-- 顶部布局结束 -->

        <!-- 内容开始 -->
        <div class="bg_content" :style="{
          'margin-top': -(bg_css.bg_all_width/3.77)+'px'
        }">
          <div class="content_left">
            <div class="content_left_bg" :style="{
              width: bg_css.bg_all_width/3.794 + 'px',
              height: bg_css.bg_all_width/4.094 + 'px', 
              'margin-top': (bg_css.bg_all_width/39.184)+'px',
              'margin-left': (bg_css.bg_all_width/91.429)+'px'

            }">
              <div style="float: left;" :style="{
                  'margin-top': (bg_css.bg_all_width/64)+'px',
                  'margin-left': (bg_css.bg_all_width/80)+'px'                
              }">
                <div :style="{'line-height': (bg_css.bg_all_width/76)+'px',height:(bg_css.bg_all_width/76)+'px'}">
                  <span style="color: #FFED6E;" :style="{'font-size': bg_css.bg_all_width/106.667+'px'}" >
                    月销售业绩（万）
                  </span>               
                </div>

                <div class="chartNum" :style="{'margin-top': bg_css.bg_all_width/95+'px'}">
                  <div class="box-item" :style="{'font-size': bg_css.bg_all_width/52.778+'px'}">
                      <li :style="{
                          width: (!isNaN(item))?((bg_css.bg_all_width/39.184)+ 'px'):((bg_css.bg_all_width/82.61)+ 'px'),
                          height: (!isNaN(item))?((bg_css.bg_all_width/32.54) + 'px'):((bg_css.bg_all_width/27.143)+ 'px'), 
                          'line-height': (bg_css.bg_all_width/63.333)+'px',
                          'margin-right': (bg_css.bg_all_width/190)+'px'
                        }"
                        :class="{'number-item': !isNaN(item), 'mark-item': isNaN(item) }"
                          v-for="(item,index) in orderNum"
                          :key="index">
                              <span v-if="!isNaN(item)">
                                <i ref="numberItem" :style="{'top': bg_css.bg_all_width/172.73+'px','letter-spacing': bg_css.bg_all_width/190+'px'}"
                                >0123456789</i>
                              </span>
                          <span class="comma" :style="{'font-size': bg_css.bg_all_width/52.778+'px'}" v-else>{{item}}</span>
                      </li>
                  </div>
                </div>

                <!-- 四个指标开始 -->
                <div class="pointerType" >  
                  <ul :style="{'font-size': bg_css.bg_all_width/135.71+'px'}">
                    <li :style="{'margin-top': bg_css.bg_all_width/126.667+'px'}">
                      <span :style="{'width': bg_css.bg_all_width/25+'px'}">同期</span> 
                      <span>{{fomatMoney(this.data.user_data_info.pay_amt_yoy)}}</span> 
                    </li>
                    <li :style="{'margin-top': bg_css.bg_all_width/126.667+'px'}">
                      <span :style="{'width': bg_css.bg_all_width/25+'px'}">目标</span> 
                      <span>{{fomatMoney(this.data.user_data_info.tgt_pay_amt)}}</span>
                    </li>
                    <li :style="{'margin-top': bg_css.bg_all_width/126.667+'px'}">
                      <span :style="{'width': bg_css.bg_all_width/25+'px'}">同比</span> 
                      <span :style="{color:(this.data.user_data_info.ago_pay_rate>0)?'#FF0000':'#079909'}">
                        {{this.data.user_data_info.ago_pay_rate+'%'}}
                      </span>
                    </li>
                    <li :style="{'margin-top': bg_css.bg_all_width/126.667+'px'}">
                      <span :style="{'width': bg_css.bg_all_width/25+'px'}">达成</span> 
                      <span :style="{'color':(data.user_data_info.pay_rate>=100)?'#FF0000':'#ffffff'}">{{this.data.user_data_info.pay_rate+'%'}}</span>
                    </li>
                  </ul>

                  <div style="clear: both;"></div>
                </div>
                <!-- 四个指标结束 -->
              </div>

              <!-- 趋势图开始 -->
              <div class="TrendChart" style="float: left;color:#ffffff;" :style="{
                width: (bg_css.bg_all_width/4.174)+ 'px',
                'margin-left': (bg_css.bg_all_width/80)+'px',
                'margin-top':(bg_css.bg_all_width/90)+'px',}">
                <div ref="chart" style="width:100%;" :style="{
                  height: (bg_css.bg_all_width/10.11)+ 'px',
                }"></div>
              </div>
              <!-- 趋势图结束 -->


            </div>

            <div class="content_left_down_bg" :style="{
              width: bg_css.bg_all_width/3.794 + 'px',
              height: bg_css.bg_all_width/3.66 + 'px',  
              'margin-top': (bg_css.bg_all_width/112.94)+'px', 
              'margin-left': (bg_css.bg_all_width/91.429)+'px'           
            }">
              <div style="float: left;" :style="{
                'margin-top': (bg_css.bg_all_width/158.33)+'px',
                'margin-left': (bg_css.bg_all_width/76.8)+'px'                
              }">
                <div :style="{'line-height': (bg_css.bg_all_width/76)+'px',height:(bg_css.bg_all_width/76)+'px'}">
                  <span style="color: #FFED6E;" :style="{'font-size': bg_css.bg_all_width/106.667+'px'}" >
                    多平台店铺实时业绩
                  </span>                  
                </div>

                <div class="cont_left_down_list" :style="{'margin-top': (bg_css.bg_all_width/126.67)+'px',}">
                  <ul>  
                    <li v-for="(item,keys) in data.let_data_down.slice(0,7)" :key="keys" 
                      :style="{'margin-top': (bg_css.bg_all_width/100)+'px',}">
                      <div class="cont_left_down_list_text" :style="{width:(bg_css.bg_all_width/4.29)+'px','font-size': (bg_css.bg_all_width/137.143)+'px'}">
                          <span class="list_title">{{item.user_name}}</span>
                          <span class="list_achi">{{item.achi+'万'}}</span>
                          <span class="list_rate" :style="{color:(item.rate>1)?'#FF0000':'#ffffff'}">{{(item.rate*100).toFixed(1)+'%'}}</span>
                      </div>
                      <div class="cont_left_down_list_bgd" :style="{
                        width:(bg_css.bg_all_width/4.29)+'px',
                        height:(bg_css.bg_all_width/320)+'px',
                        'border-radius': (bg_css.bg_all_width/640)+'px',
                        'margin-top': (bg_css.bg_all_width/147.69)+'px',
                      }"></div>

                      <div style="width:100%; float: left;"
                        :style="{height:(bg_css.bg_all_width/320)+'px','margin-top': -(bg_css.bg_all_width/320)+'px',}">
                        <div :class="(item.rate>1)?'cont_left_down_list_bg':'cont_left_down_list_bgno'" :style="{
                          width:(bg_css.bg_all_width/4.29)*((item.rate>1)?1:item.rate)+'px',
                          height:(bg_css.bg_all_width/320)+'px',
                          'border-radius': (bg_css.bg_all_width/640)+'px'
                        }"
                        ></div>                        
                      </div>
                      <div style="clear: both;"></div>
                    </li>

                  </ul>
                </div> 
              </div>

            </div>
          </div>

          <div class="content_centre">
            <div class="screen_title" :style="{
              width:(bg_css.bg_all_width/2.42)+'px',
              'margin-left':(bg_css.bg_all_width/51.89)+'px',

            }">
              <div class="screen_title_h" style="" :style="{
                'margin-top': (bg_css.bg_all_width/64)+'px',
                'font-size': (bg_css.bg_all_width/39.58)+'px'
              }">
                <!-- font-family:'圆体'; -->
                <!-- <p style="padding: 0px;margin: 0px;font-weight: bold;">林氏木业全渠道大屏</p>
                <p style="padding: 0px;margin: 0px;" :style="{
                  'padding-top': (bg_css.bg_all_width/146.154)+'px',
                  'font-size': (bg_css.bg_all_width/106.667)+'px'
                }">全渠道实时业绩</p> -->
                <div class="text_css"
                :style="{
                  width:(bg_css.bg_all_width/4.30)+'px',
                  height:((bg_css.bg_all_width/14.12) + 'px')
                }"></div>
              </div>

              <div class="screen_achi_h" :style="{
                'margin-top': (bg_css.bg_all_width/27.94)+'px',
                'font-size': (bg_css.bg_all_width/23.75)+'px',
              }">
                
                <!-- <p style="font-weight: bold;"><span :style="{'font-size':(bg_css.bg_all_width/47.5)+'px',}">￥</span>
                  {{fomatMoney(this.data.user_data_info.StressData.total_info.amt)}}
                </p> -->
                <div>
                  <div class="chartNum">
                    <div class="box-item" style="margin: 0 auto;" :style="{'font-size': bg_css.bg_all_width/23.75+'px'}">
                        <div :style="{
                          width: ((bg_css.bg_all_width/42.22)+ 'px'),
                          height:((bg_css.bg_all_width/19) + 'px'),}"
                        ><i style="width:100%; display: block;float: left;" :style="{height:((bg_css.bg_all_width/63.33) + 'px'),}"></i>
                          <span style="display: block;float: left;line-height: 0px;color:#FAF779;" :style="{
                            'font-size':(bg_css.bg_all_width/29.23)+'px','line-height': (bg_css.bg_all_width/47.5)+'px'}">￥</span>
                        </div>

                        <li :style="{
                            width: (!isNaN(item))?((bg_css.bg_all_width/34.55)+ 'px'):((bg_css.bg_all_width/82.61)+ 'px'),
                            height: (!isNaN(item))?((bg_css.bg_all_width/19) + 'px'):((bg_css.bg_all_width/15.833)+ 'px'), 
                            'line-height': (bg_css.bg_all_width/63.333)+'px',
                            'margin-right': (0)+'px'
                          }"
                          :class="{'number-item-all': !isNaN(item), 'mark-item-all': isNaN(item) }"
                            v-for="(item,index) in orderNumall"
                            :key="index">

                                <span v-if="!isNaN(item)">
                                  <!-- <p>{{index}}</p> -->
                                  <i :ref="'numberItem_all'+index" :style="{'top': bg_css.bg_all_width/172.73+'px','letter-spacing': bg_css.bg_all_width/190+'px'}"
                                  >0123456789</i>
                                </span>
                            <span class="comma" :ref="'numberItem_all'+index" :style="{'font-size': bg_css.bg_all_width/23.75+'px'}" v-else>{{item}}</span>
                        </li>
                    </div>
                  </div>
                </div>




                <div class="screen_achi_info" :style="{'font-size': (bg_css.bg_all_width/118.75)+'px','margin-top': (bg_css.bg_all_width/190)+'px',}">
                  <p class="screen_achi_tag">目标 
                    <span :style="{'margin-left':(bg_css.bg_all_width/213.33)+'px',
                      'font-size': (bg_css.bg_all_width/63.333)+'px'
                    }">{{fomatMoney(this.data.user_data_info.StressData.total_info.target)}}</span> 
                    <i :style="{'margin-left':(bg_css.bg_all_width/213.33)+'px','font-size': (bg_css.bg_all_width/135.71)+'px'}">万</i></p>
                  <p class="screen_achi_rate" style="margin-left: 0%;width: 25%;">达成 
                    <span :style="{'margin-left':(bg_css.bg_all_width/213.33)+'px','color':(data.user_data_info.StressData.total_info.rate>=100)?'#FF0000':'#ffffff',
                      'font-size': (bg_css.bg_all_width/63.333)+'px'}">{{this.data.user_data_info.StressData.total_info.rate+'%'}}</span></p>
                </div>
                <div style="clear: both;"></div>
              </div>

              <!-- 渠道指标 -->
              <div class="screen_qudao" :style="{
                width:(bg_css.bg_all_width/2.427)+'px',
                height:(bg_css.bg_all_width/37.647)+'px',
                'margin-top': (bg_css.bg_all_width/38)+'px',
              }">
                <div class="screen_qudao_info" :style="{'font-size': (bg_css.bg_all_width/106.667)+'px'}">
                  <p style="color:#FFED6E;width:17%;" :style="{'padding-top': (bg_css.bg_all_width/146.15)+'px','padding-left': (bg_css.bg_all_width/146.15)+'px'}">
                    线上渠道
                  </p>
                  <p style="width:22%;" :style="{'padding-top': (bg_css.bg_all_width/146.15)+'px',
                    'padding-left': (bg_css.bg_all_width/146.15)+'px',
                  }">
                    <span :style="{'font-size': (bg_css.bg_all_width/135.71)+'px','padding-right': (bg_css.bg_all_width/190)+'px'}">业绩</span>
                      {{fomatMoney(this.data.user_data_info.StressData.StressOnline.amt)}}
                    <i :style="{'font-size': (bg_css.bg_all_width/135.71)+'px',
                      'padding-left': (0)+'px'}">万</i>
                  </p>
                  <p style="width:22%;" :style="{'padding-top': (bg_css.bg_all_width/146.15)+'px',
                    'padding-left': (bg_css.bg_all_width/146.15)+'px'
                  }">
                    <span :style="{'font-size': (bg_css.bg_all_width/135.71)+'px','padding-right': (bg_css.bg_all_width/190)+'px'}">目标</span>
                      {{fomatMoney(this.data.user_data_info.StressData.StressOnline.target)}}
                    <i :style="{'font-size': (bg_css.bg_all_width/135.71)+'px',
                      'padding-left': (0)+'px'}">万</i>
                  </p>
                  <p style="width:21%;" :style="{'padding-top': (bg_css.bg_all_width/146.15)+'px','padding-left': (bg_css.bg_all_width/146.15)+'px'}">
                    <span :style="{'font-size': (bg_css.bg_all_width/135.71)+'px',
                      'padding-right': (bg_css.bg_all_width/190)+'px'}">达成</span>
                      <i :style="{color:(this.data.user_data_info.StressData.StressOnline.rate>100)?'#FF0000':'#ffffff'}">
                        {{this.data.user_data_info.StressData.StressOnline.rate+'%'}}</i>
                  </p>
                  <p style="width:18%;" :style="{'padding-top': (bg_css.bg_all_width/146.15)+'px','padding-left': (bg_css.bg_all_width/146.15)+'px'}">
                    <span :style="{'font-size': (bg_css.bg_all_width/135.71)+'px',
                      'padding-right': (bg_css.bg_all_width/190)+'px'}">同比</span>
                      <i :style="{color:(this.data.user_data_info.StressData.StressOnline.ago_rate>0)?'#FF0000':'#079909'}">
                        {{this.data.user_data_info.StressData.StressOnline.ago_rate+'%'}}</i>
                  </p>
                </div>
              </div>

              <!-- 店铺完成率仪表盘 set_val. -->
              <div class="screen_shop">
                <div class="screen_shop_info" style="" :style="{
                  width:(bg_css.bg_all_width/7.529)+'px',
                  height:(bg_css.bg_all_width/16.696)+'px',
                  'margin-top': (bg_css.bg_all_width/76)+'px',
                  'background-color': (ClolrVal=='1')?'rgba(34,189,246,0.1)':''
                }">
                  <div ref="chart_dashboard" 
                    :style="{
                      width:(bg_css.bg_all_width/21.11)+'px',
                      height:(bg_css.bg_all_width/21.11)+'px',                       
                      'margin-left':(bg_css.bg_all_width/76)+'px',
                      'margin-top': (bg_css.bg_all_width/213.33)+'px',
                    }"></div>
                  <div class="corner" :style="{'margin-left': -((bg_css.bg_all_width/76)+(bg_css.bg_all_width/21.11))+'px',
                    'border-top': (bg_css.bg_all_width/38)+'px solid #0A16E8',
                    'border-right': (bg_css.bg_all_width/38)+'px solid transparent'                 
                  }">
                    <p style="float: left;" :style="{
                      'margin-top': -(bg_css.bg_all_width/35.19)+'px',
                      'width': (bg_css.bg_all_width/38)+'px',
                      'font-size': (bg_css.bg_all_width/135.71)+'px'
                    }">B店</p>
                  </div>     

                  <div class="screen_shop_text" 
                    :style="{'margin-top': (bg_css.bg_all_width/95)+'px',
                      'margin-left': (bg_css.bg_all_width/126.667)+'px',
                      'font-size': (bg_css.bg_all_width/135.71)+'px'}">
                    <p :style="{'margin-bottom': (bg_css.bg_all_width/126.667)+'px'}">业绩<span :style="{'padding-left': (bg_css.bg_all_width/190)+'px'}">
                      {{fomatMoney(this.data.user_data_info.ShopOnline.BShop.amt)+'万'}}
                    </span></p>
                    <p>目标<span :style="{'padding-left': (bg_css.bg_all_width/190)+'px'}">
                      {{fomatMoney(this.data.user_data_info.ShopOnline.BShop.target)+'万'}}
                    </span></p>
                  </div>
                </div>

                <div class="screen_shop_info" :style="{
                  width:(bg_css.bg_all_width/7.529)+'px',
                  height:(bg_css.bg_all_width/16.696)+'px',
                  'margin-top': (bg_css.bg_all_width/76)+'px',
                  'margin-left': (bg_css.bg_all_width/146.15)+'px',
                  'margin-right': (bg_css.bg_all_width/146.15)+'px',
                  'background-color': (ClolrVal=='2')?'rgba(34,189,246,0.1)':''
                }">
                  <div ref="chart_dashboard_jd" 
                    :style="{
                      width:(bg_css.bg_all_width/21.11)+'px',
                      height:(bg_css.bg_all_width/21.11)+'px',                       
                      'margin-left':(bg_css.bg_all_width/76)+'px',
                      'margin-top': (bg_css.bg_all_width/213.33)+'px',
                    }"></div>
                  <div class="corner" :style="{'margin-left': -((bg_css.bg_all_width/76)+(bg_css.bg_all_width/21.11))+'px',
                    'border-top': (bg_css.bg_all_width/38)+'px solid #0A16E8',
                    'border-right': (bg_css.bg_all_width/38)+'px solid transparent'                 
                  }">
                    <p style="float: left;" :style="{
                      'margin-top': -(bg_css.bg_all_width/35.19)+'px',
                      'width': (bg_css.bg_all_width/38)+'px',
                      'font-size': (bg_css.bg_all_width/135.71)+'px'
                    }">京东</p>
                  </div>

                  <div class="screen_shop_text" 
                    :style="{'margin-top': (bg_css.bg_all_width/95)+'px',
                      'margin-left': (bg_css.bg_all_width/126.667)+'px',
                      'font-size': (bg_css.bg_all_width/135.71)+'px'}">
                    <p :style="{'margin-bottom': (bg_css.bg_all_width/126.667)+'px'}">业绩<span :style="{'padding-left': (bg_css.bg_all_width/190)+'px'}">
                      {{fomatMoney(this.data.user_data_info.ShopOnline.JDShop.amt)+'万'}}
                    </span></p>
                    <p>目标<span :style="{'padding-left': (bg_css.bg_all_width/190)+'px'}">
                      {{fomatMoney(this.data.user_data_info.ShopOnline.JDShop.target)+'万'}}
                    </span></p>
                  </div>
                </div>

                <div class="screen_shop_info" :style="{
                  width:(bg_css.bg_all_width/7.529)+'px',
                  height:(bg_css.bg_all_width/16.696)+'px',
                  'margin-top': (bg_css.bg_all_width/76)+'px',
                  'background-color': (ClolrVal=='3')?'rgba(34,189,246,0.1)':''
                }">
                  <div ref="chart_dashboard_d" 
                    :style="{
                      width:(bg_css.bg_all_width/21.11)+'px',
                      height:(bg_css.bg_all_width/21.11)+'px',                       
                      'margin-left':(bg_css.bg_all_width/76)+'px',
                      'margin-top': (bg_css.bg_all_width/213.33)+'px',
                    }"></div>
                  <div class="corner" :style="{'margin-left': -((bg_css.bg_all_width/76)+(bg_css.bg_all_width/21.11))+'px',
                    'border-top': (bg_css.bg_all_width/38)+'px solid #0A16E8',
                    'border-right': (bg_css.bg_all_width/38)+'px solid transparent'                 
                  }">
                    <p style="float: left;" :style="{
                      'margin-top': -(bg_css.bg_all_width/35.19)+'px',
                      'width': (bg_css.bg_all_width/38)+'px',
                      'font-size': (bg_css.bg_all_width/135.71)+'px'
                    }">D店</p>
                  </div>

                  <div class="screen_shop_text" 
                    :style="{'margin-top': (bg_css.bg_all_width/95)+'px',
                      'margin-left': (bg_css.bg_all_width/126.667)+'px',
                      'font-size': (bg_css.bg_all_width/135.71)+'px'}">
                    <p :style="{'margin-bottom': (bg_css.bg_all_width/126.667)+'px'}">业绩<span :style="{'padding-left': (bg_css.bg_all_width/190)+'px'}">
                      {{fomatMoney(this.data.user_data_info.ShopOnline.DShop.amt)+'万'}}
                    </span></p>
                    <p>目标<span :style="{'padding-left': (bg_css.bg_all_width/190)+'px'}">
                      {{fomatMoney(this.data.user_data_info.ShopOnline.DShop.target)+'万'}}
                    </span></p>
                  </div>
                </div>

                <div style="clear: both;"></div>
                
              </div>


              <!-- 线下渠道加中国地图 -->
              <div class="screen_qudao" :style="{
                width:(bg_css.bg_all_width/2.427)+'px',
                height:(bg_css.bg_all_width/37.647)+'px',
                'margin-top': (bg_css.bg_all_width/76)+'px',
              }">
                <!-- <div class="screen_qudao_info" :style="{'font-size': (bg_css.bg_all_width/106.667)+'px'}">
                  <p style="color:#FFED6E;" :style="{'padding-top': (bg_css.bg_all_width/146.15)+'px','padding-left': (bg_css.bg_all_width/146.15)+'px'}">
                    线下渠道
                  </p>
                </div> -->
                <div class="screen_qudao_info" :style="{'font-size': (bg_css.bg_all_width/106.667)+'px'}">
                  <p style="color:#FFED6E;width:17%;" :style="{'padding-top': (bg_css.bg_all_width/146.15)+'px','padding-left': (bg_css.bg_all_width/146.15)+'px'}">
                    线下渠道
                  </p>
                  <p style="width:22%;" :style="{'padding-top': (bg_css.bg_all_width/146.15)+'px',
                    'padding-left': (bg_css.bg_all_width/146.15)+'px',
                  }">
                    <span :style="{'font-size': (bg_css.bg_all_width/135.71)+'px','padding-right': (bg_css.bg_all_width/190)+'px'}">业绩</span>
                      {{fomatMoney(this.data.user_data_info.StressData.StressOffline.amt)}}
                    <i :style="{'font-size': (bg_css.bg_all_width/135.71)+'px',
                      'padding-left': (0)+'px'}">万</i>
                  </p>
                  <p style="width:22%;" :style="{'padding-top': (bg_css.bg_all_width/146.15)+'px',
                    'padding-left': (bg_css.bg_all_width/146.15)+'px'
                  }">
                    <span :style="{'font-size': (bg_css.bg_all_width/135.71)+'px','padding-right': (bg_css.bg_all_width/190)+'px'}">目标</span>
                      {{fomatMoney(this.data.user_data_info.StressData.StressOffline.target)}}
                    <i :style="{'font-size': (bg_css.bg_all_width/135.71)+'px',
                      'padding-left': (0)+'px'}">万</i>
                  </p>
                  <p style="width:21%;" :style="{'padding-top': (bg_css.bg_all_width/146.15)+'px','padding-left': (bg_css.bg_all_width/146.15)+'px'}">
                    <span :style="{'font-size': (bg_css.bg_all_width/135.71)+'px',
                      'padding-right': (bg_css.bg_all_width/190)+'px'}">达成</span>
                      <i :style="{color:(this.data.user_data_info.StressData.StressOffline.rate>100)?'#FF0000':'#ffffff'}">
                        {{this.data.user_data_info.StressData.StressOffline.rate+'%'}}</i>
                  </p>
                  <p style="width:18%;" :style="{'padding-top': (bg_css.bg_all_width/146.15)+'px','padding-left': (bg_css.bg_all_width/146.15)+'px'}">
                    <span :style="{'font-size': (bg_css.bg_all_width/135.71)+'px',
                      'padding-right': (bg_css.bg_all_width/190)+'px'}">同比</span>
                      <i :style="{color:(this.data.user_data_info.StressData.StressOffline.ago_rate>0)?'#FF0000':'#079909'}">
                        {{this.data.user_data_info.StressData.StressOffline.ago_rate+'%'}}</i>
                  </p>
                </div>

              </div>

              <div class="screen_qudao_xia">
                <div class="screen_qudao_xia_left" :style="{'margin-top': (bg_css.bg_all_width/76)+'px'}">

                  <!-- <div class="screen_qudao_xia_taget" :style="{'font-size': (bg_css.bg_all_width/106.67)+'px','padding-left': (bg_css.bg_all_width/146.15)+'px'}">
                    <p>
                      <span :style="{width: (bg_css.bg_all_width/25)+'px',
                        'line-height': (bg_css.bg_all_width/63.33)+'px',
                        'font-size': (bg_css.bg_all_width/137.14)+'px'}">业绩</span>  
                      {{fomatMoney(this.data.user_data_info.StressData.StressOffline.amt)}}
                      <i :style="{'margin-left': (0)+'px','font-size': (bg_css.bg_all_width/137.14)+'px'}">万</i>
                    </p>
                    <p>
                      <span :style="{width: (bg_css.bg_all_width/25)+'px',
                        'line-height': (bg_css.bg_all_width/63.33)+'px',
                        'font-size': (bg_css.bg_all_width/137.14)+'px'}">目标</span>  
                      {{fomatMoney(this.data.user_data_info.StressData.StressOffline.target)}}
                      <i :style="{'margin-left': (0)+'px','font-size': (bg_css.bg_all_width/137.14)+'px'}">万</i>
                    </p>

                    <p :style="{'margin-top': (bg_css.bg_all_width/190)+'px',}">
                      <span :style="{width: (bg_css.bg_all_width/25)+'px',
                        'line-height': (bg_css.bg_all_width/63.33)+'px',
                        'font-size': (bg_css.bg_all_width/137.14)+'px'}">达成</span> 
                      <i :style="{color:(this.data.user_data_info.StressData.StressOffline.rate>100)?'#FF0000':'#ffffff'}">
                        {{this.data.user_data_info.StressData.StressOffline.rate+'%'}}</i>
                    </p>
                    <p :style="{'margin-top': (bg_css.bg_all_width/190)+'px',}">
                      <span :style="{width: (bg_css.bg_all_width/25)+'px',
                        'line-height': (bg_css.bg_all_width/63.33)+'px',
                        'font-size': (bg_css.bg_all_width/137.14)+'px'}">同比</span> 
                      <i :style="{color:(this.data.user_data_info.StressData.StressOffline.ago_rate>0)?'#FF0000':'#079909'}">
                        {{this.data.user_data_info.StressData.StressOffline.ago_rate+'%'}}</i>
                    </p>
                  </div> -->

                  <div class="screen_qudao_xia_list" :style="{'margin-top': (bg_css.bg_all_width/118.75)+'px',
                    'font-size': (bg_css.bg_all_width/135.71)+'px'
                  }">
                    <ul>
                      <li class="screen_qudao_xia_list_title" :style="{
                        height:(bg_css.bg_all_width/48)+'px',
                        'line-height': (bg_css.bg_all_width/50)+'px'
                      }">
                        <ul>
                          <li>区域</li>
                          <li>业绩</li>
                          <li>目标</li>
                          <li>差额</li>
                          <li>达成</li>
                        </ul>
                      </li>

                      <li v-for="(item,keys) in data.cont_data_region" :key="keys"  
                        class="screen_qudao_xia_list_corner" :style="{
                        height:(bg_css.bg_all_width/48)+'px',
                        'line-height': (bg_css.bg_all_width/50)+'px',
                        'margin-top': (bg_css.bg_all_width/190)+'px'
                      }">
                        <ul>
                          <li>{{item.user_name}}</li>
                          <li>{{fomatMoney(item.achi)+'万'}}</li>
                          <li>{{fomatMoney(item.tage)+'万'}}</li>
                          <li>{{fomatMoney(item.diff)+'万'}}</li>
                          <li :style="{color:(item.rate>=1)?'#FF0000':'#ffffff'}">{{(item.rate*100).toFixed(1)+'%'}}</li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                </div>

                <div class="screen_qudao_xia_right" :style="{'margin-top': (bg_css.bg_all_width/76)+'px'}">
                  <div style="width:100%;border: 0px solid #fff;">
                    <div class="screen_dashboard_map" ref="dashboard_map" :style="{
                      width:(bg_css.bg_all_width/4.84)+'px',
                      height:(bg_css.bg_all_width/5.94)+'px',
                    }"></div>
                  </div>
                </div>
                <div style="clear: both;"></div>
              </div>

            </div>
          </div>

          <div class="content_right">
            <div class="content_right_info">
              <div class="cont_r_top" :style="{
                width:(bg_css.bg_all_width/3.794)+'px',
                height:(bg_css.bg_all_width/4.582)+'px',
                'margin-left': (bg_css.bg_all_width/50.53)+'px',
                'margin-top': (bg_css.bg_all_width/39.184)+'px',
              }">
                <div style="float: left;" :style="{
                  'margin-top': (bg_css.bg_all_width/64)+'px',
                  'margin-left': (bg_css.bg_all_width/80)+'px'                
                }">
                  <div :style="{'line-height': (bg_css.bg_all_width/76)+'px'}">
                    <span style="color: #FFED6E;" :style="{'font-size': bg_css.bg_all_width/106.667+'px'}">
                      月发货业绩（万）
                    </span>                  
                  </div>

                  <div class="chartNum" :style="{'margin-top': bg_css.bg_all_width/95+'px'}">
                    <div class="box-item" :style="{'font-size': bg_css.bg_all_width/52.778+'px'}">
                        <li :style="{
                            width: (!isNaN(item))?((bg_css.bg_all_width/39.184)+ 'px'):((bg_css.bg_all_width/82.61)+ 'px'),
                            height: (!isNaN(item))?((bg_css.bg_all_width/32.54) + 'px'):((bg_css.bg_all_width/27.143)+ 'px'), 
                            'line-height': (bg_css.bg_all_width/63.333)+'px',
                            'margin-right': (bg_css.bg_all_width/190)+'px'
                          }"
                          :class="{'number-item': !isNaN(item), 'mark-item': isNaN(item) }"
                            v-for="(item,index) in orderNum"
                            :key="index">
                                <span v-if="!isNaN(item)">
                                  <i ref="numberItem_mon" :style="{'top': bg_css.bg_all_width/172.73+'px','letter-spacing': bg_css.bg_all_width/190+'px'}"
                                  >0123456789</i>
                                </span>
                            <span class="comma" :style="{'font-size': bg_css.bg_all_width/52.778+'px'}" v-else>{{item}}</span>
                        </li>
                    </div>
                  </div>  

                  <!-- 四个指标开始 -->
                  <div class="pointerType" >  
                    <ul :style="{'font-size': bg_css.bg_all_width/135.71+'px'}">
                      <li :style="{'margin-top': bg_css.bg_all_width/190+'px'}">
                        <span :style="{'width': bg_css.bg_all_width/25+'px'}">同期</span> 
                        <span>{{fomatMoney(this.data.user_data_info.dlvred_amt_yoy)}}</span>
                      </li>
                      <li :style="{'margin-top': bg_css.bg_all_width/190+'px'}">
                        <span :style="{'width': bg_css.bg_all_width/25+'px'}">目标</span> 
                        <span>{{fomatMoney(this.data.user_data_info.tgt_dlvred_amt)}}</span>
                      </li>
                      <li :style="{'margin-top': bg_css.bg_all_width/126.667+'px'}">
                        <span :style="{'width': bg_css.bg_all_width/25+'px'}">同比</span> 
                        <span :style="{color:(this.data.user_data_info.ago_dlvred_rate>0)?'#FF0000':'#079909'}">
                          {{this.data.user_data_info.ago_dlvred_rate+'%'}}</span>
                      </li>
                      <li :style="{'margin-top': bg_css.bg_all_width/126.667+'px'}">
                        <span :style="{'width': bg_css.bg_all_width/25+'px'}">达成</span> 
                        <span :style="{color:(this.data.user_data_info.dlvred_rate>100)?'#FF0000':'#ffffff'}">
                          {{this.data.user_data_info.dlvred_rate+'%'}}</span>
                      </li>
                    </ul>

                    <div style="clear: both;"></div>
                  </div>
                  <!-- 四个指标结束 -->
                </div>

                <!-- 线上线下仪表盘开始 -->
                <div class="cont_r_top_dashboard" style="float: left;" 
                  :style="{'margin-left': (bg_css.bg_all_width/80)+'px',
                  'margin-top': bg_css.bg_all_width/190+'px',
                  width:(bg_css.bg_all_width/4.147)+'px',
                  height:(bg_css.bg_all_width/11.64)+'px',
                }">
                  <div class="top_dashboard_left">
                    <div style="width:100%; float: left;">
                      <p style="color:#FFED6E;" :style="{
                        'font-size': bg_css.bg_all_width/120+'px',
                        'margin-top': bg_css.bg_all_width/96+'px',
                        'margin-left': (bg_css.bg_all_width/76)+'px',
                      }">线上</p>                      
                    </div>

                    <div style="float: left;" ref="chart_top_dashboard_left" :style="{
                        width:(bg_css.bg_all_width/21.11)+'px',
                        height:(bg_css.bg_all_width/21.11)+'px',                       
                        'margin-left':(bg_css.bg_all_width/190)+'px',
                        'margin-top': (bg_css.bg_all_width/213.33)+'px',
                    }"></div> 
                    <div style="float: left;" :style="{
                      'margin-top': (bg_css.bg_all_width/213.33)+'px',
                      'margin-left':(bg_css.bg_all_width/192)+'px',
                      'font-size': (bg_css.bg_all_width/135.71)+'px',
                    }">
                      <p>业绩<span :style="{'margin-left': (bg_css.bg_all_width/380)+'px'}">
                      <!-- {{fomatMoney(this.data.user_data_info.Online.amt)}} -->
                      {{fomatMoney(11111)}}
                      </span></p>
                      <p :style="{'margin-top': (bg_css.bg_all_width/316.67)+'px'}">目标
                        <span :style="{'margin-left': (bg_css.bg_all_width/380)+'px'}">{{fomatMoney(this.data.user_data_info.Online.target)}}</span></p>
                      <p :style="{'margin-top': (bg_css.bg_all_width/316.67)+'px'}">同比
                        <span :style="{'margin-left': (bg_css.bg_all_width/380)+'px',color:(this.data.user_data_info.Online.ago_rate>0)?'#FF0000':'#079909'}">
                          {{this.data.user_data_info.Online.ago_rate+'%'}}</span></p>
                    </div>
                  </div>

                  <div class="top_dashboard_right">
                    <div style="width:100%; float: left;">
                      <p style="color:#FFED6E;text-align: right;" :style="{
                        'font-size': bg_css.bg_all_width/120+'px',
                        'margin-top': bg_css.bg_all_width/96+'px',
                        'margin-right': (bg_css.bg_all_width/76)+'px',
                      }">线下</p>                      
                    </div>
                    <div style="float: left;" ref="chart_top_dashboard_right" :style="{
                        width:(bg_css.bg_all_width/21.11)+'px',
                        height:(bg_css.bg_all_width/21.11)+'px',                       
                        'margin-left':(bg_css.bg_all_width/126.7)+'px',
                        'margin-top': (bg_css.bg_all_width/213.33)+'px',
                    }"></div>
                    <div style="float: left;" :style="{
                      'margin-top': (bg_css.bg_all_width/213.33)+'px',
                      'margin-left':(bg_css.bg_all_width/192)+'px',
                      'font-size': (bg_css.bg_all_width/135.71)+'px', 
                    }">
                      <p>业绩<span :style="{'margin-left': (bg_css.bg_all_width/380)+'px'}">{{fomatMoney(this.data.user_data_info.Offline.amt)}}</span></p>
                      <p :style="{'margin-top': (bg_css.bg_all_width/316.67)+'px'}">目标
                        <span :style="{'margin-left': (bg_css.bg_all_width/380)+'px'}">{{fomatMoney(this.data.user_data_info.Offline.target)}}</span></p>
                      <p :style="{'margin-top': (bg_css.bg_all_width/316.67)+'px'}">同比
                        <span :style="{'margin-left': (bg_css.bg_all_width/380)+'px',color:(this.data.user_data_info.Offline.ago_rate>0)?'#FF0000':'#079909'}">
                          {{this.data.user_data_info.Offline.ago_rate+'%'}}</span></p>
                    </div>
                  </div>

                </div>
                <!-- 线上线下仪表盘结束 -->

              </div>

              <div class="cont_r_middle" :style="{
                width:(bg_css.bg_all_width/3.794)+'px',
                height:(bg_css.bg_all_width/6.53)+'px',
                'margin-left': (bg_css.bg_all_width/50.53)+'px',
                'margin-top': (bg_css.bg_all_width/128)+'px',
              }">
                <div class="cont_r_middle_title">
                  <p style="color:#FFED6E" :style="{
                    'margin-left': (bg_css.bg_all_width/50.53)+'px',
                    'margin-top': (bg_css.bg_all_width/128)+'px',
                    'font-size': (bg_css.bg_all_width/105.56)+'px'
                  }">货期分布占比</p>                  
                </div>

                <div class="chart_middle_dashboard" :style="{
                  'margin-top': (bg_css.bg_all_width/95)+'px'
                }">
                  <div style="margin: 0 auto;" ref="middle_dashboard_l"
                    :style="{width:(bg_css.bg_all_width/15.36)+'px',
                        height:(bg_css.bg_all_width/15.36)+'px',}">1</div>
                  <div class="middle_text" :style="{
                    'font-size': (bg_css.bg_all_width/135.71)+'px',
                    'margin-top': (bg_css.bg_all_width/76)+'px',
                  }">
                    <p>本月发货</p>
                    <p :style="{
                      'margin-top': (bg_css.bg_all_width/480)+'px',
                    }"><span :style="{
                      'font-size': (bg_css.bg_all_width/96)+'px'
                    }">{{fomatMoney(this.data.user_data_info.futures.this_mon)}}</span>万</p>
                  </div>
                </div>

                <div class="chart_middle_dashboard" :style="{
                  'margin-top': (bg_css.bg_all_width/95)+'px'
                }">
                  <div style="margin: 0 auto;" ref="middle_dashboard_m"
                    :style="{width:(bg_css.bg_all_width/15.36)+'px',
                      height:(bg_css.bg_all_width/15.36)+'px',}">1</div>
                  <div class="middle_text" :style="{
                    'font-size': (bg_css.bg_all_width/135.71)+'px',
                    'margin-top': (bg_css.bg_all_width/76)+'px',
                  }">
                    <p>次月发货</p>
                    <p :style="{
                      'margin-top': (bg_css.bg_all_width/480)+'px',
                    }"><span :style="{
                      'font-size': (bg_css.bg_all_width/96)+'px'
                    }">{{fomatMoney(this.data.user_data_info.futures.next_mon)}}</span>万</p>
                  </div>
                </div>

                <div class="chart_middle_dashboard" :style="{
                  'margin-top': (bg_css.bg_all_width/95)+'px'
                }">
                  <div style="margin: 0 auto;" ref="middle_dashboard_r"
                    :style="{width:(bg_css.bg_all_width/15.36)+'px',
                      height:(bg_css.bg_all_width/15.36)+'px',}">1</div>
                  <div class="middle_text" :style="{
                    'font-size': (bg_css.bg_all_width/135.71)+'px',
                    'margin-top': (bg_css.bg_all_width/76)+'px',
                  }">
                    <p>其它货期</p>
                    <p :style="{
                      'margin-top': (bg_css.bg_all_width/480)+'px',
                    }"><span :style="{
                      'font-size': (bg_css.bg_all_width/96)+'px'
                    }">{{fomatMoney(this.data.user_data_info.futures.other_rate)}}</span>万</p>
                  </div>
                </div>
                
              </div>

              <div class="cont_r_lower" :style="{
                width:(bg_css.bg_all_width/3.794)+'px',
                height:(bg_css.bg_all_width/7.11)+'px',
                'margin-left': (bg_css.bg_all_width/50.53)+'px',
                'margin-top': (bg_css.bg_all_width/128)+'px',
              }">
                <div style="float: left;" :style="{'line-height': (bg_css.bg_all_width/76)+'px',
                height:(bg_css.bg_all_width/76)+'px',
                'margin-top': (bg_css.bg_all_width/80)+'px',
                'margin-left': (bg_css.bg_all_width/80)+'px',
                }">
                  <span @click="toOrderNum('12589',['_this.setNumberTransform(\''+'numberItem_mon'+'\')'],6)" style="color: #FFED6E;" :style="{'font-size': bg_css.bg_all_width/106.667+'px'}" >
                    <!-- 订单状态分布 -->
                    当天累计处理情况
                  </span>                  
                </div>

                <!-- 'margin-top': bg_css.bg_all_width/63.33+'px' -->
                <div class="cont_r_lower_echart" style="float: left;width: 100%;" :style="{'margin-top': 0+'px'}">
                  <div style="margin: 0 auto;" ref="r_lower_dashboard"
                    :style="{width:(bg_css.bg_all_width/4.11)+'px',
                      height:(bg_css.bg_all_width/9.31)+'px',}">
                  </div>                  
                </div>

              </div>

              
            </div>
          </div>

          <div style="clear: both;"></div>

        </div>
        <!-- 内容结束 -->
      
      </div>
      <!-- 大背景图结束 -->
    </div>
  </div>
</template>

<script>
var table_width = window.innerWidth;

import echarts from "echarts/lib/echarts";
import "echarts/lib/chart/line";
import "echarts/lib/chart/bar";
import "echarts/lib/component/legend";
import "echarts/lib/component/tooltip";
import china from 'echarts/map/json/china.json'
import china_city from 'echarts/map/json/china-cities.json'

import "echarts/lib/chart/scatter";
import "echarts/lib/chart/map";
import "echarts/lib/chart/effectScatter";
import "echarts/lib/component/visualMap";
import "echarts/lib/component/geo";





// import "echarts/lib/component/roseType";

// import echarts from 'vue-echarts'
var CurrUrl = window.location.host;

export default {
  name: "OmniChannel",
  data() {
    return{
      reset_val:false,
      userurl: CurrUrl,
      
      test:0,
      // orderNum: ['0', '0', ',', '0', '0', '0', ',', '0', '0', '0'], // 默认订单总数
      orderNum: ['0', '0', '0', ',', '0', '0', '0'], // 默认订单总数
      // orderNumall: ['0', '0', '0', ',', '0', '0', '0', ',', '0', '0', '0'], // 默认订单总数
      // orderNumall: ['0', ',', '0', '0', '0', ',', '0', '0', '0'], // 默认订单总数
      orderNumall:['-','-'], // 默认订单总数

      bg_css: {
        bg_all_width: table_width,
        bg_all_height: table_width / 1.777778,
      },   

      data:{
        let_data_down:{},
        cont_data_region:{},
        user_data_info:{
          pay_amt_yoy:'--',
          tgt_pay_amt:'--',
          ago_pay_rate:'--',
          pay_rate:'--',

          dlvred_amt_yoy:'--',
          tgt_dlvred_amt:'--',
          ago_dlvred_rate:'--',
          dlvred_rate:'--',
          Online:{
            amt:'--',
            target:'--',
            ago_rate:'--',
          },
          Offline:{
            amt:'--',
            target:'--',
            ago_rate:'--',
          },
          ShopOnline:{
            BShop:{
              amt:'--',
              target:'--',              
            },
            JDShop:{
              amt:'--',
              target:'--', 
            },
            DShop:{
              amt:'--',
              target:'--', 
            }
          },
          StressData:{
            total_info:{
              amt:'--',
              target:'--', 
              rate:'--',
              ago_rate:'--',
            },
            StressOnline:{
              amt:'--',
              target:'--', 
              rate:'--',
              ago_rate:'--',
            },
            StressOffline:{
              amt:'--',
              target:'--', 
              rate:'--',
              ago_rate:'--',
            },

          },
          futures:{
            this_mon:'--',
            next_mon:'--',
            other_rate:'--',
          }

        },
      },

      ClolrVal:'1',
      
    }
  },
  created () {

    // this.orderNumall=['0', ',', '0', '0', '0', ',', '0', '0', '0'];

    if(this.userurl.indexOf('test.bi.linshimuye.com')>=0){
      window.location.replace("http://10.10.14.123:9090/frame/omni-channel");
    }else if(this.userurl.indexOf('bi.linshimuye.com')>=0){
      window.location.replace("http://10.10.1.168:9090/frame/omni-channel");
    }


    this.apiMap2 = {
      "SQL-NON_PM_lsmy_channel-all_channel_rt":{resultProp:"all_channel_rt"},
      "SQL-NON_PM_lsmy_channel-area_amt":{resultProp:"area_amt"},
      "SQL-NON_PM_lsmy_channel-dpt_shop_amt":{resultProp:"dpt_shop_amt"},
      "SQL-NON_PM_lsmy_channel-channel_amt":{resultProp:"channel_amt"},
      "SQL-NON_PM_lsmy_channel-channel_send_amt":{resultProp:"channel_send_amt"},
      "SQL-NON_PM_lsmy_channel-order_status_fut":{resultProp:"order_status_fut"},
      "SQL-NON_PM_lsmy_channel-channel_amt_trend":{resultProp:"channel_amt_trend"},
      "SQL-NON_PM_lsmy_channel-map_amt":{resultProp:"map_amt"},
      "SQL-NON_PM_lsmy_channel-order_status_tot_disp":{resultProp:"order_status_tot_disp"},

    };
    this.ajax_data(this.apiMap2);


    this.data.let_data_down=[
      {user_name:'林氏木业苏宁旗舰店',achi:'322.14万',rate:1.20},
      {user_name:'JD-林氏木业家具旗舰店',achi:'125.32万',rate:0.82},
      {user_name:'xzz1943（A店）',achi:'123.32万',rate:0.65},
      {user_name:'林氏木业唯品会旗舰店',achi:'25.54万',rate:0.45},
      {user_name:'林氏木业云集旗舰店',achi:'23.4万',rate:0.302},
      {user_name:'卡伊莲家具旗舰店',achi:'12.4万',rate:0.16},
      {user_name:'林氏木业考拉旗舰店',achi:'11.1万',rate:0.101},
    ];

    this.data.cont_data_region=[
      {user_name:'东区',achi:'19.5',tage:'60',diff:'10',rate:0.85},
      {user_name:'南区',achi:'29.5',tage:'50',diff:'20',rate:0.75},
      {user_name:'西区',achi:'39.5',tage:'60',diff:'30',rate:0.65},
      {user_name:'北区',achi:'49.5',tage:'65',diff:'40',rate:0.55},      
    ]

  },

  mounted(){

    this.user_data_set();
    this.datav_setTimeout(this,this.apiMap2);
    this.CarouselColor(this);


  },

  // watch:{
  //   'data.user_data_info.StressData.total_info.amt'(val){

  //       let val_chan=this.fomatMoney(val);
  //       this.orderNumall=[];
  //       Object.keys(val_chan).forEach((user_value) => {
  //         this.orderNumall.push(val_chan[user_value]);
  //       });
  //       // console.log(this.orderNumall);
  //       setTimeout(()=>{
  //         // 大屏的最大显示数字
  //         this.$nextTick(() => {
  //           this.toOrderNum(val,["_this.setNumberTransform_zero('numberItem_all','9')"],9,'大屏') // 这里输入数字即可调用
  //         });
  //       },50);

  //   }
  // },





  methods:{

    datav_setTimeout(set_val,data){
      // let _this=this;

      setTimeout(()=>{
        set_val.ajax_data(data);
        set_val.user_data_set();
        set_val.datav_setTimeout(set_val,data);
      },5000);

    },

    CarouselColor(set_val){
      setTimeout(()=>{
        if(set_val.ClolrVal=='1'){
          set_val.ClolrVal='2';
        }else if(set_val.ClolrVal=='2'){
          this.ClolrVal='3';
        }else if(set_val.ClolrVal=='3'){
          set_val.ClolrVal='1';
        }
        set_val.CarouselColor(set_val);
      },3000);
    },

    user_data_set(){

        this.p1.then(()=>{
          //测试的
          this.test+=1*100;

          this.$nextTick(() => {
            this.toOrderNum((((this.data["NON_PM_lsmy_channel-channel_amt"][0].PAY_AMT||0)/10000).toFixed(0)),["_this.setNumberTransform('numberItem','6')"],6) // 这里输入数字即可调用
            this.toOrderNum(((this.data["NON_PM_lsmy_channel-channel_amt"][0].DLVRED_AMT||0)/10000).toFixed(0),["_this.setNumberTransform('numberItem_mon','6')"],6) // 这里输入数字即可调用
          });  


            // this.setNumberTransform('numberItem');
            // this.setNumberTransform('numberItem_mon');

          this.data.user_data_info.pay_amt_yoy=((this.data["NON_PM_lsmy_channel-channel_amt"][0].PAY_AMT_YOY||0)/10000).toFixed(0);
          this.data.user_data_info.tgt_pay_amt=((this.data["NON_PM_lsmy_channel-channel_amt"][0].TGT_PAY_AMT||0)/10000).toFixed(0);
          this.data.user_data_info.ago_pay_rate=((this.data["NON_PM_lsmy_channel-channel_amt"][0].AGO_PAY_RATE||0)*100).toFixed(1);
          this.data.user_data_info.pay_rate=((this.data["NON_PM_lsmy_channel-channel_amt"][0].PAY_RATE||0)*100).toFixed(1);

          this.data.user_data_info.dlvred_amt_yoy=((this.data["NON_PM_lsmy_channel-channel_amt"][0].DLVRED_AMT_YOY||0)/10000).toFixed(0);
          this.data.user_data_info.tgt_dlvred_amt=((this.data["NON_PM_lsmy_channel-channel_amt"][0].TGT_DLVRED_AMT||0)/10000).toFixed(0);
          this.data.user_data_info.ago_dlvred_rate=((this.data["NON_PM_lsmy_channel-channel_amt"][0].AGO_DLVRED_RATE||0)*100).toFixed(1);
          this.data.user_data_info.dlvred_rate=((this.data["NON_PM_lsmy_channel-channel_amt"][0].DLVRED_RATE||0)*100).toFixed(1);

          // 线上指标
          this.data.user_data_info.Online.amt=((this.data["NON_PM_lsmy_channel-channel_send_amt"][1].DLVRED_AMT||0)/10000).toFixed(0);
          this.data.user_data_info.Online.target=((this.data["NON_PM_lsmy_channel-channel_send_amt"][1].TGT_DLVRED_AMT||0)/10000).toFixed(0);
          this.data.user_data_info.Online.ago_rate=((this.data["NON_PM_lsmy_channel-channel_send_amt"][1].AGO_DLVRED_RATE||0)*100).toFixed(1);
          // 线下指标
          this.data.user_data_info.Offline.amt=((this.data["NON_PM_lsmy_channel-channel_send_amt"][0].DLVRED_AMT||0)/10000).toFixed(0);
          this.data.user_data_info.Offline.target=((this.data["NON_PM_lsmy_channel-channel_send_amt"][0].TGT_DLVRED_AMT||0)/10000).toFixed(0);
          this.data.user_data_info.Offline.ago_rate=((this.data["NON_PM_lsmy_channel-channel_send_amt"][0].AGO_DLVRED_RATE||0)*100).toFixed(1);
          
          this.chart_dashboard('chart_top_dashboard_left',this.data["NON_PM_lsmy_channel-channel_send_amt"],'chart_top_dashboard_left','CHNL_NAME','线上渠道','DLVRED_RATE');
          this.chart_dashboard('chart_top_dashboard_right',this.data["NON_PM_lsmy_channel-channel_send_amt"],'chart_top_dashboard_right','CHNL_NAME','线下渠道','DLVRED_RATE');

          this.chart_dashboard('chart_dashboard',this.data["NON_PM_lsmy_channel-dpt_shop_amt"],'chart_dashboard','SHOP_NAME','林氏木业家具旗舰店','SALE_RATE');
          this.chart_dashboard('chart_dashboard_jd',this.data["NON_PM_lsmy_channel-dpt_shop_amt"],'chart_dashboard_jd','SHOP_NAME','JD-林氏木业家具旗舰店','SALE_RATE');
          this.chart_dashboard('chart_dashboard_d',this.data["NON_PM_lsmy_channel-dpt_shop_amt"],'chart_dashboard_d','SHOP_NAME','林氏旗舰店','SALE_RATE');

          // B店 京东店 D店 的指标 和多店铺业绩

          this.data["NON_PM_lsmy_channel-dpt_shop_amt"].sort((a, b) => {
              let value_sort = "";
              let a_time = (a["SALE_AMT"]);
              let b_time = (b["SALE_AMT"]);     
              value_sort = Number(b_time) - Number(a_time);       
              return value_sort;
          });
          // console.log("==========asdad adad adas adas==================")
          // console.log(this.data["lsmy_channel-dpt_shop_amt"]);
          this.data.let_data_down=[];
          Object.keys(this.data["NON_PM_lsmy_channel-dpt_shop_amt"]).forEach((shop_value) => {
            if(this.data["NON_PM_lsmy_channel-dpt_shop_amt"][shop_value].SHOP_NAME=='林氏木业家具旗舰店'){
              this.data.user_data_info.ShopOnline.BShop.amt=((this.data["NON_PM_lsmy_channel-dpt_shop_amt"][shop_value].SALE_AMT||0)/10000).toFixed(0);
              this.data.user_data_info.ShopOnline.BShop.target=((this.data["NON_PM_lsmy_channel-dpt_shop_amt"][shop_value].SALES_TARGET||0)/10000).toFixed(0);
            }else if(this.data["NON_PM_lsmy_channel-dpt_shop_amt"][shop_value].SHOP_NAME=='JD-林氏木业家具旗舰店'){
              this.data.user_data_info.ShopOnline.JDShop.amt=((this.data["NON_PM_lsmy_channel-dpt_shop_amt"][shop_value].SALE_AMT||0)/10000).toFixed(0);
              this.data.user_data_info.ShopOnline.JDShop.target=((this.data["NON_PM_lsmy_channel-dpt_shop_amt"][shop_value].SALES_TARGET||0)/10000).toFixed(0);          
            }else if(this.data["NON_PM_lsmy_channel-dpt_shop_amt"][shop_value].SHOP_NAME=='林氏旗舰店'){
              this.data.user_data_info.ShopOnline.DShop.amt=((this.data["NON_PM_lsmy_channel-dpt_shop_amt"][shop_value].SALE_AMT||0)/10000).toFixed(0);
              this.data.user_data_info.ShopOnline.DShop.target=((this.data["NON_PM_lsmy_channel-dpt_shop_amt"][shop_value].SALES_TARGET||0)/10000).toFixed(0);   
            }else{
              this.data.let_data_down.push({user_name:(this.data["NON_PM_lsmy_channel-dpt_shop_amt"][shop_value].SHOP_NAME||0),
                achi:((this.data["NON_PM_lsmy_channel-dpt_shop_amt"][shop_value].SALE_AMT||0)/10000).toFixed(1),
                rate:(this.data["NON_PM_lsmy_channel-dpt_shop_amt"][shop_value].SALE_RATE||0),
              });
            }

          });
          this.data.let_data_down.sort((a, b) => {
              let value_sort = "";
              let a_time = (a["rate"]);
              let b_time = (b["rate"]);     
              value_sort = Number(b_time) - Number(a_time);       
              return value_sort;
          });

          // 全渠道大屏 
          // console.log("=======大屏数字=============");
          // console.log(this.data["lsmy_channel-all_channel_rt"]);
          Object.keys(this.data["NON_PM_lsmy_channel-all_channel_rt"]).forEach((all_value) => {

            if(this.data["NON_PM_lsmy_channel-all_channel_rt"][all_value].DATA_TYPE=='合计'){
              this.data.user_data_info.StressData.total_info.amt=(this.data["NON_PM_lsmy_channel-all_channel_rt"][all_value].SALE_AMT||0).toFixed(0);

              this.middle_amt((this.data["NON_PM_lsmy_channel-all_channel_rt"][all_value].SALE_AMT||0).toFixed(0));
              // this.middle_amt((this.test*36).toFixed(0));
              // console.log("=======================")
              // console.log((this.test*36).toFixed(0));
              

              // this.$nextTick(() => {
              //   this.toOrderNum((this.data["lsmy_channel-all_channel_rt"][all_value].SALE_AMT||0).toFixed(0),["_this.setNumberTransform('numberItem_all','9')"],9) // 这里输入数字即可调用
              // });

              this.data.user_data_info.StressData.total_info.target=((this.data["NON_PM_lsmy_channel-all_channel_rt"][all_value].SALES_TARGET||0)/10000).toFixed(0);
              this.data.user_data_info.StressData.total_info.rate=((this.data["NON_PM_lsmy_channel-all_channel_rt"][all_value].SALE_RATE||0)*100).toFixed(1);
            }else if(this.data["NON_PM_lsmy_channel-all_channel_rt"][all_value].DATA_TYPE=='线上渠道'){
              this.data.user_data_info.StressData.StressOnline.amt=((this.data["NON_PM_lsmy_channel-all_channel_rt"][all_value].SALE_AMT||0)/10000).toFixed(0);
              this.data.user_data_info.StressData.StressOnline.target=((this.data["NON_PM_lsmy_channel-all_channel_rt"][all_value].SALES_TARGET||0)/10000).toFixed(0);
              this.data.user_data_info.StressData.StressOnline.rate=((this.data["NON_PM_lsmy_channel-all_channel_rt"][all_value].SALE_RATE||0)*100).toFixed(1);
              this.data.user_data_info.StressData.StressOnline.ago_rate=((this.data["NON_PM_lsmy_channel-all_channel_rt"][all_value].AGO_SALE_RATE||0)*100).toFixed(1);

            }else if(this.data["NON_PM_lsmy_channel-all_channel_rt"][all_value].DATA_TYPE=='线下渠道'){
              this.data.user_data_info.StressData.StressOffline.amt=((this.data["NON_PM_lsmy_channel-all_channel_rt"][all_value].SALE_AMT||0)/10000).toFixed(0);
              this.data.user_data_info.StressData.StressOffline.target=((this.data["NON_PM_lsmy_channel-all_channel_rt"][all_value].SALES_TARGET||0)/10000).toFixed(0);
              this.data.user_data_info.StressData.StressOffline.rate=((this.data["NON_PM_lsmy_channel-all_channel_rt"][all_value].SALE_RATE||0)*100).toFixed(1);
              this.data.user_data_info.StressData.StressOffline.ago_rate=((this.data["NON_PM_lsmy_channel-all_channel_rt"][all_value].AGO_SALE_RATE||0)*100).toFixed(1);
            }

          });

          // 区域数据

          this.data.cont_data_region=[];
          Object.keys(this.data["NON_PM_lsmy_channel-area_amt"]).forEach((region_value) => {
            if(this.data["NON_PM_lsmy_channel-area_amt"][region_value].S_OR_N=="东区"){
              this.data["NON_PM_lsmy_channel-area_amt"][region_value].RANK=1;
            }else if(this.data["NON_PM_lsmy_channel-area_amt"][region_value].S_OR_N=="南区"){
              this.data["NON_PM_lsmy_channel-area_amt"][region_value].RANK=2;
            }else if(this.data["NON_PM_lsmy_channel-area_amt"][region_value].S_OR_N=="西区"){
              this.data["NON_PM_lsmy_channel-area_amt"][region_value].RANK=3;
            }else if(this.data["NON_PM_lsmy_channel-area_amt"][region_value].S_OR_N=="北区"){
              this.data["NON_PM_lsmy_channel-area_amt"][region_value].RANK=4;
            }
            this.data.cont_data_region.push({user_name:this.data["NON_PM_lsmy_channel-area_amt"][region_value].S_OR_N,
              achi:((this.data["NON_PM_lsmy_channel-area_amt"][region_value].SALE_AMT||0)/10000).toFixed(0),
              tage:((this.data["NON_PM_lsmy_channel-area_amt"][region_value].SALES_TARGET||0)/10000).toFixed(0),
              diff:((this.data["NON_PM_lsmy_channel-area_amt"][region_value].SALE_DIFF||0)/10000).toFixed(0),
              rate:this.data["NON_PM_lsmy_channel-area_amt"][region_value].SALE_RATE,
              rank:this.data["NON_PM_lsmy_channel-area_amt"][region_value].RANK});
          });
          this.data.cont_data_region.sort((a, b) => {
              let value_sort = "";
              let a_time = (a["rank"]);
              let b_time = (b["rank"]);     
              value_sort = Number(a_time) - Number(b_time);       
              return value_sort;
          });

          // 货期分布占比  
          this.data.user_data_info.futures.this_mon=((this.data["NON_PM_lsmy_channel-order_status_fut"][0].TOT_AMT_THIS_MON||0)/10000).toFixed(0);
          this.data.user_data_info.futures.next_mon=((this.data["NON_PM_lsmy_channel-order_status_fut"][0].TOT_AMT_NEXT_MON||0)/10000).toFixed(0);
          this.data.user_data_info.futures.other_rate=((this.data["NON_PM_lsmy_channel-order_status_fut"][0].OTHER_AMT||0)/10000).toFixed(0);
          this.chart_dashboard_huan('middle_dashboard_l','#22BDF6',(this.data["NON_PM_lsmy_channel-order_status_fut"][0].THIS_MON_AMT_RATE||0)*100);
          this.chart_dashboard_huan('middle_dashboard_m','#2ECEB1',(this.data["NON_PM_lsmy_channel-order_status_fut"][0].NEXT_MON_AMT_RATE||0)*100);  
          this.chart_dashboard_huan('middle_dashboard_r','#FAB342',(this.data["NON_PM_lsmy_channel-order_status_fut"][0].OTHER_RATE||0)*100);
          // this.chart_dashboard_luosi('r_lower_dashboard');
          this.chart_bar('r_lower_dashboard');
          this.chart_dashboard_map('dashboard_map');
          this.initChart();

        });   

    },

    middle_amt(val){
      // val=this.fomatMoney(123456789);
      // val=22123456789+this.test;
      let val_chan=this.fomatMoney(val);
      this.orderNumall=[];
      Object.keys(val_chan).forEach((user_value) => {
        this.orderNumall.push(val_chan[user_value]);
      });
      // console.log(this.orderNumall);
      setTimeout(()=>{
        // 大屏的最大显示数字
        this.$nextTick(() => {
          this.toOrderNum(val,["_this.setNumberTransform_zero('numberItem_all','9')"],9,'大屏') // 这里输入数字即可调用
        });
      },50);

    },

    initChart(){

      let ago_amt=[];
      let sale_amt=[];
      let hour_data=[]

      this.p1.then(()=>{
        this.chartIns = echarts.init(this.$refs["chart"]);
        // console.log("运行到这里chart来！！！！！")
        this.data["NON_PM_lsmy_channel-channel_amt_trend"].sort((a, b) => {
            let value_sort = "";
            let a_time = new Date(a["TDATE"]).getTime(new Date(a["TDATE"]));
            let b_time = new Date(b["TDATE"]).getTime(new Date(b["TDATE"]));     
            value_sort = Number(a_time) - Number(b_time);       
            return value_sort;
        });
        // console.log(this.data["lsmy_channel-channel_amt_trend"]);
        Object.keys(this.data["NON_PM_lsmy_channel-channel_amt_trend"]).forEach((key_value) => {
          hour_data.push(this.data["NON_PM_lsmy_channel-channel_amt_trend"][key_value].TDATE.substring(8,10)*1);
          sale_amt.push((this.data["NON_PM_lsmy_channel-channel_amt_trend"][key_value].PAY_AMT/10000).toFixed(1));
          ago_amt.push((this.data["NON_PM_lsmy_channel-channel_amt_trend"][key_value].TGT_PAY_AMT/10000).toFixed(1));

        });


        this.chartIns.setOption({
              grid: {
                left: "1%",
                top: (this.bg_css.bg_all_width/95)+"%",
                right: "2%",
                // bottom: "15%",
                bottom: "0%",
                containLabel: true,
              },

              legend: {
                show: true,
                data: ["本月", "目标"],
                // right: "3%",
                left:"0%",
                top: "0%",
                // bottom: "2%",
                // bottom: "bottom", bg_css.bg_all_width
                textStyle: {
                  color:'#fff',
                  fontSize: (this.bg_css.bg_all_width)/158.33,
                },
                itemHeight: (this.bg_css.bg_all_width)/475,
                itemWidth: (this.bg_css.bg_all_width)/105.56,
                icon: "pie",
                formatter: function (name) {
                  // console.log(name);
                  return name;
                },
              },

              tooltip: {
                trigger: "axis",
                axisPointer: {
                  // type: "cross",
                  label: {
                    color: "#000000",
                    backgroundColor: "aliceblue",
                  },
                },
              },

              xAxis: {
                type: "category",
                boundaryGap: false,
                data: hour_data,

                axisLine: {
                  lineStyle: {
                    // color: "#ccc",
                    type:  'solid' ,
                    color:  '#3d3e5f' , //左边线的颜色
                    width: '1' //坐标线的宽度
                  },
                },
                axisTick:{
                  lineStyle:{
                    width:(this.bg_css.bg_all_width)/888.33,
                    height:(this.bg_css.bg_all_width)/388.33,
                  }
                },
                
                axisLabel: {
                  // interval: 'auto',
                  interval: 3,
                  textStyle: {
                    color: 'rgba(255,255,255,0.5)',
                    fontSize:(this.bg_css.bg_all_width)/158.33,
                    itemSize:'' 
                  },
                  
                },
              },
              yAxis: {
                type: "value",
                splitLine: {
                  show: true,
                  lineStyle: { type: "dotted", color:'rgba(61,62,95,0.8)' },
                },


                axisLine: {
                  show: false,
                },
                axisTick: {
                  show: false,
                },
                axisLabel: {
                  textStyle: {
                    color: "#ccc",
                  },
                  formatter:function(){
                    return "";
                  }
                },
              },

              series: [
                {
                  name: "本月",
                  // showSymbol: false,
                  showSymbol: (sale_amt.length==1)? true:false,
                  smooth: true, //true 为平滑曲线，false为直线
                  itemStyle: {
                    color: "#919191",
                    normal: {
                      color: "#22BDF6",
                      lineStyle: {
                        // color: "#BBBBBB",
                        color: "#22BDF6",
                        width: (this.bg_css.bg_all_width/950), //设置线条粗细
                      },
                      areaStyle: {
                        color: "rgba(255, 255, 255, 0.00)",
                      },
                    },
                  },
                  data: sale_amt,
                  type: "line",
                  areaStyle: {},
                },
                {
                  name: "目标",
                  // showSymbol: false,
                  showSymbol: (ago_amt.length==1)? true:false,
                  smooth: true, //true 为平滑曲线，false为直线  
                  itemStyle: {
                    color: "#0938F7",
                    normal: {
                      // color: "#66ccff",
                      color: "#6E6E6E",
                      lineStyle: {
                        color: "#6E6E6E",
                        width: (this.bg_css.bg_all_width/950), //设置线条粗细
                      },
                      areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                          {
                            offset: 0,
                            color: "rgba(110,110,110, 0.2)",
                          },
                          {
                            offset: 0.1,
                            color: "rgba(110,110,110, 0.2)",
                          },
                          {
                            offset: 0.6,
                            color: "rgba(110,110,110, 0.4)",
                          },
                        
                          {
                            offset: 1,
                            color: "rgba(110,110,110, 0.4)",
                          },
                        ]),
                      },
                    },
                  },
                  data: ago_amt,
                  type: "line",
                  areaStyle: {},
                },
              ],
        });        

      });




      
    },

    chart_dashboard(user_refs,set_data,pd_value,field,choice_value,show_view){

      this.p1.then(()=>{

        this.chartIns = echarts.init(this.$refs[user_refs]);
        // console.log("=======运行到仪表盘这里！！=======");
        // this.chart_dashboard('chart_top_dashboard_left');
        // this.chart_dashboard('chart_top_dashboard_right');
        // console.log(set_data);
        // console.log(this.data);
        let choice_rate=0;
        if(user_refs==pd_value){
          Object.keys(set_data).forEach((key_value) => {
            if(set_data[key_value][field]==choice_value){
              choice_rate=set_data[key_value][show_view];
            }
          });
        }
        

        this.chartIns.setOption({
              title: [{
                  text: '达成',
                  // bottom: (bg_css.bg_all_width/633.33)+'',
                  bottom: (this.bg_css.bg_all_width/633.33)+'',
                  x: 'center',
                  // borderColor: '#fff',
                  // borderWidth: 1,
                  // borderRadius: 15,
                  padding: [(this.bg_css.bg_all_width/271.43), (this.bg_css.bg_all_width/135.71)],
                  textStyle: {
                      fontWeight: 'normal',
                      fontSize: (this.bg_css.bg_all_width/158.33),
                      color: '#fff'
                  }
              }],
              angleAxis: {
                  show: false,
                  max: 100 * 360 / 270, //-45度到225度，二者偏移值是270度除360度
                  type: 'value',
                  startAngle: 225, //极坐标初始角度
                  splitLine: {
                      show: false
                  }
              },
              barMaxWidth: (this.bg_css.bg_all_width/316.67), //圆环宽度
              radiusAxis: {
                  show: false,
                  type: 'category',
              },
              //圆环位置和大小
              polar: {
                  center: ['50%', '50%'],
                  radius: (this.bg_css.bg_all_width/23.75)+''
              },
              series: [{
                  type: 'bar',
                  data: [{ //上层圆环，显示数据
                      // value: 75 choice_rate*100,
                      value: (choice_rate>1)? 1*100:choice_rate*100,
                      itemStyle: {
                          color: { //图形渐变颜色方法，四个数字分别代表，右，下，左，上，offset表示0%到100%
                              type: 'linear',
                              x: 0,
                              y: 0,
                              x2: 1, //从左到右 0-1
                              y2: 0,
                              colorStops: [{
                                  offset: 0,
                                  // color: '#D1E4FE'
                                  color:'#22BDF6'
                              }, {
                                  offset: 1,
                                  // color: '#F9FFFE'
                                  color:'#22BDF6'
                              }],
                          },
                      },
                  }],
                  barGap: '-100%', //柱间距离,上下两层圆环重合
                  coordinateSystem: 'polar', 
                  roundCap: true, //顶端圆角从 v4.5.0 开始支持
                  z: 2 //圆环层级，同zindex
              },
              { //下层圆环，显示最大值
                  type: 'bar',
                  data: [{
                      value: 100,
                      itemStyle: {
                          // color: '#80B8FF'
                          color:'#25267E'
                      }
                  }],
                  barGap: '-100%',
                  coordinateSystem: 'polar',
                  roundCap: true,
                  z: 1
              },
              //仪表盘
              {
                  name: 'AQI',
                  type: 'gauge',
                  startAngle: 225, //起始角度，同极坐标
                  endAngle: -45, //终止角度，同极坐标
                  axisLine: {
                      show: false,
                  },
                  splitLine: {
                      show: false
                  },
                  axisTick: {
                      show: false
                  },
                  axisLabel: {
                      show: false
                  },
                  splitLabel: {
                      show: false
                  },
                  pointer: {
                      show: false
                  },
                  title: {
                      offsetCenter: [-20, -10],
                      color: '#FFFFFF',
                      fontSize: 10,
                      fontWeight: 100,
                      rich: {
                          a: {
                              fontWeight: 'normal',
                              fontSize: 10,
                              color: '#FFF',
                              padding: [0, 0, 10, 40]
                          }
                      }
                  },
                  detail: {
                      formatter: function (e) {
                        // console.log(e);
                          return e+'%';
                      },
                      color: '#fff',
                      fontSize: (this.bg_css.bg_all_width/95),
                      offsetCenter: [0, 0],
                      // backgroundColor: '#FCC841',
                      // borderRadius: 6,
                      // padding: [4, 12],
                  },
                  data: [{
                      // value: 75,
                      value: (choice_rate*100).toFixed(0),
                  }]
              }
              ]

        });

      });


    },

    chart_dashboard_huan(user_refs_huan,user_color,user_rate){
      this.chartIns = echarts.init(this.$refs[user_refs_huan]);

      // console.log("=======运行到仪表盘 圆环的！！这里！！#22BDF6 =======");
      // console.log(user_color);

      this.chartIns.setOption({
            // backgroundColor: '#08B0F9',
            // title: [{
            //     text: '完成率',
            //     // bottom: (bg_css.bg_all_width/633.33)+'',
            //     bottom: (this.bg_css.bg_all_width/633.33)+'',
            //     x: 'center',
            //     // borderColor: '#fff',
            //     // borderWidth: 1,
            //     // borderRadius: 15,
            //     padding: [(this.bg_css.bg_all_width/271.43), (this.bg_css.bg_all_width/135.71)],
            //     textStyle: {
            //         fontWeight: 'normal',
            //         fontSize: (this.bg_css.bg_all_width/158.33),
            //         color: '#fff'
            //     }
            // }],
            angleAxis: {
                show: false,
                // max: 100 * 360 / 270, //-45度到225度，二者偏移值是270度除360度
                max: 100, //-45度到225度，二者偏移值是270度除360度

                type: 'value',
                startAngle: 90, //极坐标初始角度
                splitLine: {
                    show: false
                }
            },
            barMaxWidth: (this.bg_css.bg_all_width/316.67), //圆环宽度
            radiusAxis: {
                show: false,
                type: 'category',
            },
            //圆环位置和大小
            polar: {
                center: ['50%', '50%'],
                radius: (this.bg_css.bg_all_width/20)+''
            },
            series: [{
                type: 'bar',
                data: [{ //上层圆环，显示数据
                    value: user_rate,
                    itemStyle: {
                        color: { //图形渐变颜色方法，四个数字分别代表，右，下，左，上，offset表示0%到100%
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 1, //从左到右 0-1
                            y2: 0,
                            colorStops: [{
                                offset: 0,
                                // color: '#D1E4FE'
                                color:user_color
                            }, {
                                offset: 1,
                                // color: '#F9FFFE'
                                color:user_color
                            }],
                        },
                    },
                }],
                barGap: '-100%', //柱间距离,上下两层圆环重合
                coordinateSystem: 'polar', 
                roundCap: true, //顶端圆角从 v4.5.0 开始支持
                z: 2 //圆环层级，同zindex
            },
            { //下层圆环，显示最大值
                type: 'bar',
                data: [{
                    value: 100,
                    itemStyle: {
                        // color: '#80B8FF'
                        color:'rgba(49,55,141,0.5)'
                    }
                }],
                barGap: '100%',
                coordinateSystem: 'polar',
                roundCap: true,
                z: 1
            },

            //仪表盘
            {
                name: 'AQI',
                type: 'gauge',
                startAngle: 90, //起始角度，同极坐标
                endAngle: -269, //终止角度，同极坐标
                axisLine: {
                    show: false,
                },
                splitLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    show: false
                },
                splitLabel: {
                    show: false
                },
                pointer: {
                    show: false
                },
                title: {
                    offsetCenter: [-20, -10],
                    color: '#FFFFFF',
                    fontSize: 10,
                    fontWeight: 100,
                    rich: {
                        a: {
                            fontWeight: 'normal',
                            fontSize: 10,
                            color: '#FFF',
                            padding: [0, 0, 10, 40]
                        }
                    }
                },
                detail: {
                    formatter: function (e) {
                      // console.log(e);
                        return e.toFixed(2)+'%';
                    },
                    color: '#fff',
                    // fontSize: (this.bg_css.bg_all_width/95),
                    fontSize: (this.bg_css.bg_all_width/126.67),
                    offsetCenter: [0, 0],
                    // backgroundColor: '#FCC841',
                    // borderRadius: 6,
                    // padding: [4, 12],
                },
                data: [{
                    value: user_rate,
                    // name: 75 + '\n' + '{a|' + '首要污染物：PM10' + '}'
                    // name: 75 + '\n' + '{a|' + '首要污染物：PM10' + '}'
                }]
            }
            ]

      });

    },


    chart_bar(user_refs_huan){
      this.chartInsbar = echarts.init(this.$refs[user_refs_huan]);

      let sale_amt=[];
      let ago_amt=[];
      let hour_data=["已审核", "已货审","已财审","已打印","已发货",];
      let max_amt='';


      // let chartData= [
      //   (this.data["lsmy_channel-order_status_tot_disp"][0].DTD_AUD_AMT||0),
      //   (this.data["lsmy_channel-order_status_tot_disp"][0].DTD_GOODS_AUD_AMT||0),
      //   (this.data["lsmy_channel-order_status_tot_disp"][0].DTD_FIN_AUD_AMT||0),
      //   (this.data["lsmy_channel-order_status_tot_disp"][0].DTD_PRINT_AMT||0),
      //   (this.data["lsmy_channel-order_status_tot_disp"][0].DTD_SEND_AMT||0),];

      sale_amt=[((this.data["NON_PM_lsmy_channel-order_status_tot_disp"][0].DTD_AUD_AMT||0)/10000).toFixed(2),
        ((this.data["NON_PM_lsmy_channel-order_status_tot_disp"][0].DTD_GOODS_AUD_AMT||0)/10000).toFixed(2),
        ((this.data["NON_PM_lsmy_channel-order_status_tot_disp"][0].DTD_FIN_AUD_AMT||0)/10000).toFixed(2),
        ((this.data["NON_PM_lsmy_channel-order_status_tot_disp"][0].DTD_PRINT_AMT||0)/10000).toFixed(2),
        ((this.data["NON_PM_lsmy_channel-order_status_tot_disp"][0].DTD_SEND_AMT||0)/10000).toFixed(2),]

      // console.log("=================柱状图！！！===================");
      // console.log(this.data["lsmy_channel-order_status_tot_disp"]);

      max_amt=Math.max.apply(null, sale_amt);//最大值
      let integer_fun=((num)=>{
        num=Number(num.toFixed(0));
        while(num%50!=0){
          num++;
        }
        return num;
      })


        this.chartInsbar.setOption({
              grid: {
                left: "1%",
                top: (this.bg_css.bg_all_width/95)+"%",
                right: "2%",
                // bottom: "15%",
                bottom: "0%",
                containLabel: true,
              },

              legend: {
                show: false,
                data: ["本月", "目标"],
                // right: "3%",
                left:"0%",
                top: "0%",
                // bottom: "2%",
                // bottom: "bottom", bg_css.bg_all_width
                textStyle: {
                  color:'#fff',
                  fontSize: (this.bg_css.bg_all_width)/158.33,
                },
                itemHeight: (this.bg_css.bg_all_width)/475,
                itemWidth: (this.bg_css.bg_all_width)/105.56,
                icon: "pie",
                formatter: function (name) {
                  // console.log(name);
                  return name;
                },
              },

              tooltip: {
                trigger: "axis",
                axisPointer: {
                  // type: "cross",
                  type: 'shadow',        // 默认为直线，可选为：'line' | 'shadow'
                  label: {
                    color: "#000000",
                    backgroundColor: "aliceblue",
                  },
                },
              },

              xAxis: {
                type: "category",
                boundaryGap: true,  //是否中间显示
                data: hour_data,

                axisLine: {
                  lineStyle: {
                    // color: "#ccc",
                    type:  'solid' ,
                    color:  '#3d3e5f' , //左边线的颜色
                    width: '1' //坐标线的宽度
                  },
                },
                axisTick:{
                  lineStyle:{
                    width:(this.bg_css.bg_all_width)/888.33,
                    height:(this.bg_css.bg_all_width)/388.33,
                  }
                },
                
                axisLabel: {
                  // interval: 'auto',
                  interval: 0,
                  textStyle: {
                    color: 'rgba(255,255,255,0.5)',
                    fontSize:(this.bg_css.bg_all_width)/158.33,
                    itemSize:'' 
                  },
                  
                },
              },
              yAxis: {
                type: "value",
                max:integer_fun(max_amt),
                min:0,
                // splitNumber:5,
                interval: integer_fun(max_amt)/5,
                splitLine: {
                  show: true,
                  lineStyle: { type: "dotted", color:'rgba(61,62,95,0.8)' },
                },


                axisLine: {
                  show: false,
                },
                axisTick: {
                  show: false,
                },

                axisLabel: {
                  // interval: 500,
                  textStyle: {
                    // color: "#ccc",
                    color: 'rgba(255,255,255,0.5)',
                    // color:new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                    //   {
                    //     offset: 1,
                    //     color: '#43F4FC',
                    //   },
                    //   {
                    //     offset: 0.5,
                    //     color: '#8E9CFE',
                    //   },
                    //   {
                    //     offset: 0,
                    //     color: '#F444FD',
                    //   },
                    // ]),
                    fontSize:10

                  },
                  formatter:'{value} 万'
                },
              },

              series: [
                {
                  name: "本月",
                  // showSymbol: false,
                  showSymbol: (sale_amt.length==1)? true:false,
                  smooth: true, //true 为平滑曲线，false为直线
                  itemStyle: {
                    color: "#919191",
                    normal: {
                      // color: "#22BDF6",
                      color:new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                        // {
                        //   offset: 1,
                        //   color: '#43F4FC',
                        // },
                        {
                          offset: 1,
                          color: '#8E9CFE',
                        },
                        {
                          offset: 0,
                          // color: '#F444FD',
                          color: '#C298EC',
                        },
                      ],false),                      
                      lineStyle: {
                        // color: "#BBBBBB",
                        // color: "#22BDF6",
                        // width: (this.bg_css.bg_all_width/950), //设置线条粗细
                        // width: (this.bg_css.bg_all_width/950), //设置线条粗细
                        width:1,
                      },
                      areaStyle: {
                        color: "rgba(255, 255, 255, 0.00)",
                      },
                    },
                  },
                  barWidth:'25%',
                  data: sale_amt,
                  type: "bar",
                  areaStyle: {},
                },
                // {
                //   name: "目标",
                //   showSymbol: (ago_amt.length==1)? true:false,
                //   smooth: true, //true 为平滑曲线，false为直线  
                //   itemStyle: {
                //     color: "#0938F7",
                //     normal: {
                //       color: "#6E6E6E",
                //       lineStyle: {
                //         color: "#6E6E6E",
                //         width: (this.bg_css.bg_all_width/950), //设置线条粗细
                //       },
                //       areaStyle: {
                //         color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                //           {
                //             offset: 0,
                //             color: "rgba(110,110,110, 0.2)",
                //           },
                //           {
                //             offset: 0.1,
                //             color: "rgba(110,110,110, 0.2)",
                //           },
                //           {
                //             offset: 0.6,
                //             color: "rgba(110,110,110, 0.4)",
                //           },
                //           {
                //             offset: 1,
                //             color: "rgba(110,110,110, 0.4)",
                //           },
                //         ]),
                //       },
                //     },
                //   },
                //   data: ago_amt,
                //   type: "bar",
                //   areaStyle: {},
                // },
              ],
        });  

    },



    chart_dashboard_luosi(user_refs_huan){
      this.chartIns = echarts.init(this.$refs[user_refs_huan]);
      // console.log("=======运行到仪表盘 圆环的！！这里！！#22BDF6 =======");
      // console.log(user_color);
      // console.log(user_rate);
      // console.log(this.data["lsmy_channel-order_status_fut"]);
      // console.log(this.data["lsmy_channel-order_status_tot_disp"]);

      // SELECT SUM(DTD_AUD_AMT     ) AS DTD_AUD_AMT       -- 当天审核业绩
      // 	  ,SUM(DTD_GOODS_AUD_AMT ) AS DTD_GOODS_AUD_AMT -- 当天货审金额
      // 	  ,SUM(DTD_FIN_AUD_AMT   ) AS DTD_FIN_AUD_AMT   -- 当天财审金额
      // 	  ,SUM(DTD_PRINT_AMT     ) AS DTD_PRINT_AMT     -- 当天打印金额
      // 	  ,SUM(DTD_SEND_AMT      ) AS DTD_SEND_AMT      -- 当天发货业绩


      let chartName= ["已审核业绩", "已货审金额","已财审金额","已打印金额","已发货业绩",];  
      // let chartName= ["已货审金额", "已发货业绩", "已审核业绩", "已财审金额", "已打印金额"];  
      // let chartName= ["待货审", "待发货", "待客审", "待财审", "待打印"];   
      // 算百分比的： 
      let all_amt_value=((this.data["NON_PM_lsmy_channel-order_status_tot_disp"][0].DTD_GOODS_AUD_AMT||0)+
        (this.data["NON_PM_lsmy_channel-order_status_tot_disp"][0].DTD_SEND_AMT||0)+
        (this.data["NON_PM_lsmy_channel-order_status_tot_disp"][0].DTD_AUD_AMT||0)+
        (this.data["NON_PM_lsmy_channel-order_status_tot_disp"][0].DTD_FIN_AUD_AMT||0)+
        (this.data["NON_PM_lsmy_channel-order_status_tot_disp"][0].DTD_PRINT_AMT||0));

      let chartData= [
        (this.data["NON_PM_lsmy_channel-order_status_tot_disp"][0].DTD_AUD_AMT||0),
        (this.data["NON_PM_lsmy_channel-order_status_tot_disp"][0].DTD_GOODS_AUD_AMT||0),
        (this.data["NON_PM_lsmy_channel-order_status_tot_disp"][0].DTD_FIN_AUD_AMT||0),
        (this.data["NON_PM_lsmy_channel-order_status_tot_disp"][0].DTD_PRINT_AMT||0),
        (this.data["NON_PM_lsmy_channel-order_status_tot_disp"][0].DTD_SEND_AMT||0),];


      // let chartData= [(this.data["lsmy_channel-order_status_tot_disp"][0].DTD_GOODS_AUD_AMT||0),
      //   (this.data["lsmy_channel-order_status_tot_disp"][0].DTD_SEND_AMT||0),
      //   (this.data["lsmy_channel-order_status_tot_disp"][0].DTD_AUD_AMT||0),
      //   (this.data["lsmy_channel-order_status_tot_disp"][0].DTD_FIN_AUD_AMT||0),
      //   (this.data["lsmy_channel-order_status_tot_disp"][0].DTD_PRINT_AMT||0),];

      // let all_amt_value=((this.data["lsmy_channel-order_status_fut"][0].WAIT_GOOGDS_AUD_AMT||0)+
      //   (this.data["lsmy_channel-order_status_fut"][0].WAIT_SEND_AMT||0)+
      //   (this.data["lsmy_channel-order_status_fut"][0].WAIT_CS_AUD_AMT||0)+
      //   (this.data["lsmy_channel-order_status_fut"][0].WAIT_FIN_AUD_AMT||0)+
      //   (this.data["lsmy_channel-order_status_fut"][0].WAIT_PRT_AUD_AMT||0));
      // let chartData= [(this.data["lsmy_channel-order_status_fut"][0].WAIT_GOOGDS_AUD_AMT||0),
      //   (this.data["lsmy_channel-order_status_fut"][0].WAIT_SEND_AMT||0),
      //   (this.data["lsmy_channel-order_status_fut"][0].WAIT_CS_AUD_AMT||0),
      //   (this.data["lsmy_channel-order_status_fut"][0].WAIT_FIN_AUD_AMT||0),
      //   (this.data["lsmy_channel-order_status_fut"][0].WAIT_PRT_AUD_AMT||0),];

      let chartColor=[{color:"#2165FF"},
        {color:"#41E17A"},
        {color:"#38E7EA"},
        {color:"#FABB37"},
        {color:"#F77137"}];
      let data_value=[]
      let legendName=[]

      for (var i=0;i<chartData.length;i++){
        var c={
            value:chartData[i],
            name:chartName[i]+'   '+(((chartData[i]/all_amt_value)||0)*100).toFixed(1)*1+'%',
            itemStyle:chartColor[i]
        }
        data_value[i]=c;
        legendName[i]=chartName[i]+'   '+(((chartData[i]/all_amt_value)||0)*100).toFixed(1)*1+'%';
      }


      this.chartIns.setOption({
        // title:{
        //   text: '南丁格尔玫瑰图',
        //   subtext: '纯属虚构',
        //   x:'center'
        // },
        tooltip:{
          trigger: 'item',
          //提示框的数据样式显示
          formatter:"{a}<br/>占比名是{b}：{c} ({d}%) "
        },
        //图例相关内容的说明
        legend:{
          x : '55%',
          y : 'center',
          //图例的排列默认属性是：水平或垂直,默认是：水平
          orient:'vertical',
          // data:['待货审','待发货','待客审','待财审','待打印'],
          data:legendName,
          textStyle: {color: '#fff',fontSize:(this.bg_css.bg_all_width/158.33)},
          itemHeight: (this.bg_css.bg_all_width/190), //修改icon图形大小 
          itemWidth: (this.bg_css.bg_all_width/190),
          itemGap: (this.bg_css.bg_all_width/190),//间距
        },
        toolbox: {
          show : true,//是否显示工具栏组件
          feature : {
            //mark : {show: true},
            //显示图像所提供的数据
            dataView : {show: true, readOnly: false},
            //启用的动态数据类型
            magicType : {
              show: true,
              type: ['pie', 'funnel']
            },
            //配置项还原
            restore : {show: true},
            //保存为图片
            saveAsImage : {show: true}
          }
        },
        calculable : true,//手柄拖拽调整选中的范围
        series : [
          {
            name:'半径模式',
            type:'pie',
            // radius : [20, 110],
            radius : ['30%', '90%'],
            center : ['30%', '50%'],
            roseType : 'radius',
            width: '100%',// for funnel
            max: 40,// for funnel
            itemStyle : {
              //普通样式设置
              normal : {
                label : {
                  show : false
                },
                labelLine : {
                  show : false
                }
              },
            },
            data:data_value,
          },
        ]

      });

    },


    chart_dashboard_map(user_refs_huan){
      this.chartIns = echarts.init(this.$refs[user_refs_huan]);
      echarts.registerMap('china',china);            //中国省数据
      echarts.registerMap('china_city',china_city);  //中国市数据
      console.log("=======运行到仪表盘 地图·的的！！这里！！#22BDF6 =======");
      // console.log(user_color);
      // console.log(user_rate);

      let round=function(num){
        while(num%1!=0){
          num++;
        }
        return num;
      };
      // let bba=round(41);
      // console.log(bba);


      var outname = ["南海诸岛", '北京', '天津', '上海', '重庆', '河北', '河南', '云南', '辽宁', '黑龙江', '湖南', '安徽', '山东', '新疆', '江苏', '浙江', '江西', '湖北', '广西', '甘肃', '山西', '内蒙古', '陕西', '吉林', '福建', '贵州', '广东', '青海', '西藏', '四川', '宁夏', '海南', '台湾', '香港', '澳门'];
      var outvalue = [0, 524, 13, 140, 75, 13, 83, 11, 19, 15, 69, 260, 39, 4, 31, 104, 36, 1052, 33, 347, 9, 157, 22, 4, 18, 5, 2398, 41, 0, 484, 404, 22, 3, 5, 225];
      var outcolor = ['#4ab2e5', '#4fb6d2', '#52b9c7', '#5abead', '#f34e2b', '#f56321', '#f56f1c', '#f58414', '#f58f0e', '#f5a305', '#e7ab0b', '#dfae10', '#d5b314', '#c1bb1f', '#b9be23', '#a6c62c', '#96cc34', '#FF00FF', '#9400D3', '#DC143C', '#00008B', '#4682B4', '	#FFD700', '	#FFA500', '	#FF8C00', '#FF4500', '#808080', '	#FF0000', '#FFDEAD', '#808000', '#556B2F', '#3CB371', '#00CED1', '#1E90FF', '#4169E1'];
      
      // var outcolor = ['#BC72AF','#3F918E'];
      // var outcolor = [];
      
      var outdata = [];

      let user_rate=this.data["NON_PM_lsmy_channel-map_amt"];
      user_rate.sort((a, b) => {
          let value_sort = "";
          let a_time = (a["SALE_AMT"]);
          let b_time = (b["SALE_AMT"]);     
          value_sort = Number(b_time) - Number(a_time);       
          return value_sort;
      });

      console.log(user_rate);
      outname=[];
      outvalue=[];
      Object.keys(user_rate).forEach((key_value) => {
        if(key_value<40&&user_rate[key_value].PROVINCE!=null){
          if(user_rate[key_value].PROVINCE=='宁夏回族自治区'){
            outname.push('宁夏');
          }else if(user_rate[key_value].PROVINCE=='西藏自治区'){
            outname.push('西藏');
          }else if(user_rate[key_value].PROVINCE=='内蒙古自治区'){
            outname.push('内蒙古');
          }else if(user_rate[key_value].PROVINCE=='新疆维吾尔自治区'){
            outname.push('新疆');
          }else if(user_rate[key_value].PROVINCE=='广西壮族自治区'){
            outname.push('广西');
          }else{
            outname.push(user_rate[key_value].PROVINCE.replace(/省/g,''));            
          }

          outvalue.push(user_rate[key_value].SALE_AMT/10000);

          if(key_value<3){
            outcolor.push('rgba(255,186,87,0.4)');
          }else if(key_value<5){
            outcolor.push('rgba(108,183,253,0.8)');
          }else if(key_value<10){
            outcolor.push('rgba(108,183,253,0.6)');
          }else if(key_value<15){
            outcolor.push('rgba(100,149,237,0.8)');
          }else if(key_value<20){
            outcolor.push('rgba(100,149,237,0.1)');
          }else if(key_value<30){
            outcolor.push('rgba(65,105,225,0.8)');
          }else{
            outcolor.push('rgba(65,105,225,1)');
          }
        }
      });  	


      var max = 6000,
          min = 10;
      var maxSize4Pin = 100,
          minSize4Pin = 20;

      for (var i = 0; i < outname.length; i++) {
          outdata.push({
              name: outname[i],
              value: outvalue[i],
              color: outcolor[i],
          })
      }

      outdata.sort((a, b) => {
          let value_sort = "";
          let a_time = (a["value"]);
          let b_time = (b["value"]);     
          value_sort = Number(a_time) - Number(b_time);       
          return value_sort;
      });
      // console.log(outdata);
      // console.log(outvalue);



      var geoCoordMap = {};
      /*获取地图数据*/
      // var mapFeatures = echarts.getMap('china_city').geoJson.features;
      var mapFeatures = echarts.getMap('china').geoJson.features;
      //  console.log(mapFeatures)
      //  console.log(outname);
      mapFeatures.forEach(function(v) {
          // console.info(v)
          // 地区名称
          var name = v.properties.name;
          // 地区经纬度
          geoCoordMap[name] = v.properties.cp;

      });
      var convertData = function(outdata) {
          var res = [];
          for (var i = 0; i < outdata.length; i++) {
              var geoCoord = geoCoordMap[outdata[i].name];
              if (geoCoord) {
                  res.push({
                      name: outdata[i].name,
                      value: geoCoord.concat(outdata[i].value),
                      itemStyle:{color:(outdata[i].color||'#46d3fe')},
                  });
              }
          }
          return res;
      };

      // console.log(convertData(outdata));



      this.chartIns.setOption({

        // backgroundColor: '#0F1C3C',
        tooltip: {
            show: false,
            formatter: function(params) {
                if (params.value.length > 1) {
                    return '&nbsp;&nbsp;' + params.name + '&nbsp;&nbsp;&nbsp;' + params.value[2] + '人&nbsp;&nbsp;';
                } else {
                    return '&nbsp;&nbsp;' + params.name + '&nbsp;&nbsp;&nbsp;' + params.value + '人&nbsp;&nbsp;';
                }
            },

        },

        // visualMap: {
        //     show: true,
        //     min: 0,
        //     max: 200,
        //     left: '10%',
        //     top: 'bottom',
        //     calculable: true,
        //     seriesIndex: [1],
        //     inRange: {
        //         color: ['#04387b', '#467bc0'] // 蓝绿
        //     }
        // },

        visualMap: {
            type: 'piecewise',
            show:true,
            left: '8',
            bottom: '4',
            itemWidth: 27/1.5,
            itemHeight: 15/1.5,
            textStyle: {
                color: '#fff',
                fontSize: 10,
            },
            pieces: [{
                min: outvalue[0],
                label: '>'+round(outvalue[0].toFixed(0))+'万',
            }, {
                max: outvalue[0],
                min: outvalue[0]*0.8,
                label: round(outvalue[0].toFixed(0))+'万-'+round((outvalue[0]*0.8).toFixed(0))+'万',
            }
            , {
                max: outvalue[0]*0.8,
                min: outvalue[0]*0.6,
                label: round((outvalue[0]*0.8).toFixed(0))+'万-'+round((outvalue[0]*0.6).toFixed(0))+'万',
            }, {
                max: outvalue[0]*0.6,
                min: outvalue[0]*0.4,
                label: round((outvalue[0]*0.6).toFixed(0))+'万-'+round((outvalue[0]*0.4).toFixed(0))+'万',
            }, {
                max: outvalue[0]*0.4,
                min: outvalue[0]*0,
                label: '<'+round((outvalue[0]*0.4).toFixed(0))+'万',
            }, 
            
            ],
            inRange: {
                // color: ['#B2CAE0', '#D2EAFF', '#8AC6FD', '#45A5F8']rgba(65,105,225,1)
                // color: ['#CCD6FF', '#AABBFF', '#88A0FF', '#4469FF', '#003CFF']  
                // color: ['rgba(59,11,76,0.9)', 'rgba(100,28,74,0.9)', 'rgba(155,42,42,0.9)', 'rgba(192,54,27,0.9)', 'rgba(249,73,7,0.9)']
                // color: ['#50C1FA', '#3990F7', '#316FD5', '#1A2A91', '#14085A']  
                color: ['#14085A', '#1A2A91', '#316FD5', '#3990F7', '#50C1FA'] 
            },
            outOfRange: {
                color: ['#999999']
            }
        },

        // visualMap: {
        //     min: 0,
        //     max: 1000,
        //     left: 26,
        //     bottom: 40,
        //     showLabel: !0,
        //     text: ['万投比'],
        //     precision: 1,
        //     pieces: [
        //         {
        //             gte: 0.8*200,
        //             color: '#ff5428',
        //         },
        //         {
        //             gte: 0.6*200,
        //             lt: 0.8*200,
        //             color: '#ff5428',
        //         },
        //         {
        //             gte: 0.4*200,
        //             lt: 0.6*200,
        //             color: '#ff5428',
        //         },
        //         {
        //             gte: 0.2*200,
        //             lt: 0.4*200,
        //             color: '#ff8c71',
        //         },
        //         {
        //             gt: 0,
        //             lt: 0.2*200,
        //             color: '#ffd768',
        //         },
        //     ],
        // },

        geo: {   //geo:定义地图为china，其中可能大概率要用的一个配置zoom: 视角缩放比例，roam：是否开启缩放和平移
            map: 'china',
            show: true,
            roam: false,
            label: {
                emphasis: {
                    show: false
                }
            },
            layoutCenter: ['50%', '50%'],
            // layoutSize: (1*100*1.09)+"%",
            layoutSize: (1*100*1.08)+"%",

            itemStyle: {
                normal: {
                    borderColor: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: '#00F6FF'
                    }, {
                        offset: 1,
                        color: '#53D9FF'
                    }], false),
                    borderWidth: 1,
                    shadowColor: 'rgba(10,76,139,1)',
                    shadowOffsetY: 0,
                    shadowBlur: 50
                }
            }
        },
        series: [{
            type: 'map',
            map: 'china',
            aspectScale: 0.75,
            zoom:1*1.1,
            label: {
                normal: {
                    show: true,
                    fontSize: "8",
                    color: '#E4E4E4',
                },
                emphasis: {
                    show: false,
                }
            },
            itemStyle: {
                normal: {
                    areaColor: {
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 0,
                            // color: '#073684' // 0% 处的颜色
                            color: '#ffffff' //
                        }, {
                            offset: 1,
                            // color: '#061E3D' // 100% 处的颜色
                            color: '#ffffff' //
                        }],
                    },
                    // borderColor: '#215495',
                    borderColor: '#708090',
                    borderWidth: 1,
                },
                emphasis: {
                    areaColor: {

                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 0,
                            // color: '#073684' // 0% 处的颜色
                            color: '#ffffff' //
                        }, {
                            offset: 1,
                            // color: '#061E3D' // 100% 处的颜色
                            color: '#ffffff' //
                        }],
                    },
                }
            },
            // zoom: 1.1,
            data: outdata,
        }, {
            type: 'effectScatter',
            coordinateSystem: 'geo',
            // rippleEffect: {
            //     brushType: 'stroke'
            // },
            
            rippleEffect: {
                period: (this.bg_css.bg_all_width/380),
                scale: (this.bg_css.bg_all_width/190)/3,
                // period:5,
                // scale:10,
                // brushType: 'fill'
                brushType: 'stroke'
            },

            showEffectOn: 'render',
            itemStyle: {
                normal: {
                    color: {
                        type: 'radial',
                        x: 0.5,
                        y: 0.5,
                        r: 0.5,
                        colorStops: [{
                            offset: 0,
                            color: 'rgba(5,80,151,0.2)'
                        }, {
                            offset: 0.8,
                            color: 'rgba(5,80,151,0.8)'
                        }, {
                            offset: 1,
                            color: 'rgba(0,108,255,0.7)'
                        }],
                        global: false // 缺省为 false
                    },
                }

            },
            label: {
                normal: {
                    show: false,
                    // color: '#fff',
                    color: '#000',
                    fontWeight: 'bold',
                    position: 'inside',
                    formatter: function(para) {
                        // console.log(para.name);
                        // return '{cnNum|' + (para.data.value[2]||0).toFixed(0) + '}'
                        return '{cnNum|' + (para.name) + '}'
                    },
                    rich: {
                        cnNum: {
                            fontSize: 8,
                            // color: '#D4EEFF',
                            color: '#BFBFBF',
                        }
                    }
                },
            },
            symbol: 'circle',

            // symbolSize: 3,

            symbolSize: function(val) {
                if (val[2] === 0) {
                    return 0;
                }
                var a = (maxSize4Pin - minSize4Pin) / (max - min);
                var b = maxSize4Pin - a * max;

                return (((a * val[2] + b * 1.2)/65>10))?10:(a * val[2] + b * 1.2)/65;
            },

            data: convertData(outdata),
            zlevel: 1,
        }]

      });


    },


    // 设置文字滚动

    setNumberTransform_zero (user_refs,choice_lenght) {
      // const numberItems = this.$refs[user_refs] // 拿到数字的ref，计算元素数量
      // const numberArr = ((choice_lenght==9)?this.orderNumall:this.orderNum).filter(item => !isNaN(item))
      // 结合CSS 对数字字符进行滚动,显示订单数量
      // console.log("=========gundogn1de1=====");
      // // console.log(numberArr);
      // console.log(numberItems.length);

      for (let index = 0; index < this.orderNumall.length; index++) {
        
        if(!isNaN(this.orderNumall[index])){
          // console.log("有数值的");
          const elem = this.$refs[user_refs+index][0];
          elem.style.transform = `translate(-50%, -${0 * 10}%)`;
          elem.style.transition='transform 0s ease-in-out'
        }

      }
      

      setTimeout(()=>{
        // this.toOrderNum(val,["_this.setNumberTransform_zero('numberItem_all','9')"],9,'大屏') // 这里输入数字即可调用
        this.setNumberTransform_daping(user_refs,choice_lenght);
      },1);


    },


    setNumberTransform_daping (user_refs) {
      // const numberItems = this.$refs[user_refs] // 拿到数字的ref，计算元素数量
      
      // const numberArr = (this.orderNumall).filter(item => !isNaN(item))
      // 结合CSS 对数字字符进行滚动,显示订单数量
      // console.log("=========gundogn1de1 大屏!!=====");

      for (let index = 0; index < this.orderNumall.length; index++) {
        if(!isNaN(this.orderNumall[index])){
          const elem = this.$refs[user_refs+index][0];
          elem.style.transform = `translate(-50%, -${this.orderNumall[index] * 10}%)`;
          elem.style.transition='transform 1s ease-in-out'
        }

      }

    },


    setNumberTransform (user_refs,choice_lenght) {
      const numberItems = this.$refs[user_refs] // 拿到数字的ref，计算元素数量
      
      const numberArr = ((choice_lenght==9)?this.orderNumall:this.orderNum).filter(item => !isNaN(item))
      // 结合CSS 对数字字符进行滚动,显示订单数量

      // console.log("=========gundogn1de1=====");
      // // console.log(numberArr);
      // console.log(numberItems);

      for (let index = 0; index < numberItems.length; index++) {
        const elem = numberItems[index]
        elem.style.transform = `translate(-50%, -${numberArr[index] * 10}%)`;
        elem.style.transition='transform 1s ease-in-out'
      }

    },
    // 处理总订单数字
    toOrderNum(num,set_fun,choice_lenght,big_value) {
      // console.log("运行到这里来额！！！");
      // console.log(choice_lenght);
      // console.log(num.length);

      var _this=this;
      _this.show=false;

      num = num.toString()
      // 把订单数变成字符串

      if(big_value=='大屏'){
        // console.log("-------大屏---------");
        num=this.fomatMoney(num);
        // console.log(num);
        this.orderNumall = num.split('') // 将其便变成数据，渲染至滚动数组
        // console.log(num.split(''));
        
      }else{

        if (num.length < choice_lenght) {
          num = '0' + num // 如未满八位数，添加"0"补位
          this.toOrderNum(num,set_fun,choice_lenght) // 递归添加"0"补位

        } else if (num.length === choice_lenght) {
          // 订单数中加入逗号
          // num = num.slice(0, 2) + ',' + num.slice(2, 5) + ',' + num.slice(5, 8)
          if(choice_lenght==9){
            num = num.slice(0, 3) + ',' + num.slice(3, 6)+','+num.slice(6, 9);
            this.orderNumall = num.split('') // 将其便变成数据，渲染至滚动数组
            // console.log(num.split(''));
          }else{
            num = num.slice(0, 3) + ',' + num.slice(3, 6);
            this.orderNum = num.split('') // 将其便变成数据，渲染至滚动数组            
          }
        } else {
          // 订单总量数字超过八位显示异常
          this.$message.warning('订单总量数字过大，显示异常，请联系客服')
        } 
               
      }
      
        




      if (set_fun) {
        Object.keys(set_fun).forEach((key_fun) => {
          // console.log(set_fun[key_fun]);
          // eval(set_fun[key_fun]);
          try {
            eval(set_fun[key_fun]);
          } catch (e) {
            console.log("找不到对应的函数！！！");
          }
        });
      }


    },


    ajax_data(apiMap){

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
            // console.log(prefix+"              "+interfaceName);  
            this.$axios
              .post(`/api/admin/data/${prefix}/${interfaceName}/get`, {})
              .then(({ data }) => {
                if (apiMap[key].type === Array) {
                  this.data[`${prefix}-${interfaceName}`] = data;
                } else {
                  this.data[`${prefix}-${interfaceName}`] = data;
                }

                // num_api_pd++;
                Object.keys(variable).forEach((key_var) => {

                  if(key_var==('resolve'+apiMap[key]['num'])){
                    // console.log(apiMap[key]['resolve'+apiMap[key]['num']]());
                    apiMap[key]['resolve'+apiMap[key]['num']]();

                    // console.log(num_api_pd);

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

    fomatMoney(num) {
      num = num + '';
      if (!num.includes('.')) {
          num += '.'
      }
      return num.replace(/(\d)(?=(\d{3})+\.)/g, function ($0, $1) {
          return $1 + ',';
      }).replace(/\.$/, '');

    },




  }
};
</script>

<style>
body {
  overflow: auto;
  /* overflow: hidden; */
}
.bg_allimg {
  background: url("~@/assets/images/datav/OmniChannel/bg_omnic.png") no-repeat left top/cover;
  margin: 0 auto;
}
.banner_bg{
  background: url("~@/assets/images/datav/OmniChannel/bg_banner.png") no-repeat left top/cover;
  margin: 0 auto;  
}

.decorate_bg{
  background: url("~@/assets/images/datav/OmniChannel/bg_decorate.png") no-repeat left top/cover;
  margin: 0 auto;  

}

.text_css{
  background: url("~@/assets/images/datav/OmniChannel/titleT.png") no-repeat left top/cover;
  margin: 0 auto;  
}

.content_left{
  float: left;
}

.content_left_bg{
  background: url("~@/assets/images/datav/OmniChannel/bg_left.png") no-repeat left top/cover;
  margin: 0 auto;   
}

.content_left_down_bg{
  background: url("~@/assets/images/datav/OmniChannel/bg_left_down.png") no-repeat left top/cover;
  margin: 0 auto;     
}

     /*订单总量滚动数字设置*/
    .box-item {
        position: relative;
        /* height: 100px; */
        /*font-size: 54px; */
        font-size: 36px;
        line-height: 41px;
        text-align: center;
        list-style: none;
        /*color: #2D7CFF; */
        color: #FFFFFF;
        writing-mode: vertical-lr;
        text-orientation: upright;
        /*文字禁止编辑*/
        -moz-user-select: none; /*火狐*/
        -webkit-user-select: none; /*webkit浏览器*/
        -ms-user-select: none; /*IE10*/
        -khtml-user-select: none; /*早期浏览器*/
        user-select: none;
        /* overflow: hidden; */
    }
    /* 默认逗号设置 */



    .mark-item-all {
        margin-right: 5px;
        line-height: 10px;
        font-size: 48px;
        position: relative;
        color: #FAF779;
    }
    .mark-item-all span {
      position: absolute;
      width: 100%;
      bottom: 0;
      writing-mode: vertical-rl;
      text-orientation: upright;
    }



    .mark-item {
        /* width: 10px;
        height: 100px; */
        margin-right: 5px;
        line-height: 10px;
        font-size: 48px;
        position: relative;
        /* & > span {
            position: absolute;
            width: 100%;
            bottom: 0;
            writing-mode: vertical-rl;
            text-orientation: upright;
        } */
    }
    .mark-item span {
      position: absolute;
      width: 100%;
      bottom: 0;
      writing-mode: vertical-rl;
      text-orientation: upright;
    }

    /*滚动数字设置*/

    .number-item-all{
      list-style: none;
      /* font-weight: bold; */
      color: #FAF779;
    }
    .number-item-all span{
      position: relative;
      display: inline-block;
      margin-right: 10px;
      width: 100%;
      height: 100%;
      writing-mode: vertical-rl;
      text-orientation: upright;
      overflow: hidden;
    }
    .number-item-all span i{
      font-style: normal;
      position: absolute;
      top: 11px;
      left: 50%;
      transform: translate(-50%,0);
      transition: transform 1s ease-in-out;
      letter-spacing: 10px;           
    }

    i.number-item-all_chushi{
      font-style: normal;
      position: absolute;
      top: 11px;
      left: 50%;
      transform: translate(-50%,0);
      transition: transform 0s ease-in-out;
      letter-spacing: 10px;           
    }

    .number-item-all:last-child {
        margin-right: 0;
    }



    .number-item {
        /*width: 41px;
        height: 75px; */
        /* width: 49px;
        height: 59px; */
        /*background: #ccc; */
        list-style: none;
        /* margin-right: 5px; */
        /*background:rgba(250,250,250,1); */
        border-radius:4px;
        /*border:1px solid rgba(221,221,221,1); */
        background: linear-gradient(0deg, rgba(30,32,150,0.5), rgba(8,83,233,0.8));
        border: 1px solid #4650FF;

        /* & > span {
            position: relative;
            display: inline-block;
            margin-right: 10px;
            width: 100%;
            height: 100%;
            writing-mode: vertical-rl;
            text-orientation: upright;
            overflow: hidden;
            & > i {
                font-style: normal;
                position: absolute;
                top: 11px;
                left: 50%;
                transform: translate(-50%,0);
                transition: transform 1s ease-in-out;
                letter-spacing: 10px;
            }
        } */
    }
    .number-item span{
      position: relative;
      display: inline-block;
      margin-right: 10px;
      width: 100%;
      height: 100%;
      writing-mode: vertical-rl;
      text-orientation: upright;
      overflow: hidden;
    }

    .number-item span i{
      font-style: normal;
      position: absolute;
      top: 11px;
      left: 50%;
      transform: translate(-50%,0);
      transition: transform 1s ease-in-out;
      letter-spacing: 10px;           
    }

    .number-item:last-child {
        margin-right: 0;
    }

    .pointerType{
      color: #FFFFFF;
    }
    .pointerType ul{
      margin: 0px;
      padding: 0px;      
    }
    .pointerType ul li{
      list-style: none;
      width: 50%;
      float: left;
    }
    .pointerType ul li span{
      display: block;
      float: left;
    }

    .cont_left_down_list{
      color: #FFFFFF;
    }
    .cont_left_down_list ul{
      margin: 0px;
      padding: 0px;
    }
    .cont_left_down_list ul li,.screen_qudao_xia_list ul li{
      list-style: none;
    }

    .cont_left_down_list ul li div.cont_left_down_list_text span{
      display: block;
      float: left;

    }

    .cont_left_down_list ul li div.cont_left_down_list_text span.list_title{
      width: 50%;
    }
    .cont_left_down_list ul li div.cont_left_down_list_text span.list_achi{
      width: 30%;
      text-align: center;
    }
    .cont_left_down_list ul li div.cont_left_down_list_text span.list_rate{
      width: 20%;
      text-align: right;
    }

    .cont_left_down_list ul li div.cont_left_down_list_bg{
      background: linear-gradient(90deg, #FE3211, #FBBD19);
      float: left;
    }

    .cont_left_down_list ul li div.cont_left_down_list_bgno{
      background: #22BDF6;
      float: left;
    }

    .cont_left_down_list ul li div.cont_left_down_list_bgd{
      background: #25267E;
      float: left;
    }


    .content_centre{
      float: left;
    }
    .content_centre div.screen_title{
      color: #FFFFFF;
      /* border: 1px solid #ffffff; */
    }

    .content_centre div.screen_title div.screen_title_h{
      text-align: center;
    }
    .content_centre div.screen_title div.screen_achi_h{
      color: #FAF779;
      text-align: center;
    }
    .content_centre div.screen_title div.screen_achi_h p{ 
      margin: 0px;
      padding: 0px;
    }
    .content_centre div.screen_title div.screen_achi_h div.screen_achi_info{
      color: #ffffff; 
    }
    .content_centre div.screen_title div.screen_achi_h div.screen_achi_info p{
      /* font-size: 16px; */
      float: left;
      width: 35%;
      /* margin-left: 22%; */
      margin-left: 19%;
    }
    .content_centre div.screen_title div.screen_achi_h div.screen_achi_info p span{
      /* font-size: 30px; */
    }

    .content_centre div.screen_title div.screen_achi_h div.screen_achi_info p i,.screen_qudao div.screen_qudao_info p i{
      font-style: normal;
      /* font-size: 14px; */
    }

    .screen_qudao{
      background: url("~@/assets/images/datav/OmniChannel/bg_qudao.png") no-repeat left top/cover;
      margin: 0 auto; 
    }
    .screen_qudao div.screen_qudao_info p{
      float: left;
      margin: 0px;
      padding: 0px;
      width: 20%;
    }

    .screen_shop_info{
      border: 1px solid rgba(34,189,246,0.6);
      float: left;
    }
    .screen_shop_info div{
      float: left;
    }
    .screen_shop_text p{
      margin: 0px;
      padding: 0px;
    }

  .corner { 
    width: 0;
    height: 0;
  }
  .corner p{
    -moz-transform: rotate(-45deg);
    -webkit-transform: rotate(-45deg);
    filter:progid:DXImageTransform.Microsoft.BasicImage(rotation=3);
  }
  .screen_qudao_xia div{
    float: left;
    /* border: 1px solid #fff; */

  }
  .screen_qudao_xia div.screen_qudao_xia_left{
    width: 50%;      
  }
  .screen_qudao_xia div.screen_qudao_xia_right{
    width: 50%;    
  }
  .screen_qudao_xia div.screen_qudao_xia_left div.screen_qudao_xia_taget{
    width: 100%;
  }  
  .screen_qudao_xia div.screen_qudao_xia_left div.screen_qudao_xia_taget p{
    float: left; 
    width: 50%;
    margin: 0px;
    padding: 0px;
  }  
  .screen_qudao_xia div.screen_qudao_xia_left div.screen_qudao_xia_taget p i{
    font-style: normal;
  }   
  .screen_qudao_xia div.screen_qudao_xia_left div.screen_qudao_xia_taget p span{
    display: block;
    float: left;
  }

  .screen_qudao_xia_list{
    width: 100%;

  }

  .screen_qudao_xia_list ul{
    margin: 0px;
    padding: 0px;
  } 

  .screen_qudao_xia_list ul li{
    margin: 0px;
    padding: 0px;
  }  

  .screen_qudao_xia_list ul li.screen_qudao_xia_list_title{
    background: linear-gradient(90deg, rgba(32,94,253,0.39), rgba(46,48,150,0.24));
  }

  .screen_qudao_xia_list ul li.screen_qudao_xia_list_title ul li{
    width: 20%;
    float: left;
    text-align: center;
  }  
  
  .screen_qudao_xia_list ul li.screen_qudao_xia_list_corner ul li{
    width: 20%;
    float: left;
    text-align: center;
    border-bottom: 1px solid #585ABF;
  } 

  .content_right{
    float: left;
    color: #FFFFFF;
  }

  .cont_r_top{
    background: url("~@/assets/images/datav/OmniChannel/bg_right.png") no-repeat left top/cover;
    margin: 0 auto; 
  }
  .cont_r_top_dashboard{
    background: url("~@/assets/images/datav/OmniChannel/bg_right_nei.png") no-repeat left top/cover;
    margin: 0 auto; 
  }
  .cont_r_middle{
    background: url("~@/assets/images/datav/OmniChannel/bg_right_z.png") no-repeat left top/cover;
    margin: 0 auto; 
  }
  .cont_r_lower{
    background: url("~@/assets/images/datav/OmniChannel/bg_right_x.png") no-repeat left top/cover;
    margin: 0 auto;     
  }

  .top_dashboard_left,.top_dashboard_right{
    float: left;
    width: 50%;
  }
  .top_dashboard_left p,.top_dashboard_right p{
    padding: 0px;
    margin: 0px;
  }
  .cont_r_middle .cont_r_middle_title{
    float: left;
    width: 100%;
  }
  .cont_r_middle .cont_r_middle_title p{
    padding: 0px;
    margin: 0px;
  }
  .chart_middle_dashboard{
    float: left;
    /* border: 1px solid #fff; */
    width: 33.33%;
  }
  .chart_middle_dashboard .middle_text{
    text-align: center;
  }
  .chart_middle_dashboard .middle_text p{
    margin: 0px;
  }

  

</style>