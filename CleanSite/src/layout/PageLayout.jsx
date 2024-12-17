// src/components/layout/PageLayout.jsx
import Navbar from './Navbar';

const PageLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Navbar />
      <main className="pt-20 px-4">
        {children}
      </main>
    </div>
  );
};

export default PageLayout;