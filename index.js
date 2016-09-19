    var share = document.getElementById("share");
    var first = document.getElementById("first");
    var btn =document.getElementById("btn");
    var bg = document.getElementById("bg");
    var footer = document.getElementById("footer");
    var body = document.body;
    var confirm = document.getElementById("confirm");
    var left = document.getElementById("left");
    var canvas = document.getElementById("canvas");
    document.getElementById("btn").onclick=function(){
        first.style.display="none";
        bg.style.display="none";
        btn.style.display="none";
        footer.style.display="none";
        body.style.background="";
        // document.body.style.background="url(bg1.jpg)";
        // document.body.style.background="100% 100%"
        body.setAttribute('class',"back");
        game();
    }
    left.onclick=function(){
        confirm.style.display="none";
        share.style.display="none";
        //document.title = '你能逃离北二的控制吗';
        var title = '你能逃离北二的控制吗';
        changeTitle(title);
        game();
    }
    function changeTitle(string){
        var body = document.getElementsByTagName('body')[0];
        document.title = string;
        var iframe = document.createElement("iframe");
        iframe.setAttribute("src", "loading.png");
        iframe.addEventListener('load', function() {
        setTimeout(function() {
          iframe.removeEventListener('load');
            document.body.removeChild(iframe);
          }, 0);
        });
        document.body.appendChild(iframe);
    }
    function game(){
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        var cw = window.innerWidth;
        var ch = window.innerHeight;
        //document.getElementById("first")
        canvas.width = cw;
        canvas.height = ch;
        var starImg = document.getElementById("emoji");
        var rice = document.getElementById("rice");
        var star = {
            x:cw/2,
            y:ch/2,
            speedX:0,
            speedY:0,
            size: 60,
            time:0
        }
        items = [];
        itemSize = 24;
        itemsCount = 0;
        itemsMax = 84;
        itemSpeed = 5;

        //先创建十个初始球类
        for(var i=0;i<10;i++){
            pushItem();
        }

        //每隔0.2秒增加一个球
        intPushItem = setInterval(pushItem,200);

        function pushItem() {
            var randNum = parseInt(Math.random()*4);
            itemsCount++;
            if (itemsCount>itemsMax) {
                clearInterval(intPushItem);
                clearInterval(intDraw);
                document.getElementById("text").innerHTML="you win: "+(itemsCount-10)/5+"s";
                var title = '我在逃离北二饭堂游戏中撑了'+(itemsCount-10)/5+'s';
                changeTitle(title);
                confirm.style.display="block";
                share.style.display="block";
                
            }
            var item = {
                x:0,
                y:0,
                speedX:0,
                speedY:0,
                covar:Math.random()+0.2   //自定义随机速度系数，让球类的速度不一样
            }
            switch(randNum){
                case 0:
                    item.x = 0;
                    item.y = Math.random()*ch;
                    break;
                case 1:
                    item.x = Math.random()*cw;
                    item.y = 0;
                    break;
                case 2:
                    item.x = cw;
                    item.y = Math.random()*ch;
                    break;
                case 3:
                    item.x = Math.random()*cw;
                    item.y = ch;
                    break;
                default:
                    break;
            }
            items.push(item);
        }

        setTime = 18;
        intDraw = setInterval(drawCanvas, setTime);

        function drawCanvas(){
            ctx.clearRect(0,0,cw,ch);
            drawStar();
            drawItem();
            //判断是否碰到四周边缘
            if (star.x-star.size/2<0||star.y-star.size/2<0||star.x+star.size/2>cw||star.y+star.size/2>ch) {
                starImg = document.getElementById("emoji1");
                drawStar();
                clearInterval(intPushItem);
                clearInterval(intDraw);
                document.getElementById("text").innerHTML="you lose: "+(itemsCount-10)/5+"s";
                var title = '我在逃离北二饭堂游戏中撑了'+(itemsCount-10)/5+'s';
                changeTitle(title);
                confirm.style.display="block";
                share.style.display="block";
                
            }
        }
        function drawStar(){
            star.x += star.speedX;
            star.y += star.speedY;
            ctx.save();
            ctx.translate(star.x,star.y);  //重置起始点坐标为星星中心点
            ctx.rotate(star.time*Math.PI/180);  //旋转的角度
            //ctx.beginPath();
            ctx.drawImage(starImg,-star.size/2,-star.size/2,star.size,star.size);
            //ctx.closePath();
            ctx.restore();
            star.time +=4;
        }

        function drawItem(){
            items.forEach(function(item){
                var dist = Math.sqrt(Math.pow(item.x-star.x,2)+Math.pow(item.y-star.y,2));
                if (Math.abs(dist)<itemSize+star.size/2) {
                    starImg = document.getElementById("emoji1");
                    drawStar();
                    clearInterval(intPushItem);
                    clearInterval(intDraw);
                    document.getElementById("text").innerHTML="you lose: "+(itemsCount-10)/5+"s";
                    var title = '我在逃离北二饭堂游戏中撑了'+(itemsCount-10)/5+'s';
                    changeTitle(title);
                    confirm.style.display="block";
                    share.style.display="block";
                }
                var speedNarrow = 0.007/setTime;  //限制球的速度
                if (Math.abs(item.speedX+(star.x-item.x)*speedNarrow)<=10) {
                    item.speedX += (star.x-item.x)*speedNarrow;
                }
                if (Math.abs(item.speedY+(star.y-item.y)*speedNarrow)<=10) {
                    item.speedY += (star.y-item.y)*speedNarrow;
                }
                item.x += item.speedX*item.covar;
                item.y += item.speedY*item.covar;
                ctx.save();
                ctx.translate(item.x,item.y);  //重置起始点坐标为星星中心点
                ctx.rotate(item.time*Math.PI/180);  //旋转的角度
                //ctx.beginPath();
                ctx.drawImage(rice,-itemSize,-itemSize,itemSize*2,itemSize*2);
                //ctx.closePath();
                ctx.restore();
                // ctx.beginPath();
                // ctx.arc(item.x, item.y, itemSize, 0, 360, false);
                // ctx.closePath();
                // ctx.fillStyle = "#D26962";
                // ctx.fill();
            })
        }

        //PC端用拖动事件
        //不结合onmousedown和onmouseup做成拖动的原因在于拖动的时候setInterval速度会受影响，导致球体速度变慢
        var dragFlag = false;
        canvas.onclick = function(event){
            x=event.clientX;
            y=event.clientY;
            if(Math.abs(x-star.x)<=star.size/2&&Math.abs(y-star.y)<=star.size/2){
                dragFlag = true;
            }
            console.log(dragFlag);
        }
        canvas.onmousemove = function(){
            if(dragFlag){
                star.x=event.clientX;
                star.y=event.clientY;
            }
        }


        //手机平板类用重力感应事件
        window.addEventListener("deviceorientation",function(event){
            if ((event.gamma>=3&&event.gamma<=90)||(event.gamma<=-3&&event.gamma>=-90)) {
                star.speedX = 0.5*event.gamma;
            }else{
                star.speedX = 0;
            }
            if ((event.beta>=3&&event.beta<=90)||(event.beta<=-3&&event.beta>=-90)) {
                star.speedY = 0.5*event.beta;
            }else{
                star.speedY = 0;
            }
        },true);
    }


     // wx.config({
     //        debug: false,
     //        appId: 'wx53f3924f225e6704',
     //        timestamp: '1414587457',
     //        nonceStr: 'Wm3WZYTPz0wzccnW',
     //        signature: 'SHA1',
     //        jsApiList: [
     //            'checkJsApi',
     //            'onMenuShareTimeline',
     //            'onMenuShareAppMessage'
     //        ]
     //    });
     //    wx.ready(function () {
     //        // 2.1 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
     //        wx.onMenuShareTimeline({
     //            title: '我在逃离北二饭堂游戏中撑了'+(itemsCount-10)/5+'s',
     //            link: window.location.href,
     //            imgUrl: 'emoji.png',
     //            trigger: function (res) {
     //                // alert("分享到朋友圈按钮点击");        
     //            },
     //            success: function (res) {
     //            },
     //            cancel: function (res) {
     //                // alert('已取消');
     //            },
     //            fail: function (res) {
     //                alert(JSON.stringify(res));
     //            }
     //        });
     //        // 2.2 监听“分享给朋友”按钮点击、自定义分享内容及分享结果接口

     //        wx.onMenuShareAppMessage({
     //            title: '我在逃离北二饭堂游戏中撑了'+(itemsCount-10)/5+'s',
     //            link: window.location.href,
     //            imgUrl: 'emoji.png',
     //            success: function () { 
     //                // 用户确认分享后执行的回调函数
     //            },
     //            cancel: function () { 
     //                // 用户取消分享后执行的回调函数
     //            }
     //        });
     //    });











    // var imgUrl = "emoji.png";
    // var lineLink = window.location.href;
    // var descContent = '我在逃离北二饭堂游戏中撑了'+(itemsCount-10)/5+'s';
    // var shareTitle = '神奇的北二饭堂';
    // var appid = '';
    
    // function shareFriend() {
    //     WeixinJSBridge.invoke('sendAppMessage',{
    //         "appid": appid,
    //         "img_url": imgUrl,
    //         "img_width": "200",
    //         "img_height": "200",
    //         "link": lineLink,
    //         "desc": descContent,
    //         "title": shareTitle
    //     }, function(res) {
    //         //_report('send_msg', res.err_msg);
    //     })
    // }
    // function shareTimeline() {
    //     WeixinJSBridge.invoke('shareTimeline',{
    //         "img_url": imgUrl,
    //         "img_width": "200",
    //         "img_height": "200",
    //         "link": lineLink,
    //         "desc": descContent,
    //         "title": shareTitle
    //     }, function(res) {
    //            //_report('timeline', res.err_msg);
    //     });
    // }
    // function shareWeibo() {
    //     WeixinJSBridge.invoke('shareWeibo',{
    //         "content": descContent,
    //         "url": lineLink,
    //     }, function(res) {
    //         //_report('weibo', res.err_msg);
    //     });
    // }
    // // 当微信内置浏览器完成内部初始化后会触发WeixinJSBridgeReady事件。
    // document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
    //     // 发送给好友
    //     WeixinJSBridge.on('menu:share:appmessage', function(argv){
    //         shareFriend();
    //     });
    //     // 分享到朋友圈
    //     WeixinJSBridge.on('menu:share:timeline', function(argv){
    //         shareTimeline();
    //     });
    //     // 分享到微博
    //     WeixinJSBridge.on('menu:share:weibo', function(argv){
    //         shareWeibo();
    //     });
    // }, true);