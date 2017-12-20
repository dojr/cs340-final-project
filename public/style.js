function deleteUser(id){
    $.ajax({
        url: '/signup/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};

function getBeerData(){

    var selection = document.getElementById("beer");
    id = selection.options[selection.selectedIndex].value;
    $.get({
        url: '/beer/' + id,
        success: function(result){
            window.location.href = '/beer/' + id;
        }
    })
};


function getBrewData(){

  var selection = document.getElementById("brew");
  id = selection.options[selection.selectedIndex].value;
  url =  '/brew/' + id;
  document.location.href = url;

    // $.get({
    //     url: '/brew/' + id,
    //     success: function(result){
    //         window.location.href  =  '/brew/' + id;
    //     }
    // })
};

function updateBeerComment(bID, cID){
    $.ajax({
      url: '/beer/' + bID + '/' + cID,
      type: 'PUT',
      data: $('#beer-com').serialize(),
      success: function(result){
        window.location.replace("./");
      }
    })
};

function updateBrewComment(bID, cID){
    $.ajax({
      url: '/brew/' + bID + '/' + cID,
      type: 'PUT',
      data: $('#brew-com').serialize(),
      success: function(result){
        window.location.replace("./");
      }
    })
};

function deleteBeer(id){
  $.ajax({
      url: '/beer/' + id,
      type: 'DELETE',
      success: function(result){
          window.location.reload(true);
      }
  })
}

// function comment_on_one_only()
// {
//   var selects = $("select")
//   if (selects[0].value == true)
//   {
//     for(i=0; i<selects[1].length; i++ )
//     {
//         selects[1].selectedIndex = -1;
//     }
//
//   }
// };

// function changeOption()
// {
//   var selection = document.getElementById("bOption");
//   var searchList = document.getElementById("navbar-search-input");
//   var option = selection.options[selection.selectedIndex].value;
//
//   console.log(option);
//   if(option == "beer"){
//     searchList
//   }
//
//
//   if(option == "brewery"){
//
//   }
// }
