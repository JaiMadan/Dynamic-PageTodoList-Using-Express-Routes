//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


mongoose.connect("mongodb+srv://admin-jai:jaimadan@cluster0.q0phz.mongodb.net/todolistDB", {useUnifiedTopology: true,useNewUrlParser: true});


const itemsSchema = {
  name: String
};


const Item = mongoose.model("Item" ,itemsSchema);




const item1 = new Item({
  name: "john"
});

const item2 = new Item({
  name: "ohn"
});

const item3 = new Item({
  name: "hon"
});

//items.save();
const ii = [item1,item2,item3];

/*Item.insertMany(ii, function(err){
  if(err)
  console.log(err);
  else {
    console.log("Successfully Excecuted");
  }
});*/

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List",listSchema);

app.get("/", function(req, res) {

  Item.find({}, function(err,results){

     if(results.length==0)
     {
       Item.insertMany(ii, function(err){
         if(err)
         console.log(err);
         else {
           console.log("Successfully Excecuted");
         }
       });
     }


      res.render("list", {listTitle: "Today", newListItems: results});
  });
//  res.render("list", {listTitle: "Today", newListItems: ii});

});

app.post("/", function(req, res){

  const ite = req.body.newItem;
  const nam = req.body.list;
  /*if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }*/

  const nw = new Item({
    name : ite
  });
  if(nam=="Today")
  {
  nw.save();
  res.redirect('/');
  }
  else {
    List.findOne({name: nam}, function(err,ii){
      ii.items.push(nw);
      ii.save();
      res.redirect("/"+nam);
    });
  }
});


app.post("/delete",function(req,res){
  const id = req.body.checkbox;
  const listName = req.body.listName;

if(listName=="Today"){

  Item.findByIdAndRemove(id,function(err){
    if(!err)
    {
      console.log("success");
      res.redirect("/");
    }
  });
}
else {
  List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: id}}}, function(err,foundList){
    if(!err)
    {
      console.log("jj");
      res.redirect("/"+listName);
    }

  });
}

});

/*app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});*/

app.get("/:customListName",function(req,res){

  const customListName = _.capitalize(req.params.customListName);


  List.findOne({name: customListName}, function(err, foundList){
    if(!foundList)
    {
      const list = new List({
        name: customListName,
        items: ii
      });
      list.save();
      res.redirect("/" + customListName);
    }
    else {
      res.render("list",{listTitle: customListName, newListItems: foundList.items});
    }
  })

});

app.get("/about", function(req, res){
  res.render("about");
});

let port = process.env.PORT || 3000;

//app.listen(port);

app.listen(port,()=> {
  console.log("Server started on port 3000");
});
