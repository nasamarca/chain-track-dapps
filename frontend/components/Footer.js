import React from "react";
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from '../context/ThemeContext';
import logoDark from '../public/ChainTrack-Dark.svg'
import logoLight from '../public/ChainTrack-Light.svg'
import { FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa';

function Footer() {
  const { theme } = useTheme();
  
  return (
    <footer className="w-full bg-white dark:bg-black transition-colors duration-200 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-2">
            <Link href="/">
              <Image
                src={theme === 'dark' ? logoDark : logoLight}
                alt="ChainTrack Logo"
                width={150}
                height={40}
                priority
              />
            </Link>
            <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm max-w-md">
              Revolutionizing pharmaceutical supply chain management through blockchain technology. Ensuring transparency, security, and trust in healthcare.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                className="text-gray-400 hover:text-chainTColors-600 dark:hover:text-chainTColors-400 transition-colors duration-200">
                <FaGithub size={24} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                className="text-gray-400 hover:text-chainTColors-600 dark:hover:text-chainTColors-400 transition-colors duration-200">
                <FaTwitter size={24} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                className="text-gray-400 hover:text-chainTColors-600 dark:hover:text-chainTColors-400 transition-colors duration-200">
                <FaLinkedin size={24} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-gray-900 dark:text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              {['Features', 'Products', 'Users'].map((item) => (
                <li key={item}>
                  <Link href={`/${item.toLowerCase()}`} className="text-gray-600 dark:text-gray-400 hover:text-chainTColors-600 dark:hover:text-chainTColors-400 transition-colors duration-200">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-gray-900 dark:text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              {['Documentation', 'Support', 'API'].map((item) => (
                <li key={item}>
                  <Link href={`/${item.toLowerCase()}`} className="text-gray-600 dark:text-gray-400 hover:text-chainTColors-600 dark:hover:text-chainTColors-400 transition-colors duration-200">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-gray-900 dark:text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {['About', 'Contact', 'Privacy'].map((item) => (
                <li key={item}>
                  <Link href={`/${item.toLowerCase()}`} className="text-gray-600 dark:text-gray-400 hover:text-chainTColors-600 dark:hover:text-chainTColors-400 transition-colors duration-200">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              © {new Date().getFullYear()} ChainTrack by Nasamarca. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0 text-sm">
              <Link href="/terms" className="text-gray-600 dark:text-gray-400 hover:text-chainTColors-600 dark:hover:text-chainTColors-400 transition-colors duration-200">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-chainTColors-600 dark:hover:text-chainTColors-400 transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link href="/cookies" className="text-gray-600 dark:text-gray-400 hover:text-chainTColors-600 dark:hover:text-chainTColors-400 transition-colors duration-200">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;