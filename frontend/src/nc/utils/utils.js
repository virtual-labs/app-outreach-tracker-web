function capitalizeFirstLetter(str) {
  str = str.split("-").join(" ");
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export { capitalizeFirstLetter };
