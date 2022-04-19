import createRequest from './service.js'
let api = {}
const files = require.context('./consts/', false, /\.js$/)
  files.keys().map((key) => {
	let moduleName = key.slice(2,-3)
	api[moduleName] = {}
	files(key).default.map(apiconfig=>{
		api[moduleName][apiconfig.name] = createRequest(apiconfig)
	})
})
// export default api
module.exports=api ///使用commonJs支持 解构对象引入
