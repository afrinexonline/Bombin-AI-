"use client";

import { Package, Tag } from "lucide-react";

const products = [
  { name: "Premium Chesterfield Sofa", category: "Furniture", price: "₦1,200,000" },
  { name: "Consulting Inspection Fee", category: "Service", price: "₦50,000" },
  { name: "Italian Marble Dining Set", category: "Furniture", price: "₦1,800,000" },
  { name: "Gold-Accented Luxury Curtains", category: "Decor", price: "₦180,000/window" },
  { name: "Smart Home Automation Kit", category: "Electronics", price: "₦750,000" },
  { name: "Executive Office Desk", category: "Furniture", price: "₦420,000" },
  { name: "Interior Design Package", category: "Service", price: "₦2,500,000" },
  { name: "Venetian Glass Chandelier", category: "Lighting", price: "₦890,000" },
];

export default function ProductCatalog() {
  return (
    <div className="glass-card rounded-2xl p-5 h-full flex flex-col animate-fade-up">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-5">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, rgba(0,201,255,0.15), rgba(123,47,190,0.15))",
            border: "1px solid rgba(0,201,255,0.2)",
          }}
        >
          <Package className="w-4 h-4 text-cyan" />
        </div>
        <div>
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            Product Catalog
          </h3>
          <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
            Inventory pricing sheet
          </p>
        </div>
      </div>

      {/* Product List */}
      <div className="flex-1 space-y-1 overflow-y-auto">
        {products.map((product, index) => (
          <div
            key={index}
            className="product-row flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl transition-all"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>
                {product.name}
              </p>
              <span
                className="glass-pill inline-flex items-center gap-1 px-2 py-0.5 mt-1 text-[10px] font-medium"
                style={{ color: "var(--text-muted)" }}
              >
                <Tag className="w-2.5 h-2.5" />
                {product.category}
              </span>
            </div>
            <p className="text-sm font-semibold text-cyan glow-text-sm whitespace-nowrap">
              {product.price}
            </p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div
        className="mt-4 pt-4 flex items-center justify-between"
        style={{ borderTop: "1px solid var(--border-card)" }}
      >
        <span className="text-[11px] font-medium" style={{ color: "var(--text-dimmed)" }}>
          {products.length} items in catalog
        </span>
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: "#00E676" }} />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: "#00E676" }} />
          </span>
          <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
            Synced with WhatsApp catalog
          </span>
        </div>
      </div>
    </div>
  );
}
