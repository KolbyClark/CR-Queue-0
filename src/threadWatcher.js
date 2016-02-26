var Page = {};
CountupTimerStepper = function(){

  this._timers = [];
  this._stopped = false;
  var thiz = this;

  this.addTimer = function(timer){
    thiz._timers.push(timer);
  };

  this.removeTimer = function(timer){
    thiz._timers.splice($.inArray(timer,thiz._timers),1);
  };

  this._step = function(){
    if(!thiz._stopped)
      setTimeout(Page.countup_timer_stepper._step, 990);
    
    var current_time = (new Date()).valueOf();
    thiz._timers.forEach(function(v){
      v.step.call(v, current_time);
    });
  };

  this.pause = function(){
    this._stopped = true;
  };

  this.start = function(){
    this._stopped = false;
    this._step();
  };
};
Page.countup_timer_stepper = new CountupTimerStepper();
Page.countup_timer_stepper.start();

CountupTimer = function(config){

  this._render_to = config.renderTo;
  this._target_date = (new Date()).valueOf() - parseInt(config.targetDateDiff);
  this._render_template = "<span class='countup-number'></span> <span class='countup-units'></span> ago";
  this._finished_template = "from the future";
  this._time_diff = null;

  this._span_number = null;
  this._span_units = null;

  var thiz = this;

  this.start = function(){
    $('#'+this._render_to).html(this._render_template);

    this._span_number = ($('#'+this._render_to).find('.countup-number'))[0];
    this._span_units = ($('#'+this._render_to).find('.countup-units'))[0];

    if(!Page.countup_timer_stepper){
      Page.countup_timer_stepper = new CountupTimerStepper();
      Page.countup_timer_stepper.start();
    }
    
    Page.countup_timer_stepper.addTimer(this);
  };

  this.pause = function(){
    if(Page.countup_timer_stepper)
      Page.countup_timer_stepper.removeTimer(thiz);
  };

  this.step = function(current_time){

    var date_diff;
    date_diff = current_time - thiz._target_date;

    if(date_diff < 0){
      thiz.pause();
      $('#'+thiz._render_to).empty().append(thiz._finished_template);
    }else{
      thiz._time_diff = Math.floor(date_diff/1000);
      if(thiz._time_diff < 60){
        thiz._span_number.innerHTML = thiz._time_diff;
        if(thiz._time_diff == 1)
          thiz._span_units.innerHTML = "second";
        else
          thiz._span_units.innerHTML = "seconds";
      }else if(thiz._time_diff < 3600){
        var time = Math.floor(thiz._time_diff/60);
        thiz._span_number.innerHTML = time;
        if(time==1)
          thiz._span_units.innerHTML = "minute";
        else
          thiz._span_units.innerHTML = "minutes";
      }else if(thiz._time_diff < 86400){
        var time = Math.floor(thiz._time_diff/3600);
        thiz._span_number.innerHTML = time;
        if(time == 1)
          thiz._span_units.innerHTML = "hour";
        else
          thiz._span_units.innerHTML = "hours";
      }else if(thiz._time_diff < 2592000){
        var time = Math.floor(thiz._time_diff/86400);
        thiz._span_number.innerHTML = time;
        if(time == 1)
          thiz._span_units.innerHTML = "day";
        else
          thiz._span_units.innerHTML = "days";
      }else{
        var date = new Date(thiz._target_date);
        var month = date.getMonth()+1;
        $('#'+thiz._render_to).html(month+"/"+date.getDate()+"/"+date.getYear().toString().substring(1));
        thiz.pause();
      }
    }
  };
};




