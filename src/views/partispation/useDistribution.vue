<template>
  <div class="app-container">
    <div class="title">
      <h3>使用分布</h3>
      <el-date-picker
        v-model="datePickerValue"
        type="date"
        value-format="timestamp"
      />
    </div>

    <div class="chart-wrapper">
      <p>日启动时段分布</p>
      <slot-counter-bar
        :date="datePickerValue"
        slot-counter-name="OpenAppTimeDistributionSlotCounter"
        :slots-mapping="slotsMapping"
      />
    </div>
  </div>
</template>

<script>

import SlotCounterBar from '@/components/Counter/SlotCounterBar'
import dateUtils from '@/utils/date'

export default {
  name: 'OpenApp',
  components: { SlotCounterBar },
  data() {
    return {
      channelOption: 'all',
      datePickerValue: (dateUtils.todayTimestamp() - 24 * 3600) * 1000
    }
  },
  computed: {
    slotsMapping() {
      const mapping = {}
      for (let i = 0; i < 24; i++) {
        mapping[i] = i + '-' + (i + 1)
      }
      return mapping
    }
  }
}
</script>

