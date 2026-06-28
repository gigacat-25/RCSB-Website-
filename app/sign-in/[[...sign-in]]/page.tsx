export const runtime = 'edge';
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-[#0a1835] relative overflow-hidden py-20 px-6">
            {/* Premium Line Grid */}
            <div className="absolute inset-0 pointer-events-none -z-10">
                <div
                    className="absolute w-full h-full"
                    style={{
                        backgroundImage: `
                            linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)
                        `,
                        backgroundSize: '48px 48px',
                        maskImage: 'radial-gradient(ellipse at center, black 10%, transparent 80%)',
                        WebkitMaskImage: 'radial-gradient(ellipse at center, black 10%, transparent 80%)'
                    }}
                />
            </div>

            {/* Ambient Color Glows */}
            <div className="absolute -top-20 right-1/4 w-[500px] h-[500px] bg-brand-gold/10 rounded-full blur-[120px] pointer-events-none -z-10" />
            <div className="absolute -bottom-40 left-1/4 w-[500px] h-[500px] bg-brand-azure/10 rounded-full blur-[120px] pointer-events-none -z-10" />

            <div className="animate-fade-up flex flex-col items-center">
                {/* Branding Header */}
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-white p-3 rounded-2xl shadow-xl border-2 border-brand-gold/30 mb-3 hover:scale-105 transition-transform duration-300">
                        <img src="/logo.png" alt="RCSB Logo" className="h-10 w-auto" />
                    </div>
                    <p className="text-[10px] font-black text-brand-gold uppercase tracking-[0.4em] text-center">
                        Rotaract Club of Swarna Bengaluru
                    </p>
                </div>

                <SignIn
                    appearance={{
                        elements: {
                            rootBox: "mx-auto",
                            card: "bg-[#0d1528]/85 backdrop-blur-xl border border-brand-gold/20 shadow-premium rounded-[2.5rem]",
                            headerTitle: "text-white font-heading font-black text-2xl tracking-tight",
                            headerSubtitle: "text-slate-400 font-medium",
                            socialButtonsBlockButton: "bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all rounded-xl",
                            socialButtonsBlockButtonText: "text-white font-bold text-sm",
                            dividerLine: "bg-white/10",
                            dividerText: "text-slate-500 font-bold tracking-widest text-[9px] uppercase",
                            formFieldLabel: "text-slate-300 font-bold uppercase tracking-widest text-[9px]",
                            formFieldInput: "bg-white/5 border border-white/10 text-white focus:border-brand-gold/50 focus:bg-white/10 rounded-xl transition-all",
                            formButtonPrimary: "bg-brand-gold text-brand-blue font-black rounded-xl hover:bg-yellow-400 transition-colors shadow-lg active:scale-95 duration-150",
                            footerActionText: "text-slate-400 font-medium",
                            footerActionLink: "text-brand-gold hover:text-white transition-colors font-bold",
                            identityPreviewText: "text-white",
                            identityPreviewEditButtonIcon: "text-slate-400"
                        }
                    }}
                    routing="path"
                    path="/sign-in"
                    signUpUrl="/sign-up"
                />
            </div>
        </main>
    );
}
