<template>
  <div class="user">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/">用户列表</a>
      </el-breadcrumb-item>
    </el-breadcrumb>
    <el-input placeholder="请输入内容" v-model="query" class="input-with-select">
      <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
    </el-input>
    <el-button type="success" plain @click="showDialog">添加用户</el-button>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="username" label="姓名" width="200"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="200"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="200"></el-table-column>
      <el-table-column prop="mg_state" label="用户状态" width="200">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeState(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="操作" width="500">
        <template slot-scope="scope">
          <el-button type="primary" @click="showEditDialog(scope.row)" icon="el-icon-edit" circle></el-button>
          <el-button @click="deleteUser(scope.row)" type="danger" icon="el-icon-delete" circle></el-button>
          <el-button @click="showAssignRole(scope.row)" type="success" icon="el-icon-check">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="current"
        :page-sizes="[2, 4, 6, 8]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <el-dialog title="添加用户" :visible.sync="dialogVisible" width="50%">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="名字" prop="username">
          <el-input v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="ruleForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ruleForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="ruleForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="编辑用户" :visible.sync="editDialogVisible" width="50%">
      <el-form
        :model="editForm"
        :rules="rules"
        ref="editForm"
        label-width="100px"
        class="demo-editForm"
      >
        <el-form-item label="名字" prop="username">
          <el-input disabled v-model="editForm.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
    
    <el-dialog
      title="分配角色"
      :visible.sync="assignDialogVisible"
      width="50%"
      v-model="addRole">
     <el-form
        :model="addRole"
        :rules="rules"
        ref="addRole"
        label-width="100px"
      >
      
        <el-form-item label="姓名" prop="username">
          <el-input disabled v-model="addRole.username"></el-input>
        </el-form-item>
        <!-- 这个rid就是当前用户的角色，在点击之后要将默认的角色显示在框中 -->
          <el-select v-model="addRole.rid" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
       
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="assignRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
//引入axios 发送请求
// import axios from "axios";
export default {
  data() {
    return {
      query: "", //这个是查询的关键字
      current: 1, //当前页
      pagesize: 2, //每一页显示的条数
      tableData: [],
      total: 0,
      dialogVisible: false,
      editDialogVisible: false,
      assignDialogVisible: false,
      //添加表单
      ruleForm: {},
      //编辑表单
      editForm: {},
      //分配角色
      addRole:{
        username:'',
        id:'',
        rid:''
      },
      //选择框数据
      options:[],
      rid:'',
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 8 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 12, message: "长度在 6 到 12 个字符", trigger: "blur" }
        ],
        email: [{ type: "email", message: "请输入正确的邮箱地址" }],
        mobile: [
          // 1开头第二位3到9之间的数，其余9位随便
          { pattern: /^1[3-9]\d{9}$/, message: "请输入正确的电话号码" }
        ]
      }
    };
  },
  methods: {
   async getUser() {
     let res = await this.axios({
        url: "users",
        method: "get",
        //get请求参数在params中 post在data中
        params: {
          query: this.query,
          pagenum: this.current,
          pagesize: this.pagesize
        },
        //发送请求头（因为只有请求头才能得到数据）
        headers: {
          Authorization: localStorage.getItem("token1")
        }
      })

        this.tableData = res.data.data.users;
        this.total = res.data.data.total;
      
    },
    async showAssignRole (row) {
      this.assignDialogVisible = true
      
      //当前用户名
      this.addRole.username = row.username
      //当前用户id
      this.addRole.id = row.id
      //当前角色id 就是每一个固定角色就有一个固定id,这个rid只能通过ajax来获取
       let res = await this.axios.get(`users/${row.id}`)
       let{meta:{status},data} = res.data
       if(status  ==  200){

         if(data.rid === -1){
          this.addRole.rid = ''
         } else {
           this.addRole.rid = data.rid
         }
         
       }
       this.getOption()
    },
     async getOption() {
       let res = await this.axios.get('roles')
      let {meta:{status},data} = res.data
      if(status == 200){
        this.options = data
      }
    },
    async assignRole () {
      if(!this.addRole.rid){
        this.$message.error('必须选择一个角色')
        return
      }
      let res = await this.axios.put(`users/${this.addRole.id}/role`,{
        rid: this.addRole.rid
      })
      let {meta:{status}} = res.data
    
       if(status == 200){
        
        this.assignDialogVisible = false
        this.getUser()
        this.$message.success('分配角色成功')
        
      }
    },
    handleCurrentChange(val) {
      this.current = val;
      this.getUser();
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.getUser();
      this.current = 1;
    },
    search() {
      //在搜索的时候，每一次传递给服务器的都是第一页
      this.current = 1
      this.getUser();
    },
    async changeState(row) {
      let { id, mg_state } = row;
      try{
          let res = await this.axios({
        url: `users/${id}/state/${mg_state}`,
        method: "put"
      })
       this.$message.success("修改状态成功");
      }catch(e) {
        this.$message.erroe("修改状态失败");
      }

    },
    async deleteUser(row) {
      try{
        await this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
       
      let { id } = row;
      //此时只是将数据库中的数据删除，没有删除vue中的
      this.axios({
        url: `users/${id}`,
        method: "delete"
      })
      //判断当前页是否是1，或者得到的数组的长度是否是1
      if (this.current > 1 && this.tableData.length === 1) {
        this.current--;
      }
      this.getUser();
      this.$message.success("删除成功");
      }catch(e){
         this.$message.info("已取消删除");
      }
    },
    showDialog() {
      this.dialogVisible = true;
    },
    addUser() {
      this.$refs.ruleForm.validate( async valid => {
        if (valid) {
          let res = await this.axios.post("users", this.ruleForm)
   
          let {meta: { status }} = res.data;
          if (status === 201) {
            //取消显示对话框
            this.dialogVisible = false;
            //清空表单内容
            this.$refs.ruleForm.resetFields()
            this.$message.success("创建用户成功");
            //每一次在后面加数据都能看到，但是axios之后再会在数据库中加，Vue中还没有，
            //所以没加一条在total中也加1 跟数据库同步
            this.total++
            this.current = Math.ceil(this.total / this.pagesize) 
            this.getUser()
          } else {
            this.$message.error("用户创建失败");
          } 
        }
      });
    },
    showEditDialog (row) {
      this.editDialogVisible = true
      this.editForm = row
    },
    editUser () {
      this.$refs.editForm.validate( async (valid)=>{
        if(valid){
          let res = await this.axios.put(`users/${this.editForm.id}`,{
            email: this.editForm.email,
            mobile: this.editForm.mobile
          })

          let {meta:{status}} = res.data
          if(status == 200){
            this.editDialogVisible = false;
            this.$refs.editForm.resetFields()
            this.getUser()
            this.$message.success('用户修改成功')
          }else {
              this.$message.error('用户修改失败')
          }
          
        } else {
          return false
        }
      })
    }
  },
  created() {
    this.getUser();
  }
};
</script>
<style lang="less" >
.el-table {
  margin-bottom: 10px;
}


.el-input {
  width: 300px;
}
.el-dialog__header {
  margin-left: 150px;
  width: 200px;
  height: 30px;
  line-height: 30px;
}
.el-container .el-main {
  line-height: 80px;
}
</style>