export interface IdentityUser {
  identityId: string;
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  roles: string[];
  enabled: boolean;
}
