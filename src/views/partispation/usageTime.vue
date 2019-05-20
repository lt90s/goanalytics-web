<template>
  <div class="app-container">
    <div>
      <h3>使用时长分布</h3>
      <el-date-picker
        v-model="datePickerValue"
        type="date"
        value-format="timestamp"
      />
    </div>

    <div class="chart-wrapper">
      <p>单次使用时长分布</p>
      <slot-counter-bar
        :date="datePickerValue"
        slot-counter-name="EachUsageTimeDistributionSlotCounter"
        :slots-mapping="slotsMapping"
      />
      <hr style="margin-top: 24px; margin-bottom: 24px">
      <p>日使用时长分布</p>
      <slot-counter-bar
        :date="datePickerValue"
        slot-counter-name="DailyUsageTimeDistributionSlotCounter"
        :slots-mapping="slotsMapping"
      />
    </div>
    <div>
      <h3>平均使用时长</h3>
      <el-date-picker
        v-model="datePickerRangeValue"
        type="daterange"
        range-separator="~"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="timestamp"
      />
      <div class="chart-wrapper">
        <simple-counter
          :start="datePickerRangeValue[0]"
          :end="datePickerRangeValue[1]"
          counter-name="EachUsageAverageTimeSimpleCounter"
          display-name="单次平均使用时长"
        />
        <hr style="margin-top: 24px; margin-bottom: 24px">
        <simple-counter
          :start="datePickerRangeValue[0]"
          :end="datePickerRangeValue[1]"
          counter-name="DailyUsageAverageTimeSimpleCounter"
          display-name="日平均使用时长"
        />
      </div>
    </div>
  </div>
</template>

<script>

import SlotCounterBar from '@/components/Counter/SlotCounterBar'
import SimpleCounter from '@/components/Counter/SimpleCounter'
import dateUtils from '@/utils/date'

export default {
  name: 'OpenApp',
  components: { SlotCounterBar, SimpleCounter },
  data() {
    return {
      channelOption: 'all',
      datePickerValue: (dateUtils.todayTimestamp() - 24 * 3600) * 1000,
      datePickerRangeValue: [(dateUtils.todayTimestamp() - 30 * 24 * 60 * 60) * 1000, dateUtils.todayTimestamp() * 1000],
      slotsMapping: {
        '1-3': '1秒-3秒',
        '3-10': '4秒-10秒',
        '11-30': '11秒-30秒',
        '31-60': '31秒-1分',
        '61-180': '1分-3分',
        '181-600': '3分-10分',
        '601-1800': '10分-30分',
        '1800+': '30分+'
      }
    }
  }
}
</script>

