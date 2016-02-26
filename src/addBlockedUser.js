$(function(){
  var userName = window.location.toString().split('/')[4];
  var redUrl = chrome.extension.getURL('red.gif');
  var greenUrl = chrome.extension.getURL('green.gif');
  $('#user_profile_links').append('<a id="blockUser" class="user-profile-link" title="Block '+userName+'"><img src="'+redUrl+'" </img><span>Block This User</span></a>');
  $('#user_profile_links').append('<a id="unblockUser" class="user-profile-link" title="Unblock '+userName+'"><img src="'+greenUrl+'" </img><span>Unblock This User</span></a>');
  $('#unblockUser').hide();
  $('a[title="User Forum Search"]').attr('href','/userforumsearch?formname=user_search_form&username='+userName);
  $('a[title="User Comment Search"]').attr('href','/usercommentsearch?formname=user_comment_search_form&username='+userName);
  chrome.extension.sendMessage({text:'getBlockedUsers'}, function(reply){
    if(reply.indexOf(userName) != -1){
      $('#blockUser').toggle();
      $('#unblockUser').toggle();      
    }
  });
  chrome.extension.sendMessage({text:'getMod'},function(reply){
    if(reply&&$('.user-profile-mod-links').length>0){
	  $('.user-profile-mod-links').append('<a id="nukeUser" href="javascript:void(0)" rel="nofollow" title="Nuke Posts">Nuke Posts</a>');
	  $('#nukeUser').click(function(){
        if(confirm("Nuke user's posts and comments?")){
	      chrome.extension.sendMessage({text:'nukeUser',user:userName});
	    }
      });
	}
  });
  $('.user-profile-link').css('cursor','pointer');
  
  $('#blockUser').click(function(){
    chrome.extension.sendMessage({text:'addBlockedUser', user:userName});
    $('#blockUser').toggle();
    $('#unblockUser').toggle(); 
  });
  $('#unblockUser').click(function(){
    chrome.extension.sendMessage({text:'removeBlockedUser', user:userName});
    $('#blockUser').toggle();
    $('#unblockUser').toggle(); 
  });

});