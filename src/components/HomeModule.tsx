import { motion } from "motion/react";
import { BookOpen, Award, Sparkles, ChefHat, LayoutTemplate, Star, Heart } from "lucide-react";

interface HomeModuleProps {
  onNavigate: (module: number) => void;
  authorName: string;
  title: string;
}

export default function HomeModule({ onNavigate, authorName, title }: HomeModuleProps) {
  const modules = [
    {
      num: 1,
      title: "Cookbook Concept Planner",
      desc: "Connect your passion to a target audience. Find your unique angle, design your working title, and perform AI niche checking.",
      icon: "🌱",
      features: ["Theme Finder", "Audience Profiler", "✨ AI Title Generator", "✨ Niche Analysis"],
    },
    {
      num: 2,
      title: "Dietary Profile Builder",
      desc: "Customize unified dietary badges (including Alpha-Gal Safe, anti-inflammatory, and custom tags) that automatically pre-fill your recipe designs.",
      icon: "🏷️",
      features: ["30+ Diet Badges", "Allergy Priority Control", "Live Sample Card Preview", "Cross-Module State Sync"],
    },
    {
      id: "gold",
      num: 3,
      title: "Visual Design Ideas",
      desc: "Explore 12 detailed design directions, palettes, and font pairings. Get specific AI-powered Canva design recommenders.",
      icon: "🎨",
      features: ["12 Brand Templates", "10 Cover Blueprints", "Canva Free Account Tips", "✨ AI Mood Board Recs"],
    },
    {
      num: 4,
      title: "Canva Template Guide",
      desc: "Step-by-step masterclass on starting, importing, and spacing your cookbook inside free Canva workspaces safely without watermarks.",
      icon: "✏️",
      features: ["Document Sizing Specs", "KDP Alignment Guides", "Etsy PDF Optimization", "Interactive Checklist"],
    },
    {
      id: "featured",
      num: 5,
      title: "Recipe Card Builder",
      desc: "The heart of your toolkit. Choose 3 styling levels. Build recipe interior cards with live responsive viewports and print-to-PDF layout options.",
      icon: "📋",
      features: ["Basic / Detailed Options", "⚠️ Alpha-Gal Safe Mode", "Allergies Red-Flags", "Beautiful Print-to-PDF"],
    },
    {
      num: 6,
      title: "Publishing Economics",
      desc: "Review pricing tactics, Bowker ISBN rules, Amazon indexing pathways, and compare live print royalties using our interactive charts.",
      icon: "📚",
      features: ["KDP vs Ingram vs Etsy", "Bowker ISBN Tree", "✨ Auto Keyword Builder", "📊 Royalty Visualizer"],
    },
    {
      num: 7,
      title: "Marketing & Launch Kit",
      desc: "Prepare social copy platforms, Pinterest board strategies, TikTok/Reel storyboard formulas, and review your 8-week launch planner.",
      icon: "📣",
      features: ["✨ AI Caption Maker", "90+ Hashtags Selected", "Film Shot-Lists", "8-Week Launch Tracker"],
    },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-sagedark via-[#2C4A2E] to-[#1A3A1E] px-8 py-16 text-center text-white shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(184,212,187,0.15),transparent)]"></div>
        
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 mx-auto max-w-3xl"
        >
          <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-sagelight/15 px-3 py-1 text-xs font-bold tracking-widest text-[#B8D4BB] uppercase">
            <Sparkles className="h-3.5 w-3.5" /> Complete Self-Publishing Roadmap
          </span>

          <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-cream leading-tight">
            From idea to <i>published cookbook</i>—every step in one place
          </h1>

          <p className="mt-4 text-sm md:text-base leading-relaxed text-[#FAF7F2]/80">
            A secure, modern workspace built specifically for independent authors. Designed with 
            special care for traditional farm foods, Alpha-Gal Safe criteria, cancer recovery nutrition, and 
            fully customized Canva layouts. No payment required, no account setup.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <span className="rounded-full bg-terracottadark/40 border border-terracotta/30 px-3.5 py-1 text-xs font-bold text-terracottalight">
              ⚠️ Alpha-Gal Safe Focus
            </span>
            <span className="rounded-full bg-sagedark/60 border border-sagelight/30 px-3.5 py-1 text-xs font-bold text-sagelight">
              💚 Cancer Recovery Nutrition
            </span>
            <span className="rounded-full bg-white/10 px-3.5 py-1 text-xs font-medium text-cream">
              🪴 Homestead & Garden
            </span>
            <span className="rounded-full bg-white/10 px-3.5 py-1 text-xs font-medium text-cream">
              🌾 Wholesome Comfort
            </span>
          </div>

          {/* Quick stats / Progress summary */}
          <div className="mt-10 grid grid-cols-2 gap-4 border-t border-cream/15 pt-8 md:grid-cols-4">
            <div className="text-center">
              <p className="font-serif text-2xl font-bold text-sagelight md:text-3xl">7</p>
              <p className="text-[10px] tracking-wider text-cream/50 uppercase">Modules Included</p>
            </div>
            <div className="text-center">
              <p className="font-serif text-2xl font-bold text-sagelight md:text-3xl">30+</p>
              <p className="text-[10px] tracking-wider text-cream/50 uppercase">Badge Varieties</p>
            </div>
            <div className="text-center">
              <p className="font-serif text-2xl font-bold text-sagelight md:text-3xl">12</p>
              <p className="text-[10px] tracking-wider text-cream/50 uppercase">Curated Styles</p>
            </div>
            <div className="text-center">
              <p className="font-serif text-2xl font-bold text-sagelight md:text-3xl">AI</p>
              <p className="text-[10px] tracking-wider text-cream/50 uppercase">Editor Agent</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Modules Loop */}
      <section className="space-y-6">
        <div className="text-center">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-charcoal">
            Your Creative Roadmap
          </h2>
          <p className="text-xs md:text-sm text-midgray mt-1">
            Work in sequence or jump directly to the stage you need. Progressive state sync preserves your workspace local database.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((m, idx) => {
            const isFeatured = m.id === "featured";
            const isGold = m.id === "gold";

            return (
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                key={m.num}
                onClick={() => onNavigate(m.num)}
                className={`group cursor-pointer relative overflow-hidden rounded-2xl border-2 bg-warmwhite p-6 shadow-sm transition-all duration-300 hover:shadow-md flex flex-col justify-between ${
                  isFeatured
                    ? "border-terracotta hover:border-terracottadark"
                    : isGold
                    ? "border-gold hover:border-[#a8872e]"
                    : "border-lightgray hover:border-sage"
                }`}
              >
                {/* Border Accent Indicator */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1.5 ${
                    isFeatured
                      ? "bg-terracotta"
                      : isGold
                      ? "bg-gold"
                      : "bg-sagedark"
                  }`}
                />

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3.5xl select-none">{m.icon}</span>
                    <div>
                      <span className="text-[10px] font-bold tracking-widest text-[#6B6B6B] uppercase">
                        Module {m.num}
                      </span>
                      <h3 className="font-serif font-bold text-lg text-charcoal group-hover:text-sagedark transition-colors">
                        {m.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-xs text-midgray leading-relaxed">
                    {m.desc}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {m.features.map((f) => (
                      <span
                        key={f}
                        className={`inline-block rounded-md px-2 py-0.5 text-[9px] font-bold border ${
                          f.startsWith("✨") || f.startsWith("📊")
                            ? "bg-goldlight/40 border-gold/45 text-terracottadark"
                            : "bg-cream border-lightgray text-midgray"
                        }`}
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-lightgray/40">
                  <button
                    className={`flex w-full items-center justify-between rounded-lg px-4 py-2.5 text-xs font-bold text-white transition-all ${
                      isFeatured
                        ? "bg-terracotta group-hover:bg-terracottadark"
                        : isGold
                        ? "bg-gold group-hover:bg-[#a8872e]"
                        : "bg-sagedark group-hover:bg-sage"
                    }`}
                  >
                    <span>Launch Stage →</span>
                    <span>{m.icon}</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* About / Dedication Section */}
      <section className="rounded-2xl border border-lightgray bg-[#FAF7F2] p-8 text-center sm:p-12">
        <Heart className="mx-auto h-7 w-7 text-terracotta animate-pulse" />
        <h3 className="mt-4 font-serif text-xl md:text-2xl font-bold text-charcoal">
          Dedicated to the Creative Spirit
        </h3>
        <p className="mx-auto mt-3 max-w-2xl text-xs md:text-sm leading-relaxed text-midgray">
          This handbook toolkit is custom-tailored for independent publishers—inspired by 30-year veteran graphic designer, cancer survivor, 
          and AGS author <strong>Robin L. Bates</strong>. We hope these technical blueprints bypass the stress of publishing and allow you to 
          gift your recipes to families worldwide.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-1.5">
          <span className="rounded-full bg-sagelight/20 px-3 py-1 text-[11px] font-semibold text-sagedark">
            🪴 Healthy Garden-to-Table
          </span>
          <span className="rounded-full bg-terracottalight/30 px-3 py-1 text-[11px] font-semibold text-[#8B4A2E]">
            🌿 Certified Alpha-Gal Safe
          </span>
          <span className="rounded-full bg-goldlight px-3 py-1 text-[11px] font-semibold text-terracottadark">
            💚 Oncology & Caregiver Support
          </span>
        </div>
      </section>
    </div>
  );
}
