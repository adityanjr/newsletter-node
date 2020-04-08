const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https")

const app = express();

app.use(express.static("public")); //render public folder
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res){
    
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };
    const JSONdata = JSON.stringify(data);
    
    const url = "https://us19.api.mailchimp.com/3.0/lists/819abb374c"
    const options = {
        method: "POST",
        auth: "adityanjr:bcda403079b5786fd7d93c020220b305-us19"
    }
    
    const request = https.request(url, options, function(response){
        if(response.statusCode==200){
            res.sendFile(__dirname + "/success.html");
        } else {
            res.send("AAHH ERROR: "+ response.statusCode);
        }
        response.on("data", function(data){
            console.log(JSON.parse(data));
        });
    });
    request.write(JSONdata);
    request.end();
});

app.post("/success", function(req,res){
    res.redirect("/");
})

app.listen(process.env.PORT || 8000, function() {
    console.log("Server is running"); 
});