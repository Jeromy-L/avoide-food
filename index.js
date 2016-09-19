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
        body.setAttribute('class',"back");
        game();
    }
    left.onclick=function(){
        confirm.style.display="none";
        share.style.display="none";
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
        var tomato = document.getElementById("tomato");
        var eggplant = document.getElementById("eggplant");
        var corn = document.getElementById("corn");
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
                num:0,
                speedX:0,
                speedY:0,
                covar:Math.random()+0.2   //自定义随机速度系数，让球类的速度不一样
            }
            switch(randNum){
                case 0:
                    item.x = 0;
                    item.y = Math.random()*ch;
                    item.num = 0;
                    break;
                case 1:
                    item.x = Math.random()*cw;
                    item.y = 0;
                    item.num = 1;
                    break;
                case 2:
                    item.x = cw;
                    item.y = Math.random()*ch;
                    item.num = 2;
                    break;
                case 3:
                    item.x = Math.random()*cw;
                    item.y = ch;
                    item.num = 3;
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
                switch(item.num){
                    case 0: 
                        ctx.drawImage(rice,-itemSize,-itemSize,itemSize*2,itemSize*2);
                        break;
                    case 1:
                        ctx.drawImage(eggplant,-itemSize,-itemSize,itemSize*2,itemSize*2);
                        break;
                    case 2:
                        ctx.drawImage(tomato,-itemSize,-itemSize,itemSize*2,itemSize*2);
                        break;
                    case 3:
                        ctx.drawImage(corn,-itemSize,-itemSize,itemSize*2,itemSize*2);
                        break;
                }
                // ctx.drawImage(rice,-itemSize,-itemSize,itemSize*2,itemSize*2);
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
