export const formatPrice = (price) => {
    if (isNaN(price)) return "Invalid price";
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  