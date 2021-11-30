import { FlowState, FlowStateDataScopes, FlowStateType, FlowStateView } from '@flow-doodle/core/FlowTypes'
import { getIndexFromId } from '@flow-doodle/core/FlowContext/getIndexFromId'

export const switchNodeType = <FSD extends FlowStateDataScopes, FV extends FlowStateView = FlowStateView, FS extends FlowState<FSD, FV> = FlowState<FSD, FV>, FST extends FlowStateType<FSD, FV, FS> = FlowStateType<FSD, FV, FS>, K extends keyof FSD = keyof FSD>(
    fs: FST,
    id: string,
    toDataScope: K,
): FST => {
    const index = getIndexFromId<FSD, FV, FS, FST>(fs, id)
    fs = fs.update('viewList', viewList => {
        const vl = [...(viewList as FS['viewList'] || [])] as FS['viewList']
        (vl as FS['viewList']).splice(index, 1, {
            ...vl[index],
            type: toDataScope as string,
        })

        return vl
    })
    return fs
}
