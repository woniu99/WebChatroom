window.onload = function(){
	var float = document.getElementById("float");
	var username = sessionStorage.getItem("username");//当前用户
	var uname = sessionStorage.getItem("uname");//想要发起聊天的用户
	float.innerHTML = username + "与"+ uname + "聊天进行中......";
	float.style.marginLeft = "500px";
	float.style.color = "green";

    //发送消息
	var sendbtn = document.getElementById("send");
	sendbtn.onclick = function(){
	    var msg = document.getElementById("message").value;//发送的消息
	    var time = new Date().getTime();//当前时间的时间戳 毫秒为单位
	    
	    $.ajax({
	    	type:"post",
	    	url:"server.php",
	    	async:true,
	    	data:{"type":"s_send","namefrom":username,"nameto":uname,"msg":msg,"time":time},
	    	success:function(data){
	    		console.log("message have sent successful");
	    		//发送完成后，将input标签内容情况
	    		document.getElementById("message").value = "";
	    		console.log(data);
	    	}
	    });
	}
//展示信息
	setInterval(getMsg,300);
	var lasttime = "";
	function getMsg(){
		//获取最后一条消息
		$.ajax({
			type:"post",
			url:"server.php",
			async:true,
			data:{"type":"getMsgforSingle"},
			success:function(data){
				var json = JSON.parse(data);
				var time = json["time"];
				var from = json["namefrom"];
				var to = json["nameto"];
				var msg = json["msg"];
				var currenttime = new Date().getTime();
				var messageTime = getTime(time);
				//1.判断时间与当前时间相差小于一小时
				if((currenttime-time) < 60*60*1000){
					//2.判断当前消息有没有被显示过
					if(time != lasttime){
						lasttime = time;
						//3.判断当前用户与信息的关系
						var p = document.createElement("p");
						if(username == from && uname == to){
							//当前用户是信息的发送者，并且建立聊天的用户是消息的接受者
							p.className = "right";
							p.innerHTML = "用户昵称：" +username+ "时间" + messageTime + ":" + "   "+msg + "<br>";
						    
						    
						}
						if(username == to && uname == from){
							//当前用户是信息的接受者,并且建立聊天的用户是消息的发送者
							p.className = "left";
							p.innerHTML = "用户昵称：" +uname+ "时间" + messageTime + ":" + "   " + msg + "<br>";
							
							
						}
						$("#chatwindow").append(p);
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
}

