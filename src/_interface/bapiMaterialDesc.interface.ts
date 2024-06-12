export interface BapiMaterialDesc {
  distributionchannelselection: any[]
  manufacturerpartnumb: any[]
  materialshortdescsel: Materialshortdescsel[]
  matnrlist: Matnrlist[]
  matnrselection: Matnrselection[]
  plantselection: any[]
  return: any[]
  salesorganisationselection: any[]
  storagelocationselect: any[]
}

export interface Materialshortdescsel {
  sign: string
  option: string
  descrLow: string
  descrHigh: string
}

export interface Matnrlist {
  material: string
  matlDesc: string
  materialExternal: string
  materialGuid: string
  materialVersion: string
}

export interface Matnrselection {
  sign: string
  option: string
  matnrLow: string
  matnrHigh: string
}
