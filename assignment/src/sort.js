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
export default sort;