<template>
  <div class="app-container">
    <div class="title">
      <h3>活跃用户分析</h3>
      <el-date-picker
        v-model="datePickerValue"
        type="daterange"
        range-separator="~"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="timestamp"
      />
    </div>
    <el-tabs tab-position="top" class="chart-wrapper">
      <el-tab-pane :lazy="true" label="活跃趋势">
        <cpv-counter
          :start="datePickerValue[0]"
          :end="datePickerValue[1]"
          counter-name="DailyActiveCPVCounter"
          display-name="活跃用户"
        />
      </el-tab-pane>
      <el-tab-pane :lazy="true" label="活跃构成">
        <simple-counter
          :start="datePickerValue[0]"
          :end="datePickerValue[1]"
          counter-name="DailyActiveNewUserPercentSimpleCounter"
          display-name="新增用户占比"
          :percent="true"
        />
      </el-tab-pane>
      <el-tab-pane :lazy="true" label="活跃粘度">
        <slot-counter-line
          :start="datePickerValue[0]"
          :end="datePickerValue[1]"
          counter-name="DailyActiveUserAffinitySlotCounter"
          :slots-mapping="slotsMapping"
          :percent="true"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import CpvCounter from '@/components/Counter/CPVCounter'
import SimpleCounter from '@/components/Counter/SimpleCounter'
import SlotCounterLine from '@/components/Counter/SlotCounterLine'
import dateUtils from '@/utils/date'

export default {
  name: 'UserAnalysisIncrease',
  components: { CpvCounter, SimpleCounter, SlotCounterLine },
  data() {
    return {
      slotsMapping: {
        7: 'DAU/过去7日活跃用户',
        15: 'DAU/过去15日活跃用户',
        30: 'DAU/过去30日活跃用户'
      },
      datePickerValue: [(dateUtils.todayTimestamp() - 30 * 24 * 60 * 60) * 1000, dateUtils.todayTimestamp() * 1000]
    }
  }
}
</script>
