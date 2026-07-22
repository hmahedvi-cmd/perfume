import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchProducts } from "../services/productService";
import ProductCard from "../component/ProductCard/ProductCard";
import Skeleton from "../component/Skeleton/Skeleton";
import { FaFilter, FaRedoAlt } from "react-icons/fa";
import "./Shop.css";

function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";
  const initialSearch = searchParams.get("search") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states (price slider range is 5000 to 50000 to match seed prices)
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [maxPrice, setMaxPrice] = useState(50000);
  const [minPrice, setMinPrice] = useState(5000);
  const [minRating, setMinRating] = useState(0);
  const [selectedVolume, setSelectedVolume] = useState("All");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Sync category and search states if query parameters change
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) {
      setCategory(cat);
    }
    const srch = searchParams.get("search");
    if (srch) {
      setSearch(srch);
    }
  }, [searchParams]);

  // Load products from Firestore
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchProducts();
      setProducts(data);
      setLoading(false);
    };
    loadData();
  }, []);

  // Reset all filters
  const resetFilters = () => {
    setSearch("");
    setCategory("All");
    setSelectedBrand("All");
    setMaxPrice(50000);
    setMinPrice(5000);
    setMinRating(0);
    setSelectedVolume("All");
    setInStockOnly(false);
    setSearchParams({});
  };

  // Get unique brands and volumes from products for dynamic filters
  const brands = ["All", ...new Set(products.map((p) => p.brand).filter(Boolean))];
  const volumes = ["All", ...new Set(products.map((p) => p.volume).filter(Boolean))];

  // Filtering logic
  const filteredProducts = products.filter((product) => {
    const matchSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.brand.toLowerCase().includes(search.toLowerCase());

    const matchCategory =
      category === "All" || product.category?.toLowerCase() === category.toLowerCase();

    const matchBrand = selectedBrand === "All" || product.brand === selectedBrand;

    const matchPrice = product.price <= maxPrice;

    const matchMinPrice = product.price >= minPrice;

    const matchRating = product.rating >= minRating;

    const matchVolume = selectedVolume === "All" || product.volume === selectedVolume;

    const matchStock = !inStockOnly || (product.stock && product.stock > 0);

    return (
      matchSearch &&
      matchCategory &&
      matchBrand &&
      matchPrice &&
      matchMinPrice &&
      matchRating &&
      matchVolume &&
      matchStock
    );
  });

  return (
    <div className="shop-page-wrapper">
      {/* Premium Header Banner */}
      <div className="page-header-banner">
        <h1>All Fragrances</h1>
        <p>Curate your signature scent with our luxury collection.</p>
      </div>

      <div className="shop-container container">
        <button
          className="mobile-filter-toggle-btn"
          onClick={() => setShowFilters(!showFilters)}
        >
          <FaFilter /> {showFilters ? "Hide Filters" : "Show Filters"}
        </button>

        {/* Filters Sidebar */}
        <aside className={`filters-sidebar ${showFilters ? "open" : ""}`}>
          <div className="filters-header">
            <h3>
              <FaFilter /> Filters
            </h3>
            <button className="reset-btn" onClick={resetFilters}>
              <FaRedoAlt /> Clear
            </button>
          </div>

          {/* Search */}
          <div className="filter-group">
            <label>Search Collection</label>
            <input
              type="text"
              placeholder="Search perfumes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="filter-input"
            />
          </div>

          {/* Category */}
          <div className="filter-group">
            <label>Category</label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setSearchParams(e.target.value === "All" ? {} : { category: e.target.value });
              }}
              className="filter-select"
            >
              <option value="All">All Categories</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Unisex">Unisex</option>
            </select>
          </div>

          {/* Brand */}
          <div className="filter-group">
            <label>Brand</label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="filter-select"
            >
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range Filter */}
          <div className="filter-group">
            <label>Price Range</label>
            
            <div className="price-slider-wrapper">
              <div className="price-label-row">
                <span className="slider-label">Min Price</span>
                <span className="price-val">₹{minPrice}</span>
              </div>
              <input
                type="range"
                min="5000"
                max="50000"
                step="100"
                value={minPrice}
                onChange={(e) => setMinPrice(Math.min(Number(e.target.value), maxPrice))}
                className="price-slider"
              />
            </div>

            <div className="price-slider-wrapper" style={{ marginTop: "15px" }}>
              <div className="price-label-row">
                <span className="slider-label">Max Price</span>
                <span className="price-val">₹{maxPrice}</span>
              </div>
              <input
                type="range"
                min="5000"
                max="50000"
                step="100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Math.max(Number(e.target.value), minPrice))}
                className="price-slider"
              />
            </div>
          </div>

          {/* Rating */}
          <div className="filter-group">
            <label>Minimum Rating</label>
            <div className="rating-options">
              {[0, 4.0, 4.5, 4.8].map((rating) => (
                <label key={rating} className="radio-label">
                  <input
                    type="radio"
                    name="rating"
                    checked={minRating === rating}
                    onChange={() => setMinRating(rating)}
                  />
                  <span>{rating === 0 ? "All Ratings" : `⭐ ${rating}+`}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Volume */}
          <div className="filter-group">
            <label>Volume</label>
            <select
              value={selectedVolume}
              onChange={(e) => setSelectedVolume(e.target.value)}
              className="filter-select"
            >
              {volumes.map((vol) => (
                <option key={vol} value={vol}>
                  {vol}
                </option>
              ))}
            </select>
          </div>

          {/* Availability */}
          <div className="filter-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
              />
              <span>In Stock Only</span>
            </label>
          </div>
        </aside>

        {/* Products Grid */}
        <main className="shop-products">
          <div className="shop-results-header">
            <h2>Our Collection</h2>
            <p>{filteredProducts.length} Fragrances Found</p>
          </div>

          {loading ? (
            <div className="grid">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="no-products">
              <h3>No perfumes match your current filters.</h3>
              <button className="reset-btn-large primary" onClick={resetFilters}>
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Shop;
