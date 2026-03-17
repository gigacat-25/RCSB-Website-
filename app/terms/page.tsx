import Link from "next/link";
import { DocumentTextIcon } from "@heroicons/react/24/outline";

export default function TermsAndConditionsPage() {
    return (
        <div className="bg-slate-50 min-h-screen pt-32 pb-24">
            <div className="container-custom max-w-4xl">
                <Link href="/" className="inline-block mb-10 text-brand-gray hover:text-brand-blue transition-colors font-bold text-sm tracking-widest uppercase">
                    &larr; Back to Home
                </Link>

                <div className="bg-white p-10 md:p-16 rounded-[3rem] shadow-xl shadow-slate-200/50 outline-none">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-brand-gold/10 flex items-center justify-center text-brand-gold">
                            <DocumentTextIcon className="w-8 h-8 stroke-2" />
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-heading font-black text-brand-blue tracking-tight">Terms and Conditions</h1>
                            <p className="text-brand-gray/60 font-bold mt-2 uppercase tracking-widest text-[11px]">Last Updated: March 2024</p>
                        </div>
                    </div>

                    <div className="prose prose-lg prose-slate max-w-none text-brand-gray">
                        <h3 className="text-2xl font-black text-brand-blue font-heading mt-8 mb-4">1. Introduction</h3>
                        <p>
                            Welcome to the website of Rotaract Club of Swarna Bengaluru. By accessing our website (rcsb.in), you are agreeing to comply with these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.
                        </p>

                        <h3 className="text-2xl font-black text-brand-blue font-heading mt-8 mb-4">2. Use License</h3>
                        <p>
                            Permission is granted to temporarily view the materials (information or software) on our website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                        </p>
                        <ul className="list-disc ml-8 text-brand-gray/80 font-medium">
                            <li>Modify or copy the materials.</li>
                            <li>Use the materials for any commercial purpose.</li>
                            <li>Attempt to decompile or reverse engineer any software contained on the website.</li>
                            <li>Remove any copyright or other proprietary notations from the materials.</li>
                        </ul>

                        <h3 className="text-2xl font-black text-brand-blue font-heading mt-8 mb-4">3. Disclaimer</h3>
                        <p>
                            The materials on Rotaract Club of Swarna Bengaluru's website are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                        </p>

                        <h3 className="text-2xl font-black text-brand-blue font-heading mt-8 mb-4">4. Limitations</h3>
                        <p>
                            In no event shall Rotaract Club of Swarna Bengaluru or its members be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our website.
                        </p>

                        <h3 className="text-2xl font-black text-brand-blue font-heading mt-8 mb-4">5. Website Links</h3>
                        <p>
                            We have not reviewed all of the sites linked to our website and are not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by us of the site. Use of any such linked website is at the user's own risk.
                        </p>

                        <h3 className="text-2xl font-black text-brand-blue font-heading mt-8 mb-4">6. Modifications</h3>
                        <p>
                            We may revise these terms of service for our website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.
                        </p>

                        <div className="mt-12 p-6 bg-brand-gold/5 rounded-2xl border border-brand-gold/10">
                            <h4 className="text-lg font-black text-brand-gold mb-2 font-heading">Questions?</h4>
                            <p className="text-sm">
                                If you have any questions or concerns about these Terms, feel free to email us at: <br />
                                <strong><a href="mailto:contact@rcsb.in" className="text-brand-blue hover:text-brand-azure hover:underline transition-colors mt-1 inline-block">contact@rcsb.in</a></strong>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
