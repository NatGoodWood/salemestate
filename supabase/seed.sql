-- Optional: loads the three homes currently listed on the Salem website. Run after schema.sql.
insert into public.listings (title, description, price, currency, listing_type, property_type, bedrooms, bathrooms, location, city, features, images, status, featured) values
('Three Bedroom Ensuite', 'A newly built three bedroom ensuite home in the new areas of Malejor, within the City of David community. Prices exclude taxes and are subject to change.', 1800000, 'GHS', 'sale', 'house', 3, 3, 'Malejor, City of David', 'Accra',
 array['Built-in wardrobes','Fitted kitchen with cabinets','Ceramic floor tiles in kitchen and bedrooms','Coloured long-span roofing','Fence wall with gate','Metal security door (external)','Paved drive and walkway','T&G ceiling throughout'],
 array['https://i0.wp.com/salemestate.com/wp-content/uploads/2020/08/3-BEDROOM-ENSUITE.jpeg?w=1200&ssl=1'], 'published', true),
('Three Bedroom Expanded Detached House', 'A newly built three bedroom expanded detached house in the new areas of Malejor, within the City of David community. Prices exclude taxes and are subject to change.', 1200000, 'GHS', 'sale', 'house', 3, 2, 'Malejor, City of David', 'Accra',
 array['Built-in wardrobes','Fitted kitchen with cabinets','Ceramic floor tiles in kitchen and bedrooms','Coloured long-span roofing','Fence wall with gate','Metal security door (external)','Paved drive and walkway','T&G ceiling throughout'],
 array['https://i0.wp.com/salemestate.com/wp-content/uploads/2020/08/room.jpg?w=1200&ssl=1'], 'published', true),
('Two Bedroom Detached Expandable', 'A newly built two bedroom detached expandable house in the new areas of Malejor, within the City of David community. Prices exclude taxes and are subject to change.', 1053600, 'GHS', 'sale', 'house', 2, 1, 'Malejor, City of David', 'Accra',
 array['Built-in wardrobes','Fitted kitchen with cabinets','Ceramic floor tiles in kitchen and bedrooms','Coloured long-span roofing','Fence wall with gate','Metal security door (external)','Paved drive and walkway','T&G ceiling throughout'],
 array['https://i0.wp.com/salemestate.com/wp-content/uploads/2020/08/Two-Bedroom-Detached-House.jpg?w=1200&ssl=1'], 'published', true);
