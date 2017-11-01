<template>
	<div id="container">
    <Navigator></Navigator>
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
  methods: {
    getFinanceInfo () {
      getMyInfo().then(res => {
        if (res.data.code === '0001') {
          let financeInfo = res.data.result.financeInfo;
          financeInfo.balance = (financeInfo.balance / 100).toFixed(2)
          financeInfo.frozen = (financeInfo.frozen / 100).toFixed(2)
          this.$store.dispatch('saveFinanceInfo', financeInfo)
        } else if (res.data.code === 'C0003') {
          this.$store.dispatch('settingPayPass', true)
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
    // this.getFinanceInfo()
  }
}
</script>
