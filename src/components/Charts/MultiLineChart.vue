<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    data: {
      type: Array,
      default: null
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '60vh'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    xAxisData: {
      type: Array,
      required: true
    },
    yAxisDatas: {
      type: Object,
      required: true
    },
    metrics: {
      type: Array,
      required: true
    },
    title: {
      type: String,
      default: ''
    },
    stack: {
      type: String,
      default: null
    },
    percent: {
      type: Boolean,
      default: false
    },
    tooltipFormatter: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    yAxisDatas: {
      deep: true,
      handler() {
        this.setOptions()
      }
    }
  },
  mounted() {
    this.initChart()
    if (this.autoResize) {
      this.__resizeHanlder = debounce(() => {
        if (this.chart) {
          this.chart.resize()
        }
      }, 100)
      window.addEventListener('resize', this.__resizeHanlder)
    }

    // 监听侧边栏的变化
    const sidebarElm = document.getElementsByClassName('sidebar-container')[0]
    sidebarElm.addEventListener('transitionend', this.__resizeHanlder)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    if (this.autoResize) {
      window.removeEventListener('resize', this.__resizeHanlder)
    }

    const sidebarElm = document.getElementsByClassName('sidebar-container')[0]
    sidebarElm.removeEventListener('transitionend', this.__resizeHanlder)

    this.chart.dispose()
    this.chart = null
  },
  methods: {
    setOptions() {
      let showLegend = true
      if (this.metrics.length >= 10) {
        showLegend = false
      }
      const option = {
        title: {
          top: 40,
          text: this.title,
          textStyle: {
            fontWeight: 'normal',
            fontSize: 16,
            color: '#5695f3'
          },
          left: 'center'
        },
        xAxis: {
          data: this.xAxisData,
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 20,
          right: 80,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          show: showLegend,
          data: this.metrics
        },
        series: []
      }
      if (this.percent) {
        option.yAxis.axisLabel = {
          show: true,
          interval: 'auto',
          formatter: (value, index) => {
            return value + '%' // value.toString().substr(0, 3) + '%'
          }
        }
      }

      if (this.tooltipFormatter) {
        option.tooltip.formatter = this.tooltipFormatter
      }
      for (const metric of this.metrics) {
        var series = {
          name: metric,
          stack: this.stack,
          smooth: true,
          type: 'line',
          symbol: 'circle',
          symbolSize: 5,
          showSymbol: true,
          lineStyle: {
            normal: {
              width: 1
            }
          },
          data: this.yAxisDatas[metric],
          animationDuration: 1000,
          animationEasing: 'cubicInOut'
        }
        if (this.stack) {
          series['areaStyle'] = {}
        } else if (!this.percent) {
          series['itemStyle'] = {
            normal: {
              borderWidth: 12,
              label: {
                show: true
              }
            }
          }
        }
        console.log(series)
        option.series.push(series)
      }
      this.chart.setOption(option, true)
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions()
    }
  }
}
</script>
