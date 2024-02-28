import { Case, CaseDocument,FilterObj, SortObj } from './case.interface';

export interface CaseDao {
    createCase: (caseData:Case) => Promise<CaseDocument>;
    getAllCases: (
        sortObj:SortObj,
        filterObj:FilterObj,
        page: number,
        limit: number
    ) => Promise<CaseDocument[]>;
    getCaseById: (id: string) => Promise<CaseDocument|null>;
    deleteCaseById: (id: string) => Promise<CaseDocument|null>;
    editCase: (caseData:Case, id: string) => Promise<CaseDocument|null>;
}
