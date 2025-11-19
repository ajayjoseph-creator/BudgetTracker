import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Categories from "./pages/Categories";
import Budgets from "./pages/Budgets";
import Reports from "./pages/Reports";
import PrivateRoute from "./components/PrivateRoute";
import CategorySettings from "./pages/SettingsCategories";
import BudgetTable from "./components/BudgetTable";
import MonthlyBudget from "./pages/MonthlyBudget";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Auth Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/categorysetting" element={<CategorySettings />} />
        <Route path="/budgetsetting" element={<BudgetTable />} />
        <Route path="/monthlyBudget" element={<MonthlyBudget />} />

        {/* Protected Pages */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/categories"
          element={
            <PrivateRoute>
              <Categories />
            </PrivateRoute>
          }
        />

        <Route
          path="/budgets"
          element={
            <PrivateRoute>
              <Budgets />
            </PrivateRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <PrivateRoute>
              <Reports />
            </PrivateRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}
