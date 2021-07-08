var modal = document.getElementById("user-modal-1");
var btn = document.getElementById("search-btn");
var span = document.getElementsByClassName("close")[0];
var modalHeader = $("h3").text("Please, fill out this form.");
var activityType = [
  "random",
  "education",
  "recreational",
  "social",
  "diy",
  "charity",
  "cooking",
  "relaxation",
  "music",
  "busywork",
];
// key: number of participants; value: all possible types of results
// var activityType = {
//   1: ["education", "recreational", "social", "diy", "charity", "cooking", "relaxation", "music", "busywork"],
//   2: ["social"],
//   3: ["social"],
//   4: ["social", "music", "recreational"],
//   5: ["social", "music"]
// }
// GREAT IDEA ^^^

// function to deal with bored api
function submitEventHandlerBored() {
  event.preventDefault();
  // var participants = $("#participants-input").val();
  // var participantsQueryParameter =
    // participants == "" ? "" : "participants=" + participants + "&";
  var typeSelected = $("#activity-type-select").val();

  // display the user input
  // var participantsEl = $("<div>").text("participants: " + participants);
  var typeEl = $("<div>").text("Type: " + typeSelected);
  $(".user-input-record").html("");
  $(".user-input-record").append(typeEl);
  var requestURL =
    "http://www.boredapi.com/api/activity/?" +
    "type=" +
    typeSelected;
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
      var accessibilityEl = $("<div>").text(
        "accessibility: " + data.accessibility
      );
      // price and accessibility can be displayed using empty or colored star
      $(".search-result-display").html("");
      $(".search-result-display").append(activityEl, priceEl, accessibilityEl);
      console.log(data);
    });
}

for (var i = 0; i < activityType.length; i++) {
  $("#activity-type-select").append($("<option>").text(activityType[i]));
}

// function for Yelp api

function submitEventHandlerYelp() {
  event.preventDefault();
  var location = $("#city-input").val();
  //HELP! unsure what the term is in regards to user input
  var term = $("#term-input").val();
  var termQueryParameter = term === "" ? "" : "&term=" + term;
  // drop down menu for selecting budget
  price = $("#price-select").val();
  var priceQueryParameter = price === "" ? "" : "&price=" + price.length;
  var requestURL =
    "https://cors.bridged.cc/https://api.yelp.com/v3/businesses/search?location=" +
    location +
    termQueryParameter +
    priceQueryParameter;
  fetch(requestURL, {
    headers: {
      Authorization:
        "Bearer i5jzi0uL9To_HaeteYpdGCzthane6BIfOQaBq7cjio6JjWlK_xcMrzKEJXiMg2Zti8K2NnY-zkvyrGAyw8J7vqN7hpSRP_b71d2IiKyepW0oMrzrz_jw_IaEcdfkYHYx",
    },
  })
    .then(function (res) {
      console.log(res);
      return res.json();
    })
    .then(function (data) {
      console.log(data);
      for (var i = 0; i < 10; i++) {
        var resEl = $("<div>");
        var nameEl = $("<div>").text(data.businesses[i].name);
        var imgURL = data.businesses[i].image_url;
        var distanceEl = $("<div>").text(data.businesses[i].distance);
        var imgEl = $("<img>").attr("src", imgURL);
        imgEl.css("width", "100px");
        imgEl.css("height", "100px");
        resEl.append(nameEl, imgEl, distanceEl);
        $(".search-result-display").append(resEl);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
}
// the above funtion displays way to many results on the web page
// TODO: style the results into a block set up

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
// creates both submit buttons
$(document).on("click", "#submit-button", submitEventHandlerBored);
// this button is not located inside the modal
$(document).on("click", "#submit-button-yelp", submitEventHandlerYelp);
