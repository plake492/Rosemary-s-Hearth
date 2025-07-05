export default function Footer() {
  return (
    <footer className="bg-sage">
      <div className="container mx-auto py-4 text-center">
        <p className="text-sm text-brown-800">
          &copy; {new Date().getFullYear()} Rosemary's Hearth. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}
