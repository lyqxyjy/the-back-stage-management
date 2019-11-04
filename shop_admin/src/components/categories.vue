<template>
  <div class="catetory">
    <template>
      <el-button type="success" plain @click="showCategory">添加分类</el-button>
      <el-dialog title="添加分类" :visible.sync="categoryDialogVisible" width="60%">
        <el-form :model="addForm" :rules="rules" ref="addForm" label-width="80px" prop>
          <el-form-item label="商品名称" prop="cat_name">
            <el-input v-model="addForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="选择分类">
            <el-cascader :options="options" :props="props" v-model="addForm.cat_pid"></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="categoryDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCategory">确 定</el-button>
        </span>
      </el-dialog>
      <el-table v-loading="loading" :data="categoryTableData" style="width: 100%">
        <el-table-tree-column
          file-icon="icon icon-file"
          folder-icon="icon icon-folder"
          prop="cat_name"
          label="商品名称"
          width="180"
          treeKey="cat_id"
          parentKey="cat_pid"
          levelKey="cat_level"
          intent-size="20"
        ></el-table-tree-column>
        <el-table-column prop="cat_deleted" label="是否删除" width="180">
          <template slot-scope="scope">{{scope.row.cat_deleted?'是':'否'}}</template>
        </el-table-column>
        <el-table-column prop="cat_level" label="等级"></el-table-column>
        <el-table-column label="操作">
          <template >
            <el-button type="primary" icon="el-icon-edit" circle></el-button>
            <el-button type="danger" icon="el-icon-delete" circle></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="current"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </template>
  </div>
</template>
<script>

var ElTreeGrid = require('element-tree-grid');

export default {
  data() {
    return {
      categoryTableData: [],
      current: 1,
      pageSize: 10,
      total: 0,
      loading: true,
      categoryDialogVisible: false,
      
      rules:{
        cat_name:[
           {required: true,message:'请输入名字'}
        ]
      },
      options:[],
      props:{
        value:'cat_id',
        label:'cat_name',
        children:'children',
        multiple: true 
      },
      addForm:{
        cat_name: '',
        cat_pid:[],
        cat_level:''
      }
    };
  },

  methods: {
    async getGoodsList() {
      let res = await this.axios.get("categories", {
        params: {
          type: 1,
          pagenum: this.current,
          pagesize: this.pageSize
        }
      });
      let {
        meta: { status },
        data: { total, result }
      } = res.data;
      if (status == 200) {
        this.loading = false;
        this.categoryTableData = result;
        this.total = total;
      }
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getGoodsList();
    },
    handleCurrentChange(val) {
      this.current = val;
      this.getGoodsList();
    },
    async showCategory () {
      this.categoryDialogVisible = true
      let res = await this.axios.get('categories?type=2')
      let {meta:{status},data} = res.data
      if(status === 200){
        this.options = data
      }
    },
    addCategory () {
      this.$refs.addForm.validate(async valid => {
        if(!valid){
          return false
        }else {
          let res = await this.axios.post('categories',{
            cat_name: this.addForm.cat_name,
            cat_pid: this.addForm.cat_pid[this.addForm.cat_pid.length - 1],
            cat_level: this.addForm.cat_pid.length
          })
        let{meta:{status},data} = res.data
          if(status == 200){
            this.$message.success('创建分类成功')
            this.$refs.addForm.resetFields()
            this.categoryTableData = false
          }else {
            this.$message.error('创建分类失败')
          }
        }
      })
    }



    },

     

  created() {
    this.getGoodsList();
    console.log(ElTreeGrid)
  },
  components: {
      'el-table-tree-column':ElTreeGrid
  }
};
</script>