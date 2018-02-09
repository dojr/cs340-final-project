module.exports = function(hbs) {

  hbs.registerHelper("list",function(items,options){
    var list = "<ul>";
      for (var i=0, l=items.length;i<l; i++){
        list = list + "<li class=yolo>" + options.fn(items[i]) + "</li>";
    }
    return list + "</ul>";
  });
}
