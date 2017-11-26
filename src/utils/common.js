export function removeOddSpaces(str) {
  if (!str)
    return '';
  return str.trim().replace(/\s+/g, ' ');
}

export function filterSpecials(str, symb = "_") {
  if (!str)
    return '';
  str = removeOddSpaces(str);
  return str.replace(/\W/g, symb);
}

export function filterSpecialsAndCapital(str, symb) {
  str = filterSpecials(str, symb);
  return str.toLowerCase();
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

export function checkEmail(str) {
  let pattern = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
  return pattern.test(str);
}

export function getRelativeTime(date) {
  let now = new Date();
  
  const SECOND = 1000;
  const MINUTE = 60 * SECOND;
  const HOUR = 60 * MINUTE;
  
  let diff = now - date;
  
  let locale = navigator.language || navigator.userLanguage;
  let time = date.toLocaleString(locale, {hour: 'numeric', minute: 'numeric'});
  let fullDate = date.toLocaleString(locale,
    {year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric'});
  
  if (diff < MINUTE) {
    if (diff < 10 * SECOND)
      return 'A few seconds ago';
    else
      return 'Less a minute ago';
    
  } else if (diff < HOUR) {
    let minutes = Math.floor(diff / MINUTE);
    if (minutes == 1)
      return `${minutes} minute ago`;
    else
      return `${minutes} minutes ago`;
  
  // today
  } else if (now.getDate() == date.getDate() &&
            now.getMonth() == date.getMonth() &&
            now.getFullYear() == date.getFullYear()) {
    return `Today, at ${time}`;
  
  } else {
    let tomorrow = new Date(date);
    tomorrow.setDate(tomorrow.getDate() + 1);
  
    // yesterday
    if (now.getDate() == tomorrow.getDate() &&
        now.getMonth() == tomorrow.getMonth() &&
        now.getFullYear() == tomorrow.getFullYear())
      return `Yesterday, at ${time}`;
  }
  
  return fullDate;
}

export function parseURLParams(querystring = null) {
  let urlParams = {};
  
  let pair; // Really a match. Index 0 is the full match; 1 & 2 are the key & val.
  let tokenize = /([^&=]+)=?([^&]*)/g;
  // decodeURIComponents escapes everything but will leave +s that should be ' '
  let reSpace = s => decodeURIComponent(s.replace(/\+/g, " "));
  // Substring to cut off the leading '?'
  if (!querystring)
    querystring = location.search.substring(1);
  
  while (pair = tokenize.exec(querystring))
    urlParams[reSpace(pair[1])] = reSpace(pair[2]);
  
  return urlParams;
}

export function URLEncode(params) {
  return Object
    .keys(params)
    .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(params[key]))
    .join('&');
}

export function promisify (pp) {
  return new Promise((rs, rj) => pp.then(rs, rj));
}