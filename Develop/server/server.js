const express = require('express');
const path = require('path');
const db = require('./config/connection');
// Apollo Server
const { ApolloServer } = require('apollo-server-express');
// Middleware Authorization
const { authMiddleware } = require('./utils/auth');
// Import our typeDefs and Resolvers
const {typeDefs, resolvers} = require('./schemas');
// PORT & server set up
const PORT = process.env.PORT || 3001;
// create a new Apollo Server and pass in our Schema
const server = new ApolloServer({
  typeDefs,
  resolvers,
  // ensures every request performs an authentication check
  // context makes things global
  context: authMiddleware
})
// Instantiate Express server
const app = express();
// Enable parsing of JSON 
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


// Function to start instance of Apollo server
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start()
  // Integrate our Apollo server with the Express server application as middleware
  server.applyMiddleware({ app });
  // If we're in production, serve client/build as static assets
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
  }
  // If we make a request to the server that doesn't have a route, respond with the production-ready React front-end
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
  // Connect our Mongoose DB
  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      // Log where we can go test our GQL API
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`)
    });
  });
};

// call the async function and start the server
startApolloServer(typeDefs, resolvers);
