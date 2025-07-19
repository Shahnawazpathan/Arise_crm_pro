
import React from 'react';
import { PhoneIcon, MailIcon, MapPinIcon, UserIcon } from '../components/shared/Icons';

const ClientSupportPage: React.FC = () => {
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold text-text-primary mb-2">Support & Contact</h1>
      <p className="text-lg text-text-secondary mb-6">Need help? Here's how you can get in touch with us.</p>
      
      <div className="bg-surface p-8 rounded-2xl shadow-lg max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left Column: Contact Details */}
          <div>
            <h2 className="text-2xl font-bold text-text-primary mb-6 border-b pb-4">Arise Enterprises</h2>
            <div className="space-y-6">
              <div className="flex">
                <UserIcon className="h-6 w-6 text-secondary mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-text-primary">Proprietor</h3>
                  <p className="text-text-secondary">Mohd. Ibraheem</p>
                </div>
              </div>
               <div className="flex">
                <PhoneIcon className="h-6 w-6 text-secondary mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-text-primary">Mobile</h3>
                  <p className="text-text-secondary">+91-9335718423</p>
                  <p className="text-text-secondary">+91-9628226633</p>
                </div>
              </div>
              <div className="flex">
                <MailIcon className="h-6 w-6 text-secondary mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-text-primary">Email</h3>
                   <a href="mailto:ibraheem@arisetravel.in" className="text-secondary hover:text-primary break-all">ibraheem@arisetravel.in</a><br/>
                   <a href="mailto:arise.enterprises100@gmail.com" className="text-secondary hover:text-primary break-all">arise.enterprises100@gmail.com</a>
                </div>
              </div>
              <div className="flex">
                <MapPinIcon className="h-6 w-6 text-secondary mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-text-primary">Address</h3>
                  <p className="text-text-secondary">Shop No.- 201, 1st Floor, Building No.-4,</p>
                  <p className="text-text-secondary">Ring Road, Kalyanpur, Lucknow-226022</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Map */}
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold text-text-primary mb-6 border-b pb-4">Our Location</h2>
            <div className="bg-gray-200 rounded-lg flex-grow w-full h-64 md:h-full flex items-center justify-center overflow-hidden">
               <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3558.171830601362!2d80.88066697520038!3d26.89792617665426!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399959a33bc95b2d%3A0x8687e35b75b9f7f4!2sRing%20Rd%2C%20Kalyanpur%2C%20Lucknow%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1678886400000" 
                width="100%" 
                height="100%" 
                style={{ border:0 }} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-lg"
               ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientSupportPage;