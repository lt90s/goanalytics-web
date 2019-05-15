<template>
  <div class="app-container">
    <h3>账号管理</h3>
    <div class="chart-wrapper">
      <div class="filter-container">
        <el-button slot="reference" class="filter-item" type="primary" icon="el-icon-plus" @click="showCreateDialog">添加账户</el-button>
      </div>
      <el-table
        :data="accounts"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column label="ID" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="名称" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="角色" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.role }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="120px">
          <template slot-scope="scope">
            <el-button v-if="scope.row.name !== 'root'" type="danger" @click.native="doDeleteAccount(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog title="创建账户" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="temp.password" type="password" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="temp.role">
            <el-option label="Admin" value="admin" />
            <el-option label="Operator" value="operator" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="doCreateAccount">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getAccounts, deleteAccount, createAccount } from '@/api/account'

export default {
  name: 'AdminAccount',
  data() {
    return {
      accounts: [],
      dialogFormVisible: false,
      rules: {
        name: [{ required: true, message: '必填', trigger: 'blur' }],
        password: [{ required: true, message: '必填', trigger: 'blur' }],
        role: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      temp: {
        name: '',
        password: '',
        role: ''
      }
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      getAccounts().then(response => {
        console.log(response)
        this.accounts = response.data
      })
    },
    showCreateDialog() {
      this.temp.name = ''
      this.temp.password = ''
      this.temp.role = 'operator'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    doDeleteAccount(id) {
      this.$confirm('确认删除此账号？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteAccount({ id }).then(() => {
          this.loadData()
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
        })
      })
    },
    doCreateAccount() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createAccount(this.temp).then(response => {
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
    }
  }
}
</script>
