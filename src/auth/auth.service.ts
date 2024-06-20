
import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { catchError, firstValueFrom } from 'rxjs';
import { Employee } from 'src/_entities/employee.entity';
import { User } from 'src/_entities/user.entity';
import { UserVerify } from 'src/_entities/userVerify.entity';
import { Repository } from 'typeorm';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly mailService: MailService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserVerify)
    private readonly userVerifyRepository: Repository<UserVerify>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>
  ) { }

  async getUser(userId: string) {
    return this.userRepository.findOne({ where: { userId: userId } });
  }
  async getEmployee(empId: string) {
    return this.employeeRepository.findOne({ where: { empId: empId },relations:{mapRoles:true}});
  }
  async getUserVerify(userId: string) {
    return this.userVerifyRepository.findOneBy({ userId: userId });
  }
  async getEmpoyeeByEmail(userEmail: string) {
    return this.employeeRepository.findOne({ where: { email: userEmail }, relations: { company: true } });
  }

  async sentOtp(userId: string, userEmail: string) {
    var emp = await this.getEmpoyeeByEmail(userEmail);

    if (!emp) {
      throw new HttpException('Employee not found', 400)
    }
    if (emp != null) {
      let expDate = new Date();
      expDate.setDate(expDate.getDate() + 365);

      const otp = this.GenOtpNumber()
      const sendResult = await this.mailService.postMail({ to: userEmail, from: 'mr.kurung@gmail.com', subject: 'OTP', text: otp })

      if (sendResult.message = 'success') {
        const userVerify = new UserVerify({
          userId: userId,
          email: userEmail,
          otp: otp,
          otpExpired: expDate,
          isVerify: false,

        })
          ;
        return this.userVerifyRepository.save(userVerify);
      }else{
        throw new InternalServerErrorException('Send Mail Error')
      }
    }
  }
  async verifyOtp(userId: string, opt: string, appType: string): Promise<User> {
    let userVerify = await this.getUserVerify(userId);
    if (!userVerify) {
      throw new HttpException('Line account not found', 400)
    } else
      if (userVerify.otpExpired < new Date()) {

        throw new HttpException('OTP is expired', 400)
      } else {
        this.userVerifyRepository.update(userVerify.id, { isVerify: true })
      }
    var emp = await this.getEmpoyeeByEmail(userVerify.email);
    if (!emp) {
      throw new HttpException('Employee not found', 400)
    }

    const user = new User({
      userId: userId,
      empId: emp.empId,
      email: emp.email,
      companyCode: emp.companyCode,
      appType: appType,
      isActive: true,

    })


   return  this.userRepository.save(user);



  }

  public extractTokenFromHeader(authorization: string): string | undefined {
    const [type, token] = authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
  async verifyAsync(authorization: string) {
    const token = this.extractTokenFromHeader(authorization)
    const params = new URLSearchParams()
    params.append('id_token', token)
    params.append('client_id', process.env.CHANNEL_ID)
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + token
    }

    let cridential = await firstValueFrom(this.httpService.get<any>('https://api.line.me/oauth2/v2.1/userinfo', { headers })
      .pipe(catchError(async (error) => {

        throw new UnauthorizedException(error.response.data.error_description)

      })));



    if (cridential) {
      return cridential.data
    }
    else {
      return null;
    }
  }
  GenOtpNumber(): string {
    let otp: string = '';
    for (let i = 0; i < 5; i++) {

      let character = (Math.floor(Math.random() * 10)).toString();

      otp += character;
    }
    return otp;
  }
}

