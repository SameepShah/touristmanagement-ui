import { Place } from "./Place";
export class Branch{
    public id: string;
    public branchCode: string;
    public branchName: string;
    public website: string;
    public contact: string;
    public email: string;
    public createdDate: Date;
    public modifiedDate: Date;
    public places: Place[];
}