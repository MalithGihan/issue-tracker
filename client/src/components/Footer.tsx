export default function Footer() {
  return (
    <footer className="border-t border-zinc-800">
      <div className="px-6 py-6 text-sm text-zinc-400">
        © {new Date().getFullYear()} Issue Tracker. All rights reserved.
      </div>
    </footer>
  );
}