import { FlowStateDataScopes, FlowStateType } from '@flow-doodle/core/FlowTypes'
import { FlowLayer } from '@flow-doodle/core/buildLayerList'
import { Map } from 'immutable'

export const buildViewList = <FSD extends FlowStateDataScopes, FS extends FlowStateType<FSD> = FlowStateType<FSD>>(
    layerList: FlowLayer[] | undefined = [],
): FS => {
    let fs = Map({
        viewList: layerList,
        index: {},
    }) as FS

    (fs.get('viewList') as FlowLayer[]).forEach((fl, i) => {
        fs = fs.setIn(['index', fl.id], i)
    })
    return fs
}

