<template>
	<header class="header">
		<div class="topbar">
			<div class="container-fluid">
				<div class="topbar-left">
					<span class="brand">
						<i class="el-icon-message"></i>
						悦视觉后台信息发送系统
					</span>
				</div>
				<div class="topbar-right">
					<el-dropdown :hide-on-click="false" trigger="click">
					  <span class="el-dropdown-link">
					  	<img v-if="financeInfo.avatarUrl" :src="financeInfo.avatarUrl" class="avatar"/>
					  	<img v-else src="../assets/img/avatar.gif" alt="头像" class="avatar"/>
					    <span>{{ financeInfo.financeName }}</span>
					    <i class="el-icon-caret-bottom el-icon--right"></i>
					  </span>
					  <el-dropdown-menu slot="dropdown">
					    <el-dropdown-item>
					    	<a @click="enterUms">进入账户中心</a>
					    </el-dropdown-item>
					    <el-dropdown-item>
					    	<a @click="enterB2b">进入交易中心</a>
					    </el-dropdown-item>
							<el-dropdown-item divided>
								<a @click="logout">退出</a>
							</el-dropdown-item>
					  </el-dropdown-menu>
					</el-dropdown>
				</div>
			</div>
		</div>
		<nav class="nav">
			<el-menu :default-active="$route.path" class="el-menu-demo" mode="horizontal" router>
				<!-- <el-menu-item v-for="(menu, index) in routers" :index="menu.link" :key="menu.id"> -->
          <!-- <router-link :to="menu.link">{{ menu.name }}</router-link> -->
          <el-submenu v-for="(menu, index) in routers" :index="index+''" :key="menu.id">
          	<template slot="title">{{ menu.name }}</template>
          	<el-menu-item v-for="(submenu, index) in menu.children" :index="submenu.link" :key="submenu.id"> 
          		<router-link :to="submenu.link">{{ submenu.name }}</router-link>
          	</el-menu-item>
          </el-submenu>
        <!-- </el-menu-item> -->
			</el-menu>
		</nav>
	</header>
</template>
<script>
	// import { mapGetters } from 'vuex'
	import { requestExit } from '@/api'
	export default {
	  data() {
	    return {
	    	financeInfo: {},
	    	routers: [
	        {
	        	name: '短信管理', 
	        	children: [
	        		{
			        	name: '应用列表', 
			        	link: '/sms/clientList', 
			        },
			        {
			        	name: '模板列表', 
			        	link: '/sms/templateList', 
			        },
			        {
			        	name: '群发记录', 
			        	link: '/sms/sendList', 
			        },
			        {
			        	name: '单条记录', 
			        	link: '/sms/record', 
			        },
	        	]	
	        },
	        {
	        	name: '邮件管理', 
	        	link: '/mail/sendList',
	        	children: [
	        		{
			        	name: '应用列表', 
			        	link: '/mail/clientList', 
			        },
			        {
			        	name: '模板列表', 
			        	link: '/mail/templateList', 
			        },
			        {
			        	name: '群发记录', 
			        	link: '/mail/sendList', 
			        },
			        {
			        	name: '单条记录', 
			        	link: '/mail/record', 
			        },
	        	]	
	        },
	      ],
	    }
	  },
	  methods: {
	  	handleOrder () {
			  this.$router.push('/account/waiting')
	  	},
	  	enterUms() {
	  		window.open('https://transformgit.github.io/yueadmin-ums/')
	  	},
	  	enterB2b() {
	  		window.open('https://transformgit.github.io/yueadmin-b2b/')
	  	},
	    logout () {
	    	this.$confirm('确定退出系统?', '提示', {
	        confirmButtonText: '确定',
	        cancelButtonText: '取消',
	        type: 'warning'
	      }).then(() => {
	      	requestExit().then(res => {
	      		if(res.data.code === '0001') {
	      			if(res.data.result.logoutUrl) {
	      				window.location.href = res.data.result.logoutUrl
	      			} else {
	      				this.$router.replace('/login')
	      			}
	      		} else {
	      			this.$message.error(res.data.message)
	      		}
	      	}).catch(err => {
	      		console.log(err)
	      		this.$catchError(err)
	      	})
	      }).catch(err => {
	      	console.log(err)
	      })
	    }
	  },
	  // computed: {
		 //  ...mapGetters([
	  // 		'financeInfo'
	  // 	])
	  // },
	}
</script>
<style scoped lang="scss">
	.header {
		position: fixed;
		width: 100%;
		z-index: 999;
		box-shadow: 1px 1px 1px #ccc;
		.container-fluid {
			padding-left: 80px;
			padding-right: 80px;
			overflow: hidden;
		}
	}
	.topbar {
		height: 50px;
		line-height: 50px;
		color: #fff;
		font-size: 14px;
		background: #1380E2;
		.topbar-left {
			float: left;
			.brand {
				color: #fff;
				font-size: 16px;
				font-weight: bold
			}
		}
		.topbar-right {
			float: right;
			.account-info {
				display: inline-block;
				span {
					margin-right: 10px;
				}
			}
			.el-badge {
				.el-button {
					border-radius: 0;
				}
			}
		}
	}
	.el-dropdown {
	  width: 130px;
	  text-align: right;
	  .el-dropdown-link {
			padding: 6px 12px;
	    border: 1px solid #f0f0f8;
	    border-radius: 4px;
	    background: #fff;
	    cursor: pointer;
	    white-space: nowrap;
	    overflow: hidden;
	    span {
	    	margin-left: 3px;
	    }
		}
	  .avatar {
			width: 20px;
			height: 20px;
			line-height: 1;
			vertical-align: middle;
		}
	}
	.el-dropdown-menu {
	  width: 130px;
	  a {
	  	display: inline-block;
	  	width: 100%;
	  }
	}
	.nav {
		padding-left: 65px;
		padding-right: 65px;
		background: #fff;
		.el-menu {
			border-radius: 0;
			background: #fff;
			a {
				display: inline-block
			}
		}
	}
</style>