import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import CRM from './components/CRM';
import ClientLedger from './components/ClientLedger';
import LedgerDetails from './components/LedgerDetails';

const App: React.FC = () => (
  <Router>
    <div className="app">
      <Sidebar />
      <div className="content">
        <Switch>
          <Route path="/crm" component={CRM} />
          <Route path="/client-ledger" exact component={ClientLedger} />
          <Route path="/client-ledger/:id" component={LedgerDetails} />
        </Switch>
      </div>
    </div>
  </Router>
);

export default App;
