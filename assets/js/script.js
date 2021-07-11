var modal = document.getElementById("user-modal-1");
var btn = document.getElementById("search-btn");
var span = document.getElementsByClassName("close")[0];
var modalHeader = $("h3").text("Please, fill out this form.");
var dataFromYelp = [];
var businessesSaved = [];
var activitiesSaved = [];
var largeMap;
var activityType = [
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

function loadActivitiesSaved() {
  activitiesSaved = JSON.parse(localStorage.getItem("activitiesSaved"));
  if (activitiesSaved === null) {
    activitiesSaved = [];
  } else {
    listActivitiesSaved();
  }
}

function clearActivities() {
  activitiesSaved = [];
  localStorage.removeItem("activitiesSaved");
  $(".favorite-activity-box").children(".activity-saved").remove();
}

function clearBusinesses() {
  businessesSaved = [];
  localStorage.removeItem("businessesSaved");
  $(".favorite-business-box").children(".business-saved").remove();
}

// check localStorage
//load and display the businesses saved if any
function loadBusinessesSaved() {
  businessesSaved = JSON.parse(localStorage.getItem("businessesSaved"));
  if (businessesSaved === null) {
    businessesSaved = [];
  } else {
    listBusinessesSaved();
  }
}

function listActivitiesSaved() {
  for (var i = 0; i < activitiesSaved.length; i++) {
    var nameEl = $("<div>").text(activitiesSaved[i].name);
    nameEl.attr("data-id", activitiesSaved[i].id);
    nameEl.addClass("activity-saved panel-block");
    $(".favorite-activity-box").prepend(nameEl);
  }
}

function listBusinessesSaved() {
  for (var i = 0; i < businessesSaved.length; i++) {
    var nameEl = $("<div>").text(businessesSaved[i].name);
    nameEl.attr("data-id", businessesSaved[i].id);
    nameEl.addClass("business-saved panel-block");
    $(".favorite-business-box").prepend(nameEl);
  }
}

function displaySelectedTab() {
  $(".tabs li").removeClass();
  $(this).parent().addClass("is-active");
  displayTabContent($(this).attr("id"));
}

function displayTabContent(idActive) {
  if (idActive === "search-tab") {
    $(".new-search").show();
    $(".favorite-activity-box").hide();
    $(".favorite-business-box").hide();
  } else if (idActive === "activity-tab") {
    $(".new-search").hide();
    $(".favorite-activity-box").show();
    $(".favorite-business-box").hide();
  } else if (idActive === "business-tab") {
    $(".new-search").hide();
    $(".favorite-activity-box").hide();
    $(".favorite-business-box").show();
  }
}

// function to deal with bored api
function submitEventHandlerBored(event) {
  event.preventDefault();
  var requestURL =
    "https://www.boredapi.com/api/activity/?type=" +
    $("#activity-type-select").val();
  fetch(requestURL)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      if (data.error != undefined) {
        $(".activity-result-display").append("No results found");
        return;
      } else {
        displayActivityDetails(data);
        var saveActivityButton = $("<button>")
          .text("Star")
          .attr("id", "save-activity-button")
          .attr("data-id", data.key)
          .attr("data-name", data.activity)
          .addClass("button mb-3 ml-5");
        $(".activity-result-display").append(saveActivityButton);
      }
    });
}

for (var i = 0; i < activityType.length; i++) {
  $("#activity-type-select").append($("<option>").text(activityType[i]));
}

function displayActivitySaved() {
  var key = $(this).attr("data-id");
  var requestURL = "https://www.boredapi.com/api/activity/?key=" + key;
  fetch(requestURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data != undefined) {
        displayActivityDetails(data);
      }
    });
}

function displayActivityDetails(activityData) {
  var activityEl = $("<div>")
    .text(activityData.activity)
    .addClass("card-header-title is-size-3");
  var cardHeader = $("<div>").addClass("card-header").append(activityEl);
  var priceLabel = $("<span>").text("Price: ").addClass("has-text-weight-bold");
  var priceEl = $("<div>")
    .append(priceLabel)
    .append(" " + activityData.price * 10 + "/10");
  var accessibilityLabel = $("<span>")
    .text("Accessibility: ")
    .addClass("has-text-weight-bold");
  var accessibilityEl = $("<div>")
    .append(accessibilityLabel)
    .append(" " + activityData.accessibility * 10 + "/10");
  var participantsLabel = $("<span>")
    .text("Participants suggested: ")
    .addClass("has-text-weight-bold");
  var participantsEl = $("<div>")
    .append(participantsLabel)
    .append(" " + activityData.participants + " person(s)");
  var cardContent = $("<div>")
    .addClass("card-content")
    .append(priceEl, accessibilityEl, participantsEl);
  // price and accessibility can be displayed using empty or colored star
  $(".activity-result-display").html("");
  $(".activity-result-display").append(cardHeader, cardContent);
}

