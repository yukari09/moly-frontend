// src/components/layout/AppFooter.jsx
export default function AppFooter() {
  return (
    <footer className="border-t mt-12 py-8">
      <div className="container mx-auto text-center text-sm">
        <p>&copy; {new Date().getFullYear()} DayCal. All rights reserved.</p>
      </div>
    </footer>
  );
}
