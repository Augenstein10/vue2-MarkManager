<template>
  <div>
    <el-table :data="skuList" border style="width: 100%">
      <el-table-column label="序号" width="90" type="index"> </el-table-column>
      <el-table-column prop="skuName" label="名称" width="140">
      </el-table-column>
      <el-table-column prop="skuDesc" label="描述"> </el-table-column>
      <el-table-column label="默认图片">
        <template slot-scope="{ row }">
          <img :src="row.skuDefaultImg" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量(KG)"> </el-table-column>
      <el-table-column prop="price" label="价格" width="90"> </el-table-column>
      <el-table-column label="操作" width="250">
        <template slot-scope="{ row }">
          <el-button
            type="success"
            icon="el-icon-top"
            v-if="row.isSale == 1"
            size="mini"
            @click="cancelSale(row)"
          ></el-button>
          <el-button
            type="info"
            size="mini"
            icon="el-icon-bottom"
            v-else
            @click="sale(row)"
          ></el-button>
          <el-button type="primary" size="mini" icon="el-icon-edit"></el-button>
          <el-button
            type="info"
            size="mini"
            icon="el-icon-info"
            @click="lookSkuInfo(row)"
          ></el-button>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="page"
        :page-size="limit"
        layout="prev, pager, next, jumper"
        :total="total"
        align="center"
      >
      </el-pagination>
    </div>
    <el-drawer title="我是标题" :visible.sync="drawer" :with-header="false" size="50%">
      <el-row>
        <el-col :span="9"
          ><div class="grid-content bg-purple">名称</div></el-col
        >
        <el-col :span="15"
          ><div class="grid-content bg-purple-light">
            {{ skuInfo.skuName }}
          </div></el-col
        >
      </el-row>
      <el-row>
        <el-col :span="9"
          ><div class="grid-content bg-purple">描述</div></el-col
        >
        <el-col :span="15"
          ><div class="grid-content bg-purple-light">
            {{ skuInfo.skuDesc }}
          </div></el-col
        >
      </el-row>
      <el-row>
        <el-col :span="9"
          ><div class="grid-content bg-purple">价格</div></el-col
        >
        <el-col :span="15"
          ><div class="grid-content bg-purple-light">
            {{ skuInfo.price }}
          </div></el-col
        >
      </el-row>
      <el-row>
        <el-col :span="9"
          ><div class="grid-content bg-purple">平台属性</div></el-col
        >
        <el-col :span="15"
          ><el-tag
            type="success"
            v-for="skuAttr in skuInfo.skuAttrValueList"
            :key="skuAttr.id"
            >{{ skuAttr.attrId }}-{{ skuAttr.valueId }}</el-tag
          ></el-col
        >
      </el-row>
      <el-row>
        <el-col :span="9"
          ><div class="grid-content bg-purple">商品图片</div></el-col
        >
        <el-col :span="15">
          <div class="block">
            <!-- <span class="demonstration">默认 Hover 指示器触发</span> -->
            <el-carousel height="150px">
              <el-carousel-item v-for="image in skuInfo.skuImageList" :key="image.id">
                <h3 class="small">
                  <img :src="image.imgUrl" alt="">
                </h3>
              </el-carousel-item>
            </el-carousel>
          </div></el-col
        >
      </el-row>
    </el-drawer>
  </div>
</template>
<script>
export default {
  name: 'sku',
  data() {
    return {
      skuList: [],
      page: 1,
      limit: 8,
      total: 0,
      drawer: false,
      skuInfo: {},
    }
  },
  mounted() {
    this.getSkuList()
  },
  methods: {
    //获取sku列表展示数据
    async getSkuList() {
      const { page, limit } = this
      let result = await this.$API.sku.reqSkuList(page, limit)
      // console.log(result);
      if (result.code == 200) {
        this.total = result.data.total
        this.skuList = result.data.records
      }
    },
    //改变limit的回调
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    //改变当前页数的回调
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.getSkuList()
    },
    //上架sku
    async sale(row) {
      let result = await this.$API.sku.reqSale(row.id)
      // console.log(row);
      if (result.code == 200) {
        this.$message({
          type: 'success',
          message: '上架成功',
        })
      }
      this.getSkuList()
    },
    //下架sku
    async cancelSale(row) {
      let result = await this.$API.sku.reqCancelSale(row.id)
      if (result.code == 200) {
        this.$message({
          type: 'success',
          message: '下架成功',
        })
      }
      this.getSkuList()
    },
    //查看sku信息
    async lookSkuInfo(row) {
      this.drawer = true
      let result = await this.$API.sku.reqSkuInfo(row.id)
      if (result.code == 200) {
        this.skuInfo = result.data
      }
    },
  },
}
</script>
<style scoped>
.el-row {
  margin-top: 70px;
}
>>>.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

>>>.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

>>>.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
