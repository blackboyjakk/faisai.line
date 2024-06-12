import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import {
  ClientConfig,
  MessageAPIResponseBase,
  messagingApi,
  webhook,
  HTTPFetchError,
} from '@line/bot-sdk';
import { Request, Response } from 'express';
import 'dotenv/config'
import { MessagerService } from 'src/messager/messager.service';
import { Public } from 'src/auth/auth.guard';


@Controller()
export class MessagerController {
  constructor(private messagerService: MessagerService) { }
  @Get('hello')
  getHello(): string {
    return "Hello world";
  }


  @Post()
  @Public()
  async callback(@Req() req: Request, @Res() res: Response): Promise<Response> {
    const callbackRequest: webhook.CallbackRequest = req.body;
    const events: webhook.Event[] = callbackRequest.events!;

    // Process all the received events asynchronously.
    const results = await Promise.all(
      events.map(async (event: webhook.MessageEvent) => {
        try {
          await this.messagerService.textEventHandler(event);
        } catch (err: unknown) {
          if (err instanceof HTTPFetchError) {
            console.error(err.status);
            // console.error(err.headers.get('x-line-request-id'));
            console.error(err.body);
          } else if (err instanceof Error) {
            console.error(err);
          }

          // Return an error message.
          return res.status(500).json({
            status: 'error',
          });
        }
      })
    );

    // Return a successful message.
    return res.status(200).json({
      status: 'success',
      results,
    });
  }
}


