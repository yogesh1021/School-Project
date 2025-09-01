
export default async function SchoolsPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/schools`, { cache: "no-store" });
  const schools = await res.json();

  return (
    <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {schools.map((s) => {
        const raw = (s.image_url ?? s.image ?? "").trim();
        const src = raw || "/placeholder.jpg"; // add a placeholder file in /public if you like
        return (
          <div key={s.id} className="border rounded-lg overflow-hidden shadow">
            <img src={src} alt={s.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h2 className="font-semibold text-lg line-clamp-1">{s.name}</h2>
              <p className="text-sm text-gray-600 line-clamp-2">{s.address}</p>
              <p className="mt-1 text-sm">{s.city}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
