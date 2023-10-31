import EventDispatcher from "./event-dispatcher";
import SendEmailWhenProductIsCreatedHandler from "../product/event/handler/send-email-when-product-id-created.handler";
import ProductCreatedEvent from "../product/event/product-created.event";
import PrintConsoleLogWhenCustomerCreatedHandler
    from "../customer/event/handler/print-console-log-when-customer-created.handler";
import PrintOtherConsoleLogWhenCustomerCreatedHandler
    from "../customer/event/handler/print-other-console-log-when-customer-created.handler";
import CustomerCreatedEvent from "../customer/event/customer-created.event";
import PrintConsoleLogWhenCustomerAddressHasChanged
    from "../customer/event/handler/print-console-log-when-customer-address-has-changed";
import CustomerAddressChanged from "../customer/event/customer-address-changed";

describe("Domain events tests", () => {
    describe("Product events test", () => {
        it("should register an event handler", () => {
            const eventDispatcher = new EventDispatcher();
            const eventHandler = new SendEmailWhenProductIsCreatedHandler();

            eventDispatcher.register("ProductCreatedEvent", eventHandler);

            expect(eventDispatcher.getEventHandlers.ProductCreatedEvent).toBeDefined();
            expect(eventDispatcher.getEventHandlers.ProductCreatedEvent.length).toBe(1);
            expect(eventDispatcher.getEventHandlers.ProductCreatedEvent[0]).toMatchObject(eventHandler);
        });

        it("should unregister an event handler", () => {
            const eventDispatcher = new EventDispatcher();
            const eventHandler = new SendEmailWhenProductIsCreatedHandler();

            eventDispatcher.register("ProductCreatedEvent", eventHandler);

            expect(eventDispatcher.getEventHandlers.ProductCreatedEvent[0]).toMatchObject(eventHandler);

            eventDispatcher.unregister("ProductCreatedEvent", eventHandler);

            expect(eventDispatcher.getEventHandlers.ProductCreatedEvent).toBeDefined();
            expect(eventDispatcher.getEventHandlers.ProductCreatedEvent.length).toBe(0);
        });

        it("should unregister all event handlers", () => {
            const eventDispatcher = new EventDispatcher();
            const eventHandler = new SendEmailWhenProductIsCreatedHandler();

            eventDispatcher.register("ProductCreatedEvent", eventHandler);

            expect(eventDispatcher.getEventHandlers.ProductCreatedEvent[0]).toMatchObject(eventHandler);

            eventDispatcher.unregisterAll();

            expect(eventDispatcher.getEventHandlers.ProductCreatedEvent).toBeUndefined();
        });

        it("should notify all event handlers", () => {
            const eventDispatcher = new EventDispatcher();
            const eventHandler = new SendEmailWhenProductIsCreatedHandler();
            const spyEventHandler = jest.spyOn(eventHandler, "handle");

            eventDispatcher.register("ProductCreatedEvent", eventHandler);

            expect(eventDispatcher.getEventHandlers.ProductCreatedEvent[0]).toMatchObject(eventHandler);

            const productCreatedEvent = new ProductCreatedEvent({
                name: "Product 1",
                description: "Product 1 description",
                price: 10.0,
            });

            // Quando o notify for executado o SendEmailWhenProductIsCreatedHandler.handle() deve ser chamado
            eventDispatcher.notify(productCreatedEvent);
            expect(spyEventHandler).toHaveBeenCalled();
        });
    });

    describe("Customer created events test", () => {
        it("should register an event handler", () => {
            const eventDispatcher = new EventDispatcher();
            const eventHandler1 = new PrintConsoleLogWhenCustomerCreatedHandler();
            const eventHandler2 = new PrintOtherConsoleLogWhenCustomerCreatedHandler();

            eventDispatcher.register("CustomerCreatedEvent", eventHandler1);
            eventDispatcher.register("CustomerCreatedEvent", eventHandler2);

            expect(eventDispatcher.getEventHandlers.CustomerCreatedEvent).toBeDefined();
            expect(eventDispatcher.getEventHandlers.CustomerCreatedEvent.length).toBe(2);
            expect(eventDispatcher.getEventHandlers.CustomerCreatedEvent[0]).toMatchObject(eventHandler1);
            expect(eventDispatcher.getEventHandlers.CustomerCreatedEvent[1]).toMatchObject(eventHandler2);
        });

        it("should unregister an event handler", () => {
            const eventDispatcher = new EventDispatcher();
            const eventHandler1 = new PrintConsoleLogWhenCustomerCreatedHandler();
            const eventHandler2 = new PrintOtherConsoleLogWhenCustomerCreatedHandler();

            eventDispatcher.register("CustomerCreatedEvent", eventHandler1);
            eventDispatcher.register("CustomerCreatedEvent", eventHandler2);

            expect(eventDispatcher.getEventHandlers.CustomerCreatedEvent.length).toBe(2);
            expect(eventDispatcher.getEventHandlers.CustomerCreatedEvent[0]).toMatchObject(eventHandler1);
            expect(eventDispatcher.getEventHandlers.CustomerCreatedEvent[1]).toMatchObject(eventHandler2);

            eventDispatcher.unregister("CustomerCreatedEvent", eventHandler2);

            expect(eventDispatcher.getEventHandlers.CustomerCreatedEvent).toBeDefined();
            expect(eventDispatcher.getEventHandlers.CustomerCreatedEvent.length).toBe(1);
            expect(eventDispatcher.getEventHandlers.CustomerCreatedEvent[0]).toMatchObject(eventHandler1);
        });

        it("should unregister all event handlers", () => {
            const eventDispatcher = new EventDispatcher();
            const eventHandler1 = new PrintConsoleLogWhenCustomerCreatedHandler();
            const eventHandler2 = new PrintOtherConsoleLogWhenCustomerCreatedHandler();

            eventDispatcher.register("CustomerCreatedEvent", eventHandler1);
            eventDispatcher.register("CustomerCreatedEvent", eventHandler2);

            expect(eventDispatcher.getEventHandlers.CustomerCreatedEvent.length).toBe(2);
            expect(eventDispatcher.getEventHandlers.CustomerCreatedEvent[0]).toMatchObject(eventHandler1);
            expect(eventDispatcher.getEventHandlers.CustomerCreatedEvent[1]).toMatchObject(eventHandler2);

            eventDispatcher.unregisterAll();

            expect(eventDispatcher.getEventHandlers.CustomerCreatedEvent).toBeUndefined();
        });

        it("should notify all event handlers", () => {
            const eventDispatcher = new EventDispatcher();
            const eventHandler1 = new PrintConsoleLogWhenCustomerCreatedHandler();
            const eventHandler2 = new PrintOtherConsoleLogWhenCustomerCreatedHandler();

            const spyEventHandler1 = jest.spyOn(eventHandler1, "handle");
            const spyEventHandler2 = jest.spyOn(eventHandler2, "handle");

            eventDispatcher.register("CustomerCreatedEvent", eventHandler1);
            eventDispatcher.register("CustomerCreatedEvent", eventHandler2);

            expect(eventDispatcher.getEventHandlers.CustomerCreatedEvent[0]).toMatchObject(eventHandler1);
            expect(eventDispatcher.getEventHandlers.CustomerCreatedEvent[1]).toMatchObject(eventHandler2);

            const customerCreatedEvent = new CustomerCreatedEvent({
                id: "123",
                name: "Customer 1",
                active: false,
                address: {
                    street: "Street 1",
                    number: 1,
                    zip: "12345-000",
                    city: "City"
                },
            });

            eventDispatcher.notify(customerCreatedEvent);
            expect(spyEventHandler1).toHaveBeenCalled();
            expect(spyEventHandler2).toHaveBeenCalled();


        });
    });

    describe("Customer address changed events test", () => {
        it("should register an event handler", () => {
            const eventDispatcher = new EventDispatcher();
            const eventHandler = new PrintConsoleLogWhenCustomerAddressHasChanged();

            eventDispatcher.register("CustomerAddressChanged", eventHandler);

            expect(eventDispatcher.getEventHandlers.CustomerAddressChanged).toBeDefined();
            expect(eventDispatcher.getEventHandlers.CustomerAddressChanged.length).toBe(1);
            expect(eventDispatcher.getEventHandlers.CustomerAddressChanged[0]).toMatchObject(eventHandler);
        });

        it("should unregister an event handler", () => {
            const eventDispatcher = new EventDispatcher();
            const eventHandler = new PrintConsoleLogWhenCustomerAddressHasChanged();

            eventDispatcher.register("CustomerAddressChanged", eventHandler);

            expect(eventDispatcher.getEventHandlers.CustomerAddressChanged.length).toBe(1);
            expect(eventDispatcher.getEventHandlers.CustomerAddressChanged[0]).toMatchObject(eventHandler);

            eventDispatcher.unregister("CustomerAddressChanged", eventHandler);

            expect(eventDispatcher.getEventHandlers.CustomerAddressChanged).toBeDefined();
            expect(eventDispatcher.getEventHandlers.CustomerAddressChanged.length).toBe(0);
        });

        it("should unregister all event handlers", () => {
            const eventDispatcher = new EventDispatcher();
            const eventHandler = new PrintConsoleLogWhenCustomerAddressHasChanged();

            eventDispatcher.register("CustomerAddressChanged", eventHandler);

            expect(eventDispatcher.getEventHandlers.CustomerAddressChanged.length).toBe(1);
            expect(eventDispatcher.getEventHandlers.CustomerAddressChanged[0]).toMatchObject(eventHandler);

            eventDispatcher.unregisterAll();

            expect(eventDispatcher.getEventHandlers.CustomerAddressChanged).toBeUndefined();
        });

        it("should notify all event handlers", () => {
            const eventDispatcher = new EventDispatcher();
            const eventHandler = new PrintConsoleLogWhenCustomerAddressHasChanged();

            const spyEventHandler = jest.spyOn(eventHandler, "handle");

            eventDispatcher.register("CustomerAddressChanged", eventHandler);

            expect(eventDispatcher.getEventHandlers.CustomerAddressChanged[0]).toMatchObject(eventHandler);

            const customerAddressChangedEvent = new CustomerAddressChanged({
                id: "123",
                name: "Customer 1",
                active: false,
                address: {
                    street: "Street 1",
                    number: 1,
                    zip: "12345-000",
                    city: "City"
                },
            });

            eventDispatcher.notify(customerAddressChangedEvent);
            expect(spyEventHandler).toHaveBeenCalled();


        });
    });
});