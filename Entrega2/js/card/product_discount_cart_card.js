export const mapProductDiscountCartCard = (product) => {
  return `
      <div class="cart-product-item">
              <div class="cart-product-details">
                <img
                  src="${product.image}"
                  alt="Producto Portrait Image"
                />
                <div class="cart-product-info">
                  <div class="cart-product-description">
                    <h4>${product.gamename}</h4>
                    <p>Plataforma Windows</p>
                  </div>
                  <div class="cart-product-discount">
                    <div class="cart-product-discount-price">
                      <p class="cart-product-discount-original-price">$${product.price}</p>
                      <p>$${(
                        product.price -
                        (product.price * product.discount_percentage) / 100
                      ).toFixed(2)}</p>
                    </div>
                    <span class="cart-product-discount-label">${
                      product.discount_percentage
                    }% OFF</span>
                  </div>
                </div>
              </div>

              <button class="cart-product-delete">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 29 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.3667 8.06165L10.4667 23.3333H18.8667L20.9667 8.06165"
                    stroke="#F012B9"
                  />
                  <path
                    d="M7.66669 7.77817H21.6667"
                    stroke="#F012B9"
                    stroke-linecap="round"
                  />
                  <path
                    d="M17.6662 8.16666V6.99999C17.6662 6.38115 17.4203 5.78766 16.9827 5.35007C16.5452 4.91249 15.9517 4.66666 15.3328 4.66666H14.0017C13.3828 4.66666 12.7893 4.91249 12.3518 5.35007C11.9142 5.78766 11.6683 6.38115 11.6683 6.99999V8.16666"
                    stroke="#F012B9"
                  />
                  <path
                    d="M14.6434 12.3037V19.0925M11.8667 12.3025L12.5667 19.0925M17.4667 12.3037L16.7667 19.0925"
                    stroke="#F012B9"
                    stroke-linecap="round"
                  />
                </svg>
              </button>
            </div>
      `;
};
