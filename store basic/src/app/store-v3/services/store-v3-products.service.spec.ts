import { TestBed } from "@angular/core/testing";
import {
    HttpClientTestingModule,
    HttpTestingController,
} from "@angular/common/http/testing";
import { StoreV3ProductsService } from "./store-v3-products.service";
import { STORE_V3_PRODUCTS_URL } from "../tokens/store-v3.tokens";

describe("StoreV3ProductsService", () => {
    let httpMock: HttpTestingController;
    let service: StoreV3ProductsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                StoreV3ProductsService,
                {
                    provide: STORE_V3_PRODUCTS_URL,
                    useValue: "/assets/test.json",
                },
            ],
        });

        httpMock = TestBed.inject(HttpTestingController);
        service = TestBed.inject(StoreV3ProductsService);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it("loads products from configured URL", (done) => {
        service.getProducts().subscribe((products) => {
            expect(products.length).toBe(1);
            expect(products[0].id).toBe(1);
            done();
        });

        const req = httpMock.expectOne("/assets/test.json");
        expect(req.request.method).toBe("GET");

        req.flush([
            {
                id: 1,
                name: "P",
                description: "D",
                price: 10,
                category: "phone",
                inStock: 1,
                rating: 4,
                isFeatured: false,
                tags: [],
            },
        ]);
    });
});
