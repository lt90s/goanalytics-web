<template>
  <div class="app-container">
    <h3>应用列表</h3>
    <div class="chart-wrapper">
      <div v-if="roles === 'admin'" class="filter-container">
        <el-button slot="reference" class="filter-item" type="primary" icon="el-icon-plus" @click="showCreateDialog">创建新应用</el-button>
      </div>
      <el-table :data="apps" border style="width: 100%">
        <el-table-column label="创建日期" align="center" width="120px">
          <template slot-scope="scope">
            {{ timestampToDate(scope.row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="名称" align="center" width="240px">
          <template slot-scope="scope">
            <span class="link-type" @click="setCurrentAppId(scope.row)">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="描述" align="center">
          <template slot-scope="scope">
            {{ scope.row.description }}
          </template>
        </el-table-column>
        <el-table-column label="appID" align="center">
          <template slot-scope="scope">
            {{ scope.row.appId }}
          </template>
        </el-table-column>
        <el-table-column label="appKey" align="center">
          <template slot-scope="scope">
            {{ scope.row.appKey }}
          </template>
        </el-table-column>
        <el-table-column v-if="roles === 'admin'" label="操作" align="center" width="120px">
          <template slot-scope="scope">
            <el-button type="danger" @click.native="doDeleteApp(scope.row.appId)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog title="创建新应用" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="应用名称" prop="name">
          <el-input v-model="temp.name" :maxlength="100"/>
        </el-form-item>
        <el-form-item label="应用描述" prop="description">
          <el-input v-model="temp.description" type="textarea" :maxlength="1000" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="doCreateApp">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getApps, createApp, deleteApp } from '@/api/app'
import { mapGetters } from 'vuex'
import dateUtils from '@/utils/date'

export default {
  name: 'Application',
  data() {
    return {
      apps: [],
      dialogFormVisible: false,
      rules: {
        name: [{ required: true, message: '必填', trigger: 'change' }],
        description: [{ required: true, message: '必填', trigger: 'change' }]
      },
      temp: {
        name: '',
        description: ''
      }
    }
  },
  computed: {
    ...mapGetters([
      'appId',
      'roles'
    ])
  },
  created() {
    console.log(this.roles)
    this.loadData()
  },
  methods: {
    loadData() {
      getApps().then(response => {
        console.log(response)
        this.apps = response.data
      })
    },
    timestampToDate(ts) {
      return dateUtils.timeStampToString(ts)
    },
    showCreateDialog() {
      this.temp.name = ''
      this.temp.description = ''
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    doCreateApp() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createApp(this.temp).then(response => {
            this.dialogFormVisible = false
            console.log(response)
            this.loadData()
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    doDeleteApp(appId) {
      this.$confirm('确认删除此应用数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteApp(appId).then(() => {
          this.loadData()
          if (this.appId === appId) {
            this.$store.dispatch('config/resetAppId')
          }
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
        })
      })
    },
    setCurrentAppId(row) {
      console.log(row.name)
      this.$store.dispatch('config/setAppName', row.name)
      this.$store.dispatch('config/setAppId', row.appId).then(() => {
        this.$router.push({ path: '/summary/realtime' })
      })
    }
  }
}
</script>
