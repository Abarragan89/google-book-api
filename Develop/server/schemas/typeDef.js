const { gql } = require('apollo-server-express');

// create our Type Definitions
const typeDefs = gql`
    type Book {
        authors: [String]
        description: String
        bookId: ID
        image: String
        link: String
        title: String
    }
    type User {
        _id: ID!
        username: String!
        email: String!
        bookCount: Int
        savedBooks: [Book]
    }
    type Auth {
        token: ID!
        user: User
    }
    input bookInput {
        authors: [String]
        description: String
        title: String
        bookId: String
        image: String
        link: String
    }
    type Query {
        me: User
    }
    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        saveBook(bookInput: bookInput): User
        deleteBook(_id: String): User
    }
`;

module.exports = typeDefs;