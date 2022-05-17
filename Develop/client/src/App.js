import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';
// Import Apollo Server to connect to front end
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: '/graphql',
});
// set context retrieves the token from local storage
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  console.log('from App.JS token ' + token)
  return {
    ...headers,
    authorization: token ? `Bearer ${token}` : '',
  }
})
console.log("this is the authLink ", authLink)


const client = new ApolloClient({
  // link now has the token with every request
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    // Due to the client tag, the whole app will have acess to the server API data. 
    <ApolloProvider client={client}>
      <Router>
        <>
          <Navbar />
          <Switch>
            <Route exact path='/' component={SearchBooks} />
            <Route exact path='/saved' component={SavedBooks} />
            <Route render={() => <h1 className='display-2'>Wrong page!</h1>} />
          </Switch>
        </>
      </Router>
    </ApolloProvider>
  );
}

export default App;
