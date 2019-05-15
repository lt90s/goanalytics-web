<template>
  <div class="app-container">
    <div class="title">
      <h3>启动次数</h3>
      <el-date-picker
        v-model="datePickerValue"
        type="daterange"
        range-separator="~"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="timestamp"
      />
    </div>
    <cpv-counter :start="datePickerValue[0]" :end="datePickerValue[1]" counter-name="OpenAppCPVCounter" display-name="启动次数" />
  </div>
</template>

<script>
import CpvCounter from '@/components/Counter/CPVCounter'
import dateUtils from '@/utils/date'

export default {
  name: 'OpenApp',
  components: { CpvCounter },
  data() {
    return {
      datePickerValue: [(dateUtils.todayTimestamp() - 30 * 24 * 60 * 60) * 1000, dateUtils.todayTimestamp() * 1000],
    }
  }
}
</script>
