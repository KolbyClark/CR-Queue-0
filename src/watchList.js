var watchList = [];
var all;
var watched;
var unwatched;
var cur = 1;
var firstLoad = true;
function getWatch(){
  chrome.runtime.sendMessage({text:"getWatch"}, function(response){
    console.log("got watchlist: " + response);
    watchList = response;
    addCheckboxes();    
  });
}
getWatch();

$('.sub-tabs-menu').append('<a id="unwatch_filter" class="block-link hidden-link sub-tabs-category">Hide watched</a>','<a id="watch_filter" class="block-link sub-tabs-category">Show Watched</a>');



/*$(window).scroll(function(){
  updateList();
});*/
$('#unwatch_filter').click(function(){
  $(this).toggleClass("hidden-link");
  $('#watch_filter').toggleClass("hidden-link");
  cur = 1;
  removeWatch(1);
});
$('.load-more').click(function(){
  updateList();
});
$('#watch_filter').click(function(){
  $(this).toggleClass("hidden-link");
  $('#unwatch_filter').toggleClass("hidden-link");
  cur = 0;
  removeWatch(0);
});
function removeWatch(opt){
  if(opt){
    $('.portrait-grid').children().detach();
    unwatched.appendTo($('.portrait-grid'));
  }
  else{
    $('.portrait-grid').children().detach();
    all.appendTo($('.portrait-grid'));
  }
}
function addToList(id){
  if(watchList.indexOf(id) == -1)
    watchList.push(id);
  var selec = "#media_group_" + id;
  watched = watched.add(selec);
  unwatched = unwatched.not(selec);
  console.log("adding id:" + id);
  chrome.runtime.sendMessage({text:"addWatch", mediaId:id});
}
function remFromList(id){
  var n = watchList.indexOf(id);
    watchList.splice(n,1);
  var selec = "#media_group_" + id;
  watched = watched.not(selec);
  unwatched = unwatched.add(selec);
  console.log("removing id:" + id);
  chrome.runtime.sendMessage({text:"remWatch", mediaId:id});
}
function updateList(){
  
  var newa = $('li.hover-bubble').not(all);
  if(newa.length > 0 && !newa.is(all)){
    addCheckboxes();
    all = all.add(newa);
    watched = all.filter(function(index){return watchList.indexOf($(this).attr("group_id")) > -1;});
    unwatched = all.filter(function(index){return watchList.indexOf($(this).attr("group_id")) == -1;});
    removeWatch(cur);
  }
}

  
function addCheckboxes(){
  console.log("remove old boxes");
  $("li.hover-bubble span.watch-box").remove();
  console.log("add new ones");
  $('li.hover-bubble > .hover-toggle-queue').append('<span class="watch-box"></span>');
  console.log("tag them");
  $('.watch-box').attr('id', function(){
    var par = this.offsetParent;
    return "box_" + $(par).attr('group_id');
  });
  console.log("check them");
  var imgUrlbw = "url('"+chrome.runtime.getURL("checkmark_bw.png")+"')";
  $('.watch-box').css({'background-image': imgUrlbw, 'background-repeat': 'no-repeat'});
  watchList.forEach(function(element, index, array){
    var id = "#box_" + element;
    var box = $(id);
    var imgUrl = "url('"+chrome.runtime.getURL("checkmark.png")+"')";
    
    if(box.length > 0)
      $(box).css({'background-image': imgUrl, 'background-repeat': 'no-repeat'});      
  });
  $('.watch-box').click(function(){
    var imgUrl = "url('"+chrome.runtime.getURL("checkmark.png")+"')";
    
    var par = this.offsetParent;
    id = $(par).attr('group_id');
    console.log(id);
    if(watchList.indexOf(id)>-1){
      remFromList(id);
      $(this).css({'background-image': imgUrlbw, 'background-repeat': 'no-repeat'});
    }
    else{
      addToList(id);
      $(this).css({'background-image': imgUrl, 'background-repeat': 'no-repeat'});
   }
   removeWatch(cur);

  });
  if(firstLoad){
    all = $('li.hover-bubble').detach();
    watched = all.filter(function(index){return watchList.indexOf($(this).attr("group_id")) > -1;});
    unwatched = all.filter(function(index){return watchList.indexOf($(this).attr("group_id")) == -1;});
    unwatched.appendTo($('.portrait-grid'));
    firstLoad= false;
  }
}

var target = $('div#main_content>ul').get(0);
var observer = new MutationObserver(function(mutations){
  for(var x=0;x<mutations.length;x++){
    var newNodes = mutations[x].addedNodes;
	if(newNodes !== null){
	  updateList();
	}
  }
});

var config = {childList: true};
observer.observe(target,config);