'use client'
export default function Footer() {
    return (
      <footer className="bg-blue-500 text-white text-center p-4 mt-auto">
        <p className="text-base mb-2 font-bold">
          If there's any error, suggestion, or mistake, feel free to contact here:
        </p>
        <div className="flex flex-col items-center gap-2">
          {/* WhatsApp Contact */}
          <a
            href="https://wa.me/+923104342711" // Replace with your actual WhatsApp number
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-900 font-semibold hover:underline"
          >
            WhatsApp: +923104342711
          </a>
  
          {/* Email Contact */}
          <a
            href="mailto:abbddullahh1122@gmail.com" // Replace with your actual email
            className="text-gray-900 font-semibold hover:underline"
          >
            Email: abbddullahh1122@gmail.com
          </a>
        </div>
      </footer>
    );
  }
  