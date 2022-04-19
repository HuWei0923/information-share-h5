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
					Authorization: token
				}
			}).then(response => {
				uni.hideLoading()
				let [err, res] = response;
				if (res.statusCode == 200) {
					if (res.data.code == 200) {
						resolve(res.data)
					} else if (res.data.code == 401 || res.data.code == -1) {
						uni.navigateTo({
							url: '/pages/login/index'
						})
						reject(res.data)
					}else{
						uni.showToast({
							icon:'none',
							title:'请求失败',
						})
						reject(res.data)
					}
				} else if (res.statusCode == 401) {
					uni.navigateTo({
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
