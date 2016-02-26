function fromFlash(flash){
  //console.log(flash.toString());
  var x2js = new X2JS();
  var flashData = x2js.xml_str2json(flash.toString());
  //console.log('flashData',flashData);
  if(flashData.user_listing !== undefined){
    console.log(flashData.user_listing);
	chatPorts.forEach(function(v){
	  v.postMessage({type:'userList',data:flashData.user_listing.user});
    });
  } else if(flashData.user_enter !== undefined){
    chatPorts.forEach(function(v){
	  v.postMessage({type:'userConnect',data:flashData.user_enter});
	});
  } else if(flashData.user_exit !== undefined){
    chatPorts.forEach(function(v){
	  v.postMessage({type:'userDisconnect',data:flashData.user_exit});
	});
  } else if(flashData.msg_in!== undefined){
    chatPorts.forEach(function(v){
	  v.postMessage({type:'message',data:flashData.msg_in});
	});
  } else if(flashData.shout_in !== undefined){
    //console.log('shout_in');
    chatPorts.forEach(function(v){
	  v.postMessage({type:'modMsg',data:flashData.shout_in});
	});
  } else if(flashData.whisper_in !== undefined){
    chatPorts.forEach(function(v){
	  v.postMessage({type:'whisper',data:flashData.whisper_in});
	});
  } else if(flashData.broadcast_in !== undefined){
    chatPorts.forEach(function(v){
	  v.postMessage({type:'chatData',data:flashData.broadcast_in});
	});  
  } else
    console.log(flash);
}
