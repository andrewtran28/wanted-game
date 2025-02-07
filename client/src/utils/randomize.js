const imgArr = [
  "penguins/Aurora.png",
  "penguins/Wade.png",
  "penguins/Roald.png",
  "penguins/Chabwick.png",
  "penguins/Flo.png",
  "penguins/Gwen.png",
];

const selectTarget = () => {
  return Math.floor(Math.random() * imgArr.length);
};

const randomExcluding = (excludedNum) => {
  let randomNum;
  do {
    randomNum = Math.floor(Math.random() * imgArr.length);
  } while (randomNum === excludedNum);

  return randomNum;
};

export { imgArr, selectTarget, randomExcluding };
