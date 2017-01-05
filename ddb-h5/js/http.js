var loadata=window.location.href;
    if(loadata.match("test")){
    	httpdata="ddbtest.rmbplus.com";
    }else if(loadata.match("dev")){
    	httpdata="ddbdev.rmbplus.com";
    }else{
    	httpdata="ddb.rmbplus.com";
    }
