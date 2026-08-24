import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { SocketProvider } from './context/SocketContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { AppShell } from './components/layout/AppShell';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { BrowsePage } from './pages/BrowsePage';
import { ItemDetailPage } from './pages/ItemDetailPage';
import { CreateListingPage } from './pages/CreateListingPage';
import { MyListingsPage } from './pages/MyListingsPage';
import { EditListingPage } from './pages/EditListingPage';
import { BorrowRequestsPage } from './pages/BorrowRequestsPage';
import { BookingsPage } from './pages/BookingsPage';
import { WriteReviewPage } from './pages/WriteReviewPage';
import { DamageReportPage } from './pages/DamageReportPage';
import { DisputesPage } from './pages/DisputesPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { MessagesPage } from './pages/MessagesPage';
import { ChatPage } from './pages/ChatPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminRoute } from './components/layout/AdminRoute';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminUsersPage } from './pages/AdminUsersPage';
import { AdminItemsPage } from './pages/AdminItemsPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';

const queryClient = new QueryClient();

export const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <SocketProvider>
        <ThemeProvider>
          <BrowserRouter>
            <AppShell>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/browse" element={<BrowsePage />} />
                <Route path="/items/:id" element={<ItemDetailPage />} />
                <Route path="/how-it-works" element={<HowItWorksPage />} />

                {/* Protected Routes */}
                <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                <Route path="/listings/new" element={<ProtectedRoute><CreateListingPage /></ProtectedRoute>} />
                <Route path="/listings" element={<ProtectedRoute><MyListingsPage /></ProtectedRoute>} />
                <Route path="/listings/edit/:id" element={<ProtectedRoute><EditListingPage /></ProtectedRoute>} />
                <Route path="/requests" element={<ProtectedRoute><BorrowRequestsPage /></ProtectedRoute>} />
                <Route path="/bookings" element={<ProtectedRoute><BookingsPage /></ProtectedRoute>} />
                <Route path="/reviews/new" element={<ProtectedRoute><WriteReviewPage /></ProtectedRoute>} />
                <Route path="/reports/new" element={<ProtectedRoute><DamageReportPage /></ProtectedRoute>} />
                <Route path="/disputes/new" element={<ProtectedRoute><DisputesPage /></ProtectedRoute>} />
                <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
                <Route path="/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
                <Route path="/messages/:conversationId" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
                <Route path="/admin/users" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />
                <Route path="/admin/items" element={<AdminRoute><AdminItemsPage /></AdminRoute>} />
              </Routes>
            </AppShell>
          </BrowserRouter>
        </ThemeProvider>
      </SocketProvider>
    </AuthProvider>
  </QueryClientProvider>
);
