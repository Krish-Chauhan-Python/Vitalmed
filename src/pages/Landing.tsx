import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Brain,
  CloudUpload,
  LineChart,
  Mail,
  Mic,
  ShieldCheck,
  Sparkles,
  Star,
  Stethoscope,
  Upload,
  Waves,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

export default function Landing() {
  const { toast } = useToast();

  const stats = [
    { value: "98.7%", label: "Prediction accuracy" },
    { value: "10,000+", label: "Audio samples analyzed" },
    { value: "< 1s", label: "Response time" },
    { value: "Secure", label: "AI processing" },
  ];

  const annotations = [
    { label: "Noise Reduction", top: "20%", left: "-8%" },
    { label: "Signal Precision", top: "45%", left: "-6%" },
    { label: "Rhythm Mapping", top: "70%", left: "-4%" },
  ];

  const steps = [
    {
      icon: Upload,
      title: "Upload audio",
      description: "Drop a heartbeat or lung recording in seconds.",
    },
    {
      icon: Sparkles,
      title: "AI analyzes signal",
      description: "Neural models isolate anomalies and confidence levels.",
    },
    {
      icon: LineChart,
      title: "Receive insights",
      description: "Instant reports with trend-ready summaries.",
    },
  ];

  const insights = [
    {
      icon: Brain,
      title: "AI-powered analysis",
      description: "Deep models tuned to respiratory and cardiac acoustic patterns.",
    },
    {
      icon: Waves,
      title: "Precision waveform tracking",
      description: "High-resolution signal visualization for every upload.",
    },
    {
      icon: ShieldCheck,
      title: "Secure by design",
      description: "Encrypted uploads with private, compliant processing.",
    },
  ];

  const testimonials = [
    {
      quote:
        "The clarity of the waveform insights lets me triage faster with real confidence.",
      name: "Dr. Lina Park",
      role: "Pulmonologist",
    },
    {
      quote:
        "Elegant, minimal, and precise. Patients love how simple the upload flow is.",
      name: "Jason Menon",
      role: "Care Coordinator",
    },
    {
      quote:
        "The response time is lightning fast. We integrate it into every consult.",
      name: "Marta Solis",
      role: "Clinic Operations",
    },
  ];

  const handlePredictDemo = async () => {
    try {
      await fetch("http://127.0.0.1:8000/predict", { method: "POST" });
      toast({
        title: "Demo request sent",
        description: "Connect the backend to return a prediction payload.",
      });
    } catch (error) {
      toast({
        title: "Predict endpoint unavailable",
        description: "Start the API server to enable the demo request.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="text-[#0D2A45]">
      <section id="top" className="cinematic-hero anchor-offset">
        <div className="ambient-dots" />
        <div className="hero-orb hero-orb--right" />
        <div className="hero-orb hero-orb--left" />
        <div className="container relative z-10 py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glow-pill text-sm font-semibold mb-6">
              <Activity className="h-4 w-4 text-primary" />
              Precision. Insight. Wellness.
            </div>
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-[#0D2A45]">
              Your heartbeat and breath,
              <span className="block text-gradient">decoded by AI.</span>
            </h1>
            <p className="text-base md:text-lg text-[#4B6375] mt-6">
              VitaSense analyzes heartbeat and lung sounds to predict potential health issues
              with calm, clinical precision.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="glow-button rounded-full" onClick={handlePredictDemo}>
                Upload Audio
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="rounded-full" asChild>
                <Link to="/upload">Explore Demo</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-primary">Data Defines Care.</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-[#0D2A45] mt-3">
              Numbers that reflect precision
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <Card className="stat-card rounded-2xl">
                  <CardContent className="p-6 text-center">
                    <p className="text-2xl font-semibold text-[#0D2A45]">{stat.value}</p>
                    <p className="text-sm text-[#6B7C8C] mt-2">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="technology" className="py-16 md:py-24 section-muted anchor-offset">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="glass-panel shadow-soft rounded-3xl p-8 annotated-panel min-h-[360px]">
              {annotations.map((annotation) => (
                <div
                  key={annotation.label}
                  className="absolute text-xs font-semibold text-[#0D2A45]"
                  style={{ top: annotation.top, left: annotation.left }}
                >
                  <span className="bg-white/90 px-3 py-1 rounded-full shadow-soft">
                    {annotation.label}
                  </span>
                  <span
                    className="annotation-line"
                    style={{ width: "120px", top: "50%", left: "100%" }}
                  />
                </div>
              ))}
              <div className="absolute bottom-6 right-6 flex items-center gap-2 text-xs text-[#4B6375]">
                <Stethoscope className="h-4 w-4 text-primary" />
                Certified AI Quality
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-primary mb-3">Certified AI Quality</p>
              <h2 className="text-3xl md:text-4xl font-semibold text-[#0D2A45]">
                Precision-driven signal intelligence
              </h2>
              <p className="text-[#4B6375] mt-4">
                Every heartbeat and lung sound is cleaned, normalized, and analyzed through
                a multi-stage AI pipeline. VitaSense delivers reliable confidence metrics and
                clear guidance for modern clinical teams.
              </p>
              <div className="mt-6 flex items-center gap-4 text-sm text-[#4B6375]">
                <ShieldCheck className="h-5 w-5 text-primary" />
                Secure AI processing and validated model performance.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-primary">How it works</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-[#0D2A45] mt-3">
              From upload to insight
            </h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <Card className="neumo-card rounded-2xl h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <step.icon className="h-6 w-6 text-primary" />
                      </div>
                      <span className="text-xs font-semibold text-[#9AA8B4]">
                        0{index + 1}
                      </span>
                    </div>
                    <h3 className="font-semibold text-[#0D2A45] mb-2">{step.title}</h3>
                    <p className="text-sm text-[#6B7C8C]">{step.description}</p>
                  </CardContent>
                </Card>
                {index < steps.length - 1 && (
                  <motion.div
                    className="hidden lg:flex absolute -right-6 top-1/2 -translate-y-1/2 text-primary"
                    animate={{ x: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 section-muted">
        <div className="container">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold text-primary">Upload demo</p>
              <h2 className="text-3xl md:text-4xl font-semibold text-[#0D2A45] mt-3">
                Experience the core workflow
              </h2>
              <p className="text-[#4B6375] mt-4">
                Upload an audio sample and watch the waveform and confidence meter respond in real time.
                Integrate your own prediction model whenever you are ready.
              </p>
              <div className="mt-6 flex items-center gap-3 text-sm text-[#4B6375]">
                <Mic className="h-5 w-5 text-primary" />
                Supports WAV and MP3 files with fast preprocessing.
              </div>
            </div>
            <div className="glass-panel shadow-soft rounded-3xl p-6">
              <div className="border border-dashed border-[#C7D3DD] rounded-2xl p-6 text-center bg-white/70">
                <CloudUpload className="h-8 w-8 text-primary mx-auto mb-3" />
                <p className="text-sm font-semibold text-[#0D2A45]">Drop your file here</p>
                <p className="text-xs text-[#6B7C8C]">WAV or MP3 up to 10MB</p>
                <Button size="sm" className="mt-4 glow-button rounded-full" onClick={handlePredictDemo}>
                  Upload Audio
                </Button>
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between text-xs text-[#6B7C8C] mb-2">
                  <span>Processing</span>
                  <span>72%</span>
                </div>
                <Progress value={72} className="h-2" />
              </div>

              <div className="mt-6 rounded-2xl bg-white/80 border border-[#C7D3DD] p-5">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-semibold text-[#0D2A45]">Waveform preview</p>
                  <span className="text-xs text-[#6B7C8C]">00:22</span>
                </div>
                <div className="wave-bars">
                  {Array.from({ length: 12 }).map((_, index) => (
                    <span
                      key={index}
                      style={{ height: `${30 + (index % 5) * 14}px`, animationDelay: `${index * 0.1}s` }}
                    />
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-[#6B7C8C]">Confidence</span>
                  <span className="font-semibold text-[#0D2A45]">92.6%</span>
                </div>
                <Progress value={92.6} className="h-2 mt-2" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="insights" className="py-16 md:py-24 anchor-offset">
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-primary">Health insights</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-[#0D2A45] mt-3">
              Calm, intelligent, and clinically precise
            </h2>
            <p className="text-[#4B6375] mt-4 max-w-2xl mx-auto">
              Minimalist design meets rigorous signal analysis. VitaSense keeps the focus on what matters.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {insights.map((insight, index) => (
              <motion.div
                key={insight.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass-panel shadow-soft rounded-2xl h-full">
                  <CardContent className="p-6">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <insight.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-[#0D2A45] mb-2">{insight.title}</h3>
                    <p className="text-sm text-[#6B7C8C]">{insight.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 section-muted">
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-primary">Testimonials</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-[#0D2A45] mt-3">
              Results that earn trust
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="neumo-card rounded-2xl h-full">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex items-center gap-1 text-primary mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-4 w-4" />
                      ))}
                    </div>
                    <p className="text-sm text-[#6B7C8C] leading-relaxed flex-1">
                      "{item.quote}"
                    </p>
                    <div className="mt-6">
                      <p className="font-semibold text-[#0D2A45]">{item.name}</p>
                      <p className="text-xs text-[#6B7C8C]">{item.role}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-16 md:py-24 anchor-offset">
        <div className="container">
          <Card className="health-gradient text-primary-foreground overflow-hidden shadow-soft">
            <CardContent className="p-8 md:p-12 text-center">
              <h2 className="text-2xl md:text-4xl font-semibold mb-4">
                Start Listening to Your Health Today.
              </h2>
              <p className="text-primary-foreground/80 mb-6 max-w-xl mx-auto">
                Experience cinematic clarity in heart and lung diagnostics. Plug in your AI engine
                whenever you are ready to move from demo to deployment.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" variant="secondary" className="glow-button rounded-full" onClick={handlePredictDemo}>
                  Try the Demo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <div className="flex w-full max-w-sm items-center gap-2 bg-white/90 rounded-full px-3 py-2">
                  <Mail className="h-4 w-4 text-[#9AA8B4]" />
                  <Input
                    placeholder="Enter email for updates"
                    className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  <Button size="sm" className="rounded-full">Notify</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
