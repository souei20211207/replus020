//20250202 ver.0.06

document.addEventListener('DOMContentLoaded', function() {
	chrome.runtime.sendMessage("count");
    if(window.location.href.match("https://www.redstoneonline.jp/*")){
        if(localStorage.getItem('ace_type')) {
            if(window.location.href==("https://www.redstoneonline.jp/event/redslogin")){
            }else if(window.location.href==("https://www.redstoneonline.jp/event/roulette")){
            }else{
                var pName;
                var i=0;
                var id = setInterval(function () {
                    i=i+1;
                    try{
                        var elements = document.getElementsByClassName("flex py-1 touch-on");
                        pName=elements[0].innerHTML;
                        chrome.runtime.sendMessage(pName);
                        clearInterval(id);
                    }catch(error){
                    }
                    if(i>1000){
						clearInterval(id);
					}
                },100);
            }
        }else{
            var pName;
            pName = "souei";
            chrome.runtime.sendMessage(pName);
        }
    }
});

chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
	if(request.indexOf("&souei&") != -1){
		var req = request.split("&souei&");
		if(req[0]=="login"){
			if(localStorage.getItem('ace_type')) {
				localStorage.removeItem('ace_type');
				localStorage.removeItem('ace_token');
			}
			window.location.href = "https://www.redstoneonline.jp/signin/1?returnurl=https%3A%2F%2Fwww.redstoneonline.jp%2Frank";
		}else if(req[0]=="input"){
			if(req[1]!="0"){
				var pName=req[1];
				var pPass=req[2];
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
								if(j==10){
									btn.click();
                                    chrome.runtime.sendMessage(pName);
									clearInterval(id);
								}
							}
						}catch(error){
						}
					}
					if(i>1000){
						clearInterval(id);
					}
				},100);
			}
		}
	}else{
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
        }else if(request == "idlook"){
            if(window.location.href.match("https://www.redstoneonline.jp/*")){
                if(localStorage.getItem('ace_type')) {
                    if(window.location.href==("https://www.redstoneonline.jp/event/redslogin")){
                    }else if(window.location.href==("https://www.redstoneonline.jp/event/roulette")){
                    }else{
                        var i=0;
                        var id = setInterval(function () {
                            i=i+1;
                            try{
                                var elements = document.getElementsByClassName("flex py-1 touch-on");
                                var pName=elements[0].innerHTML;
                                chrome.runtime.sendMessage(pName);
                                clearInterval(id);
                            }catch(error){
                            }
                            if(i>1000){
                                clearInterval(id);
					       }
                        },100);
                    }
                }else{
                    var pName="souei"
                    chrome.runtime.sendMessage(pName);
                }
			}
		}else{
			window.location.href = request;
		}
    }
});
