import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  CreditCard, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  PiggyBank, 
  ArrowRight, 
  AlertTriangle,
  Building,
  HelpCircle,
  FileCheck
} from 'lucide-react';

interface BNPLPageProps {
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const BNPLPage: React.FC<BNPLPageProps> = ({ onNavigate }) => {
  const { 
    bnplApplications, 
    submitBNPLApplication, 
    currentUser, 
    setIsAuthModalOpen 
  } = useStore();

  const [fullName, setFullName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [employmentStatus, setEmploymentStatus] = useState('Salaried Professional');
  const [monthlyIncome, setMonthlyIncome] = useState<number>(350000);
  const [bvnLast4, setBvnLast4] = useState('');
  const [requestedAmount, setRequestedAmount] = useState<number>(100000);
  const [itemsSummary, setItemsSummary] = useState('Luxury Haute Couture & Accessories');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    await submitBNPLApplication({
      customerId: currentUser.id,
      customerName: fullName || currentUser.name,
      customerEmail: email || currentUser.email,
      customerPhone: phone || currentUser.phone || '09012776272',
      amount: requestedAmount,
      itemsSummary,
      provider: 'Credibly',
      employmentStatus,
      monthlyIncome,
      bvnLast4: bvnLast4 || '0000'
    });
    setSubmitted(true);
  };

  const userApps = bnplApplications.filter(a => !currentUser || a.customerId === currentUser.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Hero Banner */}
      <div className="bnpl-hero rounded-3xl bg-gradient-to-r from-[#14141B] via-[#1B1422] to-[#14141B] border border-[#2B2B3E] p-8 sm:p-12 shadow-2xl">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#ECC260] text-xs font-bold uppercase tracking-wider">
            <CreditCard className="w-4 h-4 text-[#ECC260]" />
            Financing & Buy Now Pay Later
          </div>

          <h1 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-white leading-tight">
            Buy Now Pay Later: <br />
            <span className="gold-gradient-text">Credibly Partner Integration</span>
          </h1>

          <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
            P-Kess Fashion World believes in accessible luxury. We are actively establishing institutional underwriting channels with financing partners, including <strong>Credibly</strong>, to power structured installment plans for qualified Nigerian retail customers.
          </p>

          {/* Official Provider Status Banner */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs text-amber-200">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-white mb-0.5">Integration Notice & Provider Compliance:</strong>
              As required by Nigerian financial regulatory and cross-border lending frameworks, Credibly consumer point-of-sale checkout is currently in technical assessment for Nigerian merchants. Applications submitted below are queued for provider pre-qualification review. <strong>No credit agreement is finalized until official partner confirmation.</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Application Form & Provider Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Form Column */}
        <div className="lg:col-span-7 bg-[#101016] border border-[#2B2B3E] rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-zinc-800 pb-3">
            <h2 className="font-serif-luxury text-xl font-bold text-white">
              BNPL Pre-Qualification Assessment
            </h2>
            <p className="text-xs text-zinc-400">
              Submit your interest to be pre-screened for credit limits up to ₦500,000 once provider underwriting goes live.
            </p>
          </div>

          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-14 h-14 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                <Clock className="w-7 h-7" />
              </div>
              <h3 className="font-serif-luxury text-xl font-bold text-white">Application Queued for Review</h3>
              <p className="text-xs text-zinc-300 max-w-md mx-auto leading-relaxed">
                Thank you! Your BNPL assessment request has been recorded with reference number{' '}
                <strong className="text-[#ECC260]">CRD-NG-2026-PENDING</strong>. Status is currently marked as <em>Under Review</em> awaiting provider credit facility availability for Nigerian retailers.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 transition-colors"
                >
                  Submit Another Inquery
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-zinc-300 block mb-1 font-medium">Applicant Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Chioma Okonkwo"
                    className="w-full bg-[#181824] border border-[#2F2F44] rounded-xl p-3 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="text-zinc-300 block mb-1 font-medium">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. chioma@gmail.com"
                    className="w-full bg-[#181824] border border-[#2F2F44] rounded-xl p-3 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-zinc-300 block mb-1 font-medium">Phone Number (Nigeria)</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 09012776272"
                    className="w-full bg-[#181824] border border-[#2F2F44] rounded-xl p-3 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="text-zinc-300 block mb-1 font-medium">Employment Status</label>
                  <select
                    value={employmentStatus}
                    onChange={(e) => setEmploymentStatus(e.target.value)}
                    className="w-full bg-[#181824] border border-[#2F2F44] rounded-xl p-3 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="Salaried Professional">Salaried Professional</option>
                    <option value="Business Owner / Entrepreneur">Business Owner / Entrepreneur</option>
                    <option value="Self-Employed">Self-Employed</option>
                    <option value="Civil Servant">Civil Servant</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-zinc-300 block mb-1 font-medium">Estimated Monthly Income (₦)</label>
                  <input
                    type="number"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                    className="w-full bg-[#181824] border border-[#2F2F44] rounded-xl p-3 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="text-zinc-300 block mb-1 font-medium">BVN Last 4 Digits (Identity Check)</label>
                  <input
                    type="text"
                    maxLength={4}
                    value={bvnLast4}
                    onChange={(e) => setBvnLast4(e.target.value)}
                    placeholder="4491"
                    className="w-full bg-[#181824] border border-[#2F2F44] rounded-xl p-3 text-white text-xs font-mono focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-300 block mb-1 font-medium">Requested Credit Limit (₦)</label>
                <input
                  type="number"
                  value={requestedAmount}
                  onChange={(e) => setRequestedAmount(Number(e.target.value))}
                  className="w-full bg-[#181824] border border-[#2F2F44] rounded-xl p-3 text-white text-xs font-bold text-[#ECC260] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-zinc-800 text-[11px] text-zinc-400">
                P-Kess Fashion World never charges application fees for credit pre-qualification. By submitting, you consent to credit bureau evaluation once Credibly partner terms are activated.
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#B88B22] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.99] transition-all shadow-lg"
              >
                Submit BNPL Evaluation Request
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

        {/* Right Info Column: Save to Buy Alternative */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl bg-[#14141C] border border-[#2B2B3E] p-6 sm:p-8 space-y-5 shadow-xl">
            <div className="w-10 h-10 rounded-full bg-[#E6007A]/20 text-[#FF66B2] flex items-center justify-center">
              <PiggyBank className="w-5 h-5" />
            </div>

            <h3 className="font-serif-luxury text-xl font-bold text-white">
              Why Wait? Try "Save to Buy" Today
            </h3>

            <p className="text-xs text-zinc-300 leading-relaxed">
              While BNPL providers finalize their underwriting facilities in Nigeria, <strong>P-Kess Save to Buy is 100% active, zero debt, and guaranteed</strong>!
            </p>

            <ul className="space-y-2.5 text-xs text-zinc-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero interest rate (0% APR) and zero hidden fees.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>No credit checks, BVN submission or risk of bad debt.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Your exact size is held in Asaba until completion.</span>
              </li>
            </ul>

            <button
              onClick={() => onNavigate('save-to-buy')}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#E6007A] to-[#B3005F] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:brightness-110 shadow-lg"
            >
              Switch to Save to Buy Programme
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* My Submitted Applications */}
          {userApps.length > 0 && (
            <div className="rounded-3xl bg-[#111117] border border-[#2B2B3E] p-6 space-y-4">
              <div className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center justify-between border-b border-zinc-800 pb-2">
                <span>My BNPL Records ({userApps.length})</span>
                <span className="text-[#ECC260]">Audit Log</span>
              </div>

              <div className="space-y-3">
                {userApps.map(app => (
                  <div key={app.id} className="p-3 rounded-xl bg-black/40 border border-zinc-800 space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-zinc-400 text-[11px]">{app.referenceNumber}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {app.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white font-semibold">₦{app.amount.toLocaleString()}</span>
                      <span className="text-zinc-500 text-[10px]">{app.createdAt.split('T')[0]}</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 italic bg-[#171720] p-2 rounded">
                      "{app.providerNote}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
