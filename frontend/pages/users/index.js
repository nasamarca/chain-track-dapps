import React, { useContext, useEffect, useState } from 'react'
import { CiMail } from "react-icons/ci";
import { RiWallet2Line } from "react-icons/ri";
import { BsSearch, BsPerson } from "react-icons/bs"; 
import { useAccount, useContract, useSigner } from 'wagmi';
import { CHAINTRACK_ABI, CHAINTRACK_ADDRESS } from '@/constants';
import { Contract } from 'ethers';
import { useForm } from "react-hook-form";
import { motion } from 'framer-motion';
import Head from 'next/head';
import { useTheme } from '@/context/ThemeContext';
import { useThemeAwareToast } from '@/utils/toast';

// Role mapping
const ROLES = {
    MANUFACTURER: 0,
    DISTRIBUTOR: 1,
    RETAILER: 2,
    CUSTOMER: 3
};

export const metadata = {
  title: "ChainTrack | Users",
  description: "Trace. Verify. Trust. - Revolutionizing Pharmaceutical Integrity Through Blockchain Transparency",
  icons: {
    icon: "/favicon.ico",
  },
}

function UserCard({user}) {
	const getRoleName = (role) => {
			switch(role) {
					case ROLES.MANUFACTURER: return "Manufacturer";
					case ROLES.DISTRIBUTOR: return "Distributor";
					case ROLES.RETAILER: return "Retailer";  
					case ROLES.CUSTOMER: return "Customer";
					default: return "Unknown";
			}
	};

	const getRoleColor = (role) => {
			switch(role) {
					case ROLES.MANUFACTURER: return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
					case ROLES.DISTRIBUTOR: return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
					case ROLES.RETAILER: return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
					case ROLES.CUSTOMER: return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
					default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
			}
	};
    
	return (
		<motion.div
				whileHover={{ y: -5 }}
				className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-all duration-200 border border-gray-100 dark:border-gray-700'
		>
				<div className="flex items-start justify-between mb-4">
						<div className="flex-1">
								<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
										{user.name}
								</h3>
								<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
										{getRoleName(user.role)}
								</span>
						</div>
						<div className="w-10 h-10 rounded-full bg-chainTColors-100 dark:bg-chainTColors-900/30 flex items-center justify-center">
								<BsPerson className="w-6 h-6 text-chainTColors-600 dark:text-chainTColors-400" />
						</div>
				</div>

				<div className="space-y-3">
						<div className="flex items-center space-x-3 text-gray-600 dark:text-gray-300">
								<CiMail className="w-5 h-5 text-chainTColors-500 dark:text-chainTColors-400" />
								<p className="text-sm">{user.email}</p>
						</div>

						<div className="flex items-center space-x-3 text-gray-600 dark:text-gray-300">
								<RiWallet2Line className="w-5 h-5 text-chainTColors-500 dark:text-chainTColors-400" />
								<p className="text-sm font-mono">{user.accountId}</p>
						</div>
				</div>
		</motion.div>
	)
}

