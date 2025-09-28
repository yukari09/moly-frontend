/**
 * Authentication and authorization utilities
 */

/**
 * Check if user has a specific role
 * @param {Object} session - NextAuth session object
 * @param {string} role - Role to check for
 * @returns {boolean}
 */
export function hasRole(session, role) {
  if (!session?.user?.roles) return false;
  return session.user.roles.includes(role);
}

/**
 * Check if user has any of the specified roles
 * @param {Object} session - NextAuth session object
 * @param {string[]} roles - Array of roles to check for
 * @returns {boolean}
 */
export function hasAnyRole(session, roles) {
  if (!session?.user?.roles) return false;
  return roles.some(role => session.user.roles.includes(role));
}

/**
 * Check if user is an admin
 * @param {Object} session - NextAuth session object
 * @returns {boolean}
 */
export function isAdmin(session) {
  return hasRole(session, 'admin');
}

/**
 * Check if user is a moderator or admin
 * @param {Object} session - NextAuth session object
 * @returns {boolean}
 */
export function isModerator(session) {
  return hasAnyRole(session, ['admin', 'moderator']);
}

/**
 * Get user roles as array
 * @param {Object} session - NextAuth session object
 * @returns {string[]}
 */
export function getUserRoles(session) {
  return session?.user?.roles || [];
}