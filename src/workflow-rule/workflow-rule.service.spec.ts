import { Test, TestingModule } from '@nestjs/testing';
import { WorkflowRuleService } from './workflow-rule.service';

describe('WorkflowRuleService', () => {
  let service: WorkflowRuleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkflowRuleService],
    }).compile();

    service = module.get<WorkflowRuleService>(WorkflowRuleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
