export const runtime = 'edge';
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
                            <p className="text-brand-gray/60 font-bold mt-2 uppercase tracking-widest text-[11px]">Last Updated: June 2026</p>
                        </div>
                    </div>

                    <div className="prose prose-lg prose-slate max-w-none text-brand-gray space-y-6">
                        <p className="lead text-lg font-light text-slate-600">
                            This Privacy Policy is designed to align with the <strong>Digital Personal Data Protection (DPDP) Act, 2023</strong> of India. 
                            The Rotaract Club of Swarna Bengaluru ("we", "us", "our") acts as the <strong>Data Fiduciary</strong> for the personal data collected through this website. 
                            We are committed to protecting the privacy of our visitors, members, and partners ("Data Principals" or "you").
                        </p>

                        <h3 className="text-2xl font-black text-brand-blue font-heading mt-8 mb-4">1. Notice of Personal Data Collected</h3>
                        <p>
                            We only collect personal data that is necessary for specified, lawful purposes. The categories of personal data we collect include:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-sm md:text-base">
                            <li><strong>Identity & Contact Data:</strong> Name, email address, phone number, and any other details you voluntarily provide when using our Contact Form or subscribing to our newsletters.</li>
                            <li><strong>Account Data:</strong> If you register or log in (via Clerk), we process your profile information, registration details, and access logs to secure your admin account.</li>
                            <li><strong>Technical & Consent Data:</strong> IP address, browser type, device information, and cookie preferences saved via our cookie consent banner.</li>
                        </ul>

                        <h3 className="text-2xl font-black text-brand-blue font-heading mt-8 mb-4">2. Purpose and Lawful Basis of Processing</h3>
                        <p>
                            We process your personal data under the lawful basis of your <strong>free, specific, informed, unconditional, and unambiguous consent</strong>. The specific purposes for which we process data are:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-sm md:text-base">
                            <li><strong>Responding to Queries:</strong> To communicate with you and answer inquiries sent via our Contact Us form.</li>
                            <li><strong>Newsletter Updates:</strong> To send you periodic updates, event announcements, and newsletters (only if you have voluntarily subscribed).</li>
                            <li><strong>Site Security and Administration:</strong> To prevent fraud, ensure cybersecurity, and manage administrator access.</li>
                        </ul>

                        <h3 className="text-2xl font-black text-brand-blue font-heading mt-8 mb-4">3. Right to Withdraw Consent</h3>
                        <p>
                            You have the right to withdraw your consent for processing your personal data at any time. The withdrawal of consent does not affect the lawfulness of processing based on consent before its withdrawal. You can withdraw consent easily through these methods:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-sm md:text-base">
                            <li><strong>Cookies:</strong> You can modify or withdraw your cookie preferences at any time by clicking the "Cookie Settings" banner in the website footer.</li>
                            <li><strong>Newsletter Subscriptions:</strong> You can unsubscribe from our email lists at any time by clicking the "Unsubscribe" link in any newsletter or by visiting our unsubscribe page.</li>
                            <li><strong>Direct Request:</strong> You can email our Grievance Redressal Officer to request withdrawal of consent for any other data processing.</li>
                        </ul>
                        <p className="italic text-sm text-slate-500">
                            Note: If you withdraw consent, we may not be able to provide certain services to you (e.g., responding to your messages or sending you updates).
                        </p>

                        <h3 className="text-2xl font-black text-brand-blue font-heading mt-8 mb-4">4. Rights of Data Principals</h3>
                        <p>
                            Under the DPDP Act 2023, you are a "Data Principal" and have the following statutory rights:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-sm md:text-base">
                            <li><strong>Right to Access:</strong> You can request a summary of your personal data currently being processed by us and the list of any third parties with whom it has been shared.</li>
                            <li><strong>Right to Correction & Erasure:</strong> You can request the correction of inaccurate, incomplete, or out-of-date personal data, or the deletion of your personal data when it is no longer necessary for the purpose it was collected.</li>
                            <li><strong>Right to Grievance Redressal:</strong> You have the right to register a grievance with us regarding any violation of your rights under the DPDP Act.</li>
                            <li><strong>Right to Nominate:</strong> You have the right to nominate any other individual to exercise your rights in the event of your death or incapacity.</li>
                        </ul>
                        <p>
                            To exercise any of these rights, please submit a written request to our Grievance Redressal Officer at the contact details provided below.
                        </p>

                        <h3 className="text-2xl font-black text-brand-blue font-heading mt-8 mb-4">5. Processing Children's Personal Data</h3>
                        <p>
                            We do not knowingly collect, process, or track personal data of children under the age of 18 without verifiable parental consent. We do not engage in any behavioral monitoring, targeted advertising, or processing of children's data that is likely to cause any detrimental effect on the well-being of a child.
                        </p>

                        <h3 className="text-2xl font-black text-brand-blue font-heading mt-8 mb-4">6. Data Retention and Security</h3>
                        <p>
                            We retain your personal data only for as long as necessary to fulfill the purposes outlined in this policy or as required by law. We employ industry-standard administrative, technical, and physical security measures (including Cloudflare Turnstile verification and encrypted database access) to protect your personal data from unauthorized access, alteration, disclosure, or destruction.
                        </p>

                        <div className="mt-12 p-6 bg-brand-blue/5 rounded-2xl border border-brand-blue/10">
                            <h4 className="text-lg font-black text-brand-blue mb-2 font-heading">Grievance Redressal & Support</h4>
                            <p className="text-sm leading-relaxed">
                                If you have any questions, wish to exercise your rights, withdraw consent, or file a complaint regarding our data practices, please contact our designated Grievance Officer:
                            </p>
                            <div className="mt-4 text-sm font-sans text-brand-blue/80 space-y-1">
                                <p><strong>Designation:</strong> Grievance Redressal Officer</p>
                                <p><strong>Entity:</strong> Rotaract Club of Swarna Bengaluru (RI District 3192)</p>
                                <p><strong>Email Address:</strong> <a href="mailto:rota.rcsb@gmail.com" className="text-brand-azure hover:underline font-bold">rota.rcsb@gmail.com</a></p>
                                <p><strong>Address:</strong> Bengaluru, Karnataka, India</p>
                            </div>
                            <p className="text-xs text-slate-500 mt-4">
                                We will acknowledge and respond to all requests or grievances within the statutory timelines prescribed under the DPDP Act.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
