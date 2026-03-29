export const runtime = 'edge';
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden py-20 px-6">
            {/* Decorative background Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-blue/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 -z-10" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-gold/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 -z-10" />

            <div className="animate-fade-up">
                <SignUp
                    appearance={{
                        elements: {
                            rootBox: "mx-auto",
                            card: "bg-slate-900 border border-white/10 shadow-2xl rounded-[2rem]",
                            headerTitle: "text-white font-heading font-black",
                            headerSubtitle: "text-slate-400",
                            socialButtonsBlockButton: "bg-white/5 border-white/10 text-white hover:bg-white/10",
                            socialButtonsBlockButtonText: "text-white font-bold",
                            dividerLine: "bg-white/10",
                            dividerText: "text-slate-500",
                            formFieldLabel: "text-slate-300 font-bold uppercase tracking-widest text-[10px]",
                            formFieldInput: "bg-white/5 border-white/10 text-white focus:border-brand-gold/50 rounded-xl",
                            formButtonPrimary: "bg-brand-gold text-brand-blue font-black rounded-xl hover:bg-white transition-all",
                            footerActionText: "text-slate-400",
                            footerActionLink: "text-brand-gold hover:text-white transition-colors",
                            identityPreviewText: "text-white",
                            identityPreviewEditButtonIcon: "text-slate-400"
                        }
                    }}
                    routing="path"
                    path="/sign-up"
                    signInUrl="/sign-in"
                />
            </div>
        </main>
    );
}
