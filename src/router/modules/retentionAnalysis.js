/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const retentionAnalysisRoute = {
  path: '/retentionAnalysis',
  component: Layout,
  redirect: 'retentionRate',
  name: 'retentionAnalysis',
  meta: {
    title: '用户分析',
    icon: 'retention'
  },
  children: [
    {
      path: 'retentionRate',
      component: () => import('@/views/retentionAnalysis/retentionRate'),
      name: 'retentionRate',
      meta: { title: '留存用户', noCache: true }
    }
  ]
}

export default retentionAnalysisRoute
