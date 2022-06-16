<template>
	<view class="content">
		<view class="uni-padding-wrap uni-common-mt" style="background-color: rgba(239,239,239,0.5);">
			<uni-segmented-control :current="current" :values="items" style-type="text" active-color="#007aff"
				@clickItem="onClickItem"></uni-segmented-control>
		</view>
		<view class="">
			<Alarm v-if="current==0"></Alarm>
		</view>
	</view>
</template>

<script>
	import Alarm from './components/alarm'
	export default {
		components:{
			Alarm
		},
		data() {
			return {
				current: 0,
				items: ['实时预警', '风险早报','新闻早报','平台消息'],
			}
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
