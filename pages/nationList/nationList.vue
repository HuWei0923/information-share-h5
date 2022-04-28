<template>
	<view class="content" >
		<view class="search-box">
			<uni-search-bar @confirm="search" :focus="true" v-model="searchValue" cancelButton="none" @input="inputVal"></uni-search-bar>
		</view>
		<scroll-view style="height: 80vh;overflow: hidden;" scroll-y>
		<uni-list v-if="nationOptions.length > 0">
			<uni-list-item :title="item.nationName" :note="item.nationCode" v-for="item in nationOptions" :key="item.nationCode">
				<template v-slot:footer>
					<view class="cu-form-group " @click="chooseNation(item)" style="padding:0"><radio :checked="radio === item.nationCode"></radio></view>
				</template>
			</uni-list-item>
		</uni-list>
		</scroll-view >
	</view>
</template>

<script>
import { commonAPI } from 'api/index.js';
import PinyinUtils from '@/utils/pingyinUtils.js';
export default {
	data() {
		return {
			nationOptions: [],
			backData:[],
			radio: '',
			searchValue: ''
		};
	},
	onLoad(options) {
		if(options.nationCode){
			this.radio=options.nationCode
			this.searchValue=options.nationName
		}
		this.getNationCode();
	},
	watch:{
		searchValue:{
			handler(val){
					this.nationOptions=this.backData.filter(item=>item.nationName.indexOf(val)!==-1)
			},
			immediate:true
		}
	},
	methods: {
		getNationCode() {
			commonAPI.getNationCode({}).then(res => {
				var array = res.data.nationCode;
				var resultArray = array.sort(function compareFunction(param1, param2) {
					return param1.nationName.localeCompare(param2.nationName, 'zh');
				});
				this.nationOptions = resultArray;
				this.backData= resultArray;
				let obj = {};
				this.nationOptions=this.backData.filter(item=>item.nationName.indexOf(this.searchValue)!==-1)
				// resultArray.map(item => {
				// 	let firstLetter = PinyinUtils.chineseToPinYinFirst(item.nationName.substring(0, 1));
				// 	if (Object.keys(obj).indexOf(firstLetter) === -1) {
				// 		obj[firstLetter] = [];
				// 	}
				// 	obj[firstLetter].push(item.nationName);
				// });
				// this.nationOptions = this.formatLetterData(obj);
			});
		},
		formatLetterData(obj) {
			let list = [];
			for (let i in obj) {
				list.push({ letter: i, data: obj[i] });
			}
			return list;
		},
		inputVal(val){
		},
		chooseNation(item){
			this.radio = item.nationCode
			uni.setStorageSync('nationCode',item.nationCode)
			uni.setStorageSync('nationName',item.nationName)
			setTimeout(()=>{
				uni.navigateBack()
				// uni.redirectTo({
				// 	url:`/pages/apply/apply?nationCode=${item.nationCode}&nationName=${item.nationName}`
				// })
			},800)
			
		}
	}
};
</script>

<style scoped>
	.content{
	}
</style>
