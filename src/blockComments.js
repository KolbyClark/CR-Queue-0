function hideComments(){
  chrome.extension.sendMessage({text:'getBlockedUsers'},function(response){
    $('div.guestbook-name').each(function(){
      if(response.indexOf($(this).text().trim()) != -1){
        $(this).parents('li').hide();
      }
    });
  });
}
hideComments();
$('body').on('click','div.more-replies,input.more_comments',function(){setTimeout(hideComments,1000)});
var target = $('ul#allCommentsList').get(0);
var observer = new MutationObserver(function(mutations){
  for(var x=0;x<mutations.length;x++){
    var newNodes = mutations[x].addedNodes;
	if(newNodes !== null){
	  hideComments();
	}
  }
});

var config = {childList: true};
observer.observe(target,config);
