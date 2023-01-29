import { Request, Response } from 'express';
import Config from '../../../utils/Config';
import Logger, { VerboseLevel } from '../../../utils/Logger';
import { WindyUtils } from '../../../utils/Utils';
const c = new Logger('crash/dataUpload', 'green');

export default function handle(req: Request, res: Response) {
  try {
    const content = req.body[0].uploadContent;
    if (Config.VERBOSE_LEVEL >= VerboseLevel.ALL) {
      c.log(content);
      WindyUtils.compileWindyAndSend(`CS.MoleMole.ActorUtils.ShowMessage("${content.logType}: ${content.message}")`);
    }
  } catch {}
  res.send({ code: 0 });
}
