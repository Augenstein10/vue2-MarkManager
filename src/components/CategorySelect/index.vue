<template>
  <div>
    <el-form :inline="true" :model="categoryIdList" class="demo-form-inline">
      <el-form-item label="一级分类">
        <el-select
          v-model="categoryIdList.category1Id"
          placeholder="请选择"
          @change="handler1"
        >
          <el-option
            :label="c1.name"
            v-for="c1 in categoryList.category1"
            :key="c1.id"
            :value="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          v-model="categoryIdList.category2Id"
          placeholder="请选择"
          @change="handler2"
        >
          <el-option
            :label="c2.name"
            v-for="c2 in categoryList.category2"
            :key="c2.id"
            :value="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          v-model="categoryIdList.category3Id"
          placeholder="请选择"
          @change="handler3"
        >
          <el-option
            :label="c3.name"
            v-for="c3 in categoryList.category3"
            :key="c3.id"
            :value="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'CategorySelect',
  data() {
    return {
      categoryList: {
        category1: [],
        category2: [],
        category3: [],
      },
      categoryIdList: {
        category1Id: '',
        category2Id: '',
        category3Id: '',
      },
    }
  },
  mounted() {
    this.getCategory1()
  },
  methods: {
    async getCategory1() {
      let result = await this.$API.attr.reqCategoryList1()
      if (result.code == 200) {
        this.categoryList.category1 = result.data
        // console.log(result.data);
      }
    },
    async getCategory2() {
      let result = await this.$API.attr.reqCategoryList2(
        this.categoryIdList.category1Id
      )
      if (result.code == 200) {
        this.categoryList.category2 = result.data
        // console.log(result.data);
      }
    },
    async getCategory3() {
      let result = await this.$API.attr.reqCategoryList3(
        this.categoryIdList.category2Id
      )
      if (result.code == 200) {
        this.categoryList.category3 = result.data
        // console.log(result.data);
      }
    },
    handler1() {
      const {category1Id} = this.categoryIdList
      this.categoryList.category2 = []
      this.categoryList.category3 = []
      this.categoryIdList.category2Id = ''
      this.categoryIdList.category3Id = ''
      this.getCategory2()
      this.$emit('getCategoryId',{categoryId:category1Id, level:1})
    },
    handler2() {
      const {category2Id} = this.categoryIdList
      this.categoryList.category3 = []
      this.categoryIdList.category3Id = ''
      this.getCategory3()
      this.$emit('getCategoryId',{categoryId:category2Id, level:2})
    },
    handler3(){
      const {category3Id} = this.categoryIdList
      this.$emit('getCategoryId',{categoryId:category3Id, level:3})
    }
  },
 
}
</script>
<style scoped>
</style>
