<template>
  <div style="position: relative">
    <y-loading :loading.sync="loading" @cancelLoading="cancelExport"></y-loading>
    <!-- <top-toolbar @contextMenuClick="handleContextMenuClick" /> -->


    <div>
      <div style="background-color: #f5faff; height: 100vh; padding: 0 2%;overflow: auto; padding-top: 28px;">
        <div class="py10" style="margin: auto;">
          <div style="font-size: 26px;padding-left: 20px;">实时业绩</div>
          <div style="line-height: 24px;padding-left: 20px;" class="sub-tip">备注：【1】报表为当日实时数据，页面刷新频率为30秒；【2】实时业绩未包含状态为“首款已付，尾款未付”部分业绩；【3】不包含业务渠道为其它；</div>
        </div>

        <div style="background-color: #fff; border-radius: 0px; min-height: calc(100vh - 150px);box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);">
          
          <div class="flex flex-between mx20 py10" style="border-bottom: 0px solid rgba(0, 0, 0, .05)">
            <div style="font-size: 16px;">
              实时总览
              <span style="font-size: 12px;margin-left: 40px;color:#ff4d4f;">因海外亚马逊归属部门变动，即日起业绩纳入品市视角，如有疑问可联系芒果/语荣反馈，感谢关注！</span>
            </div>

            <div>
              <div class="text-xs-radio">
                视角
                <a-tooltip placement="top" overlayClassName="light-tooltip">
                  <template slot="title">
                    <div class="text-black text-xs" style="width: 350px">
                      <div>视角说明</div>
                      <div>一、全司视角：全公司产生业绩汇总，但不包含其它（非正常业务产生的业绩）</div>
                      <div>二、全中视角：全司视角的统计对象基础上，但不含①定制&拎包、②品牌市场所属业绩、③其它</div>
                      <div>三、品市视角：母婴店、快手店、抖音店、海外B2C的汇总业绩</div>
                    </div>
                  </template>
                  <a-icon type="question-circle" class="mr10" style="color: #999; cursor: pointer"/>
                </a-tooltip>
                <a-radio-group v-model="QsQuery.viewType">
                  <a-radio value="全司视角">全司视角</a-radio>
                  <a-radio value="全中视角">全中视角</a-radio>
                  <a-radio value="品市视角">品市视角</a-radio>
                </a-radio-group>
              </div>
            </div>


          </div>




          <!-- 实时业绩头部开始 -->
          <div>
            <div :class="(ChoiceVal.qs==true)?'change_cssY':'change_cssN'" style="width: 28%;float: left;border-right: 0px solid #DCDCDC;cursor: pointer;"
              @click="ChoiceCss('qs','_this.ChoiceVal',['_this.initecharts(\''+'EchLeft'+'\',\''+'时分趋势'+'\',true)','_this.initechartsR(\''+'EchRigth'+'\',\''+'累计趋势'+'\',true)'],)"
            >
              <!-- 头部数据开始 height: 100%;-->
              <div><p style="padding: 0px;margin: 0px;font-size: 12px;padding-left: 20px;">全司</p></div>
              <div class="flex-start sectionWrapper" style="width:40%;float: left;">
                <div style="width: 100%; height: 149px;">
                  <!-- {{DboardDat}} -->
                  <percentage-circle v-if="DboardDat.CMP_RATE" :percent="parseFloat((DboardDat.CMP_RATE * 100).toFixed(2))"/>
                </div>
              </div>
              <!-- 头部数据结束 -->    


              <!-- 右边的详细数据开始 -->
              <div style="width:60%;float: left;">
                <div>
                  <span style="font-weight: bold; font-size: 32px; text-align: left; line-height: 2;">
                    {{ formatZ(DboardDat.SALE_AMT) }}
                  </span>
                </div>

                <div style="padding-top: 25px;">
                  <div style="width:50%;font-size: 12px;float: left;">
                    <p> 目标：<span>{{ formatZ(DboardDat.SALES_TARGET) }}</span></p>
                  </div>

                  <div style="width:50%;font-size: 12px;float: left;">
                    <p>差额：<span>{{ formatZ(DboardDat.DIF_AMT) }}</span></p>
                  </div>

                  <div style="width:50%;font-size: 12px;float: left;">
                    <p>同比：<span :class="{'text-red': DboardDat.AGO_DIF_RATE > 0, 
                      'text-green': DboardDat.AGO_DIF_RATE < 0}"
                    >{{transPercent(DboardDat.AGO_DIF_RATE)}}</span></p>
                  </div>

                  <div style="width:50%;font-size: 12px;float: left;">
                    <p>同期：<span>{{ formatZ(DboardDat.AGO_SALE_AMT) }}</span></p>
                  </div>
                </div>

              </div>
              <!-- 右边的详细数据结束 -->
            </div>

            

            <div :class="(ChoiceVal.xsqd==true)?'change_cssY':'change_cssN'" style="width: 25%;float: left;padding-left: 2%;padding-top: 18px;border-right: 0px solid #DCDCDC;cursor: pointer;"
              @click="ChoiceCss('xsqd','_this.ChoiceVal',['_this.initecharts(\''+'EchLeft'+'\',\''+'时分趋势'+'\',true)','_this.initechartsR(\''+'EchRigth'+'\',\''+'累计趋势'+'\',true)'])"
            >
              <div>
                <div style="width:30%;float: left;">
                  <div class="lanren2_newn" style="width:67px;height:59px;"></div>
                </div>
                <div style="width:50%;float: left;">
                  <p style="margin-bottom: 5px;">线上渠道</p>
                  <!-- <p style="font-size: 22px;font-weight: bold;">{{ formatZ(DboardDatSub['线上渠道'].SALE_AMT) }}</p>  -->
                  <p style="font-size: 22px;font-weight: bold;">{{ (DboardDatSub['线上渠道'])?formatZ(DboardDatSub['线上渠道'].SALE_AMT):'--' }}</p>  
                </div>    
                <p style="clear: both;margin: 0px;padding-top: 8px;"></p>            
              </div>

              <div>
                <div style="width:30%;float: left;font-size: 12px;">
                  <p>目标：<span>{{(DboardDatSub['线上渠道'])?formatZ(DboardDatSub['线上渠道'].SALES_TARGET):'--'}}</span></p>
                  <p>同比：<span v-if="(DboardDatSub['线上渠道'])" :class="{'text-red': DboardDatSub['线上渠道'].YOY_RATE > 0,
                    'text-green': DboardDatSub['线上渠道'].YOY_RATE < 0}">
                    {{transPercent(DboardDatSub['线上渠道'].YOY_RATE)}}</span> <span v-else>--</span></p>              
                </div>

                <div style="width:50%;float: left;font-size: 12px;">  
                  <p>达成：<span v-if="DboardDatSub['线上渠道']" :class="{'text-red': DboardDatSub['线上渠道'].CMP_RATE > 1,
                    'text-green': DboardDatSub['线上渠道'].CMP_RATE < 1}">
                    {{transPercent(DboardDatSub['线上渠道'].CMP_RATE)}}</span> <span v-else>--</span></p>
                  <p>占总：<span>{{(DboardDatSub['线上渠道'])?transPercent(DboardDatSub['线上渠道'].TOT_RATE):'--'}}</span></p>               
                </div>
                <p style="clear: both;margin: 0;"></p>
              </div>
            </div>


            <div :class="(ChoiceVal.xxqd==true)?'change_cssY':'change_cssN'" style="width: 25%;float: left;padding-left: 2%;padding-top: 18px;border-right: 0px solid #DCDCDC;cursor: pointer;"
              @click="ChoiceCss('xxqd','_this.ChoiceVal',['_this.initecharts(\''+'EchLeft'+'\',\''+'时分趋势'+'\',true)','_this.initechartsR(\''+'EchRigth'+'\',\''+'累计趋势'+'\',true)'])"
            >
              <div>
                <div style="width:30%;float: left;">
                  <div class="lanren3_newn" style="width:57px;height: 59px;"></div>                  
                </div>
                <div style="width:50%;float: left;">
                  <p style="margin-bottom: 5px;">线下渠道</p>
                  <p style="font-size: 22px;font-weight: bold;">{{(DboardDatSub['线下渠道'])?formatZ(DboardDatSub['线下渠道'].SALE_AMT):'--'}}</p>
                </div>    
                <p style="clear: both;margin: 0px;padding-top: 8px;"></p>
              </div>


              <div>
                <div style="width:30%;float: left;font-size: 12px;">
                  <p>目标：<span>{{(DboardDatSub['线下渠道'])?formatZ(DboardDatSub['线下渠道'].SALES_TARGET):'--'}}</span></p>
                  <p>同比：<span v-if="(DboardDatSub['线下渠道'])" :class="{'text-red': DboardDatSub['线下渠道'].YOY_RATE > 0,
                    'text-green': DboardDatSub['线下渠道'].YOY_RATE < 0}">
                    {{transPercent(DboardDatSub['线下渠道'].YOY_RATE)}}</span> <span v-else>--</span></p>              
                </div>
                <div style="width:50%;float: left;font-size: 12px;">
                  <p>达成：<span v-if="DboardDatSub['线下渠道']" :class="{'text-red': DboardDatSub['线下渠道'].CMP_RATE > 1,
                    'text-green': DboardDatSub['线下渠道'].CMP_RATE < 1}">
                    {{transPercent(DboardDatSub['线下渠道'].CMP_RATE)}}</span> <span v-else>--</span></p>
                  <p>占总：<span>{{(DboardDatSub['线下渠道'])?transPercent(DboardDatSub['线下渠道'].TOT_RATE):'--'}}</span></p>               
                </div>
                <p style="clear: both;margin: 0;"></p>
              </div>

            </div>
            
            
            
            <div :class="(ChoiceVal.hwqd==true)?'change_cssY':'change_cssN'" style="width: 22%;padding-left: 2%;float: left;padding-top: 18px;cursor: pointer;"
              @click="ChoiceCss('hwqd','_this.ChoiceVal',['_this.initecharts(\''+'EchLeft'+'\',\''+'时分趋势'+'\',true)','_this.initechartsR(\''+'EchRigth'+'\',\''+'累计趋势'+'\',true)'])"
            >
              <div>
                <div style="width:30%;float: left;">
                  <div class="lanren4_newn" style="width:62px;height:59px;"></div>                 
                </div>
                <div style="width:50%;float: left;">
                  <p style="margin-bottom: 5px;">海外渠道</p>
                  <p style="font-size: 22px;font-weight: bold;">{{(DboardDatSub['海外渠道'])?formatZ(DboardDatSub['海外渠道'].SALE_AMT):'--'}}</p>
                </div>    
                <p style="clear: both;margin: 0px;padding-top: 8px;"></p>
              </div>

              <div>
                <div style="width:100%;float: left;font-size: 12px;">
                  <p>目标：<span>{{(DboardDatSub['海外渠道'])?formatZ(DboardDatSub['海外渠道'].SALES_TARGET):'--'}}</span></p>
                  <p>备注：<span>海外渠道并非每天都产生业绩； </span></p>             
                </div>
                <!-- <div style="width:50%;float: left;font-size: 12px;">
                  <p>达成：<span>61.4%</span></p>
                  <p>占总：<span>30.1%</span></p>               
                </div> -->
                <p style="clear: both;margin: 0;"></p>
              </div>

            </div>

            <div style="clear: both;"></div>
          </div>
          <!-- 实时业绩头部结束 -->


          <!-- 全司趋势图开始 -->
          <div style="border: 0px #000000 solid;margin-top: 10px;padding-left: 20px;padding-right: 20px;">
            <!-- <div class="title_switch" style="justify-content: space-between;">
              <p :class="(ChoiceVal.qs==true)?'active_css':'active_cssn'" style="cursor: pointer;" 
                @click="ChoiceCss('qs','_this.ChoiceVal',['_this.initecharts(\''+'EchLeft'+'\',\''+'时分趋势'+'\')','_this.initecharts(\''+'EchRigth'+'\',\''+'累计趋势'+'\')'],)">全司<span>空空</span></p> 
              <p :class="(ChoiceVal.xsqd==true)?'active_css':'active_cssn'" style="cursor: pointer;"
                @click="ChoiceCss('xsqd','_this.ChoiceVal',['_this.initecharts(\''+'EchLeft'+'\',\''+'时分趋势'+'\')','_this.initecharts(\''+'EchRigth'+'\',\''+'累计趋势'+'\')'])">线上渠道</p>
              <p :class="(ChoiceVal.xxqd==true)?'active_css':'active_cssn'" style="cursor: pointer;"
                @click="ChoiceCss('xxqd','_this.ChoiceVal',['_this.initecharts(\''+'EchLeft'+'\',\''+'时分趋势'+'\')','_this.initecharts(\''+'EchRigth'+'\',\''+'累计趋势'+'\')'])">线下渠道</p>
              <div style="clear: both;"></div>
            </div> -->

            <div class="cont_switch">

              <div class="time_title_user" style="float: right;">

                <div style="float: left;">
                  <span style="line-height: 32px;padding: 6.5px 10px;color: #A9A9A9;cursor: pointer;" 
                    @click="LREchart(['_this.ContrastTim=1','_this.initecharts(\''+'EchLeft'+'\',\''+'时分趋势'+'\')','_this.initechartsR(\''+'EchRigth'+'\',\''+'累计趋势'+'\')'])" 
                    :style="{'background':(ContrastTim==1)?'#F5F5F5':'#ffffff'}">同期对比</span>
                  <span style="line-height: 32px;padding: 6.5px 10px;color: #A9A9A9;cursor: pointer;"
                    @click="LREchart(['_this.ContrastTim=2','_this.initecharts(\''+'EchLeft'+'\',\''+'时分趋势'+'\')','_this.initechartsR(\''+'EchRigth'+'\',\''+'累计趋势'+'\')'])" 
                    :style="{'background':(ContrastTim==2)?'#F5F5F5':'#ffffff'}">对比日期</span>
                </div>
                <div :style="{'display': (ContrastTim==2)?'block':'none'}" class="text-xs mr10" style="float: left;padding-left: 10px;">
                  <div>
                    <a-date-picker @change="TimOnChange"  />
                  </div>
                </div>  
                  
              </div>
              <div style="clear: both;"></div>

              <div class="echarts_left" style="width: 50%;float: left;margin-top: 20px;border-right: 1px solid rgba(211, 211, 211,0.4);">
                <p style="margin: 0 auto;padding-left: 0px;">分时趋势图</p>
                <div  ref="EchLeft" style="width: 99%;height: 246px;padding-left: 0px;"></div>
              </div>

              <div class="echarts_rigth" style="width: 50%;float: left;margin-top: 20px;">
                <p style="margin: 0 auto;padding-left: 20px;">时段累计图</p>
                <div  ref="EchRigth" style="width: 99%;height: 246px;padding-left: 20px;"></div>
              </div>
            </div>
            <div style="clear: both;"></div>
          </div>
          <!-- 全司趋势图结束 -->


          <!-- 渠道细分表开始 -->
          <div class="mt10" style="padding-left: 20px;padding-right: 20px; margin-top: 25px;">
            <table class="table_css">
              <tbody>
                <tr>
                  <td>渠道细分</td>
                  <td v-for="(item, index) in DTableDate" :key="index">
                    {{item["CHANNEL"]}}
                  </td>
                  <!-- <td>{{ '合计' }}</td>
                  <td>{{ '线上平台' }}</td>
                  <td>{{ '线上外包' }}</td>
                  <td>{{ '线下直营' }}</td>
                  <td>{{ '线下经销' }}</td>
                  <td>{{ '线下家装' }}</td>
                  <td>{{ '线下定制' }}</td>
                  <td>{{ '线下拎包' }}</td>
                  <td>{{ '海外B2B' }}</td>
                  <td>{{ '海外B2C' }}</td> -->  
                </tr>

                <tr>
                  <td>目标</td>
                  <td v-for="(item, index) in DTableDate" :key="index">
                    {{formatZ(item["SALES_TARGET"])}}
                  </td>
                </tr>

                <tr>
                  <td>实绩</td>
                  <td v-for="(item, index) in DTableDate" :key="index">
                    {{formatZ(item["SALE_AMT"])}}
                  </td>
                </tr>

                <tr>
                  <td>达成</td>
                  <td v-for="(item, index) in DTableDate" :key="index"
                    :class="{'text-red': item.CMP_RATE > 1,
                      'text-green': item.CMP_RATE < 1}"
                  >
                    {{transPercent(item["CMP_RATE"])}}
                  </td>                  
                </tr>

                <tr>
                  <td>占总</td>
                  <td v-for="(item, index) in DTableDate" :key="index">
                    {{transPercent(item["TOT_RATE"])}}
                  </td>   
                </tr>

                <tr>
                  <td>同比</td>
                  <td v-for="(item, index) in DTableDate" :key="index"
                    :class="{'text-red': item.YOY_RATE > 0,
                      'text-green': item.YOY_RATE < 0}"
                  >
                    {{transPercent(item["YOY_RATE"])}}
                  </td>  
                </tr>

              </tbody>
            </table>
          </div>
          <!-- 渠道细分表结束 -->





          <!-- <div class="flex flex-start" style="padding: 20px">
            <div style="flex: 1 1 auto; text-align: right">
              <div style="display: inline-block; line-height: 32px; border-radius: 2px; font-size: 12px;
              border: 1px solid rgba(0, 0, 0, .15); padding: 0 8px; cursor: pointer"
                  @click="handleContextMenuClick('downloadExcel')">导出Excel
              </div>
            </div>
          </div> -->



        </div>


        <!-- 渠道细分表开始 -->


        <div style="background-color: #fff;margin-top: 20px;margin-bottom: 30px; border-radius: 0px; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);">
          <div class="mingxititlecss">
            <p 
              @click="on_off_fun()"
                style="cursor: pointer;text-align: inherit;padding: 20px;padding-bottom: 10px;padding-top: 10px; color:rgb(35, 176, 168);margin: 0px;">
              <!-- {{(ViewSub==true)?'收起':'查看细分》》'}} -->
              <a-icon type="caret-right" :class="(ViewSub==true)?'icon_cssY':'icon_cssN'" />
              <span>明细</span>
            </p>
          </div>     

          <div :style="{'display': (ViewSub==true)?'block':'none'}" 
            style=" min-height: calc(100vh - 250px);">
            <!-- <div style="color:#343437;">
              <p style="margin: 0;padding-left: 20px;padding-right: 20px;padding-top: 0px;">渠道细分({{ShopNameVal}})</p>
            </div> -->

                    
            <!-- <div class="title_switch" style="padding-left: 20px;padding-right: 20px;padding-top: 20px;">
              <p :class="(ChoiceVal2.qdxf==true)?'active_css':'active_cssn'" @click="ChoiceCss('qdxf','_this.ChoiceVal2')">渠道细分</p> 
              <p :class="(ChoiceVal2.xsdpqs==true)?'active_css':'active_cssn'" @click="ChoiceCss('xsdpqs','_this.ChoiceVal2')">线上店铺趋势</p>
              <p :class="(ChoiceVal2.xsfzr==true)?'active_css':'active_cssn'" @click="ChoiceCss('xsfzr','_this.ChoiceVal2')">线上负责人&分组趋势</p>
              <p :class="(ChoiceVal2.xamdqs==true)?'active_css':'active_cssn'" @click="ChoiceCss('xamdqs','_this.ChoiceVal2')">线下门店趋势</p>
              <div style="clear: both;"></div>
            </div> -->


            <!-- 底部表格开始 -->
            <div class="ShopTable">
              <!-- 线上店铺开始 -->
              <div style="width:30%; float: left;">
                <div style="color:#343437;">
                  <p style="margin: 0;padding-left: 20px;padding-right: 20px;padding-top: 15px;">线上店铺({{(ShopUserType=='线上店铺')?ShopNameVal:'--'}})</p>
                </div>

                <div class="table_hcss" style="margin-left: 10px;margin-top: 11px;">
                  <table class="table_css ">
                    <tbody>
                      <tr>
                        <td style="width: 35%;">店铺</td>
                        <td >目标</td>
                        <td >实绩</td>
                        <td >达成</td>
                      </tr>

                      <tr v-for="(item, index) in DTableShopSub.shopsub" :key="index">
                        <td style="text-decoration: underline;cursor: pointer;" :style="{color:(ShopIndex==index)?'#23B0A8':'#808492'}"
                          @click="LREchart(['_this.ShopEchartsL(\''+item.CHANNEL+'\',\''+'线上店铺'+'\')',
                          '_this.ShopEchartsR(\''+item.CHANNEL+'\',\''+'线上店铺'+'\')','_this.ShopClearL=true',
                          '_this.ShopClearR=true','_this.ShopNameVal=\''+item.CHANNEL+'\'','_this.ShopIndex='+index,
                          '_this.ShopSecond=null','_this.ShopThird=null'])">{{item.CHANNEL}}</td>
                        <td >{{formatZ(item.SALES_TARGET)}}</td>
                        <td >{{formatZ(item.SALE_AMT)}}</td>
                        <td >{{transPercent(item.CMP_RATE)}}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <y-pagination :pagination="DTableP.pagination"></y-pagination>

              </div>
              <!-- 线上店铺结束 -->

              <!-- 线上负责人&分组开始 -->
              <div style="width:30%; float: left;margin-left: 5%;margin-right: 5%;">
                <div style="color:#343437;">
                  <p style="margin: 0;padding-left: 10px;padding-right: 20px;padding-top: 15px;float: left;">线上负责人&分组({{(ShopUserType=='线上负责人')?ShopNameVal:'--'}})</p>

                  <div class="zrr_css">
                    <a-radio-group v-model="FzrQuery.viewType">
                      <a-radio value="线上负责人">负责人</a-radio>
                      <a-radio value="线上分组" class="zrr_end">分组</a-radio>
                    </a-radio-group>                  
                  </div>
                  <div style="clear: both;"></div>
                </div>
                

                <div class="table_hcss" style="margin-left: 0px;margin-top: 11px;">
                  <table class="table_css">
                    <tbody>
                      <tr>
                        <td >负责人</td>
                        <td >目标</td>
                        <td >实绩</td>
                        <td >达成</td>
                      </tr>

                      <tr v-for="(item, index) in DTableShopSub.onlinegroupsub" :key="index">
                        <td style="text-decoration: underline;cursor: pointer;" :style="{color:(ShopSecond==index)?'#23B0A8':'#808492'}"
                          @click="LREchart(['_this.ShopEchartsL(\''+item.CHANNEL+'\',\''+FzrQuery.viewType+'\')',
                          '_this.ShopEchartsR(\''+item.CHANNEL+'\',\''+FzrQuery.viewType+'\')','_this.ShopClearL=true',
                          '_this.ShopClearR=true','_this.ShopNameVal=\''+item.CHANNEL+'\'','_this.ShopIndex=null',
                          '_this.ShopSecond='+index,'_this.ShopThird=null'])">{{item.CHANNEL}}</td>
                        <td >{{formatZ(item.SALES_TARGET)}}</td>
                        <td >{{formatZ(item.SALE_AMT)}}</td>
                        <td >{{transPercent(item.CMP_RATE)}}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <y-pagination :pagination="DTableOnline.pagination"></y-pagination>

              </div>
              <!-- 线上负责人&分组结束 -->        

              <!-- 线下区域开始 -->
              <div style="width:30%; float: left;">
                <div style="color:#343437;">
                  <p style="margin: 0;padding-left: 10px;padding-right: 20px;padding-top: 15px;float: left;">线下区域({{(ShopUserType=='线下区域')?ShopNameVal:'--'}})</p>

                  <div class="zrr_css" style="margin-right: 10px;">
                    <a-radio-group v-model="QuQuery.viewType">
                      <a-radio value="线下区域">区域</a-radio>
                      <a-radio value="线下大区">大区</a-radio>
                      <a-radio value="线下片区" class="zrr_end">片区</a-radio>
                    </a-radio-group>                  
                  </div>
                  <div style="clear: both;"></div>
                </div>

                <div class="table_hcss" style="margin-right: 10px;margin-top: 11px;">
                  <table class="table_css">
                    <tbody>
                      <tr>
                        <td >区域</td>
                        <td >目标</td>
                        <td >实绩</td>
                        <td >达成</td>
                      </tr>

                      <tr v-for="(item, index) in DTableShopSub.regionsub" :key="index">
                        <td style="text-decoration: underline;cursor: pointer;" :style="{color:(ShopThird==index)?'#23B0A8':'#808492'}"
                          @click="LREchart(['_this.ShopEchartsL(\''+item.CHANNEL+'\',\''+QuQuery.viewType+'\')',
                          '_this.ShopEchartsR(\''+item.CHANNEL+'\',\''+QuQuery.viewType+'\')','_this.ShopClearL=true',
                          '_this.ShopClearR=true','_this.ShopNameVal=\''+item.CHANNEL+'\'','_this.ShopIndex=null',
                          '_this.ShopSecond=null','_this.ShopThird='+index])">{{item.CHANNEL}}</td>
                        <td >{{formatZ(item.SALES_TARGET)}}</td>
                        <td >{{formatZ(item.SALE_AMT)}}</td>
                        <td >{{transPercent(item.CMP_RATE)}}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <y-pagination :pagination="DTableReg.pagination"></y-pagination>

              </div>
              <!-- 线下区域结束 -->

              <div style="clear: both;"></div>
            </div>
            <!-- 底部表格结束 -->

            <!-- 底部表格趋势图开始 -->
            <div class="shopechartscss" style="margin-top: 10px; padding-left: 20px; padding-right: 20px;">
              <div class="ShopEcharTitle">
                <div style="color:#343437;">
                  <p style="margin: 0;padding-left: 0px;padding-right: 20px;padding-top: 15px;">趋势分析</p>

                  <div class="time_title_user" style="float: right;">

                    <div style="float: left;">
                      <span style="line-height: 32px;padding: 6.5px 10px;color: #A9A9A9;cursor: pointer;" 
                        @click="LREchart(['_this.ContrastTim2=1','_this.ShopEchartsL(\''+'true'+'\',\''+'true'+'\')','_this.ShopEchartsR(\''+'true'+'\',\''+'true'+'\')'])" 
                        :style="{'background':(ContrastTim2==1)?'#F5F5F5':'#ffffff'}">同期对比</span>
                      <span style="line-height: 32px;padding: 6.5px 10px;color: #A9A9A9;cursor: pointer;"
                        @click="LREchart(['_this.ContrastTim2=2','_this.ShopEchartsL(\''+'true'+'\',\''+'true'+'\')','_this.ShopEchartsR(\''+'true'+'\',\''+'true'+'\')'])" 
                        :style="{'background':(ContrastTim2==2)?'#F5F5F5':'#ffffff'}">对比日期</span>
                    </div>  


                    <div :style="{'display': (ContrastTim2==2)?'block':'none'}" class="text-xs mr10" style="float: left;padding-left: 10px;">
                      <div>
                        <a-date-picker @change="TimOnChangeSub"  />
                      </div>
                    </div>    
                  </div>
                  <div style="clear: both;"></div>


                </div>              
              </div>


              <div class="ShopEchartRig" style="width: 50%;float: left;margin-top: 20px;border-right: 1px solid #D3D3D3;">
                <p style="margin: 0 auto;padding-left: 0px;">分时趋势图</p>
                <div  ref="ShopEchLeft" :style="{'width':(Usertable_widthNew/2)*0.99+'px'}" style="height: 246px;padding-left: 0px;"></div>
              </div>

              <div class="ShopEchartLet" style="width: 50%;float: left;margin-top: 20px;">
                  <p style="margin: 0 auto;padding-left: 20px;">时段累计图</p>
                  <div  ref="ShopEchRigth" :style="{'width':(Usertable_widthNew/2)*0.99+'px'}" style="height: 246px;padding-left: 20px;"></div>
              </div>

              <div style="clear: both;"></div>
            </div>
            <!-- 底部表格趋势图结束 -->
            <div style="width: 100%;height: 20px;"></div>



            <!-- <div>
              <div @mouseenter="excel.show=true" @mouseleave="excel_show_fun('excel')" style="padding: 0 20px">
                <y-table :options="table" @change="handleChange" rowKey="M_CODE"
                        :loading="table.loading"></y-table>
              </div>
            </div> -->

          </div>          
        </div> 



        <!-- 渠道细分表结束 -->





      </div>
    </div>
  </div>
