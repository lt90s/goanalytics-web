/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const userAnalysisRoute = {
  path: '/userAnalysis',
  component: Layout,
  redirect: 'increase',
  name: 'userAnalysis',
  meta: {
    title: '用户分析',
    icon: 'user-analysis'
  },
  children: [
    {
      path: 'increase',
      component: () => import('@/views/userAnalysis/increase'),
      name: 'UserAnalysisIncrease',
      meta: { title: '用户增长', noCache: true }
    },
    {
      path: 'active',
      component: () => import('@/views/userAnalysis/active'),
      name: 'UserAnalysisActive',
      meta: { title: '活跃用户', noCache: true }
    },
    {
      path: 'openApp',
      component: () => import('@/views/userAnalysis/openApp'),
      name: 'UserAnalysisOpenApp',
      meta: { title: '启动次数', noCache: true }
    }
  ]
}

export default userAnalysisRoute
