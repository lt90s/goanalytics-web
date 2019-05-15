<template>
  <div>
    <el-table
      :data="timestamps"
      highlight-current-row
      border
      style="width: 100%">
      <el-table-column label="时间" align="center">
        <template slot-scope="scope">
          {{ timestamp2datestring(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column :label="totalCounterDisplayName" align="center">
        <template slot-scope="scope">
          {{ totalColumn(scope.row)}}
        </template>
      </el-table-column>
      <el-table-column v-for="(name, slot) in slotsMapping" :key="slot" :label="name" align="center">
        <template slot-scope="scope">
          {{ slotColumn(scope.row, slot) }}
        </template>
      </el-table-column>
    </el-table>

    <hr style="margin: 40px 0;">

    <div style="display: flex; justify-content: space-between; align-items: center">
      <h3>趋势</h3>
      <el-select v-model="slotOption" @change="updateRetentionTrend">
        <el-option v-for="(name, slot) in slotsMapping" :key="name" :label="name" :value="slot" />
      </el-select>
    </div>
    <multi-line-chart v-if="yAxisDatas" :percent="true" :metrics="[slotsMapping[slotOption]]" :x-axis-data="xAxisData" :y-axis-datas="yAxisDatas" />
  </div>
</template>

<script>
import { getSlotCounter, getCpvCounter } from '@/api/counter'
import dateUtils from '../../utils/date'
import MultiLineChart from '@/components/Charts/MultiLineChart'

export default {
  name: 'SlotCounterTable',
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
    totalCounterName: {
      type: String,
      default: ''
    },
    totalCounterDisplayName: {
      type: String,
      default: '总计'
    },
    totalCounterKind: {
      type: String,
      default: ''
    },
    slotCounterName: {
      type: String,
      required: true
    },
    slotsMapping: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      loading: false,
      slotOption: '',
      totalStats: null,
      slotStats: null,
      timestamps: null,
      xAxisData: null,
      yAxisDatas: null
    }
  },
  watch: {
    start: function() {
      this.loadData()
    },
    end: function() {
      this.loadData()
    },
    slotCounterName: function() {
      this.loadData()
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      if (this.loading) {
        return
      }
      this.loading = true
      getSlotCounter(this.slotCounterName, 'span', this.start / 1000, this.end / 1000).then(response => {
        this.loading = false
        const stats = response.data
        console.log(response.data)
        this.slotStats = stats[this.slotCounterName]
        const parts = this.totalCounterKind.split('_')
        if (parts[0] === 'CPV') {
          let op = 'dateSum'
          if (parts[1] === 'C') {
            op = 'channelDateSum_' + parts[2]
          }
          getCpvCounter(this.totalCounterName, op, this.start / 1000, this.end / 1000).then(response => {
            console.log(response.data)
            this.totalStats = response.data[this.totalCounterName]
            this.updateRetentionTrend()
          })
        } else {
          this.totalStats = {}
          for (let x = this.start / 1000; x <= this.end / 1000; x += 24 * 3600) {
            this.totalStats[x] = 0
            for (const slot in this.slotsMapping) {
              if (this.slotStats[x] !== undefined && this.slotStats[x][slot] !== undefined) {
                this.totalStats[x] += this.slotStats[x][slot]
              }
            }
          }
        }
      }).catch(() => {
        this.loading = false
      })
      this.timestamps = []
      for (var x = this.start / 1000; x <= this.end / 1000; x += 24 * 3600) {
        this.timestamps.push(x)
      }
    },
    timestamp2datestring(ts) {
      return dateUtils.timeStampToString(ts)
    },
    totalColumn(ts) {
      if (!this.totalStats || this.totalStats[ts] === undefined) {
        return 0
      } else {
        return this.totalStats[ts]
      }
    },
    slotColumn(ts, slot) {
      if (!this.slotStats || this.slotStats[ts] === undefined || this.slotStats[ts][slot] === undefined) {
        return 0
      } else {
        const a = this.slotStats[ts][slot]
        const b = this.totalColumn(ts)
        if (b !== 0) {
          return a.toString() + ' (' + (a / b * 100).toFixed(1) + '%)'
        } else {
          return a.toString() + ' (-)'
        }
      }
    },
    updateRetentionTrend() {
      this.xAxisData = []
      this.yAxisDatas = {}
      const slot = this.slotOption
      const metric = this.slotsMapping[this.slotOption]
      this.yAxisDatas[metric] = []
      for (let timestamp = this.start / 1000; timestamp <= this.end / 1000; timestamp += 24 * 3600) {
        this.xAxisData.push(dateUtils.timeStampToString(timestamp))
        if (!this.slotStats || this.slotStats[timestamp] === undefined || this.slotStats[timestamp][slot] === undefined) {
          this.yAxisDatas[metric].push(0)
        } else {
          const a = this.slotStats[timestamp][slot]
          const b = this.totalColumn(timestamp)
          if (b !== 0) {
            this.yAxisDatas[metric].push((a / b * 100).toFixed(1))
          } else {
            this.yAxisDatas[metric].push(0)
          }
        }
      }
      console.log(this.xAxisData)
      console.log(this.yAxisDatas)
    }
  }
}
</script>

<style scoped>
</style>
