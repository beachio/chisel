export function removeSpaces(str) {
  if (!str)
    return '';
  return str.trim().replace(/\s+/g, ' ');
}

export function filterSpecials(str) {
  if (!str)
    return '';
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

export function trimFileExt(name) {
  let ind = name.lastIndexOf('.');
  if (ind > 0)
    return name.slice(0, ind);
  else
    return name;
}