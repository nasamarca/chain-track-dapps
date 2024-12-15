import ProductModal from '@/components/ProductModal'
import { CHAINTRACK_ABI, CHAINTRACK_ADDRESS } from '@/constants'
import { Contract } from 'ethers'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useAccount, useSigner } from 'wagmi'
import ProductCard from '../../components/products/ProductCard'
import { formatItem } from '../../utils/utils'
import { motion } from 'framer-motion'
import { HiPlus } from 'react-icons/hi'
import Head from 'next/head'

export const metadata = {
  title: "ChainTrack | Products",
  description: "Trace. Verify. Trust. - Revolutionizing Pharmaceutical Integrity Through Blockchain Transparency",
  icons: {
    icon: "/favicon.ico",
  },
}

function ProductIndex() {
  const { data: signer } = useSigner()
  const { isConnected } = useAccount()
  const [allItems, setAllItems] = useState();
  const [userRole, setUserRole] = useState(null);
  const [isManufacturer, setIsManufacturer] = useState(false);

  // Get user role
  const getUserRole = async () => {
    try {
      if (isConnected && signer) {
        const contractInstance = new Contract(
          CHAINTRACK_ADDRESS,
          CHAINTRACK_ABI,
          signer
        );
        
        const myDetails = await contractInstance.getMyDetails();
        setUserRole(myDetails.role);
        // Role 0 is Manufacturer in the enum AccountRole
        setIsManufacturer(myDetails.role === 0);
      }
    } catch (error) {
      console.error('Could not get user role', error);
    }
  };

  const getAllItems = async() => {
    try {
      const contractInstance = new Contract(
          CHAINTRACK_ADDRESS,
          CHAINTRACK_ABI,
          signer
      );
      
      const allItems = await contractInstance.getAllItems();
      const formattedItems = allItems.map(item => formatItem(item))
      console.log("🚀 ~ file: index.js:180 ~ getAllItems ~ formattedItems", formattedItems)
      setAllItems(formattedItems);
    } catch (error) {
        console.log('Could not get all items', error);
    }
  }
  
  const [myItems, setMyItems] = useState();
  const getMyItems = async() => {
    try {
        if(isConnected) {
            const contractInstance = new Contract(
                CHAINTRACK_ADDRESS,
                CHAINTRACK_ABI,
                signer
            );
            const myItems = await contractInstance.getMyItems();
            const formattedItems = myItems.map(item => formatItem(item))
            console.log("🚀 ~ file: index.js:191 ~ getMyItems ~ formattedItems", formattedItems)
            setMyItems(formattedItems);
        }
    } catch (error) {
        console.log('Could not get my items', error);
    }
  }

  const [myAccountList, setMyAccountList] = useState();
  const getMyAccountsList = async() => {
    try {
        if(isConnected) {
            const contractInstance = new Contract(
                CHAINTRACK_ADDRESS,
                CHAINTRACK_ABI,
                signer
            );
            const myUsersList = await contractInstance.getMyAccountsList();
            setMyAccountList(myUsersList)                                
        }
    } catch (error) {
        console.log('Could not get mu accounts list', error);
    }
  }

  const sellItem = async(data) => {
    const { accountId, barcodeId } = data
        console.log("🚀 ~ file: index.js:247 ~ sellItem ~ accountId, barcodeId", accountId, barcodeId)
    try {
        if(isConnected) {
            const contractInstance = new Contract(
              CHAINTRACK_ADDRESS,
              CHAINTRACK_ABI,
              signer
            );
            const currentTimestamp = Date.now(); // current time epoch
            const response = await contractInstance.sellItem(accountId, barcodeId, currentTimestamp);
            console.log("🚀 ~ file: ContextWrapper.js:247 ~ sellItem ~ response", response)
            setShowModal(false);
        }
    } catch (error) {
        console.log('Could not sell item', error);
        return null;
    }
  }  

  useEffect(() => {
    if(!signer) return;
    getAllItems();
    getMyAccountsList();
    getUserRole(); // Get user role when component mounts
  },[signer])

  // Modal Logic  
  const [showModal, setShowModal] = useState(false);
  const [modalItem, setModalItem] = useState({});
  function openModal(item) {
    setModalItem({item, myAccountList})
    setShowModal(true);
  }
  function closeModal() {
    console.log('set close');
    setShowModal(false);
  }

  return (
    <>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <link rel="icon" href={metadata.icons.icon} />
      </Head>
      <div className="min-h-screen pt-20 px-4 md:px-8 bg-white dark:bg-black transition-colors duration-200">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Products</h1>
              <p className="text-gray-600 dark:text-gray-400">Manage and track pharmaceutical products</p>
            </motion.div>

            {/* Only show Add New Product button for Manufacturer */}
            {isManufacturer && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Link
                  href="/products/new"
                  className="inline-flex items-center px-4 py-2 bg-chainTColors-600 dark:bg-chainTColors-700 text-white rounded-lg hover:bg-chainTColors-700 dark:hover:bg-chainTColors-600 transition-colors duration-200 shadow-lg hover:shadow-xl"
                >
                  <HiPlus className="w-5 h-5 mr-2" />
                  Add New Product
                </Link>
              </motion.div>
            )}
          </div>

          {/* Products Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
          >
            {allItems && allItems.map((item, index) => (
              <ProductCard key={index} item={item} openModal={openModal} />
            ))}
            
            {/* Empty State */}
            {(!allItems || allItems.length === 0) && (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
                <p className="text-xl font-semibold mb-2">No Products Found</p>
                <p className="text-sm">
                  {isManufacturer 
                    ? "Start by adding your first product" 
                    : "No products available to display"}
                </p>
              </div>
            )}
          </motion.div>

          {/* Modal */}
          {showModal && (
            <ProductModal
              isVisible={showModal}
              onClose={closeModal}
              modalItem={modalItem}
              shouldCloseOnOverlayClick={false}
              sellItem={sellItem}
            />
          )}
        </div>
      </div>
    </>
  )
}

export default ProductIndex