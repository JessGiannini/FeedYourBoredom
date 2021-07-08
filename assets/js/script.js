var modal = document.getElementById("user-modal-1");
var btn = document.getElementById("search-btn");
var span = document.getElementsByClassName("close")[0];
var modalHeader = $("h3").text("Please, fill out this form.");
var activityType = ["random", "education", "recreational", "social", "diy", "charity", "cooking", "relaxation", "music", "busywork"];
// key: number of participants; value: all possible types of results
// var activityType = {
//   1: ["education", "recreational", "social", "diy", "charity", "cooking", "relaxation", "music", "busywork"],
//   2: ["social"],
//   3: ["social"],
//   4: ["social", "music", "recreational"],
//   5: ["social", "music"]
// }



// function to deal with bored api
function submitEventHandler() {
  event.preventDefault();
  var participants = $("#participants-input").val();
  var participantsQueryParameter = participants == "" ? ""
                                        : "participants=" + participants + "&";
  var typeSelected = $("#activity-type-select").val();

  // display the user input
  var participantsEl = $("<div>").text("participants: " + participants);
  var typeEl = $("<div>").text("Type: " + typeSelected);
  $(".user-input-record").html("");
  $(".user-input-record").append(participantsEl, typeEl);
  var requestURL = "http://www.boredapi.com/api/activity/?" + participantsQueryParameter + "type=" + typeSelected; 
  fetch(requestURL)
  .then(function (res) {
    return res.json();
  })
  .then(function (data) {
    if (data.error != undefined) {
      $(".search-result-display").append("No results found");
      return;
    }
    //there is one more query parameter key: unique and can be used to search a certain activity
    var activityEl = $("<h3>").text("activity: " + data.activity);
    // var participantsEl = $("<div>").text("participants: " + data.participants);
    var priceEl = $("<div>").text("price: " + data.price);
    // var typeEl = $("<div>").text("type: " + data.type);
    var accessibilityEl = $("<div>").text("accessibility: " + data.accessibility);
    // price and accessibility can be displayed using empty or colored star
    $(".search-result-display").html("");
    $(".search-result-display").append(activityEl, priceEl, accessibilityEl);
    console.log(data);
  });
}

for(var i = 0; i < activityType.length; i++) {
  $("#activity-type-select").append($("<option>").text(activityType[i]));
}

fetch(
  "https://cors.bridged.cc/https://api.yelp.com/v3/businesses/search?location=san%20jose",
  {
    headers: {
      Authorization:
        "Bearer i5jzi0uL9To_HaeteYpdGCzthane6BIfOQaBq7cjio6JjWlK_xcMrzKEJXiMg2Zti8K2NnY-zkvyrGAyw8J7vqN7hpSRP_b71d2IiKyepW0oMrzrz_jw_IaEcdfkYHYx",
    },
  }
)
  .then(function (res) {
    console.log(res);
    return res.json();
  })
  .then(function (data) {
    console.log(data);
  })
  .catch(function (err) {
    console.log(err);
  });


// When the user clicks on the button, open the modal
btn.onclick = function () {
  modal.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

$(document).on("click", "#submit-button", submitEventHandler)
