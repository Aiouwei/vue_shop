<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="../assets/logo.png" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="loginout">退出</el-button>
    </el-header>
    <!-- 页面主体 -->
    <el-container>
        <!-- 侧边栏 -->
      <el-aside :width="isCollapse?'64px':'200px'">
        <!-- 侧边栏菜单区域 -->
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
          >
          <!-- 一级菜单 -->
          <el-submenu :index="'/'+item.path+''" v-for="item in menulist" :key="item.id" @click="saveNavState('/'+item.path+'')">
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <i :class="iconsObj[item.path]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/'+subItem.path+''" v-for="subItem in (item.children || [])" :key="subItem.id" @click="saveNavState('/'+item.path+'')">
               <template slot="title">
                <i class="iconfont el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      menulist: [],
      iconsObj: {
        users: 'iconfont el-icon-s-custom', // 用户列表
        rights: 'iconfont el-icon-s-tools',
        goods: 'iconfont el-icon-s-goods',
        orders: 'iconfont el-icon-s-order',
        reports: 'iconfont el-icon-s-data'
      },
      // 是否折叠
      isCollapse: false,
      // 被激活的链接地址
      activePath: ''
    }
  },
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    loginout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取左侧菜单数据
    async getMenuList () {
      const { data: res } = await this.$axios.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
    },
    // 点击按钮，切换菜单的折叠和展开
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    // 有问题！！，后退的时候回出现地址与高亮不符
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>
<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin: 15px;
    }
    img {
      width: 30px;
      height: 30px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: 0;
  }
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 10px;
}
.toggle-button {
  background-color: #4a5064;
  color: #fff;
  font-size: 10px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
