import { Subject, Subscription } from 'rxjs';

export class EventEmitter {
  private subjects = {} as Record<string, Subject<any>>;
  private subscriptions = [] as Subscription[];

  public emit(name: string, payload: any) {
    this.createSubject(name);
    this.subjects[name].next(payload);
  }

  public listen<T>(name: string, cb: (data: T) => void) {
    this.createSubject(name);

    this.subscriptions.push(this.subjects[name].subscribe(cb));
  }

  public cleanUp() {
    Object.values(this.subjects).forEach((sub) => sub.complete());
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  private createSubject(name: string) {
    this.subjects[name] || (this.subjects[name] = new Subject());
  }
}
