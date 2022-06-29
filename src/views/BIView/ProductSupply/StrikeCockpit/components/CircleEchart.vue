<template>
<!--    <v-chart ref="echart" style="overflow: visible;height: 136px;height: 136px" class="Circle" :options="echart" autoresize></v-chart>-->
    <div :id="'circle' + id"></div>
</template>

<script>
import * as echarts from 'echarts5/lib/echarts'
import 'echarts5/lib/chart/pie'
import 'echarts5/lib/component/tooltip'
import 'echarts5/lib/component/title'
import 'echarts5/lib/component/graphic'
export default {
    name: 'CircleEchart',
    props: {
        label: {
            type: String,
            default: '达成'
        },
        value: {
            type: [Number, String],
            default: '--',
        },
        id: {
            type: [Number, String],
            default: 1
        },
        comp: {
            type: String,
        },
    },
    watch: {
        value: {
            handler() {
                this.initCircle()
            }
        }
    },
    mounted() {
        this.initCircle()
    },
    computed: {
        echart() {
            return {
                // 设置环心
                graphic: [
                    {
                        type: 'text',
                        left: 'center',
                        top: 'center',
                        z: 10,
                        style: {
                            fill: this.color,
                            // 达成率
                            // text: this.overviewData.length ?  this.overviewData[this.currentTab - 1].CMP_RATE + '%' : 0,
                            text: this.value === '--' ? '--' : (this.value * 100).toFixed(1) + '%',
                            font: '20px "PingFangSC-Medium", "PingFang SC"'
                        }
                    },
                    {
                        type: 'text',
                        left: 'center',
                        top: '70%',
                        z: 10,
                        style: {
                            fill: 'rgba(0, 0, 0, 0.65)',
                            text: this.label,
                            font: '14px "PingFangSC-Regular", "PingFang SC"'
                        }
                    }
                ],
                series: [
                    // 数据
                    {
                        silent: true,
                        color: ['#5A8DF3','transparent','transparent'],
                        name: 'Access From',
                        type: 'pie',
                        radius: ['60%', '70%'],
                        avoidLabelOverlap: false,
                        startAngle: 234,
                        itemStyle: {
                            borderRadius: '50%'
                        },
                        label: {
                            show: false,
                        },
                        emphasis: {
                            inherit: 'transparent',
                            scale: false,
                            label: {
                                show: true,
                                fontSize: '40',
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: [
                            // 达成率   80是显示的条 20是隐藏的条用来占位 然后80里再分达成率
                            // { value: this.CMP_RATE * 80, name: '达成率' },
                            // { value: (1 - this.CMP_RATE) * 80, name: '未达成率' },
                            { value: this.value >= 1 ? 80 : this.value * 80, name: '达成率' },
                            { value: this.value >= 1 ? 0 : (1 - this.value) * 80, name: '未达成率' },
                            { value: 20, name: ''}
                        ],
                        z: 2
                    },
                    // 背景
                    {
                        silent: true,
                        color: ['#F0F0F0','transparent'],
                        name: 'Access From',
                        type: 'pie',
                        radius: ['60%', '70%'],
                        avoidLabelOverlap: false,
                        startAngle: 234,
                        itemStyle: {
                            borderRadius: '50%'
                        },
                        label: {
                            show: false,
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: '40',
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: [
                            { value: 800},
                            { value: 200}
                        ],
                        z: 1
                    }
                ]
            }
        },
        color() {
            let str = '#333'
            let red = '#ff5953'
            let green = '#00a854'
            if(this.comp === 'Activity') {
                if(this.value >= 1) str = red
                else if(this.value < 1) str = green
            }
            else if(this.comp === 'T1_PaymentPerformance') {
                if(this.value > 1) str = red
                else if(this.value <= 1) str = green
            }
            return str
        }
    },
    beforeDestroy() {
        if(this.circle !== null) this.circle.dispose()
    },
    data() {
        return {
            circle: null,
        }
    },
    methods: {
        initCircle() {
            if(this.circle === null) this.circle = echarts.init(document.getElementById('circle' + this.id))
            let myChart = this.circle
            // 绘制图表
            myChart.setOption(this.echart);
            window.addEventListener('resize', () => {
                myChart.resize()
            })
        },
    }
}
</script>

<style lang="scss" scoped>
.Circle{
    width: 136px;
    height: 136px;
}
</style>