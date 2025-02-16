USE africar_db;

-- Insertion des utilisateurs
INSERT INTO users (id, email, password, full_name, role) VALUES
('u1', 'admin@africar.com', '$2a$10$xxxxxxxxxxx', 'Admin Principal', 'admin'),
('u2', 'transport.express@gmail.com', '$2a$10$xxxxxxxxxxx', 'Gérant Transport Express', 'company_admin'),
('u3', 'senegal.tours@gmail.com', '$2a$10$xxxxxxxxxxx', 'Gérant Sénégal Tours', 'company_admin');

-- Insertion des compagnies
INSERT INTO companies (id, name, email, phone, address, status) VALUES
('c1', 'Transport Express Dakar', 'transport.express@gmail.com', '+221 77 123 45 67', 'Rue 10, Dakar Plateau', 'active'),
('c2', 'Sénégal Tours', 'senegal.tours@gmail.com', '+221 78 234 56 78', 'Avenue Bourguiba, Dakar', 'active'),
('c3', 'Africa Trans', 'africa.trans@gmail.com', '+221 76 345 67 89', 'Route de Rufisque', 'active'),
('c4', 'Sahel Voyages', 'sahel.voyages@gmail.com', '+221 77 456 78 90', 'Rue 12, Saint-Louis', 'active'),
('c5', 'Littoral Transport', 'littoral.transport@gmail.com', '+221 78 567 89 01', 'Boulevard Maritime, Mbour', 'active');

-- Insertion des stations
INSERT INTO stations (id, name, city, address, status) VALUES
('s1', 'Gare Routière Dakar', 'Dakar', 'Béceao, Dakar', 'active'),
('s2', 'Station Saint-Louis', 'Saint-Louis', 'Centre-ville, Saint-Louis', 'active'),
('s3', 'Gare Thiès', 'Thiès', 'Route de Dakar, Thiès', 'active'),
('s4', 'Station Mbour', 'Mbour', 'Route Nationale, Mbour', 'active'),
('s5', 'Gare Touba', 'Touba', 'Centre-ville, Touba', 'active');

-- Insertion des chauffeurs
INSERT INTO drivers (id, company_id, full_name, phone, license_number, status, rating) VALUES
('d1', 'c1', 'Moussa Diop', '+221 77 111 22 33', 'LIC001', 'available', 4.8),
('d2', 'c1', 'Abdou Fall', '+221 77 222 33 44', 'LIC002', 'available', 4.5),
('d3', 'c2', 'Mamadou Sow', '+221 77 333 44 55', 'LIC003', 'available', 4.7),
('d4', 'c2', 'Ibrahima Ndiaye', '+221 77 444 55 66', 'LIC004', 'busy', 4.6),
('d5', 'c3', 'Omar Sy', '+221 77 555 66 77', 'LIC005', 'available', 4.9);

-- Insertion des véhicules
INSERT INTO vehicles (id, company_id, model, registration_number, capacity, status) VALUES
('v1', 'c1', 'Toyota Hiace', 'DK-1234-AA', 15, 'active'),
('v2', 'c1', 'Mercedes Sprinter', 'DK-5678-AB', 20, 'active'),
('v3', 'c2', 'Toyota Coaster', 'DK-9012-BC', 25, 'active'),
('v4', 'c2', 'Hyundai County', 'DK-3456-CD', 18, 'maintenance'),
('v5', 'c3', 'Toyota Hiace', 'DK-7890-DE', 15, 'active');

-- Insertion des routes
INSERT INTO routes (id, company_id, departure_station_id, arrival_station_id, base_price, duration_minutes) VALUES
('r1', 'c1', 's1', 's2', 5000, 240),
('r2', 'c1', 's1', 's3', 3000, 90),
('r3', 'c2', 's1', 's4', 2500, 60),
('r4', 'c2', 's3', 's5', 4000, 180),
('r5', 'c3', 's1', 's5', 6000, 300);

