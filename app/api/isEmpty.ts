export function isEmpty(arr: string[]) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].trim() === "") return true;
  }
  return false;
}
