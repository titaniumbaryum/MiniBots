export function makeEventPromise(target,type){
  return new Promise((res,rej)=>{
    const f = e=>{
      target.removeEventListener(type,f);
      res(e);
    };
    target.addEventListener(type,f);
  });
}
export function delay(t){
  return new Promise((res,rej)=>setTimeout(res,t));
}
export function backLoop(f){
  setTimeout(f,0);
}


//use: // promisify(f,...args)
export function promisify(f,...args){
  return new Promise((res,rej)=>{
    try{
      f(res,...args);
    }catch(e){
      rej(e);
    }
  });
}
