<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table
        :data="catelist"
        size="small"
        style="width: 100%; margin-bottom: 20px"
        row-key="cat_id"
        border
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column prop="cat_name" label="分类名称"></el-table-column>
        <el-table-column prop="cat_deleted" label="是否有效">
          <template slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted" style="color: lightgreen;"></i>
          <i class="el-icon-error" v-else style="color: red;"></i>
        </template>
        </el-table-column>
        <el-table-column label="排序" prop="cat_level">
          <template slot-scope="scope">
            <el-tag size="mini" type="primary" v-if="scope.row.cat_level==0">一级</el-tag>
            <el-tag size="mini" type="success" v-if="scope.row.cat_level==1">二级</el-tag>
            <el-tag size="mini" type="warning" v-if="scope.row.cat_level==2">三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="180">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="编辑" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.cat_id)"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeCateById(scope.row.cat_id)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1,2,5, 10, 30, 50]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed"
      >
      <!-- 内容主体区域 -->
      <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类" prop="cat_pid">
          <!-- cascaderProps 用来指定配置对象 -->
          <el-cascader v-model="selectedKeys" :options="parentCatelist" :props="cascaderProps"
            @change="parentCateChanged" clearable ></el-cascader>
        </el-form-item>
      </el-form>

      <!-- 底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改分类的对话框 -->
    <el-dialog
      title="修改分类"
      :visible.sync="editCateDialogVisible"
      width="50%"
      @close="editCateDialogClosed"
      >
      <!-- 内容主体区域 -->
      <el-form :model="editCateForm" :rules="editCateFormRules" ref="editCateFormRef" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>

      <!-- 底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCateInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 商品分类的数据列表
      catelist: [],
      total: 0,
      addCateDialogVisible: false,
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 父级分类列表
      parentCatelist: [],
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
        checkStrictly: true
      },
      // 选中的父级分配的id数组
      selectedKeys: [],

      editCateDialogVisible: false,
      editCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      editCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getCatelist()
  },
  methods: {
    // 获取商品分类数据
    async getCatelist() {
      const { data: res } = await this.$axios.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类数据失败！')
      }
      this.catelist = res.data.result
      this.total = res.data.total
    },
    // 监听 pagezise 改变事件
    handleSizeChange (val) {
      this.queryInfo.pagesize = val
      this.getCatelist()
    },
    // 监听 pagenum页码值 改变事件
    handleCurrentChange (val) {
      this.queryInfo.pagenum = val
      this.getCatelist()
    },
    showAddCateDialog() {
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    // 获取父级分类的数据列表
    async getParentCateList() {
      const { data: res } = await this.$axios.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类数据失败！')
      }
      this.parentCatelist = res.data
    },
    // 选择项发生变化触发
    parentCateChanged() {
      // 如果数组大于0则代表选中父级分类
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
      } else {
        this.addCateForm.cat_pid = 0
      }
      // 当前分类等级赋值
      this.addCateForm.cat_level = this.selectedKeys.length
    },
    addCate() {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return false
        // 可以发起添加的网络请求
        const { data: res } = await this.$axios.post('categories', this.addCateForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败！')
        }
        this.$message.success('添加分类成功！')
        // 隐藏添加分类对话框
        this.addCateDialogVisible = false
        // 重新获取分类列表数据
        this.getCatelist()
      })
    },
    // 监听对话框的关闭事件，重置表单数据
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    },
    // 展示编辑分类的对话框
    async showEditDialog (id) {
      const { data: res } = await this.$axios.get(`categories/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('查询分类信息失败！')
      }
      this.editCateForm = res.data
      this.editCateDialogVisible = true
    },
    // 监听修改分类对话框的关闭事件
    editCateDialogClosed () {
      this.$refs.editCateFormRef.resetFields()
    },
    // 修改分类信息并提交
    editCateInfo () {
      this.$refs.editCateFormRef.validate(async valid => {
        if (!valid) return false
        // 可以发起添加的网络请求
        const { data: res } = await this.$axios.put(`categories/${this.editCateForm.cat_id}`, {
          cat_name: this.editCateForm.cat_name
        })
        if (res.meta.status !== 200) {
          return this.$message.error('更新分类信息失败！')
        }
        // 隐藏添加分类对话框
        this.editCateDialogVisible = false
        // 重新获取分类列表数据
        this.getCatelist()
        this.$message.success('更新分类信息成功！')
      })
    },
    // 根据id删除对应的分类信息
    async removeCateById (id) {
      const confirmResult = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }

      const { data: res } = await this.$axios.delete(`categories/${id}`)

      if (res.meta.status !== 200) {
        return this.$message.error('删除分类失败！')
      }

      this.$message.success('删除分类成功')
      // 重新获取分类列表数据
      this.getCatelist()
    }
  }
}
</script>
<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>
<style lang="less">
.el-cascader-menu {
  height: 200px;
}
.el-cascader-panel {
  .el-radio{
    width: 100%;
    height: 100%;
    z-index: 10;
    position: absolute;
    top: 10px;
    right: 10px;
  }
  .el-radio__input {
    visibility: hidden;
  }
  .el-cascader-node__postfix {
    top: 10px;
  }
}
</style>
