export const reduceForLookUp = (arr) => {
    return arr.reduce((acc, curr, index) => {
        acc[curr.id] = curr.name;
        return acc;
    }, {});
}
