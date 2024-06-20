import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
    constructor(private readonly mailerService:MailerService){}

    async postMail(dto:any){

        let {to,from ,subject,text} = dto
        try{
            await this.mailerService.sendMail({
                to,from,subject,text
            })
            return{
                message:'success'
            }
        }catch(error:any){
            console.log(error)
        }
    }
}
