  var temp = $('.guestbook.user-profile-thin-gb tr:first');
  $(temp).next().toggle();
  $(temp).find('th').css({'width':'200px','-webkit-user-select':'none'});
  $(temp).click(function(){
    $(this).next().toggle();
  });
