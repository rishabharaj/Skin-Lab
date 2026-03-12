
-- Create storage bucket for phone mask templates
INSERT INTO storage.buckets (id, name, public)
VALUES ('phone-masks', 'phone-masks', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to phone masks
CREATE POLICY "Public read access for phone masks"
ON storage.objects FOR SELECT
USING (bucket_id = 'phone-masks');

-- Allow authenticated users (admins) to upload masks
CREATE POLICY "Authenticated upload for phone masks"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'phone-masks');

-- Create storage bucket for skin images
INSERT INTO storage.buckets (id, name, public)
VALUES ('skin-images', 'skin-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to skin images
CREATE POLICY "Public read access for skin images"
ON storage.objects FOR SELECT
USING (bucket_id = 'skin-images');

-- Allow authenticated upload for skins
CREATE POLICY "Authenticated upload for skin images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'skin-images');
