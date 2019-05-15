<template>
  <div>
    <multi-line-chart :metrics="metrics" :x-axis-data="slots" :y-axis-datas="yAxisDatas" />
  </div>
</template>

<script>
import MultiLineChart from '@/components/Charts/MultiLineChart'

export default {
  name: 'SlotCounterLineData',
  components: { MultiLineChart },
  props: {
    scale: {
      type: Number,
      default: 1
    },
    percent: {
      type: Boolean,
      default: false
    },
    stack: {
      type: String,
      default: ''
    },
    slots: {
      type: Array,
      required: true
    },
    slotsMapping: {
      type: Object,
      default: null
    },
    metrics: {
      type: Array,
      required: true
    },
    slotCounter: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      yAxisDatas: null
    }
  },
  watch: {
    slotCounter: {
      deep: true,
      handler() {
        this.setYAxisDatas()
      }
    }
  },
  created() {
    this.setYAxisDatas()
  },
  methods: {
    setYAxisDatas() {
      this.yAxisDatas = {}
      for (const metric of this.metrics) {
        this.yAxisDatas[metric] = []
        for (const slot of this.slots) {
          let value = 0
          if (this.slotCounter[metric] !== undefined && this.slotCounter[metric][slot] !== undefined) {
            value = this.slotCounter[metric][slot]
          }
          this.yAxisDatas[metric].push(value)
        }
      }
    }
  }
}
</script>
