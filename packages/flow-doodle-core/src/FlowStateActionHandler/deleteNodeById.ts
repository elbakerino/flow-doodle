import { FlowConnection, FlowState, FlowStateDataScopes, FlowStateType, FlowStateView } from '@flow-doodle/core/FlowTypes'
import { getIndexFromId } from '@flow-doodle/core/FlowContext/getIndexFromId'

export const deleteNodeById = <FSD extends FlowStateDataScopes, FV extends FlowStateView = FlowStateView, FS extends FlowState<FSD, FV> = FlowState<FSD, FV>, FST extends FlowStateType<FSD, FV, FS> = FlowStateType<FSD, FV, FS>, K extends keyof FSD = keyof FSD, D extends FSD[K] = FSD[K]>(
    fs: FST,
    id: string,
    maybe?: (data: D) => boolean,
    partial?: (data: D) => D,
    // when it returns `true` deletes the connection data
    connectionMatch?: (connection: FlowConnection) => boolean,
    connectionRename?: <C extends FlowConnection = FlowConnection>(connection: C) => C | undefined,
): FST => {
    const index = getIndexFromId<FSD, FV, FS, FST>(fs, id)
    let didDelete = false
    fs = fs.update('viewList', viewList => {
        const vl = [...(viewList as FS['viewList'] || [])] as FS['viewList']
        const d = vl[index]
        if(d && (!maybe || maybe((d.data as D) || {}))) {
            didDelete = true
            if(partial) {
                vl.splice(
                    index, 1,
                    {
                        ...d,
                        data: {
                            ...d.data,
                            data: partial(
                                d.data.data,
                            ),
                        },
                    },
                )
            } else {
                vl.splice(index, 1)
            }
        }

        return vl
    })
    if(didDelete) {
        if(!partial) {
            fs = fs.deleteIn(['index', id])
        }

        const deleteIds = partial ? [] : [id]
        if(connectionMatch) {
            // todo: implement again
        }
        if(deleteIds.length > 0) {
            fs = fs.update('viewList', viewList => {
                const vl = [...(viewList as FS['viewList'] || [])] as FS['viewList']
                deleteIds.forEach(dId => {
                    const index = vl.findIndex(vi => vi.id === dId)
                    if(index !== -1) {
                        vl.splice(index, 1)
                    }
                })

                return vl
            })
        }

        if(connectionRename) {
            // todo: implement again
        }
    }
    return fs
}
