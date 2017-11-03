
import Container from '@/components/container'
import Login from '@/pages/base/login'
import CasLogin from '@/pages/base/casLogin'
import SmsRecord from '@/pages/sms/record'
import SmsClientManage from '@/pages/sms/clientmanage'

const routes =  [
  {
    path: '/',
    name: '首页',
    redirect: '/sms/record/group'
  },
  {
    path: '/login',
    name: '悦视觉.登录',
    component: Login,
  },
  {
    path: '/sms',
    name: '短信管理',
    component: Container,
    children: [
    	{
    		path: 'record/group',
		    name: '群发记录',
		    component: SmsRecord,
    	},
    	{
    		path: 'record/single',
		    name: '单发记录',
		    component: SmsRecord,
    	},
    	{
    		path: 'manage/client',
		    name: '应用管理',
		    component: SmsClientManage,
    	},
    ]
  }
]
export default routes