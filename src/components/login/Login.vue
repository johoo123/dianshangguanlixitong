<template lang="">
  <el-row type="flex" justify="center" align="middle">
    <el-col :span="8">
      <h3 align='center'>登陆页面</h3>
      <br/>
      <!-- 注意：这里表单绑定的数据是ruleForm -->
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="ruleForm.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >登陆</el-button
          >
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>
<script>
/* eslint-disable */
// import axios from "axios";
export default {
  data() {
    return {
      ruleForm: {
        name: "",
        password: "",
      },
      rules: {
        username: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        // 如果有效就提交
        if (!valid) {
          // 无效，就显示提交错误
          console.log("error submit!!");
          return false;
        }
        let res = await this.$axios.post("login", this.ruleForm);
        console.log(res);
        // 把token令牌存储在浏览器的localStorage中
        if (res.data.meta.status === 200) {
          // 0- 把token存储到localStorage中
          localStorage.setItem("token", res.data.data.token);
          //1- 显示登陆成功的提示框
          this.$message({
            message: res.data.meta.msg,
            type: "success",
            duration: 800,
          });
          //2- 跳转页面
          this.$router.push("./home");
        }
      });
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>
<style scoped>
.el-row {
  height: 100%;
  background-color: #2d434c;
}
.el-col {
  background-color: white;
  padding: 30px 30px;
  border-radius: 15px;
}
h1 {
  color: red;
}
</style>
