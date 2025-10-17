//@author hcadavid
// Modified and extended by Juan David Rodriguez

var apimock = (function () {

    var mockdata = {};

    // Datos originales 
    mockdata["johnconnor"] = [
        {author: "johnconnor", points: [{x: 150, y: 120}, {x: 215, y: 115}], name: "house"},
        {author: "johnconnor", points: [{x: 340, y: 240}, {x: 15, y: 215}], name: "gear"}
    ];
    
    mockdata["maryweyland"] = [
        {author: "maryweyland", points: [{x: 140, y: 140}, {x: 115, y: 115}], name: "house2"},
        {author: "maryweyland", points: [{x: 140, y: 140}, {x: 115, y: 115}], name: "gear2"}
    ];

    // Datos adicionales con más puntos
    mockdata["thomasanderson"] = [
        {
            author: "thomasanderson",
            points: [
                {x: 190, y: 190}, {x: 115, y: 115}, {x: 170, y: 140}, 
                {x: 200, y: 180}, {x: 250, y: 200}, {x: 300, y: 150}
            ],
            name: "wheel"
        },
        {
            author: "thomasanderson",
            points: [
                {x: 80, y: 90}, {x: 120, y: 110}, {x: 160, y: 130}, 
                {x: 200, y: 150}, {x: 240, y: 170}, {x: 280, y: 190},
                {x: 320, y: 210}, {x: 360, y: 230}
            ],
            name: "bridge"
        }
    ];

    mockdata["sarahconnor"] = [
        {
            author: "sarahconnor",
            points: [
                {x: 300, y: 250}, {x: 280, y: 230}, {x: 320, y: 270},
                {x: 340, y: 290}, {x: 360, y: 310}, {x: 380, y: 330},
                {x: 400, y: 350}, {x: 420, y: 370}, {x: 440, y: 390}
            ],
            name: "weapon"
        },
        {
            author: "sarahconnor",
            points: [
                {x: 100, y: 150}, {x: 150, y: 200}, {x: 200, y: 250},
                {x: 250, y: 300}, {x: 300, y: 350}
            ],
            name: "shield"
        },
        {
            author: "sarahconnor",
            points: [
                {x: 50, y: 100}, {x: 100, y: 150}, {x: 150, y: 200},
                {x: 200, y: 250}, {x: 250, y: 300}, {x: 300, y: 350},
                {x: 350, y: 400}, {x: 400, y: 450}, {x: 450, y: 500},
                {x: 500, y: 550}, {x: 550, y: 600}
            ],
            name: "fortress"
        }
    ];

    // Autor adicional con muchos puntos
    mockdata["neoanderson"] = [
        {
            author: "neoanderson",
            points: [
                {x: 10, y: 10}, {x: 20, y: 20}, {x: 30, y: 15}, {x: 40, y: 25},
                {x: 50, y: 35}, {x: 60, y: 30}, {x: 70, y: 40}, {x: 80, y: 50},
                {x: 90, y: 45}, {x: 100, y: 55}, {x: 110, y: 65}, {x: 120, y: 60}
            ],
            name: "matrix"
        },
        {
            author: "neoanderson",
            points: [
                {x: 200, y: 100}, {x: 220, y: 120}, {x: 240, y: 110}, {x: 260, y: 130},
                {x: 280, y: 140}, {x: 300, y: 135}, {x: 320, y: 145}, {x: 340, y: 155}
            ],
            name: "code"
        }
    ];

    return {
        getBlueprintsByAuthor: function (authname, callback) {
            callback(mockdata[authname]);
        },

        getBlueprintsByNameAndAuthor: function (authname, bpname, callback) {
            callback(
                mockdata[authname].find(function (e) {
                    return e.name === bpname;
                })
            );
        }
    };

})();

/*
Example of use:
var fun = function(list) {
    console.info(list);
}

apimock.getBlueprintsByAuthor("johnconnor", fun);
apimock.getBlueprintsByNameAndAuthor("johnconnor", "house", fun);
*/