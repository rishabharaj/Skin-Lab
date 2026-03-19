-- Seed mask templates and map all device models to their closest template
-- Templates define parametric phone back-panel shapes as JSON configs
BEGIN;

-- ─── INSERT TEMPLATES ────────────────────────────────

INSERT INTO public.mask_templates (id, name, description, brand_hint, config) VALUES
('a0000001-0000-0000-0000-000000000001', 'iPhone 16 Pro Style', 'Large square island, 3 lenses + flash', 'apple',
 '{"version":1,"canvasWidth":400,"canvasHeight":820,"body":{"insetX":10,"insetY":10,"cornerRadii":[42,42,42,42]},"cutouts":[{"id":"cam-island","label":"Camera Island","shape":"roundedRect","x":3,"y":2,"width":28,"height":16,"cornerRadius":30},{"id":"main","label":"Main Camera","shape":"circle","x":5,"y":3.5,"width":9,"height":5},{"id":"ultrawide","label":"Ultra Wide","shape":"circle","x":19,"y":3.5,"width":9,"height":5},{"id":"tele","label":"Telephoto","shape":"circle","x":12,"y":10.5,"width":9,"height":5},{"id":"flash","label":"Flash","shape":"circle","x":23,"y":11,"width":4,"height":2.2}]}'),

('a0000001-0000-0000-0000-000000000002', 'iPhone 16 Standard', 'Vertical dual camera, compact island', 'apple',
 '{"version":1,"canvasWidth":400,"canvasHeight":820,"body":{"insetX":10,"insetY":10,"cornerRadii":[42,42,42,42]},"cutouts":[{"id":"cam-island","label":"Camera Island","shape":"roundedRect","x":5,"y":2,"width":18,"height":16,"cornerRadius":40},{"id":"main","label":"Main Camera","shape":"circle","x":8,"y":3,"width":10,"height":5.5},{"id":"ultrawide","label":"Ultra Wide","shape":"circle","x":8,"y":10,"width":10,"height":5.5},{"id":"flash","label":"Flash","shape":"circle","x":17,"y":7,"width":3.5,"height":2}]}'),

('a0000001-0000-0000-0000-000000000003', 'iPhone 15 Pro Style', 'Triple camera square island', 'apple',
 '{"version":1,"canvasWidth":400,"canvasHeight":820,"body":{"insetX":10,"insetY":10,"cornerRadii":[40,40,40,40]},"cutouts":[{"id":"cam-island","label":"Camera Island","shape":"roundedRect","x":3,"y":2,"width":27,"height":15.5,"cornerRadius":30},{"id":"main","label":"Main Camera","shape":"circle","x":5,"y":3.5,"width":9,"height":5},{"id":"ultrawide","label":"Ultra Wide","shape":"circle","x":18,"y":3.5,"width":9,"height":5},{"id":"tele","label":"Telephoto","shape":"circle","x":11,"y":10,"width":9,"height":5},{"id":"flash","label":"Flash","shape":"circle","x":22,"y":10.5,"width":3.5,"height":2}]}'),

('a0000001-0000-0000-0000-000000000004', 'iPhone 14 Pro Style', 'Triple camera square island', 'apple',
 '{"version":1,"canvasWidth":400,"canvasHeight":820,"body":{"insetX":10,"insetY":10,"cornerRadii":[38,38,38,38]},"cutouts":[{"id":"cam-island","label":"Camera Island","shape":"roundedRect","x":3,"y":2,"width":27,"height":15.5,"cornerRadius":30},{"id":"main","label":"Main Camera","shape":"circle","x":5,"y":3.5,"width":9,"height":5},{"id":"ultrawide","label":"Ultra Wide","shape":"circle","x":18,"y":3.5,"width":9,"height":5},{"id":"tele","label":"Telephoto","shape":"circle","x":11,"y":10,"width":9,"height":5},{"id":"flash","label":"Flash","shape":"circle","x":22,"y":10.5,"width":3.5,"height":2}]}'),

