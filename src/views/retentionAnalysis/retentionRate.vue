<template>
  <div class="app-container">
    <div class="title">
      <h3>留存用户</h3>
      <el-date-picker
        v-model="datePickerValue"
        type="daterange"
        range-separator="~"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="timestamp"
      />
      <el-select v-model="channelOption" @change="channelOptionChanged">
        <el-option label="全部渠道" value="all" />
        <el-option v-for="channel in channels" :key="channel" :label="channel" :value="channel" />
      </el-select>
    </div>
    <el-tabs tab-position="top" class="chart-wrapper">
      <el-tab-pane :lazy="true" label="新用户留存">
        <slot-counter-table
          :start="datePickerValue[0]"
          :end="datePickerValue[1]"
          totalCounterName="NewUserCPVCounter"
          totalCounterDisplayName="新增用户"
          :totalCounterKind="channelOption === 'all' ? 'CPV' : 'CPV_C_' + channelOption"
          :slotCounterName="channelOption === 'all' ? 'NewUserRetentionSlotCounter' : 'channelNewUserRetentionSlotCounter_' + channelOption"
          :slotsMapping="slotsMapping"
        />
      </el-tab-pane>
      <el-tab-pane :lazy="true" label="活跃用户留存">
        <slot-counter-table
          :start="datePickerValue[0]"
          :end="datePickerValue[1]"
          totalCounterName="DailyActiveCPVCounter"
          totalCounterDisplayName="活跃用户"
          :totalCounterKind="channelOption === 'all' ? 'CPV' : 'CPV_C_' + channelOption"
          :slotCounterName="channelOption === 'all' ? 'ActiveUserRetentionSlotCounter' : 'channelActiveUserRetentionSlotCounter_' + channelOption"
          :slotsMapping="slotsMapping"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import SlotCounterTable from '@/components/Counter/SlotCounterTable'
import dateUtils from '@/utils/date'

export default {
  name: 'OpenApp',
  components: { SlotCounterTable },
  data() {
    return {
      channelOption: 'all',
      slotsMapping: {
        1: '1天后',
        2: '2天后',
        3: '3天后',
        4: '4天后',
        5: '5天后',
        6: '6天后',
        7: '7天后',
        15: '15天后',
        30: '30天后'
      },
      datePickerValue: [(dateUtils.todayTimestamp() - 30 * 24 * 60 * 60) * 1000, dateUtils.todayTimestamp() * 1000],
    }
  },
  computed: {
    ...mapGetters([
      'appId',
      'channels'
    ])
  },
  methods: {
    channelOptionChanged() {

    }
  }
}
</script>
