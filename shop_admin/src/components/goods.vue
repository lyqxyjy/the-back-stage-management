<template>
    <div class="goods">
    <el-button type="success" plain @click="$router.push('/goods-add')">添加商品</el-button>
    <el-table
     :data="goodList"
      style="width: 100%">
      <el-table-column
        prop="goods_name"
        label="名字"
        width="180">
      </el-table-column>
      <el-table-column
        prop="goods_price"
        label="价格"
        width="180">
      </el-table-column>
      <el-table-column
        prop="goods_weight"
        label="重量">
      </el-table-column>
      <el-table-column
        prop="upd_time"
        label="时间">
        <template slot-scope="scope">
            {{scope.row.upd_time | myFilter}}
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
      </el-table-column>
    </el-table>
    <el-pagination
        background
         @current-change="handleCurrentChange"
        layout="prev, pager, next"
        :total="total">
    </el-pagination>
    
    </div>
</template>
<script>
export default {
    data() {
        return {
            query:'',
            current: 1,
            pageSize: 10,
            goodList:[],
            total:0
        }
    },
    methods: {
       async getGoodList () {
            let res = await this.axios.get('goods',{
            params:{
                query: this.query,
                pagenum: this.current,
                pagesize: this.pageSize
            }})

            let{meta:{status},data:{total,goods}} = res.data
            if(status == 200){
                this.goodList = goods
                this.total = total
                console.log(this.goodList)
            }  
        },
        handleCurrentChange (val) {
            this.current = val
            this.getGoodList()
        }

    },
    created () {
        this.getGoodList()
    }
}
</script>
<style lang="less" scoped>

    
</style>