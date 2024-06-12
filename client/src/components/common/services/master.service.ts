
import { provide } from 'vue';
import axios from "axios";
import type {Master } from '../types/master.type';
import type { Company } from '../types/company.type';
export default class MasterService {
    async getAllCompany():Promise<Company[]> {
        const companies = await axios.get<Company[]>('master/company').then(res => res.data)
        return companies;
    }
    doctypes = [{ value: 'PR', name: 'Purchase Request' }, { value: 'PO', name: 'Purchase Order' }, { value: 'SO', name: 'Sell Order' }]
    
    actions = [ { value: 'C', name: 'Check' }, { value: 'P', name: 'Post' }]
    
}
