import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { History as HistoryIcon, Filter, Trash2, FileAudio, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { PageNav } from "@/components/layout/PageNav";
import { supabase } from "@/integrations/supabase/client";
import {
  getAudioTypeLabel,
  getAudioTypeIcon,
  type AudioType,
} from "@/lib/mockAnalysis";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";

type FilterType = "all" | AudioType;

interface AnalysisRecord {
  id: string;
  created_at: string;
  filename: string;
  prediction: string;
  confidence: number | string;
  audio_type: AudioType;
  file_path: string | null;
}

export default function History() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [filter, setFilter] = useState<FilterType>("all");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const chartConfig = {
    confidence: {
      label: "Confidence",
      color: "hsl(var(--primary))",
    },
  } as const;

  // Fetch analysis history
  const { data: analyses, isLoading, refetch } = useQuery({
    queryKey: ["analysis-history", user?.id, filter],
    queryFn: async (): Promise<AnalysisRecord[]> => {
      let query = supabase
        .from("analysis_history")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (filter !== "all") query = query.eq("audio_type", filter);

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  // Delete record and file
  const handleDelete = async (id: string, filePath: string | null) => {
    try {
      if (filePath) {
        await supabase.storage.from("audio-uploads").remove([filePath]);
      }

      const { error } = await supabase.from("analysis_history").delete().eq("id", id);
      if (error) throw error;

      toast({
        title: "Deleted",
        description: "Analysis record has been removed.",
      });

      refetch();
    } catch (error: any) {
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete record.",
        variant: "destructive",
      });
    }
  };

  // Play audio from Supabase storage
  const handlePlayAudio = async (filePath: string | null) => {
    if (!filePath) {
      toast({
        title: "Audio not available",
        description: "This record has no audio file attached.",
        variant: "destructive",
      });
      return;
    }

    const { data, error } = await supabase.storage
      .from("audio-uploads")
      .createSignedUrl(filePath, 60); // 1-minute signed URL

    if (error || !data?.signedUrl) {
      toast({
        title: "Failed to fetch audio",
        description: "Could not load the audio file.",
        variant: "destructive",
      });
      return;
    }

    const audio = new Audio(data.signedUrl);
    audio.play().catch(() =>
      toast({
        title: "Playback failed",
        description: "Your browser blocked playback or file not playable.",
        variant: "destructive",
      })
    );
  };

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 90) return <Badge className="bg-green-500">High</Badge>;
    if (confidence >= 80) return <Badge className="bg-blue-500">Good</Badge>;
    if (confidence >= 70) return <Badge className="bg-yellow-500">Fair</Badge>;
    return <Badge className="bg-orange-500">Low</Badge>;
  };

  const chartData = (analyses ?? [])
    .map((analysis) => {
      const confidenceValue = Number(analysis.confidence);
      if (!Number.isFinite(confidenceValue)) return null;

      return {
        id: analysis.id,
        label: format(new Date(analysis.created_at), "MMM d"),
        timestamp: analysis.created_at,
        confidence: Number(analysis.confidence),
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    );

  const totalRecords = analyses?.length ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pagedAnalyses = (analyses ?? []).slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <div className="page-layout">
      <PageNav
        title="History"
        items={[
          { href: "/history#overview", label: "Overview" },
          { href: "/history#trend", label: "Trend" },
          { href: "/history#records", label: "Records" },
        ]}
      />
      <div className="page-content">
        <div className="container py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
        {/* Header */}
        <section id="overview" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <HistoryIcon className="h-8 w-8 text-primary" />
              Analysis History
            </h1>
            <p className="text-muted-foreground mt-1">
              View and manage your past audio analyses
            </p>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select
              value={filter}
              onValueChange={(v) => {
                setFilter(v as FilterType);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="respiratory">Respiratory</SelectItem>
                <SelectItem value="cough">Cough</SelectItem>
                <SelectItem value="heartbeat">Heartbeat</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </section>

        {/* Confidence Trend */}
        <Card id="trend">
          <CardHeader>
            <CardTitle className="text-lg">Confidence Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : chartData.length > 0 ? (
              <ChartContainer className="h-64 w-full" config={chartConfig}>
                <LineChart data={chartData} margin={{ left: 8, right: 8 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="label"
                    tickMargin={8}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tickMargin={8}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        formatter={(value) => [
                          `${Number(value).toFixed(1)}%`,
                          "Confidence",
                        ]}
                      />
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="confidence"
                    stroke="var(--color-confidence)"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ChartContainer>
            ) : (
              <div className="text-sm text-muted-foreground">No data to chart yet.</div>
            )}
          </CardContent>
        </Card>

        {/* Table */}
        <Card id="records">
          <CardHeader>
            <CardTitle className="text-lg">
              {analyses?.length ?? 0} Analysis Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
              ) : analyses && analyses.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="hidden sm:table-cell">File</TableHead>
                      <TableHead>Prediction</TableHead>
                      <TableHead>Confidence</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pagedAnalyses.map((analysis) => {
                      const confidenceValue = Number(analysis.confidence);
                      return (
                        <TableRow key={analysis.id}>
                          <TableCell className="whitespace-nowrap">
                            {format(new Date(analysis.created_at), "MMM d, yyyy")}
                            <span className="block text-xs text-muted-foreground">
                              {format(new Date(analysis.created_at), "h:mm a")}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getAudioTypeIcon(analysis.audio_type)}
                              <span className="hidden md:inline text-sm">
                                {getAudioTypeLabel(analysis.audio_type)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <div className="flex items-center gap-2 max-w-[150px]">
                              <FileAudio className="h-4 w-4 text-muted-foreground shrink-0" />
                              <span className="truncate text-sm">{analysis.filename}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm line-clamp-2">{analysis.prediction}</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getConfidenceBadge(confidenceValue)}
                              <span className="text-xs text-muted-foreground">
                                {confidenceValue.toFixed(1)}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handlePlayAudio(analysis.file_path)}
                              title="Play Audio"
                            >
                              <Play className="h-4 w-4 text-primary" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                handleDelete(analysis.id, analysis.file_path)
                              }
                              title="Delete Record"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                  <HistoryIcon className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-1">No analyses yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload an audio file to get started with your first analysis
                </p>
                <Button asChild>
                  <a href="/upload">Start Analysis</a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {totalRecords > pageSize && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(event) => {
                    event.preventDefault();
                    setPage((prev) => Math.max(1, prev - 1));
                  }}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }).map((_, index) => {
                const pageNumber = index + 1;
                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      href="#"
                      isActive={pageNumber === currentPage}
                      onClick={(event) => {
                        event.preventDefault();
                        setPage(pageNumber);
                      }}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(event) => {
                    event.preventDefault();
                    setPage((prev) => Math.min(totalPages, prev + 1));
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
