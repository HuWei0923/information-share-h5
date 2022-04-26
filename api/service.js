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
				if (res.statusCode == 200) {
					if (res.data && (res.data.code == 49998 || res.data.code == 49999 || res.data.code == 50000||res.data.code == 401)) {
						uni.showToast({
							icon: 'none',
							title: '您的账号已在另一地点登录，您已被迫下线,请重新登录。',
							success:()=>{
								setTimeout(()=>{
									uni.redirectTo({
										url: '/pages/login/index'
									})
								},2000)
							}
						})
						reject('您的账号已在另一地点登录，您已被迫下线,请重新登录')
					} else {
						resolve(res)
					}
				} else if (res.statusCode == 401) {
					uni.switchTab({
						url: '/pages/login/index'
					})
				}else{
					reject(res)
				}
			}).catch((e) => {
				reject(e)
			})
		})
	}
}
export default createRequest
