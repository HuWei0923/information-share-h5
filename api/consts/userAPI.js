export default [
	// 登录
	{
		name:"login",
		method:'post',
		url:'/api/user/login'
	},
	{
		name:"getUserInfo",
		method:'post',
		url:'/api/user/getUserInfo'
	},
	{
		name:"updateUser",
		method:'post',
		url:'/api/user/updateUser'
	},
	{
		name:"verifyPermissions",
		method:'post',
		url:'/api/user/verifyPermissions'
	},
	{
		name:"getReviewer",
		method:'post',
		url:'/api/user/getReviewer'
	},
	
	
]