import { FlowState, FlowStateDataScopes, FlowStateType, FlowStateView } from '@flow-doodle/core/FlowTypes'

export const deleteConnectionById = <FSD extends FlowStateDataScopes, FV extends FlowStateView = FlowStateView>(
    fs: FlowStateType<FSD, FV>,
    id: string,
): FlowStateType<FSD, FV> => {
    fs = fs.update('viewList', viewList => {
        viewList = [...(viewList as FlowState<FSD, FV>['viewList'] || [])] as FlowState<FSD, FV>['viewList']
        const index = viewList.findIndex(vi => vi.id === id)
        if(index !== -1) {
            viewList.splice(index, 1)
        }
        return viewList
    })
    return fs
}
