export function velpawText(value = "") {
  return typeof value === "string" ? value.replace(/windfrd/gi, "VELPAW") : value;
}

export function withVelpawProductBrand(product) {
  if (!product) return product;

  return Object.fromEntries(
    Object.entries(product).map(([key, value]) => {
      if (key === "slug" || key === "sourceUrl" || key === "images") return [key, value];
      if (typeof value === "string") return [key, velpawText(value)];
      if (Array.isArray(value)) {
        return [key, value.map((item) => (typeof item === "string" ? velpawText(item) : item))];
      }
      return [key, value];
    }),
  );
}
