<template>
  <div>
    <el-button
      type="primary"
      icon="el-icon-plus"
      @click="
        dialogFormVisible = true
        tmFrom = { logoUrl: '', tmName: '' }
      "
      >添加</el-button
    >
    <!--弹出框 -->
    <el-dialog title="添加品牌" :visible.sync="dialogFormVisible">
      <el-form :model="tmFrom" :rules="rules" ref="ruleForm">
        <el-form-item
          label="品牌名称"
          :label-width="formLabelWidth"
          prop="tmName"
          style="width: 60%"
        >
          <el-input v-model="tmFrom.tmName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="品牌LOGO"
          :label-width="formLabelWidth"
          prop="logoUrl"
        >
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmFrom.logoUrl" :src="tmFrom.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 表单-->
    <el-table :data="list" border style="width: 100%; margin-top: 50px">
      <el-table-column label="序号" width="180" type="index"> </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="180">
      </el-table-column>
      <el-table-column label="品牌LOGO">
        <template slot-scope="{ row }">
          <img :src="row.logoUrl" alt="" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{ row }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="updateTmFrom(row)"
            >修改</el-button
          >
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteTradeMark(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!--分页器 -->
    <div class="block" style="margin-top: 50px; text-align: center">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[3, 5, 10]"
        :page-size="limit"
        layout=" prev, pager, next, jumper,->,total, sizes"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      page: 1,
      limit: 5,
      total: 0,
      list: [],
      dialogFormVisible: false,
      tmFrom: {
        logoUrl: '',
        tmName: '',
      },
      formLabelWidth: '120px',
      rules: {
        tmName: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          { min: 1, max: 5, message: '长度在 1 到 5 个字符', trigger: 'blur' },
        ],
        logoUrl: [{ required: true, message: '请选择照片' }],
      },
    }
  },
  methods: {
    //一页显示多少条数据
    handleSizeChange(val) {
      this.limit = val
      this.getPageList()
    },
    //修改当前页
    handleCurrentChange(val) {
      this.page = val
      this.getPageList()
      // console.log('当前第' + this.page + '页')
    },
    //获取页面品牌数据列表k
    async getPageList() {
      const { page, limit } = this
      let result = await this.$API.trademark.reqTradeMarkList(page, limit)
      if (result.code == 200) {
        this.total = result.data.total
        this.list = result.data.records
      }
    },
    //文件上传成功时的钩子
    handleAvatarSuccess(res, file) {
      // console.log(file.raw)
      this.tmFrom.logoUrl = URL.createObjectURL(file.raw)
      console.log(this.tmFrom)
    },
    //上传文件之前的钩子
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    //弹出框的提交表单
    submitForm() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          //发请求
          let result = await this.$API.trademark.reqAddorUpdaeTradeMark(
            this.tmFrom
          )
          if (result.code == 200) {
            this.dialogFormVisible = false
            this.page = 1
            if (!this.tmFrom.id) {
              this.$message({
                message: '添加成功',
                type: 'success',
              })
            } else {
              this.$message({
                message: '修改成功',
                type: 'success',
              })
            }
            this.getPageList()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    //点击修改按钮
    updateTmFrom(row) {
      this.dialogFormVisible = true
      // console.log(row,{...row});
      this.tmFrom = { ...row }
    },
    //点击删除
    async deleteTradeMark(row){
      // console.log(row.id);
      let result = await this.$API.trademark.deleteTrademark(row.id)
      if(result.code == 200){
         this.$message({
          message: '删除成功',
          type: 'warning'
        });
        this.getPageList();
      }
      // console.log(result);
    }
  },
  mounted() {
    //获取页面数据
    this.getPageList()
  },
}
</script>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
