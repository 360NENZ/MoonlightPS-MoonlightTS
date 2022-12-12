import { CombatInvocationsNotify, CombatTypeArgument, EntityFightPropUpdateNotify, EntityMoveInfo, EvtBeingHitInfo, EvtBeingHitNotify, ForwardType, MotionState, Vector } from '../../../data/proto/game';
import { Session } from '../../session';
import { DataPacket } from '../../packet';
import ProtoFactory from '../../../utils/ProtoFactory';
import { Entity, EntityCategory } from '../../../game/entity/entity';
import { Avatar } from '../../../game/entity/avatar';
import { FightProperties } from '../../../game/managers/constants/FightProperties';


export default async function handle(session: Session, packet: DataPacket) {
    const body = ProtoFactory.getBody(packet) as CombatInvocationsNotify;

    for (let invoke of body.invokeList) {
        switch (invoke.argumentType) {
            case CombatTypeArgument.COMBAT_TYPE_ARGUMENT_EVT_BEING_HIT:
                const BeingHitData = EvtBeingHitInfo.decode(Buffer.from(invoke.combatData));


				break;
            case CombatTypeArgument.COMBAT_TYPE_ARGUMENT_ENTITY_MOVE:
                const moveInfo: EntityMoveInfo = EntityMoveInfo.decode(invoke.combatData)
                const entity: Entity = session.getWorld().getEntityById(moveInfo.entityId);
                // session.c.log(JSON.stringify(EntityMoveInfo.toJSON(moveInfo)))

                // if (entity!) {
                //     break;
                // }
                if (moveInfo.motionInfo?.pos === null) {
                    break;
                }
                if (moveInfo.motionInfo?.state === MotionState.MOTION_STATE_STANDBY) {
                    
                    try{
                        //@ts-ignore
                        entity.state = MotionState.MOTION_STATE_STANDBY
                    }catch{
                        //ignored
                    }
                    
                    break;
                }

                // if (moveInfo.motionInfo !== null){
                //     entity.state = moveInfo.motionInfo!.state
                // }else{
                //     entity.state = MotionState.MOTION_STATE_NONE
                // }

                let rotation = moveInfo.motionInfo?.rot

                if(rotation === null){
                    rotation = Vector.fromPartial({x:0,y:0,z:0})
                }

                entity.rotation = rotation!;
                
                let speed = moveInfo.motionInfo?.speed

                if(speed === null){
                    speed = Vector.fromPartial({x:0,y:0,z:0})
                }


                entity.speed = speed!;

                let pos = moveInfo.motionInfo?.pos
                
                entity.motion = pos!

                if(entity.category = EntityCategory.Avatar){
                    session.getPlayer().position = pos!
                }

                break;
        }
    }

    session.send(CombatInvocationsNotify,body)
}
