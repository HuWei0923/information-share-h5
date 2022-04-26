// let baseUrl = "/api"
let baseUrl = process.uniEnv.BASE_URL
let tempRoute = ''
const createRequest = function(apiConfig) {
	let url;

	if (apiConfig.useBaseUrl == false) {
		url = apiConfig.url
	} else {
		url = baseUrl + apiConfig.url
	}
	return function(data) {
		let token = uni.getStorageSync('token')
		let regex = (/([^{}](?=.*})(?!.*{))+/)
		let p = regex.exec(url)

		let method = apiConfig.method;
		let newUrl = ''
		if (p && p[0]) {
			newUrl = url.replace(regex, data[p[0]]).replace((/\{/), '').replace((/\}/), '')
		}

		return new Promise((resolve, reject) => {
			uni.showLoading({
				mask: true
			})
			uni.request({
				url: newUrl || url,
				method: method,
				data: data,
				header: {
					token: token
				}
			}).then(response => {
				uni.hideLoading()
				let [err, res] = response;
				debugger;
				if (res.statusCode == 200) {
					if (res && res.data && (res.data.code == 49998 || res.data.code == 49999 || res.data.code == 50000)) {
						uni.showToast({
							icon: 'none',
							title: '您的账号已在另一地点登录，您已被迫下线,请重新登录。',
							success:()=>{
								setTimeout(()=>{
									uni.redirectTo({
										url: '/pages/login/index'
									})
								},1000)
								
							}
						})
						reject('您的账号已在另一地点登录，您已被迫下线,请重新登录')
					} else if (res && res.data && res.data.code == 401) {
						
						uni.showToast({
							icon: 'none',
							title: '您的账号已在另一地点登录，您已被迫下线,请重新登录。',
							success:()=>{
								setTimeout(()=>{
									uni.redirectTo({
										url: '/pages/login/index'
									})
								},1000)
								
							}
						})
					} else {
						
						reject(res)
					}
				} else if (res.statusCode == 401) {
					uni.switchTab({
						url: '/pages/login/index'
					})
				}
			}).catch((e) => {
				switch (e.response.status) {
					case 400:
						e.message = '错误请求'
						break
					case 401:
						e.message = '未授权访问，请登录'
						break
					case 403:
						e.message = '拒绝访问'
						break
					case 404:
						e.message = '请求错误，未找到该资源'
						break
					case 405:
						e.message = '请求方法未允许'
						break
					case 408:
						e.message = '请求超时'
						break
					case 500:
						e.message = '服务端出错'
						break
					case 501:
						e.message = '网络未实现'
						break
					case 503:
						e.message = '服务不可用'
						break
					case 504:
						e.message = '网络超时'
						break
					default:
						e.message = `连接错误${e.response.status}`
						break
				}
				reject(e)
			})
		})
	}
}
export default createRequest
