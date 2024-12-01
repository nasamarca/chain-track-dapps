import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiX } from 'react-icons/hi'
import { useForm } from "react-hook-form"
import Image from 'next/image'
import { useTheme } from '@/context/ThemeContext';
import { useThemeAwareToast } from '@/utils/toast';

function ProductModal({ isVisible, onClose, modalItem, shouldCloseOnOverlayClick, sellItem }) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { item, myAccountList } = modalItem;;
  const { theme } = useTheme();
  const toast = useThemeAwareToast(theme === 'dark');

  if (!isVisible) return null

  const onSubmit = async (data) => {
    const loadingToast = toast.loading(toast.messages.product.selling);
    try {
        if(!data.accountId) {
            throw new Error(toast.messages.error.validation);
        }

        await sellItem(data);
        toast.dismiss(loadingToast);
        toast.success(toast.messages.product.sold);
        onClose();
    } catch (error) {
        toast.dismiss(loadingToast);
        toast.error(error);
    }
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={() => shouldCloseOnOverlayClick ? onClose() : null}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Sell Product
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
            >
              <HiX className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Modal Content */}
          <form onSubmit={handleSubmit(sellItem)}>
            <div className="p-6">
              {/* Product Details */}
              <div className="flex items-start space-x-4 mb-6">
                <div className="relative w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                  <Image
                    src={item.itemImage || '/ChainTrack-VW.png'}
                    alt={item.name}
                    layout="fill"
                    objectFit="contain"
                    className="p-2"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    {item.name}
                  </h4>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      ID: {item.barcodeId}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      MFG: {item.manufacturedDate}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      EXP: {item.expiringDate}
                    </p>
                  </div>
                </div>
              </div>

              {/* Hidden Input */}
              <input 
                {...register("barcodeId", { required: true })} 
                value={item.barcodeId} 
                type="hidden" 
              />

              {/* Select Buyer */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Sell to:
                </label>
                <select
                  {...register("accountId", { required: true })}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:border-chainTColors-500 dark:focus:border-chainTColors-400 focus:ring-1 focus:ring-chainTColors-500 dark:focus:ring-chainTColors-400"
                >
                  {myAccountList && myAccountList.length > 0 && myAccountList.map((account, index) => (
                    <option key={index} value={account.accountId}>
                      {account.name}
                    </option>
                  ))}
                </select>
                {errors.accountId && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    Please select a buyer
                  </p>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-chainTColors-600 dark:bg-chainTColors-700 rounded-lg hover:bg-chainTColors-700 dark:hover:bg-chainTColors-600 transition-colors duration-200"
              >
                Confirm Sale
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default ProductModal