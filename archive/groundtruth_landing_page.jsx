import { useState, useEffect, useRef } from "react";

// ─── BRAND TOKENS ────────────────────────────────────────────────
const C = {
  navy:       "#0D1B2A",
  navyDeep:   "#070f18",
  teal:       "#1B7A6E",
  tealLight:  "#E8F5F3",
  tealDark:   "#145f55",
  gold:       "#C9A84C",
  goldLight:  "#FDF6E3",
  lightGray:  "#F4F6F8",
  midGray:    "#8A9BB0",
  darkText:   "#1A2332",
  white:      "#FFFFFF",
  green:      "#27AE60",
  greenLight: "#E8F8EE",
  red:        "#E8453C",
};

// ─── TAX DATA (2025 effective rates) ─────────────────────────────
const STATE_DATA = {
  "New Jersey":     { it:{u75:0.057,u100:0.063,u150:0.072,u200:0.082,u300:0.093,over:0.103}, pt:0.0223 },
  "New York":       { it:{u75:0.055,u100:0.063,u150:0.069,u200:0.076,u300:0.085,over:0.109}, pt:0.0172 },
  "California":     { it:{u75:0.042,u100:0.060,u150:0.080,u200:0.093,u300:0.103,over:0.133}, pt:0.0075 },
  "Illinois":       { it:{u75:0.0495,u100:0.0495,u150:0.0495,u200:0.0495,u300:0.0495,over:0.0495}, pt:0.0202 },
  "Connecticut":    { it:{u75:0.035,u100:0.050,u150:0.055,u200:0.060,u300:0.065,over:0.069}, pt:0.0194 },
  "Massachusetts":  { it:{u75:0.050,u100:0.050,u150:0.050,u200:0.050,u300:0.050,over:0.090}, pt:0.0114 },
  "Pennsylvania":   { it:{u75:0.0307,u100:0.0307,u150:0.0307,u200:0.0307,u300:0.0307,over:0.0307}, pt:0.0153 },
  "Maryland":       { it:{u75:0.045,u100:0.049,u150:0.052,u200:0.055,u300:0.058,over:0.058}, pt:0.0099 },
  "Virginia":       { it:{u75:0.046,u100:0.051,u150:0.055,u200:0.055,u300:0.055,over:0.055}, pt:0.0082 },
  "Ohio":           { it:{u75:0.027,u100:0.030,u150:0.035,u200:0.040,u300:0.040,over:0.040}, pt:0.0153 },
  "Michigan":       { it:{u75:0.0425,u100:0.0425,u150:0.0425,u200:0.0425,u300:0.0425,over:0.0425}, pt:0.0142 },
  "Minnesota":      { it:{u75:0.053,u100:0.063,u150:0.073,u200:0.078,u300:0.098,over:0.098}, pt:0.0111 },
  "Wisconsin":      { it:{u75:0.046,u100:0.053,u150:0.063,u200:0.076,u300:0.076,over:0.076}, pt:0.0157 },
  "Colorado":       { it:{u75:0.044,u100:0.044,u150:0.044,u200:0.044,u300:0.044,over:0.044}, pt:0.0051 },
  "Washington":     { it:{u75:0.000,u100:0.000,u150:0.000,u200:0.000,u300:0.000,over:0.070}, pt:0.0093 },
  "Oregon":         { it:{u75:0.075,u100:0.087,u150:0.099,u200:0.099,u300:0.099,over:0.099}, pt:0.0097 },
  "Georgia":        { it:{u75:0.054,u100:0.054,u150:0.054,u200:0.054,u300:0.054,over:0.054}, pt:0.0092 },
  "North Carolina": { it:{u75:0.045,u100:0.045,u150:0.045,u200:0.045,u300:0.045,over:0.045}, pt:0.0077 },
  "Florida":        { it:{u75:0.000,u100:0.000,u150:0.000,u200:0.000,u300:0.000,over:0.000}, pt:0.0089 },
  "Texas":          { it:{u75:0.000,u100:0.000,u150:0.000,u200:0.000,u300:0.000,over:0.000}, pt:0.0160 },
  "Arizona":        { it:{u75:0.025,u100:0.025,u150:0.025,u200:0.025,u300:0.025,over:0.025}, pt:0.0063 },
  "Nevada":         { it:{u75:0.000,u100:0.000,u150:0.000,u200:0.000,u300:0.000,over:0.000}, pt:0.0060 },
  "Indiana":        { it:{u75:0.030,u100:0.030,u150:0.030,u200:0.030,u300:0.030,over:0.030}, pt:0.0085 },
  "Missouri":       { it:{u75:0.040,u100:0.047,u150:0.054,u200:0.054,u300:0.054,over:0.054}, pt:0.0099 },
};

const INC = {
  "under75":  {mid:60000,  key:"u75"},
  "75-100":   {mid:87500,  key:"u100"},
  "100-150":  {mid:125000, key:"u150"},
  "150-200":  {mid:175000, key:"u200"},
  "200-300":  {mid:250000, key:"u300"},
  "300plus":  {mid:400000, key:"over"},
};
const HV = {
  "under300":300000,"300-400":350000,"400-500":450000,
  "500-600":550000,"600-800":700000,"800plus":900000,
};

// ─── CALC ENGINE ─────────────────────────────────────────────────
function calcSavings(state, inc, hv) {
  const d = STATE_DATA[state]; if (!d) return null;
  const i = INC[inc]; const h = HV[hv]; if (!i||!h) return null;
  const itSave = i.mid * d.it[i.key];
  const ptSave = h * (d.pt - 0.0052);
  const annual = itSave + ptSave;
  return {
    annual, tenYear:annual*10, monthly:annual/12,
    itSave, ptSave,
    itRate:(d.it[i.key]*100).toFixed(1),
    ptRate:(d.pt*100).toFixed(2),
    state,
  };
}

const fmt  = n => "$" + Math.round(Math.abs(n)).toLocaleString();
const fmtK = n => "$" + Math.round(Math.abs(n)/1000) + "k";
const isValidEmail = e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

