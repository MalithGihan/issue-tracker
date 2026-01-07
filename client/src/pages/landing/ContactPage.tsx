/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import {
  Mail,
  User,
  MessageSquare,
  Send,
  AlertCircle,
  Phone,
  MapPin,
  Clock,
} from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import ContactInfo from "../../components/ContactPage/ContactInfo";
import TopTitle from "../../components/Common/TopTitle";

const contactSchema = Yup.object({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  subject: Yup.string()
    .min(5, "Subject must be at least 5 characters")
    .required("Subject is required"),
  message: Yup.string()
    .min(10, "Message must be at least 10 characters")
    .required("Message is required"),
});

export default function ContactPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: any) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
    validationSchema: contactSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values, helpers) => {
      setIsSubmitting(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        console.log("Form submitted:", values);
        alert("Message sent successfully!");
        helpers.resetForm();
      } catch (error) {
        alert("Failed to send message. Please try again.");
      } finally {
        setIsSubmitting(false);
        helpers.setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
        style={{
          background: `radial-gradient(400px at ${mousePosition.x}px ${mousePosition.y}px, rgba(6, 182, 212, 0.15), transparent 80%)`,
        }}
      />

      <div className="max-w-7xl mx-auto pt-16">
        <TopTitle
          title="Get in Touch"
          subTitle="Everything you need to build, scale, and succeed"
          description="Have a question or need help? We'd love to hear from you. Send us a message and we'll respond as soon as possible."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 my-20">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-md p-6 md:p-8">
              <h2 className="text-xl font-bold mb-6">Send us a Message</h2>

              <div className="space-y-3">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </label>
                  <div className="relative mt-2">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <User size={18} />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      className={`w-full pl-10 pr-4 py-2 rounded-md border ${
                        formik.touched.name && formik.errors.name
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-200 focus:ring-gray-900"
                      } bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                      placeholder="John Doe"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </div>
                  {formik.touched.name && formik.errors.name && (
                    <div className="flex items-center gap-1 text-sm text-red-600">
                      <AlertCircle size={14} />
                      <span>{formik.errors.name}</span>
                    </div>
                  )}
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                  >
                    Email Address
                  </label>
                  <div className="relative mt-2">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <Mail size={18} />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className={`w-full pl-10 pr-4 py-2 rounded-md border ${
                        formik.touched.email && formik.errors.email
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-200 focus:ring-gray-900"
                      } bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                      placeholder="you@example.com"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </div>
                  {formik.touched.email && formik.errors.email && (
                    <div className="flex items-center gap-1 text-sm text-red-600">
                      <AlertCircle size={14} />
                      <span>{formik.errors.email}</span>
                    </div>
                  )}
                </div>

                {/* Subject Field */}
                <div className="space-y-2">
                  <label
                    htmlFor="subject"
                    className="text-sm font-medium text-gray-700"
                  >
                    Subject
                  </label>
                  <div className="relative mt-2">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <MessageSquare size={18} />
                    </div>
                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      className={`w-full pl-10 pr-4 py-2 rounded-md border ${
                        formik.touched.subject && formik.errors.subject
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-200 focus:ring-gray-900"
                      } bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                      placeholder="How can we help you?"
                      value={formik.values.subject}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </div>
                  {formik.touched.subject && formik.errors.subject && (
                    <div className="flex items-center gap-1 text-sm text-red-600">
                      <AlertCircle size={14} />
                      <span>{formik.errors.subject}</span>
                    </div>
                  )}
                </div>

                {/* Message Field */}
                <div className="space-y-2">
                  <label
                    htmlFor="message"
                    className="text-sm font-medium text-gray-700"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    className={`w-full mt-2 px-2 py-2 rounded-md border ${
                      formik.touched.message && formik.errors.message
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-200 focus:ring-gray-900"
                    } bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all resize-none`}
                    placeholder="Tell us more about your inquiry..."
                    value={formik.values.message}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.message && formik.errors.message && (
                    <div className="flex items-center gap-1 text-sm text-red-600">
                      <AlertCircle size={14} />
                      <span>{formik.errors.message}</span>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="button"
                  onClick={() => formik.handleSubmit()}
                  disabled={isSubmitting || formik.isSubmitting}
                  className="w-full flex items-center justify-center mt-5 gap-2 py-2 px-4 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all group"
                >
                  {isSubmitting || formik.isSubmitting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send
                        size={18}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </>
                  )}
                </button>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <p className="text-xs text-gray-600 text-center">
                  By submitting this form, you agree to our{" "}
                  <a
                    href="#"
                    className="text-gray-900 hover:underline font-medium"
                  >
                    Privacy Policy
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="text-gray-900 hover:underline font-medium"
                  >
                    Terms of Service
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6 my-10">
            <ContactInfo
              icon={Mail}
              title="Email Us"
              content="support@issuetracker.com"
            />
            <ContactInfo
              icon={Phone}
              title="Call Us"
              content="+1 (555) 123-4567"
            />
            <ContactInfo
              icon={MapPin}
              title="Visit Us"
              content="123 Business St, Suite 100, San Francisco, CA 94105"
            />
            <ContactInfo
              icon={Clock}
              title="Working Hours"
              content="Monday - Friday: 9:00 AM - 6:00 PM PST"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
