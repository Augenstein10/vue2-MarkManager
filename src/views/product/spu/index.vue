<template>
  <div>
    <el-card>
      <CategorySelect @getCategoryId="getCategoryId" :show="isShow" />
    </el-card>
    <el-card>
      <!--这是spu的展示列表 -->
      <div v-show="scene == 1">
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin-bottom: 10px"
          @click="scene = 2"
          :disabled="!category3Id"
          >添加spu</el-button
        >
        <el-table :data="spuList" border style="width: 100%">
          <el-table-column label="序号" width="180" type="index">
          </el-table-column>
          <el-table-column prop="spuName" label="spu名称" width="180">
          </el-table-column>
          <el-table-column prop="description" label="spu描述">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{ row }">
              <el-button
                type="success"
                icon="el-icon-plus"
                size="mini"
                @click="scene = 3"
              ></el-button>
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="updateSpu(row)"
              ></el-button>
              <el-button
                type="info"
                icon="el-icon-info"
                size="mini"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          layout="prev, pager, next"
          :total="total"
          style="text-align: center; margin-top: 20px"
          @current-change="handleCurrentChange"
          v-show="spuList.length > 0"
        >
        </el-pagination>
      </div>
      <!-- 这是spu的新增和修改页面-->
      <div v-show="scene == 2">
        <el-form :model="spuInfo" label-width="80px">
          <el-form-item label="SPU名称">
            <el-input v-model="spuInfo.spuName"></el-input>
          </el-form-item>
          <el-form-item label="品牌">
            <el-select v-model="spuInfo.tmId" placeholder="请选择名牌">
              <el-option
                :label="tm.tmName"
                :value="tm.id"
                v-for="tm in tmInfo"
                :key="tm.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="SPU描述">
            <el-input type="textarea" v-model="spuInfo.description"></el-input>
          </el-form-item>
          <el-form-item label="SPU图片">
            <el-upload
              action="/dev-api/admin/product/fileUpload"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :file-list="spuImageInfo"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="" />
            </el-dialog>
          </el-form-item>
          <el-form-item label="销售属性">
            <el-select  :placeholder="`还未选择的销售属性有${unSelect.length}`" v-model="attrId">
              <el-option
                :label="sale.name"
                :value="sale.id"
                v-for="sale in unSelect"
                :key="sale.id"
              ></el-option>
            </el-select>
            <el-button type="primary" icon="el-icon-plus" :disabled="!attrId"
              >添加销售属性</el-button
            >
            <el-table
              :data="spuInfo.spuSaleAttrList"
              border
              style="width: 100%"
            >
              <el-table-column label="序号" width="180" type="index">
              </el-table-column>
              <el-table-column prop="saleAttrName" label="属性名" width="250">
              </el-table-column>
              <el-table-column label="属性值名称列表">
                <template slot-scope="{ row }">
                  <el-tag
                    :key="tag.id"
                    v-for="tag in row.spuSaleAttrValueList"
                    closable
                    :disable-transitions="false"
                    @close="handleClose(tag)"
                  >
                    {{ tag.saleAttrValueName }}
                  </el-tag>
                  <el-input
                    class="input-new-tag"
                    v-if="row.inputVisible"
                    v-model="row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm"
                    @blur="handleInputConfirm"
                  >
                  </el-input>
                  <el-button
                    v-else
                    class="button-new-tag"
                    size="small"
                    @click="showInput"
                    >+ 添加</el-button
                  >
                </template>
              </el-table-column>
              <el-table-column label="操作"> </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">立即创建</el-button>
            <el-button @click="scene = 1">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 这是新增sku模块-->
      <div v-show="scene == 3">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="SPU名称">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="SKU名称">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="价格(元)">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="重量(千克)">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="规格描述">
            <el-input type="textarea" v-model="form.desc"></el-input>
          </el-form-item>
          <el-form-item label="平台属性">
            <el-select v-model="form.region" placeholder="请选择名牌">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="销售属性">
            <el-select v-model="form.region" placeholder="请选择名牌">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="图片列表">
            <el-table :data="tableData" border style="width: 100%">
              <el-table-column prop="date" label="序号" width="180">
              </el-table-column>
              <el-table-column prop="name" label="图片" width="180">
              </el-table-column>
              <el-table-column prop="address" label="名称"> </el-table-column>
              <el-table-column prop="address" label="操作">
                <el-button type="primary">设为默认</el-button>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">立即创建</el-button>
            <el-button @click="scene = 1">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  name: 'spu',
  data() {
    return {
      scene: 1,
      isShow: true,
      spuList: [],
      currentPage: '1',
      limit: 5,
      tableData: [],
      total: 0,
      category1Id: '',
      category2Id: '',
      category3Id: '',
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
      },
      dialogImageUrl: '',
      dialogVisible: false,
      spuInfo: {
        category3Id: 0,
        description: '',
        spuName: '',
        tmId: '',
        spuImageList: [
          {
            id: 0,
            imgName: 'string',
            imgUrl: 'string',
            spuId: 0,
          },
        ],
        spuSaleAttrList: [
          {
            baseSaleAttrId: 0,
            id: 0,
            saleAttrName: '',
            spuId: 0,
            spuSaleAttrValueList: [
              {
                baseSaleAttrId: 0,
                id: 0,
                isChecked: 'string',
                saleAttrName: 'string',
                saleAttrValueName: 'string',
                spuId: 0,
              },
            ],
          },
        ],
      },
      tmInfo: [],
      spuImageInfo: [],
      saleInfo: [],
      attrId:''
    }
  },
  methods: {
    getCategoryId({ categoryId, level }) {
      // console.log({categoryId, level});
      if (level == 1) {
        this.category1Id = categoryId
        this.category2Id = ''
        this.category3Id = ''
      } else if (level == 2) {
        this.category2Id = categoryId
        this.category3Id = ''
      } else if (level == 3) {
        this.category3Id = categoryId
        //获取基础属性
        this.getSpuList()
      }
    },
    onSubmit() {
      console.log('submit!')
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    //分页器改变当前页的回调
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currentPage = val
      this.getSpuList()
    },
    //获取SPU列表展示数据
    async getSpuList() {
      const { currentPage } = this
      let result = await this.$API.spu.reqSpuList(
        currentPage,
        5,
        this.category3Id
      )
      // console.log(result)
      if (result.code == 200) {
        this.spuList = result.data.records
        this.total = result.data.total
      }
    },
    //点击修改SPU按钮回调
    async updateSpu(row) {
      this.scene = 2
      this.attrId = ''
      //发4个请求  请求修改页面的展示数据
      //获取spu信息
      let spuResult = await this.$API.spu.reqSpu(row.id)
      if (spuResult.code == 200) {
        this.spuInfo = spuResult.data
        // console.log(this.spuInfo)
      }
      //获取品牌接口
      let tmResult = await this.$API.spu.getTradeMarkList()
      if (tmResult.code == 200) {
        this.tmInfo = tmResult.data
      }
      //获取spu图片
      let imgResult = await this.$API.spu.getSpuImageList(row.id)
      if (imgResult.code == 200) {
        let array = imgResult.data
        array.forEach((element) => {
          element.name = element.imgName
          element.url = element.imgUrl
        })
        // console.log(array)
        this.spuImageInfo = array
      }
      //获取所有销售属性
      let saleResult = await this.$API.spu.getSaleAttr()
      if (saleResult.code == 200) {
        this.saleInfo = saleResult.data
      }
    },
    showInput() {},
  },
  computed: {
    unSelect() {
      if (this.saleInfo ) {
        let result = this.saleInfo.filter((item) => {
          return this.spuInfo.spuSaleAttrList.every((item1) => {
            return item.name != item1.saleAttrName
          })
        })
        return result
      }
    },
  },
}
</script>
<style scoped>
</style>
