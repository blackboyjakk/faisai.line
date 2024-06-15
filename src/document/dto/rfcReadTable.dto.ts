export class RfcReadTable {
    data: WA[]
    fields: Field[]
    options: any[]
  }
  
  export class WA {
    wa: string
  }
  
  export class Field {
    fieldname: string
    offset: string
    length: string
    type: string
    fieldtext: string
  }
  export class RFC {
    constructor(data:WA){
       [this.group,this.code] = data.wa.split(',')
    }
    group:string
    code:string
  }