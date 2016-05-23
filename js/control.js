var temp=null;//记录选中项
var maparr=gamebase.gameMap;
//打印二维数组
function drawArr(arr){
    var i=arr.length;
    var j=arr[0].length;
    var data="";
    for(var a=0; a<i;a++){
        for(var b=0; b<j;b++){
            data+=arr[a][b]+","
        }
        data+="\n"
    }
    return data;
}
console.log(drawArr(maparr));

$(".game li").bind("click",function(){
    if(temp==null){//没有选中项的情况
        $(this).addClass("active");
        temp=$(this);
    }else if(temp.index()!=$(this).index()){//有选中项，直接进行验证
        if(getconnect(temp,$(this))){//若能连接
            temp.removeAttr("class").addClass("list0").unbind("click");
            $(this).removeAttr("class").addClass("list0").unbind("click");
            temp=null;
            console.log(drawArr(maparr));
        }else{
            $(this).addClass("active").siblings().removeClass("active");
            temp=$(this);
        }
    }

});
$(".game li.list0").unbind("click");//为空项的取消绑定

//验证两次选择的是否可以连接
function getconnect(a,b){
    var isopen=false;
    console.log(a.index()+"--"+ b.index());
    var ai=parseInt(a.index()/gamebase.x)+1;//因为虚拟地图比实际大一圈，所以都+1
    var aj=a.index()%gamebase.x+1;
    var bi=parseInt(b.index()/gamebase.x)+1;
    var bj=b.index()%gamebase.x+1;
    console.log(ai+","+aj+"---"+bi+","+bj);
    if(maparr[ai][aj]!= maparr[bi][bj]){
        console.log("两次选择内容不同，不可消除");
        return false;
    }else{
        //判断是否同行或同列
        if(ai==bi){//同行
            if(isopen_h(maparr,ai,aj,bj)){//直线可连接
                maparr[ai][aj]=0;maparr[bi][bj]=0;drawline_h(ai,aj,bj,0);return true;
            }else{//三线可连接
                for(var i=0;i<gamebase.y+2;i++){
                    if(isopen_h(maparr,i,aj,bj) && isopen_v(maparr,aj,ai,i) && isopen_v(maparr,bj,bi,i) && maparr[i][aj]==0 && maparr[i][bj]==0){
                        console.log("同行三线第"+i+"行形成通路");
                        drawline_h(i,aj,bj,0);drawline_v(aj,ai,i,1);drawline_v(bj,bi,i,2);
                        maparr[ai][aj]=0;maparr[bi][bj]=0;isopen=true;break;
                    }
                }
                return isopen;
            }
        }else if(aj==bj){//同列
            if(isopen_v(maparr,aj,ai,bi)){//直线可连接
                maparr[ai][aj]=0;maparr[bi][bj]=0;drawline_v(aj,ai,bi,0);return true;
            }else{//三线可连接
                for(var j=0;j<gamebase.x+2;j++){
                    if(isopen_v(maparr,j,ai,bi) && isopen_h(maparr,ai,aj,j) && isopen_h(maparr,bi,bj,j)&& maparr[ai][j]==0 && maparr[bi][j]==0){
                        console.log("同列三线第"+j+"列形成通路");
                        drawline_v(j,ai,bi,0);drawline_h(ai,aj,j,1);drawline_h(bi,bj,j,2);
                        maparr[ai][aj]=0;maparr[bi][bj]=0;isopen=true;break;
                    }
                }
                return isopen;
            }

        }else{//不同行同列
            //两条线可连
            if(maparr[ai][bj]==0 && isopen_h(maparr,ai,aj,bj) && isopen_v(maparr,bj,ai,bi)){
                console.log("不同行同列与（"+ai+","+bj+")点两线通路");
                drawline_h(ai,aj,bj,0);drawline_v(bj,ai,bi,1);
                maparr[ai][aj]=0;maparr[bi][bj]=0;return true;
            }else if(maparr[bi][aj]==0 && isopen_v(maparr,aj,ai,bi) && isopen_h(maparr,bi,aj,bj)){
                console.log("不同行同列与（"+bi+","+aj+")点两线通路");
                drawline_v(aj,ai,bi,0);drawline_h(bi,aj,bj,1);
                maparr[ai][aj]=0;maparr[bi][bj]=0;return true;
            }else{//三条线可连
                for(var i=0;i<gamebase.y+2;i++){
                    if(isopen_h(maparr,i,aj,bj) && isopen_v(maparr,aj,ai,i) && isopen_v(maparr,bj,bi,i) && maparr[i][aj]==0 && maparr[i][bj]==0){
                        console.log("不同行三线第"+i+"行形成通路");
                        drawline_h(i,aj,bj,0);drawline_v(aj,ai,i,1);drawline_v(bj,bi,i,2);
                        maparr[ai][aj]=0;maparr[bi][bj]=0;isopen=true;break;
                    }
                }
                if(isopen){return isopen;}else{
                    for(var j=0;j<gamebase.x+2;j++){
                        if(isopen_v(maparr,j,ai,bi) && isopen_h(maparr,ai,aj,j) && isopen_h(maparr,bi,bj,j)&& maparr[ai][j]==0 && maparr[bi][j]==0){
                            console.log("不同列三线第"+j+"列形成通路");
                            drawline_v(j,ai,bi,0);drawline_h(ai,aj,j,1);drawline_h(bi,bj,j,2);
                            maparr[ai][aj]=0;maparr[bi][bj]=0;isopen=true;break;
                        }
                    }
                    return isopen;
                }


            }


        }

    }
}

//验证同行两点之间是否通畅
function isopen_h(arr,i,aj,bj){
    var a=true;
    if(Math.abs(aj-bj)!=1){//不相邻，相邻直接通过，aj=bj的情况前面已经排除
        for(var k=1;k<Math.abs(aj-bj);k++){
            var jj=aj>bj?bj+k:aj+k;
            if(arr[i][jj]!=0){a=false;console.log("横向坐标阻塞"+i+","+jj);break;}
        }
    }
    return a;
}
//验证同列两点之间是否通畅
function isopen_v(arr,j,ai,bi){
    var a=true;
    if(Math.abs(ai-bi)!=1) {//不相邻，相邻直接通过，ai=bi的情况前面已经排除
        for(var k=1;k<Math.abs(ai-bi);k++){
            var ii=ai>bi?bi+k:ai+k;
            if(arr[ii][j]!=0){a=false;console.log("纵向坐标阻塞"+ii+","+j);break;}
        }
    }
    return a;
}

//画连接线
function drawline_h(i,aj,bj,n){
    var s=aj>bj?bj:aj;
    $(".game .line").eq(n).css({top:49+80*[i-1],left:49+80*[s-1],width:Math.abs(aj-bj)*80,height:2});
    setTimeout(function(){$(".game .line").eq(n).css({top:0,left:0,width:0,height:0})},50)
}
function drawline_v(j,ai,bi,n){
    var s=ai>bi?bi:ai;
    $(".game .line").eq(n).css({top:49+80*[s-1],left:49+80*[j-1],width:2,height:Math.abs(ai-bi)*80});
    setTimeout(function(){$(".game .line").eq(n).css({top:0,left:0,width:0,height:0})},50)
}

