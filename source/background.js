//20240312 ver.0.03
//初回起動時に変数を作る
chrome.storage.sync.get(["firstopen"], function(items) {
	if(items.firstopen == null){
		alert("れぷらすのインストールが完了しました。\n※自己責任でご利用ください。作者はすべての事象において，責任を負いません。");
		chrome.storage.sync.set(
			{
				"firstopen": "1",
				"IDs": "",
				"count":"0"
			}
		);
	}    
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	var message;
	if(request=="count"){
		chrome.storage.sync.get(["count"], function(item) {
			if(Number(item.count)>0){
				chrome.storage.sync.get(["IDs"], function(items) {
					var accounts=items.IDs.trim().split("\n");
					massage="input&souei&"+accounts[Number(item.count)-1];
					chrome.tabs.query({active : true}, (tabs) => {
						chrome.tabs.sendMessage(tabs[0].id, massage);
					});
				});
			}else{
				massage="input&souei&"+item.count;
				chrome.tabs.query({active : true}, (tabs) => {
					chrome.tabs.sendMessage(tabs[0].id, massage);
				});
			}
		});
		chrome.storage.sync.set({"count":"0"});
	}
});