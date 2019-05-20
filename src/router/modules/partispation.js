/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const partispationRoute = {
  path: '/partispation',
  component: Layout,
  redirect: 'useDistribution',
  name: 'partispation',
  meta: {
    title: '用户参与度',
    icon: 'user-star'
  },
  children: [
    {
      path: 'usageTime',
      component: () => import('@/views/partispation/usageTime'),
      name: 'usageTime',
      meta: { title: '使用时长', noCache: true }
    },
    {
      path: 'useDistribution',
      component: () => import('@/views/partispation/useDistribution'),
      name: 'useDistribution',
      meta: { title: '使用分布', noCache: true }
    },
    {
      path: 'useFrequency',
      component: () => import('@/views/partispation/useFrequency'),
      name: 'useFrequency',
      meta: { title: '使用频率', noCache: true }
    }
  ]
}

export default partispationRoute
