import { Case, CaseDocument,FilterObj, SortObj } from './case.interface';

export interface CaseDao {
    createCase: (caseData) => Promise<CaseDocument>;
    getAllCase: (
        sortObj:SortObj,
        filterObj:FilterObj,
        page: number,
        limit: number
    ) => Promise<CaseDocument[]>;
    getCaseById: (id: string) => Promise<CaseDocument>;
    deleteCaseById: (id: string) => Promise<CaseDocument>;
    editCase: (caseData:Case, id: string) => Promise<CaseDocument>;
}
