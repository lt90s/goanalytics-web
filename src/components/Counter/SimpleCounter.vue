<template>
  <div>
    <multi-line-chart
      v-if="xAxisData"
      :metrics="[displayName]"
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
    displayName: {
      type: String,
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
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      const descriptorData = {
        descriptors: [{
          type: 'simple',
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
        this.yAxisData[this.displayName] = []
        for (let timestamp = this.start / 1000; timestamp <= this.end / 1000; timestamp += 24 * 3600) {
          this.xAxisData.push(dateUtils.timeStampToString(timestamp))
          let count = 0
          if (data !== undefined && data[timestamp] !== undefined) {
            count = data[timestamp]
          }
          if (this.percent) {
            count *= 100
          }
          this.yAxisData[this.displayName].push(count.toFixed(1))
        }
        console.log(this.xAxisData)
        console.log(this.yAxisData)
      })
    }
  }
}
</script>
