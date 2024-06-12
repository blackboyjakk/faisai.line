import { AsyncLocalStorage } from 'async_hooks';
import { Employee } from 'src/_entities/employee.entity';
import { User } from 'src/_entities/user.entity';

export class RequestContext<TRequest = any, TResponse = any> {
  static cls = new AsyncLocalStorage<RequestContext>();

  static get currentContext() {
    return this.cls.getStore();
  }

  static get currentUser() :User{
    return this.currentContext?.req['user'];
  }
  static get currentEmployee():Employee {
    return this.currentUser?.employee;
  }
  constructor(public readonly req: TRequest, public readonly res: TResponse) {}
}