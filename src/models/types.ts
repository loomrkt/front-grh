export type Gender = "MALE" | "FEMALE" | "OTHER";
export type MaritalStatus = "SINGLE" | "MARRIED" | "DIVORCED" | "WIDOWED";
export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export interface Profile {
  name: string;
  url: string;
  contentType: string;
  extension: string;
}

export interface Identity {
  lastName: string;
  firstName: string;
  profil?: Profile;
  gender: Gender;
  civility: string;
  birthDate: string;
  birthPlace: string;
  nationality: string;
}

export interface SpouseIdentity extends Identity {}

export interface SpouseContact {
  phoneNumber: string[];
  email: string[];
}

export interface CivilStatus {
  maritalStatus: MaritalStatus;
  spouseIdentity?: SpouseIdentity;
  spouseContact?: SpouseContact;
}

export interface Address {
  lotNumber: string;
  city: string;
  postalCode: string;
  district: string;
  municipality: string;
  region: string;
  country: string;
}

export interface Contact {
  phoneNumber: string[];
  email: string[];
}

export interface Bank {
  id: string;
  rib: string;
  iban: string;
  countryCode: string;
  bic: string;
  accountLabel: string;
}

export interface Contract {
  id: string;
  contratReference: string;
  typeContrat: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  salaryMensual: number;
}

export interface Education {
  graduation: string;
  filedOfStudy: string;
  graduationYear: string;
}

export interface Child {
  id: string;
  identity: Identity;
  isDependent: boolean;
}

export interface User {
  id: string;
  matricule: string;
  identity: Identity;
  civilStatus: CivilStatus;
  adress: Address;
  contact: Contact;
  banques: Bank[];
  contrats: Contract[];
  educations: Education[];
  children: Child[];
  status: UserStatus;
  managerId: string;
  postId: string;
  departmentId: string;
}

export interface ApiResponse {
  success: boolean;
  code: number;
  message: string;
  meta: {
    totalPage: number;
    total: number;
    page: number;
    limit: number;
  };
  data: User[];
}

export interface Occupation {
  status: string;
  position: string;
  supervisor: string;
}