$('li.has-num').click(function(){
  chrome.runtime.sendMessage({text:"notify"});
});
$(':contains(Bieber)').parents('.welcome-crnews-item,.news-item').remove();