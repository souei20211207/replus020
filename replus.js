//れぷらすメインソースコード
//2020.08.26
//Ver0.20 2021.08.29
//Ver0.30 2021.09.27

//ページの読み込みが終わったら
document.addEventListener('DOMContentLoaded', function() {
	var pName = null;
	setTimeout(function() {
		try {
			//左サイドのプレーヤー情報から，プレーヤー名を取得
			var elements = document.querySelector("#main > div > div.layout.layout-content.touch-no.justify-center.align-start > div.layout.app-left.column.justify-start.align-end.wrap > div.layout.frame.shrink.column.justify-space-between.align-content-space-between > div > div:nth-child(2) > div.layout.login.column.justify-start.align-content-center > div.layout.id.justify-space-between.align-content-center > div.flex.py-1.touch-on");
			pName = elements.innerHTML;
			var v1=localStorage.getItem('ace_type');
			var v2=localStorage.getItem('ace_token');
			chrome.runtime.sendMessage("getAuth&souei&"+pName+"&souei&"+v1+"&souei&"+v2);
		} catch (error) {
		}
		
		try {
			var btn=document.querySelector("#main > div > div.layout.layout-content.touch-no.justify-center.align-start > div.flex.app-center.shrink > div > div > div.flex.inset-box > div > div > div:nth-child(1) > div > button");
			btn.addEventListener("click",function(){
				setTimeout(function() {
					window.location.reload(true);
				},3000);
			});
		}catch(error){
		}
	},1000);
});

chrome.extension.onMessage.addListener(function (req, sender, sendResponse) {
	var request;
	if(req.indexOf("&souei&") != -1){
		request = req.split("&souei&");
		if(request[0]=="set"){
			localStorage.setItem("ace_type", request[1]);
			localStorage.setItem("ace_token", request[2]);
			window.location.reload(true);
		}
	}else{
		request = req;
		if (request == "ace") {
			if(localStorage.getItem('ace_type')) {
				localStorage.removeItem('ace_type');
				localStorage.removeItem('ace_token');
			}
		}else if (request == "login") {
			window.location.href = "https://www.redstoneonline.jp/signin/1?returnurl=https%3A%2F%2Fwww.redstoneonline.jp%2F";
		}else if (request == "reload") {
			window.location.reload(true);
		}else if (request == "name") {
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




