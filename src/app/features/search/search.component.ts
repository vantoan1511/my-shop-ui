import {Component, OnInit} from '@angular/core';
import {CurrencyPipe} from "@angular/common";
import {constant} from "../../shared/constant";
import {TranslateModule} from "@ngx-translate/core";
import {ProductCardComponent} from "../../components/product-card/product-card.component";
import {PagedResponse} from "../../types/response.type";
import {Brand, Category} from "../../types/product.type";
import {BrandService} from "../../services/brand.service";
import {CategoryService} from "../../services/category.service";

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CurrencyPipe,
    TranslateModule,
    ProductCardComponent
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements OnInit {

  selectedTags: { name: string, slug: string }[] = [];
  pagedBrand: PagedResponse<Brand> | null = null;
  pagedCategory: PagedResponse<Category> | null = null;
  brands: Brand[] = []
  categories: Category[] = []

  constructor(
    private brandService: BrandService,
    private categoryService: CategoryService,
  ) {
  }

  ngOnInit(): void {
    this.fetchBrands()
    this.fetchCategories()
  }

  fetchBrands() {
    this.brandService.getBy({page: 1, size: 20}).subscribe((response) => {
      this.pagedBrand = response;
      this.brands = response.items;
    })
  }

  fetchCategories() {
    this.categoryService.getBy({page: 1, size: 20}).subscribe((response) => {
      this.pagedCategory = response;
      this.categories = response.items;
    })
  }

  removeTag(slug: string) {
    this.selectedTags = this.selectedTags.filter(tag => tag.slug !== slug);
  }

  removeAllTags() {
    this.selectedTags = []
  }

  addTag(newTag: { name: string, slug: string }): void {
    if (!this.isSelectedTag(newTag)) {
      this.selectedTags.push(newTag);
    }
  }

  isSelectedTag(tag: { name: string, slug: string }) {
    return this.selectedTags.some(selectedTag => selectedTag.slug === tag.slug)
  }

  protected readonly Array = Array;
  protected readonly constant = constant;
}
