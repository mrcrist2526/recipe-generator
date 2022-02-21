const express = require("express");
const app = express();
const https = require("https");
const ejs = require('ejs');
app.set('view engine', 'ejs')
app.use(express.static("public"));
var axios = require("axios");
app.use(express.urlencoded({extended: true}));


app.listen(3000, (req,res) => {
  console.log("Listening on port 3000");
})

const apiKey = "ccb98b2d04b6410fb01fa28a741b9b50";


app.use(express.urlencoded({extended:true}));
let ingredients = [];

app.get("/", (req, res) => {
  res.render("home", {
    ingredients: ingredients
  })
})

app.post("/", (req, res) => {
  ingredients.push(req.body.ingredient);
  console.log(ingredients);
  res.redirect("/")
});

function randomNumber(){
  var n = Math.floor(Math.random() * 30)
  return n;
}


app.post("/delete", (req, res) => {
  for (i = 0; i < ingredients.length; i++){
    if (ingredients[i] === req.body.checkbox){
      ingredients.splice(i,1)
    }
  }
  res.redirect("/");
})



app.post("/home", (req,res) => {
  ingredients = [];
  res.redirect("/");
})

app.post("/recipies", (req, res) => {
function recipeGet () {
  let ingredientsString = ingredients.toString();
  axios.get(`https://api.spoonacular.com/recipes/complexSearch?fillIngredients=true&addRecipeInformation=true&includeIngredients=${ingredientsString}&number=3&offset=${randomNumber()}&apiKey=${apiKey}`)
  .then((response) => {
    if (response.data.totalResults === 0){
      console.log("No results, removing last item and retrying")
      ingredients.pop();
      recipeGet();
  } else {
    console.log("New results");
    res.render("recipies", {
      title: response.data.results
    })
  }
  })
  .catch((err) => {
    console.log(err);
  })
}
recipeGet();
})
