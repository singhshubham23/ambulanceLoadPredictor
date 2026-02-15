import Dashboard from "./pages/Dashboard";
import Sidebar from "./components/Sidebar";
import TopNavbar from "./components/TopNavbar";

function App() {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 bg-light min-vh-100">
        <TopNavbar />
        <Dashboard />
      </div>
    </div>
  );
}

export default App;
