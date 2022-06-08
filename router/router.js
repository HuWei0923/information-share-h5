// router.js
import {
	RouterMount,
	createRouter
} from 'uni-simple-router';
import {
	commonAPI
} from '@/api/index.js'

const router = createRouter({
	platform: process.env.VUE_APP_PLATFORM,
	routes: [...ROUTES]
});
//全局路由前置守卫
router.beforeEach((to, from, next) => {
	next();
});
// 全局路由后置守卫
router.afterEach((to, from) => {
	console.log(to, from)
	if (!to.meta.title) return
	let param = {
		userName: uni.getStorageSync("username"),
		userCode: uni.getStorageSync("userCode"),
		formPath: from.path,
		formPageName: from.meta.title,
		toPath: to.path,
		toPageName: to.meta.title,
		queryPara: JSON.stringify(to.query)
	}
	commonAPI.logCreditOper(param)
	console.log(param)
})

export {
	router,
	RouterMount
}
