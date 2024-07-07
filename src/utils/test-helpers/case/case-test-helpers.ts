import Case from '@components/case/data-access/models/case.model';

export const clearCaseDatabase = async () => {
  await Case.deleteMany({});
};
