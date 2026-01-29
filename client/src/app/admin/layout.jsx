export const metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

import AdminNavbar from '../components/AdminNavbar';
import AdminBackground from './AdminBackground';

export default function AdminLayout({ children }) {
  return (
    <AdminBackground>
      <div className="print:hidden">
        <AdminNavbar />
      </div>
      {children}
    </AdminBackground>
  );
}
