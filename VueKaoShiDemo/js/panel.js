Vue.component("radio-component", {
	template: "#radio-component",
	props: {
		value: {
			type: Object
		},
		index: {
			type: Number
		}
	},
	data: function() {
		return {
			results: this.value.results,
			title: this.value.title,
			items: this.value.items
		}
	},
	watch: {
		results: function() {
			this.$emit("setSelected", "radio", this.index, this.results);
		}
	},
	created : function(){
		var _this = this;
		bus.$on("resetOnePage", function(){
			_this.results = '';
		});
	}
});

Vue.component("checkbox-component", {
	template: "#checkbox-component",
	props: {
		value: {
			type: Object
		},
		index: {
			type: Number
		}
	},
	data: function() {
		return {
			results: this.value.results,
			title: this.value.title,
			items: this.value.items
		}
	},
	watch: {
		results: function() {
			this.$emit("setSelected", "checkbox", this.index, this.results);
		}
	}
});

Vue.component("textarea-component", {
	template: "#textarea-component",
	props: {
		value: {
			type: Object
		},
		index: {
			type: Number
		}
	},
	data: function() {
		return {
			results: this.value.results,
			title: this.value.title,
		}
	},
	watch: {
		results: function() {
			this.$emit("setSelected", "textarea", this.index, this.results);
		}
	}
});

Vue.component("button-component", {
	template: "#button-component",
	props: {
		value: {
			type: Number
		},
		is_disabled: {
			type: Boolean
		},
		disabledClass: {
			type: Object
		}
	},
	data: function() {
		return {
			current_page: this.value
		}
	},
	watch: {
		current_page: function() {
			this.$emit("setCurrentPage", this.current_page);
		}
	},
	computed: {
		btnClass: function() {
			return {
				'two-buttion': this.current_page === 1
			}
		}
	},
	methods: {
		nextPage: function() {
			//			下一页事件
			if(this.current_page === 3) {
				return;
			}
			if(this.current_page < 3) {
				this.current_page += 1;
			}
			console.log("当前页 ", this.current_page);
		},
		perviousPage: function() {
			//			上一页事件
			if(this.current_page === 1) {
				return;
			}
			if(this.current_page > 1) {
				this.current_page -= 1;
			}
			console.log("当前页 ", this.current_page);
		},
		submitFrom: function() {
			//			提交事件
			console.log("提交");
			//			触发提交事件
			bus.$emit("submitToServer");
		},
		resetPage : function(){
//			重置事件
			console.log("重置");
			bus.$emit("resetPage");
			if (this.current_page === 1){
				bus.$emit("resetOnePage");
			}
			this.current_page = 1;
		}
	}
});

Vue.component("items-component", {
	template: "#items-component",
	props: {
		value: {
			type: Number
		}
	},
	watch: {
		value: function(val) {
			this.current_page = val;
		},
		current_page: function() {
			if(this.current_page === 1) {
				this.$emit("setBtnDisabled", this.redioitems, 1);
			} else if(this.current_page === 2) {
				this.$emit("setBtnDisabled", this.checkitems, 2);
			} else if(this.current_page === 3) {
				this.$emit("setBtnDisabled", this.textareaitems, 10);
			}
		}
	},
	data: function() {
		return {
			current_page: this.value,
			redioitems: [
				{
					results: '',
					title: "请问老张的性别是什么",
					items: [{
							msg: '男'
						},
						{
							msg: '女'
						},
						{
							msg: '保密'
						}
					]
				}],
			checkitems: [{
				title: "请选择您的兴趣爱好",
				results: [],
				items: [{
						'msg': '吃饭'
					},
					{
						'msg': '睡觉'
					},
					{
						'msg': '打豆豆'
					}
				]
			}],
			textareaitems: [{
				results: "",
				title: "简单介绍一下自己",
			}]
		}
	},
	created: function() {
		bus.$on("submitToServer", this.submitToServer);
		bus.$on("resetPage", this.resetPage);
	},
	methods: {
		setSelected: function(select_type, index, data) {
			//			设置选中值
			//				select_type 题目类型 radio,checkbox,textarea
			//				index 题目索引
			//				data 选中的数据
			var result = false
			if(select_type === "radio") {
				this.redioitems[index].results = data;
				this.$emit("setBtnDisabled", this.redioitems, 1);
			} else if(select_type === "checkbox") {
				this.checkitems[index].results = data;
				this.$emit("setBtnDisabled", this.checkitems, 2);
			} else if(select_type === "textarea") {
				this.textareaitems[index].results = data;
				this.$emit("setBtnDisabled", this.textareaitems, 10);
			}
		},
		submitToServer: function() {
			//			提交到服务器
			var answers = {
				redio_answers: [],
				check_answers: [],
				textarea_answers: []
			}

			for(var i = 0; i < this.redioitems.length; i++) {
				answers.redio_answers.push(this.redioitems[i].results);
			}

			for(var i = 0; i < this.checkitems.length; i++) {
				answers.check_answers.push(this.checkitems[i].results);
			}

			for(var i = 0; i < this.textareaitems.length; i++) {
				answers.textarea_answers.push(this.textareaitems[i].results);
			}
			console.log("ajax 提交 : ", answers);
		},
		resetPage : function(){
//			清除已选中数据
			for(var i = 0; i < this.redioitems.length; i++) {
				this.redioitems[i].results = '';
			}
			for(var i = 0; i < this.checkitems.length; i++) {
				this.checkitems[i].results = [];
			}
			for(var i = 0; i < this.textareaitems.length; i++) {
				this.textareaitems[i].results = [];
			}
		}
	}
});

Vue.component("panel-component", {
	template: "#panel-component",
	data: function() {
		return {
			current_page: 1,
			is_disabled: true,
		}
	},
	computed: {
		disabledClass: function() {
			return {
				'btn-disabled': this.is_disabled
			}
		}
	},
	methods: {
		setCurrentPage: function(val) {
			this.current_page = val;
		},
		setBtnDisabled: function(items, size) {
			var status = false;
			for(var i = 0; i < items.length; i++) {
				if(items[i].results.length < size) {
					status = true;
					break;
				}
			}
			this.is_disabled = status;
		}
	}
});