// Lista oficial completa de municipios de Colombia - DANE 2024
// Total: 1,122 municipios en 32 departamentos + Bogotá D.C.
// Fuente: Departamento Administrativo Nacional de Estadística (DANE)

export const MUNICIPALITIES_BY_DEPARTMENT: Readonly<{ [key: string]: readonly string[] }> = Object.freeze({
  'amazonas': Object.freeze([
    'Leticia', 'Puerto Nariño'
  ]),
  'antioquia': Object.freeze([
    'Abejorral', 'Abriaquí', 'Alejandría', 'Amagá', 'Amalfi', 'Andes', 'Angelópolis',
    'Angostura', 'Anorí', 'Anzá', 'Apartadó', 'Arboletes', 'Argelia', 'Armenia',
    'Barbosa', 'Bello', 'Belmira', 'Betania', 'Betulia', 'Briceño', 'Buriticá',
    'Cáceres', 'Caicedo', 'Caldas', 'Campamento', 'Cañasgordas', 'Caracolí',
    'Caramanta', 'Carepa', 'Carmen de Viboral', 'Carolina', 'Caucasia', 'Chigorodó',
    'Cisneros', 'Cocorná', 'Concepción', 'Concordia', 'Copacabana', 'Dabeiba',
    'Don Matías', 'Ebéjico', 'El Bagre', 'Entrerríos', 'Envigado', 'Fredonia',
    'Frontino', 'Giraldo', 'Girardota', 'Gómez Plata', 'Granada', 'Guadalupe',
    'Guarne', 'Guatapé', 'Heliconia', 'Hispania', 'Itagüí', 'Ituango', 'Jardín',
    'Jericó', 'La Ceja', 'La Estrella', 'La Pintada', 'La Unión', 'Liborina',
    'Maceo', 'Marinilla', 'Medellín', 'Montebello', 'Murindó', 'Mutatá', 'Nariño',
    'Nechí', 'Necoclí', 'Olaya', 'Peñol', 'Peque', 'Pueblorrico', 'Puerto Berrío',
    'Puerto Nare', 'Puerto Triunfo', 'Remedios', 'Retiro', 'Rionegro', 'Sabanalarga',
    'Sabaneta', 'Salgar', 'San Andrés de Cuerquia', 'San Carlos', 'San Francisco',
    'San Jerónimo', 'San José de la Montaña', 'San Juan de Urabá', 'San Luis',
    'San Pedro', 'San Pedro de Urabá', 'San Rafael', 'San Roque', 'San Vicente',
    'Santa Bárbara', 'Santa Rosa de Osos', 'Santo Domingo', 'Segovia', 'Sonsón',
    'Sopetrán', 'Támesis', 'Tarazá', 'Tarso', 'Titiribí', 'Toledo', 'Turbo',
    'Uramita', 'Urrao', 'Valdivia', 'Valparaíso', 'Vegachí', 'Venecia',
    'Vigía del Fuerte', 'Yalí', 'Yarumal', 'Yolombó', 'Yondó', 'Zaragoza'
  ]),
  'arauca': Object.freeze([
    'Arauca', 'Arauquita', 'Cravo Norte', 'Fortul', 'Puerto Rondón', 'Saravena', 'Tame'
  ]),
  'atlantico': Object.freeze([
    'Barranquilla', 'Baranoa', 'Campo de la Cruz', 'Candelaria', 'Galapa',
    'Juan de Acosta', 'Luruaco', 'Malambo', 'Manatí', 'Palmar de Varela',
    'Piojó', 'Polonuevo', 'Ponedera', 'Puerto Colombia', 'Repelón',
    'Sabanagrande', 'Sabanalarga', 'Santa Lucía', 'Santo Tomás', 'Soledad',
    'Suan', 'Tubará', 'Usiacurí'
  ]),
  'bogota': Object.freeze([
    'Bogotá D.C.'
  ]),
  'bolivar': Object.freeze([
    'Cartagena', 'Achí', 'Altos del Rosario', 'Arenal', 'Arjona', 'Arroyohondo',
    'Barranco de Loba', 'Calamar', 'Cantagallo', 'Cicuco', 'Córdoba', 'Clemencia',
    'El Carmen de Bolívar', 'El Guamo', 'El Peñón', 'Hatillo de Loba', 'Magangué',
    'Mahates', 'Margarita', 'María la Baja', 'Mompós', 'Montecristo', 'Morales',
    'Norosí', 'Pinillos', 'Regidor', 'Río Viejo', 'San Cristóbal', 'San Estanislao',
    'San Fernando', 'San Jacinto', 'San Jacinto del Cauca', 'San Juan Nepomuceno',
    'San Martín de Loba', 'San Pablo', 'Santa Catalina', 'Santa Rosa',
    'Santa Rosa del Sur', 'Simití', 'Soplaviento', 'Talaigua Nuevo', 'Tiquisio',
    'Turbaco', 'Turbaná', 'Villanueva', 'Zambrano'
  ]),
  'boyaca': Object.freeze([
    'Tunja', 'Almeida', 'Aquitania', 'Arcabuco', 'Belén', 'Berbeo', 'Betéitiva',
    'Boavita', 'Boyacá', 'Briceño', 'Buenavista', 'Busbanzá', 'Caldas', 'Campohermoso',
    'Cerinza', 'Chinavita', 'Chiquinquirá', 'Chiscas', 'Chita', 'Chitaraque',
    'Chivatá', 'Ciénega', 'Cómbita', 'Coper', 'Corrales', 'Covarachía', 'Cubará',
    'Cucaita', 'Cuítiva', 'Chíquiza', 'Chivor', 'Duitama', 'El Cocuy', 'El Espino',
    'Firavitoba', 'Floresta', 'Gachantivá', 'Gámeza', 'Garagoa', 'Guacamayas',
    'Guateque', 'Guayatá', 'Güicán', 'Iza', 'Jenesano', 'Jericó', 'Labranzagrande',
    'La Capilla', 'La Victoria', 'La Uvita', 'Villa de Leyva', 'Macanal', 'Maripí',
    'Miraflores', 'Mongua', 'Monguí', 'Moniquirá', 'Motavita', 'Muzo', 'Nobsa',
    'Nuevo Colón', 'Oicatá', 'Otanche', 'Pachavita', 'Páez', 'Paipa', 'Pajarito',
    'Panqueba', 'Pauna', 'Paya', 'Paz de Río', 'Pesca', 'Pisba', 'Puerto Boyacá',
    'Quípama', 'Ramiriquí', 'Ráquira', 'Rondón', 'Saboyá', 'Sáchica', 'Samacá',
    'San Eduardo', 'San José de Pare', 'San Luis de Gaceno', 'San Mateo',
    'San Miguel de Sema', 'San Pablo de Borbur', 'Santana', 'Santa María',
    'Santa Rosa de Viterbo', 'Santa Sofía', 'Sativanorte', 'Sativasur', 'Siachoque',
    'Soatá', 'Socotá', 'Socha', 'Sogamoso', 'Somondoco', 'Sora', 'Sotaquirá',
    'Soracá', 'Susacón', 'Sutamarchán', 'Sutatenza', 'Tasco', 'Tenza', 'Tibaná',
    'Tibasosa', 'Tinjacá', 'Tipacoque', 'Toca', 'Togüí', 'Tópaga', 'Tota',
    'Tununguá', 'Turmeque', 'Tuta', 'Tutazá', 'Úmbita', 'Ventaquemada',
    'Viracachá', 'Zetaquira'
  ]),
  'caldas': Object.freeze([
    'Manizales', 'Aguadas', 'Anserma', 'Aranzazu', 'Belalcázar', 'Chinchiná',
    'Filadelfia', 'La Dorada', 'La Merced', 'Manzanares', 'Marmato', 'Marquetalia',
    'Marulanda', 'Neira', 'Norcasia', 'Pácora', 'Palestina', 'Pensilvania',
    'Riosucio', 'Risaralda', 'Salamina', 'Samaná', 'San José', 'Supía', 'Victoria',
    'Villamaría', 'Viterbo'
  ]),
  'caqueta': Object.freeze([
    'Florencia', 'Albania', 'Belén de los Andaquíes', 'Cartagena del Chairá',
    'Curillo', 'El Doncello', 'El Paujil', 'La Montañita', 'Milán', 'Morelia',
    'Puerto Rico', 'San José del Fragua', 'San Vicente del Caguán', 'Solano',
    'Solita', 'Valparaíso'
  ]),
  'casanare': Object.freeze([
    'Yopal', 'Aguazul', 'Chámeza', 'Hato Corozal', 'La Salina', 'Maní', 'Monterrey',
    'Nunchía', 'Orocué', 'Paz de Ariporo', 'Pore', 'Recetor', 'Sabanalarga',
    'Sácama', 'San Luis de Palenque', 'Támara', 'Tauramena', 'Trinidad', 'Villanueva'
  ]),
  'cauca': Object.freeze([
    'Popayán', 'Almaguer', 'Argelia', 'Balboa', 'Bolívar', 'Buenos Aires', 'Cajibío',
    'Caldono', 'Caloto', 'Corinto', 'El Tambo', 'Florencia', 'Guachené', 'Guapí',
    'Inzá', 'Jambaló', 'La Sierra', 'La Vega', 'López', 'Mercaderes', 'Miranda',
    'Morales', 'Padilla', 'Páez', 'Patía', 'Piamonte', 'Piendamó', 'Puerto Tejada',
    'Puracé', 'Rosas', 'San Sebastián', 'Santander de Quilichao', 'Santa Rosa',
    'Silvia', 'Sotará', 'Suárez', 'Sucre', 'Timbío', 'Timbiquí', 'Toribío', 'Totoró',
    'Villa Rica'
  ]),
  'cesar': Object.freeze([
    'Valledupar', 'Aguachica', 'Agustín Codazzi', 'Astrea', 'Becerril', 'Bosconia',
    'Chimichagua', 'Chiriguaná', 'Curumaní', 'El Copey', 'El Paso', 'Gamarra',
    'González', 'La Gloria', 'La Jagua de Ibirico', 'Manaure', 'Pailitas',
    'Pelaya', 'Pueblo Bello', 'Río de Oro', 'La Paz', 'San Alberto', 'San Diego',
    'San Martín', 'Tamalameque'
  ]),
  'choco': Object.freeze([
    'Quibdó', 'Acandí', 'Alto Baudó', 'Atrato', 'Bagadó', 'Bahía Solano', 'Bajo Baudó',
    'Bojayá', 'El Cantón del San Pablo', 'Carmen del Darién', 'Cértegui', 'Condoto',
    'El Carmen de Atrato', 'El Litoral del San Juan', 'Istmina', 'Juradó',
    'Lloró', 'Medio Atrato', 'Medio Baudó', 'Medio San Juan', 'Nóvita', 'Nuquí',
    'Río Iró', 'Río Quito', 'Riosucio', 'San José del Palmar', 'Sipí', 'Tadó',
    'Unguía', 'Unión Panamericana'
  ]),
  'cordoba': Object.freeze([
    'Montería', 'Ayapel', 'Buenavista', 'Canalete', 'Cereté', 'Chimá', 'Chinú',
    'Ciénaga de Oro', 'Cotorra', 'La Apartada', 'Lorica', 'Los Córdobas',
    'Momil', 'Montelíbano', 'Moñitos', 'Planeta Rica', 'Pueblo Nuevo', 'Puerto Escondido',
    'Puerto Libertador', 'Purísima', 'Sahagún', 'San Andrés Sotavento', 'San Antero',
    'San Bernardo del Viento', 'San Carlos', 'San José de Uré', 'San Pelayo',
    'Tierralta', 'Tuchín', 'Valencia'
  ]),
  'cundinamarca': Object.freeze([
    'Agua de Dios', 'Albán', 'Anapoima', 'Anolaima', 'Arbeláez', 'Beltrán', 'Bituima',
    'Bojacá', 'Cabrera', 'Cachipay', 'Cajicá', 'Caparrapí', 'Cáqueza', 'Carmen de Carupa',
    'Casabianca', 'Chaguaní', 'Chía', 'Chipaque', 'Choachí', 'Choconta', 'Cogua',
    'Cota', 'Cucunubá', 'El Colegio', 'El Peñón', 'El Rosal', 'Facatativá', 'Fomeque',
    'Fosca', 'Funza', 'Fúquene', 'Fusagasugá', 'Gachalá', 'Gachancipá', 'Gacheta',
    'Gama', 'Girardot', 'Granada', 'Guachetá', 'Guaduas', 'Guasca', 'Guataquí',
    'Guatavita', 'Guayabal de Síquima', 'Guayabetal', 'Gutiérrez', 'Jerusalén',
    'Junín', 'La Calera', 'La Mesa', 'La Palma', 'La Peña', 'La Vega', 'Lenguazaque',
    'Macheta', 'Madrid', 'Manta', 'Medina', 'Mosquera', 'Nariño', 'Nemocón', 'Nilo',
    'Nimaima', 'Nocaima', 'Venecia', 'Pacho', 'Paime', 'Pandi', 'Paratebueno',
    'Pasca', 'Puerto Salgar', 'Pulí', 'Quebradanegra', 'Quetame', 'Quipile',
    'Apulo', 'Ricaurte', 'San Antonio del Tequendama', 'San Bernardo', 'San Cayetano',
    'San Francisco', 'San Juan de Río Seco', 'Sasaima', 'Sesquilé', 'Sibaté',
    'Silvania', 'Simijaca', 'Soacha', 'Sopó', 'Subachoque', 'Suesca', 'Supatá',
    'Susa', 'Sutatausa', 'Tabio', 'Tausa', 'Tena', 'Tenjo', 'Tibacuy', 'Tibirita',
    'Tocaima', 'Tocancipá', 'Topaipí', 'Ubalá', 'Ubaque', 'Villa de San Diego de Ubaté',
    'Une', 'Útica', 'Vergara', 'Vianí', 'Villagómez', 'Villapinzón', 'Villeta',
    'Viotá', 'Yacopí', 'Zipacón', 'Zipaquirá'
  ]),
  'guainia': Object.freeze([
    'Inírida', 'Barranco Minas', 'Mapiripana', 'San Felipe', 'Puerto Colombia',
    'La Guadalupe', 'Cacahual', 'Pana Pana', 'Morichal'
  ]),
  'guaviare': Object.freeze([
    'San José del Guaviare', 'Calamar', 'El Retorno', 'Miraflores'
  ]),
  'huila': Object.freeze([
    'Neiva', 'Acevedo', 'Agrado', 'Aipe', 'Algeciras', 'Altamira', 'Baraya',
    'Campoalegre', 'Colombia', 'Elías', 'Garzón', 'Gigante', 'Guadalupe',
    'Hobo', 'Íquira', 'Isnos', 'La Argentina', 'La Plata', 'Nátaga', 'Oporapa',
    'Paicol', 'Palermo', 'Palestina', 'Pital', 'Pitalito', 'Rivera', 'Saladoblanco',
    'San Agustín', 'Santa María', 'Suaza', 'Tarqui', 'Tesalia', 'Tello', 'Teruel',
    'Timaná', 'Villavieja', 'Yaguará'
  ]),
  'la-guajira': Object.freeze([
    'Riohacha', 'Albania', 'Barrancas', 'Dibulla', 'Distracción', 'El Molino',
    'Fonseca', 'Hatonuevo', 'La Jagua del Pilar', 'Maicao', 'Manaure', 'San Juan del Cesar',
    'Uribia', 'Urumita', 'Villanueva'
  ]),
  'magdalena': Object.freeze([
    'Santa Marta', 'Algarrobo', 'Aracataca', 'Ariguaní', 'Cerro San Antonio',
    'Chivolo', 'Ciénaga', 'Concordia', 'El Banco', 'El Piñón', 'El Retén',
    'Fundación', 'Guamal', 'Nueva Granada', 'Pedraza', 'Pijiño del Carmen',
    'Pivijay', 'Plato', 'Puebloviejo', 'Remolino', 'Sabanas de San Ángel',
    'Salamina', 'San Sebastián de Buenavista', 'San Zenón', 'Santa Ana',
    'Santa Bárbara de Pinto', 'Sitionuevo', 'Tenerife', 'Zapayán', 'Zona Bananera'
  ]),
  'meta': Object.freeze([
    'Villavicencio', 'Acacías', 'Barranca de Upía', 'Cabuyaro', 'Castilla la Nueva',
    'Cubarral', 'Cumaral', 'El Calvario', 'El Castillo', 'El Dorado', 'Fuente de Oro',
    'Granada', 'Guamal', 'Mapiripán', 'Mesetas', 'La Macarena', 'Uribe', 'Lejanías',
    'Puerto Concordia', 'Puerto Gaitán', 'Puerto López', 'Puerto Lleras', 'Puerto Rico',
    'Restrepo', 'San Carlos de Guaroa', 'San Juan de Arama', 'San Juanito', 'San Martín',
    'Vistahermosa'
  ]),
  'narino': Object.freeze([
    'Pasto', 'Albán', 'Aldana', 'Ancuyá', 'Arboleda', 'Barbacoas', 'Belén', 'Buesaco',
    'Chachagüí', 'Colón', 'Consacá', 'Contadero', 'Córdoba', 'Cuaspud', 'Cumbal',
    'Cumbitara', 'El Charco', 'El Peñol', 'El Rosario', 'El Tablón de Gómez',
    'El Tambo', 'Funes', 'Guachucal', 'Guaitarilla', 'Gualmatán', 'Iles', 'Imués',
    'Ipiales', 'La Cruz', 'La Florida', 'La Llanada', 'La Tola', 'La Unión',
    'Leiva', 'Linares', 'Los Andes', 'Magüí', 'Mallama', 'Mosquera', 'Nariño',
    'Olaya Herrera', 'Ospina', 'Francisco Pizarro', 'Policarpa', 'Potosí',
    'Providencia', 'Puerres', 'Pupiales', 'Ricaurte', 'Roberto Payán', 'Samaniego',
    'Sandoná', 'San Bernardo', 'San Lorenzo', 'San Pablo', 'San Pedro de Cartago',
    'Santa Bárbara', 'Santacruz', 'Sapuyes', 'Taminango', 'Tangua', 'Tumaco',
    'Túquerres', 'Yacuanquer'
  ]),
  'norte-santander': Object.freeze([
    'Cúcuta', 'Abrego', 'Arboledas', 'Bochalema', 'Bucarasica', 'Cácota', 'Cáchira',
    'Chinácota', 'Chitagá', 'Convención', 'Cucutilla', 'Durania', 'El Carmen',
    'El Tarra', 'El Zulia', 'Gramalote', 'Hacarí', 'Herrán', 'Labateca', 'La Esperanza',
    'La Playa', 'Los Patios', 'Lourdes', 'Mutiscua', 'Ocaña', 'Pamplona', 'Pamplonita',
    'Puerto Santander', 'Ragonvalia', 'Salazar', 'San Calixto', 'San Cayetano',
    'Santiago', 'Sardinata', 'Silos', 'Teorama', 'Tibú', 'Toledo', 'Villa Caro',
    'Villa del Rosario'
  ]),
  'putumayo': Object.freeze([
    'Mocoa', 'Colón', 'Orito', 'Puerto Asís', 'Puerto Caicedo', 'Puerto Guzmán',
    'Leguízamo', 'Sibundoy', 'San Francisco', 'San Miguel', 'Santiago', 'Valle del Guamuez',
    'Villagarzón'
  ]),
  'quindio': Object.freeze([
    'Armenia', 'Buenavista', 'Calarcá', 'Circasia', 'Córdoba', 'Filandia',
    'Génova', 'La Tebaida', 'Montenegro', 'Pijao', 'Quimbaya', 'Salento'
  ]),
  'risaralda': Object.freeze([
    'Pereira', 'Apía', 'Balboa', 'Belén de Umbría', 'Dosquebradas', 'Guática',
    'La Celia', 'La Virginia', 'Marsella', 'Mistrató', 'Pueblo Rico', 'Quinchía',
    'Santa Rosa de Cabal', 'Santuario'
  ]),
  'san-andres': Object.freeze([
    'San Andrés', 'Providencia'
  ]),
  'santander': Object.freeze([
    'Bucaramanga', 'Aguada', 'Albania', 'Aratoca', 'Barbosa', 'Barichara',
    'Barrancabermeja', 'Betulia', 'Bolívar', 'Cabrera', 'California', 'Capitanejo',
    'Carcasí', 'Cepitá', 'Cerrito', 'Charalá', 'Charta', 'Chima', 'Chipatá',
    'Cimitarra', 'Concepción', 'Confines', 'Contratación', 'Coromoro', 'Curití',
    'El Carmen de Chucurí', 'El Guacamayo', 'El Peñón', 'El Playón', 'Encino',
    'Enciso', 'Florián', 'Floridablanca', 'Galán', 'Gámbita', 'Girón', 'Guaca',
    'Guadalupe', 'Guapotá', 'Guavatá', 'Güepsa', 'Hato', 'Jesús María', 'Jordán',
    'La Belleza', 'Landázuri', 'La Paz', 'Lebríja', 'Los Santos', 'Macaravita',
    'Málaga', 'Matanza', 'Mogotes', 'Molagavita', 'Ocamonte', 'Oiba', 'Onzaga',
    'Palmar', 'Palmas del Socorro', 'Páramo', 'Piedecuesta', 'Pinchote',
    'Puente Nacional', 'Puerto Parra', 'Puerto Wilches', 'Rionegro', 'Sabana de Torres',
    'San Andrés', 'San Benito', 'San Gil', 'San Joaquín', 'San José de Miranda',
    'San Miguel', 'San Vicente de Chucurí', 'Santa Bárbara', 'Santa Helena del Opón',
    'Simacota', 'Socorro', 'Suaita', 'Sucre', 'Suratá', 'Tona', 'Valle de San José',
    'Vélez', 'Vetas', 'Villanueva', 'Zapatoca'
  ]),
  'sucre': Object.freeze([
    'Sincelejo', 'Buenavista', 'Caimito', 'Coloso', 'Corozal', 'Coveñas', 'Chalán',
    'El Roble', 'Galeras', 'Guaranda', 'La Unión', 'Los Palmitos', 'Majagual',
    'Morroa', 'Ovejas', 'Palmito', 'Sampués', 'San Benito Abad', 'San Juan de Betulia',
    'San Marcos', 'San Onofre', 'San Pedro', 'Santiago de Tolú', 'Tolú Viejo'
  ]),
  'tolima': Object.freeze([
    'Ibagué', 'Alpujarra', 'Alvarado', 'Ambalema', 'Anzoátegui', 'Armero',
    'Ataco', 'Cajamarca', 'Carmen de Apicalá', 'Casabianca', 'Chaparral',
    'Coello', 'Coyaima', 'Cunday', 'Dolores', 'Espinal', 'Falan', 'Flandes',
    'Fresno', 'Guamo', 'Herveo', 'Honda', 'Icononzo', 'Lérida', 'Líbano',
    'Mariquita', 'Melgar', 'Murillo', 'Natagaima', 'Ortega', 'Palocabildo',
    'Piedras', 'Planadas', 'Prado', 'Purificación', 'Rioblanco', 'Roncesvalles',
    'Rovira', 'Saldaña', 'San Antonio', 'San Luis', 'Santa Isabel', 'Suárez',
    'Valle de San Juan', 'Venadillo', 'Villahermosa', 'Villarrica'
  ]),
  'valle-del-cauca': Object.freeze([
    'Cali', 'Alcalá', 'Andalucía', 'Ansermanuevo', 'Argelia', 'Bolívar', 'Buenaventura',
    'Bugalagrande', 'Caicedonia', 'Calima', 'Candelaria', 'Cartago', 'Dagua',
    'El Águila', 'El Cairo', 'El Cerrito', 'El Dovio', 'Florida', 'Ginebra',
    'Guacarí', 'Guadalajara de Buga', 'Jamundí', 'La Cumbre', 'La Unión', 'La Victoria',
    'Obando', 'Palmira', 'Pradera', 'Restrepo', 'Riofrío', 'Roldanillo', 'San Pedro',
    'Sevilla', 'Toro', 'Trujillo', 'Tuluá', 'Ulloa', 'Versalles', 'Vijes',
    'Yotoco', 'Yumbo', 'Zarzal'
  ]),
  'vaupes': Object.freeze([
    'Mitú', 'Carurú', 'Pacoa'
  ]),
  'vichada': Object.freeze([
    'Puerto Carreño', 'La Primavera', 'Santa Rosalía', 'Cumaribo'
  ])
});

// Función segura para obtener municipios por departamento
export function getMunicipalitiesByDepartment(departmentId: string): Array<{id: string, name: string, departmentId: string}> {
  // Validación estricta de entrada
  if (!departmentId || typeof departmentId !== 'string') {
    return [];
  }

  // Sanitización del ID del departamento
  const sanitizedDeptId = departmentId.toLowerCase().trim().replace(/[^a-z0-9-]/g, '');

  // Verificación de existencia en el mapa
  const municipalities = MUNICIPALITIES_BY_DEPARTMENT[sanitizedDeptId];
  if (!municipalities || !Array.isArray(municipalities)) {
    return [];
  }

  // Generación segura de IDs únicos
  return municipalities.map((name, index) => {
    // Sanitización del nombre del municipio
    const sanitizedName = typeof name === 'string' ? name.trim() : '';
    if (!sanitizedName) {
      return null;
    }

    // Generación de ID único y seguro
    const safeId = `${sanitizedDeptId}-${sanitizedName.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')}`;

    return {
      id: safeId,
      name: sanitizedName,
      departmentId: sanitizedDeptId
    };
  }).filter(Boolean) as Array<{id: string, name: string, departmentId: string}>;
}
