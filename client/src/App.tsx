import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/components/Dashboard";
import ShopsManagement from "@/components/ShopsManagement";
import AgencyProfit from "@/components/AgencyProfit";
import Settings from "@/components/Settings";
import UserManagement from "@/components/UserManagement";
import Layout from "@/components/shared/Layout";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/shops" component={ShopsManagement} />
      <Route path="/settings" component={Settings} />
      <Route path="/agency-profit" component={AgencyProfit} />
      <Route path="/user-management" component={UserManagement} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Router />
      </Layout>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
