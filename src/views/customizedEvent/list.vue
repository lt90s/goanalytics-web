<template>
  <div class="app-container">
    <h3>自定义事件</h3>
    <div class="chart-wrapper">
      <div class="filter-container">
        <el-button slot="reference" class="filter-item" type="primary" icon="el-icon-plus" @click="showCreateDialog">添加事件</el-button>
      </div>
      <el-table
        :data="counters"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column label="事件ID" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="事件名称" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.displayName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="计数器类型" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.type }}</span>
          </template>
        </el-table-column>
        <el-table-column label="昨日事件数" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.yesterdayCount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="今日事件数" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.todayCount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="详情" align="center">
          <template slot-scope="scope">
            <span class="link-type" @click="gotoDetail(scope.row)">查看</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="120px">
          <template slot-scope="scope">
            <el-button v-if="scope.row.name !== 'root'" type="danger" @click.native="doDeleteCustomizedCounter(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog title="创建账户" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="事件计数名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="事件展示名称" prop="displayName">
          <el-input v-model="temp.displayName" />
        </el-form-item>
        <el-form-item label="事件计数类型" prop="type">
          <el-select v-model="temp.type" placeholder="选择计数类型">
            <el-option label="简单计数器" value="simple" />
            <el-option label="分组计数器" value="slot" />
            <el-option label="分渠道/平台/版本统计计数器" value="cpv" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="temp.type === 'slot'" label="计数器分组" prop="slots">
          <div v-for="slot in temp.slots" :key="slot">
            <el-tag closable @close="deleteSlot(slot)">{{ slot }}</el-tag>
          </div>
          <el-input v-model="inputedSlot" placeholder="添加分组，回车确认添加" @keyup.enter.native="addSlot(slot)" />
        </el-form-item>
        <el-form-item v-if="temp.type === 'cpv'" label="渠道列表" prop="channels">
          <div v-for="channel in temp.channels" :key="channel">
            <el-tag closable @close="deleteChannel(channel)">{{ channel }}</el-tag>
          </div>
          <el-input v-model="inputedChannel" placeholder="添加渠道，回车确认添加" @keyup.enter.native="addChannel(channel)" />
        </el-form-item>
        <el-form-item v-if="temp.type === 'cpv'" label="版本号列表" prop="versions">
          <div v-for="version in temp.versions" :key="version">
            <el-tag closable @close="deleteVersion(version)">{{ version }}</el-tag>
          </div>
          <el-input v-model="inputedVersion" placeholder="添加版本号，回车确认添加" @keyup.enter.native="addVersion(version)" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="doCreateCustomizedCounter">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getCustomizedCounters, createCustomizedCounter, deleteCustomizedCounter } from '@/api/counter'

export default {
  name: 'CustomizedEventList',
  data() {
    return {
      counters: [],
      dialogFormVisible: false,
      rules: {},
      temp: {
        name: '',
        displayName: '',
        type: '',
        slots: [],
        channels: [],
        versions: []
      },
      inputedSlot: '',
      inputedChannel: '',
      inputedVersion: '',
      localStorage: {
        customizedCounter: {
          type: Object
        }
      }
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      getCustomizedCounters().then(response => {
        console.log(response)
        this.counters = response.data
      })
    },
    showCreateDialog() {
      this.temp.name = ''
      this.temp.displayName = ''
      this.temp.type = ''
      this.temp.slots = []
      this.temp.channels = []
      this.temp.versions = []
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    deleteSlot(slot) {
      const index = this.temp.slots.indexOf(slot)
      this.temp.slots.splice(index, 1)
    },
    addSlot() {
      if (this.inputedSlot === '') {
        return
      }
      this.temp.slots.push(this.inputedSlot)
      this.inputedSlot = ''
    },
    deleteChannel(channel) {
      const index = this.temp.channels.indexOf(channel)
      this.temp.channels.splice(index, 1)
    },
    addChannel() {
      if (this.inputedChannel === '') {
        return
      }
      this.temp.channels.push(this.inputedChannel)
      this.inputedChannel = ''
    },
    deleteVersion(version) {
      const index = this.temp.versions.indexOf(version)
      this.temp.versions.splice(index, 1)
    },
    addVersion() {
      if (this.inputedVersion === '') {
        return
      }
      this.temp.versions.push(this.inputedVersion)
      this.inputedVersion = ''
    },
    doCreateCustomizedCounter() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createCustomizedCounter(this.temp).then(() => {
            this.dialogFormVisible = false
            this.loadData()
            this.$notify({
              title: '成功',
              message: '添加成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    gotoDetail(row) {
      this.$localStorage.set('customizedCounter', JSON.stringify({
        name: row.name,
        displayName: row.displayName,
        type: row.type,
        slots: row.slots,
        channels: row.channels,
        versions: row.versions
      }))
      console.log(row)
      this.$router.push({ 'path': 'detail' })
    },
    doDeleteCustomizedCounter(row) {
      this.$confirm('确认删除此事件？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteCustomizedCounter(row.name, row.type).then(() => {
          this.loadData()
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
        })
      })
    }
  }
}
</script>
