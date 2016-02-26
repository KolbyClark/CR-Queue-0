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

Page.countup_timer_stepper = new CountupTimerStepper();
Page.countup_timer_stepper.start();

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
}
function addTimers(){
  $('td.widget-forumcategory-display-lastaction>div:first-child').each(function(){
    var id = "timer_" + $(this).parents('tr')[0].id.split('_')[1];
    this.outerHTML = '<span id="'+id+'">'+$(this).text()+'</span>';
    if($(this).text().indexOf('/') == -1)
      createTimer(id,$(this).text().split(' ')[0],$(this).text().split(' ')[1]);
  });
};
  
$(function(){
  addTimers();
  var location = window.location.toString();
  var start = location.indexOf('gory-')+5;
  var stop  = location.indexOf('/',start);
  var forumNum = location.substring(start,stop);
  var port;
  var forumName = $('.widget-forumcategory-header-title').text();
  $('#template_action_button').prepend('<input class="submitbtn" id="watch_forum" type="button" value="Watch" style="float:right;display:block;padding-right:6px;margin-left: 4px;">','<input class="submitbtn" id="unwatch_forum" type="button" value="Unwatch" style="float:right;display:block;padding-right:6px;margin-left: 4px;">');
  $('#template_action_button').prepend('<input type="checkbox" id="updateBox"style="float:right;display:block;padding-right:6px;margin-left: 4px;margin-top:5px;">');
  $('#unwatch_forum').hide();
  chrome.runtime.sendMessage({text:'getForum'},function(response){
    response.forEach(function(v,i,a){
      if(v.forumId == forumNum){
        $('#watch_forum').toggle();
        $('#unwatch_forum').toggle();
        $('#updateBox').prop('checked', true);
        chrome.runtime.sendMessage({text:"openPort",portName:"forum-"+forumNum});
      }
    });
  });
  $('#watch_forum').click(function(){
    chrome.runtime.sendMessage({text:"addForum", forumId:forumNum, forumName:forumName});
    $('#watch_forum').toggle();
    $('#unwatch_forum').toggle();
  });
  $('#unwatch_forum').click(function(){
    chrome.runtime.sendMessage({text:"remForum", forumId:forumNum});
    $('#watch_forum').toggle();
    $('#unwatch_forum').toggle();
  });
  $('#updateBox').change(function(){
    if($('#updateBox')[0].checked)
      chrome.runtime.sendMessage({text:"openPort",portName:"forum-"+forumNum});
    else if(port)
      chrome.runtime.sendMessage({text:"closePort",port:port.name});
  });
  chrome.runtime.onConnect.addListener(function(p){
    port = p;
    port.onMessage.addListener(function(newThreads){
	  newThreads.forEach(function(msg){
      //console.log(msg.name);
	    var tempTR = $(document.createElement('tr'));
		tempTR.html(msg.html);
		tempTR.attr('id',msg.parentId);
        if($('#updateBox')[0].checked){
          if($('tr[id^="forumtopic_'+msg.threadId+'"]').length != 0)
            $('tr[id^="forumtopic_'+msg.threadId+'"]').detach();
          if(forumNum == "394638" || forumNum == "394636" || forumNum == "391306" || forumNum == "391308"   || forumNum == "391314")
            $('table.widget-forumcategory-display>tbody>tr:first-child').after(tempTR);
          else
            $('.widget-forumcategory-display-title').parent(':has(td:first img[src*="sticky"])').filter(':last').after(tempTR);
        }
	  });
	  addTimers();
    });
  });
});