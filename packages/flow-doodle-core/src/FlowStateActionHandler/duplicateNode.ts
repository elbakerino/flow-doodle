import { FlowState, FlowStateDataScopes, FlowStateType, FlowStateView, FlowViewListEntryNode } from '@flow-doodle/core/FlowTypes'
import { genId } from '@flow-doodle/core/genId'
import { getIndexFromId } from '@flow-doodle/core/FlowContext/getIndexFromId'

export const duplicateNode = <FSD extends FlowStateDataScopes, FV extends FlowStateView, FS extends FlowState<FSD, FV> = FlowState<FSD, FV>, FST extends FlowStateType<FSD, FV, FS> = FlowStateType<FSD, FV, FS>, K extends keyof FSD = keyof FSD>(
    fs: FST,
    id: string,
    offsetY: number,
    startLayer?: number,
): {
    fs: FST
    id?: string
    node?: FlowViewListEntryNode<FSD, FV>
} => {
    const index = getIndexFromId<FSD, FV, FS, FST>(fs, id)

    const item = fs.getIn(['viewList', index]) as FlowViewListEntryNode<FSD, FV, FV['view'], K>

    if(!item) return {fs}

    const newId = genId(8)

    const newItem: FlowViewListEntryNode<FSD, FV, FV['view'], K> = {
        ...item,
        id: newId,
        position: {
            x: item.position.x + 30,
            y: item.position.y + (30 * offsetY),
        },
    }

    fs = fs.update('viewList', viewList => {
        const v = [...(viewList as FS['viewList']) || []] as FS['viewList']
        v.splice(
            typeof startLayer !== 'undefined' ? startLayer :
                index + 1,
            0,
            newItem,
        )

        return v
    })
    // todo: update index and stuff

    return {
        fs,
        id: newId,
        node: newItem,
    }
}
