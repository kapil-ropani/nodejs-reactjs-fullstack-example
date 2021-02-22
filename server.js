var express = require("express");
var cors = require('cors')
    // var calculate = require("./calculate");
const app = express();
const port = 3000;
// app.use(bodyParser.urlencoded({ extended: false }));


app.use(express.json());
app.use(cors());

app.post("/calculate", function(req, res) {
    let op = calculate(
        req.body.requiredBottles,
        req.body.prices,
        req.body.pieces
    );
    res.send(op);
});

app.get("/sample-data", function(req, res, body) {
    res.send({
        "pricelist": [{
            "piece": { "name": "Bottle", "quantity": 1, "price": 2.3 },
            "pack": { "name": "12-pack", "quantity": 12, "price": 25 },
            "box": { "name": "Big box", "quantity": 120, "price": 230 }
        }]
    });
});

app.get("/", function(req, res) {
    res.send("hello world");
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

function calculate(requiredBottles, prices, pieces) {
    let no_of_bottles_required = requiredBottles;
    let price_per_bottle = prices[0];
    let price_per_pack = prices[1];
    let price_per_box = prices[2];

    let pieces_individaul_available = pieces[0];
    let pieces_per_pack = pieces[1];
    let pieces_per_box = pieces[1] * 10;

    let bottles = 0;
    let packs = 0;
    let box = 0;

    if (no_of_bottles_required >= pieces_per_pack) {
        packs = no_of_bottles_required / pieces_per_pack;
        bottles = no_of_bottles_required % pieces_per_pack;
        if (no_of_bottles_required > pieces_per_box) {
            box = no_of_bottles_required / pieces_per_box;
            let remaining_bottles = no_of_bottles_required % pieces_per_box; // remaining packs
            packs = remaining_bottles / pieces_per_pack;
            remaining_bottles = remaining_bottles % pieces_per_box;
            bottles = remaining_bottles;
        }

        return {
            bottles: bottles,
            packs: packs,
            box: box,
            price: Math.floor(
                bottles * price_per_bottle +
                packs * price_per_pack +
                box * price_per_box
            )
        };
    } else {
        console.log(
            "price: ",
            bottles * price_per_bottle + packs * price_per_pack + box * price_per_box
        );
        bottles = no_of_bottles_required;

        return {
            bottles: bottles,
            packs: 0,
            box: 0,
            price: Math.floor(
                bottles * price_per_bottle +
                packs * price_per_pack +
                box * price_per_box
            )
        };
    }
}