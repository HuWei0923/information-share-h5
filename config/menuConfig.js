//白名单(不需要权限可看的菜单)
const whiteList = ['common.attention', //关注清单
	'common.message', //消息中心
	'common.blackList', //黑灰名单
	'zcx.fxcs', //风险初筛
	'zcx.cwpl', //财务排雷
	'zcx.cyqypj',  //产业企业评价
	'zcx.qyxypj', //区域信用评价
	'zcx.ctqypj', //城投企业评价
	'tyc:check' //检索入口
]

const menuData= [
				{
					title: '通用',
					children: [
						{
							title: '关注清单',
							icon: require('@/static/img/index/gzqd.png'),
							flag: 'common.attention'
						},
						{
							title: '消息中心',
							icon: require('@/static/img/index/xxzx.png'),
							flag: 'common.message'
						},
						{
							title: '黑灰名单',
							icon: require('@/static/img/index/hhmd.png'),
							flag: 'common.blackList'
						},
						{
							title: '用户中心',
							icon: require('@/static/img/index/hhmd.png'),
							flag: 'user.manage',
							flag2:'user.sub_manage'
						}
					]
				},
				{
					title: '中诚信',
					children: [
						{
							title: '风险初筛',
							icon: require('@/static/img/index/fxcs.png'),
							flag: 'zcx.fxcs'
						},
						{
							title: '财务排雷',
							icon: require('@/static/img/index/cwpl.png'),
							flag: 'zcx.cwpl'
						},
						{
							title: '产业企业评价',
							icon: require('@/static/img/index/cyqypj.png'),
							flag: 'zcx.cyqypj'
						},
						{
							title: '区域信用评价',
							icon: require('@/static/img/index/qyxypj.png'),
							flag: 'zcx.qyxypj'
						},
						{
							title: '城投企业评价',
							icon: require('@/static/img/index/ctqypj.png'),
							flag: 'zcx.ctqypj'
						}
					]
				},
				{
					title: '中信保',
					children: [
						{
							title: '信保报告申请',
							icon: require('@/static/img/index/xbbgsq.png'),
							url: '/pages/apply/apply',
							flag: 'zxbreport.apply',
						},
						{
							title: '信保报告审核',
							icon: require('@/static/img/index/xbbgsh.png'),
							url: '/pages/audit/audit',
							flag: 'zxbreport.audit'
						},
						{
							title: '我的信保报告',
							icon: require('@/static/img/index/wdxbbg.png'),
							url: '/pages/myReport/myReport',
							flag: 'zxbreport.apply'
						},
						{
							title: '信保报告列表',
							icon: require('@/static/img/index/xbbglb.png'),
							url: '/pages/list/list',
							flag: 'zxbreport.list'
						}
					]
				},
				{
					title: '天眼查',
					children: [
						{
							title: '检索入口',
							icon: require('@/static/img/index/jsrk.png'),
							flag: 'tyc:check'
						}
					]
				}
			]

export  {
	whiteList,menuData
}