var enable = false;
var past = "";
var watchList = [];
var watchedForums = [];
var watchedThreads = [];
var watchedComments = [];
var origin= "";
var badges = [];
var updatedThreads = [];
var blockedUsers = [];
var numNotif = 0;
var debug = false;
var hotkey = false;
var forumPorts = [];
var threadPorts = [];
var chatPorts = [];
var threadNetworkStack = [];
var commentNetworkStack = [];
var darkForum = false;
var isMod = false;
var seamless = false;
var siteNews = false;
var watchComments = false;
var modReports = [];
var webm = true;
var siteNewsList = [];
var blacklist = [];
var markWatch = true;
var initd = false;
var richNotif = false;
var richNotifs = [];
var chatBannedUsers = [];
var exid;
var isDev = false;
//var socket = io.connect("http://nodetest-beardfist.rhcloud.com/");
var threadSpamFilter = ["ＧTＡ７４.cｏｍ","Ｔｅｘ５６.Ｃｏｍ"];
//var hackedUserFilter = ["weeaboo","nigger"];
chrome.runtime.onInstalled.addListener(initialize);
chrome.runtime.onStartup.addListener(initialize);
/*chrome.alarms.onAlarm.addListener(function(alarm){
  switch(alarm.name){
    case "watchMod":
	  watchModReports();
	  break;
	case "watchThreads":
	  watchThreads();
	  break;
	case "watchForum":
	  watchForum();
	  break;
	case "getToken":
	  getToken();
	  break;
	case "getNotif":
	  getNotifications();
	  break;
	default:
	  break;
  }
});*/
function initialize(){
  if(!initd){
  chrome.storage.local.get(['enabled','watched','forums','threads','comments','blockedUsers','hotkey','darkForum','seamless','webm','siteNews','siteNewsList','blacklist','markWatch','watchComments','richNotif'], function(items){
     if(items.enabled === undefined)
       chrome.storage.local.set({'enabled' : enable});
     else
       enable = items.enabled;
     if(items.watched === undefined)
       chrome.storage.local.set({'watched' : watchList});
     else
       watchList = items.watched;
     if(items.forums === undefined)
       chrome.storage.local.set({'forums'  : watchedForums});
     else
       watchedForums = items.forums;
     if(items.threads === undefined)
       chrome.storage.local.set({'threads' : watchedThreads});
     else
       watchedThreads = items.threads;
	 if(items.comments === undefined)
	   chrome.storage.local.set({'comments' : watchedComments});
	 else
	   watchedComments = items.comments;
     if(items.blockedUsers === undefined)
       chrome.storage.local.set({'blockedUsers' : blockedUsers});
     else
       blockedUsers = items.blockedUsers;
     if(items.darkForum === undefined)
       chrome.storage.local.set({'darkForum' : darkForum});
     else
       darkForum = items.darkForum;
	 if(items.seamless === undefined)
	   chrome.storage.local.set({'seamless': seamless});
	 else
	   seamless  = items.seamless;
	 if(items.webm === undefined)
	   chrome.storage.local.set({'webm': webm});
	 else
	   webm = items.webm;
	 if(items.siteNews === undefined)
	   chrome.storage.local.set({'siteNews':siteNews});
	 else
	   siteNews = items.siteNews;
	 if(items.siteNewsList === undefined)
	   chrome.storage.local.set({'siteNews':siteNewsList});
	 else
	   siteNewsList = items.siteNewsList;
	 if(items.blacklist === undefined)
	   chrome.storage.local.set({'blacklist':blacklist});
	 else
	   blacklist = items.blacklist;
	 if(items.markWatch === undefined)
	   chrome.storage.local.set({'markWatch':markWatch});
	 else
	   markWatch = items.markWatch;
	 if(items.watchComments === undefined)
	   chrome.storage.local.set({'watchComments':watchComments});
	 else
	   watchComments = items.watchComments;
	 if(items.richNotif === undefined)
	   chrome.storage.local.set({'richNotif':richNotif});
	 else
	   richNotif = items.richNotif;

	 
     setBrowserAction();
	 checkMod();
	 getToken();
	 exid = chrome.runtime.getURL('').split('/')[2];
	 if(exid == "fphkfcecnnchmlfaaldpfcpjlmbbmfgk")
	   isDev = true;
	 /*chrome.alarms.create("watchThreads",{periodinMinutes:1});
	 chrome.alarms.create("watchForum",{periodinMinutes:2});
	 chrome.alarms.create("getToken",{periodinMinutes:5});
	 chrome.alarms.create("getNotif",{periodinMinutes:1});*/
     setInterval(function(){watchThreads()},45000);
     setInterval(function(){watchForum()},119000);
     setInterval(function(){getToken()}, 300000);
     setInterval(function(){getNotifications()}, 60000);
	 setInterval(function(){processThreadStack()},2000);

  });
  initd=true;
  }
}
if(!initd){
  initialize();
}
$.ajaxSetup({
  dataFilter: function (response) {
    return response.replace("//ssl.gstatic.com/","http://ssl.gstatic.com/");
  }
});

function checkMod(){
  /*chrome.cookies.get({name:'c_mod_modes',url:'http://www.crunchyroll.com'},function(cookie){
    if(cookie != null){
	  //console.log(cookie);
      isMod = true;
	  //chrome.alarms.create("watchMod",{when:Date.now(),periodInMinutes:1});
	  watchModReports();
	  setInterval(function(){watchModReports()},60000);
	}
  });*/
  $.get("http://www.crunchyroll.com/modactions",function(data){
    isMod = true;
	watchModReports();
	setInterval(function(){watchModReports()},60000);
  });
}
function watchModReports(){
  var url = 'http://www.crunchyroll.com/modreport';
  $.get(url, function(data, textStatus, jqXHR){
   modReports = [];   
   if($('div.blank',data).length == 0){
	  $('table.modreport>tbody>tr:not(:first-child)', data).each(function(){
	    modReports.push($(this, data).find('td:first-child').text());
	  });
	  addThreadNotification();
	}
	if(isDev){
	  $('table.modreport tr td:nth-child(3)',data).filter(function(){return $(this).text().toLowerCase().includes("spam");}).each(function(){
        $(this).next().find('a').each(function(){
          var reg = /lor+a+\d+/g;
          if(reg.test($(this).text())){
            chrome.runtime.sendMessage({text:"nukeUser",user:$(this).text()});
            console.log($(this).text());
          }
        });
      });
	}
  });
}

