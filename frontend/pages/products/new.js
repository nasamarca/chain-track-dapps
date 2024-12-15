import React, { useEffect, useState } from 'react'
import { AiFillPlusCircle, AiFillMinusCircle } from "react-icons/ai";
import { HiOutlineArrowLeft } from "react-icons/hi";
import { useListState } from '@mantine/hooks';
import { useForm } from 'react-hook-form';
import { useAccount, useSigner } from 'wagmi';
import { Contract } from 'ethers';
import { CHAINTRACK_ABI, CHAINTRACK_ADDRESS } from '@/constants';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import { useThemeAwareToast } from '@/utils/toast';
import { useRouter } from 'next/router';

function AddProduct() {
    const router = useRouter();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const [isCheckingRole, setIsCheckingRole] = useState(true);
    const { theme } = useTheme();
    const toast = useThemeAwareToast(theme === 'dark');

    const urlPattern = new RegExp('^(https?:\\/\\/)?'+ // validate protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // validate domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // validate OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // validate port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // validate query string
    '(\\#[-a-z\\d_]*)?$','i'); // validate fragment locator

    const { data: signer } = useSigner()
    const { isConnected, address } = useAccount();

    // Check if user is manufacturer
    useEffect(() => {
        const checkManufacturerRole = async () => {
            if (!isConnected || !signer) {
                toast.error(toast.messages.wallet.required);
                router.push('/products');
                return;
            }

            try {
                const contractInstance = new Contract(
                    CHAINTRACK_ADDRESS,
                    CHAINTRACK_ABI,
                    signer
                );

                const myDetails = await contractInstance.getMyDetails();
                // Role 0 is Manufacturer in the enum AccountRole
                if (myDetails.role !== 0) {
                    toast.error("Only manufacturers can add new products");
                    router.push('/products');
                    return;
                }
            } catch (error) {
                console.error('Error checking role:', error);
                toast.error("Error checking user role");
                router.push('/products');
                return;
            }

            setIsCheckingRole(false);
        };

        checkManufacturerRole();
    }, [signer, isConnected, router]);
    
    const saveItem = async(formData, e) => {
		const loadingToast = toast.loading(toast.messages.product.adding);
        console.group('🚀 saveItem Function');
        try {
						setLoading(true); 
            console.log('Starting saveItem function');
            if(!isConnected || !signer) {
                throw new Error(toast.messages.wallet.required);
            }
    
            // 1. Log koneksi dan environment
            console.group('🔌 Connection Info:');
            console.log("Contract address:", CHAINTRACK_ADDRESS);
            console.log("Connected wallet:", address);
            const network = await signer.provider.getNetwork();
            console.log("Network:", {
                chainId: network.chainId,
                name: network.name
            });
            console.groupEnd();
    
            // 2. Log data form yang diterima
            console.group('📝 Form Data:');
            console.log("Raw form data:", formData);
            console.table({
                name: formData.name,
                manufacturerName: formData.manufacturerName,
                manufacturedDate: formData.manufacturedDate,
                expiringDate: formData.expiringDate,
                barcodeId: formData.barcodeId,
                itemType: formData.itemType,
                usage: formData.usage
            });
            console.groupEnd();
    
            console.log('Creating contract instance');
            const contractInstance = new Contract(
                CHAINTRACK_ADDRESS,
                CHAINTRACK_ABI,
                signer
            );
    
            // 3. Log konversi tanggal
            console.group('📅 Date Conversion:');
            const manufacturedDate = Math.floor(new Date(formData.manufacturedDate).getTime() / 1000);
            const expiringDate = Math.floor(new Date(formData.expiringDate).getTime() / 1000);
            
            console.log("Manufactured Date:", {
                input: formData.manufacturedDate,
                timestamp: manufacturedDate,
                converted: new Date(manufacturedDate * 1000).toLocaleString()
            });
            
            console.log("Expiring Date:", {
                input: formData.expiringDate,
                timestamp: expiringDate,
                converted: new Date(expiringDate * 1000).toLocaleString()
            });
            console.groupEnd();
    
            // 4. Log data yang akan disimpan
            const itemToSave = {
                name: formData.name,
                manufacturerName: formData.manufacturerName,
                manufacturer: address,
                manufacturedDate: manufacturedDate,
                expiringDate: expiringDate,
                isInBatch: formData.isInBatch === 'batch',
                batchCount: 0,
                barcodeId: formData.barcodeId,
                itemImage: formData.itemImage || "",
                itemType: parseInt(formData.itemType),
                usage: formData.usage || "",
                others: [...sideEffectsList, ...compositionList]
            };
    
            console.group('💾 Item Data:');
            console.log("Final item data:", itemToSave);
            console.groupEnd();
    
            console.log('Preparing transaction data');
            const currentTimestamp = Math.floor(Date.now() / 1000);
    
            console.log('Estimating gas');
            let gasEstimate;
            try {
                gasEstimate = await contractInstance.estimateGas.addNewItem(
                    itemToSave,
                    currentTimestamp
                );
                console.log("Initial gas estimate:", gasEstimate.toString());
            } catch (gasEstimateError) {
                console.error('Gas estimation failed:', gasEstimateError);
                throw new Error(toast.messages.transaction.gasFailed);
            }
    
            console.log('Preparing transaction options');
            let gasLimit = Math.floor(gasEstimate.toNumber() * 1.2); // 20% buffer
            console.log("Gas limit with buffer:", gasLimit);
    
            console.log('Sending transaction');
            let tx;
            try {
                tx = await contractInstance.addNewItem(
                    itemToSave,
                    currentTimestamp,
                    { gasLimit }
                );
                console.log("Transaction sent:", tx.hash);

				toast.dismiss(loadingToast);
                toast.loading(toast.messages.transaction.sent);

            } catch (txError) {
                console.error('Transaction failed:', txError);
                if (txError.code === 'UNPREDICTABLE_GAS_LIMIT') {
                    console.log('Attempting with higher gas limit');
                    toast.loading(toast.messages.transaction.gasRetry);

                    gasLimit = Math.floor(gasLimit * 1.5); // Increase by 50%

                    console.log("New gas limit:", gasLimit);
                    tx = await contractInstance.addNewItem(
                        itemToSave,
                        currentTimestamp,
                        { gasLimit }
                    );
                    console.log("Transaction sent with higher gas limit:", tx.hash);
                } else {
                    throw txError;
                }
            }
    
            console.log('Waiting for transaction confirmation');
            const receipt = await tx.wait();
            console.log("Transaction confirmed:", {
                blockNumber: receipt.blockNumber,
                gasUsed: receipt.gasUsed.toString(),
                status: receipt.status
            });

			toast.dismiss();
            toast.success(toast.messages.product.added);

            console.log('Resetting form');
            e.target.reset();
            addSideEffecstList.setState([]);
            addCompositionList.setState([]);
            
            console.log('Product added successfully');
            router.push('/products');
            // alert("Product added successfully!");
            
        } catch (error) {
            console.group('❌ Error Details:');
            console.error('Error object:', error);

			toast.dismiss(loadingToast);
            toast.error(error);

            console.error('Error name:', error.name);
            console.error('Error message:', error.message);
            if (error.code) console.error('Error code:', error.code);
            if (error.data) console.error('Error data:', error.data);
            if (error.stack) console.error('Error stack:', error.stack);
            console.groupEnd();
            
            let errorMessage = 'An unexpected error occurred. Please try again.';
            if (error.message) {
                errorMessage = error.message;
            } else if (error.reason) {
                errorMessage = error.reason;
            }
            
            // alert(`Error adding item: ${errorMessage}`);
        } finally {
			setLoading(false);
            console.groupEnd(); // Close the 'saveItem Function' group
        }
    };
    
    // side effects
    const [sideEffect, addSideEffect] = useState('');
    const [sideEffectsList, addSideEffecstList] = useListState([]);
    const appendSideEffect = () => {
        if(sideEffect === '' || sideEffect === undefined) return;
        addSideEffecstList.append(sideEffect);
        addSideEffect('');
    };
    const deleteSideEffect = (index) => {
        addSideEffecstList.remove(index);
    }

    // compositions
    const [composition, addComposition] = useState('');
    const [compositionList, addCompositionList] = useListState([]);
    const appendComposition = () => {
        if(composition === '' || composition === undefined) return;
        addCompositionList.append(composition);
        addComposition('');
    };
    const deleteComposition = (index) => {
        addCompositionList.remove(index);
    }

    // Show loading state while checking role
    if (isCheckingRole) {
        return (
            <div className="min-h-screen pt-20 px-4 md:px-8 bg-white dark:bg-black transition-colors duration-200 flex items-center justify-center">
                <div className="text-gray-600 dark:text-gray-400">
                    Checking permissions...
                </div>
            </div>
        );
    }

    return (
			<div className="min-h-screen pt-20 px-4 md:px-8 bg-white dark:bg-black transition-colors duration-200 mb-8">
					<div className="max-w-7xl mx-auto">
							{/* Back Button */}
							<Link 
									href="/products"
									className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-chainTColors-600 dark:hover:text-chainTColors-400 transition-colors duration-200 mb-8"
							>
									<HiOutlineArrowLeft className="w-5 h-5 mr-2" />
									Back to Products
							</Link>

							<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.5 }}
									className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
							>
									<form onSubmit={handleSubmit(saveItem)} className="divide-y divide-gray-200 dark:divide-gray-700">
											{/* Header */}
											<div className="px-6 py-5">
													<h1 className="text-2xl font-bold text-gray-900 dark:text-white">
															Add New Product
													</h1>
													<p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
															Fill in the information below to add a new product to the blockchain
													</p>
											</div>

											{/* Form Content */}
											<div className="px-6 py-6 space-y-8">
													{/* Basic Information */}
													<section>
															<h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
																	Basic Information
															</h2>
															<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
																	{/* Manufacturer Name */}
																	<div>
																			<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
																					Manufacturer Name
																			</label>
																			<input
																					{...register("manufacturerName", { required: true })}
																					type="text"
																					className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-chainTColors-500"
																			/>
																			{errors.manufacturerName && (
																					<p className="mt-1 text-sm text-red-600">This field is required</p>
																			)}
																	</div>

																	{/* Manufacturing Date */}
																	<div>
																			<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
																					Manufacturing Date
																			</label>
																			<input
																					{...register("manufacturedDate", { required: true })}
																					type="date"
																					defaultValue={new Date().toISOString().split('T')[0]}
																					className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-chainTColors-500"
																			/>
																	</div>

																	{/* Product Name */}
																	<div>
																			<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
																					Product Name
																			</label>
																			<input
																					{...register("name", { required: true })}
																					type="text"
																					className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-chainTColors-500"
																			/>
																			{errors.name && (
																					<p className="mt-1 text-sm text-red-600">This field is required</p>
																			)}
																	</div>

																	{/* Expiry Date */}
																	<div>
																			<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
																					Expiry Date
																			</label>
																			<input
																					{...register("expiringDate", { required: true })}
																					type="date"
																					className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-chainTColors-500"
																			/>
																			{errors.expiringDate && (
																					<p className="mt-1 text-sm text-red-600">This field is required</p>
																			)}
																	</div>
															</div>
													</section>

													{/* Product Details */}
													<section>
															<h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
																	Product Details
															</h2>
															<div className="space-y-6">
																	{/* Product Type Radio */}
																	<div>
																			<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
																					Product Type
																			</label>
																			<div className="flex space-x-6">
																					<div className="flex items-center">
																							<input
																									{...register("isInBatch", { required: true })}
																									type="radio"
																									value="individual"
																									id="type-individual"
																									defaultChecked
																									className="w-4 h-4 text-chainTColors-600 border-gray-300 focus:ring-chainTColors-500"
																							/>
																							<label htmlFor="type-individual" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
																									Individual
																							</label>
																					</div>
																					<div className="flex items-center">
																							<input
																									{...register("isInBatch", { required: true })}
																									type="radio"
																									value="batch"
																									id="type-batch"
																									className="w-4 h-4 text-chainTColors-600 border-gray-300 focus:ring-chainTColors-500"
																							/>
																							<label htmlFor="type-batch" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
																									Batch
																							</label>
																					</div>
																			</div>
																	</div>
																	{/* Product ID */}
																	<div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Product ID
                                            <span className="ml-2 text-xs text-gray-400">(e.g., F0212522542)</span>
                                        </label>
                                        <input
                                            {...register("barcodeId", { required: true })}
                                            type="text"
                                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-chainTColors-500"
                                        />
                                        {errors.barcodeId && (
                                            <p className="mt-1 text-sm text-red-600">This field is required</p>
                                        )}
                                    </div>

                                    {/* Product Image URL */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Product Image URL
                                        </label>
                                        <input
                                            {...register("itemImage", { required: true, pattern: urlPattern })}
                                            type="url"
                                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-chainTColors-500"
                                            placeholder="https://"
                                        />
                                        {errors.itemImage && (
                                            <p className="mt-1 text-sm text-red-600">Please enter a valid URL</p>
                                        )}
                                    </div>

                                    {/* Product Type Select */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Product Category
                                        </label>
                                        <select
                                            {...register("itemType")}
                                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-chainTColors-500"
                                        >
                                            <option value="0">Antibiotics</option>
                                            <option value="1">Antimalaria</option>
                                            <option value="2">Analgestics</option>
                                            <option value="3">Supplements</option>
                                            <option value="4">Steroids</option>
                                        </select>
                                    </div>
                                </div>
                            </section>

                            {/* Additional Information */}
                            <section>
                                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                    Additional Information
                                </h2>
                                
                                {/* Side Effects */}
                                <div className="space-y-4 mb-6">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Side Effects
                                    </label>
                                    <div className="flex gap-4">
                                        <input
                                            type="text"
                                            value={sideEffect}
                                            onChange={(e) => addSideEffect(e.target.value)}
                                            className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-chainTColors-500"
                                            placeholder="Add side effect"
                                        />
                                        <button
                                            type="button"
                                            onClick={appendSideEffect}
                                            className="p-2 rounded-lg bg-chainTColors-50 dark:bg-chainTColors-900/30 text-chainTColors-600 dark:text-chainTColors-400 hover:bg-chainTColors-100 dark:hover:bg-chainTColors-900/50"
                                        >
                                            <AiFillPlusCircle size={24} />
                                        </button>
                                    </div>
                                    {/* Side Effects List */}
                                    <div className="space-y-2">
                                        {sideEffectsList.map((effect, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                                <span className="text-sm text-gray-700 dark:text-gray-300">{effect}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => deleteSideEffect(index)}
                                                    className="text-red-500 hover:text-red-600"
                                                >
                                                    <AiFillMinusCircle size={20} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Composition */}
                                <div className="space-y-4 mb-6">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Composition
                                    </label>
                                    <div className="flex gap-4">
                                        <input
                                            type="text"
                                            value={composition}
                                            onChange={(e) => addComposition(e.target.value)}
                                            className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-chainTColors-500"
                                            placeholder="Add composition"
                                        />
                                        <button
                                            type="button"
                                            onClick={appendComposition}
                                            className="p-2 rounded-lg bg-chainTColors-50 dark:bg-chainTColors-900/30 text-chainTColors-600 dark:text-chainTColors-400 hover:bg-chainTColors-100 dark:hover:bg-chainTColors-900/50"
                                        >
                                            <AiFillPlusCircle size={24} />
                                        </button>
                                    </div>
                                    {/* Composition List */}
                                    <div className="space-y-2">
                                        {compositionList.map((comp, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                                <span className="text-sm text-gray-700 dark:text-gray-300">{comp}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => deleteComposition(index)}
                                                    className="text-red-500 hover:text-red-600"
                                                >
                                                    <AiFillMinusCircle size={20} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Prescription */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Prescription Details
                                    </label>
                                    <textarea
                                        {...register("usage", { required: true })}
                                        rows={4}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-chainTColors-500"
                                    />
                                    {errors.usage && (
                                        <p className="mt-1 text-sm text-red-600">This field is required</p>
                                    )}
                                </div>
                            </section>
                        </div>

                        {/* Form Actions */}
                        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 flex justify-end space-x-4">
                            <Link
                                href="/products"
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-chainTColors-500"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 text-sm font-medium text-white bg-chainTColors-600 dark:bg-chainTColors-700 border border-transparent rounded-lg hover:bg-chainTColors-700 dark:hover:bg-chainTColors-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-chainTColors-500 disabled:opacity-50"
                            >
                                {loading ? 'Adding Product...' : 'Add Product'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}

export default AddProduct;

