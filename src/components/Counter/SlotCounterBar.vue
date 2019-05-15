<template>
  <div>
    <bar-chart :render="render" :x-axis-data="slotsName" :bar-data="barData" />
    <el-popover placement="right" trigger="click" v-model="showPopover">
      <el-date-picker v-model="compareTimestamp" type="date" placeholder="选择日期" value-format="timestamp" @change="selectDate"></el-date-picker>
      <el-button slot="reference" class="filter-item" type="primary" icon="el-icon-plus">添加对比日期</el-button>
    </el-popover>
  </div>
</template>

<script>
import { getSlotCounter } from '@/api/counter'
import BarChart from '@/components/Charts/BarChart'
import dateUtils from '../../utils/date'

export default {
  name: 'SlotCounterBar',
  components: { BarChart },
  props: {
    date: {
      type: Number,
      required: true
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
      render: 0,
      compareTimestamp: '',
      datesData: {},
      barData: []
    }
  },
  computed: {
    slotsName() {
      const tmp = []
      for (const key in this.slotsMapping) {
        tmp.push(this.slotsMapping[key])
      }
      return tmp
    }
  },
  watch: {
    date: function() {
      this.datesData = {}
      this.barData = []
      this.loadData(this.date)
    }
  },
  created() {
    this.loadData(this.date)
  },
  methods: {
    loadData(date) {
      date = date / 1000
      const metric = dateUtils.timeStampToString(date)
      if (this.datesData[metric] === undefined) {
        getSlotCounter(this.slotCounterName, 'span', date, date).then(response => {
          console.log(response)
          const data = response.data[this.slotCounterName]
          this.datesData[metric] = []
          for (const slot in this.slotsMapping) {
            let value = 0
            if (data !== undefined && data[date] !== undefined && data[date][slot] !== undefined) {
              value = data[date][slot]
            }
            this.datesData[metric].push(value)
          }
          this.barData.push({
            name: metric,
            type: 'bar',
            data: this.datesData[metric]
          })
          this.render += 1
        })
      }
    },
    selectDate() {
      this.loadData(this.compareTimestamp)
      this.compareTimestamp = ''
    }
  }
}
</script>
