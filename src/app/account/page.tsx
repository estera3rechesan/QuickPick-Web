/**
 * AccountPage
 * 
 * Acest component afiseaza pagina de cont a utilizatorului in QuickPick.
 * Functii principale:
 *  - Afiseaza si gestioneaza locatiile favorite si istoricul de cautari AI pentru utilizatorul logat.
 *  - Permite editarea emailului si schimbarea parolei.
 *  - Ofera optiuni pentru logout si afiseaza instructiuni pentru stergerea contului.
 *  - Foloseste Supabase pentru autentificare si acces la baza de date (favorites, search_history).
 *  - Navigarea intre sectiuni se face cu scroll smooth folosind referinte.
 *  - Afiseaza mesaje de eroare sau succes pentru actiunile utilizatorului.
 * Elemente cheie:
 *  - Integrare Supabase pentru user si date personale.
 *  - Folosire useState si useEffect pentru gestionarea starii si fetch date.
 *  - Componente UI custom: LocationCard.
 *  - Butoane pentru stergere favorite, istoric, logout, editare email/parola.
 *  - Modal pentru instructiuni stergere cont.
 */

"use client"; // Activeaza functionalitatea client-side in Next.js

import { useEffect, useState, useRef } from "react"; // Importa hooks pentru stare si referinte
import { useRouter } from "next/navigation"; // Hook pentru navigare programatica
import { createClient } from "@/utils/supabase/client"; // Functie pentru initializare client Supabase
import LocationCard from "@/components/LocationCard"; // Component pentru afisarea unei locatii
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Iconite pentru afisarea/ascunderea parolei

// Tip pentru un obiect Favorite
interface Favorite {
  id: number; // ID unic in baza de date
  place_id: string; // ID-ul locatiei din Google Places
  name: string; // Numele locatiei
  address: string; // Adresa locatiei
  photo_reference?: string; // Referinta pentru poza locatiei (optional)
  google_maps_url?: string; // Link Google Maps (optional)
  website?: string; // Site-ul oficial (optional)
  created_at: string; // Data adaugarii la favorite
}

// Tip pentru un obiect din istoricul de cautari
interface SearchHistory {
  id: number; // ID unic
  query: string; // Textul cautarii AI
  created_at: string; // Data cautarii
}

