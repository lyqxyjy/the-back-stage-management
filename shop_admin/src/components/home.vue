<template>
  <el-container>
    <el-header>
      电商管理系统
      <p>
        欢迎回来!
        <a href="javascript:;" @click="logout">退出</a>
      </p>
    </el-header>
    <el-container>
      <el-aside style="width: 250px">
        <!-- 添加router就让:index可以使用 -->
        <el-menu
         router
          :default-active="$route.path.slice(1).split('-')[0]"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-submenu
         
          v-for="menu in authList"
          :key="menu.id"
          :index="menu.path" >
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{menu.authName}}</span>
            </template>

            <el-menu-item 
            v-for="item in menu.children"
            :key="item.id"
            :index="item.path" >
              <i class="el-icon-menu"></i>
              <span>{{item.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      authList:[]
    }
  },
  methods: {
    async logout() {
      try{

        await this.$confirm("是否退出当前用户?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })

        this.$message.success({ message: "已成功退出!" });
        localStorage.removeItem("token1");
        this.$router.push("/login");

      }catch(e){
        this.$message.info('取消退出')
      }
    }
  },
  async created () {
    let res = await this.axios.get('menus')
    let {meta:{status},data} = res.data
    if(status == 200){
     this.authList = data
    }
   
  }
};
</script>
<style lang="less" >
.el-container {
  height: 100%;
  .el-header {
    background-color: #b3c0d1;
    text-align: center;
    line-height: 60px;
    font-size: 30px;
    color: #fff;
    p {
      float: right;
      font-size: 15px;
    }
  }
  .el-aside {
    width: 200px;
    background-color: #d3dce6;
    color: #333;
    text-align: center;
    line-height: 50px;
    .el-submenu__title {
      margin-right: 0;
     
    }
    .el-submenu .el-menu-item {
      padding: 0 5px;
    }

  }
  .el-main {
    background-color: #e9eef3;
    color: #333;
    text-align: center;
   
  }
}
</style>