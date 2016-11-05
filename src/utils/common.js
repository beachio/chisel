export function removeSpaces(str) {
  return str.trim().replace(/\s+/g, ' ');
}

export function filterSpecials(str) {
  if (str.match(/^\d/))
    str = '_' + str;
  return str.replace(/\W/g, "_");
  
  /*
  return str.replace(/\W+(.)/g, (match, chr) => {
    return chr.toUpperCase();
  });
  */
}

export function getRandomColor() {
  let red   = Math.floor(Math.random() * 256);
  let green = Math.floor(Math.random() * 256);
  let blue  = Math.floor(Math.random() * 256);
  return `rgba(${red}, ${green}, ${blue}, 1)`;
}