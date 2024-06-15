<script setup lang="ts">
  import liff from '@line/liff';
  import axios, { AxiosError } from 'axios';
  import { ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useConfirm } from "primevue/useconfirm";

  const route = useRoute();
  const router = useRouter();
  const prNo = route.params.prNo;
  const itemNo = route.params.itemNo;
  const doc = ref<any>({});
  const workflow = ref<any>([]);
  const note = ref('');
  let token: string | null = '';
  const confirm = useConfirm();
  const isLogin = ref(false);
  const load = async () => {

    await liff.init({ liffId: import.meta.env.VITE_LINE_LIFF_ID })

    if (liff.isInClient()) {
      loadDoc()
    } else {
      if (liff.isLoggedIn()) {
        isLogin.value = true
        loadDoc()
      } else {
        localStorage.setItem('redirectUri',  window.location.href);
      }
    }
  };

  const lineLogin = () => {
    liff.login()
  }

  const loadDoc = () => {


    console.log('loadDoc');

    axios.post(`document/pr/${prNo}/${itemNo}`).then((res) => {
      console.log(res.data);
      doc.value = res.data.item;
      workflow.value = res.data.actions;
    }).catch((error: AxiosError<{ message: string, statusCode: number }>) => {
      if (error.response?.data.statusCode == 401) {

        console.log('error', error);
        localStorage.setItem('redirectUri', window.location.href);
        setTimeout(() => {
          router.push({ name: 'auth' })
        }, 1000)
      } else {
        alert(error.response?.data.message);
      }
    });
  }

  const approve = () => {

    axios.post(`document/pr/${prNo}/${itemNo}/approve`, {
      note: note.value
    }, {

    }).then((res) => {
      loadDoc
    }).catch((error: AxiosError<{ message: string, statusCode: number }>) => {

      if (error.response?.data.statusCode == 401) {
        router.push({ name: "auth" });
      }
      alert(error.response?.data.message);
    });
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
  load();
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

        <!-- <div>
          <label for="note">Additional Note :</label><br>
          <Textarea v-model="note" rows="5" class="w-full" autoResize />
        </div> -->

      </form>
      <Accordion :multiple="true">
        <AccordionTab v-for="wf in workflow" :key="wf.step">
          <template #header>
            <span class="flex align-items-center gap-2 w-full">
              <span class="font-bold white-space-nowrap w-2/3">{{ wf.stepName }}</span>
              <span class=" w-1/3">
                <Tag :value="wf.status" :severity="actionSeverity(wf.status)" class="ml-auto mr-2" />
              </span>
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
  <Button v-if="!isLogin" label="Login" @click="lineLogin"></Button>



</template>