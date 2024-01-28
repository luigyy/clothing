// fn to clean type of params
export default function cleanQueryParam(param: string | string[] | undefined) {
  if (!param) return undefined;
  if (Array.isArray(param)) {
    return param[0];
  }
  return param;
}
