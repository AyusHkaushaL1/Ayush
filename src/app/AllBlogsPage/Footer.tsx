import React from "react";

const Footer: React.FC = () => {
    return (
        <footer className="bg-[#f9f7f2] text-[#0a2e37] min-h-screen flex flex-col">
            {/* Running Banner */}
            <div className="overflow-hidden whitespace-nowrap bg-[#0a2e37] text-white py-8 text-6xl font-serif italic">
                <div className="animate-marquee flex gap-20 items-center">
                    {["Lorem ipsum dolor", "Sit amet rings", "Lorem ipsum dolor", "Sit amet rings"].map((text, i) => (
                        <span key={i} className="flex items-center gap-4">
                            <img src="/logo-icon.png" alt="Logo" className="w-10 h-10" /> {text}
                        </span>
                    ))}
                </div>
            </div>

            {/* Main Footer */}
            <div className="flex-grow px-6 md:px-16 py-20 grid grid-cols-1 md:grid-cols-5 gap-16 text-base">
                {/* Column 1 */}
                <div className="space-y-5">
                    <h4 className="font-semibold text-2xl">Store</h4>
                    <p className="text-xl">Lorem Collection</p>
                    <p className="text-xl">Dolor Diamonds</p>
                    <p className="text-xl">Ipsum for Women</p>
                    <p className="text-xl">Top Lorem</p>
                    <p className="text-xl">Contact Us</p>
                </div>

                {/* Column 2 */}
                <div className="space-y-5">
                    <h4 className="font-semibold text-2xl">Career</h4>
                    <p className="text-xl">Services</p>
                    <p className="text-xl">Try at Home</p>
                    <p className="text-xl">Guide</p>
                </div>

                {/* Column 3 */}
                <div className="space-y-5">
                    <h4 className="font-semibold text-2xl">Blogs</h4>
                    <p className="text-xl">FAQs</p>
                    <p className="text-xl">In the News</p>
                </div>

                {/* Column 4 */}
                <div className="space-y-5">
                    <h4 className="font-semibold text-2xl">Policies</h4>
                    <p className="text-xl">Exchange Policy</p>
                    <p className="text-xl">Terms & Conditions</p>
                    <p className="text-xl">Privacy Policy</p>
                    <p className="text-xl">Plan T & C</p>
                </div>

                {/* Column 5 */}
                <div className="space-y-5 text-base md:px-16">
                    <h4 className="font-semibold text-2xl">Registered Office</h4>
                    <p className="text-xl">Lorem Ipsum Pvt. Ltd.</p>
                    <p className="text-xl">123, Dummy Street, Ipsum City, Dolor State 000000</p>
                    <p className="mt-2 text-xl">📞 +91 99999 99999</p>
                    <p className="text-xl">📧 lorem@ipsum.com</p>
                    <div className="flex space-x-4 mt-4">
                        <span>📸</span>
                        <span>📘</span>
                        <span>💼</span>
                        <span>▶️</span>
                        <span>💬</span>
                    </div>
                    <div className="flex space-x-2 mt-4">
                        <span className="bg-white px-3 py-1 rounded shadow">Visa</span>
                        <span className="bg-white px-3 py-1 rounded shadow">PayPal</span>
                        <span className="bg-white px-3 py-1 rounded shadow">Amex</span>
                        <span className="bg-white px-3 py-1 rounded shadow">Apple</span>
                    </div>
                </div>
            </div>

            {/* Huge Naksh */}
            {/* Huge Naksh */}
            <div className="w-full">
                <p
                     className="w-full text-[15vw] font-extrabold tracking-widest text-center text-[#0a2e37] font-serif uppercase leading-[0.9]"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                >
                    Naksh
                </p>
            </div>

            {/* Bottom Bar */}
            <div className="text-center py-6 border-t text-sm text-gray-500">
                © Lorem Ipsum 2025 | All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
