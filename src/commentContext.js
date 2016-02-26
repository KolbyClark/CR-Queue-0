var username = $('#username_search').val();


$('a:contains(Source)').each(function(i){
  if(this.href.split('/').length==6){
    var n = this.href.split('/')[4].split('-');
    n=n[n.length-1];
    $(this).parent().append('<br /><a id="'+n+'" href="">Context</a>');
    //$(this).remove();
  }
});

$('a:contains(Context)').click(function(e){
  e.preventDefault();
  var thiz=this;
  var body = htmlEscape($(this).parents('tr').children('td.user_comment_search-comment').text());
  var id = "t"+$(this).parents('tr').children('td:last-child').children().val();
  console.log(body);
  //console.log(id);
  $.get("http://www.crunchyroll.com/comments?pg=0&talkboxid=1001-MEDIAKEY_"+this.id+"&sort=date_asc&replycount=1000&threadlimit=10&pagelimit=2000",function(data,thiz){
    var d = JSON.parse(data);
    var i;
    for(var x=0;x<d.length;x++){
      if(d[x].user.name==username&&d[x].comment.id==id){
        i=x;
        break;
      }else if(d[x].children.length > 0){
        var asdf = false;
        for(var y=0;y<d[x].children.length;y++){
          if(d[x].children[y]!==null&&d[x].children[y].user.name==username&&d[x].children[y].comment.id==id){
		    //console.log(d[x].children[y].comment.id);
              i=x;
              asdf=true;
              break;
          }else if(d[x].children[y]!==null&&d[x].children[y].children.length>0){
		    for(var z=0;z<d[x].children[y].children.length;z++){
			  if(d[x].children[y].children[z]!==null&&d[x].children[y].children[z].user.name==username&&d[x].children[y].children[z].comment.id==id){
			    i=x;
                asdf=true;
                break;
			  }
			}
		  }
        }
        if(asdf)
          break;
      }
    }
    var comment = d[i];
    displayComment(comment); 
  });
});
function displayComment(comment){
  var temp = "\n";
  temp += comment.user.name+' - '+comment.comment.body;
  for(var x=0;x<comment.children.length;x++){
    if(comment.children[x]!==null){
	  temp+="\n\t"+comment.children[x].user.name+' - '+comment.children[x].comment.body;
	  if(comment.children[x].children.length>0){
        for(var y=0; y<comment.children[x].children.length;y++){
		  if(comment.children[x].children[y]!==null)
		  temp+="\n\t\t"+comment.children[x].children[y].user.name+' - '+comment.children[x].children[y].comment.body;
		}
      }	  
	}
	  
  }
  console.log(temp);
}


function htmlEscape(str) {
    return String(str)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
}