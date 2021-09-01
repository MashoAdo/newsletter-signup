import express, { response } from "express";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import https from "https"

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express()

app.use(express.static("public"))
app.use(express.urlencoded({extended:true}))

app.get("/", (req,res) =>{
    res.sendFile(__dirname + "/signup.html")
})

app.post("/", (req, res)=>{

    var firstName = req.body.fName
    var lastName= req.body.lName
    var email = req.body.email
    

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields:{
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }


    const jsonData = JSON.stringify(data)

    const url = "https://us5.api.mailchimp.com/3.0/lists/3c546cb14c"
    const options = {
        method: "POST",
        auth: "masho:89bba90105d73f1a08e77bf483018c85-us5"
    }

    const request = https.request(url, options, (response)=>{
   if (response.statusCode ===200){
       res.sendFile(__dirname + "/success.html")
   }
   else {
       res.sendFile(__dirname + "/failure.html")
   }
    response.on("data", (data) =>{
        return JSON.parse(data)
    })
  })

 request.write(jsonData)
 request.end()

})
  
app.post("/success", (req,res) =>{
    res.redirect("/")
})

app.post("/failure", (req,res) =>{
    res.redirect("/")
})

app.listen(3000, () =>{
    console.log("Server is up and running on 3000")
})

// 89bba90105d73f1a08e77bf483018c85-us5 -api key

// 3c546cb14c -list id