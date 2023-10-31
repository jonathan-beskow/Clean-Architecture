import { Sequelize } from "sequelize-typescript";
import OrderRepository from "./order.repository";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import ProductModel from "../../../product/repository/sequelize/product.model";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import Product from "../../../../domain/product/entity/product";
import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";


describe("Order repository test", () => {

    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });
        sequelize.addModels([CustomerModel, OrderModel, OrderItemModel, ProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should create a new order", async () => {

        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 10);
        await productRepository.create(product);

        const orderItem = new OrderItem("1", product.name, product.price, product.id, 2);

        const order = new Order("123", "123", [orderItem]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order)

        const orderModel = await OrderModel.findOne({ where: { id: order.id }, include: ["items"] });

        expect(orderModel.toJSON()).toStrictEqual({
            id: "123",
            customer_id: "123",
            total: order.total(),
            items: [
                {
                    id: orderItem.id,
                    name: orderItem.name,
                    quantity: orderItem.quantity,
                    order_id: "123",
                    price: 10,
                    product_id: "123"
                }]
        });
    });

    it("should update a order", async () => {

        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product1 = new Product("123", "Product 1", 10);
        const product2 = new Product("124", "Product 2", 5);
        await productRepository.create(product1);
        await productRepository.create(product2);

        const orderItem1 = new OrderItem("1", product1.name, product1.price, product1.id, 2);
        const orderItem2 = new OrderItem("2", product2.name, product2.price, product2.id, 3);

        const order = new Order("123", "123", [orderItem1, orderItem2]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const orderModel = await OrderModel.findOne({ where: { id: order.id }, include: ["items"] });

        expect(orderModel.toJSON()).toStrictEqual({
            id: "123",
            total: order.total(),
            customer_id: "123",
            items: [
                {
                    id: orderItem1.id,
                    name: orderItem1.name,
                    quantity: orderItem1.quantity,
                    order_id: "123",
                    price: 10,
                    product_id: "123"
                },
                {
                    id: orderItem2.id,
                    name: orderItem2.name,
                    quantity: orderItem2.quantity,
                    order_id: "123",
                    price: 5,
                    product_id: "124"
                },
            ]
        });

        const product3 = new Product("125", "Product 3", 7);
        await productRepository.create(product3);

        const orderItem3 = new OrderItem("3", product3.name, product3.price, product3.id, 5)

        order.items.push(orderItem3);

        await orderRepository.update(order)

        const orderModelUpdated = await OrderModel.findOne({
            where: { id: order.id },
            include: ['items'],
        })

        expect(orderModelUpdated.toJSON()).toStrictEqual({
            id: order.id,
            customer_id: customer.id,
            total: order.total(),
            items: order.items.map((orderItem) => ({
                id: orderItem.id,
                name: orderItem.name,
                price: orderItem.price,
                quantity: orderItem.quantity,
                order_id: order.id,
                product_id: orderItem.productId,
            })),
        })
    })

    it("should find a order", async () => {

        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product1 = new Product("123", "Product 1", 10);
        const product2 = new Product("124", "Product 2", 5);
        await productRepository.create(product1);
        await productRepository.create(product2);

        const orderItem1 = new OrderItem("1", product1.name, product1.price, product1.id, 2);
        const orderItem2 = new OrderItem("2", product2.name, product2.price, product2.id, 3);

        const order = new Order("123", "123", [orderItem1, orderItem2]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const orderModel = await OrderModel.findOne({ where: { id: order.id }, include: ["items"] })

        const foundOrder = await orderRepository.find("123");

        expect(orderModel.toJSON()).toStrictEqual({
            id: foundOrder.id,
            customer_id: foundOrder.customerId,
            total: foundOrder.total(),
            items: [
                {
                    id: orderItem1.id,
                    name: orderItem1.name,
                    quantity: orderItem1.quantity,
                    order_id: foundOrder.id,
                    price: 10,
                    product_id: "123"
                }, {
                    id: orderItem2.id,
                    name: orderItem2.name,
                    quantity: orderItem2.quantity,
                    order_id: foundOrder.id,
                    price: 5,
                    product_id: "124"
                }]
        });
    })

    it("should find all orders", async () => {

        const customerRepository = new CustomerRepository();
        const customer1 = new Customer("123", "Customer 1");
        const address1 = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer1.changeAddress(address1);
        await customerRepository.create(customer1);

        const productRepository = new ProductRepository();
        const product1 = new Product("123", "Product 1", 10);
        await productRepository.create(product1);

        const orderItem1 = new OrderItem("1", product1.name, product1.price, product1.id, 2);

        const order1 = new Order("123", "123", [orderItem1]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order1);

        const customer2 = new Customer("124", "Customer 2");
        const address2 = new Address("Street 2", 2, "Zipcode 2", "City 2");
        customer2.changeAddress(address2);
        await customerRepository.create(customer2);

        const product2 = new Product("124", "Product 2", 5);
        await productRepository.create(product2);

        const orderItem2 = new OrderItem("2", product2.name, product2.price, product2.id, 3);

        const order2 = new Order("124", "124", [orderItem2]);

        await orderRepository.create(order2);

        const foundOrders = await orderRepository.findAll();
        const orders = [order1, order2];

        expect(orders).toEqual(foundOrders);
    })
})