import React, { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaPaperPlane } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0F0E0C] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">
            Get in <span className="text-[#D5B36A]">Touch</span>
          </h1>
          <p className="text-xl text-gray-400">We're here to help you plan your perfect trip</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-6">
            <div className="bg-[#1B1A17] rounded-xl p-6 border border-[#D5B36A]/20">
              <div className="w-12 h-12 bg-gradient-to-r from-[#C7A15C] to-[#E2C784] rounded-lg flex items-center justify-center mb-4">
                <FaPhone className="text-black text-xl" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Phone</h3>
              <p className="text-[#D5B36A]">+20 2 1234 5678</p>
            </div>

            <div className="bg-[#1B1A17] rounded-xl p-6 border border-[#D5B36A]/20">
              <div className="w-12 h-12 bg-gradient-to-r from-[#C7A15C] to-[#E2C784] rounded-lg flex items-center justify-center mb-4">
                <FaEnvelope className="text-black text-xl" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Email</h3>
              <p className="text-[#D5B36A]">info@mysticegypt.com</p>
            </div>

            <div className="bg-[#1B1A17] rounded-xl p-6 border border-[#D5B36A]/20">
              <div className="w-12 h-12 bg-gradient-to-r from-[#C7A15C] to-[#E2C784] rounded-lg flex items-center justify-center mb-4">
                <FaMapMarkerAlt className="text-black text-xl" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Office</h3>
              <p className="text-[#D5B36A]">123 Tahrir Square, Cairo</p>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-[#1B1A17] rounded-xl p-8 border border-[#D5B36A]/20">
              <h2 className="text-2xl font-bold text-white mb-6">Send Message</h2>
              
              {success && (
                <div className="mb-6 p-4 bg-green-500/10 border border-green-500/50 rounded-lg">
                  <p className="text-green-500">Message sent successfully!</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    className="px-4 py-3 bg-[#2c1b0f] border border-[#D5B36A]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D5B36A]"
                  />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="px-4 py-3 bg-[#2c1b0f] border border-[#D5B36A]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D5B36A]"
                  />
                </div>

                <input
                  type="text"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Subject"
                  className="w-full px-4 py-3 bg-[#2c1b0f] border border-[#D5B36A]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D5B36A]"
                />

                <textarea
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  rows="6"
                  placeholder="Your Message"
                  className="w-full px-4 py-3 bg-[#2c1b0f] border border-[#D5B36A]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D5B36A] resize-none"
                ></textarea>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#C7A15C] to-[#E2C784] text-black font-bold rounded-lg disabled:opacity-50"
                >
                  {loading ? 'Sending...' : (
                    <>
                      <FaPaperPlane />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;