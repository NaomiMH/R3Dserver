const { gql } = require('apollo-server');

// Schema
const typeDefs = gql`
    type User {
        id: ID
        username: String
    }

    type Client {
        id: ID
        name: String
        f_lastname: String
        m_lastname: String
        gender: String
        phone: String
        birthday: String
        seller: ID
    }

    type Token {
        token: String
    }

    input UserInput {
        username: String!
        password: String!
    }

    input ClientInput {
        name: String!
        f_lastname: String!
        m_lastname: String!
        gender: String!
        birthday: String!
        phone: String!
    }

    type Query {
        getUser: User

        getClientsofSeller: [Client]
        getClient(id: ID!): Client
    }

    type Mutation {
        newUser(input: UserInput): User
        checkUser(input: UserInput): Token

        newClient(input: ClientInput): Client
        setClient(id: ID!, input: ClientInput): Client
        delClient(id: ID!): String
    }
`;

module.exports = typeDefs;