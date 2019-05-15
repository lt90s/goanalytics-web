<template>
  <div>
    <multi-line-chart
      v-if="xAxisData"
      :metrics="metrics"
      :x-axis-data="xAxisData"
      :y-axis-datas="yAxisData"
      :percent="percent"
    />
  </div>
</template>

<script>
import { getCounter } from '@/api/counter'
import MultiLineChart from '../Charts/MultiLineChart'

import dateUtils from '@/utils/date'

export default {
  name: 'SimpleCounter',
  components: { MultiLineChart },
  props: {
    start: {
      type: Number,
      required: true
    },
    end: {
      type: Number,
      required: true
    },
    counterName: {
      type: String,
      required: true
    },
    slotsMapping: {
      type: Object,
      required: true
    },
    percent: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      xAxisData: null,
      yAxisData: {}
    }
  },
  watch: {
    start: function() {
      this.loadData()
    },
    end: function() {
      this.loadData()
    }
  },
  computed: {
    metrics() {
      const tmp = []
      for (const key in this.slotsMapping) {
        tmp.push(this.slotsMapping[key])
      }
      return tmp
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      const descriptorData = {
        descriptors: [{
          type: 'slot',
          operator: 'span',
          name: this.counterName,
          start: this.start / 1000,
          end: this.end / 1000
        }]
      }
      getCounter(descriptorData).then(response => {
        console.log(response)
        const data = response.data[this.counterName]
        this.xAxisData = []
        this.yAxisData = {}
        for (const metric of this.metrics) {
          this.yAxisData[metric] = []
        }
        console.log(this.yAxisData)
        for (let timestamp = this.start / 1000; timestamp <= this.end / 1000; timestamp += 24 * 3600) {
          this.xAxisData.push(dateUtils.timeStampToString(timestamp))
          for (const slot in this.slotsMapping) {
            let count = 0
            if (data !== undefined && data[timestamp] !== undefined && data[timestamp][slot] !== undefined) {
              count = data[timestamp][slot]
            }
            if (this.percent) {
              count *= 100
            }
            console.log(slot, this.slotsMapping[slot])
            this.yAxisData[this.slotsMapping[slot]].push(count.toFixed(1))
          }
        }
        console.log(this.xAxisData)
        console.log(this.yAxisData)
      })
    }
  }
}
</script>
