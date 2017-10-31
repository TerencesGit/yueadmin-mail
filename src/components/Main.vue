<template>
	<div class="main transition" :class="{'spread': sidebarStatus}">
		<div class="wrapper">
			<div class="container-fluid">
				<el-breadcrumb separator="/" class="breadcrumb-inner">
					<el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
						<router-link to="/">{{ item.name }}</router-link>
					</el-breadcrumb-item>
				</el-breadcrumb>
				<transition name="fade" mode="out-in">
					<router-view></router-view>
				</transition>
				<div class="wrap-footer"></div>
			</div>
		</div>
		<footer class="site-footer">
	    <span>Copyright © 2017 yueshijue.com</span>
	    <a href="javascript:;" class="back-top" @click="backTop">
	      <i class="el-icon-caret-top"></i>
	    </a>
	  </footer>
	  <!-- 设置支付密码 -->
	  <el-dialog 
			title="设置支付密码" 
			:visible.sync="settingPayPass" 
			:show-close="false"
			:close-on-click-modal="false"
			:close-on-press-escape="false">
			<el-row>
				<el-col :span="16" :offset="4">
					<el-form 
						:model="setPassForm" 
						ref="setPassForm" 
						:rules="rules" 
						label-width="100px">
		        <el-form-item label="支付密码：" prop="password">
		          <el-input type="password" v-model="setPassForm.password" placeholder="设置支付密码，不少于6位"></el-input>
		        </el-form-item>
		         <el-form-item label="确认密码：" prop="confirmPass">
		          <el-input type="password" v-model="setPassForm.confirmPass" placeholder="确认密码"></el-input>
		        </el-form-item>
		      </el-form>
				</el-col>
			</el-row>
			<div slot="footer">
				<el-button @click="handleCancel">取消</el-button>
				<el-button type="primary" @click="setPasswordSubmit">提交</el-button>
			</div>
    </el-dialog>
	</div>
</template>
<script>
	import { setPayPassword } from '@/api'
	// import { mapGetters } from 'vuex'
	export default {
		data () {
	    let confirmPass = (rule, value, callback) => {
	    	if (!value) {
	        return callback(new Error('请输入确认密码'));
	      } else if (this.setPassForm.password !== value) {
	      	return callback(new Error('两次密码输入不一致'));
	      } else {
	      	return callback();
	      }
	    }
			return {
				sidebarStatus: false,
	      settingPayPass: false,
				setPassForm: {
					password: '',
					confirmPass: ''
				},
				rules: {
					password: [
						{ required: true, message: '请输入支付密码', trigger: 'blur' },
						{ min: 6, message: '支付密码不少于6位', trigger: 'blur' },
					],
					confirmPass: [
						{ required: true, validator: confirmPass, trigger: 'blur' }
					]
				},
			}
		},
	  methods: {
	  	// 返回顶部
		  backTop () {
	      document.body.scrollTop = 0
	      document.documentElement.scrollTop = 0
	    },
	    handleCancel() {
	    	this.$notify({
	    		type: 'warning',
	    		title: '提示',
	    		message: '请先设置支付密码'
	    	})
	    },
	    // 设置密码提交
			setPasswordSubmit () {
				this.$refs.setPassForm.validate((valid) => {
					if(!valid) return;
					let data = {
						password: this.$Md5.hex_md5(this.setPassForm.password)
					}
					console.log(data)
					setPayPassword(data).then(res => {
						console.log(res)
						if (res.data.code === '0001') {
							this.$message.success('设置成功')
							this.$store.dispatch('settingPayPass', false)
						} else {
							this.$message.error(res.data.message)
						}
					}).catch(err => {
						console.log(err)
						this.$catchError(err)
					})
				})
			},
	  },
	  // computed: {
	  //   ...mapGetters([
	  //     'sidebarStatus',
	  //     'settingPayPass'
	  //   ])
	  // }
	}
</script>
<style scoped lang="scss">
	.main {
		position: absolute;
    top: 100px;
    left: 0;
    right: 0;
    height: calc(100% - 100px);
    .wrapper {
	    min-height: 100%;
	    height: auto !important;
	    height: 100%;
	    margin-bottom: -40px;
	    background: #f5f5f5;
	  }
	}
	.main.spread {
		left: 0;
	}
  .container-fluid {
  	width: 90%;
    margin-right: auto;
    margin-left: auto;
    padding: 15px;
  }
  .el-breadcrumb {
		padding: 0 0 10px;
		font-size: 14px;
  }
  .wrap-footer {
		height: 40px;
	}
	.site-footer {
    position: relative;
    padding: 11px 0;
    text-align: center;
    color: #fff;
    background: #5b6e84;
	}
	.back-top {
		position: absolute;
		right: 1%;
	  width: 20px;
	  height: 20px;
	  line-height: 20px;
	  color: #72d0eb;
	  background: rgba(127, 221, 248, .5);
	  border-radius: 50%;
	  i {
			color: #2A3542;
		}
	}
	.fade-enter-active, .fade-leave-active {
	  transition: all .3s;
	}
	.fade-enter, .fade-leave-active {
	  opacity: 0;
		transform: translateX(30px);
	}
</style>
