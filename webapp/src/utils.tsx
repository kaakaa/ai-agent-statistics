export const getBaseUrl = () => {
  const basepath = import.meta.env.BASE_URL
  return `${window.location.protocol}//${window.location.host}${basepath}`.replace(/\/$/, '');
}
