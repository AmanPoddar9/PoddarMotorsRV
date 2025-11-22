import { FiMapPin, FiPhone, FiMail, FiClock } from 'react-icons/fi'

const AddressMap = () => {
  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Contact Info */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-workshop-blue mb-6">Visit Our Workshop</h2>
            <p className="text-gray-600 mb-10 text-lg">
              Conveniently located in Kokar Industrial Area. Drop by for a quick checkup or schedule a comprehensive service.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-workshop-gray rounded-full flex items-center justify-center text-workshop-red flex-shrink-0">
                  <FiMapPin className="text-xl" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg mb-1">Address</h4>
                  <p className="text-gray-600">Kokar Industrial Area, Kokar,<br />Ranchi, Jharkhand - 834001</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-workshop-gray rounded-full flex items-center justify-center text-workshop-red flex-shrink-0">
                  <FiPhone className="text-xl" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg mb-1">Phone</h4>
                  <p className="text-gray-600">+91 8873002702</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-workshop-gray rounded-full flex items-center justify-center text-workshop-red flex-shrink-0">
                  <FiMail className="text-xl" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg mb-1">Email</h4>
                  <p className="text-gray-600">poddarranchi@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-workshop-gray rounded-full flex items-center justify-center text-workshop-red flex-shrink-0">
                  <FiClock className="text-xl" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg mb-1">Working Hours</h4>
                  <p className="text-gray-600">Mon - Sat: 9:00 AM - 7:00 PM<br />Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="h-[500px] w-full rounded-2xl overflow-hidden shadow-lg border border-gray-200">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3662.655668766566!2d85.3586483153875!3d23.36454898478084!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f4e17d184b0973%3A0xbc6d6be675cca0f0!2sREAL%20VALUE%20ranchi!5e0!3m2!1sen!2sin!4v1645512345678!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AddressMap
