$(function(){
	/*店铺页选项卡*/
    var btn=$(".content_title>div");//获取三个选项卡按钮
    var con=$(".con");//获取三个选项卡
    btn.each(function(index){
        $(this).on("click",function(){
            btn.children("h1").removeClass("hot").eq(index).addClass("hot");
            con.css({display:"none"}).eq(index).css({display:"block"});
        })
        if(index==1){
        	$(this).one("click",function(){
            btn.children("h1").removeClass("hot").eq(index).addClass("hot");
            con.css({display:"none"}).eq(index).css({display:"block"});
        })
        }
    })
    /*ajax*/
    function AJAX(aggregate){
        $.ajax({
            type: aggregate.type||"get",
            url: aggregate.url,
            dataType: "jsonp",
            data:aggregate.data,
            jsonp: "callback",
            success:aggregate.success
        })
    }
      
/*获取url 处理传递的参数*/    
    
    var loadataArr=loadata.split("?");
    var loadArr=loadataArr[1].split("&");
    var hrefData={};
    for(var i=0 in loadArr){
    	var arr=loadArr[i].split("=");
    	hrefData[arr[0]]=arr[1];
    }
    var yonghuData={access_token:hrefData.access_token,shop_id:hrefData.shop_id};
    /*加载完成获取店铺信息*/
   var content_dt=$(".content_dt");
   var collect=$(".collect");
   var yhurl=""
   var shenf=true;
   if(yonghuData.shop_id==undefined||yonghuData.shop_id==""){
   	yhurl="http://"+httpdata+"/shop/myshopInfo";
   	shenf=false;
   	/*自己的店*/
   }else{
   	yhurl="http://"+httpdata+"/shop/shopInfo";
   	/*别人的店*/
   	/*判断访问者是否开店*/
   	AJAX({
   		url:"http://"+httpdata+"/user/getUserAllInfo",
   		data:yonghuData,
   		success:function(result){
   			if(result.code=="10000"){
   				if(result.data.type=="0"){
   					shenf=false;
   				}else if(result.data.type=="1"){
   					shenf=true;
   				}
   			};
   		}
   	})
   	
   }
    AJAX({
        url:yhurl,
        data:yonghuData,
        success:function(result){
        	if(result.code!="10000"){
        		mui.alert(result.msg);
        		return;
        	}
        	yonghuData.shop_id=result.data.shop_id;
            /*logo*/
            var logo=result.data.logo;
            if(logo!=null&&logo!=""){
                var logobox=$(".logo_box").children("img").attr({src:logo});
                var img=new Image();
                img.src=logo;
                img.onload=function(){
                	var logowidth=img.width;
                	var logoheight=img.height;
                    if(logowidth>=logoheight){
	                    logobox.css({height:"100%"});
	                 }else{
	                    logobox.css({width:"100%"});
	            }	
                }
            }
            /*title*/
            var title=result.data.name;
            if(title!=null&&title!=""){
                $(".logoTitle").children("h1").text(title);
            }
            /*点赞情况*/
            if(result.data.zan){
                /*已经点赞*/
                collect.children("img").attr({src:"/images/kefx@3x.png"});
            }else{
                /*可以点过*/
                collect.children("img").attr({src:"/images/yifx@3x.png"});
            }
            /*点赞次数*/
            collect.children("span").text("("+result.data.zan_count+")");
            /*粉丝次数*/
            $(".fans").children("span").text("("+result.data.fans_count+")");
            /*图文排版*/
            var data={content:result.data.desc,images:result.data.images,parents:$(".content_xq")};
            videotex(data);
        


/*图文排版接口*/
    function videotex(data){
        /*
        * data.content 文字内容
        * data.images  图片数组
        * data.parents  排版的容器
        * */
        var content=data.content;
        /*获取文字内容*/
        var str="";
        str+="<p>"+content+"</p>";
        var images=eval(data.images);
        for (var i in eval(data.images)) {
        	str+="<img src='"+(eval(data.images)[i])+"'>";
        }
        data.parents.html(str);
    }
    /*店铺点赞*/
    collect.on("click",function(){
        /*点赞*/
        AJAX({type:"post",
                url:"http://"+httpdata+"/shop/clickZan",
                data:yonghuData,
                success: function(data){
                    /*成功后进行判断是否之前点击过*/
                   
                    if(data.code=="10000"){
                        shxq(function(result){
                            var num=parseInt(collect.children("span").text().slice(1,-1));
                            if(result.data.zan){
                                /*已经点赞*/
                               num--;
                               if(num<0){
                               	num=0;
                               }
                                collect.children("img").attr({src:"/images/kefx@3x.png"});
                                collect.children("span").html("("+(num)+")");
                            }else{
                                /*可以点过*/
                                collect.children("img").attr({src:"/images/yifx@3x.png"});
                                collect.children("span").html("("+(num+1)+")");
                            }
                        })
                    }else{
                    	mui.alert(data.msg);
                    	return;
                    }
                }
            })
    })
    /*获取商户的粉丝列表*/
   var pagefs=0;
    function fs(){
    	pagefs++;
    	var data=yonghuData;
    	data.page=pagefs;
        AJAX({
            url:"http://"+httpdata+"/fans/getFansList",
            data:data,
            success:function(result){
                if(result.code=="10000"){
                    var contentFs=$(".content_fs");
                    var str="";
                    for(var i in result.data){
                        str+='<li><a href="/fsxq.html?access_token='+(yonghuData.access_token)+'&user_id='+(result.data[i].user_id)+'"><div class="fs_logo"><div class="">';
                        if(result.data[i].photo==null||result.data[i].photo==""){
                        	str+='<img src="/images/1.jpg" alt="">';
                        }else{
                        	str+='<img src="'+result.data[i].photo+'" alt="">';
                        }
                        str+='</div></div><div class="fs_title"><h1>'+(result.data[i].nickname)+'</h1><p>';
                        for(var j in result.data[i].tag){
                            str+=result.data[i].tag[j].name+"、";
                        }
                        str+='</p></div></a>';
                        /*是否显示按钮*/
                        if(shenf){
                        	str+='<div class="fs_button"><div class="quanfbtn" user_id="'+result.data[i].user_id+'">圈TA为粉</div></div></li> ';
                        }
                    }
                    contentFs.children("ul").append(str);
                }else{
                	return
                }
            }
        })
    }
    fs();
    /*获取商户最新信息 商铺点赞*/
    function shxq(backfunction){
        AJAX({
            url:"http://"+httpdata+"/shop/shopUpdate",
            data:yonghuData,
            success:function(result){
                backfunction(result);
            }
        })
    }
    /*获取商户动态*/
   var pagedt=0;
    function shdt(){
    	pagedt++;
    	var data=yonghuData;
    	data.page=pagedt;
        AJAX({
            url:"http://"+httpdata+"/feed/getFeedsList",
            data:data,
            success:function(result){
                if(result.code=="10000"){
                    var str="";
                    for(var i in result.data){
                        str+='<li><a href="/dtxq.html?access_token='+(yonghuData.access_token)+'&feed_id='+(result.data[i].feed_id)+'"><p>'+(result.data[i].title)+'</p></a><div><div class="comment icon dz"  feed_id="'+result.data[i].feed_id+'">';
                        if(result.data[i].zan){
                            str+='<img src="./images/kefx@3x.png" alt="">';
                        }else{
                            str+='<img src="./images/yifx@3x.png" alt="">';
                        }
                        str+='<span>('+(result.data[i].zan_count)+')</span></div><div class="comment icon fx"><a href="ddb://topic/share/'+result.data[i].feed_id+'"><img src="./images/fx@3x.png" alt=""><span>('+(result.data[i].share_count)+')</span></a></div><div class="comment icon"><img src="./images/time@3x.png" alt=""><span>'+(result.data[i].time.slice(0,10))+'</span></div></div></li>'
                    }
                    content_dt.find("ul").append(str);
                }else{
            	return;
            }
            }
        })
    }
    shdt();
    /*动态点赞*/
    content_dt.on("click",".dz",function(){
        var dz=$(this);
        yonghuData.feed_id=dz.attr("feed_id");
        dtdz(yonghuData,dz);
    })


    /*获取动态详情*/
    function dtxq(backfunction){
        AJAX({
            url:"http://"+httpdata+"/feed/getFeedInfo",
            data:yonghuData,
            success:function(result){
                if(result.code=="10000"){
                    backfunction(result);
                }else{
                    return;
                }
            }
        })
    }
/*圈粉*/
    var content_fs=$(".content_fs");
    content_fs.on("click",".quanfbtn",function(){
        var user_id=$(this).attr("user_id");
        var data={access_token:hrefData.access_token,user_id:user_id,source_id:yonghuData.shop_id}
        AJAX({
            url:"http://"+httpdata+"/fans/addFans",
            type:"post",
            data:data,
            success:function(result){
            	console.log(result)
                if(result.code=="10000"){
                   mui.alert("圈粉成功");
                }else{
                	mui.confirm('您尚未购买偷窥宝','提示',['取消','去购买'],function(data){
                		if(data.index==1){
                			window.location.href="ddb://tool/getList";
                		}
                	},'div');
                }
            }
        })
    })
    /*动态点赞接口*/
function dtdz(yonghuData,dz){
    AJAX({
        url:"http://"+httpdata+"/feed/clickZan",
        type:"post",
        data:yonghuData,
        success:function(data){
        	if(data.code=="10000"){
        		dtxq(function(result){
                var num=parseInt(dz.children("span").text().slice(1,-1));
                if(result.data.zan){
                    /*已经点赞*/
                   num--;
                   if(num<0){
                   	num=0;
                   }
                    dz.children("img").attr({src:'/images/kefx@3x.png'});
                    dz.children("span").html("("+(num)+")")
                }else{
                    /*可以点赞*/
                    dz.children("img").attr({src:'/images/yifx@3x.png'});
                    dz.children("span").html("("+(num+1)+")")
                }
            })
        	}else{
        		mui.alert(data.msg);
        		return;
        	}
        }
    })
}
    /*分享接口*/
//  function fx(yonghuData){
//      AJAX({
//          url:"http://"+httpdata+"/share/shareCheck",
//          data:yonghuData,
//          success:function(data){
//              if(data.code=="10000"){
//                  /*分享*/
//                  window.location.href="ddb://topic/share/"+yonghuData.feed_id;
//              }else{
//                  mui.alert(data.msg)
//              }
//          }
//      })
//  }


    var height=$(window).height();
    document.getElementsByClassName("content_dt")[0].addEventListener("touchend",function(e){
        var htmlHeight=$("html").height();
        var bottom=$(window).scrollTop();
        if(bottom>=htmlHeight-height&&bottom!=0){
            shdt();
        }
    })
    document.getElementsByClassName("content_fs")[0].addEventListener("touchend",function(e){
        var htmlHeight=$("html").height();
        var bottom=$(window).scrollTop();
        if(bottom>=htmlHeight-height&&bottom!=0){
            fs();
        }
    })

}
    })

})