function displayBusinessSaved() {
  var id = $(this).attr("data-id");
  var requestURL =
    "https://cors.bridged.cc/https://api.yelp.com/v3/businesses/" + id;
  fetch(requestURL, {
    headers: {
      Authorization:
        "Bearer i5jzi0uL9To_HaeteYpdGCzthane6BIfOQaBq7cjio6JjWlK_xcMrzKEJXiMg2Zti8K2NnY-zkvyrGAyw8J7vqN7hpSRP_b71d2IiKyepW0oMrzrz_jw_IaEcdfkYHYx",
    },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data != undefined) {
        displayBusinessDetails(data);
      }
    });
}

function fetchDetails() {
  var indexOfYelpResult = $(this).attr("data-index");
  displayBusinessDetails(dataFromYelp[indexOfYelpResult]);
  var goBackButton = $("<button>")
    .text("Go Back")
    .attr("id", "go-back-button")
    .addClass("button");
  var saveBusinessButton = $("<button>")
    .text("Star")
    .attr("id", "save-business-button")
    .attr("data-index", indexOfYelpResult)
    .addClass("button");
  var cardFooter = $("<div>")
    .addClass("mt-2 is-flex is-justify-content-space-between")
    .append(goBackButton, saveBusinessButton);
  $(".business-details-display")
    .children(".card-content")
    .first()
    .append(cardFooter);
}

function displayBusinessDetails(businessSelected) {
  $(".business-details-display").removeClass("is-hidden").addClass("is-flex");
  $(".businesses-result-display").removeClass("is-flex").addClass("is-hidden");
  $(".business-details-display").empty();
  console.log(businessSelected);
  var cardContent = $("<div>").addClass("card-content  p-3");
  var nameEl = $("<div>")
    .text(businessSelected.name)
    .addClass("is-size-3-desktop is-size-4-tablet is-size-5-mobile has-text-weight-bold");
  var priceLabel = $("<span>").text("Price:").addClass("has-text-weight-bold");
  var priceEl = $("<div>")
    .append(priceLabel)
    .append(" " + businessSelected.price);
  var ratingLabel = $("<span>")
    .text("Rating:")
    .addClass("has-text-weight-bold");
  var ratingEl = $("<div>")
    .append(ratingLabel)
    .append(" " + businessSelected.rating + "/5");
  var distance = parseInt(businessSelected.distance);
  var distanceLabel = $("<span>")
    .text("Distance from the center of the city:")
    .addClass("has-text-weight-bold");
  var distanceEl = $("<div>");
  var phoneNumber = $("<a>")
    .text(businessSelected.phone)
    .attr("href", "tel:" + businessSelected.phone);
  var phoneLabel = $("<span>")
    .text("Phone number: ")
    .addClass("has-text-weight-bold");
  var phoneEl = $("<div>").append(phoneLabel).append(phoneNumber);
  var address = $("<a>")
    .append($("<p>").text(businessSelected.location.address1))
    .append($("<p>").text(businessSelected.location.address2))
    .append($("<p>").text(businessSelected.location.address3))
    .append($("<p>").text(businessSelected.location.city));
  var addressLabel = $("<span>")
    .text("Address: ")
    .addClass("has-text-weight-bold");
  var addressEl = $("<div>").append(addressLabel).append(address);
  var imgURL = businessSelected.image_url;
  var imgEl = $("<img>")
    .attr("src", imgURL)
    .attr("alt", "Image for Business")
    .addClass("card-image p-3")
    .attr("id", "business-details-image");
  var mapEl = $("<div></div>")
    .addClass("map")
    .attr("id", "small-map")
    .css("width", "200px")
    .css("height", "200px");
  if (!isNaN(distance)) {
    distanceEl.append(distanceLabel).append(" " + distance + "m");
  }

  address
    .attr("href", "https://www.google.com/maps/place/" + address.text())
    .attr("target", "_blank");

  cardContent.append(
    nameEl,
    priceEl,
    ratingEl,
    distanceEl,
    phoneEl,
    addressEl,
    mapEl
  );
  $(".business-details-display").append(imgEl, cardContent);
  // var pointFeature = new ol.Feature(new ol.geom.Point([businessSelected.coordinates.longitude, businessSelected.coordinates.latitude]));

  $(document).ready(function () {
    var map = new ol.Map({
      target: "small-map",
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM(),
        }),
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat([
          businessSelected.coordinates.longitude,
          businessSelected.coordinates.latitude,
        ]),
        zoom: 18,
      }),
    });
  });

  // create map modal
  var mapModal = $("<div>").addClass("modal").attr("id", "map-modal");
  mapModal.html(
    '<div class="modal-background"></div>' +
      '<div class="modal-content ml-auto mr-auto">' +
        '<div id="large-map" class="map"></div>' +
      '</div>' +
      '<button id="map-modal-close" class="modal-close is-large" aria-label="close">X</button>'
  );
  $(document).ready(function () {
    largeMap = new ol.Map({
      target: "large-map",
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM(),
        }),
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat([
          businessSelected.coordinates.longitude,
          businessSelected.coordinates.latitude,
        ]),
        zoom: 18,
      }),
    });
  });
  $(".search-result-section").append(mapModal);
}