function createTimer(id,number,unit){
  if(number == "one")
    number = 1;
  switch(unit){
    case "second":
      (new CountupTimer({renderTo:id,targetDateDiff:parseInt(number)*1000})).start();
      break;
    case "seconds":
      (new CountupTimer({renderTo:id,targetDateDiff:parseInt(number)*1000})).start();
      break;
    case "minute":
      (new CountupTimer({renderTo:id,targetDateDiff:parseInt(number)*1000*60})).start();
      break;
    case "minutes":
      (new CountupTimer({renderTo:id,targetDateDiff:parseInt(number)*1000*60})).start();
      break;
    case "hour":
      (new CountupTimer({renderTo:id,targetDateDiff:parseInt(number)*1000*60*60})).start();
      break;
    case "hours":
      (new CountupTimer({renderTo:id,targetDateDiff:parseInt(number)*1000*60*60})).start();
      break;
    case "day":
      (new CountupTimer({renderTo:id,targetDateDiff:parseInt(number)*1000*60*60*24})).start();
      break;
    case "days":
      (new CountupTimer({renderTo:id,targetDateDiff:parseInt(number)*1000*60*60*24})).start();
      break;
  }
};
function addTimers(){
  $('div.showforumtopic-message-contents-header').contents().filter(function(i){return this.nodeType == 3&&this.nodeValue.indexOf('ago')>-1;}).each(function(){
    var dateString = $(this).text().trim();
    var pare = $(this).parent();
    var id = "timer_" + pare.prev('a').attr('name');
    
    if(dateString.indexOf('edited') > -1){
      var dateString = dateString.split(', ');
      dateString.forEach(function(v,i,a){
        v = v.split(" ");
        v.splice(0,1);
        v = v.join(" ");
        a[i] = v;
      });
      $(this).remove();
      pare.append('Posted <span id="'+id+'">'+dateString[0]+'</span>, edited <span id="'+id+'e">'+dateString[1]+'</span>');
      dateString.forEach(function(v,i){
        if(v.indexOf('long') == -1&& v.indexOf("/") == -1){
          if(i==1)
            id += "e";
          v = v.split(' ');
          createTimer(id,v[0],v[1]);
        }
      });      
    }
    else{
      dateString = dateString.split(' ');
      dateString.splice(0,1);
      dateString = dateString.join(' ');
      $(this).remove();
      pare.append('Posted <span id="'+id+'">'+dateString+'</span>');
      createTimer(id, dateString.split(' ')[0], dateString.split(' ')[1]);
    }
  });
}
function embedWebm(){
  $('.showforumtopic-message-contents-text, #previewbox')
    .filter(function(){return $(this).text()
	.indexOf('[webm]')>-1;}).each(function(){
      var tempHtml = $(this).html();
      tempHtml = tempHtml.replace(/\[webm\]/g,'<video loop="" controls="" autoplay="" muted="" style="max-width:640px;" src="').replace(/\[\/webm\]/g,'"></video>');
      $(this).html(tempHtml);
  });
}
function pyramid(stuff){
  var patt =/\[\/?quote\]/g;
  var matches = [];
  while(temp = patt.exec(stuff)){matches.push(temp);}
  var quotes = [];
  var qlevel=0;

  for(var x=0;x<matches.length-1;x++){
    if(matches[x][0].indexOf('/')==-1){
      var q = {};
      q.children = [];
      for(var y=x+1;y<matches.length;y++){
        var temp = matches[y][0];
        if(temp.indexOf('[q')>-1){
          qlevel++;
          continue;
        }else if(temp.indexOf('/')>-1){
          if(qlevel==0){
            q.end = matches[y]['index']+8;
            q.start = matches[x]['index'];
            break;
          }
          else{
            qlevel--;
          }
        }
      }
      quotes.push(q);
    }
  }
  quotes.forEach(function(v){
    v.text = stuff.substring(v.start,v.end);
  });
  quotes.reverse();
  for(var x=0;x<quotes.length-1;x++){
    for(var y=x+1;y<quotes.length;){
      if(quotes[x].start > quotes[y].start && quotes[x].end < quotes[y].end){
        quotes[y].children.push(quotes[x]);
        if(quotes[y].shortText)
          quotes[y].shortText=quotes[y].shortText.replace(quotes[x].text,'');
        else
          quotes[y].shortText=quotes[y].text.replace(quotes[x].text,'');
        quotes.splice(x,1);
		y=x+1;
      }
	  else
	    y++;
    }
  }
  quotes.reverse();
  var deep = "";
  if(quotes[0].start > 0)
    deep+=stuff.substring(0,quotes[0].start);
  quotes.forEach(function(v,i,a){
    if(v.shortText)
      deep+=v.shortText.replace(/\n{3,}/g,'\n\n');
    else
      deep+=v.text.replace(/\n{3,}/g,'\n\n');
	if(i+1<a.length)
      deep+=stuff.substring(v.end,a[i+1].start);
  });
  deep+=stuff.substring(quotes[quotes.length-1].end,stuff.length);
  if(deep.length > 0)
    return deep;
  else
    return stuff;
}


