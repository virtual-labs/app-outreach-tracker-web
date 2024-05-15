function capitalizeFirstLetter(str) {
  str = str.split("-").join(" ");

  function capitalizaWord(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  let token = str.split(" ");
  let newStr = [];
  for (let i = 0; i < token.length; i++) {
    newStr.push(capitalizaWord(token[i]));
  }
  return newStr.join(" ");
}

export { capitalizeFirstLetter };
