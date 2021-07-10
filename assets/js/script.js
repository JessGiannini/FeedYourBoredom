var modal = document.getElementById("user-modal-1");
var btn = document.getElementById("search-btn");
var span = document.getElementsByClassName("close")[0];
var modalHeader = $("h3").text("Please, fill out this form.");
var dataFromYelp = [];
var businessesSaved = [];
var activitiesSaved = [];
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

// key: number of participants; value: all possible types of results
// var activityType = {
//   1: ["education", "recreational", "social", "diy", "charity", "cooking", "relaxation", "music", "busywork"],
//   2: ["social"],
//   3: ["social"],
//   4: ["social", "music", "recreational"],
//   5: ["social", "music"]
// }
// GREAT IDEA ^^^





function loadActivitiesSaved() {
    activitiesSaved = JSON.parse(localStorage.getItem("activitiesSaved"));
    if (activitiesSaved === null) {
        activitiesSaved = [];
    } else {
        listActivitiesSaved();
    }
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
  if (idActive === "search-tab"){
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
function submitEventHandlerBored() {
    event.preventDefault();
    // var participants = $("#participants-input").val();
    // var participantsQueryParameter =
    // participants == "" ? "" : "participants=" + participants + "&";
    var typeSelected = $("#activity-type-select").val();
    // display the user input
    var typeEl = $("<div>").text("Type: " + typeSelected);
    $(".activity-result-display").html("");
    $(".activity-result-display").append(typeEl);
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
                $(".activity-result-display").append("No results found");
                return;
            } else {
                displayActivityDetails(data);
                var saveActivityButton = $("<button>").text("Star");
                saveActivityButton.attr("id", "save-activity-button");
                saveActivityButton.attr("data-id", data.key);
                saveActivityButton.attr("data-name", data.activity);
                $(".activity-result-display").append(saveActivityButton);
            }
        });
}

for (var i = 0; i < activityType.length; i++) {
    $("#activity-type-select").append($("<option>").text(activityType[i]));
}

function displayActivitySaved() {
    var key = $(this).attr("data-id");
    var requestURL =
        "http://www.boredapi.com/api/activity/?key=" + key;
    fetch(requestURL)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            if (data != undefined) {
                displayActivityDetails(data);
            }
        })
}

function displayActivityDetails(activityData) {
    var activityEl = $("<h3>").text("Activity: " + activityData.activity);
    var priceEl = $("<div>").text("Price: " + activityData.price);
    // var typeEl = $("<div>").text("type: " + activityData.type);
    var accessibilityEl = $("<div>").text("Accessibility: " + activityData.accessibility);
    var participantsEl = $("<div>").text("Participants suggested: " + activityData.participants + " person(s)");
    // price and accessibility can be displayed using empty or colored star
    $(".activity-result-display").html("");
    $(".activity-result-display").append(activityEl, priceEl, accessibilityEl, participantsEl);
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
            return response.json()
        })
        .then(function (data) {
            if (data != undefined) {
                displayBusinessDetails(data);
            }
        })
}

function fetchDetails() {
    var indexOfYelpResult = $(this).attr("data-index");
    displayBusinessDetails(dataFromYelp[indexOfYelpResult]);
    var goBackButton = $("<button>").text("Go Back");
    goBackButton.attr("id", "go-back-button");
    var saveBusinessButton = $("<button>").text("Star");
    saveBusinessButton.attr("id", "save-business-button");
    saveBusinessButton.attr("data-index", indexOfYelpResult);
    $(".business-details-display").append(goBackButton, saveBusinessButton);
}

function displayBusinessDetails(businessSelected) {
    $(".business-details-display").show();
    $(".businesses-result-display").hide();
    $(".business-details-display").empty();
    console.log(businessSelected);
    var nameEl = $("<div>").text(businessSelected.name);
    var imgURL = businessSelected.image_url;
    var distanceEl = $("<div>").text(parseInt(businessSelected.distance) + "m");
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

    var mapEl = $("<div></div>").addClass("map").attr("id", "map");
    // var pointFeature = new ol.Feature(new ol.geom.Point([businessSelected.coordinates.longitude, businessSelected.coordinates.latitude]));

    $(document).ready(function () {
        var map = new ol.Map({
            target: 'map',
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.OSM()
                }),
                // new ol.layer.Vector({
                //     source: new ol.source.Vector({
                //         features: [pointFeature],
                //     }),
                //     style: new ol.style.Style({
                //         image: new ol.style.Icon({
                //             anchor: [0.5, 46],
                //             anchorXUnits: 'fraction',
                //             anchorYUnits: 'pixels',
                //             opacity: 0.95,
                //             src: 'assets/pin.png',
                //         }),
                //     })
                // })
            ],
            view: new ol.View({
                center: ol.proj.fromLonLat([businessSelected.coordinates.longitude, businessSelected.coordinates.latitude]),
                zoom: 18
            })
        });
    })

    $(".business-details-display").append(nameEl, imgEl, distanceEl, addressEl, phoneEl, mapEl);
}

