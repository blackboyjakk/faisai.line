import { ClientConfig, MessageAPIResponseBase, messagingApi, webhook } from '@line/bot-sdk';
import { FlexBubble, FlexCarousel } from '@line/bot-sdk/dist/messaging-api/api';
import { FlexContainer } from '@line/bot-sdk/dist/messaging-api/model/flexContainer';
import { TextMessageContent } from '@line/bot-sdk/dist/webhook/model/textMessageContent';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/_entities/user.entity';
import { BapiRequisitionItem } from 'src/document/dto/bapiRequisitionItems.dto';
import { DocumentService } from 'src/document/document.service';
import { Repository } from 'typeorm';
import { roleMapAuth } from '../_entities/roleMapAuth.entity';
import { PoHeader } from 'src/document/dto/poReleaseItems';

@Injectable()
export class MessagerService {

  public constructor(
    private readonly documentService: DocumentService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  private readonly clientConfig: ClientConfig = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN || '',
  };
  private readonly client = new messagingApi.MessagingApiClient(this.clientConfig);
  // Function handler to receive the text.
  public async textEventHandler(event: webhook.MessageEvent): Promise<MessageAPIResponseBase | undefined> {


    const user = await this.userRepository.findOne({ where: { userId: event.source.userId }, relations: { employee:{mapRoles:{role:{mapAuths:{auth:true}}}}} });

    if (user == null) {

      this.getRegisterMenu(event.replyToken)

    }

    if (event.type !== 'message') {
      return;
    }

    if (!event.replyToken) return;

    
      const message = (event.message as TextMessageContent).text
    const [command,arg] = message.split(':')
    switch (command) {
      case 'Menu': this.getMyMenu(event.replyToken); break;
      case 'DisplayPR': this.getPrList(event.replyToken,arg); break;
      case 'DisplayPO': this.getPoList(event.replyToken,arg); break;
      case 'DisplaySO': this.getSoList(event.replyToken,arg); break;
      default: return;
    }

  }
  async getRegisterMenu(replyToken: any) {
    const bodyText = "Please register to continue";
    const actionLabel = "Register";
    const actionUrl = process.env.NODE_APP_BASE_URL + "auth/register"
    const flex: FlexBubble = {
      type: "bubble",
      size: "kilo",
      direction: "ltr",
      body: {
        type: "box",
        layout: "vertical",
        contents: [

          {
            type: "text",
            text: bodyText,
            contents: []
          }
        ]
      },
      footer: {
        type: "box",
        layout: "horizontal",
        contents: [
          {
            type: "button",
            action: {
              type: "uri",
              label: actionLabel,
              uri: actionUrl,
            },
            color: "#39C943FF",
            style: "primary"
          }
        ]
      }
    }


    await this.client.replyMessage({
      replyToken: replyToken,
      messages: [{
        type: 'flex',
        altText: 'Menu List',
        contents: flex
      }],
    });
  }

  private async getMyMenu(replyToken: string): Promise<void> {

    await this.client.replyMessage({
      replyToken: replyToken,
      messages: [{
        type: 'flex',
        altText: 'Menu List',
        contents: this.getCarouselMenu()
      }],
    });
  }
  getCarouselMenu(): FlexCarousel {
    const flex: FlexContainer = {
      type: "carousel",
      contents: [
        this.getBubbleMenu('PR', 'you have 2 items', 'Display List', 'DisplayPR', process.env.NODE_APP_BASE_URL + 'images/con_PR.png'),
        this.getBubbleMenu('PO', 'you have 2 items', 'Display List', 'DisplayPO', process.env.NODE_APP_BASE_URL + 'images/con_PO.png'),
        this.getBubbleMenu('SO', 'you have 2 items', 'Display List', 'DisplaySO', process.env.NODE_APP_BASE_URL + 'images/con_SO.png'),
      ]
    }

    return flex;
  }
  async getPrList(replyToken: string,arg:string='1') {

    const docs = await this.documentService.getPrDocuments()
    
    const page =   Number.parseInt(arg)-1
    const from = page*10;
    const to = from+10;
    const flex: FlexContainer = {
      type: "carousel",
      contents: docs.slice( from, to).map(doc => this.getPrBubbles(doc))
    }

      const moreBubble = this.getPaginBubble('PR',arg,from,to,docs.length  )
       
    if(moreBubble){
      flex.contents.push(moreBubble)
    }
    await this.client.replyMessage({
      replyToken: replyToken,
      messages: [{
        type: 'flex',
        altText: 'Menu List',
        contents: flex
      }],
    });;
  }

