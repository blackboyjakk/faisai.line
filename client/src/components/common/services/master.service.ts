
import { provide } from 'vue';
import axios from "axios";
import type { KeyValue } from '../types/key-value.type';
import type { Company } from '../types/company.type';
import type { CodeName } from '../types/code-name.type';
export default class MasterService {


    async getAllCompany(): Promise<Company[]> {
        const companies = await axios.get<Company[]>('master/company').then(res => res.data)
        return companies;
    }
    async getAllRole(): Promise<CodeName[]> {

        const companies = await axios.get<CodeName[]>('master/role').then(res => res.data)
        return companies;
    }

    getAllDocTypes() {
        return [{ code: 'PR', name: 'Purchase Request' }, { code: 'PO', name: 'Purchase Order' }, { code: 'SO', name: 'Sell Order' }]
    }

    getAllActions() {
        return [{ code: 'C', name: 'Check' }, { code: 'P', name: 'Post' }]
    }

    getFieldDesc() {

        return [
            { code: 'plant', name: 'Plant' },
            { code: 'cAmtBapi', name: 'Amount' }
        ]
    }

}
