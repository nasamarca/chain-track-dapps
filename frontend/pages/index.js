import Head from 'next/head'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: "ChainTrack - Healthcare Blockchain Solution",
  description: "Trace. Verify. Trust. - Revolutionizing Pharmaceutical Integrity Through Blockchain Transparency",
  icons: {
    icon: "/favicon.ico",
  },
}

export default function Home() {
  const { theme } = useTheme();
  
  return (
    <>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <link rel="icon" href={metadata.icons.icon} />
      </Head>
      <div className={`${styles.landingpage} pt-16`}>
        <main className="min-h-screen w-full relative bg-gradient-to-br from-white via-gray-100 to-gray-200 dark:from-black dark:via-gray-900 dark:to-black transition-colors duration-300 hideScrollbar">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-chainTColors-200/30 dark:bg-chainTColors-800/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-chainColors-200/30 dark:bg-chainColors-800/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-yellow-200/30 dark:bg-yellow-800/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
          </div>

          <div className='container mx-auto px-4 md:px-6 lg:px-8'>
            <div className='flex flex-col min-h-screen justify-center'>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className='max-w-5xl mx-auto text-center'
              >
                <motion.h2
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className='text-xl md:text-2xl font-semibold text-gray-600 dark:text-gray-400 tracking-wider mb-6'
                >
                  Trace. Verify. Trust.
                </motion.h2>

                <h1 className='text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-tight md:leading-tight lg:leading-tight mb-8'>
                  Revolutionizing {' '}
                  <span className='bg-clip-text text-transparent bg-gradient-to-r from-chainTColors-600 to-chainColors-600'>
                  Healthcare
                  </span>
                  , Transparency with{' '}
                  <span className='bg-clip-text text-transparent bg-gradient-to-r from-chainTColors-600 to-chainColors-600'>
                    Blockchain
                  </span>
                </h1>

                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className='text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto'
                >
                  From Manufacturer to Patient: Building an Immutable Chain of Trust in Every Medicine&apos;s Journey
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className='space-x-6'
                >
                  <Link 
                    href='/products' 
                    className='inline-flex items-center px-8 py-4 text-lg font-semibold text-white rounded-xl bg-gradient-to-r from-chainTColors-600 to-chainColors-600 hover:from-chainTColors-500 hover:to-chainColors-500 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl'
                  >
                    Explore Now
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>

                  <Link 
                    href='/about' 
                    className='inline-flex items-center px-8 py-4 text-lg font-semibold text-gray-700 dark:text-gray-200 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-chainTColors-500 dark:hover:border-chainTColors-600 hover:text-chainTColors-600 dark:hover:text-chainTColors-400 transition-all duration-200'
                  >
                    Learn More
                  </Link>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-5xl mx-auto'
                >
                  {[
                    {
                      title: 'Trace',
                      description: 'Track pharmaceutical supply chain in real-time with unparalleled precision',
                      icon: '🔍'
                    },
                    {
                      title: 'Verify',
                      description: 'End-to-end verification ensuring authenticity at every step',
                      icon: '✓'
                    },
                    {
                      title: 'Trust',
                      description: 'Build confidence with transparent, immutable blockchain records',
                      icon: '🛡️'
                    }
                  ].map((feature, index) => (
                    <div
                      key={feature.title}
                      className='p-8 rounded-2xl bg-gray-50 dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 group hover:border-chainTColors-500 dark:hover:border-chainTColors-600'
                    >
                      <div className='text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-200'>
                        {feature.icon}
                      </div>
                      <h3 className='text-2xl font-semibold text-gray-900 dark:text-white mb-3'>
                        {feature.title}
                      </h3>
                      <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}