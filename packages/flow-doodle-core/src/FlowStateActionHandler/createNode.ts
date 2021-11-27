import { FlowState, FlowStateDataScopes, FlowStateType, FlowStateView, FlowStateViewCombined, FlowViewListEntryNode } from '@flow-doodle/core/FlowState/FlowTypes'
import { makeView } from './makeView'
import { genId } from '@flow-doodle/core/genId/genId'

export const createNode = <FSD extends FlowStateDataScopes, FV extends FlowStateView>(
    fs: FlowStateType<FSD, FV>,
    viewSetting?: Partial<FlowStateViewCombined & FV>,
    onCreate?: (id: string | undefined, node: FlowViewListEntryNode<FSD, FV> | undefined) => void,
): FlowStateType<FSD, FV> => {
    const newId = genId(8)
    // todo: better initial type
    const initialType = '_selector'

    if(fs.getIn(['data', initialType, newId])) {
        console.log('newId already exists', initialType, newId)
        return fs
    }

    fs = fs.update('data', (data) => ({
        ...(data as FlowState<FSD, FV>['data']),
        [initialType]: {
            ...((data as FlowState<FSD, FV>['data'])[initialType] || {}),
            [newId]: {
                data: {},
                type: initialType,
            },
        },
    }))

    // todo: better way to remove non-persistent view settings
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {created, ...viewSettingClean} = viewSetting
    fs = fs.update('view', (view) => ({
        ...(view as FlowState<FSD, FV>['view'] || {}),
        [initialType]: {
            ...((view as FlowState<FSD, FV>['view'])[initialType] || {}),
            // todo: make this build the same as for the `viewList` update, but with cleaning
            [newId]: viewSettingClean,
        },
    } as FlowState<FSD, FV>['view']))

    const data = fs.get('data') as FlowState<FSD, FV>['data']
    const view = fs.get('view') as FlowState<FSD, FV>['view']

    const newItem = view && data ?
        makeView<FSD, FV>(initialType, newId, {
            ...viewSetting as Partial<FlowStateViewCombined<FV>>,
        }, data) :
        undefined
    if(onCreate) {
        onCreate(newId, newItem)
    }
    fs = fs.update('viewList', (viewList) => ([
        ...(viewList as FlowState<FSD, FV>['viewList'] || []),
        ...(newItem ? [newItem] : []),
    ] as FlowState<FSD, FV>['viewList']))

    return fs
}
