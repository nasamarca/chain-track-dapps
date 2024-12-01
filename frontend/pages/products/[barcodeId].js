import { CHAINTRACK_ABI, CHAINTRACK_ADDRESS } from '@/constants';
import { formatItem, firstAndLastFour } from '@/utils/utils';
import { Contract } from 'ethers';
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useAccount, useSigner } from 'wagmi';
import { motion } from 'framer-motion';
import { HiOutlineArrowLeft } from 'react-icons/hi';
import Image from 'next/image';
import Link from 'next/link';

function ItemDetails() {
  const { data: signer } = useSigner()
  const { isConnected } = useAccount()
  const [item, setItem] = useState();
  const [itemHistory, setItemHistory] = useState();
  const [manufacturer, setManufacturer] = useState();
  const [distributor, setDistributor] = useState();
  const [retailer, setRetailer] = useState();
  const [customers, setCustomers] = useState();
  const router = useRouter();

  const getManufacturer = async(address) => {
    try {
      const contractInstance = new Contract(
          CHAINTRACK_ADDRESS,
          CHAINTRACK_ABI,
          signer
      );
        const manufacturerDetails = await contractInstance.getAccountDetails(address);
        setManufacturer(manufacturerDetails)
        console.log(manufacturer);
    } catch (error) {
      console.log("🚀 ~ file: [barcodeId].js:28 ~ getManufacturer ~ error", error)
    }
  }

  const getDistributor = async(address) => {
    try {
        const contractInstance = new Contract(
            CHAINTRACK_ADDRESS,
            CHAINTRACK_ABI,
            signer
        );

        const distributorDetails = await contractInstance.getAccountDetails(address);
        setDistributor(distributorDetails)
        console.log(distributor);
    } catch (error) {
      console.log("🚀 ~ file: [barcodeId].js:28 ~ getManufacturer ~ error", error)
      
    }
  }

  const getRetailer = async(address) => {
    try {
        const contractInstance = new Contract(
            CHAINTRACK_ADDRESS,
            CHAINTRACK_ABI,
            signer
        );
        const retailerDetails = await contractInstance.getAccountDetails(address);
        retailerDetails ? setRetailer(retailerDetails) : setRetailer(null)
        console.log(retailer)
    } catch (error) {
      console.log("🚀 ~ file: [barcodeId].js:28 ~ getManufacturer ~ error", error)
    }
  }

  const getSingleItem = async() => {
          
    try {
        if(isConnected) {
            const contractInstance = new Contract(
                CHAINTRACK_ADDRESS,
                CHAINTRACK_ABI,
                signer
            );
            const barcodeId = router.query.barcodeId
            const singleItem = await contractInstance.getSingleItem( barcodeId );
            // get item
            const formattedItem = formatItem(singleItem[0])
            setItem(formattedItem)
            // get item history
            const itemHistory = singleItem[1];
            console.log("🚀 ~ file: [barcodeId].js:37 ~ getSingleItem ~ itemHistory", itemHistory)
            // get manufacturer details
            const manufacturerAddress = itemHistory.manufacturer?.accountId
            getManufacturer(manufacturerAddress);
            // get distributor details
            const distributorAddress = itemHistory.distributor?.accountId
            getDistributor(distributorAddress);
            // get retailer details
            const retailerAddress = itemHistory.retailer?.accountId
            getRetailer(retailerAddress);
        }
    } catch (error) {
        console.log('Could not get single item', error);
        return null;
    }
  }

  useEffect(() => {
    if(!signer) return;
    getSingleItem();
  },[signer])

  return (
    <div className="min-h-screen pt-20 px-4 md:px-8 bg-white dark:bg-black transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Link 
          href="/products"
          className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-chainTColors-600 dark:hover:text-chainTColors-400 transition-colors duration-200 mb-8"
        >
          <HiOutlineArrowLeft className="w-5 h-5 mr-2" />
          Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Details Section */}
          {/* Product Details Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Item Details
            </h2>

            <div className="space-y-8">
              {/* Image Section */}
              <div className="relative h-48 bg-gradient-to-r from-chainTColors-500/10 to-chainTColors-600/10 dark:from-chainTColors-900/20 dark:to-chainTColors-800/20 rounded-lg overflow-hidden">
                <Image
                  src={item?.itemImage || '/ChainTrack-Green.svg'}
                  alt={item?.name}
                  layout="fill"
                  objectFit="contain"
                  className="p-4"
                />
              </div>

              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {item?.name}
                </h3>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Manufacturing Date
                    </p>
                    <p className="text-gray-900 dark:text-white">
                      {item?.manufacturedDate}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Expiry Date
                    </p>
                    <p className="text-gray-900 dark:text-white">
                      {item?.expiringDate}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Product ID
                    </p>
                    <p className="text-gray-900 dark:text-white">
                      {item?.barcodeId}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Product Type
                    </p>
                    <p className="text-gray-900 dark:text-white">
                      {item?.isInBatch ? 'Batch' : 'Individual'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Product Category */}
              <div className="space-y-2">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                  Product Category
                </h4>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-chainTColors-100 dark:bg-chainTColors-900/30 text-chainTColors-800 dark:text-chainTColors-200">
                  {item?.itemType === 0 ? 'Antibiotics' :
                  item?.itemType === 1 ? 'Antimalaria' :
                  item?.itemType === 2 ? 'Analgestics' :
                  item?.itemType === 3 ? 'Supplements' : 'Steroids'}
                </div>
              </div>

              {/* Side Effects */}
              {item?.others && item.others.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                    Side Effects
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {item.others.slice(0, Math.floor(item.others.length / 2)).map((effect, index) => (
                      <div
                        key={index}
                        className="p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-sm text-gray-700 dark:text-gray-300"
                      >
                        {effect}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Composition */}
              {item?.others && item.others.length > Math.floor(item.others.length / 2) && (
                <div className="space-y-3">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                    Composition
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {item.others.slice(Math.floor(item.others.length / 2)).map((comp, index) => (
                      <div
                        key={index}
                        className="p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-sm text-gray-700 dark:text-gray-300"
                      >
                        {comp}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Prescription */}
              <div className="space-y-2">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                  Prescription Details
                </h4>
                <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-wrap bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  {item?.usage || 'No prescription details available'}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Item History Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Item History
            </h2>

            <div className="relative pl-8 space-y-8 before:content-[''] before:absolute before:left-4 before:top-0 before:h-full before:w-0.5 before:bg-chainTColors-100 dark:before:bg-chainTColors-900">
              {/* Manufacturer */}
              {manufacturer && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="relative before:content-[''] before:absolute before:left-[-26px] before:top-2 before:w-4 before:h-4 before:rounded-full before:bg-chainTColors-500 dark:before:bg-chainTColors-400 before:border-4 before:border-white dark:before:border-gray-800"
                >
                  <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {manufacturer?.name}
                    </h3>
                    <p className="text-xs font-medium text-chainTColors-600 dark:text-chainTColors-400 uppercase tracking-wide mb-2">
                      Manufacturer
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      {manufacturer?.email}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      {firstAndLastFour(manufacturer?.accountId)}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Distributor */}
              {distributor && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="relative before:content-[''] before:absolute before:left-[-26px] before:top-2 before:w-4 before:h-4 before:rounded-full before:bg-chainTColors-500 dark:before:bg-chainTColors-400 before:border-4 before:border-white dark:before:border-gray-800"
                >
                  <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {distributor?.name}
                    </h3>
                    <p className="text-xs font-medium text-chainTColors-600 dark:text-chainTColors-400 uppercase tracking-wide mb-2">
                      Distributor
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      {distributor?.email}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      {firstAndLastFour(distributor?.accountId)}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Retailer */}
              {retailer && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="relative before:content-[''] before:absolute before:left-[-26px] before:top-2 before:w-4 before:h-4 before:rounded-full before:bg-chainTColors-500 dark:before:bg-chainTColors-400 before:border-4 before:border-white dark:before:border-gray-800"
                >
                  <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {retailer?.name}
                    </h3>
                    <p className="text-xs font-medium text-chainTColors-600 dark:text-chainTColors-400 uppercase tracking-wide mb-2">
                      Retailer
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      {retailer?.email}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      {firstAndLastFour(retailer?.accountId)}
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default ItemDetails;