function mergePosts(mergeIds,sendResponse){
	var mergeTo = mergeIds[0];
	var postString = "fail_url=%2Feditforumpost%3Fid%3D"+mergeTo+"&fpid="+mergeTo+"&formname=RpcApiForum_EditPost&body=";
	var body = "";
	mergeIds.forEach(function(v,i,a){
		$.ajax({
			url: "http://www.crunchyroll.com/editforumpost?id="+v,
			type: "GET",
			async: false,
			success: function(data,s,j){
			  body += $('#body',data).serialize().substring(5);
			  body +="%0D%0A%0D%0A";
			}
		});
	});
	postString+=body;
	$.ajax({
		url: "http://www.crunchyroll.com/?a=formhandler",
		type: "POST",
		async: false,
		data: postString,
		success: function(data, s, j){
			var htmlData = $('#fp_main_'+mergeTo+' div.showforumtopic-message-contents-text',data).html();
			mergeIds.splice(0,1);
			var datas = {req: 'RpcApiForum_DeletePost','id_list[]': mergeIds};
			$.ajax('http://www.crunchyroll.com/ajax/', {
				type: 'post',
				data: datas,
				success: function(dataa){
					sendResponse({html:htmlData});
				}
			});
		}
	});
}
function setBrowserAction(){
  if(enable)
    chrome.browserAction.setIcon({path:"on.png"});
  else
    chrome.browserAction.setIcon({path:"off.png"});
}


function watchForum() {
  chrome.storage.local.get('forums', function(items){
    if(items.forums){
      watchedForums = items.forums;
      watchedForums.forEach(function(value){
        checkForum(value.forumId);
      });
    }
  });
}

function getForum(sendResponse){
  chrome.storage.local.get('forums', function(items){
    if(items.forums){
      if(debug)
        console.log("sending forums: " + items.forums);
      sendResponse(items.forums);
    }
    
  });
}

function addForum(forumId, name){
  chrome.storage.local.get('forums', function(items){
    watchedForums = items.forums;
    watchedForums.push({forumId:forumId,name:name});
    chrome.storage.local.set({'forums'  : watchedForums});
    watchForum();
  });
}
function removeForum(forumId){
    watchedForums.forEach(function(v,i,a){
      if(v.forumId == forumId)
        watchedForums.splice(i,1);
    });
}
function updateForumList(){
  chrome.storage.local.set({'forums'  : watchedForums});
  watchForum();
}
function checkForum(num){
  //console.log("Checking forum: " + num);
  var url = "http://www.crunchyroll.com/forumcategory-" + num;
  $.get(url, function(data){
    var newThreads = [];
    $('.widget-forumcategory-display-lastaction div:first-child', data).each(function(){
      if((this.innerText.indexOf('minute') > -1&&parseInt(this.innerText) <= 3)||this.innerText.indexOf('second') > -1){ 
        var name = $(this).parents('tr').find('div.widget-forumcategory-display-nomod>a').text();
        var threadId = $(this).parents('tr')[0].id.split('_')[1];
		var parent = $(this).parents('tr');
		parent.find('form,script').remove();
        var parentId = parent[0].id;
        var innerParent = parent[0].innerHTML;
		if(isDev&&num!=1){
		  for(var x=0;x<threadSpamFilter.length;x++){
		    if(name.includes(threadSpamFilter[x])||charAverage(name)>10000){
			  //do stuff here
			  var username = $(this).parents('tr').find('td>a.medium').text();
              nukeUser(username);
			  lockThread(threadId);
			  break;
			}
		  }
		 /* for(var x=0;x<HackedUserFilter.length;x++){
		    if(name.toLowerCase().includes(hackedUserFilter[x])){
			  var username = $(this).parents('tr').find('td>a.medium').text();
			  var userId = getUserId(username);
			  banUser(userId);
			  lockThread(threadId);
			}
		  }*/
		}else if(num==1&&siteNews&&siteNewsList.length>0){
		  if(siteNewsList.indexOf(threadId)==-1&&blacklist.indexOf(threadId)==-1){
            addThread(threadId,2,name);
			updateSiteNews(threadId);
			newThreads.push({html:innerParent,'threadId':threadId,parentId:parentId,name:name});
		  }
		}else if(blacklist.indexOf(threadId)==-1){
		  addThread(threadId,2,name);
		  newThreads.push({html:innerParent,'threadId':threadId,parentId:parentId,name:name});
        }
        
      }
    });
    newThreads.reverse();
    forumPorts.forEach(function(v,i,a){
      if(v.name.indexOf("forum-")>-1&&v.name.split('-')[1]==num.toString()){
        v.postMessage(newThreads);
      }
    });
  });
}

function getToken() {
  chrome.cookies.getAll({url:'http://www.crunchyroll.com/'},function(data){
   $.get("http://www.crunchyroll.com/newprivatemessage",data, function(data){
     var form_info = $('#RpcApiPm_SendPms', data).serializeArray();
     origin = form_info[2].value;
     chrome.storage.local.set({'origin' : origin});
   });
  });
}


function getNotifications() {

  chrome.cookies.getAll({url:'http://www.crunchyroll.com'},function(data){
    $.get("http://www.crunchyroll.com/en/about/news",data, function(response,status,jqXHR){
      var notif = $('.user-notification-badge', response);
      chrome.browserAction.getBadgeText({},function(result){
        if(notif.length > 0){
          
          if(notif.text().trim() != result){
            badges = [];
            $('.has-num span.right', response).each(function(){
              var name = $(this).prev().text();
              var badgeNum = $(this).text();
              var temp = {'name':name, 'num':badgeNum};
              badges.push(temp);
              //console.log(JSON.stringify(badges));
            });
            setNotificationBadge(notif.text().trim());
          }
        }
        else if(result.length > 0){
          badges = [];
          numNotif = 0;
          addThreadNotification();
          
        }
      });       
    });
  });
}

