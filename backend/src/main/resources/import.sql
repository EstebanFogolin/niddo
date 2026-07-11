INSERT INTO productos (id, nombre, descripcion, categoria) VALUES
(1, 'Hermitage Hotel', 'Alojamiento ideal para quienes buscan comodidad y una ubicacion centrica. Cuenta con habitaciones amplias, espacios comunes cuidados y servicios pensados para una estadia tranquila cerca de los principales puntos de interes.', 'Hotel'),
(2, 'Casa del Sol', 'Un espacio calido y familiar para descansar con atencion personalizada. Ofrece desayuno incluido, ambientes luminosos y una propuesta simple para disfrutar la ciudad con una experiencia cercana y relajada.', 'Bed and breakfast'),
(3, 'Urban Hostel BA', 'Hostel practico para viajeros que priorizan ubicacion, precio y vida social. Dispone de habitaciones compartidas, areas comunes y una propuesta pensada para conocer otros huespedes durante la estadia.', 'Hostel'),
(4, 'Departamento Palermo', 'Departamento equipado para estadias cortas o medias, con cocina, living y espacios funcionales. Es una alternativa comoda para quienes prefieren mayor independencia durante su viaje.', 'Departamento');

INSERT INTO producto_imagenes (producto_id, url) VALUES
(1, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900'),
(1, 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900'),
(1, 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=900'),
(1, 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=900'),
(1, 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=900'),
(1, 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=900'),
(1, 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=900'),
(2, 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=900'),
(2, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900'),
(2, 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=900'),
(2, 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=900'),
(2, 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=900'),
(2, 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=900'),
(2, 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=900'),
(3, 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=900'),
(3, 'https://images.unsplash.com/photo-1520277739336-7bf67edfa768?w=900'),
(3, 'https://images.unsplash.com/photo-1590490359683-658d3d23f972?w=900'),
(3, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=900'),
(3, 'https://images.unsplash.com/photo-1560440021-33f9b867899d?w=900'),
(3, 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=900'),
(3, 'https://images.unsplash.com/photo-1560185009-dddeb820c7b7?w=900'),
(4, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900'),
(4, 'https://images.unsplash.com/photo-1560448075-bb485b067938?w=900'),
(4, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=900'),
(4, 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=900'),
(4, 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=900'),
(4, 'https://images.unsplash.com/photo-1560185127-6a8c4f6f4e34?w=900'),
(4, 'https://images.unsplash.com/photo-1560184897-ae75f418493e?w=900');

ALTER TABLE productos ALTER COLUMN id RESTART WITH 5;
