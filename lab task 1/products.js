let currentPage = 1;
const limit = 10; 

function fetchProducts(page = 1) {
  const category = $("#category-filter").val();
  const minPrice = $("#min-price").val();
  const maxPrice = $("#max-price").val();

  $.ajax({
    url: `http://localhost:3000/api/products/get?page=${page}&limit=${limit}&category=${category}&minPrice=${minPrice}&maxPrice=${maxPrice}`,
    method: "GET",
    success: function(res) {
      // Your backend returns { products, total, page, limit }
      const products = res.products;
      const total = res.total;

      const container = $("#product-container");
      container.empty();

      if (products.length === 0) {
        container.html("<p>No products found.</p>");
        $("#pagination").empty();
        return;
      }

      products.forEach(product => {
        const card = `
          <div class="product-card">
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="price">Rs ${product.price}</div>
            <p><b>Category:</b> ${product.category}</p>
          </div>
        `;
        container.append(card);
      });

      renderPagination(total, page);
    },
    error: function(err) {
      console.error("API Error:", err);
      $("#product-container").html("<p>Failed to load products.</p>");
    }
  });
}

function renderPagination(total, page) {
  const totalPages = Math.ceil(total / limit);
  const pagination = $("#pagination");
  pagination.empty();

  for (let i = 1; i <= totalPages; i++) {
    const btn = $(`<button class="page-btn">${i}</button>`);
    if (i === page) btn.addClass("active");
    btn.click(() => {
      currentPage = i;
      fetchProducts(currentPage);
    });
    pagination.append(btn);
  }
}

$(document).ready(function() {
  // Fetch initial products
  fetchProducts();

  // Apply filters
  $("#apply-filters").click(function() {
    currentPage = 1;
    fetchProducts(currentPage);
  });
});
