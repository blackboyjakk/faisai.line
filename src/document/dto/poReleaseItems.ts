export interface PoReleaseItems {
  poHeaders: PoHeader[]
  poItems: PoItem[]
  return: any[]
}

export class PoHeader {
  poNumber: string
  coCode: string
  docCat: string
  docType: string
  cntrlInd: string
  deleteInd: string
  status: string
  createdOn: string
  createdBy: string
  itemIntvl: string
  lastItem: string
  vendor: string
  language: string
  pmnttrms: string
  dscnt1To: number
  dscnt2To: number
  dscnt3To: number
  cashDisc1: number
  cashDisc2: number
  purchOrg: string
  purGroup: string
  currency: string
  exchRate: number
  exRateFx: string
  docDate: string
  vperStart: string
  vperEnd: string
  applicBy: string
  quotDead: string
  bindgPer: string
  warranty: string
  bidinvNo: string
  quotation: string
  quotDate: string
  ref1: string
  salesPers: string
  telephone: string
  supplVend: string
  customer: string
  agreement: string
  rejReason: string
  complDlv: string
  grMessage: string
  supplPlnt: string
  rcvgVend: string
  incoterms1: string
  incoterms2: string
  targetVal: number
  collNo: string
  docCond: string
  procedure: string
  updateGrp: string
  diffInv: string
  exportNo: string
  ourRef: string
  logsystem: string
  subitemint: string
  mastCond: string
  relGroup: string
  relStrat: string
  relInd: string
  relStatus: string
  subjToR: string
  taxrCntry: string
  schedInd: string
  vendName: string
  currencyIso: string
  exchRateCm: number
  hold: string
  poItems: PoItem[]
}

export class PoItem {
  poNumber: string
  poItem: string
  address: string
  material: string
  purMat: string
  infoRec: string
  itemCat: string
  acctasscat: string
  agreement: string
  agmtItem: string
  storeLoc: string
  matGrp: string
  shortText: string
  distrib: string
  partInv: string
  kanbanInd: string
  plant: string
  allocTbl: string
  atItem: string
  unit: string
  netPrice: number
  priceUnit: number
  convNum1: number
  convDen1: number
  orderprUn: string
  pckgNo: string
  promotion: string
  acknReqd: string
  trackingno: string
  planDel: number
  retItem: string
  atRelev: string
  vendMat: string
  manufProf: string
  manuMat: string
  mfrNo: string
  mfrNoExt: string
  poPrice: string
  shipping: string
  itemCatExt: string
  poUnitIso: string
  orderprUnIso: string
  preqName: string
  dispQuan: number
  qualInsp: string
  noMoreGr: string
  deleteInd: string
  noRounding: string
  taxCode: string
  materialExternal: string
  materialGuid: string
  materialVersion: string
  purMatExternal: string
  purMatGuid: string
  purMatVersion: string
  valType: string
  prClosed: string
  acknowlNo: string
}
