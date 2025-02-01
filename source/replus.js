//20250201 ver.0.06
document.addEventListener('DOMContentLoaded', function() {
	chrome.runtime.sendMessage("count");
    if(window.location.href.match("https://www.redstoneonline.jp/*")){
        if(localStorage.getItem('ace_type')) {
            var pName;
            var i=0;
            var id = setInterval(function () {
                i=i+1
                try {
                    var elements = document.getElementsByClassName("flex py-1 touch-on");
                    pName = elements[0].innerHTML;
                    chrome.runtime.sendMessage(pName);
                } catch (error) {
                    if(window.location.href==("https://www.redstoneonline.jp/event/redslogin")){
                       i=i+1000;
                    }else if(window.location.href==("https://www.redstoneonline.jp/event/roulette")){
                        i=i+1000;
                    }
                }
                if(i>1000){
				    clearInterval(id);
				}
            },10);
        }else{
            var pName;
            pName = "dsouei";
            chrome.runtime.sendMessage(pName);
        }
    }
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
			window.location.href = "https://www.redstoneonline.jp/signin/1?returnurl=https%3A%2F%2Fwww.redstoneonline.jp%2Frank";
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
								if(j==50){
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
		if(request == "roulette"){
            try {
                var elements = document.getElementsByTagName('img');
                var i;
                for(i=0;i<elements.length;i++){
                    if(elements[i].getAttribute('src')=='https://file.redstoneonline.jp/RS.JP.live/banner/202402/e6a1317b/ad75/4caa/92a2/b65031333d89e6a1317b-ad75-4caa-92a2-b65031333d89.png'){
                        elements[i].click();
                    }
                }
            } catch (error) {
			}
        }else if(request == "roulette2"){
            var message;
            massage="no";
            try {
                var elements = document.getElementsByTagName('img');
                var i;
                for(i=0;i<elements.length;i++){
                    if(elements[i].getAttribute('src')=='https://file.redstoneonline.jp/RS.JP.live/banner/202501/2136cdd6/d51d/4343/93d4/6bc9d181b48e2136cdd6-d51d-4343-93d4-6bc9d181b48e.png'){
                        message="yes";
                    }
                }
                sendResponse(message);
            } catch (error) {
                sendResponse(message);
			}
		}else{
			window.location.href = request;
		}
    }
});
