export const weddingConfig = {
  couple: {
    bride: 'Marta',
    groom: 'Giulio',
    fullName: 'Marta & Giulio',
    hashtag: '#MartaEGiulio2027',
  },
  event: {
    date: '2027-05-29T17:00:00+02:00', // Sabato 29 Maggio 2027 ore 17:00
    displayDate: 'Sabato 29 Maggio 2027',
    city: 'Buttigliera Alta · Torino',
    ceremonyTime: 'Arrivo gradito entro le 16:45',
    receptionTime: 'A seguire, aperitivo, cena e festa nello stesso luogo',
  },
  features: {
    // Flag per gestire la visualizzazione dell'intera sezione Hub Logistico (navette e carpooling)
    enableLogisticsHub: false,
    enableShuttleBuses: false,
    enableCarpooling: false,
  },
  locations: {
    ceremony: {
      name: 'Cascina Ranverso',
      city: 'Buttigliera Alta (TO)',
      address: 'Strada degli Abay 36, 10090 Buttigliera Alta (TO)',
      lat: 45.0707046,
      lng: 7.4514925,
      googleMapsUrl: 'https://maps.google.com/?q=Cascina+Ranverso+Strada+degli+Abay+36+Buttigliera+Alta',
      appleMapsUrl: 'https://maps.apple.com/?q=Cascina+Ranverso+Strada+degli+Abay+36+Buttigliera+Alta',
      wazeUrl: 'https://waze.com/ul?ll=45.0707046,7.4514925&navigate=yes',
    },
    reception: {
      name: 'Cascina Ranverso',
      city: 'Buttigliera Alta (TO)',
      address: 'Strada degli Abay 36, 10090 Buttigliera Alta (TO)',
      lat: 45.0707046,
      lng: 7.4514925,
      googleMapsUrl: 'https://maps.google.com/?q=Cascina+Ranverso+Strada+degli+Abay+36+Buttigliera+Alta',
      appleMapsUrl: 'https://maps.apple.com/?q=Cascina+Ranverso+Strada+degli+Abay+36+Buttigliera+Alta',
      wazeUrl: 'https://waze.com/ul?ll=45.0707046,7.4514925&navigate=yes',
    },
  },
  logistics: {
    busSeatsTotal: 50,
    departurePointCeremony: 'Punto di ritrovo a Torino',
    departurePointReturn: 'Cascina Ranverso per rientro a Torino',
    returnTimes: ['01:30', '03:00'],
  },
  registry: {
    bank: 'Intesa Sanpaolo',
    iban: 'IT52B0623001132000047471545',
    holder: 'Spalla Marta, Palomba Giulio',
    bic: 'BCITITMM',
  },
  contacts: {
    marta: {
      name: 'Marta',
      phone: '346 612 1512',
      rawPhone: '+393466121512',
      email: 'spalla.marta@gmail.com',
    },
    giulio: {
      name: 'Giulio',
      phone: '349 248 1715',
      rawPhone: '+393492481715',
      email: 'giulio.palomba@gmail.com',
    },
    whatsappBride: '+393466121512',
    whatsappGroom: '+393492481715',
  }
};
