
<template>
  <div class="MonitAll">
    <div
      :style="{
        width: bg_css.BgAllWidth / 1 + 'px',
        height: bg_css.BgAllWidth / 1.78 + 'px',
      }"
      class="SD_Tallybg"
    >
      <!-- <p>大挂作业</p> -->
      <!-- <div class="ShopEchartRig" style="width: 50%;float: left;margin-top: 20px;border-right: 1px solid #D3D3D3;">
        <p style="margin: 0 auto;padding-left: 0px;">分时趋势图</p>
        <div  ref="Polo" :style="{'width':(Usertable_widthNew/2)*0.99+'px'}" style="height: 246px;padding-left: 0px;"></div>
      </div> -->

      <div class="SD_titlecss" style="width: 100%">
        <div class="SD_TitleCont">
          <div
            class="SD_ContL"
            style="float: left"
            :style="{
              width: bg_css.BgAllWidth / 3.54 + 'px',
              height: bg_css.BgAllWidth / 36.92 + 'px',
              'margin-top': bg_css.BgAllWidth / 56.47 + 'px',
            }"
          ></div>
          <div
            class="SD_ContR"
            style="float: right"
            :style="{
              width: bg_css.BgAllWidth / 3.47 + 'px',
              height: bg_css.BgAllWidth / 36.92 + 'px',
              'margin-top': bg_css.BgAllWidth / 56.47 + 'px',
            }"
          >  
            <p style="margin: 0px;padding: 0px;text-align: right;color: #ffffff;" 
            :style="{
              'line-height': bg_css.BgAllWidth / 45.71+'px',
              'font-size': bg_css.BgAllWidth / 96+'px',
              'padding-right': bg_css.BgAllWidth / 24+'px'
            }">{{LoadTime}}</p></div>
        </div>

        <div class="SD_Inve">
          <div
            class="SD_InveCont"
            :style="{
              width: bg_css.BgAllWidth / 1.05 + 'px',
              height: bg_css.BgAllWidth / 13.81 + 'px',
              'background-position': '0px ' + -bg_css.BgAllWidth / 106.67 + 'px',
            }"
          >
            <p
              class="SD_InveContText"
              @click="SelectY()"
              :style="{
                'font-size': bg_css.BgAllWidth / 60 + 'px',
                'font-weight': bg_css.BgAllWidth / 4.8,
                'line-height': bg_css.BgAllWidth / 15.36 + 'px',
              }"
            >
              {{corporation+'·'+BigHangYN}}
            </p>
            <div v-if="SelectYVal" class="SD_Select" style="margin-top: -20px;">
              <div class="SD_SelectCss" style="margin: 0 auto;width: 200px;">
                <a-cascader :options="options" placeholder="请选择服务商" @change="onChange" />
              </div>
            </div>
            
          </div>
          <div class="SD_InvDonw" :style="{ 'margin-top': -bg_css.BgAllWidth / 38.4 + 'px' }">
            <div
              class="SD_InvDonwCss"
              :style="{
                width: bg_css.BgAllWidth / 6.1 + 'px',
                height: bg_css.BgAllWidth / 147.69 + 'px',
              }"
            ></div>
          </div>
        </div>
      </div>

      <!-- 三个指标开始 -->
      <div class="SD_Index">
        <div
          class="SD_IndexOn"
          :style="{
            'margin-top': bg_css.BgAllWidth / 45.71 + 'px',
            'margin-left': bg_css.BgAllWidth / 53.33 + 'px',
            'margin-right': bg_css.BgAllWidth / 53.33 + 'px',
          }"
        >
          <div
            class="SD_IndexL"
            style="float: left"
            :style="{
              width: bg_css.BgAllWidth / 3.31 + 'px',
              height: bg_css.BgAllWidth / 11.23 + 'px',
            }"
          >
            <div class="SD_IndexOn1L">
              <div class="SD_IndOn1LTitle" style="padding-top: 40px; padding-left: 78px">
                <p style="line-height: 50px">上午完成量</p>
              </div>
              <div class="SD_IndOn1LText" style="line-height: 45px; padding-left: 78px">
                <p>
                  <span style="color: #55ffff">{{Rate_S.CNT}}</span>
                  <i style="font-style: normal; padding-left: 15px; padding-right: 15px">/</i>{{Rate_S.ALL_CNT}}
                </p>
              </div>
            </div>

            <div class="SD_IndexOn1R">
              <div ref="shuiqiu1" style="width: 90px; height: 90px; border: 0px solid #ffffff; margin-top: 40px"></div>
            </div>
          </div>

          <div
            class="SD_IndexOnZ"
            style="float: left"
            :style="{
              width: bg_css.BgAllWidth / 3.31 + 'px',
              height: bg_css.BgAllWidth / 11.23 + 'px',
              'margin-left': bg_css.BgAllWidth / 36.92 + 'px',
            }"
          >
            <div class="SD_IndexOn1L">
              <div class="SD_IndOn1LTitle" style="padding-top: 40px; padding-left: 78px">
                <p style="line-height: 50px">中午完成量</p>
              </div>
              <div class="SD_IndOn1LText" style="line-height: 45px; padding-left: 78px">
                <p>
                  <span style="color: #55ffff">{{Rate_Z.CNT}}</span>
                  <i style="font-style: normal; padding-left: 15px; padding-right: 15px">/</i>{{Rate_Z.ALL_CNT}}
                </p>
              </div>
            </div>

            <div class="SD_IndexOn1R">
              <div ref="shuiqiu2" style="width: 90px; height: 90px; border: 0px solid #ffffff; margin-top: 40px"></div>
            </div>
          </div>

          <div
            class="SD_IndexOnR"
            style="float: right"
            :style="{
              width: bg_css.BgAllWidth / 3.31 + 'px',
              height: bg_css.BgAllWidth / 11.23 + 'px',
            }"
          >
            <div class="SD_IndexOn1L">
              <div class="SD_IndOn1LTitle" style="padding-top: 40px; padding-left: 78px">
                <p style="line-height: 50px">晚上完成量</p>
              </div>
              <div class="SD_IndOn1LText" style="line-height: 45px; padding-left: 78px">
                <p>
                  <span style="color: #55ffff">{{Rate_W.CNT}}</span>
                  <i style="font-style: normal; padding-left: 15px; padding-right: 15px">/</i>{{Rate_W.ALL_CNT}}
                </p>
              </div>
            </div>

            <div class="SD_IndexOn1R">
              <div ref="shuiqiu3" style="width: 90px; height: 90px; border: 0px solid #ffffff; margin-top: 40px"></div>
            </div>
          </div>
        </div>
        <div style="clear: both"></div>
      </div>
      <!-- 三个指标结束 -->

      <!-- 发货批次开始 -->
      <div class="SD_DeliverList">
        <div
          class="SD_DLUptime"
          :style="{
            'margin-top': bg_css.BgAllWidth / 64 + 'px',
            'margin-left': bg_css.BgAllWidth / 53.33 + 'px',
            'margin-right': bg_css.BgAllWidth / 53.33 + 'px',
          }"
        >
          <p style="float: left" class="SD_DLUL">距离上次更新时间：{{UptimeDiff}}</p>
          <p style="float: right" class="SD_DLUR">总数：{{DetaiList.length}}</p>
          <div style="clear: both"></div>
        </div>

        <div
          class="SD_DListOn"
          :style="{
            'margin-top': bg_css.BgAllWidth / 128 + 'px',
            'margin-left': bg_css.BgAllWidth / 53.33 + 'px',
            'margin-right': bg_css.BgAllWidth / 53.33 + 'px',
          }"
        >
          <div
            class="SD_DListMarTop"
            style="width: 100%"
            :style="{
              height: bg_css.BgAllWidth / 960 + 'px',
            }"
          ></div>
          <div class="SD_DListMar">
            <ul class="SD_DListUl">
              <li class="SD_DLTitle">
                <ul
                  :style="{
                    height: bg_css.BgAllWidth / 33.1 + 'px',
                    margin: bg_css.BgAllWidth / 76.8 + 'px',
                  }"
                  style="background: #1a386c; margin-bottom: 0px"
                >
                  <li><p>发货批次</p></li>
                  <li style="width: 8%"><p>备货区</p></li>
                  <li style="width: 26%"><p>理货进度</p></li>
                  <li style="width: 8%"><p>预警状态</p></li>
                  <li style="width: 8%"><p>时间进度</p></li>
                  <li><p>未进场托盘</p></li>
                  <li><p>计划开始时间</p></li>
                  <li><p>计划结束时间</p></li>
                </ul>
              </li>

              <div
                ref="UserScrollDivTOP"
                style="float: left; overflow: hidden; width: 100%"
                :style="{ height: bg_css.BgAllWidth / 3.43 + 'px' }"
              >
                <div ref="UserScrollTOP1">
                  <li class="SD_DLCont" v-for="(item, index) in DetaiList" :key="index">
                    <ul
                      :style="{
                        height: bg_css.BgAllWidth / 28.24 + 'px',
                        'margin-left': bg_css.BgAllWidth / 76.8 + 'px',
                        'margin-right': bg_css.BgAllWidth / 76.8 + 'px',
                        'margin-bottom': bg_css.BgAllWidth / 76.8 + 'px',
                      }"
                      style="margin-top: 0px; margin-top: 0px; border-bottom: 1px solid #ffffff"
                    >
                      <li><p>{{item.FBATCHNO}}</p></li>
                      <li style="width: 8%"><p>{{item.PICKUPAREA_FNAME}}</p></li>
                      <li style="width: 26%" :style="{'padding-left': bg_css.BgAllWidth / 38.4+'px'}">
                        <div
                          class="Schedule"
                          style="float: left"
                          :style="{
                            'margin-top': bg_css.BgAllWidth / 128 + 'px',
                          }"
                        >
                          <div
                            class="Schedule_Bg"
                            :style="{
                              width: bg_css.BgAllWidth / 6 + 'px',
                              height: bg_css.BgAllWidth / 76.8 + 'px',
                              'border-radius': bg_css.BgAllWidth / 147.69 + 'px',
                            }"
                          ></div>
                          <div
                            class="Schedule_Y"
                            :style="{
                              width: (bg_css.BgAllWidth / 6)*((item.TALLY_TRAY_PROGRESS)?item.TALLY_TRAY_PROGRESS:0) + 'px',
                              height: bg_css.BgAllWidth / 76.8 + 'px',
                              'border-radius': bg_css.BgAllWidth / 147.69 + 'px',
                              'margin-top': -(bg_css.BgAllWidth / 76.8) + 'px',
                              'background': (item.WARNING_STATUS=='A级预警')?'#C8201F':(item.WARNING_STATUS=='B级预警')?'#D39348':'#2673d1'
                            }"
                          ></div>
                          <div
      
                            class="Schedule_Text"
                            :style="{
                              width: bg_css.BgAllWidth / 6 + 'px',
                              height: bg_css.BgAllWidth / 76.8 + 'px',
                              'font-size': bg_css.BgAllWidth / 106.67 + 'px',
                              'margin-top': -(bg_css.BgAllWidth / 76.8) + 'px',
                              'line-height': bg_css.BgAllWidth / 76.8 + 'px',
                              'padding-left': bg_css.BgAllWidth / 96 + 'px',
                            }"
                          >
                            <p>{{((item.TALLY_STOCKLOC_CNT)?item.TALLY_STOCKLOC_CNT:'--')+'/'+((item.STOCKLOC_CNT)?item.STOCKLOC_CNT:'--')}}</p>
                          </div>
                        </div>
                        <div
                          class="Schedule_Rate"
                          style="float: left"
                          :style="{
                            'padding-left': bg_css.BgAllWidth / 76.8 + 'px',
                          }"
                        >
                          <p>{{(item.TALLY_TRAY_PROGRESS)?((item.TALLY_TRAY_PROGRESS*100).toFixed(0)+'%'):'0%'}}</p>
                        </div>
                      </li>
                      <li style="width: 8%"><p>{{item.WARNING_STATUS}}</p></li>
                      <li style="width: 8%"><p>{{(item.TIEM_PROGRESS)?((item.TIEM_PROGRESS*100).toFixed(2)+'%'):'--'}}</p></li>
                      <li><p>{{item.NOT_ENTRY_TRAY_CNT}}</p></li>
                      <li><p>{{(item.FPLANTALLYBEGINTIME)?item.FPLANTALLYBEGINTIME.substring(11,16):'--'}}</p></li>
                      <li><p>{{(item.FPLANENTRYENDTIME)?item.FPLANENTRYENDTIME.substring(11,16):'--'}}</p></li>
                    </ul>
                  </li>
                </div>
                <div ref="UserScrollTOP2"></div>
              </div>

              <!-- 
              <li class="SD_DLCont">
                <ul
                  :style="{
                    height: bg_css.BgAllWidth / 28.24 + 'px',
                    margin: bg_css.BgAllWidth / 76.8 + 'px',
                  }"
                  style="margin-bottom: 0px; margin-top: 0px; border-bottom: 1px solid #ffffff"
                >
                  <li><p>SFS20210929081</p></li>
                  <li style="width: 8%"><p>C区</p></li>
                  <li style="width: 26%">
                    <div
                      class="Schedule"
                      style="float: left"
                      :style="{
                        'margin-top': bg_css.BgAllWidth / 128 + 'px',
                      }"
                    >
                      <div
                        class="Schedule_Bg"
                        :style="{
                          width: bg_css.BgAllWidth / 6 + 'px',
                          height: bg_css.BgAllWidth / 76.8 + 'px',
                          'border-radius': bg_css.BgAllWidth / 147.69 + 'px',
                        }"
                      ></div>
                      <div
                        class="Schedule_Y"
                        :style="{
                          width: bg_css.BgAllWidth / 8.73 + 'px',
                          height: bg_css.BgAllWidth / 76.8 + 'px',
                          'border-radius': bg_css.BgAllWidth / 147.69 + 'px',
                          'margin-top': -(bg_css.BgAllWidth / 76.8) + 'px',
                        }"
                      ></div>
                      <div
                        class="Schedule_Text"
                        :style="{
                          width: bg_css.BgAllWidth / 6 + 'px',
                          height: bg_css.BgAllWidth / 76.8 + 'px',
                          'font-size': bg_css.BgAllWidth / 106.67 + 'px',
                          'margin-top': -(bg_css.BgAllWidth / 76.8) + 'px',
                          'line-height': bg_css.BgAllWidth / 76.8 + 'px',
                          'padding-left': bg_css.BgAllWidth / 96 + 'px',
                        }"
                      >
                        <p>90/100</p>
                      </div>
                    </div>
                    <div
                      class="Schedule_Rate"
                      style="float: left"
                      :style="{
                        'padding-left': bg_css.BgAllWidth / 76.8 + 'px',
                      }"
                    >
                      <p>70%</p>
                    </div>
                  </li>
                  <li style="width: 8%"><p>状态2</p></li>
                  <li style="width: 8%"><p>80%</p></li>
                  <li><p>3</p></li>
                  <li><p>8:40</p></li>
                  <li><p>10:40</p></li>
                </ul>
              </li>



              <li class="SD_DLCont">
                <ul
                  :style="{
                    height: bg_css.BgAllWidth / 28.24 + 'px',
                    margin: bg_css.BgAllWidth / 76.8 + 'px',
                  }"
                  style="margin-bottom: 0px; margin-top: 0px; border-bottom: 1px solid #ffffff"
                >
                  <li><p>SFS20210929081</p></li>
                  <li style="width: 8%"><p>C区</p></li>
                  <li style="width: 26%">
                    <div
                      class="Schedule"
                      style="float: left"
                      :style="{
                        'margin-top': bg_css.BgAllWidth / 128 + 'px',
                      }"
                    >
                      <div
                        class="Schedule_Bg"
                        :style="{
                          width: bg_css.BgAllWidth / 6 + 'px',
                          height: bg_css.BgAllWidth / 76.8 + 'px',
                          'border-radius': bg_css.BgAllWidth / 147.69 + 'px',
                        }"
                      ></div>
                      <div
                        class="Schedule_Y"
                        :style="{
                          width: bg_css.BgAllWidth / 8.73 + 'px',
                          height: bg_css.BgAllWidth / 76.8 + 'px',
                          'border-radius': bg_css.BgAllWidth / 147.69 + 'px',
                          'margin-top': -(bg_css.BgAllWidth / 76.8) + 'px',
                        }"
                      ></div>
                      <div
                        class="Schedule_Text"
                        :style="{
                          width: bg_css.BgAllWidth / 6 + 'px',
                          height: bg_css.BgAllWidth / 76.8 + 'px',
                          'font-size': bg_css.BgAllWidth / 106.67 + 'px',
                          'margin-top': -(bg_css.BgAllWidth / 76.8) + 'px',
                          'line-height': bg_css.BgAllWidth / 76.8 + 'px',
                          'padding-left': bg_css.BgAllWidth / 96 + 'px',
                        }"
                      >
                        <p>90/100</p>
                      </div>
                    </div>
                    <div
                      class="Schedule_Rate"
                      style="float: left"
                      :style="{
                        'padding-left': bg_css.BgAllWidth / 76.8 + 'px',
                      }"
                    >
                      <p>70%</p>
                    </div>
                  </li>
                  <li style="width: 8%"><p>状态2</p></li>
                  <li style="width: 8%"><p>80%</p></li>
                  <li><p>3</p></li>
                  <li><p>8:40</p></li>
                  <li><p>10:40</p></li>
                </ul>
              </li> -->

              <div style="clear: both"></div>
            </ul>
          </div>
          <div
            class="SD_DListMarDown"
            style="width: 100%"
            :style="{
              height: bg_css.BgAllWidth / 960 + 'px',
            }"
          ></div>
        </div>
      </div>
      <!-- 发货批次结束 -->
    </div>
  </div>
