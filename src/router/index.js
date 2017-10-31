import Container from '@/components/container'
import Login from '@/pages/login'

const routes =  [
  {
    path: '/',
    name: '悦视觉.登录',
    component: Login
  },
  {
    path: '/container',
    name: '悦视觉',
    component: Container
  }
]

export default routes
