import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from 'src/_entities/company.entity';
import { Role } from 'src/_entities/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MasterService {
  constructor(
    @InjectRepository(Company)
    private readonly repoCompany: Repository<Company>,
    @InjectRepository(Role)
    private readonly repoRole: Repository<Role>
  ) {

  }
  findAllCompany() {
    return this.repoCompany.find()
  }
  findAllRole() {
    return this.repoRole.find()
  }
}
