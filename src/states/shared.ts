import { State, AnyEventObject, Interpreter, ResolveTypegenMeta, TypegenDisabled, BaseActionObject, ServiceMap } from 'xstate';

export type TransitionFunc<T> = Record<string, (state: StateContext<T>, service: StateInterrupter<T>) => void>;

export type StateContext<T> = State<T, AnyEventObject, any, {
    value: any;
    context: T;
}, ResolveTypegenMeta<TypegenDisabled, AnyEventObject, BaseActionObject, ServiceMap>>

export type StateInterrupter<T> = Interpreter<T, any, AnyEventObject, {
    value: any;
    context: T;
}, ResolveTypegenMeta<TypegenDisabled, AnyEventObject, BaseActionObject, ServiceMap>>;


export function getTransitionState<T>(state: StateContext<T>) {
    return `${state.history?.value ?? 'start'}->${state.value as string}`;
}

export function setUpTransitions<T>(service: StateInterrupter<T>, callMap: TransitionFunc<T>) {
    service.onTransition(state => {
        const stateTransition = getTransitionState(state);
        console.log(stateTransition);
        if (callMap[stateTransition]) {
            callMap[stateTransition](state, service);
        }
    })
}