function getBadge(){
  var threads = true;
  var reports = true;
  badges.forEach(function(v,i,a){
    if(v.name == 'Thread'){
      if(updatedThreads.length > 0)
        v.num = updatedThreads.length;
      else
        a.splice(i,1);
      threads = false;
    }
	if(v.name == 'modReport'){
	  if(modReports.length > 0)
	    v.num = modReports.length;
	  else
	    a.splice(i,1);
	  reports = false;
	}
  });
  if(threads && updatedThreads.length>0)
    badges.push({'name':'Thread','num':updatedThreads.length});
  if(reports && modReports.length>0)
    badges.push({'name':'modReport','num':modReports.length});

  //console.log("asked for badges giving: "+JSON.stringify(badges));
  return badges;
}
function sortNotif(sendResponse){
  var url="http://www.crunchyroll.com/notifications";
  var notifications = [];
  chrome.cookies.getAll({url:'http://www.crunchyroll.com'},function(data){
    $.get(url,data, function(response,status,jqXHR){
      $('#notification-container h3',response).each(function(){
        var section = {};
        var temp = $(this).text().split(' ');
        var n = temp[2];
        temp.splice(0,3);
        section.name = temp.join(' ');
        //console.log("you have "+n+' '+temp);
        var content = [];
        $(this).parent().nextUntil('li:has(h3)').each(function(){
          var child = $(this).children()[0];
          if(child){
            var notif = {};
            notif.notifId = child.id.split('_')[1];
            var bodyCont = $(child).find('div.bodycontainer div.body');
            var aray = [];
            $(bodyCont).children('a').each(function(){
              if(this.href.indexOf('?from=memberstar') == -1)
                aray.push('http://www.crunchyroll.com' + this.pathname + this.search);
            });
            notif.links = aray;
            var tempAr = aray[0].indexOf('user/')+5;
            var userName = aray[0].substring(tempAr,aray[0].length);
            var currentUser = $(child).find('a:contains("your guest")');
            if(currentUser.length > 0)
              notif.cur = 'http://www.crunchyroll.com' + currentUser[0].pathname + currentUser[0].search;
            notif.user = userName;
            notif.cont = $(bodyCont).text();
            content.push(notif);
          }
        });
        section.cont = content;
        notifications.push(section);
      });
      //console.log(notifications);
      sendResponse(notifications);
    });
  });
}

