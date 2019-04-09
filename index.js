const express = require('express');
const path = require('path');
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 5000;

const app = express();
const urlencodedParser = bodyParser.urlencoded({extended: false});
const users = [];

app
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'));


app.get("/users", urlencodedParser, function (request, response) {
    response.sendFile(__dirname + "/register.html");
});
app.post("/users", urlencodedParser, function (request, response) {
    if(!request.body) {
    	return response.sendStatus(400);
    }

    console.log(request.body);
    response.send(`${request.body.userName} - ${request.body.userAge}`);
});


 app
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));
 