</template>

<script>

  var table_width=(window.innerWidth-8-(window.innerWidth*0.02*2)-40)/16;
  var table_widthNew=window.innerWidth-(window.innerWidth*0.02*2)-40;

// import VirtualSelect from '@/views/BIView/components/VSelect/VSelect'
// import YInput from '@/views/BIView/components/YInput/YInput'
// import YTable from '@/views/BIView/components/YTable/YTable'

// 新加的分页开始2021-08-13
import YPagination from '@/views/BIView/components/YPagination/YPagination'
// import EzMonthSelect from '@/views/BIView/OperateDashboard/components/EzMonthSelect'
// import SimpleSelect from '@/views/BIView/ProductSupply/components/SimpleSelect/SimpleSelect'    ,SimpleSelect

// import moment from 'moment'
// import 'moment/locale/zh-cn'
// moment.locale('zh-CN')
// import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';
// 新加的分页结束2021-08-13


// import TopToolbar from '@/views/BIView/components/TopToolbar/TopToolbar'
import YLoading from '@/views/BIView/components/YLoading/YLoading'
import { downloadBlob, numGroupSep } from '@/utils/helper'
import axios from 'axios'


import PercentageCircle from '@/views/BIView/OperateDashboard/Tabs/LivePerf/PercentageCircle/PercentageCircle'
// echarts的引入！！！
import echarts from "echarts/lib/echarts";
import "echarts/lib/chart/line";
import "echarts/lib/chart/bar";
import "echarts/lib/component/legend";
import "echarts/lib/component/tooltip";

