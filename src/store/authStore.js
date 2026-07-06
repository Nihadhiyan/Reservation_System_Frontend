import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Portal roles this frontend routes on. Only SUPER_ADMIN and CUSTOMER are
 * real `User.SystemRole` values from the backend. OWNER/ORGANIZER/VENDOR are
 * *derived* client-side from the capabilities (OWNS_VENUES/ORGANIZES_EVENTS/
 * OPERATES_STALLS) of the organizations the user belongs to (see
 * deriveportalRoles below) - there is no such SystemRole value on the backend,
 * because organization-level permissions live on `Organization.capabilities`
 * + `OrganizationMember.role` (ORG_ADMIN/ORG_MEMBER), not on the user itself.
 * EMPLOYEE has no backing concept anywhere in the domain model (no staff/
 * security-guard entity exists yet) - it can never be derived and is kept
 * here only as a placeholder for when that's designed.
 */
export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  OWNER: "OWNER",
  ORGANIZER: "ORGANIZER",
  VENDOR: "VENDOR",
  EMPLOYEE: "EMPLOYEE",
  CUSTOMER: "CUSTOMER",
};

const CAPABILITY_TO_ROLE = {
  OWNS_VENUES: ROLES.OWNER,
  ORGANIZES_EVENTS: ROLES.ORGANIZER,
  OPERATES_STALLS: ROLES.VENDOR,
};

/**
 * organizations: result of organizationService.getMine() - OrganizationResponse[]
 * with a `capabilities: string[]` field. Returns the deduplicated set of portal
 * roles this user can access, derived from their SystemRole plus every
 * organization they belong to (a user can be, e.g., both an Owner and a Vendor).
 */
export function derivePortalRoles(user, organizations) {
  const roles = new Set();
  if (user?.role === ROLES.SUPER_ADMIN || user?.systemRole === ROLES.SUPER_ADMIN) {
    roles.add(ROLES.SUPER_ADMIN);
    roles.add(ROLES.OWNER);
    roles.add(ROLES.ORGANIZER);
    roles.add(ROLES.VENDOR);
  }
  if (user?.role === ROLES.CUSTOMER || user?.systemRole === ROLES.CUSTOMER) {
    roles.add(ROLES.CUSTOMER);
  }
  if (organizations && organizations.length > 0) {
    // Grant all commercial portal roles so Owners can access Vendor and Organizer portals
    roles.add(ROLES.OWNER);
    roles.add(ROLES.ORGANIZER);
    roles.add(ROLES.VENDOR);
  }
  return Array.from(roles);
}

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      portalRoles: [],

      isAuthenticated: () => Boolean(get().accessToken),

      setSession: ({ user, accessToken, refreshToken }) =>
        set({ user, accessToken, refreshToken }),

      setAccessToken: (accessToken) => set({ accessToken }),

      setPortalRoles: (portalRoles) => set({ portalRoles }),

      logout: () => set({ user: null, accessToken: null, refreshToken: null, portalRoles: [] }),

      hasRole: (...roles) => {
        const portalRoles = get().portalRoles;
        return roles.some((r) => portalRoles.includes(r));
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        portalRoles: state.portalRoles,
      }),
    }
  )
);
