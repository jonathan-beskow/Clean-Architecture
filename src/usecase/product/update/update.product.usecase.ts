import ProductRepositoryInterface from "../../../domain/product/repository/product-repository.interface";
import {InputUpdateProductDto, OutputUpdateProductDto} from "./update.product.dto";
import Product from "../../../domain/product/entity/product";

export default class UpdateProductUsecase {
  private productRepository: ProductRepositoryInterface;
  constructor(productRepository: ProductRepositoryInterface) {
    this.productRepository = productRepository;
  }

  async execute(
    input: InputUpdateProductDto
  ): Promise<OutputUpdateProductDto> {
    const productInterface = await this.productRepository.find(input.id);

    const product = new Product(
        productInterface.id,
        input.name,
        input.price,
    );
    await this.productRepository.update(product);

    return {
      id: product.id,
      name: product.name,
      price: product.price,
    };
  }
}
