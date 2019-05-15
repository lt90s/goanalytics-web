<template>
  <div class="app-container">
    <h3>实时统计</h3>
    <div class="metric-container">
      <ul class="metric-list">
        <li
          v-for="metric in displayMetrics"
          :key="metric.counterName"
          :class="{'metric-item-active': activeMetric === metric.counterName}"
          class="metric-item"
          @click="clickCounterItem(metric.counterName)"
        >
          <div class="metric-item-title">{{ metric.displayName }}(今日)</div>
          <div class="metric-item-number">{{ amount(metric.counterName) }}</div>
          <div class="metric-item-rate">
            <span class="metric-item-rate-date">昨日</span>
            <span class="metric-item-rate-number">{{ rate(metric.counterName) }}</span>
            <span>
              <svg-icon :icon-class="rate(metric.counterName).startsWith('-') ? 'bottom' : 'top'" />
            </span>
          </div>
        </li>
      </ul>
      <slot-counter-line-data :metrics="metrics" :slots="timeSlots" :slot-counter="slotCounter" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getCounter } from '@/api/counter'
import dateUtils from '@/utils/date'

import SlotCounterLineData from '@/components/Counter/SlotCounterLineData'

export default {
  name: 'Dashboard',
  components: { SlotCounterLineData },
  data() {
    return {
      todayTimestamp: dateUtils.todayTimestamp(),
      yesterdayTimestamp: dateUtils.todayTimestamp() - 24 * 60 * 60,
      counterNames: ['NewUserTimeDistributionSlotCounter', 'OpenAppTimeDistributionSlotCounter', 'ActiveUserTimeDistributionSlotCounter'],
      displayMetrics: [{
        'displayName': '新增用户',
        'counterName': 'NewUserTimeDistributionSlotCounter'
      }, {
        'displayName': '启动次数',
        'counterName': 'OpenAppTimeDistributionSlotCounter'
      }, {
        'displayName': '时段累计日活',
        'counterName': 'ActiveUserAccumulateTimeSlotCounter'
      }, {
        'displayName': '分时活跃用户',
        'counterName': 'ActiveUserTimeDistributionSlotCounter'
      }],
      hour: dateUtils.nowHour(),
      data: null,
      activeMetric: 'NewUserTimeDistributionSlotCounter',
      metrics: ['昨日', '今日'],
      slotCounter: {}
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ]),
    descriptorData: function() {
      const descriptors = []
      for (const name of this.counterNames) {
        descriptors.push({
          type: 'slot',
          name: name,
          operator: 'span',
          start: this.yesterdayTimestamp,
          end: this.todayTimestamp
        })
      }
      return {
        'descriptors': descriptors
      }
    },
    timeSlots: function() {
      const slots = []
      for (let i = 0; i < 24; i++) {
        slots.push(i.toString())
      }
      return slots
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      getCounter(this.descriptorData).then(response => {
        const data = response.data
        data['ActiveUserAccumulateTimeSlotCounter'] = {}
        if (data['ActiveUserTimeDistributionSlotCounter']) {
          for (const timestamp of [this.yesterdayTimestamp, this.todayTimestamp]) {
            data['ActiveUserAccumulateTimeSlotCounter'][timestamp] = {}
            if (data['ActiveUserTimeDistributionSlotCounter'][timestamp] === undefined) {
              continue
            }
            for (const index in this.timeSlots) {
              const slot = this.timeSlots[index]
              data['ActiveUserAccumulateTimeSlotCounter'][timestamp][slot] = data['ActiveUserTimeDistributionSlotCounter'][timestamp][slot] || 0
              if (index > 0) {
                const preSlot = this.timeSlots[index - 1]
                data['ActiveUserAccumulateTimeSlotCounter'][timestamp][slot] += data['ActiveUserAccumulateTimeSlotCounter'][timestamp][preSlot]
              }
            }
          }
        }
        console.log(data)
        this.data = data
        this.clickCounterItem(this.activeMetric)
      })
    },
    amount(name, timestamp) {
      if (timestamp === undefined) {
        timestamp = this.todayTimestamp
      }
      if (this.data !== null &&
        this.data[name] !== undefined &&
        this.data[name][timestamp] !== undefined &&
        this.data[name][timestamp][this.hour] !== undefined) {
        return this.data[name][timestamp][this.hour]
      } else {
        return 0
      }
    },
    rate(name) {
      const today = this.amount(name, this.todayTimestamp)
      const yesterday = this.amount(name, this.yesterdayTimestamp)
      if (today === 0) {
        return '-100%'
      } else if (yesterday === 0) {
        return '+?'
      }
      const rate = (today - yesterday) * 1.0 / yesterday * 100
      if (rate >= 0) {
        return '+' + rate.toFixed(2) + '%'
      } else {
        return rate.toFixed(2) + '%'
      }
    },
    clickCounterItem(name) {
      console.log(this.todayTimestamp, this.yesterdayTimestamp)
      this.activeMetric = name
      this.slotCounter = {
        '今日': this.data[name][this.todayTimestamp],
        '昨日': this.data[name][this.yesterdayTimestamp]
      }
    }
  }
}
</script>

<style scoped>
.metric-container {
  background-color: #fff;
  padding: 16px 0;
}

.metric-list {
  padding: 0;
  margin: 0 16px;
}
.metric-item {
  list-style: none;
  display: inline-block;
  padding: 24px 18px;
  border: 2px solid transparent;
  cursor: pointer;
}

.metric-item:hover {
  background: rgba(80, 80, 80, 0.1);
}

.metric-item-active {
  border-color: #2196F3;
  cursor: default;
  background-color: #fff;
}

.metric-item-number {
  font-size: 24px;
  font-weight: 400;
  margin: 12px 0;
}
</style>
