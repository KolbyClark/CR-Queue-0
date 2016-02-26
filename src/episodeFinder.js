var test = $('.show-actions');
var video = $('#showmedia_video');
var watchList = [];
var id;
var episodeIds = [];
$('li[id^=showview_videos_media_]').each(function(){episodeIds.push(this.id.split('_')[3]);});

if(test.length > 0 && video.length == 0){
   chrome.runtime.sendMessage({text:"getWatch"}, function(response){
    //console.log("got watchlist: " + response);
    watchList = response;
    placeButton();
	
	//$('.show-actions').on('click','.add-queue-button',function(){placeButton();})
	var target = $('.show-actions').get(0);
	var observer = new MutationObserver(function(mutations){
	  mutations.forEach(function(mutation){
	    if(mutation.addedNodes.length>0){
		  if(mutation.addedNodes[0].classList[1] == "add-queue-button")
		    placeButton();
		}
	  });
	});
	var config = {attributes:false,childList:true,characterData:false};
	observer.observe(target,config);
  });
}
function placeButton(){
  $('.extension').remove();
  id = $(test).attr("group_id");
  //console.log(id);
  var spacing = $('.resume-play-text').text().trim();
  
    $(test).append('<button class="extension  queue-button in-queue in-list" type="button" style="opacity: 1; float: right; margin-right: 3.6rem;"><div  style="opacity: 1;  align-items: center;display:inline-flex;"></div></button>');
    $('.in-list div').append('<svg class="queue-icon" viewBox="0 0 48 48" style="opacity: 1;"></svg>');
    $('.in-list div').append('<span class="queue-label">Unwatched</span>');
    var imgUrl = chrome.runtime.getURL("checkmark_white_in.svg");
    $('.in-list .queue-icon').append('<use xlink:href="'+imgUrl+'" style="opacity: 1;"></use>')
    $('.in-list').click(function(e){
	  e.stopPropagation();
      chrome.runtime.sendMessage({text:"remWatch", mediaId:id, episodes:episodeIds}, function(response){
        var n = watchList.indexOf(id);
        watchList.splice(n,1);
        $('.in-list,.not-in-list').toggle();
		$('div.episode-progress').each(function(){$(this).width(0);});
      });
    });
	$(test).append('<button class="extension queue-button  not-queued not-in-list" type="button" style="opacity: 1; float: right; margin-right: 2.5rem;"><div  style="opacity: 1;align-items: center;display:inline-flex;"></div></button>');
    $('.not-in-list div').append('<svg class="queue-icon" viewBox="0 0 48 48" style="opacity: 1;"></svg>');
    $('.not-in-list div').append('<span class="queue-label">Mark Watched</span>');
    var imgUrl = chrome.runtime.getURL("checkmark_white.svg");
    $('.not-in-list .queue-icon').append('<use xlink:href="'+imgUrl+'" style="opacity: 1;"></use>')
    $('.not-in-list').click(function(e){
	  e.stopPropagation();
	  episodeIds.reverse();
	  chrome.runtime.sendMessage({text:"addWatch", mediaId:id, episodes:episodeIds}, function(response){
        episodeIds.reverse();
		watchList.push(id);
        $('.in-list,.not-in-list').toggle();
        $('div.episode-progress').each(function(){$(this).width(127);});		
      });
	  
    });
  if(watchList.indexOf(id) > -1)
    $('.not-in-list').hide();
  else
    $('.in-list').hide();
  if(spacing.includes('Start')){
    $('.not-in-list').css({'margin-right':'3.8rem'}); 
	$('.in-list').css({'margin-right':'5rem'}); 
  }
  placeResetButton();
}
function placeResetButton(){
  $(test).append('<button class="extension  queue-button in-queue reset" type="button" style="opacity: 1; display:block; margin-right: 3.6rem;"><div  style="opacity: 1;  align-items: center;display:inline-flex;"></div></button>');
  $('.reset div').append('<svg class="queue-icon" viewBox="0 0 48 48" style="opacity: 1;"></svg>');
  $('.reset div').append('<span class="queue-label">Reset Views</span>');

  $('.reset').click(function(e){
    e.stopPropagation();
    var mediaIds = [];
    $('li[id^=showview_videos_media_]').filter(function(){return $(this).find('div.episode-progress').width()> 0}).each(function(){
	  mediaIds.push(this.id.split('_')[3]);
	});
	chrome.runtime.sendMessage({text:"resetWatch", mediaIds:mediaIds},function(reply){
	  if(reply == "go")
	    $('div.episode-progress').each(function(){$(this).width(0);});	  
	});
  });
}


$('div#subtabs_videos').append('<a id="showMarks" class="left block-link sub-tabs-category">Mark Episodes</a><a id="hideMarks" class="left block-link sub-tabs-category" style="display:none">Hide Marks</a>');
$('#showMarks').click(function(){
  $('#showMarks,#hideMarks').toggle();
  addCheckMarks();
});
$('#hideMarks').click(function(){
  $('#showMarks,#hideMarks').toggle();
  remCheckMarks();
});
var imgUrl = chrome.runtime.getURL("checkmark.png");
var imgUrlbw = chrome.runtime.getURL("checkmark_bw.png");

function addCheckMarks(){
  $("li.hover-bubble .watch-box").remove();
  $('li[id^=showview_videos_media]>div.wrapper').prepend('<img class="watch-box" style="position:absolute; border:none;z-index:99;top:13px;left:13px;"></img>');
  $('.watch-box').attr('id', function(){
    var par = $(this).parents('li');
    return "box_" + $(par).attr('id').split('_')[3];
  });
  var imgUrlbw = chrome.runtime.getURL("checkmark_bw.png");
  $('.watch-box').attr({'src': imgUrlbw});
  $('li.hover-bubble').filter(function(){return $(this).find('div.episode-progress').width()> 107}).each(function(){
    
    $(this).find('.watch-box').attr({'src': imgUrl});      
  });
  $('.watch-box').click(function(){
    var imgUrl = chrome.runtime.getURL("checkmark.png");
    
    var par = $(this).parents('li[id^=showview_videos]');
    var id = $(par).attr('id').split('_')[3];
    if($(par).find('div.episode-progress').width() > 107)
      markUnwatch(id,par);
    else
      markWatch(id,par);
  });
}
function remCheckMarks(){
  $("li.hover-bubble .watch-box").remove();
}

function markWatch(mediaId,par){
  chrome.runtime.sendMessage({text:'markWatched',mediaId:mediaId},function(reply){
    if(reply == 'go'){
	  $('#box_'+mediaId).attr({'src': imgUrl});
	  $(par).find('div.episode-progress').width('100%');
	}
  });
}
function markUnwatch(mediaId,par){
  chrome.runtime.sendMessage({text:'markUnwatched',mediaId:mediaId},function(reply){
    if(reply == 'go'){
	  $('#box_'+mediaId).attr({'src': imgUrlbw});
	  $(par).find('div.episode-progress').width(0);
	}
  });
}