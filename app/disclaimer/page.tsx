import React from 'react';
import HeroSection from '@/components/Global/hero'
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer",
  description:
    "Read IBLaw’s legal disclaimer regarding the information provided on this website.",
};
function TermsAndConditions() {
  return (
    <>
        <HeroSection image={"/abouthero.png"} text={"Disclaimer"} className={"object-center h-120"} textClass='  w-full' aboutClass="justify-center"/>
    
    <div className="min-h-screen bg-white">


      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        {/* Last Updated */}
        <p className="text-ctext text-sm mb-8 pb-8 border-b border-ctext">
          Last Updated: December 2, 2025
        </p>

        {/* General Information */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-main mb-4">
            General Information
          </h2>
          <p className="text-ctext leading-relaxed">
            The information contained on this website is for general information purposes only. While International Business Legal Associates (IBLAW) endeavors to keep the information up to date and correct, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability with respect to the website or the information, products, services, or related graphics contained on the website for any purpose.
          </p>
        </section>

        {/* No Attorney-Client Relationship */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-main mb-4">
            No Attorney-Client Relationship
          </h2>
          <p className="text-ctext leading-relaxed">
            The content of this website does not constitute legal advice and should not be relied upon as such. Transmission of information from this website does not create an attorney-client relationship between you and IBLAW, nor is it intended to do so. If you require legal advice, you should contact IBLAW or another qualified legal professional directly.
          </p>
        </section>

        {/* Limitation of Liability */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-main mb-4">
            Limitation of Liability
          </h2>
          <p className="text-ctext leading-relaxed mb-4">
            In no event will IBLAW be liable for any loss or damage including without limitation, indirect or consequential loss or damage, or any loss or damage whatsoever arising from loss of data or profits arising out of, or in connection with, the use of this website.
          </p>
          <p className="text-ctext leading-relaxed">
            Through this website, you may be able to link to other websites which are not under the control of IBLAW. We have no control over the nature, content, and availability of those sites. The inclusion of any links does not necessarily imply a recommendation or endorse the views expressed within them.
          </p>
        </section>

        {/* Professional Responsibility */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-main mb-4">
            Professional Responsibility
          </h2>
          <p className="text-ctext leading-relaxed">
            IBLAW is regulated by the Jordanian Bar Association. Our lawyers are subject to the professional conduct rules and regulations applicable in Jordan. We maintain professional indemnity insurance as required by law.
          </p>
        </section>

        {/* Confidential Information */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-main mb-4">
            Confidential Information
          </h2>
          <p className="text-ctext leading-relaxed">
            Please do not send us confidential information or sensitive materials through this website. Information sent through this website is not necessarily secure and may not be treated as privileged or confidential. If you need to send confidential information to IBLAW, please contact us directly to arrange a secure method of communication.
          </p>
        </section>

        {/* Accuracy of Information */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-main mb-4">
            Accuracy of Information
          </h2>
          <p className="text-ctext leading-relaxed">
            Every effort is made to keep the website up and running smoothly. However, IBLAW takes no responsibility for, and will not be liable for, the website being temporarily unavailable due to technical issues beyond our control. The information provided on this website may be subject to change without notice.
          </p>
        </section>

        {/* Jurisdictional Issues */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-main mb-4">
            Jurisdictional Issues
          </h2>
          <p className="text-ctext leading-relaxed">
            This website is operated from Jordan and the information contained herein is provided in accordance with Jordanian law. If you access this website from other jurisdictions, you are responsible for compliance with local laws if and to the extent local laws are applicable.
          </p>
        </section>

        {/* Contact Information */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-main mb-6">
            Contact Information
          </h2>
          <p className="text-ctext leading-relaxed mb-6">
            If you have any questions about this disclaimer, please contact us at:
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
  );
}

export default TermsAndConditions;