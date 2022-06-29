<template>
  <div class="MonitAll">
    <div
      class="SD_BigBangbg"
      :style="{
        width: bg_css.BgAllWidth / 1 + 'px',
        height: bg_css.BgAllWidth / 1.78 + 'px',
      }"
    >
      <div class="SD_titlecss" style="width: 100%">
        <div class="SD_Cont">
          <div
            class="SD_TitleL"
            style="float: left"
            :style="{
              width: (bg_css.BgAllWidth / 2.52) * 0.8 + 'px',
              height: (bg_css.BgAllWidth / 25.26) * 0.8 + 'px',
              'margin-top': bg_css.BgAllWidth / 76.8 + 'px',
            }"
          ></div>
          <div
            class="SD_TitleR"
            style="float: right"
            :style="{
              width: (bg_css.BgAllWidth / 2.52) * 0.8 + 'px',
              height: (bg_css.BgAllWidth / 25.26) * 0.8 + 'px',
              'margin-top': bg_css.BgAllWidth / 76.8 + 'px',
            }"
          >
            <p style="margin: 0px;padding: 0px;text-align: right;color: #ffffff;"
            :style="{
              'line-height': bg_css.BgAllWidth / 45.71+'px',
              'font-size': bg_css.BgAllWidth / 96+'px',
              'padding-right': bg_css.BgAllWidth / 24+'px'
            }">{{LoadTime}}</p>
          </div>
        </div>

        <div class="SD_InvDonw">
          <div
            class="SD_InvDonwCss"
            :style="{
              width: bg_css.BgAllWidth / 1.01 + 'px',
              height: bg_css.BgAllWidth / 5.94 + 'px',
            }"
          ></div>
        </div>

        <div class="SD_Inve" style="float: left; width: 100%">
          <!-- <a-cascader :options="options" placeholder="请选择分拣商" style="border: 0px;padding: 0px;margin: 0px;" @change="onChange" > </a-cascader> -->

          <div
            class="SD_InveContText"
            :style="{
              'font-size': bg_css.BgAllWidth / 48 + 'px',
              'font-weight': bg_css.BgAllWidth / 3.2,
              'line-height': bg_css.BgAllWidth / 19.2 + 'px',
              'margin-top': -(bg_css.BgAllWidth / 5.91) + 'px',
            }"
          >
            <p @click="SelectY()">{{corporation+'·'+BigHangYN}}</p>
            <div v-if="SelectYVal" class="SD_Select" style="margin-top: -35px;line-height: 40px;">
              <div class="SD_SelectCss" style="margin: 0 auto;width: 200px;">
                <a-cascader :options="options" placeholder="请选择分拣商" @change="onChange" ></a-cascader>
              </div>
            </div>

          </div>
         
        </div>
      </div>

      <div class="SD_List" :style="{ 'margin-top': -(bg_css.BgAllWidth / 8.73) + 'px' }">
        <div
          class="SD_ListCont"
          style="color: #ffffff"
          :style="{
            width: bg_css.BgAllWidth / 1.02 + 'px',
            height: bg_css.BgAllWidth / 2.02 + 'px',
          }"
        >
          <div
            class="UpTimeInfo"
            style="float: left; width: 100%"
            :style="{
              'margin-top': -(bg_css.BgAllWidth / 11.64) + 'px',
            }"
          >
            <div class="UpTimeInfoL">
              <p
                class="SD_TimeDiff"
                :style="{
                  'padding-left': bg_css.BgAllWidth / 33.1 + 'px',
                }"
              >
                距离上次更新时间：{{UptimeDiff}}
              </p>
            </div>
            <div class="UpTimeInfoR">
              <p
                class="SD_Number"
                :style="{
                  'padding-right': bg_css.BgAllWidth / 25.95 + 'px',
                }"
              >
                总数：{{DetaiList.length}}
              </p>
            </div>
          </div>

          <div
            class="SD_ListCon"
            style="float: left; width: 100%"
            :style="{
              'margin-top': -(bg_css.BgAllWidth / 16) + 'px',
            }"
          >
            <div
              class="SD_ListConOn"
              style="margin: 0 auto"
              :style="{
                width: bg_css.BgAllWidth / 1.09 + 'px',
              }"
            >
              <ul class="SD_LCOnUl">
                <li
                  class="SD_LCOnUl_title"
                  :style="{
                    height: bg_css.BgAllWidth / 33.1 + 'px',
                    'line-height': bg_css.BgAllWidth / 33.1 + 'px',
                  }"
                >
                  <ul>
                    <li><p>发货批次</p></li>
                    <li style="width: 5%"><p>车辆到达</p></li>
                    <li><p>分拣区</p></li>
                    <li style="width: 5%"><p>理货进度</p></li>
                    <li><p>未进场托盘数</p></li>
                    <li style="width: 20%"><p>交接进度</p></li>
                    <li><p>预警状态</p></li>
                    <li><p>上车进度</p></li>
                    <li><p>计划开始时间</p></li>
                    <li><p>计划结束时间</p></li>
                  </ul>
                </li>

              <div
                ref="UserScrollDivTOP"
                style="float: left; overflow: hidden; width: 100%"
                :style="{ height: bg_css.BgAllWidth / 2.65 + 'px' }"
              >
                <div ref="UserScrollTOP1">
                  <li
                    class="SD_LCOnUl_cont"
                    v-for="(item, index) in DetaiList" :key="index"
                    :style="{
                      height: bg_css.BgAllWidth / 29.54 + 'px',
                      'line-height': bg_css.BgAllWidth / 29.54 + 'px',
                    }"
                  >
                    <ul>
                      <li><p>{{item.FBATCHNO}}</p></li>
                      <li style="width: 5%">
                        <div
                          :style="{
                            'margin-top': bg_css.BgAllWidth / 80 + 'px',
                          }"
                        >
                          <i
                            :style="{
                              width: bg_css.BgAllWidth / 120 + 'px',
                              height: bg_css.BgAllWidth / 120 + 'px',
                              'border-radius': bg_css.BgAllWidth / 240 + 'px',  
                              'background': (item.CAR_STATUS)?
                                (item.CAR_STATUS=='到达')?'#2bb410':'rgb(255, 0, 0)':''
                            }"
                          ></i>
                        </div>
                      </li>
                      <li><p>{{item.PICKUPAREA_FNAME}}</p></li>
                      <li style="width: 5%"><p>{{(item.TALLY_TRAY_PROGRESS)?(item.TALLY_TRAY_PROGRESS*100).toFixed(0)+'%':'--'}}</p></li>
                      <li><p>{{item.NOT_ENTRY_TRAY_CNT}}</p></li>
                      <li style="width: 20%" :style="{'padding-left': bg_css.BgAllWidth / 48+'px'}">
                        <div
                          class="SD_OnUlC_ALL"
                          style="float: left"
                          :style="{
                            width: bg_css.BgAllWidth / 8 + 'px',
                            'margin-top': bg_css.BgAllWidth / 87.27 + 'px',
                          }"
                        >
                          <div
                            class="SD_OnUlC_RateS"
                            style="float: left; width: 100%"
                            :style="{ height: bg_css.BgAllWidth / 96 + 'px' }"
                          ></div>
                          <div
                            class="SD_OnUlC_RateY"
                            style="float: left"
                            :style="{
                              width: (bg_css.BgAllWidth / 8) * ((item.TRANSFER_TRAY_PROGRESS)?item.TRANSFER_TRAY_PROGRESS:0) + 'px',
                              height: bg_css.BgAllWidth / 96 + 'px',
                              'margin-top': -(bg_css.BgAllWidth / 96) + 'px',
                            }"
                          ></div>
                          <div
                            class="SD_OnUlC_Text"
                            style="width: 100%; float: left"
                            :style="{
                              'line-height': bg_css.BgAllWidth / 96 + 'px',
                              'margin-top': -(bg_css.BgAllWidth / 96) + 'px',
                            }"
                          >
                            <p :style="{ 'font-size': bg_css.BgAllWidth / 120 + 'px' }">
                              {{((item.TRANSFER_TRAY_CNT)?item.TRANSFER_TRAY_CNT:'--')+'/'+
                                ((item.TRAY_CNT)?item.TRAY_CNT:'--')}}</p>
                          </div>
                        </div>

                        <div
                          class="SD_OnUlC_RateX"
                          style="float: left"
                          :style="{
                            'padding-left': bg_css.BgAllWidth / 96 + 'px',
                          }"
                        >
                          <p>{{(item.TRANSFER_TRAY_PROGRESS)?(item.TRANSFER_TRAY_PROGRESS*100).toFixed(0)+'%':'--'}}</p>
                        </div>
                      </li>
                      <li><p>{{item.WARNING_STATUS}}</p></li>
                      <li><p>{{(item.LOADCAR_TRAY_PROGRESS)?(item.LOADCAR_TRAY_PROGRESS*100).toFixed(0)+'%':'--'}}</p></li>
                      <li><p>{{(item.FPLANTRANSFERBEGINTIME)?item.FPLANTRANSFERBEGINTIME.substring(11,16):'--'}}</p></li>
                      <li><p>{{(item.FPLANTRANSFERENDTIME)?item.FPLANTRANSFERENDTIME.substring(11,16):'--'}}</p></li>
                    </ul>
                  </li>
                </div>
                <div ref="UserScrollTOP2"></div>
              </div>





                <!-- <li
                  class="SD_LCOnUl_cont"
                  :style="{
                    height: bg_css.BgAllWidth / 29.54 + 'px',
                    'line-height': bg_css.BgAllWidth / 29.54 + 'px',
                  }"
                >
                  <ul>
                    <li><p>SFS20210929081</p></li>
                    <li style="width: 5%">
                      <div
                        :style="{
                          'margin-top': bg_css.BgAllWidth / 80 + 'px',
                        }"
                      >
                        <i
                          :style="{
                            width: bg_css.BgAllWidth / 120 + 'px',
                            height: bg_css.BgAllWidth / 120 + 'px',
                            'border-radius': bg_css.BgAllWidth / 240 + 'px',
                          }"
                        ></i>
                      </div>
                    </li>
                    <li><p>N2</p></li>
                    <li style="width: 5%"><p>100%</p></li>
                    <li><p>6</p></li>
                    <li style="width: 20%">
                      <div
                        class="SD_OnUlC_ALL"
                        style="float: left"
                        :style="{
                          width: bg_css.BgAllWidth / 8 + 'px',
                          'margin-top': bg_css.BgAllWidth / 87.27 + 'px',
                        }"
                      >
                        <div
                          class="SD_OnUlC_RateS"
                          style="float: left; width: 100%"
                          :style="{ height: bg_css.BgAllWidth / 96 + 'px' }"
                        ></div>
                        <div
                          class="SD_OnUlC_RateY"
                          style="float: left"
                          :style="{
                            width: (bg_css.BgAllWidth / 8) * 0.8 + 'px',
                            height: bg_css.BgAllWidth / 96 + 'px',
                            'margin-top': -(bg_css.BgAllWidth / 96) + 'px',
                          }"
                        ></div>
                        <div
                          class="SD_OnUlC_Text"
                          style="width: 100%; float: left"
                          :style="{
                            'line-height': bg_css.BgAllWidth / 96 + 'px',
                            'margin-top': -(bg_css.BgAllWidth / 96) + 'px',
                          }"
                        >
                          <p :style="{ 'font-size': bg_css.BgAllWidth / 120 + 'px' }">8/10</p>
                        </div>
                      </div>

                      <div
                        class="SD_OnUlC_RateX"
                        style="float: left"
                        :style="{
                          'padding-left': bg_css.BgAllWidth / 96 + 'px',
                        }"
                      >
                        <p>80%</p>
                      </div>
                    </li>
                    <li><p>正常</p></li>
                    <li><p>0%</p></li>
                    <li><p>10:40</p></li>
                    <li><p>17:20</p></li>
                  </ul>
                </li> -->




              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
