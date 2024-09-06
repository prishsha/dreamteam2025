export const humanizePrice = (price: number): string => {
  if (price >= 10000000) {
    return `${price / 10000000}Cr`;
  } else if (price >= 100000) {
    return `${price / 100000}L`;
  } else {
    return `${price}`;
  }
}

