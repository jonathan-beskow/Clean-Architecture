import Order from "../../../../domain/checkout/entity/order";
import OrderModel from "./order.model";
import OrderItemModel from "./order-item.model";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository.interface";
import OrderItem from "../../../../domain/checkout/entity/order_item";

export default class OrderRepository implements OrderRepositoryInterface{
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

    async find(id: string): Promise<Order> {
        const order = await OrderModel.findOne({
            where: { id },
            include: ["items"],
        });

        return new Order(
            order.id,
            order.customer_id,
            order.items.map(item => {
                return new OrderItem(
                    item.id,
                    item.name,
                    (item.price/item.quantity),
                    item.product_id,
                    item.quantity,
                )
            })
        )
    }

    async findAll(): Promise<Order[]> {
        const orders = await OrderModel.findAll({
            include: ["items"],
        });

        return orders.map(order =>
            new Order(
                order.id,
                order.customer_id,
                order.items.map(item => {
                    return new OrderItem(
                        item.id,
                        item.name,
                        (item.price/item.quantity),
                        item.product_id,
                        item.quantity,
                    )
                })
            )
        );
    }

    async update(entity: Order): Promise<void> {
        const order = await OrderModel.findOne(
            {
                where: { id: entity.id },
                include: ["items"]
            }
        )

        await Promise.all([
            order.items.map(async item => {
                await OrderItemModel.destroy({
                    where: {id: item.id}
                })
            }),
            entity.items.map(async item => {
                await OrderItemModel.create({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    product_id: item.productId,
                    order_id: entity.id
                })
            })
        ]);

        await OrderModel.update(
            {
                customer_id: entity.customerId,
                total: entity.total()
            },
            {
                where: { id: entity.id }
            }
        )
    }
}
