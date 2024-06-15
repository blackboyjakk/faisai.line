
import { Module } from '@nestjs/common/decorators/modules';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { Workflow } from './workflow/entities/workflow.entity';
import { WorkflowStep } from './workflow-step/entities/workflow-step.entity';
import { WorkflowRule } from './workflow-rule/entities/workflow-rule.entity';
import { WorkflowCondition } from './workflow/entities/workflow-condition';
import { WorkflowAction } from './workflow/entities/workflow-action';
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'mssql',
        host: 'localhost\\SQLEXPRESS2014',
        port: 1433,
        database: 'PTS_Fahsai',
        username: 'sa',
        password: 'tom27131',
        extra: {

          encrypt: false,
          // trustServerCertificate: true,
          // timeout: 30000,
          cryptoCredentialsDetails: {
            minVersion: 'TLSv1'
          }
        },
        synchronize: true,
        entities: [Workflow,WorkflowStep,WorkflowRule,WorkflowCondition,WorkflowAction,join(__dirname, '**', '*.entity.{ts,js}')],
        logging: ['error','schema']
      }),
      inject: [ConfigService],
    }),
  ],
})
// eslint-disable-next-line prettier/prettier
export class DatabaseModule { }