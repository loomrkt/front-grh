import { Civility, Gender } from "./employe.dto";


export interface CreateEmployeDto {
    FirstName: string;
    LastName: string;
    Civility: Civility| null;
    Contact: {
        PhoneNumber: string[];
        Email: string[];
    }
    PostId: string;
    DepartmentId: string;
    Gender: Gender| null;
    Avatar: {
        FormFile: File | null;
    };
}