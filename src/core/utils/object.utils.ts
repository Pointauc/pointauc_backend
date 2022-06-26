// import camelize from 'lodash.camelcase';
export function camelize(text) {
  text = text.replace(/[-_\s.]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''));
  return text.substr(0, 1).toLowerCase() + text.substr(1);
}
export const camelizeKeys = (obj: any): any =>
  Object.entries(obj).reduce(
    (accum, [key, value]) => ({ ...accum, [camelize(key)]: value }),
    {},
  );
