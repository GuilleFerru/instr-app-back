export const reduceForLookUp = (arr) => {
    return arr.reduce((acc, curr, index) => {
        console.log(curr.id)
        acc[curr.id] = curr.name;
        return acc;
    }, {});
}