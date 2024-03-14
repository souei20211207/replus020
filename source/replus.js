//20240312 ver.0.03
document.addEventListener('DOMContentLoaded', function() {
	chrome.runtime.sendMessage("count");
});

chrome.extension.onMessage.addListener(function (req, sender, sendResponse) {
	var request;
	if(req.indexOf("&souei&") != -1){
		request = req.split("&souei&");
		if(request[0]=="login"){
			if(localStorage.getItem('ace_type')) {
				localStorage.removeItem('ace_type');
				localStorage.removeItem('ace_token');
			}
			window.location.href = "https://www.redstoneonline.jp/signin/1?returnurl=https%3A%2F%2Fwww.redstoneonline.jp%2F";
		}else if(request[0]=="input"){
			if(request[1]!="0"){
				var pName=request[1];
				var pPass=request[2];
				var i=0;
				var j=0;
				var c="no";
				var id = setInterval(function () {
					i=i+1;
					if(c=="no"){
						try{
							var inp=document.getElementsByTagName("input");
							inp[0].value=pName;
							inp[0].dispatchEvent(new Event("input", {bubbles: true,cancelable:true,}));
							inp[1].value=pPass;
							inp[1].dispatchEvent(new Event("input", {bubbles: true,cancelable:true,}));
							c="yes";
						}catch(error){
						}
					}else if(c=="yes"){
						try{
							var btn=document.querySelector("#main > div > div.layout.layout-content.touch-no.justify-center.align-start > div.flex.app-center.shrink > div > div > div.flex.inset-box > div > div > div:nth-child(1) > div > button");
							if(String(btn.style).indexOf("backgroung-color:#971311")){
								j=j+1;
								if(j==20){
									btn.click();
									clearInterval(id);
								}
							}
						}catch(error){
						}
					}
					if(i>1000){
						clearInterval(id);
					}
				},10);
			}
		}
	}else{
		request = req;
		if (request == "name") {
			try {
				var elements = document.querySelector("#main > div > div.layout.layout-content.touch-no.justify-center.align-start > div.layout.app-left.column.justify-start.align-end.wrap > div.layout.frame.shrink.column.justify-space-between.align-content-space-between > div > div:nth-child(2) > div.layout.login.column.justify-start.align-content-center > div.layout.id.justify-space-between.align-content-center > div.flex.py-1.touch-on");
				var pName = elements.innerHTML;
			} catch (error) {
				var pName = "souei";
			}
			sendResponse(pName)
		}else{
			window.location.href = request;
		}
    }
});




