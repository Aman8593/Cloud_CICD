// import 
const express = require('express')
const app = express()
const port = 3000
const path = require('path')
const hbs = require('hbs')
const { collection, collection1, collection2, collection3 } = require("./mongodb");


const tempelatePath = path.join(__dirname,'../templete')
app.use(express.json())

app.use(express.static('Magdalene-WebPages'))
app.use('/css', express.static(__dirname + 'Magdalene-WebPages/css'))
app.use('/img', express.static(__dirname + 'Magdalene-WebPages/img'))
app.use('/lib', express.static(__dirname + 'puMagdalene-WebPageslic/lib'))
app.use('/scss', express.static(__dirname + 'Magdalene-WebPages/scss'))


app.set('view engine', 'hbs')
app.set('views',tempelatePath)
app.use(express.urlencoded({extended:false}))

async function validateLogin(logindata) {
    // Replace 'your_collection_name' with the actual name of your collection
    const user = await collection.findOne({ email: logindata.email, pass: logindata.pass });

    return user !== null;
}

app.get('' ,(req,res)=>{
    res.render(__dirname+'Magdalene-WebPages/index.html')
})
app.post("/login", async (req, res)=>{
    const logindata = {
        
        email:req.body.email,
        pass:req.body.password
        
    };
    const loginSuccessful = await validateLogin(logindata);

    if (loginSuccessful) {
        await collection.insertMany(logindata);
        res.redirect('/buynow.html');
    } else {
        
        res.send('Login failed. Please check your credentials or register for an account.');
    }
})  

       
app.post(("/register"), async (req, res)=>{
    const signindata = {
        
        email:req.body.email,
        pass:req.body.password
        
    }
    await collection.insertMany(signindata)
    res.redirect('/buynow.html');
    
})

app.post("/buynow", async (req, res) => {
    const buynowdata = {
        name: req.body.name,
        email: req.body.email,
        country: req.body.country,
        selectcar: req.body.selectcar,
        phone: req.body.phone,
        state: req.body.state,
        address: req.body.address,
    };

    try {
        await collection1.create(buynowdata);
        res.send('<script>alert("Your data has been successfully submitted for further processing. 🎉 Your order has been successfully placed! 🚗Thank you!"); window.location.href="/";</script>'
        );
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
})
app.post("/booking", async (req, res) => {
    const bookingdata = {
        name: req.body.name,
        email: req.body.email,
        selectaservice: req.body.selectaservice,
        //date: new Date(req.body.date),
        date: req.body.date,
        specialrequest: req.body.specialrequest,
    };

    try {
        await collection2.create(bookingdata);
        res.send(
            '<script>alert("🎉 Your booking has been successfully submitted! We will get in touch with you soon. 🚗"); window.location.href="/";</script>'
        );
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
})
app.post("/getaquote", async (req, res) => {
    const getaquotedata = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        service: req.body.service,
        quantity: req.body.quantity,
        budget: req.body.budget,
        timeline: req.body.timeline,
        comments: req.body.comments,
    };

    try {
        await collection3.create(getaquotedata);
        res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Quote Request Received</title>
            <style>
                body {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    margin: 0;
                    background-color: #27ae60; /* Green color */
                    color: white;
                    font-family: Arial, sans-serif;
                    text-align: center;
                }
                h1 {
                    font-size: 2em;
                }
            </style>
        </head>
        <body>
            <div>
                <h1>🎉 Your quote request has been received! 🚀</h1>
            </div>
            <script>
                // Redirecting to the home page after 5 seconds
                setTimeout(() => {
                    window.location.href = "/";
                }, 5000);
            </script>
        </body>
        </html>`
    );
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});


app.listen(port  , ()=> console.info("listening on port 3000"))

