import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { prRelInfo } from './dto/prRelInfo.dto'
import { prRequisitionItem, prRequisitionResponse } from 'src/document/dto/prRequisitionItems.dto';
import { BapiMaterialDesc, Matnrlist } from 'src/document/dto/bapiMaterialDesc.dto';
import { WorkflowService } from 'src/workflow/workflow.service';
import { RFC, RfcReadTable } from './dto/rfcReadTable.dto';
import { PoHeader, PoReleaseItems, PoItem } from './dto/poReleaseItems.dto';
@Injectable()
export class DocumentService {
  constructor(
    private readonly http: HttpService,
    private readonly workflow: WorkflowService
  ) { }

  async getPrDocuments(): Promise<prRequisitionItem[]> {
    const url = 'BAPI_REQUISITION_GETITEMS?sap-client=900';
    let data = {
      delivDate: "2020-02-21",
      relCode: ''
    }
    const res = await this.http.axiosRef.post<prRequisitionResponse>(url, data);
    return res.data.requisitionItems;
  }
  async getPoDocuments() {
    const rfcList = await this.getRfcReadTable()

    return axios.all(rfcList.map((rfc) => this.getPoItemsRelease(rfc))).then(
      axios.spread((...res) => {
        const headers = res.map(m => m.data.poHeaders)
        return headers.reduce((p: PoHeader[], c: PoHeader[]) => {
          return p.concat(c);
        }, [])
      }

      ))
  }
  async getRfcReadTable() {
    const url = 'RFC_READ_TABLE?sap-client=900';
    let data = {
      delimiter: ",",
      queryTable: "T16FC",
      fields: [
        {
          fieldname: "FRGGR"
        },
        {
          fieldname: "FRGCO"
        }
      ]
    }

    const res = await this.http.axiosRef.post<RfcReadTable>(url, data);
    return res.data.data.map(data => {
      return new RFC(data)
    });
  }

  getPoItemsRelease(rel: RFC) {
    const url = 'BAPI_PO_GETITEMSREL?sap-client=900';
    let payload = {
      itemsForRelease: "X",
      relGroup: rel.group,
      relCode: rel.code
    }
    return this.http.axiosRef.post<PoReleaseItems>(url, payload);
  }
  async getPrDocumentDetail(prNo: string, itemNo: string): Promise<prRequisitionItem> {
    const url = 'BAPI_REQUISITION_GETDETAIL?sap-client=900';
    let data = {
      number: prNo,
      preqNo: prNo,
      preqItem: itemNo,
      itemNo: itemNo,
    }
    try{
    const res = await this.http.axiosRef.post<prRequisitionResponse>(url, data).then((res) => res).catch((error: AxiosError) => {

      throw new InternalServerErrorException(error.message)

    });
    const doc = res.data.requisitionItems.find(r => r.preqItem == itemNo);
    if (res.data.requisitionItems?.length > 0) {
      return doc;
    } else {
      throw new NotFoundException('Document not found')
    }}catch(error){

    }
  }


  async getPoDocumentDetail(poNo: string): Promise<PoReleaseItems> {
    const url = 'BAPI_PO_GETITEMS?sap-client=900';
    let data = {
      purchaseorder: poNo,
      withPoHeaders: "X"
    }

    const res = await this.http.axiosRef.post<PoReleaseItems>(url, data).catch((error: AxiosError) => {
      throw new InternalServerErrorException(error.message)
    });

    if (res.data.poHeaders?.length > 0 && res.data.poItems?.length > 0) {
      return res.data;
    } else {
      throw new NotFoundException('Document not found')
    }
  }

