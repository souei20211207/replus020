//20250119 ver.0.06
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
	openURL("https://www.redstoneonline.jp/event/redslogin");
});
document.getElementById("recieve").addEventListener('click', (e) => {
	openRoulette();
});
document.getElementById("top").addEventListener('click', (e) => {
	openURL("https://www.redstoneonline.jp/");
});
document.getElementById("roulette").addEventListener('click', (e) => {
	openURL("https://www.redstoneonline.jp/event/roulette");
});

//ボタンのイベント---------------------------------------
function openURL(url){
	chrome.tabs.query({active : true}, (tabs) => {
		chrome.tabs.sendMessage(tabs[0].id, url);
		window.close();
	});
}

function acc_new(){
	var souei=document.getElementById("souei");
	souei.innerHTML="";
	souei.style="width:300px";
	var btn = document.createElement('p');
	btn.innerHTML="<input type='button' value='登録' id='add' style='width:100%'>";
	souei.prepend(btn);
	var idpassform = document.createElement('table');
	var naiyou="<tr><td style='width:30%'>ID:</td><td style='width:70%'><input id='idvalue' type='text'></td></tr>";
	naiyou=naiyou+"<tr><td style='width:30%'>PASS:</td><td style='width:70%'><input id='passvalue' type='password'></td></tr>";
	idpassform.innerHTML=naiyou;
	souei.prepend(idpassform);
	document.getElementById("add").addEventListener('click', (e) => {
		chrome.storage.sync.get(["IDs"], function(items) {
			var accounts = items.IDs.trim().split("\n");
			var pName = document.getElementById("idvalue").value;
			var pPass = document.getElementById("passvalue").value;
			if(accounts.indexOf(pName+"&souei&"+pPass)==-1){
				chrome.storage.sync.set({"IDs": items.IDs+pName+"&souei&"+pPass+"\n"},function(){
					var accounts2=(items.IDs+pName+"&souei&"+pPass+"\n").trim().split("\n");
					chrome.storage.sync.set({"count":String(accounts2.indexOf(pName+"&souei&"+pPass)+1)});
					alert("「"+pName+"」を登録しました。");
					chrome.tabs.query({active : true}, (tabs) => {
						chrome.tabs.sendMessage(tabs[0].id, "login&souei&"+pName+"&souei&"+pPass);
						window.close();
					});
				});
			}else{
				alert("「"+pName+"」はすでに登録済みです。");
			};
		});
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
		var result = confirm("「"+pName+"」を本当に削除しますか？");
		if(result){
			var newIDs = items.IDs.replace(accounts[acclist.selectedIndex],"").replace("\n\n", "\n");
			chrome.storage.sync.set({"IDs": newIDs.trim() + "\n"},function(){
				alert("削除しました。");
				window.close();
			});
		}
	});
}

//アカウント変更処理
function acc_change(){
	var acclist = document.accform.acc_list;
	//何も選択していなければ
	if(acclist.selectedIndex == -1){
		return;
	}
	chrome.storage.sync.set({"count":String(acclist.selectedIndex+1)});
	chrome.tabs.query({active : true}, (tabs) => {
		chrome.tabs.sendMessage(tabs[0].id, "login&souei&"+acclist.options[acclist.selectedIndex].value);
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
						document.getElementById('accounts').insertAdjacentHTML('beforeend', '<option value="' + accdata[0] + '&souei&' +accdata[1] + '"' + additional + '>' + accdata[0] + '</option>');
					}
				});
			});
		});
	});
}

function openRoulette(){
    chrome.tabs.query({active : true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, "roulette");
        window.close();
    });
}

function openRoulette2(){
    chrome.tabs.query({active : true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, "roulette2", function (response) {
            if(response=="yes" || tabs[0].url=="https://www.redstoneonline.jp/event/roulette"){
                document.getElementById("roulette").style.display = "block";
            }
        });
    });
}

//ページ表示時に値を読み込む
w_load();
openRoulette2();
