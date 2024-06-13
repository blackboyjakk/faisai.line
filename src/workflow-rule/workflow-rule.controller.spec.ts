import { Test, TestingModule } from '@nestjs/testing';
import { WorkflowRuleController } from './workflow-rule.controller';
import { WorkflowRuleService } from './workflow-rule.service';

describe('WorkflowRuleController', () => {
  let controller: WorkflowRuleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkflowRuleController],
      providers: [WorkflowRuleService],
    }).compile();

    controller = module.get<WorkflowRuleController>(WorkflowRuleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
