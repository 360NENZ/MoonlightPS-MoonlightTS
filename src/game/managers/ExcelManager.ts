import { readFileSync } from 'fs';
import Logger from '../../utils/Logger';
import { Material } from './Types/material';

import { resolve } from 'path';

function r(...args: string[]) {
  return readFileSync(resolve(__dirname, ...args)).toString();
}

const c = new Logger('ExcelManager', 'green');

export class ExcelManager {
  public static materials: Material[] = [];

  static init() {
    this.initMaterialExcel();
  }

  private static initMaterialExcel() {
    const _materials: [{ id: number; stackLimit: number; itemType: string }] =
      JSON.parse(r('../../data/resources/ExcelBinOutput/MaterialExcelConfigData.json'));
    _materials.forEach((element) => {
      if (element.itemType === 'ITEM_MATERIAL') {
        this.materials.push(new Material(element.id, element.stackLimit));
      }
    });
    c.log('Successfuly loaded MaterialExcelConfigData.json');
  }
}
