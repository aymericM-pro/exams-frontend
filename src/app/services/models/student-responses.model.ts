export interface StudentResponse {
  id: string;
  studentNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: 'Male' | 'Female' | 'Other';
  status: 'Active' | 'Inactive';
}
