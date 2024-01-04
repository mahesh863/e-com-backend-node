import { admin, subAdmin, superAdmin } from './roles';

export const superAdminAccess = [superAdmin];
export const adminAccess = [admin, superAdmin];
export const generalAdminAccess = [subAdmin, admin, superAdmin];
