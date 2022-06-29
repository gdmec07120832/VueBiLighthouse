<template>
  <div style="position: relative">

    <!-- <div class="Demo">
        <div class="Before" :class="isTop  ? 'contain-Before' : ''" @click="handleBefore"></div>
        <div class="After" :class="isTop  ? 'contain-After' : ''" @click="handleAfter" style="font-size:20px;color:black">这个是背面内容</div>
    </div> -->



    <div style="overflow: auto; background-color: #0f092a">
      <!-- <p>大屏-实时业绩</p> -->
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
          <!-- 左边的数据展示开始 -->
          <div>
            <div :style="bg_css.bg_left_css" class="bg_left">
              <div :style="{height: bg_css.bg_all_width/25.6 + 'px',
                  'margin-top':((bg_css.bg_all_width/8.93)-(bg_css.bg_all_width/25.6))/2+'px'}">
                <p style="color: #ffffff;text-align: center;margin: 0px;padding: 0px; text-shadow: 0px 3px 2px rgba(12, 21, 64, 0.73);" :style="{
                  'font-size': bg_css.bg_all_width/39.58+'px'
                }">
                  {{(data.user_set_data.dpt_rate)+'%'}}
                </p>   
                <p style="color: #ffffff;text-align: center;margin: 0px;padding: 0px;font-size: 16px; text-shadow: 0px 3px 2px rgba(12, 21, 64, 0.73);">
                  <!-- B2C销售管理部完成率 -->
                  多平台完成率
                </p>             
              </div>

            </div>
          </div>
          <!-- 左边的数据展示结束 -->
          <!-- 火背景图开始 -->
          <!-- width: bg_css.bg_fire_width + 'px',height: bg_css.bg_fire_height + 'px', -->
          <div class="bg_fire_mar" :style="{'padding-top': (bg_css.bg_all_width/192)+'px'}">
            <div
              :style="{
                width: bg_css.bg_all_width/2.41 + 'px',
                height: bg_css.bg_all_width/8.46 + 'px',
              }"
              class="bg_fire"
            ></div>            
          </div>
          <!-- 火背景图结束 -->
          <!-- title背景图开始 -->
          <div :style="{ 'margin-top': -(bg_css.bg_all_width/8.46) + 'px' }">
            <div
              :style="{
                width: bg_css.bg_title_width + 'px',
                height: bg_css.bg_title_height + 'px',
              }"
              class="bg_title"
            ></div>
          </div>
          <!-- title背景图结束 -->

          <!-- 炫光加点图开始 -->
          <div style="width: 100%;" :style="{height: bg_css.bg_all_width/13.813 + 'px',}"></div>
          <div class="bg_lizi" 
            :style="{
              width: bg_css.bg_all_width/1.6396 + 'px',
              height: bg_css.bg_all_width/4.8241 + 'px',
            }"
          >
            <div style="width: 100%;" :style="{height: bg_css.bg_all_width/7.533 + 'px',}"></div>
            <div class="bg_xuanguang"
              :style="{
                width: bg_css.bg_all_width/2.4 + 'px',
                height: bg_css.bg_all_width/10.9714 + 'px',
              }"
            ></div>
          </div>
          <!-- 炫光加点图结束 -->
        </div>
        <!-- 顶部布局结束 -->

        <!-- 内容布局开始 bg_css.content_left_css-->
        <!-- <div class="content_css" :style="{'margin-top':(bg_css.bg_all_width / 33.6842)-(bg_css.bg_all_width/4.8241)-(bg_css.bg_all_width/13.813)+'px'}"> -->
        <div style="float: left;" class="content_css" :style="{'margin-top':-(bg_css.bg_all_width / 3.96)+'px'}">
          <div class="content_1" 
            :style="{width:bg_css.content_left_css.width,'margin-left':bg_css.content_left_css['margin-left'],
            'margin-top': bg_css.bg_all_width/19.2+'px'}">
            <div style="margin-top:-30px;"><p style="font-size: 16px;">店铺完成率</p></div>
            <div class="content_1_list" :style="{'height':bg_css.bg_all_width/5.18+'px'}">
              <!--  -->
              <ul>

                <li v-for="(item,keys) in data.user_set_data.shop_rt.slice(0,7)" :key="keys"
                  :style="{height:(bg_css.content_left_list.width/9.18+'px'),}"
                  :class="((keys+1<=3))?'content_1_li1':'content_1_li2'"
                >
                <!--width:(((item.rate>1)?1:item.rate)*100)+'%',  'border-bottom-right-radius':
                        (((((item.rate>1)?1:item.rate)*100)>96)?(((bg_css.content_left_list.width*((item.rate>1)?1:item.rate))-((bg_css.content_left_list.width)/1.0385))/0.56):0)+'px'-->
                  <div ref="rate_li" class="rate_li_css"
                    :style="{height:(bg_css.content_left_list.width/9.18+'px'),
                    }" 

                      :class="((keys+1<=3))?'content_1_li1_bg':'content_1_li2_bg'" ></div>

                  <div :style="{'margin-top':(-(bg_css.content_left_list.width/9.18)+'px'),}">
                    <i :class="'content_i'+(keys+1)" 
                        :style="((keys+1)==1)?bg_css.content_left_list_i1:
                        ((keys+1)==2)?bg_css.content_left_list_i2:
                        ((keys+1)==3)?bg_css.content_left_list_i3:
                        bg_css.content_left_list_i4"></i>
                      <span :style="((keys+1)<=3)?bg_css.content_left_list_span1:bg_css.content_left_list_span4">{{item.name}}</span> 
                      <span class="span_num" style="float: right;" 
                        :style="{'margin-top':bg_css.content_left_list_span1['margin-top'],
                          'margin-right':bg_css.content_left_list_span1['margin-left']}">{{((item.rate*100).toFixed(2))+'%'}}</span>
                  </div>
                </li>


                <!-- <li
                  :style="{height:(bg_css.content_left_list.width/9.18+'px'),}"
                  :class="'content_1_li2'"
                >
                  <div ref="rate_li" class="rate_li_css"
                    :style="{height:(bg_css.content_left_list.width/9.18+'px'),
                    }" 
                      :class="'content_1_li2_bg'" ></div>
                  <div :style="{'margin-top':(-(bg_css.content_left_list.width/9.18)+'px'),}">
                    <i :class="'content_i'+(6)" 
                        :style="bg_css.content_left_list_i4"></i>
                      <span :style="bg_css.content_left_list_span4">{{'aaa'}}</span> 
                      <span class="span_num" style="float: right;" 
                        :style="{'margin-top':bg_css.content_left_list_span1['margin-top'],
                          'margin-right':bg_css.content_left_list_span1['margin-left']}">{{'bbb'}}</span>
                  </div>
                </li> -->


              </ul>
            </div>

            <div style="margin-top:20px;">
              <div style="margin-top:0px;"><p style="font-size: 16px;">分组完成率</p></div>

              <div class="content_2_list">
                <ul>

                  <li v-for="(item,keys) in data.user_set_data.group_rt.slice(0,4)" :key="keys"
                    :style="{height:(bg_css.bg_all_width/32+'px'),'margin-top': bg_css.bg_all_width/128+'px'}">

                    <div class="content_2_list_i" :style="{height:(bg_css.content_left_list.width/9.8+'px'),}">
                      <i :class="(keys+1)>3?'list2_i4':(keys+1==1)?'list2_i1':(keys+1==2)?'list2_i2':'list2_i3'" 
                          :style="bg_css.content_left_list2_i2">
                            <span v-if="(keys+1)>3" style="display: inline-block;" 
                              :style="{'margin-top':((bg_css.content_left_list.width / 3.91039/9.8)-((bg_css.content_left_list.width / 3.91039)/14.441/1.2))+'px'}">{{keys+1}}</span>
                      </i>
                    </div> 

                    <div class="content_2_list_content" :style="bg_css.content_left_list2_span">
                      <div :style="{width:bg_css.content_left_list2_span_div.width+'px','margin-top':bg_css.content_left_list2_span_div['margin-top']}">
                        <span>{{item.name}}</span>
                        <span class="list2_span_num" :style="{'margin-right':bg_css.content_left_list_span1['margin-left']}">{{((item.rate*100).toFixed(2))+'%'}}</span>                        
                      </div>
                    </div>
                    <div style="background: #3B3D58;float: right;" 
                      :style="{width:bg_css.content_left_list2_span_div.width+'px',
                        height:(bg_css.content_left_list.width/9.8/10+'px'),
                        'margin-top':(-(bg_css.content_left_list.width/9.8/10)+'px')}"></div>
                        <!-- 'margin-right':bg_css.content_left_list2_span_div.width-(bg_css.content_left_list2_span_div.width*((item.rate>1)?1:item.rate))+'px'
                        width:bg_css.content_left_list2_span_div.width*((item.rate>1)?1:item.rate)+'px', 
                          -->
                    <div style="background: #0A94FF;float: left;" ref="group_li" class="group_li_css"
                      :style="{
                        height:(bg_css.content_left_list.width/9.8/10+'px'),
                        'margin-top':(-(bg_css.content_left_list.width/9.8/10)+'px'),
                        'margin-left':bg_css.bg_all_width/35.23+'px'
                      }"></div>
                  </li>

                </ul>
              </div>
            </div>

          </div>


          <div class="content_centre" :style="{width:(bg_css.bg_all_width/2.2857)+'px','margin-left':(bg_css.bg_all_width/76.8)+'px'}">

            <div class="cont_centre_top5">
              <ul>
                <li :style="{
                  width: bg_css.bg_all_width/16.271 + 'px',
                  height: bg_css.bg_all_width/8.1702 + 'px',
                  'margin-top':bg_css.bg_all_width/8.93+'px',
                }" >

                  <div class="centre_top5_mig" :style="{'margin-top':-(bg_css.bg_all_width/24+(bg_css.bg_all_width/29.54))+'px',}">
                    <span style="display: block; margin: 0 auto; border: 5px solid #C6C6C6; border-radius: 50%; text-align: center;" 
                      :style="{
                        width: bg_css.bg_all_width/29.54 + 'px',
                        height: bg_css.bg_all_width/29.54 + 'px',
                        'background': 'url('+((data.user_set_data.dpt_rt.length>1)?data.user_set_data.dpt_rt[3].url:'')+')'+' no-repeat left top/cover'
                      }"></span>

                  </div>
                  <div style="font-size: 25px;text-align: center;" :style="{'margin-top':((bg_css.bg_all_width/24)/2-(bg_css.bg_all_width/105))+'px',}">
                    <div class="centre_top5_name" style="margin: 0 auto;" :style="{
                        height: bg_css.bg_all_width/50 + 'px', 
                        'line-height': bg_css.bg_all_width/54.29+'px'                         
                    }">
                      <span>{{(data.user_set_data.dpt_rt.length>1)?data.user_set_data.dpt_rt[3].name:'--'}}</span>                    
                    </div>

                  </div>
                  <div style="font-size: 30px;text-align: center;" :style="{'margin-top':((bg_css.bg_all_width/105))+'px',}">
                    <div class="centre_top5_achi" style="margin: 0 auto;" :style="{
                        height: bg_css.bg_all_width/41.3 + 'px', 
                        'line-height': bg_css.bg_all_width/42.222+'px'                    
                    }">
                      <span>{{(data.user_set_data.dpt_rt.length>1)?fomatMoney(data.user_set_data.dpt_rt[3].achi.toFixed(0)):'--'}}</span>                    
                    </div>                  
                  </div>
                  <div :style="{'margin-top':((bg_css.bg_all_width/105))+'px'}">
                    <div class="centre_top5_group" style="margin: 0 auto;" :style="{
                        width: bg_css.bg_all_width/16.33 + 'px',
                        height: bg_css.bg_all_width/54.86 + 'px',
                        'border-radius': (bg_css.bg_all_width/96)+'px',
                        'line-height': (bg_css.bg_all_width/54.286)+'px'
                    }">
                      <span>{{(data.user_set_data.dpt_rt.length>1)?data.user_set_data.dpt_rt[3].group:'--'}}</span>                    
                    </div>
                  </div>
                  <div class="centre_top5_i4">
                    <i :style="{
                      width: bg_css.bg_all_width/58.18 + 'px',
                      height: bg_css.bg_all_width/42.667 + 'px',
                      'margin-top':bg_css.bg_all_width/60+'px',
                    }"></i>
                  </div>
                  
                </li>

                <li :style="{
                  width: bg_css.bg_all_width/12.715 + 'px',
                  height: bg_css.bg_all_width/6.4 + 'px',
                  'margin-top':bg_css.bg_all_width/14.33+'px',
                  'margin-left':bg_css.bg_all_width/53.333+'px',
                  'background': 'url('+(top2src)+')'+' no-repeat left top/cover'
                }" >

                  <div class="centre_top5_mig" :style="{'margin-top':-(bg_css.bg_all_width/24+(bg_css.bg_all_width/25.54))+'px',}">
                    <span style="display: block; margin: 0 auto; border: 5px solid #C6C6C6; border-radius: 50%; text-align: center;" 
                      :style="{
                        width: bg_css.bg_all_width/24 + 'px',
                        height: bg_css.bg_all_width/24 + 'px',
                        'background': 'url('+((data.user_set_data.dpt_rt.length>1)?data.user_set_data.dpt_rt[1].url:'')+')'+' no-repeat left top/cover'
                      }"></span>
                  </div>
                  <div  style="font-size: 25px;text-align: center;" :style="{'margin-top':((bg_css.bg_all_width/24)/2-(bg_css.bg_all_width/105))+'px',}">
                    <div class="centre_top5_name" style="margin: 0 auto;" :style="{
                        height: bg_css.bg_all_width/50 + 'px', 
                        'line-height': bg_css.bg_all_width/54.29+'px'                         
                    }">
                      <span>{{(data.user_set_data.dpt_rt.length>1)?data.user_set_data.dpt_rt[1].name:'--'}}</span>                      
                    </div>

                  </div>
                  <div style="font-size: 30px;text-align: center;" :style="{'margin-top':((bg_css.bg_all_width/105))+'px',}">
                    <div class="centre_top5_achi" style="margin: 0 auto;" :style="{
                        height: bg_css.bg_all_width/41.3 + 'px', 
                        'line-height': bg_css.bg_all_width/42.222+'px'                    
                    }">
                      <span>{{(data.user_set_data.dpt_rt.length>1)?fomatMoney(data.user_set_data.dpt_rt[1].achi.toFixed(0)):'--'}}</span>                      
                    </div>

                  </div>
                  <div :style="{'margin-top':((bg_css.bg_all_width/39.184))+'px'}">
                    <div class="centre_top5_group" style="margin: 0 auto;" :style="{
                        width: bg_css.bg_all_width/14.159 + 'px',
                        height: bg_css.bg_all_width/54.86 + 'px',
                        'border-radius': (bg_css.bg_all_width/96)+'px',
                        'line-height': (bg_css.bg_all_width/54.286)+'px'
                    }">
                      <span>{{(data.user_set_data.dpt_rt.length>1)?data.user_set_data.dpt_rt[1].group:'--'}}</span>                      
                    </div>
                  </div>

                  <div class="centre_top5_i2">
                    <i :style="{
                      width: bg_css.bg_all_width/45.174 + 'px',
                      height: bg_css.bg_all_width/30.476 + 'px',
                      'margin-top':bg_css.bg_all_width/60+'px',
                    }"></i>
                  </div>
                
                </li>


                <li :style="{
                  width: bg_css.bg_all_width/11.497 + 'px',
                  height: bg_css.bg_all_width/5.749 + 'px',
                  'margin-top':bg_css.bg_all_width/22.33+'px',
                  'margin-left':bg_css.bg_all_width/53.333+'px',
                  'background': 'url('+(top1src)+')'+' no-repeat left top/cover'
                }" >

                  <div class="centre_top5_mig" :style="{'margin-top':-(bg_css.bg_all_width/21.33+(bg_css.bg_all_width/25.54))+'px',}">
                    <span style="display: block; margin: 0 auto; border: 5px solid #C6C6C6; border-radius: 50%; text-align: center;" 
                      :style="{
                        width: bg_css.bg_all_width/21.33 + 'px',
                        height: bg_css.bg_all_width/21.33 + 'px',
                        'background': 'url('+((data.user_set_data.dpt_rt.length>1)?data.user_set_data.dpt_rt[0].url:'')+')'+' no-repeat left top/cover'
                      }"></span>
                  </div>
                  <div  style="font-size: 25px;text-align: center;" :style="{'margin-top':((bg_css.bg_all_width/24)/2-(bg_css.bg_all_width/105))+'px',}">
                    <div class="centre_top5_name" style="margin: 0 auto;" :style="{
                        height: bg_css.bg_all_width/50 + 'px', 
                        'line-height': bg_css.bg_all_width/54.29+'px'                         
                    }">
                      <span>{{(data.user_set_data.dpt_rt.length>1)?data.user_set_data.dpt_rt[0].name:'--'}}</span>                      
                    </div>

                  </div>
                  <div style="font-size: 30px;text-align: center;" :style="{'margin-top':((bg_css.bg_all_width/105))+'px',}">
                    <div class="centre_top5_achi" style="margin: 0 auto;" :style="{
                        height: bg_css.bg_all_width/41.3 + 'px', 
                        'line-height': bg_css.bg_all_width/42.222+'px'                    
                    }">
                      <span>{{(data.user_set_data.dpt_rt.length>1)?fomatMoney(data.user_set_data.dpt_rt[0].achi.toFixed(0)):'--'}}</span>                      
                    </div>

                  </div>
                  <div :style="{'margin-top':((bg_css.bg_all_width/32.542))+'px'}">
                    <div class="centre_top5_group" style="margin: 0 auto;" :style="{
                        width: bg_css.bg_all_width/14.159 + 'px',
                        height: bg_css.bg_all_width/54.86 + 'px',
                        'border-radius': (bg_css.bg_all_width/96)+'px',
                        'line-height': (bg_css.bg_all_width/54.286)+'px'
                    }">
                      <span>{{(data.user_set_data.dpt_rt.length>1)?data.user_set_data.dpt_rt[0].group:'--'}}</span>                      
                    </div>
                  </div>

                  <div class="centre_top5_i1">
                    <i :style="{
                      width: bg_css.bg_all_width/53.33 + 'px',
                      height: bg_css.bg_all_width/25.26 + 'px',
                      'margin-top':bg_css.bg_all_width/60+'px',
                    }"></i>
                  </div>
                </li>



                <li :style="{
                  width: bg_css.bg_all_width/14.222 + 'px',
                  height: bg_css.bg_all_width/7.191 + 'px',
                  'margin-top':bg_css.bg_all_width/11.228+'px',
                  'margin-left':bg_css.bg_all_width/40+'px',
                  'background': 'url('+(top3src)+')'+' no-repeat left top/cover'
                }" >

                  <div class="centre_top5_mig" :style="{'margin-top':-(bg_css.bg_all_width/21.33+(bg_css.bg_all_width/25.54))+'px',}">
                    <span style="display: block; margin: 0 auto; border: 5px solid #C6C6C6; border-radius: 50%; text-align: center;" 
                      :style="{
                        width: bg_css.bg_all_width/25.6 + 'px',
                        height: bg_css.bg_all_width/25.6 + 'px',
                        'background': 'url('+((data.user_set_data.dpt_rt.length>1)?data.user_set_data.dpt_rt[2].url:'')+')'+' no-repeat left top/cover'
                      }"></span>
                  </div>
                  <div  style="font-size: 25px;text-align: center;" :style="{'margin-top':((bg_css.bg_all_width/24)/2-(bg_css.bg_all_width/205))+'px',}">
                    <div class="centre_top5_name" style="margin: 0 auto;" :style="{
                        height: bg_css.bg_all_width/50 + 'px', 
                        'line-height': bg_css.bg_all_width/54.29+'px'                         
                    }">
                      <span>{{(data.user_set_data.dpt_rt.length>1)?data.user_set_data.dpt_rt[2].name:'--'}}</span>                      
                    </div>

                  </div>
                  <div style="font-size: 30px;text-align: center;" :style="{'margin-top':((bg_css.bg_all_width/105))+'px',}">
                    <div class="centre_top5_achi" style="margin: 0 auto;" :style="{
                        height: bg_css.bg_all_width/41.3 + 'px', 
                        'line-height': bg_css.bg_all_width/42.222+'px'                    
                    }">
                      <span>{{(data.user_set_data.dpt_rt.length>1)?fomatMoney(data.user_set_data.dpt_rt[2].achi.toFixed(0)):'--'}}</span>                      
                    </div>

                  </div>
                  <div :style="{'margin-top':((bg_css.bg_all_width/49.23))+'px'}">
                    <div class="centre_top5_group" style="margin: 0 auto;" :style="{
                        width: bg_css.bg_all_width/14.159 + 'px',
                        height: bg_css.bg_all_width/54.86 + 'px',
                        'border-radius': (bg_css.bg_all_width/96)+'px',
                        'line-height': (bg_css.bg_all_width/54.286)+'px'
                    }">
                      <span>{{(data.user_set_data.dpt_rt.length>1)?data.user_set_data.dpt_rt[2].group:'--'}}</span>                      
                    </div>
                  </div>

                  <div class="centre_top5_i3">
                    <i :style="{
                      width: bg_css.bg_all_width/43.64 + 'px',
                      height: bg_css.bg_all_width/29.54 + 'px',
                      'margin-top':bg_css.bg_all_width/210.33+'px',
                    }"></i>
                  </div>

                </li>

                <li :style="{
                  width: bg_css.bg_all_width/19.01 + 'px',
                  height: bg_css.bg_all_width/9.6 + 'px',
                  'margin-top':bg_css.bg_all_width/8.17+'px',
                  'margin-left':bg_css.bg_all_width/40+'px',
                }" >

                  <div class="centre_top5_mig" :style="{'margin-top':-(bg_css.bg_all_width/21.33+(bg_css.bg_all_width/31.54))+'px',}">
                    <span style="display: block; margin: 0 auto; border: 5px solid #C6C6C6; border-radius: 50%; text-align: center;" 
                      :style="{
                        width: bg_css.bg_all_width/32 + 'px',
                        height: bg_css.bg_all_width/32 + 'px',
                        'background': 'url('+((data.user_set_data.dpt_rt.length>1)?data.user_set_data.dpt_rt[4].url:'')+')'+' no-repeat left top/cover'
                      }"></span>
                  </div>
                  <div  style="font-size: 25px;text-align: center;" :style="{'margin-top':((bg_css.bg_all_width/24)/2-(bg_css.bg_all_width/205))+'px',}">
                    <div class="centre_top5_name" style="margin: 0 auto;" :style="{
                        height: bg_css.bg_all_width/50 + 'px', 
                        'line-height': bg_css.bg_all_width/54.29+'px'                         
                    }">
                      <span>{{(data.user_set_data.dpt_rt.length>1)?data.user_set_data.dpt_rt[4].name:'--'}}</span>                      
                    </div>

                  </div>
                  <div style="font-size: 30px;text-align: center;" :style="{'margin-top':((bg_css.bg_all_width/105))+'px',}">
                    <div class="centre_top5_achi" style="margin: 0 auto;" :style="{
                        height: bg_css.bg_all_width/41.3 + 'px', 
                        'line-height': bg_css.bg_all_width/42.222+'px'                    
                    }">
                      <span>{{(data.user_set_data.dpt_rt.length>1)?fomatMoney(data.user_set_data.dpt_rt[4].achi.toFixed(0)):'--'}}</span>                      
                    </div>

                  </div>
                  <div :style="{'margin-top':((bg_css.bg_all_width/101.05))+'px'}">
                    <div class="centre_top5_group" style="margin: 0 auto;" :style="{
                        width: bg_css.bg_all_width/19.28 + 'px',
                        height: bg_css.bg_all_width/54.86 + 'px',
                        'border-radius': (bg_css.bg_all_width/96)+'px',
                        'line-height': (bg_css.bg_all_width/54.286)+'px'
                    }">
                      <span>{{(data.user_set_data.dpt_rt.length>1)?data.user_set_data.dpt_rt[4].group:'--'}}</span>                      
                    </div>
                  </div>

                  <div class="centre_top5_i5">
                    <i :style="{
                      width: bg_css.bg_all_width/66.21 + 'px',
                      height: bg_css.bg_all_width/45.71 + 'px',
                      'margin-top':bg_css.bg_all_width/210.33+'px',
                    }"></i>
                  </div>
                </li>

              </ul>
            </div>


            <div style="float:left;width:100%;" :style="{'margin-top':-(bg_css.bg_all_width/64)+'px'}">
              <!-- 清除浮动 -->
              <div style="clear: both;width:100%;"></div>
              <div class="cont_centre_list">
                <ul>
                  <li class="center_title_list" :style="{
                    width: bg_css.bg_all_width/2.286 + 'px',
                    height: bg_css.bg_all_width/48 + 'px',
                    'line-height': (bg_css.bg_all_width/48) +'px'
                  }">
                    <ul @click="handleBefore">
                      <li class="list_rank">排名</li>
                      <li>客服</li>
                      <li>分组</li>
                      <li class="list_shop_name">店铺</li>
                      <li>业绩</li>
                    </ul>
                  </li>


                  <li v-for="(item,keys) in data.user_set_data.dpt_rt.slice(5,10)" :key="keys" 
                    ref="fanzhuan" class="center_text_list" :style="{
                    width: bg_css.bg_all_width/2.286 + 'px',
                    height: bg_css.bg_all_width/48 + 'px',
                    'line-height': (bg_css.bg_all_width/48) +'px'
                  }">
                    <div :style="{
                      width: bg_css.bg_all_width/2.286 + 'px',
                      height: bg_css.bg_all_width/48 + 'px',
                      'line-height': (bg_css.bg_all_width/48) +'px'                      
                    }">
                      <ul>
                        <li class="list_rank">{{keys+6}}</li>
                        <li class="text_list_name">{{item.name}}</li>
                        <li>{{item.group}}</li>
                        <li class="list_shop_name" style="color:#9EB7E0;">{{item.shop}}</li>
                        <li style="color:#43E7FF;" >{{(item.achi==0)?'--':fomatMoney((item.achi).toFixed(0))}}</li>
                      </ul>                      
                    </div>
                  </li>


                </ul>
              </div>
              
            </div>

          </div>



          <div class="content_right" :style="{width:(bg_css.bg_all_width/3.84)+'px',
              'margin-left':(bg_css.bg_all_width/76.8)+'px',
              'margin-top':(bg_css.bg_all_width/32)+'px',
          }">
              <!-- 'padding-bottom': (bg_css.bg_all_width/87.27)+'px'   margin-top: -125px;   margin-top: 60px;-->
              <div class="right_title_p" 
                :style="{'padding-left':(bg_css.bg_all_width/106.67)+'px',
                  'padding-top':(bg_css.bg_all_width/146.15)+'px',
                  'padding-bottom': (bg_css.bg_all_width/96)+'px'
                }">
                <p style="margin: 0px;">多平台客服战绩排名</p>
              </div>          
             <div class="right_achi_list" style="">

                <ul class="right_achi_list_ul">

 
                  <li class="achiright_title_list" :style="{width:(bg_css.bg_all_width/3.84)+'px',
                    height:(bg_css.bg_all_width/38.4)+'px','line-height':(bg_css.bg_all_width/38.4)+'px',}">
                    <ul>
                      <li class="achiright_rank">排名</li>
                      <li class="achiright_name">客服</li>
                      <li class="achiright_channel">分组</li>
                      <li class="achiright_achievement">业绩</li>
                    </ul>  
                    <div
                      style="width: 88%;height:1px;margin: 0 auto; background-color:#3127C5;clear: both;"></div>
                  </li>

                  <li v-for="(item,keys) in data.user_set_data.staff_rt.slice(10,20)" :key="keys" 
                    :class="((keys+1+10)>3)?'achiright_text_list':'achiright_text_list_top3'" 
                    :style="{width:(bg_css.bg_all_width/3.84)+'px',
                      height:(((keys+1)>3)?bg_css.bg_all_width/40:bg_css.bg_all_width/38.4)+'px',
                      'line-height':(((keys+1)>3)?(bg_css.bg_all_width/40):(bg_css.bg_all_width/38.4))+'px',
                      'margin-top': (bg_css.bg_all_width/240)+'px'}">

                      <div ref="fanzhuan_rankall" :style="{
                        width:(bg_css.bg_all_width/3.84)+'px',
                        height:(((keys+1)>3)?bg_css.bg_all_width/40:bg_css.bg_all_width/38.4)+'px',
                        'line-height':(((keys+1)>3)?(bg_css.bg_all_width/40):(bg_css.bg_all_width/38.4))+'px',
                      }">
                        <ul>
                          <li class="achiright_rank " 
                            :class="((keys+1+10)>3)?'':((keys+1+10)==1)?'achiright_rank_i1':((keys+1+10)==2)?'achiright_rank_i2':'achiright_rank_i3'">
                            <div v-if="((keys+1+10)<=3)" :style="{'margin-top':((bg_css.bg_all_width/38.4)-(bg_css.bg_all_width/68.57))/2+'px'}">
                              <i :style="{width:(bg_css.bg_all_width/48)+'px',height:(bg_css.bg_all_width/68.57)+'px'}"></i>    
                            </div>
                            <span v-else>{{(keys+1+10)}}</span>
                          </li>
                          <li :class="((keys+1+10)>3)?'achiright_name':'achiright_name_top3'">{{(item.name||'--')}}</li>
                          <li class="achiright_channel" :style="{color:((keys+1+10)>3)?'#9EB7E0':'#FFFFFF'}">{{(item.GROUP_NAME||'--')}}</li>
                          <li class="achiright_achievement">{{(item.achi==0)?'--':(fomatMoney((item.achi).toFixed(0)))}}</li>
                        </ul>                          
                      </div>
                    <div v-if="((keys+1+10)>3)&&((keys+1+10)!=20)" 
                      style="width: 88%;height:1px;margin: 0 auto; background-color:#3127C5;clear: both;"></div>
                  </li>

                </ul>
                <div style="clear: both;width:100%;"></div>
            </div>

            
          </div>
        </div>
        <!-- 内容布局结束 -->
      </div>
      <!-- 大背景图结束 -->
    </div>
  </div>
