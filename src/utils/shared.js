const checkValueEquality = (inputOne, inputTwo) => {
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
const updateNestedProperties = (target, updateObject) => {//target storedCharity, updateObj=newInput
  for (const key in updateObject) {
    if (typeof updateObject[key] === 'object'&&updateObject[key] && target[key]) {
      // If the current property in updateObject is an object and the corresponding property in the target is also an object,
      // recursively call the function to update nested properties.
      updateNestedProperties(target[key], updateObject[key]);
    } else if (updateObject[key] && target[key]){
      // If the current property in updateObject is not an object or the corresponding property in the target is not an object,
      // update the property in the target with the value from updateObject.
      target[key] = updateObject[key];
    }
  }
};
export { checkValueEquality, updateNestedProperties };
