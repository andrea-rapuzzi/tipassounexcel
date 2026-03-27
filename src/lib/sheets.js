const SHEETS_CSV_URL = import.meta.env.PUBLIC_SHEETS_CSV_URL;

export async function getTrips() {
  if (!SHEETS_CSV_URL) {
    return getSampleData();
  }

  try {
    const res = await fetch(SHEETS_CSV_URL);
    const text = await res.text();
    return parseCSV(text);
  } catch (e) {
    console.error('Impossibile caricare i viaggi dal foglio Google:', e);
    return getSampleData();
  }
}

export async function getTripBySlug(slug) {
  const trips = await getTrips();
  return trips.find((t) => t.slug === slug) || null;
}

function parseCSV(text) {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = parseCSVLine(lines[0]).map((h) =>
    h.trim().toLowerCase().replace(/\s+/g, '_')
  );

  return lines
    .slice(1)
    .map((line) => {
      const values = parseCSVLine(line);
      const obj = {};
      headers.forEach((h, i) => {
        obj[h] = values[i]?.trim().replace(/^"|"$/g, '') || '';
      });
      return obj;
    })
    .filter((t) => t.slug && t.destinazione);
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    if (line[i] === '"') {
      inQuotes = !inQuotes;
    } else if (line[i] === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += line[i];
    }
  }
  result.push(current);
  return result;
}

function getSampleData() {
  return [
    {
      slug: 'portogallo-2023',
      destinazione: 'Portogallo',
      tipo: 'Città',
      persone: '4',
      costo: '2800',
      titolo: 'Portogallo 2023',
      descrizione:
        'Un viaggio alla scoperta di Lisbona e Porto, tra pastéis de nata, tram storici e tramonti sull\'Atlantico.',
      link_sheet: '',
      link_excel: '',
      data: '2023-09-15',
    },
    {
      slug: 'dolomiti-estate-2023',
      destinazione: 'Dolomiti',
      tipo: 'Montagna',
      persone: '6',
      costo: '3200',
      titolo: 'Dolomiti Estate 2023',
      descrizione:
        'Trekking e rifugi tra le vette più belle delle Alpi italiane. Colazione alle 6 per arrivare in cima prima delle nuvole.',
      link_sheet: '',
      link_excel: '',
      data: '2023-07-20',
    },
    {
      slug: 'sicilia-2022',
      destinazione: 'Sicilia',
      tipo: 'Mare',
      persone: '5',
      costo: '3500',
      titolo: 'Sicilia 2022',
      descrizione:
        'Spiagge cristalline, arancini e templi greci. La Sicilia non delude mai, soprattutto quando si è in 5.',
      link_sheet: '',
      link_excel: '',
      data: '2022-08-01',
    },
    {
      slug: 'amsterdam-2022',
      destinazione: 'Amsterdam',
      tipo: 'Città',
      persone: '3',
      costo: '1900',
      titolo: 'Amsterdam 2022',
      descrizione:
        'Canali, musei e biciclette. Tre giorni intensi in una delle città più vivibili d\'Europa.',
      link_sheet: '',
      link_excel: '',
      data: '2022-04-10',
    },
    {
      slug: 'trentino-inverno-2024',
      destinazione: 'Trentino',
      tipo: 'Montagna',
      persone: '8',
      costo: '4800',
      titolo: 'Trentino Inverno 2024',
      descrizione:
        'Settimana bianca in Val di Fassa. Sci, fondue e partite a carte fino a mezzanotte.',
      link_sheet: '',
      link_excel: '',
      data: '2024-01-15',
    },
    {
      slug: 'puglia-2024',
      destinazione: 'Puglia',
      tipo: 'Mare',
      persone: '4',
      costo: '2200',
      titolo: 'Puglia 2024',
      descrizione:
        'Trulli, orecchiette e mare turchese. Un giro tra Alberobello, Polignano e la Valle d\'Itria.',
      link_sheet: '',
      link_excel: '',
      data: '2024-07-01',
    },
  ];
}
