import { motion } from "framer-motion";
import { Activity, Shield, AlertTriangle, FileAudio, Lock, HelpCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PageNav } from "@/components/layout/PageNav";

export default function About() {
  const sections = [
    {
      icon: Activity,
      title: "How It Works",
      content: `VitaSense uses advanced audio analysis algorithms to examine health-related sound patterns in your recordings. Simply upload a .wav or .mp3 file of your breathing, cough, or heartbeat, select the analysis type, and receive instant insights.

Our system analyzes frequency patterns, rhythm regularity, and acoustic characteristics to identify potential indicators that may warrant further attention.`,
    },
    {
      icon: FileAudio,
      title: "Supported Audio Types",
      content: `• **Respiratory Analysis**: Examines breathing patterns for irregularities, wheezing, or congestion indicators.
      
• **Cough Analysis**: Evaluates cough characteristics including dryness, congestion, and persistence patterns.

• **Heartbeat Analysis**: Monitors heart rhythm for regularity, rate variations, and potential anomalies.

For best results, record in a quiet environment with minimal background noise.`,
    },
    {
      icon: Lock,
      title: "Privacy & Security",
      content: `Your health data is treated with the utmost care:

• All audio files are encrypted during upload and storage
• Files are stored securely and only accessible to you
• We never share your data with third parties
• You can delete your recordings and analysis history at any time

We comply with industry-standard security practices to protect your sensitive health information.`,
    },
  ];

  const faqs = [
    {
      question: "Is this a medical diagnostic tool?",
      answer: "No. VitaSense is designed for informational and tracking purposes only. It should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider for medical concerns.",
    },
    {
      question: "What audio formats are supported?",
      answer: "We currently support .wav and .mp3 audio files up to 10MB in size. For best results, use clear recordings with minimal background noise.",
    },
    {
      question: "How accurate is the analysis?",
      answer: "The confidence scores provided represent the model's certainty in its predictions. However, this is a demonstration system and results should be interpreted with caution. Professional medical evaluation is always recommended.",
    },
    {
      question: "Can I delete my data?",
      answer: "Yes! You have full control over your data. You can delete individual analyses from your history page, and all associated audio files will be removed from our storage.",
    },
    {
      question: "Is my data used to train AI models?",
      answer: "No. Your personal health recordings are never used for training purposes. Your data remains private and is only used to provide you with analysis results.",
    },
  ];

  return (
    <div className="page-layout">
      <PageNav
        title="About"
        items={[
          { href: "/about#overview", label: "Overview" },
          { href: "/about#how-it-works", label: "How It Works" },
          { href: "/about#supported-audio", label: "Supported Audio" },
          { href: "/about#privacy", label: "Privacy & Security" },
          { href: "/about#faqs", label: "FAQs" },
        ]}
      />
      <div className="page-content">
        <div className="container py-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
        {/* Header */}
        <section id="overview" className="text-center">
          <h1 className="text-3xl font-bold mb-2">About VitaSense</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Learn how our health audio analysis platform works and how we protect your privacy.
          </p>
        </section>

        {/* Demo Mode Warning */}
        <Card className="border-yellow-500/50 bg-yellow-500/10">
          <CardContent className="flex items-start gap-4 p-6">
            <AlertTriangle className="h-6 w-6 text-yellow-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-700 dark:text-yellow-400">
                Demo Mode Active
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                This application is currently running in demonstration mode. All analysis 
                results are simulated and should not be used for actual health decisions. 
                This platform is intended to showcase the potential of AI-powered health 
                audio analysis technology.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Main Sections */}
        <div className="grid gap-6">
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              id={section.title === "How It Works" ? "how-it-works" : section.title === "Supported Audio Types" ? "supported-audio" : "privacy"}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <section.icon className="h-5 w-5 text-primary" />
                    </div>
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {section.content}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* FAQs */}
        <Card id="faqs">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <HelpCircle className="h-5 w-5 text-primary" />
              </div>
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Footer Note */}
        <div className="text-center text-sm text-muted-foreground" id="privacy-note">
          <Shield className="h-5 w-5 inline-block mr-2 mb-1" />
          VitaSense is committed to protecting your health data privacy.
        </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
