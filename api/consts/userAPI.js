export default [
	// 登录
	{
		name: "login",
		method: 'post',
		url: '/api/user/login'
	},
	{
		name: "getUserInfo",
		method: 'post',
		url: '/api/user/getUserInfo'
	},
	{
		name: "updateUser",
		method: 'post',
		url: '/api/user/updateUser'
	},
	{
		name: "verifyPermissions",
		method: 'post',
		url: '/api/user/verifyPermissions'
	},
	{
		name: "getReviewer",
		method: 'post',
		url: '/api/user/getReviewer'
	},
	{
		name: "getUserList",
		method: 'post',
		url: '/api/user/searchUserListNew'
	},
	{
		name: "userExists",
		method: 'post',
		url: '/api/user/userExists'
	},
	{
		name: "getRole",
		method: 'post',
		url: '/api/user/getRole'
	},
	{
		name: "getAllRole",
		method: 'post',
		url: '/api/user/getAllRole'
	},
	{
		name: "roleNameExists",
		method: 'post',
		url: '/api/user/roleNameExists'
	},
	{
		name: "saveOrEditRole",
		method: 'post',
		url: '/api/user/saveOrEditRole'
	},
	{
		name: "getCareList",
		method: 'post',
		url: '/api/user/getCareList'
	},
	{
		name: "getBlackList",
		method: 'post',
		url: '/api/common/getBlackList'
	},
	{
		name: "getGreyList",
		method: 'post',
		url: '/api/common/getGreyList'
	},
	{
		name: "getBaseInfo",
		method: 'post',
		url: '/api/company/getBaseInfo'
	},
	{
		name: "getCompanyInfoByName",
		method: 'post',
		url: '/api/company/getCompanyInfoByName'
	},
	{
		name: "getCareStatus",
		method: 'post',
		url: '/api/user/getCareStatus'
	},
	{
		name: "careOrNot",
		method: 'post',
		url: '/api/user/careOrNot'
	},
]
