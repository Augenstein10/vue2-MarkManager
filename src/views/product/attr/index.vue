<template>
  <div>
    <el-card style="margin: 20px 0px">
      <CategorySelect @getCategoryId = "getCategoryId" />
    </el-card>
    <el-card >
      <el-button type="primary" icon="el-icon-plus" style="margin-bottom:20px" :disabled="!category3Id">添加属性</el-button>
      <el-table :data="attrList" border style="width: 100%"  v-show="category3Id">
        <el-table-column  label="序号" width="180" type="index" align="center">
        </el-table-column>
        <el-table-column prop="attrName" label="属性名称" width="180">
        </el-table-column>
        <el-table-column label="属性值列表"> 
          <template slot-scope="{row}">
            <el-tag v-for="tag in row.attrValueList" :key="tag.id">{{tag.valueName}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作"> 
          <template slot-scope="{row}">
            <el-button type="warning" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
          </template>
        </el-table-column>

      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      attrList: [],
      category1Id:'',
      category2Id:'',
      category3Id:'',
    }
  },
  mounted(){
    
  },
  methods:{
    getCategoryId({categoryId, level}){
      // console.log({categoryId, level});
      if(level == 1){
        this.category1Id = categoryId;
        this.category2Id = '';
        this.category3Id = '';
      }else if(level == 2){
        this.category2Id = categoryId;
        this.category3Id = '';
      }else if(level == 3){
        this.category3Id = categoryId;
        //获取基础属性
        this.getAttrList();
      }
    },
    async getAttrList(){
      const {category1Id, category2Id, category3Id} = this
      let result = await this.$API.attr.reqAttrList(category1Id, category2Id, category3Id);
      console.log(result);
      this.attrList = result.data;
    }
  }
}
</script>
<style scoped>
</style>
