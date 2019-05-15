<template>
  <div v-if="!loading">
    <el-tabs v-model="activeName" class="chart-wrapper">
      <el-tab-pane label="整体趋势" name="summary">
        <multi-line-chart v-if="activeName=='summary'" :x-axis-data="xAxisData" :y-axis-datas="yAxisDataMapping[activeName]" :metrics="[displayName]" />
      </el-tab-pane>
      <el-tab-pane label="渠道对比" name="channel">
        <multi-line-chart v-if="activeName=='channel'" stack="total" :x-axis-data="xAxisData" :y-axis-datas="yAxisDataMapping[activeName]" :metrics="metricMapping[activeName]" />
      </el-tab-pane>
      <el-tab-pane label="平台对比" name="platform">
        <multi-line-chart v-if="activeName=='platform'" stack="total" :x-axis-data="xAxisData" :y-axis-datas="yAxisDataMapping[activeName]" :metrics="metricMapping[activeName]" />
      </el-tab-pane>
      <el-tab-pane label="版本对比" name="version">
        <multi-line-chart v-if="activeName=='version'" stack="total" :x-axis-data="xAxisData" :y-axis-datas="yAxisDataMapping[activeName]" :metrics="metricMapping[activeName]" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getCounter } from '@/api/counter'
import MultiLineChart from '../Charts/MultiLineChart'

import dateUtils from '@/utils/date'

export default {
  name: 'CPVCounter',
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
    channels: {
      type: Array,
      default: null
    },
    versions: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      loading: true,
      xAxisData: [],
      yAxisDataMapping: {},
      metricMapping: {
        channel: this.channels || ['huawei', 'xiaomi', 'google', 'appStore'],
        platform: ['ios', 'android'],
        version: this.versions || ['1.0.0', '1.2.0', '2.0.0']
      },
      activeName: 'summary'
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
          type: 'cpv',
          operator: 'dateCPV',
          name: this.counterName,
          start: this.start / 1000,
          end: this.end / 1000
        }]
      }
      getCounter(descriptorData).then(response => {
        console.log(response.data)
        const data = response.data[this.counterName]
        const displayName = this.displayName
        this.xAxisData = []
        this.yAxisDataMapping = {
          'summary': {
          }
        }
        this.yAxisDataMapping['summary'][displayName] = []
        for (let timestamp = this.start / 1000; timestamp <= this.end / 1000; timestamp += 24 * 3600) {
          this.xAxisData.push(dateUtils.timeStampToString(timestamp))

          if (data.channel === undefined || data.channel[timestamp] === undefined) {
            this.yAxisDataMapping['summary'][displayName].push(0)
          } else {
            let value = 0
            for (const key in data.channel[timestamp]) {
              value += data.channel[timestamp][key]
            }
            this.yAxisDataMapping['summary'][displayName].push(value)
          }
          for (const key in this.metricMapping) {
            if (this.yAxisDataMapping[key] === undefined) {
              this.yAxisDataMapping[key] = {}
            }
            const values = this.metricMapping[key]
            for (const value of values) {
              let count = 0
              if (data[key] !== undefined && data[key][timestamp] !== undefined && data[key][timestamp][value] !== undefined) {
                count = data[key][timestamp][value]
              }
              if (this.yAxisDataMapping[key][value] === undefined) {
                this.yAxisDataMapping[key][value] = []
              }
              this.yAxisDataMapping[key][value].push(count)
            }
          }
        }
        this.loading = false
      })
    }
  }
}
</script>
