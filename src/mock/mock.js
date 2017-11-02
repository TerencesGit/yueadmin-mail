import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import Utils from '@/assets/js/utils.js'
import { UserList, WaitList, TradeList, IoList, OrderInfo } from './data.js'
let _UserList = UserList,
		_WaitList = WaitList,
		_TradeList = TradeList,
		_IoList = IoList,
		_OrderInfo = OrderInfo;
const retObj = {
	code: '0001',
	message: '操作成功',
	result: {}
}
const retExpireObj = {
	code: '0000',
	message: '当前会话已过期，请重新登录',
	result: {}
}
export default {
	bootstrap() {
		let mock = new MockAdapter(axios)
		// 登录
		mock.onPost('/login').reply(config => {
			let { username, password } = JSON.parse(config.data);
			let loginUser = _UserList.filter(user => user.email === username)[0];
			if(loginUser) {
				if(loginUser.password === password) {
					return new Promise((resolve, reject) => {
						setTimeout(() => {
							retObj.result = {
								userInfo: loginUser
							}
							resolve([200, retObj])
						}, 1000)
					})
				} else {
					let retObj = {
						code: '1002',
						message: '密码错误'
					}
					return new Promise((resolve, reject) => {
						setTimeout(() => {
							resolve([200, retObj])
						}, 1000)
					})
				}
			} else {
				let retObj = {
					code: '1001',
					message: '用户名不存在'
				}
				return new Promise((resolve, reject) => {
					setTimeout(() => {
						resolve([200, retObj])
					}, 1000)
				})
			}
		})
		// 登出
		mock.onGet('/accountInter/logout.do').reply(config => {
			Utils.delCookie('userId')
			retObj.result = {}
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve([200, retObj])
				}, 500)
			})
		})
		// 查询邮箱或手机号是否已被使用
		mock.onGet('/baseInter/accountFind.do').reply(config => {
			let { account } = config.params;
			// console.log(account)
			let _user = _UserList.filter(user => user.email === account);
			let finded = _user.length > 0 ? true : false;
			retObj.result = {
				finded
			}
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve([200, retObj])
				}, 500)
			})
		})
		// 获取账户信息
		mock.onGet('/accountInter/getMyInfo.do').reply(config => {
			let userId = Utils.getCookie('userId');
			if(!userId) {
				return new Promise((resolve, reject) => {
					setTimeout(() => {
						resolve([200, retExpireObj])
					}, 500)
				})
			}
			let userInfo = _UserList.filter(user => user.userId == userId)[0];
			let retObj = {
				code: '0001',
				message: '操作成功',
				result: {
					userInfo,
				}
			}
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve([200, retObj])
				}, 500)
			})
		})
		// 设置支付密码
		mock.onPost('/accountInter/setPayPassword.do').reply(config => {
			let { password } = JSON.parse(config.data);
			console.log(password)
			retObj.result = {}
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve([200, retObj])
				}, 500)
			})
		})
		// 更新支付密码
		mock.onPost('/accountInter/updatePayPassword.do').reply(config => {
			let { oldPass, newPass, confirmPass } = JSON.parse(config.data);
			console.log(oldPass, newPass, confirmPass)
			retObj.result = {}
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve([200, retObj])
				}, 500)
			})
		})
		// 发送找回支付密码邮箱验证码
		mock.onGet('/accountInter/sendEmailCode.do').reply(config => {
			// let { account, findType } = JSON.parse(config.data);
			// console.log(account, findType)
			let userId = Utils.getCookie('userId');
			if(!userId) {
				return new Promise((resolve, reject) => {
					setTimeout(() => {
						resolve([200, retExpireObj])
					}, 500)
				})
			}
			let financeInfo = _UserList.filter(user => user.userId == userId)[0];
			console.log(financeInfo.email)
			retObj.result = {}
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve([200, retObj])
				}, 500)
			})
		})
		// 获取手机短信验证码
		mock.onGet('/accountInter/sendSmsCode.do').reply(config => {
			// let { mobile } = JSON.parse(config.data);
			// console.log(mobile)
			let userId = Utils.getCookie('userId');
			if(!userId) {
				return new Promise((resolve, reject) => {
					setTimeout(() => {
						resolve([200, retExpireObj])
					}, 500)
				})
			}
			let financeInfo = _UserList.filter(user => user.userId == userId)[0];
			console.log(financeInfo.mobile)
			retObj.result = {}
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve([200, retObj])
				}, 500)
			})
		})
		// 重置支付密码
		mock.onPost('/accountInter/resetPayPassword.do').reply(config => {
			let { payPassword, code, findType } = JSON.parse(config.data);
			console.log(payPassword, code, findType )
			retObj.result = {}
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve([200, retObj])
				}, 500)
			})
		})
		// 支付宝充值
		mock.onPost('/rechargeInter/rechargeGetAlipayForm.do').reply(config => {
			let { payChannel, totalAmount } = JSON.parse(config.data);
			console.log( payChannel, totalAmount)
			retObj.result = {
				formHtml: `<form action="http://localhost:8088/#/account/waiting" 
				name="punchout_form"></form>`
			}
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve([200, retObj])
				}, 500)
			})
		})
		// 余额支付
		mock.onPost('/payInter/payByBalance.do').reply(config => {
			let { orderId, payChannel, payPassword } = JSON.parse(config.data);
			console.log(orderId, payChannel, payPassword)
			retObj.result = {}
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve([200, retObj])
				}, 500)
			})
		})
		// 支付宝支付
		mock.onPost('/payInter/getAlipayForm.do').reply(config => {
			let { orderId, payChannel, payPassword } = JSON.parse(config.data);
			console.log(orderId, payChannel, payPassword)
			retObj.result = {}
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve([200, retObj])
				}, 500)
			})
		})
		// 获取订单详情
		mock.onGet('/queryInter/getOrderInfoById.do').reply(config => {
			let { orderId } = config.params;
			// console.log(orderId)
			if(orderId) {
				retObj.result ={
					orderInfo: OrderInfo
				}
			}
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve([200, retObj])
				}, 500)
			})
		})
		// 获取交易记录
		mock.onGet('/queryInter/getTradeListPage.do').reply(config => {
			let { pageNo, pageSize, type, status } = config.params;
			// console.log(pageNo, pageSize, type, status)
			let _tradeList = []
			let count = '';
			if(type === 0) {
				_tradeList = TradeList
				count = TradeList.length
			} else if (type === 1) {
				_tradeList = WaitList
				count = WaitList.length
			} else {
				_tradeList = TradeList.filter(t => t.type === type)
				count = _tradeList.length
			}
			let tradePage = _tradeList.filter((t, index) => index < pageNo * pageSize && index >= pageSize * (pageNo - 1))
			retObj.result = {
				tradeList: tradePage,
				pageInfo: {
					total: count
				}
			}
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve([200, retObj])
				}, 500)
			})
		})
		// 获取收支明细
		mock.onGet('/queryInter/getIoListPage.do').reply(config => {
			let { pageNo, pageSize, type } = config.params;
			// console.log(pageNo, pageSize, type)
			let _ioList = IoList.filter((i, index) => index <= pageNo * pageSize && index > pageSize * (pageNo - 1));
			retObj.result = {
				ioList: _ioList,
				pageInfo: {
					total: IoList.length
				}
			}
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve([200, retObj])
				}, 500)
			})
		})
	}
}