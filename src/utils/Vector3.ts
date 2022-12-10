import { Vector } from '../data/proto/game';

export class Vector3 {
    private x: number;
    private y: number;
    private z: number;

    constructor(x: number, y: number, z: number){
        this.x = x,
        this.y = y,
        this.z = z
    }

    public static fromProto(buf: Buffer){
        return new this(Vector.decode(buf).x,Vector.decode(buf).y,Vector.decode(buf).z)
    }

    public getX(){
        return this.x;
    }

    public getY(){
        return this.y;
    }

    public getZ(){
        return this.z;
    }

    public compare(vector: Vector3){
        return (this.x === vector.x && this.y === vector.y && this.z === vector.z);
    }

    public toProto(){
        return Vector.encode(Vector.fromPartial({
            x: this.x,
            y: this.y,
            z: this.z
        })).finish()
    }

    public setX(x: number){
        this.x = x
    }

    public setY(y: number){
        this.y = y
    }

    public setZ(z: number){
        this.z = z
    }
}