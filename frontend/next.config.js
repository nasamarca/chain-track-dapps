/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'pharmacy.uii.ac.id',
      'via.placeholder.com',
      'www.novapharin.co.id',
      'novapharin.co.id',
      // tambahkan domain lain yang Anda gunakan
    ],
  },

}

module.exports = nextConfig
