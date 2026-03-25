
import { Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";
import ContactForm from "../Contacts/form";

// Form validation schema

export default function ContactSection() {
  
  return (
    <div  className=" bg-gray-50 py-16  w-full">
      <div className="max-w-7xl mx-auto ">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <ContactForm/>

          {/* Right Column - Contact Info */}
          <div className="flex flex-col justify-start px-4 sm:px-6 lg:px-8 ">
            <div className="mb-8">
              <h1 className="text-5xl font-bold text-main mb-6">
                CONTACT US
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed">
                We&apos;re here to help and answer any question you might have. We
                look forward to hearing from you.
              </p>
            </div>

            <div className="space-y-6">
              {/* Email */}
              <Link
                href="mailto:contact@iblaw.com.jo" 
                className="block"
                >
              <div className="flex items-start gap-4 bg-white rounded-2xl p-6 shadow-md
                transition-transform duration-300  hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-400/20"
                >
                <div className="bg-main rounded-2xl p-4 shrink-0">
                  <Mail className="w-6 h-6 text-white " />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">
                    Email Address
                  </h3>
                  <p className="text-gray-600">contact@iblaw.com.jo</p>
                </div>
              </div>
        </Link>
              {/* Telephone */}
              <Link
                href="tel:+962 6 552 5127" 
                className="block"
                >
              <div className="flex items-start gap-4 bg-white rounded-2xl p-6 shadow-md
              transition-transform duration-300  hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-400/20
              ">
                <div className="bg-main rounded-2xl p-4 shrink-0">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">
                    Telephone
                  </h3>
                  <p className="text-gray-600">+962 6 552 5127</p>
                </div>
              </div>
            </Link>
              {/* Address */}
              <Link
                href="https://www.google.com/maps?q=IBLAW+Jordan"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
                >
              <div className="flex items-start gap-4 bg-white rounded-2xl p-6 shadow-md
              transition-transform duration-300  hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-400/20
              ">
                <div className="bg-main rounded-2xl p-4 shrink-0">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">
                    Address
                  </h3>
                  <p className="text-gray-600">
                    P O Box 9028 Amman 11191 Jordan
                  </p>
                </div>
                
              </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}