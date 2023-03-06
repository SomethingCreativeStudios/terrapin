import { Subject } from 'rxjs';

const cardIdSubject = new Subject<{ newId: string; oldId: string }>();

export { cardIdSubject };
