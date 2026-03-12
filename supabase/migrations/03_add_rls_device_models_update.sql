
-- Allow authenticated users to update device_models (for mask uploads)
CREATE POLICY "Authenticated users can update models"
ON public.device_models FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);
