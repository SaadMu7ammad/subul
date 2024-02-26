import { CaseDocument } from './case.interface';

export interface CaseDao {
    createCase: (caseData) => Promise<CaseDocument>;
    getAllCase: (sortObj, filterObj, page:number, pageLimit:number) => Promise<CaseDocument[]>;
    getCaseById: (id:string) => Promise<CaseDocument>;
    deleteCaseById: (id:string) => Promise<CaseDocument>;
    editCase: (caseData,id:string) => Promise<CaseDocument>;
}
