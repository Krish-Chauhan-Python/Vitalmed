-- Create profiles table (basic - just user_id and timestamps)
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

-- Create analysis_history table
CREATE TABLE public.analysis_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  audio_type TEXT NOT NULL CHECK (audio_type IN ('respiratory', 'cough', 'heartbeat')),
  prediction TEXT NOT NULL,
  confidence DECIMAL(5,2) NOT NULL CHECK (confidence >= 0 AND confidence <= 100),
  file_path TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on analysis_history
ALTER TABLE public.analysis_history ENABLE ROW LEVEL SECURITY;

-- Analysis history policies
CREATE POLICY "Users can view their own analyses"
ON public.analysis_history FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analyses"
ON public.analysis_history FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own analyses"
ON public.analysis_history FOR DELETE
USING (auth.uid() = user_id);

-- Create function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for audio files
INSERT INTO storage.buckets (id, name, public)
VALUES ('audio-uploads', 'audio-uploads', false);

-- Storage policies for audio uploads
CREATE POLICY "Users can upload their own audio files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'audio-uploads' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own audio files"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'audio-uploads' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own audio files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'audio-uploads' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);