import { formatNumber } from '@/utils/helper';
const formatZ = (num) => {return num && typeof num === 'number' ? formatNumber(num, 1, 0) : '--'}
const transPercent = (num) => {return (typeof num !== 'number') || num === 0 || isNaN(num) || !isFinite(num) ? '--' : (num * 100).toFixed(2) + '%'}

export default {

  name: 'ActivityLeadTime',

  components: { YLoading,
  
  // TopToolbar,
  // EzMonthSelect,

  // YInput,
  // VirtualSelect,
  // YTable,
  PercentageCircle,
  YPagination
  },
  data() {
    return{
      // locale,
      ChoiceValclear:false,
      ChoiceVal:{
        qs:true,
        xsqd:false,
        xxqd:false,
        hwqd:false,
      },
      ChoiceVal2:{
        qdxf:true,
        xsdpqs:false,
        xsfzr:false,
        xamdqs:false,
      },
      excel:{
        show:false,
        excel_show:false,
      },
      sorting: {
        field: 'rownum',
        order: 'asc'
      },
      loading: false,
      allOptions: [],
      dateOptions: [],
      teamSupplyOptions: [],
      mainSerialOptions: [],
      mNameOptions: [],
      query: {
        loadTime: '',
        M_CODE: '',
        TEAM_SUPPLY: [],
        MAIN_SERIAL: [],
        M_NAME: []
      },

      ShopClearL:false,
      ShopClearR:false,
      ShopNameVal:false,

      ShopUserName:false,
      ShopUserType:false,

      ShopIndex:null,
      ShopSecond:null,
      ShopThird:null,
      ViewSub:false,
      Usertable_widthNew:0,
      queryTime: {
        yearMonth: new Date(),
        option0: '1',
        option1: '1',
        option2: '', // 全渠道评价走势 渠道
        option3: '好评', // 全渠道评价走势 选项
      },
      UserTime:null,
      UserTimeSub:null,
      UserTimeAll:null,
      UserTimeSubAll:null,

      ContrastTim:1,
      ContrastTim2:1,
      promiseToday:null,
      promiseTodaySub:[],


      // 2021-08-14最新加上全司视觉切换
      QsQuery:{
        viewType:'全司视角'
      },
      FzrQuery:{
        viewType:'线上负责人'
      },
      QuQuery:{
        viewType:'线下区域'
      },

      // 仪表盘数据
      DboardDat:{},
      DimensionDat:{},
      DimensionDatSub:{},
      DboardDatSub:{},
      DTableDate:{},  //渠道细分汇总表
      DTableShopSub:{
        shopsub:{},
        onlinegroupsub:{},
        regionsub:{}
      },  //渠道细分店铺以及区域的这些表

      DTableP:{
        transformCellText: ({text}) => {
          if(typeof text === 'number') {
            return numGroupSep(Math.round(text * 1000) / 1000)
          }
          return text
        },
        pagination: {
          total: 0,
          page: 1,
          pageSize: 19
        },
      },
      DTableOnline:{
        transformCellText: ({text}) => {
          if(typeof text === 'number') {
            return numGroupSep(Math.round(text * 1000) / 1000)
          }
          return text
        },
        pagination: {
          total: 0,
          page: 1,
          pageSize: 19
        },
      },

      DTableReg:{
        transformCellText: ({text}) => {
          if(typeof text === 'number') {
            return numGroupSep(Math.round(text * 1000) / 1000)
          }
          return text
        },
        pagination: {
          total: 0,
          page: 1,
          pageSize: 19
        },
      },




      table: {
        transformCellText: ({text}) => {
          if(typeof text === 'number') {
            return numGroupSep(Math.round(text * 1000) / 1000)
          }
          return text
        },
        loading: false,
        pagination: {
          total: 0,
          page: 1,
          pageSize: 18
        },
        data: [],
        columns: [
           {title: '数据加载时间', dataIndex: 'LOAD_TIME', width: table_width, ellipsis: true,},
           {title: '物料编码', dataIndex: 'M_CODE', fixed: true, width: table_width, ellipsis: true},
           {title: '研发工厂', dataIndex: 'DEV_SUPPLIER', fixed: true, width: table_width, ellipsis: true},

        //    {title: '供应商', dataIndex: 'SUPPLIER', fixed: true, width: 100, ellipsis: true},
           {title: '系列', dataIndex: 'M_SERIES', fixed: true,  width: table_width, ellipsis: true},
           {title: '项目组', dataIndex: 'TEAM_SUPPLY', fixed: true,  width: table_width, ellipsis: true},
           {title: '系列主型号', dataIndex: 'MAIN_SERIAL', fixed: true,  width: table_width, ellipsis: true},
           {title: '计划专员', dataIndex: 'PLAN_STAFF', fixed: true,  width: table_width, ellipsis: true},
           {title: '物料名称', dataIndex: 'M_NAME', fixed: true,  width: table_width, ellipsis: true},
           {title: '物料描述', dataIndex: 'M_DESC', fixed: true,  width: table_width, ellipsis: true},
           {title: '是否停产', dataIndex: 'IS_STOP',fixed: true,  width: table_width, ellipsis: true},

           {title: '实时销量', dataIndex: 'RLTM_ORDERS_QTY', width: table_width, ellipsis: true,align: 'right',sorter: true},
           {title: '客审未货审订单', dataIndex: 'UNGAUD_ORDERS_QTY', width: table_width, ellipsis: true,align: 'right',},


           {title: '库存数', dataIndex: 'INV_QTY', width: table_width, ellipsis: true,align: 'right',sorter: true},
           {title: '锁库数', dataIndex: 'LOCK_QTY', width: table_width, ellipsis: true,align: 'right',sorter: true},
           {title: '其它锁库数', dataIndex: 'NO_LOCK_QTY', width: table_width, ellipsis: true,align: 'right',sorter: true},
           {title: '库存可用数', dataIndex: 'INV_USE_QTY', width: table_width, ellipsis: true,align: 'right',sorter: true},

           {title: '供应商库存', dataIndex: 'SPL_STK_QTY', width: table_width, ellipsis: true,align: 'right',sorter: true},
           {title: '仓库现货实数', dataIndex: 'STK_SPOTS_QTY', width: table_width, ellipsis: true,align: 'right',sorter: true},
           {title: '两库存占订单比例', dataIndex: 'STK2_ORDERS2_RATIO', width: table_width, ellipsis: true,align: 'right',sorter: true},
           {title: '库存占订单比例', dataIndex: 'STK1_ORDERS2_RATIO', width: table_width, ellipsis: true,align: 'right',sorter: true},

           {title: '可销售数5', dataIndex: 'MARKETABLE_QTY5', width: table_width, ellipsis: true,align: 'right',sorter: true},
           {title: '可销售数10', dataIndex: 'MARKETABLE_QTY10', width: table_width, ellipsis: true,align: 'right',sorter: true},
           {title: '可销售数15', dataIndex: 'MARKETABLE_QTY15', width: table_width, ellipsis: true,align: 'right',sorter: true},
           {title: '可销售数20', dataIndex: 'MARKETABLE_QTY20', width: table_width, ellipsis: true,align: 'right',sorter: true},
           {title: '可销售数25', dataIndex: 'MARKETABLE_QTY25', width: table_width, ellipsis: true,align: 'right',sorter: true},
           {title: '可销售数30', dataIndex: 'MARKETABLE_QTY30', width: table_width, ellipsis: true,align: 'right',sorter: true},
           {title: '可销售数35', dataIndex: 'MARKETABLE_QTY35', width: table_width, ellipsis: true,align: 'right',sorter: true},
           {title: '可销售数40', dataIndex: 'MARKETABLE_QTY40', width: table_width, ellipsis: true,align: 'right',sorter: true},
           {title: '可销售数45', dataIndex: 'MARKETABLE_QTY45', width: table_width, ellipsis: true,align: 'right',sorter: true},
           {title: '可销售数50', dataIndex: 'MARKETABLE_QTY50', width: table_width, ellipsis: true,align: 'right',sorter: true},
           {title: '可销售数55', dataIndex: 'MARKETABLE_QTY55', width: table_width, ellipsis: true,align: 'right',sorter: true},
           {title: '可销售数60', dataIndex: 'MARKETABLE_QTY60', width: table_width, ellipsis: true,align: 'right',sorter: true},
           {title: '可销售数70', dataIndex: 'MARKETABLE_QTY70', width: table_width, ellipsis: true,align: 'right',sorter: true},
           {title: '可销售数80', dataIndex: 'MARKETABLE_QTY80', width: table_width, ellipsis: true,align: 'right',sorter: true},
           {title: '可销售数90', dataIndex: 'MARKETABLE_QTY90', width: table_width, ellipsis: true,align: 'right',sorter: true},
           {title: '可销售数100', dataIndex: 'MARKETABLE_QTY100', width: table_width, ellipsis: true,align: 'right',sorter: true},
           {title: '可销售数110', dataIndex: 'MARKETABLE_QTY110', width: table_width, ellipsis: true,align: 'right',sorter: true},
           {title: '可销售数120', dataIndex: 'MARKETABLE_QTY120', width: table_width, ellipsis: true,align: 'right',sorter: true},
           {title: '可销售数130', dataIndex: 'MARKETABLE_QTY130', width: table_width, ellipsis: true,align: 'right',sorter: true},
           {title: '可销售数140', dataIndex: 'MARKETABLE_QTY140', width: table_width, ellipsis: true,align: 'right',sorter: true},
           {title: '可销售数150', dataIndex: 'MARKETABLE_QTY150', width: table_width, ellipsis: true,align: 'right',sorter: true},
           {title: '可销售数160', dataIndex: 'MARKETABLE_QTY160', width: table_width, ellipsis: true,align: 'right',sorter: true},
           {title: '可销售数170', dataIndex: 'MARKETABLE_QTY170', width: table_width, ellipsis: true,align: 'right',sorter: true},
           {title: '可销售数180', dataIndex: 'MARKETABLE_QTY180', width: table_width, ellipsis: true,align: 'right',sorter: true},
           {title: '可销售数190', dataIndex: 'MARKETABLE_QTY190', width: table_width, ellipsis: true,align: 'right',sorter: true},
           {title: '可销售数200', dataIndex: 'MARKETABLE_QTY200', width: table_width, ellipsis: true,align: 'right',sorter: true},
           {title: '可销售数210', dataIndex: 'MARKETABLE_QTY210', width: table_width, ellipsis: true,align: 'right',sorter: true},
           {title: '可销售数220', dataIndex: 'MARKETABLE_QTY220', width: table_width, ellipsis: true,align: 'right',sorter: true},
           {title: '月均销量', dataIndex: 'AVG_SALES_QTY', width: table_width, ellipsis: true,align: 'right',sorter: true},
           {title: '安全库存状态', dataIndex: 'SAFETY_INV_STATUS', width: table_width, ellipsis: true,},
           {title: '常规判断货期', dataIndex: 'RTNE_JDG_DAYS', width: table_width, ellipsis: true,align: 'right',sorter: true},
           {title: '预售判断货期', dataIndex: 'PRESALE_JDG_DAYS', width: table_width, ellipsis: true,align: 'right',sorter: true},
           {title: '预售店铺', dataIndex: 'IS_PRESALE', width: table_width, ellipsis: true,},
           {title: '备注', dataIndex: 'REMARKS', width: table_width, ellipsis: true,},
           {title: 'B店货期', dataIndex: 'SHOP_B', width: table_width, ellipsis: true,align: 'right',sorter: true},
           {title: 'C店货期', dataIndex: 'SHOP_C', width: table_width, ellipsis: true,align: 'right',sorter: true},
           {title: 'D店货期', dataIndex: 'SHOP_D', width: table_width, ellipsis: true,align: 'right',sorter: true},
           {title: 'K店货期', dataIndex: 'SHOP_K', width: table_width, ellipsis: true,align: 'right',sorter: true},
           {title: '累计未合格数(在途)', dataIndex: 'UNINSP_QTY', width: table_width, ellipsis: true,align: 'right',sorter: true},
           {title: '剩余可销售数', dataIndex: 'REM_MARKA_QTY', width: table_width, ellipsis: true,align: 'right',sorter: true},
           {title: '是否控制库存', dataIndex: 'IS_CTRL_STK', width: table_width, ellipsis: true,},
           {title: '控制原因', dataIndex: 'CTRL_REASON', width: table_width, ellipsis: true,},

        ]

      }

    }
  },

  computed: {
    queryCombine() {
      // 目的是监测这个三个筛选值的变化然后再运行函数！
      return this.query.MAIN_SERIAL.toString() + this.query.TEAM_SUPPLY.toString() + this.query.M_NAME.toString()
    }
  },

  watch:{
    'QsQuery.viewType':{
      handler () {
        console.log("==========全司视觉有变化！！！======");
        console.log(this.QsQuery.viewType);
        this.getDataDboard();
        this.getDataDboardSub();
        this.initecharts("EchLeft",'时分趋势');
        this.initechartsR("EchRigth",'累计趋势');
        this.getTableSub();


        this.getTableShopSub('线上店铺','shopsub','DTableP');
        this.getTableShopSub(this.FzrQuery.viewType,'onlinegroupsub','DTableOnline');
        this.getTableShopSub(this.QuQuery.viewType,'regionsub','DTableReg');
      }
    },
    'FzrQuery.viewType':{
      handler () {
        console.log("==========负责人视觉有变化！！！======");
        console.log(this.FzrQuery.viewType);
        // this.getTableShopSub();
        this.getTableShopSub(this.FzrQuery.viewType,'onlinegroupsub','DTableOnline');
        this.LREchart(['_this.ShopEchartsL(\''+'JD-林氏木业家具旗舰店'+'\',\''+'线上店铺'+'\')',
          '_this.ShopEchartsR(\''+'JD-林氏木业家具旗舰店'+'\',\''+'线上店铺'+'\')','_this.ShopNameVal=\''+'JD-林氏木业家具旗舰店'+'\'',
          '_this.ShopIndex=null','_this.ShopSecond=null','_this.ShopThird=null'        
        ]);
      }
    },
    'QuQuery.viewType':{
      handler () {
        console.log("==========区域视觉有变化！！！======");
        console.log(this.QuQuery.viewType);
        // this.getTableShopSub();
        this.getTableShopSub(this.QuQuery.viewType,'regionsub','DTableReg');
        this.LREchart(['_this.ShopEchartsL(\''+'JD-林氏木业家具旗舰店'+'\',\''+'线上店铺'+'\')',
          '_this.ShopEchartsR(\''+'JD-林氏木业家具旗舰店'+'\',\''+'线上店铺'+'\')','_this.ShopNameVal=\''+'JD-林氏木业家具旗舰店'+'\'',
          '_this.ShopIndex=null','_this.ShopSecond=null','_this.ShopThird=null'        
        ]);
      }
    },

    
    'DTableP.pagination.page'(){
      // this.getTableShopSub();
      this.getTableShopSub('线上店铺','shopsub','DTableP');
        this.LREchart(['_this.ShopEchartsL(\''+'JD-林氏木业家具旗舰店'+'\',\''+'线上店铺'+'\')',
          '_this.ShopEchartsR(\''+'JD-林氏木业家具旗舰店'+'\',\''+'线上店铺'+'\')','_this.ShopNameVal=\''+'JD-林氏木业家具旗舰店'+'\'',
          '_this.ShopIndex=null','_this.ShopSecond=null','_this.ShopThird=null'        
        ]);
    },


    'DTableOnline.pagination.page'(){
      this.getTableShopSub(this.FzrQuery.viewType,'onlinegroupsub','DTableOnline');
        this.LREchart(['_this.ShopEchartsL(\''+'JD-林氏木业家具旗舰店'+'\',\''+'线上店铺'+'\')',
          '_this.ShopEchartsR(\''+'JD-林氏木业家具旗舰店'+'\',\''+'线上店铺'+'\')','_this.ShopNameVal=\''+'JD-林氏木业家具旗舰店'+'\'',
          '_this.ShopIndex=null','_this.ShopSecond=null','_this.ShopThird=null'        
        ]);
    },

    'DTableReg.pagination.page'(){
      this.getTableShopSub(this.QuQuery.viewType,'regionsub','DTableReg');
        this.LREchart(['_this.ShopEchartsL(\''+'JD-林氏木业家具旗舰店'+'\',\''+'线上店铺'+'\')',
          '_this.ShopEchartsR(\''+'JD-林氏木业家具旗舰店'+'\',\''+'线上店铺'+'\')','_this.ShopNameVal=\''+'JD-林氏木业家具旗舰店'+'\'',
          '_this.ShopIndex=null','_this.ShopSecond=null','_this.ShopThird=null'        
        ]);
    },



    'table.pagination.page' () {
      this.getData2()
    },
    queryCombine() {
      setTimeout(() => {
        this.getData2(true)
      }, 50)
    },

    'query.loadTime' () {
      this.getData2(true)
    },

    'query.TEAM_SUPPLY' (val) {
      const filtered = this.allOptions.filter(_ => {
        return val && val.length ? val.indexOf(_.TEAM_SUPPLY) > -1 : true
      })
      this.mainSerialOptions = Object.freeze(Array.from(new Set(filtered.map(_ => _.MAIN_SERIAL))))
      this.mNameOptions = Object.freeze(Array.from(new Set(filtered.map(_ => _.M_NAME))))
    },


    'query.MAIN_SERIAL' (val, oldVal) {
      if(JSON.stringify(val) === JSON.stringify(oldVal)) {
        return
      }
      const filtered = this.allOptions.filter(_ => {
        return val && val.length ? val.indexOf(_.MAIN_SERIAL) > -1 : true
      })
      this.mNameOptions = Object.freeze(Array.from(new Set(filtered.map(_ => _.M_NAME))))
    }

  },

  async created () {

    // 做T+1处理开始
    let _time_now=new Date();
    // _time_now=_time_now.getTime()-(24*60*60*1000); T+1
    _time_now=_time_now.getTime();
    _time_now=new Date(_time_now);
    // 做T+1处理结束
    let now_month_user=_time_now.getFullYear() +"-"+
      (_time_now.getMonth() + 1 >= 1 && _time_now.getMonth() + 1 <= 9? "0" + (_time_now.getMonth() + 1): _time_now.getMonth() + 1)+'-'+
      ((_time_now.getDate()<= 9)?'0'+_time_now.getDate():_time_now.getDate());
    let on_time=(this.$route.query.dateString||now_month_user);

    this.UserTime=on_time.split('-');
    this.UserTime=this.UserTime[0]+this.UserTime[1]+this.UserTime[2];
    this.UserTimeSub=this.UserTime;
    this.UserTimeAll=this.UserTime;
    this.UserTimeSubAll=this.UserTimeSub;

    // await this.getData1()  //async await一起用可以使异步执行的方法运行效果和同步一样
    // this.getData2()
    // this.getQueryOptions()
    this.Usertable_widthNew=table_widthNew;



    // 时分趋势开始
    // if(this.ContrastTim==2){ }
      this.promiseToday=this.$fetchSql('real_time', 'read_time_hours',{TDATE:this.UserTimeAll}).then(({ data }) => {
        return { data }
      });
    // 时分趋势结束


    // 仪表盘的数据
    await this.getDataDboard();
    this.getDataDboardSub();
    this.getTableSub();


    this.initecharts("EchLeft",'时分趋势');
    this.initechartsR("EchRigth",'累计趋势');
    // this.test_echarts()

    // this.getTableShopSub();  userpage=DTableP
    this.getTableShopSub('线上店铺','shopsub','DTableP');
    this.getTableShopSub(this.FzrQuery.viewType,'onlinegroupsub','DTableOnline');
    this.getTableShopSub(this.QuQuery.viewType,'regionsub','DTableReg');

    // 底部echarts开始
    // this.ShopEchartsR();
    // this.ShopEchartsL();
    
    this.LREchart(['_this.ShopEchartsL(\''+'JD-林氏木业家具旗舰店'+'\',\''+'线上店铺'+'\')',
      '_this.ShopEchartsR(\''+'JD-林氏木业家具旗舰店'+'\',\''+'线上店铺'+'\')','_this.ShopNameVal=\''+'JD-林氏木业家具旗舰店'+'\'']);
    // 底部echarts结束

    this.datav_setTimeout(this);

  },

  methods:{
    transPercent,
    formatZ,
    test_echarts(){
      this.chartIns = echarts.init(this.$refs["chart"]);
        this.chartIns.setOption({
          xAxis: {
              type: 'category',
              boundaryGap: false,
              data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          },
          yAxis: {
              type: 'value'
          },
          series: [{
              data: [820, 932, 901, 934, 1290, 1330, 1320],
              type: 'line',
              areaStyle: {}
          }]
        });
    },


    datav_setTimeout(set_val){

      setTimeout(()=>{
        // 时分趋势开始
        set_val.promiseToday=set_val.$fetchSql('real_time', 'read_time_hours',{TDATE:set_val.UserTimeAll}).then(({ data }) => {
          return { data }
        });
        // 时分趋势结束
        console.log("===刷新了数据！！！！===");

        // 仪表盘的数据
        set_val.getDataDboard();
        set_val.getDataDboardSub();
        set_val.getTableSub();
        set_val.initecharts("EchLeft",'时分趋势');
        set_val.initechartsR("EchRigth",'累计趋势');
        set_val.getTableShopSub('线上店铺','shopsub','DTableP');
        set_val.getTableShopSub(set_val.FzrQuery.viewType,'onlinegroupsub','DTableOnline');
        set_val.getTableShopSub(set_val.QuQuery.viewType,'regionsub','DTableReg');

        // set_val.LREchart(['_this.ShopEchartsL(\''+'JD-林氏木业家具旗舰店'+'\',\''+'线上店铺'+'\')',
        //   '_this.ShopEchartsR(\''+'JD-林氏木业家具旗舰店'+'\',\''+'线上店铺'+'\')','_this.ShopNameVal=\''+'JD-林氏木业家具旗舰店'+'\'']);
        // 底部echarts结束

        set_val.datav_setTimeout(set_val);
      },10000);
    },

    on_off_fun(){
      if(this.ViewSub){
        this.ViewSub=false;
      }else{
        this.ViewSub=true;
      }
    },

    TimOnChange(date, dateString) {
      console.log(date);
      dateString=dateString.split('-');
      this.UserTime=dateString[0]+dateString[1]+dateString[2];
      this.initecharts("EchLeft",'时分趋势');
      this.initechartsR("EchRigth",'累计趋势');
    },
    TimOnChangeSub(date, dateString) {
      console.log(date);
      dateString=dateString.split('-');
      this.UserTimeSub=dateString[0]+dateString[1]+dateString[2];

        this.LREchart(['_this.ShopEchartsL(\''+'true'+'\',\''+'true'+'\')',
          '_this.ShopEchartsR(\''+'true'+'\',\''+'true'+'\')'
        ]);
        // '_this.ShopIndex=null','_this.ShopSecond=null','_this.ShopThird=null'   '_this.ShopNameVal=\''+'JD-林氏木业家具旗舰店'+'\'',   
    },

    ChoiceCss(val,choic,josn_value){
      let _this=this;
      _this.show; //意义不大 防止定义不调用出现的报错
      choic=eval(choic);

      Object.keys(choic).forEach((key) => {
        if(key==val){
          choic[key]=true;
        }else{
          choic[key]=false;
        }
      });

      if (josn_value) {
        Object.keys(josn_value).forEach((key_fun) => {
          try {
            eval(josn_value[key_fun]);
          } catch (e) {
            console.log("找不到对应的函数！！！");
          }
        });
      }

    },
    initecharts(refsval,type,userclear){

      let promise=[];
      // let promiseToday=[];
      let AllData=[];
      let TimeArr=[];
      let ValData=[];
      let AgoValData=[];
      let ChenVal='';

      let _time_now=new Date();

      // this.UserTimeAll;
      // this.UserTimeSubAll;

      if(this.ChoiceVal.qs==true){
        ChenVal=(this.QsQuery.viewType=='全司视角')?'全司':(this.QsQuery.viewType=='全中视角')?'全中':(this.QsQuery.viewType=='品市视角')?'品市':'全司';
      }else if(this.ChoiceVal.xsqd==true){
        ChenVal='线上渠道';
      }else if(this.ChoiceVal.xxqd==true){
        ChenVal='线下渠道';
      }else if(this.ChoiceVal.hwqd==true){
        ChenVal=(this.QsQuery.viewType=='品市视角')?'海外B2C':'海外渠道';
      }

      const params = {
        TDATE:(this.ContrastTim==1)?this.UserTimeAll:this.UserTime,  
      }
      if(type=='时分趋势'){
        promise = this.$fetchSql('real_time', 'read_time_hours',params).then(({ data }) => {
          return { data }
        });

        if(this.ContrastTim==2){
          let TodayVal=[];
          this.promiseToday.then(({data})=>{
            TodayVal=data.filter(_=>{return _.CHANNEL_VIEW===this.QsQuery.viewType&&_.CHANNEL===ChenVal});
            TodayVal.sort((a,b)=>{return a["TDATE_HOURS"] - b["TDATE_HOURS"]});
            Object.keys(TodayVal).forEach((keyDay)=>{
              if(TodayVal[keyDay].TDATE_HOURS*1>_time_now.getHours()){
                ValData.push(null);
              }else{
                ValData.push((TodayVal[keyDay].SALE_AMT).toFixed(1));
              }
            });
            // console.log(TodayVal); _time_now.getHours()
            // console.log(ValData);
          });
        }

      }else if(type=='累计趋势'){
        // promise = Promise.resolve({data:[]});
        promise = this.$fetchSql('real_time', 'read_time_hours',params).then(({ data }) => {
          return { data }
        });   
        
        if(this.ContrastTim==2){
          let TodayVal=[];
          this.promiseToday.then(({data})=>{
            TodayVal=data.filter(_=>{return _.CHANNEL_VIEW===this.QsQuery.viewType&&_.CHANNEL===ChenVal});
            TodayVal.sort((a,b)=>{return a["TDATE_HOURS"] - b["TDATE_HOURS"]});
            Object.keys(TodayVal).forEach((keyDay)=>{
              if(TodayVal[keyDay].TDATE_HOURS*1>_time_now.getHours()){
                ValData.push(null);
              }else{
                ValData.push((TodayVal[keyDay].SALE_AMT_TOT).toFixed(1));
              }
            });
            // console.log(TodayVal);
            // console.log(ValData);
          });
        }
        
      }



      // console.log("======趋势图了一级==========");
      // console.log(promise);
      promise.then(({data})=>{
        
        this.chartIns = echarts.init(this.$refs[refsval]);

        if(userclear==true){
          this.chartIns.clear();
        }


        if(type=='时分趋势'){
          Object.keys(data).forEach((key) => {
            if(data[key].CHANNEL_VIEW===this.QsQuery.viewType&&data[key].CHANNEL===ChenVal){
              AllData.push(data[key]);
            }
          });
          AllData.sort((a,b)=>{
            return a["TDATE_HOURS"] - b["TDATE_HOURS"]
          });
          Object.keys(AllData).forEach((keyOn)=>{
            TimeArr.push(AllData[keyOn].TDATE_HOURS);
            if(this.ContrastTim==1){
              if(AllData[keyOn].TDATE_HOURS*1>_time_now.getHours()){
                ValData.push(null);
              }else{
                ValData.push((AllData[keyOn].SALE_AMT).toFixed(1));
              }
            }
            AgoValData.push(((this.ContrastTim==1)?AllData[keyOn].AGO_AMT:AllData[keyOn].SALE_AMT).toFixed(1));
          });
        }else if(type=='累计趋势'){

          Object.keys(data).forEach((key) => {
            if(data[key].CHANNEL_VIEW===this.QsQuery.viewType&&data[key].CHANNEL===ChenVal){
              AllData.push(data[key]);
            }
          });
          AllData.sort((a,b)=>{
            return a["TDATE_HOURS"] - b["TDATE_HOURS"]              
          });
          Object.keys(AllData).forEach((keyOn)=>{
            TimeArr.push(AllData[keyOn].TDATE_HOURS);
            if(this.ContrastTim==1){
              if(AllData[keyOn].TDATE_HOURS*1>_time_now.getHours()){
                ValData.push(null);
              }else{
                ValData.push((AllData[keyOn].SALE_AMT_TOT).toFixed(1));
              }
            }
            AgoValData.push(((this.ContrastTim==1)?AllData[keyOn].AGO_AMT_TOT:AllData[keyOn].SALE_AMT_TOT).toFixed(1));
          });

        }

        // console.log(AllData);
        // console.log(TimeArr);
        // console.log(ValData);
        // console.log(AgoValData);
        // console.log(data);
        this.chartIns.setOption({
          grid: {
            left: "1%",
            top: "6%",
            right: "4%",
            bottom: "0%",
            containLabel: true,
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
              type: 'category',
              axisLine: {
                show: false  //不显示坐标轴刻度
              },
              axisLabel:{
                textStyle:{
                  color:'#808080'
                }
              },  

              axisTick: {
                show: false  //不显示坐标轴刻度
              },
              boundaryGap: false,
              data: TimeArr,
          },
          yAxis: {
              type: 'value',
              axisLine: {
                show: false  //不显示坐标轴轴线
              },
              splitLine:{
                lineStyle:{
                  color:'rgba(220,220,220,0.5)'
                }
              },              
              axisLabel:{
                textStyle:{
                  color:'#808080'
                }
              },              
              axisTick: {
                show: false  //不显示坐标轴刻度
              },
          },
          series: [

            {
              name: "同期",
              data: AgoValData,
              type: 'line',
              smooth: true, //true 为平滑曲线，false为直线 
              itemStyle:{

                color: "#919191", 
                normal: {
                  color: "#DCDCDC",
                  lineStyle: {
                    color: "#DCDCDC",
                    width: 2, //设置线条粗细
                  },
                  areaStyle: {
                    color: "rgba(255, 255, 255, 0.00)",
                  },
                },

              },           
              areaStyle: {}
            },  
                    
            {
              name: "业绩",
              data: ValData,
              type: 'line',
              smooth: true, //true 为平滑曲线，false为直线 
              itemStyle:{

                color: "#919191", 
                normal: {
                  color: "#1E90FF",
                  lineStyle: {
                    color: "#1E90FF",
                    width: 2, //设置线条粗细
                  },
                  areaStyle: {
                    color: "rgba(255, 255, 255, 0.00)",
                  },
                },

              },           
              areaStyle: {}
            },

          ]
        });

      });

    },


    initechartsR(refsval,type,userclear){

      let promise=[];
      // let promiseToday=[];
      let AllData=[];
      let TimeArr=[];
      let ValData=[];
      let AgoValData=[];
      let ChenVal='';

      let _time_now=new Date();

      // this.UserTimeAll;
      // this.UserTimeSubAll;

      if(this.ChoiceVal.qs==true){
        ChenVal=(this.QsQuery.viewType=='全司视角')?'全司':(this.QsQuery.viewType=='全中视角')?'全中':(this.QsQuery.viewType=='品市视角')?'品市':'全司';
      }else if(this.ChoiceVal.xsqd==true){
        ChenVal='线上渠道';
      }else if(this.ChoiceVal.xxqd==true){
        ChenVal='线下渠道';
      }else if(this.ChoiceVal.hwqd==true){
        ChenVal=(this.QsQuery.viewType=='品市视角')?'海外B2C':'海外渠道';
      }

      const params = {
        TDATE:(this.ContrastTim==1)?this.UserTimeAll:this.UserTime,  
      }
      if(type=='时分趋势'){
        promise = this.$fetchSql('real_time', 'read_time_hours',params).then(({ data }) => {
          return { data }
        });

        if(this.ContrastTim==2){
          let TodayVal=[];
          this.promiseToday.then(({data})=>{
            TodayVal=data.filter(_=>{return _.CHANNEL_VIEW===this.QsQuery.viewType&&_.CHANNEL===ChenVal});
            TodayVal.sort((a,b)=>{return a["TDATE_HOURS"] - b["TDATE_HOURS"]});
            Object.keys(TodayVal).forEach((keyDay)=>{
              if(TodayVal[keyDay].TDATE_HOURS*1>_time_now.getHours()){
                ValData.push(null);
              }else{
                ValData.push((TodayVal[keyDay].SALE_AMT).toFixed(1));
              }
            });
            // console.log(TodayVal); _time_now.getHours()
            // console.log(ValData);
          });
        }

      }else if(type=='累计趋势'){
        // promise = Promise.resolve({data:[]});
        promise = this.$fetchSql('real_time', 'read_time_hours',params).then(({ data }) => {
          return { data }
        });   
        
        if(this.ContrastTim==2){
          let TodayVal=[];
          this.promiseToday.then(({data})=>{
            TodayVal=data.filter(_=>{return _.CHANNEL_VIEW===this.QsQuery.viewType&&_.CHANNEL===ChenVal});
            TodayVal.sort((a,b)=>{return a["TDATE_HOURS"] - b["TDATE_HOURS"]});
            Object.keys(TodayVal).forEach((keyDay)=>{
              if(TodayVal[keyDay].TDATE_HOURS*1>_time_now.getHours()){
                ValData.push(null);
              }else{
                ValData.push((TodayVal[keyDay].SALE_AMT_TOT).toFixed(1));
              }
            });
            // console.log(TodayVal);
            // console.log(ValData);
          });
        }
        
      }



      // console.log("======趋势图了一级==========");
      // console.log(promise);
      promise.then(({data})=>{
        
        this.chartIns = echarts.init(this.$refs[refsval]);

        if(userclear==true){
          this.chartIns.clear();
        }


        if(type=='时分趋势'){
          Object.keys(data).forEach((key) => {
            if(data[key].CHANNEL_VIEW===this.QsQuery.viewType&&data[key].CHANNEL===ChenVal){
              AllData.push(data[key]);
            }
          });
          AllData.sort((a,b)=>{
            return a["TDATE_HOURS"] - b["TDATE_HOURS"]
          });
          Object.keys(AllData).forEach((keyOn)=>{
            TimeArr.push(AllData[keyOn].TDATE_HOURS);
            if(this.ContrastTim==1){
              if(AllData[keyOn].TDATE_HOURS*1>_time_now.getHours()){
                ValData.push(null);
              }else{
                ValData.push((AllData[keyOn].SALE_AMT).toFixed(1));
              }
            }
            AgoValData.push(((this.ContrastTim==1)?AllData[keyOn].AGO_AMT:AllData[keyOn].SALE_AMT).toFixed(1));
          });
        }else if(type=='累计趋势'){

          Object.keys(data).forEach((key) => {
            if(data[key].CHANNEL_VIEW===this.QsQuery.viewType&&data[key].CHANNEL===ChenVal){
              AllData.push(data[key]);
            }
          });
          AllData.sort((a,b)=>{
            return a["TDATE_HOURS"] - b["TDATE_HOURS"]              
          });
          Object.keys(AllData).forEach((keyOn)=>{
            TimeArr.push(AllData[keyOn].TDATE_HOURS);
            if(this.ContrastTim==1){
              if(AllData[keyOn].TDATE_HOURS*1>_time_now.getHours()){
                ValData.push(null);
              }else{
                ValData.push((AllData[keyOn].SALE_AMT_TOT).toFixed(1));
              }
            }
            AgoValData.push(((this.ContrastTim==1)?AllData[keyOn].AGO_AMT_TOT:AllData[keyOn].SALE_AMT_TOT).toFixed(1));
          });

        }

        // console.log(AllData);
        // console.log(TimeArr);
        // console.log(ValData);
        // console.log(AgoValData);
        // console.log(data);
        this.chartIns.setOption({
          grid: {
            left: "1%",
            top: "6%",
            right: "4%",
            bottom: "0%",
            containLabel: true,
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
              type: 'category',
              axisLine: {
                show: false  //不显示坐标轴刻度
              },
              axisLabel:{
                textStyle:{
                  color:'#808080'
                }
              },  

              axisTick: {
                show: false  //不显示坐标轴刻度
              },
              boundaryGap: false,
              data: TimeArr,
          },
          yAxis: {
              type: 'value',
              axisLine: {
                show: false  //不显示坐标轴轴线
              },
              splitLine:{
                lineStyle:{
                  color:'rgba(220,220,220,0.5)'
                }
              },              
              axisLabel:{
                textStyle:{
                  color:'#808080'
                }
              },              
              axisTick: {
                show: false  //不显示坐标轴刻度
              },
          },
          series: [

            {
              name: "同期",
              data: AgoValData,
              type: 'line',
              smooth: true, //true 为平滑曲线，false为直线 
              itemStyle:{

                color: "#919191", 
                normal: {
                  color: "#DCDCDC",
                  lineStyle: {
                    color: "#DCDCDC",
                    width: 2, //设置线条粗细
                  },
                  areaStyle: {
                    color: "rgba(255, 255, 255, 0.00)",
                  },
                },

              },           
              areaStyle: {}
            },  
                    
            {
              name: "业绩",
              data: ValData,
              type: 'line',
              smooth: true, //true 为平滑曲线，false为直线 
              itemStyle:{

                color: "#919191", 
                normal: {
                  color: "#1E90FF",
                  lineStyle: {
                    color: "#1E90FF",
                    width: 2, //设置线条粗细
                  },
                  areaStyle: {
                    color: "rgba(255, 255, 255, 0.00)",
                  },
                },

              },           
              areaStyle: {}
            },

          ]
        });

      });

    },


    excel_show_fun(val){
      if(val==1){
        this.excel.excel_show=true;
      }else if(val=='excel'){
        this.excel.show=false;
        this.excel.excel_show=false;
      }else{
        this.excel.excel_show=false;
      }
    },

    getQueryOptions() {
      this.$fetchSql('pds_sop', 'bord_filter_item').then(({data}) => {
        this.allOptions = Object.freeze(data);  //方法可以冻结一个对象
        // console.log("=======获取数据的！！！========");
        // console.log(this.allOptions);
        this.teamSupplyOptions = Object.freeze(Array.from(new Set(this.allOptions.map(_ => _.TEAM_SUPPLY))))  //数组的去重获取新的一个数组
        this.mainSerialOptions = Object.freeze(Array.from(new Set(this.allOptions.map(_ => _.MAIN_SERIAL))))
        this.mNameOptions = Object.freeze(Array.from(new Set(this.allOptions.map(_ => _.M_NAME))))
      })
    },

    test_router(){
      this.$router.push({
        path: "/x/4_647_813_842",
      });
    },

    // 仪表盘的函数
    getDataDboard(){
      let promise=[];
      // console.log("======================仪表盘的阿萨===========================");

      promise = this.$fetchSql('real_time', 'read_time_tot').then(({ data }) => {
        this.DimensionDat = data;
        return { data }
      });

      promise.then(({data})=>{
        this.DboardDat = data.find(_ => _['CHANNEL_VIEW'] === this.QsQuery.viewType) || {};
        // console.log(this.DboardDat);
      });

    },

    getDataDboardSub(){ 
      let promise=[];
      // console.log("======================仪表盘的阿萨细分的===========================");
      promise = this.$fetchSql('real_time', 'read_time_tot_sub').then(({ data }) => {
        this.DimensionDatSub = data;
        return { data }
      });
      promise.then(({data})=>{
        let FilterInit=[];
        // Object.keys(data).forEach((_key) => {
        //   if(data[_key].CHANNEL_VIEW=== this.QsQuery.viewType){
        //     FilterInit.push(data[_key]);
        //   }
        // });
        FilterInit=data.filter(_ => {return _['CHANNEL_VIEW'] === this.QsQuery.viewType});
        // console.log(FilterInit);

        let _filtered=FilterInit.map(_=>{
          return{
            ..._,
            YOY_RATE: (_['SALE_AMT'] / _['AGO_SALE_AMT'] - 1)
          }
        });

        let _FilterJson={};
        for(let item of _filtered){
          _FilterJson[item['CHANNEL']] = item;
        }
        this.DboardDatSub=_FilterJson||{};
        // this.DboardDatSub=_filtered;

        // console.log(_FilterJson);
        // console.log(this.DboardDatSub);
      });
      // console.log(promise);

    },

    getTableSub(){
      let promise=[];
      promise = this.$fetchSql('real_time', 'read_time_chnl_type').then(({ data }) => {
        return { data }
      });
      promise.then(({data})=>{
        // console.log(data);
        let usertable= data.filter(_ => {return _['CHANNEL_VIEW'] === this.QsQuery.viewType});
        usertable=usertable.map(_=>{
          return {
            CHANNEL:_['CHANNEL'],
            SALES_TARGET:_['SALES_TARGET'],
            SALE_AMT:_['SALE_AMT'],
            CMP_RATE:_['CMP_RATE'],
            TOT_RATE:_['TOT_RATE'],
            YOY_RATE:(_['AGO_SALE_AMT']==0)?0:((_['SALE_AMT'] / _['AGO_SALE_AMT']) - 1),
            RANK:(_['CHANNEL']=='合计')?99:(_['CHANNEL']=='线上平台')?10:(_['CHANNEL']=='线上外包')?9:(_['CHANNEL']=='线下直营')?8
              :(_['CHANNEL']=='线下经销')?7:(_['CHANNEL']=='线下家装')?6:(_['CHANNEL']=='线下定制')?5:(_['CHANNEL']=='线下拎包')?4
              :(_['CHANNEL']=='海外B2B')?3:(_['CHANNEL']=='海外B2C')?2:1
          }
        });
        usertable.sort((a,b)=>{
          return b["RANK"] - a["RANK"]
        });
        // console.log(usertable);
        this.DTableDate = usertable;

      });
      
      console.log("=========运行到表格这里来！===========");
      // console.log(promise);SALES_TARGET

    },

    
    getTableShopSub(sentval,userval,userpage){
      let promise=[];
      // let shopsubU=[];
      let userdata=0;

      const params = {
        CHANNEL_VIEW:this.QsQuery.viewType,  
        CHANNEL_TYPE:sentval,
        page: this[userpage].pagination.page,
        pageSize: this[userpage].pagination.pageSize,
      }

      console.log("==============底部店铺的！！！=================")
      promise = this.$fetchSql('real_time', 'read_time_chnl',params).then(({ data }) => {
        return { data }
      });
      promise.then(({data})=>{

        const {totalRows, list} = data;
        userdata=list;
        this[userpage].pagination.total = totalRows;
        userdata.sort((a,b)=>{return b["SALES_TARGET"] - a["SALES_TARGET"]});

        this.DTableShopSub[userval]=userdata.filter(_=>{return _['CHANNEL_TYPE']===sentval&&_['CHANNEL_VIEW']===this.QsQuery.viewType});
        // this.DTableShopSub.onlinegroupsub=userdata.filter(_=>{return _['CHANNEL_VIEW']===this.FzrQuery.viewType});
        // this.DTableShopSub.regionsub=userdata.filter(_=>{return _['CHANNEL_VIEW']===this.QuQuery.viewType});
        // console.log(shopsubU);
      });

      // console.log(promise);
    },

    // 店铺趋势图开始

    LREchart(josn_value){

      let _this=this;
      _this.show; //意义不大 防止定义不调用出现的报错

      if (josn_value) {
        Object.keys(josn_value).forEach((key_fun) => {
          try {
            eval(josn_value[key_fun]);
          } catch (e) {
            console.log("找不到对应的函数！！！");
          }
        });
      }

    },

    ShopEchartsR(setval,settype){

      let TimeArr=[];
      let AgoValData=[];
      let ValData=[];

      let arraypro=[];
      let arrayday=[];

      let _time_now=new Date();

      this.ShopUserName=(setval=='true')?this.ShopUserName:setval;
      this.ShopUserType=(settype=='true')?this.ShopUserType:settype;
      const params = {
        CHANNEL_VIEW:this.QsQuery.viewType,  
        CHANNEL_TYPE:this.ShopUserType,
        CHANNEL:this.ShopUserName,
        TDATE:(this.ContrastTim2==1)?this.UserTimeSubAll:this.UserTimeSub,  
        // page: this[userpage].pagination.page,  
        // pageSize: this[userpage].pagination.pageSize,
      }

      let promise=[];
      promise = this.$fetchSql('real_time', 'read_time_chnl_qs',params).then(({ data }) => {
        arraypro=data;
        // return { data }
      });


      // 店铺趋势分析开始
      let promTodayNew=[];
      let day_params=params;
      day_params.TDATE=this.UserTimeSubAll;
      promTodayNew=this.$fetchSql('real_time', 'read_time_chnl_qs',day_params).then(({ data }) => {
        arrayday=data;
        // return { data }
      });  
      this.p1= Promise.all([promise,promTodayNew,]);

      // console.log("============================!!!!!!!")
      // 店铺趋势分析结束


      this.p1.then(()=>{

        // console.log("运营到店铺趋势这里来了右！");
        this.chartInsShoR = echarts.init(this.$refs['ShopEchRigth']);
        // console.log(arraypro);
        // console.log(arrayday);

        if(this.ShopClearR==true){
          this.chartInsShoR.clear();
          this.ShopClearR=false;
        }



        if(this.ContrastTim2==2){
          arrayday.sort((a,b)=>{return a["TDATE_HOURS"] - b["TDATE_HOURS"]});
          Object.keys(arrayday).forEach((keyDay)=>{
            if(arrayday[keyDay].TDATE_HOURS*1>_time_now.getHours()){
              ValData.push(null);       
            }else{
              ValData.push((arrayday[keyDay].SALE_AMT_TOT).toFixed(1));              
            }
          });
        }


        arraypro.sort((a,b)=>{
          return a["TDATE_HOURS"] - b["TDATE_HOURS"]
        });
        Object.keys(arraypro).forEach((keyOn)=>{
          TimeArr.push(arraypro[keyOn].TDATE_HOURS);
          if(this.ContrastTim2==1){
            if(arraypro[keyOn].TDATE_HOURS*1>_time_now.getHours()){
              ValData.push(null); 
            }else{
              ValData.push((arraypro[keyOn].SALE_AMT_TOT).toFixed(1));              
            }
          }
          AgoValData.push(((this.ContrastTim2==1)?arraypro[keyOn].AGO_AMT_TOT:arraypro[keyOn].SALE_AMT_TOT).toFixed(1));
        });


        this.chartInsShoR.setOption({
          grid: {
            left: "1%",
            top: "6%",
            right: "4%",
            bottom: "0%",
            containLabel: true,
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
              type: 'category',
              axisLine: {
                show: false  //不显示坐标轴刻度
              },
              axisLabel:{
                textStyle:{
                  color:'#808080'
                }
              },  
              axisTick: {
                show: false  //不显示坐标轴刻度
              },
              boundaryGap: false,
              data: TimeArr,
          },
          yAxis: {
              type: 'value',
              axisLine: {
                show: false  //不显示坐标轴轴线
              },
              splitLine:{
                lineStyle:{
                  color:'rgba(220,220,220,0.5)'
                }
              },              
              axisLabel:{
                textStyle:{
                  color:'#808080'
                }
              },              
              axisTick: {
                show: false  //不显示坐标轴刻度
              },
          },
          series: [
            {
              name: "同期",
              data: AgoValData,
              type: 'line',
              smooth: true, //true 为平滑曲线，false为直线 
              itemStyle:{
                color: "#919191", 
                normal: {
                  color: "#DCDCDC",
                  lineStyle: {
                    color: "#DCDCDC",
                    width: 2, //设置线条粗细
                  },
                  areaStyle: {
                    color: "rgba(255, 255, 255, 0.00)",
                  },
                },
              },           
              areaStyle: {}
            },          
            {
              name: "业绩",
              data: ValData,
              type: 'line',
              smooth: true, //true 为平滑曲线，false为直线 
              itemStyle:{
                color: "#919191", 
                normal: {
                  color: "#1E90FF",
                  lineStyle: {
                    color: "#1E90FF",
                    width: 2, //设置线条粗细
                  },
                  areaStyle: {
                    color: "rgba(255, 255, 255, 0.00)",
                  },
                },
              },           
              areaStyle: {}
            },
          ]
        });


      });



    },

    ShopEchartsL(setval,settype){

      let TimeArr=[];
      let AgoValData=[];
      let ValData=[];

      let arraypro=[];
      let arrayday=[];

      let _time_now=new Date();

      this.ShopUserName=(setval=='true')?this.ShopUserName:setval;
      this.ShopUserType=(settype=='true')?this.ShopUserType:settype;

      const params = {
        CHANNEL_VIEW:this.QsQuery.viewType,  
        CHANNEL_TYPE:this.ShopUserType,
        CHANNEL:this.ShopUserName,
        TDATE:(this.ContrastTim2==1)?this.UserTimeSubAll:this.UserTimeSub,  
        // page: this[userpage].pagination.page,
        // pageSize: this[userpage].pagination.pageSize,
      }

      let promise=[];
      promise = this.$fetchSql('real_time', 'read_time_chnl_qs',params).then(({ data }) => {
        arraypro=data;
        // return { data }
      });



      // 店铺趋势分析开始  
      let promTodayNew=[];
      let day_params=params;
      day_params.TDATE=this.UserTimeSubAll;
      promTodayNew=this.$fetchSql('real_time', 'read_time_chnl_qs',day_params).then(({ data }) => {
        arrayday=data;
        // return { data }
      });  
      this.p2= Promise.all([promise,promTodayNew,]);

      // console.log("============================!!!!!!!")
      // console.log(this.promiseTodaySub);
      // 店铺趋势分析结束


      this.p2.then(()=>{

        console.log("运营到店铺趋势这里来了左！");
        // console.log(data);
        // console.log(this.ShopNameVal);
        console.log(this.ShopUserName);

        this.chartInsShoL = echarts.init(this.$refs['ShopEchLeft']);

        if(this.ShopClearL==true){
          this.chartInsShoL.clear();
          this.ShopClearL=false;
        }


        if(this.ContrastTim2==2){
          arrayday.sort((a,b)=>{return a["TDATE_HOURS"] - b["TDATE_HOURS"]});
          Object.keys(arrayday).forEach((keyDay)=>{
            if(arrayday[keyDay].TDATE_HOURS*1>_time_now.getHours()){
              ValData.push(null);
            }else{
              ValData.push((arrayday[keyDay].SALE_AMT).toFixed(1));              
            }
          });
        }

        arraypro.sort((a,b)=>{
          return a["TDATE_HOURS"] - b["TDATE_HOURS"]
        });
        Object.keys(arraypro).forEach((keyOn)=>{
          TimeArr.push(arraypro[keyOn].TDATE_HOURS);
          if(this.ContrastTim2==1){
            if(arraypro[keyOn].TDATE_HOURS*1>_time_now.getHours()){
              ValData.push(null); 
            }else{
              ValData.push((arraypro[keyOn].SALE_AMT).toFixed(1));              
            }
          }
          AgoValData.push(((this.ContrastTim2==1)?arraypro[keyOn].AGO_AMT:arraypro[keyOn].SALE_AMT).toFixed(1));
        });





        this.chartInsShoL.setOption({
          grid: {
            left: "1%",
            top: "6%",
            right: "4%",
            bottom: "0%",
            containLabel: true,
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
              type: 'category',
              axisLine: {
                show: false  //不显示坐标轴刻度
              },
              axisLabel:{
                textStyle:{
                  color:'#808080'
                }
              },  
              axisTick: {
                show: false  //不显示坐标轴刻度
              },
              boundaryGap: false,
              data: TimeArr,
          },
          yAxis: {
              type: 'value',
              axisLine: {
                show: false  //不显示坐标轴轴线
              },
              splitLine:{
                lineStyle:{
                  color:'rgba(220,220,220,0.5)'
                }
              },              
              axisLabel:{
                textStyle:{
                  color:'#808080'
                }
              },              
              axisTick: {
                show: false  //不显示坐标轴刻度
              },
          },
          series: [
            {
              name: "同期",
              data: AgoValData,
              type: 'line',
              smooth: true, //true 为平滑曲线，false为直线 
              itemStyle:{
                color: "#919191", 
                normal: {
                  color: "#DCDCDC",
                  lineStyle: {
                    color: "#DCDCDC",
                    width: 2, //设置线条粗细
                  },
                  areaStyle: {
                    color: "rgba(255, 255, 255, 0.00)",
                  },
                },
              },           
              areaStyle: {}
            },          
            {
              name: "业绩",
              data: ValData,
              type: 'line',
              smooth: true, //true 为平滑曲线，false为直线 
              itemStyle:{
                color: "#919191", 
                normal: {
                  color: "#1E90FF",
                  lineStyle: {
                    color: "#1E90FF",
                    width: 2, //设置线条粗细
                  },
                  areaStyle: {
                    color: "rgba(255, 255, 255, 0.00)",
                  },
                },
              },           
              areaStyle: {}
            },
          ]
        });

      });

    },

    // 店铺趋势图结束








    // getData1() {
    //   return this.$fetchSql('pds_sop', 'bord_load_time').then(({data}) => {
    //     this.dateOptions = data.map(_ => _.LOAD_TIME).sort((a, b) => moment(b) - moment(a))
    //     this.query.loadTime = this.dateOptions[0]
    //   })
    // },

    getData2(isResetPage = false) {

      console.log("========运行到getData2这里！！==========");
      // console.log(isResetPage);


      if(isResetPage) {
        this.table.pagination.page = 1
      }
      this.table.loading = true
      const params = {
        LOAD_TIME: this.query.loadTime,
        page: this.table.pagination.page,
        pageSize: this.table.pagination.pageSize,
        ORDER_BY: `${this.sorting.field} ${this.sorting.order}`,
      }

      console.log(this.table.pagination.page);
      // console.log(params);

      const {M_CODE, TEAM_SUPPLY, MAIN_SERIAL, M_NAME} = this.query
      M_CODE && (params.M_CODE = M_CODE)
      TEAM_SUPPLY && TEAM_SUPPLY.length && (params.TEAM_SUPPLY = TEAM_SUPPLY.join(','))
      MAIN_SERIAL && MAIN_SERIAL.length && (params.MAIN_SERIAL = MAIN_SERIAL.join(','))
      M_NAME && M_NAME.length && (params.M_NAME = M_NAME.join(','))

      // console.log(this.query);
      // console.log(M_CODE && (params.M_CODE = M_CODE));
      // console.log(TEAM_SUPPLY.join(','));
      // console.log(MAIN_SERIAL && MAIN_SERIAL.length && (params.MAIN_SERIAL = MAIN_SERIAL.join(',')));
      // console.log(M_NAME && M_NAME.length && (params.M_NAME = M_NAME.join(',')));

      console.log(params);


      this.$fetchSql('pds_sop', 'bord_valid', params).then(({data}) => {
        const {totalRows, list} = data
        this.table.data = list
        this.table.pagination.total = totalRows

        // console.log(data);
        // console.log(list);
        // console.log(totalRows);

        // console.log(this.table.data);

      }).finally(() => {
        this.table.loading = false
      })
    },

    handleChange(pagination, filter, sorters, ) {

      // console.log("========运行到aa这里！！==========");
      console.log(sorters)
      const orderMap = {
        'ascend': 'asc',
        'descend': 'desc'
      }
      let {field, order} = sorters
      if(field && order) {
        field = `T.${field}`
        order = orderMap[order]
      } else {
        field = 'rownum'
        order = 'asc'
      }
      this.sorting.field = field
      this.sorting.order = order
      this.getData2()
    },

    handleContextMenuClick(type) {

      if(type === 'downloadExcel') {
        const params = {
          LOAD_TIME: this.query.loadTime
        }

        const {M_CODE, TEAM_SUPPLY, MAIN_SERIAL, M_NAME} = this.query
        M_CODE && (params.M_CODE = M_CODE)
        TEAM_SUPPLY && TEAM_SUPPLY.length && (params.TEAM_SUPPLY = TEAM_SUPPLY.join(','))
        MAIN_SERIAL && MAIN_SERIAL.length && (params.MAIN_SERIAL = MAIN_SERIAL.join(','))
        M_NAME && M_NAME.length && (params.M_NAME = M_NAME.join(','))
        this.loading = true
        this.cancelTokenSource = axios.CancelToken.source()





        this.$axios.post('api/admin/data/exportExcel', {
          excelName: '货期报表',
          sheetConfigList: [
            {
              params,
              prefix: 'pds_sop',
              interfaceName: 'bord_valid',
              sheetName: '货期报表',
              columnConfigList: this.table.columns.map(_ => ({
                colWidth: _.width / 10,
                dbColName: _.dataIndex,
                excelColName: _.title
              }))
            }
          ]
        }, {
          responseType: 'blob',
          cancelToken: this.cancelTokenSource.token
        }).then(({data, headers}) => {
          const filename = headers['content-disposition'].match(/filename=(.*)/)[1]

          // console.log(data);
          downloadBlob(data, decodeURIComponent(filename))

        }).finally(() => {
          this.loading = false
        })
        this.excel_show_fun(2);


      }

    },

    cancelExport() {
      this.cancelTokenSource.cancel()
    },

  }

// _this.$router.push({
//   path: _this.tabs[value].path,
// });

}
</script>

