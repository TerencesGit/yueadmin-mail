<template>
	<div id="container">
    <Navigator :userInfo="userInfo"></Navigator>
    <keep-alive>
      <MainComp></MainComp>
    </keep-alive>
	</div>
</template>
<script>
import Navigator from './Navigator'
import MainComp from './Main'
import { getMyInfo } from '@/api'
export default {
  name: 'container',
  components: {
    Navigator,
    MainComp
  },
  data() {
    return {
      userInfo: null
    }
  },
  methods: {
    getUserInfo () {
      getMyInfo().then(res => {
        if (res.data.code === '0001') {
          let userInfo = res.data.result.userInfo;
          userInfo.avatarUrl = userInfo.avatar;
          this.userInfo = res.data.result.userInfo;
        } else {
          this.$message.error(res.data.message)
        }
      })
      .catch(err => {
        console.log(err)
        this.$catchError(err)
      })
    }
  },
  mounted () {
    this.getUserInfo()
  }
}
</script>