('a0000001-0000-0000-0000-000000000005', 'iPhone Dual Diagonal', 'Diagonal dual camera (14/15 base)', 'apple',
 '{"version":1,"canvasWidth":400,"canvasHeight":820,"body":{"insetX":10,"insetY":10,"cornerRadii":[38,38,38,38]},"cutouts":[{"id":"cam-island","label":"Camera Island","shape":"roundedRect","x":3,"y":2,"width":24,"height":14,"cornerRadius":30},{"id":"main","label":"Main Camera","shape":"circle","x":5,"y":3,"width":9,"height":5},{"id":"ultrawide","label":"Ultra Wide","shape":"circle","x":15,"y":8,"width":9,"height":5},{"id":"flash","label":"Flash","shape":"circle","x":18,"y":3.5,"width":3.5,"height":2}]}'),

('a0000001-0000-0000-0000-000000000006', 'iPhone 13/12 Pro Series', 'Diagonal triple/dual camera', 'apple',
 '{"version":1,"canvasWidth":400,"canvasHeight":820,"body":{"insetX":10,"insetY":10,"cornerRadii":[36,36,36,36]},"cutouts":[{"id":"cam-island","label":"Camera Island","shape":"roundedRect","x":3,"y":2,"width":26,"height":15,"cornerRadius":28},{"id":"main","label":"Main Camera","shape":"circle","x":5,"y":3,"width":9,"height":5},{"id":"ultrawide","label":"Ultra Wide","shape":"circle","x":5,"y":9.5,"width":9,"height":5},{"id":"tele","label":"Tele/Sensor","shape":"circle","x":17,"y":6,"width":9,"height":5},{"id":"flash","label":"Flash","shape":"circle","x":18,"y":12,"width":3.5,"height":2}]}'),

('a0000001-0000-0000-0000-000000000007', 'iPhone 12/12 Mini', 'Dual camera diagonal layout', 'apple',
 '{"version":1,"canvasWidth":400,"canvasHeight":820,"body":{"insetX":10,"insetY":10,"cornerRadii":[34,34,34,34]},"cutouts":[{"id":"cam-island","label":"Camera Island","shape":"roundedRect","x":3,"y":2,"width":23,"height":13,"cornerRadius":28},{"id":"main","label":"Main Camera","shape":"circle","x":5,"y":3,"width":9,"height":5},{"id":"ultrawide","label":"Ultra Wide","shape":"circle","x":13,"y":7.5,"width":9,"height":5},{"id":"flash","label":"Flash","shape":"circle","x":17,"y":3.5,"width":3.5,"height":2}]}'),

('a0000001-0000-0000-0000-000000000008', 'iPhone SE', 'Single camera, compact design', 'apple',
 '{"version":1,"canvasWidth":400,"canvasHeight":820,"body":{"insetX":10,"insetY":10,"cornerRadii":[28,28,28,28]},"cutouts":[{"id":"main","label":"Main Camera","shape":"circle","x":5,"y":3,"width":10,"height":5.5},{"id":"flash","label":"Flash","shape":"circle","x":5,"y":10,"width":3.5,"height":2}]}'),

('a0000001-0000-0000-0000-000000000009', 'Galaxy S Ultra', 'Individual vertical lenses, no island', 'samsung',
 '{"version":1,"canvasWidth":400,"canvasHeight":820,"body":{"insetX":10,"insetY":10,"cornerRadii":[30,30,30,30]},"cutouts":[{"id":"main","label":"Main Camera","shape":"circle","x":5,"y":3,"width":9,"height":5},{"id":"ultrawide","label":"Ultra Wide","shape":"circle","x":5,"y":9,"width":9,"height":5},{"id":"tele1","label":"Telephoto 1","shape":"circle","x":5,"y":15,"width":7,"height":4},{"id":"tele2","label":"Telephoto 2","shape":"circle","x":5,"y":20,"width":7,"height":4},{"id":"flash","label":"Flash","shape":"circle","x":16,"y":3.5,"width":3.5,"height":2}]}'),

