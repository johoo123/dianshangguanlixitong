<template>
  <div>
    <el-steps :active="activeIndex" finish-status="success">
      <el-step title="第一步" description="基本信息" ></el-step>
      <el-step title="第二步" description="商品图片"></el-step>
      <el-step title="第三步" description="商品内容"></el-step>
    </el-steps>
    <el-tabs @tab-click="clickTab" tab-position="left" v-model="activeName">
      <el-tab-pane label="基本信息" name="one">
        <el-form :model="addGoodsForm" label-width="80px" ref='form'>
          <el-form-item label="商品名称">
            <el-input v-model="addGoodsForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="addGoodsForm.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="addGoodsForm.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="addGoodsForm.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <!-- 级联选择器 -->
            <el-cascader
              :options="options"
              :props="defaultsProps"
              clearable
              v-model="addGoodsForm.goods_cat"
            ></el-cascader>
          </el-form-item>

          <el-form-item label="是否促销">
            <!-- label负责收集数据 -->
            <el-radio :label="1" v-model="addGoodsForm.radio">是</el-radio>
            <el-radio :label="2" v-model="addGoodsForm.radio">否</el-radio>
          </el-form-item>
          <el-button @click="next(2,'two')" style="margin-top: 12px;" type="primary">下一步</el-button>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商品图片" name="two">
        <el-upload
          :headers="headers"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="uploadImgSuccess"
          action="http://localhost:8888/api/private/v1/upload"
          list-type="picture-card"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img :src="dialogImageUrl" alt width="100%" />
        </el-dialog>
        <el-button @click="next(3,'three')" style="margin-top: 12px;" type="primary">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane label="商品内容" name="three">
        <!-- Two-way Data-Binding -->
        <!-- @blur="onEditorBlur($event)" 失去焦点
          @focus="onEditorFocus($event)" 聚焦
        @ready="onEditorReady($event)" 渲染之后-->
        <quill-editor :options="editorOption" v-model="addGoodsForm.goods_introduce" />
        <el-button @click="postGoods" style="margin-top: 12px;" type="primary">提交</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
/* eslint-disable */
export default {
  data() {
    return {
      activeIndex: 1,
      activeName: 'one',
      addGoodsForm: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_cat: [],
        radio: '',
        pics: [],
        goods_introduce: ''
      },
      // 级联选择器需要显示的options
      options: [],
      defaultsProps: {
        value: 'cat_id',
        label: 'cat_name'
      },
      // 图片数据
      dialogImageUrl: '',
      dialogVisible: false,
      // 上传图片请求头
      headers: {
        Authorization: localStorage.getItem('token')
      },
      // 富文本编辑器
      editorOption: {
        placeholder: '请输入文本'
      }
    }
  },
  created() {
    // 获取分类
    this.loadCate()
  },
  methods: {
    // 点击Tabs标签页的事件
    clickTab(e) {
      // console.log(e);
      // e.index刚好是对应的顺序
      this.activeIndex = +e.index + 1
    },
    // 点击下一步
    next(index, name) {
      this.activeIndex = index
      this.activeName = name
    },
    // 上传图片
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },

    // 请求分类
    async loadCate() {
      let res = await this.$axios.get('categories', {
        params: {
          type: 3
        }
      })
      console.log(res)
      this.options = res.data.data
    },
    // 图片上传成功
    uploadImgSuccess(res) {
      console.log(res)
      this.addGoodsForm.pics.push({ pic: res.data.tmp_path })
    },
    // 提交商品
    async postGoods() {
      // 获取需要提交的数据
      const {
        goods_name,
        goods_price,
        goods_weight,
        goods_number,
        goods_cat,
        pics,
        goods_introduce,
        radio
      } = this.addGoodsForm
      let res = await this.$axios.post('goods', {
        goods_name,
        goods_price,
        goods_number,
        goods_weight,
        goods_cat: goods_cat.join(','),
        goods_introduce,
        pics,
        radio
      })
      console.log(res)
      // 如果提交成功，就跳转回商品页，显示添加成功
      if(res.data.meta.status===201){
        // 1. 弹出对话框
        this.$message({
          message:'添加商品成功',
          type:'success',
          duration:800
        })
        // 2. 跳转
        this.$router.push('/goods');
      }
    }
  }
}
</script>
<style lang="" scope>
</style>
