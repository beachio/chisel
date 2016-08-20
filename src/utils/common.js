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