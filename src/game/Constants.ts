import { Vector } from '../data/proto/game';

export class GameConstants {
  public static MAIN_CHARACTER_MALE = 10000005;
  public static MAIN_CHARACTER_FEMALE = 10000007;

  public static START_POSITION: Vector = Vector.fromPartial({
    x: 2747,
    y: 194,
    z: -1719,
  });

  public static SERVER_CONSOLE_UID = 99;

  public static DEFAULT_ABILITY_STRINGS = [
    'Avatar_DefaultAbility_VisionReplaceDieInvincible',
    'Avatar_DefaultAbility_AvartarInShaderChange',
    'Avatar_SprintBS_Invincible',
    'Avatar_Freeze_Duration_Reducer',
    'Avatar_Attack_ReviveEnergy',
    'Avatar_Component_Initializer',
    'Avatar_FallAnthem_Achievement_Listener',
  ];

  public static DEFAULT_ABILITY_NAME = 'Default';
}
