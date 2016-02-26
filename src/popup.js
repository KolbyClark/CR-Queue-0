$(function(){
  var origin="blank";
  $('#form_pm').toggle("slide",{"direction":"up"},1);
  $('#notif-contain').toggle("slide",{"direction":"up"},1);
  $('#inbox-contain').toggle("slide",{"direction":"up"},1);
  $('#thread-contain').toggle("slide",{"direction":"up"},1);
  $('#notification-content').hide();
  $('#modReport').hide();
  $('#modReport-contain').toggle("slide",{"direction":"up"},1);
  chrome.runtime.sendMessage({text:"getMod"}, function(reply){
    if(reply)
	  $('#modReport').show();
  });
	  
  chrome.runtime.sendMessage({text: "getBadge"}, function(reply){
    //console.log(JSON.stringify(reply));
    reply.forEach(function(value,index,array){ //[{name,num},{name,num}]
      $('#'+value.name+"-badge").text(value.num);
    });
  });
  
  $('#fullscreen').click(function(){  
    chrome.windows.getCurrent(function(win) { 
      chrome.tabs.query({'windowId': win.id, 'active': true}, function(tab) {
        chrome.runtime.sendMessage({text: "toggle",tabs:tab});
      });
    });
  });
  $('#show_form').click(function(){
    $(this).hide();
    $('#form_pm').toggle("slide",{"direction":"up"});
    //console.log("asking for origin");
    chrome.runtime.sendMessage({text: "origin"}, function(reply){
      origin = reply;
      //console.log("got origin: " + origin);
      $('#origin_token').val(origin);
    });
      
  });
  $('#submit_button').click(function(){
    $("#SendPms").submit();
    $('#form_pm').toggle("slide",{"direction":"up"}, function(){
      $('#show_form').show();
    });
  });
  $('#cancel_button').click(function(){
    $('#form_pm').toggle("slide",{"direction":"up"}, function(){
      $('#show_form').show();
    });
  });
  $('#random').click(function(){
    $.get('http://www.crunchyroll.com/videos/anime/alpha?group=all', function(data){
      var shows = $('.text-link.ellipsis',data);
      var rand = Math.floor(Math.random() * shows.length)+1;
      var link = 'http://www.crunchyroll.com' + shows[rand].pathname;
      chrome.tabs.create({url:link});
    });
  });
  $('#queue').click(function(){
    var url = "http://www.crunchyroll.com/home/queue";
    chrome.tabs.create({url:url});
  });
  $('#anime').click(function(){
    var url = "http://www.crunchyroll.com/videos/anime/updated";
    chrome.tabs.create({url:url});
  });
  $('#thread').click(function(){
    if($('#thread-contain').is(':visible')){
      $('#thread-contain').toggle("slide",{"direction":"up"},function(){
        $('#thread-contain').empty();
      });
    }
    else{
      //console.log("asking for list of threads");
      chrome.runtime.sendMessage({text: "getUpThreads"}, function(reply){
        //console.log(JSON.stringify(reply));
        reply.forEach(function(value,index,array){
          $('#thread-contain').prepend('<div class="thread" ><a href="http://www.crunchyroll.com/forumtopic-'+value.threadId+'?pg=last">'+value.name.substring(0,10)+'</a><a class="delNotif"></a></div>');
        });
        $('.thread').click(function(){
          var temp = $(this).children()[0].href;
          chrome.tabs.create({url:temp});
        });
		var close = "url('"+chrome.runtime.getURL('close.png')+"') no-repeat";
		$('a.delNotif').css("background",close);
		$('a.delNotif').click(function(e){
		  e.stopImmediatePropagation();
		  var threadid = $(this).prev().get(0).href.split('?')[0].split('-')[1];
		  chrome.runtime.sendMessage({text:'seenThread',threadId:threadid});
          $(this).parent().remove();		  
		});
        $('#thread-contain').toggle("slide",{"direction":"up"});
      });
    }    
  });
  $('#Notifications').click(function(){
    if($('#notif-contain').is(':visible')){
      $('#notif-contain').toggle("slide",{"direction":"up"},function(){
        $('#notif-contain').empty();
      });
    }
    else{
      chrome.runtime.sendMessage({text: "sortNotifications"}, function(reply){
        reply.forEach(function(value,index,array){
          var tempName = value.name.split(' ').join('-')
          //console.log(tempName);
          $('#notif-contain').append('<div id="'+tempName+'-button">'+value.name+'</div><div class="scroll" id="'+tempName+'"></div>');
          $('#'+tempName).hide();
          $('#'+tempName+'-button').click(function(){
            $(this).next().toggle("slide",{"direction":"up"});
          });
          switch(tempName){
            case 'Quoted-Forum-Posts':
              value.cont.forEach(function(val,ind,arr){
                $('#'+tempName).append('<div id="notification_'+val.notifId+'"><a href="'+val.links[2]+'">'+val.user+'</a></div>');
                //floatPost(val.notifId,val.links[2]);
              });
              break;
            case 'New-Guestbook-Entries':
              value.cont.forEach(function(val,ind,arr){
                $('#'+tempName).append('<div id="notification_'+val.notifId+'"><a href="'+val.cur+'">'+val.user+'</a></div>');
              });
              break;
            case 'Guest-Pass':
              value.cont.forEach(function(val,ind,arr){
                $('#'+tempName).append('<div id="notification_'+val.notifId+'"><a href="'+val.links[0]+'">Guest Pass</a></div>');
              });
              break;
            case 'Buddy-Request':
              value.cont.forEach(function(val,ind,arr){
                $('#'+tempName).append('<div id="notification_'+val.notifId+'" class="request">'+val.user+'</div><div id="choices_'+val.notifId+'" class="notif_choices"><a id="view_'+val.notifId+'" href="'+val.links[0]+'" class="view_notif" style="display:inline-block;">View</a><a id="accept_'+val.notifId+'" class="accept_notif" style="display:inline-block;">Accept</a><a id="reject_'+val.notifId+'" calss="reject_notif" style="display:inline-block;">Reject</a></div>');
                $('.notif_choices').hide();
              });
              break;
			case 'Buddy-Requests':
              value.cont.forEach(function(val,ind,arr){
                $('#'+tempName).append('<div id="notification_'+val.notifId+'" class="request">'+val.user+'</div><div id="choices_'+val.notifId+'" class="notif_choices"><a id="view_'+val.notifId+'" href="'+val.links[0]+'" class="view_notif" style="display:inline-block;">View</a><a id="accept_'+val.notifId+'" class="accept_notif" style="display:inline-block;">Accept</a><a id="reject_'+val.notifId+'" calss="reject_notif" style="display:inline-block;">Reject</a></div>');
                $('.notif_choices').hide();
              });
              break;
            case 'Group-Invitation':
              value.cont.forEach(function(val){
                $('#'+tempName).append('<div id="notification_'+val.notifId+'" class="request">'+val.user+' invited you</div><div id="choices_'+val.notifId+'" class="notif_choices"><a id="view_'+val.notifId+'" href="'+val.links[1]+'" class="view_notif" style="display:inline-block;">View</a><a id="accept_'+val.notifId+'" class="accept_notif" style="display:inline-block;">Accept</a><a id="reject_'+val.notifId+'" class="reject_notif" style="display:inline-block;">Reject</a></div>');
                $('.notif_choices').hide();
              });
              break;
            case 'New-Photo-Comment':
              value.cont.forEach(function(val){
                $('#'+tempName).append('<div id="noditification_'+val.notifId+'"><a href="'+val.links[1]+'">'+val.user+'</a></div>');
              });
              break;
          }
          chrome.runtime.sendMessage({text:"notify"});         
        });
        $('div.request').click(function(){
          var notifId = this.id.split('_')[1];
          $('#choices_'+notifId).toggle();
        });
        $('a.view_notif').click(function(){
          var notifId = this.id.split('_')[1];
          var temp = this.href;
          if(temp)
            chrome.tabs.create({url:temp}); 
        });
        $('a.accept_notif').click(function(){
          var notifId = this.id.split('_')[1];
          //console.log('accept notif: '+notifId);
          acceptNotif(notifId);
          var par = $(this).parent();
          $(par).prev().addBack().remove();
        });
        $('a.reject_notif').click(function(){
          var notifId = this.id.split('_')[1];
          //console.log('reject notif: '+notifId);
          rejectNotif(notifId);
        });
        $('div.scroll div:not(.request,.notif_choices)').click(function(){
          chrome.runtime.sendMessage({text:"notify"});
          var temp = $(this).children()[0].href;
          if(temp)
            chrome.tabs.create({url:temp});
        });
        $('#notif-contain').toggle("slide",{"direction":"up"});
      });
    }
  });
  $('#Inbox').click(function(){
    if($('#inbox-contain').is(':visible')){
      $('#inbox-contain').toggle("slide",{"direction":"up"},function(){
        $('#inbox-contain').empty();
      });
    }
    else{
      chrome.runtime.sendMessage({text: "sortInbox"}, function(reply){
        reply.forEach(function(value,index,array){
          if(value.content.length > 0){
            $('#inbox-contain').append('<div id="'+value.name+'-button">'+value.name+'</div><div class="scroll" id="'+value.name+'"></div>');
            $('#'+value.name).hide();
            $('#'+value.name+'-button').click(function(){
              $(this).next().toggle("slide",{"direction":"up"});
            });
            value.content.forEach(function(val,ind,arr){
              var link = "http://www.crunchyroll.com/showprivatemessage?id=" + val.messageId;
              $('#'+value.name).append('<div id="message_'+val.messageId+'"><a href="'+link+'">'+val.name.substring(0,10)+' - ' + val.subject.substring(0,10)+'</a></div>');
              $('#message_'+val.messageId).data({'subject':val.subject,'name':val.name,'notifId':val.messageId});
              $('#message_'+val.messageId).click(function(){
                var name = $(this).data('name');
                var subject = $(this).data('subject');
                if(subject.indexOf('Re:') == -1)
                  subject = 'Re: ' + $(this).data('subject');
                $('#compose_to').val(name);
                $('#subject').val(subject);
                getReplyText($(this).data('notifId'),$(this).parent().prev()[0].id);
                markRead($(this).data('notifId'));
              });
            });
          }
        });
        $('div.scroll div').click(function(){
          chrome.runtime.sendMessage({text:"notify"});
          /*var temp = $(this).children()[0].href;
          chrome.tabs.create({url:temp});*/
        });
        $('#inbox-contain').toggle("slide",{"direction":"up"});
      });
    }
  });
  $('#modReport').click(function(){
    if($('#modReport-contain').is(':visible')){
	  $('#modReport-contain').toggle("slide",{"direction":"up"},function(){
        $('#modReport-contain').empty();
      });
	} else {
	  chrome.runtime.sendMessage({text:'getReports'},function(reply){
	    reply.forEach(function(v){
		  var link = "http://www.crunchyroll.com/modreport";
		  $('#modReport-contain').append('<div><a href="'+link+'">'+v+'</a></div>');
		});
		$('#modReport-contain>div').click(function(){
          var temp = $(this).children()[0].href;
          chrome.tabs.create({url:temp});
        });
		$('#modReport-contain').toggle("slide",{"direction":"up"});
	  });
	}
  });
});
function getReplyText(notifId,parentId){
  var url = "http://www.crunchyroll.com/newprivatemessage?replyid=" + notifId;
  chrome.cookies.getAll({url:'http://www.crunchyroll.com'},function(data){
    $.get(url,data, function(response,status,jqXHR){
      var body = $('#pm_body',response).text();
      $('#pm_body').text(body);
      $('#'+parentId).click();
      $('#show_form').click();
    });
  });
}
function markRead(notifId){
  var url = "http://www.crunchyroll.com/showprivatemessage?id=" + notifId;
  chrome.cookies.getAll({url:'http://www.crunchyroll.com'},function(data){
    $.get(url,data, function(response,status,jqXHR){

    });
  });
}
function acceptNotif(notifId){
  var datas = {req:'RpcApiNotification_RespondYes',nid:notifId};
  $.ajax('http://www.crunchyroll.com/ajax/', {
    type: 'post',
    data: datas,
    sucess: function(data){
      $('#notification_'+notifId).fadeOut(500);
    }
  });
}
function rejectNotif(notifId){
  var datas = {req:'RpcApiNotification_RespondNo',nid:notifId};
  $.ajax('http://www.crunchyroll.com/ajax/', {
    type: 'post',
    data: datas,
    sucess: function(data){
      $('#notification_'+notifId).fadeOut(500);
    }
  });
}
/*
function floatPost(notifId, link){
  chrome.cookies.getAll({url:'http://www.crunchyroll.com'},function(data){
    $.get(link,data, function(response,status,jqXHR){
      var n = link.indexOf('=');
      var postId = link.substring(n+1,link.length);
      var tooltip = $('#fp_main_'+postId+' .showforumtopic-message-contents-text',response);
      $('#notification_'+notifId).data('powertipjq',tooltip);
      $('#notification_'+notifId).powerTip({placement: 's', smartPlacement: true});
    });
  });
}
*/
