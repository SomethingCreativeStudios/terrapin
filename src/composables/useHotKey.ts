import { Ref, isRef, watch, onMounted, onBeforeUnmount, unref } from 'vue';
import { Key } from 'ts-keycode-enum';
import { CardBusEventName, useEvents } from '~/composables';

const { emitEvent } = useEvents();

export interface HotkeyOptions {
  // target element can be a reactive ref
  target: Ref<EventTarget> | EventTarget;
  shiftKey: boolean;
  ctrlKey: boolean;
  exact: boolean;
}

function addUpHotKey(key: string | number, onKeyPressed: () => any, opts?: Partial<HotkeyOptions>) {
  // get the target element
  const target = opts?.target || window;
  useEventListener(target, 'keydown', (e: KeyboardEvent) => {
    const options = opts || {};
    if (e.key === key && matchesKeyScheme(options, e)) {
      e.preventDefault();
      onKeyPressed();
    }
  });
}

function setUpHotKeys() {
  addUpHotKey(
    't',
    () => {
      emitEvent(CardBusEventName.TOGGLE_TAP_CARD, {});
    },
    { exact: true }
  );

  addUpHotKey(
    's',
    () => {
      emitEvent(CardBusEventName.STACK_CARDS, {});
    },
    { exact: true }
  );

  addUpHotKey(
    'l',
    () => {
      emitEvent(CardBusEventName.LINE_CARDS, {});
    },
    { exact: true }
  );
}

export function useHotKey() {
  return { addUpHotKey, setUpHotKeys };
}

function useEventListener(
  // the target could be reactive ref which adds flexibility
  target: Ref<EventTarget | null> | EventTarget,
  event: string,
  handler: (e: any) => any
) {
  // if its a reactive ref, use a watcher
  if (isRef(target)) {
    watch(target, (value, oldValue) => {
      oldValue?.removeEventListener(event, handler);
      value?.addEventListener(event, handler);
    });
  } else {
    // otherwise use the mounted hook
    onMounted(() => {
      target.addEventListener(event, handler);
    });
  }
  // clean it up
  onBeforeUnmount(() => {
    unref(target)?.removeEventListener(event, handler);
  });
}

function matchesKeyScheme(opts: Pick<Partial<HotkeyOptions>, 'shiftKey' | 'ctrlKey' | 'exact'>, evt: KeyboardEvent) {
  const ctrlKey = opts.ctrlKey ?? false;
  const shiftKey = opts.shiftKey ?? false;
  if (opts.exact) {
    return ctrlKey === evt.ctrlKey && shiftKey == evt.shiftKey;
  }
  const satisfiedKeys: boolean[] = [];
  satisfiedKeys.push(ctrlKey === evt.ctrlKey);
  satisfiedKeys.push(shiftKey === evt.shiftKey);
  return satisfiedKeys.every((key) => key);
}
