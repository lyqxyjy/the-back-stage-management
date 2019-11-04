<template>
  <div class="role">
    <template>
      <el-button type="success" plain @click="showAddRole">添加角色</el-button>
      <el-dialog :title="title" :visible.sync="addDialogFormVisible">
        <el-form :model="addForm" >
            <el-form-item label="角色名称" >
            <el-input v-model="addForm.roleName" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="角色描述" >
            <el-input v-model="addForm.roleDesc" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="addDialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="confirm">确 定</el-button>
        </div>
    </el-dialog>
      <el-table ref="singleTable" :data="roleData" style="width: 100%">
      
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- 一级权限 -->
            <el-row v-for="level1 in scope.row.children" :key="level1.id">
              <el-col :span="4">
                <el-tag closable @close="delRight(scope.row,level1.id)">{{level1.authName}}</el-tag>
              </el-col>
              <!-- 二级权限 -->
              <el-col :span="20">
                <el-row v-for="level2 in level1.children" :key="level2.id">
                  <el-col :span="4">
                    <el-tag type="info" closable @close="delRight(scope.row,level2.id)">{{level2.authName}}</el-tag>
                  </el-col>
                  <el-col :span="20">
                    <el-tag
                      closable
                      type="danger"
                      v-for="level3 in level2.children"
                      :key="level3.id"
                      @close="delRight(scope.row,level3.id)"
                    >{{level3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        
        <el-table-column type="index" width="100"></el-table-column>
        <el-table-column property="roleName" label="角色名称" width="260"></el-table-column>
        <el-table-column property="roleDesc" label="角色描述" width="260"></el-table-column>
        <el-table-column label="操作" width="500">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" plain @click="showEditRole(scope.row)"></el-button>
            <el-button type="danger" icon="el-icon-delete" plain @click="delRole(scope.row)"></el-button>
            <el-button type="success" icon="el-icon-check" plain @click="showAssignDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        title="分配权限"
        :visible.sync="assignDialogVisible"
        width="50%"
        @closed="clearRight">
        <el-tree
          :data="dataTree"
          show-checkbox
          default-expand-all
          node-key="id"
          ref="tree"
          highlight-current
          :props="defaultProps">
        </el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="assignDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="assignAuth">分配</el-button>
        </span>
      </el-dialog>
    </template>
  </div>
</template>
<script>
export default {
  data() {
    return {
      roleData: [],
      addDialogFormVisible: false,
      addForm:{},
      title:'修改用户',
      assignDialogVisible :false,
      dataTree:[],
      roleId: '',
      defaultProps: {
        children: 'children',
        label: 'authName'
      }
    };
  },
  methods: {
    async delRole(row) {
      try {
        await this.$confirm("此操作将永久删除该角色 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
        let { id } = row;

        await this.axios.delete(`roles/${id}`);
        this.getRoleList();
        this.$message.success("删除成功");
        
      } catch (e) {
        this.$message.error("已取消删除");
      }
    },
    async getRoleList() {
      let res = await this.axios.get("roles");
      let {
        meta: { status },
        data
      } = res.data;
      if (status == 200) {
        this.roleData = data;
      }
    },
    //清空权限
    clearRight () {
      this.$refs.tree.setCheckedKeys([])
    },
    showAddRole () {
        this.addDialogFormVisible = true
        this.addForm = {}
        this.title = "添加用户"
    },
    showEditRole (row) {
      this.addDialogFormVisible = true;
        this.addForm = row
        this.title = "修改用户"
    },
    async addRole () {
     try{
          let res = await this.axios.post('roles',{
            roleName: this.addForm.roleName,
            roleDesc: this.addForm.roleDesc
        })
        
        let{meta:{status }}  = res.data
        if(status == 201){
            this.addDialogFormVisible = false
            
            this.$message.success('角色创建成功')
            this.getRoleList()       
        }else {
            this.$message.error('角色创建失败')
        }
     }catch(e) {
       this.$message.error('请求失败')
     }
        

    },
    async editRole () {
     let res = await this.axios.put(`roles/${this.addForm.id}`,this.addForm)
     let{meta:{status},data} = res.data
     if(status == 200){
       this.addDialogFormVisible = false
       
       this.getRoleList()
       this.$message.success('修改角色成功')
     } else {
       this.$message.error('修改角色失败')
     }

   },
    confirm () {
      if(this.addForm.id){
        this.editRole()
      }else {
        this.addRole()
      }
      this.$refs.addForm.resetFields()
    },
    async delRight (row,rightId) {
    
      let res = await this.axios.delete(`roles/${row.id}/rights/${rightId}`)
     
      let{meta:{status},data} = res.data
      if(status == 200){
        this.$message.success('取消权限成功')
        //此时要重新渲染的数据是删除后的数据 且这些数据就是row中的children，
        row.children = data
      }else{
         this.$message.error('取消权限失败')
      }
      
    },
    async showAssignDialog (row) {
      this.roleId = row.id
      this.assignDialogVisible = true
      let res = await this.axios.get('rights/tree')
      let{meta:{status},data} = res.data
      if(status == 200){
        //得到的数组返回给渲染的数组
        this.dataTree = data;
      }

      let temp= []
      row.children.forEach(level1 => {
        level1.children.forEach(level2=>{
          level2.children.forEach(level3=>{
            temp.push(level3.id)
          })
        })
      });
      this.$refs.tree.setCheckedKeys(temp);
      
      
    },
    async assignAuth () {
        
        //这个两个方法是获得被选中的节点，以及被半选中的节点 半选中的节点就是次级权限被选中相应的高级权限就是半选中状态
      let checkeds = this.$refs.tree.getCheckedKeys()
      let halfCheckeds = this.$refs.tree.getHalfCheckedKeys()
      let rids = checkeds.concat(halfCheckeds).join()
    
      
      let res = await this.axios.post(`roles/${this.roleId}/rights`,{
        rids
      })
      let{meta:{status},data} = res.data
      if(status == 200){
        this.assignDialogVisible = false
        this.$message.success('权限分配成功')
        this.getRoleList()
      }

    }

  },
  created() {
    this.getRoleList();
  }
};
</script>

<style lang="less" scoped>
.el-container .el-main {
  line-height: 80px;
}
.el-tag {
  margin-left: 8px;
}
.el-dialog__header {
  margin-left: 150px;
  width: 200px;
  height: 30px;
  line-height: 30px;
}
.el-button {
    float: left;
}
</style>