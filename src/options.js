$(function(){
  //chrome.runtime.sendMessage({text:'getSeamless'}, function(reply){
  //  $('#seamSelect').val(reply.toString());
  //});
  chrome.runtime.sendMessage({text:'getOptions'}, function(reply){
    console.log('got options',reply);
	reply.threads.threads.forEach(function(v,i,a){
      $('#threadCont').append('<option value="'+v.threadId+'">'+v.name+'</option>');
    });
	reply.forums.forEach(function(v,i,a){
      $('#forumCont').append('<option value="'+v.forumId+'">'+v.name+'</option>');
    });
	reply.blockedUsers.forEach(function(v,i,a){
      $('#userCont').append('<option value="'+v+'">'+v+'</option>');
    });
	reply.blacklist.forEach(function(v){
	  $('#blacklistCont').append('<option value="'+v+'">'+v+'</option>');
	});
	$('#themeSelect').val(reply.theme.toString());
	$('#webmSelect').val(reply.webm.toString());
	$('#siteNewsSelect').val(reply.siteNews.toString());
	$('#markWatchSelect').val(reply.markWatch.toString());
	$('#watchCommentsSelect').val(reply.watchComments.toString());
	$('#richNotifSelect').val(reply.richNotif.toString());
  });
  $('#removeThreads').click(function(){
    var toRemove = [];
    $('#threadCont').find(':selected').each(function(){
      toRemove.push(this.value);
      $(this).remove();
    });
    chrome.runtime.sendMessage({text:'removeMultipleThreads',threads:toRemove});
  });
  $('#removeForums').click(function(){
    var toRemove = [];
    $('#forumCont').find(':selected').each(function(){
      toRemove.push(this.value);
      $(this).remove();
    });
    chrome.runtime.sendMessage({text:'removeMultipleForums',forums:toRemove});
  });
  $('#removeUsers').click(function(){
    var toRemove = [];
    $('#userCont').find(':selected').each(function(){
      toRemove.push(this.value);
      $(this).remove();
    });
    chrome.runtime.sendMessage({text:'removeBlockedUsers',users:toRemove});
  });
  $('#removeBlacklist').click(function(){
    var toRemove = [];
    $('#blacklistCont').find(':selected').each(function(){
      toRemove.push(this.value);
      $(this).remove();
    });
    chrome.runtime.sendMessage({text:'remBlacklistMulti',threads:toRemove});
  });
  $('#blockUser').click(function(){
    var userName = $('#addUser').val();
    $('#addUser').val("")
    chrome.runtime.sendMessage({text:'addBlockedUser', user:userName});
    $('#userCont').append('<option value="'+userName+'">'+userName+'</option>');
  });
  $('#themeSelect').change(function(){
    chrome.runtime.sendMessage({text: 'setTheme', theme:$(this).val()});
  });
  $('#webmSelect').change(function(){
    chrome.runtime.sendMessage({text: 'setWebm', webm:$(this).val()});
  });
  $('#siteNewsSelect').change(function(){
    chrome.runtime.sendMessage({text:'setSiteNews', siteNews:$(this).val()});
  });
  $('#markWatchSelect').change(function(){
    chrome.runtime.sendMessage({text:'setMarkWatch', markWatch:$(this).val()});
  });
  $('#watchCommentsSelect').change(function(){
    chrome.runtime.sendMessage({text:'setWatchComments', watchComments:$(this).val()});
  });
  $('#richNotifSelect').change(function(){
    chrome.runtime.sendMessage({text:'setRichNotif', richNotif:$(this).val()});
  });
});