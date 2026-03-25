export default function AboutLeading() {
  return (
    <section className="relative py-16 md:py-15 bg-gray-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 items-center">
          <div></div>
          
          {/* Right Side - Content */}
          <div className="flex">
            <div className="space-y-6 md:w-full">
              {/* Main Heading */}
              <h2 className="text-4xl md:text-5xl lg:text-4xl mb-10 font-bold text-main leading-tight capitalize">
                A leading full service law firm
              </h2>

              {/* Description */}
              <p className="text-xl text-ctext leading-relaxed w-full text-justify mb-10">
                IBLAW is a leading full-service law firm based in the Hashemite Kingdom of Jordan, dedicated to working closely with clients to help them achieve their personal and professional goals and overcome legal challenges. IBLAW was established in 1997 by H.E. Dr. Salaheddin Al-Bashir and has rapidly grown to become one of the largest and most respected law firms in Jordan, with a strong regional outreach. Since its establishment, IBLAW has been driven by the vision of becoming a truly modern legal institution that meets the evolving needs of its clients - powered by a distinguished team whose unwavering commitment to the highest ethical and professional standards defines the firm&apos;s reputation and culture.
              </p>

              <p className="text-xl text-ctext leading-relaxed mb-10 w-full text-justify">
                Today, with extensive knowledge of the Jordanian legal system, IBLAW offers private and public sector clients a full suite of corporate and commercial services, through a diverse and highly resourceful team of attorneys and consultants. Our team provides services in different sectors and industries, structured under four major practice areas: Corporate and Commercial, Litigation, Intellectual Property, and Regulatory and Legislative Drafting. Within these practice areas, we have supported clients in the private and public sectors in arbitration, real estate development, foreign investment, government procurement, project finance, privatization, and mergers and acquisitions.
                <br className="mb-10 py-10" />
                <br />
                We strive to cut through the complexity and uncertainty of our region to provide clear, precise, and insightful legal solutions. We understand that to be able to successfully navigate the business in the Middle East, we must balance the big picture with our client&apos;s immediate needs. We think ahead and anticipate issues before they become problems. Our lawyers always perform with intellectual rigor and focus.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
