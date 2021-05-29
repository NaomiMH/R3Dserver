const { ApolloServer } = require('apollo-server');
const typeDefs = require('./db/schema');
const resolvers = require('./db/resolvers');
const jwt = require('jsonwebtoken');
require('dotenv').config({path: 'variables.env'});

const conectarDB = require('./config/db');

conectarDB();

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req}) => {
        const token = req.headers['authorization'] || '';
        if (token) {
            try {
                const user = jwt.verify(token.replace('Bearer ',''),process.env.CLAVE);
                return {user};
            } catch (error) {
                console.log(error);
            }
        }
    }
});

server.listen({ port:process.env.PORT || 4000 }).then( ({url}) => {
    console.log(`Sevidor corriendo en ${url}`)
} );