('a0000001-0000-0000-0000-00000000000a', 'Galaxy S Standard', 'Horizontal triple camera island', 'samsung',
 '{"version":1,"canvasWidth":400,"canvasHeight":820,"body":{"insetX":10,"insetY":10,"cornerRadii":[32,32,32,32]},"cutouts":[{"id":"cam-island","label":"Camera Island","shape":"roundedRect","x":3,"y":2,"width":34,"height":10,"cornerRadius":40},{"id":"main","label":"Main Camera","shape":"circle","x":5,"y":3,"width":8,"height":4.5},{"id":"ultrawide","label":"Ultra Wide","shape":"circle","x":15,"y":3,"width":8,"height":4.5},{"id":"tele","label":"Telephoto","shape":"circle","x":25,"y":3,"width":8,"height":4.5},{"id":"flash","label":"Flash","shape":"circle","x":30,"y":8,"width":3,"height":1.7}]}'),

('a0000001-0000-0000-0000-00000000000b', 'Galaxy Z Fold', 'Wide back with vertical camera strip', 'samsung',
 '{"version":1,"canvasWidth":440,"canvasHeight":780,"body":{"insetX":10,"insetY":10,"cornerRadii":[28,28,28,28]},"cutouts":[{"id":"cam-island","label":"Camera Island","shape":"roundedRect","x":3,"y":2,"width":16,"height":18,"cornerRadius":30},{"id":"main","label":"Main Camera","shape":"circle","x":5,"y":3,"width":10,"height":5},{"id":"ultrawide","label":"Ultra Wide","shape":"circle","x":5,"y":9,"width":10,"height":5},{"id":"tele","label":"Telephoto","shape":"circle","x":5,"y":15,"width":6,"height":3}]}'),

('a0000001-0000-0000-0000-00000000000c', 'Galaxy Z Flip', 'Compact with outer display cutout', 'samsung',
 '{"version":1,"canvasWidth":380,"canvasHeight":420,"body":{"insetX":10,"insetY":10,"cornerRadii":[30,30,30,30]},"cutouts":[{"id":"outer-display","label":"Outer Display","shape":"roundedRect","x":20,"y":8,"width":60,"height":50,"cornerRadius":20},{"id":"main","label":"Main Camera","shape":"circle","x":28,"y":65,"width":14,"height":8},{"id":"ultrawide","label":"Ultra Wide","shape":"circle","x":50,"y":65,"width":14,"height":8},{"id":"flash","label":"Flash","shape":"circle","x":68,"y":68,"width":6,"height":3.5}]}'),

('a0000001-0000-0000-0000-00000000000d', 'Pixel 9 Series', 'Horizontal pill-shaped camera visor', 'google',
 '{"version":1,"canvasWidth":400,"canvasHeight":820,"body":{"insetX":10,"insetY":10,"cornerRadii":[36,36,36,36]},"cutouts":[{"id":"visor","label":"Camera Visor","shape":"pill","x":8,"y":3,"width":84,"height":7,"cornerRadius":50},{"id":"main","label":"Main Camera","shape":"circle","x":18,"y":3.5,"width":8,"height":4.5},{"id":"ultrawide","label":"Ultra Wide","shape":"circle","x":30,"y":3.5,"width":8,"height":4.5},{"id":"tele","label":"Telephoto","shape":"circle","x":42,"y":3.5,"width":7,"height":4},{"id":"flash","label":"Flash","shape":"circle","x":72,"y":4,"width":4,"height":2.2}]}'),

('a0000001-0000-0000-0000-00000000000e', 'Pixel Camera Bar', 'Full-width edge-to-edge camera bar', 'google',
 '{"version":1,"canvasWidth":400,"canvasHeight":820,"body":{"insetX":10,"insetY":10,"cornerRadii":[34,34,34,34]},"cutouts":[{"id":"bar","label":"Camera Bar","shape":"roundedRect","x":0,"y":4,"width":100,"height":6,"cornerRadius":10},{"id":"main","label":"Main Camera","shape":"circle","x":18,"y":4.5,"width":7,"height":4},{"id":"ultrawide","label":"Ultra Wide","shape":"circle","x":30,"y":4.5,"width":7,"height":4},{"id":"flash","label":"Flash","shape":"circle","x":70,"y":5,"width":3.5,"height":2}]}'),

