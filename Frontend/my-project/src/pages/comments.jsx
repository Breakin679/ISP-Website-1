{
  /*-- 1) operation_type
INSERT INTO Operation_Type (name, description) VALUES
  ('Installation', 'New service installation request'),
  ('Upgrade',      'Upgrade existing equipment to higher tier'),
  ('Maintenance',  'Scheduled maintenance or troubleshooting');

-- 2) users
INSERT INTO Users (fn,ln, Email, Password_Hash, Role) VALUES
  ('alice','Doe',    'alice@example.com', '12345678', 'customer'),
  ('bob','strong','bob@example.com',   '12345678', 'customer'),
  ('marc',  'aboudib','marc@isp.com',   '12345678', 'admin');

-- 3) Operation
-- assume Operation_Type IDs are 1=Installation, 2=Upgrade, 3=Maintenance
INSERT INTO Operation (operation_type_id, name, price, description) VALUES
  (1, 'Home Fiber Install',       49.99, 'Install fiber connection at residential address'),
  (2, 'Speed Upgrade to 300Mbps', 19.99, 'Upgrade current plan to 300Mbps tier'),
  (3, 'On‑site Maintenance',      29.99, 'Dispatch technician for troubleshooting');

-- 4) plan_type
INSERT INTO Plan_Type (Name) VALUES
  ('Fiber'),
  ('Residential'),
  ('Corporate');

-- 5) plans
-- assume Plan_Type IDs are 1=Fiber, 2=Residential, 3=Corporate
INSERT INTO Plans (name, plan_type_id, Price,data_limit, bandwidth,public_ip_count, description_plan) VALUES
  ('Fiber Basic',       1,       39.99,400, '100 Mbps',0, 'Unlimited data; 24/7 support'),
  ('Residential Silver',2, 29.99,400 ,'30 Mbps',0,  'Unlimited data; free modem'),
  ('Corporate Gold',    3,   99.99,-1 ,'200 Mbps',8, 'SLAs; static IPs; priority support');

-- 6) subscription
-- a table linking users to active plans (you’ll need to create this if not already)
-- Assume schema: id, user_id, plan_id, startDate, endDate
INSERT INTO Subscription (users_id, plan_id, date) VALUES
  (2, 2, '2025-01-01'),
  (3, 1, '2025-03-15');

-- 7) coverage
-- assume Plan_Type IDs: 1=Fiber, 2=Residential, 3=Corporate
INSERT INTO Coverage (name, plan_type_id, location, ContactInfo, Status) VALUES
  ('beirut fiber',   1, 'Beirut',    'my@isp.com', 1),
  ('jounieh residential',    2, 'Jounieh',  'my@isp.com', 1),
  ('jounieh corporate',        3, 'Jounieh', 'my@isp.com', 1);

-- 8) servers
-- assume Coverage IDs are 1,2,3
INSERT INTO Servers (name, coverage_id, location, bandwidth, status) VALUES
  ('Fiber-Edge-01',      1, 'zip-code',    1000, 1),
  ('Residential-GW-02',  2, 'zip-code',  500,  1),
  ('Corporate-Core-01',  3, 'zip-code', 2000, 1);

-- 9) UsersIPs
-- record some IPs seen/assigned
INSERT INTO UsersIPs (user_id, ip_address, is_assigned, Notes, ispublic) VALUES
  (2, '192.168.1.10', 0, 'Alice home DHCP', 0),
  (3, '203.0.113.45', 1, 'Bob static public IP', 1),
  (4, '198.51.100.22',1, 'Admin VPN endpoint', 0);
 */
}