  async getPoList(replyToken: string,arg:string='1') {
    const docs = await this.documentService.getPoDocuments()
    
    const page =   Number.parseInt(arg)-1
    const from = page*10;
    const to = from+10;
    const flex: FlexContainer = {
      type: "carousel",
      contents: docs.slice( from, to).map(doc => this.getPoBubbles(doc))
    }

      const moreBubble = this.getPaginBubble('PO',arg,from,to,docs.length  )
       
    if(moreBubble){
      flex.contents.push(moreBubble)
    }
    await this.client.replyMessage({
      replyToken: replyToken,
      messages: [{
        type: 'flex',
        altText: 'Menu List',
        contents: flex
      }],
    });
  }
  getSoList(replyToken: string,page:string) {
    throw new Error('Method not implemented.');
  }
  getBubbleMenu(headerText, bodyText, actionLabel, actionText, imgUrl): FlexBubble {
    const flex: FlexBubble = {
      type: "bubble",
      size: "micro",
      direction: "ltr",
      body: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "image",
            url: imgUrl,
            flex: 1,
            size: "full"
          },
          {
            type: "text",
            text: headerText,
            weight: "bold",
            flex: 1,
            align: "start",
            contents: []
          },
          {
            type: "text",
            text: bodyText,
            contents: []
          }
        ]
      },
      footer: {
        type: "box",
        layout: "horizontal",
        contents: [
          {
            type: "button",
            action: {
              type: "message",
              label: actionLabel,
              text: actionText
            },
            color: "#39C943FF",
            style: "primary"
          }
        ]
      }
    }

    return flex;
  }
  getPrBubbles(doc: BapiRequisitionItem): FlexBubble {
   
    const flex: FlexBubble = {
      type: "bubble",
      size: "kilo",
      direction: "ltr",
      body: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: `PR No. : ${doc.preqNo}`,
          },
          {
            type: "text",
            text: `item : ${doc.preqItem}`,
          },
          {
            type: "text",
            text: `Req. by : ${doc.preqName}`,
          },
          {
            type: "text",
            text: `Material : ${doc.material}`,
          },
          {
            type: "text",
            text: `Material Grp : ${doc.matGrp}`,
          },
          {
            type: "text",
            text: `Valuation Price : ${getAmountFormat(doc.cAmtBapi)} ${doc.currency}`,
          },
          {
            type: "text",
            text: `Qty : ${getAmountFormat(doc.quantity, 3)}`,
          },
          {
            type: "text",
            text: `Total Value : ${getAmountFormat(doc.priceUnit)} ${doc.currency}`,
          }
        ]
      },
      footer: {
        type: "box",
        layout: "horizontal",
        contents: [
          {
            type: "button",
            action: {
              type: "uri",
              label: 'Approve',
              uri: process.env.NODE_APP_BASE_URL + `document/pr/${doc.preqNo}/${doc.preqItem}`
            },
            color: "#39C943FF",
            style: "primary"
          }
        ]
      }
    }

    return flex;
  }

  getPoBubbles(doc: PoHeader): FlexBubble {
   
    const flex: FlexBubble = {
      type: "bubble",
      size: "kilo",
      direction: "ltr",
      body: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: `PO No. : ${doc.poNumber}`,
          },
          {
            type: "text",
            text: `Vendor : ${doc.vendName}`,
          },
          {
            type: "text",
            text: `Company Code : ${doc.coCode}`,
          },
          {
            type: "text",
            text: `Purchasing Group : ${doc.purGroup}`,
          },
          {
            type: "text",
            text: `Purchasing Org : ${doc.purchOrg}`,
          },
          {
            type: "text",
            text: `Net  Value : ${getAmountFormat(doc.targetVal)} ${doc.currency}`,
          },
          {
            type: "text",
            text: `Document Date : ${getDateFormat(doc.docDate)}`,
          }
         
        ]
      },
      footer: {
        type: "box",
        layout: "horizontal",
        contents: [
          {
            type: "button",
            action: {
              type: "uri",
              label: 'Approve',
              uri: process.env.NODE_APP_BASE_URL + `document/po/${doc.poNumber}`
            },
            color: "#39C943FF",
            style: "primary"
          }
        ]
      }
    }

    return flex;
  }
  
  getPaginBubble(docType:string,arg:string,from:number,to:number,total:number):FlexBubble{
    const flex: FlexBubble = {
      type: "bubble",
      size: "kilo",
      direction: "ltr",
      body: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: `PR items`,
          },
          {
            type: "text",
            text: `From: ${from+1} To: ${to < total ? to : total}`,
          },
          {
            type: "text",
            text: `Total : ${total}`,
          },
          
        ]
      },
      footer: {
        type: "box",
        layout: "horizontal",
        contents: [
        ]
      }
    }
    if(from != 0){
      flex.footer.contents.push({
        type: "button",
        action: {
          type: "message",
          label: '<< Previous',
          text:`Display${docType}:${Number.parseInt( arg)-1}`
        },
        color: "#39C943FF",
        style: "primary"
      })
    }
    if(total>to){
      flex.footer.contents.push(
        {
          type: "button",
          action: {
            type: "message",
            label: 'Next >>',
            text:`Display${docType}:${Number.parseInt( arg)+1}`
          },
          color: "#39C943FF",
          style: "primary"
        })
    }
    return flex;
  }
}


function getAmountFormat(amount, place = 2) {
  return Number(amount).toLocaleString(undefined, { minimumFractionDigits: place, maximumFractionDigits: place });
}

function getDateFormat(str:string) {
   const date = new Date(str)
return `${date.getDay()}/${date.getMonth()+1}/${date.getFullYear()}`;
}
