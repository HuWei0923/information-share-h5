<template>
	<view class="content">
		<view class="uni-padding-wrap uni-common-mt" style="background-color: rgba(239,239,239,0.5);">
			<uni-segmented-control :current="current" :values="items" style-type="text" active-color="#007aff"
				@clickItem="onClickItem"></uni-segmented-control>
		</view>
		<view class="">
			<components :is="componentsList[current]" :searchMoreFlag="searchMoreFlag"></components>
		</view>
	</view>
</template>

<script>
	import Alarm from './components/alarm'
	import Risk from './components/risk'
	import News from './components/news'
	import Platform from './components/platform'
	export default {
		components:{
			Alarm,Risk,News,Platform
		},
		data() {
			return {
				current: 0,
				items: ['实时预警', '风险早报','新闻早报','平台消息'],
				componentsList:[Alarm,Risk,News,Platform],
				searchMoreFlag:true
			}
		},
		onReachBottom() {
			this.searchMoreFlag=!this.searchMoreFlag
		},
		//下拉刷新
		onPullDownRefresh() {
			// this.currentPage = 1;
			// this.listData = [];
			// this.getData();
			// console.log(3333)
			uni.stopPullDownRefresh()
		},
		methods: {
			onClickItem(e){
				this.current = e.currentIndex;
			}
		}
	}
</script>

<style scoped>

</style>
