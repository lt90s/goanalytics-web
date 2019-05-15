<template>
  <div class="app-container">
    <div class="title">
      <h3>使用频率</h3>
      <el-date-picker
        v-model="datePickerValue"
        type="date"
        value-format="timestamp"
      />
    </div>

    <div class="chart-wrapper">
      <p>日启动次数分布</p>
      <slot-counter-bar
        :date="datePickerValue"
        slot-counter-name="OpenAppCountDistributionSlotCounter"
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
      slotsMapping: {
        '1-2': '1-2',
        '3-4': '3-4',
        '5-6': '5-6',
        '7-8': '7-8',
        '9-10': '9-10',
        '11-20': '11-20',
        '21-30': '21-30',
        '31-49': '31-49',
        '50+': '50+'
      },
      datePickerValue: (dateUtils.todayTimestamp() - 24 * 3600) * 1000
    }
  }
}
</script>

