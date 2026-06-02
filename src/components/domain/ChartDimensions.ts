import type { ColorKey, StatOption } from '../types';

export class ChartDimensions {
  public readonly x: string;
  public readonly y: string;
  public readonly color: ColorKey;
  public readonly xLog: boolean;
  public readonly yLog: boolean;

  constructor(x: string, y: string, color: ColorKey, xLog: boolean = false, yLog: boolean = false) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.xLog = xLog;
    this.yLog = yLog;
  }

  public isValid(availableStats: StatOption[]): boolean {
    const ids = new Set(availableStats.map(opt => opt.id));
    return ids.has(this.x) && ids.has(this.y);
  }

  public withX(newX: string): ChartDimensions {
    return new ChartDimensions(newX, this.y, this.color, this.xLog, this.yLog);
  }

  public withY(newY: string): ChartDimensions {
    return new ChartDimensions(this.x, newY, this.color, this.xLog, this.yLog);
  }

  public withColor(newColor: ColorKey): ChartDimensions {
    return new ChartDimensions(this.x, this.y, newColor, this.xLog, this.yLog);
  }

  public withXLog(newXLog: boolean): ChartDimensions {
    return new ChartDimensions(this.x, this.y, this.color, newXLog, this.yLog);
  }

  public withYLog(newYLog: boolean): ChartDimensions {
    return new ChartDimensions(this.x, this.y, this.color, this.xLog, newYLog);
  }
}
