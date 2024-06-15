import { Controller, Get, Post, Param, Req, Body, UseGuards } from '@nestjs/common';
import { DocumentService } from './document.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from 'src/_entities/user.entity';
import { WorkflowService } from 'src/workflow/workflow.service';
import { BapiRequisitionItem } from 'src/document/dto/bapiRequisitionItems.dto';
import { PoReleaseItems } from './dto/poReleaseItems';

@Controller()
export class DocumentController {
  constructor(
    private readonly documentService: DocumentService,
    private readonly workflowService: WorkflowService) { }

  @Post('pr/:prNo/:itemNo')
  public async getPrDocumentDetails(@Param('prNo') prNo: string, @Param('itemNo') itemNo: string) {
    const item :BapiRequisitionItem =  await this.documentService.getPrDocumentDetail(prNo, itemNo);
    const actions = await this.workflowService.getPrWorkflow(item,)
    return {item,actions}
  }
  @Post('pr/:prNo/:itemNo/approve')
  public approvePrDocument(@Param('prNo') prNo: string, @Param('itemNo') itemNo: string, @Body() form: any) {
    return this.documentService.approvePrDocument(prNo, itemNo, form.note);
  }
  @Post('pr/:prNo/:itemNo/workflow')
  public getPrWorkflow(@Param('prNo') prNo: string, @Param('itemNo') itemNo: string) {
    return this.documentService.getPrDocumentWorkflow(prNo, itemNo);
  }
  @Post('po/:poNo')
  public async getPoDocumentDetails(@Param('poNo') poNo: string,) {
    const doc :PoReleaseItems =  await this.documentService.getPoDocumentDetail(poNo);
    const actions = await this.workflowService.getPoWorkflow(doc)
    return {poHeader:doc.poHeaders.at(0),poItems:doc.poItems,actions}
  }
  @Post('po/:poNo/approve')
  public approvePoDocument(@Param('poNo') prNo: string, @Body() form: any) {
    return this.documentService.approvePoDocument(prNo,  form.note);
  }
}
