import EventHandlerInterface from "../../../@shared/event-handler.interface";
import CustomerAddressChanged from "../customer-address-changed";

export default class PrintConsoleLogWhenCustomerAddressHasChanged implements EventHandlerInterface<CustomerAddressChanged> {
    handle(event: CustomerAddressChanged) {
        console.log(`Endereço do cliente: ${event.eventData.id}, ${event.eventData.name} alterado para: Street: ${event.eventData.address.street} Number: ${event.eventData.address.number} Zip: ${event.eventData.address.zip} City: ${event.eventData.address.city}`)
    }
}