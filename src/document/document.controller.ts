import { Controller, Get, Post, Param, Req, Body, UseGuards } from '@nestjs/common';
import { DocumentService } from './document.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from 'src/_entities/user.entity';
import { WorkflowService } from 'src/workflow/workflow.service';
import { BapiRequisitionItem } from 'src/_interface/bapiRequisitionItems.interface';

@Controller()
export class DocumentController {
  constructor(
    private readonly documentService: DocumentService,
    private readonly workflowService: WorkflowService) { }

  @Post(':prNo/:itemNo')
  public async getDocumentDetails(@Param('prNo') prNo: string, @Param('itemNo') itemNo: string) {
    const item :BapiRequisitionItem =  await this.documentService.getDocumentDetail(prNo, itemNo);
    const actions = await this.workflowService.getWorkflow(item, "PR")
    return {item,actions}
  }
  @Post(':prNo/:itemNo/approve')
  public approveDocument(@Param('prNo') prNo: string, @Param('itemNo') itemNo: string, @Body() form: any) {
    return this.documentService.approveDocument(prNo, itemNo, form.note);
  }
  @Post(':prNo/:itemNo/workflow')
  public getDocumentWorkflow(@Param('prNo') prNo: string, @Param('itemNo') itemNo: string) {
    return this.documentService.getDocumentWorkflow(prNo, itemNo);
  }
}
