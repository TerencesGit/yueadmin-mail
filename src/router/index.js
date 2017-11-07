
import Container from '@/components/container'
import Login from '@/pages/base/login'
import CasLogin from '@/pages/base/casLogin'
import SmsRecord from '@/pages/sms/record'
import SmsRecordSingle from '@/pages/sms/recordsingle'
import SmsClientManage from '@/pages/sms/clientmanage'
import SmsTemplateManage from '@/pages/sms/templatemanage'
import SmsSendGroup from '@/pages/sms/sendgroup'

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
		    component: SmsRecordSingle,
    	},
    	{
    		path: 'manage/masstexting',
		    name: '短信群发管理',
		    component: SmsSendGroup,
    	},
    	{
    		path: 'manage/client',
		    name: '短信应用管理',
		    component: SmsClientManage,
    	},
    	{
    		path: 'manage/template',
		    name: '短信模板管理',
		    component: SmsTemplateManage,
    	},
    ]
  }
]
export default routes