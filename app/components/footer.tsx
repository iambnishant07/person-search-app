export default function Footer() {
    const currentYear = new Date().getFullYear()
    return (
      <footer className="bg-gray-200 py-4 text-center">
        <p>&copy; {currentYear} Nishant Bhattarai. All rights reserved.</p>
      </footer>
    )
  }