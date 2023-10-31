import Notification from "../notification/notification";

export default abstract class Entity {

    protected _id: string;
    public notification: Notification;

    get id(): string {
        return this._id
    }

    constructor() {
        this.notification = new Notification();
    }
}