import '@/styles/globals.css'
import { WagmiConfig, createClient } from "wagmi";
import { ConnectKitProvider, getDefaultClient } from "connectkit";
import { sepolia } from "wagmi/chains";
import Nav from '../components/Nav'
import ContextWrapper from '../context/ContextWrapper';
import { ThemeProvider } from '../context/ThemeContext';
import styles from '@/styles/Home.module.css'
import Footer from '@/components/Footer';
import { Toaster } from 'react-hot-toast';


const alchemyId = 'MQkgZZFT7jTr83bqyfibSEhJtetlCD2j';
const chains = [sepolia];

const client = createClient(
  getDefaultClient({
    appName: "Chain Track",
    alchemyId,
    chains,
  }),
);

export default function App({ Component, pageProps }) {
  return (
    <WagmiConfig client={client}>
      <ConnectKitProvider>
        <ThemeProvider> 
          <ContextWrapper>
            <div className={styles.landingpage}>
              <div className='h-full w-full bg-white dark:bg-black transition-colors duration-200'> 
                {/* Toaster ditempatkan di sini */}
                <Toaster 
                  position="top-right"
                  toastOptions={{
                    className: 'transform-gpu',
                    success: {
                      duration: 5000,
                    },
                    error: {
                      duration: 5000,
                    },
                    loading: {
                      duration: Infinity,
                    },
                    style: {
                      background: 'var(--toast-bg)',
                      color: 'var(--toast-color)',
                    },
                  }}
                />
                <Nav />
                <div className=''>
                  <Component {...pageProps} />
                </div>
                <Footer />
              </div>
            </div>
          </ContextWrapper>
        </ThemeProvider>
      </ConnectKitProvider>
    </WagmiConfig>
  );
};