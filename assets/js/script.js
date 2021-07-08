var modal = document.getElementById("user-modal-1");
var btn = document.getElementById("search-btn");
var span = document.getElementsByClassName("close")[0];
var modalHeader = $("h3").text("Please, fill out this form.");
var dataFromYelp = [];
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
        $(".user-input-record").append("No results found");
        return;
      }
      //there is one more query parameter key: unique and can be used to search a certain activity
      var activityEl = $("<h3>").text("Activity: " + data.activity);
      // var participantsEl = $("<div>").text("participants: " + data.participants);
      var priceEl = $("<div>").text("Price: " + data.price);
      // var typeEl = $("<div>").text("type: " + data.type);
      var accessibilityEl = $("<div>").text(
        "Accessibility: " + data.accessibility
      );
      var participantsEl = $("<div>").text("Participants: Up to " + data.participants + " person(s)");
    

      // price and accessibility can be displayed using empty or colored star
      $(".user-input-record").html("");
      $(".user-input-record").append(activityEl, priceEl, accessibilityEl, participantsEl);
      console.log(data);
    });
}

for (var i = 0; i < activityType.length; i++) {
  $("#activity-type-select").append($("<option>").text(activityType[i]));
}

// function for Yelp api

function displayMoreDetails(event) {
  $(".detail-result-display").css("display", "block");
  $(".search-result-display").css("display", "none");
  $(".detail-result-display").empty();
  var index = $(this).attr("data-index");
  console.log(dataFromYelp);
  console.log(index);
  businessSelected = dataFromYelp[index];
  var nameEl = $("<div>").text(businessSelected.name);
  var imgURL = businessSelected.image_url;
  var distanceEl = $("<div>").text(businessSelected.distance);
  var imgEl = $("<img>").attr("src", imgURL);
  imgEl.css("float", "right");
  imgEl.css("width", "300px");
  imgEl.css("height", "300px");      
  var phoneEl = $("<div>").text("phone number: " + businessSelected.phone);
  var addressEl = $("<div>").text("address: ");
  addressEl.append($("<p>").text(businessSelected.location.address1));
  addressEl.append($("<p>").text(businessSelected.location.address2));
  addressEl.append($("<p>").text(businessSelected.location.address3));
  addressEl.append($("<p>").text(businessSelected.location.city));
  console.log("add go back button")
  var goBackButton = $("<button>").text("Go Back");
  goBackButton.attr("id", "gobackbutton");
  $(".detail-result-display").append(nameEl, imgEl, distanceEl, addressEl, phoneEl, goBackButton);
}

function displayYelpResult() {
  console.log("I am executed");
  $(".search-result-display").css("display", "flex");
  $(".detail-result-display").css("display", "none");
}

function submitEventHandlerYelp() {
  event.preventDefault();
  $(".search-result-display").empty();
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
      dataFromYelp = []
      for (var i = 0; i < 10; i++) {
        dataFromYelp.push(data.businesses[i]);
        var resEl = $("<div>");
        resEl.attr("data-index", "" + i);
        resEl.addClass("yelp-result");
        var nameEl = $("<div>").text(data.businesses[i].name);
        nameEl.attr("data-index", "" + i);
        var imgURL = data.businesses[i].image_url;
        var distanceEl = $("<div>").text(parseInt(data.businesses[i].distance) + "m");
        distanceEl.attr("data-index", "" + i);
        var imgEl = $("<img>").attr("src", imgURL);
        imgEl.attr("data-index", "" + i);
        imgEl.css("width", "100px");
        imgEl.css("height", "100px");
        resEl.append(nameEl, imgEl, distanceEl);
        $(".search-result-display").append(resEl);

        document
          .querySelector("<img>")
          .addEventListener("click", function (event) {
            imgEl.setAttribute("src", data.businesses[i].url);
          });
        //document.querySelector("<div>").style.display = 'none';
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
$(".detail-result-display").css("display", "none");
// creates both submit buttons
$(document).on("click", "#submit-button", submitEventHandlerBored);
// this button is not located inside the modal
$(document).on("click", "#submit-button-yelp", submitEventHandlerYelp);
$(".search-result-display").on("click", ".yelp-result", displayMoreDetails);
// $("button").on("click", "#gobackbutton", function() {
$(document).on("click", "#gobackbutton", displayYelpResult);
