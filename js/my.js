$(function () {
	var username = $("#username");
	var password = $("#password");
	var errmsg = $("#errmsg");
	var login = $("#login");

	var name = sessionStorage.getItem("username");

	/*
	* 鼠标一离开，就进行初步判断
	*/
	username.blur(function () {
		if (!StringUtils(username.val())) {
			errmsg.html("用户名不能为空");
			errmsg.css("display", "block");
		} else {
			//输入框有值，异步判断用户名是否已被注册过。
			checkUserName(username.val());
		}
	});
	password.blur(function () {
		if (!StringUtils(password.val()) || password.val().length < 6) {
			errmsg.html("密码不能为空，也不能少于6位");
			errmsg.css("display", "block");
		}

	});


	if (document.referrer == null || document.referrer == "") {
		//如果此页面不是由其他页面跳转过来的，从定向到login.html
		window.location.href = "login.html";
	}

	function StringUtils(str) {
		if (str == null || str == "") {
			return false;
		} else {
			return true;
		}

	}

	login.on("click", function () {
		/*
		 * 1.获取用户名和密码,如果用户名和密码均不为空并且密码的长度大于6位，方可进行第二步。否则，提示用户名和密码错误。
		 * 2.如果异步请求返回的标识为1，说明用户名和密码验证通过
		 * 3.允许登录，实现跳转。
		 */
		if (StringUtils(username.val()) && StringUtils(password.val()) && password.val().length >= 6) {
			$.ajax({
				type: "post",
				url: "server.php",
				async: true,
				data: { "type": "login", "username": username.val(), "pwd": password.val() },
				success: function (data) {
					//data为返回的数据
					var data = JSON.parse(data);//不解析，仅仅是字符串
					if (data == true) {
						//将用户名存入到sessionStorage中
						sessionStorage.setItem("username", username.val());
						window.location.href = "index.html";
					} else {
						errmsg.innerHTML = "密码错误，请重新输入！若未注册，请前往注册"
						errmsg.style.display = "block";
					}

				}
			});
		} else {
			errmsg.css("display", "block");
		}


	});


	setInterval(getUsers, 3000);//每隔3秒执行一次getUsers方法

	function getUsers(){
		$.ajax({
			type:"post",
			url:"server.php",
			async:true,
			data:{"type":"getUsers"},
			success:function(data){
				var data = JSON.parse(data);
				var names = data["names"];//后台传递的姓名数组
				var count = data["count"];//后台传递的在线人数
				var states = data["states"];//后台传递的状态数组
				//将names的个数，展示在people_count里
				var peopleCount = $("#people_count");
				peopleCount.html(count);
				var membership = $("#membership");
				//遍历数组，将每一个数组中的名字展示到页面上。
				var str = "";
				for(var i=0;i<names.length;i++){
//					str += "<p>" + names[i] + "</p>";
//					str += "<hr />";
                    var ss = "\'"+ names[i] +"\'";
                    //<div id="names[i]" onclick="jump(names[i])"></div>
                    var classname = "";
                    if(states[i] == "0"){
                    	//未登录
                    	classname = "'gray'";
                    }else{
                    	//已登录
                    	if(name == names[i]){
                    		//当前登录用户
                    		classname = "'red'";
                    	}else{
                    		//已登录用户
                    		classname = "'blue'";
                    	}
                    }
                    //拼接字符串
                    str += "<div id=" +ss + " class=" + classname + " onclick=\"jump(" +ss+ ")\">"+"用户昵称："+names[i]+"</div>";
                    str += "<hr />";
                    //将拼接的字符串显示到页面上
                    membership.html(str);
                    $(".gray").css("color","gray");
                    $(".red").css("color","red");
                    $(".blue").css("color","blue"); 
                
                   
	
				}
			}
		});
	}

	/*
	* 发送信息
	*/

	// var time = new Date().getTime();
	var sendbtn = $("#send");
	sendbtn.on("click", function () {
		sendMsg();
	});
	function sendMsg() {
		/*
		 * 1.获取要发送的信息,还要获取信息的发送者
		 * 2.异步请求，将发送的数据写到数据库（msg.json）中
		 * 3.清空输入框
		 */
		var message = $("#message").val();
		var time = new Date().getTime();//获取日期的当前时间
		$.ajax({
			type: "post",
			url: "server.php",
			async: true,
			data: { "type": "sendMsg", "msg": message, "name": name, "time": time },
			success: function (data) {
				console.log(name);
				console.log("message have sent successfully");
				$("#message").val("");//清空输入框
			}
		});
	}


	setInterval(getMsg, 300);
	var lasttime = null;
	function getMsg() {

		$.ajax({
			type: "post",
			url: "server.php",
			async: true,
			data: { "type": "getMsg" },
			success: function (data) {
				var last_message = JSON.parse(data);
				//要求：读取出时间戳，如果当前时间时间戳与最后一条消息的时间戳超过一个小时，不显示。
				//1.读取出最后消息的用户，发送时间，消息内容。
				var newname = last_message["name"];
				var time = last_message["time"];
				var msg = last_message["msg"];
				var date_message = getDate(time);//将最后一条消息的时间转化为H:M:S形式
				//2.判断当前时间与最后一条消息的时间
				var date = new Date().getTime();//获取的当前时间的时间戳
				var interval = date - time; //js的是毫秒，php的是秒
				var chatwindow = $("#chatwindow");
				if (interval < 60 * 60 * 1000) {
					//3.展示消息 如果此条消息之前没有展示过，展示
					if (lasttime != time) {
						lasttime = time;
						var p = $("<p></p>");
						p.html("<span>" + "用户昵称:" + newname + " "  + "时间:" + date_message + ":" + msg);

						//4.判断当前用户是否是最后一条消息的发出者
						if (newname == name) {
							p.addClass("right");
						} else {
							p.addClass("left");
						}
						chatwindow.append(p);

					}
				}

			}
		});
	}
	function getDate(time) {
		var date = new Date(parseInt(time));
		var h = date.getHours();
		var m = date.getMinutes();
		var s = date.getSeconds();
		return h + ":" + m + ":" + s;
	}

	/*
	* 按下Enter键，执行发送方法。
	*/
	document.addEventListener("keydown", function () {
		//1.获取事件
		var e = window.event;
		//2.判断事件的keyCode
		if (e.keyCode == 13 && e.ctrlKey) {
			// 这里实现换行
			$("#message").val($("#message").val() + "\n");
		} else if (e.keyCode == 13) {
			e.preventDefault();
			sendMsg();
		}

	});
	function checkUserName(username) {

		$.ajax({
			type: "post",
			url: "server.php",
			async: true,
			data: { "type": "checkusername", "username": username },
			success: function (data) {
				var flag = JSON.parse(data);
				if (flag == true) {
					errmsg.html("用户名检测通过，可继续填写");
					errmsg.css("display", "block");
				} else {
					errmsg.css("display", "block");
				}
			}
		});
	}



	/*
	 * 注册
	 */
	var registerbtn = $("#registerbtn");
	registerbtn.on("click", function () {
		window.location.href = "register.html";
	});




});
function jump(name){
		//实现跳转后要明确与哪个用户聊天，因此，将被建立连接的用户存到sessionStorage中
		sessionStorage.setItem("uname",name);
		window.location.href = "single.html";
	}


