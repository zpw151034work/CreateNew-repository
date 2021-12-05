import Vue from 'vue'
import Router from 'vue-router'

import Sign from '../views/sign.vue'
import Account from '../views/account.vue'
import Pay from '../views/pay.vue'
import Payment from '../views/payment.vue'
import Share from '../views/share.vue'
import newShare from '../views/newShare.vue'
import Home from '../views/home.vue'
import Loading from '../views/loading.vue'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Loading',
      component: Loading,
      meta: {
        title: '开通您的企业视频彩铃',
        notHead: true
      }
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      meta: {
        title: '开通您的企业视频彩铃'
      }
    },
    {
      path: '/sign',
      name: 'Sign',
      component: Sign,
      meta: {
        title: '注册企业信息'
      }
    },
    {
      path: '/account',
      name: 'Account',
      component: Account,
      meta: {
        title: '预订开通号码数量'
      }
    },
    {
      path: '/payment',
      name: 'Payment',
      component: Payment,
      meta: {
        title: '查看号码',
        // isShare: true
      }
    },
    {
      path: '/pay',
      name: 'Pay',
      component: Pay,
      meta: {
        title: '支付'
      }
    },
    {
      path: '/share',
      name: 'Share',
      component: newShare,
      meta: {
        title: '邀请员工添加手机号',
        // isShare: true
      }
    }
  ]
})

