<script setup lang="ts">
  // import liff from '@line/liff';
  import liff from '@line/liff';
  import axios, { AxiosError } from 'axios';
  import type { DropdownChangeEvent } from 'primevue/dropdown';
  import Dropdown from 'primevue/dropdown';
  import { inject, reactive, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { masterService } from '../common/services/services.provider';
  import type { Company } from '../common/types/company.type';
  import type { KeyValue } from '../common/types/key-value.type';
  import { lineLogin } from '@/helper/line-auth';
import type { CodeName } from '../common/types/code-name.type';
import ConfigMenu from './config-menu.vue'

  const router = useRouter();


  const workflows = ref<any[]>([]);
  const steps = ref<any[]>([]);
  const rules = ref<any[]>([]);

  const expandedRows = ref([]);
  const selectedWorkflow = ref('');

  const initWorkflow = {
    mode: '',
    companyCode: '',
    workflowCode: '',
    workflowName: '',
    docType: '',
    steps: []
  }
  const workflowForm = reactive({ ...initWorkflow })
  const workflowDialog = ref(false);

  const initStep = {
    mode: '',
    companyCode: '',
    companyName: '',
    workflowCode: '',
    workflowName: '',
    seq: 0,
    stepCode: '',
    stepName: '',
    action: '',
  }
  const stepForm = reactive({ ...initStep })
  const stepDialog = ref(false);



  const initRule = {
    mode: '',
    companyCode: '',
    companyName: '',
    workflowCode: '',
    workflowName: '',
    stepCode: '',
    stepName: '',
    seq: 0,
    ruleCode: '',
    ruleName: '',
    actorType: 'ROLE',
    actorName: ''
  }
  const ruleForm = reactive({ ...initRule })
  const ruleDialog = ref(false);


  const initCondition = {
    seq: 0,
    logic: '',
    field: '',
    operator: '',
    value: ''
  }
  const conditionForm = reactive({ ...initCondition })
  const master = reactive({
    companies: new Array<Company>,
    roles: new Array<CodeName>,
    docTypes:  new Array<CodeName>,
    actions:  new Array<CodeName>,
  })

  const init = async () => {


      console.log('loadDoc')
      master.companies = await masterService.getAllCompany();
      master.roles = await masterService.getAllRole();
      master.docTypes = await masterService.getAllDocTypes();
      master.actions = await masterService.getAllActions();
      loadDoc()

  };



  const loadDoc = () => {


    console.log('loadDoc');

    axios.get(`workflow`).then((res) => {

      if (res?.data) {
        workflows.value = res.data
      }


      console.log(res)
    })
  }
  const onSelectStep = (stepCode: string) => {
    if (selectedWorkflow.value) {
      const step = steps.value.find(w => w['stepCode'] == stepCode)
      console.log(step)
      if (step && step['rules']) {
        rules.value = step['rules']
        console.log(rules.value)
      }
    }
  }


  const openWorkflowDialog = (mode: string, prop: any) => {
    workflowForm.mode = mode
    workflowForm.companyCode = prop.companyCode
    workflowForm.workflowCode = prop.workflowCode
    workflowForm.workflowName = prop.workflowName
    workflowForm.docType = prop.docType

    workflowDialog.value = true
  }

  const openStepDialog = (mode: string, prop: any) => {
    console.log(prop)
    stepForm.mode = mode
    stepForm.companyCode = prop.companyCode
    stepForm.companyName = master.companies.find(c => c.companyCode == prop.companyCode)?.nameEn || ''
    stepForm.workflowCode = prop.workflowCode
    stepForm.workflowName = prop.workflowName
    stepForm.stepCode = prop.stepCode
    stepForm.stepName = prop.stepName
    stepForm.action = prop.action
    stepDialog.value = true
  }

  const openRuleDialog = (mode: string, prop: any) => {


    stepForm.mode = mode
    stepForm.companyCode = prop.companyCode
    stepForm.companyName = master.companies.find(c => c.companyCode == prop.companyCode)?.nameEn || ''
    stepForm.workflowCode = prop.workflowCode
    stepForm.workflowName = prop.workflowName
    stepForm.stepCode = prop.stepCode
    stepForm.stepName = prop.stepName

    // conditionForm.seq = prop.seq
    // conditionForm.logic = prop.logic
    // conditionForm.field = prop.field
    // conditionForm.operator = prop.operator
    // conditionForm.value = prop.value
    ruleDialog.value = true
    console.log(prop)
  }


  const saveCondition = () => {
    ruleDialog.value = false
  }
  const saveWorkflow = () => {

    if (workflowForm.mode == 'New') {
      axios.post('workflow', workflowForm).then(res => {
        workflowDialog.value = false
        init()
      })
    } else if (workflowForm.mode == 'Edit') {
      axios.patch('workflow/' + workflowForm.workflowCode, workflowForm).then(res => {
        workflowDialog.value = false
        init()
      })
    }
  }

  const saveStep = () => {


    if (stepForm.mode == 'New') {
      axios.post('workflow-step', stepForm).then(res => {
        stepDialog.value = false
        init()
      })
    } else if (stepForm.mode == 'Edit') {
      axios.patch('workflow-step/' + stepForm.stepCode, stepForm).then(res => {
        stepDialog.value = false
        init()
      })
    }
  }
  const getActionDesc = (action : string) => {
    return master.actions.find((m:CodeName) => m.code== action)?.name
  }
  const onRowExpand = (event: any) => {

  };
  init()
</script>
<template>


<ConfigMenu></ConfigMenu>
  <div class="container w-full flex flex-col mx-auto">
    <!-- <div class="flex flex-row">
      <Dropdown :options="workflows" optionLabel="name" optionValue="workflowCode" placeholder="Select a City"
        class="w-full" @change="onSelectWorkflow"></Dropdown>


      <div class="flex gap-3 mt-1 w-full">
        <Button label="Create" icon="pi pi-plus-circle" @click="editWorkflow({ ...initWorkflow })"></Button>
        <Button label="Edit" icon="pi pi-plus-circle" @click="editWorkflow(selectedWorkflow)"></Button>
      </div>
    </div> -->
    <Panel class="card flex flex-row">
      <DataTable :value="workflows" v-model:expandedRows="expandedRows" dataKey="workflowCode"
        @onRowExpand="onRowExpand" size="large" tableStyle="min-width: 60rem">
        <template #header>

          <div class="flex gap-3">
            <Button icon="pi pi-plus-circle" label="Create new Workflow" size="small"
              @click="openWorkflowDialog('New', { ...initWorkflow })"></Button>
          </div>
        </template>
        <Column expander style="width: 5rem" />
        <Column field="companyCode" header="Company" header-class="underline"></Column>
        <Column field="docType" header="Doc Type" header-class="underline"></Column>
        <Column field="workflowCode" header="Workflow Code" header-class="underline"></Column>
        <Column field="workflowName" header="Workflow Name" header-class="underline"></Column>


        <Column headerStyle="width:4rem">
          <template #body="workflowProps">
            <Button icon="pi pi-pencil" @click="openWorkflowDialog('Edit', workflowProps.data)" size="small" />
          </template>
        </Column>


        <template #expansion="workflowProps">
          <div class="p-3">
            <DataTable :value="workflowProps.data.steps" size="small">
              <Column field="stepCode" header="Step Code" header-class="underline"></Column>
              <Column field="stepName" header="Step Name" header-class="underline"></Column>
              <Column field="action" header="Action" header-class="underline">
              <template #body="stepProps">
                {{ getActionDesc(stepProps.data.action) }}
              </template>
              </Column>


              <Column headerStyle="width:4rem">
                <template #body="stepProps">
                  <div class="flex flex-row align-items-center gap-3 mb-3">
                    <Button icon="pi pi-pencil" size="small" rounded outlined
                      @click="openStepDialog('Edit', { ...stepProps.data, ...workflowProps.data })" />
                 
                  </div>
                </template>
              </Column>
              <template #footer>

                <div class="flex gap-3">
                  <Button icon="pi pi-plus-circle" label="Create New Step" size="small" rounded outlined
                    @click="openStepDialog('New', { ...initStep, ...workflowProps.data })"></Button>
                </div>
              </template>
            </DataTable>
          </div>
        </template>
      </DataTable>
    </Panel>
    
  </div>

  <Dialog v-model:visible="workflowDialog" modal header="Workflow">

    <div class="flex flex-col gap-3 mb-3">

      <Dropdown :disabled="workflowForm.mode == 'Edit'" placeholder="Company" v-model="workflowForm.companyCode"
        option-value="companyCode" option-label="nameEn" :options="master.companies" />
      <Dropdown :disabled="workflowForm.mode == 'Edit'" placeholder="Document Type" v-model="workflowForm.docType"
        option-value="code" option-label="name" :options="master.docTypes" />

      <InputText placeholder="Workflow Code" v-model="workflowForm.workflowCode" />
      <InputText placeholder="Workflow Name" v-model="workflowForm.workflowName" />
    </div>
    <template #footer>
      <div class="flex gap-3 mt-1">
        <Button type="button" label="Cancel" severity="secondary" block @click="workflowDialog = false"></Button>
        <Button type="button" label="Save" @click="saveWorkflow" block></Button>
      </div>
    </template>
  </Dialog>
  <Dialog v-model:visible="stepDialog" modal header="Step">

    <div class="flex flex-col gap-3 mb-3">
      <div>Company : {{ ruleForm.companyName }}</div>
      <div>Workflow : {{ ruleForm.workflowName }}</div>
      <InputText :disabled="stepForm.mode == 'Edit'" placeholder="Step Code" v-model="stepForm.stepCode" />
      <InputText placeholder="Step Name" v-model="stepForm.stepName" />
      <Dropdown placeholder="Action" v-model="stepForm.action" option-value="code" option-label="name"
        :options="[{ value: 'C', name: 'Check' }, { value: 'P', name: 'Post' }]" />
    </div>
    <template #footer>
      <div class="flex gap-3 mt-1">
        <Button type="button" label="Cancel" severity="secondary" block @click="stepDialog = false"></Button>
        <Button type="button" label="Save" @click="saveStep" block></Button>
      </div>
    </template>
  </Dialog>

</template>