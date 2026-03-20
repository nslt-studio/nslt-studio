export let previousUrl     = '/'
export let detailsName     = ''
export let detailsServices = ''

export function setPreviousUrl(url) {
  previousUrl = url
}

export function setDetailsData(name, services) {
  detailsName     = name
  detailsServices = services
}
