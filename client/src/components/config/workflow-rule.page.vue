<script setup lang="ts">
  import axios, { AxiosError } from 'axios';
  import type { DropdownChangeEvent } from 'primevue/dropdown';
  import Dropdown from 'primevue/dropdown';
  import { computed, reactive, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { masterService } from '../common/services/services.provider';
  import type { Company } from '../common/types/company.type';
  import type { KeyValue } from '../common/types/key-value.type';
  import type { CodeName } from '../common/types/code-name.type';
  import type { Condition, Rule } from './workflow.dto';
import ConfigMenu from './config-menu.vue'


  const router = useRouter();


  const master = reactive({
    companies: new Array<Company>,
    docTypes: new Array<CodeName>,
    actions: new Array<CodeName>,
    roles: new Array<CodeName>,

    fields: new Array<CodeName>,

    workflows: new Array<any>,
    steps: new Array<any>
  })
  const criteria = reactive({
    workflow: '',
    step: ''
  })

  const table = reactive({
    rules: [] as Rule[]
  })


  const expandedRows = ref([]);
  const initRule = {
    visible: false,
    mode: '',
    companyCode: '',
    companyName: '',
    stepCode: '',
    stepName: '',
    workflowCode: '',
    workflowName: '',
    seq: 0,
    ruleCode: '',
    actorType: 'ROLE',
    actorName: '',
    conditions: new Array<Condition>()
  } as Rule
  const ruleDialog = reactive({
    ...initRule, companyName: '', workflowName: '', stepName: '', visible: false,
    mode: '',
  })


  const conditionDialog = ref(false);
  const initCondition = {
    seq: 0,
    logic: '',
    field: '',
    operator: '',
    value: ''
  } as Condition
  const conditionForm = reactive({ ...initCondition })


  const products = ref();
  const editingRows = ref<Condition[]>([]);

  const init = async () => {


    master.companies = await masterService.getAllCompany();
    master.roles = await masterService.getAllRole();
    master.fields = await masterService.getFieldDesc();

    loadDoc()
  };



  const loadDoc = () => {


    console.log('loadDoc');

    axios.get(`workflow`).then((res) => {

      if (res?.data) {
        master.workflows = res.data
        if (criteria.workflow == '') {
          criteria.workflow = master.workflows.at(0).workflowCode
        }
          onSelectWorkflow({
            value: criteria.workflow,
            originalEvent: new Event('change')
          })
      }
    })
  }
  const onSelectWorkflow = (e: DropdownChangeEvent) => {
    if (e.value) {
      const wf = master.workflows.find(w => w['workflowCode'] == e.value)
      if (wf && wf['steps']) {
        console.log(wf)
        ruleDialog.companyCode = wf.companyCode
        ruleDialog.companyName = master.companies.find(c => c.companyCode == wf.companyCode)?.nameEn || ''
        ruleDialog.workflowCode = wf.workflowCode
        ruleDialog.workflowName = wf.workflowName
        master.steps = wf['steps'].map((s: any) => {
          return { name: s.stepName, code: s.stepCode, rules: s.rules }
        })
        criteria.step = master.steps.at(0).code;
        onSelectStep({
          value: master.steps.at(0).code,
          originalEvent: new Event('change')
        })
      }
    }
    console.log(e)
  }
  const onSelectStep = (e: DropdownChangeEvent) => {
    if (e.value) {
      const step = master.steps.find(w => w['code'] == e.value)
      console.log(step)
      if (step && step['rules']) {
        ruleDialog.stepCode = step.code
        ruleDialog.stepName = step.name
        table.rules = step['rules']
        console.log(table.rules)
      }
    }
  }


  const openRuleDialog = (mode: string, prop: any) => {
    console.log(prop)
    ruleDialog.mode = mode
    // ruleDialog.companyCode = prop.companyCode
    // ruleDialog.companyName = master.companies.find(c => c.companyCode == prop.companyCode)?.nameEn || ''
    // ruleDialog.workflowCode = prop.workflowCode
    // ruleDialog.workflowName = master.workflows.find(c => c.workflowCode == prop.workflowCode)?.workflowName
    // ruleDialog.stepCode = prop.stepCode
    // ruleDialog.stepName = master.steps.find(c => c.code == prop.stepCode)?.name
    ruleDialog.ruleCode = prop.ruleCode
    ruleDialog.actorName = prop.actorName
    ruleDialog.seq = prop.seq
    ruleDialog.conditions = [...prop.conditions]
    editingRows.value = []

    ruleDialog.visible = true
  }



  const onRowEditSave = (event: { newData: Condition, index: number }) => {
    let { newData, index } = event;
    ruleDialog.conditions[index] = { ...newData }
    ruleDialog.conditions[index].seq = index + 1
    console.log(index, ruleDialog.conditions[index])
  };

  const addCondition = () => {
    editingRows.value.push({ ...initCondition, seq: -1 })
    ruleDialog.conditions.push({ ...initCondition, seq: -1 })
  }
  const saveRule = () => {

    if (ruleDialog.mode == 'New') {
      axios.post('workflow-rule', ruleDialog).then(res => {
        ruleDialog.visible = false
        loadDoc()
      })
    } else if (ruleDialog.mode == 'Edit') {
      axios.patch(`workflow-rule/${ruleDialog.workflowCode}/${ruleDialog.stepCode}/${ruleDialog.ruleCode}`, ruleDialog).then(res => {
        ruleDialog.visible = false
        loadDoc()
      })
    }
  }
const rowExpand= (e:any)=>{
  console.log(e)
}
  const isConditionEditing = computed({
    get: () => editingRows.value.length > 0,
    set: () => editingRows.value = []
  })

  const getFieldName = (key: string) => {
    return master.fields.find(x => x.code == key)?.name
  }
  init()
</script>
<template>
  <ConfigMenu></ConfigMenu>
  <div class="container w-full flex flex-col mx-auto">

    <Panel class="card flex flex-row">
      <div class="flex flex-row  gap-3">
        <Dropdown v-model=criteria.workflow :options="master.workflows" option-value="workflowCode"
          option-label="workflowName" @change="onSelectWorkflow"></Dropdown>
        <Dropdown v-model=criteria.step :options="master.steps" option-value="code" option-label="name"
          @change="onSelectStep" />
      </div>
      <DataTable :value="table.rules" v-model:expandedRows="expandedRows" dataKey="ruleCode" size="large" @row-expand="rowExpand"
        tableStyle="min-width: 60rem">
        <template #header>

          <div class="flex gap-3">
            <Button icon="pi pi-plus-circle" label="Create new Rule" size="small"
              @click="openRuleDialog('New', { ...initRule })"></Button>
          </div>
        </template>
        <Column expander style="width: 5rem" />
        <Column field="seq" header="#" header-class="underline"></Column>
        <Column field="ruleCode" header="Rule" header-class="underline"></Column>
        <Column field="actorName" header="Actor" header-class="underline"></Column>

        <Column headerStyle="width:4rem">
          <template #body="ruleProps">
            <Button icon="pi pi-pencil" @click="openRuleDialog('Edit', ruleProps.data)" size="small" />
          </template>
        </Column>


        <template #expansion="ruleProps">
          <div class="p-3">
            <DataTable v-if="ruleProps.data.conditions.length > 0" :value="ruleProps.data.conditions" size="small">
              <Column field="seq" header="#" header-class="underline"></Column>
              <Column field="field" header="Field" header-class="underline">
                <template #body="conditionProps">
                  {{ getFieldName(conditionProps.data.field) }}
                </template>
              </Column>
              <Column field="operator" header="Operator" header-class="underline"></Column>
              <Column field="value" header="Value" header-class="underline"></Column>


              <!-- <Column headerStyle="width:4rem">
                <template #body="stepProps">
                  <Button icon="pi pi-pencil" size="small"
                    @click="openStepDialog('Edit', { ...stepProps.data, ...ruleProps.data })" />
                </template>
              </Column> -->

            </DataTable>
          </div>
        </template>
      </DataTable>
    </Panel>

  </div>

  <Dialog v-model:visible="ruleDialog.visible" modal header="Condition">
    <div class="flex flex-row gap-2">
      <div class="flex flex-col gap-3 mb-3" style="width:50%">
        <div>Company : {{ ruleDialog.companyName }}</div>
        <div>Workflow : {{ ruleDialog.workflowName }}</div>
        <div>StepName : {{ ruleDialog.stepName }}</div>
      </div>
      <div class="flex flex-col gap-3 mb-3" style="width:50%">
        <div class="flex flex-row gap-2">
          <label for="username">Rule</label>
          <InputText v-model="ruleDialog.ruleCode" lable="ruleName" :disabled="ruleDialog.mode == 'Edit'"></InputText>
        </div>
        <div class="flex flex-row gap-2">
          <label for="username">Actor</label>
          <Dropdown v-model="ruleDialog.actorName" :options="master.roles" optionValue="code" optionLabel="name"
            placeholder="Select Role" class="w-full md:w-14rem" />
        </div>
      </div>
    </div>
    <div class="flex align-items-center gap-3 mb-3">

      <DataTable v-model:editingRows="editingRows" :value="ruleDialog.conditions" editMode="row" dataKey="seq"
        @row-edit-save="onRowEditSave" :pt="{
          table: { style: 'min-width: 50rem' },
          column: {
            bodycell: ({ state }: any) => ({
              style: state['d_editing'] && 'padding-top: 0.6rem; padding-bottom: 0.6rem'
            })
          }
        }">
        <Column field="seq" header="#" style="width: 20%">
        </Column>
        <Column field="field" header="Field" style="width: 20%">
          <template #editor="{ data, field }">
            <Dropdown v-model="data[field]" :options="master.fields" option-value="code" option-label="name"></Dropdown>

          </template>
        </Column>
        <Column field="operator" header="Operator" style="width: 20%">
          <template #editor="{ data, field }">
            <Dropdown v-model="data[field]" :options="['>', '<', '==', '!=']"></Dropdown>

          </template>
        </Column>
        <Column field="value" header="Value" style="width: 20%">
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" />
          </template>
        </Column>

        <Column :rowEditor="true" style="width: 10%; min-width: 8rem" bodyStyle="text-align:center"></Column>
        <template #footer>
          <Button @click="addCondition" :disabled="isConditionEditing">Add new Conditoin</Button>
        </template>
      </DataTable>

    </div>
    <template #footer>
      <div class="flex gap-3 mt-1">
        <Button type="button" label="Cancel" severity="secondary" block @click="ruleDialog.visible = false"></Button>
        <Button type="button" label="Save" @click="saveRule" block :disabled="isConditionEditing"></Button>
      </div>
    </template>
  </Dialog>

</template>