import { ActivityInfo, ActivityScheduleInfo } from '../../../data/proto/game';
import { DefaultLoader } from '../DefaultLoader';

export class ActivityLoader extends DefaultLoader {
  public activityIds: number[] = [];
  public scheduleActivities: ActivityScheduleInfo[] = [];
  public activities: ActivityInfo[] = [];

  constructor() {
    super('ActivityConfig', [
      {
        activityId: 5104,
        activityType: 2208,
        scheduleId: 5072001,
      },
    ]);
  }

  private checkReload() {
    if (this.activityIds.length != 0) {
      this.activities = [];
      this.activityIds = [];
      this.scheduleActivities = [];
    }
  }

  async onPostLoad(): Promise<void> {
    const data = await this.getData();

    this.checkReload();

    for (let i = 0; i < data.length; i++) {
      this.activities.push(
        ActivityInfo.fromPartial({
          scheduleId: data[i].scheduleId,
          activityId: data[i].activityId,
          activityType: data[i].activityType,
          beginTime: Date.now() / 1000,
          endTime: (Date.now() * 2) / 1000,
        })
      );

      this.scheduleActivities.push(
        ActivityScheduleInfo.fromPartial({
          scheduleId: data[i].scheduleId,
          activityId: data[i].activityId,
          isOpen: true,
          beginTime: Date.now() / 1000,
          endTime: (Date.now() * 2) / 1000,
        })
      );

      this.activityIds.push(data[i].activityId);
    }
    this.c.log(`Loaded ${data.length} activities!`);
  }

  getInstance() {
      return this;
  }
}