function saveBoredResult() {
  var relistNeeded = false;
  var name = $(this).attr("data-name");
  var id = $(this).attr("data-id");
  var resultToAdd = {
    name: name,
    id: id,
  };
  var nameEl = $("<div>").text(name);
  nameEl.attr("data-id", id);
  nameEl.addClass("activity-saved panel-block");

  if (activitiesSaved === null) {
    activitiesSaved = [];
  }

  for (var i = 0; i < activitiesSaved.length; i++) {
    if (activitiesSaved[i].id === id) {
      activitiesSaved.splice(i, 1);
      i--;
      relistNeeded = true;
    }
  }
  activitiesSaved.push(resultToAdd);
  localStorage.setItem("activitiesSaved", JSON.stringify(activitiesSaved));
  if (relistNeeded) {
    $(".favorite-activity-box").children(".activity-saved").remove();
    listActivitiesSaved();
  } else {
    $(".favorite-activity-box").prepend(nameEl);
  }
}

function saveYelpResult() {
  var index = $(this).attr("data-index");
  var business = dataFromYelp[index];
  var nameEl = $("<div>").text(business.name);
  var relistNeeded = false;
  nameEl.attr("data-id", business.id);
  nameEl.addClass("business-saved panel-block");
  var resultToAdd = {
    name: business.name,
    id: business.id,
  };
  if (businessesSaved === null) {
    businessesSaved = [];
  }
  for (var i = 0; i < businessesSaved.length; i++) {
    if (businessesSaved[i].id === business.id) {
      businessesSaved.splice(i, 1);
      i--;
      relistNeeded = true;
    }
  }
  businessesSaved.push(resultToAdd);
  localStorage.setItem("businessesSaved", JSON.stringify(businessesSaved));
  if (relistNeeded) {
    $(".favorite-business-box").children(".business-saved").remove();
    listBusinessesSaved();
  } else {
    $(".favorite-business-box").prepend(nameEl);
  }
}

function displayYelpResult() {
  $(".businesses-result-display").removeClass("is-hidden").addClass("is-flex");
  $(".business-details-display").removeClass("is-flex").addClass("is-hidden");
}

