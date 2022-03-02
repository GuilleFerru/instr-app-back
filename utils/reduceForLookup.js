export const reduceForLookUp = (arr) => {
    return arr.reduce((acc, curr) => {
       acc[curr.id] = curr.name;
        return acc;
    }, {});
}