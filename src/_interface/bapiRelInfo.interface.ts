
export interface BapiRelInfo {
  generalReleaseInfo: GeneralReleaseInfo[]
  releaseAlreadyPosted: any[]
  releaseFinal: ReleaseFinal[]
  releasePrerequisites: any[]
  return: any[]
}

export interface GeneralReleaseInfo {
  preqNo: string
  preqItem: string
  relGroup: string
  relGrpTx: string
  relStrat: string
  relStrTx: string
  relInd: string
  relIndTx: string
  relCode: string
  relCodTx: string
}

export interface ReleaseFinal {
  preqNo: string
  preqItem: string
  relCode1: string
  relCode2: string
  relCode3: string
  relCode4: string
  relCode5: string
  relCode6: string
  relCode7: string
  relCode8: string
  relCdTx1: string
  relCdTx2: string
  relCdTx3: string
  relCdTx4: string
  relCdTx5: string
  relCdTx6: string
  relCdTx7: string
  relCdTx8: string
  relWf1: string
  relWf2: string
  relWf3: string
  relWf4: string
  relWf5: string
  relWf6: string
  relWf7: string
  relWf8: string
}
