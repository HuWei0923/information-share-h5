export default [{
		name: "searchList",
		method: 'post',
		url: '/api/company/searchList'
	},
	{
		name: "getLatestWords",
		method: 'post',
		url: '/api/company/latestWords'
	},
	{
		name: "directSearchList",
		method: 'post',
		url: '/api/company/direct/searchList'
	},
	{
		name: "getRiskScreenHtml",
		method: 'post',
		url: '/api/company/zhongChengXin/getRiskScreenHtml'
	},
	{
		name: "getReportPDF",
		method: 'post',
		url: '/api/company/zhongChengXin/getReportPDF'
	},
	{
		name: "getIndustry",
		method: 'post',
		url: '/api/common/getIndustry'
	},
	{
		name: "getArea",
		method: 'post',
		url: '/api/common/getArea'
	},
	{
		name: "getRegionInfo",
		method: 'post',
		url: '/api/company/zhongChengXin/getRegionInfo'
	},
	{
		name:"getReportList",
		method:'post',
		url:'/api/company/zhongChengXin/getReportList'
	},
	{
		name:"reportExist",
		method:'post',
		url:'/api/report/zhongChengXin/reportExist'
	},
	{
		name:"getLatestFinancialDeminingHtml",
		method:'post',
		url:'/api/company/zhongChengXin/getLatestFinancialDeminingHtml'
	}
]
