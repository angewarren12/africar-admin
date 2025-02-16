USE africar_db;

-- Ajouter 100 réservations supplémentaires réparties sur les 30 derniers jours
INSERT INTO bookings (id, client_id, route_id, vehicle_id, driver_id, booking_date, departure_time, seats_booked, total_price, commission_amount, status, payment_status)
SELECT 
    UUID(),
    CONCAT('cl', 1 + FLOOR(RAND() * 5)),
    r.id,
    CONCAT('v', 1 + FLOOR(RAND() * 5)),
    CONCAT('d', 1 + FLOOR(RAND() * 5)),
    DATE_SUB(CURRENT_DATE, INTERVAL FLOOR(RAND() * 30) DAY),
    MAKETIME(6 + FLOOR(RAND() * 14), FLOOR(RAND() * 60), 0),
    1 + FLOOR(RAND() * 4),
    r.base_price * (1 + FLOOR(RAND() * 4)),
    FLOOR(r.base_price * (1 + FLOOR(RAND() * 4)) * 0.15),
    CASE FLOOR(RAND() * 10)
        WHEN 0 THEN 'pending'
        WHEN 1 THEN 'cancelled'
        ELSE 'completed'
    END,
    CASE FLOOR(RAND() * 10)
        WHEN 0 THEN 'pending'
        WHEN 1 THEN 'refunded'
        ELSE 'paid'
    END
FROM routes r
CROSS JOIN (
    SELECT 1 as n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL 
    SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL 
    SELECT 9 UNION ALL SELECT 10 UNION ALL SELECT 11 UNION ALL SELECT 12 UNION ALL 
    SELECT 13 UNION ALL SELECT 14 UNION ALL SELECT 15 UNION ALL SELECT 16 UNION ALL 
    SELECT 17 UNION ALL SELECT 18 UNION ALL SELECT 19 UNION ALL SELECT 20
) numbers;