<style lang="scss" scoped>
  .sub-tip {
    color: #999;
    font-size: 12px;
  }

  /deep/.simple-select-input {

    // border: 1px solid #46bca0;

  }

  /deep/.drop-down-button{
    // background: #46bca0
  }

  /deep/.simple-select-box {
    .box-item {
      &:hover {
        // background: #EEEEEE;
      }
      &.selected {
        // background: #aaa;
        // background: #DDDDDD;
      }
    }
  }

  /deep/.drop-down-icon{
    // font-size: 12px; color: #fff;
  }

  /deep/.ant-table{
    color: rgba(0, 0, 0, 1);
  }

  .export_excel{
    width: 30px;
    height: 30px;
    background: url("~@/assets/images/excel_img.png") no-repeat left center/contain;
    float:right;
    margin-right: 15px;

  }
  .export-menu{
    width: 85px;
    background: #ffffff;
    border: 1px solid #e4e4e4;
    margin-top: 15px;
    float: right;
    margin-right: -16px;
    cursor: pointer;
    &:hover {
      background: #cccccc80;
    }
  }
  .export-menu-item{
    text-align: center;
    font-size: 12px;
    padding-top: 2px;
    padding-bottom: 2px;

  }


  .text-xs-radio {
    font-size: 12px;

    /deep/ .ant-radio-wrapper {
      font-size: 12px;
    }
  }
  
  .lanren2_newn{
    background: url("~@/views/BIView/OperateDashboard/Tabs/LivePerf/images/p1.png") no-repeat left top/cover;    
  }

  .lanren3_newn{
    background: url("~@/views/BIView/OperateDashboard/Tabs/LivePerf/images/p2.png") no-repeat left top/cover;    
  }

  .lanren4_newn{
    background: url("~@/views/BIView/OperateDashboard/Tabs/LivePerf/images/p3.png") no-repeat left top/cover;    
  }


  .title_switch p{
    margin: 0px;
    float: left;
    margin-right: 30px;
    color: #A9A9A9;

  }
  .title_switch p span{
    color: #ffffff;
  }

  //after 
  p.active_cssn{ 
    margin-top: 5px;

  }
  p.active_css{ 
    color: #000000;
    &:before {
      // position: absolute;
      content: "";
      // left: 0%;
      width: 100%;
      // transform: translateX(-50%);
      height: 2px;
      background-color: #23B0A8;
      // bottom: -3px;
      display: block;
      margin-bottom: 3px;
      margin-top: 0px;
    }

  }

  .table_css {
    --height:496;
    font-size: 12px;
    width: 100%;
    table-layout: fixed;

    tr {
      &:first-child {
        td {
          background-color: #f5f7ff;
        }
      }

      &:nth-child(2n+1) {
        background-color: #fcfcff;
      }

      td {
        color: #808492;
        padding: 0 10px;
        line-height: calc(var(--height) * 1px / 20.5);
        height: calc(var(--height) * 1px / 20.5);
        border: 1px solid #e7e9f0;
        text-align: right;

        &:first-child {
          text-align: left;
        }
      }
    }
  }

  // .ShopTable

  .zrr_css{
    // display: flex;
    // justify-content: flex-end;
    margin-bottom: 10px;
    margin-top: 10px;
    float:right;
  }
  .zrr_end{
    margin-right: 0px;
  }
  /deep/ .zrr_end span{
    padding-right: 0px;
  }

  .table_hcss{
    // height: 461px;
    height: 511px;
  }


  .dropdown-icon {
    display: inline-block;
    width: 20px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    background: #fff;
    box-shadow: rgba(10, 30, 51, 0.2) 0 0 5px 0;
    border-radius: 4px;

    &:hover {
      cursor: pointer;

      i {
        opacity: .5;
      }
    }
  }

  .icon_cssY{
    transition: all 0.3s;
    transform:rotate(90deg);
    -ms-transform:rotate(90deg); 	/* IE 9 */
    -moz-transform:rotate(90deg); 	/* Firefox */
    -webkit-transform:rotate(90deg); /* Safari 和 Chrome */
    -o-transform:rotate(90deg); 	   
  }
  .icon_cssN{
    transition: all 0.3s;
    transform:rotate(0deg);
    -ms-transform:rotate(0deg); 	/* IE 9 */
    -moz-transform:rotate(0deg); 	/* Firefox */
    -webkit-transform:rotate(0deg); /* Safari 和 Chrome */
    -o-transform:rotate(0deg); 	   
  }   
  
  .change_cssY{
    background-color: rgba(	220,220,220,0.1);
    border-radius: 4px;
  }
  .change_cssN{
    background-color: rgba(	220,220,220,0.0);
    // border-radius: 4px;
  }

</style>

