function fetchProducts() {
  $.ajax({
    url: "http://localhost:3000/api/products/get",
    method: "GET",
    success: function(res) {
      let products = [];

      if (Array.isArray(res)) {
        products = res;
      } else if (Array.isArray(res.products)) {
        products = res.products;
      } else {
        console.error("API response is not an array:", res);
        $("#admin-products").html("<tr><td colspan='6'>Failed to load products.</td></tr>");
        return;
      }

      const container = $("#admin-products");
      container.empty();

      products.forEach(product => {
        const row = $(`
          <tr data-id="${product._id}">
            <td><img src="${product.image}" alt="${product.name}"></td>
            <td>${product.name}</td>
            <td>${product.description}</td>
            <td>${product.category}</td>
            <td>Rs ${product.price}</td>
            <td>
              <button class="btn update-btn">Update</button>
              <button class="btn delete-btn">Delete</button>
            </td>
          </tr>
        `);
        container.append(row);
      });
    },
    error: function(err) {
      console.error("Failed to fetch products:", err);
      $("#admin-products").html("<tr><td colspan='6'>Failed to load products.</td></tr>");
    }
  });
}



$("#add-product-btn").click(function() {
  const product = {
    name: $("#add-name").val(),
    price: $("#add-price").val(),
    category: $("#add-category").val(),
    image: $("#add-image").val(),
    description: $("#add-description").val()
  };

  $.ajax({
    url: "http://localhost:3000/api/products/create",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify(product),
    success: function() {
      alert("Product added!");
      fetchProducts();
      $("#add-product-form input").val(""); 
    },
    error: function(err) {
      console.error("Failed to add product:", err);
    }
  });
});

$("#admin-products").on("click", ".delete-btn", function() {
  const id = $(this).closest(".product-card").data("id");
  if(confirm("Are you sure to delete this product?")) {
    $.ajax({
      url: `http://localhost:3000/api/products/delete/${id}`,
      method: "DELETE",
      success: function() {
        alert("Product deleted!");
        fetchProducts();
      },
      error: function(err) {
        console.error("Failed to delete product:", err);
      }
    });
  }
});
let currentUpdateId = null;

$("#admin-products").on("click", ".update-btn", function() {
  const row = $(this).closest("tr");
  currentUpdateId = row.data("id");

  $("#update-name").val(row.find("td").eq(1).text());
  $("#update-price").val(row.find("td").eq(4).text().replace("Rs ", ""));
  $("#update-category").val(row.find("td").eq(3).text());
  $("#update-description").val(row.find("td").eq(2).text());
  $("#update-image").val(row.find("td").eq(0).find("img").attr("src"));

  $("#update-modal").css("display", "flex");
});


$("#close-modal-btn").click(function() {
  $("#update-modal").hide();
});


$("#save-update-btn").click(function() {
  const updatedProduct = {
    name: $("#update-name").val(),
    price: $("#update-price").val(),
    category: $("#update-category").val(),
    description: $("#update-description").val(),
    image: $("#update-image").val()
  };

  $.ajax({
    url: `http://localhost:3000/api/products/update/${currentUpdateId}`,
    method: "PUT",
    contentType: "application/json",
    data: JSON.stringify(updatedProduct),
    success: function() {
      alert("Product updated!");
      $("#update-modal").hide();
      fetchProducts();
    },
    error: function(err) {
      console.error("Failed to update product:", err);
    }
  });
});
$(document).ready(function() {
  fetchProducts();
});
