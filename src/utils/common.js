export function removeOddSpaces(str) {
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

export function checkURL(str) {
  let pattern = new RegExp('^(https?:\\/\\/)' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
  return pattern.test(str);
}