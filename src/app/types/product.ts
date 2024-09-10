interface IProduct {
    id: number;
    title: string;
    mainImage?: string;
    thumbnails?: string[];
    originalPrice?: number;
    discountedPrice?: number;

    rating?: number;
    votes?: number;
    sold?: number;
}

export class Product implements IProduct {
    readonly id: number;
    readonly title: string;
    readonly mainImage: string;
    readonly thumbnails: string[];
    readonly originalPrice: number;
    readonly discountedPrice: number;
    readonly rating: number;
    readonly votes: number;
    readonly sold: number;

    constructor({
                    id,
                    title,
                    mainImage = '/images/product-01__01.jpg',
                    thumbnails = [
                        mainImage,
                        '/images/product-01__02.jpg',
                        '/images/product-01__03.jpg',
                        '/images/product-01__04.jpg',
                    ],
                    originalPrice = 0,
                    discountedPrice = 0,
                    rating = 0,
                    votes = 0,
                    sold = 0,
                }: IProduct) {
        this.id = id;
        this.title = title;
        this.mainImage = mainImage;
        this.thumbnails = thumbnails;
        this.originalPrice = originalPrice;
        this.discountedPrice = discountedPrice;
        this.rating = rating;
        this.votes = votes;
        this.sold = sold;
    }

    get discountedPercentage(): number {
        return this.discountedPrice * 100 / this.originalPrice;
    }
}
