"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import LocationCard from "@/components/LocationCard";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface Favorite {
  id: number;
  place_id: string;
  name: string;
  address: string;
  photo_reference?: string;
  google_maps_url?: string;
  website?: string;
  created_at: string;
}

interface SearchHistory {
  id: number;
  query: string;
  created_at: string;
}

export default function AccountPage() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [history, setHistory] = useState<SearchHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Pentru secțiunea de editare date cont
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [infoMsg, setInfoMsg] = useState<string | null>(null);
  const [showDeleteInfo, setShowDeleteInfo] = useState(false);

  const supabase = createClient();
  const router = useRouter();

  // Refs pentru scroll la secțiuni
  const favRef = useRef<HTMLDivElement | null>(null);
  const histRef = useRef<HTMLDivElement | null>(null);
  const setariRef = useRef<HTMLDivElement | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setErrorMsg(null);
      setInfoMsg(null);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setErrorMsg("Trebuie să fii autentificat pentru a vedea favoritele și istoricul.");
        setLoading(false);
        return;
      }
      setEmail(user.email || "");
      // Favorite
      const { data: favs, error: favErr } = await supabase
        .from("favorites")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (favErr) setErrorMsg(favErr.message);
      else setFavorites(favs || []);
      // Istoric
      const { data: hist, error: histErr } = await supabase
        .from("search_history")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);
      if (histErr) setErrorMsg(histErr.message);
      else setHistory(hist || []);
      setLoading(false);
    };
    fetchData();
    // eslint-disable-next-line
  }, []);

  async function handleDeleteFavorite(id: number) {
    const { error } = await supabase.from("favorites").delete().eq("id", id);
    if (!error) setFavorites(favorites.filter(fav => fav.id !== id));
    else alert("Eroare la ștergere: " + error.message);
  }

  async function handleDeleteHistory(id: number) {
    const { error } = await supabase.from("search_history").delete().eq("id", id);
    if (!error) setHistory(history.filter(h => h.id !== id));
    else alert("Eroare la ștergere: " + error.message);
  }

  // Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  // Update Email
  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setInfoMsg(null);
    setErrorMsg(null);
    const { error } = await supabase.auth.updateUser({ email });
    if (error) setErrorMsg(error.message);
    else setInfoMsg("Email actualizat! Verifică inboxul pentru confirmare.");
  };

  // Update Password
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setInfoMsg(null);
    setErrorMsg(null);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) setErrorMsg(error.message);
    else setInfoMsg("Parolă schimbată cu succes!");
    setNewPassword("");
  };

  // Scroll la secțiune
  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Wrapper full-screen roz pentru a elimina marginile negre în dark mode */}
      <div className="fixed inset-0 bg-[#FFECEC] z-0"></div>
      <main className="pt-18 flex flex-col md:flex-row max-w-5xl mx-auto p-4 gap-8 bg-[#FFECEC] text-[#353935] relative z-10">
        {/* MENIU LATERAL */}
        <nav className="md:w-56 flex-shrink-0 mb-6 md:mb-0">
          <ul className="flex md:flex-col gap-4 md:gap-2">
            <li>
              <button
                onClick={() => scrollToSection(favRef)}
                className="w-full text-left px-4 py-2 rounded-lg bg-[#F6F6F6] hover:bg-[#89AC46] hover:text-white transition font-semibold"
              >
                Locații favorite
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection(histRef)}
                className="w-full text-left px-4 py-2 rounded-lg bg-[#F6F6F6] hover:bg-[#89AC46] hover:text-white transition font-semibold"
              >
                Istoric prompturi AI
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection(setariRef)}
                className="w-full text-left px-4 py-2 rounded-lg bg-[#F6F6F6] hover:bg-[#89AC46] hover:text-white transition font-semibold"
              >
                Setări cont
              </button>
            </li>
          </ul>
        </nav>

        {/* CONȚINUT PRINCIPAL */}
        <div className="flex-1">
          {/* Favorite */}
          <div ref={favRef}>
            <h1 className="text-2xl font-bold mb-4">Contul meu</h1>
            <h2 className="text-lg font-semibold mb-2">Locații favorite</h2>
            {loading && <p>Se încarcă...</p>}
            {errorMsg && <p className="text-red-600">{errorMsg}</p>}
            {!loading && !favorites.length && (
              <p>Nu ai locații favorite salvate.</p>
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
                    showFavorite={false} // IMPORTANT: nu afișa inimoara la favorite!
                  />
                  <button
                    onClick={() => handleDeleteFavorite(fav.id)}
                    className="absolute top-2 right-2 bg-[#FF8787] text-[#353935] hover:bg-[#ffb0b0] px-3 py-1 rounded text-xs font-semibold border border-[#FF8787] transition"
                  >
                    Șterge
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Istoric */}
          <div ref={histRef} className="mt-12">
            <h2 className="text-lg font-semibold mt-8 mb-2">Istoric prompturi AI</h2>
            {!loading && !history.length && (
              <p>Nu ai prompturi recente.</p>
            )}
            <ul className="flex flex-wrap gap-2">
              {history.map(h => (
                <li key={h.id} className="flex items-center bg-[#F6F6F6] rounded-full px-3 py-1 text-sm shadow">
                  <button
                    onClick={() => {
                      window.location.href = `/?query=${encodeURIComponent(h.query)}`;
                    }}
                    className="mr-2 text-[#353935] hover:underline bg-transparent border-none cursor-pointer"
                    title="Reia această căutare"
                  >
                    {h.query}
                  </button>
                  <button
                    onClick={() => handleDeleteHistory(h.id)}
                    className="ml-1 text-[#FF8787] text-lg bg-transparent border-none cursor-pointer"
                    title="Șterge"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Setări cont */}
          <div ref={setariRef} className="mt-12">
            <h2 className="text-lg font-semibold mb-2">Setări cont</h2>
            {/* Editează date personale */}
            <section className="mb-6">
              <h3 className="font-semibold mb-2">Editează email</h3>
              <form onSubmit={handleUpdateEmail} className="flex gap-2 items-center mb-2">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="px-3 py-2 border rounded"
                  placeholder="Email nou"
                  required
                />
                <button type="submit" className="bg-[#89AC46] text-white px-4 py-2 rounded hover:bg-[#6e8f32]">
                  Actualizează email
                </button>
              </form>
            </section>
            <section className="mb-6">
              <h3 className="font-semibold mb-2">Schimbă parola</h3>
              <form onSubmit={handleUpdatePassword} className="flex gap-2 items-center mb-2">
                <span className="relative inline-flex">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="px-3 py-2 border rounded pr-10"
                    placeholder="Parolă nouă"
                    required
                    style={{ minWidth: 180 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[#353935] bg-transparent border-none cursor-pointer"
                    tabIndex={-1}
                    aria-label={showPassword ? "Ascunde parola" : "Arată parola"}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </span>
                <button type="submit" className="bg-[#89AC46] text-white px-4 py-2 rounded hover:bg-[#6e8f32]">
                  Schimbă parola
                </button>
              </form>
            </section>
            {/* Mesaje info/eroare */}
            {infoMsg && <div className="mb-2 text-green-600">{infoMsg}</div>}
            {errorMsg && <div className="mb-2 text-red-600">{errorMsg}</div>}

            {/* Butoane principale */}
            <div className="flex gap-4 mt-6 mb-6">
              <button
                onClick={handleLogout}
                className="bg-[#FF8787] text-white px-4 py-2 rounded hover:bg-[#ffb0b0]"
              >
                Deconectare
              </button>
              <button
                onClick={() => setShowDeleteInfo(true)}
                className="bg-[#353935] text-white px-4 py-2 rounded hover:bg-[#6e8f32]"
              >
                Șterge contul
              </button>
            </div>
            {/* Modal/alert pentru ștergere cont */}
            {showDeleteInfo && (
              <div className="mt-4 p-4 bg-[#FFECEC] border border-[#FF8787] rounded">
                <p className="mb-2">
                  Pentru ștergerea contului, te rugăm să ne contactezi la adresa{" "}
                  <a href="mailto:contact@quickpick.ro" className="underline text-[#FF8787]">
                    contact@quickpick.ro
                  </a>.
                </p>
                <button
                  onClick={() => setShowDeleteInfo(false)}
                  className="bg-[#FF8787] text-[#353935] px-3 py-1 rounded hover:bg-[#ffb0b0]"
                >
                  Închide
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
