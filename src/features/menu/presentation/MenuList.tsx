import type { Category } from "../domain/category";
import type { Product } from "../domain/product";

interface MenuListProps {
  categories: Category[];
  products: Product[];
  onAddProduct: (product: Product) => void;
}

export function MenuList({
  categories,
  products,
  onAddProduct,
}: MenuListProps) {
  return (
    <section>
      {categories.map((category) => (
        <div key={category.id}>
          <h2>{category.name}</h2>

          {products
            .filter(
              (product) =>
                product.categoryId === category.id &&
                product.isAvailable,
            )
            .map((product) => (
              <article key={product.id}>
                <h3>{product.name}</h3>
                <p>{product.description}</p>

                <strong>
                  {product.price.toLocaleString("ar-SD")} ج
                </strong>

                <button
                  type="button"
                  onClick={() => onAddProduct(product)}
                >
                  + إضافة
                </button>
              </article>
            ))}
        </div>
      ))}
    </section>
  );
}
