import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import ListProductUsecase from "./list.product.usecase";
import ProductFactory from "../../../domain/product/factory/product.factory";

describe("Test list products use case", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should list a products", async () => {
    const productRepository = new ProductRepository();
    const usecase = new ListProductUsecase(productRepository);

    const productInterfaceA = ProductFactory.create("a", "product A", 15);
    const productInterfaceB = ProductFactory.create("b", "product B", 10);

    await productRepository.create(productInterfaceA);
    await productRepository.create(productInterfaceB);

    const result = await usecase.execute({});

    expect(result).toEqual({"products": [
      {
        id: productInterfaceA.id,
        name: productInterfaceA.name,
        price: productInterfaceA.price,
      },
      {
        id: productInterfaceB.id,
        name: productInterfaceB.name,
        price: productInterfaceB.price,
      }
    ]});
  });
});
