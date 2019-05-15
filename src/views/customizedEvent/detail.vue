<template>
  <div class="app-container">
    <h3>自定义事件详情 -- {{ customizedCounter.displayName }}</h3>
    <el-date-picker
      v-model="datePickerValue"
      type="daterange"
      range-separator="~"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      value-format="timestamp"
    />
    <div class="chart-wrapper">
      <simple-counter
        v-if="customizedCounter.type === 'simple'"
        :start="datePickerValue[0]"
        :end="datePickerValue[1]"
        :counterName="customizedCounter.name + '__customized'"
        :displayName="customizedCounter.displayName"
      />
      <slot-counter-table
        v-if="customizedCounter.type === 'slot'"
        :start="datePickerValue[0]"
        :end="datePickerValue[1]"
        :slotCounterName="customizedCounter.name + '__customized'"
        :slotsMapping="getSlotsMapping(customizedCounter.slots)"
      />
      <cpv-counter
        v-if="customizedCounter.type === 'cpv'"
        :start="datePickerValue[0]"
        :end="datePickerValue[1]"
        :counterName="customizedCounter.name + '__customized'"
        :displayName="customizedCounter.displayName"
        :channels="customizedCounter.channels"
        :versions="customizedCounter.versions"
      />
    </div>
  </div>
</template>

<script>
import dateUtils from '@/utils/date'
import SimpleCounter from '@/components/Counter/SimpleCounter'
import SlotCounterTable from '@/components/Counter/SlotCounterTable'
import CpvCounter from '@/components/Counter/CPVCounter'

export default {
  name: 'CustomizedEventDetail',
  components: { SimpleCounter, SlotCounterTable, CpvCounter },
  data() {
    return {
      datePickerValue: [(dateUtils.todayTimestamp() - 30 * 24 * 60 * 60) * 1000, dateUtils.todayTimestamp() * 1000],

      localStorage: {
        customizedCounter: {
          type: Object
        }
      },
      customizedCounter: {}
    }
  },
  created() {
    this.customizedCounter = JSON.parse(this.$localStorage.get('customizedCounter'))
  },
  methods: {
    getSlotsMapping(slots) {
      const mapping = {}
      for (const slot of slots) {
        mapping[slot] = slot
      }
      return mapping
    }
  }
}

</script>