  async getMaterialDescription(materials: string[]): Promise<Object[]> {
    const url = 'BAPI_MATERIAL_GETLIST?sap-client=900';
    let data = {
      "matnrselection": materials.map(mat => {
        return {
          "sign": "I",
          "option": "EQ",
          "matnrLow": "mat",
          "matnrHigh": ""
        }

      })
    }

    const res = await this.http.axiosRef.post<BapiMaterialDesc>(url, data);
    if (res.status === 200) {

      const matnrlist = res.data.matnrlist.map((mat: Matnrlist) => {
        let m: Object = new Object();
        m[mat.material] = mat.matlDesc
        return m
      })
      return Promise.resolve(matnrlist);
    }
  }
  async approvePrDocument(prNo: string, itemNo: string, notes: string) {

    const doc = await this.getPrDocumentDetail(prNo, itemNo)
    const workflows = await this.workflow.getPrWorkflow(doc)
    const Workflow = workflows.find(w => w.status == 'W')
    if (Workflow.action == 'P') {
      this.postPrDocument(prNo, itemNo, notes).then(async ()=>{
        
        const result = await this.workflow.approvePrDocument(doc, "PR", notes)
      })
    }else{
      
        const result = await this.workflow.approvePrDocument(doc, "PR", notes)
    }
  }
  async rejectPrDocument(prNo: string, itemNo: string, notes: string) {

    const doc = await this.getPrDocumentDetail(prNo, itemNo)
    const result = await this.workflow.rejectPrDocument(doc, "PR", notes)

  }
  async approvePoDocument(prNo: string, notes: string) {

    const doc = await this.getPoDocumentDetail(prNo)
    const result = await this.workflow.approvePoDocument(doc, "PO", notes)
    if (result) {
      this.postPoDocument(prNo, notes)
    }
  }
  async postPrDocument(prNo: string, itemNo: string, notes: string) {
    
    const url = 'BAPI_REQUISITION_GETRELINFO?sap-client=900';
    let data = {
      number: prNo,
      item: itemNo,
      relCode: ''
    }
    const headers: AxiosRequestConfig = { auth: { username: 'dm_pt1', password: 'protos#2024' } }
    const res = await this.http.axiosRef.post<prRelInfo>(url, data, headers)

    if (res) {
      if (res.data.return.length > 0) {
        throw new BadRequestException(res.data.return[0].message);
      }
      if (res.data.releaseFinal.length == 0) {
        throw new BadRequestException(`Purchase requisition ${prNo} ${itemNo} not ready to post`);
      }
      if (res.data.generalReleaseInfo[0].relInd == 'R') {
        throw new BadRequestException(`Purchase requisition ${prNo} ${itemNo} already released`)
      }
      const url = process.env.SAP_APP_BASE_URL + 'BAPI_REQUISITION_RELEASE?sap-client=900';

      res.data.releaseFinal.forEach(async (releaseFinal, i, array) => {
        for (let relInx = 1; relInx <= 8; relInx++) {
          if (releaseFinal['relCode' + relInx] != '' && (res.data.releaseAlreadyPosted.length == 0 || (res.data.releaseAlreadyPosted.length > 0 && res.data.releaseAlreadyPosted[i]['relCode' + relInx]))) {
            data = { ...data }
            data['relCode'] = releaseFinal['relCode' + relInx]
            const result = await this.http.axiosRef.post<BapiRequisitionRelease>(url, data, headers)
            console.log(result.data.return)
          }
        }

      });
    }
  }
  async postPoDocument(poNo: string, notes: string) {
    const url = 'BAPI_PO_GETRELINFO?sap-client=900';
    let data = {
      purchaseorder: poNo,
      relCode: ''
    }
    const headers: AxiosRequestConfig = { auth: { username: 'dm_pt1', password: 'protos#2024' } }
    const res = await this.http.axiosRef.post<prRelInfo>(url, data, headers)

    if (res) {
      if (res.data.return.length > 0) {
        throw new BadRequestException(res.data.return[0].message);
      }
      if (res.data.releaseFinal.length == 0) {
        throw new BadRequestException(`Purchase requisition ${poNo} not ready to post`);
      }
      if (res.data.generalReleaseInfo[0].relInd == 'R') {
        throw new BadRequestException(`Purchase requisition ${poNo} already released`)
      }
      const url = process.env.SAP_APP_BASE_URL + 'BAPI_REQUISITION_RELEASE?sap-client=900';

      res.data.releaseFinal.forEach(async (releaseFinal, i, array) => {
        if (releaseFinal['relCode' + i] != '' && (res.data.releaseAlreadyPosted.length == 0 || (res.data.releaseAlreadyPosted.length > 0 && res.data.releaseAlreadyPosted['relCode' + i]))) {
          data = { ...data, relCode: releaseFinal['relCode' + i] }
          await this.http.axiosRef.post<prRelInfo>(url, data, headers)
        }
      });
    }
  }
  async getPrDocumentWorkflow(prNo: string, itemNo: string) {
    const doc = await this.getPrDocumentDetail(prNo, itemNo)
    const workflow = await this.workflow.simulatePrWorkflow(doc, "PR")
    return workflow;
  }
}
