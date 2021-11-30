import { FlowState, FlowStateDataScopes, FlowStateType, FlowStateView, FlowStateViewCombined, FlowViewListEntryNode } from '@flow-doodle/core/FlowTypes'
import { makeView } from './makeView'
import { genId } from '@flow-doodle/core/genId/genId'

export const createNode = <FSD extends FlowStateDataScopes, FV extends FlowStateView, FST extends FlowStateType<FSD, FV> = FlowStateType<FSD, FV>>(
    fs: FST,
    viewSetting?: Partial<FlowStateViewCombined & FV>,
    onCreate?: (id: string | undefined, node: FlowViewListEntryNode<FSD, FV> | undefined) => void,
): FST => {
    const newId = genId(8)
    // todo: better initial type
    const initialType = '_selector'

    if(fs.getIn(['index', newId])) {
        console.log('newId already exists', newId)
        return fs
    }

    const newItem = makeView<FSD, FV>(
        initialType, newId, {
            ...viewSetting as Partial<FlowStateViewCombined<FV>>,
        },
        // todo: how to supply initial data here?
        // @ts-ignore
        {},
    )
    if(onCreate) {
        onCreate(newId, newItem)
    }
    fs = fs.update('viewList', (viewList) => ([
        ...(viewList as FlowState<FSD, FV>['viewList'] || []),
        ...(newItem ? [newItem] : []),
    ] as FlowState<FSD, FV>['viewList']))

    fs = fs.setIn(['index', newId], (fs.get('viewList') as FlowState<FSD, FV>['viewList']).length - 1)

    return fs
}