// ─── COUNT-UP HOOK ────────────────────────────────────────────────
function useCountUp(target, ms=1100) {
  const [v, setV] = useState(0);
  const r = useRef();
  useEffect(() => {
    if (!target) { setV(0); return; }
    const s = Date.now(), from = v;
    clearInterval(r.current);
    r.current = setInterval(() => {
      const p = Math.min((Date.now()-s)/ms, 1);
      const e = 1 - Math.pow(1-p, 3);
      setV(Math.round(from + (target-from)*e));
      if (p>=1) clearInterval(r.current);
    }, 16);
    return () => clearInterval(r.current);
  }, [target]);
  return v;
}

// ─── SMOOTH SCROLL HELPER ─────────────────────────────────────────
function scrollTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior:"smooth", block:"start" });
}

// ─── SELECT PRIMITIVE ─────────────────────────────────────────────
function Sel({ value, onChange, children, dark, ariaLabel }) {
  const [f, setF] = useState(false);
  return (
    <div style={{position:"relative"}}>
      <select
        value={value} onChange={e=>onChange(e.target.value)}
        onFocus={()=>setF(true)} onBlur={()=>setF(false)}
        aria-label={ariaLabel}
        style={{
          width:"100%", padding:"12px 36px 12px 14px",
          borderRadius:"8px", fontSize:"14px", fontFamily:"inherit",
          outline:"none", appearance:"none", cursor:"pointer",
          transition:"all 0.2s", boxSizing:"border-box",
          border:`1.5px solid ${f?C.gold:dark?"rgba(255,255,255,0.2)":"#D0D8E4"}`,
          background:dark?(f?"rgba(255,255,255,0.12)":"rgba(255,255,255,0.07)"):C.white,
          color:dark?(value?C.white:C.midGray):(value?C.darkText:C.midGray),
          boxShadow:f?`0 0 0 3px rgba(201,168,76,0.2)`:"none",
        }}>
        {children}
      </select>
      <span style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",
        color:C.gold,fontSize:10,pointerEvents:"none"}}>▼</span>
    </div>
  );
}

// ─── FAQ ITEM (defined BEFORE LandingPage) ────────────────────────
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{borderBottom:`1px solid ${C.lightGray}`,padding:"20px 0"}}>
      <button
        onClick={()=>setOpen(!open)}
        aria-expanded={open}
        style={{
          width:"100%", background:"none", border:"none", cursor:"pointer",
          display:"flex", justifyContent:"space-between", alignItems:"center",
          gap:16, padding:0, fontFamily:"inherit", textAlign:"left",
        }}>
        <span style={{fontSize:16,fontWeight:700,color:C.navy,lineHeight:1.4}}>{q}</span>
        <span style={{
          fontSize:20, color:C.teal, flexShrink:0,
          transform:open?"rotate(45deg)":"rotate(0deg)",
          transition:"transform 0.2s", display:"inline-block",
        }}>+</span>
      </button>
      {open && (
        <p style={{fontSize:15,color:"#4a5568",lineHeight:1.75,marginTop:12,
          animation:"fadeUp 0.25s ease both"}}>{a}</p>
      )}
    </div>
  );
}

