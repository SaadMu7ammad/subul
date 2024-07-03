const checkValueEquality = (inputOne: string, inputTwo: string) => {
  if (inputOne == inputTwo) {
    return true;
  }
  return false;
};
// const updateNestedProperties = (target, updateObject) => {
//   for (const key in updateObject) {
//     if (typeof updateObject[key] === 'object' && target[key]) {
//       // If the current property in updateObject is an object and the corresponding property in the target is also an object,
//       // recursively call the function to update nested properties.
//       updateNestedProperties(target[key], updateObject[key]);
//     } else {
//       // If the current property in updateObject is not an object or the corresponding property in the target is not an object,
//       // update the property in the target with the value from updateObject.
//       target[key] = updateObject[key];
//     }
//   }
// };
// type RecursivePartial<T> = {
//   [P in keyof T]?:
//     T[P] extends (infer U)[] ? RecursivePartial<U>[] :
//     T[P] extends object | undefined ? RecursivePartial<T[P]> :
//     T[P];
// };

const updateNestedProperties = (target: any, updateObject: any) => {
  //target storedCharity, updateObj=newInput
  for (const key in updateObject) {
    if (typeof updateObject[`${key}`] === 'object' && updateObject[`${key}`] && target[`${key}`]) {
      // If the current property in updateObject is an object and the corresponding property in the target is also an object,
      // recursively call the function to update nested properties.
      updateNestedProperties(target[`${key}`], updateObject[`${key}`]);
    } else if (updateObject[`${key}`] && target[`${key}`]) {
      // If the current property in updateObject is not an object or the corresponding property in the target is not an object,
      // update the property in the target with the value from updateObject.
      target[`${key}`] = updateObject[`${key}`];
    }
  }
};
function getValueByKey(obj: object, key: string) {
  return obj ?? [`${key}`];
}

const isDefined = <T>(x: T | undefined): x is T => {
  return typeof x !== 'undefined';
};
export { checkValueEquality, updateNestedProperties, getValueByKey, isDefined };
