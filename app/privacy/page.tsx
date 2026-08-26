import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-ink text-parchment py-12 px-6 font-sans">
      <div className="max-w-2xl mx-auto bg-parchment text-ink-deep rounded-card p-8 shadow-sm">
        <Link href="/" className="text-ink-deep text-sm mb-6 inline-block font-semibold uppercase tracking-wider hover:opacity-80 transition">
          &larr; Back
        </Link>
        <h1 className="font-sans font-extrabold text-3xl mb-6 tracking-tight">Privacy Policy</h1>
        
        <div className="space-y-6 text-sm leading-relaxed font-medium">
          <p>
            At <strong>Himmah همة</strong>, your privacy is our core philosophy. Because this app is designed for personal spiritual reflection, it is built to keep your data completely on your device.
          </p>

          <h2 className="font-sans font-bold text-xl mt-6 border-b border-ink/10 pb-2">1. Your Data Stays Local</h2>
          <p>
            Himmah is an <strong>offline-first</strong> application. This means:
          </p>
          <ul className="list-disc pl-5 space-y-2 opacity-90">
            <li>We do not require you to create an account.</li>
            <li>We do not ask for your email address or personal details.</li>
            <li>Your daily tracking data, prayers, and personal reflections are saved directly to your device's local storage.</li>
            <li>No tracking data is ever transmitted to a cloud server or a database.</li>
            <li>We do not use any AI providers or external processors to analyze your habits.</li>
          </ul>

          <h2 className="font-sans font-bold text-xl mt-6 border-b border-ink/10 pb-2">2. What Leaves Your Device?</h2>
          <p>
            The only information that ever leaves your device is:
          </p>
          <ul className="list-disc pl-5 space-y-2 opacity-90">
            <li><strong>Push Notifications (Optional)</strong>: If you enable reminders, your browser generates a standard Web Push subscription token to allow notifications to reach your device. This is anonymous.</li>
            <li><strong>Feedback Box (Optional)</strong>: If you choose to submit a bug report or suggestion through the "Have an idea?" box, your message is sent securely to our feedback database. <em>Please do not include private reflections in the feedback box.</em></li>
          </ul>

          <h2 className="font-sans font-bold text-xl mt-6 border-b border-ink/10 pb-2">3. App Lock & Security</h2>
          <p>
            You may optionally secure Himmah using a 4-digit passcode. This passcode is also stored locally. Because we have no accounts and no central database, <strong>we cannot recover your passcode if you forget it</strong>. 
          </p>

          <h2 className="font-sans font-bold text-xl mt-6 border-b border-ink/10 pb-2">4. Analytics & Ads</h2>
          <p>
            We do not use Google Analytics, behavioral tracking, or any advertising SDKs. 
          </p>

          <p className="mt-8 text-xs text-ink/50 font-semibold uppercase tracking-widest">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}
