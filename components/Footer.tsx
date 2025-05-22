import { Facebook, Twitter, Instagram, Linkedin, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="text-gray-800 dark:text-white">
      <div className="container mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">About StockDataTable</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Empowering investors with real-time stock data, advanced analytics, and comprehensive market insights.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
                >
                  Stocks
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
                >
                  Market News
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
                >
                  Screener
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
                >
                  Subscription Plans
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Contact Us</h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li>123 Finance Street</li>
              <li>Belgaum, Karnataka</li>
              <li>Phone: (+91) 890 433 1718</li>
              <li>Email: info@stocker.co.in</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 dark:text-gray-300 text-sm">© 2025 Stocker. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a
              href="#"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
            >
              <Facebook size={20} />
            </a>
            <a
              href="#"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
            >
              <Twitter size={20} />
            </a>
            <a
              href="#"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
            >
              <Instagram size={20} />
            </a>
            <a
              href="#"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
            >
              <Linkedin size={20} />
            </a>
            <a
              href="#"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
            >
              <Mail size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

