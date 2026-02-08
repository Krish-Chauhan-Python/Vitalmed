import { motion } from "framer-motion";
import { Activity, Shield, AlertTriangle, FileAudio, Lock, HelpCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function About() {
  const sections = [
    {
      icon: Activity,
      title: "How It Works",
      content: `VitalMed uses advanced audio analysis algorithms to examine health-related sound patterns in your recordings. Simply upload a .wav file of your breathing, bowel movement or heartbeat, select the analysis type, and receive instant insights.

Our system analyzes frequency patterns, rhythm regularity, and acoustic characteristics to identify potential indicators that may warrant further attention.`,
    },
    {
      icon: FileAudio,
      title: "Supported Audio Types",
      content: `.wav audio files up to 10MB in size. We currently support three main analysis types:  

      • Respiratory Analysis: Examines breathing patterns for irregularities, wheezing, or congestion indicators.
      
• Bowel Analysis: Evaluates bowel sounds for irregularities, frequency, and potential digestive issues.

• Heartbeat Analysis: Monitors heart rhythm for regularity, rate variations, and potential anomalies.

For best results, record in a quiet environment with minimal background noise.`,
    },
    {
      icon: Lock,
      title: "Privacy & Security",
      content: `• All audio files are encrypted during upload and storage
• Files are stored securely and only accessible to you
• We never share your data with third parties
• You can delete your recordings and analysis history at any time

`,
    },
  ];

  const faqs = [
    {
      question: "Is this a medical diagnostic tool?",
      answer: "No. VitalMed is designed for informational and tracking purposes only. It should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider for medical concerns.",
    },
    {
      question: "What audio formats are supported?",
      answer: "We currently support .wav  audio files up to 10MB in size. For best results, use clear recordings with minimal background noise.",
    },
    {
      question: "How accurate is the analysis?",
      answer: "The confidence scores provided represent the model's certainty in its predictions. However, this is a demonstration system and results should be interpreted with caution. Professional medical evaluation is always recommended.",
    }
  ];

  return (
    <div className="page-layout">
      <div className="page-content text-foreground">
        <div className="container py-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
        {/* Header */}
        <section id="overview" className="text-center">
          <h1 className="text-3xl font-bold mb-2 text-foreground">About VitalMed</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Learn how our health audio analysis platform works and how we protect your privacy.
          </p>
        </section>

        {/* Demo Mode Warning */}
        

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
              <Card className="bg-card/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-foreground">
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
        <Card id="faqs" className="bg-card/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-foreground">
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
        <div className="text-center text-sm text-muted-foreground bg-card/70 backdrop-blur-sm" id="privacy-note">
          <Shield className="h-5 w-5 inline-block mr-2 mb-1" />
          VitaSense is committed to protecting your health data privacy.
        </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
