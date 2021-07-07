fetch("http://www.boredapi.com/api/activity/")
    .then(function (res) {
        return res.json();
    })
    .then(function (data) {
        console.log("activity");
        console.log(data);
    })

fetch("https://cors.bridged.cc/https://api.yelp.com/v3/businesses/search?location=san%20jose", {
    headers: {
        Authorization: "Bearer i5jzi0uL9To_HaeteYpdGCzthane6BIfOQaBq7cjio6JjWlK_xcMrzKEJXiMg2Zti8K2NnY-zkvyrGAyw8J7vqN7hpSRP_b71d2IiKyepW0oMrzrz_jw_IaEcdfkYHYx"
    }
})
    .then(function (res) {
        console.log(res);
        return res.json();
    })
    .then(function (data) {
        console.log(data);
    })
    .catch(function (err) {
        console.log(err);
    })

var modal = document.getElementById("user-modal");
var btn = document.getElementById("search-btn");
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal 
btn.onclick = function () {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}