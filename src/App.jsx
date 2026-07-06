import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/feedback/ErrorBoundary";
import { Toaster } from "@/components/feedback/Toast";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ROLES } from "@/store/authStore";

import { CustomerLayout } from "@/layouts/CustomerLayout";
import { AdminLayout } from "@/layouts/AdminLayout";
import { MobileLayout } from "@/layouts/MobileLayout";

import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage";
import NotFoundPage from "@/pages/NotFoundPage";

import HomePage from "@/pages/customer/HomePage";
import BrowseEventsPage from "@/pages/customer/BrowseEventsPage";
import BrowseVenuesPage from "@/pages/customer/BrowseVenuesPage";
import VenueDetailsPage from "@/pages/customer/VenueDetailsPage";
import EventDetailsPage from "@/pages/customer/EventDetailsPage";
import ProfilePage from "@/pages/customer/ProfilePage";
import MyReservationsPage from "@/pages/portal/vendor/MyReservationsPage";

import DashboardGateway from "@/pages/portal/DashboardGateway";

import { superAdminNavItems } from "@/pages/portal/superadmin/navItems";
import SuperAdminOverviewPage from "@/pages/portal/superadmin/SuperAdminOverviewPage";
import TenantsPage from "@/pages/portal/superadmin/TenantsPage";
import UsersPage from "@/pages/portal/superadmin/UsersPage";

import { ownerNavItems } from "@/pages/portal/owner/navItems";
import OwnerOverviewPage from "@/pages/portal/owner/OwnerOverviewPage";
import VenuesPage from "@/pages/portal/owner/VenuesPage";
import BlueprintEditorPage from "@/pages/portal/owner/BlueprintEditorPage";

import { organizerNavItems } from "@/pages/portal/organizer/navItems";
import OrganizerOverviewPage from "@/pages/portal/organizer/OrganizerOverviewPage";
import ManageEventsPage from "@/pages/portal/organizer/ManageEventsPage";
import PricingZoningPage from "@/pages/portal/organizer/PricingZoningPage";

import { vendorNavItems } from "@/pages/portal/vendor/navItems";
import VendorOverviewPage from "@/pages/portal/vendor/VendorOverviewPage";
import DiscoverStallsPage from "@/pages/portal/vendor/DiscoverStallsPage";

import { employeeNavItems } from "@/pages/portal/employee/navItems";
import ScannerPage from "@/pages/portal/employee/ScannerPage";
import CheckInsPage from "@/pages/portal/employee/CheckInsPage";

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          {/* Public / customer-facing */}
          <Route element={<CustomerLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/events" element={<BrowseEventsPage />} />
            <Route path="/events/:eventId" element={<EventDetailsPage />} />
            <Route path="/venues" element={<BrowseVenuesPage />} />
            <Route path="/venues/:venueId" element={<VenueDetailsPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/reservations" element={<MyReservationsPage />} />
            </Route>
          </Route>

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Portal gateway: redirects to the right dashboard by role */}
          <Route element={<ProtectedRoute />}>
            <Route path="/portal" element={<DashboardGateway />} />
          </Route>

          {/* Super Admin */}
          <Route element={<ProtectedRoute roles={[ROLES.SUPER_ADMIN]} />}>
            <Route
              path="/portal/superadmin"
              element={<AdminLayout title="Super Admin" navItems={superAdminNavItems} />}
            >
              <Route index element={<SuperAdminOverviewPage />} />
              <Route path="tenants" element={<TenantsPage />} />
              <Route path="users" element={<UsersPage />} />
            </Route>
          </Route>

          {/* Owner */}
          <Route element={<ProtectedRoute roles={[ROLES.OWNER, ROLES.SUPER_ADMIN]} />}>
            <Route path="/portal/owner" element={<AdminLayout title="Owner" navItems={ownerNavItems} />}>
              <Route index element={<OwnerOverviewPage />} />
              <Route path="venues" element={<VenuesPage />} />
              <Route path="blueprint" element={<BlueprintEditorPage />} />
            </Route>
          </Route>

          {/* Organizer */}
          <Route element={<ProtectedRoute roles={[ROLES.ORGANIZER, ROLES.OWNER, ROLES.SUPER_ADMIN]} />}>
            <Route
              path="/portal/organizer"
              element={<AdminLayout title="Organizer" navItems={organizerNavItems} />}
            >
              <Route index element={<OrganizerOverviewPage />} />
              <Route path="events" element={<ManageEventsPage />} />
              <Route path="pricing" element={<PricingZoningPage />} />
            </Route>
          </Route>

          {/* Vendor */}
          <Route element={<ProtectedRoute roles={[ROLES.VENDOR, ROLES.OWNER, ROLES.ORGANIZER, ROLES.SUPER_ADMIN]} />}>
            <Route path="/portal/vendor" element={<AdminLayout title="Vendor" navItems={vendorNavItems} />}>
              <Route index element={<VendorOverviewPage />} />
              <Route path="discover" element={<DiscoverStallsPage />} />
              <Route path="reservations" element={<MyReservationsPage />} />
            </Route>
          </Route>

          {/* Employee (Security / Vendor staff) - mobile-optimized */}
          <Route element={<ProtectedRoute roles={[ROLES.EMPLOYEE]} />}>
            <Route path="/portal/employee" element={<MobileLayout navItems={employeeNavItems} />}>
              <Route index element={<ScannerPage />} />
              <Route path="checkins" element={<CheckInsPage />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </ErrorBoundary>
  );
}
