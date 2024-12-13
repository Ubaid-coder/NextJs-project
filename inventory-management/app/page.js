'use client'

import { useState, useEffect } from 'react';

function Page() {
  const [productsForm, setProductsForm] = useState({});
  const [products, setProducts] = useState([]);
  const [successMessage, setSuccessMessage] = useState(null);
  const [query, setquery] = useState('');
  const [loading, setloading] = useState(false);
  const [loadingaction, setloadingaction] = useState('');
  const [dropdown, setdropdown] = useState([]);
  const [updated, setupdated] = useState(false);


  const fetchProducts = async () => {
    const response = await fetch('/api/product');
    const rejson = await response.json();
    setProducts(rejson.products);
  };

  useEffect(() => {
    fetchProducts();
  }, [productsForm, updated]);

  const addProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productsForm),
      });

      if (response.ok) {
        const newProduct = await response.json(); // Assuming the new product is returned
        setProducts([...products, newProduct]); // Update the products list with the new product
        setProductsForm({}); // Clear the form

        // Show success message
        setSuccessMessage('Product added successfully!');
        setTimeout(() => setSuccessMessage(null), 5000); // Clear the message after 3 seconds
      } else {
        console.log('Error saving product!');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProductsForm({
      ...productsForm,
      [name]: value,
    });

  };

  const onDropDown = async (e) => {
    const value = e.target.value;
    setquery(value);

    if (value.trim() === '') {
      setdropdown([]); // This will hide the dropdown
      return;
    }

    if (value.length > 0) {
      setloading(true);
      setdropdown([]);
      const response = await fetch(`/api/search?query=${value}`);
      const rejson = await response.json();
      setdropdown(rejson.products);
      setloading(false);
    } else {
      setdropdown([]);
    }
  };

  const buttonAction = async (action, slug, initialQuantity) => {
    if (action === 'minus' && initialQuantity === 0) return;
    setloadingaction(true);

    try {
      const response = await fetch('/api/action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, slug, initialQuantity }),
      });

      const rjson = await response.json();
      console.log(rjson);

      // Fetch the updated products
      await fetchProducts();

      setloadingaction(false);
      setdropdown([]); // Clear dropdown if necessary
      setloadingaction('Item quantity updated successfully');
      setTimeout(() => {
        setloadingaction('');
      }, 3000);
      setupdated(true);
    } catch (error) {
      console.error('Error:', error);
      setloadingaction(false);
    }
  };

  const deleteProduct = async (id) => {

    const ask = confirm('Are you sure you want to delete');
    if (ask) {
      try {
        const response = await fetch(`/api/product?id=${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await fetchProducts();
          setSuccessMessage('Product deleted successfully!');
          setTimeout(() => setSuccessMessage(null), 5000); // Clear the message after 3 seconds
        }
      } catch (err) {
        console.log(err);
      }
    }

  }

  return (
    <>
      {/* Success message */}
      {successMessage && (
        <div className="container mx-auto p-4 mb-4 bg-green-100 text-green-800 rounded">
          {successMessage}
        </div>
      )}

      {loadingaction.length > 0 && (
        <div className="container mx-auto p-4 mb-4 bg-green-100 text-green-800 rounded">
          {loadingaction}
        </div>
      )}

      {/* Search current Stock */}
      <div className="container bg-primary mx-auto my-10 p-6">
        <h2 className="text-2xl font-bold text-purple-400 mb-4">Search Products</h2>

        <div className="flex mb-6">
          <input
            type="text"
            placeholder="Search by product name..."
            className="w-full border bg-input p-2 rounded-md"
            onChange={onDropDown}

          />
          <select className="border border-gray-300 bg-input px-4 py-2 rounded-r-md">
            <option value="All">All</option>
            <option value="Option1">Option1</option>
            <option value="Option2">Option2</option>
          </select>
        </div>
        {loading && (
          <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 16L19 19M18 12H22M8 8L5 5M16 8L19 5M8 16L5 19M2 12H6M12 2V6M12 18V22" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite" />
            </path>
          </svg>
        )}

        {/* Product List */}
        {dropdown?.map((item) => {
          return (
            <div key={item._id} className="flex justify-around items-center bg-purple-200 text-xl py-3 my-3">
              <span className={`font-bold ${item.quantity === 0 ? 'text-red-500 line-through' : 'text-cyan-500'}`}>
                {item.slug} ({item.quantity} available for {item.price})Rs
              </span>
              <div className="mx-5">
                <button
                  onClick={() => buttonAction('minus', item.slug, item.quantity)}
                  disabled={loadingaction.length > 0}
                  className="px-5 py-1 bg-orange-400 rounded-xl font-bold text-xl text-white hover:bg-orange-800 cursor-pointer disabled:bg-gray-600"
                >
                  -
                </button>
                <span className="mx-3 text-black font-bold">{item.quantity}</span>
                <button
                  onClick={() => buttonAction('plus', item.slug, item.quantity)}
                  disabled={loadingaction.length > 0}
                  className="px-5 py-1 bg-green-600 rounded-xl font-bold text-xl text-white hover:bg-green-800 cursor-pointer disabled:bg-gray-600"
                >
                  +
                </button>
              </div>
            </div>
          );
        })}

      </div>

      {/* Add product form */}
      <div className="container bg-primary mx-auto p-6">
        <h1 className="text-3xl font-extrabold text-purple-500 mb-6">Add a Product</h1>
        <form onSubmit={addProduct}>
          <div className="flex flex-col gap-5">
            <input
              type="text"
              name="slug"
              placeholder="Product Slug"
              className="border border-gray-300 bg-input p-2 rounded-md"
              onChange={handleChange}
              value={productsForm?.slug || ''}
              required
            />
            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              className="border border-gray-300 bg-input p-2 rounded-md"
              onChange={handleChange}
              value={productsForm?.quantity || ''}
              required
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              className="border border-gray-300 bg-input p-2 rounded-md"
              onChange={handleChange}
              value={productsForm?.price || ''}
              required
            />
          </div>
          <button
            type="submit"
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Add Product
          </button>
        </form>
      </div>

      {/* Display Current Stocks */}
      <div className="container bg-primary mx-auto my-10 p-6">
        <h1 className="text-3xl font-extrabold text-green-200 dark:text-green-400 mb-6">
          Display Current Stocks
        </h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-primary-foreground border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Product Slug</th>
                <th className="py-3 px-6 text-center">Quantity</th>
                <th className="py-3 px-6 text-center">Price</th>
              </tr>
            </thead>
            <tbody className="text-secondary-foreground text-sm">
              {products.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-4">
                    No products added yet.
                  </td>
                </tr>
              ) : (
                products.map((product, index) => (
                  <tr
                    key={index}
                    className={`border-b border-gray-300 hover:bg-secondary ${product.quantity === 0 ? 'line-through text-red-500' : ''
                      }`}
                  >
                    <td className="py-3 px-6 text-left text-lg font-mono">
                      {index + 1}. {product.slug}
                    </td>
                    <td className="py-3 px-6 text-center text-blue-400 font-bold text-lg">
                      {product.quantity}
                    </td>
                    <td className="py-3 px-6 text-center text-green-500 font-bold text-lg">
                      {product.price}Rs

                      <span onClick={() => deleteProduct(product._id)} className="py-2 px-7 bg-red-600 hover:bg-red-800 rounded-full border-none text-white ml-5 cursor-pointer">
                        DELETE
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </>
  );
}

export default Page;