var table_width = window.innerWidth

export default {
  name: 'SD_BigBang',
  components: {},
  data() {
    return {
      bg_css: {
        BgAllWidth: table_width,
      },
      corporation: '-1',
      BigHangYN: '-1',
      SelectYVal: false,
      data: [],

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
      UptimeDiff:'',
      RunOne:false,
      LoadTime:'',

      JurDic:[],
      IsAllJur:[],

    }
  },
  created() {  

    this.apiMap2 = {
      'SQL-LC_TRANSFER_D_RT-LC_TRANSFER_D_RT': { resultProp: 'LC_TRANSFER_D_RT' },
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
    // this.corporation = '青岛日日顺智慧物联有限公司';
    // this.BigHangYN = '大挂作业';

    this.FilterCom();
  },
  mounted() {

    this.Usertable_widthNew = table_width
    this.user_data_set();
    this.datav_setTimeout(this,this.apiMap2);
    this.SystemTime(this);

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
  
  methods: {

    onChange(value) {
      // console.log(value);
      // console.log(value[0]);
      // console.log(value[1]);
      this.corporation = value[0];
      this.BigHangYN = value[1]; 
      this.SelectYVal=false;

      clearTimeout(this.timeID); //清除定时器防止速度变快！
      this.RunOne=false;
      this.user_data_set();

    },

    SelectY() {
      if (this.SelectYVal == false) {
        this.SelectYVal = true
      } else {
        this.SelectYVal = false
      }
    },


    FilterCom(){

      this.p1.then(()=>{
        let UserScel=[];
        this.options=[];
        let JurDicAfter=[];
        UserScel = Object.freeze(Array.from(new Set(this.data["LC_TRANSFER_D_RT-LC_TRANSFER_D_RT"].map(_ => _.PICKUPCOMPANY_FNAME))));  //数组的去重获取新的一个数组

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


    datav_setTimeout(set_val,data){
      setTimeout(()=>{
        set_val.ajax_data(data);
        set_val.user_data_set();
        set_val.datav_setTimeout(set_val,data);
      },5000);
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
        PICKUPCOMPANY_FNAME: this.corporation,
        SMALLMODE: this.BigHangYN,
      }
      let curTime = new Date();
      let addHour = curTime.setHours(curTime.getHours() + 1);

      let UserOndat=[];

      promise = this.$fetchSql('LC_TRANSFER_D_RT', 'LC_TRANSFER_D_RT', params).then(({ data }) => {
        UserOndat=data;
        // return { data }
      })
      // 
      let userall= Promise.all([promise,this.p1]); 
      userall.then(() => {
        // console.log(data);
        let data=UserOndat;

        this.UptimeDiff=(data[0])?(data[0].TIME_DIFF)?(data[0].TIME_DIFF).toFixed(2):'--':'--';
        // this.LoadTime=(data[0])?(data[0].LOAD_TIME)?
        //   (data[0].LOAD_TIME.substring(0,4)+'年'+data[0].LOAD_TIME.substring(5,7)+'月'+data[0].LOAD_TIME.substring(8,10)+'日 '+
        //   data[0].LOAD_TIME.substring(11,16)):'--':'--';
        this.DetaiList = data;
        this.DetaiList=this.DetaiList.filter(_=>{return _.TRANSFER_TRAY_PROGRESS!=(1)
          &&(new Date(_["FPLANTRANSFERBEGINTIME"]).getTime(new Date(_["FPLANTRANSFERBEGINTIME"]))<=new Date(addHour).getTime(new Date(addHour)))
          });

        this.DetaiList = this.DetaiList.sort((a, b) => {
          let value_sort = "";
          let a_time = new Date(a["FPLANTRANSFERBEGINTIME"]).getTime(new Date(a["FPLANTRANSFERBEGINTIME"]));
          let b_time = new Date(b["FPLANTRANSFERBEGINTIME"]).getTime(new Date(b["FPLANTRANSFERBEGINTIME"]));
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



        console.log(this.corporation);
        console.log(this.BigHangYN);
        console.log(this.DetaiList);


      })
    },

    rollTOP(t) {

        //把内容重复复制，达到滚动不间断的效果
        if(this.DetaiList.length>11){
          this.scrollTOP2.innerHTML = this.scrollTOP1.innerHTML;
        }else{
          this.scrollTOP2.innerHTML = '';
        }
        // this.$refs["UserScrollTOP2"]=this.$refs["UserScrollTOP1"];
        this.scrolldivTOP.scrollTop = 0;
        let _this=this;
        this.rollStartTOP(_this,t)
    },
    rollStartTOP(set_this,t) {
      if(this.DetaiList.length>11){  
        this.timeID=setTimeout(()=>{
            if ((set_this.scrolldivTOP.scrollTop) >= (set_this.scrollTOP1.scrollHeight)) {
                set_this.scrolldivTOP.scrollTop = 0;
            } else {
                // set_this.scrolldivTOP.scrollTop++;
                this.scrolldivTOP.scrollTop+=2;
            }
            set_this.rollStartTOP(set_this,t);  
        },t);
      } 

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
.SD_BigBangbg {
  background: url('~@/assets/images/datav/StorageSD/fenba/bg.png') no-repeat left top/cover;
  margin: 0 auto;
}

.SD_TitleL {
  background: url('~@/assets/images/datav/StorageSD/fenba/left.png') no-repeat left top/cover;
  margin: 0 auto;
}
.SD_TitleR {
  background: url('~@/assets/images/datav/StorageSD/fenba/right.png') no-repeat left top/cover;
  margin: 0 auto;
}

.SD_InvDonwCss {
  background: url('~@/assets/images/datav/StorageSD/fenba/inverted.png') no-repeat left top/cover;
  margin: 0 auto;
  background-position: 50px 0px;
}

.SD_ListCont {
  background: url('~@/assets/images/datav/StorageSD/fenba/listbg.png') no-repeat left top/cover;
  margin: 0 auto;
}

.SD_InveContText {
  text-align: center;
  color: #ffffff;
  margin: 0px;
}

.SD_InveContText p {
  margin: 0px;
  padding: 0px;
  // font-size: 60px;
  // font-weight: 400;
  color: #ffffff;
  background-image: -webkit-linear-gradient(bottom, #9df7ff, #defdff, #defdff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.UpTimeInfo div p {
  margin: 0px;
  padding: 0px;
}
.UpTimeInfoL {
  float: left;

  font-size: 18px;
  font-weight: 400;
  color: #ffffff;
  opacity: 0.8;
}
.UpTimeInfoR {
  float: right;

  font-size: 18px;
  font-weight: 400;
  color: #ffffff;
  opacity: 0.8;
}

.SD_LCOnUl,
.SD_LCOnUl li ul {
  list-style: none;
  margin: 0px;
  padding: 0px;
}
.SD_LCOnUl li,
.SD_LCOnUl li ul li {
  margin: 0px;
  padding: 0px;
}

.SD_LCOnUl li ul li {
  float: left;
  width: 10%;
}
.SD_LCOnUl li ul li p {
  margin: 0px;
  padding: 0px;
  font-size: 20px;
  font-weight: 400;
  color: #ffffff;
  opacity: 0.8;
  text-align: center;
}

.SD_LCOnUl_title {
  background: #1e5984;
}

.SD_LCOnUl_cont {
  border-bottom: 1px solid #fff;
}

.SD_LCOnUl_cont ul li i {
  font-style: normal;
  display: block;
  margin: 0 auto;
  background: #2bb410;
}
.SD_OnUlC_RateS {
  background: #205481;
}

.SD_OnUlC_RateY {
  background: #2c90db;
}
</style>