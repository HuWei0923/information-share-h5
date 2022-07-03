export default [
	// 实时预警
	{
		name: "getRealTimeWarning",
		method: 'post',
		url: '/api/common/getRealTimeWarning'
	},
	{
		name: "getCompayNameList",
		method: 'post',
		url: '/api/company/getCompayNameList'
	},
	{
		name: "getEventTypeList",
		method: 'post',
		url: '/api/common/getEventTypeList'
	},
	{
		name: "getRiskMorningPost",
		method: 'post',
		url: '/api/common/getRiskMorningPost'
	},
	{
		name: "getMorningNews",
		method: 'post',
		url: '/api/common/getMorningNews'
	},
	{
		name: "getPlatformNews",
		method: 'post',
		url: '/api/common/getPlatformNews'
	},
]