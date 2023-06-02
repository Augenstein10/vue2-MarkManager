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
          @click="addSpu"
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
                @click="toAddSku(row)"
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
                @click="toLookSku(row)"
              ></el-button>
              <el-popconfirm
                title="这是一段内容确定删除吗？"
                @onConfirm="delSpu(row)"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          :page-size="limit"
          :pager-count="11"
          layout="prev, pager, next"
          :total="total"
          style="text-align: center; margin-top: 20px"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
        

        <el-dialog :title="spuName" :visible.sync="dialogTableVisible"  @close="close">
          <el-table :data="skuList" v-loading="loading">
            <el-table-column
              property="skuName"
              label="名称"
              width="200"
            ></el-table-column>
            <el-table-column
              property="price"
              label="价格"
              width="120"
            ></el-table-column>
            <el-table-column property="weight" label="重量"></el-table-column>
            <el-table-column  label="默认图片">
              <template slot-scope="{row}">
                  <img :src="row.skuDefaultImg" style="width:100px;height:100px">
              </template>
            </el-table-column>
          </el-table>
        </el-dialog>
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
              :on-success="handleAvatarSuccess"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="" />
            </el-dialog>
          </el-form-item>
          <el-form-item label="销售属性">
            <el-select
              :placeholder="`还未选择的销售属性有${unSelect.length}`"
              v-model="attrIdAanAttrName"
            >
              <el-option
                :label="sale.name"
                :value="`${sale.id}:${sale.name}`"
                v-for="sale in unSelect"
                :key="sale.id"
              ></el-option>
            </el-select>
            <el-button
              type="primary"
              icon="el-icon-plus"
              :disabled="!attrIdAanAttrName"
              @click="addSale"
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
                    v-for="(tag, index) in row.spuSaleAttrValueList"
                    closable
                    :disable-transitions="false"
                    @close="handleClose(row, index)"
                  >
                    {{ tag.saleAttrValueName }}
                  </el-tag>
                  <el-input
                    class="input-new-tag"
                    v-if="row.inputVisible"
                    v-model="row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(row)"
                    @blur="handleInputConfirm(row)"
                  >
                  </el-input>
                  <el-button
                    v-else
                    class="button-new-tag"
                    size="small"
                    @click="showInput(row)"
                    >+ 添加</el-button
                  >
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="{ row, $index }">
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    size="mini"
                    @click="spuInfo.spuSaleAttrList.splice($index, 1)"
                  ></el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit"> 保存 </el-button>
            <el-button @click="cancel">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 这是新增sku模块-->
      <div v-show="scene == 3">
        <el-form ref="form" :model="skuInfo" label-width="80px">
          <el-form-item label="SPU名称">
            {{ spu.spuName }}
          </el-form-item>
          <el-form-item label="SKU名称">
            <el-input v-model="skuInfo.skuName"></el-input>
          </el-form-item>
          <el-form-item label="价格(元)">
            <el-input v-model="skuInfo.price" type="number"></el-input>
          </el-form-item>
          <el-form-item label="重量(千克)">
            <el-input v-model="skuInfo.weight"></el-input>
          </el-form-item>
          <el-form-item label="规格描述">
            <el-input type="textarea" v-model="skuInfo.skuDesc"></el-input>
          </el-form-item>
          <el-form-item label="平台属性">
            <el-form :inline="true" label-width="80px">
              <el-form-item
                :label="attr.attrName"
                v-for="attr in attrInfoList"
                :key="attr.id"
              >
                <el-select
                  v-model="attr.attrIdAndValueId"
                  placeholder="请选择名牌"
                >
                  <el-option
                    :label="attrValue.valueName"
                    :value="`${attr.id}:${attrValue.id}`"
                    v-for="attrValue in attr.attrValueList"
                    :key="attrValue.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </el-form-item>
          <el-form-item label="销售属性">
            <el-form :inline="true" ref="form" label-width="80px">
              <el-form-item
                :label="sale.saleAttrName"
                v-for="sale in spuSaleAttrList"
                :key="sale.id"
              >
                <el-select
                  v-model="sale.attrIdAndValueId"
                  placeholder="请选择名牌"
                >
                  <el-option
                    :label="saleValue.saleAttrValueName"
                    :value="`${sale.id}:${saleValue.id}`"
                    v-for="saleValue in sale.spuSaleAttrValueList"
                    :key="saleValue.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </el-form-item>

          <el-form-item label="图片列表">
            <el-table
              :data="spuImageList"
              border
              style="width: 100%"
              @selection-change="handleSelectionChange"
            >
              <el-table-column label="序号" width="180" type="selection">
              </el-table-column>
              <el-table-column label="图片" width="180">
                <template slot-scope="{ row }">
                  <img
                    :src="row.imgUrl"
                    :alt="spuImageList.imgName"
                    style="width: 100px; height: 100px"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="imgName" label="名称"></el-table-column>
              <el-table-column prop="address" label="操作">
                <template slot-scope="{ row, $index }">
                  <el-button
                    type="primary"
                    v-if="row.isDefault == 0"
                    @click="setDefault(row)"
                    >设为默认</el-button
                  >
                  <el-button v-else>默认</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="save">保存</el-button>
            <el-button @click="cancel1">取消</el-button>
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
      dialogTableVisible: false,
      isShow: true,
      spuList: [],
      currentPage: '1',
      limit: 4,
      loading:true,
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
        },
      ],
      total: 0,
      category1Id: '',
      category2Id: '',
      category3Id: '',
      dialogImageUrl: '',
      dialogVisible: false,
      spuInfo: {
        category3Id: 0,
        description: '',
        spuName: '',
        tmId: '',
        spuImageList: [],
        spuSaleAttrList: [],
      },
      tmInfo: [],
      spuImageInfo: [],
      saleInfo: [],
      attrIdAanAttrName: '',
      skuInfo: {
        category3Id: 0,
        price: '',
        spuId: 0,
        tmId: 0,
        skuAttrValueList: [
          // {
          //   // attrId: 0,
          //   // skuId: 0,
          //   // valueId: 0,
          // },
        ],
        skuDefaultImg: '',
        skuDesc: '',
        skuImageList: [
          // {
          //   // id: 0,
          //   // imgName: 'string',
          //   // imgUrl: 'string',
          //   // isDefault: 'string',
          //   // skuId: 0,
          //   // spuImgId: 0,
          // },
        ],
        skuName: '',
        skuSaleAttrValueList: [
          // {
          //   // id: 0,
          //   // saleAttrId: 0,
          //   // saleAttrName: 'string',
          //   // saleAttrValueId: 0,
          //   // saleAttrValueName: 'string',
          //   // skuId: 0,
          //   // spuId: 0,
          // },
        ],

        weight: '',
      },
      attrInfoList: [],
      spuSaleAttrList: [],
      spuImageList: [],
      spu: {},
      imageList: [],
      skuList:[],
      spuName:''
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
    //保存对SPU的添加和修改操作
    async onSubmit() {
      // console.log('submit!')
      //整理参数  只需要整理图片的数据内容  其他不需要整理了
      this.spuInfo.spuImageList = this.spuImageInfo.map((item) => {
        return {
          imageName: item.name,
          //适用于两种情况：本来已有的图片或者修改上传后的图片
          imageUrl: (item.response && item.response.data) || item.url,
        }
      })
      //发请求
      let result = await this.$API.spu.reqAddOrUpdateSpu(this.spuInfo)
      // console.log(result);
      if (result.code == 200) {
        this.scene = 1
        this.getSpuList()
        this.$message({
          type: 'success',
          message: '修改成功',
        })
      }
    },
    //照片墙的删除图片操作
    handleRemove(file, fileList) {
      // console.log(file, fileList)
      this.spuImageInfo = fileList
    },
    //照片墙上传图片成功的回调
    handleAvatarSuccess(response, file, fileList) {
      // console.log(fileList)
      this.spuImageInfo = fileList
    },
    //照片墙的图片预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    //分页器改变当前页的回调
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      this.currentPage = val
      this.getSpuList()
    },
    //获取SPU列表展示数据
    async getSpuList() {
      const { currentPage, limit, category3Id } = this
      let result = await this.$API.spu.reqSpuList(
        currentPage,
        limit,
        category3Id
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
    //添加销售属性的按钮回调
    addSale() {
      //把收集到的属性进行分割
      const [baseSaleAttrId, saleAttrName] = this.attrIdAanAttrName.split(':')
      //创建一个对象  并往里面添加spuSaleAttrValueList属性
      // console.log(baseSaleAttrId,saleAttrName);
      let newSaleAttr = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: [],
      }
      this.spuInfo.spuSaleAttrList.push(newSaleAttr)
      //清空选择框
      this.attrIdAanAttrName = ''
    },
    //点击添加属性值列表按钮的回调
    showInput(row) {
      // console.log(row);
      //添加input和button的切换flag
      this.$set(row, 'inputVisible', true)
      //添加收集到input框的值
      this.$set(row, 'inputValue', '')
    },
    //tag标签失去焦点或者按回车时触发的回调
    handleInputConfirm(row) {
      //将inputValue的值添加到spuSaleAttrValueList里面
      //解构数据
      const { baseSaleAttrId, inputValue } = row
      //对输入的数据进行约束
      if (inputValue.trim() == '') {
        this.$message('属性值名称不能为空')
        return
      }
      let result = row.spuSaleAttrValueList.some((item) => {
        return item.saleAttrValueName == inputValue
      })
      if (result) {
        this.$message('属性值名称不允许重复')
        return
      }

      let newSaleAttrValue = { baseSaleAttrId, saleAttrValueName: inputValue }
      row.spuSaleAttrValueList.push(newSaleAttrValue)
      //显示button添加按钮
      row.inputVisible = false
    },
    //标签的删除回调
    handleClose(row, index) {
      // console.log(row,index);
      row.spuSaleAttrValueList.splice(index, 1)
    },
    //添加SPU按钮
    async addSpu() {
      //清空表单数据
      // Object.assign(this._data, this.$options.data());
      this.spuInfo = {
        category3Id: 0,
        description: '',
        spuName: '',
        tmId: '',
        spuImageList: [],
        spuSaleAttrList: [],
      }
      this.spuImageInfo = []
      this.scene = 2
      this.isShow = false
      this.spuInfo.category3Id = this.category3Id
      // 发送两个请求  品牌和销售属性
      let tmResult = await this.$API.spu.getTradeMarkList()
      if (tmResult.code == 200) {
        this.tmInfo = tmResult.data
      }

      let saleResult = await this.$API.spu.getSaleAttr()
      if (saleResult.code == 200) {
        this.saleInfo = saleResult.data
      }
    },
    //spu添加界面的取消按钮
    cancel() {
      this.scene = 1
      this.isShow = true
      //清除数据
      this.spuInfo = {
        category3Id: 0,
        description: '',
        spuName: '',
        tmId: '',
        spuImageList: [],
        spuSaleAttrList: [],
      }
      this.spuImageInfo = []
    },
    //删除SPU按钮
    async delSpu(row) {
      //发送请求
      let result = await this.$API.spu.reqDelSpu(row.id)
      if ((result.code = 200)) {
        console.log(result)
        this.$message({
          type: 'success',
          message: '删除成功',
        })
        //刷新列表重新请求数据
        this.getSpuList()
      }
    },
    //去SKU添加页面
    async toAddSku(row) {
      const { category1Id, category2Id, category3Id } = this
      this.scene = 3
      //收集数据
      this.skuInfo.category3Id = category3Id
      this.skuInfo.spuId = row.id
      this.skuInfo.tmId = row.tmId
      this.spu = row
      // console.log(row);
      let result = await this.$API.spu.reqSpuImageList(row.id)
      if (result.code == 200) {
        let list = result.data
        list.forEach((element) => {
          element.isDefault = 0
        })
        this.spuImageList = list
      }
      let result1 = await this.$API.spu.reqSpuSaleAtrrList(row.id)
      if (result1.code == 200) {
        this.spuSaleAttrList = result1.data
      }
      let result2 = await this.$API.spu.reqAttrInfoList(
        category1Id,
        category2Id,
        category3Id
      )
      if (result2.code == 200) {
        this.attrInfoList = result2.data
      }
    },
    //改变图片列表的选择状态
    handleSelectionChange(params) {
      this.imageList = params
    },
    //设置图片为默认图片
    setDefault(row) {
      //先把列表的数据isDefault设为0
      // this.imageList.forEach((item)=>{
      // })
      this.spuImageList.forEach((item) => {
        item.isDefault = 0
      })
      //点击的那个设置为1
      row.isDefault = 1
      //收集默认图片地址
      this.skuInfo.skuDefaultImg = row.imgUrl
    },
    //sku添加页面的取消按钮
    cancel1() {
      this.scene = 1
      this.isShow = true
      //清空数据
      this.skuInfo = {
        category3Id: 0,
        price: 0,
        spuId: 0,
        tmId: 0,
        skuAttrValueList: [],
        skuDefaultImg: '',
        skuDesc: '',
        skuImageList: [],
        skuName: '',
        skuSaleAttrValueList: [],
        weight: '',
      }
    },
    //对sku进行添加按钮
    async save() {
      //整理数据
      const { attrInfoList, skuInfo, spuSaleAttrList, imageList } = this
      let arr = []
      attrInfoList.forEach((element) => {
        const [attrId, valueId] = element.attrIdAndValueId.split(':')
        let obj = { attrId, valueId }
        arr.push(obj)
      })
      skuInfo.skuAttrValueList = arr

      let arr1 = []
      spuSaleAttrList.forEach((item) => {
        const [saleAttrId, saleAttrValueId] = item.attrIdAndValueId.split(':')
        let obj = { saleAttrId, saleAttrValueId }
        arr1.push(obj)
      })
      skuInfo.skuSaleAttrValueList = arr1

      skuInfo.skuImageList = imageList.map((item) => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id,
        }
      })
      //发请求
      let result = await this.$API.spu.reqSaveSku(skuInfo)
      console.log(result)

      if (result.code == 200) {
        this.scene = 1
        this.$message({
          type: 'success',
          message: '添加sku成功',
        })
      }
    },
    //通过spuid查看sku列表
    async toLookSku(row) {
      this.dialogTableVisible = true
      this.spuName = row.spuName;
      let result = await this.$API.spu.reqSkuBySpuId(row.id);
      if(result.code == 200 ){
        this.skuList = result.data;
        this.loading = false;
      }
    },
    close(){
      // console.log("关闭");
      //重置loading为true 并且清空skuList中的数据 
      this.loading = true;
      this.skuList = [];
    }
  },
  computed: {
    unSelect() {
      let result = this.saleInfo.filter((item) => {
        return this.spuInfo.spuSaleAttrList.every((item1) => {
          return item.name != item1.saleAttrName
        })
      })
      return result
    },
  },
}
</script>
<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
