<template>
  <div>
    <el-card style="margin: 20px 0px">
      <CategorySelect @getCategoryId="getCategoryId" :show = 'isShow'/>
    </el-card>
    <el-card>
      <!-- 属性列表表格-->
      <div v-show="isShow">
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin-bottom: 20px"
          :disabled="!category3Id"
          @click="addAttr"
          >添加属性</el-button
        >
        <el-table :data="attrList" border style="width: 100%">
          <el-table-column label="序号" width="180" type="index" align="center">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="180">
          </el-table-column>
          <el-table-column label="属性值列表">
            <template slot-scope="{ row }">
              <el-tag v-for="tag in row.attrValueList" :key="tag.id">{{
                tag.valueName
              }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="操作">
            <template slot-scope="{ row }">
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="updateAttr(row)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加属性与属性值的接口-->
      <div v-show="!isShow">
        <el-form :inline="true" :model="attrInfo" class="demo-form-inline">
          <el-form-item label="属性名">
            <el-input
              placeholder="请输入属性名"
              v-model="attrInfo.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!attrInfo.attrName"
          @click="addAttrValue"
          >添加属性值</el-button
        >
        <el-button type="" @click="cancelAdd">取消</el-button>
        <el-table
          :data="attrInfo.attrValueList"
          border
          style="width: 100%; margin-bottom: 20px; margin-top: 20px"
        >
          <el-table-column prop="date" label="序号" width="180" type="index">
          </el-table-column>
          <el-table-column prop="name" label="属性值名称" width="180">
            <template slot-scope="{ row, $index }">
              <el-input
                placeholder="请输入属性值"
                size="mini"
                v-model="row.valueName"
                v-if="row.flag"
                @blur="toLook(row)"
                :ref="$index"
              ></el-input>
              <span
                v-else
                @click="toEdit(row, $index)"
                style="display: block"
                >{{ row.valueName }}</span
              >
            </template>
          </el-table-column>
          <el-table-column prop="address" label="操作">
            <template slot-scope="{ row, $index }">
              <el-popconfirm
                :title="`你确定删除${row.valueName}吗？`"
                @onConfirm="delAttr($index)"
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
        <el-button type="primary" @click="addOrUpdateAttr" :disabled="!attrInfo.attrValueList.length">保存</el-button>
        <el-button type="" @click="isShow = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>
<script>
import cloneDeep from 'lodash/cloneDeep'
export default {
  data() {
    return {
      attrList: [],
      category1Id: '',
      category2Id: '',
      category3Id: '',
      isShow: true,
      attrInfo: {
        //属性名
        attrName: '',
        //属性值列表
        attrValueList: [],
        //三级分类的id
        categoryId: 0,
        //告诉服务器这是三级分类
        categoryLevel: 3,
      },
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
        this.getAttrList()
      }
    },
    //获取属性列表
    async getAttrList() {
      const { category1Id, category2Id, category3Id } = this
      let result = await this.$API.attr.reqAttrList(
        category1Id,
        category2Id,
        category3Id
      )
      // console.log(result)
      this.attrList = result.data
    },
    //添加属性值的按钮
    addAttrValue() {
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id,
        valueName: '',
        flag: true,
      })
      //添加新属性值时自动聚焦
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus()
      })
    },
    //点击去添加属性的按钮
    addAttr() {
      this.isShow = false
      this.attrInfo = {
        //属性名
        attrName: '',
        //属性值列表
        attrValueList: [],
        //三级分类的id
        categoryId: this.category3Id,
        //告诉服务器这是三级分类
        categoryLevel: 3,
      }
    },
    //取消添加属性值
    cancelAdd() {
      this.attrInfo.attrValueList = []
    },
    //修改某个属性
    updateAttr(row) {
      this.isShow = false

      // 使用这个浅拷贝不能解决问题 this.attrInfo = {...row}
      //需要用到lodash的深拷贝
      this.attrInfo = cloneDeep(row)
      this.attrInfo.attrValueList.forEach((item) => {
        //只有这样写 vue 才能检测到数据变化  如果用遍历对象.属性的方法添加的话是检测不到的
        this.$set(item, 'flag', false)
      })
    },
    //去查看模式(切换成span 标签)
    toLook(row) {
      // console.log(row);
      if (row.valueName.trim() == '') {
        this.$message('属性值名称不能为空')
        return
      }
      //新增的属性值不能与已有的属性值重复
      let isRepat = this.attrInfo.attrValueList.some((item) => {
        if (row !== item) {
          return row.valueName.trim() == item.valueName
        }
      })
      if (isRepat) {
        this.$message('属性值不能重复')
        return
      }
      row.flag = false
    },
    //去编辑模式  点击span切换成input
    toEdit(row, index) {
      row.flag = true
      this.$nextTick(() => {
        this.$refs[index].focus()
      })
    },
    //删除未确定的属性值
    delAttr(index) {
      this.attrInfo.attrValueList.splice(index, 1)
    },
    //点击保存按钮
    async addOrUpdateAttr() {
      //整理数据  重新赋值给attrValueList
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(
        (item) => {
          delete item.flag
          return item.valueName != ''
        }
      )
      //发请求保存数据
      try {
        await this.$API.attr.reqAddAttr(this.attrInfo)
        this.$message({
          type: 'success',
          message: '保存成功',
        })
        this.isShow = true
        //重新请求数据刷新表格
        this.getAttrList()
      } catch (error) {
        this.$message.error('保存失败')
      }
    },
  },
  computed: {},
}
</script>
<style scoped>
</style>
