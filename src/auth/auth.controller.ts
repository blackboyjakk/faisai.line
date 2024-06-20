import { Body, Controller, HttpException, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Admin, Public } from './auth.guard';
import { RequestContext } from '../common/request-context/request-context.model';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post()
  @Public()
  @Admin()
  async index(@Req() req, @Res() res): Promise<{ userVerify: boolean; }> {

    const payload = await this.authService.verifyAsync(
      req.headers['authorization']
    );
    var user  = await this.authService.getUser(payload['sub']);
    if (user) {
      return res.status(HttpStatus.OK).send({ userVerify: true });
    }
    var verify = await this.authService.getUserVerify(payload['sub']);
    if (verify != null) {

      return res.status(HttpStatus.OK).send({ userVerify: false });
    }else{
      
      return res.status(HttpStatus.OK).send({ userVerify: null });
    }

  }

  @Post('register')
  @Public()
  async register(@Req() req, @Res() res, @Body() body) {
    
    const payload = await this.authService.verifyAsync(
      req.headers['authorization']
    );
    if (!payload['sub']) {
      throw new HttpException('Line account wrong', HttpStatus.BAD_REQUEST)
    }
    if (!body.userEmail) {
      throw new HttpException('Input Required', HttpStatus.BAD_REQUEST)
    }
    this.authService.sentOtp(payload['sub'], body.userEmail).then(()=>{
      
    return res.status(HttpStatus.OK).send();
    });
  }
  @Post('login')
  @Public()
  async login(@Req() req,  @Res() res,@Body() body) {

    const payload = await this.authService.verifyAsync(
      req.headers['authorization']
    );
    if (!payload['sub']) {

      throw new HttpException('Line account wrong', HttpStatus.BAD_REQUEST)
    }
    if (!body.userOtp) {
      throw new HttpException('Input Required', HttpStatus.BAD_REQUEST)
    }
    this.authService.verifyOtp(payload['sub'], body.userOtp, body.appType).then(()=>{
      
    return res.status(HttpStatus.OK).send();
    });


  }
}
