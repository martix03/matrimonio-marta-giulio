import React, { useState, useEffect } from 'react';
import { Bus, Car, Plus, MessageCircle, Clock, MapPin, Users, CheckCircle2 } from 'lucide-react';
import { CarpoolingPost } from '../../types';
import { weddingApi } from '../../services/supabase';
import { useSettings } from '../../contexts/SettingsContext';

export const LogisticsHub: React.FC = () => {
  const { settings } = useSettings();
  const [carpoolingPosts, setCarpoolingPosts] = useState<CarpoolingPost[]>([]);
  const [busInfo, setBusInfo] = useState<{ total: number; reserved: number }>({ total: 50, reserved: 14 });
  const [showOfferForm, setShowOfferForm] = useState<boolean>(false);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

  // Form state for offering a ride
  const [driverName, setDriverName] = useState('');
  const [phone, setPhone] = useState('');
  const [departureLocation, setDepartureLocation] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [seats, setSeats] = useState<number>(3);

  useEffect(() => {
    async function loadData() {
      const posts = await weddingApi.getCarpooling();
      setCarpoolingPosts(posts);
      const bInfo = await weddingApi.getBusSeatsInfo();
      setBusInfo(bInfo);
    }
    loadData();
  }, []);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!driverName.trim() || !phone.trim() || !departureLocation.trim()) return;

    const newPost = await weddingApi.addCarpooling({
      driver_name: driverName.trim(),
      phone_number: phone.trim(),
      departure_location: departureLocation.trim(),
      departure_time: departureTime.trim() || 'Sabato mattina',
      total_seats: Number(seats),
      available_seats: Number(seats),
    });

    setCarpoolingPosts(prev => [newPost, ...prev]);
    setFormSubmitted(true);
    setTimeout(() => {
      setShowOfferForm(false);
      setFormSubmitted(false);
      setDriverName('');
      setPhone('');
      setDepartureLocation('');
      setDepartureTime('');
    }, 1500);
  };

  const seatsAvailable = Math.max(0, busInfo.total - busInfo.reserved);
  const busPercentage = Math.min(100, Math.round((busInfo.reserved / busInfo.total) * 100));

  return (
    <section id="logistica" className="py-16 sm:py-24 bg-paper/60 border-y border-blush/20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-widest text-burgundy/60 font-semibold">
            Trasporti &amp; Navette
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-burgundy mt-1">
            Hub Logistico
          </h2>
          <div className="w-12 h-1 bg-blush rounded-full mx-auto my-3" />
          <p className="text-xs sm:text-sm text-burgundy/70">
            Organizza il tuo viaggio e rientra in totale serenità e sicurezza.
          </p>
        </div>

        <div className={settings.features?.enableShuttleBuses ? "grid grid-cols-1 lg:grid-cols-12 gap-8" : "max-w-3xl mx-auto space-y-4"}>
          {/* Left Column: Shuttle Bus Counter & Details (5 cols) - Guarded by enableShuttleBuses flag */}
          {settings.features?.enableShuttleBuses && (
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 sm:p-8 rounded-4xl bg-paper shadow-wedding border border-blush/30">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-blush-soft flex items-center justify-center text-burgundy">
                    <Bus className="w-5 h-5 text-burgundy" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl text-burgundy font-medium">
                      Bus Navetta del Rientro
                    </h3>
                    <span className="text-[11px] text-burgundy/60 uppercase tracking-wider font-semibold">
                      Cascina Ranverso ➔ Torino
                    </span>
                  </div>
                </div>

                <p className="text-xs text-burgundy/80 leading-relaxed mb-6">
                  Per permettervi di brindare e festeggiare senza pensieri, abbiamo predisposto un
                  servizio navetta gratuito dedicato per il rientro a Torino.
                </p>

                {/* Progress Bar of Available Seats */}
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-burgundy">Posti prenotati</span>
                    <span className="text-burgundy">
                      {busInfo.reserved} / {busInfo.total} ({seatsAvailable} rimasti)
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-cream overflow-hidden border border-blush/30 p-0.5">
                    <div
                      className="h-full rounded-full bg-burgundy transition-all duration-500"
                      style={{ width: `${busPercentage}%` }}
                    />
                  </div>
                  <div className="text-[11px] text-burgundy/60 text-right">
                    {seatsAvailable > 10 ? 'Disponibilità regolare' : 'Posti in esaurimento'}
                  </div>
                </div>

                {/* Schedule badges */}
                <div className="space-y-3 pt-3 border-t border-blush/20">
                  <div className="text-xs font-semibold uppercase tracking-wider text-burgundy/70">
                    Orari di Partenza Navetta:
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 rounded-2xl bg-cream border border-blush/30 text-center">
                      <span className="text-[10px] uppercase tracking-wider text-burgundy/60 block font-semibold">
                        Prima Corsa
                      </span>
                      <span className="font-serif text-lg font-bold text-burgundy">
                        Ore 01:30
                      </span>
                    </div>
                    <div className="p-3 rounded-2xl bg-cream border border-blush/30 text-center">
                      <span className="text-[10px] uppercase tracking-wider text-burgundy/60 block font-semibold">
                        Seconda Corsa
                      </span>
                      <span className="font-serif text-lg font-bold text-burgundy">
                        Ore 03:00
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Right Column / Centered: Carpooling Bulletin Board */}
          <div className={settings.features?.enableShuttleBuses ? "lg:col-span-7 space-y-4" : "w-full space-y-4"}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Car className="w-5 h-5 text-burgundy" />
                <h3 className="font-serif text-xl sm:text-2xl text-burgundy font-medium">
                  Bacheca Carpooling
                </h3>
              </div>
              <button
                onClick={() => setShowOfferForm(!showOfferForm)}
                className="px-4 py-2 rounded-full bg-burgundy hover:bg-burgundy-light text-paper text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{showOfferForm ? 'Chiudi Form' : 'Offri un Passaggio'}</span>
              </button>
            </div>

            {/* Offer Ride Form */}
            {showOfferForm && (
              <form
                onSubmit={handleCreatePost}
                className="p-6 rounded-3xl bg-paper shadow-wedding border border-blush/40 animate-fade-in space-y-4 text-xs"
              >
                <div className="font-serif text-base text-burgundy font-semibold">
                  Offri posti in auto ad altri invitati
                </div>

                {formSubmitted ? (
                  <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Grazie! Il tuo passaggio è stato pubblicato in bacheca.</span>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold uppercase text-burgundy/80 mb-1">
                          Il tuo Nome
                        </label>
                        <input
                          type="text"
                          required
                          value={driverName}
                          onChange={e => setDriverName(e.target.value)}
                          placeholder="es. Matteo Colombo"
                          className="w-full px-3 py-2 rounded-xl border border-blush/50 text-burgundy bg-cream/40 outline-none focus:border-burgundy"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold uppercase text-burgundy/80 mb-1">
                          Telefono / WhatsApp
                        </label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={e => setPhone(e.target.value)}
                          placeholder="es. +39 340 1234567"
                          className="w-full px-3 py-2 rounded-xl border border-blush/50 text-burgundy bg-cream/40 outline-none focus:border-burgundy"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold uppercase text-burgundy/80 mb-1">
                          Città o Punto di Partenza
                        </label>
                        <input
                          type="text"
                          required
                          value={departureLocation}
                          onChange={e => setDepartureLocation(e.target.value)}
                          placeholder="es. Milano Centrale, Bologna..."
                          className="w-full px-3 py-2 rounded-xl border border-blush/50 text-burgundy bg-cream/40 outline-none focus:border-burgundy"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold uppercase text-burgundy/80 mb-1">
                          Posti disponibili
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="8"
                          value={seats}
                          onChange={e => setSeats(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl border border-blush/50 text-burgundy bg-cream/40 outline-none focus:border-burgundy"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowOfferForm(false)}
                        className="px-4 py-2 rounded-full border border-blush/40 text-burgundy hover:bg-cream"
                      >
                        Annulla
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 rounded-full bg-burgundy hover:bg-burgundy-light text-paper font-semibold shadow-sm"
                      >
                        Pubblica Passaggio
                      </button>
                    </div>
                  </>
                )}
              </form>
            )}

            {/* List of Carpooling Posts */}
            <div className="space-y-3">
              {carpoolingPosts.map(post => {
                const waText = encodeURIComponent(
                  `Ciao ${post.driver_name}! Ho visto il tuo passaggio per il matrimonio di Marta e Giulio da ${post.departure_location}. Hai ancora un posto disponibile?`
                );
                const waUrl = `https://wa.me/${post.phone_number.replace(/[^0-9]/g, '')}?text=${waText}`;

                return (
                  <div
                    key={post.id}
                    className="p-5 rounded-3xl bg-paper shadow-wedding border border-blush/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-blush transition-all"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-serif text-base font-semibold text-burgundy">
                          {post.driver_name}
                        </span>
                        <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-cream text-burgundy border border-blush/30 font-medium">
                          {post.available_seats} {post.available_seats === 1 ? 'posto' : 'posti'}
                        </span>
                      </div>
                      <div className="text-xs text-burgundy/80 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-blush" />
                        <span>Partenza: <strong>{post.departure_location}</strong></span>
                      </div>
                      <div className="text-[11px] text-burgundy/60 flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-burgundy/40" />
                        <span>Orario: {post.departure_time}</span>
                      </div>
                    </div>

                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-paper text-xs font-semibold tracking-wider transition-all shadow-sm shrink-0"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Scrivi su WhatsApp</span>
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
