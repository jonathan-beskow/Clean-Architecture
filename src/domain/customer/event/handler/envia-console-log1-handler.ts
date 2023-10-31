
import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import EventInterface from "../../../@shared/event/event.interface";
import CustomerCreatedEvent from "../customer-created.event";

export default class EnviaConsoleLog1Handler implements EventHandlerInterface<CustomerCreatedEvent> {

    handle(event: EventInterface): void {
        console.log("Esse é o primeiro console.log do evento: CustomerCreated")
    }
    
}