<style lang="less">
@import "./login.less";
</style>

<template>
	<div class="login">
		<div class="sign_canvas"></div>
		<div class="login-con">	
			<Card icon="log-in" title="欢迎登录" :bordered="false">	
				<div class="form-con">	
					<login-form @on-success-valid="handleSubmit"></login-form>	
					<!-- <p class="login-tip">用户名：admin 密码：admin</p>	 -->
				</div>	
			</Card>	
		</div>	
	</div>
</template>

<script>
import LoginForm from "@/components/login-form";
import mockData from "@/mock/index.js";
import { mapMutations } from "vuex"
import lottie from 'lottie-web';
// import util from "@/util";
let Base64 = require('js-base64').Base64;
export default {
	components: {
		LoginForm
	},
	// computed: {
	// 	...mapState(["loginUserName"])
	// },
	mounted () {
        lottie.loadAnimation({
            container: document.querySelector('.sign_canvas'),
            enderer: 'svg',
            loop: true,
            autoplay: true,
            path: 'data7.json',
		});
    },
	methods: {

		...mapMutations(["setLoginUserName","setLoginUserpwd"]),
		handleSubmit({ userName, password }) {
			password = Base64.encode(password)
			let data = {
				username: userName,
				password: password
			};
			this.$axios.post(`${this.$config.KEY.url}/user/login`, data)
			// this.$axios.post('/login', data)
				.then(res => {
					if (res.data.status == true) {
						this.$Notice.success({
							title: "登录成功！"
						});
						this.setLoginUserName(userName)
						this.setLoginUserpwd(password)
						// util.storage.set(this.$config.KEY.CACHE_LOGIN_USER_NAME, userName);
						// util.storage.set(this.$config.KEY.CACHE_LOGIN_PASS_PWD, password);
						setTimeout(() => {
							this.$router.push("/");
						}, 300);
					} else {
						this.$Notice.error({
							title: "登录失败！",
							desc: "请输入正确的用户名和密码 "
						});
					}
				})
				.catch(err => {
					this.$Notice.error({
						title: "登录失败！",
						desc: "请输入正确的用户名和密码"
					});
				});
		}
	}
};
</script>

<style>

</style>