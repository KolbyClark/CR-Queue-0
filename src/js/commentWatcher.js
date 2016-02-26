var series = $('#showmedia_about_episode_num').text().trim();
var episodeString = $('#showmedia_about_episode_num').next().text().trim();
var watchComments = false;
var submitComment = $(document.createElement('input'));
var originToken = $('input[name=origin_token]').first().val();
var guestbookId = $('#guestbook_commentform textarea')[0].id.split('_').splice(0,2).join('_').replace('gb','');
submitComment.attr('id','submitComment');
submitComment.addClass('button medium-button button-padding default-button right');
submitComment.attr('type','button');
submitComment.val('Add Comment');
$('input[name=submit_comment_btn]').after(submitComment);
$('input[name=submit_comment_btn]').detach();
chrome.runtime.sendMessage({text:'getWatchComments'},function(reply){
  if(reply)
    watchComments = true;
});
submitComment.click(function(){
  var postData = {req:'RpcApiGuestbook_AddComment',comment_body:$('textarea.guestbook-form').val(),guestbook_id:guestbookId,origin_token:originToken,mugsize:'small'}
  if($('textarea.guestbook-form').val() == ""||$('textarea.guestbook-form').val() == "Write a comment..."||$('textarea.guestbook-form').val() == "Write something..."){
    alert('Write a longer comment');
  }else{
    $.post('http://www.crunchyroll.com/ajax/',postData,function(data){
	  var tempData = JSON.parse(data.replace('/*-secure-','').replace('*/',''));
	  submitComment.val('Comment Added');
	  $('textarea.guestbook-form').attr('disabled',true);
	  //console.log(tempData);
	  chrome.runtime.sendMessage({text:'findCommentPage',commentId:tempData.data.new_comments_json[0].comment.id,gbId:guestbookId});
	  /*var commentId = tempData.data.new_comments_json[0].comment.id;
	  var url = "http://www.crunchyroll.com/comments?pg=0&talkboxid="+guestbookId+"&sort=date_asc&replycount=0&threadlimit=1&pagelimit=10000";
      $.get(url,function(data){
	    var comments = JSON.parse(data);
		comments.forEach(function(v,i,a){
		  if(v.comment.id == commentId)
		    chrome.runtime.sendMessage({text:'addWatchComment',commentId:commentId,gbId,guestbookId,page:i});
		}
	  });*/
	});
  }
});