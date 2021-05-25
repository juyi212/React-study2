import hotkeys from 'hotkeys-js';

const observerMap ={}

export function addKeyObserver(key, callback){
  //hotkeys-js 사용 
  //hotkeys(key, () => {})
  if(!observerMap[key]){
    observerMap[key] = [];
    hotkeys(key, () => executeCallbacks(key))
  }
  observerMap[key].push(callback)
}

export function removeKeyObserver(key, callback){
  observerMap[key] = observerMap.filter(item => item !== callback)
}

function executeCallbacks(key) {
  for (const ob of observerMap[key]) {
    ob()
  }
}