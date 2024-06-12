
import { HttpService } from '@nestjs/axios';
import { BadRequestException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AxiosError, AxiosResponse } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { Company } from 'src/_entities/company.entity';
import { Employee } from 'src/_entities/employee.entity';
import { User } from 'src/_entities/user.entity';
import { UserVerify } from 'src/_entities/userVerify.entity';
import { TokenDecoded } from 'src/_interface/tokenDecoded.interface';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserVerify)
    private readonly userVerifyRepository: Repository<UserVerify>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    private readonly httpService: HttpService
  ) { }

  async getUser(userId: string) {
    return this.userRepository.findOne({where:{ userId: userId },relations:{employee:true}});
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
      const userVerify = new UserVerify({
        userId: userId,
        email: userEmail,
        otp: this.GenOtpNumber(),
        otpExpired: expDate,
        isVerify: false,

      })
        ;
      this.userVerifyRepository.save(userVerify);
    }
  }
  async verifyOtp(userId: string, opt: string, appType: string): Promise<void> {
    let userVerify = await this.getUserVerify(userId);
    if (!userVerify) {
      throw new HttpException('Line account not found', 400)
    }else
    if (userVerify.otpExpired < new Date()) {

      throw new HttpException('OTP is expired', 400)
    }else {
      this.userVerifyRepository.update(userVerify.id,{isVerify:true})
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


    this.userRepository.save(user);



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
      'Content-Type': 'application/x-www-form-urlencoded'
    }

    let cridential = await firstValueFrom(this.httpService.post<TokenDecoded>('https://api.line.me/oauth2/v2.1/verify', params, { headers })
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

