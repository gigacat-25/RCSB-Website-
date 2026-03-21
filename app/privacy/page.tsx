import Link from "next/link";
import { ShieldCheckIcon } from "@heroicons/react/24/outline";

export default function PrivacyPolicyPage() {
    return (
        <div className="bg-slate-50 min-h-screen pt-32 pb-24">
            <div className="container-custom max-w-4xl">
                <Link href="/" className="inline-block mb-10 text-brand-gray hover:text-brand-blue transition-colors font-bold text-sm tracking-widest uppercase">
                    &larr; Back to Home
                </Link>

                <div className="bg-white p-10 md:p-16 rounded-[3rem] shadow-xl shadow-slate-200/50 outline-none">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-brand-blue/5 flex items-center justify-center text-brand-blue">
                            <ShieldCheckIcon className="w-8 h-8 stroke-2" />
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-heading font-black text-brand-blue tracking-tight">Privacy Policy</h1>
                            <p className="text-brand-gray/60 font-bold mt-2 uppercase tracking-widest text-[11px]">Last Updated: March 2024</p>
                        </div>
                    </div>

                    <div className="prose prose-lg prose-slate max-w-none text-brand-gray">
                        <h3 className="text-2xl font-black text-brand-blue font-heading mt-8 mb-4">1. Information We Collect</h3>
                        <p>
                            At Rotaract Club of Swarna Bengaluru, we are committed to protecting your privacy. We collect information that you voluntarily provide to us when you fill out forms on our website, such as our Contact Us form. This information may include your name, email address, and any additional details you choose to share in your message.
                        </p>

                        <h3 className="text-2xl font-black text-brand-blue font-heading mt-8 mb-4">2. How We Use Your Information</h3>
                        <p>
                            The information we collect is strictly used to communicate with you regarding your inquiries, membership interests, or collaboration requests. We do not sell, rent, or distribute your personal information to third parties for marketing purposes.
                        </p>

                        <h3 className="text-2xl font-black text-brand-blue font-heading mt-8 mb-4">3. Data Security</h3>
                        <p>
                            We implement reasonable security measures to protect the personal information submitted through our website. However, please be aware that no transmission of data over the internet or electronic storage is completely secure, and we cannot guarantee absolute absolute security.
                        </p>

                        <h3 className="text-2xl font-black text-brand-blue font-heading mt-8 mb-4">4. Third-Party Links</h3>
                        <p>
                            Our website may contain links to external sites not operated by us (such as social media profiles or event platforms). We have no control over the content or privacy practices of these sites and encourage you to review their respective privacy policies.
                        </p>

                        <h3 className="text-2xl font-black text-brand-blue font-heading mt-8 mb-4">5. Changes to This Policy</h3>
                        <p>
                            We may update our Privacy Policy periodically. We will notify visitors of any changes by updating the "Last Updated" date at the top of this page. We encourage you to review this policy periodically.
                        </p>

                        <div className="mt-12 p-6 bg-brand-blue/5 rounded-2xl border border-brand-blue/10">
                            <h4 className="text-lg font-black text-brand-blue mb-2 font-heading">Contact Us</h4>
                            <p className="text-sm">
                                If you have any questions about this Privacy Policy, please contact us at: <br />
                                <strong><a href="mailto:rota.rcsb@gmail.com" className="text-brand-azure hover:underline">ROTA.RCSB@GMAIL.COM</a></strong>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
