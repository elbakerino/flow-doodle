import { Node } from 'react-flow-renderer'
import { Map } from 'immutable'

/**
 * Always makes `label` optional for nodes and available inside default typings
 */
export interface NodeData {
    label?: string
}

/**
 * Normalizing mostly used view options for nodes
 */
export interface FlowNodeViewOptions {
    color?: string
    fontSize?: number
    elevate?: boolean
    outline?: boolean
    fontWeight?: 'bold' | 'normal'
    link?: {
        target?: string
        iconUrl?: string
    }
    // todo: `icon` must be typed with | to be fully correct, but this introduces a lot of typing headaches / needed extra vars and explicit typings
    icon?: {
        name?: string
        provider?: string
        color?: string
    } & {
        url?: string
    } & {
        emoji?: string
    }
    pointer?: {
        direction?: 'right' | 'left' | 'both'
        width?: number
        widthRight?: number
        widthLeft?: number
    }
}

export interface FlowStateViewPosition {
    position: {
        x: number
        y: number
    }

    // todo: reevaluate generic view options
    [k: string]: any
}

export interface FlowStateView<FVO extends FlowNodeViewOptions = FlowNodeViewOptions> extends FlowStateViewPosition {
    view: FVO
}

export interface FlowStateViewInternalOnly {
    id: string
    type: string
}

export type FlowStateViewCombined<FV extends FlowStateView = FlowStateView> = FlowStateViewInternalOnly & FV

export interface FlowNodeViewProps {
    selected: boolean
    isDragging: boolean
}

export interface FlowStateViewData extends FlowStateView {
    created?: boolean
}

export interface FlowNodeInternalStateData<FSD extends FlowStateDataScopes, T extends keyof FSD = keyof FSD, P extends FlowStateData<FSD> = FlowStateData<FSD>> {
    type: T
    data: P
}

export interface FlowStateDataScopes<D extends NodeData = NodeData> {
    [k: string]: D
}

export interface FlowConnection {
    id: string
    type?: string
    source: string
    sourceHandle: string
    target: string
    targetHandle: string
    data: any
}

export interface FlowState<FSD extends FlowStateDataScopes, FV extends FlowStateView = FlowStateView> {
    viewList: (FlowViewListEntryNode<FSD, FV> | FlowConnection)[]
    index: {
        [id: string]: {
            i: number
            type?: string
        }
    }
}

export type FlowViewListEntryNode<FSD extends FlowStateDataScopes, FV extends FlowStateView = FlowStateView, FVO extends FV['view'] = FV['view'], T extends keyof FSD = keyof FSD> =
    FlowNodeInternalStateData<FSD, T, FlowStateData<FSD, FVO, T>>
    & FlowStateViewInternalOnly
    & FlowStateViewPosition

export type FlowStateType<FSD extends FlowStateDataScopes, FV extends FlowStateView = FlowStateView, FS extends FlowState<FSD, FV> = FlowState<FSD, FV>> =
    Map<keyof FS, FS[keyof FS]>

export interface FlowStateData<FSD extends FlowStateDataScopes, FVO extends FlowNodeViewOptions = FlowNodeViewOptions, T extends keyof FSD = keyof FSD> {
    data: FSD[T]
    view: FVO
}

export type FlowNodeType<FSD extends FlowStateDataScopes, T extends keyof FSD = keyof FSD, FV extends FlowStateView = FlowStateView> =
    Node<FlowStateData<FSD, FV['view'], T>> &
    {
        type: T
    } &
    FlowNodeViewProps & FV
