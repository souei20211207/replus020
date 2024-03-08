//れぷらすバックグラウンド処理ソースコード
//2022.01.04
//れぷらすはAVAの複垢管理ツール「あばぷらす」のプログラムを転用して作っています。

//注: ここでいうセッションIDとは "lkey" クッキーのことです


//初回起動時に変数を作る
chrome.storage.sync.get(["firstopen"], function(items) {
	if(items.firstopen == null){
		alert("れぷらすのインストールが完了しました\n※自己責任でご利用ください。作者はすべての事象において，責任を負いません。\n※HPからログアウト処理をすると登録したIDが使えなくなりますので，IDを追加する場合は拡張機能メニューの「新規」から行ってください。");
		chrome.storage.sync.set(
			{
				"firstopen": "1",
				"IDs": ""
			}
		);
	}    
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	var unPackReq = request.split("&souei&");
	if(unPackReq[0] == "getAuth"){
		chrome.storage.sync.get(["IDs"], function(items) {
			var id_list=items.IDs.split("\n");
			var l=id_list.length;
			var elem=[];
			var i;
			for(i=0;i<l;i++){
				elem.push(id_list[i].split("&souei&")[0]);
			}
			if(elem.indexOf( unPackReq[1] ) == -1){
				chrome.storage.sync.set({
					"IDs": items.IDs + unPackReq[1] + "&souei&" + unPackReq[2]+"&souei&"+unPackReq[3] + "\n"
 				});
 				alert("「" + unPackReq[1] + "」をれぷらすに追加しました！");
			}
		})
	}
});
