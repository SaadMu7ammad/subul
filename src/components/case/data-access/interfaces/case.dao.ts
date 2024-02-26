import { CasesDocument } from './case.interface';

export interface CaseDao {
    createCase: (caseData) => Promise<CasesDocument>;
    getAllCases: (sortObj, filterObj, page:number, pageLimit:number) => Promise<CasesDocument[]>;
    getCaseById: (id:string) => Promise<CasesDocument>;
    deleteCaseById: (id:string) => Promise<CasesDocument>;
    editCase: (caseData,id:string) => Promise<CasesDocument>;
}