function saveBoredResult() {
    var relistNeeded = false;
    var name = $(this).attr("data-name");
    var id = $(this).attr("data-id");
    var resultToAdd = {
        name: name,
        id: id
    }
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
        id: business.id
    }
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
    $(".businesses-result-display").css("display", "flex");
    $(".business-details-display").hide();
}

function submitEventHandlerYelp() {
    event.preventDefault();
    $(".business-details-display").hide();
    $(".businesses-result-display").css("display", "flex");
    $(".businesses-result-display").empty();
    var location = $("#city-input").val();
    var term = $("#term-input").val();
    var termQueryParameter = term === "" ? "" : "&term=" + term;
    var priceQueryParameter = "";
    // drop down menu for selecting budget
    price = $("#price-select").val();
    console.log(price);
    if (price.length != 0 && !price.includes("")) {
        for (var priceSelected of price) {
            priceQueryParameter += (priceSelected.length + ",");
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
            var index = 0;
            function getYelpResults(ind) {
                dataFromYelp = []
                var dataIndex = 0;
                
                for (var i = ind; i < ind + 10; i++) {
                    dataFromYelp.push(data.businesses[i]);
                    var resEl = $("<div>");
                    resEl.attr("data-index", "" + dataIndex);
                    resEl.addClass("yelp-result");
                    var nameEl = $("<div>").text(data.businesses[i].name);
                    nameEl.attr("data-index", "" + dataIndex);
                    var imgURL = data.businesses[i].image_url;
                    var distanceEl = $("<div>").text(parseInt(data.businesses[i].distance) + "m");
                    distanceEl.attr("data-index", "" + dataIndex);
                    var imgEl = $("<img>").attr("src", imgURL);
                    imgEl.attr("data-index", "" + dataIndex);
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
        })
        .catch(function (err) {
            console.log(err);
        });
}

// the above funtion displays way to many results on the web page
// TODO: style the results into a block set up

// When the user clicks on the button, open the modal
// btn.onclick = function () {
//   modal.style.display = "block";
// };

// // When the user clicks on <span> (x), close the modal
// span.onclick = function () {
//   modal.style.display = "none";
// };

loadBusinessesSaved();
loadActivitiesSaved();
displayTabContent("search-tab");

// When the user clicks anywhere outside of the modal, close it
// window.onclick = function (event) {
//   if (event.target == modal) {
//     modal.style.display = "none";
//   }
// };
$(".business-details-display").hide();

$(document).on("click", "a", displaySelectedTab);

$(document).on("click", ".is-multiple", function () {
    $(this).children("select").first().attr("size", "5");
});

$(document).on("focusout", ".is-multiple", function () {
    $(this).children("select").first().attr("size", "1");
    $(this).hide();
    $("#price-selected").text("");
    var price = $("#price-select").val();
    for (var priceSelected of price) {
        $("#price-selected").append(priceSelected + " ");
    }
    $("#price-selected").removeClass().show();
})

$(document).on("click", "#price-selected", function () {
    $("#price-selected").hide();
    $(".is-multiple").show();
})


$(document).on("click", "#submit-button", submitEventHandlerBored);
// this button is not located inside the modal
$(document).on("click", "#submit-button-yelp", submitEventHandlerYelp);

$(".businesses-result-display").on("click", ".yelp-result", fetchDetails);

// $("button").on("click", "#go-back-button", function() {
$(document).on("click", "#go-back-button", displayYelpResult);

$(document).on("click", "#save-business-button", saveYelpResult);

$(document).on("click", ".business-saved", displayBusinessSaved);

$(document).on("click", ".activity-saved", displayActivitySaved);

$(document).on("click", "#save-activity-button", saveBoredResult);
