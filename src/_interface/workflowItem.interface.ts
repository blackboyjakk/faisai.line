export class WorkflowItem {
    stepCode: string
    stepName: string
    actionCode: string
    actionName() {
        switch (this.actionCode) {
            case 'P': {
                return 'Posted'
            }
            case 'C': {
                return 'Checked'
            }
            default: {
                return ''
            }
        }
    };

    statusCode: string
    
    statusName() {
        switch (this.actionCode) {
            case 'A': {
                return 'Approved'
            }
            case 'W': {
                return 'Waiting'
            }
            case 'R': {
                return 'Rejected'
            }
            default: {
                return ''
            }
        }
    };
    postSapResult: string
}