function sortInbox(sendResponse){
  var url = "http://www.crunchyroll.com/inbox";
  var messages = [];
  chrome.cookies.getAll({url:'http://www.crunchyroll.com'},function(data){
    $.get(url,data, function(response,status,jqXHR){
      var read = {};
      read.name = 'read';
      var unread = {};
      unread.name = 'unread';
      var readMessages = [];
      var unreadMessages = [];
      $('#RpcApiPm_ManageInboxMessages tr',response).has('div.pm-new-name').each(function(){
        var message = {};
        message.name = $(this).find('div.pm-new-name').text();
        message.subject = $(this).find('span.pm-new-subject').text();
        message.smBody = $(this).find('span.pm-new-body').text();
        message.time = $(this).find('div.pm-new-time').text();
        message.messageId = $(this).find('input.pm-new').val();
        unreadMessages.push(message);
      });
      unread.content = unreadMessages;
      messages.push(unread);
      $('#RpcApiPm_ManageInboxMessages tr',response).has('div.pm-name').each(function(){
        var message = {};
        message.name = $(this).find('div.pm-name').text();
        message.subject = $(this).find('span.pm-subject').text();
        message.smBody = $(this).find('span.pm-body').text();
        message.time = $(this).find('div.pm-time').text();
        message.messageId = $(this).find('input.pm').val();
        readMessages.push(message);
      });
      read.content = readMessages;
      messages.push(read);
      //console.log(JSON.stringify(messages));
      sendResponse(messages);
    });
  });
}
function banUser(user,num){
  var d = new Date();
  if(num == 999){
    d.setTime(d.getTime()+64800000);
	var formData = "user_id="+user+"&req=RpcApiModerator_BanUser&expiry="+encodeURIComponent(d.toISOString().split('T').join(' ').split('.')[0])+"&msg=&perms%5B1%5D=1&perms%5B2%5D=2&perms%5B3%5D=3&perms%5B4%5D=4&perms%5B5%5D=5&perms%5B6%5D=6&perms%5B7%5D=7&perms%5B8%5D=8&perms%5B9%5D=9&perms%5B10%5D=10&perms%5B12%5D=12&perms%5B13%5D=1";
	$.post("http://www.crunchyroll.com/ajax/",formData).fail(function(){banUser(user,num)});
  }
}
function deleteUser(userId){
  var url = "http://www.crunchyroll.com/ajax/"
  var data = {req:"RpcApiUser_ModNukeUser",user_id:userId,hard:0};
  $.post(url,data).fail(function(){deleteUser(userId)});
}
function getUserId(user){
 var userId;
 $.ajax('http://www.crunchyroll.com/ajax/?req=RpcApiAutoComplete_Entity&type=3&prefix='+user,{async:false,success:function(data){
    data = JSON.parse(data.replace('/*-secure-','').replace('*/','').trim());
	userId = data.data[0].entity_id;
  }});
  return userId;
}
function deletePosts(username){
  var postIds = [];
  var url = "http://www.crunchyroll.com/userforumsearch?formname=user_search_form&username="+username;
  $.ajax(url,{async:false,success:function(data){
    $('input.multi_select_forum_post',data).each(function(){postIds.push(this.value)});
    if($('a[title=Last]',data).length>0){
	  var lastPage = parseInt($('a[title=Last]',data).get(0).href.split('=')[3]);
	  for(var x=1;x<=lastPage;x++){
	    $.ajax(url+"&pg="+x,{async:false,success:function(dat){
		  $('input.multi_select_forum_post',dat).each(function(){postIds.push(this.value)});
		}}).fail(function(){deletePosts(username)});
	  }
	}	
  }}).fail(function(){deletePosts(username)});
  if(postIds.length>0){
    var splitIds = [];
    while(postIds.length>150){
      splitIds.push(postIds.splice(0,150));
    }
    splitIds.push(postIds);
    var durl = "http://www.crunchyroll.com/ajax/?req=RpcApiForum_DeletePost";
    for(var x=0;x<splitIds.length;x++){
      durl = "http://www.crunchyroll.com/ajax/?req=RpcApiForum_DeletePost";
      for(var y=0;y<splitIds[x].length;y++){
	    durl+="&id_list%5B%5D="+splitIds[x][y];
      }
	  $.get(durl).fail(function(){deletePosts(username)});
    }
  }
}
function deleteComments(username){
  var commentIds = [];
  var url = "http://www.crunchyroll.com/usercommentsearch?formname=user_comment_search_form&username="+username;
  $.get(url,function(data){
    $('input.guestbook_comment',data).each(function(){commentIds.push(this.value)});
	var splitIds = [];
	while(commentIds.length>150){
      splitIds.push(commentIds.splice(0,150));
    }
	splitIds.push(commentIds);
	var durl = "http://www.crunchyroll.com/ajax/?req=RpcApiGuestbook_SoftRemoveComments";
    for(var x=0;x<splitIds.length;x++){
      durl = "http://www.crunchyroll.com/ajax/?req=RpcApiGuestbook_SoftRemoveComments&comment_ids="+splitIds[x][0];
      for(var y=1;y<splitIds[x].length;y++){
	    
	    durl+=","+splitIds[x][y];
	  }
	  $.get(durl).fail(function(){deleteComments(username)});
    }
  }).fail(function(){deleteComments(username)});  
}
function nukeUser(user){
    var userId = getUserId(user);
	banUser(userId,999);
    deletePosts(user);
    deleteComments(user);
	deleteUser(userId);
}
function lockThread(threadId){
  $.post('http://www.crunchyroll.com/?a=formhandler',"formname=RpcApiForum_LockTopic&ftid="+threadId+"&next_url=%2F&lock_and_close=1").fail(function(){lockThread(threadId)});
}
chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){

  switch(message.text){
  case "test":
    fullscreen(sender.tab);
    break;
  case "key":
    toggleBrowserAction(sender.tab);
    break;
  case "addWatch":
    sendResponse(addWatch(message.mediaId, message.episodes));
    break;
  case "remWatch":
    sendResponse(removeWatch(message.mediaId, message.episodes));
    break;
  case "getWatch":
    sendResponse(getWatch());
    break;
  case "markWatched":
    markWatched(message.mediaId,sendResponse);
	return true;
  case "markUnwatched":
    markUnwatched(message.mediaId,sendResponse);
	return true;
  case "resetWatch":
    resetWatch(message.mediaIds,sendResponse);
	return true;
  case "toggle":
    toggleBrowserAction(message.tabs[0]);
    break;
  case "check":
    checkThread(message.id);
    break;
  case "origin":
    sendResponse(getOrigin());
    break;
  case "notify":
    getNotifications();
    break;
  case "addThread":
    addThread(message.num,message.postnum,message.threadName);
    break;
  case "remThread":
    removeThread(message.threadId);
    updateThreadList();
    break;
  case "removeMultipleThreads":
    message.threads.forEach(function(v,i,a){
      removeThread(v);
    });
    updateThreadList();
    break;
  case "getThreads":
    sendResponse(getThreads());
    break;
  case "seenThread":
    seenThread(message.threadId);
    break;
  case "isActive":
    isActive(sender.tab.id,message.threadId);
    break;
  case "getUpThreads":
    sendResponse(updatedThreads);
    break;
  case "postReply":
    //console.log("posted a reply");
    setTimeout(function(){checkThread(message.threadId)}, 500);
    break;
  case "addForum":
    addForum(message.forumId,message.forumName);
    break;
  case "remForum":
    removeForum(message.forumId);
    updateForumList();
    break;
  case "removeMultipleForums":
    message.forums.forEach(function(v,i,a){
      removeForum(v);
    });
    updateForumList();
    break;
  case "getForum":
    getForum(sendResponse);
    return true;
  case "getBadge":
    sendResponse(getBadge());
    break;
  case "sortNotifications":
    sortNotif(sendResponse);
    return true;
  case "sortInbox":
    sortInbox(sendResponse);
    return true;
  case "getBlockedUsers":
    getBlockedUsers(sendResponse);
    return true;
  case "addBlockedUser":
    addBlockedUser(message.user);
    break;
  case "removeBlockedUsers":
    message.users.forEach(function(v,i,a){
      removeBlockedUser(v);
    });
    updateBlockedUsers();
    break;
  case "removeBlockedUser":
    removeBlockedUser(message.user);
    updateBlockedUsers();
    break;
  case "openPort":
    openPort(sender.tab, message.portName);
    break;
  case "closePort":
    closePort(message.port);
    break;
  case "setHotkey":
    setHotkey(message.hot);
    break;
  case "getHotkey":
    sendResponse(hotkey);
    break;
  case "getTheme":
    sendResponse(darkForum);
    break;
  case "setTheme":
    setTheme(message.theme);
    break;
  case "getSeamless":
    sendResponse(seamless);
	break;
  case "setSeamless":
    setSeamless(message.seamless);
	break;
  case "getMod":
    sendResponse(isMod);
	break;
  case "getReports":
    sendResponse(modReports);
	break;
  case "mergePosts":
    mergePosts(message.posts,sendResponse);
	return true;
  case "getWebm":
    sendResponse(webm);
	break;
  case "setWebm":
    setWebm(message.webm);
	break;
  case "getSiteNews":
    sendResponse(siteNews);
	break;
  case "setSiteNews":
    setSiteNews(message.siteNews);	
	break;
  case "setMarkWatch":
    setMarkWatch(message.markWatch);
	break;
  case "setWatchComments":
    setWatchComments(message.watchComments);
	break;
  case "setRichNotif":
    setRichNotif(message.richNotif);
	break;
  case "getOptions":
    sendResponse({threads:getThreads(),theme:darkForum,webm:webm,siteNews:siteNews,forums:watchedForums,blockedUsers:blockedUsers,blacklist:blacklist,markWatch:markWatch,watchComments:watchComments,richNotif:richNotif});
	break;
  case 'getBlacklist':
    sendResponse(blacklist);
	break;
  case 'addBlacklist':
    addBlacklist(message.threadId);
	break;
  case 'remBlacklist':
    remBlacklist(message.threadId);
	updateBlacklist();
	break;
  case 'remBlacklistMulti':
    console.log('removing blacklist multi',message);
    message.threads.forEach(function(v){
	  remBlacklist(v);
	});
	updateBlacklist();
	break;
  case 'connectChat':
    connectChat(message.user,message.token,message.tokenTime);
	break;
  case 'chatBan':
    chatBan(message.user);
	break;
  case 'chatUnban':
    chatUnban(message.user);
	break;
  case 'chatIPBan':
    chatIPBan(message.user);
	break;
  case 'chatModMessage':
    chatModMessage(message.msg);
	break;
  case 'chatDataMessage':
    chatDataMessage(message.msg);
	break;
  case 'kickAll':
    message.users.forEach(function(v){kickUser(v.username);});
	break;
  case 'openTabs':
    openTabs(message.urls);
	break;
  case 'findCommentPage':
    findCommentPage(message.commentId,message.gbId);
	break;
  case 'getState':
    getState(sender,sendResponse);
	return true;
  case 'nukeUser':
    nukeUser(message.user);
	break;
  default:
    break;
  }
  
});
function openPort(tab, portName){
  var port = chrome.tabs.connect(tab.id,{name:portName+"-"+tab.id});
  if(debug)
    console.log("Opening port: ", port);
  if(portName.indexOf("forum") > -1)
    forumPorts.push(port);
  else if(portName.indexOf("thread") > -1)
    threadPorts.push(port);
  else if(portName.indexOf("chat") > -1)
    chatPorts.push(port);
  port.onDisconnect.addListener(function(){
    console.log("Port disconnected: ", port);
    /*if(port.name.indexOf("forum") > -1){
      var i = forumPorts.indexOf(port);
      if(i > -1)
        forumPorts.splice(i,1);
    }
    else if(port.name.indexOf("thread") > -1){
      var i = threadPorts.indexOf(port);
      if(i > -1)
        threadPorts.splice(i,1);
    }
	else if(port.name.indexOf("chat") > -1){
      var i = chatPorts.indexOf(port);
      if(i > -1)
        chatPorts.splice(i,1);
    }*/
	closePort(port.name);
  });
}
function closePort(portName){
  //if(debug)
    console.log("closing port: " + portName);
  if(portName.indexOf("forum") > -1){
    forumPorts.forEach(function(v,i,a){
      if(v.name == portName){
        v.disconnect(); 
        forumPorts.splice(i,1);
      }
    });
  }
  else if(portName.indexOf("thread") > -1){
    threadPorts.forEach(function(v,i,a){
      if(v.name == portName){
        v.disconnect(); 
        threadPorts.splice(i,1);
      }
    });
  }
  else if(portName.indexOf("chat") > -1){
    chatPorts.forEach(function(v,i,a){
      if(v.name == portName){
        v.disconnect();
        //swfobject.getObjectById('xmlProxy').sendToFlash('logout',{});		
		$('#xmlProxy').replaceWith('<div id="xmlProxy"></div>');
        chatPorts.splice(i,1);
      }
    });
  }  
}
function getBlockedUsers(sendResponse){
  chrome.storage.local.get('blockedUsers',function(items){
    blockedUsers = items.blockedUsers;
    sendResponse(items.blockedUsers);
  });
}
function addBlockedUser(userName){
  chrome.storage.local.get('blockedUsers',function(items){
    blockedUsers = items.blockedUsers;
    if(blockedUsers.indexOf(userName) == -1){
      blockedUsers.push(userName);
      chrome.storage.local.set({'blockedUsers':blockedUsers});
	  var url = "https://www.crunchyroll.com/?a=formhandler&formname=RpcApiPm_BlockUser&name="+userName;
	  $.get(url);
    }
  });
}
function removeBlockedUser(userName){
    var n = blockedUsers.indexOf(userName);
	if(n>-1)
      blockedUsers.splice(n,1);
}
function updateBlockedUsers(){
  chrome.storage.local.set({'blockedUsers':blockedUsers});
}
function addBlacklist(threadId){
  chrome.storage.local.get('blacklist',function(items){
    blacklist = items.blacklist;
	if(blacklist.indexOf(threadId) == -1){
	  blacklist.push(threadId);
	  chrome.storage.local.set({blacklist:blacklist});
	}
  });
}
function remBlacklist(threadId){
  console.log('removing thread from blacklist',threadId);
  var n = blacklist.indexOf(threadId);
  if(n>-1)
    blacklist.splice(n,1);
}
function updateBlacklist(){
  chrome.storage.local.set({blacklist:blacklist});
}
function fullscreen(tab){
 if(tab.url.indexOf("crunchyroll.com") > -1 && tab.url.indexOf("episode-") > -1){
   if(enable && tab.url.indexOf("swf") == -1){
     chrome.windows.update(tab.windowId, {state:"fullscreen"});
     var url = tab.url;
     var n = url.lastIndexOf("-");
     var q = url.indexOf("?");
     if(q > -1){
       var vidId = url.substring(n+1,q);
       var time = url.substring(q+3,url.length);
     }
     else{
       var vidId = url.substring(n+1,url.length);
       var time = 0;
     }
     newUrl = "http://www.crunchyroll.com/swf/StandardVideoPlayer.swf?config_url=http%3A%2F%2Fwww.crunchyroll.com%2Fxml%2F%3Freq%3DRpcApiVideoPlayer_GetStandardConfig%26media_id%3D" + vidId +"%26video_format%3D0%26video_quality%3D0%26auto_play%3D1%26click_through%3D0%26start_time%3D"+time;
     chrome.tabs.update(tab.id, {url:newUrl});
   }
 }
 else if(!enable && tab.url.indexOf("swf") > -1){
    chrome.windows.update(tab.windowId, {state:"normal"});
    chrome.tabs.update(tab.id, {url:past});
 }
}
function toggleBrowserAction(tab){
  chrome.storage.local.get('enabled', function(items){
    enable=!items.enabled;
    chrome.storage.local.set({'enabled' : enable}, function(){
      if(enable){
        chrome.browserAction.setIcon({path:"on.png"});
        if(tab.url.indexOf("swf") ==-1 )
          past = tab.url;
      }
      else 
        chrome.browserAction.setIcon({path:"off.png"});
      fullscreen(tab);
    });
  });
}
function setHotkey(hot){
    hotkey = hot;
    chrome.storage.local.set({'hotkey':hotkey});
}
function setTheme(theme){
  darkForum = theme;
  chrome.storage.local.set({'darkForum' : darkForum});
}
function setAutostart(start){
  autostart = start;
  chrome.storage.local.set({'autostart' : start});
}
function setSeamless(seam){
  seamless = seam;
  chrome.storage.local.set({'seamless' : seam});
}
function setWebm(web){
  webm = web
  chrome.storage.local.set({'webm' : webm});
}
function setMarkWatch(watch){
  markWatch = watch;
  markWatch == 'true' ? markWatch = true : markWatch = false;
  chrome.storage.local.set({'markWatch':markWatch});
}
function setWatchComments(watch){
  watchComments = watch;
  chrome.storage.local.set({'watchComments':watchComments});
}
function setRichNotif(notif){
  richNotif = notif;
  chrome.storage.local.set({'richNotif':richNotif});
}
function setSiteNews(site){
  siteNews = site;
  chrome.storage.local.set({'siteNews' : siteNews});
  if(siteNews&&siteNewsList.length == 0)
    enumerateSiteNews();
}
function enumerateSiteNews(){
  $.ajax('http://www.crunchyroll.com/forumcategory-1/site-news',{"async":false,"success":function(data){
    var nextUrl = $('a.paginator-lite[title="Next"]',data);
    $('tr[id^="forumtopic_"]',data).not(':has(td>img[alt="locked"])').each(function(){var temp = $(this)[0].id.split('_')[1];siteNewsList.push(temp);});
    while(nextUrl.length > 0){
      var tempurl = "http://www.crunchyroll.com"+nextUrl[0].pathname+nextUrl[0].search;
      $.ajax(tempurl,{"async":false,"success":function(dat){
        $('tr[id^="forumtopic_"]',dat).not(':has(td>img[alt="locked"])').each(function(){var temp = $(this)[0].id.split('_')[1];siteNewsList.push(temp);});
        nextUrl = $('a.paginator-lite[title="Next"]',dat);
      }});    
    }
  }});
  chrome.storage.local.set({'siteNewsList':siteNewsList});
}
function updateSiteNews(id){
  siteNewsList.unshift(id);
  chrome.storage.local.set({'siteNewsList':siteNewsList});
}

