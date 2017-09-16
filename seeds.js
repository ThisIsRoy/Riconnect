var mongoose = require("mongoose");
var College = require("./models/college");

var stockData = [
    {
        name: "Baker",
        image: "/baker.jpeg",
        crestImage: "/baker-crest.jpeg"
    },
    {
        name: "Will Rice",
        image: "/willrice2.jpeg",
        crestImage: "/willrice-crest.jpeg"
    },
    {
        name: "Hanszen",
        image: "/hanszen.jpg",
        crestImage: "/hanszen-crest.png"
    },
    {
        name: "Weiss",
        image: "/weiss.jpeg",
        crestImage: "/weiss-crest.jpeg"
    },
    {
        name: "Jones",
        image: "/jones.jpg",
        crestImage: "/jones-crest.jpeg"
    },
    {
        name: "Brown",
        image: "/brown.jpeg",
        crestImage: "/brown-crest.jpeg"
    },
    {
        name: "Lovett",
        image: "/lovett.jpeg",
        crestImage: "/lovett-crest.jpeg"
    },
    {
        name: "Sid Rich",
        image: "/sid.jpeg",
        crestImage: "/sid-crest.jpeg"
    },
    {
        name: "Martel",
        image: "/martel.jpeg",
        crestImage: "/martel-crest.jpeg"
    },
    {
        name: "McMurtry",
        image: "/mcmurtry.jpeg",
        crestImage: "/mcmurtry-crest.jpeg"
    },
    {
        name: "Duncan",
        image: "/duncan.jpeg",
        crestImage: "/duncan-crest.jpeg"
    }
    ];
    
function seedDB() {
    //Remove previous entries
    College.remove({}, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Added base data");
            //Add base data 
            stockData.forEach((seed) => {
                College.create(seed, (err, baseData) => {
                    if(err) {
                        console.log(err);
                    } else {
                        console.log("Added residential college");
                    }
                }); 
            });
        }
    });
}

module.exports = seedDB;