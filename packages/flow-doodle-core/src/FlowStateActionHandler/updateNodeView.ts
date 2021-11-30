import { FlowNodeViewOptions, FlowState, FlowStateDataScopes, FlowStateType, FlowStateView } from '@flow-doodle/core/FlowTypes'
import { getIndexFromId } from '@flow-doodle/core/FlowContext/getIndexFromId'

export const updateNodeView = <FSD extends FlowStateDataScopes, FV extends FlowStateView, FS extends FlowState<FSD, FV> = FlowState<FSD, FV>, FST extends FlowStateType<FSD, FV, FS> = FlowStateType<FSD, FV, FS>, FSO extends FlowNodeViewOptions = FlowNodeViewOptions>(
    fs: FST,
    id: string,
    updater: (data: FSO) => FSO,
): FST => {
    const index = getIndexFromId<FSD, FV, FS, FST>(fs, id)
    fs = fs.update('viewList', viewList => {
        const vl = [...(viewList as FS['viewList'] || [])] as FS['viewList']
        (vl as FS['viewList']).splice(index, 1, {
            ...vl[index],
            data: {
                ...vl[index].data,
                view: updater(vl[index].data.view),
            },
        })

        return vl
    })
    return fs
}
