<script setup lang="ts">
  import liff from '@line/liff';
  import axios, { AxiosError } from 'axios';
  import { ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useConfirm } from "primevue/useconfirm";
import { lineLogin } from '@/helper/line-auth';

  const route = useRoute();
  const router = useRouter();
  const prNo = route.params.prNo;
  const itemNo = route.params.itemNo;
  const doc = ref<any>({});
  const workflow = ref<any>([]);
  const note = ref('');
  const canApprove = ref(false);
  const canReject = ref(false);
  let token: string | null = '';
  const confirm = useConfirm();
  const isLogin = ref(false);
  const activeFlow = ref(0);
    const init = async () => {
        await lineLogin().then((response) => {
  
          isLogin.value = true
          loadDoc();
          
        }).catch(()=>{
          alert('error init')
        });
    };


  const loadDoc = () => {


    axios.post(`document/pr/${prNo}/${itemNo}`).then((res) => {

      doc.value = res.data.item;
      workflow.value = res.data.actions;
      canApprove.value = res.data.canApprove;
      canReject.value =res.data.canReject;
      // activeFlow.value = workflow.value.findIndex((w:any) =>w.status == 'W');
    }).catch((e)=>{
      
      alert(e)
    })
  }

  const approve = () => {

    if(!workflow.value.length){
      alert('Workflow Not Found')
      return;
    }
    axios.post(`document/pr/${prNo}/${itemNo}/approve`, {
      note: note.value
    }, {

    }).then((res) => {
      alert('Approve Done')
      loadDoc()
    })
  }
  const reject = () => {

    if(!workflow.value.length){
      alert('Workflow Not Found')
      return;
    }
    if(!note.value?.trim()){
      alert('Note is required for reject.')
      return;
    }
    axios.post(`document/pr/${prNo}/${itemNo}/reject`, {
      note: note.value
    }, {

    }).then((res) => {
      alert('Reject Done')
      loadDoc()
    })
  }
  const displayWF = () => {
    axios.post(`document/pr/${prNo}/${itemNo}/workflow`, {

    }).then((res) => {
      workflow.value = res.data;
    }).catch((error: AxiosError<{ message: string, statusCode: number }>) => {

      if (error.response?.data.statusCode == 401) {
        router.push({ name: "auth" });
      }
      alert(error.response?.data.message);
    });
  }
  const actionSeverity = (actionCode: string) => {
    switch (actionCode) {
      case 'A': return 'success'
      case 'W': return 'info'
      case 'R': return 'danger'

      default:
        break;
    }
  }
  init();
</script>

<template>
  <Card v-if="isLogin">
    <template #title>Approve Request</template>
    <template #content>
      <p class="m-0">
      <form class="space-y-6">
        <div><label>PR No. : </label> <span>{{ doc.preqNo }}</span></div>
        <div> <label>Item : </label> <span>{{ doc.preqItem }}</span></div>
        <div> <label>Req. by : </label> <span>{{ doc.preqName }}</span></div>
        <div> <label>Material : </label> <span>{{ doc.shortText }}</span></div>
        <div> <label>Material Grp. : </label> <span>{{ doc.matGrp }}</span></div>
        <div> <label>Valuation Price : </label> <span>{{ doc.cAmtBapi }} {{ doc.currency }}</span></div>
        <div> <label>Qty : </label> <span>{{ (doc.quantity) }}</span></div>
        <div> <label>Total Value : </label> <span>{{ doc.priceUnit }} {{ doc.currency }}</span></div>

        <div>
          <label for="note">Additional Note :</label><br>
          <Textarea v-model="note" rows="5" class="w-full" autoResize />
        </div>

      </form>
      <Accordion :multiple="true" :activeIndex="activeFlow">
        <AccordionTab v-for="(value, key, index) in workflow" :key="value.step">
          <template #header>
            <span class="flex align-items-center gap-2 w-full">
              <span class="font-bold white-space-nowrap w-2/3">{{ value.stepName }}</span>
              <span class=" w-1/3">
                <Tag :value="value.status" :severity="actionSeverity(value.status)" class="ml-auto mr-2" />
              </span>
            </span>
          </template>
          <span class="m-0">{{ value.actorType }}: {{ value.actorName }}</span>
        </AccordionTab>
      </Accordion>
      </p>
    </template>
    <template #footer>
      <div class="flex flex-row gap-3 mt-1">
        <Button label="Reject" class="w-full" @click.prevent="reject" v-if="canReject" severity="danger" outlined />
    
        <Button label="Approve" class="w-full" @click.prevent="approve" v-if="canApprove"  />
  </div>
    </template>
  </Card>
  <Button v-if="!isLogin" label="Login" @click="lineLogin"></Button>



</template>