$(function(){
  addTimers();
  var hidden = $('#RpcApiForum_CreatePost div.contents input[type="hidden"]').clone();
  $('#RpcApiForum_CreatePost input[name="post_btn"]').next().after('<input id="cancelPost" class="big-btn" type="button" value="Cancel">');
  $('#RpcApiForum_CreatePost input[name="post_btn"]').after('<input id="postPost" class="big-btn" type="button" value="Post Reply">');
  $('#RpcApiForum_CreatePost input[name="post_btn"]').detach();
  $('#postPost').next().after('<input id="previewPost" class="big-btn" type="button" value="Preview Post">');
  $('#postPost').next().detach();
  var postButton = $('#postPost');
  var previewButton = $('#previewPost');
  var cancelButton = $('#cancelPost');
  $(cancelButton).hide();
  var location = window.location.toString();
  var start = location.indexOf('topic-')+5;
  var stop  = location.indexOf('/',start);
  var threadNum = location.substring(start+1, stop);
  var forum = $('a.widget-forumnav-current')[0].title;
  var port;
  var infiniteScroll = false;
  var isWatched = false;
  var isBottom = false;
  var isSeamless = false;
  var webm = false;
  var undoData = {};
  if(forum == "Closed" || $('.showforumtopic-header').contents()[2] == undefined)
    var name = $('.showforumtopic-header').text().trim();
  else
    var name = $('.showforumtopic-header').contents()[2].textContent.trim();
  $('#template_action_button').prepend('<input class="submitbtn" id="watch_thread" type="button" value="Watch" style="float:right;display:block;padding-right:6px;margin-left: 4px;">','<input class="submitbtn" id="Unwatch_thread" type="button" value="Unwatch" style="float:right;display:block;padding-right:6px;margin-left: 4px;">');
  $('#template_action_button').prepend('<input class="submitbtn" id="blacklist_thread" type="button" value="Blacklist" style="float:right;display:block;padding-right:6px;margin-left: 4px;">','<input class="submitbtn" id="allow_thread" type="button" value="Allow" style="float:right;display:block;padding-right:6px;margin-left: 4px;">');
  $('#template_action_button').prepend('<input type="checkbox" id="updateBox"style="float:right;display:block;padding-right:6px;margin-left: 4px;margin-top:5px;">');
  $('#Unwatch_thread').toggle();
  $('#allow_thread').toggle();
  chrome.runtime.sendMessage({text:'getWebm'},function(reply){
    if(reply){
	  webm = true;
	  embedWebm();
	}
  });
  chrome.runtime.sendMessage({text:'getThreads'}, function(reply){
    reply.threads.forEach(function(v,i,a){
      if(v.threadId == threadNum){
        $('#watch_thread').toggle();
        $('#Unwatch_thread').toggle();
		isWatched = true;
        chrome.runtime.sendMessage({text:"openPort",portName:"thread-"+threadNum});
      }        
    });
    reply.updatedThreads.forEach(function(v,i,a){
      if(v.threadId == threadNum)
        chrome.runtime.sendMessage({text:'seenThread',threadId:threadNum});
    });  
  });
  chrome.runtime.sendMessage({text:'getBlacklist'},function(reply){
    //console.log(reply,threadNum);
    if(reply.indexOf(threadNum) > -1){
	  console.log('what');
	  $('#blacklist_thread').toggle();
	  $('#allow_thread').toggle();
	}	  
  });
  $('#updateBox').change(function(){
    if($('#updateBox')[0].checked)
      chrome.runtime.sendMessage({text:"openPort",portName:"thread-"+threadNum});
    else if(port)
      chrome.runtime.sendMessage({text:"closePort",port:port.name});
  });
  var isLast = $('a.paginator-lite[title="Next"]').filter(function(){return this.href != undefined;});
  if(isLast.length==0)
    $('#updateBox').prop('checked', true);
  $('#watch_thread').click(function(){
    chrome.runtime.sendMessage({text:"addThread", num: threadNum, postnum:1,threadName:name});
    $('#watch_thread').toggle();
	$('#Unwatch_thread').toggle();
  });
  $('#Unwatch_thread').click(function(){
    chrome.runtime.sendMessage({text:'remThread', threadId:threadNum});
    $('#watch_thread').toggle();
	$('#Unwatch_thread').toggle();
  });
  $('#blacklist_thread').click(function(){
    chrome.runtime.sendMessage({text:'addBlacklist',threadId:threadNum});
	$('#blacklist_thread').toggle();
	$('#allow_thread').toggle();
  });
  $('#allow_thread').click(function(){
    chrome.runtime.sendMessage({text:'remBlacklist',threadId:threadNum});
	$('#blacklist_thread').toggle();
	$('#allow_thread').toggle();
  });
  var quoteIds = [];
  var quoteUrl = "";
  //$('.showforumtopic-postaction:contains("Quote")').attr('href','');
  $('.showforumtopic-messages').on('click','.showforumtopic-postaction:contains("Quote")',function(e){
    e.preventDefault();
    quoteIds = [];
    quoteIds.push($(this).next().val());
    quoteUrl="http://www.crunchyroll.com/quoteforumpost?id_list[]=" + $(this).next().val();
    $.get(quoteUrl,function(data){
      $('#RpcApiForum_CreatePost input[name^="quoted"]', data).prependTo($('#RpcApiForum_CreatePost div.contents'));
      $('#newforumpost').val($('#newforumpost',data).val());
      $(document).scrollTop($('#newforumpost').offset().top);
      $(cancelButton).show();
      $('#newforumpost').focus();
    });
  });
  var isEdit = false;
  $('.showforumtopic-messages').on('click','.showforumtopic-message-contents-header-actions a:contains("Edit")',function(e){
    e.preventDefault();
    isEdit = true;
    var editUrl = "http:///www.crunchyroll.com"+this.pathname+this.search;
    $.get(editUrl,function(data){
      $('#RpcApiForum_CreatePost div.contents input[type="hidden"]').remove();
      $('#RpcApiForum_CreatePost div.contents').prepend($('#RpcApiForum_EditPost div.contents input[type="hidden"]', data));
      $('#newforumpost').val($('#body',data).val());
      $('#postPost').val("Edit Post");
      $('#previewPost').val("Preview Edit");
      $('#newforumpost').attr('name','body');
      $(document).scrollTop($('#newforumpost').offset().top);
      $(cancelButton).show();
      $('#newforumpost').focus();
    });
  });
  $('.showforumtopic-multi-actions a:contains("Quote")').addClass('toRemove');
  $('.showforumtopic-multi-actions a:contains("Quote")').after('<a id="multiQuote" style="cursor:pointer">Quote Selected</a>');
  $('a.toRemove').detach();
  $('#multiQuote').click(function(e){
    e.preventDefault();
    quoteIds = [];
    $('input[id^="fp_select"]:checked').each(function(){
      quoteIds.push($(this).val());
    });
    quoteUrl="http://www.crunchyroll.com/quoteforumpost?";
    quoteIds.forEach(function(v,i,a){
      quoteUrl = quoteUrl + "id_list[]=" + v + "&";
    });
    $.get(quoteUrl,function(data){
      $('#RpcApiForum_CreatePost input[name^="quoted"]', data).prependTo($('#RpcApiForum_CreatePost div.contents'));
      $('#newforumpost').val($('#newforumpost',data).val());
      $(document).scrollTop($('#newforumpost').offset().top);
      $(cancelButton).show();
      $('#newforumpost').focus();
    });
  });
  chrome.runtime.sendMessage({text:"getMod"}, function(reply){
    if(reply){
	  $('.showforumtopic-multi-actions').append('<a id="merge" style="cursor: pointer;">Merge Selected</a>');
	  $('.showforumtopic-message-contents-header-actions').prepend('<a class="pyramid" style="cursor:pointer;"><span class="modlink">Depyramid</span></a><a class="undo" style="cursor:pointer;display:none;"><span class="modlink">Undo</span></a>');
	}
  });  
  $('.showforumtopic-multi-actions').on('click','#merge',function(e){
    e.preventDefault();
	if($('input[id^="fp_select"]:checked').length > 0){
	  var user = $('input[id^="fp_select"]:checked').first().parents("td").prev().find('.showforumtopic-message-user-name>a:first-child').text();
	  var check = true;
	  var mergeIds = [];
	  $('input[id^="fp_select"]:checked').each(function(){
	    if($(this).parents('td').prev().find('.showforumtopic-message-user-name>a:first-child').text() != user)
	      check = false;
		mergeIds.push($(this).val());
	  });
	  if(check){
	    chrome.runtime.sendMessage({text:"mergePosts",posts:mergeIds},function(reply){
		    $('#fp_main_'+mergeIds[0]+' div.showforumtopic-message-contents-text').html(reply.html);
			mergeIds.splice(0,1);
		    mergeIds.forEach(function(v){
			    $('#fp_header_' + v).fadeOut();
				$('#fp_main_' + v).fadeOut();
				$('#fp_links_' + v).fadeOut();
				$('#fp_select_' + v).fadeOut();
			});
			$('input[id^="fp_select"]:checked').each(function(){this.checked=false;});
		});
	  }
	  else alert("Not the same user");
	}
  });
  $('#newforumpost').on('change keypress paste',function(){
    $(cancelButton).show();
  });
  $('.showforumtopic-message-contents-header-actions').on('click','a.pyramid',function(){
	//console.log('pyramid');
	var id = $(this).parents('.showforumtopic-message-contents-header').prev()[0].name;
	var link = this
	$.ajax({
	  url: "http://www.crunchyroll.com/editforumpost?id=" + id,
	  type: "GET",
	  success: function(data){
	    undoData[id] = $('#body',data).val();
		var newText = pyramid($('#body',data).val());
		var postString = "fail_url=%2Feditforumpost%3Fid%3D"+id+"&fpid="+id+"&formname=RpcApiForum_EditPost&body="+encodeURIComponent(newText).replace(/%20/g,'+');
		$.ajax({
		  url: "http://www.crunchyroll.com/?a=formhandler",
		  type: "POST",
		  data: postString,
		  success: function(data, s, j){
			$('#fp_main_'+id+' div.showforumtopic-message-contents-text').html($('#fp_main_'+id+' div.showforumtopic-message-contents-text',data).html());
			$(link).hide()
			$(link).parent().find('.undo').show();
		  }
		});
		
	  }
	});
  });
  $('.showforumtopic-message-contents-header-actions').on('click','a.undo',function(){
    var id = $(this).parents('.showforumtopic-message-contents-header').prev()[0].name;
	var link = this;
	var postData = undoData[id];
	if(postData !== undefined){
	  var postString = "fail_url=%2Feditforumpost%3Fid%3D"+id+"&fpid="+id+"&formname=RpcApiForum_EditPost&body="+encodeURIComponent(postData).replace(/%20/g,'+');
	  $.ajax({
	    url: "http://www.crunchyroll.com/?a=formhandler",
		type: "POST",
		data: postString,
		success: function(data){
		  $('#fp_main_'+id+' div.showforumtopic-message-contents-text').html($('#fp_main_'+id+' div.showforumtopic-message-contents-text',data).html());
		  $(link).hide()
	      $(link).parent().find('.pyramid').show();
		}
	  });
	}
  });


  $('#RpcApiForum_CreatePost input[name="fail_url"]').val('');
  $(postButton).click(function(e){
    e.stopImmediatePropagation();
	e.preventDefault();
	
    if(quoteIds.length == 0 && !isEdit){
      $.ajax({
        url: "http://www.crunchyroll.com/?a=formhandler",
        type: "POST",
        data: $('#RpcApiForum_CreatePost').serialize(),
        success: function(data,status,jqXHR){
          chrome.runtime.sendMessage({text:'postReply', threadId:threadNum, threadName:name});
          $('#newforumpost').val('');
          $('.bbcode-preview-container').hide();
          $(cancelButton).hide();
        }
      });
    }
    else if(isEdit){
      var postId = $('#RpcApiForum_CreatePost input[name="fpid"]').val();
      $.ajax({
        url: "http://www.crunchyroll.com/?a=formhandler",
        type: "POST",
        data: $('#RpcApiForum_CreatePost').serialize(),
        success: function(data,status,jqXHR){
          $('#fp_main_'+postId+' div.showforumtopic-message-contents-text').html($('#fp_main_'+postId+' div.showforumtopic-message-contents-text',data).html());
          $('#newforumpost').val('');
          $('.bbcode-preview-container').hide();
          $(cancelButton).hide();
          $('#postPost').val("Post Reply");
          $('#previewPost').val("Preview Post");
          $('#RpcApiForum_CreatePost div.contents input[type="hidden"]').remove();
          $('#RpcApiForum_CreatePost div.contents').prepend(hidden);
          $('#newforumpost').attr('name','newforumpost');
          addTimers();
          isEdit = false;
        }
      });
    }
    else{
      $.ajax({
        url: "http://www.crunchyroll.com/?a=formhandler",
        type: "POST",
        data: $('#RpcApiForum_CreatePost').serialize(),
        success: function(data,status,jqXHR){
          chrome.runtime.sendMessage({text:'postReply', threadId:threadNum, threadName:name});
          $('#newforumpost').val('');
          $('.bbcode-preview-container').hide();
          $(cancelButton).hide();
          $('#RpcApiForum_CreatePost input[name^="quoted"]').remove();
          quoteIds = [];
        }
      });
    }
  });
  var testPreview;
  $(previewPost).click(function(e){
    e.stopImmediatePropagation();
	e.preventDefault();
	$.ajax({
      url: "http://www.crunchyroll.com/ajax/",
      type: "POST",
      data: {'req':'RpcApiForum_PreviewBbCode','text':$('#newforumpost').val()},
      success: function(data,status,jqXHR){
	    var data = JSON.parse(data.replace(/\n/g,'').replace('/*-secure-','').replace('*/',''));
		$('#previewbox>div').detach();
		//console.log($(data.data)[0]);
	    $('#previewbox')[0].appendChild($(data.data)[0]);
		var tempScript = $(data.data).find('script').text();
		var script = document.createElement('script');
		script.textContent = tempScript;
	    document.head.appendChild(script);
		$('#previewbox').show();
		//$(cancelButton).show();
		if(webm)
		  embedWebm();
	  }
	});
  });
  $(cancelButton).click(function(){
    $('#newforumpost').val('');
    $('.bbcode-preview-container').hide();
    $(cancelButton).hide();
    $('#postPost').val("Post Reply");
    $('#previewPost').val("Preview Post");
    $('#RpcApiForum_CreatePost div.contents input[type="hidden"]').remove();
    $('#RpcApiForum_CreatePost div.contents').prepend(hidden);
    $('#newforumpost').attr('name','newforumpost');
    isEdit = false;
    quoteIds = [];
  });

  var nukedPosts = [];
  /*$('td.showforumtopic-message-user').filter(function(){return $(this).text().length ==23;}).each(function(){
	nukedPosts.push($(this).parent()[0].id.split('_')[2]);
  });
  if(nukedPosts.length > 0){
	var datas = {req: 'RpcApiForum_DeletePost','id_list[]': nukedPosts};
	$.ajax('http://www.crunchyroll.com/ajax/', {
		type: 'post',
		data: datas,
		success: function(dataa){
			nukedPosts.forEach(function(v){
				$('#fp_header_' + v).fadeOut();
				$('#fp_main_' + v).fadeOut();
				$('#fp_links_' + v).fadeOut();
				$('#fp_select_' + v).fadeOut();
			});
		}
	});
  }*/
  chrome.runtime.onConnect.addListener(function(p){
    port = p;
    port.onMessage.addListener(function(msg){
      if($('#updateBox')[0].checked){
        if($('#'+msg.mainId).length > 0)
          $('#'+msg.mainId).next().addBack().remove();
        $('tr[id^="fp_links"]:last').after(msg.html);
		if(msg.scripts != ''){
		  var script = document.createElement('script');
		  script.textContent = msg.scripts;
	      document.head.appendChild(script);
		}
		if(webm)
		  embedWebm();
        chrome.runtime.sendMessage({text:"isActive",threadId:threadNum});
        addTimers();
      }
    });
  });
});