function addWatch(mediaId, episodeIds){
  //alert(mediaId);
  if(markWatch&&episodeIds)
  episodeIds.forEach(function(v){
    var data = "req=RpcApiVideo_VideoView&media_type=1&cbcallcount=1&cbelapsed=30&playhead=3000&media_id=" + v;
    $.ajax("http://www.crunchyroll.com/ajax/",{async:false,data:data});
  });
  chrome.storage.local.get('watched', function(items){
    watchList = items.watched;
    if(watchList.indexOf(mediaId) == -1)
      watchList.push(mediaId);
    chrome.storage.local.set({'watched' : watchList});
    //alert(mediaId + " added, current list: " + watchList);
  });
  return watchList;
}
function removeWatch(mediaId, episodeIds){
  if(markWatch&&episodeIds)
  episodeIds.forEach(function(v){
    var data = "req=RpcApiVideo_VideoView&media_type=1&cbcallcount=1&cbelapsed=30&playhead=0&media_id=" + v;
    $.ajax("http://www.crunchyroll.com/ajax/",{async:false,data:data});
  });
  chrome.storage.local.get('watched', function(items){
    watchList = items.watched;
    n = watchList.indexOf(mediaId);
	if(n>-1)
      watchList.splice(n,1);
    chrome.storage.local.set({'watched' : watchList});
    //alert(mediaId + " removed, current list: " + watchList);
  });
  return watchList;
}
function getWatch(){
  chrome.storage.local.get('watched', function(items){
    watchList = items.watched;
  });
  //alert("sending watchlist" + watchList);
  return watchList;
}
function markWatched(mediaId,sendResponse){
  var data = "req=RpcApiVideo_VideoView&media_type=1&cbcallcount=1&cbelapsed=30&playhead=3000&media_id=" + mediaId;
  $.ajax("http://www.crunchyroll.com/ajax/",{data:data});
  sendResponse("go");
}
function markUnwatched(mediaId,sendResponse){
  var data = "req=RpcApiVideo_VideoView&media_type=1&cbcallcount=1&cbelapsed=30&playhead=0&media_id=" + mediaId;
  $.ajax("http://www.crunchyroll.com/ajax/",{data:data});
  sendResponse("go");
}
function resetWatch(mediaIds,sendResponse){
  for(var x =0;x<mediaIds.length;x++){
    var data = "req=RpcApiVideo_VideoView&media_type=1&cbcallcount=1&cbelapsed=30&playhead=0&media_id=" + mediaIds[x];
    $.ajax("http://www.crunchyroll.com/ajax/",{async:false,data:data});
  }
  sendResponse("go");
}
function watchThreads(){
  if(debug)
    console.log("watching these threads: " + JSON.stringify(watchedThreads));
  watchedThreads.forEach(function(value,index,array){
    checkThread(value.threadId);
  });
  //processThreadStack();
}
function comparePosts(redirUrl){
  var n = redirUrl.indexOf('#')+1;
  var i = redirUrl.indexOf("/forumtopic-")+12;
  var stop = redirUrl.indexOf("/",i);
  var postId = redirUrl.substring(n, redirUrl.length);
  var threadId = redirUrl.substring(i,stop);
  watchedThreads.forEach(function(v,i,a){
    if(v.threadId == threadId){
      if(v.prevPost == 1)
        updateThread(threadId,postId,v.name,true);
      else if(postId != v.prevPost){
        if(postId > v.prevPost && v.prevPost > 5 && hasThreadPort(threadId))
          pushNewPosts(threadId, collectNewPosts(v.prevPost,threadId));
        updateThread(threadId,postId,v.name,false);
      }
    }
  });
}
function hasThreadPort(threadId){
  var hasPort = false;
  threadPorts.forEach(function(v){
    if(v.name.indexOf("thread-"+threadId)>-1&&v.name.split('-')[1]==threadId.toString())
      hasPort = true;
  });
  return hasPort;
}
function getThreads(){
  var temp = {'threads':watchedThreads,'updatedThreads':updatedThreads};
  //console.log("asked for threads giving: "+JSON.stringify(temp));
  return temp;
}
function addThread(threadId, postId, threadName){
  var isNew = true;
  if(debug)
    console.log("adding thread: " + threadId);
  chrome.storage.local.get('threads', function(items){
    watchedThreads = items.threads;
    watchedThreads.forEach(function(v,i,a){
      if(v.threadId == threadId)
        isNew = false;
    });
    if(isNew){
      watchedThreads.push({'threadId':threadId,'prevPost':postId, 'name':threadName, 'postId':1});
      chrome.storage.local.set({'threads':watchedThreads});
    }
  });
}
function removeThread(threadId){
  if(debug)
    console.log("removing thread: " + threadId);
  watchedThreads.forEach(function(v,i,a){
    if(v.threadId == threadId)
      watchedThreads.splice(i,1);
  });
}
function updateThreadList(){
  chrome.storage.local.set({'threads':watchedThreads});
}
function seenThread(threadId){
  if(debug)
    console.log("seen thread: " + threadId);
  updatedThreads.forEach(function(v,i,a){
    if(v.threadId == threadId)
      updatedThreads.splice(i,1);
  });
  chrome.storage.local.get('threads',function(items){
    watchedThreads = items.threads;
    watchedThreads.forEach(function(v,i,a){
      if(v.threadId == threadId)
        v.prevPost = v.postId;
    });
    chrome.storage.local.set({'threads':watchedThreads});
  });
  richNotifs.forEach(function(v,i,a){
    if(v == 'forumtopic-'+threadId){
	  chrome.notifications.clear('forumtopic-'+threadId,function(wc){});
	  a.splice(i,1);
	}
  });
  addThreadNotification();
}
function isActive(tabId,threadId){
  chrome.tabs.query({active:true,currentWindow:true},function(tab){
    if(tab[0].id == tabId)
      seenThread(threadId);
  });
}
chrome.tabs.onHighlighted.addListener(function(highlightInfo){
  chrome.tabs.get(highlightInfo.tabIds[0],function(tab){
    if(tab && tab.url){
      if(tab.url.indexOf("http://www.crunchyroll.com/forumtopic-") > -1)
        isActive(tab.id,tab.url.split('/')[3].split('-')[1]);  
    }
  });
});
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
  if(tab.url && darkForum == "true"){
    if(tab.url.indexOf("www.crunchyroll.com") >-1)
      chrome.tabs.insertCSS(tabId, {file:"darkForumTheme.css", runAt: "document_start"});
  }
});
function postedReply(threadId,name){
  if(debug)
    console.log("posted reply, trying to not notify: " + threadId);
  watchedThreads.forEach(function(v){
    if(v.threadId == threadId)
      v.prevPost = 1;
  });
  checkThread(threadId);
}
function updateThread(threadId, postId, name, initial){
  if(debug)
    console.log("updating thread: " + threadId);
  chrome.storage.local.get('threads', function(items){
    watchedThreads = items.threads;
    watchedThreads.forEach(function(v,i,a){
      if(v.threadId == threadId){
        if(initial)
          v.prevPost = postId;
        v.postId = postId;
      }
    });
    chrome.storage.local.set({'threads':watchedThreads});
    if(!initial)
      addUpdate(threadId,postId,name);
  });
}
function addUpdate(threadId, postId, name){
  var isNew = true;
  if(debug)
    console.log("adding update");
  updatedThreads.forEach(function(v,i,a){
    if(v.threadId == threadId){
      v.postId = postId;
      isNew = false;
    }
  });
  if(isNew){
    if(debug)
      console.log("this thread is new: " + threadId);
    updatedThreads.push({'name':name,'threadId':threadId,'postId':postId});
	if(richNotif=="true")
	  showRichNotif('thread',{name:name,threadId:threadId,postId:postId});
	//else
    addThreadNotification();
  }
}
function addThreadNotification(){
  setThreadBadge(updatedThreads.length+modReports.length);
}

