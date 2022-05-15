export default {
	formatTreeData: function(data, child, parent, topValue) {
		//将list整理为树结构   child子节点字段名,parent父节点字段名,topValue最顶级父节点字段值
		var arr = [];
		for (var i = 0, l = data.length; i < l; i++) {
			var item = data[i];
			// if (item != null && item[parent] === topValue) {
			// 	this.tranData(data, item, child, parent);
			// 	arr.push(item);
			// }
			this.tranData(data, item, child, parent);
			arr.push(item);
		}
		let temp = data.find(item=>!item.scode)
		console.log(temp)
		if(temp){
			return [temp]
		}else{
			return arr;
		}
		
	},
	tranData: function(data, parent, idField, parentField) {
		var temp = [];
		for (var i = 0, l = data.length; i < l; i++) {
			var item = data[i];
			if (item != null && item[parentField] == parent[idField]) {
				this.tranData(data, item, idField, parentField);
				temp.push(item);
			}
		}
		if (temp.length > 0) {
			parent['children'] = temp;
		}
	}
}