('a0000001-0000-0000-0000-00000000000f', 'Pixel Fold', 'Wide foldable with camera visor', 'google',
 '{"version":1,"canvasWidth":440,"canvasHeight":780,"body":{"insetX":10,"insetY":10,"cornerRadii":[30,30,30,30]},"cutouts":[{"id":"visor","label":"Camera Visor","shape":"pill","x":8,"y":3,"width":80,"height":7,"cornerRadius":50},{"id":"main","label":"Main Camera","shape":"circle","x":18,"y":3.5,"width":8,"height":4.5},{"id":"ultrawide","label":"Ultra Wide","shape":"circle","x":30,"y":3.5,"width":8,"height":4.5},{"id":"tele","label":"Telephoto","shape":"circle","x":42,"y":3.5,"width":7,"height":4}]}'),

('a0000001-0000-0000-0000-000000000010', 'OnePlus Circle Island', 'Large circular camera module', 'oneplus',
 '{"version":1,"canvasWidth":400,"canvasHeight":820,"body":{"insetX":10,"insetY":10,"cornerRadii":[34,34,34,34]},"cutouts":[{"id":"cam-island","label":"Camera Island","shape":"circle","x":3,"y":1.5,"width":28,"height":16},{"id":"main","label":"Main Camera","shape":"circle","x":5,"y":2.5,"width":9,"height":5},{"id":"ultrawide","label":"Ultra Wide","shape":"circle","x":18,"y":2.5,"width":9,"height":5},{"id":"tele","label":"Telephoto","shape":"circle","x":11,"y":9,"width":9,"height":5},{"id":"flash","label":"Flash","shape":"circle","x":23,"y":10,"width":3.5,"height":2}]}'),

('a0000001-0000-0000-0000-000000000011', 'OnePlus Rect Island', 'Rectangular island top-left', 'oneplus',
 '{"version":1,"canvasWidth":400,"canvasHeight":820,"body":{"insetX":10,"insetY":10,"cornerRadii":[32,32,32,32]},"cutouts":[{"id":"cam-island","label":"Camera Island","shape":"roundedRect","x":3,"y":2,"width":20,"height":18,"cornerRadius":25},{"id":"main","label":"Main Camera","shape":"circle","x":6,"y":3,"width":10,"height":5.5},{"id":"ultrawide","label":"Ultra Wide","shape":"circle","x":6,"y":10,"width":10,"height":5.5},{"id":"macro","label":"Macro","shape":"circle","x":6,"y":16,"width":5,"height":2.8},{"id":"flash","label":"Flash","shape":"circle","x":16,"y":16,"width":3.5,"height":2}]}'),

('a0000001-0000-0000-0000-000000000012', 'Generic Rect Top-Left', 'Standard rect island (Xiaomi/Realme/Oppo/Vivo)', '',
 '{"version":1,"canvasWidth":400,"canvasHeight":820,"body":{"insetX":10,"insetY":10,"cornerRadii":[32,32,32,32]},"cutouts":[{"id":"cam-island","label":"Camera Island","shape":"roundedRect","x":3,"y":2,"width":22,"height":20,"cornerRadius":25},{"id":"main","label":"Main Camera","shape":"circle","x":6,"y":3,"width":10,"height":5.5},{"id":"ultrawide","label":"Ultra Wide","shape":"circle","x":6,"y":10,"width":10,"height":5.5},{"id":"macro","label":"Macro/Depth","shape":"circle","x":6,"y":17,"width":5,"height":2.8},{"id":"flash","label":"Flash","shape":"circle","x":17,"y":5,"width":3.5,"height":2}]}'),

('a0000001-0000-0000-0000-000000000013', 'Generic Center Circle', 'Centered circular module (Motorola/Vivo)', '',
 '{"version":1,"canvasWidth":400,"canvasHeight":820,"body":{"insetX":10,"insetY":10,"cornerRadii":[32,32,32,32]},"cutouts":[{"id":"cam-island","label":"Camera Island","shape":"circle","x":28,"y":2,"width":36,"height":20},{"id":"main","label":"Main Camera","shape":"circle","x":32,"y":3,"width":12,"height":7},{"id":"ultrawide","label":"Ultra Wide","shape":"circle","x":48,"y":3,"width":12,"height":7},{"id":"macro","label":"Macro","shape":"circle","x":40,"y":14,"width":8,"height":4.5},{"id":"flash","label":"Flash","shape":"circle","x":55,"y":14,"width":4,"height":2.2}]}'),

