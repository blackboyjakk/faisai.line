
import {WorkflowItem} from './workflowItem.interface'
export class BapiRequisitionResponse {
  requisitionItems: BapiRequisitionItem[]
  Workflow:WorkflowItem[]
  return: BapiReturn[]
}

export class BapiRequisitionItem {
  preqNo: string
  preqItem: string
  docType: string ="PR"
  purGroup: string
  createdBy: string
  preqName: string
  preqDate: string
  shortText: string
  material: string
  purMat: string
  plant: string
  storeLoc: string
  trackingno: string
  matGrp: string
  supplPlnt: string
  quantity: number
  unit: string
  delDatcat: string
  delivDate: string
  relDate: string
  grPrTime: number
  cAmtBapi: number
  priceUnit: number
  itemCat: string
  acctasscat: string
  distrib: string
  partInv: string
  grInd: string
  grNonVal: string
  irInd: string
  desVendor: string
  fixedVend: string
  purchOrg: string
  agreement: string
  agmtItem: string
  infoRec: string
  quotaArr: string
  quotarritm: string
  mrpContr: string
  bomexplNo: string
  lastResub: string
  resubmis: number
  noResub: number
  valType: string
  specStock: string
  poUnit: string
  revLev: string
  pckgNo: string
  kanbanInd: string
  poPrice: string
  intObjNo: string
  promotion: string
  batch: string
  vendMat: string
  ordered: number
  currency: string
  manufProf: string
  manuMat: string
  mfrNo: string
  mfrNoExt: string
  delDatcatExt: string
  currencyIso: string
  itemCatExt: string
  preqUnitIso: string
  poUnitIso: string
  generalRelease: string
  materialExternal: string
  materialGuid: string
  materialVersion: string
  purMatExternal: string
  purMatGuid: string
  purMatVersion: string
  reqBlocked: string
  reasonBlocking: string
  procuringPlant: string
  cmmtItem: string
  fundsCtr: string
  fund: string
  resDoc: string
  resItem: string
  funcArea: string
  grantNbr: string
  fundLong: string
  budgetPeriod: string
}

export class BapiReturn {
  type: string
  code: string
  message: string
  logNo: string
  logMsgNo: string
  messageV1: string
  messageV2: string
  messageV3: string
  messageV4: string
}
