

export function getRandomColor() {
  let red   = Math.floor(Math.random() * 256);
  let green = Math.floor(Math.random() * 256);
  let blue  = Math.floor(Math.random() * 256);
  return `rgba(${red}, ${green}, ${blue}, 1)`;
}


export const BYTES = "Bytes";
export const K_BYTES = "KB";
export const M_BYTES = "MB";
export const DATA_UNITS = [BYTES, K_BYTES, M_BYTES];

export function convertDataUnits(data, oldUnit, newUnit) {
  switch (newUnit) {
    case BYTES:
      switch (oldUnit) {
        case K_BYTES: data = data * 1024; break;
        case M_BYTES: data = data * 1024 * 1024; break;
      }
      break;
    
    case K_BYTES:
      switch (oldUnit) {
        case BYTES:   data = Math.floor(data / 1024); break;
        case M_BYTES: data = data * 1024; break;
      }
      break;
    
    case M_BYTES:
      switch (oldUnit) {
        case BYTES:   data = Math.floor(data / 1024 / 1024); break;
        case K_BYTES: data = Math.floor(data / 1024); break;
      }
      break;
  }
  return data;
}


export const TYPE_IMAGE   = "Image";
export const TYPE_TEXT    = "Text";
export const TYPE_HTML    = "HTML";
export const TYPE_XML     = "XML";
export const TYPE_MARKDOWN= "Markdown";
export const TYPE_JSON    = "JSON";
export const TYPE_PDF     = "PDF";
export const TYPE_F_TEXT  = "Formatted text";
export const TYPE_TABLE   = "Table";
export const TYPE_PRESENT = "Presentation";
export const TYPE_AUDIO   = "Audio";
export const TYPE_VIDEO   = "Video";
export const TYPE_ARCHIVE = "Archive";
export const TYPE_EXE     = "Windows program";
export const TYPE_OTHER   = "Other";
export const FILE_TYPES = [TYPE_IMAGE, TYPE_TEXT, TYPE_HTML, TYPE_XML, TYPE_MARKDOWN, TYPE_JSON, TYPE_PDF, TYPE_F_TEXT,
  TYPE_TABLE, TYPE_PRESENT, TYPE_AUDIO, TYPE_VIDEO, TYPE_ARCHIVE, TYPE_EXE, TYPE_OTHER];

export function checkFileType(type) {
  if (type.slice(0, 6) == `image/`)
    return TYPE_IMAGE;
  
  else if (type == `text/html`)
    return TYPE_HTML;
  
  else if (type == `text/xml` ||
           type == `application/xml`)
    return TYPE_XML;
  
  else if (type == `text/markdown`)
    return TYPE_MARKDOWN;
  
  else if (type == `application/json`)
    return TYPE_JSON;
    
  else if (type.slice(0, 5) == `text/`)
    return TYPE_TEXT;
  
  else if (type == `application/pdf`)
    return TYPE_PDF;
    
  else if (type == `application/msword` ||
           type == `application/vnd.openxmlformats-officedocument.wordprocessingml.document` ||
           type == `application/vnd.oasis.opendocument.text` ||
           type == `application/x-iwork-pages-sffpages` ||
           type == `application/rtf`)
    return TYPE_F_TEXT;
  
  else if (type == `application/vnd.ms-excel` ||
           type == `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` ||
           type == `application/vnd.oasis.opendocument.spreadsheet` ||
           type == `application/x-iwork-numbers-sffnumbers`)
    return TYPE_TABLE;
  
  else if (type == `application/vnd.ms-powerpoint` ||
           type == `application/vnd.openxmlformats-officedocument.presentationml.presentation` ||
           type == `application/vnd.oasis.opendocument.presentation` ||
           type == `application/x-iwork-keynote-sffkey`)
    return TYPE_PRESENT;
    
  else if (type.slice(0, 6) == `audio/`)
    return TYPE_AUDIO;
    
  else if (type.slice(0, 6) == `video/`)
    return TYPE_VIDEO;
  
  else if (type == `application/zip` ||
           type == `application/gzip` ||
           type == `application/x-7z-compressed` ||
           type == `application/x-rar-compressed` ||
           type == `application/x-tar`)
    return TYPE_ARCHIVE;
  
  else if (type == `application/vnd.microsoft.portable-executable` ||
           type == `application/octet-stream` ||
           type == `application/exe` ||
           type == `application/x-exe`)
    return TYPE_EXE;
  
  return TYPE_OTHER;
}


export function setTimeout64(func, delay) {
  if (delay > 0x7FFFFFFF) //setTimeout limit is MAX_INT32=(2^31-1)
    setTimeout(() => setTimeout64(func, delay - 0x7FFFFFFF), 0x7FFFFFFF);
  else
    setTimeout(func, delay);
}


export function debounce(func, threshold, execAsap) {
  let timeout;

  return function debounced () {
    const obj = this, args = arguments;
    const delayed = () => {
      if (!execAsap)
        func.apply(obj, args);
      timeout = null;
    };

    if (timeout)
      clearTimeout(timeout);
    else if (execAsap)
      func.apply(obj, args);

    timeout = setTimeout(delayed, threshold || 100);
  };
}

export function throttle(func, ms) {
  let isThrottled = false,
    savedArgs,
    savedThis;

  return function wrapper() {
    if (isThrottled) { // (2)
      savedArgs = arguments;
      savedThis = this;
      return;
    }

    func.apply(this, arguments); // (1)

    isThrottled = true;

    setTimeout(() => {
      isThrottled = false; // (3)
      if (savedArgs) {
        wrapper.apply(savedThis, savedArgs);
        savedArgs = savedThis = null;
      }
    }, ms);
  };
}

export function isElectron() {
  const userAgent = navigator.userAgent.toLowerCase();
  return userAgent.indexOf(' electron/') > -1;
}

export function addElectronContextMenu(elm, readOnly) {
  if (!isElectron() || !elm)
    return;

  const {remote} = window.require('electron');
  const {Menu} = remote;

  const templateMenu =
    readOnly ?
      [
        {role: 'copy'},
        {role: 'selectall'}
      ]
    :
      [
        {role: 'undo'},
        {role: 'redo'},
        {type: 'separator'},
        {role: 'cut'},
        {role: 'copy'},
        {role: 'paste'},
        {role: 'selectall'}
      ];
  const contextMenu = Menu.buildFromTemplate(templateMenu);

  elm.addEventListener('contextmenu', e => {
    e.preventDefault();
    contextMenu.popup({window: remote.getCurrentWindow()})
  }, false);
}


let id = 0;
export function getUniqueId() {
  return id++;
}