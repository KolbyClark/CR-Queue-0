var stuff = JSON.parse($('pre')[0].textContent.replace('/*-secure-','').replace('*/',''));
stuff.data.forEach(function(v){
  var link = $(document.createElement('a'));
  link.attr('href','http://www.crunchyroll.com/user/'+v.label);
  link.text('http://www.crunchyroll.com/user/'+v.label);
  $('body').append(link);
  $('body').append('<br />');
});