</template>

<script>
var table_width = window.innerWidth;



// console.log(table_width);
var CurrUrl = window.location.host;


export default {
  name: "RealTimePerformance",
  data() {
    return {
      isTop:false,
      userurl: CurrUrl,

      //   src: require("@/assets/images/datav/bg.png"),
      src2: require("@/assets/images/datav/bg_title.png"),
      src3: require("@/assets/images/datav/bg_fire.png"),

      top1src:require("@/assets/images/datav/1.png"),
      top2src:require("@/assets/images/datav/2.png"),
      top3src:require("@/assets/images/datav/3.png"),

      bg_css: {
        bg_all_width: table_width,
        bg_all_height: table_width / 1.777778,

        bg_title_width: table_width / 1.75023,
        bg_title_height: table_width / 1.75023 / 4.35317,

        bg_fire_width: table_width / 2.94028,
        bg_fire_height: table_width / 2.94028 / 1.77929,

        //   bg_left_width:(table_width/3.91039),
        //   bg_left_height:((table_width/3.91039)/2.28372),

        bg_left_css: {
          "margin-left": table_width / 3.91039 / 21.34783 + "px",
          // "margin-top": table_width / 3.91039 / 2.28372 / 3.77193 + "px",
          "margin-top": table_width/15 + "px",
          width: table_width / 3.91039 + "px",
          height: table_width / 3.91039 / 2.28372 + "px",
        },
        content_left_css: {
          "margin-left": table_width / 3.91039 / 21.34783 + "px",
          "margin-top": table_width / 3.91039 / 2.28372 / 3.77193 + "px",
          width: table_width / 3.91039 + "px",
        },
        content_left_list:{
          width: table_width / 3.91039,
        },
        // 排名i的css
        content_left_list_i1:{
          width:((table_width / 3.91039)/24.5)/1.8+'px',
          height:((table_width / 3.91039)/10.6522)/1.8+'px',
          "margin-top":(((table_width / 3.91039)/9.18)-(((table_width / 3.91039)/10.6522)/1.8))/2+'px',
          "margin-left":(((table_width / 3.91039)/9.18)-(((table_width / 3.91039)/10.6522)/1.8))/1.5+'px',
        },
        content_left_list_span1:{
          "margin-top":(((table_width / 3.91039)/9.18)-(((table_width / 3.91039)/10.6522)/1.8))/1.8+'px',
          "margin-left":(((table_width / 3.91039)/9.18)-(((table_width / 3.91039)/10.6522)/1.8))/1.5+'px',
        },

        content_left_list_i2:{
          width:((table_width / 3.91039)/16.3333)/1.8+'px',
          height:((table_width / 3.91039)/10.6522)/1.8+'px',
          "margin-top":(((table_width / 3.91039)/9.18)-(((table_width / 3.91039)/10.6522)/1.8))/2+'px',
          "margin-left":(((table_width / 3.91039)/9.18)-(((table_width / 3.91039)/10.6522)/1.8))/1.5+'px',
        },

        content_left_list_i3:{
          width:((table_width / 3.91039)/16.3333)/1.8+'px',
          height:((table_width / 3.91039)/11.13636)/1.8+'px',
          "margin-top":(((table_width / 3.91039)/9.18)-(((table_width / 3.91039)/10.6522)/1.8))/2+'px',
          "margin-left":(((table_width / 3.91039)/9.18)-(((table_width / 3.91039)/10.6522)/1.8))/1.5+'px',
        },

        content_left_list_i4:{
          width:((table_width / 3.91039)/10.20833)/1.8+'px',
          height:((table_width / 3.91039)/8.16667)/1.8+'px',
          "margin-top":(((table_width / 3.91039)/9.18)-(((table_width / 3.91039)/8.16667)/1.8))/2+'px',
          "margin-left":(((table_width / 3.91039)/9.18)-(((table_width / 3.91039)/10.6522)/1.6))/1.5+'px',
        },
        content_left_list_span4:{
          "margin-top":(((table_width / 3.91039)/9.18)-(((table_width / 3.91039)/10.6522)/1.8))/2+'px',
          "margin-left":(((table_width / 3.91039)/9.18)-(((table_width / 3.91039)/10.6522)/1.8))/1.8+'px',
        },
        // 排名左下i的css
        content_left_list2_i2:{
          width:((table_width / 3.91039)/18.1852)/1.2+'px',
          height:((table_width / 3.91039)/14.441)/1.2+'px',
          "margin-left":(((table_width / 3.91039)/9.18)-(((table_width / 3.91039)/10.6522)/1.6))/1.5+'px',
          "margin-top":((table_width / 3.91039/9.8)-((table_width / 3.91039)/14.441/1.2))/2+'px',
        },
        content_left_list2_span:{
          height:table_width / 3.91039/9.8+'px',
          "margin-left":(((table_width / 3.91039)/9.18)-(((table_width / 3.91039)/10.6522)/1.8))/1.8+'px',
        },
        content_left_list2_span_div:{
          width:((table_width / 3.91039)-((table_width / 3.91039)/18.1852/1.2)-((((table_width / 3.91039)/9.18)-(((table_width / 3.91039)/10.6522)/1.6))/1.5)-((((table_width / 3.91039)/9.18)-(((table_width / 3.91039)/10.6522)/1.8))/1.8)),
          "margin-top":(((table_width / 3.91039)/9.18)-(((table_width / 3.91039)/10.6522)/1.8))/2+'px',          
        },

      },

      data:{
        let_data:{},
        let_data_down:{},
        centre_top5_data:{},
        centre_right_list_data:{},
        user_set_data:{
          dpt_rate:'--',
          shop_rt:'',
          group_rt:'',
          // dpt_rt:{
          //   achi:'--',
          //   name:'',
          //   group:'',
          //   shop:'',
          //   url:'',
          // },
          dpt_rt:'',
          staff_rt:'',
        }
      },
      test:0,


    };
  },


  // watch:{
  //   'data.user_set_data.dpt_rt'(val){
  //     console.log("==========asdadasd================")
  //     console.log(val);
  //     // let user_refs='';
  //     // user_refs=val;
  //     // user_refs=this.$refs["fanzhuan"]
  //     // this._fanzhuan(user_refs,0,this);
  //   }
  // },

  created () {

    if(this.userurl.indexOf('test.bi.linshimuye.com')>=0){
      window.location.replace("http://10.10.14.123:9090/frame/real-time-performance");
    }else if(this.userurl.indexOf('bi.linshimuye.com')>=0){
      window.location.replace("http://10.10.1.168:9090/frame/real-time-performance");
    }
    
    this.apiMap2 = {
      "SQL-NON_PM_terrace_staff-group_rt":{resultProp:"group_rt"},
      "SQL-NON_PM_terrace_staff-dpt_rate":{resultProp:"dpt_rate"},
      "SQL-NON_PM_terrace_staff-dpt_rt":{resultProp:"dpt_rt"},
      "SQL-NON_PM_terrace_staff-staff_rt":{resultProp:"staff_rt"},
      "SQL-NON_PM_terrace_staff-shop_rt":{resultProp:"shop_rt"},
    };
    this.ajax_data(this.apiMap2,true);
    // console.log(this.data);
    
  },


  mounted(){
    this.user_data_set();
    // 每隔5秒调用一次接口

    this.datav_setTimeout(this,this.apiMap2);
    this.datav_setTimeout_20(this);
  },

  methods:{

    // 测试的开始
    handleBefore(){
      if(!this.isTop){
        this.isTop = true
      }
      // let test=this.$refs["fanzhuan"]
      this._fanzhuan("fanzhuan",0,this);


      let test_aa1=this.$refs["rate_li"];
      for(let i=0;i<test_aa1.length;i++){
        test_aa1[i].style.width=0+'%';
      }

      // setTimeout(()=>{
      //   this._ratecss_li();
      // },1500);
      
    },


    _ratecss_li_reset(refs_set_r,data_set){
      let test=this.$refs[refs_set_r];
      for(let i=0;i<test.length;i++){
        test[i].style.transition='0s'; 
        test[i].style.width=0+'%';
      }

      setTimeout(()=>{
        this._ratecss_li(refs_set_r,data_set);
      },50);

    },


    _ratecss_li(refs_set,data_set){
      let test=this.$refs[refs_set];
      // console.log(test);
      for(let i=0;i<test.length;i++){
        test[i].style.width=0+'%';
        test[i].style.transition='2s'; 
        // test[i].style.width=((this.data.user_set_data.shop_rt[i].rate>1)?1:this.data.user_set_data.shop_rt[i].rate)*100 +'%';
        // test[i].style.width=this.bg_css.content_left_list2_span_div.width*((item.rate>1)?1:item.rate)+'px'; data.user_set_data.group_rt
        test[i].style.width=((data_set[i].rate>1)?0.89:0.89*data_set[i].rate)*100 +'%';



        // test[i].style['border-bottom-right-radius']=
        //   (((((this.data.user_set_data.shop_rt[i].rate>1)?1:this.data.user_set_data.shop_rt[i].rate)*100)>96)?
        //   (((this.bg_css.content_left_list.width*((this.data.user_set_data.shop_rt[i].rate>1)?1:this.data.user_set_data.shop_rt[i].rate))-((this.bg_css.content_left_list.width)/1.0385))/0.56):0)+'px'; 
        test[i].style['border-bottom-right-radius']=0+'px';
      
      }

    },

    // _group_li(){

    // },


    // data.user_set_data.group_rt



    _fanzhuan(refs,num,_this){

      if((num+1)>(_this.$refs[refs]).length){
        setTimeout(()=>{
          _this.handleAfter(refs);
        },1500);        
      }else{
        // console.log("运行到这里来！！！"+num);
        let useron_refs=_this.$refs[refs];
        useron_refs[num].style.transition='1s';
        useron_refs[num].style.transform='rotateX(360deg)';          
        setTimeout(()=>{
          _this._fanzhuan(refs,num,_this);          
        },250);
      }
      num++;

    },


    handleAfter(refs_on){
        if(this.isTop){
            this.isTop = false
        }
      let test=this.$refs[refs_on]
      // test[0].style.transition='1.5s';
      // test[0].style.transform='rotateX(0deg)';
      for(let i=0;i<test.length;i++){
        test[i].style.transition='0s';
        test[i].style.transform='rotateX(0deg)';
      }
      

    },
    // 测试的结束


    datav_setTimeout(set_val,data){
      // let _this=this;
      setTimeout(()=>{
        set_val.ajax_data(data);
        set_val.user_data_set();
        set_val.datav_setTimeout(set_val,data);
        // let testaa=this.$refs["fanzhuan"]
        // this._fanzhuan(testaa,0,this);
      },500000);
    },


    datav_setTimeout_20(set_val){
      setTimeout(()=>{
        this._fanzhuan("fanzhuan",0,this);
        this._fanzhuan("fanzhuan_rankall",0,this);

        this._ratecss_li_reset("rate_li",this.data.user_set_data.shop_rt);
        this._ratecss_li_reset("group_li",this.data.user_set_data.group_rt);
        set_val.datav_setTimeout_20(set_val);
      },20000);
    },

    user_data_set(){

      this.p1.then(()=>{
        //店铺完成率
        this.test+=1*1;

        this.data.user_set_data.dpt_rate=((this.data['NON_PM_terrace_staff-dpt_rate'][0].SALE_RATE||0)*100).toFixed(2);
        this.data.user_set_data.shop_rt=this.data['NON_PM_terrace_staff-shop_rt'];
        Object.keys(this.data.user_set_data.shop_rt).forEach((key_value) => {
          this.data.user_set_data.shop_rt[key_value].rate=this.data.user_set_data.shop_rt[key_value].SALE_RATE;
          this.data.user_set_data.shop_rt[key_value].name=this.data.user_set_data.shop_rt[key_value].SHOP_NAME;
        });
        this.data.user_set_data.shop_rt.sort((a, b) => {
            let a_time = "";
            let b_time = "";
            a_time = a["SALE_RATE"];
            b_time = b["SALE_RATE"];
            return b_time-a_time;
        });
        //分组完成率  
        this.data.user_set_data.group_rt=this.data['NON_PM_terrace_staff-group_rt'];
        Object.keys(this.data.user_set_data.group_rt).forEach((key_group) => {
          this.data.user_set_data.group_rt[key_group].rate=this.data.user_set_data.group_rt[key_group].SALE_RATE;
          this.data.user_set_data.group_rt[key_group].name=this.data.user_set_data.group_rt[key_group].GROUP_NAME;
        });
        this.data.user_set_data.group_rt.sort((a, b) => {
            let a_time = "";
            let b_time = "";
            a_time = a["SALE_RATE"];
            b_time = b["SALE_RATE"];
            return b_time-a_time;
        });

        // top5的数据 toFixed
        this.data.user_set_data.dpt_rt=this.data['NON_PM_terrace_staff-dpt_rt'];
        Object.keys(this.data.user_set_data.dpt_rt).forEach((key_dptrt) => {
          this.data.user_set_data.dpt_rt[key_dptrt].achi=(this.data.user_set_data.dpt_rt[key_dptrt].SALE_AMT||0);
          this.data.user_set_data.dpt_rt[key_dptrt].name=this.data.user_set_data.dpt_rt[key_dptrt].NICK_NAME;
          this.data.user_set_data.dpt_rt[key_dptrt].group=this.data.user_set_data.dpt_rt[key_dptrt].GROUP_NAME;
          this.data.user_set_data.dpt_rt[key_dptrt].shop=this.data.user_set_data.dpt_rt[key_dptrt].SHOP_NAME;  
          this.data.user_set_data.dpt_rt[key_dptrt].url=(this.data.user_set_data.dpt_rt[key_dptrt].EMPLOYEE_URL)||0;  

        });
        this.data.user_set_data.dpt_rt.sort((a, b) => {
            let a_time = "";
            let b_time = "";
            a_time = a["SALE_AMT"];
            b_time = b["SALE_AMT"];
            return b_time-a_time;
        });
        while ( this.data.user_set_data.dpt_rt.length< 10) {
          this.data.user_set_data.dpt_rt.push({achi:0,name:'--',group:'--',shop:'--',url:'--'});
        }


        // 全渠道客服战绩 BIG_GROUP_NAME
        this.data.user_set_data.staff_rt=this.data['NON_PM_terrace_staff-staff_rt'];
        Object.keys(this.data.user_set_data.staff_rt).forEach((staffrt) => {
          this.data.user_set_data.staff_rt[staffrt].achi=this.data.user_set_data.staff_rt[staffrt].SALE_AMT;
          this.data.user_set_data.staff_rt[staffrt].name=this.data.user_set_data.staff_rt[staffrt].NICK_NAME;
          this.data.user_set_data.staff_rt[staffrt].channel=this.data.user_set_data.staff_rt[staffrt].BIG_GROUP_NAME;
        });
        this.data.user_set_data.staff_rt.sort((a, b) => {
            let a_time = "";
            let b_time = "";
            a_time = a["SALE_AMT"];
            b_time = b["SALE_AMT"];
            return b_time-a_time;
        });
        while ( this.data.user_set_data.staff_rt.length< 25) {
          this.data.user_set_data.staff_rt.push({achi:0,name:'--',channel:'--'});
        }

        // console.log("======asdadadaqqqq1111111111111=====");
        // console.log(this.data.user_set_data.staff_rt);

        
        setTimeout(()=>{
          this._ratecss_li("rate_li",this.data.user_set_data.shop_rt);
          this._ratecss_li("group_li",this.data.user_set_data.group_rt);
        },50);


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
            // console.log(prefix+"              "+interfaceName);  
            this.$axios
              .post(`/api/admin/data/${prefix}/${interfaceName}/get`, {},(Istrue)?{headers:{username:encodeURIComponent("平台客服排行")}}:{})
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

  },


};
</script>  

<style>
body {
  /* overflow: auto; */
  overflow: hidden;
}
.bg_allimg {
  /* #0F092A */
  /* width: 100%; */
  /* height: 900px;   */
  /* width: 1920px;1.77777777
  height: 1080px; */
  background: url("~@/assets/images/datav/bg.png") no-repeat left top/cover;
  margin: 0 auto;
}
.bg_title {
  /* background: url("~@/assets/images/datav/bg_title.png") no-repeat left
    top/cover; */
  margin: 0 auto;
}
.bg_fire {
  /* background: url("~@/assets/images/datav/bg_fire.png") no-repeat left top/cover; */
  background: url("~@/assets/images/datav/title21_11.png") no-repeat left top/cover;
  margin: 0 auto;
}
.bg_left {
  float: left;
  background: url("~@/assets/images/datav/left_bg.png") no-repeat left top/cover;
  /* margin: 0 auto;     */
}

.bg_lizi{
  background: url("~@/assets/images/datav/lizi.png") no-repeat left top/cover;
  margin: 0 auto;  
}

.bg_xuanguang{
  background: url("~@/assets/images/datav/xuan.png") no-repeat left top/cover;
  margin: 0 auto; 

}

.content_css{
  /* border: 1px solid #ffffff; */
}
.content_css .content_1 {
  color: aliceblue;
  float: left;
}


.content_css .content_1 .content_1_list ul,.content_2_list ul,.cont_centre_top5 ul,.cont_centre_list ul,.center_title_list ul{
  /* padding: 0; */
  padding: 0px;
}

.content_css .content_1 .content_1_list ul li,.content_2_list ul li{
  list-style: none;
  /* margin-top: 20px; */
  margin-top: 10px;
  
}

.content_css .content_1 .content_1_list ul li .content_1_li1_bg {
  background-image: linear-gradient(to right,  rgba(0,31,120,0.1) , rgba(30,144,255,0.7));
  /* background: linear-gradient(90deg, #001F78 0%, #4190F9 100%); */
}

.content_css .content_1 .content_1_list ul .content_1_li1 {
  background: url("~@/assets/images/datav/left_kuang.png") no-repeat left top/cover;
}


.content_css .content_1 .content_1_list ul li .content_1_li2_bg {
  background-image: linear-gradient(to right,  rgba(10,22,232,0.2) , rgba(10,22,232,0.2));
  /* background: linear-gradient(90deg, #001F78 0%, #4190F9 100%); */
}

.content_css .content_1 .content_1_list ul li.content_1_li2 {
  background: url("~@/assets/images/datav/left_kuang_list.png") no-repeat left top/cover;
}

.content_css .content_1 .content_1_list ul li.content_1_li2 span.span_num {
  color: rgba(10,148,255,0.8);
}


.content_css .content_1 .content_1_list ul li i.content_i1 {
  background: url("~@/assets/images/datav/dp1.png") no-repeat left top/cover;
  display: inline-block;
  float: left;
}

.content_css .content_1 .content_1_list ul li span {
  float: left;
}

.content_css .content_1 .content_1_list ul li i.content_i2 {
  background: url("~@/assets/images/datav/dp2.png") no-repeat left top/cover;
  display: inline-block;
  float: left;
}

.content_css .content_1 .content_1_list ul li i.content_i3 {
  background: url("~@/assets/images/datav/dp3.png") no-repeat left top/cover;
  display: inline-block;
  float: left;
}

.content_css .content_1 .content_1_list ul li i.content_i4 {
  background: url("~@/assets/images/datav/dp4.png") no-repeat left top/cover;
  display: inline-block;
  float: left;
}

.content_css .content_1 .content_1_list ul li i.content_i5 {
  background: url("~@/assets/images/datav/dp5.png") no-repeat left top/cover;
  display: inline-block;
  float: left;
}

.content_css .content_1 .content_1_list ul li i.content_i6 {
  background: url("~@/assets/images/datav/dp6.png") no-repeat left top/cover;
  display: inline-block;
  float: left;
}

.content_css .content_1 .content_1_list ul li i.content_i7 {
  background: url("~@/assets/images/datav/dp7.png") no-repeat left top/cover;
  display: inline-block;
  float: left;
}


.content_2_list ul li{
  background-color: #0C1540;
}

.content_2_list ul li div.content_2_list_i,.content_2_list ul li div.content_2_list_content{
  float: left;
}

.content_2_list ul li div.content_2_list_content div span.list2_span_num{
  color: rgba(10,148,255,0.8);
  float: right;
}



.content_2_list ul li div.content_2_list_i i.list2_i1{
  background: url("~@/assets/images/datav/dpd1.png") no-repeat left top/cover;
  display: inline-block;
}

.content_2_list ul li div.content_2_list_i i.list2_i2{
  background: url("~@/assets/images/datav/dpd2.png") no-repeat left top/cover;
  display: inline-block;
}

.content_2_list ul li div.content_2_list_i i.list2_i3{
  background: url("~@/assets/images/datav/dpd3.png") no-repeat left top/cover;
  display: inline-block;
}


.content_2_list ul li div.content_2_list_i i.list2_i4{
  /* line-height: 2.4em; */
  text-align: center;
  font-style: normal;
  display: inline-block;
}


.content_centre,.content_right{
  float: left;
}

.cont_centre_top5 ul li{
  list-style: none;
  color: #ffffff;
  /* border: 1px solid #ffffff; */
  float: left;
  background: url("~@/assets/images/datav/dptopz.png") no-repeat left top/cover;

}


.centre_top5_i4 i{
  background: url("~@/assets/images/datav/dptop4.png") no-repeat left top/cover;
  display: block;
  margin: 0 auto;
}

.centre_top5_i2 i{
  background: url("~@/assets/images/datav/dptop2.png") no-repeat left top/cover;
  display: block;
  margin: 0 auto;
}

.centre_top5_i1 i{
  background: url("~@/assets/images/datav/dptop1.png") no-repeat left top/cover;
  display: block;
  margin: 0 auto;  
}

.centre_top5_i3 i{
  background: url("~@/assets/images/datav/dptop3.png") no-repeat left top/cover;
  display: block;
  margin: 0 auto;
}

.centre_top5_i5 i{
  background: url("~@/assets/images/datav/dptop5.png") no-repeat left top/cover;
  display: block;
  margin: 0 auto;  
}

.centre_top5_group{
  font-size: 16px;
  text-align: center; 
  background-color: rgba(0,36,110, 0.2);
  line-height: 30px;

}	
.centre_top5_achi span{
    font-family: 'Audiowide';
    text-align: center;
    color: #fff;
    text-shadow: 0 0 10px 	#D80D78,
                     0 0 20px 	#D80D78,
                     0 0 20px 		#D80D78,
                     0 0 30px 		#D80D78,
                     0 0 30px 		#D80D78,
                     0 0 30px 		#D80D78;
}
.centre_top5_name span,.text_list_name {
    font-family: 'Audiowide';
    text-align: center;
    /* color: #00a67c; */
    color: #fff;
        text-shadow: 0 0 10px #0D58C4,
                     0 0 20px #0D58C4,
                     0 0 20px #0D58C4,
                     0 0 30px #0D58C4,
                     0 0 30px #0D58C4,
                     0 0 30px #0D58C4;
}

.cont_centre_list ul li{
  list-style: none;
}

.cont_centre_list ul li.center_text_list{
  background: url("~@/assets/images/datav/dptoplist.png") no-repeat left top/cover;
  margin-top: 11.5px;
  opacity: 0.7;
}

.center_text_list ul li{
  list-style: none;
  width: 20%;
  color: #ffffff;
  float: left; 
  text-align: center;
}

.center_title_list ul li{
  list-style: none;
  width: 20%;
  float: left;
  text-align: center;
  color: #616D93;
}

.center_text_list ul li.list_rank,.center_title_list ul li.list_rank{
  width: 10%;
}

.center_text_list ul li.list_shop_name,.center_title_list ul li.list_shop_name{
  width: 30%;
}


.right_title_p{
  color: #ffffff;
  font-size: 16px;
}

.right_achi_list{
  background:rgba(12,21,64, 0.35);
  /* box-shadow: 0 0 10px rgb(0,153,184) inset,0px 0px 30px rgb(0,153,184); ,0px -25px 54px 0px rgba(23, 1, 136, 0.75)*/
  box-shadow: 0px 0px 20px 0px rgba(23, 1, 136, 0.45) inset;
  border-radius: 3px;
}

.right_achi_list ul{
  padding: 0px;
  margin: 0px;
}
.right_achi_list ul.right_achi_list_ul li{
  list-style: none;
  color: #ffffff;
  text-align: center;
  /* line-height: 55px; */
}
.right_achi_list ul.right_achi_list_ul li.achiright_text_list_top3{
  background: url("~@/assets/images/datav/rightbanner.png") no-repeat left top/cover;
  /* margin-top: 4px; */
}
.right_achi_list ul.right_achi_list_ul li.achiright_text_list{
  margin-top: 0px;
}

.right_achi_list_ul li ul li.achiright_rank{
  width: 22%;
}

.right_achi_list_ul li ul li.achiright_rank_i1 i{
  background: url("~@/assets/images/datav/right1.png") no-repeat left top/cover;
  display: block;
  margin: 0 auto;
}
.right_achi_list_ul li ul li.achiright_rank_i2 i{
  background: url("~@/assets/images/datav/right2.png") no-repeat left top/cover;
  display: block;
  margin: 0 auto;
}
.right_achi_list_ul li ul li.achiright_rank_i3 i{
  background: url("~@/assets/images/datav/right3.png") no-repeat left top/cover;
  display: block;
  margin: 0 auto;
}

.right_achi_list_ul li ul li.achiright_name{
  width: 20%;
}
.right_achi_list_ul li ul li.achiright_name_top3{
  width: 20%;
  color: #fff;
      text-shadow: 0 0 10px #0D58C4,
                   0 0 20px #0D58C4,
                   0 0 20px #0D58C4,
                   0 0 30px #0D58C4,
                   0 0 30px #0D58C4,
                   0 0 30px #0D58C4;  
}
.right_achi_list_ul li ul li.achiright_channel{
  width: 33%;
}
.right_achi_list_ul li ul li.achiright_achievement{
  width: 25%;
  color: #43E7FF;
}

.achiright_title_list ul li,.achiright_text_list ul li,.achiright_text_list_top3 ul li{
  float: left;
  width: 25%;
}

.right_achi_list_ul li.achiright_title_list ul li{
  color: #616D93;
}



















.Demo{
    width: 375px;
    height: 300px;
    margin-top: 50px;
    /* margin-left: 500px; */
    position: relative;
    perspective: 800px;
    box-sizing: border-box;
    
    
}
.Before{
    width: 100px;
    height: 200px;
    position: absolute;
    top:0;
    left: 0;
    background-repeat: no-repeat;
    background-position: center center;
    backface-visibility: hidden;
    transition: 1.5s;
    background-color: black;
    /* background-image:url('../assets/images/chunfen4.jpg'); */
    border:1px solid yellow;
 
}
.After{
    width: 100px;
    height: 200px;
    position: absolute;
    top:0;
    left: 0;
    color: #fff;
    background-color:#fff;
    text-indent: 2em;
    transform: rotateY(-180deg);
    backface-visibility: hidden;
    transition: 1.5s;
    border:1px solid yellow;
}
.Demo .contain-Before{
    transform: rotateY(180deg);
}
.Demo .contain-After{
    transform: rotateY(0deg);

    transform: rotateX(360deg);
}


.rate_li_css,.group_li_css{
  width:0px;
  transition:2s;
  

}

</style>






