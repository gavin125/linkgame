var LinkGame=function(x,y,z,l,dom){
    this.x=x;//每行多少列
    this.y=y;//每列多少行
    this.z=z;//每个相同元素出现的次数
    this.l=l;//游戏满盈率，最大为1(表示没有空白)，需要注意x*y*l%z=0
    this.dom=dom;
    this.gameinit();
    this.gamecontrol()
    
}

LinkGame.prototype={
    constructor:LinkGame,
    gameinit:function(){//游戏初始化，生成游戏画布》游戏数据》渲染游戏DOM
        var that=this;
        that.dom.css({width:that.x*80,height:that.y*80});
        that.gamearrmap();
        that.renderdom();
    },
    gamearrmap:function(){
        var that=this;
        var arrmap=[];// 生成虚拟二维数组（比实际数组大一圈，方便连线计算）,并初始值均为0
        for(var i=0; i<that.y+2;i++){
            arrmap[i]=[];
            for(var j=0;j<that.x+2;j++){
                arrmap[i][j]=0;
            }
        }

        var arrbase=[];// 生成基础数据一维数组
        var max=that.x*that.y*that.l/that.z;
        for(var m=0;m<that.z;m++){
            for(var n=0;n<max;n++)
                arrbase[n+m*max]=n;
        }

        var arrorder=[];//生成乱序数组
        var arrtemp=[];//临时数组
        for(var h=0;h<that.x*that.y;h++){arrtemp[h]=h+1;}
        for(var g=0;g<that.x*that.y;g++){
            var temp=Math.floor(Math.random()*arrtemp.length);
            arrorder.push(arrtemp.splice(temp,1)[0])
        }

        //根据此顺序将基础数组添加到地图数组
        for(var o=0;o<arrbase.length;o++){
            arrmap[Math.floor(arrorder[o]/that.x)+1][(arrorder[o]%that.x+1)]=arrbase[o]
        }

        console.log(arrbase+"\n"+arrorder)
        that.drawArr(arrmap)
        that.arrmap=arrmap;
    },
    renderdom:function(){
        var that=this;
        for(var i=0; i<that.y;i++){
            for(var j=0;j<that.x;j++){
                that.dom.append("<li class=list"+that.arrmap[i+1][j+1]+"><i></i></li>")
            }
        }
        that.dom.append("<li class='line'></li><li class='line'></li><li class='line'></li>")

    },
    drawArr:function(arr){//打印二维数组
    var i=arr.length;
    var j=arr[0].length;
    var data="";
    for(var a=0; a<i;a++){
        for(var b=0; b<j;b++){data+=arr[a][b]+","}
        data+="\n"
        }
    console.log(data);
    },
    gamecontrol:function(){
        var that=this;
        that.curr=null;
        that.dom.find("li").bind("click",function(){
            if(that.curr==null){//没有选中项的情况
                $(this).addClass("active");
                that.curr=$(this);
            }else if(that.curr.index()!=$(this).index()){//有选中项，直接进行验证
                if(that.getconnect(that.curr,$(this))){//若能连接
                    that.curr.removeAttr("class").addClass("list0").unbind("click");
                    $(this).removeAttr("class").addClass("list0").unbind("click");
                    that.curr=null;
                }else{
                    $(this).addClass("active").siblings().removeClass("active");
                    that.curr=$(this);
                }
            }

        });
        that.dom.find("li.list0").unbind("click");//为空项的取消绑定
    },
    getconnect:function(a,b){
        var that=this;
        var isopen=false;
        console.log(a.index()+"--"+ b.index());
        var ai=parseInt(a.index()/that.x)+1;//因为虚拟地图比实际大一圈，所以都+1
        var aj=a.index()%that.x+1;
        var bi=parseInt(b.index()/that.x)+1;
        var bj=b.index()%that.x+1;
        console.log(ai+","+aj+"---"+bi+","+bj);
        if(that.arrmap[ai][aj]!= that.arrmap[bi][bj]){
            console.log("两次选择内容不同，不可消除");
            return false;
        }else{
            //判断是否同行或同列
            if(ai==bi){//同行
                if(that.isopen_h(that.arrmap,ai,aj,bj)){//直线可连接
                    that.arrmap[ai][aj]=0;that.arrmap[bi][bj]=0;that.drawline_h(ai,aj,bj,0);return true;
                }else{//三线可连接
                    for(var i=0;i<that.y+2;i++){
                        if(that.isopen_h(that.arrmap,i,aj,bj) && that.isopen_v(that.arrmap,aj,ai,i) && that.isopen_v(that.arrmap,bj,bi,i) && that.arrmap[i][aj]==0 && that.arrmap[i][bj]==0){
                            console.log("同行三线第"+i+"行形成通路");
                            that.drawline_h(i,aj,bj,0);that.drawline_v(aj,ai,i,1);that.drawline_v(bj,bi,i,2);
                            that.arrmap[ai][aj]=0;that.arrmap[bi][bj]=0;isopen=true;break;
                        }
                    }
                    return isopen;
                }
            }else if(aj==bj){//同列
                if(that.isopen_v(that.arrmap,aj,ai,bi)){//直线可连接
                    that.arrmap[ai][aj]=0;that.arrmap[bi][bj]=0;that.drawline_v(aj,ai,bi,0);return true;
                }else{//三线可连接
                    for(var j=0;j<that.x+2;j++){
                        if(that.isopen_v(that.arrmap,j,ai,bi) && that.isopen_h(that.arrmap,ai,aj,j) && that.isopen_h(that.arrmap,bi,bj,j)&& that.arrmap[ai][j]==0 && that.arrmap[bi][j]==0){
                            console.log("同列三线第"+j+"列形成通路");
                            that.drawline_v(j,ai,bi,0);that.drawline_h(ai,aj,j,1);that.drawline_h(bi,bj,j,2);
                            that.arrmap[ai][aj]=0;that.arrmap[bi][bj]=0;isopen=true;break;
                        }
                    }
                    return isopen;
                }

            }else{//不同行同列
                //两条线可连
                if(that.arrmap[ai][bj]==0 && that.isopen_h(that.arrmap,ai,aj,bj) && that.isopen_v(that.arrmap,bj,ai,bi)){
                    console.log("不同行同列与（"+ai+","+bj+")点两线通路");
                    that.drawline_h(ai,aj,bj,0);that.drawline_v(bj,ai,bi,1);
                    that.arrmap[ai][aj]=0;that.arrmap[bi][bj]=0;return true;
                }else if(that.arrmap[bi][aj]==0 && that.isopen_v(that.arrmap,aj,ai,bi) && that.isopen_h(that.arrmap,bi,aj,bj)){
                    console.log("不同行同列与（"+bi+","+aj+")点两线通路");
                    that.drawline_v(aj,ai,bi,0);that.drawline_h(bi,aj,bj,1);
                    that.arrmap[ai][aj]=0;that.arrmap[bi][bj]=0;return true;
                }else{//三条线可连
                    for(var i=0;i<that.y+2;i++){
                        if(that.isopen_h(that.arrmap,i,aj,bj) && that.isopen_v(that.arrmap,aj,ai,i) && that.isopen_v(that.arrmap,bj,bi,i) && that.arrmap[i][aj]==0 && that.arrmap[i][bj]==0){
                            console.log("不同行三线第"+i+"行形成通路");
                            that.drawline_h(i,aj,bj,0);that.drawline_v(aj,ai,i,1);that.drawline_v(bj,bi,i,2);
                            that.arrmap[ai][aj]=0;that.arrmap[bi][bj]=0;isopen=true;break;
                        }
                    }
                    if(isopen){return isopen;}else{
                        for(var j=0;j<that.x+2;j++){
                            if(that.isopen_v(that.arrmap,j,ai,bi) && that.isopen_h(that.arrmap,ai,aj,j) && that.isopen_h(that.arrmap,bi,bj,j)&& that.arrmap[ai][j]==0 && that.arrmap[bi][j]==0){
                                console.log("不同列三线第"+j+"列形成通路");
                                that.drawline_v(j,ai,bi,0);that.drawline_h(ai,aj,j,1);that.drawline_h(bi,bj,j,2);
                                that.arrmap[ai][aj]=0;that.arrmap[bi][bj]=0;isopen=true;break;
                            }
                        }
                        return isopen;
                    }


                }


            }

        }
    },
    //验证同行两点之间是否通畅
    isopen_h:function(arr,i,aj,bj){
        var a=true;
        if(Math.abs(aj-bj)!=1){//不相邻，相邻直接通过，aj=bj的情况前面已经排除
            for(var k=1;k<Math.abs(aj-bj);k++){
                var jj=aj>bj?bj+k:aj+k;
                if(arr[i][jj]!=0){a=false;console.log("横向坐标阻塞"+i+","+jj);break;}
            }
        }
        return a;
    },
    //验证同列两点之间是否通畅
    isopen_v:function(arr,j,ai,bi){
        var a=true;
        if(Math.abs(ai-bi)!=1) {//不相邻，相邻直接通过，ai=bi的情况前面已经排除
            for(var k=1;k<Math.abs(ai-bi);k++){
                var ii=ai>bi?bi+k:ai+k;
                if(arr[ii][j]!=0){a=false;console.log("纵向坐标阻塞"+ii+","+j);break;}
            }
        }
        return a;
    },

    //画连接线
    drawline_h:function(i,aj,bj,n){
        var s=aj>bj?bj:aj;
        $(".game .line").eq(n).css({top:49+80*[i-1],left:49+80*[s-1],width:Math.abs(aj-bj)*80,height:2});
        setTimeout(function(){$(".game .line").eq(n).css({top:0,left:0,width:0,height:0})},50)
    },
    drawline_v:function(j,ai,bi,n){
        var s=ai>bi?bi:ai;
        $(".game .line").eq(n).css({top:49+80*[s-1],left:49+80*[j-1],width:2,height:Math.abs(ai-bi)*80});
        setTimeout(function(){$(".game .line").eq(n).css({top:0,left:0,width:0,height:0})},50)
    }

}

var game=new LinkGame(10,5,4,0.8,$(".game"))