-- Insertion des clients
INSERT INTO clients (id, full_name, email, phone) VALUES
('cl1', 'Fatou Diallo', 'fatou.diallo@gmail.com', '+221 77 123 00 01'),
('cl2', 'Amadou Ba', 'amadou.ba@gmail.com', '+221 77 234 00 02'),
('cl3', 'Aïssatou Ndiaye', 'aissatou.ndiaye@gmail.com', '+221 77 345 00 03'),
('cl4', 'Cheikh Diop', 'cheikh.diop@gmail.com', '+221 77 456 00 04'),
('cl5', 'Mariama Sow', 'mariama.sow@gmail.com', '+221 77 567 00 05');

-- Insertion des réservations (derniers 30 jours) avec sauvegarde des IDs
DROP TEMPORARY TABLE IF EXISTS temp_bookings;
CREATE TEMPORARY TABLE temp_bookings (
    id VARCHAR(36),
    client_id VARCHAR(36)
);

-- Insérer 5 réservations et sauvegarder leurs IDs
INSERT INTO bookings (id, client_id, route_id, vehicle_id, driver_id, booking_date, departure_time, seats_booked, total_price, commission_amount, status, payment_status)
VALUES
(UUID(), 'cl1', 'r1', 'v1', 'd1', CURDATE(), '09:00:00', 2, 3000, 450, 'completed', 'paid'),
(UUID(), 'cl2', 'r2', 'v2', 'd2', CURDATE(), '10:00:00', 1, 2500, 375, 'completed', 'paid'),
(UUID(), 'cl3', 'r3', 'v3', 'd3', CURDATE(), '11:00:00', 3, 4000, 600, 'completed', 'paid'),
(UUID(), 'cl4', 'r4', 'v4', 'd4', CURDATE(), '12:00:00', 2, 3500, 525, 'completed', 'paid'),
(UUID(), 'cl5', 'r5', 'v5', 'd5', CURDATE(), '13:00:00', 1, 2000, 300, 'completed', 'paid');

-- Sauvegarder les IDs des réservations
INSERT INTO temp_bookings (id, client_id)
SELECT id, client_id FROM bookings ORDER BY booking_date LIMIT 5;

-- Insertion des réclamations
INSERT INTO complaints (id, booking_id, client_id, type, description, status)
SELECT 
    UUID(),
    b.id,
    b.client_id,
    c.type,
    c.description,
    c.status
FROM temp_bookings b
CROSS JOIN (
    SELECT 'delay' as type, 'Retard de plus de 30 minutes' as description, 'resolved' as status UNION ALL
    SELECT 'vehicle', 'Climatisation défectueuse', 'in_progress' UNION ALL
    SELECT 'driver', 'Conduite imprudente', 'pending' UNION ALL
    SELECT 'service', 'Mauvaise organisation', 'closed' UNION ALL
    SELECT 'other', 'Problème de bagages', 'pending'
) c;

-- Insertion des avis
INSERT INTO reviews (id, booking_id, client_id, rating, comment)
SELECT 
    UUID(),
    b.id,
    b.client_id,
    r.rating,
    r.comment
FROM temp_bookings b
CROSS JOIN (
    SELECT 4.5 as rating, 'Bon service malgré le retard' as comment UNION ALL
    SELECT 3.0, 'Voyage correct mais problème de climatisation' UNION ALL
    SELECT 2.5, 'Pas satisfait de la conduite' UNION ALL
    SELECT 4.0, 'Service acceptable' UNION ALL
    SELECT 5.0, 'Excellent service, très ponctuel'
) r;

DROP TEMPORARY TABLE IF EXISTS temp_bookings;

-- Insertion des promotions
INSERT INTO promotions (id, company_id, code, discount_percentage, start_date, end_date, status) VALUES
('p1', 'c1', 'SUMMER2024', 10.00, '2024-06-01', '2024-08-31', 'active'),
('p2', 'c2', 'TABASKI2024', 15.00, '2024-06-15', '2024-07-15', 'active'),
('p3', 'c3', 'WEEKEND', 5.00, '2024-01-01', '2024-12-31', 'active'),
('p4', 'c4', 'STUDENT', 20.00, '2024-01-01', '2024-12-31', 'active'),
('p5', 'c5', 'FAMILY', 12.00, '2024-01-01', '2024-12-31', 'active');
