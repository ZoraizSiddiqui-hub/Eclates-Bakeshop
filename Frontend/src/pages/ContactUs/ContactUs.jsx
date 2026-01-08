import React, { useState } from 'react';
import './ContactUs.css';
import { FaInstagram, FaFacebook, FaWhatsapp } from 'react-icons/fa';

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // ✅ No backend submission — just simulate success
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);

        // ✅ Reset form after "submission"
        setFormData({
            name: '',
            email: '',
            subject: '',
            message: '',
        });
    };

    return (
        <div className="contact-page">
            {/* Banner */}
            <section className="contact-banner">
                <h1>Get in Touch</h1>
            </section>

            {/* Tagline */}
            <section className="contact-tagline">
                <p>We’d love to hear from you. Whether it’s feedback, questions, or custom orders — reach out!</p>
            </section>

            {/* Form */}
            <section className="contact-form-section">
                <form className="contact-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Your Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="subject"
                        placeholder="Subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                    />
                    <textarea
                        name="message"
                        placeholder="Your Message"
                        rows="5"
                        value={formData.message}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit">Send Message</button>
                </form>
                {submitted && <div className="contact-toast">Message Sent Successfully!</div>}
            </section>

            {/* Info */}
            <section className="contact-info">
                <div>
                    <h3>Phone</h3>
                    <p>+92 300 1234567</p>
                </div>
                <div>
                    <h3>Email</h3>
                    <p>support@eclates.com</p>
                </div>
                <div>
                    <h3>Hours</h3>
                    <p>Mon–Sat: 10am – 8pm</p>
                </div>
                <div>
                    <h3>Location</h3>
                    <p>Lahore, Pakistan</p>
                </div>
            </section>

            {/* Map */}
            <section className="contact-map">
                <iframe
                    title="Eclates Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13610.123456789!2d74.345678!3d31.520370!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391904123456789%3A0xabcdef123456789!2sLahore!5e0!3m2!1sen!2s!4v1600000000000"
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                ></iframe>
            </section>

            {/* Social */}
            <section className="contact-social">
                <h3>Connect with us</h3>
                <div className="social-icons">
                    <FaInstagram />
                    <FaFacebook />
                    <FaWhatsapp />
                </div>
            </section>
        </div>
    );
};

export default ContactUs;
