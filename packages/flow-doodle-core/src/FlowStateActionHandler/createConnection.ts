import { FlowState, FlowStateDataScopes, FlowStateType, FlowStateView } from '@flow-doodle/core/FlowTypes'
import { Connection, Edge } from 'react-flow-renderer'
import { FlowRendererProps } from '@flow-doodle/core/FlowRenderer'
import { genId } from '@flow-doodle/core/genId/genId'

export const createConnection = <FSD extends FlowStateDataScopes, FV extends FlowStateView, FS extends FlowState<FSD, FV> = FlowState<FSD, FV>, FST extends FlowStateType<FSD, FV, FS> = FlowStateType<FSD, FV, FS>>(
    fs: FST,
    connection: Edge | Connection,
    getEdgeType?: FlowRendererProps<FSD, FV>['getEdgeType'],
): FST => {
    const newId = genId(8)
    const newType = getEdgeType && getEdgeType(connection)
    const newTypeObj = newType ? {type: newType} : {}
    console.log('Not implemented', newId, newTypeObj)

    /*const newConnection = {
        ...connection as FlowConnection,
        id: newId,
        ...newTypeObj,
        data: {
            ...newTypeObj,
        },
        //...((data as FlowState<FSD, FV>['data'])[initialType] || {}),
    }
    fs = fs.update('connections', (data) => ([
        ...(data as FS['connections']),
        newConnection,
    ]))

    fs = fs.update('viewList', (viewList) => {
        viewList = [...(viewList as FS['viewList'] || [])] as FS['viewList']
        (viewList as FS['viewList']).push(newConnection as FlowConnection)

        return viewList
    })*/

    return fs
}
