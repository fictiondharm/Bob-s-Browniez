import { useMemo, useState } from "react";
import { products } from "../data/products";
import ProductCard from "../components/ProductCard";

const FILTERS = [
  { key: "brownie", label: "Brownies" },
  { key: "blondie", label: "Blondies" },
];

const SORTS = [
  { key: "featured", label: "Featured" },
  { key: "price-asc", label: "Price: Low to High" },
  { key: "price-desc", label: "Price: High to Low" },
  { key: "name", label: "Name: A to Z" },
];

export default function Shop() {
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("featured");

  const visible = useMemo(() => {
    let list = filter === "all" ? products : products.filter((p) => p.category === filter);
    const sorted = [...list];
    switch (sort) {
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "name":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }
    return sorted;
  }, [filter, sort]);

  const filterCount = (key) => products.filter((p) => p.category === key).length;

  const toggleFilter = (key) => {
    setFilter((prev) => (prev === key ? "all" : key));
  };

  return (
    <>
      <section className="section" style={{ paddingBottom: 16 }}>
        <div className="container">
          <span className="eyebrow eyebrow-brown">Full Menu</span>
          <h1 className="headline-xl mt-stack-sm" style={{ fontSize: 40 }}>
            Every Bite, Sorted.
          </h1>
          <p className="body-lg text-muted mt-stack-sm" style={{ maxWidth: 560 }}>
            Handcrafted in small batches, priced per bite, and baked fresh every
            weekend.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 16 }}>
        <div className="container">
          <div className="shop-toolbar">
            <div className="chips" role="tablist" aria-label="Filter treats">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  className={`chip${filter === f.key ? " active" : ""}`}
                  onClick={() => toggleFilter(f.key)}
                  role="tab"
                  aria-selected={filter === f.key}
                >
                  {f.label}
                  <span className="chip-count">{filterCount(f.key)}</span>
                </button>
              ))}
            </div>

            <label className="sort-box">
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                sort
              </span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                aria-label="Sort treats"
              >
                {SORTS.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <p className="shop-count">Showing {visible.length} treats</p>

          <div
            className="grid-products card-enter"
            key={`${filter}-${sort}`}
          >
            {visible.map((p, i) => (
              <div key={p.slug} style={{ animationDelay: `${i * 60}ms` }}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="policy-banner">
            <span className="material-symbols-outlined">schedule</span>
            <div>
              <h3 className="headline-md">Fresh every weekend</h3>
              <p className="body-md text-muted">
                All orders are baked and delivered{" "}
                <strong className="text-secondary">Saturday &amp; Sunday</strong>.
                Order before <strong className="text-secondary">Friday noon</strong>{" "}
                to lock your slot.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
