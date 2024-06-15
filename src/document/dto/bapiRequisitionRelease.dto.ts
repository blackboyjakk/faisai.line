interface BapiRequisitionRelease {
  relIndicatorNew: string;
  relStatusNew: string;
  return: Return[];
}
interface Return {
  type: string;
  code: string;
  message: string;
  logNo: string;
  logMsgNo: string;
  messageV1: string;
  messageV2: string;
  messageV3: string;
  messageV4: string;
}