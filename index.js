// app.use(express.static(__dirname + '/public'));
const express = require('express') 
const bodyparser = require('body-parser') 
const path = require('path') 
const app = express() 

var Publishable_Key = "pk_test_51JOfInSDnrihogXruz7S3Xk8gML3sYtrBFwkkrxtB2QiDgCxi3C0I2g3FYgJ7HNZmbet5zlGyKeTA8LZPzF89z9K00BvMQ50hL"
var Secret_Key = "sk_test_51JOfInSDnrihogXrjTLx4CbNwKFBt40pA91FKWEEn6jBHAjLI9oPIhMDQavVabkr56zOlr0NntLvl83JIunCQfV2007zOi69v9"

const stripe = require('stripe')(Secret_Key) 

const port = process.env.PORT || 3000 

app.use(bodyparser.urlencoded({extended:false})) 
app.use(bodyparser.json()) 

// View Engine Setup 
app.set('views', path.join(__dirname, 'views')) 
app.set('view engine', 'ejs') 

app.get('/', function(req, res){ 
    res.render('Home', { 
    key: Publishable_Key 
    }) 
}) 

app.post('/payment', function(req, res){ 

    // Moreover you can take more details from user 
    // like Address, Name, etc from form 
    stripe.customers.create({ 
        email: req.body.stripeEmail, 
        source: req.body.stripeToken, 
        name: 'Donate for cancer children', 
        address: { 
            line1: 'TC 9/4 Old MES colony', 
            postal_code: '110092', 
            city: 'New Delhi', 
            state: 'Delhi', 
            country: 'India', 
        } 
    }) 
    .then((customer) => { 

        return stripe.charges.create({ 
            amount: 10000,    // Charing Rs 25 
            description: 'Donation for cancer children', 
            currency: 'INR', 
            customer: customer.id 
        }); 
    }) 
    .then((charge) => { 
        res.send("Success") // If no error occurs 
    }) 
    .catch((err) => { 
        res.send(err)    // If some error occurs 
    }); 
}) 

app.listen(port, function(error){ 
    if(error) throw error 
    console.log("Server created Successfully") 
})