('a0000001-0000-0000-0000-000000000014', 'Nothing Phone', 'Flat back, dual camera top-left', 'nothing',
 '{"version":1,"canvasWidth":400,"canvasHeight":820,"body":{"insetX":10,"insetY":10,"cornerRadii":[34,34,34,34]},"cutouts":[{"id":"cam-island","label":"Camera Island","shape":"roundedRect","x":3,"y":2,"width":24,"height":14,"cornerRadius":30},{"id":"main","label":"Main Camera","shape":"circle","x":5,"y":3,"width":9,"height":5},{"id":"ultrawide","label":"Ultra Wide","shape":"circle","x":15,"y":3,"width":9,"height":5},{"id":"flash","label":"Flash","shape":"circle","x":10,"y":10,"width":4,"height":2.2}]}'),

('a0000001-0000-0000-0000-000000000015', 'Foldable Generic', 'Compact foldable with outer display', '',
 '{"version":1,"canvasWidth":380,"canvasHeight":440,"body":{"insetX":10,"insetY":10,"cornerRadii":[28,28,28,28]},"cutouts":[{"id":"outer-display","label":"Outer Display","shape":"roundedRect","x":18,"y":8,"width":64,"height":48,"cornerRadius":18},{"id":"main","label":"Main Camera","shape":"circle","x":30,"y":62,"width":14,"height":8.5},{"id":"ultrawide","label":"Ultra Wide","shape":"circle","x":50,"y":62,"width":14,"height":8.5},{"id":"flash","label":"Flash","shape":"circle","x":68,"y":65,"width":5,"height":3}]}')

ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  brand_hint = EXCLUDED.brand_hint,
  config = EXCLUDED.config;

-- ─── MAP MODELS TO TEMPLATES ─────────────────────────

-- Apple
UPDATE public.device_models SET mask_template_id = 'a0000001-0000-0000-0000-000000000001' WHERE slug IN ('iphone-16-pro-max', 'iphone-16-pro', 'iphone-17-pro-max');
UPDATE public.device_models SET mask_template_id = 'a0000001-0000-0000-0000-000000000002' WHERE slug IN ('iphone-16-plus', 'iphone-16');
UPDATE public.device_models SET mask_template_id = 'a0000001-0000-0000-0000-000000000003' WHERE slug IN ('iphone-15-pro-max', 'iphone-15-pro');
UPDATE public.device_models SET mask_template_id = 'a0000001-0000-0000-0000-000000000004' WHERE slug IN ('iphone-14-pro-max', 'iphone-14-pro');
UPDATE public.device_models SET mask_template_id = 'a0000001-0000-0000-0000-000000000005' WHERE slug IN ('iphone-15-plus', 'iphone-15', 'iphone-14-plus', 'iphone-14');
UPDATE public.device_models SET mask_template_id = 'a0000001-0000-0000-0000-000000000006' WHERE slug IN ('iphone-13-pro-max', 'iphone-13-pro', 'iphone-13', 'iphone-13-mini', 'iphone-12-pro-max', 'iphone-12-pro');
UPDATE public.device_models SET mask_template_id = 'a0000001-0000-0000-0000-000000000007' WHERE slug IN ('iphone-12', 'iphone-12-mini');
UPDATE public.device_models SET mask_template_id = 'a0000001-0000-0000-0000-000000000008' WHERE slug IN ('iphone-se-2022');

-- Samsung
UPDATE public.device_models SET mask_template_id = 'a0000001-0000-0000-0000-000000000009' WHERE slug IN ('galaxy-s24-ultra', 'galaxy-s23-ultra', 'galaxy-s22-ultra', 'galaxy-s21-ultra');
UPDATE public.device_models SET mask_template_id = 'a0000001-0000-0000-0000-00000000000a' WHERE slug IN ('galaxy-s24-plus', 'galaxy-s24', 'galaxy-s24-fe', 'galaxy-s23-plus', 'galaxy-s23', 'galaxy-s23-fe', 'galaxy-s22-plus', 'galaxy-s22', 'galaxy-a55', 'galaxy-a54', 'galaxy-a35');
UPDATE public.device_models SET mask_template_id = 'a0000001-0000-0000-0000-00000000000b' WHERE slug IN ('galaxy-z-fold6', 'galaxy-z-fold5', 'galaxy-z-fold4');
UPDATE public.device_models SET mask_template_id = 'a0000001-0000-0000-0000-00000000000c' WHERE slug IN ('galaxy-z-flip6', 'galaxy-z-flip5', 'galaxy-z-flip4');