// ─── EMBEDDED CALCULATOR ──────────────────────────────────────────
function Calculator() {
  const [state,  setState]  = useState("");
  const [inc,    setInc]    = useState("");
  const [hv,     setHv]     = useState("");
  const [email,  setEmail]  = useState("");
  const [sent,   setSent]   = useState(false);
  const [sending,setSending]= useState(false);
  const [emailErr,setEmailErr]=useState("");
  const [ef,     setEf]     = useState(false);

  const res  = (state&&inc&&hv) ? calcSavings(state,inc,hv) : null;
  const pos  = res && res.annual > 0;
  const animAnnual  = useCountUp(res&&pos?res.annual:0);
  const animTenYear = useCountUp(res&&pos?res.tenYear:0, 1500);

  // ── Lead capture — stub wired to API route ──
  const handleSend = async () => {
    setEmailErr("");
    if (!isValidEmail(email)) {
      setEmailErr("Please enter a valid email address.");
      return;
    }
    setSending(true);
    try {
      // POST to /api/leads — connects to Supabase + Resend
      await fetch("/api/leads", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          fromState: state,
          incomeBracket: inc,
          homeValue: hv,
          annualSavings: res?.annual || 0,
          source: "calculator",
          discountCode: "GROUNDTRUTH20",
        }),
      });
      setSent(true);
    } catch(err) {
      // Fail gracefully — still mark sent so user isn't stuck
      setSent(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{
      background:`linear-gradient(150deg,${C.navy} 0%,#0a2338 50%,#0c2e1e 100%)`,
      borderRadius:20, overflow:"hidden",
      boxShadow:"0 24px 80px rgba(0,0,0,0.35)",
      border:"1px solid rgba(255,255,255,0.08)",
    }}>
      {/* Header */}
      <div style={{padding:"18px 28px",borderBottom:"1px solid rgba(255,255,255,0.08)",
        display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div>
          <span style={{fontSize:13,fontWeight:700,color:C.gold,
            letterSpacing:"0.08em",textTransform:"uppercase"}}>
            Free Tennessee Tax Savings Calculator
          </span>
          <p style={{margin:"2px 0 0",fontSize:12,color:C.midGray}}>
            Real 2025 rates · 24 states · Instant results
          </p>
        </div>
        <div style={{
          background:"rgba(27,122,110,0.2)",border:"1px solid rgba(27,122,110,0.4)",
          borderRadius:20,padding:"4px 12px",fontSize:11,color:C.tealLight,fontWeight:700,
        }}>● LIVE</div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr"}}>

        {/* Inputs */}
        <div style={{padding:"24px 28px",borderRight:"1px solid rgba(255,255,255,0.07)"}}>
          <p style={{margin:"0 0 18px",fontSize:13,color:C.midGray,lineHeight:1.6}}>
            Select your state, income, and target home value to see your exact annual savings.
          </p>
          {[
            {label:"I currently live in", val:state, set:setState, aria:"Current state of residence",
              opts:[["","Select your state..."],...Object.keys(STATE_DATA).sort().map(s=>[s,s])]},
            {label:"Household income", val:inc, set:setInc, aria:"Household income bracket",
              opts:[["","Select range..."],["under75","Under $75,000"],["75-100","$75k – $100k"],
                ["100-150","$100k – $150k"],["150-200","$150k – $200k"],
                ["200-300","$200k – $300k"],["300plus","$300k+"]]},
            {label:"TN home value target", val:hv, set:setHv, aria:"Tennessee home value",
              opts:[["","Select range..."],["under300","Under $300k"],["300-400","$300k – $400k"],
                ["400-500","$400k – $500k"],["500-600","$500k – $600k"],
                ["600-800","$600k – $800k"],["800plus","$800k+"]]},
          ].map(f => (
            <div key={f.label} style={{marginBottom:14}}>
              <label style={{display:"block",fontSize:11,fontWeight:700,
                color:"rgba(255,255,255,0.45)",letterSpacing:"0.08em",
                textTransform:"uppercase",marginBottom:6}}>
                {f.label}
              </label>
              <Sel value={f.val} onChange={f.set} dark ariaLabel={f.aria}>
                {f.opts.map(([v,l])=><option key={v} value={v}>{l}</option>)}
              </Sel>
            </div>
          ))}
        </div>

        {/* Results */}
        <div style={{padding:"24px 28px"}}>
          {!res ? (
            <div style={{height:"100%",display:"flex",flexDirection:"column",
              alignItems:"center",justifyContent:"center",textAlign:"center",gap:12,minHeight:240}}>
              <div style={{fontSize:44,opacity:0.2}}>💰</div>
              <p style={{color:C.midGray,fontSize:13,lineHeight:1.6,margin:0}}>
                Complete all 3 fields to see your personalized Tennessee savings
              </p>
            </div>
          ) : !pos ? (
            <div style={{textAlign:"center",paddingTop:20}}>
              <p style={{fontSize:28,margin:"0 0 12px"}}>🏖️</p>
              <p style={{color:C.white,fontWeight:700,fontSize:15,margin:"0 0 8px"}}>
                You're already in a no-income-tax state
              </p>
              <p style={{color:C.midGray,fontSize:13,lineHeight:1.6,margin:"0 0 16px"}}>
                Tennessee still offers lower cost of living and no state income tax. Our report covers flood risk, schools, and market data your agent won't surface.
              </p>
              <button onClick={()=>scrollTo("pricing")} style={{
                padding:"10px 20px",borderRadius:8,border:"none",
                background:`linear-gradient(135deg,${C.teal},${C.tealDark})`,
                color:C.white,fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit",
              }}>See report options →</button>
            </div>
          ) : (
            <div style={{animation:"fadeUp 0.4s ease both"}}>
              {/* Big number */}
              <div style={{marginBottom:14}}>
                <p style={{margin:"0 0 4px",fontSize:11,fontWeight:700,
                  color:"rgba(255,255,255,0.4)",letterSpacing:"0.08em",textTransform:"uppercase"}}>
                  Your estimated annual savings
                </p>
                <div style={{display:"flex",alignItems:"flex-end",gap:4}}>
                  <span style={{fontSize:"clamp(34px,4.5vw,50px)",fontWeight:800,
                    color:C.white,letterSpacing:"-0.03em",lineHeight:1}}>
                    {fmt(animAnnual)}
                  </span>
                  <span style={{fontSize:15,color:C.midGray,paddingBottom:5}}>/yr</span>
                </div>
                <p style={{margin:"4px 0 0",fontSize:12,color:C.tealLight}}>
                  Moving from {res.state} → Tennessee
                </p>
              </div>

              {/* 10-year */}
              <div style={{
                background:"rgba(201,168,76,0.12)",border:"1px solid rgba(201,168,76,0.25)",
                borderRadius:8,padding:"10px 14px",marginBottom:12,
                display:"flex",justifyContent:"space-between",alignItems:"center",
              }}>
                <p style={{margin:0,fontSize:12,color:"rgba(201,168,76,0.8)"}}>10-year cumulative</p>
                <p style={{margin:0,fontSize:20,fontWeight:800,color:C.gold}}>{fmtK(animTenYear)}</p>
              </div>

              {/* Breakdown */}
              <div style={{marginBottom:14}}>
                {[
                  {label:`Income tax (${res.itRate}% → 0%)`, save:res.itSave},
                  {label:`Property tax (${res.ptRate}% → 0.52%)`, save:res.ptSave},
                ].map(row=>(
                  <div key={row.label} style={{
                    display:"flex",justifyContent:"space-between",alignItems:"center",
                    padding:"7px 0",borderBottom:"1px solid rgba(255,255,255,0.06)",
                  }}>
                    <span style={{fontSize:12,color:C.midGray}}>{row.label}</span>
                    <span style={{fontSize:13,fontWeight:700,
                      color:row.save>0?C.green:C.midGray}}>
                      {row.save>0?`+${fmt(row.save)}`:"No change"}
                    </span>
                  </div>
                ))}
                <div style={{display:"flex",justifyContent:"space-between",paddingTop:8}}>
                  <span style={{fontSize:12,fontWeight:700,color:C.white}}>Monthly savings</span>
                  <span style={{fontSize:14,fontWeight:800,color:C.tealLight}}>{fmt(res.monthly)}/mo</span>
                </div>
              </div>

              {/* ── BRIDGE: Calculator → Order CTA ── */}
              <div style={{
                background:`linear-gradient(135deg,rgba(27,122,110,0.25),rgba(27,122,110,0.1))`,
                border:"1px solid rgba(27,122,110,0.35)",
                borderRadius:10,padding:"12px 14px",marginBottom:14,
              }}>
                <p style={{margin:"0 0 6px",fontSize:13,fontWeight:700,color:C.white}}>
                  Your savings are real. Now find out if the property is worth buying.
                </p>
                <p style={{margin:"0 0 10px",fontSize:12,color:C.midGray,lineHeight:1.5}}>
                  Flood risk, septic records, school ratings, and a full market analysis — engineer-verified, in 48 hours.
                </p>
                <button onClick={()=>scrollTo("pricing")} style={{
                  width:"100%",padding:"10px",borderRadius:7,border:"none",
                  background:`linear-gradient(135deg,${C.gold},#a88530)`,
                  color:C.navy,fontWeight:800,fontSize:13,cursor:"pointer",fontFamily:"inherit",
                }}>
                  Order my property report →
                </button>
              </div>

              {/* Email capture */}
              {!sent ? (
                <div>
                  <p style={{margin:"0 0 6px",fontSize:12,color:C.midGray}}>
                    Or get a sample report + <strong style={{color:C.gold}}>20% off</strong>:
                  </p>
                  <div style={{display:"flex",gap:8}}>
                    <input type="email" placeholder="your@email.com" value={email}
                      onChange={e=>{setEmail(e.target.value);setEmailErr("");}}
                      onFocus={()=>setEf(true)} onBlur={()=>setEf(false)}
                      aria-label="Email address for sample report"
                      style={{
                        flex:1,padding:"9px 12px",borderRadius:7,fontSize:13,
                        fontFamily:"inherit",outline:"none",
                        border:`1.5px solid ${emailErr?C.red:ef?C.gold:"rgba(255,255,255,0.15)"}`,
                        background:"rgba(255,255,255,0.07)",color:C.white,
                      }}/>
                    <button onClick={handleSend} disabled={sending}
                      style={{
                        padding:"9px 14px",borderRadius:7,border:"none",
                        background:sending?"rgba(255,255,255,0.1)":`linear-gradient(135deg,${C.gold},#a88530)`,
                        color:sending?C.midGray:C.navy,fontWeight:800,fontSize:13,
                        cursor:sending?"not-allowed":"pointer",fontFamily:"inherit",whiteSpace:"nowrap",
                      }}>
                      {sending?"Sending…":"Send →"}
                    </button>
                  </div>
                  {emailErr && <p style={{margin:"4px 0 0",fontSize:11,color:C.red}}>{emailErr}</p>}
                </div>
              ) : (
                <div style={{
                  background:C.greenLight,borderRadius:8,padding:"12px 14px",
                  textAlign:"center",animation:"fadeUp 0.3s ease both",
                }}>
                  <p style={{margin:0,fontSize:13,fontWeight:700,color:C.green}}>
                    ✓ Check your inbox — sample report + 20% code on the way
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div style={{padding:"10px 28px",borderTop:"1px solid rgba(255,255,255,0.06)"}}>
        <p style={{margin:0,fontSize:10,color:"rgba(255,255,255,0.25)",lineHeight:1.6}}>
          Estimates use state average effective rates and income bracket midpoints. Not tax advice. Consult a licensed CPA. Individual results vary.
        </p>
      </div>
    </div>
  );
}

// ─── LANDING PAGE ─────────────────────────────────────────────────
export default function LandingPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled,   setScrolled]   = useState(false);
  const [isMobile,   setIsMobile]   = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const NAV_LINKS = [
    {label:"How it works", id:"how-it-works"},
    {label:"What's included", id:"reports"},
    {label:"Pricing", id:"pricing"},
    {label:"About", id:"about"},
  ];

  const handleNav = (id) => {
    scrollTo(id);
    setMobileOpen(false);
  };

  return (
    <div style={{fontFamily:"'Inter',system-ui,-apple-system,sans-serif",color:C.darkText,background:C.white}}>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        *{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        a{text-decoration:none}
        section{scroll-margin-top:72px}
        button:focus-visible,a:focus-visible{outline:2px solid ${C.gold};outline-offset:2px}
      `}</style>

      {/* ── NAV ── */}
      <nav style={{
        position:"fixed",top:0,left:0,right:0,zIndex:100,
        background:scrolled||mobileOpen?"rgba(13,27,42,0.97)":"transparent",
        backdropFilter:scrolled||mobileOpen?"blur(12px)":"none",
        borderBottom:scrolled||mobileOpen?"1px solid rgba(255,255,255,0.08)":"none",
        transition:"all 0.3s",
      }}>
        <div style={{maxWidth:1100,margin:"0 auto",padding:"0 24px",
          height:64,display:"flex",alignItems:"center",justifyContent:"space-between"}}>

          {/* Logo */}
          <button onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}
            style={{background:"none",border:"none",cursor:"pointer",padding:0}}>
            <span style={{fontWeight:800,fontSize:20,color:C.white,letterSpacing:"-0.02em"}}>GroundTruth</span>
            <span style={{fontWeight:800,fontSize:20,color:C.gold,letterSpacing:"-0.02em"}}> Property AI</span>
          </button>

          {/* Desktop links */}
          {!isMobile && (
            <div style={{display:"flex",alignItems:"center",gap:28}}>
              {NAV_LINKS.map(l=>(
                <button key={l.id} onClick={()=>handleNav(l.id)}
                  style={{background:"none",border:"none",cursor:"pointer",
                    fontSize:14,color:"rgba(255,255,255,0.7)",fontWeight:500,
                    fontFamily:"inherit",padding:0,transition:"color 0.2s"}}
                  onMouseEnter={e=>e.target.style.color=C.white}
                  onMouseLeave={e=>e.target.style.color="rgba(255,255,255,0.7)"}>
                  {l.label}
                </button>
              ))}
              <button onClick={()=>handleNav("pricing")} style={{
                padding:"9px 20px",borderRadius:8,border:"none",cursor:"pointer",
                background:`linear-gradient(135deg,${C.gold},#a88530)`,
                color:C.navy,fontWeight:800,fontSize:14,fontFamily:"inherit",
              }}>
                Get a Report
              </button>
            </div>
          )}

          {/* Mobile hamburger */}
          {isMobile && (
            <button onClick={()=>setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen?"Close menu":"Open menu"}
              aria-expanded={mobileOpen}
              style={{
                background:"none",border:"1px solid rgba(255,255,255,0.2)",
                borderRadius:6,padding:"8px 12px",cursor:"pointer",color:C.white,
                fontSize:18,fontFamily:"inherit",
              }}>
              {mobileOpen?"✕":"☰"}
            </button>
          )}
        </div>

        {/* Mobile dropdown */}
        {isMobile && mobileOpen && (
          <div style={{
            background:"rgba(13,27,42,0.99)",
            borderTop:"1px solid rgba(255,255,255,0.08)",
            padding:"16px 24px 24px",
            animation:"fadeIn 0.2s ease both",
          }}>
            {NAV_LINKS.map(l=>(
              <button key={l.id} onClick={()=>handleNav(l.id)}
                style={{
                  display:"block",width:"100%",textAlign:"left",
                  background:"none",border:"none",cursor:"pointer",
                  padding:"14px 0",fontSize:16,color:C.white,fontWeight:600,
                  fontFamily:"inherit",borderBottom:"1px solid rgba(255,255,255,0.07)",
                }}>
                {l.label}
              </button>
            ))}
            <button onClick={()=>handleNav("pricing")} style={{
              display:"block",width:"100%",marginTop:16,
              padding:"14px",borderRadius:9,border:"none",cursor:"pointer",
              background:`linear-gradient(135deg,${C.gold},#a88530)`,
              color:C.navy,fontWeight:800,fontSize:15,fontFamily:"inherit",
              textAlign:"center",
            }}>
              Get a Report →
            </button>
          </div>
        )}
      </nav>

      {/* ── HERO + CALCULATOR ── */}
      <section id="hero" style={{
        background:`linear-gradient(160deg,${C.navyDeep} 0%,${C.navy} 40%,#0c2c1a 100%)`,
        minHeight:"100vh",paddingTop:64,
        display:"flex",alignItems:"center",
      }}>
        <div style={{
          maxWidth:1100,margin:"0 auto",padding:"60px 24px 80px",
          display:"grid",
          gridTemplateColumns:isMobile?"1fr":"1fr 1.1fr",
          gap:isMobile?40:60,alignItems:"center",
        }}>

          {/* Left copy */}
          <div style={{animation:"fadeUp 0.6s ease both"}}>
            <div style={{
              display:"inline-block",marginBottom:20,
              background:"rgba(201,168,76,0.12)",border:"1px solid rgba(201,168,76,0.3)",
              borderRadius:20,padding:"5px 14px",
              fontSize:11,fontWeight:700,color:C.gold,
              letterSpacing:"0.08em",textTransform:"uppercase",
            }}>
              Engineering-Grade Property Intelligence · Tennessee
            </div>

            {/* UPDATED HEADLINE — leads with buyer's pain, not tagline */}
            <h1 style={{
              fontSize:"clamp(30px,4vw,52px)",fontWeight:800,
              lineHeight:1.1,letterSpacing:"-0.03em",color:C.white,marginBottom:20,
            }}>
              You're buying in Tennessee.<br/>
              <span style={{color:C.gold}}>Your agent doesn't know</span><br/>
              the flood maps, the septic<br/>
              records, or what you'll<br/>
              actually save on taxes.<br/>
              <span style={{color:"rgba(255,255,255,0.7)",fontSize:"0.75em",fontWeight:600}}>
                We do.
              </span>
            </h1>

            <p style={{fontSize:16,color:"rgba(255,255,255,0.6)",lineHeight:1.75,marginBottom:28,maxWidth:420}}>
              Tennessee added 90,000+ new residents last year — most from NJ, NY, and CA.
              Most bought blindly. GroundTruth gives you the data your agent won't:
              flood risk, septic records, school quality, and your exact tax savings —
              verified by a licensed civil engineer.
            </p>

            {/* Credentials */}
            <div style={{display:"flex",flexWrap:"wrap",gap:10,marginBottom:32}}>
              {["ACI Grade 1 · NICET Level III","NJDOT · OSHA 30","30+ Years Civil Engineering"].map(c=>(
                <div key={c} style={{
                  display:"flex",alignItems:"center",gap:8,
                  background:"rgba(255,255,255,0.06)",
                  border:"1px solid rgba(255,255,255,0.1)",
                  borderRadius:8,padding:"7px 12px",
                }}>
                  <span style={{color:C.teal,fontSize:14}}>✓</span>
                  <span style={{fontSize:12,color:"rgba(255,255,255,0.7)",fontWeight:600}}>{c}</span>
                </div>
              ))}
            </div>

            {/* Market urgency signal */}
            <div style={{
              display:"inline-flex",alignItems:"center",gap:10,
              background:"rgba(232,69,60,0.1)",border:"1px solid rgba(232,69,60,0.25)",
              borderRadius:8,padding:"10px 14px",marginBottom:32,
            }}>
              <span style={{fontSize:16}}>🔥</span>
              <p style={{margin:0,fontSize:13,color:"rgba(255,255,255,0.75)",lineHeight:1.4}}>
                <strong style={{color:C.white}}>Wilson County median DOM: 11 days.</strong>{" "}
                You need this data before you make an offer — not after.
              </p>
            </div>

            {/* Stats */}
            <div style={{display:"flex",gap:28,flexWrap:"wrap"}}>
              {[
                {n:"$15,408",l:"avg annual savings\nfrom New Jersey"},
                {n:"48 hrs",l:"full due diligence\nturnaround"},
                {n:"10+",l:"verified data sources\nper report"},
              ].map(s=>(
                <div key={s.n}>
                  <p style={{margin:"0 0 2px",fontSize:26,fontWeight:800,color:C.gold,letterSpacing:"-0.02em"}}>{s.n}</p>
                  <p style={{margin:0,fontSize:11,color:C.midGray,whiteSpace:"pre-line",lineHeight:1.4}}>{s.l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — calculator */}
          <div style={{animation:"fadeUp 0.7s 0.1s ease both"}}>
            <Calculator />
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" style={{background:C.lightGray,padding:"96px 24px"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:52}}>
            <p style={{fontSize:12,fontWeight:700,color:C.teal,letterSpacing:"0.1em",
              textTransform:"uppercase",marginBottom:12}}>Simple process</p>
            <h2 style={{fontSize:"clamp(26px,3.5vw,38px)",fontWeight:800,color:C.navy,
              letterSpacing:"-0.02em"}}>
              From address to insight in 48 hours
            </h2>
          </div>
          <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"repeat(3,1fr)",gap:20}}>
            {[
              {step:"01",icon:"📍",
                title:"Submit your property",
                body:"Select your report tier, pay securely via Stripe, then complete a 2-minute intake form. The more you tell us about your situation, the more personalized your report."},
              {step:"02",icon:"🔍",
                title:"We do the research",
                body:"We pull FEMA flood maps, TDEC septic records, USDA soil surveys, county assessor data, GreatSchools, and Walk Score — then synthesize it with 30 years of engineering judgment."},
              {step:"03",icon:"📊",
                title:"Receive your report",
                body:"A professional branded PDF lands in your inbox. Flood risk, septic feasibility, schools, market analysis, true cost of ownership, and your personalized tax savings — all in one place."},
            ].map(s=>(
              <div key={s.step} style={{
                background:C.white,borderRadius:16,padding:"32px 28px",
                boxShadow:"0 2px 16px rgba(13,27,42,0.06)",position:"relative",overflow:"hidden",
              }}>
                <div style={{
                  position:"absolute",top:16,right:20,fontSize:52,fontWeight:800,
                  color:"rgba(13,27,42,0.04)",letterSpacing:"-0.04em",lineHeight:1,
                }}>{s.step}</div>
                <div style={{fontSize:36,marginBottom:18}}>{s.icon}</div>
                <h3 style={{fontSize:18,fontWeight:700,color:C.navy,marginBottom:10}}>{s.title}</h3>
                <p style={{fontSize:14,color:"#4a5568",lineHeight:1.7}}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT'S IN THE REPORT ── */}
      <section id="reports" style={{background:C.white,padding:"96px 24px"}}>
        <div style={{maxWidth:1100,margin:"0 auto",
          display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:64,alignItems:"center"}}>
          <div>
            <p style={{fontSize:12,fontWeight:700,color:C.teal,letterSpacing:"0.1em",
              textTransform:"uppercase",marginBottom:12}}>What you get</p>
            <h2 style={{fontSize:"clamp(26px,3.5vw,38px)",fontWeight:800,color:C.navy,
              letterSpacing:"-0.02em",marginBottom:20,lineHeight:1.15}}>
              Ten sections your agent won't research
            </h2>
            <p style={{fontSize:16,color:"#4a5568",lineHeight:1.75,marginBottom:28}}>
              Every GroundTruth report is written as if a civil engineer and a real estate
              attorney sat down together and answered every question a serious buyer should ask —
              before signing anything.
            </p>
            <button onClick={()=>handleNav("pricing")} style={{
              padding:"13px 28px",borderRadius:9,border:"none",cursor:"pointer",
              background:C.teal,color:C.white,fontWeight:700,fontSize:15,fontFamily:"inherit",
            }}>
              See report options →
            </button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {[
              {icon:"🌊",title:"Flood Zone",body:"FEMA NFHL analysis, flood insurance estimate"},
              {icon:"🌿",title:"Wetlands",body:"USFWS NWI mapping, 2025 TN law update"},
              {icon:"🔧",title:"Septic",body:"TDEC records, perc suitability, county-specific"},
              {icon:"📋",title:"Zoning",body:"Permitted uses, setbacks, overlay districts"},
              {icon:"🏫",title:"Schools",body:"District ratings, proximity, boundary maps"},
              {icon:"🛣️",title:"Commute",body:"Drive times, transit, walkability score"},
              {icon:"🪨",title:"Soils",body:"USDA Web Soil Survey, buildability assessment"},
              {icon:"💰",title:"True Cost",body:"Tax, insurance, HOA, 10-yr projection"},
              {icon:"📈",title:"Market",body:"Comps, price trend, 12-month DOM analysis"},
              {icon:"🏦",title:"Tax Savings",body:"Personalized vs. your current state"},
            ].map(r=>(
              <div key={r.title} style={{
                background:C.lightGray,borderRadius:10,padding:"13px 14px",
                display:"flex",gap:10,alignItems:"flex-start",
              }}>
                <span style={{fontSize:18,flexShrink:0}}>{r.icon}</span>
                <div>
                  <p style={{fontSize:13,fontWeight:700,color:C.navy,marginBottom:2}}>{r.title}</p>
                  <p style={{fontSize:12,color:C.midGray,lineHeight:1.4}}>{r.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" style={{background:C.lightGray,padding:"96px 24px"}}>
        <div style={{maxWidth:920,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:52}}>
            <p style={{fontSize:12,fontWeight:700,color:C.teal,letterSpacing:"0.1em",
              textTransform:"uppercase",marginBottom:12}}>Transparent pricing</p>
            <h2 style={{fontSize:"clamp(26px,3.5vw,38px)",fontWeight:800,color:C.navy,
              letterSpacing:"-0.02em",marginBottom:14}}>Choose your depth</h2>
            <p style={{fontSize:16,color:"#4a5568",maxWidth:460,margin:"0 auto"}}>
              Every tier uses the same verified data sources and engineer review.
              The difference is scope — and how much risk you want to surface before you sign.
            </p>
          </div>

          <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"repeat(3,1fr)",gap:20}}>
            {[
              {
                name:"Quick Scan",price:99,time:"2 hours",
                sections:"Sections 1–3",
                // UPDATED: risk-first descriptions
                desc:"Find out fast if a flood zone or zoning issue should stop you from making an offer.",
                features:["Flood zone analysis","Zoning summary","School district rating","Basic market snapshot"],
                highlight:false,
              },
              {
                name:"Standard",price:299,time:"24 hours",
                sections:"Sections 1–7",
                desc:"Catch the septic issue, the insurance problem, or the HOA trap before you're committed.",
                features:["Everything in Quick Scan","Septic & water analysis","Soil survey","Commute analysis","True cost of ownership","Market comparables"],
                highlight:true,
              },
              {
                name:"Full Due Diligence",price:499,time:"48 hours",
                sections:"All 10 sections",
                desc:"Every risk surfaced. Every dollar accounted for. For high-stakes buys and land purchases.",
                features:["Everything in Standard","Investment ROI analysis","Tax savings vs. your state","10-year financial projection","Engineer narrative summary"],
                highlight:false,
              },
            ].map(p=>(
              <div key={p.name} style={{
                background:p.highlight?C.navy:C.white,
                borderRadius:16,padding:"32px 24px",
                border:`2px solid ${p.highlight?C.gold:"transparent"}`,
                boxShadow:p.highlight?"0 20px 60px rgba(13,27,42,0.25)":"0 2px 16px rgba(13,27,42,0.06)",
                position:"relative",
              }}>
                {p.highlight && (
                  <div style={{
                    position:"absolute",top:-13,left:"50%",transform:"translateX(-50%)",
                    background:C.gold,color:C.navy,padding:"4px 16px",
                    borderRadius:20,fontSize:11,fontWeight:800,letterSpacing:"0.06em",
                    whiteSpace:"nowrap",
                  }}>MOST POPULAR</div>
                )}
                <p style={{fontSize:13,fontWeight:700,
                  color:p.highlight?C.gold:C.teal,marginBottom:8}}>{p.name}</p>
                <div style={{display:"flex",alignItems:"flex-end",gap:4,marginBottom:4}}>
                  <span style={{fontSize:40,fontWeight:800,
                    color:p.highlight?C.white:C.navy,letterSpacing:"-0.03em"}}>${p.price}</span>
                </div>
                <p style={{fontSize:12,color:p.highlight?C.midGray:"#6b7280",marginBottom:10}}>
                  {p.sections} · {p.time}
                </p>
                <p style={{fontSize:13,color:p.highlight?"rgba(255,255,255,0.65)":"#4a5568",
                  lineHeight:1.6,marginBottom:20,minHeight:48}}>{p.desc}</p>
                <div style={{marginBottom:24}}>
                  {p.features.map(f=>(
                    <div key={f} style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:8}}>
                      <span style={{color:C.teal,fontSize:13,flexShrink:0}}>✓</span>
                      <span style={{fontSize:13,
                        color:p.highlight?"rgba(255,255,255,0.75)":"#4a5568",lineHeight:1.4}}>{f}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={()=>window.location.href=`/order?tier=${p.name.toLowerCase().replace(/ /g,"-")}&price=${p.price}`}
                  style={{
                    width:"100%",padding:"13px",borderRadius:9,
                    border:"none",cursor:"pointer",fontFamily:"inherit",
                    fontSize:14,fontWeight:700,transition:"opacity 0.2s",
                    background:p.highlight
                      ?`linear-gradient(135deg,${C.gold},#a88530)`
                      :`linear-gradient(135deg,${C.teal},${C.tealDark})`,
                    color:p.highlight?C.navy:C.white,
                  }}
                  onMouseEnter={e=>e.currentTarget.style.opacity="0.88"}
                  onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
                  Order {p.name} →
                </button>
              </div>
            ))}
          </div>

          {/* Rush add-on */}
          <div style={{
            marginTop:20,background:C.goldLight,
            border:`1.5px solid ${C.gold}`,borderRadius:12,
            padding:"16px 24px",display:"flex",
            alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12,
          }}>
            <div>
              <p style={{fontWeight:700,color:"#8B6914",marginBottom:2}}>
                🚀 Need it today? Rush Delivery adds $150 to any tier.
              </p>
              <p style={{fontSize:13,color:"#a07a20"}}>
                Same-day turnaround. Available at checkout.
              </p>
            </div>
            <button
              onClick={()=>window.location.href="/order?rush=true"}
              style={{
                padding:"10px 20px",borderRadius:8,
                border:`1.5px solid ${C.gold}`,background:"transparent",
                color:"#8B6914",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit",
              }}>
              Add rush at checkout
            </button>
          </div>
        </div>
      </section>

      {/* ── ABOUT / TRUST ── */}
      <section id="about" style={{background:C.navy,padding:"96px 24px"}}>
        <div style={{maxWidth:1100,margin:"0 auto",
          display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:64,alignItems:"center"}}>
          <div>
            <p style={{fontSize:12,fontWeight:700,color:C.gold,letterSpacing:"0.1em",
              textTransform:"uppercase",marginBottom:16}}>Why trust GroundTruth</p>
            <h2 style={{fontSize:"clamp(26px,3.5vw,38px)",fontWeight:800,color:C.white,
              letterSpacing:"-0.02em",marginBottom:20,lineHeight:1.15}}>
              30 years of engineering<br/>
              <span style={{color:C.gold}}>backs every report</span>
            </h2>
            {/* UPDATED: first-person, specific */}
            <p style={{fontSize:16,color:"rgba(255,255,255,0.65)",lineHeight:1.75,marginBottom:20}}>
              I've been reading property risk for 30 years. I know what the data won't tell you — and I know where to look for it.
            </p>
            <p style={{fontSize:16,color:"rgba(255,255,255,0.65)",lineHeight:1.75,marginBottom:20}}>
              I inspected NJDOT infrastructure. I've watched buyers lose money on flood zone mis-classifications that a 10-minute FEMA lookup would have caught. I've seen septic systems fail perc tests after closing on properties that "had no issues."
            </p>
            <p style={{fontSize:16,color:"rgba(255,255,255,0.65)",lineHeight:1.75}}>
              Zillow shows you a Zestimate. I tell you whether the septic can support a 4-bedroom build, whether the flood zone will make your insurance unaffordable, and exactly how much you'll save by leaving New Jersey.
            </p>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            {[
              {icon:"🏗️",title:"ACI Grade 1",sub:"American Concrete Institute certified"},
              {icon:"📐",title:"NICET Level III",sub:"Engineering Technologies certification"},
              {icon:"🦺",title:"OSHA 30",sub:"Construction safety certified"},
              {icon:"🛣️",title:"NJDOT",sub:"30 years NJ infrastructure inspection"},
              {icon:"📋",title:"30+ Years",sub:"Civil engineering & construction"},
              {icon:"🏆",title:"Engineer-Verified",sub:"Every report reviewed before delivery"},
            ].map(c=>(
              <div key={c.title} style={{
                background:"rgba(255,255,255,0.05)",
                border:"1px solid rgba(255,255,255,0.08)",
                borderRadius:12,padding:"18px 16px",
              }}>
                <div style={{fontSize:26,marginBottom:8}}>{c.icon}</div>
                <p style={{fontSize:14,fontWeight:700,color:C.white,marginBottom:3}}>{c.title}</p>
                <p style={{fontSize:12,color:C.midGray,lineHeight:1.5}}>{c.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{background:C.white,padding:"96px 24px"}}>
        <div style={{maxWidth:700,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:48}}>
            <p style={{fontSize:12,fontWeight:700,color:C.teal,letterSpacing:"0.1em",
              textTransform:"uppercase",marginBottom:12}}>Common questions</p>
            <h2 style={{fontSize:"clamp(24px,3vw,34px)",fontWeight:800,color:C.navy,letterSpacing:"-0.02em"}}>
              What buyers ask us most
            </h2>
          </div>
          {[
            {q:"Is this a replacement for a home inspection?",
              a:"No — and we say so clearly in every report. A GroundTruth report is pre-offer intelligence. It tells you whether to make an offer and at what price, flags risks that warrant a specialized inspector, and gives you negotiation leverage before you spend money on a formal inspection."},
            {q:"How is this different from what my realtor provides?",
              a:"Your buyer's agent has a financial incentive to close the deal — not to surface reasons you shouldn't. GroundTruth has no commission at stake. We're paid by you, accountable to you, and our only job is to surface everything relevant about the property."},
            {q:"How accurate is the flood zone data?",
              a:"We use FEMA's official National Flood Hazard Layer API — the same data used to determine flood insurance requirements. Formal flood determinations require a certified survey; our data is authoritative but approximate for parcels near zone boundaries. We disclose this clearly in every report."},
            {q:"What if the property is in a contract county for septic?",
              a:"Tennessee has 9 contract counties (Knox, Williamson, Davidson, etc.) that manage their own septic records. We note this in the report and provide the direct county contact for permit verification. Our septic section uses TDEC soil and terrain data to assess feasibility even without the permit record."},
            {q:"Do you cover properties outside Tennessee?",
              a:"Tennessee is our current market. North Carolina expansion is planned for Month 3. If you're buying in NC, enter your email in the calculator above and we'll notify you the day we launch."},
            {q:"What are your disclaimers?",
              a:"This report is for informational purposes only and does not constitute engineering, legal, or financial advice. GroundTruth Property AI is not a licensed engineering firm. Data is sourced from public records and third-party APIs. Always consult licensed professionals before making real estate decisions."},
          ].map((f,i)=>(
            <FaqItem key={i} q={f.q} a={f.a} />
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{
        background:`linear-gradient(135deg,${C.teal} 0%,${C.tealDark} 100%)`,
        padding:"80px 24px",textAlign:"center",
      }}>
        <div style={{maxWidth:580,margin:"0 auto"}}>
          <h2 style={{fontSize:"clamp(26px,4vw,42px)",fontWeight:800,color:C.white,
            letterSpacing:"-0.02em",marginBottom:14,lineHeight:1.15}}>
            Ready to know everything<br/>before you sign?
          </h2>
          <p style={{fontSize:16,color:"rgba(255,255,255,0.72)",lineHeight:1.7,marginBottom:32}}>
            Join buyers who made their Tennessee purchase with complete information — not a leap of faith.
          </p>
          <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap"}}>
            <button onClick={()=>scrollTo("pricing")} style={{
              padding:"15px 32px",borderRadius:10,border:"none",cursor:"pointer",
              background:`linear-gradient(135deg,${C.gold},#a88530)`,
              color:C.navy,fontWeight:800,fontSize:16,fontFamily:"inherit",
            }}>
              Order your report →
            </button>
            <button onClick={()=>scrollTo("how-it-works")} style={{
              padding:"15px 28px",borderRadius:10,cursor:"pointer",
              background:"rgba(255,255,255,0.12)",
              border:"1.5px solid rgba(255,255,255,0.3)",
              color:C.white,fontWeight:600,fontSize:15,fontFamily:"inherit",
            }}>
              See how it works
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{background:C.navyDeep,padding:"48px 24px"}}>
        <div style={{maxWidth:1100,margin:"0 auto",
          display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr 1fr",gap:32}}>
          <div>
            <span style={{fontWeight:800,fontSize:16,color:C.white}}>GroundTruth</span>
            <span style={{fontWeight:800,fontSize:16,color:C.gold}}> Property AI</span>
            <p style={{fontSize:13,color:C.midGray,marginTop:8,lineHeight:1.6}}>
              Know everything before you sign anything.
            </p>
            <p style={{fontSize:13,color:C.midGray,marginTop:4}}>
              hello@groundtruthpropertyai.com
            </p>
          </div>
          <div>
            <p style={{fontSize:12,fontWeight:700,color:"rgba(255,255,255,0.4)",
              letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:14}}>Navigation</p>
            {NAV_LINKS.map(l=>(
              <button key={l.id} onClick={()=>handleNav(l.id)}
                style={{display:"block",background:"none",border:"none",cursor:"pointer",
                  fontSize:13,color:C.midGray,padding:"4px 0",fontFamily:"inherit",textAlign:"left"}}>
                {l.label}
              </button>
            ))}
          </div>
          <div>
            <p style={{fontSize:12,fontWeight:700,color:"rgba(255,255,255,0.4)",
              letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:14}}>Legal</p>
            {["Privacy Policy","Terms of Service","Disclaimer","Contact"].map(l=>(
              <a key={l} href="#" style={{display:"block",fontSize:13,color:C.midGray,padding:"4px 0"}}>{l}</a>
            ))}
          </div>
        </div>

        {/* Legal disclaimer — readable per consultant audit */}
        <div style={{maxWidth:1100,margin:"28px auto 0",
          paddingTop:24,borderTop:"1px solid rgba(255,255,255,0.07)"}}>
          <p style={{fontSize:12,color:"rgba(255,255,255,0.45)",lineHeight:1.7}}>
            GroundTruth Property AI reports are for informational purposes only and do not constitute
            engineering, legal, or financial advice. GroundTruth Property AI is not a licensed engineering firm.
            Data is sourced from public records and third-party APIs. Always consult licensed professionals
            (engineer, attorney, inspector, CPA) before making real estate decisions. FEMA flood zone
            determinations and wetlands data are approximate — obtain a formal survey for binding
            determinations. GroundTruth Property AI LLC is not liable for decisions made based on report content.
          </p>
        </div>
      </footer>

      {/* ── MOBILE STICKY CTA ── */}
      {isMobile && scrolled && (
        <div style={{
          position:"fixed",bottom:0,left:0,right:0,zIndex:90,
          background:C.navy,borderTop:`2px solid ${C.gold}`,
          padding:"12px 20px",
          display:"flex",gap:10,
          animation:"fadeUp 0.3s ease both",
        }}>
          <button onClick={()=>scrollTo("pricing")} style={{
            flex:1,padding:"13px",borderRadius:8,border:"none",cursor:"pointer",
            background:`linear-gradient(135deg,${C.gold},#a88530)`,
            color:C.navy,fontWeight:800,fontSize:15,fontFamily:"inherit",
          }}>
            Order Report →
          </button>
          <button onClick={()=>scrollTo("hero")} style={{
            padding:"13px 16px",borderRadius:8,cursor:"pointer",
            background:"rgba(255,255,255,0.08)",
            border:"1px solid rgba(255,255,255,0.15)",
            color:C.white,fontWeight:600,fontSize:14,fontFamily:"inherit",
          }}>
            Calculator
          </button>
        </div>
      )}
    </div>
  );
}
