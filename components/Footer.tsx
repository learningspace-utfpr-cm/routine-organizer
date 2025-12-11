export default function Footer() {
  return (
    <footer className="w-full mt-10 py-6 border-t bg-white">
      <div className="max-w-5xl mx-auto flex flex-col items-center text-center px-4 space-y-3">
        <p className="text-sm text-slate-600">
          © {new Date().getFullYear()} Rotinas Ilustradas – Objeto de
          Aprendizagem
        </p>

        <p className="text-sm text-slate-600">
          Este objeto de aprendizagem é licenciado sob{" "}
          <a
            href="https://creativecommons.org/licenses/by/4.0/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 underline hover:text-indigo-800"
          >
            CC BY 4.0 — Creative Commons Attribution 4.0 International
          </a>
          .
        </p>

        <a
          href="https://creativecommons.org/licenses/by/4.0/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2"
        >
          <img
            src="https://licensebuttons.net/l/by/4.0/88x31.png"
            alt="Licença Creative Commons BY 4.0"
            className="h-8"
          />
        </a>
      </div>
    </footer>
  );
}