function checkThread(threadNum){
  if(debug)
    console.log("checking thread: " + threadNum);
  var url="http://www.crunchyroll.com/forumtopic-"+threadNum+"?pg=last";
  if(threadNetworkStack.indexOf(url)==-1)
    threadNetworkStack.push(url);
}
function processThreadStack(){
  if(threadNetworkStack.length > 0){
    var url = threadNetworkStack[0];
    $.ajax({
      url: url,
      type: "HEAD"     
    });
    threadNetworkStack.splice(0,1);
  }
}
function collectNewPosts(oldPostId,threadId){
  var url = "http://www.crunchyroll.com/forumtopic-"+threadId+"?fpid="+oldPostId;
  var newPosts = [];
  var nextPage;
  $.ajax({
    url: url,
    cache: false,
    async: false,
    type: "GET", 
    success: function(data){
      var oldPost = $('tr[id="fp_links_'+oldPostId+'"]',data);
      $(oldPost).nextAll('tr[id^="fp_main"]').each(function(){
        newPosts.push($(this).next('tr[id^="fp_links"]').addBack());
      });
      nextPage = $('.paginator-lite-selected', data).next('.paginator-lite');
      while(nextPage.length > 0){
        var tempUrl = "http://www.crunchyroll.com" + nextPage[0].pathname+ nextPage[0].search;
        if(debug)
          console.log(tempUrl);
        $.ajax({
          url: tempUrl,
          cache: false,
          async: false,
          success: function(dats){
            $('tr[id^="fp_main"]',dats).each(function(){
              newPosts.push($(this).next('tr[id^="fp_links"]').addBack());
            });
            nextPage = $('.paginator-lite-selected', dats).next('.paginator-lite');
          }
        });
      }
      
    }
  });
  if(debug)
    console.log(newPosts);
  return newPosts;
}
function pushNewPosts(threadId, newPosts){
  threadPorts.forEach(function(v,i,a){
    if(v.name.indexOf("thread-"+threadId)>-1&&v.name.split('-')[1]==threadId.toString()){
      newPosts.forEach(function(val){
        var tempHtml="";
		var tempScript="";
        var mainId = $(val)[0].id;
		var scripts = $(val).find('script').detach();
        $(val).each(function(){
          tempHtml += this.outerHTML;
        });
		$(scripts).each(function(){
		  tempScript += $(this).text();
		});
        v.postMessage({html:tempHtml,mainId:mainId,scripts:tempScript});
      });
    }
  });
}
function getOrigin(){
  chrome.storage.local.get('origin', function(items){
    origin = items.origin;
  });
  return origin;
}
function setNotificationBadge(num){
  numNotif = num;
  chrome.browserAction.getBadgeText({},function(result){    
    if(result.length == 0)
      chrome.browserAction.setBadgeText({text:num});
      chrome.browserAction.setBadgeBackgroundColor({color:"#F78C25"});
  });
}
function setThreadBadge(isNew){
  chrome.browserAction.setBadgeBackgroundColor({color:"#F78C25"});
  chrome.browserAction.getBadgeText({},function(result){    
    if(result.length == 0 && isNew > 0)      
      chrome.browserAction.setBadgeText({text:isNew.toString()});
    else if(result.length > 0){
      var temp = parseInt(numNotif) + isNew;
      if(debug)
        console.log("numNotif: " + numNotif + " isNew: " + isNew + " current text: " + result);
      if(temp > 0)
        chrome.browserAction.setBadgeText({text:temp.toString()});
      else
        chrome.browserAction.setBadgeText({text:""});
    }
  });
}
function connectChat(user,token,tokenTime){
  $('#xmlProxy').replaceWith('<div id="xmlProxy"></div>');
  var swfurl = chrome.runtime.getURL('flash/xmlsockettest.swf');
  swfobject.embedSWF(swfurl,'xmlProxy',100,100,'11',{"allowscriptaccess":"always","allownetworking":"all"});
  var host = "chat2.crunchyroll.com";
  var port = 40964;
  if(swfobject.getObjectById('xmlProxy').sendToFlash !== undefined){
  swfobject.getObjectById('xmlProxy').sendToFlash('init',{host:host,port:port});
  swfobject.getObjectById('xmlProxy').sendToFlash('connectAsUser',{username:user,token:token,tokenTime:tokenTime});
  }else{
    setTimeout(function(){
	  swfobject.getObjectById('xmlProxy').sendToFlash('init',{host:host,port:port});
      swfobject.getObjectById('xmlProxy').sendToFlash('connectAsUser',{username:user,token:token,tokenTime:tokenTime});
	},1000);
  }  
}
function chatBan(user){
  swfobject.getObjectById('xmlProxy').sendToFlash('sendMessage',{text:'/ban '+user});
  var url = "http://www.crunchyroll.com/user/"+user;
  chrome.tabs.create({url:url,active:false});
}
function chatIPBan(user){
  swfobject.getObjectById('xmlProxy').sendToFlash('sendMessage',{text:'/ipban '+user});
  var url = "http://www.crunchyroll.com/user/"+user;
  chrome.tabs.create({url:url,active:false});
}
function chatIPUnban(user){
  swfobject.getObjectById('xmlProxy').sendToFlash('sendMessage',{text:'/unipban '+user});
}
function chatUnban(user){
  swfobject.getObjectById('xmlProxy').sendToFlash('sendMessage',{text:'/unban '+user});
}
function chatModMessage(text){
  console.log('sending mod message',text);
  swfobject.getObjectById('xmlProxy').sendToFlash('sendShout',{text:text});
}
function chatDataMessage(text){
  swfobject.getObjectById('xmlProxy').sendToFlash('sendBroadcast',{text:text});
}
function kickUser(user){
  swfobject.getObjectById('xmlProxy').sendToFlash('sendMessage',{text:'/kick '+user})
}
function openTabs(urls){
  urls.forEach(function(v){
    chrome.tabs.create({url:v,active:false});
  });
}
function findCommentPage(commentId,gbid){
  var url = "http://www.crunchyroll.com/comments?pg=0&talkboxid="+gbid+"&sort=date_asc&replycount=0&threadlimit=1&pagelimit=10000";
  $.get(url,function(data){
	var comments = JSON.parse(data);
	for(var x=0;x<comments.length;x++){
	  if(comments[x].comment.id == commentId){
	    var index = x+1;
		var tempUrl = "http://www.crunchyroll.com/comments?pg="+index+"&talkboxid="+gbid+"&sort=date_asc&replycount=0&threadlimit=1&pagelimit=1";
		$.get(tempUrl,function(dat){
		  var tempComments = JSON.parse(dat);
		  if(tempComments[0].comment.id == commentId){
		    addWatchComment(commentId,gbid,index);
		  }else{
		    index+=1;
		    tempUrl = "http://www.crunchyroll.com/comments?pg="+index+"&talkboxid="+gbid+"&sort=date_asc&replycount=0&threadlimit=1&pagelimit=1";
			$.get(tempUrl,function(da){
		      var tComments = JSON.parse(da);
		      if(tComments[0].comment.id == commentId)
		        addWatchComment(commentId,gbid,index);
		      
		    });
		  }
		});
	  }
	}
  });
}
function charAverage(text){
  var total = 0;
  for(var x=0;x<text.length;x++){
    total+=text.charCodeAt(x);
  }
  return total/text.length;
}
function addWatchComment(commentId,gbid,page){
  var url= "http://www.crunchyroll.com/comments?pg="+page+"&talkboxid="+gbid+"&sort=date_asc&replycount=1000&threadlimit=1&pagelimit=1";
  $.get(url,function(data){
    console.log(JSON.parse(data));
  });
}
function showRichNotif(type,data){
  switch(type){
    case "thread":
	  chrome.notifications.create('forumtopic-'+data.threadId.toString(),{type:'basic',iconUrl:'48.png',title:'New post in thread',message:data.name,isClickable:true},function(notifId){
	    if(richNotifs.indexOf(notifId) == -1)
		  richNotifs.push(notifId);
	  });
	default:
	  break;
  }
}
function getState(sender,sendResponse){
  chrome.windows.get(sender.tab.windowId,function(window){
    if(window.state !== "fullscreen"){
	  sendResponse(true);
	}else
	  sendResponse(false);
  });
}
/*socket.on('message',function(msg){
  console.log(msg);
});
socket.on('threadUpdates',function(msg){
  console.log(msg);
});*/
chrome.notifications.onClicked.addListener(function(notifId){
  //openTabs(['http://www.crunchyroll.com/forumtopic-'+notifId+'?pg=last']);
  if(notifId.indexOf('forumtopic')>-1)
    chrome.tabs.create({url:'http://www.crunchyroll.com/'+notifId+'?pg=last'});
  chrome.notifications.clear(notifId,function(wasCleared){});
});
chrome.webRequest.onHeadersReceived.addListener(function(details){
  if(details.method == "HEAD"){
    var redirUrl;
    details.responseHeaders.forEach(function(v,i,a){
      if(v.name == "Location"){
       redirUrl = "http://www.crunchyroll.com" + v.value;
       details.responseHeaders.splice(i,1);
      }
    });
    if(redirUrl)
      comparePosts(redirUrl);
    return {responseHeaders:details.responseHeaders};
  }
},
{urls: ["http://www.crunchyroll.com/*?pg=last*"]},["responseHeaders","blocking"]);

chrome.webRequest.onBeforeSendHeaders.addListener(function(details){
  var temp = true;
  details.requestHeaders.forEach(function(v){
    if(v.name == "Referer")
	  temp = false;
  });
  if(temp){
    details.requestHeaders.push({name:'Referer',value:'http://www.crunchyroll.com/'});
	details.requestHeaders.push({name:'X-Requested-With',value:'XMLHttpRequest'});
  }
  return {requestHeaders:details.requestHeaders};
},
{urls: ["http://www.crunchyroll.com/comments*"]},["blocking","requestHeaders"]);
chrome.webRequest.onBeforeRequest.addListener(function(details){
  //console.log("replacing svg");
  return {redirectUrl:details.url.replace("chrome-extension://"+exid,"http://www.crunchyroll.com/")}; 
},
{urls: ["chrome-extension://fphkfcecnnchmlfaaldpfcpjlmbbmfgk/i/svg/header.svg","chrome-extension://onkdfchaiebkbhlbcdgbemkblolppign/i/svg/header.svg"]},["blocking"]);