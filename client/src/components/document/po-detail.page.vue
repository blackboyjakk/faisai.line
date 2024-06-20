<script setup lang="ts">
  import { lineLogin } from '@/helper/line-auth';
import { getAmountFormat } from '@/helper/number-format';
import liff from '@line/liff';
  import axios, { AxiosError } from 'axios';
  import { ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';


  const route = useRoute();
  const router = useRouter();
  const poNo = route.params.poNo;
  const header = ref<any>({});
  const items = ref<any>([]);
  const workflow = ref<any>([]);
  const note = ref('');
  let token: string | null = '';

    const load = async () => {
        await lineLogin().then(() => {
          loadDoc();
        });
    };
  

  const loadDoc = async () => {

    axios.post(`document/po/${poNo}`).then((res) => {
      header.value = res.data.poHeader;
      items.value = res.data.poItems ;
      workflow.value = res.data.actions;
    }).catch((e)=>{
      
      alert(e)
    })
  }

  const approve = () => {
    if(!workflow.value.length){
      alert('Workflow Not Found')
      return;
    }
    axios.post(`document/po/${poNo}/approve`, {
      note: note.value
    }, {

    }).then((res) => {
      loadDoc()
    }).catch((error: AxiosError<{ message: string, statusCode: number }>) => {

      if (error.response?.data.statusCode == 401) {
        router.push({ name: "auth" });
      }
      alert(error.response?.data.message);
    });
  }
  
  const actionSeverity = (actionCode:string) => {
    switch (actionCode) {
      case 'A': return 'success'
      case 'W': return 'info'
      case 'R': return 'danger'
    
      default:
        break;
    }
  }
  load();

function fetchData() {
  throw new Error('Function not implemented.');
}
</script>

<template>
  <Card  style="max-width: 50rem;width:100%">
    <template #title>Approve Request</template>
    <template #content>
      <p class="m-0">
      <form class="space-y-6">
        <div> <label class="bold">PO No. : </label> <span>{{ header.poNumber }}</span></div>
        <div> <label class="bold">Vendor by : </label> <span>{{ header.vendName }}</span></div>
        <div> <label class="bold">CompanyCode : </label> <span>{{ header.coCode }}</span></div>
        <div> <label class="bold">Purchasing Grp. : </label> <span>{{ header.purGroup }}</span></div>
        <div> <label class="bold">Purchasing Org. : </label> <span>{{ header.purchOrg }}</span></div>
        <div> <label class="bold">Net Value : </label> <span>{{ header.targetVal }} {{ header.currency }}</span></div>
        <div> <label class="bold">Document Date : </label> <span>{{ (header.docDate) }}</span></div>

        <DataTable :value="items" scrollable scrollHeight="400px" class="mt-4">
            <Column field="poItem" header="Name"  class="font-bold">
              <template #body="{ data }">
                    <span class="font-bold">{{ Number.parseInt(data.poItem) }}</span>
                </template>
            </Column>
            <Column field="purMat" header="Material"  frozen class="font-bold">
              <template #body="{ data }">
                    <span class="font-bold">{{ Number.parseInt(data.purMat) }}</span>
                </template>
              </Column>
            <Column field="shortText" header="Short Text" ></Column>
            <Column field="dispQuan" header="Qty" ></Column>
            <Column field="unit" header="Unit" ></Column>
            <Column field="netPrice" header="netPrice" >
              <template #body="{ data }">
                    <span class="font-bold">{{ getAmountFormat(data.netPrice) }}</span>
                </template></Column>
            <Column field="currncy" header="Currency" ></Column>
            <Column field="perUnit" header="Per Unit"></Column>
            <Column field="priceUnit" header="Price Unit"></Column>

        </DataTable>

      </form>
      <Accordion :multiple="true">
        <AccordionTab v-for="wf in workflow" :key="wf.step" >
          <template #header>
            <span class="flex align-items-center gap-2 w-full">
              <span class="font-bold white-space-nowrap w-2/3">{{ wf.stepName }}</span>
              <span class=" w-1/3"> <Tag  :value="wf.status"  :severity="actionSeverity(wf.status)" class="ml-auto mr-2" /></span>
            </span>
          </template>
          <span class="m-0">{{ wf.actorType }}: {{ wf.actorName }}</span>
        </AccordionTab>
      </Accordion>
      </p>
    </template>
    <template #footer>
      <div class="flex gap-3 mt-1">
        <Button label="Approve" class="w-full" @click.prevent="approve" />
      </div>
    </template>
  </Card>





</template>