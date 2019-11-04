<template>
    <div class="goods-add">
        <el-steps :active="active" finish-status="success" width="80%">
            <el-step title="步骤 1"  description="基本信息"></el-step>
            <el-step title="步骤 2"  description="商品图片"></el-step>
            <el-step title="步骤 3" description="商品内容"></el-step>
        </el-steps> 
        <template>
        <el-tabs tab-position="left"  v-model="activeName" @tab-click="change">
            <el-tab-pane name="meg" label="基本信息" >
                <el-form ref="basicForm" :model="basicForm" label-width="80px">
                    <el-form-item label="商品名称">
                        <el-input v-model="basicForm.goods_name"></el-input>
                    </el-form-item>
                    <el-form-item label="商品价格">
                        <el-input v-model="basicForm.goods_price"></el-input>
                    </el-form-item>
                    <el-form-item label="商品重量">
                        <el-input v-model="basicForm.goods_weight"></el-input>
                    </el-form-item>
                    <el-form-item label="商品数量">
                        <el-input v-model="basicForm.goods_number"></el-input>
                    </el-form-item>
                     <el-form-item label="是否促销">
                          <el-radio v-model="basicForm.is_promote" :label="true">是</el-radio>
                          <el-radio v-model="basicForm.is_promote" :label="false">否</el-radio>
                    </el-form-item>
                    <el-form-item label="商品分类">
                       <el-cascader
                        :options="options"
                        :props="props"
                        v-model="basicForm.goods_cat"
                       ></el-cascader>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="success" @click="next(1,'pic')">下一步</el-button>
                    </el-form-item>
                    
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="商品图片" name="pic">
                <el-upload
                    class="upload-demo"
                    action="http://localhost:8888/api/private/v1/upload"
                    
                    list-type="picture"
                    :on-success="handerSuccess"
                    :on-remove="handerRemove"
                    :headers="header">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>
                <el-button type="success" @click="next(2,'cet')">下一步</el-button>
            </el-tab-pane>
            <el-tab-pane label="商品内容" name="cet">
                <quill-editor
                    v-model="basicForm.introduce"
                    ref="myQuillEditor">
                </quill-editor>
               <el-button type="success" @click="addGood">确定</el-button>
            </el-tab-pane>
        </el-tabs>
        </template>
       
    </div>
</template>
<script>
export default {
    data() {
        return { 
            active:0,
            basicForm:{
                pics:[]
            },
            options:[],
            props:{
                value:'cat_id',
                label:'cat_name'
            },
            activeName: 'meg',
            // 要想上传必须提供token
            header:{
               Authorization: localStorage.getItem('token1')
            },
            //存储图片路径
            
        }
    },
    methods: {
        change (tab) {
            this.active = +tab.index
        },
        next(active,activeName) {
            //将步骤条后移
            this.active = active
            //将侧边栏后移
            this.activeName= activeName
        },
        //利用成功的回调函数将图片路径放到表格数据中
        handerSuccess (response) {
            this.basicForm.pics.push(
                {pic: response.data.tmp_path}
            )
        },
        handerRemove (response) {
            //删除图片，以及包括存在表单中的图片路径
            let path = response.response.data.tmp_path
           let idx =  this.basicForm.pics.findIndex(item => item.pic ==path )
           this.basicForm,pics.splice(idx,1)
        },
        async addGood () {
            //发送ajax请求，把收集到的所有数据发送给服务端
            let res = await this.axios.post('goods',{
                ...this.basicForm,
                goods_cat: this.basicForm.goods_cat.join()
            })
            console.log(res.data)
            let{meta:{msg,status}}  = res.data
            if(status == 201){
                this.$message.success('添加商品成功')
                this.$router.push('/goods')
            }else {
                this.$message.error(msg)
            }
        }
        
    },
    async created () {
        let res = await this.axios.get('categories?type=3')
        let{meta:{status},data} = res.data
        if(status == 200){
            this.options = data
        }
    }
}
</script>
<style lang="less" >
    .el-step__icon {
        position: absolute;
        left: 0px;
    }
    .el-step__title {
        position: absolute;
        top: 18px;
    }
    .el-step__description {
        width: 350px;
    }
    .el-step__main {
        .el-step__description {
            position: relative;
            top: 50px;
        }
    }
    .el-tabs {
        margin-top: 100px;
    }
    .quill-editor {
        background-color: #fff;
        .ql-editor {
            height: 200px
        }
    }
   
</style>