export default function AccountPage() {
  // State pentru favorite
  const [favorites, setFavorites] = useState<Favorite[]>([]); // Lista locatii favorite
  const [history, setHistory] = useState<SearchHistory[]>([]); // Lista istoric cautari
  const [loading, setLoading] = useState(true); // Indicator incarcare date
  const [errorMsg, setErrorMsg] = useState<string | null>(null); // Mesaj de eroare

  // State pentru editare cont
  const [email, setEmail] = useState(""); // Emailul curent al utilizatorului
  const [newPassword, setNewPassword] = useState(""); // Noua parola introdusa
  const [infoMsg, setInfoMsg] = useState<string | null>(null); // Mesaj informativ (succes)
  const [showDeleteInfo, setShowDeleteInfo] = useState(false); // Modal pentru stergere cont

  const supabase = createClient(); // Creeaza client Supabase
  const router = useRouter(); // Hook pentru navigare

  // Referinte pentru scroll la sectiuni
  const favRef = useRef<HTMLDivElement | null>(null); // Ref pentru sectiunea favorite
  const histRef = useRef<HTMLDivElement | null>(null); // Ref pentru sectiunea istoric
  const setariRef = useRef<HTMLDivElement | null>(null); // Ref pentru sectiunea setari
  const [showPassword, setShowPassword] = useState(false); // Arata/ascunde parola

  // Efect pentru fetch date la montare component
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Porneste indicator incarcare
      setErrorMsg(null); // Reseteaza mesaj eroare
      setInfoMsg(null); // Reseteaza mesaj informativ
      const { data: { user } } = await supabase.auth.getUser(); // Ia userul curent din Supabase
      if (!user) { // Daca nu e logat
        setErrorMsg("Trebuie sa fii autentificat pentru a vedea favoritele si istoricul."); // Mesaj eroare
        setLoading(false); // Opreste loading
        return; // Iesire functie
      }
      setEmail(user.email || ""); // Seteaza emailul userului
      // Fetch favorite
      const { data: favs, error: favErr } = await supabase
        .from("favorites")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }); // Ia favoritele userului
      if (favErr) setErrorMsg(favErr.message); // Daca eroare, seteaza mesaj
      else setFavorites(favs || []); // Altfel, seteaza favoritele
      // Fetch istoric
      const { data: hist, error: histErr } = await supabase
        .from("search_history")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20); // Ia ultimele 20 cautari
      if (histErr) setErrorMsg(histErr.message); // Daca eroare, seteaza mesaj
      else setHistory(hist || []); // Altfel, seteaza istoric
      setLoading(false); // Opreste loading
    };
    fetchData(); // Apeleaza functia la montare
    // eslint-disable-next-line
  }, []);

  // Sterge o locatie favorita dupa id
  async function handleDeleteFavorite(id: number) {
    const { error } = await supabase.from("favorites").delete().eq("id", id); // Sterge din baza de date
    if (!error) setFavorites(favorites.filter(fav => fav.id !== id)); // Daca succes, sterge din state
    else alert("Eroare la stergere: " + error.message); // Altfel, afiseaza eroare
  }

  // Sterge o intrare din istoric dupa id
  async function handleDeleteHistory(id: number) {
    const { error } = await supabase.from("search_history").delete().eq("id", id); // Sterge din baza de date
    if (!error) setHistory(history.filter(h => h.id !== id)); // Daca succes, sterge din state
    else alert("Eroare la stergere: " + error.message); // Altfel, afiseaza eroare
  }

  // Logout utilizator
  const handleLogout = async () => {
    await supabase.auth.signOut(); // Delogheaza userul
    router.push("/login"); // Redirectioneaza la login
  };

  // Actualizeaza emailul userului
  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault(); // Blocheaza submit default
    setInfoMsg(null); // Reseteaza mesaj informativ
    setErrorMsg(null); // Reseteaza mesaj eroare
    const { error } = await supabase.auth.updateUser({ email }); // Update email in Supabase
    if (error) setErrorMsg(error.message); // Daca eroare, afiseaza mesaj
    else setInfoMsg("Email actualizat! Verifica inboxul pentru confirmare."); // Succes
  };

  // Actualizeaza parola userului
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault(); // Blocheaza submit default
    setInfoMsg(null); // Reseteaza mesaj informativ
    setErrorMsg(null); // Reseteaza mesaj eroare
    const { error } = await supabase.auth.updateUser({ password: newPassword }); // Update parola in Supabase
    if (error) setErrorMsg(error.message); // Daca eroare, afiseaza mesaj
    else setInfoMsg("Parola schimbata cu succes!"); // Succes
    setNewPassword(""); // Reseteaza campul parola
  };

  // Scroll smooth la o sectiune
  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" }); // Scroll smooth la referinta data
  };

  return (
    <>
      {/* Fundal roz pe tot ecranul pentru a elimina marginile negre in dark mode */}
      <div className="fixed inset-0 bg-[#FFECEC] z-0"></div>
      <main className="pt-18 flex flex-col md:flex-row max-w-5xl mx-auto p-4 gap-8 bg-[#FFECEC] text-[#353935] relative z-10">
        {/* MENIU LATERAL */}
        <nav className="md:w-56 flex-shrink-0 mb-6 md:mb-0">
          <ul className="flex md:flex-col gap-4 md:gap-2">
            <li>
              <button
                onClick={() => scrollToSection(favRef)} // Scroll la favorite
                className="w-full text-left px-4 py-2 rounded-lg bg-[#F6F6F6] hover:bg-[#89AC46] hover:text-white transition font-semibold"
              >
                Locatii favorite
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection(histRef)} // Scroll la istoric
                className="w-full text-left px-4 py-2 rounded-lg bg-[#F6F6F6] hover:bg-[#89AC46] hover:text-white transition font-semibold"
              >
                Istoric prompturi AI
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection(setariRef)} // Scroll la setari
                className="w-full text-left px-4 py-2 rounded-lg bg-[#F6F6F6] hover:bg-[#89AC46] hover:text-white transition font-semibold"
              >
                Setari cont
              </button>
            </li>
          </ul>
        </nav>
        {/* CONȚINUT PRINCIPAL */}
        <div className="flex-1">
          {/* Favorite */}
          <div ref={favRef}>
            <h1 className="text-2xl font-bold mb-4">Contul meu</h1>
            <h2 className="text-lg font-semibold mb-2">Locatii favorite</h2>
            {loading && <p>Se incarca...</p>} {/* Afiseaza loading */}
            {errorMsg && <p className="text-red-600">{errorMsg}</p>} {/* Afiseaza eroare */}
            {!loading && !favorites.length && (
              <p>Nu ai locatii favorite salvate.</p> // Mesaj daca nu exista favorite
            )}
            <div className="flex flex-col gap-6">
              {favorites.map(fav => (
                <div key={fav.id} className="relative">
                  <LocationCard
                    place_id={fav.place_id}
                    name={fav.name}
                    address={fav.address}
                    photo_reference={fav.photo_reference}
                    googleMapsUrl={fav.google_maps_url || ""}
                    website={fav.website}
                    showFavorite={false} // Nu afisa inimoara la favorite
                  />
                  <button
                    onClick={() => handleDeleteFavorite(fav.id)} // Sterge favorita
                    className="absolute top-2 right-2 bg-[#FF8787] text-[#353935] hover:bg-[#ffb0b0] px-3 py-1 rounded text-xs font-semibold border border-[#FF8787] transition"
                  >
                    Sterge
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Istoric */}
          <div ref={histRef} className="mt-12">
            <h2 className="text-lg font-semibold mt-8 mb-2">Istoric prompturi AI</h2>
            {!loading && !history.length && (
              <p>Nu ai prompturi recente.</p> // Mesaj daca nu exista istoric
            )}
            <ul className="flex flex-wrap gap-2">
              {history.map(h => (
                <li key={h.id} className="flex items-center bg-[#F6F6F6] rounded-full px-3 py-1 text-sm shadow">
                  <button
                    onClick={() => {
                      window.location.href = `/?query=${encodeURIComponent(h.query)}`; // Reia cautarea
                    }}
                    className="mr-2 text-[#353935] hover:underline bg-transparent border-none cursor-pointer"
                    title="Reia aceasta cautare"
                  >
                    {h.query}
                  </button>
                  <button
                    onClick={() => handleDeleteHistory(h.id)} // Sterge istoric
                    className="ml-1 text-[#FF8787] text-lg bg-transparent border-none cursor-pointer"
                    title="Sterge"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>
          {/* Setari cont */}
          <div ref={setariRef} className="mt-12">
            <h2 className="text-lg font-semibold mb-2">Setari cont</h2>
            {/* Editeaza email */}
            <section className="mb-6">
              <h3 className="font-semibold mb-2">Editeaza email</h3>
              <form onSubmit={handleUpdateEmail} className="flex gap-2 items-center mb-2">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)} // Actualizeaza email
                  className="px-3 py-2 border rounded"
                  placeholder="Email nou"
                  required
                />
                <button type="submit" className="bg-[#89AC46] text-white px-4 py-2 rounded hover:bg-[#6e8f32]">
                  Actualizeaza email
                </button>
              </form>
            </section>
            {/* Schimba parola */}
            <section className="mb-6">
              <h3 className="font-semibold mb-2">Schimba parola</h3>
              <form onSubmit={handleUpdatePassword} className="flex gap-2 items-center mb-2">
                <span className="relative inline-flex">
                  <input
                    type={showPassword ? "text" : "password"} // Arata sau ascunde parola
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)} // Actualizeaza parola
                    className="px-3 py-2 border rounded pr-10"
                    placeholder="Parola noua"
                    required
                    style={{ minWidth: 180 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)} // Toggle vizibilitate parola
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[#353935] bg-transparent border-none cursor-pointer"
                    tabIndex={-1}
                    aria-label={showPassword ? "Ascunde parola" : "Arata parola"}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </span>
                <button type="submit" className="bg-[#89AC46] text-white px-4 py-2 rounded hover:bg-[#6e8f32]">
                  Schimba parola
                </button>
              </form>
            </section>
            {/* Mesaje info/eroare */}
            {infoMsg && <div className="mb-2 text-green-600">{infoMsg}</div>} {/* Mesaj succes */}
            {errorMsg && <div className="mb-2 text-red-600">{errorMsg}</div>} {/* Mesaj eroare */}

            {/* Butoane principale */}
            <div className="flex gap-4 mt-6 mb-6">
              <button
                onClick={handleLogout} // Logout
                className="bg-[#FF8787] text-white px-4 py-2 rounded hover:bg-[#ffb0b0]"
              >
                Deconectare
              </button>
              <button
                onClick={() => setShowDeleteInfo(true)} // Afiseaza modal stergere cont
                className="bg-[#353935] text-white px-4 py-2 rounded hover:bg-[#6e8f32]"
              >
                Sterge contul
              </button>
            </div>
            {/* Modal/alert pentru stergere cont */}
            {showDeleteInfo && (
              <div className="mt-4 p-4 bg-[#FFECEC] border border-[#FF8787] rounded">
                <p className="mb-2">
                  Pentru stergerea contului, te rugam sa ne contactezi la adresa{" "}
                  <a href="mailto:contact@quickpick.ro" className="underline text-[#FF8787]">
                    contact@quickpick.ro
                  </a>.
                </p>
                <button
                  onClick={() => setShowDeleteInfo(false)} // Inchide modal
                  className="bg-[#FF8787] text-[#353935] px-3 py-1 rounded hover:bg-[#ffb0b0]"
                >
                  Inchide
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
