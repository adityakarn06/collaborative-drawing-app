import { Pencil } from "lucide-react";

export default function Footer() {
    return (
        <footer className="border-t border-gray-100 py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Pencil className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-900">DrawBoard</span>
            </div>
            <p className="text-gray-600">
              © 2025 DrawBoard. Made with ❤️ for creators everywhere.
            </p>
          </div>
        </div>
      </footer>
    )
}