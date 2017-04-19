function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

var mydata;
var uid = getUrlVars()["uid"];

$.ajax({
	async: false,
	url: 'https://campusorderingsystem.firebaseio.com/restaurant/'+ uid + '.json',
  method: "GET",

  processData: false,
  contentType: false,

  dataType: 'json',
  success: function (json) {
  	mydata = json;
  },

  error: function () {
    console.log("Bye");
  }

});

function postJson(param){
  $.ajax({
      async: true,
      crossDomain: true,
      url: 'https://campusorderingsystem.firebaseio.com/restaurant/'+uid+'.json',
      data : JSON.stringify(param),
      type : 'PATCH',
      contentType : 'application/json',
      processData: false,
      dataType: 'json',
      success: function(data) {
        console.log(data);
      },
      error: function (e) {

      }
  });
  setTimeout(function(){location.reload();},2500);
}

console.log(mydata);
var inputSize = 0;
if(mydata){
$.each(mydata.menu, function(i, f) {
  $(document.getElementById("addElement")).append('<h2>' + f.name + '</h2>');
  $(document.getElementById("addElement")).append('<div class="control-group" id="fields">'
        + '<div class="controls">'
        + '<form role="form" autocomplete="off">'
        + '<div class="entry input-group col-xs-3">'
        + '<input class="form-control" style="width:250px" name="'+f.name+'" type="text" placeholder="Name" />'
        + '<input class="form-control" style="width:250px" name="'+f.name+'" type="text" placeholder="Price" />'
        + '<span class="input-group-btn">'
        + '<button class="btn btn-success btn-add" type="button">'
        + '<span class="glyphicon glyphicon-plus"></span>'
        + '</button>'
        + '</span>'
        + '</div>'
        + '</form>'
        + '<br>'
        + '</div>'
        + '</div>');
  $(document.getElementById("currentMenu")).append("<h2 style='text-align:center'>" + f.name + "</h2>");
  $(document.getElementById("currentMenu")).append('<table class="table" id="myTable'+i+'"><tbody id="TBody'+i+'"></tbody></table>');
  $.each(f.submenu, function(j, g){
    var z = document.getElementById("TBody"+i);
    $(z).append('<tr><td></td><td></td></tr>');
    x = document.getElementById("myTable"+i).rows[j].cells;
    $(x[0]).append("<h3>" + g.name + "</h3>");
    $(x[1]).append("<h3> Rs. " + g.price + "</h3>")
  });
});

var Menu = mydata.menu;
var len = Menu.length;
var menuClasses = new Array(len);
var response;

}


$(function()
{
    $(document).on('click', '.btn-add', function(e)
    {
        e.preventDefault();

        var controlForm = $('.controls form:first'),
            currentEntry = $(this).parents('.entry:first'),
            newEntry = $(currentEntry.clone()).appendTo(controlForm);

        newEntry.find('input').val('');
        controlForm.find('.entry:not(:last) .btn-add')
            .removeClass('btn-add').addClass('btn-remove')
            .removeClass('btn-success').addClass('btn-danger')
            .html('<span class="glyphicon glyphicon-minus"></span>');
    }).on('click', '.btn-remove', function(e)
    {
		$(this).parents('.entry:first').remove();

		e.preventDefault();
		return false;
	});
});

function updateJSON(){
  $.each(mydata.menu, function(i, f){
    var curr = document.getElementsByName(f.name);
    $.each(curr, function(j, g){
      if(j%2 == 0 && curr[j].value){
        var item = '{"name":"' + g.value + '", "price":' + curr[j+1].value + ' }';
        var newItem = jQuery.parseJSON(item);
        f.submenu.push( newItem );
      }
    });
  });
  postJson(mydata);
}

function removeJSON(){
  var i=0, j=0, k=0;
  while(i < mydata.menu.length){
    var curr = document.getElementsByName(mydata.menu[i].name);
    j=0;
    while(j < curr.length && curr[j].value){
      k = 0;

      while(k < mydata.menu[i].submenu.length){
        console.log(j,k,mydata.menu[i].submenu[k].name,curr[j].value);
        if(mydata.menu[i].submenu[k].name == curr[j].value){
          //console.log(j,k);
          mydata.menu[i].submenu.splice(k,1);
          break;
        }
        k++;
      }
      j=j+2;
    }
    i++;
  }
  postJson(mydata);
}


$(document.getElementById("addElement")).append('<button style="width:150px;margin-right:15px" type="button" onclick="updateJSON()" class="btn btn-success btn-md">Add</button>');
$(document.getElementById("addElement")).append('<button style="width:150px" type="button" class="btn btn-success btn-md" onclick="removeJSON()">Remove</button>');