</template>

<script>
var table_width = window.innerWidth

// echarts的引入！！！
import echarts from 'echarts/lib/echarts'
// import 'echarts/lib/chart/line'
// import 'echarts/lib/chart/bar'
// import 'echarts/lib/component/legend'
// import 'echarts/lib/component/tooltip'

import 'echarts/lib/chart/line'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/gauge'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'

import 'echarts-liquidfill'

export default {
  name: 'SD_Tally',

  components: {
    // Cascadera:Cascader,
    // Cascadera:Cascader.name
  },
  data() {
    return {
      bg_css: {
        BgAllWidth: table_width,
      },
      data: [],
      Usertable_widthNew: 0,
      corporation: '-1',
      BigHangYN: '-1',
      SelectYVal:false,
      HAgain:false,

      options: [
        {
          value: '青岛日日顺智慧物联',
          label: '青岛日日顺智慧物联',
          children: [
            {
              value: '大挂作业',
              label: '大挂作业',
            },
            {
              value: '小挂作业',
              label: '小挂作业',
            },
          ],
        },
        {
          value: '佛山市益林仓储服务',
          label: '佛山市益林仓储服务',
          children: [
            {
              value: '大挂作业',
              label: '大挂作业',
            },
            {
              value: '小挂作业',
              label: '小挂作业',
            },
          ],
        },
        {
          value: '江苏苏宁物流',
          label: '江苏苏宁物流',
          children: [
            {
              value: '大挂作业',
              label: '大挂作业',
            },
            {
              value: '小挂作业',
              label: '小挂作业',
            },
          ],
        },
        {
          value: '广州顺丰快运',
          label: '广州顺丰快运',
          children: [
            {
              value: '大挂作业',
              label: '大挂作业',
            },
            {
              value: '小挂作业',
              label: '小挂作业',
            },
          ],
        },
        {
          value: '宁波选的德邦供应链',
          label: '宁波选的德邦供应链',
          children: [
            {
              value: '大挂作业',
              label: '大挂作业',
            },
            {
              value: '小挂作业',
              label: '小挂作业',
            },
          ],
        },
      ],

      DetaiList: '',
      Rate_S:{CNT:0,ALL_CNT:0},
      Rate_Z:{CNT:0,ALL_CNT:0},
      Rate_W:{CNT:0,ALL_CNT:0},
      UptimeDiff:'',

      RunOne:false,
      LoadTime:'',

      JurDic:[],
      IsAllJur:[],

    }
  },

  created() {
    this.apiMap2 = {
      'SQL-LC_TALLY_D_SUM_RT-LC_TALLY_D_SUM_RT': { resultProp: 'LC_TALLY_D_SUM_RT' },
    }
    this.ajax_data(this.apiMap2)

    this.JurDic=(this.$store.state.user.userInfo.roles).filter(_=>{
      return _.indexOf("大屏") >= 0
    });
    this.IsAllJur=(this.$store.state.user.userInfo.roles).filter(_=>{
      return _.indexOf("仓储全大屏权限") >= 0
    });
    this.JurDic=this.JurDic.map(_=>(_.replace('(大屏)','')));
    this.JurDic=this.JurDic.map(_=>(_.replace('有限公司','')))
    console.log(this.JurDic);  
    console.log(this.IsAllJur);

    // this.corporation = '佛山市益林仓储服务有限公司';
    // this.BigHangYN = '大挂作业';    

    this.FilterCom();

    console.log(this.data)
  },

  watch:{
    'DetaiList.length':{
      handler () {
        // console.log("====变化运行上了的！！！！=====");
        clearTimeout(this.timeID); //清除定时器防止速度变快！
        this.RunOne=false;
        this.user_data_set();
      }
    },
  },

  mounted() {
    this.Usertable_widthNew = table_width;

    
    // Object.keys(this.$store.state.user.userInfo.roles).forEach((keyJu) => {
    //   if((this.$store.state.user.userInfo.roles[keyJu]).indexOf("大屏") > 0){
    //     console.log(this.$store.state.user.userInfo.roles[keyJu]);
    //   }
    //   console.log((this.$store.state.user.userInfo.roles[keyJu]).indexOf("大屏"));
    // });


  


    //   console.log(Cascader);
    this.initecharts('shuiqiu1','上午');
    this.initecharts('shuiqiu2','下午');
    this.initecharts('shuiqiu3','晚上');
    this.user_data_set();

    this.datav_setTimeout(this,this.apiMap2);
    this.SystemTime(this);


  },

  methods: {


    datav_setTimeout(set_val,data){
      // let _this=this;
      setTimeout(()=>{
        set_val.ajax_data(data);
        set_val.initecharts('shuiqiu1','上午');
        set_val.initecharts('shuiqiu2','下午');
        set_val.initecharts('shuiqiu3','晚上');
        set_val.user_data_set();

        set_val.datav_setTimeout(set_val,data);
      },5000);
    },


    onChange(value) {
      // console.log(value);
      // console.log(value[0]);
      // console.log(value[1]);
      this.corporation = value[0];
      this.BigHangYN = value[1]; 
      this.SelectYVal=false;
      
      this.initecharts('shuiqiu1','上午');
      this.initecharts('shuiqiu2','下午');
      this.initecharts('shuiqiu3','晚上');
      clearTimeout(this.timeID); //清除定时器防止速度变快！
      this.RunOne=false;
      this.user_data_set();
      // this.HAgain=true;


      // this.gundong_fun();

    },

    SelectY(){
      if(this.SelectYVal==false){
        this.SelectYVal=true;
      }else{
        this.SelectYVal=false;
      }
    },

    FilterCom(){

      this.p1.then(()=>{
        let UserScel=[];
        this.options=[];
        let JurDicAfter=[];
        UserScel = Object.freeze(Array.from(new Set(this.data["LC_TALLY_D_SUM_RT-LC_TALLY_D_SUM_RT"].map(_ => _.STOCKCOMPANY_FNAME))));  //数组的去重获取新的一个数组

        console.log(this.IsAllJur.length);

        // 权限控制开始
        if(this.IsAllJur.length>0){
          JurDicAfter=UserScel;
        }else{
          Object.keys(UserScel).forEach((keyJ) => {

            if(UserScel[keyJ]){
              Object.keys(this.JurDic).forEach((keyJD) => {
                if(UserScel[keyJ].indexOf('青岛日日顺智慧物联有限公司（青岛仓）')>=0){
                  if(this.JurDic[keyJD].indexOf('青岛仓')>=0){
                    JurDicAfter.push(UserScel[keyJ]);
                  }
                }else if(UserScel[keyJ].indexOf(this.JurDic[keyJD])>=0){
                  JurDicAfter.push(UserScel[keyJ]);
                }
              });              
            }

          });          
        }
        // JurDicAfter=UserScel;
        // console.log(this.IsAllJur.length);
        // 权限控制结束
        // console.log(JurDicAfter);
        //默认选项开始
        this.corporation = (JurDicAfter[0])?JurDicAfter[0]:'--';
        this.BigHangYN = (JurDicAfter[0])?'大挂作业':'--'; 
        //默认选项结束

        // console.log(UserScel);
        Object.keys(JurDicAfter).forEach((keyU) => {

          if(JurDicAfter[keyU]){
            this.options.push({
              value: JurDicAfter[keyU],
              label: JurDicAfter[keyU],
              children: [
                {
                  value: '大挂作业',
                  label: '大挂作业',
                },
                {
                  value: '小挂作业',
                  label: '小挂作业',
                },
              ],
            });
          }
        });


      });

    },


    SystemTime(set_val){
      setTimeout(()=>{
        let now = new Date(),
            y = now.getFullYear(),
            m = ("0" + (now.getMonth() + 1)).slice(-2),
            d = ("0" + now.getDate()).slice(-2);
        this.LoadTime=y + "年" + m + "月" + d + "日 " + now.toTimeString().substr(0, 8);
        set_val.SystemTime(set_val);
      },100);
    },


    user_data_set() {
      let promise = []
      let params = {
        STOCKCOMPANY_FNAME: this.corporation,
        SMALLMODE:this.BigHangYN
      }
      let curTime = new Date();
      let addHour = curTime.setHours(curTime.getHours() + 1);   
      
      // console.log(new Date(addHour));
      let UserOndat=[];

      promise = this.$fetchSql('LC_TALLY_D_RT', 'LC_TALLY_D_RT', params).then(({ data }) => {
        UserOndat=data;
        // return { data }
      })

      let userall= Promise.all([promise,this.p1]); 
      userall.then(() => {
        // console.log(data);
        // console.log(this.corporation);
        // console.log(this.BigHangYN); (new Date(_["FPLANTALLYBEGINTIME"]).getTime(new Date(_["FPLANTALLYBEGINTIME"]))<=(new Date(addHour).getTime(new Date(addHour))))
        // console.log(new Date(data[0]["FPLANTALLYBEGINTIME"]).getTime(new Date(data[0]["FPLANTALLYBEGINTIME"])));
        // console.log(new Date(addHour).getTime(new Date(addHour)));
        let data=UserOndat;

        this.UptimeDiff=(data[0])?(data[0].TIME_DIFF)?(data[0].TIME_DIFF).toFixed(2):'--':'--';
        // this.LoadTime=(data[0])?(data[0].LOAD_TIME)?
        //   (data[0].LOAD_TIME.substring(0,4)+'年'+data[0].LOAD_TIME.substring(5,7)+'月'+data[0].LOAD_TIME.substring(8,10)+'日 '+
        //   data[0].LOAD_TIME.substring(11,16)):'--':'--';
        this.DetaiList = data;
        this.DetaiList=this.DetaiList.filter(_=>{return _.TALLY_TRAY_PROGRESS!=(1)&&
          (new Date(_["FPLANTALLYBEGINTIME"]).getTime(new Date(_["FPLANTALLYBEGINTIME"]))<=new Date(addHour).getTime(new Date(addHour)))});

        this.DetaiList = this.DetaiList.sort((a, b) => {
          let value_sort = "";
          let a_time = new Date(a["FPLANTALLYBEGINTIME"]).getTime(new Date(a["FPLANTALLYBEGINTIME"]));
          let b_time = new Date(b["FPLANTALLYBEGINTIME"]).getTime(new Date(b["FPLANTALLYBEGINTIME"]));
          value_sort = Number(a_time) - Number(b_time);
          return value_sort;
        });

        // 列表的滚动代码结束
        if(this.RunOne==false){
          setTimeout(()=>{
              clearTimeout(this.timeID); //清除定时器防止速度变快！        
              var AscrollTOP1 = this.$refs["UserScrollTOP1"];
              var AscrollTOP2= this.$refs["UserScrollTOP2"];
              var AscrolldivTOP =this.$refs["UserScrollDivTOP"]; 
              this.scrollTOP1 = AscrollTOP1;
              this.scrollTOP2= AscrollTOP2;
              this.scrolldivTOP = AscrolldivTOP; 
            this.rollTOP(100);
          },50);
          this.RunOne=true;            
        }
        // 列表的滚动代码开始

      })
    },

    rollTOP(t) {

        //把内容重复复制，达到滚动不间断的效果
        if(this.DetaiList.length>6){
          this.scrollTOP2.innerHTML = this.scrollTOP1.innerHTML;
        }else{
          this.scrollTOP2.innerHTML = '';
        }

        // this.$refs["UserScrollTOP2"]=this.$refs["UserScrollTOP1"];

        this.scrolldivTOP.scrollTop = 0;
        let _this=this;
        //  setInterval(this.rollStartTOP, t);
        this.rollStartTOP(_this,t)
    },
    rollStartTOP(set_this,t) {
      // if(this.HAgain==false){}else{
      //   this.HAgain=false;
      // }


      if(this.DetaiList.length>6){ 
        // (function(){})();   
        this.timeID=setTimeout(()=>{
            if ((set_this.scrolldivTOP.scrollTop) >= (set_this.scrollTOP1.scrollHeight)) {
                set_this.scrolldivTOP.scrollTop = 0;
            } else {
                // set_this.scrolldivTOP.scrollTop++;
                this.scrolldivTOP.scrollTop+=2;
            }
            // console.log(set_this.scrolldivTOP.scrollTop);
            set_this.rollStartTOP(set_this,t);  
        },t);
       
      } 

    },  


    initecharts(user_refs,type) {
      
      this.p1.then(() => {
        this.chartIns = echarts.init(this.$refs[user_refs]);

        let userdata=[]; 
        let rate=0;
        userdata=this.data['LC_TALLY_D_SUM_RT-LC_TALLY_D_SUM_RT'].filter(_=>{return _.STOCKCOMPANY_FNAME===this.corporation&&
          _.FPLANTALLYBEGINTIME_INTERVAL===type&&_.SMALLMODE===this.BigHangYN});
        rate=(userdata[0])?(userdata[0].TALLY_TRAY_RATE):0;

        if(type=='上午'){
          this.Rate_S.CNT=(userdata[0])?(userdata[0].TALLY_TRAY_CNT):'--';
          this.Rate_S.ALL_CNT=(userdata[0])?(userdata[0].ALL_CNT):'--';

        }else if(type=='下午'){
          this.Rate_Z.CNT=(userdata[0])?(userdata[0].TALLY_TRAY_CNT):'--';
          this.Rate_Z.ALL_CNT=(userdata[0])?(userdata[0].ALL_CNT):'--';

        }else if(type=='晚上'){
          this.Rate_W.CNT=(userdata[0])?(userdata[0].TALLY_TRAY_CNT):'--';
          this.Rate_W.ALL_CNT=(userdata[0])?(userdata[0].ALL_CNT):'--';
        }

        // console.log(this.data);
        // console.log(userdata);

        this.chartIns.setOption({
          grid: {
            left: '2%',
            top: '0%',
            right: '0%',
            bottom: '2%',
            // bottom: "0%",
            containLabel: true,
          },
          tooltip: {
            show: false,
            formatter: '{a} <br/>{b} : {c}%',
          },
          toolbox: {
            feature: {
              restore: {},
              saveAsImage: {},
            },
          },

          backgroundColor: 'rgba(9,33,73,1)',
          series: [
            {
              type: 'liquidFill',
              radius: '90%',
              center: ['50%', '50%'],
              data: [rate, rate],
              // backgroundStyle: {
              //     borderWidth: 1,
              //     borderColor: 'rgba(22,120,255,0.5)',
              //     color: 'rgba(238,238,238,0.5)'
              // },

              backgroundStyle: {
                borderWidth: 0,
                borderColor: 'rgba(22,120,255,0.5)',
                color: {
                  //设置了背景无颜色
                  type: 'linear',
                  x: 1,
                  y: 0,
                  x2: 0.5,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 1,
                      color: 'rgba(68, 145, 253, 0)',
                    },
                    {
                      offset: 0.5,
                      color: 'rgba(68, 145, 253, 0)',
                    },
                    {
                      offset: 0,
                      color: 'rgba(68, 145, 253, 0)',
                    },
                  ],
                  globalCoord: false,
                },
              },

              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                {
                  offset: 1,
                  color: 'rgba(135, 241, 244, 0.7)',
                },
                {
                  offset: 0,
                  // color: 'rgba(73, 126, 255, 0.36)'
                  color: 'rgba(22,120,255, 0.36)',
                },
              ]),

              itemStyle: {
                shadowBlur: 0,
                color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  {
                    offset: 1,
                    // color: 'rgba(135, 241, 244, 0.7)'
                    // color: 'rgba(73, 192, 255, 0.7)'
                    color: 'rgba(22,120,255, 0.7)',
                  },
                  {
                    offset: 0,
                    // color: 'rgba(73, 192, 255, 0.7)'
                    color: 'rgba(135, 241, 244, 0.7)',
                  },
                ]),
                opacity: 1,
              },

              outline: {
                show: true,
                borderDistance: 2, //轮廓间距
                itemStyle: {
                  borderColor: '#7CD3E8', //轮廓颜色
                  borderWidth: 2, // 轮廓大小
                  shadowBlur: 'none', // 轮廓阴影
                },
              },

              label: {
                fontSize: 12,
                formatter: function (v) {
                  // return  '完成率\n '+(v.data * 100).toFixed(1)+"%";
                  // return  '月累计完成率\n '+(v.data * 100).toFixed(1)+"%";
                  return (v.data * 100).toFixed(1) + '%'
                },
                align: 'center',
                color: 'rgba(255,255,255,0.8)',
              },
            },
          ],
        });
      });
    },

    ajax_data(apiMap) {
      console.log('运行到ajax交互哪里！！！！！！！！')
      let num_api = 0
      // let num_api_pd=0;
      let p_array = []
      let variable = {}

      // 数组处理开始
      Object.keys(apiMap).forEach((key_fun) => {
        num_api++
        ;[variable['p' + num_api], variable['resolve' + num_api]] = this.generatePromise()
        p_array.push(variable['p' + num_api])
        apiMap[key_fun].type = Array
        apiMap[key_fun]['resolve' + num_api] = variable['resolve' + num_api]
        apiMap[key_fun]['num'] = num_api
      })
      // 数组处理结束

      Object.keys(apiMap).forEach((key) => {
        const [, prefix, interfaceName] = key.split('-') //把上面的拆分出来
        if (prefix && interfaceName) {
          this.$axios.post(`/api/admin/data/${prefix}/${interfaceName}/get`, {}).then(({ data }) => {
            if (apiMap[key].type === Array) {
              this.data[`${prefix}-${interfaceName}`] = data
            } else {
              this.data[`${prefix}-${interfaceName}`] = data
            }

            Object.keys(variable).forEach((key_var) => {
              if (key_var == 'resolve' + apiMap[key]['num']) {
                apiMap[key]['resolve' + apiMap[key]['num']]()
              }
            })
          })
        }
      })

      this.p1 = Promise.all(p_array)
    },

    generatePromise() {
      let resolve, reject
      const p = new Promise((res, rej) => {
        resolve = res
        reject = rej
      })
      return [p, resolve, reject]
    },
    
  },
}
</script>

