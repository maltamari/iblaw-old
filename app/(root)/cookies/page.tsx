import HeroSection from '@/components/Global/hero'
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "Read IBLaw's cookie policy and learn how we use cookies to improve user experience and website performance.",
};

function CookiePolicyPage() {
  return (
    <> 
      <HeroSection
        image={"/abouthero.png"}
        text={"Cookie Policy"}
        className={"object-cover h-120"}
        textClass="w-full"
        aboutClass="justify-center"
      />

      <div className="min-h-screen w-full">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">

          {/* Last Updated */}
          <p className="text-ctext text-sm mb-8 pb-8 border-b border-ctext">
            Last Updated: December 2, 2025
          </p>

          {/* What Are Cookies */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-main mb-4">
              What Are Cookies?
            </h2>
            <p className="text-ctext leading-relaxed">
              Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to the website owners. Cookies enable the website to recognize your device and store some information about your preferences or past actions.
            </p>
          </section>

          {/* How We Use Cookies */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-main mb-4">
              How We Use Cookies
            </h2>
            <p className="text-ctext leading-relaxed mb-4">
              International Business Legal Associates (IBLAW) uses cookies to improve your experience on our website and to help us understand how you use our site. We use cookies for the following purposes:
            </p>
            <ul className="space-y-3 text-ctext">
              <li>
                <span className="font-semibold text-main">Essential Cookies:</span> These cookies are necessary for the website to function properly and cannot be switched off in our systems
              </li>
              <li>
                <span className="font-semibold text-main">Performance Cookies:</span> These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously
              </li>
              <li>
                <span className="font-semibold text-main">Functionality Cookies:</span> These cookies enable the website to provide enhanced functionality and personalization
              </li>
              <li>
                <span className="font-semibold text-main">Analytics Cookies:</span> These cookies help us improve our website by collecting information about how visitors use it
              </li>
            </ul>
          </section>

          {/* Types of Cookies We Use */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-main mb-6">
              Types of Cookies We Use
            </h2>

            {/* Strictly Necessary Cookies */}
            <div className="border-l-4 border-main pl-6 mb-8 bg-ctext/10 py-6 pr-6">
              <h3 className="text-xl font-semibold text-main mb-4">
                Strictly Necessary Cookies
              </h3>
              <p className="text-ctext leading-relaxed mb-4">
                These cookies are essential for you to browse the website and use its features. Without these cookies, services you have asked for cannot be provided. These cookies do not gather information about you that could be used for marketing purposes.
              </p>
              <div className="space-y-3">
                <div className="bg-white p-4 rounded border border-gray-200">
                  <p className="text-ctext">
                    <span className="font-semibold text-main">Session Cookie:</span> Maintains your session while you navigate through the website
                  </p>
                </div>
                <div className="bg-white p-4 rounded border border-gray-200">
                  <p className="text-ctext">
                    <span className="font-semibold text-main">Security Cookie:</span> Helps keep your connection to our website secure
                  </p>
                </div>
                <div className="bg-white p-4 rounded border border-gray-200">
                  <p className="text-ctext">
                    <span className="font-semibold text-main">Preference Cookie:</span> Remembers your language and region preferences
                  </p>
                </div>
              </div>
            </div>

            {/* Performance and Analytics Cookies */}
            <div className="border-l-4 border-main pl-6 mb-8 bg-ctext/10 py-6 pr-6">
              <h3 className="text-xl font-semibold text-main mb-4">
                Performance and Analytics Cookies
              </h3>
              <p className="text-ctext leading-relaxed mb-4">
                These cookies collect information about how visitors use our website, such as which pages are visited most often. All information collected by these cookies is aggregated and therefore anonymous. We use this information only to improve how our website works.
              </p>
              <div className="space-y-3">
                <div className="bg-white p-4 rounded border border-gray-200">
                  <p className="text-ctext">
                    <span className="font-semibold text-main">Analytics Cookie:</span> Collects data about website usage and visitor behavior
                  </p>
                </div>
                <div className="bg-white p-4 rounded border border-gray-200">
                  <p className="text-ctext">
                    <span className="font-semibold text-main">Performance Monitoring:</span> Helps us identify and fix technical issues
                  </p>
                </div>
              </div>
            </div>

            {/* Functionality Cookies */}
            <div className="border-l-4 border-main pl-6 mb-8 bg-ctext/10 py-6 pr-6">
              <h3 className="text-xl font-semibold text-main mb-4">
                Functionality Cookies
              </h3>
              <p className="text-ctext leading-relaxed mb-4">
                These cookies allow the website to remember choices you make (such as your language or region) and provide enhanced, more personal features. They may also be used to provide services you have requested.
              </p>
              <div className="space-y-3">
                <div className="bg-white p-4 rounded border border-gray-200">
                  <p className="text-ctext">
                    <span className="font-semibold text-main">User Preference Cookie:</span> Stores your website preferences and settings
                  </p>
                </div>
                <div className="bg-white p-4 rounded border border-gray-200">
                  <p className="text-ctext">
                    <span className="font-semibold text-main">Accessibility Cookie:</span> Remembers accessibility settings you have chosen
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Third-Party Cookies */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-main mb-4">
              Third-Party Cookies
            </h2>
            <p className="text-ctext leading-relaxed mb-4">
              In some cases, we use cookies provided by trusted third parties. These cookies help us provide certain functionality on our website or help us analyze how the website is used.
            </p>
            <p className="text-ctext leading-relaxed">
              Third-party cookies are subject to the privacy policies of the respective third-party service providers. We do not have access to or control over these cookies.
            </p>
          </section>

          {/* Managing Cookies */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-main mb-4">
              Managing Cookies
            </h2>
            <p className="text-ctext leading-relaxed mb-4">
              Most web browsers allow you to control cookies through their settings preferences. However, if you limit the ability of websites to set cookies, you may worsen your overall user experience, as some features may no longer function properly.
            </p>
            <p className="text-ctext leading-relaxed">
              You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed. If you do this, however, you may have to manually adjust some preferences every time you visit a website.
            </p>
          </section>

          {/* Cookie Consent */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-main mb-4">
              Cookie Consent
            </h2>
            <p className="text-ctext leading-relaxed">
              By continuing to use our website, you consent to our use of cookies as described in this policy. If you do not wish to accept cookies from our website, you should configure your browser settings accordingly or refrain from using our website.
            </p>
          </section>

          {/* Changes to This Policy */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-main mb-4">
              Changes to This Policy
            </h2>
            <p className="text-ctext leading-relaxed">
              We may update our Cookies Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the &quot;Last Updated&quot; date. We recommend that you review this policy periodically for any changes.
            </p>
          </section>

          {/* Contact Information */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-main mb-6">
              Contact Information
            </h2>
            <p className="text-ctext leading-relaxed mb-6">
              If you have any questions about our use of cookies, please contact us at:
            </p>

            <div className="border-l-4 border-main pl-6 py-4 bg-ctext/10">
              <div className="space-y-3">
                <p className="text-ctext">
                  <span className="font-semibold text-main">Email:</span> contact@iblaw.com.jo
                </p>
                <p className="text-ctext">
                  <span className="font-semibold text-main">Phone:</span> +962 6 552 5127
                </p>
                <p className="text-ctext">
                  <span className="font-semibold text-main">Address:</span> P O Box 9028, Amman 11191, Jordan
                </p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </>
  )
}

export default CookiePolicyPage