$(document).ready(function () {
  const $status = $('#status');
  const $products = $('#products');
  const $modal = $('#productModal');
  const $form = $('#productForm');
  let editId = null;
  let productsCache = []; 

  function fetchProducts() {
    $products.empty();
    $status.text('Loading products...');

    $.ajax({
      url: 'https://fakestoreapi.com/products',
      method: 'GET',
      success: function (data) {
        $status.text('');
        productsCache = data;
        renderAllProducts();
      },
      error: function () {
        $status.text('Failed to load products.');
      }
    });
  }

  function renderAllProducts() {
    $products.empty();
    productsCache.forEach(renderProduct);
  }

  function renderProduct(p) {
    const avg = p.rating?.rate ?? 'N/A';
    const count = p.rating?.count ?? 0;
  const stars = avg !== 'N/A'
  ? `<span class="stars">${'<i class="fa-solid fa-star"></i>'.repeat(Math.round(avg))}${'<i class="fa-regular fa-star"></i>'.repeat(5 - Math.round(avg))}</span>`
  : 'N/A';

    const $card = $(`
      <div class="card">
        <img src="${p.image}" alt="${escapeHtml(p.title)}" />
        <div class="title">${escapeHtml(p.title)}</div>
        <div class="category">${escapeHtml(p.category)}</div>
        <div class="price">$${p.price.toFixed(2)}</div>
        <div class="rating">${stars} (${count})</div>
        <div class="buttons">
        <button class="btn update-btn">Update</button>
        <button class="btn delete-btn">Delete</button>
         </div>
      </div>
    `);

    $card.find('.update-btn').click(() => openModal('update', p));
    $card.find('.delete-btn').click(() => deleteProduct(p.id));

    $products.append($card);
  }

  function openModal(mode, data = {}) {
    $form[0].reset();
    editId = mode === 'update' ? data.id : null;
    $('#modalTitle').text(mode === 'update' ? 'Update Product' : 'Add Product');
    $('#title').val(data.title || '');
    $('#price').val(data.price || '');
    $('#category').val(data.category || '');
    $('#description').val(data.description || '');
    $('#image').val(data.image || '');
    $modal.fadeIn(200);
  }

  $('#closeModal').click(() => $modal.fadeOut(200));

  $form.submit(function (e) {
    e.preventDefault();
    const productData = {
      id: editId || Date.now(), 
      title: $('#title').val(),
      price: parseFloat($('#price').val()),
      category: $('#category').val(),
      description: $('#description').val(),
      image: $('#image').val(),
      rating: { rate: 4.5, count: 1 }
    };

    if (!productData.title || isNaN(productData.price)) {
      alert('Please enter valid title and price.');
      return;
    }

    if (editId) {
      const index = productsCache.findIndex(p => p.id === editId);
      productsCache[index] = productData;
      alert(' Product updated!');
    } else {
      productsCache.unshift(productData);
      alert(' Product added!');
    }

    $modal.fadeOut(200);
    renderAllProducts();
  });

  function deleteProduct(id) {
    if (confirm('Delete this product?')) {
      productsCache = productsCache.filter(p => p.id !== id);
      renderAllProducts();
      alert(' Product deleted!');
    }
  }

  $('#addProduct').click(() => openModal('add'));

  function escapeHtml(text) {
    return $('<div>').text(text).html();
  }

  fetchProducts();
});