<style lang="scss" scoped>
/deep/ body {
  overflow: auto;
  /* overflow: hidden;  bg_banner*/
}
.SD_Tallybg {
  background: url('~@/assets/images/datav/StorageSD/bg.png') no-repeat left top/cover;
  margin: 0 auto;
}
.SD_ContL {
  background: url('~@/assets/images/datav/StorageSD/left.png') no-repeat left top/cover;
  margin: 0 auto;
}
.SD_ContR {
  background: url('~@/assets/images/datav/StorageSD/right.png') no-repeat left top/cover;
  margin: 0 auto;
}
.SD_InveCont {
  background: url('~@/assets/images/datav/StorageSD/inverted.png') no-repeat left top/cover;
  margin: 0 auto;
}
.SD_InvDonwCss {
  background: url('~@/assets/images/datav/StorageSD/rayline.png') no-repeat left top/cover;
  margin: 0 auto;
}
.SD_InveContText {
  text-align: center;
  color: #ffffff;
  margin: 0px;
}
.SD_IndexL {
  background: url('~@/assets/images/datav/StorageSD/splitline.png') no-repeat left top/cover;
  margin: 0 auto;
}
.SD_IndexOnZ {
  background: url('~@/assets/images/datav/StorageSD/splitline2.png') no-repeat left top/cover;
  margin: 0 auto;
}
.SD_IndexOnR {
  background: url('~@/assets/images/datav/StorageSD/splitline2.png') no-repeat left top/cover;
  margin: 0 auto;
}

