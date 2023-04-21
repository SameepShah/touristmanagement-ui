import { Branch } from "./Branch";
import { Place } from "./Place";

export class AddBranch {
    public branchCode: string;
    public branchName: string;
    public website: string;
    public email: string;
    public contact: string
    public places: Place[];
}