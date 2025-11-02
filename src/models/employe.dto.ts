
export interface Employe {
  id: string;
  matricule: string;
  identity: Identity;
  civilStatus: CivilStatus;
  adress: Address;
  contact: Contact;
  postName: string;
  managerName: string;
  banques: Bank[];
  educations: Education[];
  contrats: Contrat[];
  children: Child[] | null;
}

export interface Child {
  id: string;
  identity: Identity;
  file?: {
    formFile: File | null;
  };
  isDependent: boolean;
  educations: Education[] | null;
}

export interface Contrat {
  id: string;
  typeContrat: string;
  startDate: string;
  endDate: string;
  salaryMensual: string;
}

export interface Education {
  id: string;
  etablissement: string;
  graduation: string;
  fieldOfStudy: string;
  graduationYear: Date;
}

export interface Bank {
  id: string;
  rib: string;
  iban: string;
  countryCode: string;
  bic: string;
  accountLabel: string;
}

export interface TableEmploye {
  nom: string;
  prenom: string;
  poste: string;
  departement: string;
  email: string;
  phoneNumber: string;
}

export interface Identity {
  firstName: string|null;
  lastName: string|null;
  profil: Resource|null;
  gender: Gender|null;
  civility: Civility|null;
  birthDate: string|null;
  birthPlace: string|null;
  nationality: string |null;
}

export interface Resource {
  name: string;
  url: string|null;
  contentType: string;
  extension: string;
}

export interface CivilStatus {
  maritalStatus: CivilStatusType;
  spouseLastName: string;
  spouseFirstName: string;
  profil: Resource;
  gender: Gender  | null;
  birthDate: string;
  birthPlace: string;
  nationality: string;
  phoneNumber: string[];
  email: string[];
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

export type Gender = "MALE" | "FEMALE";
export type Civility = "Mme" | "Mr" | "Mlle";
export type CivilStatusType = "SINGLE" | "MARRIED" | "DIVORCED" | "WIDOWED";