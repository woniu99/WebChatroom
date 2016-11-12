window.onload = function () {
    
    var fl_name = false;//全局标识，为true时，才可以跳转页面
    var fl_pass = false;
    var username = document.getElementById("username");
    var pass = document.getElementById("password");
    var registerbtn = document.getElementById("registerbtn");
    var errmsg = document.getElementById("errmsg");

    username.onblur = function () {
        if (check(username.value)) {
            checkUserName(username.value);
        } else {
            errmsg.innerHTML = "用户名不能为空！";
            errmsg.style.display = "block";
            username.focus();
        }
    };

    pass.onblur = function () {
        if (!check(pass.value) || pass.value.length < 6) {
            errmsg.innerHTML = "密码不能为空或者密码位数不能少于6位！";
            errmsg.style.display = "block";
            pass.focus();
        } else {
            fl_pass = true;
        }
    };
    registerbtn.onclick = function () {
        if (fl_pass == true && fl_name == true) {
            //此时用户名校验成功。可以注册
            var time = new Date().getTime();
            $.ajax({
                type: "post",
                url: "server.php",
                async: true,
                data: { "type": "register", "username": username.value, "psd": pass.value, "time": time, "state": 0 },
                success: function (data) {
                    var flag = JSON.parse(data);
                    if (flag == true) {
                        window.location.href = "login.html";
                    }
                }
            });
        }
    };

    function check(str) {
        if (str != null && str != "") {
            return true;
        } else {
            return false;
        }
    }
    function checkUserName(username) {
        $.ajax({
            type: "post",
            url: "server.php",
            async: true,
            data: { "type": "checkusername", "username": username },
            success: function (data) {
                var flag = JSON.parse(data);
                if (flag == true) {
                    //用户名已经存在
                    errmsg.innerHTML = "用户名已经存在！";
                } else {
                    errmsg.innerHTML = "用户名可以注册！";
                    fl_name = true;
                }
                errmsg.style.display = "block";
            }
        });
    }

}
