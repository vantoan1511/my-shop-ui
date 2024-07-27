interface IProduct {
    id: number;
    title: string;
    image?: string;
    grossPrice?: number;
    netPrice?: number;
}

export class Product implements IProduct {
    readonly id: number;
    readonly title: string;
    readonly image: string;
    readonly grossPrice: number;
    readonly netPrice: number;

    constructor({id, title, image = 'assets/images/product-01__01.jpg', grossPrice = 0, netPrice = 0}: IProduct) {
        this.id = id;
        this.title = title;
        this.image = image;
        this.grossPrice = grossPrice;
        this.netPrice = netPrice;
    }
}
