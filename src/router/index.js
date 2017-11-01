
import Container from '@/components/container'
import Login from '@/pages/base/login'
import CasLogin from '@/pages/base/casLogin'
import SmsRecord from '@/pages/sms/record'

const routes =  [
  {
    path: '/login',
    name: '悦视觉.登录',
    component: Login,
  },
  {
    path: '/',
    name: '短信发送记录',
    redirect: '/sms/record'
  },
  {
    path: '/sms',
    name: '短信管理',
    component: Container,
    children: [
    	{
    		path: 'record',
		    name: '发送记录',
		    component: SmsRecord,
    	}
    ]
  }
]
export default routes
