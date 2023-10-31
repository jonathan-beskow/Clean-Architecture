import ProductRepositoryInterface from "../../../domain/product/repository/product-repository.interface";
import { InputUpdateProductDto, OutputUpdateProductDto } from "./update.product.dto";

export default class UpdateProductUseCase {

    private productRepository: ProductRepositoryInterface

    constructor(productRepository: ProductRepositoryInterface) {
        this.productRepository = productRepository
    }

    async execute(input: InputUpdateProductDto): Promise<OutputUpdateProductDto> {

        const product = await this.productRepository.find(input.id)

        if (product == null) {
            throw new Error("Product not found!")
        }

        product.changeName(input.name);
        product.changePrice(input.price);

        return {
            id: product.id,
            name: product.name,
            price: product.price
        }
    }
}