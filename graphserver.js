const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const fs = require('fs');
const express = require('express');
const session = require('express-session');
const app = express();

Uncomment the lines of code  which have been commented below to make the application secure
const helmet = require('helmet')
const csrf = require('csurf');

app.use(helmet)
app.use(express.csrf());

// Middlewares
const csrfProtect = csrf({ cookie: true })
app.get('/form', csrfProtect, function(req, res) {
res.render('send', { csrfToken: req.csrfToken() })
})
app.post('/posts/create', parseForm, csrfProtect, function(req, res) {
res.send('data is being processed')
})

const sessionConfig = {
  secret: 'hsbqiz2208!',
  name: 'graphy',
  resave: false,
  saveUninitialized: false,
  store: store,
  cookie : {
    sameSite: 'strict',
  }
};

const { URLSearchParams } = require('url');
global.URLSearchParams = URLSearchParams;


let rawdata = fs.readFileSync('UScities.json');
let USCities = JSON.parse(rawdata);

// GraphQL schema
let schema = buildSchema(`
    type Query {
        city(name: String): City
        cities(state: String): [City]
    },
    type City {
        city: String
        state: String
    }
`);

let getCity = function(args) { 
    let name = args.name;
    return USCities.filter(city => {
        return city.city == name;
    })[0];
}

let getCities = function(args) {
    if (args.state) {
        let state = args.state;
        return USCities.filter(city => city.state === state);
    } else {
        return USCities;
    }
}

var root = {
    city: getCity,
    cities: getCities
};

// Create an express server and a GraphQL endpoint


app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}));

app.get('/', (req, res) => {
    res.send("Copy the URL from the address-bar, to paste in Postman to use GrpahQL")
  })
  
app.listen(4000, () => console.log('Express GraphQL Server Now Running On port 4000/graphql'));
