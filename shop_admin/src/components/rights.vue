<template>
    <div class="right"> 
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        
    </el-breadcrumb>
    <el-table
    ref="singleTable"
    :data="rightData"
    style="width: 100%">
    <el-table-column
      type="index"
      width="100">
    </el-table-column>
    <el-table-column
      property="authName"
      label="权限名称"
      width="160">
    </el-table-column>
    <el-table-column
      property="path"
      label="路径"
      width="160">
    </el-table-column>
    <el-table-column
      property="level"
      label="等级"
      width="160">
      <template slot-scope="scope">
         <span v-if="scope.row.level == 0">一级</span>
         <span v-if="scope.row.level == 1">二级</span>
         <span v-if="scope.row.level == 2">三级</span>
      </template>
     
    </el-table-column>
  </el-table>
    </div>
</template>

<script>
export default {
    data() {
        return {
            rightData:[]
        }
    },
   async created () {
        let res = await this.axios.get('rights/list')
        let{meta:{status},data} = res.data
        if(status == 200){
            this.rightData = data
        }
        
    }
}
</script>
<style lang="less" >
.el-container .el-main {
  line-height: 80px;
}
</style>