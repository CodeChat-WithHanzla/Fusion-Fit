import React,{useState} from 'react'
import ListedProducts from '../../components/admin/product/ListedProducts'
import ListProduct from '../../components/admin/product/ListProduct'
import ManageProducts from '../../components/admin/product/ManageProducts'

const ProductManagement = () => {
  const [activeTab, setActiveTab] = useState("listed");

  const renderActiveTab = () => {
    switch (activeTab) {
      case "listed":
        return <ListedProducts />;
      case "list":
        return <ListProduct />;
      case "manage":
        return <ManageProducts />;
      default:
        return null;
    }
  };
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Prducts Management</h1>

      {/* Tab Buttons */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab("listed")}
          className={`px-4 py-2 rounded ${activeTab === "listed" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
        >
          Listed Products
        </button>
        <button
          onClick={() => setActiveTab("list")}
          className={`px-4 py-2 rounded ${activeTab === "list" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
        >
          List Product
        </button>
        <button
          onClick={() => setActiveTab("manage")}
          className={`px-4 py-2 rounded ${activeTab === "manage" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
        >
          Manage Products
        </button>
      </div>

      {/* Render Active Tab Content */}
      <div className="bg-white p-6 rounded shadow">{renderActiveTab()}</div>
    </div>
  );
}

export default ProductManagement
