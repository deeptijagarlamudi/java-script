//import sort from "./sort";

//1. Sort given array.
const sort = (target) => {
    for(let i = 0 ; i < target.length ; i++ ){
        for(let j=0 ; j<target.length; j++){
            if(target[i]< target[j])
            {
            let temp = target[i];
            target[i] = target[j];
            target[j] = temp;
            }
        }
    }
    return target;
};
//2. Find and display duplicate number.
const findDuplicates = (target) => {
    let duplicates = new Array;
    for(let i = 0 ; i < target.length-1 ; i++ ){
        if(target[i] === target[i+1] && target[i+1] !== target[i+2])
        duplicates.push(target[i])
        } 
        return duplicates;
    };

//3. Replace 76 value with 175 (update).

const replace = (sourceEle,targetEle,target) => {
    for(let i = 0 ; i < target.length ; i++ ){
        if(target[i] === sourceEle)
        target[i] = targetEle;
        } 
        return target;
    };

//4. Add new number into above given array (make sure new number should be unique).

const addNewEle = (newEle,target) => {
     target.push(newEle);
     return target;
    };


//5. Remove all duplicates.
const removeDuplicates = (target) => {
    for(let i = 0 ; i < target.length-1 ; i++ ){
        if(target[i] === target[i+1])
        target.splice(i,i+1);
        } 
        return target;
    };

//6. Remove all duplicates and copy non duplicate array into new array.
const removeDuplicatesAndCopyToNewArray = (target) => {
    let newArray = new Array;
    newArray = removeDuplicates(target);
        return newArray;
    
};
//7.update all the elements of given array by multiplying 10
const multiPlyAll = (targetArray, value) => {
    let newArray = targetArray.map(multiPly);
    return newArray;
    
};


const multiPly = (num) =>{
  return num*10;
}

  //8.Reverse an array as mutable
const reverseAsMutable = (targetArray) => {
    var newArray = reverseArray(targetArray);
    return newArray;
};

//9.Reverse an array as immutable
const reverseAsImmutable = (targetArray) => {
    const newArray =  reverseArray(targetArray);
    return newArray;
};

// Reverse logic
const reverseArray = (targetArray) =>{
    var newArray = new Array;
    for(let i=targetArray.length-1;i>=0;i--){
        newArray.push(targetArray[i]);
    }
    return newArray;
};

//10.Find duplicates in given array in dislay them like following
//43 is repeated 3 times
//23 is repeated 2 times 
const findDuplicatesAndCount = (target) => {
    let duplicates = new Map;
    for(let i = 0 ; i < target.length-1 ; i++ ){
        if(target[i] === target[i+1])
        {
        if(duplicates[target[i]+' repeated ']!==undefined)
        {
            duplicates[target[i]+' repeated '] = duplicates[target[i]+' repeated ']+1;
        }
        else{
            duplicates[target[i]+' repeated '] = 1;  
        }
        } 
    }
        return duplicates;
    };


const target = [65,43,98,43,23,76,32,54,23,43];
const sortedArray = sort(target) ;
console.log("1.Sorted array: " + sortedArray);
const duplicatesConst = findDuplicates (sortedArray);
console.log("2.Duplicates: " + duplicatesConst);
let tempArray = target.slice();
console.log("3.Replace: " + replace(76,175,tempArray));
tempArray = target.slice();
console.log("4.Added new element 276: " + addNewEle(276,tempArray));
let uniqueArray = removeDuplicates(tempArray);
console.log("5.After filtering duplicates: " + uniqueArray);
let newUniqueArray  = removeDuplicatesAndCopyToNewArray(target.slice());
console.log("6.New UniqueArray: " + newUniqueArray);
let multiPlieArray = multiPlyAll(newUniqueArray, 10);
console.log("7.Multiply by 10: " + multiPlieArray);
console.log("8.Reverse as mutable: "+ reverseAsMutable(target.slice()));
console.log("9.Reverse as immutable: "+ reverseAsImmutable(target.slice()));
console.log("10.Display repeated times: " +JSON.stringify(findDuplicatesAndCount(sortedArray)));







