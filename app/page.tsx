"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Moon, Smartphone, Play } from "lucide-react";
import Link from "next/link";

function VideoPlaceholder({ platform }: { platform: string }) {
  return (
    <div className="w-full aspect-video bg-surface rounded-2xl border-2 border-secondary/10 flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer shadow-sm">
      <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="w-16 h-16 rounded-full bg-accent text-[#F2E6DE] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg">
        <Play size={24} className="ml-1" />
      </div>
      <p className="font-bold text-primary">How to install on {platform}</p>
      <p className="text-xs font-semibold text-secondary uppercase tracking-widest mt-2">(Video coming soon)</p>
    </div>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-screen bg-surface" />;

  const launchApp = () => {
    localStorage.setItem("himmah_onboarded", "true");
    router.push("/tracker");
  };

  return (
    <div className="min-h-screen bg-surface text-primary font-sans selection:bg-accent/20 selection:text-primary">
      
      {/* ── Navbar ── */}
      <nav className="max-w-4xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="font-arabic text-2xl text-accent font-bold">همة</div>
        <button onClick={launchApp} className="text-xs font-bold uppercase tracking-widest text-accent hover:opacity-70 transition">
          Launch App
        </button>
      </nav>

      <main className="max-w-3xl mx-auto px-6 pb-24">
        
        {/* ── Hero ── */}
        <section className="py-20 text-center border-b border-secondary/10">
          <div className="mb-4 font-arabic text-2xl text-secondary opacity-60">بسم الله الرحمن الرحيم</div>
          <h1 className="font-sans font-extrabold text-6xl md:text-8xl tracking-tight mb-6 text-primary leading-tight">
            Himmah
          </h1>
          <p className="text-lg md:text-xl font-medium text-secondary max-w-xl mx-auto leading-relaxed mb-10">
            Small actions. Steady deen.
          </p>
          <button 
            onClick={launchApp}
            className="bg-accent text-[#F2E6DE] px-10 py-4 text-sm tracking-[0.2em] uppercase font-extrabold hover:bg-accent-soft transition shadow-lg rounded-full active:scale-95"
          >
            Open Web App
          </button>
        </section>

        {/* ── Why I made Himmah ── */}
        <section className="py-16">
          <h2 className="font-sans font-extrabold text-3xl mb-8">Why I made Himmah</h2>
          
          <article className="prose prose-lg prose-p:text-primary prose-p:leading-relaxed prose-p:font-medium space-y-6">
            <p className="font-arabic text-2xl text-secondary opacity-80 text-center my-10">
              بسم الله الرحمن الرحيم
            </p>
            
            <p>I'm not a perfect Muslim. I don't claim to be one.</p>
            
            <p>
              I struggle with my deen just like many of us do. Some days I show up, some days I don't. Sometimes the basics become difficult to keep consistent, even when I know how important they are.
            </p>
            
            <p>That's where Himmah started.</p>
            
            <p>
              I wanted something small that I could keep in my pocket, a simple place to keep track of the basics, reflect on my day, and slowly build a better rhythm around my deen.
            </p>
            
            <p>
              At first, I imagined making something much more complicated. Accounts, cloud storage, AI that would look at my data and try to personalize the experience.
            </p>
            
            <p>Then I thought:</p>
            
            <p className="font-bold text-accent">Why keep something that might benefit me alone?</p>
            
            <p>So I stripped it back.</p>
            
            <ul className="list-none space-y-2 pl-0 font-bold text-secondary my-8">
              <li>&times; No account.</li>
              <li>&times; No sign-up.</li>
              <li>&times; No ads.</li>
              <li>&times; No AI.</li>
              <li>&times; No tracking.</li>
            </ul>
            
            <p>Just a small, private app that lives on your phone.</p>
            
            <p>
              You can use it to keep track of some of the fundamentals, see your rhythm over time, reflect on where you're struggling, and hopefully make small improvements without turning your deen into a competition or a guilt machine.
            </p>
            
            <p>
              I don't know how many people will ever use Himmah. Maybe a handful. Maybe more. That's not really why I made it.
            </p>
            
            <p>
              I just hope that if it helps even one person pray a little more consistently, read a little Qur'an, remember Allah a little more, or simply take one small step back toward their deen, then it was worth making.
            </p>
            
            <p>
              And if you find something that could make Himmah better, tell me. I'd genuinely like to hear it.
            </p>
            
            <p>
              I made this as a small attempt to do something beneficial with what I know how to build. I ask Allah to accept it from me, overlook my shortcomings, and put barakah in whatever good comes from it.
            </p>
            
            <p>
              May Allah accept our intentions, forgive our shortcomings, and make us people who keep returning to Him. Ameen.
            </p>

            <hr className="border-secondary/10 my-12" />

            <h3 className="font-sans font-extrabold text-2xl mb-6">A small reminder</h3>
            
            <p>The Prophet ﷺ said:</p>
            
            <blockquote className="border-l-4 border-accent pl-6 py-2 my-6 italic bg-surface/50 font-semibold text-secondary">
              “Whoever calls to guidance will have a reward similar to the rewards of those who follow it, without that detracting from their rewards in the slightest.”
              <br/><br/>
              <span className="text-sm not-italic opacity-80">— Sahih Muslim 2674</span>
            </blockquote>
            
            <p>So if Himmah benefits you, share it with someone who might benefit from it too.</p>
            
            <p>
              Perhaps you use it.<br/>
              Perhaps they use it.<br/>
              Perhaps they share it with someone else.
            </p>
            
            <p>
              And perhaps, by Allah's mercy, there is reward in every person who finds a little more consistency through it.
            </p>
            
            <p className="font-bold mt-8 text-accent">Allah knows best.</p>
          </article>
        </section>

        {/* ── Installation Guides ── */}
        <section className="py-16 border-t border-secondary/10">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-sm font-extrabold uppercase tracking-[0.2em] text-accent mb-4">Installation</h2>
            <h3 className="font-sans font-extrabold text-3xl mb-4">Use it like a native app</h3>
            <p className="text-secondary font-medium leading-relaxed">
              Himmah is a Progressive Web App (PWA). You can install it directly to your home screen. It will work offline, entirely privately.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* iOS */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-card flex items-center justify-center">
                  <Smartphone className="text-primary" size={20} />
                </div>
                <h4 className="font-extrabold text-2xl">Apple iOS</h4>
              </div>
              <ol className="space-y-3 text-sm font-medium text-secondary">
                <li className="flex gap-3"><span className="font-bold text-accent">1.</span> Open Himmah in Safari</li>
                <li className="flex gap-3"><span className="font-bold text-accent">2.</span> Tap the Share icon</li>
                <li className="flex gap-3"><span className="font-bold text-accent">3.</span> Tap "Add to Home Screen"</li>
                <li className="flex gap-3"><span className="font-bold text-accent">4.</span> Tap "Add" in the top right</li>
              </ol>
              <VideoPlaceholder platform="iPhone / iPad" />
            </div>

            {/* Android */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-card flex items-center justify-center">
                  <Smartphone className="text-primary" size={20} />
                </div>
                <h4 className="font-extrabold text-2xl">Android</h4>
              </div>
              <ol className="space-y-3 text-sm font-medium text-secondary">
                <li className="flex gap-3"><span className="font-bold text-accent">1.</span> Open Himmah in Chrome</li>
                <li className="flex gap-3"><span className="font-bold text-accent">2.</span> Tap the three dots menu</li>
                <li className="flex gap-3"><span className="font-bold text-accent">3.</span> Tap "Install app"</li>
                <li className="flex gap-3"><span className="font-bold text-accent">4.</span> Follow the prompt to install</li>
              </ol>
              <VideoPlaceholder platform="Android" />
            </div>
          </div>
        </section>

      </main>

      {/* ── Footer ── */}
      <footer className="bg-card py-12 border-t border-secondary/10">
        <div className="max-w-3xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Moon size={16} className="text-accent" />
            <span className="font-bold text-sm tracking-widest uppercase">Himmah &copy; {new Date().getFullYear()}</span>
          </div>
          <Link href="/privacy" className="text-sm font-bold text-secondary hover:text-accent transition">
            Privacy Policy
          </Link>
        </div>
      </footer>
    </div>
  );
}
