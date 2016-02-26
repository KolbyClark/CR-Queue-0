chrome.extension.sendMessage({text:'getBlockedUsers'},function(response){
  $('.showforumtopic-message-user-name').each(function(){
    if(response.indexOf($(this).text().trim()) != -1){
      $(this).parents('tr').hide();
      $(this).parents('tr').next().hide();
    }
  });
});