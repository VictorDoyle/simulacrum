import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Product from './pages/Product';
import ProductList from './pages/ProductList';

import NotFound from './pages/NotFound';

const App: React.FC = () => {
  return (
    <Router>
      <Header />
      <main>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/product/:id" component={Product} />
          <Route path="/products/" component={ProductList} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
