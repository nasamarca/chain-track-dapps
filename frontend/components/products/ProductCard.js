import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { motion } from 'framer-motion'
import { HiOutlineEye, HiOutlineShoppingCart } from 'react-icons/hi'

function ProductCard({item, openModal}) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md hover:shadow-xl transition-all duration-200'
    >
      <div className='flex flex-col h-full'>
        {/* Image Section */}
        <div className='relative h-48 bg-gradient-to-r from-chainTColors-500/10 to-chainTColors-600/10 dark:from-chainTColors-900/20 dark:to-chainTColors-800/20 rounded-t-lg overflow-hidden'>
          <Image
            src={item.itemImage || '/ChainTrack-VW.png'}
            alt={item.name}
						layout="fill"
            objectFit="contain"
            className="p-4 transition-transform duration-200 group-hover:scale-105"
          />
        </div>

        {/* Content Section */}
        <div className='flex flex-col p-4 flex-grow'>
          <div className='flex-grow'>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
              {item.name}
            </h3>
            
            <div className='space-y-2 mb-4'>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                ID: {item.barcodeId}
              </p>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                MFG: {item.manufacturedDate}
              </p>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                EXP: {item.expiringDate}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className='flex gap-2 mt-4'>
            <Link
              href={`products/${item.barcodeId}`}
              className='flex items-center justify-center flex-1 px-4 py-2 text-sm font-medium text-chainTColors-600 dark:text-chainTColors-400 bg-chainTColors-50 dark:bg-chainTColors-900/30 rounded-md hover:bg-chainTColors-100 dark:hover:bg-chainTColors-900/50 transition-colors duration-200'
            >
              <HiOutlineEye className="w-4 h-4 mr-2" />
              Details
            </Link>
            
            <button
              onClick={() => openModal(item)}
              className="flex items-center justify-center flex-1 px-4 py-2 text-sm font-medium text-white bg-chainTColors-600 dark:bg-chainTColors-700 rounded-md hover:bg-chainTColors-700 dark:hover:bg-chainTColors-600 transition-colors duration-200"
            >
              <HiOutlineShoppingCart className="w-4 h-4 mr-2" />
              Sell
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ProductCard