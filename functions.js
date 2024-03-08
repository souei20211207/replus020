//れぷらす設定ソースコード
//2021.08.26
//Ver0.20 2021.08.29
//Ver0.30 2021.09.27

//注: ここでいうセッションIDとは "lkey" クッキーのことです

var boxURL;
const ver = "0.30";


//右クリック無効
document.oncontextmenu = function () {return false;}


//ボタンのイベントリスナー--------------------------------
document.getElementById("change").addEventListener('click', (e) => {
	acc_change();
});
  
document.getElementById("delete").addEventListener('click', (e) => {
	acc_delete();
});
document.getElementById("new").addEventListener('click', (e) => {
	acc_new();
});

document.getElementById("avabox").addEventListener('click', (e) => {
	openURL("https://www.redstoneonline.jp/shop/item?m=101&s=0");
});
document.getElementById("recieve").addEventListener('click', (e) => {
	openURL("https://www.redstoneonline.jp/qna/main");
});
document.getElementById("top").addEventListener('click', (e) => {
	openURL("https://www.redstoneonline.jp/");
});



//ボタンのイベント---------------------------------------
function openURL(url){
	chrome.tabs.query({active : true}, (tabs) => {
		chrome.tabs.sendMessage(tabs[0].id, url);
		window.close();
	});
}

function acc_new(){
	//クッキー中のセッションIDを削除する
	chrome.tabs.query({active : true}, (tabs) => {
		chrome.tabs.sendMessage(tabs[0].id, "ace");
	});
	chrome.tabs.query({active : true}, (tabs) => {
		chrome.tabs.sendMessage(tabs[0].id, "login");
	});
}

//アカウント削除処理
function acc_delete(){
	var acclist = document.accform.acc_list;
	//何も選択していなければ
	if(acclist.selectedIndex== -1){
		return;
	}
	chrome.storage.sync.get(["IDs"], function(items) {
		var accounts = items.IDs.trim().split("\n");
		var pName = accounts[acclist.selectedIndex].split("&souei&")[0];
		var result = confirm("「"+pName+"」を本当に削除しますか？\n(削除前にRedStoneページよりログアウトすることをお勧めします)");
		if(result){
			var newIDs = items.IDs.replace(accounts[acclist.selectedIndex],"").replace("\n\n", "\n");
			chrome.storage.sync.set({"IDs": newIDs.trim() + "\n"},function(){
				alert("削除しました");
				location.reload(true);
				chrome.tabs.query({active : true}, (tabs) => {
					chrome.tabs.sendMessage(tabs[0].id, "reload");
					window.close();
				});
			});
		}
	});
}

//アカウント変更処理
function acc_change(){
	//クッキー中のセッションIDを削除して新しく登録し直す
	chrome.tabs.query({active : true}, (tabs) => {
		chrome.tabs.sendMessage(tabs[0].id, "ace");
	});
	var acclist = document.accform.acc_list;
	//何も選択していなければ
	if(acclist.selectedIndex == -1){
		return;
	}
	var selected = acclist.options[acclist.selectedIndex].value;
	chrome.tabs.query({active : true}, (tabs) => {
		chrome.tabs.sendMessage(tabs[0].id, "set&souei&"+selected);
		window.close();
	});
}

//値の取得
function w_load(){

	chrome.tabs.query({active : true}, (tabs) => {
		if(!tabs[0].url.match("https://www.redstoneonline.jp/*")){
			let avabtn = "";
			//httpページを開いている時だけ「RED STONE公式ページを開く」ボタンを表示する
			if(tabs[0].url.split(":")[0] == "http" || tabs[0].url.split(":")[0] == "https"){
				avabtn = '<br><input type="button" value="RED STONE公式HPを開く" id="openAVAHP">';
			}
			//さあREDSTONEしようのオーバーレイ
			document.getElementsByTagName('body')[0].insertAdjacentHTML('beforeend', '<div id="fullOverlay"><br><h1>れぷらす</h1>この拡張機能は<br>RED STONE公式サイト以外では<br>動作しません' + avabtn + '</div>');
			if(tabs[0].url.split(":")[0] == "http" || tabs[0].url.split(":")[0] == "https"){
				//「RED STONE公式ページを開く」ボタンのイベント
				document.getElementById("openAVAHP").addEventListener('click', (e) => {
					openURL("https://www.redstoneonline.jp/");
				});
			}
		}
	});
	
	chrome.storage.sync.get(["IDs"], function(items) {
		var accounts = items.IDs.split("\n");
		chrome.tabs.query({active : true}, (tabs) => {
			chrome.tabs.sendMessage(tabs[0].id, "name", function (response) {
				accounts.forEach(element => {
					var accdata = element.split("&souei&");
					if(accdata[0] != ""){
						var additional = ""
						if(response == accdata[0]){
							additional = ' style="color:blue"'; //アクティブなIDなら青色表示
						}
						document.getElementById('accounts').insertAdjacentHTML('beforeend', '<option value="' + accdata[1] + '&souei&' +accdata[2] + '"' + additional + '>' + accdata[0] + '</option>');
					}
				});
			});
		});
	});
}

//ページ表示時に値を読み込む
w_load();
