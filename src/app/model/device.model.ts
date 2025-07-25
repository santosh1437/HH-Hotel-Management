export class Devices {
    id: number;
    lockId: number;
    lockName: string;
    lockAlias: string;

    constructor(device: Partial<Devices>){
        this.id = device.id || this.getRandomID();
        this.lockId = device.lockId || this.getRandomID();
        this.lockName = device.lockName || '';
        this.lockAlias = device.lockAlias || '';
    }

    public getRandomID(): number {
    const S4 = () => {
      return ((1 + Math.random()) * 0x10000) | 0;
    };
    return S4() + S4();
  }
}