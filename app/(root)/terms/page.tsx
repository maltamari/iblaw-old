import HeroSection from '@/components/Global/hero'
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Review the terms and conditions governing the use of the IBLaw website and services.",
};
function page() {
  return (
    <> 
      <HeroSection
        image={"/abouthero.png"}
        text={"Terms & Conditions"}
        className={"object-conver h-120"}
        textClass="w-full"
        aboutClass="justify-center"
      />

      <div className="min-h-screen w-full">
        <div className="max-w-5xl mx-auto px-6 py-12">

          {/* Last Updated */}
          <p className="text-ctext text-sm mb-8 pb-8 border-b border-ctext">
            Last Updated: December 2, 2025
          </p>

          {/* Acceptance of Terms */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-main mb-4">
              Acceptance of Terms
            </h2>
            <p className="text-ctext leading-relaxed">
              Welcome to the International Business Legal Associates (IBLAW) website. By accessing and using this website, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by the terms of this agreement, please do not use this website.
            </p>
          </section>

          {/* Use of Website */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-main mb-4">
              Use of Website
            </h2>
            <p className="text-ctext leading-relaxed mb-4">
              This website is provided for informational purposes only. You may access and use the website for lawful purposes only. You agree not to use the website:
            </p>
            <ul className="list-disc pl-6 space-y-3 text-ctext">
              <li>In any way that violates any applicable national or international law or regulation</li>
              <li>To transmit advertising or promotional material without prior written consent</li>
              <li>To impersonate IBLAW or any related entity</li>
              <li>In any illegal, fraudulent, or harmful manner</li>
              <li>To interfere with others’ use of the website</li>
            </ul>
          </section>

          {/* Intellectual Property Rights */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-main mb-4">
              Intellectual Property Rights
            </h2>
            <p className="text-ctext leading-relaxed mb-4">
              All content on this website is the property of IBLAW or its licensors and is protected by applicable intellectual property laws.
            </p>
            <p className="text-ctext leading-relaxed">
              You may not reproduce or reuse site materials without prior written consent.
            </p>
          </section>

          {/* User Contributions */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-main mb-4">
              User Contributions
            </h2>
            <p className="text-ctext leading-relaxed">
              Information submitted via forms or emails may be used to respond to inquiries and provide services.
            </p>
          </section>

          {/* Privacy */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-main mb-4">
              Privacy and Data Protection
            </h2>
            <p className="text-ctext leading-relaxed">
              Use of personal data is governed by our Privacy and Cookie Policies.
            </p>
          </section>

          {/* Third-Party Links */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-main mb-4">
              Links to Third-Party Websites
            </h2>
            <p className="text-ctext leading-relaxed">
              IBLAW is not responsible for third-party website content or policies.
            </p>
          </section>

          {/* Disclaimer */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-main mb-4">
              Disclaimer of Warranties
            </h2>
            <p className="text-ctext leading-relaxed">
              This website is provided “as is” without warranties of any kind.
            </p>
          </section>

          {/* Limitation */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-main mb-4">
              Limitation of Liability
            </h2>
            <p className="text-ctext leading-relaxed">
              IBLAW shall not be liable for indirect or consequential damages.
            </p>
          </section>

          {/* Indemnification */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-main mb-4">
              Indemnification
            </h2>
            <p className="text-ctext leading-relaxed">
              You agree to indemnify IBLAW against claims arising from misuse.
            </p>
          </section>

          {/* Governing Law */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-main mb-4">
              Governing Law
            </h2>
            <p className="text-ctext leading-relaxed">
              These terms are governed by the laws of Jordan.
            </p>
          </section>

          {/* Changes */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-main mb-4">
              Changes to Terms
            </h2>
            <p className="text-ctext leading-relaxed">
              Terms may be updated periodically with notice on this page.
            </p>
          </section>

          {/* Contact */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-main mb-6">
              Contact Us
            </h2>
            <p className="text-ctext leading-relaxed mb-6">
              If you have questions, contact us:
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

export default page
