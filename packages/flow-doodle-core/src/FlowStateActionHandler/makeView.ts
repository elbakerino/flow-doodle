import {
    FlowStateDataScopes,
    FlowStateView, FlowViewListEntryNode,
} from '@flow-doodle/core/FlowTypes'

export const makeView = <FSD extends FlowStateDataScopes, FV extends FlowStateView, K extends keyof FSD = keyof FSD>(
    dataScope: K,
    id: string,
    view: Partial<FlowStateView>,
    data: FSD[K],
): FlowViewListEntryNode<FSD, FV> => {
    // todo: actually `view` would be the combined flow state view, not the prebuild OR both
    const idExist = typeof id !== 'undefined' && id !== null && id !== ''
    if(!idExist) {
        console.log('No ID for updating flow state in scope `' + dataScope + '`', view)
    }
    return {
        id: id,
        type: dataScope,
        ...view,
        data: {
            view: {},
            data: data,
        },
        // for edge:
        //label: ''
    } as FlowViewListEntryNode<FSD, FV>
}
