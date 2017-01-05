        function touchmove(index){
		   var width=$(window).width();
		   var startX=0;
		   var startY=0;
		   document.addEventListener("touchstart",function(eve){
		   	startX=eve.touches[0].screenX;
		   	startY=eve.touches[0].screenY;
		   })
		   var moveX=0;
		   var moveY=0;
		   document.addEventListener("touchmove",function(eve){
		   	endX=eve.touches[0].screenX;
		   	endY=eve.touches[0].screenY;
		   	moveX=endX-startX;
		   	moveY=endY-startY;
		   	if(Math.abs(moveY)>=50){
		   		moveX=0;
		   	}
		   	if(index==0&&moveX>0){
		   		index=0;
		   		moveX=0;
		   		return;
		   	}
		   	if(index==2&&moveX<0){
		   		index=2;
		   		moveX=0;
		   		return;
		   	}
		   	parent.iframmove(index,moveX);
		   })
		   document.addEventListener("touchend",function(eve){
		   	if(moveX>=(width/3)){
		   		parent.iframmove(index,width);
		   	}else if(moveX<=-(width/3)){
		   		parent.iframmove(index,-width);
		   	}else{
		   		parent.iframmove(index,0);
		   	}
		   	startY=0;
		   	startX=0;
		   	endX=0;
		   	moveX=0;
		   })
        }
