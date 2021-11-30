import { FlowState, FlowStateDataScopes, FlowStateType, FlowStateView } from '@flow-doodle/core/FlowTypes'

export const getIndexFromId = <FSD extends FlowStateDataScopes, FV extends FlowStateView, FS extends FlowState<FSD, FV> = FlowState<FSD, FV>, FST extends FlowStateType<FSD, FV, FS> = FlowStateType<FSD, FV, FS>>(
    fs: FST,
    id: string | number | symbol,
): number => {
    const index = (fs.get('viewList') as FS['viewList'])?.findIndex(v => v.id === id)
    //const index = fs.getIn(['index', id]) as number | undefined
    if(typeof index !== 'number' || index === -1) {
        throw new Error('id-not-exist-in-index')
    }
    return index
}
