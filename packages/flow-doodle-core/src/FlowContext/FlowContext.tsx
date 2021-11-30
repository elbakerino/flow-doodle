import React from 'react'
import { ReactFlowProvider } from 'react-flow-renderer'
import {
    FlowConnection, FlowNodeViewOptions,
    FlowState, FlowStateDataScopes, FlowStateType,
    FlowStateView, FlowViewListEntryNode,
} from '@flow-doodle/core/FlowTypes'
import {
    deleteNodeById,
    updateNodeData, updateNodeView,
    switchNodeType,
    duplicateNode,
} from '@flow-doodle/core/FlowStateActionHandler'

export interface FlowContextProps<FSD extends FlowStateDataScopes, FV extends FlowStateView = FlowStateView, FS extends FlowState<FSD, FV> = FlowState<FSD, FV>, FST extends FlowStateType<FSD, FV, FS> = FlowStateType<FSD, FV, FS>> {
    update: React.Dispatch<React.SetStateAction<FST>>
    flowState: FST
    container?: React.MutableRefObject<HTMLDivElement | null>
}

export interface FlowContextActionsType<FSD extends FlowStateDataScopes, FV extends FlowStateView = FlowStateView> {
    update: <K extends keyof FSD>(
        id: string,
        updater: (data: FSD[K]) => FSD[K]
    ) => void
    duplicate: (
        id: string,
        offset: number,
        getId: (id: string | undefined, node: FlowViewListEntryNode<FSD, FV> | undefined) => void
    ) => void
    duplicateAll: <K extends keyof FSD>(
        selectors: {
            type: K
            id: string
        }[],
        offset: number,
        getNewOnes: (newOnes: undefined | ({
            id: string | undefined
            node: FlowViewListEntryNode<FSD, FV> | undefined
        })[]) => void
    ) => void
    updateView: <FVO extends FlowNodeViewOptions = FlowNodeViewOptions>(
        id: string,
        updater: (viewData: FVO) => FVO
    ) => void
    deleteById: <K extends keyof FSD, D extends FSD[K] = FSD[K]>(
        id: string,
        maybe?: (data: D) => boolean,
        partial?: (data: D) => D,
        // when it returns `true` deletes the connection data
        connectionMatch?: (connection: FlowConnection) => boolean,
        connectionRename?: <C extends FlowConnection = FlowConnection>(connection: C) => C | undefined
    ) => void
    switchType: <K extends keyof FSD>(
        id: string,
        toDataScope: K
    ) => void
    container?: React.MutableRefObject<HTMLDivElement | null>
}

// @ts-ignore
const FlowContextActions = React.createContext<FlowContextActionsType>({})

export const useFlowActions = <FSD extends FlowStateDataScopes>(): FlowContextActionsType<FSD> => React.useContext(FlowContextActions)

// @ts-ignore
const FlowContextState = React.createContext<FlowStateType>({})

export const useFlowState = <FSD extends FlowStateDataScopes, FV extends FlowStateView = FlowStateView, FS extends FlowState<FSD, FV> = FlowState<FSD, FV>, FST extends FlowStateType<FSD, FV, FS> = FlowStateType<FSD, FV, FS>>(): FST => React.useContext(FlowContextState)

export const FlowContextProvider = <FSD extends FlowStateDataScopes, FV extends FlowStateView = FlowStateView, FS extends FlowState<FSD, FV> = FlowState<FSD, FV>, FST extends FlowStateType<FSD, FV, FS> = FlowStateType<FSD, FV, FS>>(
    {
        children,
        update: updateState,
        flowState,
        container,
    }: React.PropsWithChildren<FlowContextProps<FSD, FV, FS, FST>>,
): React.ReactElement => {
    const deleteByIdFn: FlowContextActionsType<FSD, FV>['deleteById'] = React.useCallback((
        id,
        maybe,
        partial,
        connectionMatch,
        connectionRename,
    ) => {
        updateState(fs => deleteNodeById<FSD, FV, FS, FST>(
            fs,
            id,
            // @ts-ignore
            maybe,
            partial,
            connectionMatch,
            connectionRename,
        ))
    }, [updateState])

    const update: FlowContextActionsType<FSD, FV>['update'] = React.useCallback(<K extends keyof FSD>(
        id: string,
        updater: (data: FSD[K]) => FSD[K],
    ) => {
        updateState(fs => updateNodeData<FSD, FV, FS, FST, K>(
            fs,
            id,
            updater,
        ))
    }, [updateState])

    const duplicate: FlowContextActionsType<FSD, FV>['duplicate'] = React.useCallback((a, offset, c) => {
        updateState(fs => {
            const r = duplicateNode<FSD, FV, FS, FST>(fs, a, offset, 0)
            if(c) {
                c(r.id, r.node)
            }
            return r.fs
        })
    }, [updateState])

    const duplicateAll: FlowContextActionsType<FSD, FV>['duplicateAll'] = React.useCallback((selectors, offset, getNewOnes) => {
        updateState(fs => {
            const newOnes: any[] = []
            selectors.forEach(s => {
                const r = duplicateNode<FSD, FV, FS, FST>(fs, s.id, offset, (fs.get('viewList') as FS['viewList'])?.length)
                if(r.id) {
                    newOnes.push(
                        r.id && r.node ? {
                            id: r.id,
                            node: r.node,
                        } : undefined,
                    )
                    fs = r.fs
                }
            })
            getNewOnes(newOnes)
            return fs
        })
    }, [updateState])

    const updateView: FlowContextActionsType<FSD, FV>['updateView'] = React.useCallback(<FVO extends FlowNodeViewOptions>(
        id: string,
        updater: (viewData: FVO) => FVO,
    ) => {
        updateState(fs =>
            updateNodeView<FSD, FV, FS, FST, FVO>(
                fs,
                id,
                updater,
            ),
        )
    }, [updateState])

    const switchTypeFn: FlowContextActionsType<FSD>['switchType'] = React.useCallback((id, toDataScope) => {
        updateState(fs => switchNodeType<FSD, FV, FS, FST>(fs, id, toDataScope))
    }, [updateState])

    const ctx = React.useMemo(() => ({
        update,
        deleteById: deleteByIdFn,
        switchType: switchTypeFn,
        updateView,
        duplicate,
        duplicateAll,
        container,
    }), [
        update,
        deleteByIdFn,
        switchTypeFn,
        updateView,
        duplicate,
        duplicateAll,
        container,
    ])

    return <FlowContextActions.Provider value={ctx}>
        <FlowContextState.Provider value={flowState}>
            <ReactFlowProvider>
                {children}
            </ReactFlowProvider>
        </FlowContextState.Provider>
    </FlowContextActions.Provider>
}
