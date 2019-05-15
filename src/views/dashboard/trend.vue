<template>
  <div class="app-container">
    <h2>整体趋势</h2>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="metric-wrapper">
          <el-row :gutter="80">
            <el-col :span="12">
              <div class="metric-item">
                <div>
                  <span class="metric-item-title">新增用户(7日平均)</span>
                  <span class="metric-item-number">{{ (data.newUser7 / 7).toFixed(0) }}</span>
                  <div>
                    <span>同比</span>
                    <span>{{ rate(data.newUser7/7, data.newUser14/7)}}</span>
                    <span>
                      <svg-icon :icon-class="rate(data.newUser7/7, data.newUser14/7).startsWith('-') ? 'bottom' : 'top'" />
                    </span>
                  </div>
                </div>
                <svg-icon icon-class="new-user" style="font-size: 32px"/>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="metric-item">
                <div>
                  <span class="metric-item-title">活跃用户(7日平均)</span>
                  <span class="metric-item-number">{{ (data.activeUser7 / 7).toFixed(0) }}</span>
                  <div>
                    <span>同比</span>
                    <span>{{ rate(data.activeUser7/7, data.activeUser14/7)}}</span>
                    <span>
                      <svg-icon :icon-class="rate(data.activeUser7/7, data.activeUser14/7).startsWith('-') ? 'bottom' : 'top'" />
                    </span>
                  </div>
                </div>
                <svg-icon icon-class="user-active" style="font-size: 32px"/>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="80" style="margin-top:32px">
            <el-col :span="12">
              <div class="metric-item">
                <div>
                  <span class="metric-item-title">新用户次日留存率(7日平均)</span>
                  <span class="metric-item-number">{{ percentValue(data.retention7) }}</span>
                  <div>
                    <span>同比</span>
                    <span>{{ rate(data.retention7, data.retention14)}}</span>
                    <span>
                      <svg-icon :icon-class="rate(data.retention7, data.retention14).startsWith('-') ? 'bottom' : 'top'" />
                    </span>
                  </div>
                </div>
                <svg-icon icon-class="retention-metric" style="font-size: 32px"/>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="metric-item">
                <div>
                  <span class="metric-item-title">活跃用户次日留存率(7日平均)</span>
                  <span class="metric-item-number">{{ percentValue(data.activeRetention7) }}</span>
                  <div>
                    <span>同比</span>
                    <span>{{ rate(data.activeRetention7, data.activeRetention14) }}</span>
                    <span>
                      <svg-icon :icon-class="rate(data.activeRetention7, data.activeRetention14).startsWith('-') ? 'bottom' : 'top'" />
                    </span>
                  </div>
                </div>
                <svg-icon icon-class="retention-active" style="font-size: 32px" />
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="metric-wrapper">
          <el-row :gutter="80">
            <el-col :span="12">
              <div class="metric-item">
                <div>
                  <span class="metric-item-title">近7日总活跃用户数</span>
                  <span class="metric-item-number">{{ data.activeUser7 }}</span>
                  <div>
                    <span>同比</span>
                    <span>{{ rate(data.activeUser7, data.activeUser14) }}</span>
                    <span>
                      <svg-icon :icon-class="rate(data.activeUser7, data.activeUser14).startsWith('-') ? 'bottom' : 'top'" />
                    </span>
                  </div>
                </div>
                <svg-icon icon-class="week" style="font-size: 32px" />
              </div>
            </el-col>
            <el-col :span="12">
              <div class="metric-item">
                <div>
                  <span class="metric-item-title">近30日总活跃用户数</span>
                  <span class="metric-item-number">{{ data.activeUser30 }}</span>
                  <div>
                    <span>同比</span>
                    <span>{{ rate(data.activeUser30, data.activeUser60) }}</span>
                    <span>
                      <svg-icon :icon-class="rate(data.activeUser30, data.activeUser60).startsWith('-') ? 'bottom' : 'top'" />
                    </span>
                  </div>
                </div>
                <svg-icon icon-class="month" style="font-size: 32px" />
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="80" style="margin-top:32px">
            <el-col :span="12">
              <div class="metric-item">
                <div>
                  <span class="metric-item-title">累计用户数</span>
                  <span class="metric-item-number">{{ data.totalUser }}</span>
                  <div>&nbsp;</div>
                </div>
                <svg-icon icon-class="users-metric" style="font-size: 32px" />
              </div>
            </el-col>
            <el-col :span="12">
              <div class="metric-item">
                <div>
                  <span class="metric-item-title">累计注册用户数</span>
                  <span class="metric-item-number">{{ data.totalRegisteredUser }}</span>
                </div>
                <svg-icon icon-class="users-register-metric" style="font-size: 32px" />
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>

    <div class="chart-wrapper">
      <el-date-picker
        v-model="datePickerValue"
        type="daterange"
        range-separator="~"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="timestamp"
      />
      <el-tabs tab-position="top" style="margin-top: 20px;">
        <el-tab-pane :lazy="true" label="新增用户">
          <cpv-counter
            :start="datePickerValue[0]"
            :end="datePickerValue[1]"
            counter-name="NewUserCPVCounter"
            display-name="新增用户"
          />
        </el-tab-pane>
        <el-tab-pane :lazy="true" label="活跃用户">
          <cpv-counter
            :start="datePickerValue[0]"
            :end="datePickerValue[1]"
            counter-name="DailyActiveCPVCounter"
            display-name="活跃用户"
          />
        </el-tab-pane>
        <el-tab-pane :lazy="true" label="启动次数">
          <cpv-counter
            :start="datePickerValue[0]"
            :end="datePickerValue[1]"
            counter-name="OpenAppCPVCounter"
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
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { getTrend } from '@/api/counter'
import dateUtils from '@/utils/date'

import CpvCounter from '@/components/Counter/CPVCounter'
import SimpleCounter from '@/components/Counter/SimpleCounter'

export default {
  name: 'Trend',
  components: { CpvCounter, SimpleCounter },
  data() {
    return {
      data: {},
      datePickerValue: [(dateUtils.todayTimestamp() - 30 * 24 * 60 * 60) * 1000, (dateUtils.todayTimestamp() - 24 * 60 * 60) * 1000]
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      getTrend().then(response => {
        console.log(response)
        this.data = response.data
      })
    },
    percentValue(p) {
      return (p * 100).toFixed(1) + '%'
    },
    rate(a, b) {
      if (b === 0) {
        return '-'
      }
      return ((a - b) / b * 100).toFixed(1) + '%'
    }
  }
}
</script>

<style scoped>
.metric-wrapper {
  background-color: #fff;
  padding: 18px 24px;
}

.metric-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.metric-item-title {
  font-size: 14px;
  line-height: 24px;
  display: block;
}

.metric-item-number {
  font-size: 24px;
  margin-top: 8px;
  margin-bottom: 8px;
  display: block;
}
</style>
