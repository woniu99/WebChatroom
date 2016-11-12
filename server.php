<?php
   $type = $_POST["type"];
   //$type 存在
   	   if($type == "login"){
   	  	$name = $_POST["username"];
		$psd = $_POST["pwd"];
		$time = time();//当前时间的时间戳
		$flag = null;//返回登录成功标志，true，成功，false，失败
		
		/*
		 * 判断传递进来的用户名和密码，是否在user.json中，如果存在，返回true；
		 *
		 */
		 //1.读取user.json中的数据
		 $json = file_get_contents("user.json");
		 //2.将$json解析成数组
		 $arr_json = json_decode($json,true);//对json字符串转化为数组类型，第二个参数为true，说明返回的是数组类型，否则为object类型。
		//3.遍历数组，与传递过来的用户名和密码匹配
		for($i = 0;$i<count($arr_json);$i++){
			if($arr_json[$i]["user_name"] == $name && $arr_json[$i]["password"] == $psd){
				//4.如果用户名和密码验证均通过，则将该数组中的state改为1，证明已登录
				$arr_json[$i]["state"] = "1";
				$flag = true;
			}
		}
		//5.将$arr_json编码写回到user.json中
		$json_encode = json_encode($arr_json);
		file_put_contents("user.json", $json_encode);
		//返回json类型的flag标志
		echo json_encode($flag); 
   	  }


 /*
	   * 获取用户
	   */
	  if($type == "getUsers"){
	  	//1.读取user.json
	  	$json = file_get_contents("user.json");
	  	//2.将读取的数据转化为数组
	  	$arr_json = json_decode($json,true);
	  	//3.定义一个数组，存取原先数组中的name
	  	$arr = array();
		$c = 0;
		for($i = 0;$i<count($arr_json);$i++){
			$arr["names"][$i] = $arr_json[$i]["user_name"];
			if($arr_json[$i]["state"] == "1"){
				$c++;
			}
			$arr["count"] = $c;
			$arr["states"][$i] = $arr_json[$i]["state"];
		}
	  	//4.将新数组编码输出
	  	echo json_encode($arr);
	  }

/*
	   * 发送消息
	   */
	   if($type == "sendMsg"){
	   	//1.定义一个msg.json的文件。
	   	//2.读取msg.json文件内容
	   	$json = file_get_contents("msg.json");
		//3.将读取得json数据转化为数组
		if(empty($arr_json)){
			$arr_json = array();
		}else{
			$arr_json = json_decode($json,true);
		}
		//4.自定义一个数组接收传过来的用户名和信息
		$name = $_POST["name"];
		$msg = $_POST["msg"];
		$time = $_POST["time"];
		$arr = array("name"=>$name,"msg"=>$msg,"time"=>$time);//time()获取当前时间的时间戳
		//5.将传递过来的信息与原先的信息组合
		array_push($arr_json,$arr);//将两个数组合并为第一个参数代表的数组
		//6.编码写到msg.json中
		$arr_encode = json_encode($arr_json);//将数组转化为json
		file_put_contents("msg.json", $arr_encode);//该方法在写之前会把所有东西清空再写
		echo $arr_encode;
		
		
	   }
 /*
	    * 读取最后一条信息
	    */
	    if($type == "getMsg"){
	    	//1.读取msg.json文件
	    	$json = file_get_contents("msg.json");
			//2.将$json转化为数组
			$arr_json = json_decode($json,true);
			//3.判断数组个数，读取数组中最后一个
			$len = count($arr_json);
			$last = $arr_json[$len-1];
			echo json_encode($last);
	    }



/*
		 * 检查用户名是否已经存在
		 */
		 if($type == "checkusername"){
		 	$flag = "";
		 	$username = $_POST["username"];
		 	$json = file_get_contents("user.json");
			 $arr_json = json_decode($json,true);
			 for($i = 0 ; $i < count($arr_json) ; $i++){
			 	$name = $arr_json[$i]["user_name"];
			 	if($name == $username){
			 		$flag = true;
			 	}
			 }
			 echo json_encode($flag);
		 }
		 /*
		  * 注册
		  */
		 if($type == "register"){
    	  
				 $name = $_POST['username'];
				 $psd = $_POST['psd'];
				 $time = $_POST["time"];
				 $state = $_POST["state"];
				 
				 $data = array("user_name" => $name,"password" => $psd,"timestamp" => $time,"state"=>$state);
				 
				 $userjson = file_get_contents("user.json");  //string类型的
				 
				 $userjson = json_decode($userjson,true);//将userjson的string类型转化为数组类型，true值返回的是数组而非Object。
			     array_push($userjson,$data);
		
				 $json = json_encode($userjson);//返回json类型的字符串
			     file_put_contents("user.json", $json);
				 echo json_encode(true);
		 
        }

if($type == "s_send"){
			//1.新建一个singleMsg.json
			//2.读取singleMsg.json中的json数据
			$json = file_get_contents("singleMsg.json");
			//3.将读取的json数据转化为数组
			if(empty($arr_json)){
				$arr_json = array();
			}else{
				$arr_json = json_decode($json,true);
			}
		
			//4.定义一个数组，接受传递过来的值
			$namefrom = $_POST["namefrom"];
			$nameto = $_POST["nameto"];
			$msg = $_POST["msg"];
			$time = $_POST["time"];
			$arr = array("namefrom"=>$namefrom,"nameto"=>$nameto,"msg"=>$msg,"time"=>$time);
			//5.合并数组
			array_push($arr_json,$arr);
			//6.编码后重新写入文件
			$arr_encode = json_encode($arr_json);
			file_put_contents("singleMsg.json", $arr_encode);
			echo $arr_encode;
		}

   	/*
		 * 展示信息
		 */
		 if($type == "getMsgforSingle"){
		 	//读取最后一条
		 	$json = file_get_contents("singleMsg.json");
			$arr_json = json_decode($json,true);
			$count = count($arr_json);
			echo json_encode($arr_json[$count-1]);//将最后一条消息数组编码传输到前台。
		 }

?>
