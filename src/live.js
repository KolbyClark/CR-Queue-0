var liveStream = $('#template_container');
var bannedUsers=[];
var users = [];
var inacUsers = [];
var modChat = [];
var uniqueUsers = [];
var modView = false;
var chatData = "";
var view =0;
var maxViewers = 0;
//liveStream.find('img').css('display','inline');

if($('param[name=flashvars]').length>0){

liveStream.prepend('<div id="userBox" style="width:130px;height:400px;display:inline;float:right;margin-right:-135px;margin-top:42px;"><select id="userCont" multiple="multiple" style="width:130px;height:350px;display:block"></select><input type="button" id="banButton" value="Ban" style="margin-top:5px;padding: 0 5px;"></input><input type="button" id="unbanButton" value="Unban" style="margin-top:5px;padding: 0 5px;display:none;"></input><input type="button" id="ipBanButton" value="IPBan" style="margin: 5px 0 0 5px;padding: 0 5px;"></input><input type="button" id="viewButton" value="View" style="margin-top:5px;padding:0 5px;"></input><input type="button" id="profileButton" value="Profile" style="padding: 0 5px;margin: 5px 0 0 5px;"></input><input type="button" id="banlist" value="BanList" style="margin-top:5px;padding: 0 5px;"></input><input type="button" id="userlist" value="UserList" style="margin-top:5px;padding: 0 5px;display:none;"></input><!--<input type="button" id="modChat" value="ModChat" style="margin:5px 5px 5px 0;padding:0 5px;"></input--><input type="button" id="chatSearch" value="Search" style="padding: 0 5px;margin: 5px 0 0 5px;"></input><input type="button" id="dumpButton" value="Dump" style="margin-top:5px;padding:0 5px;"></input><br /><br /><span id="userCount">Number of users: </span>');
$('#top_container').after('<textarea id="messageBox" style="display:block"></textarea><input type="text" id="msgInput" style="width:653px;display:none;"></input><input type="button" value="Send" id="sendMsg" style="padding:0 5px;margin:5px;display:none;"></input>');
$('#messageBox').css({width:'703px',height:'115px',margin:0,display:'none'});
$('#banButton').click(function(){
  $('#userCont').find(':selected').each(function(){
    chrome.runtime.sendMessage({text:'chatBan',user:$(this).val()});
	var temp = {};
	temp.name = $(this).val();
	users.forEach(function(v,i,a){
	  if(v.username == temp.name){
	    temp.messages = v.messages.slice();
		temp.userId = v.userId;
		temp.isMod = v.isMod;
		a.splice(i,1);
	  }
	});
	bannedUsers.push(temp);
	$(this).remove();
  });
});
$('#ipBanButton').click(function(){
  $('#userCont').find(':selected').each(function(){
    chrome.runtime.sendMessage({text:'chatIPBan',user:$(this).val()});
	var temp = {};
	temp.name = $(this).val();
	users.forEach(function(v,i,a){
	  if(v.username == temp.name){
	    temp.messages = v.messages.slice();
		temp.userId = v.userId;
		temp.isMod = v.isMod;
		a.splice(i,1);
	  }
	});
	bannedUsers.push(temp);
	$(this).remove();
  });
});
$('#unbanButton').click(function(){
  $('#userCont').find(':selected').each(function(){
    chrome.runtime.sendMessage({text:'chatUnban',user:$(this).val()});
	var temp = $(this).val();
	bannedUsers.forEach(function(v,i,a){
	  if(v.name == temp)
	    a.splice(i,1);
	});
	$(this).remove();
  });
});
$('#banlist').click(function(){
  view = 1;
  $('#userCont option').remove();
  bannedUsers.forEach(function(v){
    $('#userCont').append('<option value="'+v.name+'">'+v.name+'</option>');
  });
  $('#banlist,#userlist,#banButton,#unbanButton').toggle();
  sortUsers();
});
$('#userlist').click(function(){
  view = 0;
  $('#userCont option').remove();
  users.forEach(function(v){
    if(v.isMod==1)
	  $('#userCont').prepend('<option value="'+v.username+'" style="color:rgb(247, 140, 37)">'+v.username+'</option>');
	else
	  $('#userCont').append('<option value="'+v.username+'">'+v.username+'</option>');
  });
  $('#banlist,#userlist,#banButton,#unbanButton').toggle();
  sortUsers();  
});

$('#viewButton').click(function(){
  var selectedUser = $('#userCont').find(':selected').first().val();
  var msgStr = "";
  users.forEach(function(v){
    if(v.username == selectedUser)
	  msgStr = v.messages.join('\n');
  });
  $('#messageBox').val(msgStr);
  $('#messageBox').toggle();
  $('#msgInput,#sendMsg').hide();
  modView = false;
});
$('#profileButton').click(function(){
  var selectedUsers = $('#userCont').find(':selected');
  var urls = [];
  selectedUsers.each(function(v){
    urls.push("http://www.crunchyroll.com/user/"+this.value);
  });
  chrome.runtime.sendMessage({text:'openTabs',urls:urls});
  
});
$('#modChat').click(function(){
  if(modChat.length>0)
    var tempStr = modChat.join('\n')+'\n';
  if($('#messageBox:visible').length > 0)
    $('#msgInput,#sendMsg').hide();
  else
    $('#msgInput,#sendMsg').show();
  $('#messageBox').toggle().val(tempStr);
  if($('#messageBox:visible').length > 0)
    modView = true;
  else
    modView = false;
});
$('#chatSearch').click(function(){
  var searchTerm = prompt('Search for:');
  var searchUsers = [];
  for(var x=0;x<users.length;x++){
    for(var y=0;y<users[x].messages.length;y++){
      if(users[x].messages[y].toLowerCase().indexOf(searchTerm)>-1)
        searchUsers.push(users[x].username);
    }
  }
  console.log(searchUsers);
  $('#userCont').val(searchUsers);
});
$('#msgInput').keyup(function(e){
  if(e.keyCode == 13)
    $('#sendMsg').click();
});
$('#sendMsg').click(function(){
  if($('#msgInput').val() != ''){
    shoutMessage($('#msgInput').val());
	$('#msgInput').val('');
  }
});
$('#dumpButton').click(function(){
  var msgs = users.concat(inacUsers);
  var msgs = msgs.concat(bannedUsers);
  msgs=JSON.stringify(msgs);
  $('#messageBox').val(msgs);
  $('#messageBox').toggle();
  document.getElementById("messageBox").select()
});

function sortUsers(){
  var toSort = $('#userCont option').filter(function(){return $(this).attr('style')===undefined;})
  toSort.sort(function(a,b){if(a.value.toLowerCase()>b.value.toLowerCase())return 1;if(a.value.toLowerCase()<b.value.toLowerCase())return -1; return 0;})
  toSort.detach();
  $('#userCont').append(toSort);
  $('#userCount').text('Number of users: '+users.length);
  if(users.length > maxViewers){
    maxViewers = users.length;
  }
}
var port;



chrome.runtime.onConnect.addListener(function(p){
  port = p;
  port.onMessage.addListener(function(msg){
    switch(msg.type){
	  case "userList":
	    console.log(msg);
	    msg.data.forEach(function(v){
		  var temp = {};
		  temp.username = v.name;
		  temp.userId = v.id;
		  temp.isMod = v.is_mod;
		  users.forEach(function(va,i,a){
		    if(va.username == temp.username){
		      a.splice(i,1);
			  $('option[value='+temp.username+']').remove();
			}
		  });
	      if(v.is_mod==1){
	        if(view==0)
			  $('#userCont').prepend('<option value="'+v.name+'" style="color:rgb(247, 140, 37)">'+v.name+'</option>');
		  }else{
			if(view == 0)
			  $('#userCont').append('<option value="'+v.name+'">'+v.name+'</option>');
		  }
		  if(uniqueUsers.indexOf(v.username)==-1)
		    uniqueUsers.push(v.username);
		  //temp.el = $('option[value='+v.name+']');
		  temp.messages = [];
		  users.push(temp);
		});
		sortUsers();
	    break;
	  case "userConnect":
	    var temp = {};
		temp.username = msg.data.user_name;
		temp.userId = msg.data.user_id;
		temp.isMod = msg.data.is_mod;
		var asdf = true;
		for(var x=0;x<users.length;x++){
		  if(users[x].username == temp.username){
		    asdf = false;
			break;
		  }
		}
		for(var y=0;y<inacUsers.length;y++){
		  if(inacUsers[y].username==temp.username){
		    if(msg.data.is_mod==1){
	          if(view == 0)
		        $('#userCont').prepend('<option value="'+msg.data.user_name+'" style="color:rgb(247, 140, 37)">'+msg.data.user_name+'</option>');
	        }
			else{
			  if(view == 0)
			    $('#userCont').append('<option value="'+msg.data.user_name+'">'+msg.data.user_name+'</option>');
		    }
            temp.messages = inacUsers[y].messages.slice(0);
			users.push(temp);
			inacUsers.splice(y,1);
			asdf = false;
			break;
		  }
		}
		if(asdf){
		  if(msg.data.is_mod==1){
	        if(view == 0)
		      $('#userCont').prepend('<option value="'+msg.data.user_name+'" style="color:rgb(247, 140, 37)">'+msg.data.user_name+'</option>');
			//sendData();
	      }
	      else{
			if(view == 0)
			  $('#userCont').append('<option value="'+msg.data.user_name+'">'+msg.data.user_name+'</option>');
		  }
		  temp.messages = [];
		  users.push(temp);
		}
		if(uniqueUsers.indexOf(msg.data.user_name)==-1)
		  uniqueUsers.push(msg.data.user_name);

        sortUsers();		
	    break;
	  case "userDisconnect":
	    if(view == 0)
	      $('option[value='+msg.data.user_name+']').remove();
		else
		  $(userlist).find('option[value='+msg.data.user_name+']').remove();
		for(var x=0;x<users.length;x++){
		  if(users[x].username == msg.data.user_name){
		    inacUsers= inacUsers.concat(users.splice(x,1));
			break;
		  }
		}
		$('#userCount').text('Number of users: '+users.length);
		break;
	  case "message":
	    //console.log(msg.data);
	    users.forEach(function(v){
		  if(msg.data.user_name == v.username)
		    v.messages.push(msg.data.msg);
		});
		break;
	  case "modMsg":
	    //console.log('modMsg in');
        var tempStr = msg.data.user_name + ':\t'+msg.data.msg;
        modChat.push(tempStr);
        if(modView){
          $('#messageBox').val($('#messageBox').val() + tempStr + '\n');
		  $('#messageBox').scrollTop($('#messageBox')[0].scrollHeight);
        }
        break;
      case "chatData":
	    console.log(msg);
        chatData+= msg.data.msg;
        try{
          var temp = JSON.parse(chatData);
		  receiveData(temp);
        }catch(err){}
		break;
	  default:
	    console.log(msg);
		break;
	}
  });
});
var flashvars = $('param[name=flashvars]').val().split('&');
var flashObj = {};
flashvars.forEach(function(v,a,i){
  var temp = v.split('=');
  flashObj[temp[0]] = temp[1];
});

chrome.runtime.sendMessage({text:'connectChat',user:flashObj.userName,token:flashObj.token,tokenTime:flashObj.tokenTime});
chrome.runtime.sendMessage({text:'openPort',portName:'chatPort-'+flashObj.userName});
}
function shoutMessage(text){
  chrome.runtime.sendMessage({text:'chatModMessage',msg:text});
}
function sendData(){
  var temp = {bannedUsers:bannedUsers,users:users,modChat:modChat};
  temp = JSON.stringify(temp);
  for(var x = 0;x<Math.ceil(temp.length/10000);x++){
    if((x*10000)+10000<temp.length){
      chrome.runtime.sendMessage({text:'chatDataMessage',msg:temp.substring(x*10000,(x*10000)+10000)});
	  //console.log(temp.substring(x*10000,(x*10000)+10000));
	}else{
	  chrome.runtime.sendMessage({text:'chatDataMessage',msg:temp.substring(x*10000)});
	  //console.log(temp.substring(x*10000));
	}
  }
}
function receiveData(data){
  bannedUsers = data.bannedUsers.concat(bannedUsers);
  modChat = data.modChat.concat(modChat);

  for(var x = 0;x<users.length;x++){
    for(var y = 0; y<data.users.length;y++){
	  if(x.userId == y.userId){
	    x.messages = y.messages.concat(x.messages);
	  }
	}
  }
  chatData = "";
}
function kickall(){
  chrome.runtime.sendMessage({text:'kickAll',users:users});
}