export interface CreateClassRequest {
  name: 'L1' | 'L2' | 'L3' | 'M1' | 'M2';
  graduationYear: string;
  studentIds: string[];
  professorIds: string[];
}