function submitEventHandlerYelp() {
  event.preventDefault();
  $(".business-details-display").removeClass("is-flex").addClass("is-hidden");
  $(".businesses-result-display").removeClass("is-hidden").addClass("is-flex");
  $(".businesses-result-display").empty();
  var location = $("#city-input").val();
  var term = $("#term-input").val();
  var termQueryParameter = term === "" ? "" : "&term=" + term;
  var priceQueryParameter = "";
  // drop down menu for selecting budget
  price = $("#price-select").val();
  console.log(price);
  if (price.length != 0 && !price.includes("Any Price Range")) {
    for (var priceSelected of price) {
      priceQueryParameter += priceSelected.length + ",";
    }
    priceQueryParameter = "&price=" + priceQueryParameter.slice(0, -1);
  }
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
      var message ="";
      if (data.error !== undefined) {
        if (data.error.code === "VALIDATION_ERROR") {
          message = data.error.field + data.error.description.substring(2);
        } else if (data.error.code === "LOCATION_NOT_FOUND") {
          message = data.error.description;
        }
      } else if(data.businesses.length === 0) {
        message = "No business found";
      } else {
        var index = 0;
        function getYelpResults(ind) {
          dataFromYelp = [];
          var dataIndex = 0;

          for (var i = ind; i < ind + 10; i++) {
            dataFromYelp.push(data.businesses[i]);
            var resEl = $("<div>");
            resEl.attr("data-index", "" + dataIndex);
            resEl.addClass("yelp-result");
            var nameEl = $("<div>").text(data.businesses[i].name);
            nameEl.attr("data-index", "" + dataIndex);
            var imgURL = data.businesses[i].image_url;
            var distanceEl = $("<div>").text(
              parseInt(data.businesses[i].distance) + "m"
            );
            distanceEl.attr("data-index", "" + dataIndex);
            var imgEl = $("<img>").attr("src", imgURL);
            imgEl.attr("data-index", "" + dataIndex);
            imgEl.attr("alt", "Image for Business");
            imgEl.css("width", "100px");
            imgEl.css("height", "100px");
            resEl.append(nameEl, imgEl, distanceEl);
            $(".businesses-result-display").append(resEl);
            dataIndex++;
          }

          if (index == 0) {
            var nextBtn = $("<button>").text("Next");
            nextBtn.attr("id", "next-results-button");
            nextBtn.attr("class", "button");
            $(".businesses-result-display").append(nextBtn);
          }

          $(document).on("click", "#next-results-button", function () {
            $(".businesses-result-display").html("");
            index = 10;
            getYelpResults(index);

            var prevBtn = $("<button>").text("Previous");
            prevBtn.attr("id", "prev-results-button");
            prevBtn.attr("class", "button");
            $(".businesses-result-display").append(prevBtn);

            $(document).on("click", "#prev-results-button", function () {
              $(".businesses-result-display").html("");
              index = 0;
              getYelpResults(index);
            });
          });
        }
        getYelpResults(index);
      }
      // if (message !== "") {
      //   var messageModal = $("<div>").addClass("modal").attr("id", "message-modal");
      //   messageModal.html(
      //     '<div class="modal-background"></div>' +
      //       '<div class="modal-content ml-auto mr-auto">' +
      //         '<div id="hint-message">' +
      //           message +                  
      //         '</div>' +
      //       '</div>' +
      //       '<button id="map-modal-close" class="modal-close is-large" aria-label="close">X</button>'
      //   );
      //   (".businesses-result-display").append(messageModal);
      // }
    })
    .catch(function (err) {
      
    });
}

loadBusinessesSaved();

loadActivitiesSaved();

displayTabContent("search-tab");

$(".business-details-display").removeClass("is-flex").addClass("is-hidden");

$(document).on("click", "a", displaySelectedTab);

$(document).on("click", ".is-multiple", function () {
  $(this).children("select").first().attr("size", "5");
});

$(document).on("focusout", ".is-multiple", function () {
  $(this).children("select").first().attr("size", "1");
  $(this).hide();
  $("#price-selected").text("");
  var price = $("#price-select").val();
  if (price.length == 0 || price.includes("Any Price Range")) {
    price = ["Any Price Range"];
  }
  for (var priceSelected of price) {
    $("#price-selected").append(priceSelected + " ");
  }
  $("#price-selected").removeClass().show();
});

$(document).on("click", "#price-selected", function () {
  $("#price-selected").hide();
  $(".is-multiple").show();
});

$(document).on("click", "#submit-button", submitEventHandlerBored);

$(document).on("click", "#submit-button-yelp", submitEventHandlerYelp);

$(".businesses-result-display").on("click", ".yelp-result", fetchDetails);

$(document).on("click", "#go-back-button", displayYelpResult);

$(document).on("click", "#save-business-button", saveYelpResult);

$(document).on("click", ".business-saved", displayBusinessSaved);

$(document).on("click", ".activity-saved", displayActivitySaved);

$(document).on("click", "#save-activity-button", saveBoredResult);

$(document).on("click", "#clear-activity-saved-button", clearActivities);

$(document).on("click", "#clear-business-saved-button", clearBusinesses);

$(document).on("click", "#small-map", function () {
  $("#map-modal").show();
  largeMap.updateSize();
});

$(document).on("click", "#map-modal-close", function () {
  $(this).closest(".modal").hide();
});

$(document).on("click", "#map-modal", function (event) {
  if (event.target.nodeName.toLowerCase() !== "canvas" && event.target.nodeName.toLowerCase() !== "button") {
    $("#map-modal").hide();
  }
});
