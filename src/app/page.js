import Link from "next/link";


export default async function Home() {


  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-100">
   
      <header className="sticky top-0 bg-white/80 backdrop-blur border-b">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="font-semibold tracking-wide text-black">School</div>
        
        </div>
      </header>

     
      <section className="mx-auto max-w-6xl px-4 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight text-blue-400">
            Mini Project: Next.js + MySQL
          </h1>
          <p className="mt-4 text-slate-600">
            Two pages as per the assignment: a validated form to add schools and a
            product-style listing to browse them. Images are saved under
            <code className="mx-1 px-1 py-0.5 rounded bg-slate-100">/public/schoolImages</code>.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/add-school"
              className="inline-flex items-center justify-center rounded-lg bg-black text-white px-5 py-3 hover:opacity-50"
            >
              Add a School
            </Link>
            <Link
              href="/schools"
              className="inline-flex items-center justify-center rounded-lg  bg-black  text-white px-5 py-3 hover:opacity-50"
            >
              View Schools
            </Link>
          </div>

  
        </div>

     
      </section>

    </main>
  );
}



