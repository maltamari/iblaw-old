import { Button } from "../ui/button"

function CTA() {
  return (
    <div className="text-center bg-white rounded-3xl shadow-xl p-12 animate-fade-in">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Need Legal Assistance?
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Contact us to discuss how our expertise in these practice areas and
            sectors can benefit your business.
          </p>
          <Button className="bg-blue-900 text-white px-10 py-4 rounded-full font-semibold text-lg shadow-lg hover:bg-blue-800 hover:shadow-xl transform hover:scale-105 transition-all duration-300">
            Get in Touch
          </Button>
        </div>
  )
}

export default CTA