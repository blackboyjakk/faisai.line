import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from 'src/_entities/company.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MasterService {
    constructor(
        @InjectRepository(Company)
        private readonly repoCompany: Repository<Company>){
            
        }
  findAllCompany() {
    return this.repoCompany.find()
  }
}
