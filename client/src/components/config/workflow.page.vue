<script setup lang="ts">
  // import liff from '@line/liff';
  import liff from '@line/liff';
  import axios, { AxiosError } from 'axios';
  import type { DropdownChangeEvent } from 'primevue/dropdown';
  import Dropdown from 'primevue/dropdown';
  import { inject, reactive, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { masterService } from '../common/services/services.provider';
  import type { Company } from '../common/types/company.type';
  import type { Master } from '../common/types/master.type';


  const route = useRoute();
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

  const conditionDialog = ref(false);
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
    docTypes: masterService.doctypes,
    actions: masterService.actions
  })

  const load = async () => {

    master.companies = await masterService.getAllCompany();
    lineLogin().then(() => {

    }).catch(() => {
      alert("Line Authentication failed");
    });
  };

  const lineLogin = async () => {

    liff.init({ liffId: import.meta.env.VITE_LINE_LIFF_ID }, () => {
      if (liff.isLoggedIn()) {
        loadDoc();
      } else {

        localStorage.setItem('redirectUri', route.fullPath)
        liff.login();

      }
    }, (error) => {
      console.log(error)
    })

  }

  const loadDoc = () => {


    console.log('loadDoc');

    axios.get(`workflow`).then((res) => {

      if (res?.data) {
        workflows.value = res.data
      }


      console.log(res)
    }).catch((error: AxiosError<{ message: string, statusCode: number }>) => {
      if (error.response?.data.statusCode == 401) {

        console.log('error', error);
        localStorage.setItem('redirectUri', route.path);
        setTimeout(() => {
          router.push({ name: 'auth' })
        }, 1000)
      } else {
        alert(error.response?.data.message);
      }
    });
  }
  const onSelectWorkflow = (e: DropdownChangeEvent) => {
    if (e.value) {
      const wf = workflows.value.find(w => w['workflowCode'] == e.value)
      if (wf && wf['steps']) {
        steps.value = wf['steps'].map((s: any) => {
          return { label: s.stepName, stepCode: s.stepCode, rules: s.rules }
        })
        selectedWorkflow.value = wf;
        onSelectStep(steps.value.at(0).stepCode)
      }
    }
    console.log(e)
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

  const editCondition = (slotProps: any) => {


    conditionForm.seq = slotProps.seq
    conditionForm.logic = slotProps.logic
    conditionForm.field = slotProps.field
    conditionForm.operator = slotProps.operator
    conditionForm.value = slotProps.value
    conditionDialog.value = true
    console.log(slotProps)
  }


  const saveCondition = () => {
    conditionDialog.value = false
  }
  const saveWorkflow = () => {

    if (workflowForm.mode == 'New') {
      axios.post('workflow', workflowForm).then(res => {
        workflowDialog.value = false
        load()
      })
    } else if (workflowForm.mode == 'Edit') {
      axios.patch('workflow/' + workflowForm.workflowCode, workflowForm).then(res => {
        workflowDialog.value = false
        load()
      })
    }
  }

  const saveStep = () => {


    if (stepForm.mode == 'New') {
      axios.post('workflow-step', stepForm).then(res => {
        stepDialog.value = false
        load()
      })
    } else if (stepForm.mode == 'Edit') {
      axios.patch('workflow-step/' + stepForm.stepCode, stepForm).then(res => {
        stepDialog.value = false
        load()
      })
    }
  }

  const onRowExpand = (event: any) => {

  };
  load()
</script>
<template>
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
            <Button icon="pi pi-plus-circle" label="Create new Workflow"  size="small" 
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
            <Button icon="pi pi-pencil" @click="openWorkflowDialog('Edit', workflowProps.data)"   size="small" />
          </template>
        </Column>


        <template #expansion="workflowProps">
          <div class="p-3">
            <DataTable :value="workflowProps.data.steps" size="small">
              <Column field="stepCode" header="Step Code" header-class="underline"></Column>
              <Column field="stepName" header="Step Name" header-class="underline"></Column>
              <Column field="action" header="Action" header-class="underline"></Column>


              <Column headerStyle="width:4rem">
                <template #body="stepProps">
                  <Button icon="pi pi-pencil" size="small" @click="openStepDialog('Edit',{... stepProps.data, ...workflowProps.data})" />
                </template>
              </Column>
              <template #footer>

                <div class="flex gap-3">
                  <Button icon="pi pi-plus-circle" label="Create new Step"  size="small" 
                    @click="openStepDialog('New', { ...initStep, ...workflowProps.data })"></Button>
                </div>
              </template>
            </DataTable>
          </div>
        </template>
      </DataTable>
    </Panel>
    <!-- <div class="flex flex-row">
      <Breadcrumb :model="steps">
        <template #item="{ item, props }">
         
          <a v-bind="props.action" @click="() => onSelectStep(item.stepCode)">
            <span :class="[item.icon, 'text-color']" />
            <span class="text-primary font-semibold">{{ item.label }}</span>
          </a>
        
        </template>
      </Breadcrumb>
    </div>
    <div class="flex flex-row">
      <Panel>

        <Accordion :activeIndex="0">
          <AccordionTab v-for="rule in rules" key="ruleCode">
            <template #header>
              <span class="flex align-items-center gap-2 w-full">
                <span class="font-bold white-space-nowrap w-2/3">{{ rule.ruleCode }}</span>
                <Badge :value="rule.actorName" class="ml-auto mr-2 w-1/3" />
              </span>
            </template>
            <DataTable :value="rule.conditions">
              <Column field="logic"></Column>
              <Column field="field"></Column>
              <Column field="operator"></Column>
              <Column field="value"></Column>


              <Column headerStyle="width:4rem">
                <template #body="slotProps">
                  <Button icon="pi pi-pencil" @click="editCondition(slotProps.data)" />
                </template>
              </Column>
              <template #footer>

                <div class="flex gap-3 mt-1 w-full">
                  <Button icon="pi pi-plus-circle"
                    @click="editCondition({ ...initCondition, seq: rule.conditions?.length + 1 })"></Button>
                </div>
              </template>
            </DataTable>
          </AccordionTab>

        </Accordion>


        <Toast />
      </Panel>
    </div> -->
  </div>

  <Dialog v-model:visible="workflowDialog" modal header="Workflow">

    <div class="flex flex-col align-items-center gap-3 mb-3">

      <Dropdown :disabled="workflowForm.mode == 'Edit'" placeholder="Company" v-model="workflowForm.companyCode"
        option-value="companyCode" option-label="nameEn" :options="master.companies" />
      <Dropdown :disabled="workflowForm.mode == 'Edit'" placeholder="Document Type" v-model="workflowForm.docType"
        option-value="value" option-label="name" :options="master.docTypes" />

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

    <div class="flex flex-col align-items-center gap-3 mb-3">
      <div>Company : {{ stepForm.companyName }}</div>
      <div>Workflow : {{ stepForm.workflowName }}</div>
      <InputText :disabled="stepForm.mode == 'Edit'" placeholder="Step Code" v-model="stepForm.stepCode" />
      <InputText placeholder="Step Name" v-model="stepForm.stepName" />
      <Dropdown placeholder="Action" v-model="stepForm.action" option-value="value" option-label="name"
        :options="[{ value: 'C', name: 'Check' }, { value: 'P', name: 'Post' }]" />
    </div>
    <template #footer>
      <div class="flex gap-3 mt-1">
        <Button type="button" label="Cancel" severity="secondary" block @click="stepDialog = false"></Button>
        <Button type="button" label="Save" @click="saveStep" block></Button>
      </div>
    </template>
  </Dialog>

  <!-- <Dialog v-model:visible="conditionDialog" modal header="Condition">
    <div class="flex align-items-center gap-3 mb-3">
      <Dropdown v-if="conditionForm.seq > 1" placeholder="Logic" v-model="conditionForm.logic" option-value="value"
        option-label="name" :options="[{ value: '&&', name: 'AND' }]" class="flex-auto" />
      <Dropdown placeholder="Field" v-model="conditionForm.field" option-value="value" option-label="name"
        :options="[{ value: 'cAmtBapi', name: 'Amount' }, { value: 'plant', name: 'Plant' }]" class="flex-auto" />
      <Dropdown placeholder="Operator" v-model="conditionForm.operator" option-value="value" option-label="name"
        :options="[{ value: '==', name: '=' }, { value: '>', name: '>' }, { value: '<', name: '<' }]"
        class="flex-auto" />
      <InputText placeholder="Value" v-model="conditionForm.value" class="flex-auto" />
    </div>
    <template #footer>
      <div class="flex gap-3 mt-1">
        <Button type="button" label="Cancel" severity="secondary" block @click="conditionDialog = false"></Button>
        <Button type="button" label="Save" @click="saveCondition" block></Button>
      </div>
    </template>
  </Dialog> -->
</template>