.SD_DLUptime p {
  margin: 0px;
  padding: 0px;
}
.SD_DLUL {
  // width: 198px;
  // height: 19px;
  font-size: 18px;
  font-weight: 400;
  color: #ffffff;
  // line-height: 7px;
  opacity: 0.8;
}
.SD_DLUR {
  // width: 75px;
  // height: 19px;
  font-size: 18px;
  font-weight: 400;
  color: #ffffff;
  // line-height: 7px;
  opacity: 0.8;
}
.SD_DListOn {
  // width: 1840px;
  // height: 650px;
  background: #06234b;
  opacity: 0.74;
  border-radius: 5px;
}

.SD_DListUl,
.SD_DListUl li ul {
  list-style: none;
  padding: 0px;
  margin: 0px;
}

// .SD_DListUl li.SD_DLTitle {
//   background: #1a386c;
// }
.SD_DListUl li.SD_DLTitle ul li p {
  margin: 0px;
  padding: 0px;
}
.SD_DListUl li.SD_DLTitle ul li {
  float: left;
  width: 12.5%;

  font-size: 20px;
  font-weight: 400;
  color: #ffffff;
  line-height: 60px;
  opacity: 0.8;
  // text-align: center;
  padding-left: 10px;
}

.SD_DListUl li.SD_DLCont ul li {
  float: left;
  width: 12.5%;

  font-size: 22px;
  font-weight: 400;
  color: #ffffff;
  line-height: 60px;

  padding-left: 10px;
}

.SD_DListUl li.SD_DLCont ul li p {
  margin: 0px;
  padding: 0px;
}

.SD_DListMarTop,
.SD_DListMarDown {
  background: url('~@/assets/images/datav/StorageSD/lineon.png') no-repeat left top/cover;
  margin: 0 auto;
}
.SD_DListMar{
  text-align: center;
}

.Schedule {
}
.Schedule_Bg {
  background: #1a386c;
}
.Schedule_Y {
  background: #2673d1;
}
.Schedule_Text {
  font-weight: 400;
  color: #ffffff;
}
.Schedule_Text p {
  margin: 0px;
  padding: 0px;
}

.SD_IndexOn1L {
  float: left;
  width: 70%;
}
.SD_IndexOn1R {
  float: left;
  width: 30%;
}

.SD_IndexOn1L p {
  margin: 0px;
  padding: 0px;
}

.SD_IndOn1LTitle {
  font-size: 24px;
  font-weight: 400;
  color: #ffffff;
  line-height: 72px;
}

.SD_IndOn1LText {
  font-size: 30px;
  font-weight: 400;
  // color: #55ffff;
  color: #ffffff;
  line-height: 72px;
}
</style>


