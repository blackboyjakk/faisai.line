import { Controller, Get, Post, Param, Req, Body, UseGuards, CanActivate } from '@nestjs/common';
import { DocumentService } from './document.service';
import { AuthGuard, Public } from 'src/auth/auth.guard';
import { User } from 'src/_entities/user.entity';
import { WorkflowService } from 'src/workflow/workflow.service';
import { prRequisitionItem } from 'src/document/dto/prRequisitionItems.dto';
import { PoReleaseItems } from './dto/poReleaseItems.dto';
import { Employee } from 'src/_entities/employee.entity';
import { RequestContext } from 'src/common/request-context/request-context.model';

@Controller()
export class DocumentController {
  constructor(
    private readonly documentService: DocumentService,
    private readonly workflowService: WorkflowService) { }

  @Post('pr/:prNo/:itemNo')
  public async getPrDocumentDetails(@Param('prNo') prNo: string, @Param('itemNo') itemNo: string) {
    const emp: Employee = RequestContext.currentEmployee;
    const roles = RequestContext.currentRoles;
    const item: prRequisitionItem = await this.documentService.getPrDocumentDetail(prNo, itemNo);
    const actions = await this.workflowService.getPrWorkflow(item,)
    const action = actions.find(a => a.status == 'W')
    const canApprove = roles?.includes(action?.actorName);
    const canReject = canApprove && (action.seq != 1 && action.postStatus != 'S')
    return { item, actions, canApprove, canReject }
  }
  @Post('pr/:prNo/:itemNo/approve')
  public approvePrDocument(@Param('prNo') prNo: string, @Param('itemNo') itemNo: string, @Body() form: any) {
    return this.documentService.approvePrDocument(prNo, itemNo, form.note);
  }
  @Post('pr/:prNo/:itemNo/reject')
  public rejectPrDocument(@Param('prNo') prNo: string, @Param('itemNo') itemNo: string, @Body() form: any) {
    return this.documentService.rejectPrDocument(prNo, itemNo, form.note);
  }
  @Post('pr/:prNo/:itemNo/workflow')
  public getPrWorkflow(@Param('prNo') prNo: string, @Param('itemNo') itemNo: string) {
    return this.documentService.getPrDocumentWorkflow(prNo, itemNo);
  }
  @Public()
  @Post('po/:poNo')
  public async getPoDocumentDetails(@Param('poNo') poNo: string,) {
    const doc: PoReleaseItems = await this.documentService.getPoDocumentDetail(poNo);
    const actions = await this.workflowService.getPoWorkflow(doc)
    return { poHeader: doc.poHeaders.at(0), poItems: doc.poItems, actions }
  }
  @Post('po/:poNo/approve')
  public approvePoDocument(@Param('poNo') prNo: string, @Body() form: any) {
    return this.documentService.approvePoDocument(prNo, form.note);
  }
}
