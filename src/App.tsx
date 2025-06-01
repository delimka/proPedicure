import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Home from "./pages/Home";

import Login from "./pages/Login";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import BookingPage from "./pages/BookingPage";
import PublicGallery from "./components/gallery/PublicGallery";

import ProtectedRoute from "./components/ProtectedRoute";
import BookingsAdmin from "./pages/admin/BookingsAdmin";
import GalleryAdmin from "./pages/admin/GalleryAdmin";
import UsersAdmin from "./pages/admin/UsersAdmin";
import ServicesAdmin from "./pages/admin/ServicesAdmin";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/gallery" element={<PublicGallery />} />
          <Route
            path="/admin/bookings"
            element={
              <ProtectedRoute>
                <BookingsAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/gallery"
            element={
              <ProtectedRoute>
                <GalleryAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/services"
            element={
              <ProtectedRoute>
                <ServicesAdmin />
              </ProtectedRoute>
            }
          />{" "}
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute>
                <UsersAdmin />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Footer />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
