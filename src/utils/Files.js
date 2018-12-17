import { makeEventPromise, backLoop } from "./Promises"
export async function readFile(file){
  const reader = new FileReader();
  backLoop(()=>reader.readAsText(file));
  await makeEventPromise(reader,"loadend");
  return reader.result;
}
