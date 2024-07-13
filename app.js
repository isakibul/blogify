const arr = [2, 3, 4, 5, 6, 8];

const sum = arr.reduce((acc, cur) => (cur % 2 === 0 ? acc + cur : acc));

console.log(sum);
