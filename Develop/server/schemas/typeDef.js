const { gql } = require('apollo-server-express');

// create our Type Definitions
const typeDefs = gql`
    type Book {
        author: [String!]
        description: String
        BookId: ID!
        image: String
        link: String
        title: String
    }
    type User {
        _id: ID!
        username: String!
        email: String!
        bookCount: Int
        savedBooks: [Book!]
    }
    type Auth {
        token: ID!
    }
    input bookInput {
        author: [String]
        description: String
        title: String
        bookId: ID!
        image: String
        link: String
    }
    type Query {
        me: User
    }
    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        saveBook(input: bookInput): User
        deleteBook(id: ID!): User
    }
`;

module.exports = typeDefs;