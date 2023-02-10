import { Subject } from 'rxjs';

const prioritySubject = new Subject<{ player: string; end: boolean }>();

export { prioritySubject };
