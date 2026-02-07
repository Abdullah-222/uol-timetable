import { Github, Linkedin, Mail, MessageCircle } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-dark-bg border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent-cyan to-accent-yellow">
              UOL Timetable
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Simplifying student life with an intelligent, automated timetable generator.
              Designed for efficiency and ease of use.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="/" className="hover:text-accent-cyan transition-colors">Home</a>
              </li>
              <li>
                <a href="/generator" className="hover:text-accent-cyan transition-colors">Generator</a>
              </li>
              <li>
                <a href="#about" className="hover:text-accent-cyan transition-colors">About</a>
              </li>
            </ul>
          </div>

          {/* Contact & Socials */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Connect</h4>
            <div className="flex flex-col space-y-3">
              <a
                href="https://wa.me/+923104342711"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-gray-400 hover:text-green-400 transition-colors group"
              >
                <div className="p-2 bg-white/5 rounded-full group-hover:bg-green-400/10 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <span>+92 310 4342711</span>
              </a>

              <a
                href="mailto:abbddullahh1122@gmail.com"
                className="flex items-center space-x-3 text-gray-400 hover:text-accent-cyan transition-colors group"
              >
                <div className="p-2 bg-white/5 rounded-full group-hover:bg-accent-cyan/10 transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <span>abbddullahh1122@gmail.com</span>
              </a>

              <a
                href="https://www.linkedin.com/in/abdullah-web"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-gray-400 hover:text-blue-400 transition-colors group"
              >
                <div className="p-2 bg-white/5 rounded-full group-hover:bg-blue-400/10 transition-colors">
                  <Linkedin className="w-4 h-4" />
                </div>
                <span>LinkedIn Profile</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} UOL Timetable. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