function AddProduct() {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const { data: signer } = useSigner()
    const { isConnected } = useAccount()
    const [search, setSearch] = useState('');
    const [usersList, setUsersList] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentUserRole, setCurrentUserRole] = useState(null);
		const { theme } = useTheme();
    const toast = useThemeAwareToast(theme === 'dark');

    // Get current user role when component mounts
    const getCurrentUserRole = async () => {
        try {
            if(isConnected && signer) {
                const contract = new Contract(CHAINTRACK_ADDRESS, CHAINTRACK_ABI, signer);
                const myDetails = await contract.getMyDetails();
                setCurrentUserRole(myDetails.role);
                console.log("Current user role:", myDetails.role);
            }
        } catch (error) {
            console.error("Error getting current user role:", error);
        }
    };

    const saveUser = async(user) => {
			const loadingToast = toast.loading(toast.messages.user.adding);
        console.log(user)
        try {
            if(!isConnected || !signer) {
                throw new Error(toast.messages.wallet.required);
            }
            if(isConnected) {
        
                const contractInstance = new Contract(
                    CHAINTRACK_ADDRESS,
                    CHAINTRACK_ABI,
                    signer
                );
                console.log("🚀 ~ file: index.js:66 ~ saveUser ~ contractInstance", contractInstance)
                
                let newUserRole;
                switch(currentUserRole) {
                    case ROLES.MANUFACTURER:
                        newUserRole = ROLES.DISTRIBUTOR;
                        break;
                    case ROLES.DISTRIBUTOR:
                        newUserRole = ROLES.RETAILER;
                        break;
                    case ROLES.RETAILER:
                        newUserRole = ROLES.CUSTOMER;
                        break;
                    default:
                        throw new Error("Not authorized to add users");
                }

                const userData = {
                    role: newUserRole,
                    accountId: user.accountId,
                    name: user.name,
                    email: user.email
                };

                console.log("Adding user with data:", userData);

                // Estimate gas with 20% buffer
                let gasEstimate;
                try {
                    gasEstimate = await contractInstance.estimateGas.addParty(userData);
                    console.log("Initial gas estimate:", gasEstimate.toString());
                } catch (gasEstimateError) {
                    console.error('Gas estimation failed:', gasEstimateError);
                    throw new Error(toast.messages.transaction.gasFailed);
                }
        
                console.log('Preparing transaction options');
                let gasLimit = Math.floor(gasEstimate * 1.2); // 20% buffer
                console.log("Gas limit with buffer:", gasLimit);
                setLoading(true);
                
                console.log('Sending transaction');
                let tx;
                try {
                    tx = await contractInstance.addParty(userData, { gasLimit });
										toast.dismiss(loadingToast);
            				toast.loading(toast.messages.transaction.sent);
										
										const receipt = await tx.wait();
										toast.dismiss();
										toast.success(toast.messages.user.added);

										// Reset form and refresh list
										reset();
										await getMyAccountsList();
                    console.log("Transaction sent:", tx.hash);

                } catch (txError) {
                    console.error('Transaction failed:', txError);
                    if (txError.code === 'UNPREDICTABLE_GAS_LIMIT') {
												toast.loading(toast.messages.transaction.gasRetry);
                        gasLimit = Math.floor(gasLimit * 1.5); // Increase by 50%
                        console.log("New gas limit:", gasLimit);
                        tx = await contractInstance.addParty(userData, { gasLimit });
                        console.log("Transaction sent with higher gas limit:", tx.hash);
                    } else {
                        throw txError;
                    }
                }
                // const tx = await contractInstance.addParty(user, { gasLimit });

                // const tx = await contractInstance.addParty(user);
                console.log('Waiting for transaction confirmation');
                const receipt = await tx.wait();
                console.log("Transaction confirmed:", {
                    blockNumber: receipt.blockNumber,
                    gasUsed: receipt.gasUsed.toString(),
                    status: receipt.status
                });
                setLoading(false)

                // Reset form and refresh list
                reset();
                await getMyAccountsList();
                alert("User added successfully!");
                    
                }

        } catch (error) {
						toast.dismiss(loadingToast);
       		 	toast.error(error);
            console.log('Could not add user', error);
            setLoading(false);
        }
    }
    
    const getMyAccountsList = async() => {
			const loadingToast = toast.loading(toast.messages.user.loading);
        try {
            if(isConnected) {

                const contractInstance = new Contract(
                    CHAINTRACK_ADDRESS,
                    CHAINTRACK_ABI,
                    signer
                );
                
                const myUsersList = await contractInstance.getMyAccountsList();
                setUsersList(myUsersList);
                console.log("Updated users list:", list); 
								toast.dismiss(loadingToast);                              
            }
        } catch (error) {
            console.log('Could not add user', error);
						toast.dismiss(loadingToast);
        		// toast.error(toast.messages.user.loadFailed);
        }
    }
    const handleSaveUser = async (e) => {
        e.preventDefault()
        await saveUser();
    }

    useEffect(() => {
        if(signer) {
            getCurrentUserRole();
            getMyAccountsList();
        }
    }, [signer, isConnected]);

		// Test
    const getUserTypeLabel = () => {
        switch(currentUserRole) {
            case ROLES.MANUFACTURER: return "Distributor";
            case ROLES.DISTRIBUTOR: return "Retailer";
            case ROLES.RETAILER: return "Customer";
            default: return "User";
        }
    };

		return (
			<>
				<Head>
					<title>{metadata.title}</title>
					<meta name="description" content={metadata.description} />
					<link rel="icon" href={metadata.icons.icon} />
      </Head>
				<div className="min-h-screen pt-20 px-4 md:px-8 bg-white dark:bg-black transition-colors duration-200">
						<div className="max-w-7xl mx-auto">
								<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
										{/* Add New User Section */}
										<motion.div
												initial={{ opacity: 0, y: 20 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ duration: 0.5 }}
												className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
										>
												<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
														Add New User
												</h2>

												<form onSubmit={handleSubmit(saveUser)} className="space-y-6">
														<div>
																<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
																		Name
																</label>
																<input
																		{...register("name", { required: true })}
																		className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-chainTColors-500 dark:focus:ring-chainTColors-400"
																		type="text"
																/>
																{errors.name && (
																		<p className="mt-1 text-sm text-red-600 dark:text-red-400">
																				Name is required
																		</p>
																)}
														</div>

														<div>
																<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
																		Email
																</label>
																<input
																		{...register("email", { required: true })}
																		className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-chainTColors-500 dark:focus:ring-chainTColors-400"
																		type="email"
																/>
																{errors.email && (
																		<p className="mt-1 text-sm text-red-600 dark:text-red-400">
																				Email is required
																		</p>
																)}
														</div>

														<div>
																<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
																		Wallet Address
																</label>
																<input
																		{...register("accountId", { required: true })}
																		className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-chainTColors-500 dark:focus:ring-chainTColors-400"
																		type="text"
																/>
																{errors.accountId && (
																		<p className="mt-1 text-sm text-red-600 dark:text-red-400">
																				Wallet address is required
																		</p>
																)}
														</div>

														<button
																type="submit"
																disabled={loading}
																className="w-full px-4 py-2 text-white bg-chainTColors-600 hover:bg-chainTColors-700 dark:bg-chainTColors-700 dark:hover:bg-chainTColors-600 rounded-lg transition-colors duration-200 disabled:opacity-50"
														>
																{loading ? 'Saving...' : 'Save User'}
														</button>

														<div className='flex items-center justify-center'>
															<img src="/ChainTrack-GreenHor.svg" alt="ChainTrack" className="w-auto h-auto" /> 
														</div>
												</form>
										</motion.div>

										{/* Users List Section */}
										<motion.div
												initial={{ opacity: 0, y: 20 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ duration: 0.5, delay: 0.2 }}
												className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
										>
												<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
														Existing Users
												</h2>

												<div className="relative mb-6">
														<input
																value={search}
																onChange={(e) => setSearch(e.target.value)}
																className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-chainTColors-500 dark:focus:ring-chainTColors-400"
																type="search"
																placeholder="Search users..."
														/>
														<BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
												</div>

												<div className="space-y-4">
														{usersList && usersList
																.filter((user) => {
																		const query = search.toLowerCase();
																		return query === '' ? user : (
																				user.name.toLowerCase().includes(query) || 
																				user.email.toLowerCase().includes(query)
																		);
																})
																.map((user, idx) => (
																		<UserCard key={idx} user={user} />
																))
														}
												</div>
										</motion.div>
								</div>
						</div>
				</div>
			</>
	);
}

export default AddProduct