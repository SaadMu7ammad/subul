import { ICase, ICaseDocument,FilterObj, SortObj } from './case.interface';

export interface CaseDao {
    createCase: (caseData:ICase) => Promise<ICaseDocument|null>;
    getAllCases: (
        sortObj:SortObj,
        filterObj:FilterObj,
        page: number,
        limit: number
    ) => Promise<ICaseDocument[]|null>;
    getCaseById: (id: string) => Promise<ICaseDocument|null>;
    deleteCaseById: (id: string) => Promise<ICaseDocument|null>;
    editCase: (caseData:ICase, id: string) => Promise<ICaseDocument|null>;
}
