var gamebase={
    x:8,//每行多少列
    y:5,//每列多少行
    z:4,//每个相同元素出现的次数
    l:0.8,//游戏满盈率，最大为1(表示没有空白)，需要注意x*y*l%z=0
    gameMap:null,
    createGame:function(x,y,z,l){
        $(".game").css({width:x*80,height:y*80});
        var arrnum=getNum(x*y*l,z);//获得地图基础数据
        function getNum(a,b){
            var arr=[];
            var n=0;
            for(var m=0;m<a;m++){
                if(n>=a/b){n=0;};n++;arr[m]=n;
            }
            return arr;
        }
        console.log(arrnum);

        var arrnew=getNewarr(x*y);//随机自然数到n的乱序数组
        function getNewarr(a){
            var arr1=[];
            for(var m=0; m<a;m++){arr1[m]=m+1;}
            var arr2=[];
            for(var n=0;n<a;n++){
                var temp=parseInt(Math.random()*arr1.length);
                arr2.push(arr1.splice(temp,1)[0])
            }
            return arr2;
        }
        console.log(arrnew);

        //生成比实际数组大一圈的数组，方便连线计算
        var arrmap=getMaparr(arrnum,arrnew);
        gamebase.gameMap=arrmap;
        function getMaparr(a,b){//将地图基础数据，按照乱序数组添加到地图数组
            var arr=[];
            for(var i=0;i<y+2;i++){
                arr[i]=[];
                for(var j=0;j<x+2;j++){
                    arr[i][j]=0;
                }
            }
            //console.log(parseInt((b[0]-1)/x)+"----"+(b[0]-1)%x);
            for(var k=0;k<x*y*l;k++){
                var ii=parseInt((b[k]-1)/x);
                var jj=(b[k]-1)%x;
                arr[ii+1][jj+1]=a[k];
            }
            return arr;
        }
        console.log(arrmap);

        //添加dom，设置游戏地图
        for(var i=0;i<y;i++){
            for(var j=0;j<x;j++){
                $(".game").append("<li class=list"+arrmap[i+1][j+1]+"><i></i>"+arrmap[i+1][j+1]+"</li>")
            }
        }
    }
};
gamebase.createGame(gamebase.x,gamebase.y,gamebase.z,gamebase.l);//创建游戏