-- Google Pixel
UPDATE public.device_models SET mask_template_id = 'a0000001-0000-0000-0000-00000000000d' WHERE slug IN ('pixel-9-pro-xl', 'pixel-9-pro', 'pixel-9');
UPDATE public.device_models SET mask_template_id = 'a0000001-0000-0000-0000-00000000000e' WHERE slug IN ('pixel-8-pro', 'pixel-8', 'pixel-8a', 'pixel-7-pro', 'pixel-7', 'pixel-7a', 'pixel-6-pro', 'pixel-6');
UPDATE public.device_models SET mask_template_id = 'a0000001-0000-0000-0000-00000000000f' WHERE slug IN ('pixel-9-pro-fold');

-- OnePlus
UPDATE public.device_models SET mask_template_id = 'a0000001-0000-0000-0000-000000000010' WHERE slug IN ('oneplus-13', 'oneplus-12', 'oneplus-11', 'oneplus-10-pro');
UPDATE public.device_models SET mask_template_id = 'a0000001-0000-0000-0000-000000000011' WHERE slug IN ('oneplus-12r', 'oneplus-nord-4', 'oneplus-nord-3', 'oneplus-nord-ce-4');

-- Xiaomi / POCO / Redmi
UPDATE public.device_models SET mask_template_id = 'a0000001-0000-0000-0000-000000000012' WHERE slug IN ('xiaomi-14-ultra', 'xiaomi-14-pro', 'xiaomi-14', 'xiaomi-13-ultra', 'xiaomi-13-pro', 'xiaomi-13', 'poco-f6-pro', 'poco-f5', 'redmi-note-12-pro-plus', 'redmi-note-13-pro', 'redmi-note-13-pro-plus', 'redmi-note-14');

-- Realme
UPDATE public.device_models SET mask_template_id = 'a0000001-0000-0000-0000-000000000012' WHERE slug IN ('realme-gt5-pro', 'realme-gt3', 'realme-12-pro-plus', 'realme-12-pro', 'realme-11-pro-plus', 'realme-narzo-70-pro', 'realme-gt-7-pro');

-- Oppo
UPDATE public.device_models SET mask_template_id = 'a0000001-0000-0000-0000-000000000012' WHERE slug IN ('oppo-find-x7-ultra', 'oppo-find-x6-pro', 'oppo-reno-12-pro', 'oppo-reno-11-pro', 'oppo-a79');
UPDATE public.device_models SET mask_template_id = 'a0000001-0000-0000-0000-000000000015' WHERE slug IN ('oppo-find-n3-flip');

-- Vivo / iQOO
UPDATE public.device_models SET mask_template_id = 'a0000001-0000-0000-0000-000000000012' WHERE slug IN ('vivo-x100-ultra', 'vivo-x100-pro', 'vivo-x100', 'vivo-x90-pro', 'vivo-v30-pro', 'iqoo-12');

-- Motorola
UPDATE public.device_models SET mask_template_id = 'a0000001-0000-0000-0000-000000000013' WHERE slug IN ('moto-edge-50-ultra', 'moto-edge-50-pro', 'moto-edge-40-pro', 'motorola-edge-60-pro', 'moto-g84');
UPDATE public.device_models SET mask_template_id = 'a0000001-0000-0000-0000-000000000015' WHERE slug IN ('moto-razr-50-ultra', 'moto-razr-40-ultra');

-- Nothing
UPDATE public.device_models SET mask_template_id = 'a0000001-0000-0000-0000-000000000014' WHERE slug IN ('nothing-phone-2a-plus', 'nothing-phone-2a', 'nothing-phone-2', 'nothing-phone-1');

COMMIT;
