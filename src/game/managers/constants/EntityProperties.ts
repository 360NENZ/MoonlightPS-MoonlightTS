import { PropPair, PropValue } from '../../../data/proto/game';

export enum EntityProperties {
  PROP_EXP = 1001,
  PROP_BREAK_LEVEL = 1002,
  PROP_SATIATION_VAL = 1003,
  PROP_SATIATION_PENALTY_TIME = 1004,
  PROP_LEVEL = 4001,
}

export class EntityProperty {
  private static entityProp: { [type: number]: PropValue } = {};
  private static entityPropPair: PropPair[] = [];

  public static init() {
    this.entityProp[EntityProperties.PROP_LEVEL] = PropValue.fromPartial({
      val: 90,
      ival: 90,
      type: EntityProperties.PROP_LEVEL
    });
    this.entityProp[EntityProperties.PROP_EXP] = PropValue.fromPartial({
      val: 0,
      ival: 0,
      type: EntityProperties.PROP_EXP
    });
    this.entityProp[EntityProperties.PROP_BREAK_LEVEL] = PropValue.fromPartial({
      val: 6,
      ival: 6,
      type: EntityProperties.PROP_BREAK_LEVEL
    });
    this.entityProp[EntityProperties.PROP_SATIATION_PENALTY_TIME] =
      PropValue.fromPartial({ val: 0, ival: 0 , type: EntityProperties.PROP_SATIATION_PENALTY_TIME});
    this.entityProp[EntityProperties.PROP_SATIATION_VAL] =
      PropValue.fromPartial({ val: 0, ival: 0 , type: EntityProperties.PROP_SATIATION_VAL});

    for (let val of Object.keys(this.entityProp)) {
      this.entityPropPair.push(
        PropPair.fromPartial({
          type: Number(val),
          propValue: this.entityProp[Number(val)],
        })
      );
    }
  }

  public static getEntityProp() {
    return this.entityProp;
  }

  public static getEntityPropPair() {
    return this.entityPropPair;
  }
}
