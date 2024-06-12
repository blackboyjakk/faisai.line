import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { AxiosError, AxiosRequestConfig } from 'axios';
import { BapiRelInfo } from '../_interface/bapiRelInfo.interface'
import { firstValueFrom, throwError } from 'rxjs';
import { BapiRequisitionItem, BapiRequisitionResponse } from 'src/_interface/bapiRequisitionItems.interface';
import { BapiMaterialDesc, Matnrlist } from 'src/_interface/bapiMaterialDesc.interface';
import { WorkflowService } from 'src/workflow/workflow.service';
import { Employee } from 'src/_entities/employee.entity';
@Injectable()
export class DocumentService {
  constructor(
    private readonly http: HttpService,
    private readonly workflow: WorkflowService
  ) { }

  async getDocuments(type: string): Promise<BapiRequisitionItem[]> {
    const url = 'BAPI_REQUISITION_GETITEMS?sap-client=900';
    let data = {
      delivDate: "2020-02-21",
      relCode: ''
    }

    const res = await this.http.axiosRef.post<BapiRequisitionResponse>(url, data);
    return res.data.requisitionItems.slice(0, 10);
  }

  async getDocumentDetail(prNo: string, itemNo: string): Promise<BapiRequisitionItem> {
    const url = 'BAPI_REQUISITION_GETDETAIL?sap-client=900';
    let data = {
      number: prNo,
      preqNo: prNo,
      preqItem: itemNo,
      itemNo: itemNo,
    }

    const res = await this.http.axiosRef.post<BapiRequisitionResponse>(url, data).then((res) => res).catch((error: AxiosError) => {

      throw new InternalServerErrorException(error.message)

    });
    const doc = res.data.requisitionItems.find(r => r.preqItem == itemNo);
    if (res.data.requisitionItems?.length > 0) {
      return doc;
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
  async approveDocument(prNo: string, itemNo: string, notes: string) {
    
    const doc = await this.getDocumentDetail(prNo, itemNo)
    const wf =   this.workflow.approve(doc, "PR",notes)

  }
  async postDocument(prNo: string, itemNo: string, notes: string) {
    const url = 'BAPI_REQUISITION_GETRELINFO?sap-client=900';
    let data = {
      number: prNo,
      item: itemNo,
      relCode: ''
    }
    const headers: AxiosRequestConfig = { auth: { username: 'dm_pt1', password: 'protos#2024' } }
    const res = await this.http.axiosRef.post<BapiRelInfo>(url, data, headers)

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
        if (releaseFinal['relCode' + i] != '' && (res.data.releaseAlreadyPosted.length == 0 || (res.data.releaseAlreadyPosted.length > 0 && res.data.releaseAlreadyPosted['relCode' + i]))) {
          data = { ...data, relCode: releaseFinal['relCode' + i] }
          await this.http.axiosRef.post<BapiRelInfo>(url, data, headers)
        }
      });
    }
  }
  async getDocumentWorkflow(prNo: string, itemNo: string) {
    const doc = await this.getDocumentDetail(prNo, itemNo)
    const workflow = await this.workflow.simulateWorkflow(doc, "PR")
    return workflow;
  }
}
