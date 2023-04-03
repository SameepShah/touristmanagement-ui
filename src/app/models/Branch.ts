import { Place } from "./Place";
export class Branch{
    public id: string;
    public BranchCode: string;
    public BranchName: string;
    public Website: string;
    public Contact: string;
    public Email: string;
    public CreatedDate: Date;
    public ModifiedDate: Date;
    public Places: Place[];
}