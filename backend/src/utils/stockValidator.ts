export const validateStock = (
  currentQuantity: number,
  requestedQuantity: number
): string | null => {
  if (currentQuantity === 0) {
    return 'Vehicle is out of stock';
  }

  if (currentQuantity < requestedQuantity) {
    return 'Insufficient stock';
  }

  return null;
};
