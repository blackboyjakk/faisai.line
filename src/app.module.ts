import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { DatabaseModule } from './database.module';
import { ConfigModule } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { MessagerModule } from './messager/messager.module';
import { DocumentModule } from './document/document.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { HttpModule } from '@nestjs/axios';
import { WorkflowModule } from './workflow/workflow.module';
import { MasterModule } from './master/master.module';
import { WorkflowStepModule } from './workflow-step/workflow-step.module';
import { WorkflowRuleModule } from './workflow-rule/workflow-rule.module';

const routes = [
  {
    path: 'auth',
    module: AuthModule
  }
  ,
  {
    path: 'messager',
    module: MessagerModule,

  },
  {
    path: 'document',
    module: DocumentModule,

  },
]

@Module({
  imports: [
    RouterModule.register(routes),
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client/dist'),
    }),
    HttpModule,
    AuthModule,
    MessagerModule,
    DocumentModule,
    WorkflowModule,
    MasterModule,
    WorkflowStepModule,
    WorkflowRuleModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(LineMiddleware).forRoutes('callback')
  // }
}