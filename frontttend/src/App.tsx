import { ServiceProvider, useServices } from "./context/ServiceContext";
import { AuthForm } from "./components/AuthForm";
import { ServiceForm } from "./components/ServiceForm";
import { ServiceList } from "./components/ServiceList";
import "./App.css";

function MainApp() {
  const { state, dispatch } = useServices();

  if (!state.user) {
    return (
      <div className="container">
        <h1>Microservices</h1>
        <AuthForm />
      </div>
    );
  }

  return (
    <div className="container">
      <header className="header">
        <h1>Microservices</h1>
        <div>
          <span className="user">{state.user.email}</span>
          <button onClick={() => dispatch({ type: 'LOGOUT' })}>Sign Out</button>
        </div>
      </header>

      <ServiceForm />

      <h2>Services</h2>
      <ServiceList />
    </div>
  );
}

function App() {
  return (
    <ServiceProvider>
      <MainApp />
    </ServiceProvider>
  );
}

export default App;

