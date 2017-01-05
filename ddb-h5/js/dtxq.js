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
/*获取动态详情*/
function dtxq(backfunction){
    AJAX({
        url:"http://"+httpdata+"/feed/getFeedInfo",
        data:yonghuData,
        success:function(result){
            if(result.code=="10000"){
                backfunction(result);
            }else{
                mui.alert(result.msg)
            }
        }
    })
}
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
        	}
        }
    })
}


/*获取url 处理传递的参数*/    
    var loadata=window.location.href;
    var loadataArr=loadata.split("?");
    var loadArr=loadataArr[1].split("&");
    var hrefData={};
    for(var i=0 in loadArr){
    	var arr=loadArr[i].split("=");
    	hrefData[arr[0]]=arr[1];
    }

var yonghuData={access_token:hrefData.access_token,feed_id:hrefData.feed_id};
var collect=$(".collect");
AJAX({
    url:"http://"+httpdata+"/feed/getFeedInfo",
    data:yonghuData,
    success:function(result){
        if(result.code=="10000"){
            /*店铺logo*/
           if(result.data.logo!=""&&result.data.logo!=null){
           	   var logobox=$(".logo_box").children("img");
           	   logobox.attr({src:result.data.logo});
           	   var img=new Image();
                img.src=result.data.logo;
                img.onload=function(){
                	var logowidth=img.width;
                	var logoheight=img.height;
                    if(logowidth>=logoheight){
	                    logobox.css({height:"100%",width:"auto"});
	                 }else{
	                    logobox.css({width:"100%",height:"auto"});
	            }	
                }
           }
            /*动态标题*/
            $(".logoTitle").children("h1").text(result.data.title);
            /*点赞情况*/
            if(result.data.zan){
                /*已经点赞*/
                collect.children("img").attr({src:"/images/kefx@3x.png"});
            }else{
                /*可以点赞*/
                collect.children("img").attr({src:"/images/yifx@3x.png"});
            }
            collect.children("span").html("("+(result.data.zan_count)+")");

            /*分享次数*/
            var fx=$(".fx");
            fx.children("span").html("("+(result.data.share_count)+")");
		    if(yonghuData.access_token!=undefined){
				fx.parent("a").on("tap",function(){
					window.location.href="ddb://topic/share/"+hrefData.feed_id;
	            })
			}
            
            /*动态详情*/
            var content=result.data.content;
            /*获取文字内容*/
           if(content==null||content==""){
           	$(".content_xq").html("<p>店家没有添加内容！</p>");
           	return;
           }
            var str="";
	        str+="<p>"+content+"</p>";
	        var images=eval(result.data.images);
	        for (var i in eval(result.data.images)) {
	        	str+="<img src='"+(eval(result.data.images)[i])+"'>";
	        }
            $(".content_xq").html(str);
            /*动态详情图文排版*/
        }else{
            mui.alert(result.msg);
        }
    }
})

/*点击点赞*/
if(yonghuData.access_token!=null&&yonghuData.access_token!=undefined&&yonghuData.access_token!=""){
	collect.on("tap",function(){
	dtdz(yonghuData,collect);
     })
}
