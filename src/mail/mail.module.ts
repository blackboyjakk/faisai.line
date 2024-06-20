import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports:[MailerModule.forRoot({
    transport:{
      host:'smtp.gmail.com',
      port:587,
      secure:false,
      auth:{
        user:'purmponk@protos.co.th',
        pass:'tom27131'
      }
    }
  })],
  providers: [MailService]
})
export class MailModule {}
