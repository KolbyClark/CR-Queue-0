if(window.location.toString().indexOf("swf")==-1)
  chrome.runtime.sendMessage({text:"test"});
else
  window.addEventListener("keyup", keyListener, false);



function keyListener(e) {
  // Must press ctrl key to validate.
  if (e.keyCode ==122) {
    chrome.runtime.sendMessage({text:"getState"},function(resp){
	if(resp){
      chrome.runtime.sendMessage({text:"key"});
	}
	});
  }
}