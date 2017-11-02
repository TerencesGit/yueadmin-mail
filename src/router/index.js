
import Container from '@/components/container'
import Login from '@/pages/base/login'
import CasLogin from '@/pages/base/casLogin'
import SmsRecord from '@/pages/sms/record'

const routes =  [
  {
    path: '/',
    name: '短信发送记录',
    redirect: '/sms/record/mass'
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
    		path: 'record/mass',
		    name: '短信发送记录',
		    component: SmsRecord,
    	}
    ]
  }
]
export default routes