import {
  AvatarInfo,
  AvatarTeam,
  AvatarTeamUpdateNotify,
  MotionState,
  SceneTeamAvatar,
  SceneTeamUpdateNotify,
  Vector,
  VisionType,
} from '../../data/proto/game';
import { Session } from '../../kcp/session';
import { Avatar } from '../entity/avatar';
import { EntityProperty } from './constants/EntityProperties';
import { ExcelManager } from './ExcelManager';

export class AvatarManager {
  public avatars: Avatar[] = [];
  public teams: { [key: number]: number[] } = [];
  public session: Session;

  public curTeamIndex = 1;
  public curAvatarGuid = 0;

  constructor(session: Session) {
    this.session = session;

    const avatarList = ExcelManager.avatars;
    for (let avatar of Object.values(avatarList)) {
      avatar.guid = session.getWorld().getNextGuid();
      this.avatars.push(
        new Avatar(
          session.getWorld(),
          avatar,
          Vector.fromPartial({ x: 0, y: 0, z: 0 })
        )
      );
    }

    const traveller = this.getAvatarById(10000007)!.avatarInfo;

    this.teams = {
      1: [traveller.guid],
      2: [],
      3: [],
      4: [],
    };

    this.curAvatarGuid = traveller.guid;
  }

  getAvatarInfoList(): AvatarInfo[] {
    const avatarList: AvatarInfo[] = [];
    this.avatars.forEach((e) => {
      avatarList.push(e.avatarInfo);
    });
    return avatarList;
  }

  setTeam(index: number, avatars: number[], requestTeamChange = true) {
    this.teams[index] = avatars;
    if (requestTeamChange) {
      this.updateTeam();
    }
  }

  updateTeam() {
    const curTeam = this.getTeam(this.curTeamIndex);

    const teamList: SceneTeamAvatar[] = [];

    curTeam.forEach((e) => {
      teamList.push(this.getAvatarByGuid(e)!.getSceneTeamAvatar());
    });

    const sceneTeamUpdate: SceneTeamUpdateNotify =
      SceneTeamUpdateNotify.fromPartial({
        sceneTeamAvatarList: teamList,
      });

    this.session.send(
      AvatarTeamUpdateNotify,
      AvatarTeamUpdateNotify.fromPartial({
        avatarTeamMap: this.getTeamMap(),
      })
    );

    this.session.send(SceneTeamUpdateNotify, sceneTeamUpdate);
  }

  getTeamMap() {
    const teamMap: { [key: number]: AvatarTeam } = [];
    for (let i = 1; i < 5; i++) {
      teamMap[i] = AvatarTeam.fromPartial({
        avatarGuidList: this.getTeam(i),
        teamName: 'MoonlightTS!',
      });
    }
    return teamMap;
  }

  getAvatarByGuid(guid: number): Avatar | null {
    for (let avatar of this.avatars) {
      if (avatar.avatarInfo.guid === guid) {
        return avatar;
      }
    }
    return null;
  }

  getAvatarById(avatarId: number): Avatar | null {
    for (let avatar of this.avatars) {
      if (avatar.avatarInfo.avatarId === avatarId) {
        return avatar;
      }
    }
    return null;
  }

  getTeam(index: number): number[] {
    return this.teams[index];
  }

  setCurAvatarGuid(curAvatarGuid: number) {
    const old_avatar = this.getAvatarByGuid(this.curAvatarGuid);
    const new_avatar = this.getAvatarByGuid(curAvatarGuid);

    new_avatar!.state = old_avatar!.state;
    new_avatar!.motion = old_avatar!.motion;
    new_avatar!.rotation = old_avatar!.rotation;
    new_avatar!.speed = old_avatar!.speed;

    old_avatar!.state = MotionState.MOTION_STATE_STANDBY;

    this.session
      .getWorld()
      .killEntity(old_avatar!, VisionType.VISION_TYPE_REPLACE);

    this.curAvatarGuid = curAvatarGuid;

    this.session
      .getWorld()
      .addEntity(new_avatar!, VisionType.VISION_TYPE_REPLACE);
  }
}
